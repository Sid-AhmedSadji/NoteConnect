import express from 'express';
import config from './config/env.js';
import globalMiddlewares from './middlewares/globalMiddlewares.js';
import { connectDB, closeDB } from './config/db.js';
import routes from './routes/index.js';
import { errorHandler, CustomError } from '@noteconnect/utils';

const app = express();

try {
    await connectDB();
} catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
}

const PORT = config.PORT || 6050; // port interne pour Nginx

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

app.listen(PORT, () => {
    console.log(`[${new Date().toLocaleTimeString()}] 🚀 HTTP Server running on port ${PORT}`);
});

process.on('SIGINT', async () => {
    console.log('\nClosing MongoDB connection...');
    await closeDB();
    console.log('MongoDB connection closed. Exiting.');
    process.exit(0);
});
