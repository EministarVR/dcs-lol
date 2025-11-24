import React, { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Copy, Search, ChevronLeft, ChevronRight, Link2, AlertCircle, RefreshCw } from 'lucide-react';

interface LinkItem {
  id: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
}

interface ApiResponse {
  items: LinkItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const Links: React.FC = () => {
  const [items, setItems] = useState<LinkItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'clicks' | 'id'>('createdAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [copiedShort, setCopiedShort] = useState('');

  const query = useMemo(() => new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    q,
    sortBy,
    order,
  }).toString(), [page, limit, q, sortBy, order]);

  // Initialize from URL and localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = parseInt(params.get('page') || '1', 10);
    const limParam = parseInt(params.get('limit') || '', 10);
    const limStored = parseInt(localStorage.getItem('links.limit') || '', 10);
    const lim = limParam || limStored || 20;
    const qParam = params.get('q') || '';
    const s = (params.get('sortBy') as any) || 'createdAt';
    const o = (params.get('order') as any) || 'desc';

    setPage(Number.isFinite(p) && p > 0 ? p : 1);
    setLimit(Math.min(100, Math.max(1, Number.isFinite(lim) ? lim : 20)));
    setQ(qParam);
    setSearchInput(qParam);
    if (s === 'clicks' || s === 'id' || s === 'createdAt') setSortBy(s);
    if (o === 'asc' || o === 'desc') setOrder(o);
  }, []);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setQ(searchInput), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Persist page size
  useEffect(() => {
    localStorage.setItem('links.limit', limit.toString());
  }, [limit]);

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit), q, sortBy, order });
    const url = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', url);
  }, [page, limit, q, sortBy, order]);

  useEffect(() => {
    const controller = new AbortController();
    setError('');
    setLoading(true);
    fetch(`/api/links?all=true&${query}`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) {
          const msg = await res.text().catch(() => '');
          throw new Error(msg || `Fehler ${res.status}`);
        }
        return res.json();
      })
      .then((data: ApiResponse) => {
        setItems(data.items);
        setPage(data.page);
        setLimit(data.limit);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      })
      .catch((e) => {
        setError(e?.message || 'Fehler beim Laden');
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [query, reloadKey]);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedShort(text);
      setTimeout(() => setCopiedShort(''), 1500);
    } catch {}
  };

  const truncate = (url: string, len = 48) => url.length > len ? url.slice(0, len - 1) + '…' : url;

  const changeSort = (key: 'createdAt' | 'clicks' | 'id') => {
    if (sortBy === key) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setOrder('desc');
    }
  };

  const getAriaSort = (key: 'createdAt' | 'clicks' | 'id') =>
    sortBy === key ? (order === 'asc' ? 'ascending' : 'descending') : 'none';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-black text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-8 right-20 w-96 h-96 bg-blue-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
            <Link2 className="w-6 h-6" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Alle Links</span>
          </h1>
        </div>

        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={searchInput}
                onChange={(e) => { setPage(1); setSearchInput(e.target.value); }}
                placeholder="Suchen nach ID oder URL..."
                className="w-full bg-gray-800/70 border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div className="flex gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-gray-800/70 border border-gray-700 rounded-xl px-3 py-2"
                aria-label="Sortieren nach"
              >
                <option value="createdAt">Neueste</option>
                <option value="clicks">Klicks</option>
                <option value="id">ID</option>
              </select>
              <select
                value={order}
                onChange={(e) => setOrder(e.target.value as any)}
                className="bg-gray-800/70 border border-gray-700 rounded-xl px-3 py-2"
                aria-label="Sortierreihenfolge"
              >
                <option value="desc">Absteigend</option>
                <option value="asc">Aufsteigend</option>
              </select>
              <select
                value={limit}
                onChange={(e) => { setPage(1); setLimit(parseInt(e.target.value)); }}
                className="bg-gray-800/70 border border-gray-700 rounded-xl px-3 py-2"
                aria-label="Items pro Seite"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <button
                onClick={() => setReloadKey((k) => k + 1)}
                className="inline-flex items-center gap-2 bg-gray-800/70 hover:bg-gray-700 border border-gray-700 rounded-xl px-3 py-2 transition"
                title="Neu laden"
                aria-label="Neu laden"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Neu laden</span>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-900/30 border border-red-500/30 text-red-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
            <div className="mt-0.5"><AlertCircle className="w-5 h-5 text-red-300" /></div>
            <div className="flex-1">
              <div className="font-semibold">Fehler beim Laden</div>
              <div className="text-sm opacity-90 break-all">{error}</div>
            </div>
            <button onClick={() => setReloadKey((k) => k + 1)} className="bg-red-800/40 hover:bg-red-800/60 border border-red-700/60 rounded-xl px-3 py-2 text-sm">Erneut versuchen</button>
          </div>
        )}

        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-800/60 text-gray-300 text-sm">
                  <th
                    className="text-left px-4 sm:px-6 py-3 cursor-pointer select-none"
                    onClick={() => changeSort('id')}
                    aria-sort={getAriaSort('id') as any}
                  >
                    Kurz-ID
                  </th>
                  <th className="text-left px-4 sm:px-6 py-3">Kurzlink</th>
                  <th className="text-left px-4 sm:px-6 py-3">Original URL</th>
                  <th
                    className="text-left px-4 sm:px-6 py-3 cursor-pointer select-none"
                    onClick={() => changeSort('clicks')}
                    aria-sort={getAriaSort('clicks') as any}
                  >
                    Klicks
                  </th>
                  <th
                    className="text-left px-4 sm:px-6 py-3 cursor-pointer select-none"
                    onClick={() => changeSort('createdAt')}
                    aria-sort={getAriaSort('createdAt') as any}
                  >
                    Erstellt
                  </th>
                  <th className="px-4 sm:px-6 py-3">Aktion</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="border-t border-gray-800/80">
                        <td colSpan={6} className="px-4 sm:px-6 py-4">
                          <div className="animate-pulse space-y-3">
                            <div className="h-4 bg-gray-700/60 rounded w-1/3"></div>
                            <div className="h-3 bg-gray-700/50 rounded w-2/3"></div>
                            <div className="h-3 bg-gray-700/40 rounded w-1/2"></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-400">Keine Links gefunden</td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id} className="border-t border-gray-800/80 hover:bg-gray-800/30">
                      <td className="px-4 sm:px-6 py-3 font-mono text-sm">{item.id}</td>
                      <td className="px-4 sm:px-6 py-3">
                        <a href={item.shortUrl} target="_blank" rel="noopener noreferrer" title={item.shortUrl}>
                          <code className="block text-green-400 font-mono text-sm sm:text-base bg-gray-900/70 px-3 py-2 rounded-lg border border-green-500/30 truncate">
                            {item.shortUrl}
                          </code>
                        </a>
                      </td>
                      <td className="px-4 sm:px-6 py-3 text-gray-300" title={item.originalUrl}>{truncate(item.originalUrl)}</td>
                      <td className="px-4 sm:px-6 py-3">{item.clicks}</td>
                      <td className="px-4 sm:px-6 py-3">{new Date(item.createdAt).toLocaleString()}</td>
                      <td className="px-4 sm:px-6 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => copy(item.shortUrl)}
                            className={`inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition ${copiedShort === item.shortUrl ? 'bg-green-700 hover:bg-green-600' : 'bg-gray-800 hover:bg-gray-700'}`}
                            title="Kurzlink kopieren"
                            aria-label="Kurzlink kopieren"
                          >
                            <Copy className="w-4 h-4" /> {copiedShort === item.shortUrl ? 'Kopiert' : 'Kopieren'}
                          </button>
                          <a href={item.shortUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs bg-purple-700 hover:bg-purple-600 px-3 py-1.5 rounded-lg" title="Kurzlink öffnen" aria-label="Kurzlink öffnen">
                            <ExternalLink className="w-4 h-4" /> Öffnen
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t border-gray-800/80 text-sm text-gray-300">
            <div>
              Seite {page} von {totalPages} • {total} Links
            </div>
            <div className="flex items-center gap-2">
              <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="disabled:opacity-40 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="disabled:opacity-40 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <a href="/" className="text-gray-400 hover:text-gray-200 underline">Zurück zur Startseite</a>
        </div>
      </div>
    </div>
  );
}

export default Links;
