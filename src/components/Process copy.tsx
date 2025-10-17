import React from 'react';
import { ParticleIcon } from './ParticleIcon';

export const Process: React.FC = () => {
  const steps = [
    {
      icon: <ParticleIcon type="target" color="#4192C5" size={100} />,
      title: "Stage 1: Targeted Impact",
      description: "Value-rich opportunities are identified, a behavioral system is outlined, and action levers with measurable KPIs are defined"
    },
    {
      icon: <ParticleIcon type="settings" color="#4192C5" size={100} />,
      title: "Stage 2: Develop & Deploy",
      description: "Tailored behavioral engines are built, deployed, and seamlessly integrated into existing systems and processes"
    },
    {
      icon: <ParticleIcon type="activity" color="#4192C5" size={100} />,
      title: "Stage 3: Monitor & Optimize",
      description: "Impact is measured, systems are refined where needed, and performance-based fees align directly with uplift achieved"
    },
    {

      icon: <ParticleIcon type="refresh" color="#4192C5" size={100} />,
      title: "Stage 4: Sustain & Evolve",
      description: "Behavioral systems are continuously monitored, maintained, and adapted to ensure maximum impact"
    }
  ];

  return (
    <section id="process" className="py-20 lg:py-10 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16 lg:mb-12">
          <h2 className="font-space-grotesk font-bold text-3xl lg:text-5xl text-black mb-6">
            How We Work
          </h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="group">
              <div className="bg-white border-b border-gray-200 pb-8 hover:border-[#4DAAE9] transition-colors duration-300">
                <div className="flex items-start gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      {step.icon}
                    </div>
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="font-space-grotesk font-semibold text-xl lg:text-2xl text-black mb-4 group-hover:text-[#4DAAE9] transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed font-normal">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};