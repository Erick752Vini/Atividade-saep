CREATE TABLE "movimentacoes" (
	"id" serial PRIMARY KEY,
	"produto_id" integer,
	"dt_entrada" timestamp,
	"dt_saida" timestamp,
	"tipo" varchar(100),
	"quantidade" integer
);
--> statement-breakpoint
CREATE TABLE "produtos" (
	"id" serial PRIMARY KEY,
	"nome" varchar(100),
	"quantidade" integer,
	"valor" numeric(10,2),
	"categoria" varchar(100)
);
--> statement-breakpoint
ALTER TABLE "movimentacoes" ADD CONSTRAINT "movimentacoes_produto_id_produtos_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "produtos"("id") ON DELETE CASCADE;