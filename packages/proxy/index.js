import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Logger, errorHandler, CustomError } from '@noteconnect/utils';
import config from './config/config.js';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = config.PROXY_PORT || 7000;

// ---- Logger ----
Logger.init({
  app,
  logDir: config.LOG_DIR,
  env: config.NODE_ENV
});

// ---- CORS ----
app.use(cors({
  origin: (origin, callback) => {
    // Autoriser les requêtes sans origin (ex: Postman)
    if (!origin) return callback(null, true);

    const isAllowed = config.FRONTEND_IP.includes(origin.trim());
    if (isAllowed) return callback(null, true);

    return callback(new CustomError({
      statusCode: 403,
      name: 'CORS Error',
      message: `Origin ${origin} not allowed by CORS policy.`
    }));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Important pour cookies Secure derrière un proxy HTTPS
app.set('trust proxy', 1);

// ---- Serve frontend static files ----
const frontendDist = config.FRONTEND_DIST; // ex: /home/freebox/NoteConnect/frontend/dist
app.use(express.static(frontendDist));

// ---- Proxy backend ----
app.use('/proxy', createProxyMiddleware({
  target: config.BACKEND_TARGET,
  changeOrigin: true,
  pathRewrite: { '^/proxy': '' },
  onError: (err, req, res, next) => {
    next(new CustomError({
      statusCode: 503,
      name: 'Proxy Error',
      message: 'Le serveur backend ne répond pas.'
    }));
  }
}));

// ---- Fallback pour React Router ----
app.use((req, res, next) => {
  // Laisse passer toutes les routes du proxy
  if (req.path.startsWith('/proxy')) return next();

  res.sendFile(path.join(frontendDist, 'index.html'), err => {
    if (err) next(err);
  });
});

// ---- 404 handler ----
app.use((req, res, next) => {
  next(new CustomError({
    statusCode: 404,
    name: 'Not Found',
    message: 'The requested resource was not found.'
  }));
});

// ---- Error handler ----
app.use(errorHandler);

// ---- HTTPS server ----
const httpsOptions = {
  key: fs.readFileSync(config.HTTPS_KEY),
  cert: fs.readFileSync(config.HTTPS_CERT)
};

https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`🚀 Proxy + frontend HTTPS running on https://localhost:${PORT}`);
});
