import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { wedding } from "@/lib/wedding";
import countdownSand from "@/assets/countdown-sand.jpg";

const Countdown = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const weddingDate = new Date(wedding.dateISO);
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = weddingDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeBlocks = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <section ref={ref} className="relative py-32 md:py-40 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={countdownSand}
          alt="Areia na beira do mar"
          loading="lazy"
          width={1920}
          height={1088}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/45 to-background/85" />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-sm tracking-[0.3em] uppercase text-foreground mb-4">
            Contagem regressiva para
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
            O Grande Dia
          </h2>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block"
          >
            <Heart className="w-6 h-6 text-foreground/60 mx-auto mb-8" fill="currentColor" />
          </motion.div>
        </motion.div>

        {/* Countdown Blocks */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center items-center gap-4 md:gap-8 flex-wrap"
        >
          {timeBlocks.map((block, index) => (
            <motion.div
              key={block.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="bg-background/80 backdrop-blur-sm border border-foreground/15 px-6 py-6 md:px-10 md:py-8 min-w-[80px] md:min-w-[120px]"
            >
              <motion.span 
                className="block font-serif text-4xl md:text-6xl text-foreground mb-2"
                key={block.value}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {String(block.value).padStart(2, "0")}
              </motion.span>
              <span className="text-xs md:text-sm tracking-[0.2em] uppercase text-foreground/70">
                {block.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Date Reminder */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-serif text-xl md:text-2xl italic text-foreground mt-12"
        >
          {wedding.dateShort} • {wedding.venue}
        </motion.p>
      </div>
    </section>
  );
};

export default Countdown;
