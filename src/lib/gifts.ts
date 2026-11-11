import { z } from "zod";

export const giftSchema = z.object({
  id: z.string().uuid().optional(), name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(1000), category_id: z.string().uuid().nullable(),
  price_cents: z.number().int().min(100).max(100000000),
  quantity: z.number().int().min(1).max(10000),
  target_cents: z.number().int().min(100).max(100000000).nullable(),
  enabled: z.boolean(), available: z.boolean(), image_path: z.string().max(300).nullable(),
  sort_order: z.number().int().min(0).max(100000),
});
export type Gift = z.infer<typeof giftSchema> & { id: string; purchased_quantity: number; funded_cents: number; reserved_quantity: number; reserved_cents?: number; image_url?: string };
export type Category = { id: string; name: string };
export type CartItem = { gift_id: string; quantity: number };
export const money = (cents: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
export const remaining = (gift: Gift) => Math.max(0, Math.min(gift.quantity - gift.purchased_quantity - gift.reserved_quantity, gift.target_cents === null ? Infinity : Math.ceil((gift.target_cents - gift.funded_cents - (gift.reserved_cents || 0)) / gift.price_cents)));
export const selectable = (gift: Gift) => gift.enabled && gift.available && remaining(gift) > 0;
export const unitPrice = (gift: Gift, quantity: number) => gift.target_cents === null ? gift.price_cents * quantity : Math.min(gift.price_cents * quantity, Math.max(0, gift.target_cents - gift.funded_cents - (gift.reserved_cents || 0)));
export function cartTotal(gifts: Gift[], items: CartItem[]) {
  return items.reduce((sum, item) => { const gift = gifts.find(g => g.id === item.gift_id); return sum + (gift ? unitPrice(gift, item.quantity) : 0); }, 0);
}
export type Transaction = { id: string; guest_name: string; email: string; anonymous: boolean; message: string | null; method: string; amount_cents: number; status: string; created_at: string; order_items: { gift_id: string; name: string; category: string | null; quantity: number; amount_cents: number }[] };
export const statusNames: Record<string, string> = { pending: "Pendente", paid: "Confirmado", failed: "Falhou", expired: "Expirado", refunded: "Reembolsado" };
export function financials(orders: Transaction[]) {
  const paid = orders.filter(o => o.status === "paid");
  const total = paid.reduce((n, o) => n + o.amount_cents, 0);
  const units = paid.reduce((n, o) => n + o.order_items.reduce((s, i) => s + i.quantity, 0), 0);
  return { received: total, confirmed: paid.length, pending: orders.filter(o => o.status === "pending").reduce((n, o) => n + o.amount_cents, 0), failed: orders.filter(o => o.status === "failed").length, refunded: orders.filter(o => o.status === "refunded").reduce((n, o) => n + o.amount_cents, 0), average: units ? Math.round(total / units) : 0 };
}
export const checkoutSchema = z.object({ name: z.string().trim().min(2).max(120), email: z.string().trim().email().max(255), message: z.string().trim().max(2000), anonymous: z.boolean(), method: z.enum(["pix", "card"]), items: z.array(z.object({ gift_id: z.string().uuid(), quantity: z.number().int().min(1).max(10000) })).min(1).max(30) });