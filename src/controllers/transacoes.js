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
    const { tipo, descricao, valor, data, categoria_id } = req.body;

    try {
        const { rows } = await pool.query(
            'insert into transacoes (descricao, valor, data, categoria_id, usuario_id, tipo) values ($1, $2, $3, $4, $5, $6) returning *',
            [descricao, valor, data, categoria_id, req.usuario.id, tipo]
        )
        return res.status(201).json(rows[0])
    } catch (error) {
        return res.status(500).json('Erro no servidor')
    }
}

const obterTransacao = async (req, res) => {
    const { id } = req.params;

    try {
        const { rows, rowCount } = await pool.query(`
            select t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id, t.categoria_id, c.descricao as categoria_nome 
            from transacoes t 
            join categorias c on t.categoria_id = c.id
            where t.id = $1
        `, [id]);

        if (rowCount < 1) {
            return res.status(404).json({ mensagem: "Transação não encontrada." });
        }
        return res.status(200).json(rows[0]);
    } catch (error) {
        return res.status(500).json('Erro no servidor');
    }
}

const atualizarTransacao = async (req, res) => {
    const { id } = req.params;
    const { descricao, valor, data, categoria_id, tipo } = req.body;

    if (!descricao || !valor || !data || !categoria_id || !tipo) {
        return res.status(404).json({ mensagem: 'Todos os campos obrigatórios devem ser informados!' });
    }

    if (tipo !== 'entrada' && tipo !== 'saida') {
        return res.status(404).json({ mensagem: 'O tipo deve ser obrigatoriamente entrada ou saida!' });
    }

    try {
        const verificarTransacaoUsuario = await pool.query('select * from transacoes where id = $1 and usuario_id = $2', [id, req.usuario.id]);

        if (verificarTransacaoUsuario.rows.length === 0) {
            return res.status(404).json({ mensagem: 'Atualização da transação não permitida ao usuário.' });
        }

        const verificarCategoriaExiste = await pool.query('select * from categorias where id = $1', [categoria_id]);

        if (verificarCategoriaExiste.rows.length === 0) {
            return res.status(404).json({ mensagem: 'Categoria inexistente!' });
        }

        await pool.query(`update transacoes 
            set descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5
            where id = $6 and usuario_id = $7`, [descricao, valor, data, categoria_id, tipo, id, req.usuario.id]);

        return res.status(204).json();
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro ao atualizar a transação.' });
    }
}

const deletarTransacao = async (req, res) => {
    const { id } = req.params;

    try {
        const verificarTransacaoUsuario = await pool.query('select * from transacoes where id = $1 and usuario_id = $2', [id, req.usuario.id]);

        if (verificarTransacaoUsuario === 0) {
            return res.status(404).json({ mensagem: 'Exclusão da transação não permitida ao usuário.' });
        }

        await pool.query('delete from transacoes where id = $1 and usuario_id = $2', [id, req.usuario.id]);

        return res.status(204).json();
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro ao deletar a transação.' });
    }
}

const obterExtratoTransacoes = async (req, res) => {
    const id = req.usuario.id;
    
    try {
        const entradas = await pool.query(
            `select sum(valor) as entrada 
            from transacoes 
            where usuario_id = $1 and tipo = $2`, 
            [id, 'entrada']);

        const saidas = await pool.query(
            `select sum(valor) as saida 
            from transacoes 
            where usuario_id = $1 and tipo = $2`, 
            [id, 'saida']);
    
        const entrada = entradas.rows[0].entrada || 0;
        const saida = saidas.rows[0].saida || 0;
        
        return res.status(200).json({entrada,saida})
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro ao obter extrato das transações.' });

    }
}


module.exports = {
    listarTransacoes,
    cadastrarTransacao,
    obterTransacao,
    atualizarTransacao,
    deletarTransacao,
    obterExtratoTransacoes,
};