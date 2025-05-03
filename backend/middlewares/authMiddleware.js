const CustomError = require('../models/CustomError');

const isAuthenticated = (req, res, next) => {
  try{
    if (req.session && req.session.user) {
      next();
    } else {
        console.error("Unauthorized access attempt.");
        throw new CustomError({statusCode:401, name:`Access Denied.`,message:'You must be logged in to access this resource. Please log in and try again.'});
    }
  } catch (error) {
    next(error);
  }
};

module.exports = isAuthenticated