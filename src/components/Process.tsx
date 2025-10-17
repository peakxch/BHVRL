// Process.tsx
import React, { useEffect, useState } from "react";
import { FlowParticleSystem } from "./FlowParticleSystem";

// Style for the large, elliptical, fuzzy blurb background
const BLURB_STYLE: React.CSSProperties = {
  position: "absolute",
  left: "60%",
  top: "50%",
  transform: "translate(-50%, -50%)",
  width: "60vw",
  height: "70vh",
  borderRadius: "50% / 60%",
  backgroundColor: "rgba(255, 255, 255, 0.85)", 
  filter: "blur(20px)",
  pointerEvents: "none",
  zIndex: 1, // Below the particle canvas (zIndex: 2)
};

// Style for the focused text content box with a MORE fuzzy glow
const TEXT_BOX_STYLE: React.CSSProperties = {
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  padding: '1rem 1rem', 
  borderRadius: '1px', 
  boxShadow: '0 0 60px 20px rgba(255, 255, 255, 0.7)', 
  position: 'relative', 
  maxWidth: '48rem', // Increased maxWidth to allow more space for "From Data to"
  margin: '0 auto', // Center the narrower box
};


export const Process: React.FC = () => {
  const words = ["Decision", "Action", "Insight"];
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setIndex((prev) => (prev + 1) % (words.length + 1)); // +1 includes clone
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // After reaching the clone (last element), jump back instantly
    if (index === words.length) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false); // disable animation
        setIndex(0); // reset
      }, 700); // match duration
      return () => clearTimeout(timeout);
    }
  }, [index, words.length]);

  return (
    <section
      id="process"
      // CHANGED: Reverted to bg-white
      className="relative py-32 lg:py-26 lg:pb-30 bg-white overflow-hidden" 
    >
      {/* 1. Large, Fuzzy Blurb Background (Z-index 1) */}
      <div style={BLURB_STYLE} />

      {/* 2. Particle Canvas Background (Z-index 2) */}
      <div 
        className="absolute inset-0" 
        // CHANGED: Removed opacity-60 to make particles fully visible
        style={{ zIndex: 2 }} 
      >
        <FlowParticleSystem />
      </div>

      {/* 3. Text Content Container (Z-index 3) */}
      <div className="relative max-w-5xl mx-auto px-6 lg:px-12 flex items-center justify-center min-h-[70vh]" style={{ zIndex: 3 }}> 
        
        {/* FUZZY CONTENT BOX WRAPPER */}
        <div 
            className="text-center" 
            style={TEXT_BOX_STYLE}
        >
          {/* Text content moves inside the new box */}
          <h2 className="font-space-grotesk font-bold text-4xl lg:text-6xl text-black mb-8 flex justify-center items-center">
            <span style={{  minWidth: '26rem' }}>From Data To</span>

            {/* Word container */}
            <div
              className="overflow-hidden inline-block align-bottom"
              style={{
                height: "1.2em",
                width: "16rem", // Adjusted for inline fit
                lineHeight: "1.2em",
              }}
            >
              <div
                className={`${
                  isTransitioning
                    ? "transition-transform duration-700 ease-in-out"
                    : ""
                }`}
                style={{
                  transform: `translateY(-${index * 1.2}em)`, // upward movement
                }}
              >
                {words.map((word, i) => (
                  <div
                    key={i}
                    className="text-[#4DAAE9] h-[1.2em] flex items-center justify-start"
                  >
                    {word}
                  </div>
                ))}
                {/* Clone first word for seamless looping */}
                <div className="text-[#4DAAE9] h-[1.2em] flex items-center justify-start">
                  {words[0]}
                </div>
              </div>
            </div>
          </h2>

          <p className="text-gray-700 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed relative">
            Fully managed advanced analytics — transforming your
            data into clear outputs and actionable systems that drive <strong>revenue growth</strong>,{" "}
            <strong>cost reduction</strong>,{" "}
            <strong>operational efficiency &</strong> {" "}
            <strong>deep insights</strong>.
          </p>
        </div>
      </div>
      <div
  onClick={() => {
    document.getElementById("performance")?.scrollIntoView({ behavior: "smooth" });
  }}
  className="cursor-pointer mt-12 text-sm text-gray-500 text-center transition-opacity duration-500 hover:text-gray-700"
>

</div>
    </section>
  );
};