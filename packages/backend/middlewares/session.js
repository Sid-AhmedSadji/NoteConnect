import session from 'express-session';
import config from '../config/env.js';
import MongoStore from 'connect-mongo';

const isProd = config.NODE_ENV === 'production';

const sessionConfig = {
  secret: config.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: config.MONGO_URI,
    ttl: config.COOKIES_MAX_AGE / 1000, 
    autoRemove: 'native'
  }),

  proxy: true, 
  
  cookie: {
    httpOnly: true, 
    secure: isProd, 
    maxAge: config.COOKIES_MAX_AGE,
    sameSite: isProd ? 'none' : 'lax'
  }
};

export default session(sessionConfig);