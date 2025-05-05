import { MongoClient } from 'mongodb';
import config from './env.js';

let client;
let database;

const connectDB = async () => {
    try {
        if (!database) {
            client = new MongoClient(config.MONGO_URI);
            await client.connect();
            console.log('✅ Connecté à MongoDB');
            database = client.db(config.MONGO_DB_NAME);
        }
        return database;
    } catch (error) {
        console.error(`❌ Erreur de connexion MongoDB : ${error.message}`);
        process.exit(1);
    }
};

const closeDB = async () => {
    if (client) {
        await client.close();
        console.log('🔌 Déconnecté de MongoDB');
    }
};

export { connectDB, closeDB, database as getDb };