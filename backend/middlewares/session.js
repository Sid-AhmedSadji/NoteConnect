import session from 'express-session';
import config from '../config/env.js';
import MongoStore from 'connect-mongo';

const sessionConfig = {
  secret: config.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: config.MONGO_URI,
    ttl: 14 * 24 * 60 * 60,
  }),
  cookie: {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: config.COOKIES_MAX_AGE,
    sameSite: 'None',
  },
};

export default session(sessionConfig);
