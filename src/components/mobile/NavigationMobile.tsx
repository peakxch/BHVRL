import React from 'react';
import { Menu, X } from 'lucide-react';

export const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="font-space-grotesk font-bold text-3xl tracking-tight">
            BHVRL
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-12">
      
            <a href="#contact" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition-colors duration-300">
              Contact
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
            
              <a href="#contact-mobile" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition-colors duration-300 text-center">
                Contact
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};