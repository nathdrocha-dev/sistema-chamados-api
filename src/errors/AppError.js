class AppError extends Error {
    constructor(mensagem, statusCode) {
        super(mensagem);

        this.name = "AppError";
        this.statusCode = statusCode;
    }
}
module.exports = AppError;
