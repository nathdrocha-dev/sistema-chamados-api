const express = require("express");
const chamadosRoutes = require("./routes/chamados.routes");
const errorHandler = require("./middlewares/errorHandler");
const app = express();
app.use(express.json());
app.use(chamadosRoutes);
app.use(errorHandler);
module.exports = app;
