import React from 'react';
import { ArrowRight, Mail, Phone, MapPin } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-20 lg:py-32 bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <div>
            <h2 className="font-space-grotesk font-bold text-3xl lg:text-5xl mb-8">
              Reach out for a free impact assessment
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-12">
              See how BHRVL can unlock hidden value in your organization
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Mail size={24} className="text-blue-400" />
                <span className="text-lg">hello@bhvrl.ch</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone size={24} className="text-blue-400" />
                <span className="text-lg">+41 (76) 2331 007</span>
              </div>
              <div className="flex items-center gap-4">
                <MapPin size={24} className="text-blue-400" />
                <span className="text-lg">Luzern, Switzerland & Cape Town, South Africa</span>
                <span className="text-lg"></span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 p-8 lg:p-12 rounded-lg">
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder=""
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder=""
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder=""
                />
              </div>
              
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder=""
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Tell us about your project or challenge..."
                />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded flex items-center justify-center gap-3 transition-all duration-300 hover:translate-y-[-1px] font-medium"
              >
                Send Message
                <ArrowRight size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};