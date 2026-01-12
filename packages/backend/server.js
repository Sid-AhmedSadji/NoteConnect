import express from 'express';
import config from './config/env.js';
import globalMiddlewares from './middlewares/globalMiddlewares.js';
import { connectDB,closeDB } from './config/db.js';
import routes from './routes/index.js';
import https from 'https';
import fs from 'fs';

import {errorHandler,CustomError } from '@noteconnect/utils';

const app = express();
await connectDB();
const PORT = config.PORT;

globalMiddlewares(app);

app.use('/api', routes);


app.use((req, res, next) => {
    next(new CustomError({
        statusCode: 404,
        name: 'Not Found',
        message: 'The requested resource was not found.'
    }));
    
});
app.use(errorHandler);

const httpsOptions = {
    key: fs.readFileSync(config.HTTPS_KEY),
    cert: fs.readFileSync(config.HTTPS_CERT)
};
https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`HTTPS Server running on port ${PORT}`);
});

process.on('SIGINT', async () => {
    console.log('Closing MongoDB connection...');
    await closeDB();
    process.exit(0);
});

