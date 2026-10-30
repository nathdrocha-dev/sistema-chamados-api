const request = require("supertest");
const app = require("../src/app");
const pool = require("../src/database");
describe("Testes independentes de chamados", () => {
    let chamadoId;
    let bancoConfirmado = false;
    const dadosChamado = {
        titulo: "Chamado de teste independente",
        descricao: "Registro utilizado nos testes automatizados",
        solicitante: "Jest",
        categoria: "Software",
        prioridade: "Média"
    };
    beforeAll(async () => {
        const [linhas] = await pool.query(
            "SELECT DATABASE() AS banco"
        );
        if (linhas[0].banco !== "sistema_chamados_test") {
            throw new Error(
                "Banco incorreto! Testes interrompidos."
            );
        }
        bancoConfirmado = true;
    });
    beforeEach(async () => {
        if (!bancoConfirmado) {
            throw new Error("Banco de testes não confirmado.");
        }
        chamadoId = undefined;
        const resposta = await request(app)
            .post("/chamados")
            .send(dadosChamado);

        if (resposta.status !== 201) {
            throw new Error(
                `Falha ao preparar o teste: HTTP ${resposta.status}`
            );
        }
        chamadoId = resposta.body.chamado.id;
    });
    afterEach(async () => {
        if (bancoConfirmado && chamadoId !== undefined) {
            await pool.execute(
                "DELETE FROM chamados WHERE id = ?",
                [chamadoId]
            );

            chamadoId = undefined;
        }
    });
    test("GET - Deve consultar um chamado existente", async () => {
        const resposta = await request(app).get(`/chamados/${chamadoId}`);
        expect(resposta.status).toBe(200);
        expect(resposta.body.id).toBe(chamadoId);
    });
    test("PUT - Deve atualizar o status do chamado", async () => {
        const resposta = await request(app).put(`/chamados/${chamadoId}`).send({
                status: "Em andamento"
            });
        expect(resposta.status).toBe(200);
        expect(resposta.body.chamado.status).toBe("Em andamento");
    });
    test("PUT - Deve rejeitar um status inválido", async () => {
        const resposta = await request(app).put(`/chamados/${chamadoId}`).send({status: "Cancelado"});
        expect(resposta.status).toBe(400);
        expect(resposta.body).toHaveProperty("mensagem");
    });
    test("DELETE - Deve excluir um chamado existente", async () => {
        const resposta = await request(app).delete(`/chamados/${chamadoId}`);
        expect(resposta.status).toBe(200);
        const consulta = await request(app).get(`/chamados/${chamadoId}`);
        expect(consulta.status).toBe(404);
    });
    test("GET - Deve retornar 404 para ID inexistente", async () => {
        const resposta = await request(app).get("/chamados/999999999");
        expect(resposta.status).toBe(404);
    });
});
