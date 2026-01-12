import express from 'express';
import https from 'https';
import fs from 'fs';
import path from 'path';
import config from './config/env.js';
import globalMiddlewares from './middlewares/globalMiddlewares.js';
import { connectDB, closeDB } from './config/db.js';
import routes from './routes/index.js';
import { errorHandler, CustomError } from '@noteconnect/utils';

// INDISPENSABLE pour les certificats auto-signés en développement/test
// Cela permet à Node d'accepter les connexions HTTPS non certifiées par une autorité officielle
if (config.NODE_ENV === 'production') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const app = express();

// Connexion à la base de données
try {
    await connectDB();
} catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
}

const PORT = config.PORT || 5000;

// Configuration des middlewares (CORS, Logger, Session, etc.)
globalMiddlewares(app);

// Définition des routes
app.use('/api', routes);

// Gestion des routes non trouvées (404)
app.use((req, res, next) => {
    next(new CustomError({
        statusCode: 404,
        name: 'Not Found',
        message: 'The requested resource was not found.'
    }));
});

// Middleware de gestion d'erreurs global
app.use(errorHandler);

// Configuration HTTPS avec certificats auto-signés
try {
    // Vérification de l'existence des fichiers avant lecture
    if (!fs.existsSync(config.HTTPS_KEY) || !fs.existsSync(config.HTTPS_CERT)) {
        throw new Error(`Certificats introuvables aux chemins suivants :\nKEY: ${config.HTTPS_KEY}\nCERT: ${config.HTTPS_CERT}`);
    }

    const httpsOptions = {
        key: fs.readFileSync(config.HTTPS_KEY),
        cert: fs.readFileSync(config.HTTPS_CERT)
    };

    https.createServer(httpsOptions, app).listen(PORT, () => {
        console.log(`[${new Date().toLocaleTimeString()}] 🚀 HTTPS Server running on port ${PORT}`);
        console.log(`[MODE] ${config.NODE_ENV}`);
    });

} catch (error) {
    console.error('❌ Impossible de démarrer le serveur HTTPS :');
    console.error(error.message);
    process.exit(1);
}

// Gestion de la fermeture propre (Graceful Shutdown)
process.on('SIGINT', async () => {
    console.log('\nClosing MongoDB connection...');
    await closeDB();
    console.log('MongoDB connection closed. Exiting.');
    process.exit(0);
});