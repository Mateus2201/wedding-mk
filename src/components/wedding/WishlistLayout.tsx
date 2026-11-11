import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { wedding } from "@/lib/wedding";
import { LogOut } from "lucide-react";
import { createContext, useContext } from "react";
export const EmbeddedPanel = createContext(false);
export default function WishlistLayout({ children, admin = false }: { children: React.ReactNode; admin?: boolean }) {
  const navigate = useNavigate();
  const embedded = useContext(EmbeddedPanel);
  if (embedded) return <>{children}</>;
  return <main className="min-h-screen"><header className="border-b border-border"><div className="max-w-6xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-4"><Link to="/" className="font-serif text-2xl">{wedding.monogram}</Link><nav className="flex flex-wrap items-center gap-2"><Button variant="ghost" asChild><Link to="/presentes">Lista de presentes</Link></Button>{admin && <><Button variant="ghost" asChild><Link to="/painel?aba=presentes">Gerenciar presentes</Link></Button><Button variant="ghost" asChild><Link to="/painel?aba=relatorios">Relatórios</Link></Button><Button variant="ghost" asChild><Link to="/painel">Presenças</Link></Button><Button variant="ghost" size="icon" title="Sair" aria-label="Sair" onClick={() => { sessionStorage.removeItem("couple-session"); navigate("/painel"); window.location.reload(); }}><LogOut /></Button></>}</nav></div></header><div className="max-w-6xl mx-auto px-6 py-12 md:py-16">{children}</div></main>;
}