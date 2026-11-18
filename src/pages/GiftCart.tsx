import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Gift as GiftIcon, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import WishlistLayout from "@/components/wedding/WishlistLayout";
import { wishlistApi } from "@/lib/wishlist-api";
import { useCart } from "@/lib/cart";
import { cartTotal, remaining, selectable, unitPrice, money, checkoutSchema, type Gift, type Category } from "@/lib/gifts";
type Catalog = { gifts: Gift[]; categories: Category[]; payment: { configured: boolean } };
export default function GiftCart() {
  const [catalog, setCatalog] = useState<Catalog | null>(null), [error, setError] = useState(""), [cart, setCart] = useCart(), [checkout, setCheckout] = useState(false), [busy, setBusy] = useState(false);
  const [guest, setGuest] = useState(() => { try { return { name: sessionStorage.getItem("wedding-guest-name") || "", email: sessionStorage.getItem("wedding-guest-email") || "", message: "", anonymous: false, method: "pix" as "pix" | "card" }; } catch { return { name: "", email: "", message: "", anonymous: false, method: "pix" as "pix" | "card" }; } });
  const load = () => { setError(""); wishlistApi<Catalog>("catalog").then(setCatalog).catch(e => setError(e.message)); };
  useEffect(load, []);
  const gifts = catalog?.gifts || [];
  // Drop gifts the couple removed from the list since they were selected.
  useEffect(() => { if (catalog) setCart(c => c.filter(i => catalog.gifts.some(g => g.id === i.gift_id))); }, [catalog, setCart]);
  const remove = (id: string) => setCart(c => c.filter(i => i.gift_id !== id));
  const change = (id: string, delta: number) => setCart(c => c.map(i => i.gift_id === id ? { ...i, quantity: i.quantity + delta } : i));
  const invalid = cart.some(i => { const g = gifts.find(g => g.id === i.gift_id); return !g || !selectable(g) || i.quantity > remaining(g); });
  const submit = async (e: React.FormEvent) => { e.preventDefault(); setError(""); const parsed = checkoutSchema.safeParse({ ...guest, items: cart }); if (!parsed.success || invalid) { setError("Confira seus dados e a disponibilidade dos presentes."); return; } setBusy(true); try { const result = await wishlistApi<{ checkoutUrl: string }>("checkout", { ...parsed.data, origin: window.location.origin }); const url = new URL(result.checkoutUrl); if (url.protocol !== "https:") throw new Error("Link de pagamento inválido."); window.location.assign(url.href); } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível continuar."); } finally { setBusy(false); } };
  return <WishlistLayout><div className="max-w-2xl mx-auto"><Button variant="ghost" asChild className="mb-6 -ml-4"><Link to="/presentes"><ArrowLeft />Voltar para a lista</Link></Button><h1 className="font-serif text-4xl md:text-5xl mb-8">Seus presentes</h1>
    {error && !checkout && <div role="alert" className="mb-6 text-destructive">{error} {!catalog && <Button variant="link" onClick={load}>Tentar novamente</Button>}</div>}
    {!catalog && !error ? <p className="text-muted-foreground">Carregando presentes...</p> : catalog && (cart.length === 0 ? <div className="text-center py-16 border-t border-border"><GiftIcon className="mx-auto h-12 w-12 text-muted-foreground mb-5" strokeWidth={1} /><p className="text-muted-foreground">Nenhum presente selecionado.</p><Button asChild className="mt-6"><Link to="/presentes">Escolher presentes</Link></Button></div> : <div className="border-t border-border">
      {cart.map(item => { const g = gifts.find(g => g.id === item.gift_id); if (!g) return null; const unavailable = !selectable(g) || item.quantity > remaining(g); return <div key={g.id} className="py-5 border-b border-border flex gap-4">{g.image_url && <img src={g.image_url} alt="" className="h-20 w-20 object-cover shrink-0" />}<div className="flex-1 min-w-0"><div className="flex items-start justify-between gap-2"><p className="break-words">{g.name}</p><Button size="icon" variant="ghost" title="Remover presente" aria-label={`Remover ${g.name}`} onClick={() => remove(g.id)}><Trash2 /></Button></div>{unavailable && <p className="text-xs text-destructive mt-1">Quantidade indisponível. Ajuste ou remova este presente.</p>}<div className="flex items-center justify-between mt-3"><div className="flex items-center"><Button size="icon" variant="outline" aria-label={`Diminuir ${g.name}`} disabled={item.quantity === 1} onClick={() => change(g.id, -1)}><Minus /></Button><span className="w-10 text-center">{item.quantity}</span><Button size="icon" variant="outline" aria-label={`Aumentar ${g.name}`} disabled={item.quantity >= remaining(g)} onClick={() => change(g.id, 1)}><Plus /></Button></div><span>{money(unitPrice(g, item.quantity))}</span></div></div></div>; })}
      <div className="flex justify-between py-6 text-lg font-medium"><span>Total</span><span>{money(cartTotal(gifts, cart))}</span></div>
      <div className="flex justify-end">
        <Button disabled={invalid} onClick={() => { setError(""); setCheckout(true); }}>Ir para o pagamento</Button>
      </div>
      {!catalog.payment.configured && <p className="text-xs text-muted-foreground mt-4">Os pagamentos ainda não foram ativados pelos noivos.</p>}
    </div>)}</div>
    <Dialog open={checkout} onOpenChange={setCheckout}><DialogContent className="max-h-[90dvh] overflow-y-auto"><DialogHeader><DialogTitle className="font-serif text-3xl">Um presente com carinho</DialogTitle></DialogHeader><form onSubmit={submit} className="space-y-4"><Label htmlFor="guest-name">Seu nome</Label><Input id="guest-name" required minLength={2} maxLength={120} value={guest.name} onChange={e => setGuest({ ...guest, name: e.target.value })} /><Label htmlFor="guest-email">E-mail</Label><Input id="guest-email" type="email" required maxLength={255} value={guest.email} onChange={e => setGuest({ ...guest, email: e.target.value })} /><Label htmlFor="guest-message">Mensagem aos noivos (opcional)</Label><Textarea id="guest-message" maxLength={2000} value={guest.message} onChange={e => setGuest({ ...guest, message: e.target.value })} /><div className="flex items-center gap-3"><Checkbox id="anonymous" checked={guest.anonymous} onCheckedChange={v => setGuest({ ...guest, anonymous: v === true })} /><Label htmlFor="anonymous">Prefiro contribuir anonimamente</Label></div><p className="text-xs text-muted-foreground">Seus dados ficam disponíveis apenas para os noivos.</p><p className="text-sm text-muted-foreground">Você escolhe Pix ou cartão na página segura da InfinitePay.</p><p className="font-medium">Total: {money(cartTotal(gifts, cart))}</p>{!catalog?.payment.configured && <p role="status" className="text-sm text-muted-foreground bg-muted p-4">Pagamentos ainda não configurados. Nenhuma cobrança ou reserva será criada.</p>}{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<Button type="submit" className="w-full" disabled={busy || !catalog?.payment.configured || invalid}>{busy ? "Continuando..." : "Ir para pagamento"}</Button></form></DialogContent></Dialog>
  </WishlistLayout>;
}
