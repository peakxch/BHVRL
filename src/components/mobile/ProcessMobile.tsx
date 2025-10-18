import React, { useState, useEffect } from "react";
import { FlowParticleSystemMobile } from "./FlowParticleSystemMobile";

export const ProcessMobile: React.FC = () => {
  const words = ["Decision", "Action", "Insight"];
  const [currentWord, setCurrentWord] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const type = () => {
      const current = words[wordIndex];
      if (!isDeleting && charIndex < current.length) {
        setCurrentWord(current.substring(0, charIndex + 1));
        setCharIndex((c) => c + 1);
        setTypingSpeed(150);
      } else if (isDeleting && charIndex > 0) {
        setCurrentWord(current.substring(0, charIndex - 1));
        setCharIndex((c) => c - 1);
        setTypingSpeed(100);
      } else if (!isDeleting && charIndex === current.length) {
        setTimeout(() => setIsDeleting(true), 900);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    };
    const t = setTimeout(type, typingSpeed);
    return () => clearTimeout(t);
  }, [charIndex, isDeleting, wordIndex, typingSpeed, words]);

  return (
    <section
      id="process-mobile"
      className="relative flex flex-col justify-center bg-white overflow-hidden min-h-screen px-6 py-20"
    >
      {/* Particle background */}
      <div className="absolute inset-0 z-0">
        <FlowParticleSystemMobile />
      </div>

      {/* Frosted Glass Box (auto-sized to content) */}
      <div
        className="relative z-10 max-w-lg mx-auto  rounded-3xl text-left"
        style={{
        
          backdropFilter: "blur(26px) brightness(1.08)",
          WebkitBackdropFilter: "blur(26px) brightness(1.08)",
  
          // ✅ soft outer glow spreading outward
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          padding: "1rem 1rem",
          borderRadius: "1px",
          boxShadow: "0 0 60px 20px rgba(255, 255, 255, 0.7)",
        }}
      >
        <h2 className="font-space-grotesk font-bold text-5xl text-black leading-tight">
          From <span className="text-[#4DAAE9]">Data</span>
          <br />
          To{" "}
          <span
            className="text-[#4DAAE9] inline-block"
            style={{ minWidth: "12rem" }}
          >
            {currentWord}
          </span>
        </h2>

        <p className="text-base text-gray-700 mt-4 leading-relaxed">
          BHVRL transforms behavioral data into actionable intelligence that
          powers better outcomes across marketing, product, and innovation.
        </p>
      </div>
    </section>
  );
};
