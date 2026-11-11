import { supabase } from "@/integrations/supabase/client";

export async function wishlistApi<T>(action: string, payload: Record<string, unknown> = {}, admin = false): Promise<T> {
  const token = admin ? sessionStorage.getItem("couple-session") : null;
  const { data, error } = await supabase.functions.invoke(admin ? "wishlist-admin" : "wishlist", { body: { action, ...payload, ...(token ? { token } : {}) } });
  if (error) {
    let detail: { error?: string } | undefined;
    try { detail = await (error as { context?: Response }).context?.json(); } catch { /* no JSON */ }
    throw new Error(detail?.error || "Não foi possível concluir. Tente novamente.");
  }
  return data as T;
}