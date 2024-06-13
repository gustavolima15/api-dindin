const express = require('express');
const rotas = express();


const { Pool } = require('pg');

const poll = new Poll({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'aula_conexao_node_pg'
});
