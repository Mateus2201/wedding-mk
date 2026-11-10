import { motion } from "framer-motion";

const Marquee = () => {
  const text = "Olivia & Sebastian • September 14, 2026 • Napa Valley • ";

  return (
    <div className="py-6 bg-accent/30 border-y border-border/30 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex"
      >
        <div className="animate-marquee-slow flex whitespace-nowrap">
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="text-sm tracking-[0.3em] uppercase text-muted-foreground mx-4"
            >
              {text}
            </span>
          ))}
        </div>
        <div className="animate-marquee-slow flex whitespace-nowrap" aria-hidden>
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="text-sm tracking-[0.3em] uppercase text-muted-foreground mx-4"
            >
              {text}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Marquee;
