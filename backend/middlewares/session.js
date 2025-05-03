const session = require('express-session');
const config = require('../config/env');
const { parse } = require('dotenv');

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

module.exports = session(sessionConfig);