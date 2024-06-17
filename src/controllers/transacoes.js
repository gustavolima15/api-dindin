const pool = require('../conexao');

const listarTransacoes = async (req, res) => {
    try {
        const transacoesUsuario = await pool.query(`
            select t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id, t.categoria_id, c.descricao as categoria_nome 
            from transacoes t 
            join categorias c on t.categoria_id = c.id
            where t.usuario_id = $1`, [req.usuario.id]);

        return res.status(200).json(transacoesUsuario.rows);
    } catch (error) {
        return res.status(400).json({ mensagem: 'Erro ao listar as transações do usuário.' });
    }
}

module.exports = {
    listarTransacoes
}