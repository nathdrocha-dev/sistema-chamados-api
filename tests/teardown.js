const pool = require("../src/database");

afterAll(async () => {
    await pool.end();
});