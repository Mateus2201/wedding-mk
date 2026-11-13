// InfinitePay Checkout Integrado. Webhook bodies are never trusted: each event is re-checked via payment_check.
export const PROVIDER = "infinitepay";
const HANDLE = "mateus-viana-m22";
const API = "https://api.infinitepay.io/invoices/public/checkout";
export type LinkItem = { description: string; quantity: number; price: number };
export async function createCheckoutLink(input: { orderNsu: string; items: LinkItem[]; redirectUrl: string; webhookUrl: string; name: string; email: string }) {
  const res = await fetch(`${API}/links`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ handle: HANDLE, items: input.items, order_nsu: input.orderNsu, redirect_url: input.redirectUrl, webhook_url: input.webhookUrl, customer: { name: input.name, email: input.email } }) });
  const data = await res.json().catch(() => ({}));
  const url = data?.url ?? data?.link;
  if (!res.ok || typeof url !== "string" || !url.startsWith("https://")) { console.error("infinitepay links", res.status, JSON.stringify(data)); throw new Error("Não foi possível gerar o link de pagamento."); }
  return url;
}
export async function verifyPayment(e: { order_nsu: string; transaction_nsu: string; invoice_slug: string }) {
  const res = await fetch(`${API}/payment_check`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ handle: HANDLE, order_nsu: e.order_nsu, transaction_nsu: e.transaction_nsu, slug: e.invoice_slug }) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data?.success !== true) throw new Error("Pagamento não verificado.");
  return { paid: data.paid === true, amount: Number(data.amount ?? 0), paidAmount: Number(data.paid_amount ?? 0) };
}
