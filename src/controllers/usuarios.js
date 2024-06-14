const pool = require('../conexao');
const bcrypt = require('bcrypt');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;
    console.log(nome, email, senha);
    try {
        const senhaCriptografada = await bcrypt.hash(senha, 10)
        const { rows } = await pool.query(
            'insert into usuarios (nome, email, senha) VALUES ($1, $2, $3) returning *',
            [nome, email, senhaCriptografada]
        );
        return res.status(201).json(rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: 'Erro ao cadastrar usuário' });
    }
};

const listarUsuarios = async (req, res) => {
	try {
		const { rows } = await pool.query('select * from usuarios')

		return res.json(rows)
	} catch (error) {
		return res.status(500).json('Erro interno do servidor')
	}
}


module.exports = {
    cadastrarUsuario,
    listarUsuarios
};
