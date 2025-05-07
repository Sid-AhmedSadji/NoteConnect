import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import express from 'express';
import session from './session.js';
import config from '../config/env.js';

const globalMiddlewares = (app) => {

    app.use(cors({
        origin: (origin, callback) => {
            console.log("Incoming Origin:", origin);
            console.log("Allowed Frontend IPs:", config.FRONTEND_IP);
    
            if (!origin || config.FRONTEND_IP.includes(origin.trim())) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
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