const AppError = require("../errors/AppError");
function errorHandler(erro, req, res, next) {
    if (res.headersSent) {
        return next(erro);
    }
    if (erro instanceof AppError) {
        return res.status(erro.statusCode).json({mensagem: erro.message});
    }
    console.error("Erro interno:", erro);
    return res.status(500).json({mensagem: "Erro interno do servidor"});
}
module.exports = errorHandler;
