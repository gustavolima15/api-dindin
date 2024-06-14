const express = require('express')
const rotas = express();
const { cadastrarUsuario, listarUsuarios } = require('../controllers/usuarios')

rotas.post('/usuario', cadastrarUsuario);
rotas.get('/usuario', listarUsuarios)

module.exports = rotas