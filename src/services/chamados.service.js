const chamados = require("../data/chamados")
let proximoId = Math.max(...chamados.map(chamado => chamado.id)) + 1;
const prioridadesValidas = ["Baixa", "Média", "Alta"];
const categoriasValidas = ["Hardware", "Rede", "Software", "Acesso", "Outro"];
const statusValidos = ["Em andamento", "Aberto", "Finalizado"]
function criarChamadoService(dados){
    const {titulo, descricao, solicitante, categoria, prioridade} = dados;
    if(!titulo || !descricao || !solicitante || !categoria || !prioridade){
            throw new Error("Todos os campos são obrigatórios!")
        }
        if(!prioridadesValidas.includes(prioridade)){
            throw new Error("Prioridade Inválida!")
        }
        if(!categoriasValidas.includes(categoria)){
            throw new Error("Categoria Inválida!")
        }
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
        return novoChamado;
};
function atualizarChamadoService(id, dados){
    const idNumerico = Number(id);
    const {status} = dados;
    const chamado = chamados.find(c => c.id === idNumerico);
    if(!chamado){
       throw new Error("Chamado não encontrado");
    }
    if(!statusValidos.includes(status)){
        throw new Error("Status inválido");
    }
    chamado.status = status;
    return chamado;
}
function deletarChamadoService(id){
    const idNumerico = Number(id);
    const index = chamados.findIndex(c => c.id === idNumerico);
    if(index === -1){
        throw new Error("Chamado não encontrado");
    }
    const chamadoDeletado = chamados[index];
    chamados.splice(index, 1);
    return chamadoDeletado;
}
module.exports = {criarChamadoService, atualizarChamadoService, deletarChamadoService}
