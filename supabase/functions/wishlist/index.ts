import { z } from "npm:zod@3";
import { database, catalog, json, preflight } from "../_shared/wishlist.ts";
const checkout = z.object({ name: z.string().trim().min(2).max(120), email: z.string().trim().email().max(255), message: z.string().max(2000), anonymous: z.boolean(), method: z.enum(["pix", "card"]), items: z.array(z.object({ gift_id: z.string().uuid(), quantity: z.number().int().min(1).max(10000) })).min(1).max(30) });
Deno.serve(async req => {
  if (req.method === "OPTIONS") return preflight();
  if (req.method !== "POST") return json({ error: "Método inválido." }, 405);
  try {
    const input = await req.json();
    if (input.action === "catalog") return json(await catalog());
    if (input.action === "checkout") {
      if (!checkout.safeParse(input).success) return json({ error: "Confira os dados do presente e do convidado." }, 400);
      // Fail closed before reservation or order creation until an actual provider is connected.
      return json({ error: "Pagamentos ainda não configurados. Nenhuma cobrança foi criada." }, 503);
    }
    if (input.action === "status") {
      const token = z.string().uuid().safeParse(input.lookup_token);
      if (!token.success) return json({ error: "Pedido inválido." }, 400);
      const { data, error } = await database().from("gift_orders").select("status,guest_name,amount_cents").eq("lookup_token", token.data).maybeSingle();
      if (error || !data) return json({ error: "Pedido não encontrado." }, 404);
      return json({ status: data.status, amount_cents: data.amount_cents, ...(data.status === "paid" ? { guest_name: data.guest_name } : {}) });
    }
    return json({ error: "Ação inválida." }, 400);
  } catch { return json({ error: "Não foi possível concluir a solicitação." }, 500); }
});