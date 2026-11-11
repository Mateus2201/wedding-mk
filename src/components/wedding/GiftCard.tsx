import { Gift as GiftIcon, Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { money, remaining, selectable, type Gift } from "@/lib/gifts";
export default function GiftCard({ gift, selected = false, onSelect }: { gift: Gift; selected?: boolean; onSelect?: () => void }) {
  return <article className="border border-border rounded-sm overflow-hidden bg-card flex flex-col">
    {gift.image_url ? <img src={gift.image_url} alt={gift.name} className="w-full aspect-[4/3] object-cover" /> : <div className="aspect-[4/3] bg-secondary flex items-center justify-center"><GiftIcon className="w-12 h-12 text-muted-foreground" strokeWidth={1} /></div>}
    <div className="p-5 flex flex-col flex-1 gap-3">
      <h2 className="font-serif text-2xl break-words">{gift.name}</h2>
      <p className="text-sm text-muted-foreground break-words flex-1">{gift.description}</p>
      <p className="font-medium">{money(gift.price_cents)}{gift.target_cents !== null && <span className="text-xs text-muted-foreground"> / contribuição</span>}</p>
      {gift.target_cents !== null && <div><progress className="w-full h-1 accent-primary" value={gift.funded_cents} max={gift.target_cents} /><p className="text-xs text-muted-foreground mt-1">{money(gift.funded_cents)} de {money(gift.target_cents)}</p></div>}
      <p className="text-xs text-muted-foreground">{remaining(gift) > 0 ? `${remaining(gift)} disponível(is)` : gift.purchased_quantity >= gift.quantity || (gift.target_cents !== null && gift.funded_cents >= gift.target_cents) ? "Já presenteado" : "Indisponível"}</p>
      {onSelect && <Button variant={selected ? "secondary" : "default"} disabled={!selectable(gift)} onClick={onSelect}>{selected ? <Check /> : <Plus />}{selected ? "Selecionado" : selectable(gift) ? "Presentear" : "Indisponível"}</Button>}
    </div>
  </article>;
}