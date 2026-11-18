import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { priceRanges, type Category, type GiftFilter } from "@/lib/gifts";
type Props = { value: GiftFilter; onChange: (value: GiftFilter) => void; categories: Category[] };
/** Search, category and price-range filters shared by the guest wishlist and the couple's panel. */
export default function GiftFilters({ value, onChange, categories }: Props) {
  const set = (patch: Partial<GiftFilter>) => onChange({ ...value, ...patch });
  return <div className="flex flex-wrap items-center gap-3 border-y border-border py-5 mb-8"><div className="relative w-full md:w-72"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input aria-label="Buscar presentes" placeholder="Buscar presentes" value={value.query} onChange={e => set({ query: e.target.value })} className="pl-10" /></div><Button variant={value.category === "" ? "default" : "ghost"} onClick={() => set({ category: "" })}>Todos</Button>{categories.map(c => <Button key={c.id} variant={value.category === c.id ? "default" : "ghost"} onClick={() => set({ category: c.id })}>{c.name}</Button>)}<div className="flex flex-wrap gap-2 w-full pt-2"><span className="text-xs uppercase tracking-widest text-muted-foreground self-center mr-2">Faixa de preço</span>{priceRanges.map(r => <Button key={r.id} size="sm" variant={value.price === r.id ? "secondary" : "ghost"} onClick={() => set({ price: r.id })}>{r.label}</Button>)}</div></div>;
}
