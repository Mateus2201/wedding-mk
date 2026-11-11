import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link, useSearchParams } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CoupleAccess from "@/components/wedding/CoupleAccess";
import GiftsManager from "@/components/panel/GiftsManager";
import GiftReports from "@/components/panel/GiftReports";
import { wedding } from "@/lib/wedding";
import { supabase } from "@/integrations/supabase/client";

type Rsvp = {
  id: string; name: string; email: string; attending: boolean; party_size: number;
  dietary: string | null; message: string | null; created_at: string;
};
type Stats = { responses: number; attendingResponses: number; declined: number; totalGuests: number };
type Payload = { rsvps?: Rsvp[]; stats?: Stats; summary?: string };

function Attendance() {
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState<"list" | "ai" | null>("list");
  const [error, setError] = useState("");

  const load = async (summarize: boolean) => {
    setLoading(summarize ? "ai" : "list"); setError("");
    try {
      const { data: ok, error: fnError } = await supabase.functions.invoke("guest-summary", { body: { token: localStorage.getItem("couple-session"), summarize: summarize === true } });
      let data: Payload & { error?: string } = ok ?? {};
      if (fnError) { try { data = await (fnError as { context?: Response }).context?.json(); } catch { data = {}; } }
      if (data.error || fnError) { if (data.rsvps) setRsvps(data.rsvps); throw new Error(data.error || "Algo deu errado."); }
      if (data.rsvps) setRsvps(data.rsvps);
      if (data.stats) setStats(data.stats);
      if (data.summary) setSummary(data.summary);
    } catch (e) { setError(e instanceof Error ? e.message : "Algo deu errado."); }
    setLoading(null);
  };
  useEffect(() => { load(false); }, []);

  const cards = stats ? [
    ["Respostas", stats.responses], ["Convidados confirmados", stats.totalGuests],
    ["Confirmações", stats.attendingResponses], ["Não vão", stats.declined],
  ] : [];

  return (
    <div className="space-y-12">
      <div className="flex justify-end"><Button variant="outline" onClick={() => load(false)} disabled={loading !== null}>Atualizar</Button></div>
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
  );
}

function Panel() {
  const [params, setParams] = useSearchParams();
  const tab = params.get("aba") || "presencas";
  const logout = () => { localStorage.removeItem("couple-session"); window.location.reload(); };
  return (
    <main className="min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground">{wedding.monogram}</p>
            <h1 className="font-serif text-4xl md:text-5xl">Painel dos noivos</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild><Link to="/presentes">Ver lista pública</Link></Button>
            <Button variant="ghost" size="icon" title="Sair" aria-label="Sair" onClick={logout}><LogOut /></Button>
          </div>
        </header>
        <Tabs value={tab} onValueChange={(v) => setParams({ aba: v }, { replace: true })}>
          <TabsList className="mb-8 flex-wrap h-auto">
            <TabsTrigger value="presencas">Presenças</TabsTrigger>
            <TabsTrigger value="presentes">Presentes</TabsTrigger>
            <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
          </TabsList>
          <TabsContent value="presencas"><Attendance /></TabsContent>
          <TabsContent value="presentes"><GiftsManager /></TabsContent>
          <TabsContent value="relatorios"><GiftReports /></TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

export default function Painel() { return <CoupleAccess><Panel /></CoupleAccess>; }
