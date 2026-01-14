import { MongoClient } from 'mongodb';
import config from './env.js';
import CustomError from '../../../utils/CustomError.js';

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
        console.error('❌ Erreur de connexion MongoDB:', error);

        throw new CustomError({
            statusCode: 500,
            name: 'Database Connection Error',
            message: 'Unable to connect to the database',
        });
    }
};

const closeDB = async () => {
    try {
        if (client) {
            await client.close();
            console.log('🔌 Déconnecté de MongoDB');
            client = null;
            database = null;
        }
    } catch (error) {
        console.error('❌ Erreur lors de la fermeture MongoDB:', error);
    }
};

export { connectDB, closeDB };
