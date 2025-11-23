import React, { useEffect, useState } from 'react';
import { ExternalLink, Copy, Clock, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface RecentLink {
  id: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
}

export const LastUrl: React.FC = () => {
  const { t } = useLanguage();
  const [recentLinks, setRecentLinks] = useState<RecentLink[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    fetch('/api/recents')
      .then(res => res.json())
      .then(setRecentLinks)
      .catch(err => console.error('Fehler beim Laden der Links:', err));
  }, []);

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };

    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url.startsWith('http') ? url : `https://${url}`);
    } catch (err) {
      console.error('Copy-Fehler:', err);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + itemsPerPage >= recentLinks.length ? 0 : prev + itemsPerPage
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, recentLinks.length - itemsPerPage) : Math.max(0, prev - itemsPerPage)
    );
  };

  const visibleLinks = recentLinks.slice(0, 8);
  const showNavigation = false;

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-gray-900 to-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6">
            {t('recentTitle')}{' '}
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              {t('recentSubtitle')}
            </span>
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
            {t('recentDescription')}
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {showNavigation && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-700/80 transition-all duration-300 shadow-lg -ml-2 sm:-ml-6"
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-700/80 transition-all duration-300 shadow-lg -mr-2 sm:-mr-6"
                disabled={currentIndex + itemsPerPage >= recentLinks.length}
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-8">
            {visibleLinks.map((link, index) => (
              <div
                key={link.id}
                className="group bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:border-green-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-500/10"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'slideInUp 0.6s ease-out forwards'
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm truncate">{link.createdAt}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-green-400">
                    <TrendingUp className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-bold">{link.clicks}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{t('original')}</p>
                    <div className="text-gray-300 text-sm bg-gray-900/50 px-3 py-2 rounded-lg border border-gray-700/50 overflow-hidden">
                      <div className="truncate" title={link.originalUrl}>
                        {link.originalUrl}
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">{t('shortened')}</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 min-w-0">
                        <code className="block text-green-400 font-mono text-sm sm:text-base bg-gray-900/70 px-3 py-2 rounded-lg border border-green-500/30 truncate" title={link.shortUrl}>
                          {link.shortUrl}
                        </code>
                      </div>
                      <div className="flex space-x-2 flex-shrink-0">
                        <button
                          onClick={() => copyToClipboard(link.shortUrl)}
                          className="p-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-all duration-200 group-hover:scale-110"
                          title="Kopieren"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <a
                          href={link.shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-all duration-200 group-hover:scale-110"
                          title="Öffnen"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700/50">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{t('clicksToday')}</span>
                    <span className="text-green-400 font-bold">+{Math.floor(link.clicks * 0.1)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        {showNavigation && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.ceil(recentLinks.length / itemsPerPage) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * itemsPerPage)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  Math.floor(currentIndex / itemsPerPage) === index
                    ? 'bg-green-400 scale-125'
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <a href="/links" className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-2xl hover:shadow-green-500/25 transform hover:-translate-y-1">
            {t('showAll')}
          </a>
        </div>
      </div>
    </section>
  );
};