import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { wedding } from "@/lib/wedding";
import heroVideo from "@/assets/hero-sea.mp4.asset.json";
import heroPoster from "@/assets/hero-sea-poster.jpg.asset.json";

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // iOS/Android só permitem autoplay se o vídeo estiver mudo e inline.
    // O React não renderiza o atributo `muted`, então garantimos aqui.
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    const tryPlay = () => {
      video.play().catch(() => {
        // Bloqueado (ex.: modo economia de energia) — tenta no primeiro toque.
        const onInteract = () => {
          video.play().catch(() => {});
          window.removeEventListener("touchstart", onInteract);
          window.removeEventListener("click", onInteract);
        };
        window.addEventListener("touchstart", onInteract, { once: true, passive: true });
        window.addEventListener("click", onInteract, { once: true });
      });
    };

    if (video.readyState >= 2) {
      tryPlay();
    } else {
      video.addEventListener("loadeddata", tryPlay, { once: true });
    }

    return () => video.removeEventListener("loadeddata", tryPlay);
  }, []);

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden py-24 sm:py-28">
      {/* Background Image with Parallax Effect */}
      <motion.div 
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <video
          ref={videoRef}
          src={heroVideo.url}
          preload="auto"
          poster={heroPoster.url}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          tabIndex={-1}
          className="w-full h-full object-cover object-center"
        />
        {/* Elegant overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/70" />
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
          className="space-y-6 sm:space-y-8"
        >
          {/* Pre-title */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xs sm:text-sm tracking-[0.3em] uppercase text-white/80 font-sans"
          >
            Junto com suas famílias
          </motion.p>

          {/* Names */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="heading-display text-5xl min-[380px]:text-6xl sm:text-7xl md:text-8xl lg:text-9xl 2xl:text-[10rem] font-serif text-white"
          >
            <span className="block great-vibes-regular">{wedding.partnerOne}</span>
            <span className="block great-vibes-regular text-3xl sm:text-4xl md:text-5xl text-white/70 my-2 sm:my-4">
              &
            </span>
            <span className="block great-vibes-regular">{wedding.partnerTwo}</span>
          </motion.h1>

          {/* Divider with subtle shimmer */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="w-24 h-px bg-white/40 mx-auto my-8 sm:my-12 relative overflow-hidden"
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
            <p className="text-sm sm:text-lg tracking-[0.15em] sm:tracking-[0.2em] uppercase font-sans text-white/70">
              {wedding.dateSpelledA}
            </p>
            <p className="font-serif text-2xl sm:text-3xl italic text-white">
              {wedding.dateSpelledB}
            </p>
          </motion.div>

          {/* Location teaser */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-xs sm:text-sm tracking-[0.15em] uppercase text-white/75 mt-8"
          >
            {wedding.locationLine}
          </motion.p>
        </motion.div>

      </div>
        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-6 hidden [@media(min-height:700px)]:block z-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-px h-16 bg-gradient-to-b from-transparent via-white/50 to-transparent"
          />
        </motion.div>
    </section>
  );
};

export default Hero;
