import React from 'react';
import { ParticleIcon } from './ParticleIcon';

export const Performance: React.FC = () => {
  const benefits = [
    {
      icon: <ParticleIcon type="magnifying_data" color="#4192C5" size={120} />,
      title: "Free Impact Quantification",
      description: "Analysis of your data to identify actionable value-rich opportunities"
    },

    {
      icon: <ParticleIcon type="impact_curve" color="#4192C5" size={120} />,
      title: "Impact Value-Based Fees",
      description: "Fees never exceed the measurable impact, postive ROI guaranteed"
    },
    {
      icon: <ParticleIcon type="network_nodes" color="#4192C5" size={120} />,
      title: "Outsourced Advanced Analytics",
      description: "We manage the complexity of algorithms & analytics"
    },
  ];

  return (
    <section className="py-20 lg:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16 lg:mb-2">
          <h2 className="font-space-grotesk font-bold text-3xl lg:text-5xl text-black mb-6">
            Only Pay for Performance
          </h2>
          <p className="text-lg lg:text-xl text-black leading-relaxed mb-4 max-w-4xl font-normal mx-auto">
            BHVRL specializes in developing, deploying and maintaining behavioral systems with performance related fees tied to measurable impact
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center group">
              <div className="flex justify-center mb-6">
                {benefit.icon}
              </div>
              <h3 className="font-space-grotesk font-semibold text-xl lg:text-2xl text-black mb-4">
                {benefit.title}
              </h3>
              <p className="text-gray-600 leading-relaxed font-normal">
                {benefit.description}
                
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};