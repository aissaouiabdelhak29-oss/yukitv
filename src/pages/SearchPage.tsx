import React, { useState, useEffect, useRef } from 'react';
import { Media } from '../types';
import { allMedia } from '../data/mockData';
import { MediaCard } from '../components/ui/MediaCard';
import { IoSearch, IoClose } from 'react-icons/io5';
import { FiClock, FiTrendingUp } from 'react-icons/fi';

interface SearchPageProps {
  onMediaClick: (media: Media) => void;
}

const RECENT_SEARCHES_KEY = 'yuki_recent_searches';

function getRecentSearches(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]');
  } catch { return []; }
}

function saveSearch(query: string) {
  const recent = getRecentSearches().filter(s => s !== query);
  const updated = [query, ...recent].slice(0, 8);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
}

function removeSearch(query: string) {
  const updated = getRecentSearches().filter(s => s !== query);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
}

const trending = ['فارس الشفق', 'عالم الأسرار', 'العالم الجديد', 'ظلال الأبدية', 'الخط الأحمر'];

export const SearchPage: React.FC<SearchPageProps> = ({ onMediaClick }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Media[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>(getRecentSearches());
  const [isSearching, setIsSearching] = useState(false);
  const [activeType, setActiveType] = useState<'all' | 'movie' | 'series' | 'anime'>('all');
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debounceRef.current = setTimeout(() => {
      const q = query.trim().toLowerCase();
      const found = allMedia.filter(m => {
        const matchType = activeType === 'all' || m.type === activeType;
        const matchQuery =
          m.title.toLowerCase().includes(q) ||
          (m.titleAr && m.titleAr.includes(q)) ||
          (m.originalTitle && m.originalTitle.toLowerCase().includes(q)) ||
          m.genres.some(g => g.nameAr.includes(q) || g.name.toLowerCase().includes(q)) ||
          m.description.includes(q);
        return matchType && matchQuery;
      });
      setResults(found);
      setIsSearching(false);
      if (q.length > 1) {
        saveSearch(q);
        setRecentSearches(getRecentSearches());
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, activeType]);

  const handleMediaClick = (media: Media) => {
    onMediaClick(media);
  };

  const handleSuggestion = (suggestion: string) => {
    setQuery(suggestion);
  };

  const clearQuery = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  const removeRecent = (s: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeSearch(s);
    setRecentSearches(getRecentSearches());
  };

  const hasResults = query.trim() && results.length > 0;
  const noResults = query.trim() && !isSearching && results.length === 0;

  return (
    <div className="bg-black min-h-screen pb-28">
      {/* Search bar */}
      <div className="sticky top-0 z-30 bg-black/95 backdrop-blur-xl px-4 pt-4 pb-3 border-b border-white/5">
        <div className="relative flex items-center">
          <IoSearch className="absolute right-4 text-gray-400 z-10" size={18} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="ابحث عن فيلم، مسلسل، أنمي..."
            className="w-full bg-white/8 border border-white/10 rounded-2xl py-3 pr-12 pl-10 text-white placeholder-gray-500 text-sm outline-none focus:border-red-500 transition-colors"
            style={{ fontFamily: 'Cairo, sans-serif', direction: 'rtl' }}
          />
          {query && (
            <button
              onClick={clearQuery}
              className="absolute left-3 p-1 active:scale-90"
            >
              <IoClose className="text-gray-400" size={18} />
            </button>
          )}
        </div>

        {/* Type filter */}
        {query && (
          <div className="flex gap-2 mt-3 overflow-x-auto">
            {(['all', 'movie', 'series', 'anime'] as const).map(t => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeType === t ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-400'
                }`}
              >
                {{ all: 'الكل', movie: 'أفلام', series: 'مسلسلات', anime: 'أنمي' }[t]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading */}
      {isSearching && (
        <div className="px-4 pt-8 flex justify-center">
          <div className="flex gap-1.5">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      )}

      {/* No results */}
      {noResults && (
        <div className="flex flex-col items-center justify-center py-20">
          <span className="text-6xl mb-4">😕</span>
          <p className="text-white font-bold text-lg">لا توجد نتائج</p>
          <p className="text-gray-500 text-sm mt-1">لم نجد "{query}"</p>
          <p className="text-gray-600 text-xs mt-2">جرب كلمات مختلفة</p>
        </div>
      )}

      {/* Results */}
      {hasResults && (
        <div className="px-4 pt-4">
          <p className="text-gray-500 text-xs mb-4">{results.length} نتيجة</p>
          <div className="grid grid-cols-3 gap-3">
            {results.map(item => (
              <MediaCard
                key={item.id}
                media={item}
                onClick={handleMediaClick}
                size="sm"
                showType
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!query && (
        <div className="px-4 pt-4">
          {/* Recent searches */}
          {recentSearches.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FiClock className="text-gray-500" size={14} />
                  <h3 className="text-white font-bold text-sm">البحث الأخير</h3>
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem(RECENT_SEARCHES_KEY);
                    setRecentSearches([]);
                  }}
                  className="text-gray-500 text-xs active:text-gray-300"
                >
                  مسح الكل
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map(s => (
                  <div
                    key={s}
                    className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-2"
                  >
                    <button
                      className="text-gray-300 text-sm active:text-white"
                      onClick={() => handleSuggestion(s)}
                    >
                      {s}
                    </button>
                    <button onClick={e => removeRecent(s, e)}>
                      <IoClose className="text-gray-600" size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trending */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <FiTrendingUp className="text-red-500" size={14} />
              <h3 className="text-white font-bold text-sm">الأكثر بحثاً</h3>
            </div>
            <div className="space-y-0">
              {trending.map((t, i) => (
                <button
                  key={t}
                  onClick={() => handleSuggestion(t)}
                  className="w-full flex items-center gap-3 py-3 border-b border-white/5 active:bg-white/5 transition-colors"
                >
                  <span className="text-red-500 font-black text-sm w-5">{i + 1}</span>
                  <span className="text-gray-300 text-sm">{t}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick categories */}
          <div>
            <h3 className="text-white font-bold text-sm mb-3">استكشاف سريع</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { emoji: '🎬', label: 'أفلام', color: 'from-blue-900 to-blue-700' },
                { emoji: '📺', label: 'مسلسلات', color: 'from-purple-900 to-purple-700' },
                { emoji: '🎌', label: 'أنمي', color: 'from-pink-900 to-pink-700' },
                { emoji: '🔥', label: 'الأكثر مشاهدة', color: 'from-red-900 to-red-700' },
                { emoji: '⭐', label: 'الأعلى تقييماً', color: 'from-yellow-900 to-yellow-700' },
                { emoji: '🆕', label: 'الأحدث', color: 'from-green-900 to-green-700' },
              ].map(cat => (
                <button
                  key={cat.label}
                  onClick={() => handleSuggestion(cat.label)}
                  className={`bg-gradient-to-br ${cat.color} rounded-2xl p-4 text-right active:scale-95 transition-transform`}
                >
                  <div className="text-2xl mb-2">{cat.emoji}</div>
                  <div className="text-white font-bold text-sm">{cat.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
