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
        setParticleWord(current);
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
      
      {/* --- Particle Background --- */}
      <div className="absolute inset-0 opacity-50 sm:opacity-70 lg:opacity-100">
        <ParticleSystem word={particleWord} />
      </div>

      {/* --- Content Container --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 mt-24 lg:mt-32 flex flex-col lg:block">
        
        {/* MOBILE LAYOUT: stack vertically */}
        <div className="flex flex-col lg:block text-center lg:text-left space-y-12 lg:space-y-0">
          
          {/* Header */}
          <h1 className="font-space-grotesk font-bold text-4xl sm:text-5xl lg:text-8xl leading-tight text-black mb-6 lg:mb-12 order-2 lg:order-1">
            <div className="block">Decode</div>
            <div className="block">
              <span className="inline-block min-w-[100px] lg:min-w-[150px] text-[#4DAAE9]">
                {currentWord}
                {showCursor && (
                  <span className="inline-block w-1.5 lg:w-2 h-8 sm:h-10 lg:h-20 bg-[#4DAAE9] align-middle ml-1 -mt-2 lg:-mt-4" />
                )}
              </span>
            </div>
            <div className="block">Data</div>
          </h1>

          {/* Blurb / Description */}
          <p className="text-base sm:text-lg lg:text-xl text-black leading-relaxed mb-10 lg:mb-20 max-w-3xl mx-auto lg:mx-0 font-normal order-3 lg:order-2">
            <span className="block">BHVRL specializes in fully managed advanced data analytics</span>
            <span className="block">to unlock the hidden value in your company’s data</span>
          </p>
        </div>
      </div>

      {/* --- Scroll Hint --- */}
      <div
        onClick={() => {
          document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' });
        }}
        className="cursor-pointer mt-10 lg:mt-20 flex justify-center text-sm text-gray-500"
      >
        Scroll to discover more ↓
      </div>
    </section>
  );
};
