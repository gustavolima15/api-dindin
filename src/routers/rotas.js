const express = require('express')
const rotas = express();
const { 
    cadastrarUsuario,
    login, 
    detalharUsuario, 
    atualizarUsuario 
} = require('../controllers/usuarios');

const {listarTransacoes, cadastrarTransacao, obterTransacao,atualizarTransacao, deletarTransacao, obterExtratoTransacoes} = require('../controllers/transacoes');
const verificarUsuarioLogado = require('../middlewares/autentificacao')
const { listarCategorias } = require('../controllers/categorias');

rotas.post('/usuario', cadastrarUsuario);
rotas.post('/login', login);

rotas.use(verificarUsuarioLogado);

rotas.get('/usuario', detalharUsuario);
rotas.put('/usuario', atualizarUsuario);
rotas.get('/categoria', listarCategorias);

rotas.post('/transacao', cadastrarTransacao);
rotas.get('/transacao', listarTransacoes);
rotas.get('/transacao/:id', obterTransacao);
rotas.put('/transacao/:id', atualizarTransacao);
rotas.delete('/transacao/:id', deletarTransacao);
rotas.get('/transacao/extrato', obterExtratoTransacoes);
module.exports = rotas;