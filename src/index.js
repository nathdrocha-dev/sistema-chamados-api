const express = require("express");
const chamadosRoutes = require("./routes/chamados.routes");
const app = express();
app.use(express.json());
app.use(chamadosRoutes);
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});