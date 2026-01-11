import express from 'express';
import config from './config/env.js';
import globalMiddlewares from './middlewares/globalMiddlewares.js';
import { closeDB } from './config/db.js';
import routes from './routes/index.js';

import {errorHandler,CustomError } from '@noteconnect/utils';

const app = express();
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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

process.on('SIGINT', async () => {
    console.log('Closing MongoDB connection...');
    await closeDB();
    process.exit(0);
});
