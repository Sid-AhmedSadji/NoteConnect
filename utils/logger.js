import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

let initialized = false;

morgan.token('error-name', (req, res) => res.locals.errorName || '');
morgan.token('remote-addr', (req) => {
  let ip = req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress;
  return ip?.startsWith('::ffff:') ? ip.slice(7) : ip;
});

const Logger = {
  init({ app, logDir, env }) {
    if (initialized) return;
    initialized = true;

    if (env === 'production') {
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }

      const accessLogStream = fs.createWriteStream(
        path.join(logDir, '/access.log'),
        { flags: 'a' }
      );

      const prodFormat =
        '[:date[iso]] :remote-addr :method :url :status :response-time ms :error-name';

      app.use(morgan(prodFormat, { stream: accessLogStream }));
    } else {
      app.use(morgan((tokens, req, res) => {
        const status = Number(tokens.status(req, res));
        const time = new Date().toLocaleTimeString();

        const statusColor =
          status >= 500 ? chalk.red
          : status >= 400 ? chalk.yellow
          : status >= 300 ? chalk.cyan
          : chalk.green;

        return [
          chalk.gray(`[${time}]`),
          chalk.magenta(tokens['remote-addr'](req, res)),
          chalk.cyan.bold(tokens.method(req, res)),
          chalk.white(tokens.url(req, res)),
          statusColor(status),
          chalk.gray(tokens['response-time'](req, res) + ' ms'),
          res.locals.errorName
            ? chalk.red.bold(`- ${res.locals.errorName}`)
            : ''
        ].join(' ');
      }));
    }
  }
};

export default Logger;
