import React from 'react';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-space-grotesk font-bold text-3xl lg:text-5xl text-black mb-12">
            Quantify the Intangible. Engineer the Measurable.
          </h2>
          
          <div className="w-24 h-px bg-gray-300 mx-auto mb-12"></div>
          
          <p className="text-lg lg:text-xl text-black leading-relaxed font-normal">
            At BHVRL, we believe quantitative approaches are king. Human behaviour is not mystery—it is a system. One that can be decoded, modeled, and acted upon. We distill behaviour into data-driven systems that uplift revenue, reduce waste, and inform strategic, operational, and tactical decisions.
          </p>
        </div>
      </div>
    </section>
  );
};