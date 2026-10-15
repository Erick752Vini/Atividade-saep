import type { Config, Context } from "@netlify/functions";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../../db/mysql.js";

export default async (req: Request, context: Context) => {
  const id = context.params.id ? Number(context.params.id) : null;

  try {
    if (req.method === "GET") {
      if (id === null) {
        const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM produtos ORDER BY id");
        return Response.json(rows);
      }
      const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM produtos WHERE id = ?", [id]);
      if (rows.length === 0) return Response.json({ mensagem: "Produto não encontrado" }, { status: 404 });
      return Response.json(rows[0]);
    }

    if (req.method === "POST" && id === null) {
      const { nome, quantidade, valor, categoria } = await req.json();
      if (!nome || !quantidade || !valor || !categoria) {
        return Response.json({ mensagem: "Campos obrigatórios: nome, quantidade, valor, categoria" }, { status: 400 });
      }
      const [r] = await pool.query<ResultSetHeader>(
        "INSERT INTO produtos (nome, quantidade, valor, categoria) VALUES (?, ?, ?, ?)",
        [nome, quantidade, String(valor), categoria],
      );
      return Response.json(
        { mensagem: "Produto criado com sucesso", id: r.insertId, nome, quantidade, valor: String(valor), categoria },
        { status: 201 },
      );
    }

    if (req.method === "PUT" && id !== null) {
      const { nome, quantidade, valor, categoria } = await req.json();
      if (!nome || !quantidade || !valor || !categoria) {
        return Response.json({ mensagem: "Campos obrigatórios: nome, quantidade, valor, categoria" }, { status: 400 });
      }
      const [r] = await pool.query<ResultSetHeader>(
        "UPDATE produtos SET nome = ?, quantidade = ?, valor = ?, categoria = ? WHERE id = ?",
        [nome, quantidade, String(valor), categoria, id],
      );
      if (r.affectedRows === 0) return Response.json({ mensagem: "Produto não encontrado" }, { status: 404 });
      return Response.json({ mensagem: "Produto atualizado com sucesso" });
    }

    if (req.method === "DELETE" && id !== null) {
      const [r] = await pool.query<ResultSetHeader>("DELETE FROM produtos WHERE id = ?", [id]);
      if (r.affectedRows === 0) return Response.json({ mensagem: "Produto não encontrado" }, { status: 404 });
      return Response.json({ mensagem: "Produto removido com sucesso" });
    }

    return Response.json({ mensagem: "Método não permitido" }, { status: 405 });
  } catch (err) {
    return Response.json({ erro: (err as Error).message }, { status: 500 });
  }
};

export const config: Config = {
  path: ["/api/produtos", "/api/produtos/:id"],
};
