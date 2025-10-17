import React from "react";
import { PerformanceNetwork } from "./PerformanceParticleSystem";


export const Performance: React.FC = () => {
  return (
    <section className="relative flex flex-col lg:flex-row items-center justify-between py-12 mb-20 bg-white overflow-hidden">
      {/* Left Side */}
      <div className="relative z-10 max-w-xl px-24 text-left">
        <h2 className="font-space-grotesk text-6xl font-bold text-black mb-12">
          Only Pay For{" "}

          <span className="relative inline-block text-[#4DAAE9] mt- font-bold">
  Performance
  <span
    className="
      absolute bottom-0 left-0 h-[4px] bg-[#4DAAE9] 
      animate-underline
    "
  ></span>
</span>

        </h2>
        <p className="text-gray-700 text-xl leading-relaxed">
          Measurable success through impact. Every system we deploy is tied
          directly to measurable business outcomes. Fees are tied to quantifiable impact.
        </p>
      </div>

      {/* Right Side */}
      <div className="relative w-full lg:w-1/2 h-[400px] mt-12 lg:mt-0 pl-10">
        <PerformanceNetwork />
        
      </div>
    </section>
  );
};
