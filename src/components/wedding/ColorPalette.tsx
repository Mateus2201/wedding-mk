import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { wedding } from "@/lib/wedding";

const ColorPalette = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="mt-20 md:mt-28 max-w-6xl mx-auto" aria-labelledby="palette-title">
      <div className="text-center mb-12">
        <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">Inspiração</p>
        <h3 id="palette-title" className="font-serif text-3xl md:text-4xl">Paleta de cores</h3>
        <div className="divider-editorial mt-6" />
      </div>
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
        {wedding.palette.map((c, i) => (
          <motion.li
            key={c.hex}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            className="bg-background border border-border flex flex-col"
          >
            <div
              className="aspect-square border-b border-border"
              style={{ backgroundColor: c.hex }}
              role="img"
              aria-label={`Cor ${c.name}`}
            />
            <div className="p-4 flex-1">
              <p className="font-serif text-lg leading-tight">{c.name}</p>
              <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground mt-1">{c.hex}</p>
              <p className="text-sm text-muted-foreground mt-3 leading-snug">{c.use}</p>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default ColorPalette;
