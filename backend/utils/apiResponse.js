export const apiResponse = (res, httpCode, status, message, data = null) => {
    res.status(httpCode).json({
        status,
        message,
        data
    });
};
