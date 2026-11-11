import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Sparkles } from "lucide-react";
import theRoseGardenImage from "@/assets/therosegarden.jpg";
import { wedding } from "@/lib/wedding";
import ColorPalette from "./ColorPalette";

type WeddingEvent = {
  title: string;
  time: string | null;
  location: string;
  venue: string;
  address?: string;
  description: string;
  image: string;
};

const events: WeddingEvent[] = [
  {
    title: "A Cerimônia",
    time: wedding.ceremonyTime,
    location: wedding.venue,
    venue: `${wedding.city}, ${wedding.state}`,
    address: wedding.address,
    description:
      "Começamos o dia juntos enquanto trocamos nossos votos, rodeados pelas pessoas que mais importam para nós.",
    image: theRoseGardenImage,
  },
  {
    title: "O Almoço",
    time: wedding.lunchTime,
    location: "Local a confirmar",
    venue: `${wedding.city}, ${wedding.state}`,
    description:
      "Depois da cerimônia, seguimos juntos para um almoço de celebração.",
    image: "https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800&q=80",
  },
];

const EventCard = ({
  event,
  index,
}: {
  event: WeddingEvent;
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="group"
    >
      {/* Event Image */}
      <div className="relative overflow-hidden mb-0">
        <motion.img
          src={event.image}
          alt={event.title}
          className="w-full aspect-[16/10] object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {/* Time badge */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2">
          <span className="font-serif text-lg text-foreground">
            {event.time ?? "A confirmar"}
          </span>
        </div>
      </div>

      <div className="bg-background/50 border border-border/50 border-t-0 p-8 md:p-10 transition-all duration-500 hover:border-rose/30 hover:shadow-lg hover:shadow-rose/5">
        {/* Event Title */}
        <h3 className="font-serif text-2xl md:text-3xl mb-6 transition-colors duration-300 group-hover:text-rose/80">{event.title}</h3>

        {/* Location */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-muted-foreground transition-colors duration-300 group-hover:text-foreground/70">
            <MapPin className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-sm tracking-wide">{event.location}</span>
          </div>
        </div>

        {/* Venue */}
        <p className="font-serif italic text-lg text-foreground/80 mb-2">
          {event.venue}
        </p>
        {event.address && (
          <p className="text-sm text-muted-foreground mb-4">{event.address}</p>
        )}

        {/* Description */}
        <p className="text-muted-foreground leading-relaxed text-sm">
          {event.description}
        </p>
      </div>
    </motion.div>
  );
};

const EventDetails = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-24"
        >
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">
            A celebração
          </p>
          <h2 className="heading-elegant font-serif text-4xl md:text-5xl lg:text-6xl">
            Detalhes do evento
          </h2>
          <div className="divider-editorial mt-8" />
        </motion.div>

        {/* Date Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isHeaderInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mb-16"
        >
          <p className="font-serif text-2xl md:text-3xl">
            {wedding.dateLong}
          </p>
        </motion.div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {events.map((event, index) => (
            <EventCard key={event.title} event={event} index={index} />
          ))}
        </div>

        {/* Dress Code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16 md:mt-24"
        >
          <motion.div 
            className="inline-flex items-center gap-3 px-8 py-4 bg-accent/30 border border-border/50 hover:bg-accent/50 hover:border-rose/20 transition-all duration-500"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-4 h-4 text-rose" />
            </motion.div>
            <span className="text-sm tracking-[0.2em] uppercase">
              Traje: {wedding.dressCode}
            </span>
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-4 h-4 text-rose" />
            </motion.div>
          </motion.div>
        </motion.div>

        <ColorPalette />
      </div>
    </section>
  );
};

export default EventDetails;
