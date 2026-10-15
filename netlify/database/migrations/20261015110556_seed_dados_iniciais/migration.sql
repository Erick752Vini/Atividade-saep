INSERT INTO "produtos" ("nome", "quantidade", "valor", "categoria")
VALUES
('farinha', 2, 5.00, 'comida'),
('feijão', 1, 5.00, 'comida'),
('detergente', 2, 2.50, 'limpeza');
--> statement-breakpoint
INSERT INTO "movimentacoes" ("produto_id", "dt_entrada", "dt_saida", "tipo", "quantidade")
VALUES
(1, '2026-10-14 08:30:00', NULL, 'Entrada', 5),
(2, NULL, '2026-10-14 09:15:00', 'Saída', 1),
(3, '2026-10-14 10:00:00', NULL, 'Entrada', 10);
--> statement-breakpoint
CREATE VIEW "vw_produtos" AS
SELECT nome, quantidade, valor, categoria, (quantidade * valor) AS valor_total
FROM "produtos";
