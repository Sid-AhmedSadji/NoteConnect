import session from 'express-session';
import config from '../config/env.js';
import MongoStore from 'connect-mongo';

const sessionConfig = {
  secret: config.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: config.MONGO_URI,
    ttl: config.COOKIES_MAX_AGE / 1000, 
    autoRemove: 'native'
  }),
  cookie: {
    httpOnly: true, 
    
    secure: config.NODE_ENV === 'production', 
    
    maxAge: config.COOKIES_MAX_AGE,
    
    sameSite: config.NODE_ENV === 'production' ? 'none' : 'lax'
  },
  proxy: config.NODE_ENV === 'production' 
};

export default session(sessionConfig);