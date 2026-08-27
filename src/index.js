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
app.get("/usuarios", (req, res) => {
    res.send("Lista de usuarios");
});
app.post("/chamados", (req, res) => {
    const {titulo, descricao, solicitante, categoria, prioridade} = req.body;
    const novoChamado = {
        id: chamados.length + 1,
        titulo,
        descricao,
        solicitante,
        categoria,
        prioridade,
        status: "Aberto"
    };
    chamados.push(novoChamado);
    res.json(mensagem = "Chamado criado com sucesso!", novoChamado);
});
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});