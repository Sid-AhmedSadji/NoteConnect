import dotenv from 'dotenv';

dotenv.config({quiet: true});

const requiredVars = [
    'BACKEND_URL',
    'FRONTEND_IP',
    'LOG_DIR',
    'HTTPS_KEY',
    'HTTPS_CERT'
];

requiredVars.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`❌ ${key} is not defined in the environment variables`);
    }
});



const config = {

    PORT: process.env.PROXY_PORT || 7001,
    NODE_ENV: process.env.NODE_ENV || 'development',
    LOG_DIR: process.env.LOG_DIR,
    
    BACKEND_TARGET: process.env.BACKEND_URL, 
    
    ALLOWED_ORIGINS: process.env.FRONTEND_IP ? process.env.FRONTEND_IP.split(',') : [],

    HTTPS_KEY: process.env.HTTPS_KEY,
    HTTPS_CERT: process.env.HTTPS_CERT
};

export default config;