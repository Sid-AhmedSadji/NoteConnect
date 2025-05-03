const { MongoClient } = require('mongodb');
const config = require('./env');

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

module.exports = {
    connectDB,
    closeDB,
    getDb: () => database
};
