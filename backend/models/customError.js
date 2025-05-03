class CustomError extends Error {
    constructor({statusCode = 500,name = 'Error', message = 'An error occurred' }) {
        super(message);
        this.status = statusCode;
        this.name = name;
        this.stack = '';
    }
}

module.exports = CustomError;