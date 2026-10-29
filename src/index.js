const express = require("express");
const errorHandler = require("./middlewares/errorHandler.js");
const chamadosRoutes = require("./routes/chamados.routes");
const app = express();
app.use(express.json());
app.use(chamadosRoutes);
app.use(errorHandler);
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});