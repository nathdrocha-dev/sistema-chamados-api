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
app.post("/chamados", (req, res) => {
    const {titulo, descricao, solicitante, categoria, prioridade} = req.body;
    let proximoId = Math.max(chamados.map(chamado => chamado.id)) + 1;
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
    res.json({
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
    chamado.status = status || "Em andamento";
    res.status(200).json({ mensagem: "Chamado atualiado com sucesso"});
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