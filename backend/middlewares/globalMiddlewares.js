import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import express from 'express';
import session from './session.js';
import config from '../config/env.js';

const globalMiddlewares = (app) => {
    app.use(cors({
        origin: config.FRONTEND_IP,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    }));

    if (config.NODE_ENV === 'development') {
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

export default globalMiddlewares;