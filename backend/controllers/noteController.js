import { connectDB } from '../config/db.js';
import config from '../config/env.js';
import { Note } from 'models';
import CustomError from '../models/CustomError.js';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';


const collectionName = config.MONGO_NOTE_COLLECTION_NAME;

const errorMessages = {
    noteNotFound: 'Note not found',
};


const getNotes = async (req, res, next) => {
    try {
        const client = await connectDB();
        const collection = client.collection(collectionName);
        const notes = await collection.find({ owner: req.ownerId }).toArray();
        res.status(200).json({ message: 'Notes fetched successfully', data: notes });
    } catch (error) {
        if (config.NODE_ENV === 'development') console.error('Error fetching notes:', error);
        next(error);
    }
};


const createNote = async (req, res, next) => {
    try {
        const note = new Note({ ...req.body, owner: req.ownerId});
        const JSON = note.toJSON({ hidePassword: false });
        delete JSON._id;
        const client = await connectDB();
        const collection = client.collection(collectionName);
        const result = await collection.insertOne(JSON);
        if (!result || !result.insertedId) {
            throw new CustomError({
                statusCode: 500,
                name: 'Database Error',
                message: 'Failed to create note due to a database issue.'
            });
        }
        note._id = result.insertedId;
        res.status(201).json({ message: 'Note created successfully', _id: result.insertedId, data: note });
    } catch (error) {
        if (config.NODE_ENV === 'development') console.error('Error creating note:', error);
        next(error);
    }
};

const deleteNote = async (req, res, next) => {
    try {
        const objectId = req.objectId;
        const client = await connectDB();
        const collection = client.collection(collectionName);
        const result = await collection.deleteOne({ _id: objectId });
        if (!result || result.deletedCount === 0)
            throw new CustomError({
                statusCode: 404,
                name: 'Note Delete Error',
                message: errorMessages.noteNotFound
            });
        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        if (config.NODE_ENV === 'development') console.error('Error deleting note:', error);
        next(error);
    }
};

const updateNote = async (req, res, next) => {
    try {
        const objectId = req.objectId;
        const tempNote = new Note({ ...req.body, owner: req.ownerId });
        const updatedFields = tempNote.toJSON();
        delete updatedFields._id;
        const client = await connectDB();
        const collection = client.collection(collectionName);
        const result = await collection.updateOne({ _id: objectId }, { $set: updatedFields });
        if (!result || result.modifiedCount === 0)
            throw new CustomError({
                statusCode: 404,
                name: 'Note Update Error',
                message: errorMessages.noteNotFound
            });
        res.status(200).json({ message: 'Note updated successfully' });
    } catch (error) {
        if (config.NODE_ENV === 'development') console.error('Error updating note:', error);
        next(error);
    }
};

const calculNotes = async (req, res, next) => {
    try {
        const client = await connectDB();
        const collection = client.collection(collectionName);

         await collection.aggregate([
            {
                $match: { owner: req.ownerId }
              },
            {
                $addFields: {
                    bonus_like: { $multiply: [25, { $cond: ["$liked", 1, 0] }] },
                    bonus_modifications: { $multiply: [75, { $divide: [{ $ln: { $add: ["$modificationCount", 1] } }, Math.log(301)] }] },
                    malus_temps: {
                        $min: [
                            20,
                            { $multiply: [20, { $divide: [{ $subtract: ["$$NOW", "$date"] }, 1000 * 60 * 60 * 24 * 30] }] }
                        ]
                    }
                }
            },
            {
                $addFields: {
                    note: {
                        $round: [
                            { $subtract: [{ $add: ["$bonus_like", "$bonus_modifications"] }, "$malus_temps"] },
                            0
                        ]
                    }
                }
            },
            {
                $addFields: {
                    note: { $min: [100, "$note"] }
                }
            },
            {
                $project: {
                    _id: 1,
                    link: 1,
                    name: 1,
                    date: 1,
                    modificationCount: 1,
                    note: 1,
                    liked: 1,
                    owner: 1
                }
            },
            {
                $merge: {
                    into: collectionName,
                    on: "_id",
                    whenMatched: "merge",
                    whenNotMatched: "discard"
                }
            }
        ]).toArray();
          
        const response = await collection.find({ owner: req.ownerId }).toArray();

        res.status(200).json({ message: 'Notes calculées et mises à jour avec succès', data: response });
    } catch (error) {
        if (config.NODE_ENV === 'development') {
            console.error('Erreur lors du calcul des notes :', error);
        }
        next(error);
    }
};



const pingNotes = async (req, res, next) => {
    try {
        const client = await connectDB();
        const collection = client.collection(collectionName);
        const notes = await collection.find({ owner: req.session.user._id }).toArray();

        const linksDeads = [];

        await Promise.all(
            notes.map(async (note) => {
                if (note.isDead) return;
                
                const isDead = await checkLink(note.link);
                if (isDead) {
                    note.isDead = true;

                    await collection.updateOne({ _id: note._id }, { $set: { isDead: true } });
                    linksDeads.push(note);
                }
            })
        );

        res.status(200).json({ message: 'Ping all done', linksDeads });

    } catch (error) {
        if (config.NODE_ENV === 'development') console.error('Error pinging notes:', error);
        next(error);
    }
};

const checkLink = async (link) => {
    try {
        const response = await fetch(link, { method: 'HEAD', timeout: 5000 });

        if (response.ok) 
            return false;

        const deadStatuses = [404, 403, 410];
        if (deadStatuses.includes(response.status))
            throw new Error(`Link is dead, status: ${response.status}`);

        return false;
    } catch (error) {
        if (config.NODE_ENV === 'development') console.error('Error checking link:', error);
        return true;
    }
};

export { getNotes, createNote, deleteNote, updateNote, calculNotes, pingNotes };
