class CustomError extends Error {
    constructor({ statusCode = 500, name = 'Error', message = 'An error occurred' }) {
        super(message);
        this.statusCode = statusCode; // Utilise statusCode ici aussi
        this.name = name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default CustomError;