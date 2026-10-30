const mysql = require("mysql2/promise");
const path = require("node:path");
const dotenv = require("dotenv");

const arquivoAmbiente = process.env.NODE_ENV === "test"
    ? ".env.test"
    : ".env";

dotenv.config({
    path: path.resolve(__dirname, "..", arquivoAmbiente),
    quiet: true
});

if (
    process.env.NODE_ENV === "test" &&
    process.env.DB_NAME !== "sistema_chamados_test"
) {
    throw new Error(
        "Os testes devem utilizar exclusivamente o banco sistema_chamados_test."
    );
}

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
