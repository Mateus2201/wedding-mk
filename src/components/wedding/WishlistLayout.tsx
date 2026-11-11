import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { wedding } from "@/lib/wedding";
export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return <main className="min-h-screen"><header className="border-b border-border"><div className="max-w-6xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-4"><Link to="/" className="font-serif text-2xl">{wedding.monogram}</Link><nav className="flex flex-wrap items-center gap-2"><Button variant="ghost" asChild><Link to="/presentes">Lista de presentes</Link></Button></nav></div></header><div className="max-w-6xl mx-auto px-6 py-12 md:py-16">{children}</div></main>;
}
