import React, { useState } from 'react';
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

export const Gallery: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

 

  const cases = [
    {
      title: "Data Consumption Behaviour",
      description: "Quantified and uncovered key data consumption archtypes and their behavioural triggers for increasing usage leading to a ~22% increase in ARPU on targeted populations",
      country: "South Africa",
      industry: "Telecommunications",
      image: "https://raw.githubusercontent.com/peakxch/BHVRL/refs/heads/main/Media/Vodacom1.png"
    },
    {
      title: "Market Lifecycle Prediction",
      description: "Developed a sales lifecycle prediction for different products across key markets for data driven decisions for product pricing, marketing and channel allocations throughout their lifecycle",
      country: "Germany",
      industry: "Consumer Audio",
      image: "https://raw.githubusercontent.com/peakxch/BHVRL/refs/heads/main/Media/Sennheiser1.png"
    },
    {
      title: "Archetype Behavioural Insights",
      description: "Distilled the customer base transations into key behavioural archetypes and uncovered their behavioural triggers leading to an uplift of 12% in ARPU",
      country: "Romania",
      industry: "Credit Cards",
      image: "https://raw.githubusercontent.com/peakxch/BHVRL/refs/heads/main/Media/Credit1.png"
    },
    {
      title: "Innovation Framework",
      description: "Established R&D processes that accelerated product development by 60%.",
      country: "Innovation",
      industry: "South Africa",
      image: "https://raw.githubusercontent.com/peakxch/BHVRL/refs/heads/main/Media/SA.png"
    },
    {
      title: "Channel Pricing Stabilization",
      description: "Developed a pricing tool that used current channel sales, competitor pricing and vendor pricing to determine the best price given market conditions",
      country: "Germany",
      industry: "Consumer Audio",
      image: "https://raw.githubusercontent.com/peakxch/BHVRL/refs/heads/main/Media/Sennheiser2.png"
    }
  ];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? cases.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === cases.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="gallery" className="py-24 ">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center ">
          <h2 className="font-space-grotesk font-bold text-3xl lg:text-5xl text-black mb-6">
            Case Studies
          </h2>
        </div>

        <div className="relative">
          {/* Carousel Container */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {cases.map((case_study, index) => (
                <div
                  key={index}
                  className="min-w-full md:min-w-[50%] lg:min-w-[50%] px-4"
                >
                  <div className="group bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="aspect-video bg-gray-100 overflow-hidden">
                      <img
                        src={case_study.image}
                        alt={case_study.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-8">
                      <div className="text-l font-medium text-blue-500 mb-3">
                        {case_study.industry}
                      </div>
                      <div className="text-sm font-medium text-gray-400 mb-3">
                        {case_study.country}
                      </div>
                      <h3 className="font-space-grotesk font-semibold text-xl lg:text-2xl text-black mb-4">
                        {case_study.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-6">
                        {case_study.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-[#4192C5] p-2 rounded-full shadow-md hover:bg-[#3578a3] transition-colors duration-300"
            aria-label="Previous case study"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-[#4192C5] p-2 rounded-full shadow-md hover:bg-[#3578a3] transition-colors duration-300"
            aria-label="Next case study"
          >
            <ChevronRight size={24} className="text-white" />
          </button>
        </div>

        {/* Carousel Dots */}
        <div className="flex justify-center mt-6 space-x-2">
          {cases.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to case study ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
