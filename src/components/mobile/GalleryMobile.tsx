// components/mobile/GalleryMobile.tsx
import React from "react";

export const GalleryMobile: React.FC = () => {
  // Example gallery data — replace with real case studies or visuals
  const galleryItems = [
    {
      title: "Customer Intelligence",
      description:
        "Behavioral patterns and segmentation powering customer engagement strategies that scale efficiently.",
      image: "/images/gallery1.jpg",
    },
    {
      title: "Predictive Analytics",
      description:
        "Transforming historical data into proactive, adaptive decision systems with measurable business outcomes.",
      image: "/images/gallery2.jpg",
    },
    {
      title: "Operational Insights",
      description:
        "Mapping behavioral drivers to operational processes for cost reduction, efficiency, and impact.",
      image: "/images/gallery3.jpg",
    },
  ];

  return (
    <section
      id="gallery-mobile"
      className="relative flex flex-col items-center justify-start bg-white min-h-[90vh] py-20 px-6"
    >
      {/* Section heading */}
      <div className="text-center mb-10">
        <h2 className="font-space-grotesk font-bold text-4xl text-black mb-3">
          Case Studies
        </h2>
        <p className="text-gray-700 text-base max-w-sm mx-auto leading-relaxed">
          A showcase of data-driven transformations powered by behavioral
          intelligence.
        </p>
      </div>

      {/* Gallery items */}
      <div className="flex flex-col items-center gap-10 w-full max-w-md">
        {galleryItems.map((item, i) => (
          <div
            key={i}
            className="w-full rounded-2xl overflow-hidden shadow-md bg-white transition-transform duration-500 hover:scale-[1.02]"
          >
            <div className="h-56 w-full overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="p-5 text-center">
              <h3 className="font-semibold text-2xl text-black mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
