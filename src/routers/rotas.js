const express = require('express')
const rotas = express();
const { cadastrarUsuario, login } = require('../controllers/usuarios');
const verificarUsuarioLogado = require('../middlewares/autentificacao')

rotas.post('/usuario', cadastrarUsuario);
rotas.post('/login', login);

rotas.use(verificarUsuarioLogado)

module.exports = rotas