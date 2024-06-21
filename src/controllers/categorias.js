const pool = require('../conexao');

const listarCategorias = async (req, res) => {
    try {
        const listaDeCategorias = await pool.query('select * from categorias');

        return res.status(200).json(listaDeCategorias.rows);
    } catch (error) {
        return res.status(400).json({ mensagem: 'Erro ao solicitar a lista de categorias.' });
    }
}

module.exports = {
    listarCategorias
}