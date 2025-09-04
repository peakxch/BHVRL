import React, { useState } from 'react';
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

export const Gallery: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const cases = [
    {
      title: "Retail Transformation",
      description: "Helped a legacy retailer increase online revenue by 340% through digital strategy.",
      category: "Digital Strategy",
      image: "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      title: "Market Expansion",
      description: "Guided a SaaS startup's successful entry into European markets.",
      category: "Growth Strategy",
      image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      title: "Organizational Restructure",
      description: "Redesigned operations for a manufacturing company, reducing costs by 25%.",
      category: "Operations",
      image: "https://images.pexels.com/photos/1181403/pexels-photo-1181403.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      title: "Innovation Framework",
      description: "Established R&D processes that accelerated product development by 60%.",
      category: "Innovation",
      image: "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=800"
    }
  ];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? cases.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === cases.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="gallery" className="py-20 lg:py-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16 lg:mb-18">
          <h2 className="font-space-grotesk font-bold text-3xl lg:text-5xl text-black mb-6">
            Case Studies
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Real challenges, measurable outcomes. Here's how we've helped 
            organizations achieve transformational results.
          </p>
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
                      <div className="text-sm font-medium text-blue-500 mb-3">
                        {case_study.category}
                      </div>
                      <h3 className="font-space-grotesk font-semibold text-xl lg:text-2xl text-black mb-4">
                        {case_study.title}
                      </h3>
                      <p className="text-gray-600 leading禁止
                        leading-relaxed mb-6">
                        {case_study.description}
                      </p>
                      <button className="flex items-center gap-2 text-black hover:text-blue-500 transition-colors duration-300 font-medium">
                        View case study
                        <ExternalLink size={16} />
                      </button>
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