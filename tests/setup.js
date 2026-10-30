process.env.NODE_ENV = "test";
require("dotenv").config({
    path: ".env.test",
    override: true
});
if (process.env.DB_NAME !== "sistema_chamados_test") {
    throw new Error(
        "Os testes devem utilizar exclusivamente o banco sistema_chamados_test."
    );
}
