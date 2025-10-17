import React, { useState, useEffect } from 'react';
import { ParticleSystem } from './ParticleSystem';

export const Hero: React.FC = () => {
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

  const [showScrollHint, setShowScrollHint] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 40) setShowScrollHint(false);
      else setShowScrollHint(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const type = () => {
      const current = words[wordIndex];

      if (isWaiting) {
        if (blinkCount < 5) {
          setShowCursor((prev) => !prev);
          setBlinkCount(blinkCount + 1);
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
        setCurrentWord(current.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
        setTypingSpeed(150);
        setShowCursor(true);
      } else if (isDeleting && charIndex > 0) {
        setCurrentWord(current.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
        setTypingSpeed(100);
        setShowCursor(true);
      } else if (!isDeleting && charIndex === current.length) {
        setParticleWord(current);
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

    const timer = setTimeout(type, typingSpeed);
    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, wordIndex, typingSpeed, words, isWaiting, showCursor, blinkCount]);

  return (
    <section className="relative pt-16 lg:pt-24 bg-white overflow-hidden">
      <div className="absolute inset-0 opacity-00">
        <ParticleSystem word={particleWord} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 mt-32">
        <div className="max-w-4xl">
          <h1 className="font-space-grotesk font-bold text-5xl lg:text-8xl leading-tight text-black mb-12">
            <div className="block">Decode</div>
            <div className="block">
              <span className="inline-block min-w-[100px] lg:min-w-[150px] text-[#4DAAE9]">
                {currentWord}
                {showCursor && (
                  <span className="inline-block w-1.5 lg:w-2 h-12 lg:h-20 bg-[#4DAAE9] align-middle ml-1 -mt-2 lg:-mt-4" />
                )}
              </span>
            </div>
            <div className="block">Data</div>
          </h1>

          <p className="text-lg lg:text-xl text-black leading-relaxed mb-20 max-w-4xl font-normal">
            <span className="block">BHVRL specializes in complex data analytics</span>
            <span className="block">to unlock strategic and tactical decision-making—</span>
            <span className="block">driving revenue growth, optimizing costs, and uncovering insights.</span>
          </p>
        </div>
      </div>

      {/* Subtle scroll hint text */}
      <div
  onClick={() => {
    document.getElementById("process")?.scrollIntoView({ behavior: "smooth" });
  }}
  className={`cursor-pointer fixed inset-x-0 bottom-8 z-20 flex justify-center text-sm text-gray-500 transition-opacity duration-500 ${
    showScrollHint ? "opacity-100" : "opacity-0"
  }`}
>
  Scroll to discover more ↓
</div>
    </section>
  );
};