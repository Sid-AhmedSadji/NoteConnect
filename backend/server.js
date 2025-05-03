require('dotenv').config();
const express = require('express');
const config = require('./config/env');
const globalMiddlewares = require('./middlewares/globalMiddlewares');
const { closeDB } = require('./config/db');
const routes = require('./routes/index.js');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = config.PORT;

globalMiddlewares(app);

app.use('/api', routes);

app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
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