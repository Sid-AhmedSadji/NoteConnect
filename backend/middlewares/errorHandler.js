const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const name = err.name || 'InternalServerError';
    const message = err.message || 'An unexpected error occurred.';

    if (process.env.NODE_ENV !== 'production') {
        console.error(`[${statusCode}] ${name}: ${message}`);
    }

    res.status(statusCode).json({
        error: name,
        message
    });
}; 

module.exports = errorHandler