import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
type Props = { page: number; pages: number; onChange: (page: number) => void };
/** Page navigation shared by the guest wishlist and the couple's panel. Hidden when there is a single page. */
export default function GiftPagination({ page, pages, onChange }: Props) {
  if (pages <= 1) return null;
  return <nav aria-label="Páginas" className="flex flex-wrap items-center justify-center gap-1 mt-10"><Button size="icon" variant="ghost" aria-label="Página anterior" disabled={page === 1} onClick={() => onChange(page - 1)}><ChevronLeft /></Button>{Array.from({ length: pages }, (_, i) => i + 1).map(n => <Button key={n} size="icon" variant={n === page ? "default" : "ghost"} aria-current={n === page ? "page" : undefined} onClick={() => onChange(n)}>{n}</Button>)}<Button size="icon" variant="ghost" aria-label="Próxima página" disabled={page === pages} onClick={() => onChange(page + 1)}><ChevronRight /></Button></nav>;
}
