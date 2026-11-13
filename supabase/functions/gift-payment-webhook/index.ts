import { z } from "npm:zod@3";
import { database, json, preflight } from "../_shared/wishlist.ts";
import { PROVIDER, verifyPayment } from "../_shared/gift-provider.ts";
const body = z.object({ order_nsu: z.string().uuid(), transaction_nsu: z.string().min(1).max(200), invoice_slug: z.string().min(1).max(200) }).passthrough();
Deno.serve(async req => {
  if (req.method === "OPTIONS") return preflight();
  if (req.method !== "POST") return json({ error: "Método inválido." }, 405);
  try {
    const parsed = body.safeParse(await req.json());
    if (!parsed.success) return json({ error: "Evento inválido." }, 400);
    const check = await verifyPayment(parsed.data);
    if (!check.paid) return json({ received: true, paid: false });
    const db = database();
    const { data: order } = await db.from("gift_orders").select("amount_cents").eq("provider", PROVIDER).eq("provider_reference", parsed.data.order_nsu).maybeSingle();
    if (!order) return json({ error: "Pedido não encontrado." }, 404);
    if (check.amount && check.amount !== order.amount_cents) return json({ error: "Valor divergente." }, 409);
    const { error } = await db.rpc("confirm_gift_payment", { p_provider: PROVIDER, p_event_id: parsed.data.transaction_nsu, p_reference: parsed.data.order_nsu, p_status: "paid", p_amount: order.amount_cents });
    if (error) { console.error("confirm", error.message); return json({ error: "Pagamento exige conciliação." }, 400); }
    return json({ received: true });
  } catch (e) { console.error(e); return json({ error: "Confirmação não verificada." }, 400); }
});
