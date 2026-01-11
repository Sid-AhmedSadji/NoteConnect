import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import express from 'express';
import session from './session.js';
import config from '../config/env.js';
import {CustomError,Logger} from '@noteconnect/utils'; 
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const globalMiddlewares = (app) => {

    app.set('trust proxy', true)


    Logger(app, path.join(__dirname,'..', 'logs'), config.NODE_ENV);

    app.use(cors({
        origin: (origin, callback) => {
            if (!origin) {
                return callback(null, true);
            }
    
            const isAllowed = config.ALLOWED_ORIGINS.includes(origin.trim());
    
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