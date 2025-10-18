import React, { useEffect, useState } from "react";

// Desktop components
import { Navigation } from "./components/desktop/Navigation";
import { Hero } from "./components/desktop/Hero";
import { Process } from "./components/desktop/Process";
import { Performance } from "./components/desktop/Performance";
import { Gallery } from "./components/desktop/Gallery";
import { Contact } from "./components/desktop/Contact";

// Mobile components
import { HeroMobile } from "./components/mobile/HeroMobile";
import { ProcessMobile } from "./components/mobile/ProcessMobile";
import { PerformanceMobile } from "./components/mobile/PerformanceMobile";
import { GalleryMobile } from "./components/mobile/GalleryMobile";
import { ContactMobile } from "./components/mobile/ContactMobile";

function App() {
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size and update on resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="snap-y snap-mandatory h-screen overflow-y-scroll">
      <Navigation />

      {/* Hero */}
      <section className="snap-start">
        {isMobile ? <HeroMobile /> : <Hero />}
      </section>

      {/* Process */}
      <section className="snap-start">
        {isMobile ? <ProcessMobile /> : <Process />}
      </section>

      {/* Performance */}
      <section className="snap-start">
        {isMobile ? <PerformanceMobile /> : <Performance />}
      </section>

      {/* Gallery */}
      <section className="snap-start">
        {isMobile ? <GalleryMobile /> : <Gallery />}
      </section>

      {/* Contact */}
      <section className="snap-start">
        {isMobile ? <ContactMobile /> : <Contact />}
      </section>
    </div>
  );
}

export default App;
