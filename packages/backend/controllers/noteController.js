import { connectDB } from '../config/db.js';
import config from '../config/env.js';
import { Note, Check } from '@noteconnect/models';
import { apiResponse, CustomError, getSchemaByDomain } from '@noteconnect/utils';

const collectionName = config.MONGO_NOTE_COLLECTION_NAME;
const checkCollectionName = 'Checks';

const errorMessages = {
  noteNotFound: 'Note not found',
};

/* ======================================================
   UTILS CHECK
====================================================== */

function extractChapter(url) {
  const schemaResult = getSchemaByDomain(url);

  if (!schemaResult) {
    return { method: null, chapter: null, error: 'Schema not found' };
  }

  const { schema } = schemaResult;

  if (schema.chapter.source === 'url') {
    for (const pattern of schema.chapter.patterns) {
      const match = url.match(pattern);
      if (match) {
        return { method: 'regex', chapter: match[1], error: null };
      }
    }
    return { method: 'regex', chapter: null, error: 'No regex match' };
  }

  if (schema.chapter.source === 'api') {
    return { method: 'api', chapter: null, error: 'API not implemented yet' };
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

  const chapterResult = extractChapter(note.link);
  const isDead = await checkLink(note.link);

  const durationMs = Date.now() - start;
  const domain = note.domain ?? new URL(note.link).hostname;

  return new Check({
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

async function upsertCheck(checksCollection, check) {
  await checksCollection.updateOne(
    { url: check.url },
    { $set: check },
    { upsert: true }
  );
}

/* ======================================================
   CONTROLLERS
====================================================== */

const getNotes = async (req, res, next) => {
  try {
    const client = await connectDB();
    const collection = client.collection(collectionName);

    const notes = await collection.find({ owner: req.ownerId }).toArray();
    apiResponse(res, 200, 'success', 'Notes fetched successfully', notes);
  } catch (error) {
    if (config.NODE_ENV === 'development') console.error(error);
    next(error);
  }
};

const createNote = async (req, res, next) => {
  try {
    const note = new Note({ ...req.body, owner: req.ownerId });
    const json = note.toJSON({ hidePassword: false });
    delete json._id;

    const client = await connectDB();
    const collection = client.collection(collectionName);

    const result = await collection.insertOne(json);

    if (!result?.insertedId) {
      throw new CustomError({
        statusCode: 500,
        name: 'Database Error',
        message: 'Failed to create note.',
      });
    }

    note._id = result.insertedId;

    apiResponse(res, 201, 'success', 'Note created successfully', note);
  } catch (error) {
    if (config.NODE_ENV === 'development') console.error(error);
    next(error);
  }
};

const deleteNote = async (req, res, next) => {
  try {
    const client = await connectDB();
    const collection = client.collection(collectionName);

    const result = await collection.deleteOne({
      _id: req.objectId,
      owner: req.ownerId,
    });

    if (result.deletedCount === 0) {
      throw new CustomError({
        statusCode: 404,
        name: 'Note Delete Error',
        message: errorMessages.noteNotFound,
      });
    }

    apiResponse(res, 200, 'success', 'Note deleted successfully');
  } catch (error) {
    if (config.NODE_ENV === 'development') console.error(error);
    next(error);
  }
};

const updateNote = async (req, res, next) => {
  try {
    const tempNote = new Note({ ...req.body, owner: req.ownerId });
    const updatedFields = tempNote.toJSON();
    delete updatedFields._id;

    const client = await connectDB();
    const notesCollection = client.collection(collectionName);
    const checksCollection = client.collection(checkCollectionName);

    const result = await notesCollection.findOneAndUpdate(
      { _id: req.objectId, owner: req.ownerId },
      { $set: updatedFields },
      { returnDocument: 'after' }
    );

    console.log('Updated note result:', result);

    if (!result) {
      throw new CustomError({
        statusCode: 404,
        name: 'Note Update Error',
        message: errorMessages.noteNotFound,
      });
    }

    // 🔁 CHECK AUTOMATIQUE APRÈS UPDATE
    const check = await buildCheckFromNote(result);
    await upsertCheck(checksCollection, check);

    apiResponse(res, 200, 'success', 'Note updated & checked successfully', {
      note: result//,
//      check,
    });
  } catch (error) {
    if (config.NODE_ENV === 'development') console.error(JSON.stringify(error));
    next(error);
  }
};

const calculNotes = async (req, res, next) => {
  try {
    const client = await connectDB();
    const collection = client.collection(collectionName);

    await collection.aggregate([
      { $match: { owner: req.ownerId } },
      {
        $addFields: {
          bonus_like: { $multiply: [25, { $cond: ['$liked', 1, 0] }] },
          bonus_modifications: {
            $multiply: [
              75,
              { $divide: [{ $ln: { $add: ['$modificationCount', 1] } }, Math.log(301)] },
            ],
          },
          malus_temps: {
            $min: [
              20,
              {
                $multiply: [
                  20,
                  { $divide: [{ $subtract: ['$$NOW', '$date'] }, 1000 * 60 * 60 * 24 * 30] },
                ],
              },
            ],
          },
        },
      },
      {
        $addFields: {
          note: {
            $round: [
              { $subtract: [{ $add: ['$bonus_like', '$bonus_modifications'] }, '$malus_temps'] },
              0,
            ],
          },
        },
      },
      { $addFields: { note: { $min: [100, '$note'] } } },
      {
        $merge: {
          into: collectionName,
          on: '_id',
          whenMatched: 'merge',
          whenNotMatched: 'discard',
        },
      },
    ]).toArray();

    const notes = await collection.find({ owner: req.ownerId }).toArray();
    apiResponse(res, 200, 'success', 'Notes calculées avec succès', notes);
  } catch (error) {
    if (config.NODE_ENV === 'development') console.error(error);
    next(error);
  }
};

const pingNotes = async (req, res, next) => {
  try {
    const client = await connectDB();
    const notesCollection = client.collection(collectionName);
    const checksCollection = client.collection(checkCollectionName);

    const notes = await notesCollection.find({}).toArray();

    const checks = await Promise.all(notes.map(buildCheckFromNote));

    const bulkOps = checks.map(check => ({
      updateOne: {
        filter: { url: check.url },
        update: { $set: check },
        upsert: true,
      },
    }));

    await checksCollection.bulkWrite(bulkOps);

    apiResponse(res, 200, 'success', 'Ping all done', checks);
  } catch (error) {
    if (config.NODE_ENV === 'development') console.error(error);
    next(error);
  }
};

export {
  getNotes,
  createNote,
  deleteNote,
  updateNote,
  calculNotes,
  pingNotes,
};
