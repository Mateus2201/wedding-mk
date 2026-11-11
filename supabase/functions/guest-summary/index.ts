import { createClient } from "npm:@supabase/supabase-js@2";
import { createResponsesCall } from "../_shared/responses.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Expose-Headers": "X-Lovable-AIG-Run-ID",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    const { passcode, summarize } = await req.json().catch(() => ({}));
    const expected = Deno.env.get("COUPLE_PASSCODE");
    if (!expected) return json({ error: "A senha do painel ainda não foi configurada." }, 500);
    if (typeof passcode !== "string" || passcode !== expected) return json({ error: "Senha incorreta." }, 401);

    const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: rsvps, error } = await db.from("rsvps").select("*").order("created_at", { ascending: false });
    if (error) throw error;

    const yes = rsvps.filter((r) => r.attending);
    const stats = {
      responses: rsvps.length,
      attendingResponses: yes.length,
      declined: rsvps.length - yes.length,
      totalGuests: yes.reduce((s, r) => s + (r.party_size || 1), 0),
    };
    if (!summarize) return json({ rsvps, stats });
    if (rsvps.length === 0) return json({ rsvps, stats, summary: "Ainda não há respostas para resumir." });

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return json({ error: "IA não configurada." }, 500);

    const lines = rsvps.map((r) =>
      `- ${r.name} | ${r.attending ? `vai, ${r.party_size} pessoa(s)` : "não vai"}` +
      (r.dietary ? ` | restrição: ${r.dietary}` : "") + (r.message ? ` | mensagem: ${r.message}` : ""));
    const prompt = `Casamento de Mateus & Katyelly em 21/12/2026, Guarda do Embaú (cerimônia 10:00, almoço 11:30). Prazo de confirmação: 6/12/2026.
Totais calculados: ${JSON.stringify(stats)}
Respostas:
${lines.join("\n")}

Escreva em português do Brasil um resumo prático para o planejamento dos noivos, em markdown curto com as seções:
**Números** (use exatamente os totais calculados), **Alimentação** (restrições agrupadas, com nomes e quantidades para o buffet), **Atenção** (pontos que exigem ação: grupos grandes, mensagens que pedem resposta, dados estranhos), **Próximos passos** (3 a 5 ações objetivas). Não invente convidados nem números.`;

    const { result } = createResponsesCall(
      req,
      { baseURL: "https://ai.gateway.lovable.dev/v1", apiKey, model: "openai/gpt-6-astra" },
      [{ role: "system", content: "Você é um assistente de planejamento de casamentos, objetivo e cuidadoso." }, { role: "user", content: prompt }],
    );
    let summary = "";
    try {
      summary = await result.text;
    } catch (e) {
      const status = (e as { statusCode?: number })?.statusCode ?? 500;
      const msg = status === 402 ? "Créditos de IA esgotados. Adicione créditos para gerar o resumo."
        : status === 429 ? "Muitas solicitações agora. Tente de novo em alguns minutos."
        : "Não foi possível gerar o resumo agora.";
      return json({ error: msg, rsvps, stats }, status);
    }
    if (!summary.trim()) return json({ error: "A IA não retornou um resumo.", rsvps, stats }, 502);
    return json({ rsvps, stats, summary });
  } catch (e) {
    console.error(e);
    return json({ error: "Erro inesperado." }, 500);
  }
});
