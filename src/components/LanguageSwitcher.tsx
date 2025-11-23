import React, { useState } from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "de", name: "DE", flag: "🇩🇪" },
    { code: "en", name: "EN", flag: "🇺🇸" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === language);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <Globe className="w-4 h-4 text-gray-300" />
        <span className="text-lg">{currentLanguage?.flag}</span>
        <span className="text-gray-300 font-medium text-sm">
          {currentLanguage?.name}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute top-full right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 min-w-[100px]">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full text-left px-3 py-2 flex items-center space-x-2 hover:bg-gray-700 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                  language === lang.code
                    ? "bg-purple-600 text-white"
                    : "text-gray-300"
                }`}
              >
                <span className="text-base">{lang.flag}</span>
                <span className="font-medium text-sm">{lang.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
