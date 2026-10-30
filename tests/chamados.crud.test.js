const request = require("supertest");
const app = require("../src/app");
const pool = require("../src/database");
describe("CRUD de Chamados - MySQL", () => {
    let chamadoId;
    let bancoConfirmado = false;

    const novoChamado = {
        titulo: "Teste automatizado",
        descricao: "Chamado criado pelo Jest e Supertest",
        solicitante: "Jest",
        categoria: "Software",
        prioridade: "Baixa"
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
    afterAll(async () => {
        // Remove o registro de teste caso algum teste falhe.
        if (bancoConfirmado && chamadoId !== undefined) {
            await pool.execute(
                "DELETE FROM chamados WHERE id = ?",
                [chamadoId]
            );
        }
    });
    test("POST - Deve criar um chamado", async () => {
        const resposta = await request(app)
            .post("/chamados")
            .send(novoChamado);

        expect(resposta.status).toBe(201);
        expect(resposta.body.chamado).toHaveProperty("id");
        expect(resposta.body.chamado.status).toBe("Aberto");

        chamadoId = resposta.body.chamado.id;
    });
    test("GET - Deve buscar o chamado criado", async () => {
        expect(chamadoId).toBeDefined();

        const resposta = await request(app)
            .get(`/chamados/${chamadoId}`);

        expect(resposta.status).toBe(200);
        expect(resposta.body.id).toBe(chamadoId);
        expect(resposta.body.titulo).toBe("Teste automatizado");
    });
    test("PUT - Deve atualizar o status", async () => {
        expect(chamadoId).toBeDefined();

        const resposta = await request(app)
            .put(`/chamados/${chamadoId}`)
            .send({
                status: "Em andamento"
            });

        expect(resposta.status).toBe(200);
        expect(resposta.body.chamado.status).toBe("Em andamento");
    });
    test("DELETE - Deve excluir o chamado", async () => {
        expect(chamadoId).toBeDefined();

        const resposta = await request(app)
            .delete(`/chamados/${chamadoId}`);

        expect(resposta.status).toBe(200);
    });
    test("GET - Deve retornar 404 após exclusão", async () => {
        expect(chamadoId).toBeDefined();

        const resposta = await request(app)
            .get(`/chamados/${chamadoId}`);

        expect(resposta.status).toBe(404);
    });
});