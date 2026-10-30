const AppError = require("../errors/AppError");
const {PRIORIDADES_VALIDAS, CATEGORIAS_VALIDAS, STATUS_VALIDOS
} = require("../constants/chamados.constants");
function validarTexto(valor, campo, tamanhoMaximo = null) {
    if (typeof valor !== "string" || valor.trim() === "") {
        throw new AppError(`O campo ${campo} deve ser um texto válido.`, 400);
    }
    const texto = valor.trim();
    if (tamanhoMaximo !== null && texto.length > tamanhoMaximo) {
        throw new AppError(`O campo ${campo} deve ter no máximo ${tamanhoMaximo} caracteres.`, 400);
    }
    return texto;
}
function validarCriacaoChamado(dados) {
    if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
        throw new AppError("Corpo da requisição inválido.", 400);
    }
    const titulo = validarTexto(dados.titulo, "titulo", 150);
    const descricao = validarTexto(dados.descricao, "descricao");
    const solicitante = validarTexto(dados.solicitante, "solicitante", 100);
    const categoria = validarTexto(dados.categoria, "categoria");
    const prioridade = validarTexto(dados.prioridade, "prioridade");
    if (!CATEGORIAS_VALIDAS.includes(categoria)) {
        throw new AppError("Categoria inválida!", 400);
    }
    if (!PRIORIDADES_VALIDAS.includes(prioridade)) {
        throw new AppError("Prioridade inválida!", 400);
    }
    return {
        titulo,
        descricao,
        solicitante,
        categoria,
        prioridade
    };
}
function validarAtualizacaoChamado(dados) {
    if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
        throw new AppError("Corpo da requisição inválido.", 400);
    }
    const status = validarTexto(dados.status, "status");
    if (!STATUS_VALIDOS.includes(status)) {
        throw new AppError("Status inválido", 400);
    }
    return { status };
}
module.exports = {validarCriacaoChamado, validarAtualizacaoChamado};
