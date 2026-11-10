import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const footerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  },
};

const Footer = () => {
  return (
    <footer className="py-16 md:py-24 bg-foreground text-background">
      <div className="container mx-auto px-6">
        {/* Monogram */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-4 mb-8">
            <span className="font-serif text-4xl md:text-5xl">O</span>
            <motion.div
              animate={{ 
                scale: [1, 1.15, 1],
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: "easeInOut"
              }}
            >
              <Heart className="w-5 h-5 text-rose" />
            </motion.div>
            <span className="font-serif text-4xl md:text-5xl">S</span>
          </div>

          <motion.p 
            className="font-serif text-xl md:text-2xl italic mb-2"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            September 14, 2026
          </motion.p>
          <motion.p 
            className="text-sm tracking-[0.2em] uppercase text-background/60"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Napa Valley, California
          </motion.p>

          <motion.div 
            className="w-16 h-px bg-background/20 mx-auto my-8"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />

          <motion.p 
            className="text-sm text-background/50"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Made with love for our forever
          </motion.p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
