// Process.tsx
import React, { useEffect, useState } from "react";
import { FlowParticleSystem } from "./FlowParticleSystem";
import { FlowParticleSystemMobile } from "./FlowParticleSystemMobile";

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
  zIndex: 1,
};

const TEXT_BOX_STYLE: React.CSSProperties = {
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  padding: "1rem 1rem",
  borderRadius: "1px",
  boxShadow: "0 0 60px 20px rgba(255, 255, 255, 0.7)",
  position: "relative",
  maxWidth: "48rem",
  margin: "0 auto",
};

export const Process: React.FC = () => {
  const words = ["Decision", "Action", "Insight"];
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      id="process"
      className="relative py-28 lg:py-26 lg:pb-30 bg-white overflow-hidden"
    >
      <div style={BLURB_STYLE} />

      <div className="absolute inset-0" style={{ zIndex: 2 }}>
        <FlowParticleSystem isMobile={isMobile} />
      </div>

      <div
        className={`relative max-w-5xl mx-auto px-6 lg:px-12 ${
          isMobile
            ? "flex flex-col items-center justify-center min-h-[90vh]"
            : "flex items-center justify-center min-h-[70vh]"
        }`}
        style={{ zIndex: 3 }}
      >
        <div className="text-center" style={TEXT_BOX_STYLE}>
          {/* Mobile = two lines; Desktop = original single line */}
          {isMobile ? (
            <h2 className="font-space-grotesk font-bold text-4xl lg:text-6xl text-black mb-6 flex flex-col items-center justify-center leading-tight">
              <span className="block text-center mb-2">From Data</span>
              <span className="block text-center flex items-center justify-center">
                To&nbsp;
                <div
                  className="overflow-hidden inline-block align-bottom"
                  style={{
                    height: "1.2em",
                    width: "10rem",
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
          ) : (
            <h2 className="font-space-grotesk font-bold text-4xl lg:text-6xl text-black mb-8 flex justify-center items-center">
              <span style={{ minWidth: "26rem" }}>From Data To</span>
              <div
                className="overflow-hidden inline-block align-bottom"
                style={{
                  height: "1.2em",
                  width: "16rem",
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
                      className="text-[#4DAAE9] h-[1.2em] flex items-center justify-start"
                    >
                      {word}
                    </div>
                  ))}
                  <div className="text-[#4DAAE9] h-[1.2em] flex items-center justify-start">
                    {words[0]}
                  </div>
                </div>
              </div>
            </h2>
          )}

          <p className="text-gray-700 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed relative ">
            BHRVL transforms the data across your organisation into clear outputs
            and actionable systems that drive
            <strong> revenue growth</strong>, <strong>cost reduction</strong>,{" "}
            <strong>operational efficiency &</strong> <strong>deep insights</strong>.
          </p>
        </div>
      </div>
    </section>
  );
};
