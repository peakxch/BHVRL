// components/mobile/ProcessMobile.tsx
import React, { useEffect, useState } from "react";
import { FlowParticleSystemMobile } from "./FlowParticleSystemMobile";

const BLURB_STYLE: React.CSSProperties = {
  position: "absolute",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
  width: "75vw",
  height: "60vh",
  borderRadius: "50% / 60%",
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  filter: "blur(18px)",
  pointerEvents: "none",
  zIndex: 1,
};

const TEXT_BOX_STYLE: React.CSSProperties = {
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  padding: "1rem 1.25rem",
  borderRadius: "1px",
  boxShadow: "0 0 50px 15px rgba(255, 255, 255, 0.6)",
  position: "relative",
  maxWidth: "90%",
  margin: "0 auto",
};

export const ProcessMobile: React.FC = () => {
  const words = ["Decision", "Action", "Insight"];
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setIndex((prev) => (prev + 1) % (words.length + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (index === words.length) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setIndex(0);
      }, 700);
      return () => clearTimeout(timeout);
    }
  }, [index, words.length]);

  return (
    <section
      id="process-mobile"
      className="relative flex flex-col items-center justify-center min-h-[90vh] bg-white overflow-hidden px-4 py-20"
    >
      {/* Background blur */}
      <div style={BLURB_STYLE} />

      {/* Particles */}
      <div className="absolute inset-0 z-0">
        <FlowParticleSystemMobile />
      </div>

      {/* Content */}
      <div
        className="relative z-10 flex flex-col items-center justify-center text-center"
        style={TEXT_BOX_STYLE}
      >
        <h2 className="font-space-grotesk font-bold text-4xl text-black mb-4 leading-tight flex flex-col items-center justify-center">
          <span className="block text-center mb-2">From Data</span>
          <span className="block text-center flex items-center justify-center">
            To&nbsp;
            <div
              className="overflow-hidden inline-block align-bottom"
              style={{
                height: "1.2em",
                width: "8rem",
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
                  transform: `translateY(-${index * 1.2}em)`,
                }}
              >
                {words.map((word, i) => (
                  <div
                    key={i}
                    className="text-[#4DAAE9] h-[1.2em] flex items-center justify-center"
                  >
                    {word}
                  </div>
                ))}
                <div className="text-[#4DAAE9] h-[1.2em] flex items-center justify-center">
                  {words[0]}
                </div>
              </div>
            </div>
          </span>
        </h2>

        <p className="text-gray-700 text-base leading-relaxed max-w-md mx-auto">
          BHVRL transforms data across your organisation into clear outputs
          and actionable systems that drive
          <strong> revenue growth</strong>, <strong> cost reduction</strong>,
          <strong> operational efficiency</strong> and <strong> deep insights</strong>.
        </p>
      </div>
    </section>
  );
};
