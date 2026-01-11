import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import config from '../config/env.js';
import { fileURLToPath } from 'url';
import chalk from 'chalk'; 

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Token pour l'erreur
morgan.token('error-name', (req, res) => res.locals.errorName || '');

const logger = (app) => {
    if (config.NODE_ENV === 'production') {
        const logsDir = path.join(__dirname, '../logs');
        if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);

        const accessLogStream = fs.createWriteStream(
            path.join(logsDir, 'access.log'), 
            { flags: 'a' }
        );
    
        const prodFormat = '[:date[iso]] :remote-addr - :method :url :status - :response-time ms - :error-name';
        app.use(morgan(prodFormat, { stream: accessLogStream }));

    } else {
        // --- MODE DÉVELOPPEMENT COLORÉ ---
        app.use(morgan((tokens, req, res) => {
            const status = tokens.status(req, res);
            
            // On crée une heure locale lisible (ex: 14:30:05)
            const time = new Date().toLocaleTimeString();

            const statusColor = status >= 500 ? chalk.red 
                              : status >= 400 ? chalk.yellow 
                              : status >= 300 ? chalk.cyan 
                              : chalk.green;

            return [
                chalk.gray(`[${time}]`), // Heure en gris
                chalk.cyan.bold(tokens.method(req, res)), 
                chalk.white(tokens.url(req, res)),
                statusColor(status),
                chalk.gray(tokens['response-time'](req, res) + ' ms'),
                res.locals.errorName ? chalk.red.bold(`- ${res.locals.errorName}`) : ''
            ].join(' ');
        }));
    }
};

export default logger;