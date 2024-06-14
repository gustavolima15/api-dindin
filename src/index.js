const express = require('express');
const router = require('./routers/rotas');
const config = require('./configs')


const app = express();
app.use(express.json());
app.use(router);

app.listen(config.serverPort, () => {
    console.log(`Servidor rodando na porta ${config.serverPort}`);
  });