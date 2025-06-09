import React from 'react';
import { Link } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '../contexts/LanguageContext';

export const Header: React.FC = () => {
  const { t } = useLanguage();

  return (
    <header className="relative z-50 w-full bg-gray-900/90 backdrop-blur-xl border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Link className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              dcs.lol
            </span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-purple-400 transition-colors duration-200 font-medium">
              {t('features')}
            </a>
            <a href="#about" className="text-gray-300 hover:text-purple-400 transition-colors duration-200 font-medium">
              {t('about')}
            </a>
            <LanguageSwitcher />
            <button className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-6 py-2 rounded-full hover:from-purple-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              {t('getStarted')}
            </button>
          </nav>
          
          <div className="md:hidden flex items-center space-x-4">
            <LanguageSwitcher />
            <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-200">
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className="w-4 h-0.5 bg-gray-300 mb-1"></span>
                <span className="w-4 h-0.5 bg-gray-300 mb-1"></span>
                <span className="w-4 h-0.5 bg-gray-300"></span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};