import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const GalleryMobile: React.FC = () => {
  const galleryItems = [
    {
      title: "Data Consumption Behaviour",
      description:
        "Quantified and uncovered key data consumption archtypes and their behavioural triggers for increasing usage leading to a ~22% increase in ARPU on targeted populations",
      country: "South Africa",
      industry: "Telecommunications",
      image:
        "https://raw.githubusercontent.com/peakxch/BHVRL/refs/heads/main/Media/Vodacom1.png",
    },
    {
      title: "Market Lifecycle Prediction",
      description:
        "Developed a sales lifecycle prediction for different products across key markets for data driven decisions for product pricing, marketing and channel allocations throughout their lifecycle",
      country: "Germany",
      industry: "Consumer Audio",
      image:
        "https://raw.githubusercontent.com/peakxch/BHVRL/refs/heads/main/Media/Sennheiser1.png",
    },
    {
      title: "Archetype Behavioural Insights",
      description:
        "Distilled the customer base transations into key behavioural archetypes and uncovered their behavioural triggers leading to an uplift of 12% in ARPU",
      country: "Romania",
      industry: "Credit Cards",
      image:
        "https://raw.githubusercontent.com/peakxch/BHVRL/refs/heads/main/Media/Credit1.png",
    },
    {
      title: "Billing Incentivization",
      description:
        "Derived deep insights into customer billing behaviour to firstly target better paying new customers and new ways of incentivizing existing billing leading to a 9% increase in on time payments and 24% increase in new customer on time payments",
      country: "South Africa",
      industry: "Solar Energy",
      image:
        "https://raw.githubusercontent.com/peakxch/BHVRL/refs/heads/main/Media/Wetility1.png",
    },
    {
      title: "Logistics Intelligence",
      description:
        "Used telematics devices to create a deep intelligence for mining aggregate logistics operating across Africa to prevent theft and ensure delivery time frames",
      country: "Africa",
      industry: "Logistics",
      image:
        "https://raw.githubusercontent.com/peakxch/BHVRL/refs/heads/main/Media/TrackSmart.png",
    },
    {
      title: "Channel Pricing Stabilization",
      description:
        "Developed a pricing tool that used current channel sales, competitor pricing and vendor pricing to determine the best price given market conditions",
      country: "Germany",
      industry: "Consumer Audio",
      image:
        "https://raw.githubusercontent.com/peakxch/BHVRL/refs/heads/main/Media/Sennheiser2.png",
    },
    {
      title: "Customer Evolution",
      description:
        "Created a hollistic understanding of how customers evolve into different usage and revenue segments and how to cultivate higher value customers through targeted marketing and stimulation",
      country: "Egypt",
      industry: "Telecommunications",
      image:
        "https://raw.githubusercontent.com/peakxch/BHVRL/refs/heads/main/Media/Etisalat1.png",
    },
    {
      title: "Fruit Bruising Prevention",
      description:
        "Using telematics and weather data to understand impacts along collection and transportation of fruit before packing and ripening operations leading to a 24% decrease in bruised fruits",
      country: "South Africa",
      industry: "Agriculture",
      image:
        "https://raw.githubusercontent.com/peakxch/BHVRL/refs/heads/main/Media/Parkd.png",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const total = galleryItems.length;

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % total);
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + total) % total);

  // Optional swipe gestures
  let startX = 0;
  const handleTouchStart = (e: React.TouchEvent) => {
    startX = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    if (endX - startX > 50) prevSlide();
    if (startX - endX > 50) nextSlide();
  };

  return (
    <section
      id="gallery-mobile"
      className="relative flex flex-col items-center justify-start bg-white min-h-[90vh] py-20 px-6"
    >
      {/* Section heading */}
      <div className="text-center mb-2">
        <h2 className="font-space-grotesk font-bold text-4xl text-black mb-3">
          Case Studies
        </h2>
      </div>

      {/* Carousel wrapper */}
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl shadow-md"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slide track */}
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {galleryItems.map((item, i) => (
            <div key={i} className="w-full flex-shrink-0">
              <div className="h-56 w-full overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  
                  className="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="p-6 text-center bg-white">
                <h3 className="font-semibold text-2xl text-black mb-2">
                  {item.title}

                </h3>
                <h4 className="font-semibold text-2l text-[#4DAAE9] mb-2">
                  {item.industry} - {item.country}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 shadow hover:bg-white transition"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 shadow hover:bg-white transition"
        >
          <ChevronRight className="w-6 h-6 text-gray-800" />
        </button>

        {/* Dots */}
        <div className="flex justify-center mt-6 space-x-2">
          {galleryItems.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === currentIndex
                  ? "bg-[#4DAAE9] scale-110"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
};
