import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import ContactParticleSystem from './ContactParticleSystemMobile';

const ContactMobile: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.current) {
      emailjs
        .sendForm(
          'service_x2e65sh', // Replace with your EmailJS service ID
          'template_wcwumzp', // Replace with your EmailJS template ID
          form.current,
          'NRaXnDJrWfa_Sc0To'  // Replace with your EmailJS public key
        )
        .then(
          (result) => {
            console.log('Email sent successfully:', result.text);
            alert('Your message has been sent!');
          },
          (error) => {
            console.error('Error sending email:', error.text);
            alert('Failed to send your message. Please try again.');
          }
        );
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Particle background */}
      <div className="absolute inset-0 z-0">
        <ContactParticleSystem>
          {/* we don’t pass children here, background only */}
        </ContactParticleSystem>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center justify-center text-center">
        <h2 className="font-space-grotesk font-bold text-4xl mb-3 mt-3">
          Let’s Connect
        </h2>
        <p className="text-gray-300 text-base max-w-sm mx-auto leading-relaxed mb-2">
          BHVRL offers free impact assessments to gauge how our solutions can drive value for your business.
        </p>
        <p className="text-white text-sm">
          Email us at{" "}
          <a
            href="mailto:info@bhvrl.com"
            className="text-[#4DAAE9] underline hover:text-[#3b94cc]"
          >
            claudio.wyss@bhvrl.ch
          </a>
        </p>
        <p className="text-white text-sm">Or use the form below</p>

        {/* Contact form */}
        <form
          ref={form}
          onSubmit={handleSubmit}
          className="space-y-4 w-full px-4"
        >
          <div>
            <label htmlFor="name" className="block text-sm mb-1 text-white">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="user_name"
              required
              className="w-full px-3 py-2 rounded bg-gray-800 text-white"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm mb-1 text-white">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="user_email"
              required
              className="w-full px-3 py-2 rounded bg-gray-800 text-white"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm mb-1 text-white">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              required
              className="w-full px-3 py-2 rounded bg-gray-800 text-white"
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-300 w-full"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactMobile;