import Navigation from "@/components/wedding/Navigation";
import Hero from "@/components/wedding/Hero";
import Marquee from "@/components/wedding/Marquee";
import OurStory from "@/components/wedding/OurStory";

import Countdown from "@/components/wedding/Countdown";
import EventDetails from "@/components/wedding/EventDetails";
import RSVPForm from "@/components/wedding/RSVPForm";
import Footer from "@/components/wedding/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* Hero Section with Background Photo */}
      <Hero />
      
      {/* Marquee */}
      <Marquee />
      
      {/* Our Story with Timeline Photos */}
      <section id="story">
        <OurStory />
      </section>
      
      
      {/* Countdown Timer with Photo Background */}
      <Countdown />
      
      {/* Event Details with Venue Photos */}
      <section id="details">
        <EventDetails />
      </section>
      
      {/* RSVP Form with Decorative Photo */}
      <section id="rsvp">
        <RSVPForm />
      </section>
      
      {/* Footer */}
      <Footer />
    </main>
  );
};

export default Index;
