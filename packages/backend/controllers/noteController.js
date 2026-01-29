import { connectDB } from '../config/db.js';
import config from '../config/env.js';
import { Note } from '@noteconnect/models';
import { apiResponse, CustomError, getSchemaByDomain } from '@noteconnect/utils';
import {buildCheckFromNote, upsertCheck} from './checkController.js'

const collectionName = config.MONGO_NOTE_COLLECTION_NAME;
const checkCollectionName = config.MONGO_CHECK_COLLECTION_NAME;

const errorMessages = {
  noteNotFound: 'Note not found',
};

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

    if (!result) {
      throw new CustomError({
        statusCode: 404,
        name: 'Note Update Error',
        message: errorMessages.noteNotFound,
      });
    }

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
    console.log(checks[0]);

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
