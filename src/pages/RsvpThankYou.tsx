import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { wedding } from "@/lib/wedding";

const RsvpThankYou = () => {
  const [searchParams] = useSearchParams();
  const came = searchParams.get("vai") !== "nao";

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-xl mx-auto text-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Heart className="w-12 h-12 mx-auto mb-6 text-rose" />
        </motion.div>

        <h1 className="font-serif text-3xl md:text-4xl mb-4">
          {came ? "Presença confirmada!" : "Obrigado por avisar!"}
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          {came
            ? "Que alegria saber que teremos você conosco nesse dia tão especial!"
            : "Sentiremos sua falta, mas obrigado pelo carinho e por avisar."}
        </p>
        <p className="text-muted-foreground leading-relaxed mt-4">
          {came
            ? "Sua presença torna esse momento ainda mais inesquecível. Agradecemos de coração por fazer parte da nossa história! ♡"
            : "Agradecemos de coração por fazer parte da nossa história! ♡"}
        </p>

        <span className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-[0.65rem] tracking-[0.25em] uppercase text-muted-foreground mt-12">
          <Sparkles className="w-3 h-3" strokeWidth={1.5} />
          Um carinho especial
        </span>

        <p className="text-muted-foreground mt-5 leading-relaxed">
          Preparamos também uma lista de presentes para quem deseja contribuir
          com o início dessa nova etapa das nossas vidas. Cada gesto de carinho
          será recebido com muito amor e gratidão!
        </p>

        <Link
          to="/presentes"
          className="group inline-flex items-center justify-center gap-3 mt-9 border-b border-foreground/25 pb-1 text-xs md:text-sm tracking-[0.12em] md:tracking-[0.2em] uppercase hover:border-foreground/70"
        >
          Conhecer nossa lista de presentes
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>

        <p className="mt-14 text-xs tracking-[0.2em] uppercase text-muted-foreground">
          {wedding.partnerOne} & {wedding.partnerTwo} • {wedding.dateShort}
        </p>
        <Link
          to="/"
          className="inline-block mt-4 text-xs text-muted-foreground underline decoration-foreground/25 underline-offset-4 hover:text-foreground"
        >
          Voltar ao início
        </Link>
      </motion.div>
    </main>
  );
};

export default RsvpThankYou;
