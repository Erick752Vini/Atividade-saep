const express = require('express');
const router = express.Router();
const db = require('../db');

// GET - Listar todos os produtos
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM produtos';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(results);
    });
});

// GET - Buscar produto por ID
router.get('/:id', (req, res) => {
    const sql = 'SELECT * FROM produtos WHERE id = ?';
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ erro: err.message });
        if (results.length === 0) return res.status(404).json({ mensagem: 'Produto não encontrado' });
        res.json(results[0]);
    });
});

// POST - Criar novo produto
router.post('/', (req, res) => {
    const { nome, quantidade, valor, categoria } = req.body;

    if (!nome || !quantidade || !valor || !categoria) {
        return res.status(400).json({ mensagem: 'Campos obrigatórios: nome, quantidade, valor, categoria' });
    }

    const sql = 'INSERT INTO produtos (nome, quantidade, valor, categoria) VALUES (?, ?, ?, ?)';
    db.query(sql, [nome, quantidade, valor, categoria], (err, result) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.status(201).json({
            mensagem: 'Produto criado com sucesso',
            id: result.insertId,
            nome,
            quantidade,
            valor,
            categoria
        });
    });
});

// PUT - Atualizar produto por ID
router.put('/:id', (req, res) => {
    const { nome, quantidade, valor, categoria } = req.body;

    if (!nome || !quantidade || !valor || !categoria) {
        return res.status(400).json({ mensagem: 'Campos obrigatórios: nome, quantidade, valor, categoria' });
    }

    const sql = 'UPDATE produtos SET nome = ?, quantidade = ?, valor = ?, categoria = ? WHERE id = ?';
    db.query(sql, [nome, quantidade, valor, categoria, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ erro: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ mensagem: 'Produto não encontrado' });
        res.json({ mensagem: 'Produto atualizado com sucesso' });
    });
});

// DELETE - Remover produto por ID
router.delete('/:id', (req, res) => {
    const sql = 'DELETE FROM produtos WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ erro: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ mensagem: 'Produto não encontrado' });
        res.json({ mensagem: 'Produto removido com sucesso' });
    });
});

module.exports = router;
