import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Gift as GiftIcon, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import GiftCard from "@/components/wedding/GiftCard";
import GiftFilters from "@/components/wedding/GiftFilters";
import GiftPagination from "@/components/wedding/GiftPagination";
import WishlistLayout from "@/components/wedding/WishlistLayout";
import { wishlistApi } from "@/lib/wishlist-api";
import { useCart } from "@/lib/cart";
import { cartTotal, money, filterGifts, emptyFilter, GIFTS_PAGE_SIZE as PAGE_SIZE, type Gift, type Category, type GiftFilter } from "@/lib/gifts";
import { wedding } from "@/lib/wedding";
type Catalog = { gifts: Gift[]; categories: Category[]; payment: { configured: boolean } };
export default function Wishlist() {
  const [catalog, setCatalog] = useState<Catalog | null>(null), [error, setError] = useState(""), [filter, setFilter] = useState<GiftFilter>(emptyFilter), [cart, setCart] = useCart();
  const load = () => { setError(""); wishlistApi<Catalog>("catalog").then(setCatalog).catch(e => setError(e.message)); };
  useEffect(load, []);
  const gifts = catalog?.gifts || [];
  const [page, setPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);
  const filtered = filterGifts(gifts, filter);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  useEffect(() => setPage(1), [filter]);
  const goTo = (n: number) => { setPage(n); requestAnimationFrame(() => { const el = gridRef.current; if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 16, behavior: "smooth" }); }); };
  const toggle = (gift: Gift) => setCart(c => c.some(i => i.gift_id === gift.id) ? c.filter(i => i.gift_id !== gift.id) : [...c, { gift_id: gift.id, quantity: 1 }]);
  return <WishlistLayout><div className="text-center mb-12"><p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">{wedding.partnerOne} & {wedding.partnerTwo}</p><h1 className="font-serif text-4xl md:text-5xl">Lista de presentes</h1><p className="text-muted-foreground mt-5 max-w-lg mx-auto">Sua presença é o nosso maior presente. Para quem deseja nos presentear, uma seleção para a nossa vida a dois.</p></div>
    {error && <div role="alert" className="mb-6 text-destructive">{error} {!catalog && <Button variant="link" onClick={load}>Tentar novamente</Button>}</div>}
    {!catalog && !error ? <p className="text-center text-muted-foreground">Carregando presentes...</p> : <><GiftFilters value={filter} onChange={setFilter} categories={catalog?.categories || []} />
      {gifts.length === 0 ? <div className="text-center py-16"><GiftIcon className="mx-auto h-12 w-12 text-muted-foreground mb-5" strokeWidth={1} /><h2 className="font-serif text-3xl">Uma lista feita com carinho</h2><p className="text-muted-foreground mt-3">Os presentes ainda estão sendo escolhidos pelos noivos.</p><Button variant="link" asChild className="mt-5"><Link to="/">Voltar ao casamento</Link></Button></div> : <div><div ref={gridRef} className="scroll-mt-4"><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{visible.map(g => <GiftCard key={g.id} gift={g} selected={cart.some(i => i.gift_id === g.id)} onSelect={() => toggle(g)} />)}</div>{filtered.length === 0 && <p className="py-12 text-muted-foreground">Nenhum presente encontrado.</p>}<GiftPagination page={current} pages={pages} onChange={goTo} /></div></div>}</>}
    {cart.length > 0 && <Button asChild className="fixed bottom-5 right-5 z-40 rounded-full h-14 px-5 shadow-lg"><Link to="/presentes/carrinho" aria-label="Ver seus presentes"><ShoppingBag />{cart.length} · {money(cartTotal(gifts, cart))}</Link></Button>}
  </WishlistLayout>;
}