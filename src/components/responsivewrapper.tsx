// ResponsiveWrapper.tsx
import React, { useEffect, useState } from "react";
import { Hero } from "./desktop/Hero";
import { Process } from "./desktop/Process";
import { Gallery } from "./desktop/Gallery";
import { Performance } from "./desktop/Performance";
import { Contact } from "./desktop/Contact";

import { HeroMobile } from "./mobile/HeroMobile";
import { ProcessMobile } from "./mobile/ProcessMobile";
import { GalleryMobile } from "./mobile/GalleryMobile";
import { PerformanceMobile } from "./mobile/PerformanceMobile";
import { ContactMobile } from "./mobile/ContactMobile";

export const ResponsiveWrapper: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {isMobile ? (
        <>
          <HeroMobile />
          <ProcessMobile />
          <GalleryMobile />
          <PerformanceMobile />
          <ContactMobile />
        </>
      ) : (
        <>
          <Hero />
          <Process />
          <Gallery />
          <Performance />
          <Contact />
        </>
      )}
    </>
  );
};
