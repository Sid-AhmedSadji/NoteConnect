import { apiResponse } from '../utils/apiResponse.js';


const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    const status =
        statusCode >= 500 ? 'error' : 'fail';

    const message = err.message || 'An unexpected error occurred.';

    res.locals.errorName = err.name || 'Unexpected Error';

    apiResponse(res, statusCode, status, message);
};

export default errorHandler;
