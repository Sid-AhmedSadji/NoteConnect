import dotenv from 'dotenv';

dotenv.config();

if (!process.env.MONGO_URI) 
    throw new Error('MONGO_URI is not defined in the environment variables');

if (!process.env.MONGO_DB_NAME)
    throw new Error('MONGO_DB_NAME is not defined in the environment variables');

if (!process.env.MONGO_USER_COLLECTION_NAME)
    throw new Error('MONGO_USER_COLLECTION_NAME is not defined in the environment variables');

if (!process.env.MONGO_NOTE_COLLECTION_NAME) 
    throw new Error('MONGO_NOTE_COLLECTION_NAME is not defined in the environment variables');

if (!process.env.FRONTEND_IP)
    throw new Error('FRONTEND_IP is not defined in the environment variables');

export default {
    PORT: process.env.PORT || 7000,
    NODE_ENV: process.env.NODE_ENV || 'developpement',
    SESSION_SECRET: process.env.SESSION_SECRET || 'defaultSecret',
    MONGO_URI: process.env.MONGO_URI,
    MONGO_DB_NAME: process.env.MONGO_DB_NAME,
    MONGO_USER_COLLECTION_NAME: process.env.MONGO_USER_COLLECTION_NAME,
    MONGO_NOTE_COLLECTION_NAME: process.env.MONGO_NOTE_COLLECTION_NAME,
    FRONTEND_IP: process.env.FRONTEND_IP.trim(),
    COOKIES_MAX_AGE: parseInt(process.env.COOKIES_MAX_AGE) || 24 * 60 * 60 * 1000
};