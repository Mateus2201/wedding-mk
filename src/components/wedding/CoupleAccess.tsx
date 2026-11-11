import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { wishlistApi } from "@/lib/wishlist-api";
export default function CoupleAccess({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false), [passcode, setPasscode] = useState(""), [error, setError] = useState(""), [busy, setBusy] = useState(false);
  const enter = async (e: React.FormEvent) => { e.preventDefault(); setBusy(true); setError(""); try { const { token } = await wishlistApi<{ token: string }>("login", { passcode }, true); sessionStorage.setItem("couple-session", token); setPasscode(""); setReady(true); } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível entrar."); } finally { setBusy(false); } };
  // Saved tokens are checked by the server before the private page can display anything.
  const [checked, setChecked] = useState(false);
  if (!checked) { setChecked(true); if (sessionStorage.getItem("couple-session")) wishlistApi("catalog", {}, true).then(() => setReady(true)).catch(() => sessionStorage.removeItem("couple-session")); }
  if (ready) return <>{children}</>;
  return <main className="min-h-screen px-6 flex items-center justify-center"><form onSubmit={enter} className="max-w-sm w-full text-center space-y-6"><h1 className="font-serif text-4xl">Painel dos noivos</h1><Input type="password" aria-label="Senha do painel" placeholder="Senha" required value={passcode} onChange={e => setPasscode(e.target.value)} />{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<Button type="submit" disabled={busy} className="w-full">{busy ? "Entrando..." : "Entrar"}</Button><Link to="/" className="block underline text-sm text-muted-foreground">Voltar ao site</Link></form></main>;
}