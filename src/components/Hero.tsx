import React, { useState } from 'react';
import { Copy, ExternalLink, CheckCircle, AlertCircle, Zap } from 'lucide-react';

export const Hero: React.FC = () => {
  const [inputUrl, setInputUrl] = useState('');
  const [customId, setCustomId] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const validateDiscordUrl = (url: string): boolean => {
    const discordPatterns = [
      /^https:\/\/discord\.gg\/[a-zA-Z0-9]+$/,
      /^https:\/\/discord\.com\/invite\/[a-zA-Z0-9]+$/,
      /^discord\.gg\/[a-zA-Z0-9]+$/,
    ];
    return discordPatterns.some(pattern => pattern.test(url));
  };

  const shortenUrl = async () => {
    if (!inputUrl.trim()) {
      setError('Bitte gib eine Discord Invite URL ein');
      return;
    }

    if (!validateDiscordUrl(inputUrl)) {
      setError('Bitte gib eine gültige Discord Invite URL ein (discord.gg/... oder discord.com/invite/...)');
      return;
    }

    if (!customId.trim()) {
      setError('Bitte gib einen Wunsch-Link ein');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/shorten', {


  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ originalUrl: inputUrl, customId: customId }),
});


      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Unbekannter Fehler');

      setShortenedUrl(data.short);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortenedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Kopieren fehlgeschlagen:', err);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-blue-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-indigo-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-full px-6 py-3">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-gray-300 font-medium">Blitzschnell & Kostenlos</span>
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Discord Links
            </span>
            <br />
            <span className="text-white">verkürzen</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-16 max-w-4xl mx-auto leading-relaxed">
            Verwandle deine langen Discord Server Einladungen in kurze, elegante Links.{' '}
            <span className="text-purple-400 font-semibold"> Einfach. Schnell. Kostenlos.</span>
          </p>

          <div className="max-w-3xl mx-auto mb-20">
            <div className="bg-gray-800/40 backdrop-blur-2xl rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-700/50">
              <div className="space-y-6">
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="Discord Invite Link hier einfügen..."
                  className="w-full px-8 py-6 text-xl bg-gray-900/50 border-2 border-gray-600 rounded-2xl focus:border-purple-500 focus:outline-none transition-all duration-300 text-white placeholder-gray-400 backdrop-blur-sm"
                />
                <input
                  type="text"
                  value={customId}
                  onChange={(e) => setCustomId(e.target.value)}
                  placeholder="Wunsch-Link (z. B. meinserver)"
                  className="w-full px-8 py-6 text-xl bg-gray-900/50 border-2 border-gray-600 rounded-2xl focus:border-blue-500 focus:outline-none transition-all duration-300 text-white placeholder-gray-400 backdrop-blur-sm"
                />

                {error && (
                  <div className="flex items-center space-x-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  onClick={shortenUrl}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-6 px-8 rounded-2xl font-bold text-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Link wird erstellt...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-3">
                      <Zap className="w-6 h-6" />
                      <span>Link verkürzen</span>
                    </div>
                  )}
                </button>

                {shortenedUrl && (
                  <div className="mt-8 p-6 bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-2 border-green-500/30 rounded-2xl backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                        <span className="text-green-300 font-bold text-lg">Dein verkürzter Link:</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <code className="flex-1 p-4 bg-gray-900/70 rounded-xl text-purple-300 font-mono text-xl border border-gray-600">
                        {shortenedUrl}
                      </code>
                      <button
                        onClick={copyToClipboard}
                        className="p-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-200 shadow-lg hover:shadow-purple-500/25 transform hover:-translate-y-0.5"
                      >
                        {copied ? <CheckCircle className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                      </button>
                      <a
                        href={shortenedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-0.5"
                      >
                        <ExternalLink className="w-6 h-6" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-8 bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 group">
              <div className="text-4xl font-black text-purple-400 mb-3 group-hover:scale-110 transition-transform duration-300">100+</div>
              <div className="text-gray-300 text-lg">Links verkürzt</div>
            </div>
            <div className="text-center p-8 bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group">
              <div className="text-4xl font-black text-blue-400 mb-3 group-hover:scale-110 transition-transform duration-300">99.9%</div>
              <div className="text-gray-300 text-lg">Verfügbarkeit</div>
            </div>
            <div className="text-center p-8 bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 group">
              <div className="text-4xl font-black text-cyan-400 mb-3 group-hover:scale-110 transition-transform duration-300">∞</div>
              <div className="text-gray-300 text-lg">Kostenlos</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
