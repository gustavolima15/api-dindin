const pool = require('../conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const senhaJwt = require('../configs');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;
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

const login = async (req, res) => {
    const {email, senha} = req.body;    
    try {        
        const usuario = await pool.query('select * from usuarios where email = $1', [email])
        
        if(usuario.rowCount < 1){
            return res.status(404).json({mensagem: 'Usuário não encontrado'})
        }
        
        const senhaValida = await bcrypt.compare(senha, usuario.rows[0].senha);
        if (!senhaValida) {
            return res.status(400).json({mensagem: 'Senha e/ou email incorretos'})
        }

        const token = jwt.sign({id: usuario.rows[0].id}, senhaJwt.jwtSecret, {expiresIn: '8h'})
        const { senha: _, ...usuarioLogado } = usuario.rows[0]

        return res.status(201).json({usuario: usuarioLogado, token}) 
    } catch (error) {
            return res.status(500).json({mensagem: 'Erro interno do servidor'})
    }

}


module.exports = {
    cadastrarUsuario,
    listarUsuarios,
    login
};
