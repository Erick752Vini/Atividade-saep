import type { Config, Context } from "@netlify/functions";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { produtos } from "../../db/schema.js";

export default async (req: Request, context: Context) => {
  const id = context.params.id ? Number(context.params.id) : null;

  try {
    // GET - Listar todos os produtos / buscar por ID
    if (req.method === "GET") {
      if (id === null) {
        return Response.json(await db.select().from(produtos).orderBy(produtos.id));
      }
      const [produto] = await db.select().from(produtos).where(eq(produtos.id, id));
      if (!produto) return Response.json({ mensagem: "Produto não encontrado" }, { status: 404 });
      return Response.json(produto);
    }

    // POST - Criar novo produto
    if (req.method === "POST" && id === null) {
      const { nome, quantidade, valor, categoria } = await req.json();
      if (!nome || !quantidade || !valor || !categoria) {
        return Response.json({ mensagem: "Campos obrigatórios: nome, quantidade, valor, categoria" }, { status: 400 });
      }
      const [criado] = await db
        .insert(produtos)
        .values({ nome, quantidade, valor: String(valor), categoria })
        .returning();
      return Response.json({ mensagem: "Produto criado com sucesso", ...criado }, { status: 201 });
    }

    // PUT - Atualizar produto por ID
    if (req.method === "PUT" && id !== null) {
      const { nome, quantidade, valor, categoria } = await req.json();
      if (!nome || !quantidade || !valor || !categoria) {
        return Response.json({ mensagem: "Campos obrigatórios: nome, quantidade, valor, categoria" }, { status: 400 });
      }
      const atualizados = await db
        .update(produtos)
        .set({ nome, quantidade, valor: String(valor), categoria })
        .where(eq(produtos.id, id))
        .returning();
      if (atualizados.length === 0) return Response.json({ mensagem: "Produto não encontrado" }, { status: 404 });
      return Response.json({ mensagem: "Produto atualizado com sucesso" });
    }

    // DELETE - Remover produto por ID
    if (req.method === "DELETE" && id !== null) {
      const removidos = await db.delete(produtos).where(eq(produtos.id, id)).returning();
      if (removidos.length === 0) return Response.json({ mensagem: "Produto não encontrado" }, { status: 404 });
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
