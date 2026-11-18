import { useEffect, useState } from "react";
import type { CartItem } from "@/lib/gifts";

const KEY = "wedding-gift-cart";

function read(): CartItem[] {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter(i => typeof i?.gift_id === "string" && Number.isInteger(i?.quantity) && i.quantity > 0) : [];
  } catch { return []; }
}

export function clearCart() {
  try { sessionStorage.removeItem(KEY); } catch { /* storage unavailable */ }
}

/** Gift selection shared between the wishlist and the cart page for this browser tab. */
export function useCart() {
  const [cart, setCart] = useState<CartItem[]>(read);
  useEffect(() => { try { sessionStorage.setItem(KEY, JSON.stringify(cart)); } catch { /* storage unavailable */ } }, [cart]);
  return [cart, setCart] as const;
}
