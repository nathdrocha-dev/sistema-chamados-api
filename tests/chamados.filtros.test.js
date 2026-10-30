
const request = require("supertest");
const app = require("../src/app");
const pool = require("../src/database");

describe("Filtros e paginação de chamados", () => {
    const idsCriados = [];
    let bancoConfirmado = false;

    beforeAll(async () => {
        const [linhas] = await pool.query(
            "SELECT DATABASE() AS banco"
        );

        if (linhas[0].banco !== "sistema_chamados_test") {
            throw new Error("Banco de testes incorreto!");
        }

        bancoConfirmado = true;

        const chamados = [
            {
                titulo: "Computador não liga",
                descricao: "Problema no computador",
                solicitante: "Ana",
                categoria: "Hardware",
                prioridade: "Alta"
            },
            {
                titulo: "Sem internet",
                descricao: "Problema na conexão",
                solicitante: "Carlos",
                categoria: "Rede",
                prioridade: "Baixa"
            },
            {
                titulo: "Erro no sistema",
                descricao: "Aplicação não abre",
                solicitante: "Maria",
                categoria: "Software",
                prioridade: "Alta"
            }
        ];

        for (const chamado of chamados) {
            const resposta = await request(app)
                .post("/chamados")
                .send(chamado);

            if (resposta.status !== 201) {
                throw new Error(
                    `Falha ao preparar teste: HTTP ${resposta.status}`
                );
            }

            idsCriados.push(resposta.body.chamado.id);
        }
    });

    afterAll(async () => {
        if (!bancoConfirmado) return;

        for (const id of idsCriados) {
            await pool.execute(
                "DELETE FROM chamados WHERE id = ?",
                [id]
            );
        }
    });

    test("Deve filtrar chamados por categoria", async () => {
        const resposta = await request(app)
            .get("/chamados?categoria=Hardware");

        expect(resposta.status).toBe(200);

        expect(
            resposta.body.chamados.some(
                chamado => chamado.id === idsCriados[0]
            )
        ).toBe(true);
    });

    test("Deve filtrar chamados por prioridade", async () => {
        const resposta = await request(app)
            .get("/chamados?prioridade=Alta");

        expect(resposta.status).toBe(200);

        expect(
            resposta.body.chamados.some(
                chamado => chamado.id === idsCriados[2]
            )
        ).toBe(true);
    });

    test("Deve combinar categoria e prioridade", async () => {
        const resposta = await request(app)
            .get("/chamados?categoria=Software&prioridade=Alta");

        expect(resposta.status).toBe(200);

        expect(
            resposta.body.chamados.some(
                chamado => chamado.id === idsCriados[2]
            )
        ).toBe(true);
    });

    test("Deve aplicar o limite da paginação", async () => {
        const resposta = await request(app)
            .get("/chamados?pagina=1&limite=2");

        expect(resposta.status).toBe(200);
        expect(resposta.body.chamados.length).toBeLessThanOrEqual(2);
        expect(resposta.body.limite).toBe(2);
    });

    test("Deve retornar erro para categoria inválida", async () => {
        const resposta = await request(app)
            .get("/chamados?categoria=Financeiro");

        expect(resposta.status).toBe(400);
    });

    test("Deve retornar erro para prioridade inválida", async () => {
        const resposta = await request(app)
            .get("/chamados?prioridade=Urgente");

        expect(resposta.status).toBe(400);
    });

    test("Deve retornar erro para status inválido", async () => {
        const resposta = await request(app)
            .get("/chamados?status=Cancelado");

        expect(resposta.status).toBe(400);
    });
});
