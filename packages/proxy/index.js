import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Logger, errorHandler, CustomError } from '@noteconnect/utils';
import config from './config/config.js';
import cors from 'cors';

const app = express();
const PORT = config.PORT;

Logger.init({
  app,
  logDir: config.LOG_DIR,
  env: config.NODE_ENV
});

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

app.get('/status', (req, res) => res.send('Proxy is running'));

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

app.use((req, res, next) => {
  next(new CustomError({
    statusCode: 404,
    name: 'Not Found',
    message: 'The requested resource was not found.'
  }));
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
