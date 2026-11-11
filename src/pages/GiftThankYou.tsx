import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import WishlistLayout from "@/components/wedding/WishlistLayout";
import { Button } from "@/components/ui/button";
import { wishlistApi } from "@/lib/wishlist-api";
import { statusNames } from "@/lib/gifts";
export default function GiftThankYou() {
  const [params] = useSearchParams(), [result, setResult] = useState<{ status: string; guest_name?: string } | null>(null), [error, setError] = useState("");
  useEffect(() => { const token = params.get("pedido"); if (!token) { setError("Pedido não informado."); return; } let active = true; const load = () => wishlistApi<{ status: string; guest_name?: string }>("status", { lookup_token: token }).then(r => { if (active) setResult(r); }).catch(e => { if (active) setError(e.message); }); load(); const timer = setInterval(load, 10000); return () => { active = false; clearInterval(timer); }; }, [params]);
  return <WishlistLayout><div className="max-w-xl mx-auto text-center py-12"><h1 className="font-serif text-4xl">{result?.status === "paid" ? `Obrigado, ${result.guest_name}!` : "Seu presente"}</h1><p className="text-muted-foreground mt-6">{error || (result?.status === "paid" ? "Seu pagamento foi confirmado. Obrigado por fazer parte da nossa vida a dois!" : result ? `Pagamento: ${statusNames[result.status] || result.status}.` : "Consultando confirmação do pagamento...")}</p><Button asChild variant="outline" className="mt-8"><Link to="/presentes">Voltar à lista</Link></Button></div></WishlistLayout>;
}