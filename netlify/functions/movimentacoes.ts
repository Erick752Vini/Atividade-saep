import type { Config, Context } from "@netlify/functions";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../../db/mysql.js";

const SELECT_BASE = `
  SELECT m.id, p.nome AS produto, m.produto_id, m.dt_entrada, m.dt_saida, m.tipo, m.quantidade
  FROM movimentacoes m
  INNER JOIN produtos p ON p.id = m.produto_id`;

const paraData = (valor: unknown) => (valor ? new Date(String(valor)) : null);

export default async (req: Request, context: Context) => {
  const id = context.params.id ? Number(context.params.id) : null;

  try {
    if (req.method === "GET") {
      if (id === null) {
        const [rows] = await pool.query<RowDataPacket[]>(`${SELECT_BASE} ORDER BY m.id`);
        return Response.json(rows);
      }
      const [rows] = await pool.query<RowDataPacket[]>(`${SELECT_BASE} WHERE m.id = ?`, [id]);
      if (rows.length === 0) return Response.json({ mensagem: "Movimentação não encontrada" }, { status: 404 });
      return Response.json(rows[0]);
    }

    if (req.method === "POST" && id === null) {
      const { produto_id, dt_entrada, dt_saida, tipo, quantidade } = await req.json();
      if (!produto_id || !tipo || !quantidade) {
        return Response.json({ mensagem: "Campos obrigatórios: produto_id, tipo, quantidade" }, { status: 400 });
      }
      const [r] = await pool.query<ResultSetHeader>(
        "INSERT INTO movimentacoes (produto_id, dt_entrada, dt_saida, tipo, quantidade) VALUES (?, ?, ?, ?, ?)",
        [produto_id, paraData(dt_entrada), paraData(dt_saida), tipo, quantidade],
      );
      return Response.json(
        { mensagem: "Movimentação registrada com sucesso", id: r.insertId, produto_id, dt_entrada, dt_saida, tipo, quantidade },
        { status: 201 },
      );
    }

    if (req.method === "PUT" && id !== null) {
      const { produto_id, dt_entrada, dt_saida, tipo, quantidade } = await req.json();
      if (!produto_id || !tipo || !quantidade) {
        return Response.json({ mensagem: "Campos obrigatórios: produto_id, tipo, quantidade" }, { status: 400 });
      }
      const [r] = await pool.query<ResultSetHeader>(
        "UPDATE movimentacoes SET produto_id = ?, dt_entrada = ?, dt_saida = ?, tipo = ?, quantidade = ? WHERE id = ?",
        [produto_id, paraData(dt_entrada), paraData(dt_saida), tipo, quantidade, id],
      );
      if (r.affectedRows === 0) return Response.json({ mensagem: "Movimentação não encontrada" }, { status: 404 });
      return Response.json({ mensagem: "Movimentação atualizada com sucesso" });
    }

    if (req.method === "DELETE" && id !== null) {
      const [r] = await pool.query<ResultSetHeader>("DELETE FROM movimentacoes WHERE id = ?", [id]);
      if (r.affectedRows === 0) return Response.json({ mensagem: "Movimentação não encontrada" }, { status: 404 });
      return Response.json({ mensagem: "Movimentação removida com sucesso" });
    }

    return Response.json({ mensagem: "Método não permitido" }, { status: 405 });
  } catch (err) {
    return Response.json({ erro: (err as Error).message }, { status: 500 });
  }
};

export const config: Config = {
  path: ["/api/movimentacoes", "/api/movimentacoes/:id"],
};
