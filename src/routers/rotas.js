const express = require('express');
const rotas = express();
const { 
    cadastrarUsuario, 
    login, 
    detalharUsuario, 
    atualizarUsuario } = require('../controllers/usuarios');
const { listarCategorias } = require('../controllers/categorias');
const { 
    listarTransacoes, 
    cadastrarTransacao, 
    obterTransacao, 
    atualizarTransacao, 
    deletarTransacao, 
    obterExtratoTransacoes} = require('../controllers/transacoes');
const verificarUsuarioLogado = require('../middlewares/autentificacao');

rotas.post('/usuario', cadastrarUsuario);
rotas.post('/login', login);


rotas.use(verificarUsuarioLogado);

rotas.get('/usuario', detalharUsuario);
rotas.put('/usuario', atualizarUsuario);

rotas.get('/categoria', listarCategorias);

rotas.get('/transacao', listarTransacoes);
rotas.post('/transacao', cadastrarTransacao);
rotas.get('/transacao/extrato', obterExtratoTransacoes);
rotas.get('/transacao/:id', obterTransacao);
rotas.put('/transacao/:id', atualizarTransacao);
rotas.delete('/transacao/:id', deletarTransacao);

module.exports = rotas;