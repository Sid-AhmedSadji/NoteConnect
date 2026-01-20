import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const requiredVars = [
    'MONGO_URI',
    'MONGO_DB_NAME',
    'MONGO_USER_COLLECTION_NAME',
    'MONGO_NOTE_COLLECTION_NAME',
    'FRONTEND_IP',
    'VAR_DIR',
    'HTTPS_KEY',
    'HTTPS_CERT',

];

requiredVars.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`❌ ${key} is not defined in the environment variables`);
    }
});

export default {
    PORT: process.env.PORT || 7000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    SESSION_SECRET: process.env.SESSION_SECRET || 'defaultSecret',
    VAR_DIR: process.env.VAR_DIR,
    LOG_DIR: process.env.LOG_DIR || path.join(process.env.VAR_DIR, 'logs/backend'),

    MONGO_URI: process.env.MONGO_URI,
    MONGO_DB_NAME: process.env.MONGO_DB_NAME,
    MONGO_USER_COLLECTION_NAME: process.env.MONGO_USER_COLLECTION_NAME,
    MONGO_NOTE_COLLECTION_NAME: process.env.MONGO_NOTE_COLLECTION_NAME,

    ALLOWED_ORIGINS: process.env.FRONTEND_IP.split(','),
    COOKIES_MAX_AGE: Number(process.env.COOKIES_MAX_AGE) || 24 * 60 * 60 * 1000,

    HTTPS_KEY: process.env.HTTPS_KEY,
    HTTPS_CERT: process.env.HTTPS_CERT,
};
