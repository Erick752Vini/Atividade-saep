const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: '*',
    credentials: true
}));

// app.use(express.static(path.join(__dirname, '../front-api'))); // descomente quando o front estiver pronto

const produtosRouter = require('./routes/produtos');
app.use('/api/produtos', produtosRouter);

const movimentacoesRouter = require('./routes/movimentacoes');
app.use('/api/movimentacoes', movimentacoesRouter);

// app.get('/', (req, res) => {                                         // descomente quando o front estiver pronto
//     res.sendFile(path.join(__dirname, '../front-api', 'login.html'));
// });

module.exports = app;