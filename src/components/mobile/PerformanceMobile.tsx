import React from "react";
import { PerformanceNetwork } from "./PerformanceParticleSystemMobile";

export const PerformanceMobile: React.FC = () => {
  return (
    <section className="relative flex flex-col items-center justify-start bg-white overflow-hidden min-h-screen px-8 py-20">
      {/* Header */}
      <div className="relative z-10 w-full max-w-md text-center">
        <h2 className="font-space-grotesk text-4xl font-bold text-black mb-8 leading-tight">
          Only Pay For{" "}
          <span className="relative inline-block text-[#4DAAE9] font-bold">
            Performance
            <span
              className="
                absolute bottom-0 left-0 h-[3px] bg-[#4DAAE9] 
                animate-underline
              "
            ></span>
          </span>
        </h2>

        {/* Blurb */}
        <p className="text-gray-700 text-lg leading-relaxed">
          Measurable success through impact. Every system deployed is tied
          directly to measurable business outcomes. Fees are tied to quantifiable impact.
        </p>
      </div>

      {/* Graph */}
      <div className="relative w-full h-[40vh] mt-5">
        <PerformanceNetwork />
      </div>
    </section>
  );
};
