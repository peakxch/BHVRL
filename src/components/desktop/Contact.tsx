import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import ContactParticleSystem from './ContactParticleSystem';

export const Contact: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.current) {
      emailjs
        .sendForm(
          'service_x2e65sh', // Replace with your EmailJS service ID
          'template_wcwumzp', // Replace with your EmailJS template ID
          form.current,
          'NRaXnDJrWfa_Sc0To' // Replace with your EmailJS public key
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
    <ContactParticleSystem>
      <section id="contact" className="py-16 lg:py-28 bg-transparent text-white w-full">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <div>
              <h2 className="font-space-grotesk font-bold text-3xl lg:text-5xl mb-8">
                Reach out for a free impact assessment
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed mb-12">
                See how BHRVL can unlock hidden value in your organization
              </p>
              <form ref={form} onSubmit={sendEmail} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-lg mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="user_name"
                    required
                    className="w-full px-4 py-2 rounded bg-gray-800 text-white"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-lg mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="user_email"
                    required
                    className="w-full px-4 py-2 rounded bg-gray-800 text-white"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-lg mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="w-full px-4 py-2 rounded bg-gray-800 text-white"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition-colors duration-300"
                >
                  Submit
                </button>
              </form>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Mail size={24} className="text-blue-400" />
                <span className="text-lg">claudio.wyss@bhvrl.ch</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone size={24} className="text-blue-400" />
                <span className="text-lg">+41 (76) 2331 007</span>
              </div>
              <div className="flex items-center gap-4">
                <MapPin size={24} className="text-blue-400" />
                <span className="text-lg">Luzern, Switzerland & Cape Town, South Africa</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ContactParticleSystem>
  );
};