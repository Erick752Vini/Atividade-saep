const express = require('express');
const router = express.Router();
const db = require('../db');

// GET todos os corredores
router.get('/', (req, res) => {
    db.query('SELECT * FROM corredores', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// GET corredor por ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM corredores WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Corredor não encontrado' });
        res.json(results[0]);
    });
});

// POST criar corredor
router.post('/', (req, res) => {
    const { nome, numero, time } = req.body;
    db.query('INSERT INTO corredores (nome, numero, time) VALUES (?, ?, ?)', [nome, numero, time], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, nome, numero, time });
    });
});

// PUT atualizar corredor
router.put('/:id', (req, res) => {
    const { nome, numero, time } = req.body;
    db.query('UPDATE corredores SET nome = ?, numero = ?, time = ? WHERE id = ?', [nome, numero, time, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Corredor atualizado com sucesso' });
    });
});

// DELETE remover corredor
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM corredores WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Corredor removido com sucesso' });
    });
});

module.exports = router;
