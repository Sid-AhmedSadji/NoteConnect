import { ObjectId } from 'mongodb';
import CustomError from '../models/CustomError.js';

const validateObjectId = (req, res, next) => {
    try {
        if (!req.params.id) throw new CustomError({ statusCode: 400, name: 'Bad Request', message: 'A User ID is required in the request parameters.' });

        if (!ObjectId.isValid(req.params.id)) throw new CustomError({ statusCode: 400, name: 'Bad Request', message: 'The User ID provided is not in a valid format.' });

        req.objectId = new ObjectId(req.params.id);
        next();
    } catch (error) {
        next(error);
    }
};

const validateOwnerObjectId = (req, res, next) => {
    try {
        if (!req.session.user._id)
            throw new CustomError({ statusCode: 401, name: 'Access Denied', message: 'You must be logged in to access this resource. Please log in and try again.' });

        req.ownerId = new ObjectId(req.session.user._id);
        next();
    } catch (error) {
        next(error);
    }
};

export { validateObjectId, validateOwnerObjectId };