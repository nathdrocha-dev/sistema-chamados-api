const chamados = require("../data/chamados")
const prioridadesValidas = ["Baixa", "Média", "Alta"];
const categoriasValidas = ["Hardware", "Rede", "Software", "Acesso", "Outro"];
const statusValidos = ["Em andamento", "Aberto", "Finalizado"];
const {criarChamadoService, atualizarChamadoService, deletarChamadoService} = require("../services/chamados.service")
function listarChamados(req, res){
    const {status, prioridade, categoria} = req.query;
    if(!status && !prioridade && !categoria){
        return res.json(chamados);
    }
    if(status && !statusValidos.includes(status)){
        return res.status(400).json({mensagem: "Status inválido"});
    }
    if(prioridade && !prioridadesValidas.includes(prioridade)){
        return res.status(400).json({mensagem: "Prioridade inválida"});
    }
    if(categoria && !categoriasValidas.includes(categoria)){
        return res.status(400).json({mensagem: "Categoria inválida"});
    }
    const chamadosFiltrados = chamados.filter(c =>
    (!status || c.status === status) &&
    (!prioridade || c.prioridade === prioridade) &&
    (!categoria || c.categoria === categoria)
);
    res.json(chamadosFiltrados);
};
function buscarChamadoPorId(req, res){
    const id = Number(req.params.id);
    const chamado = chamados.find(c => c.id === id);
    if(!chamado){
        return res.status(404).json({mensagem: "Chamado não encontrado"});
    }
    res.json(chamado);
};
function criarChamado(req, res){
    try{
        const chamado = criarChamadoService(req.body);
        res.status(201).json({mensagem: "Chamado criado com sucesso", chamado});
    } catch(erro){
        res.status(400).json({mensagem: erro.message});
    }
};
function atualizarChamado(req, res){
    try{
        const chamado = atualizarChamadoService(req.params.id, req.body);
        res.status(200).json({ mensagem: "Chamado atualizado com sucesso", chamado});
    } catch (erro) {
        if(erro.message === "Chamado não encontrado"){
            res.status(404).json({mensagem: erro.message});
        } else {
            res.status(400).json({mensagem: erro.message});
        }
    }
};
function deletarChamado(req, res){
    try{
        const chamado = deletarChamadoService(req.params.id);
        res.status(200).json({ mensagem: `Chamado ${chamado.id} deletado com sucesso`, chamado});
    } catch (erro){
        res.status(404).json({mensagem: erro.message})
    }
}
module.exports = {listarChamados, buscarChamadoPorId, criarChamado, atualizarChamado, deletarChamado};