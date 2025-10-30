import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import ContactParticleSystem from "./ContactParticleSystemMobile";

export const ContactMobile: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState({
    user_name: "",
    user_email: "",
    company: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    setIsSending(true);

    emailjs
      .sendForm(
        "service_x2e65sh",
        "template_wcwumzp",
        formRef.current,
        "NRaXnDJrWfa_Sc0To"
      )
      .then(
        () => {
          alert("Your message has been sent!");
          setForm({ user_name: "", user_email: "", company: "", message: "" });
        },
        (error) => {
          console.error("Error sending email:", error.text);
          alert("Failed to send your message. Please try again.");
        }
      )
      .finally(() => setIsSending(false));
  };

  return (
    <section
      id="contact-mobile"
      className="relative flex flex-col items-center justify-center min-h-[90vh] bg-black text-white px-6 py-20"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <ContactParticleSystem />
      </div>

      {/* Foreground */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center justify-center text-center">
        <h2 className="font-space-grotesk font-bold text-4xl mb-3 mt-3">
          Let’s Connect
        </h2>

        <p className="text-gray-300 text-base leading-relaxed mb-3">
          BHVRL offers free impact assessments to gauge how our solutions can
          drive value for your business.
        </p>

        <p className="text-white text-sm mb-4">
          Email us at{" "}
          <a
            href="mailto:claudio.wyss@bhvrl.ch"
            className="text-[#4DAAE9] underline hover:text-[#3b94cc]"
          >
            claudio.wyss@bhvrl.ch
          </a>{" "}
          or use the form below:
        </p>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-5 bg-black/80 border border-white/10 p-6 rounded-2xl shadow-lg relative z-20"
        >
          <input
            type="text"
            name="user_name"
            value={form.user_name}
            onChange={handleChange}
            placeholder="Name"
            required
            className="w-full bg-transparent border-b border-gray-500 text-white px-2 py-3 placeholder-gray-400 focus:outline-none focus:border-[#4DAAE9]"
          />

          <input
            type="email"
            name="user_email"
            value={form.user_email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full bg-transparent border-b border-gray-500 text-white px-2 py-3 placeholder-gray-400 focus:outline-none focus:border-[#4DAAE9]"
          />

          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="Company Name"
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
            disabled={isSending}
            className={`${
              isSending ? "bg-gray-500" : "bg-[#4DAAE9] hover:bg-[#3b94cc]"
            } text-white font-semibold py-3 rounded-full transition-all duration-300`}
          >
            {isSending ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
};
