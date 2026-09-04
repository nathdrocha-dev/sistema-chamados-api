const express = require("express");
const router = express.Router();
const {listarChamados, buscarChamadoPorId, criarChamado, atualizarChamado, deletarChamado} = require("../controllers/chamados.controller")
router.get("/chamados", listarChamados);
router.get("/chamados/:id", buscarChamadoPorId);
router.post("/chamados", criarChamado);
router.put("/chamados/:id", atualizarChamado);
router.delete("/chamados/:id", deletarChamado);
module.exports = router;