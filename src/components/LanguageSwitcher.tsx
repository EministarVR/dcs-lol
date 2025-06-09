import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl hover:border-purple-500/50 transition-all duration-300 group-hover:bg-gray-700/50">
        <Globe className="w-4 h-4 text-gray-300 group-hover:text-purple-400 transition-colors duration-300" />
        <span className="text-gray-300 font-medium uppercase text-sm group-hover:text-white transition-colors duration-300">
          {language}
        </span>
      </button>
      
      <div className="absolute top-full right-0 mt-2 w-32 bg-gray-800/90 backdrop-blur-xl border border-gray-700 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
        <div className="p-2 space-y-1">
          <button
            onClick={() => setLanguage('de')}
            className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
              language === 'de' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <span className="text-lg">🇩🇪</span>
            <span className="font-medium">Deutsch</span>
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
              language === 'en' 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <span className="text-lg">🇺🇸</span>
            <span className="font-medium">English</span>
          </button>
        </div>
      </div>
    </div>
  );
};