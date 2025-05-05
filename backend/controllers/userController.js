import { connectDB } from '../config/db.js';
import config from '../config/env.js';
import { User } from 'models';
import CustomError from '../models/CustomError.js';
import bcrypt from 'bcrypt';

const collectionName = config.MONGO_USER_COLLECTION_NAME;

const errorMessages = {
    missingPassword: 'Password is required',
    invalidCredentials: 'Username or password is incorrect',
    userNotFound: 'User not found',
    userNotLoggedIn: 'User is not logged in',
};

const createUser = async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({ ...req.body, password: hashedPassword });

        const client = await connectDB();
        const collection = client.collection(collectionName);

        const existingUser = await collection.findOne({ username: user.username });
        if (existingUser) {
            throw new CustomError({
                statusCode: 409,
                name: 'User Creation Error',
                message: 'User with the provided username already exists.',
            });
        }

        const result = await collection.insertOne(user);
        if (!result || !result.insertedId) {
            throw new CustomError({
                statusCode: 500,
                name: 'Database Error',
                message: 'Failed to create user due to a database issue.',
            });
        }

        user._id= result.insertedId;

        res.status(201).json({
            message: 'User created successfully.',
            data: {
                _id: result.insertedId,
                user: user.toJSON({ hidePassword: true }),
            },
        });
    } catch (error) {
        if (config.NODE_ENV === 'development') console.error('Error creating user:', error);
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const objectId = req.objectId;
        const{username, password} = req.body;
        const newPassword = await bcrypt.hash(password, 10)


        const tempUser = new User({
            username: username,
            password: newPassword,
        });

        const updatedData = tempUser.toJSON({ hidePassword: false });
        delete updatedData._id;
        const client = await connectDB();
        const collection = client.collection(collectionName);

        const result = await collection.findOneAndUpdate(
            { _id: objectId },
            { $set: updatedData },
            { returnDocument: 'after' }
        );


        if (!result) {
            throw new CustomError({
                statusCode: 404,
                name: 'User Update Error',
                message: errorMessages.userNotFound,
            });
        }

        const updatedUser = result;
        if (req.session?.user) req.session.user = updatedUser;
        delete updatedUser.password;

        res.status(200).json({
            message: 'User updated successfully.',
            data: updatedUser,
        });
    } catch (error) {
        if (config.NODE_ENV === 'development') console.error('Error updating user:', error);
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const objectId = req.objectId;
        const client = await connectDB();
        const collection = client.collection(collectionName);

        const result = await collection.deleteOne({ _id: objectId });
        if (!result || result.deletedCount === 0) {
            throw new CustomError({
                statusCode: 404,
                name: 'User Delete Error',
                message: errorMessages.userNotFound,
            });
        }

        if (req.session) req.session.destroy();
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        if (config.NODE_ENV === 'development') console.error('Error deleting user:', error);
        next(error);
    }
};

const me = async (req, res, next) => {
    try {
        if (req.session?.user) {
            return res.status(200).json({ message: 'User logged in successfully', data: req.session.user });
        }
        throw new CustomError({
            statusCode: 401,
            name: 'Access Denied',
            message: errorMessages.userNotLoggedIn,
        });
    } catch (error) {
        if (config.NODE_ENV === 'development') console.error('Error getting user:', error);
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            throw new CustomError({
                statusCode: 400,
                name: 'Bad Request',
                message: 'Username and password are required',
            });
        }

        const client = await connectDB();
        const collection = client.collection(collectionName);

        const existingUser = await collection.findOne({ username });
        if (!existingUser || !(await bcrypt.compare(password, existingUser.password))) {
            throw new CustomError({
                statusCode: 401,
                name: 'Invalid credentials',
                message: errorMessages.invalidCredentials,
            });
        }
        
        delete existingUser.password;

        if (!req.session) req.session = {};
        req.session.user = existingUser;

        res.status(200).json({ message: 'User logged in successfully', data: existingUser });
    } catch (error) {
        if (config.NODE_ENV === 'development') console.error('Error during login:', error);
        next(error);
    }
};

const logout = async (req, res, next) => {
    try {
        if (req.session) {
            req.session.destroy();
        }
        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        if (config.NODE_ENV === 'development') console.error('Error during logout:', error);
        error.status = 500;
        next(error);
    }
};

const verifyPassword = async (req, res, next) => {
    try {
        const { password } = req.body;
        if (!password) {
            throw new CustomError({
                statusCode: 400,
                name: 'Bad Request',
                message: errorMessages.missingPassword,
            });
        }

        const username = req.session?.user?.username;
        if (!username) {
            throw new CustomError({
                statusCode: 401,
                name: 'Session Error',
                message: errorMessages.userNotLoggedIn,
            });
        }

        const client = await connectDB();
        const collection = client.collection(collectionName);
        const existingUser = await collection.findOne({ username });

        if (!existingUser || !(await bcrypt.compare(password, existingUser.password))) {
            throw new CustomError({
                statusCode: 401,
                name: 'Invalid credentials',
                message: errorMessages.invalidCredentials,
            });
        }

        res.status(200).json({ message: 'Password verified successfully' });
    } catch (error) {
        if (config.NODE_ENV === 'development') console.error('Error verifying password:', error);
        next(error);
    }
};

export {
    createUser,
    updateUser,
    deleteUser,
    me,
    login,
    logout,
    verifyPassword,
};
