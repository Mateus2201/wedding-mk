import { describe, it, expect } from "vitest";
import { cartTotal, financials, remaining, selectable, type Gift, type Transaction } from "@/lib/gifts";
const gift: Gift = { id: "a", name: "Presente", description: "", category_id: null, price_cents: 12500, quantity: 3, purchased_quantity: 1, reserved_quantity: 1, target_cents: null, funded_cents: 0, enabled: true, available: true, image_path: null, sort_order: 0 };
describe("wishlist rules", () => {
  it("subtracts purchases and active reservations from remaining quantity", () => expect(remaining(gift)).toBe(1));
  it("does not select unavailable gifts", () => expect(selectable({ ...gift, available: false })).toBe(false));
  it("does not select disabled gifts", () => expect(selectable({ ...gift, enabled: false })).toBe(false));
  it("does not select fully purchased gifts", () => expect(selectable({ ...gift, purchased_quantity: 3 })).toBe(false));
  it("adds multiple gifts into one total", () => expect(cartTotal([gift, { ...gift, id: "b", price_cents: 20000 }], [{ gift_id: "a", quantity: 1 }, { gift_id: "b", quantity: 2 }])).toBe(52500));
  it("caps a contribution at the remaining target", () => expect(cartTotal([{ ...gift, target_cents: 30000, funded_cents: 25000 }], [{ gift_id: "a", quantity: 1 }])).toBe(5000));
  it("does not select fully funded gifts", () => expect(selectable({ ...gift, target_cents: 30000, funded_cents: 30000 })).toBe(false));
  it("counts confirmed records once and excludes pending or refunded from received", () => {
    const base = { guest_name: "Teste", email: "teste@example.com", anonymous: false, message: null, method: "pix", created_at: "2026-11-11", order_items: [{ gift_id: "a", name: "Presente", category: null, quantity: 2, amount_cents: 10000 }] };
    const orders: Transaction[] = [{ ...base, id: "1", amount_cents: 10000, status: "paid" }, { ...base, id: "2", amount_cents: 5000, status: "pending" }, { ...base, id: "3", amount_cents: 3000, status: "refunded" }];
    expect(financials(orders)).toEqual({ received: 10000, confirmed: 1, pending: 5000, failed: 0, refunded: 3000, average: 5000 });
  });
});