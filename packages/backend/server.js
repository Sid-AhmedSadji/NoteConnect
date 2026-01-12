import express from 'express';
import https from 'https';
import fs from 'fs';
import config from './config/env.js';
import globalMiddlewares from './middlewares/globalMiddlewares.js';
import { connectDB, closeDB } from './config/db.js';
import routes from './routes/index.js';
import { errorHandler, CustomError } from '@noteconnect/utils';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const app = express();

try {
    await connectDB();
} catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
}

const PORT = config.PORT || 5000;

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
    console.log(`[${new Date().toLocaleTimeString()}] 🚀 HTTPS Server running on port ${PORT}`);
});

process.on('SIGINT', async () => {
    console.log('\nClosing MongoDB connection...');
    await closeDB();
    console.log('MongoDB connection closed. Exiting.');
    process.exit(0);
});