const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const express = require('express');
const session = require('./session');
const config = require('../config/env');

const globalMiddlewares = (app) => {

        
    app.use(cors({
        origin: config.FRONTEND_IP,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    }));

    
    if ( config.NODE_ENV === 'development') {
        app.use((req, res, next) => {
            console.log(`Request: ${req.method} ${req.url}`);
            next();
        });
    }

    app.use(session);
    app.use(helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
    }));
    app.use(express.json());
    app.use(cookieParser());

};

module.exports = globalMiddlewares;