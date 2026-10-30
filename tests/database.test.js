const pool = require("../src/database");
describe("Banco de dados de testes", () => {
    test("Deve utilizar o banco de testes", async () => {
        const [linhas] = await pool.query(
            "SELECT DATABASE() AS banco"
        );

        expect(linhas[0].banco).toBe(
            "sistema_chamados_test"
        );
    });
    test("Deve encontrar a tabela chamados", async () => {
        const [linhas] = await pool.query(
            "SHOW TABLES LIKE 'chamados'"
        );
        expect(linhas).toHaveLength(1);
    });

});
