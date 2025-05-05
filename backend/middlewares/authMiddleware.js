import CustomError from '../models/CustomError.js';

const authMiddleware = (req, res, next) => {
  if (req.session?.user) {
    return next();
  }

  console.warn('Unauthorized access attempt.');

  const error = new CustomError({
    statusCode: 401,
    name: 'Access Denied',
    message: 'You must be logged in to access this resource. Please log in and try again.'
  });

  return next(error);
};

export default authMiddleware;
