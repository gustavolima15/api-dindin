const express = require('express')
const rotas = express();
const { 
    cadastrarUsuario,
    login, 
    detalharUsuario, 
    atualizarUsuario 
} = require('../controllers/usuarios');

const {listarTransacoes, cadastrarTransacao} = require('../controllers/transacoes');
const verificarUsuarioLogado = require('../middlewares/autentificacao')

rotas.post('/usuario', cadastrarUsuario);
rotas.post('/login', login);

rotas.use(verificarUsuarioLogado);

rotas.get('/usuario', detalharUsuario);
rotas.put('/usuario', atualizarUsuario);

rotas.post('/transacao', cadastrarTransacao);
rotas.get('/transacao', listarTransacoes)
module.exports = rotas;