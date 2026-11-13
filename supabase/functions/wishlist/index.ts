import { z } from "npm:zod@3";
import { database, catalog, json, preflight } from "../_shared/wishlist.ts";
import { PROVIDER, createCheckoutLink } from "../_shared/gift-provider.ts";
const checkout = z.object({ name: z.string().trim().min(2).max(120), email: z.string().trim().email().max(255), message: z.string().max(2000), anonymous: z.boolean(), method: z.enum(["pix", "card"]), items: z.array(z.object({ gift_id: z.string().uuid(), quantity: z.number().int().min(1).max(10000) })).min(1).max(30), origin: z.string().url().max(200) });
Deno.serve(async req => {
  if (req.method === "OPTIONS") return preflight();
  if (req.method !== "POST") return json({ error: "Método inválido." }, 405);
  try {
    const input = await req.json();
    if (input.action === "catalog") return json(await catalog());
    if (input.action === "checkout") {
      const p = checkout.safeParse(input);
      if (!p.success) return json({ error: "Confira os dados do presente e do convidado." }, 400);
      const origin = new URL(p.data.origin).origin;
      if (!/^https:\/\/([a-z0-9-]+\.)*lovable\.app$|^http:\/\/localhost(:\d+)?$/.test(origin)) return json({ error: "Origem inválida." }, 400);
      const db = database();
      const { data: r, error } = await db.rpc("reserve_gifts", { p_guest_name: p.data.name, p_email: p.data.email, p_message: p.data.message, p_anonymous: p.data.anonymous, p_method: p.data.method, p_items: p.data.items });
      if (error || !r) return json({ error: "Alguns presentes não estão mais disponíveis." }, 409);
      const order = r as { id: string; lookup_token: string };
      await db.from("gift_orders").update({ provider: PROVIDER, provider_reference: order.id }).eq("id", order.id);
      const { data: lines } = await db.from("gift_order_items").select("name,quantity,amount_cents").eq("order_id", order.id);
      try {
        const checkoutUrl = await createCheckoutLink({ orderNsu: order.id, name: p.data.name, email: p.data.email,
          items: (lines || []).map(l => ({ description: l.name, quantity: 1, price: l.amount_cents })),
          redirectUrl: `${origin}/presentes/obrigado?pedido=${order.lookup_token}`,
          webhookUrl: `${Deno.env.get("SUPABASE_URL")}/functions/v1/gift-payment-webhook` });
        return json({ checkoutUrl });
      } catch {
        await db.from("gift_orders").update({ status: "failed" }).eq("id", order.id);
        return json({ error: "Não foi possível gerar o pagamento. Tente novamente." }, 502);
      }
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