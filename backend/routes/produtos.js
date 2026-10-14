const express = require('express');
const router = express.Router();
const db = require('../db');

// GET todos os produtos
router.get('/', (req, res) => {
    db.query('SELECT * FROM produtos', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// GET produto por ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM produtos WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Produto não encontrado' });
        res.json(results[0]);
    });
});

// POST criar produto
router.post('/', (req, res) => {
    const { nome, descricao, preco, estoque } = req.body;
    db.query('INSERT INTO produtos (nome, descricao, preco, estoque) VALUES (?, ?, ?, ?)', [nome, descricao, preco, estoque], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, nome, descricao, preco, estoque });
    });
});

// PUT atualizar produto
router.put('/:id', (req, res) => {
    const { nome, descricao, preco, estoque } = req.body;
    db.query('UPDATE produtos SET nome = ?, descricao = ?, preco = ?, estoque = ? WHERE id = ?', [nome, descricao, preco, estoque, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Produto atualizado com sucesso' });
    });
});

// DELETE remover produto
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM produtos WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Produto removido com sucesso' });
    });
});

module.exports = router;
