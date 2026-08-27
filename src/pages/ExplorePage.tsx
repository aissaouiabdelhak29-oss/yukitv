import React, { useState, useMemo } from 'react';
import { Media, MediaType } from '../types';
import { allMedia, genres } from '../data/mockData';
import { MediaCard } from '../components/ui/MediaCard';
import { FiFilter, FiChevronDown } from 'react-icons/fi';

interface ExplorePageProps {
  onMediaClick: (media: Media) => void;
}

const TYPE_TABS = [
  { id: 'all', label: 'الكل' },
  { id: 'movie', label: 'أفلام' },
  { id: 'series', label: 'مسلسلات' },
  { id: 'anime', label: 'أنمي' },
];

const SORT_OPTIONS = [
  { id: 'rating', label: 'الأعلى تقييماً' },
  { id: 'newest', label: 'الأحدث' },
  { id: 'views', label: 'الأكثر مشاهدة' },
  { id: 'title', label: 'الاسم أ-ي' },
];

const YEARS = Array.from({ length: 10 }, (_, i) => 2024 - i);

export const ExplorePage: React.FC<ExplorePageProps> = ({ onMediaClick }) => {
  const [activeType, setActiveType] = useState<'all' | MediaType>('all');
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'rating' | 'newest' | 'views' | 'title'>('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 12;

  const filtered = useMemo(() => {
    let items = [...allMedia];

    if (activeType !== 'all') {
      items = items.filter(m => m.type === activeType);
    }
    if (selectedGenre) {
      items = items.filter(m => m.genres.some(g => g.id === selectedGenre));
    }
    if (selectedYear) {
      items = items.filter(m => m.year === selectedYear);
    }

    switch (sortBy) {
      case 'rating': items.sort((a, b) => b.rating - a.rating); break;
      case 'newest': items.sort((a, b) => b.year - a.year); break;
      case 'views': items.sort((a, b) => b.views - a.views); break;
      case 'title': items.sort((a, b) => (a.titleAr || a.title).localeCompare(b.titleAr || b.title, 'ar')); break;
    }

    return items;
  }, [activeType, selectedGenre, selectedYear, sortBy]);

  const paginated = filtered.slice(0, page * perPage);
  const hasMore = paginated.length < filtered.length;

  const resetFilters = () => {
    setSelectedGenre(null);
    setSelectedYear(null);
    setSortBy('rating');
    setPage(1);
  };

  const activeFiltersCount = [selectedGenre, selectedYear, sortBy !== 'rating'].filter(Boolean).length;

  return (
    <div className="bg-black min-h-screen pb-28">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-black/95 backdrop-blur-xl border-b border-white/5">
        <div className="px-4 pt-4 pb-2">
          <h1 className="text-xl font-black text-white mb-3">استكشاف</h1>

          {/* Type tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {TYPE_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveType(tab.id as any); setPage(1); }}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 active:scale-95 ${
                  activeType === tab.id
                    ? 'bg-red-600 text-white'
                    : 'bg-white/5 text-gray-400 border border-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 px-4 pb-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
              showFilters || activeFiltersCount > 0
                ? 'bg-red-600 text-white'
                : 'bg-white/5 text-gray-400 border border-white/10'
            }`}
          >
            <FiFilter size={14} />
            <span>فلترة</span>
            {activeFiltersCount > 0 && (
              <span className="bg-white text-red-600 text-xs font-black rounded-full w-4 h-4 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Sort */}
          <div className="relative flex-1">
            <select
              value={sortBy}
              onChange={e => { setSortBy(e.target.value as any); setPage(1); }}
              className="w-full bg-white/5 border border-white/10 text-gray-300 text-sm rounded-xl px-3 py-2 appearance-none"
              style={{ fontFamily: 'Cairo, sans-serif', direction: 'rtl' }}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.id} value={o.id} style={{ background: '#1a1a1a' }}>{o.label}</option>
              ))}
            </select>
            <FiChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-red-400 text-xs font-semibold active:opacity-70"
            >
              إعادة
            </button>
          )}
        </div>

        {/* Expandable filters */}
        {showFilters && (
          <div className="px-4 pb-3 space-y-3 border-t border-white/5 pt-3">
            {/* Genres */}
            <div>
              <p className="text-gray-400 text-xs mb-2">التصنيف</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => { setSelectedGenre(null); setPage(1); }}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    !selectedGenre ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-400'
                  }`}
                >
                  الكل
                </button>
                {genres.map(g => (
                  <button
                    key={g.id}
                    onClick={() => { setSelectedGenre(selectedGenre === g.id ? null : g.id); setPage(1); }}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedGenre === g.id ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-400'
                    }`}
                  >
                    {g.nameAr}
                  </button>
                ))}
              </div>
            </div>

            {/* Year */}
            <div>
              <p className="text-gray-400 text-xs mb-2">السنة</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => { setSelectedYear(null); setPage(1); }}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    !selectedYear ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-400'
                  }`}
                >
                  الكل
                </button>
                {YEARS.map(y => (
                  <button
                    key={y}
                    onClick={() => { setSelectedYear(selectedYear === y ? null : y); setPage(1); }}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedYear === y ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-400'
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="px-4 py-3">
        <p className="text-gray-500 text-xs">{filtered.length} نتيجة</p>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <span className="text-6xl mb-4">🔍</span>
          <p className="text-gray-400 font-semibold">لا توجد نتائج</p>
          <p className="text-gray-600 text-sm mt-1">جرب تغيير الفلتر</p>
          <button onClick={resetFilters} className="mt-4 bg-red-600 text-white px-6 py-2 rounded-xl text-sm font-bold active:scale-95">
            إعادة الفلتر
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3 px-4">
            {paginated.map(item => (
              <MediaCard
                key={item.id}
                media={item}
                onClick={onMediaClick}
                size="sm"
                showType
              />
            ))}
          </div>

          {/* Load more */}
          {hasMore && (
            <div className="px-4 mt-6">
              <button
                onClick={() => setPage(p => p + 1)}
                className="w-full py-3 border border-white/10 rounded-xl text-gray-400 text-sm font-semibold active:bg-white/5 transition-colors"
              >
                تحميل المزيد ({filtered.length - paginated.length} متبقي)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
