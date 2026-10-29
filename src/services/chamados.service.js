const {PRIORIDADES_VALIDAS, CATEGORIAS_VALIDAS, STATUS_VALIDOS} = require("../constants/chamados.constants");
const AppError = require("../errors/AppError");
async function criarChamadoService(dados){
    const {titulo, descricao, solicitante, categoria, prioridade} = dados;
    if(!titulo || !descricao || !solicitante || !categoria || !prioridade){
            throw new AppError("Todos os campos são obrigatórios!", 400);
        }
        if(!PRIORIDADES_VALIDAS.includes(prioridade)){
            throw new AppError("Prioridade Inválida!", 400);
        }
        if(!CATEGORIAS_VALIDAS.includes(categoria)){
            throw new AppError("Categoria Inválida!", 400);
        }
        const [resultado] = await pool.query(`
            INSERT INTO chamados (titulo, descricao, solicitante, categoria, prioridade, status)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [titulo, descricao, solicitante, categoria, prioridade, "Aberto"]);
        const [linhas] = await pool.execute(`SELECT * FROM chamados WHERE id = ?`, [resultado.insertId]);
        return linhas[0];
};
async function atualizarChamadoService(id, dados){
    const idNumerico = Number(id);
    const {status} = dados;
    const chamado = await buscarChamadoPorIdService(idNumerico);
    if(!chamado){
       throw new AppError("Chamado não encontrado", 404);
    }
    if(!STATUS_VALIDOS.includes(status)){
        throw new AppError("Status inválido", 400);
    }
    await pool.execute(`UPDATE chamados SET status = ? WHERE id = ?`, [status, idNumerico]);
    const chamadoAtualizado = await buscarChamadoPorIdService(idNumerico);
    return chamadoAtualizado;
}
async function deletarChamadoService(id){
    const chamado = await buscarChamadoPorIdService(id);
    if(!chamado){
        throw new AppError("Chamado não encontrado", 404);
    }
    const [resultado] = await pool.execute(`DELETE FROM chamados WHERE id = ?`, [id]);
    if(resultado.affectedRows === 0){
        throw new AppError("Chamado não encontrado", 404);
    }
    return chamado;
}
module.exports = {criarChamadoService, atualizarChamadoService, deletarChamadoService, buscarTodosChamados, buscarChamadoPorIdService};
const pool = require("../database");
async function buscarTodosChamados(filtros) {
    const {status, categoria, prioridade, pagina, limite} = filtros;
    const condicoes = [];
    const parametros = [];
    if (status) {
        condicoes.push("status = ?");
        parametros.push(status);
    }
    if (categoria) {
        condicoes.push("categoria = ?");
        parametros.push(categoria);
    }
    if (prioridade) {
        condicoes.push("prioridade = ?");
        parametros.push(prioridade);
    }
    const where = condicoes.length > 0
        ? `WHERE ${condicoes.join(" AND ")}`
        : "";
    const [contagem] = await pool.execute(
        `SELECT COUNT(*) AS total FROM chamados ${where}`,
        parametros
    );
    const totalChamados = contagem[0].total;
    const offset = (pagina - 1) * limite;
    const [chamados] = await pool.query(
        `SELECT * FROM chamados
         ${where}
         ORDER BY id ASC
         LIMIT ? OFFSET ?`,
        [...parametros, limite, offset]
    );
    return {chamados, totalChamados};
}

async function buscarChamadoPorIdService(id) {
    const [linhas] = await pool.query(
        "SELECT * FROM chamados WHERE id = ?",
        [id]
    );
    return linhas[0];
}