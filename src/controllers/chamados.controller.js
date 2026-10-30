const {PRIORIDADES_VALIDAS, CATEGORIAS_VALIDAS, STATUS_VALIDOS} = require("../constants/chamados.constants");
const AppError = require("../errors/AppError");
const {criarChamadoService, atualizarChamadoService, deletarChamadoService, buscarTodosChamados, buscarChamadoPorIdService} = require("../services/chamados.service")
async function listarChamados(req, res, next) {
    try {
        const {status, categoria, prioridade, pagina, limite} = req.query;
        const paginaNum = pagina === undefined ? 1 : Number(pagina);
        const limiteNum = limite === undefined ? 10 : Number(limite);
        if (!Number.isSafeInteger(paginaNum) || paginaNum < 1) {
            return res.status(400).json({mensagem: "Página inválida"});
        }
        if (!Number.isSafeInteger(limiteNum) || limiteNum < 1 || limiteNum > 100) {
            return res.status(400).json({mensagem: "Limite inválido. Informe um inteiro entre 1 e 100."});
        }
        if (status && !STATUS_VALIDOS.includes(status)) {
            return res.status(400).json({mensagem: "Status inválido"});
        }
        if (categoria && !CATEGORIAS_VALIDAS.includes(categoria)) {
            return res.status(400).json({mensagem: "Categoria inválida"});
        }
        if (prioridade && !PRIORIDADES_VALIDAS.includes(prioridade)) {
            return res.status(400).json({mensagem: "Prioridade inválida"});
        }
        const { chamados, totalChamados } = await buscarTodosChamados({ status, categoria, prioridade, pagina: paginaNum, limite: limiteNum
        });
        const totalPaginas = Math.ceil(totalChamados / limiteNum);
        if (paginaNum > totalPaginas && totalChamados > 0) {
            return res.status(400).json({mensagem: "Página inválida"});
        }
        res.setHeader("X-Total-Chamados", String(totalChamados));
        res.setHeader("X-Total-Paginas", String(totalPaginas));
        res.setHeader("X-Pagina-Atual", String(paginaNum));
        res.setHeader("X-Chamados-Por-Pagina", String(limiteNum));
        return res.status(200).json({totalChamados, totalPaginas, pagina: paginaNum, limite: limiteNum, chamados});
    } catch (erro) {
        return next(erro);
    }
}

async function buscarChamadoPorId(req, res, next){
    try{
        const id = Number(req.params.id);
        if(!Number.isSafeInteger(id) || id <= 0){
            return res.status(400).json({mensagem: "ID inválido"});
        }
        const chamado = await buscarChamadoPorIdService(id);
        if(!chamado){
            return res.status(404).json({mensagem: "Chamado não encontrado"});
        }
        res.json(chamado);
    } catch(erro){
        return next(erro);
    }
};
async function criarChamado(req, res, next){
    try{
        const chamado = await criarChamadoService(req.body);
        res.status(201).json({mensagem: "Chamado criado com sucesso", chamado});
    } catch(erro){
        return next(erro);
    }
};
async function atualizarChamado(req, res, next){
    try{
        const id = Number(req.params.id);
        if(!Number.isSafeInteger(id) || id <= 0){
            return res.status(400).json({mensagem: "ID inválido"});
        }
        const chamado = await atualizarChamadoService(id, req.body);
        res.status(200).json({ mensagem: "Chamado atualizado com sucesso", chamado});
    } catch (erro) {
        return next(erro);
    }
};
async function deletarChamado(req, res, next){
    try{
            const id = Number(req.params.id);
            if(!Number.isSafeInteger(id) || id <= 0){
                return res.status(400).json({mensagem: "ID inválido"});
            }
            const chamado = await deletarChamadoService(id);
            res.status(200).json({ mensagem: `Chamado ${chamado.id} deletado com sucesso`, chamado});
    } catch (erro){
        return next(erro);
    }
}
module.exports = {listarChamados, buscarChamadoPorId, criarChamado, atualizarChamado, deletarChamado};