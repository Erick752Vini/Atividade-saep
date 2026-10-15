import { pgTable, serial, varchar, integer, numeric, timestamp } from "drizzle-orm/pg-core";

export const produtos = pgTable("produtos", {
  id: serial().primaryKey(),
  nome: varchar({ length: 100 }),
  quantidade: integer(),
  valor: numeric({ precision: 10, scale: 2 }),
  categoria: varchar({ length: 100 }),
});

export const movimentacoes = pgTable("movimentacoes", {
  id: serial().primaryKey(),
  produtoId: integer("produto_id").references(() => produtos.id, { onDelete: "cascade" }),
  dtEntrada: timestamp("dt_entrada"),
  dtSaida: timestamp("dt_saida"),
  tipo: varchar({ length: 100 }),
  quantidade: integer(),
});
