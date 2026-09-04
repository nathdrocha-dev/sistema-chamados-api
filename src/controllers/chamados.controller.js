const chamados = require("../data/chamados")
let proximoId = Math.max(...chamados.map(chamado => chamado.id)) + 1;
const prioridadesValidas = ["Baixa", "Média", "Alta"];
const categoriasValidas = ["Hardware", "Rede", "Software", "Acesso", "Outro"];
const statusValidos = ["Aberto", "Em andamento", "Finalizado"];
function listarChamados(req, res){
    res.json(chamados)
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
    const {titulo, descricao, solicitante, categoria, prioridade} = req.body;
    if(!titulo || !descricao || !solicitante || !categoria || !prioridade){
        return res.status(400).json({mensagem: "Todos os campos são obrigatórios!"})
    } else if (!prioridadesValidas.includes(prioridade)){
        return res.status(400).json({mensagem: "Prioridade Inválida"})
    } else if(!categoriasValidas.includes(categoria)){
        return res.status(400).json({mensagem: "Categoria Inválida"})
    };
    const novoChamado = {
    id: proximoId,
    titulo,
    descricao,
    solicitante,
    categoria,
    prioridade,
    status: "Aberto"
    };
    chamados.push(novoChamado);
    proximoId++;
    res.status(201).json({
        mensagem: "Chamado criado com sucesso",
        chamado: novoChamado
    });
};
function atualizarChamado(req, res){
    const id = Number(req.params.id);
    const {status} = req.body;
    const chamado = chamados.find(c => c.id === id);
    if(!chamado){
        return res.status(404).json({mensagem: "Chamado não encontrado"});
    };
    if(!statusValidos.includes(status)){
        return res.status(400).json({mensagem: "Status inválido"})
    }
    chamado.status = status;
    res.status(200).json({ mensagem: "Chamado atualizado com sucesso"});
};
function deletarChamado(req, res){
    const id = Number(req.params.id);
    const index = chamados.findIndex(c => c.id === id);
    if(index === -1){
        return res.status(404).json({mensagem: "Chamado não encontrado"});
    };
    chamados.splice(index, 1);
    res.status(200).json({ mensagem: `Chamado ${id} deletado com sucesso` });
}
module.exports = {listarChamados, buscarChamadoPorId, criarChamado, atualizarChamado, deletarChamado};