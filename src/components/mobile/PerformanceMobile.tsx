// components/mobile/PerformanceMobile.tsx
import React from "react";
import { PerformanceParticleSystemMobile } from "./PerformanceParticleSystemMobile";

export const PerformanceMobile: React.FC = () => {
  return (
    <section
      id="performance-mobile"
      className="relative flex flex-col items-center justify-center min-h-[90vh] bg-white overflow-hidden px-6 py-20"
    >
      {/* Particle background */}
      <div className="absolute inset-0 z-0">
        <PerformanceParticleSystemMobile />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-md">
        <h2 className="font-space-grotesk font-bold text-4xl text-black mb-6 leading-tight">
          Performance is <span className="text-[#4DAAE9]">Measured</span>
        </h2>

        <p className="text-gray-700 text-base leading-relaxed mb-8">
          BHVRL quantifies behavioral impact through adaptive analytics that
          track the measurable outcomes of actions and nudge systems —
          converting insight directly into growth.
        </p>

        <div className="flex flex-col items-center justify-center gap-4">
          <div className="bg-[#4DAAE9] text-white text-lg font-semibold py-3 px-10 rounded-full shadow-lg hover:bg-[#3b94cc] transition-all duration-300">
            See Impact
          </div>
          <p className="text-sm text-gray-600 italic">
            “Data tells you what happened. Behavior tells you what will.”
          </p>
        </div>
      </div>
    </section>
  );
};
