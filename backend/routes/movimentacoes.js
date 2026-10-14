const express = require('express');
const router = express.Router();
const db = require('../db');

// GET - Listar todas as movimentações (com nome do produto via JOIN)
router.get('/', (req, res) => {
    const sql = `
        SELECT m.id, p.nome AS produto, m.produto_id,
               m.dt_entrada, m.dt_saida, m.tipo, m.quantidade
        FROM movimentacoes m
        INNER JOIN produtos p ON m.produto_id = p.id
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(results);
    });
});

// GET - Buscar movimentação por ID
router.get('/:id', (req, res) => {
    const sql = `
        SELECT m.id, p.nome AS produto, m.produto_id,
               m.dt_entrada, m.dt_saida, m.tipo, m.quantidade
        FROM movimentacoes m
        INNER JOIN produtos p ON m.produto_id = p.id
        WHERE m.id = ?
    `;
    db.query(sql, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ erro: err.message });
        if (results.length === 0) return res.status(404).json({ mensagem: 'Movimentação não encontrada' });
        res.json(results[0]);
    });
});

// POST - Criar nova movimentação
router.post('/', (req, res) => {
    const { produto_id, dt_entrada, dt_saida, tipo, quantidade } = req.body;

    if (!produto_id || !tipo || !quantidade) {
        return res.status(400).json({ mensagem: 'Campos obrigatórios: produto_id, tipo, quantidade' });
    }

    const sql = 'INSERT INTO movimentacoes (produto_id, dt_entrada, dt_saida, tipo, quantidade) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [produto_id, dt_entrada || null, dt_saida || null, tipo, quantidade], (err, result) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.status(201).json({
            mensagem: 'Movimentação registrada com sucesso',
            id: result.insertId,
            produto_id,
            dt_entrada,
            dt_saida,
            tipo,
            quantidade
        });
    });
});

// PUT - Atualizar movimentação por ID
router.put('/:id', (req, res) => {
    const { produto_id, dt_entrada, dt_saida, tipo, quantidade } = req.body;

    if (!produto_id || !tipo || !quantidade) {
        return res.status(400).json({ mensagem: 'Campos obrigatórios: produto_id, tipo, quantidade' });
    }

    const sql = 'UPDATE movimentacoes SET produto_id = ?, dt_entrada = ?, dt_saida = ?, tipo = ?, quantidade = ? WHERE id = ?';
    db.query(sql, [produto_id, dt_entrada || null, dt_saida || null, tipo, quantidade, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ erro: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ mensagem: 'Movimentação não encontrada' });
        res.json({ mensagem: 'Movimentação atualizada com sucesso' });
    });
});

// DELETE - Remover movimentação por ID
router.delete('/:id', (req, res) => {
    const sql = 'DELETE FROM movimentacoes WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).json({ erro: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ mensagem: 'Movimentação não encontrada' });
        res.json({ mensagem: 'Movimentação removida com sucesso' });
    });
});

module.exports = router;
