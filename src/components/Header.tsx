import React, { useState } from 'react';
import { Link, Menu, X } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '../contexts/LanguageContext';

export const Header: React.FC = () => {
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="relative z-50 w-full bg-gray-900/90 backdrop-blur-xl border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Link className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              dcs.lol
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('features')}
              className="text-gray-300 hover:text-purple-400 transition-colors duration-200 font-medium"
            >
              {t('features')}
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-gray-300 hover:text-purple-400 transition-colors duration-200 font-medium"
            >
              {t('about')}
            </button>
            <LanguageSwitcher />
            <button 
              onClick={scrollToTop}
              className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-6 py-2 rounded-full hover:from-purple-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {t('getStarted')}
            </button>
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <LanguageSwitcher />
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800 shadow-2xl">
            <nav className="px-4 py-6 space-y-4">
              <button 
                onClick={() => scrollToSection('features')}
                className="block w-full text-left text-gray-300 hover:text-purple-400 transition-colors duration-200 font-medium py-3 px-4 rounded-lg hover:bg-gray-800/50"
              >
                {t('features')}
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="block w-full text-left text-gray-300 hover:text-purple-400 transition-colors duration-200 font-medium py-3 px-4 rounded-lg hover:bg-gray-800/50"
              >
                {t('about')}
              </button>
              <button 
                onClick={scrollToTop}
                className="block w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg text-center"
              >
                {t('getStarted')}
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};