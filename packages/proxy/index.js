import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Logger, errorHandler, CustomError } from '@noteconnect/utils';
import config from './config/config.js'; 
import path from 'path';

const app = express();
const PORT = config.PORT;

Logger(app, path.join(process.cwd(), 'logs'), config.NODE_ENV);

app.get('/status', (req, res) => res.send('Proxy is running'));

app.use('/proxy', createProxyMiddleware({
    target: config.BACKEND_TARGET,
    changeOrigin: true,
    pathRewrite: { '^/proxy': '/api' }, 
    onError: (err, req, res) => {
        errorHandler(new CustomError("Le serveur backend ne répond pas.", 503), req, res);
    }
}));

app.use(errorHandler);

app.listen(config.PORT, () => console.log(`Proxy on ${config.PORT}`));