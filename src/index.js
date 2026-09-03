const express = require("express");
const app = express();
app.use(express.json());
const chamados = [{
    id: 1,
    titulo: "Computador não liga",
    descricao: "Computador não está ligando mais",
    solicitante: "Alberto",
    categoria: "Hardware",
    prioridade: "Média",
    status: "Aberto"
},
{
    id: 2,
    titulo: "Sem internet",
    descricao: "A internet parou de funcionar",
    solicitante: "Marta",
    categoria: "Rede",
    prioridade: "Baixa",
    status: "Aberto"
}];
app.get("/chamados", (req, res) => {
    res.json(chamados);
});
app.get("/chamados/:id", (req, res) => {
    const id = Number(req.params.id);
    const chamado = chamados.find(c => c.id === id);
    if(!chamado){
        return res.status(404).json({mensagem: "Chamado não encontrado"});
    }
    res.json(chamado);
});
app.get("/usuarios", (req, res) => {
    res.send("Lista de usuarios");
});
let proximoId = Math.max(...chamados.map(chamado => chamado.id)) + 1;
const prioridadesValidas = ["Baixa", "Média", "Alta"];
const categoriasValidas = ["Hardware", "Rede", "Software", "Acesso", "Outro"];
const statusValidos = ["Aberto", "Em andamento", "Finalizado"];
app.post("/chamados", (req, res) => {
    const {titulo, descricao, solicitante, categoria, prioridade} = req.body;
    if(!titulo || !descricao || !solicitante || !categoria || !prioridade){
        return res.status(404).json({mensagem: "Todos os campos são obrigatórios!"})
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
});
app.put("/chamados/:id", (req, res) => {
    const id = Number(req.params.id);
    const {status} = req.body;
    const chamado = chamados.find(c => c.id === id);
    if(!chamado){
        return res.status(404).json({mensagem: "Chamado não encontrado"});
    };
    if(!statusValidos.includes(status)){
        return res.status(404).json({mensagem: "Status inválido"})
    }
    chamado.status = status;
    res.status(200).json({ mensagem: "Chamado atualizado com sucesso"});
});
app.delete("/chamados/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = chamados.findIndex(c => c.id === id);
    if(index === -1){
        return res.status(404).json({mensagem: "Chamado não encontrado"});
    };
    chamados.splice(index, 1);
    res.status(200).json({ mensagem: `Chamado ${id} deletado com sucesso` });
});
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});