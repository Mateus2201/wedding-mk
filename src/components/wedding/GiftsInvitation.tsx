import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Gift, Sparkles } from "lucide-react";
import { wedding } from "@/lib/wedding";

const GiftsInvitation = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 md:py-28 bg-background border-t border-border/60">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-xl mx-auto text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-[0.65rem] tracking-[0.25em] uppercase text-muted-foreground">
            <Sparkles className="w-3 h-3" strokeWidth={1.5} />
            Um carinho especial
          </span>

          <div className="flex items-center justify-center gap-3 mt-8 mb-5">
            <span className="h-px w-8 bg-border" />
            <Gift className="w-5 h-5 text-rose" strokeWidth={1.25} />
            <span className="h-px w-8 bg-border" />
          </div>

          <h2 className="heading-elegant font-serif text-3xl md:text-4xl">
            Nosso cantinho de presentes
          </h2>

          <p className="text-muted-foreground mt-5 leading-relaxed">
            Ter vocês ao nosso lado nesse dia tão especial já é um presente
            enorme!
          </p>

          <p className="text-muted-foreground mt-4 leading-relaxed">
            Para quem deseja nos presentear e fazer parte da construção do
            nosso novo lar, preparamos um espaço especial onde é possível
            contribuir com qualquer valor, de forma simples e segura, via Pix
            ou cartão.
          </p>

          <Link
            to="/presentes"
            className="group inline-flex items-center justify-center gap-3 mt-9 border-b border-foreground/25 pb-1 text-xs md:text-sm tracking-[0.12em] md:tracking-[0.2em] uppercase hover:border-foreground/70"
          >
            Conhecer nosso espaço de presentes
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>

          <p className="text-xs text-muted-foreground/70 mt-6">
            {wedding.partnerOne} & {wedding.partnerTwo} • {wedding.dateShort}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default GiftsInvitation;
