import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import express from 'express';
import session from './session.js';
import config from '../config/env.js';
import CustomError from '../models/CustomError.js'; 
import logger from './logger.js';


const globalMiddlewares = (app) => {

    app.set('trust proxy', true)


    logger(app);

    app.use(cors({
        origin: (origin, callback) => {
            if (!origin) {
                return callback(null, true);
            }
    
            const isAllowed = config.FRONTEND_IP.includes(origin.trim());
    
            if (isAllowed) {
                callback(null, true);
            } else {
                   callback(new CustomError({
                    statusCode: 403,
                    name: 'CORS Error',
                    message: `Origin ${origin} not allowed by CORS policy.`
                }));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));  

    if (config.NODE_ENV === 'production') {
        app.use((req, res, next) => {
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