import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Logger, errorHandler, CustomError } from '@noteconnect/utils';
import config from './config/config.js';

const app = express();
const PORT = config.PORT;

Logger.init({
  app,
  logDir: config.LOG_DIR,
  env: config.NODE_ENV
});

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
