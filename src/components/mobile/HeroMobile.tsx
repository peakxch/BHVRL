import React, { useState, useEffect } from 'react';
import { ParticleSystem } from '../desktop/ParticleSystem'; // ✅ uses original desktop particle system

export const HeroMobile: React.FC = () => {
  const words = ['Human', 'Product', 'Process', 'Usage', 'Transaction'];

  const [currentWord, setCurrentWord] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const [showCursor, setShowCursor] = useState(true);
  const [isWaiting, setIsWaiting] = useState(false);
  const [blinkCount, setBlinkCount] = useState(0);
  const [particleWord, setParticleWord] = useState('Human');

  useEffect(() => {
    const type = () => {
      const current = words[wordIndex];

      if (isWaiting) {
        if (blinkCount < 5) {
          setShowCursor((prev) => !prev);
          setBlinkCount((b) => b + 1);
          setTypingSpeed(300);
        } else {
          setIsWaiting(false);
          setIsDeleting(true);
          setBlinkCount(0);
          setTypingSpeed(100);
          setShowCursor(true);
        }
        return;
      }

      if (!isDeleting && charIndex < current.length) {
        setParticleWord(current);
        setCurrentWord(current.substring(0, charIndex + 1));
        setCharIndex((c) => c + 1);
        setTypingSpeed(150);
        setShowCursor(true);
      } else if (isDeleting && charIndex > 0) {
        setCurrentWord(current.substring(0, charIndex - 1));
        setCharIndex((c) => c - 1);
        setTypingSpeed(100);
        setShowCursor(true);
      } else if (!isDeleting && charIndex === current.length) {
        setIsWaiting(true);
        setBlinkCount(0);
        setTypingSpeed(300);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
        setCharIndex(0);
        setTypingSpeed(150);
        setShowCursor(true);
      }
    };

    const t = setTimeout(type, typingSpeed);
    return () => clearTimeout(t);
  }, [charIndex, isDeleting, wordIndex, typingSpeed, words, isWaiting, showCursor, blinkCount]);

  return (
    <section className="relative pt-12 bg-white overflow-hidden">
      {/* ---- Particle System ---- */}
      <div className="absolute top-0 left-0 w-full h-[40vh] sm:h-[50vh] mt-8 opacity-100 z-0">
        <ParticleSystem word={particleWord} />
      </div>

      {/* ---- Content ---- */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 mt-[40vh] sm:mt-56 flex flex-col">
        <div className="flex flex-col text-left space-y-6">
          <h1 className="font-space-grotesk font-bold text-5xl sm:text-5xl leading-tight text-black">
            <div className="block">Decode</div>
            <div className="block">
              <span className="inline-block min-w-[100px] text-[#4DAAE9]">
                {currentWord}
                {showCursor && (
                  <span className="inline-block w-1.5 h-8 bg-[#4DAAE9] align-middle ml-1 -mt-1" />
                )}
              </span>
            </div>
            <div className="block">Data</div>
          </h1>

          <p className="text-base sm:text-lg text-black leading-relaxed max-w-md mb-3">
            BHVRL specializes in fully managed advanced data analytics to unlock the hidden value in your company’s data.
          </p>
        </div>
      </div>

      {/* ---- Scroll Hint ---- */}
      <div
        onClick={() =>
          document.getElementById('process-mobile')?.scrollIntoView({ behavior: 'smooth' })
        }
        className="cursor-pointer mt-3 mb-22 flex justify-center text-sm text-gray-500"
      >
        Scroll to discover more ↓
      </div>
    </section>
  );
};
