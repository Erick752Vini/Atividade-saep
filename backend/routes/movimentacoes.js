const express = require('express');
const router = express.Router();
const db = require('../db');

// GET todas as movimentações
router.get('/', (req, res) => {
    db.query('SELECT * FROM movimentacoes', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// GET movimentação por ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM movimentacoes WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Movimentação não encontrada' });
        res.json(results[0]);
    });
});

// POST criar movimentação
router.post('/', (req, res) => {
    const { produto_id, tipo, quantidade, data } = req.body;
    db.query('INSERT INTO movimentacoes (produto_id, tipo, quantidade, data) VALUES (?, ?, ?, ?)', [produto_id, tipo, quantidade, data || new Date()], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, produto_id, tipo, quantidade });
    });
});

// DELETE remover movimentação
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM movimentacoes WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Movimentação removida com sucesso' });
    });
});

module.exports = router;
