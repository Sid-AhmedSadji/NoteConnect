import session from 'express-session';
import config from '../config/env.js';
import { parse } from 'dotenv';

const sessionConfig = {
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: config.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: config.COOKIES_MAX_AGE
    },
};

export default session(sessionConfig);