CREATE DATABASE IF NOT EXISTS saep;
USE saep;

CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    quantidade INT,
    valor DECIMAL(10,2),
    categoria VARCHAR(100)
);

CREATE TABLE movimentacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id INT,
    dt_entrada DATETIME,
    dt_saida DATETIME,
    tipo VARCHAR(100),
    quantidade INT,
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

INSERT INTO produtos (nome, quantidade, valor, categoria)
VALUES
('farinha', 2, 5.00, 'comida'),
('feijão', 1, 5.00, 'comida'),
('detergente', 2, 2.50, 'limpeza');

INSERT INTO movimentacoes (produto_id, dt_entrada, dt_saida, tipo, quantidade)
VALUES
(1, '2026-10-14 08:30:00', NULL, 'Entrada', 5),
(2, NULL, '2026-10-14 09:15:00', 'Saída', 1),
(3, '2026-10-14 10:00:00', NULL, 'Entrada', 10);

CREATE VIEW vw_produtos AS
SELECT
    nome,
    quantidade,
    valor,
    categoria,
    (quantidade * valor) AS valor_total
FROM produtos;

SELECT * FROM produtos;
SELECT * FROM movimentacoes;
SELECT * FROM vw_produtos;