// packages/proxy/index.js
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Logger, errorHandler, CustomError } from '@noteconnect/utils';
import config from './config/config.js';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import path from 'path';

const app = express();

// ---- Logger ----
Logger.init({
  app,
  logDir: config.LOG_DIR,
  env: config.NODE_ENV
});

// ---- Serve frontend static files ----
const frontendDist = config.FRONTEND_DIST;
console.log('Serving frontend from:', frontendDist);
app.use(express.static(frontendDist));

// ---- Proxy backend ----
app.use('/api', cors({ // CORS uniquement sur l'API
  origin: config.ALLOWED_ORIGINS,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}), createProxyMiddleware({
  target: config.BACKEND_URL,
  changeOrigin: true,
  pathRewrite: { '^/api': '' },
  onError: (err, req, res, next) => {
    next(new CustomError({
      statusCode: 503,
      name: 'Proxy Error',
      message: 'Le serveur backend ne répond pas.'
    }));
  }
}));

// ---- Fallback pour React Router ----
app.get('*', (req, res, next) => {
  // Si c'est une requête API, on ne sert pas index.html
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(frontendDist, 'index.html'));
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

// Important pour cookies Secure derrière un proxy
app.set('trust proxy', 1);

https.createServer(httpsOptions, app).listen(config.PROXY_PORT, () => {
  console.log(`🚀 Proxy + frontend HTTPS running on https://localhost:${config.PROXY_PORT}`);
});
