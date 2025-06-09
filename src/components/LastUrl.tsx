import React, { useEffect, useState } from 'react';
import { ExternalLink, Copy, Clock, TrendingUp } from 'lucide-react';
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

  useEffect(() => {
    fetch('https://dcs.lol/api/recents')
      .then(res => res.json())
      .then(setRecentLinks)
      .catch(err => console.error('Fehler beim Laden der Links:', err));
  }, []);

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url.startsWith('http') ? url : `https://${url}`);
    } catch (err) {
      console.error('Copy-Fehler:', err);
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            {t('recentTitle')}{' '}
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              {t('recentSubtitle')}
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t('recentDescription')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentLinks.map((link, index) => (
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
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{link.createdAt}</span>
                </div>
                <div className="flex items-center space-x-2 text-green-400">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-bold">{link.clicks}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">{t('original')}</p>
                  <p className="text-gray-300 text-sm truncate bg-gray-900/50 px-3 py-2 rounded-lg">
                    {link.originalUrl}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">{t('shortened')}</p>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 text-green-400 font-mono text-lg bg-gray-900/70 px-3 py-2 rounded-lg border border-green-500/30">
                      {link.shortUrl}
                    </code>
                    <button
                      onClick={() => copyToClipboard(link.shortUrl)}
                      className="p-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-all duration-200 group-hover:scale-110"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <a
                      href={link.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-all duration-200 group-hover:scale-110"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
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

        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-2xl hover:shadow-green-500/25 transform hover:-translate-y-1">
            {t('showAll')}
          </button>
        </div>
      </div>
    </section>
  );
};
