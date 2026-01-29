import { connectDB } from '../config/db.js';
import config from '../config/env.js';
import { Check } from '@noteconnect/models';
import { apiResponse, CustomError, getSchemaByDomain } from '@noteconnect/utils';

const checkCollectionName = config.MONGO_CHECK_COLLECTION_NAME;

// ======================================================
//    UTILS CHECK
// ======================================================
function extractId(url) {
  const schemaResult = getSchemaByDomain(url);

  if (!schemaResult) {
    return { id: null, error: 'Schema not found' };
  }

  const { schema } = schemaResult;

  if (!Array.isArray(schema.id)) {
    return { id: null, error: 'No ID patterns' };
  }

  for (const pattern of schema.id) {
    const match = url.match(pattern);
    if (match) {
      return { id: match[1], error: null };
    }
  }

  return { id: null, error: 'No ID match' };
}

function getByPath(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

async function extractChapter(url) {
  const schemaResult = getSchemaByDomain(url);

  if (!schemaResult) {
    return { method: null, chapter: null, error: 'Schema not found' };
  }

  const { schema } = schemaResult;

  if (schema.chapter.source === 'url' && Array.isArray(schema.chapter.patterns)) {
    for (const pattern of schema.chapter.patterns) {
      const match = url.match(pattern);
      if (match) {
        const raw = match[1];
        const chapter = isNaN(raw) ? raw : Number(raw);

        return { method: 'regex', chapter, error: null };
      }
    }
    return { method: 'regex', chapter: null, error: 'No regex match' };
  }

  if (schema.chapter.source === 'api') {
    const { id, error } = extractId(url);
    if (!id) {
      return { method: 'api', chapter: null, error };
    }

    const endpoint = schema.chapter.api.endpoint.replace('{id}', id);

    const response = await fetch(endpoint);
    if (!response.ok) {
      return { method: 'api', chapter: null, error: 'API request failed' };
    }

    const json = await response.json();

    const chapter = getByPath(json, schema.chapter.api.data);

    return {
      method: 'api',
      chapter: chapter ?? null,
      error: chapter ? null : 'Chapter not found in API response'
    };
  }

  return { method: null, chapter: null, error: 'Unknown method' };
}

async function checkLink(link) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(link, { method: 'HEAD', signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) return false;

    const deadStatuses = [404, 403, 410];
    return deadStatuses.includes(res.status);
  } catch {
    return true;
  }
}

async function buildCheckFromNote(note) {
  const start = Date.now();

  const chapterResult = await extractChapter(note.link);
  const isDead = await checkLink(note.link);

  const durationMs = Date.now() - start;
  const domain = note.domain ?? new URL(note.link).hostname;

  return new Check({
    name : note.name,
    url: note.link,
    domain,
    method: chapterResult.method,
    success: null,
    isDead,
    chapter: chapterResult.chapter,
    error: chapterResult.error,
    durationMs,
    createdAt: new Date(),
  }).toJSON();
}

async function updateCheck(check){

  const start = Date.now();
  
  const chapterResult = await extractChapter(check.url);
  const isDead = await checkLink(check.url);

  const durationMs = Date.now() - start;
  const domain = new URL(check.url).hostname;

  return new Check({
      ...check,
      domain,
      method: chapterResult.method,
      success: chapterResult.chapter ? "fail" : null,
      isDead,
      chapter: chapterResult.chapter,
      error: chapterResult.error,
      durationMs,
      createdAt: new Date(),
    }).toJSON() ;
}

async function upsertCheck(checksCollection, check) {
  await checksCollection.updateOne(
    { url: check.url },
    { $set: check },
    { upsert: true }
  );
}

// ======================================================
//    CONTROLLERS
// ====================================================== 


const getChecks = async (req, res, next) => {
  try {
    const client = await connectDB();
    const collection = client.collection(checkCollectionName);
    const checks = await collection.find().toArray();
    apiResponse(res, 200, 'success', 'Checks fetched successfully', checks);
  } catch (error) {
    if (config.NODE_ENV === 'development') console.error('Error fetching checks:', error);
    next(error);
  }
};

const getChecksPending = async (req, res, next) => {
  try {
    const client = await connectDB();
    const collection = client.collection(checkCollectionName);
    const checks = await collection.find({ success: null }).toArray();
    apiResponse(res, 200, 'success', 'Pending checks fetched successfully', checks);
  } catch (error) {
    if (config.NODE_ENV === 'development') console.error('Error fetching checks:', error);
    next(error);
  }
};

const validateCheck = async (req, res, next) => {
  try {
    const client = await connectDB();
    const collection = client.collection(checkCollectionName);
    const checkData = await collection.findOne({ _id: req.objectId });

    const success = req.body.success;
    if ( !success ) {
        throw new CustomError({
            statusCode: 400,
            name: 'Bad Request',
            message: 'Missing or invalid "success" field in request body'
        });
    }

    if (!checkData) {
        throw new CustomError({
            statusCode: 404,
            name: 'Not Found',
            message: 'Check not found'
        });
    }
    const check = new Check(checkData);
    await collection.updateOne({ _id: req.objectId }, { $set: { success: success } });
    apiResponse(res, 200, 'success', 'Check validated successfully', check);
    } catch (error) {
    if (config.NODE_ENV === 'development') console.error('Error validating check:', error);
    next(error);
    }
};

const actualiseCheck = async(req, res, next) => {
    try {
        const client =  await connectDB();
        const collection = client.collection(checkCollectionName);
        const checkData = await collection.findOne({ _id: req.objectId });

        const updatedCheck = await updateCheck(checkData);
        await upsertCheck(collection, updatedCheck);

        apiResponse(res, 200, 'success', 'Check updated successfully', updatedCheck);
    } catch (error) {
        if (config.NODE_ENV === 'development') console.error('Error updating check:', error);
        next(error);
    }
};

export { getChecks, validateCheck, getChecksPending,buildCheckFromNote, upsertCheck, actualiseCheck };