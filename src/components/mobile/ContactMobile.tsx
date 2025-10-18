// components/mobile/ContactMobile.tsx
import React, { useState } from "react";
import ContactParticleSystem from "./ContactParticleSystemMobile"; // ✅ import your uploaded file

export const ContactMobile: React.FC = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    // Add backend or email service here
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section
      id="contact-mobile"
      className="relative flex flex-col items-center justify-center min-h-[90vh] bg-black text-white overflow-hidden px-6 py-20"
    >
      {/* Particle background */}
      <div className="absolute inset-0 z-0">
        <ContactParticleSystem>
          {/* we don’t pass children here, background only */}
        </ContactParticleSystem>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center justify-center text-center">
        <h2 className="font-space-grotesk font-bold text-4xl mb-3">
          Let’s Connect
        </h2>
        <p className="text-gray-300 text-base max-w-sm mx-auto leading-relaxed mb-8">
          We collaborate with forward-thinking teams to turn behavioral
          intelligence into measurable impact.
        </p>

        {/* Contact form */}
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-5 bg-black/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-lg"
        >
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            className="w-full bg-transparent border-b border-gray-500 text-white px-2 py-3 placeholder-gray-400 focus:outline-none focus:border-[#4DAAE9]"
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
            className="w-full bg-transparent border-b border-gray-500 text-white px-2 py-3 placeholder-gray-400 focus:outline-none focus:border-[#4DAAE9]"
          />

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your Message"
            rows={4}
            required
            className="w-full bg-transparent border-b border-gray-500 text-white px-2 py-3 placeholder-gray-400 focus:outline-none focus:border-[#4DAAE9]"
          />

          <button
            type="submit"
            className="bg-[#4DAAE9] text-white font-semibold py-3 rounded-full hover:bg-[#3b94cc] transition-all duration-300"
          >
            Send Message
          </button>
        </form>

        {/* Footer */}
        <p className="text-gray-400 text-sm mt-6">
          Or email us directly at{" "}
          <a
            href="mailto:info@bhvrl.com"
            className="text-[#4DAAE9] underline hover:text-[#3b94cc]"
          >
            info@bhvrl.com
          </a>
        </p>
      </div>
    </section>
  );
};
