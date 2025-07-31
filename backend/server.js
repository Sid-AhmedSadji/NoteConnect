import 'dotenv/config';
import express from 'express';
import config from './config/env.js';
import globalMiddlewares from './middlewares/globalMiddlewares.js';
import { closeDB } from './config/db.js';
import routes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';

import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const PORT = config.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const clientBuildPath = path.join(__dirname, '../frontend/dist');

globalMiddlewares(app);

app.use('/api', routes);

app.use(express.static(clientBuildPath));

app.get('*name', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
});

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
