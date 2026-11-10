import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const timelineEvents = [
  {
    year: "2019",
    title: "First Glance",
    description:
      "A chance meeting at a friend's gallery opening. Across the crowded room, their eyes met over champagne and whispered conversations about art.",
    image: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=600&q=80",
  },
  {
    year: "2020",
    title: "The First Date",
    description:
      "A quiet dinner at a candlelit bistro in the city. Hours passed like minutes as they discovered shared dreams and endless laughter.",
    image: "https://images.unsplash.com/photo-1559620192-032c4bc4674e?w=600&q=80",
  },
  {
    year: "2022",
    title: "Adventures Together",
    description:
      "From the cobblestone streets of Paris to the sunlit shores of Amalfi, every journey became more beautiful with each other.",
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&q=80",
  },
  {
    year: "2024",
    title: "The Proposal",
    description:
      "Under a canopy of stars at their favorite vineyard, he asked the question they both knew the answer to. She said yes.",
    image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&q=80",
  },
  {
    year: "2026",
    title: "Forever Begins",
    description:
      "This September, surrounded by those they love most, two become one. This is just the beginning of their greatest adventure.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
  },
];

const TimelineItem = ({
  event,
  index,
  isLast,
}: {
  event: (typeof timelineEvents)[0];
  index: number;
  isLast: boolean;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className={`flex flex-col md:flex-row gap-8 md:gap-16 items-center ${
        isEven ? "" : "md:flex-row-reverse"
      }`}
    >
      {/* Image */}
      <motion.div 
        className="w-full md:w-1/2 relative group"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="relative overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Decorative border */}
          <div className="absolute inset-0 border border-rose/20 m-4 pointer-events-none" />
        </div>
        {/* Year badge */}
        <motion.div 
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-background px-6 py-2 border border-border shadow-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
        >
          <span className="font-serif text-2xl text-rose">{event.year}</span>
        </motion.div>
      </motion.div>

      {/* Content */}
      <div className={`w-full md:w-1/2 text-center md:text-left ${isEven ? "" : "md:text-right"} pt-8 md:pt-0`}>
        <motion.h3 
          className="font-serif text-2xl md:text-3xl mb-4"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
        >
          {event.title}
        </motion.h3>
        <motion.p 
          className="text-muted-foreground leading-relaxed"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
        >
          {event.description}
        </motion.p>
      </div>
    </motion.div>
  );
};

const OurStory = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 bg-card">
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
            How It All Began
          </p>
          <h2 className="heading-elegant font-serif text-4xl md:text-5xl lg:text-6xl">
            Our Story
          </h2>
          <div className="divider-editorial mt-8" />
        </motion.div>

        {/* Quote */}
        <motion.blockquote
          initial={{ opacity: 0 }}
          animate={isHeaderInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-2xl mx-auto text-center mb-16 md:mb-24"
        >
          <p className="font-serif text-xl md:text-2xl italic text-muted-foreground leading-relaxed">
            "Whatever our souls are made of, his and mine are the same."
          </p>
          <cite className="block mt-4 text-sm tracking-wider uppercase text-muted-foreground/70 not-italic">
            — Emily Brontë
          </cite>
        </motion.blockquote>

        {/* Timeline with Photos */}
        <div className="max-w-5xl mx-auto space-y-16 md:space-y-24">
          {timelineEvents.map((event, index) => (
            <TimelineItem 
              key={event.year} 
              event={event} 
              index={index} 
              isLast={index === timelineEvents.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurStory;
