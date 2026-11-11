import { z } from "npm:zod@3";
import { authorized, login, database, catalog, json, preflight } from "../_shared/wishlist.ts";
const giftSchema = z.object({ id: z.string().uuid().optional(), name: z.string().trim().min(2).max(120), description: z.string().max(1000), category_id: z.string().uuid().nullable(), price_cents: z.number().int().min(100).max(100000000), quantity: z.number().int().min(1).max(10000), target_cents: z.number().int().min(100).max(100000000).nullable(), enabled: z.boolean(), available: z.boolean(), image_path: z.string().regex(/^gifts\/[a-f0-9-]+\.(jpg|png|webp)$/).nullable(), sort_order: z.number().int().min(0).max(100000) });
Deno.serve(async req => {
  if (req.method === "OPTIONS") return preflight();
  if (req.method !== "POST") return json({ error: "Método inválido." }, 405);
  try {
    const input = await req.json();
    if (input.action === "login") {
      const parsed = z.string().min(1).max(200).safeParse(input.passcode);
      if (!parsed.success) return json({ error: "Informe a senha." }, 400);
      try { return json({ token: await login(parsed.data) }); } catch { return json({ error: "Senha incorreta." }, 401); }
    }
    if (!await authorized(input.token)) return json({ error: "Sua sessão expirou. Entre novamente." }, 401);
    const db = database();
    if (input.action === "catalog") return json(await catalog(true));
    if (input.action === "save") {
      const parsed = giftSchema.safeParse(input.gift);
      if (!parsed.success) return json({ error: "Confira os campos do presente." }, 400);
      const { id, ...gift } = parsed.data;
      if (gift.image_path) {
        const { data, error } = await db.storage.from("gift-images").download(gift.image_path);
        if (error || !data || data.size > 5 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp"].includes(data.type)) return json({ error: "Imagem inválida." }, 400);
      }
      const { error } = id ? await db.from("gifts").update(gift).eq("id", id) : await db.from("gifts").insert(gift);
      if (error) return json({ error: "Não foi possível salvar. Quantidade ou meta não pode ser menor que o já recebido." }, 400);
      return json({ saved: true });
    }
    if (input.action === "delete") {
      const id = z.string().uuid().parse(input.id);
      const { error } = await db.from("gifts").delete().eq("id", id);
      if (error) return json({ error: "Este presente tem pedidos; desative-o para preservar o histórico." }, 409);
      return json({ deleted: true });
    }
    if (input.action === "category-save") {
      const name = z.string().trim().min(2).max(80).parse(input.name);
      const id = z.string().uuid().optional().parse(input.id);
      const { error } = id ? await db.from("gift_categories").update({ name }).eq("id", id) : await db.from("gift_categories").insert({ name });
      if (error) return json({ error: "Essa categoria já existe." }, 400);
      return json({ saved: true });
    }
    if (input.action === "category-delete") {
      const { error } = await db.from("gift_categories").delete().eq("id", z.string().uuid().parse(input.id));
      if (error) throw error;
      return json({ deleted: true });
    }
    if (input.action === "upload") {
      const extension = z.enum(["jpg", "png", "webp"]).parse(input.extension);
      const path = `gifts/${crypto.randomUUID()}.${extension}`;
      const { data, error } = await db.storage.from("gift-images").createSignedUploadUrl(path);
      if (error) throw error;
      return json({ path, token: data.token });
    }
    if (input.action === "reports") {
      const { data, error } = await db.from("gift_orders").select("id,guest_name,email,message,anonymous,method,amount_cents,status,created_at,order_items:gift_order_items(gift_id,name,category,quantity,amount_cents)").order("created_at", { ascending: false });
      if (error) throw error;
      return json({ orders: data || [] });
    }
    return json({ error: "Ação inválida." }, 400);
  } catch { return json({ error: "Dados inválidos ou serviço indisponível." }, 400); }
});