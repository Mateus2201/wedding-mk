import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
export const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
export const preflight = () => new Response("ok", { headers: corsHeaders });
export function database() {
  const url = Deno.env.get("SUPABASE_URL"), key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) throw new Error("Serviço indisponível.");
  return createClient(url, key);
}
async function signature(value: string) {
  const secret = Deno.env.get("COUPLE_PASSCODE");
  if (!secret) throw new Error("Senha do painel não configurada.");
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return Array.from(new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value))), b => b.toString(16).padStart(2, "0")).join("");
}
function equal(a: string, b: string) { let result = a.length ^ b.length; for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ (b.charCodeAt(i) || 0); return result === 0; }
export async function login(passcode: string) {
  const expected = Deno.env.get("COUPLE_PASSCODE");
  if (!expected || !equal(passcode, expected)) throw new Error("Senha incorreta.");
  const payload = `${Date.now() + 4 * 60 * 60 * 1000}.${crypto.randomUUID()}`;
  return `${payload}.${await signature(payload)}`;
}
export async function authorized(token: unknown) {
  if (typeof token !== "string" || token.length > 200) return false;
  const [expiry, nonce, sig] = token.split(".");
  return Number(expiry) > Date.now() && typeof nonce === "string" && typeof sig === "string" && equal(sig, await signature(`${expiry}.${nonce}`));
}
export async function catalog(includeDisabled = false) {
  const db = database();
  let query = db.from("gifts").select("*").order("sort_order").order("created_at");
  if (!includeDisabled) query = query.eq("enabled", true);
  const [{ data: gifts, error }, { data: categories, error: categoryError }, { data: pending, error: pendingError }] = await Promise.all([query, db.from("gift_categories").select("*").order("name"), db.from("gift_orders").select("gift_order_items(gift_id,quantity,amount_cents)").eq("status", "pending")]);
  if (error || categoryError || pendingError) throw new Error("Não foi possível carregar os presentes.");
  const result = await Promise.all((gifts || []).map(async gift => {
    const held = (pending || []).flatMap(o => o.gift_order_items).filter(i => i.gift_id === gift.id);
    let image_url = "";
    if (gift.image_path) { const { data } = await db.storage.from("gift-images").createSignedUrl(gift.image_path, 3600); image_url = data?.signedUrl || ""; }
    return { ...gift, image_url, reserved_quantity: held.reduce((s, i) => s + i.quantity, 0), funded_cents: gift.funded_cents, reserved_cents: held.reduce((s, i) => s + i.amount_cents, 0) };
  }));
  return { gifts: result, categories: categories || [], payment: { configured: true, provider: "infinitepay", methods: ["pix", "card"] } };
}