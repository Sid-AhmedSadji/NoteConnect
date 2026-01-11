import dotenv from 'dotenv';

dotenv.config({quiet: true});

const requiredVars = [
    'BACKEND_URL',
    'FRONTEND_IP'
];

requiredVars.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`❌ ${key} is not defined in the environment variables`);
    }
});



const config = {

    PORT: process.env.PROXY_PORT || 6000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    
    BACKEND_TARGET: process.env.BACKEND_URL, 
    
    ALLOWED_ORIGINS: process.env.FRONTEND_IP ? process.env.FRONTEND_IP.split(',') : []
};

export default config;