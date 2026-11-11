import { database, json, preflight } from "../_shared/wishlist.ts";
import { provider } from "../_shared/gift-provider.ts";
Deno.serve(async req => {
  if (req.method === "OPTIONS") return preflight();
  if (req.method !== "POST") return json({ error: "Método inválido." }, 405);
  try {
    // This adapter must verify both authenticity and payment state with the provider before returning.
    const event = await provider.verifyWebhook(req);
    const { error } = await database().rpc("confirm_gift_payment", { p_provider: "asaas", p_event_id: event.eventId, p_reference: event.reference, p_status: event.status, p_amount: event.amountCents });
    if (error) return json({ error: "Pagamento exige conciliação; confirmação não aplicada." }, 409);
    return json({ received: true });
  } catch { return json({ error: "Confirmação não disponível ou não verificada." }, 503); }
});