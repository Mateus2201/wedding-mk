import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <motion.div 
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80"
          alt="Romantic couple"
          className="w-full h-full object-cover object-center"
        />
        {/* Elegant overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      </motion.div>
      
      {/* Decorative elements with subtle animation */}
      <motion.div 
        className="absolute top-20 left-10 w-32 h-32 rounded-full bg-blush/20 blur-3xl"
        animate={{ 
          x: [0, 15, 0],
          y: [0, -10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-32 right-16 w-48 h-48 rounded-full bg-blush/20 blur-3xl"
        animate={{ 
          x: [0, -20, 0],
          y: [0, 15, 0],
          scale: [1, 1.15, 1]
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity, 
          ease: "easeInOut"
        }}
      />

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="space-y-8"
        >
          {/* Pre-title */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-sm tracking-[0.3em] uppercase text-white/80 font-sans"
          >
            Together with their families
          </motion.p>

          {/* Names */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="heading-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-serif text-white"
          >
            <span className="block">Olivia</span>
            <span className="block text-3xl sm:text-4xl md:text-5xl font-normal italic text-white/70 my-4">
              &
            </span>
            <span className="block">Sebastian</span>
          </motion.h1>

          {/* Divider with subtle shimmer */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="w-24 h-px bg-white/40 mx-auto my-12 relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                repeatDelay: 2,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          {/* Date */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="space-y-2"
          >
            <p className="text-lg tracking-[0.2em] uppercase font-sans text-white/70">
              September Fourteenth
            </p>
            <p className="font-serif text-2xl sm:text-3xl italic text-white">
              Two Thousand Twenty Six
            </p>
          </motion.div>

          {/* Location teaser */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-sm tracking-[0.15em] uppercase text-white/60 mt-8"
          >
            The Whitmore Estate • Napa Valley, California
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-px h-16 bg-gradient-to-b from-transparent via-white/50 to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
