const prioridadesValidas = ["Baixa", "Média", "Alta"];
const categoriasValidas = ["Hardware", "Rede", "Software", "Acesso", "Outro"];
const statusValidos = ["Em andamento", "Aberto", "Finalizado"];
const {criarChamadoService, atualizarChamadoService, deletarChamadoService, buscarTodosChamados, buscarChamadoPorIdService} = require("../services/chamados.service")
async function listarChamados(req, res){
    try{
        const {status, categoria, prioridade, pagina, limite} = req.query;
        const paginaNum = pagina === undefined ? 1 : Number(pagina);
        const limiteNum = limite === undefined ? 10 : Number(limite);
        if(!Number.isInteger(paginaNum) || paginaNum < 1){
            res.status(400).json({mensagem: "Página inválida"});
            return;
        }
        if(!Number.isInteger(limiteNum) || limiteNum < 1){
            res.status(400).json({mensagem: "Limite inválido. Informe um inteiro entre 1 e 100. "});
            return;
        }
        if(status && !statusValidos.includes(status)){
            res.status(400).json({mensagem: "Status inválido"});
            return;
        }
        if(categoria && !categoriasValidas.includes(categoria)){
            res.status(400).json({mensagem: "Categoria inválida"});
            return;
        }
        if(prioridade && !prioridadesValidas.includes(prioridade)){
            res.status(400).json({mensagem: "Prioridade inválida"});
            return;
        }
        const chamados = await buscarTodosChamados();
        const chamadosFiltrados = chamados.filter(chamado => (!status || chamado.status === status) && (!categoria || chamado.categoria === categoria) && (!prioridade || chamado.prioridade === prioridade));
        const totalChamados = chamadosFiltrados.length;
        const totalPaginas = Math.ceil(totalChamados / limiteNum);
        if(paginaNum > totalPaginas && totalChamados > 0){
            res.status(400).json({mensagem: "Página inválida"});
            return;
        }
        const inicio = (paginaNum - 1) * limiteNum;
        const fim = inicio + limiteNum;
        const chamadosPaginados = chamadosFiltrados.slice(inicio, fim);
        res.status(200).json({totalChamados, totalPaginas, pagina: paginaNum, limite: limiteNum, chamados: chamadosPaginados});
        res.setHeader("X-Total-Chamados", totalChamados);
        res.setHeader("X-Total-Paginas", totalPaginas);
        res.setHeader("X-Pagina-Atual", paginaNum);
        res.setHeader("X-Limite", limiteNum);
        return res.json(chamadosPaginados);
    } catch (erro) {
        console.error("Erro ao listar chamados:", erro);
        res.status(500).json({mensagem: "Erro ao listar chamados"});
    }
};
async function buscarChamadoPorId(req, res){
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
        console.error("Erro ao buscar chamado por ID:", erro);
        res.status(500).json({mensagem: "Erro interno ao buscar o chamado"});
    }
};
async function criarChamado(req, res){
    try{
        const chamado = await criarChamadoService(req.body);
        res.status(201).json({mensagem: "Chamado criado com sucesso", chamado});
    } catch(erro){
        if(erro.message === "Todos os campos são obrigatórios!" || erro.message === "Prioridade Inválida!" || erro.message === "Categoria Inválida!"){
            res.status(400).json({mensagem: erro.message});
        } else {
            res.status(500).json({mensagem: "Erro interno ao criar o chamado"});
        }
    }
};
async function atualizarChamado(req, res){
    try{
        const id = Number(req.params.id);
        if(!Number.isSafeInteger(id) || id <= 0){
            return res.status(400).json({mensagem: "ID inválido"});
        }
        const chamado = await atualizarChamadoService(id, req.body);
        res.status(200).json({ mensagem: "Chamado atualizado com sucesso", chamado});
    } catch (erro) {
        if(erro.message === "Chamado não encontrado"){
            res.status(404).json({mensagem: erro.message});
        }
        if(erro.message === "Status inválido"){
            res.status(400).json({mensagem: erro.message});
        }
        console.error("Erro ao atualizar chamado:", erro);
        res.status(500).json({mensagem: "Erro interno ao atualizar o chamado"});
    }
};
async function deletarChamado(req, res){
    try{
            const id = await Number(req.params.id);
            if(!Number.isSafeInteger(id) || id <= 0){
                return res.status(400).json({mensagem: "ID inválido"});
            }
            const chamado = await deletarChamadoService(id);
            res.status(200).json({ mensagem: `Chamado ${chamado.id} deletado com sucesso`, chamado});
    } catch (erro){
        if(erro.message === "Chamado não encontrado"){
            res.status(404).json({mensagem: erro.message});
        }
        console.error("Erro ao deletar chamado:", erro);
        res.status(500).json({mensagem: "Erro interno ao deletar o chamado"});
    }
}
module.exports = {listarChamados, buscarChamadoPorId, criarChamado, atualizarChamado, deletarChamado};