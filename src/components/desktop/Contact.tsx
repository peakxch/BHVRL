import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { Mail, Phone, MapPin } from 'lucide-react';
import ContactParticleSystem from './ContactParticleSystem';

export const Contact: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState(false);

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.current) return;

    setIsSending(true);

    emailjs
      .sendForm(
        'service_x2e65sh', // EmailJS service ID
        'template_wcwumzp', // EmailJS template ID
        form.current,
        'NRaXnDJrWfa_Sc0To' // EmailJS public key
      )
      .then(
        (result) => {
          console.log('Email sent successfully:', result.text);
          alert('Your message has been sent!');
          form.current?.reset();
        },
        (error) => {
          console.error('Error sending email:', error.text);
          alert('Failed to send your message. Please try again.');
        }
      )
      .finally(() => setIsSending(false));
  };

  return (
    <ContactParticleSystem>
      <section id="contact" className="py-16 lg:py-28 bg-transparent text-white w-full">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left column - contact form */}
            <div>
              <h2 className="font-space-grotesk font-bold text-3xl lg:text-5xl mb-8">
                Reach out for a free impact assessment
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed mb-12">
                See how BHVRL can unlock hidden value in your organization.
              </p>
              <form ref={form} onSubmit={sendEmail} className="space-y-6">
                <div>
                  <label htmlFor="user_name" className="block text-lg mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="user_name"
                    name="user_name"
                    required
                    className="w-full px-4 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="user_email" className="block text-lg mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="user_email"
                    name="user_email"
                    required
                    className="w-full px-4 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-lg mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    required
                    className="w-full px-4 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-4 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className={`${
                    isSending ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'
                  } text-white px-6 py-2 rounded transition-colors duration-300`}
                >
                  {isSending ? 'Sending...' : 'Submit'}
                </button>
              </form>
            </div>

            {/* Right column - contact info */}
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
