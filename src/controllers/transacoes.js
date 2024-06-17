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

const cadastrarTransacao = async (req, res) => {
    const {tipo, descricao, valor, data, categoria_id} = req.body;
    console.log(req.usuario.id);
    try {
        const { rows } = await pool.query(
            'insert into transacoes (descricao, valor, data, categoria_id, usuario_id, tipo) values ($1, $2, $3, $4, $5, $6) returning *',
            [descricao, valor, data, categoria_id, req.usuario.id, tipo]
            )
        console.log(rows)
		return res.status(201).json(rows[0])
    } catch (error) {
        return res.status(500).json('Erro no servidor')
    }
}

module.exports = {
    listarTransacoes,
    cadastrarTransacao
}