const request = require("supertest");
const app = require("../src/app");
describe("API de Chamados", () => {
    test("Deve rejeitar uma página inválida", async () => {
        const resposta = await request(app).get("/chamados?pagina=0");
        expect(resposta.status).toBe(400);
        expect(resposta.body).toHaveProperty("mensagem", "Página inválida");
    });
    test("Deve rejeitar um limite maior que 100", async () => {
        const resposta = await request(app).get("/chamados?limite=101");
        expect(resposta.status).toBe(400);
        expect(resposta.body).toHaveProperty("mensagem");
    });

});
