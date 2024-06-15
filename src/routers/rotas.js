const express = require('express')
const rotas = express();
const { cadastrarUsuario, login, detalharUsuario } = require('../controllers/usuarios');
const verificarUsuarioLogado = require('../middlewares/autentificacao')

rotas.post('/usuario', cadastrarUsuario);
rotas.post('/login', login);

rotas.use(verificarUsuarioLogado);

rotas.get('/usuario', detalharUsuario);
module.exports = rotas;