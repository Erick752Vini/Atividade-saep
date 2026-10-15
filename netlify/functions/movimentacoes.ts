import type { Config, Context } from "@netlify/functions";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { movimentacoes, produtos } from "../../db/schema.js";

// Mesmo formato do SELECT com JOIN da API original
const colunas = {
  id: movimentacoes.id,
  produto: produtos.nome,
  produto_id: movimentacoes.produtoId,
  dt_entrada: movimentacoes.dtEntrada,
  dt_saida: movimentacoes.dtSaida,
  tipo: movimentacoes.tipo,
  quantidade: movimentacoes.quantidade,
};

const paraData = (valor: unknown) => (valor ? new Date(String(valor)) : null);

export default async (req: Request, context: Context) => {
  const id = context.params.id ? Number(context.params.id) : null;

  try {
    // GET - Listar todas as movimentações / buscar por ID
    if (req.method === "GET") {
      const consulta = db
        .select(colunas)
        .from(movimentacoes)
        .innerJoin(produtos, eq(movimentacoes.produtoId, produtos.id));
      if (id === null) {
        return Response.json(await consulta.orderBy(movimentacoes.id));
      }
      const [mov] = await consulta.where(eq(movimentacoes.id, id));
      if (!mov) return Response.json({ mensagem: "Movimentação não encontrada" }, { status: 404 });
      return Response.json(mov);
    }

    // POST - Criar nova movimentação
    if (req.method === "POST" && id === null) {
      const { produto_id, dt_entrada, dt_saida, tipo, quantidade } = await req.json();
      if (!produto_id || !tipo || !quantidade) {
        return Response.json({ mensagem: "Campos obrigatórios: produto_id, tipo, quantidade" }, { status: 400 });
      }
      const [criada] = await db
        .insert(movimentacoes)
        .values({ produtoId: produto_id, dtEntrada: paraData(dt_entrada), dtSaida: paraData(dt_saida), tipo, quantidade })
        .returning({ id: movimentacoes.id });
      return Response.json(
        { mensagem: "Movimentação registrada com sucesso", id: criada.id, produto_id, dt_entrada, dt_saida, tipo, quantidade },
        { status: 201 },
      );
    }

    // PUT - Atualizar movimentação por ID
    if (req.method === "PUT" && id !== null) {
      const { produto_id, dt_entrada, dt_saida, tipo, quantidade } = await req.json();
      if (!produto_id || !tipo || !quantidade) {
        return Response.json({ mensagem: "Campos obrigatórios: produto_id, tipo, quantidade" }, { status: 400 });
      }
      const atualizadas = await db
        .update(movimentacoes)
        .set({ produtoId: produto_id, dtEntrada: paraData(dt_entrada), dtSaida: paraData(dt_saida), tipo, quantidade })
        .where(eq(movimentacoes.id, id))
        .returning();
      if (atualizadas.length === 0) return Response.json({ mensagem: "Movimentação não encontrada" }, { status: 404 });
      return Response.json({ mensagem: "Movimentação atualizada com sucesso" });
    }

    // DELETE - Remover movimentação por ID
    if (req.method === "DELETE" && id !== null) {
      const removidas = await db.delete(movimentacoes).where(eq(movimentacoes.id, id)).returning();
      if (removidas.length === 0) return Response.json({ mensagem: "Movimentação não encontrada" }, { status: 404 });
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
