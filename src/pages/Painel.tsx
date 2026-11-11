import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { wedding } from "@/lib/wedding";
import { wishlistApi } from "@/lib/wishlist-api";

type Rsvp = {
  id: string; name: string; email: string; attending: boolean; party_size: number;
  dietary: string | null; message: string | null; created_at: string;
};
type Stats = { responses: number; attendingResponses: number; declined: number; totalGuests: number };

const Painel = () => {
  const [passcode, setPasscode] = useState("");
  const [rsvps, setRsvps] = useState<Rsvp[] | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState<"list" | "ai" | null>(null);
  const [error, setError] = useState("");

  const load = async (summarize: boolean) => {
    setLoading(summarize ? "ai" : "list");
    setError("");
    const { data, error: fnError } = await supabase.functions.invoke("guest-summary", {
      body: { passcode, summarize },
    });
    let payload = data;
    if (fnError) {
      try { payload = await (fnError as { context?: Response }).context?.json(); } catch { payload = null; }
    }
    if (payload?.rsvps) {
      setRsvps(payload.rsvps); setStats(payload.stats);
      if (!sessionStorage.getItem("couple-session")) {
        try { const { token } = await wishlistApi<{ token: string }>("login", { passcode }, true); sessionStorage.setItem("couple-session", token); } catch { /* Gift pages request a fresh login if needed. */ }
      }
    }
    if (payload?.summary) setSummary(payload.summary);
    if (fnError || payload?.error) setError(payload?.error ?? "Algo deu errado.");
    setLoading(null);
  };

  if (!rsvps) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <form
          onSubmit={(e) => { e.preventDefault(); load(false); }}
          className="w-full max-w-sm text-center space-y-6"
        >
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground">{wedding.monogram}</p>
          <h1 className="font-serif text-4xl">Painel dos noivos</h1>
          <Input type="password" placeholder="Senha" value={passcode} onChange={(e) => setPasscode(e.target.value)} />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={!passcode || loading !== null}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
          <Link to="/" className="block text-sm text-muted-foreground underline">Voltar ao site</Link>
        </form>
      </main>
    );
  }

  const cards = stats ? [
    ["Respostas", stats.responses], ["Convidados confirmados", stats.totalGuests],
    ["Confirmações", stats.attendingResponses], ["Não vão", stats.declined],
  ] : [];

  return (
    <main className="min-h-screen py-16 px-6">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground">{wedding.monogram}</p>
            <h1 className="font-serif text-4xl md:text-5xl">Painel dos noivos</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild><Link to="/painel/presentes">Gerenciar presentes</Link></Button>
            <Button variant="outline" asChild><Link to="/painel/relatorios">Relatórios</Link></Button>
            <Button variant="outline" onClick={() => load(false)} disabled={loading !== null}>Atualizar</Button>
          </div>
        </header>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map(([label, value]) => (
            <div key={label} className="border border-border p-6 bg-card">
              <p className="font-serif text-4xl">{value}</p>
              <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground mt-2">{label}</p>
            </div>
          ))}
        </section>

        <section className="border border-border p-6 md:p-8 bg-card space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-serif text-2xl">Resumo para o planejamento</h2>
            <Button onClick={() => load(true)} disabled={loading !== null || rsvps.length === 0}>
              {loading === "ai" ? "Gerando resumo..." : summary ? "Gerar de novo" : "Gerar resumo com IA"}
            </Button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {summary ? (
            <div className="prose prose-sm max-w-none text-foreground [&_strong]:text-foreground [&_li]:my-1 [&_ul]:list-disc [&_ul]:pl-5">
              <ReactMarkdown>{summary}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {rsvps.length === 0 ? "Ainda não há respostas." : "Gere um resumo com números, restrições alimentares e próximos passos."}
            </p>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-2xl">Respostas</h2>
          <div className="overflow-x-auto border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left">
                <tr>{["Nome", "Presença", "Pessoas", "Restrições", "Mensagem"].map((h) => <th key={h} className="p-3 font-medium">{h}</th>)}</tr>
              </thead>
              <tbody>
                {rsvps.map((r) => (
                  <tr key={r.id} className="border-t border-border align-top">
                    <td className="p-3"><p>{r.name}</p><p className="text-muted-foreground text-xs">{r.email}</p></td>
                    <td className="p-3">{r.attending ? "Vai" : "Não vai"}</td>
                    <td className="p-3">{r.attending ? r.party_size : "—"}</td>
                    <td className="p-3">{r.dietary ?? "—"}</td>
                    <td className="p-3 max-w-xs">{r.message ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Painel;
