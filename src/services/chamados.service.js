const prioridadesValidas = ["Baixa", "Média", "Alta"];
const categoriasValidas = ["Hardware", "Rede", "Software", "Acesso", "Outro"];
const statusValidos = ["Em andamento", "Aberto", "Finalizado"];
async function criarChamadoService(dados){
    const {titulo, descricao, solicitante, categoria, prioridade} = dados;
    if(!titulo || !descricao || !solicitante || !categoria || !prioridade){
            throw new Error("Todos os campos são obrigatórios!")
        }
        if(!prioridadesValidas.includes(prioridade)){
            throw new Error("Prioridade Inválida!")
        }
        if(!categoriasValidas.includes(categoria)){
            throw new Error("Categoria Inválida!")
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
    const chamado = chamados.find(c => c.id === idNumerico);
    if(!chamado){
       throw new Error("Chamado não encontrado");
    }
    if(!statusValidos.includes(status)){
        throw new Error("Status inválido");
    }
    await pool.execute(`UPDATE chamados SET status = ? WHERE id = ?`, [status, idNumerico]);
    const chamadoAtualizado = await buscarChamadoPorIdService(idNumerico);
    return chamadoAtualizado;
}
async function deletarChamadoService(id){
    const chamado = await buscarChamadoPorIdService(id);
    if(!chamado){
        throw new Error("Chamado não encontrado");
    }
    const [resultado] = await pool.execute(`DELETE FROM chamados WHERE id = ?`, [id]);
    if(resultado.affectedRows === 0){
        throw new Error("Chamado não encontrado");
    }
    return chamado;
}
module.exports = {criarChamadoService, atualizarChamadoService, deletarChamadoService, buscarTodosChamados, buscarChamadoPorIdService};
const pool = require("../database");

async function buscarTodosChamados() {
    const [linhas] = await pool.query(
        "SELECT * FROM chamados"
    );

    return linhas;
}
async function buscarChamadoPorIdService(id) {
    const [linhas] = await pool.query(
        "SELECT * FROM chamados WHERE id = ?",
        [id]
    );
    return linhas[0];
}