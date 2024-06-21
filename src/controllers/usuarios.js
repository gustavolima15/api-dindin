const pool = require('../conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const senhaJwt = require('../configs');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;
    
    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios: nome, email e senha.' });
    }

    try {
        const senhaCriptografada = await bcrypt.hash(senha, 10)

        const { rowCount } = await pool.query('select * from usuarios where email = $1', [email]);

        if (rowCount > 0) {
            return res.status(400).json({ mensagem: 'Já existe usuário cadastrado com o e-mail informado.' });
        }
        const { rows } = await pool.query(
            'insert into usuarios (nome, email, senha) VALUES ($1, $2, $3) returning *',
            [nome, email, senhaCriptografada]
        );
        return res.status(201).json(rows);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro ao cadastrar usuário' });
    }
};

const login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios: email e senha.' });
    }

    try {
        const usuario = await pool.query('select * from usuarios where email = $1', [email])

        if (usuario.rowCount < 1) {
            return res.status(404).json({ mensagem: 'Usuário e/ou senha inválido(s).' })
        }

        const senhaValida = await bcrypt.compare(senha, usuario.rows[0].senha);

        if (!senhaValida) {
            return res.status(400).json({ mensagem: 'Usuário e/ou senha inválido(s).' })
        }

        const token = jwt.sign({ id: usuario.rows[0].id }, senhaJwt.jwtSecret, { expiresIn: '8h' })

        const { senha: _, ...usuarioLogado } = usuario.rows[0]

        return res.status(200).json({ usuario: usuarioLogado, token })
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
}

const detalharUsuario = async (req, res) => {
    try {
        const { id, nome, email } = req.usuario;

        return res.status(200).json({ id, nome, email });
    } catch (error) {
        return res.status(401).json({ mensagem: 'Para acessar este recurso um token de autenticação válido deve ser enviado.' });
    }
}

const atualizarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        if (!nome || !email || !senha) {
            return res.status(400).json({ mensagem: 'Os campos nome, email e senha são obrigatórios.' });
        }

        const verificarEmail = await pool.query('select id from usuarios where email = $1 and id != $2', [email, req.usuario.id]);

        if (verificarEmail.rows.length > 0) {
            return res.status(403).json({ mensagem: 'O e-mail informado já está sendo utilizado por outro usuário.' });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        await pool.query('update usuarios set nome = $1, email = $2, senha = $3 where id = $4', [nome, email, senhaCriptografada, req.usuario.id]);

        return res.status(204).json();
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro ao atualizar os dados do usuário.' });
    }
}

module.exports = {
    cadastrarUsuario,
    login,
    detalharUsuario,
    atualizarUsuario
}
