import React, { useState } from 'react';
import { Media } from '../types';
import { useCatalog } from '../lib/useCatalog';
import { MediaCard } from '../components/ui/MediaCard';
import { FiChevronDown } from 'react-icons/fi';

interface AnimePageProps {
  onMediaClick: (media: Media) => void;
}

const SEASONS_LIST = ['الكل', 'Winter 2024', 'Spring 2024', 'Summer 2024', 'Fall 2024', 'Fall 2023', 'Winter 2023'];
const STATUS_LIST = [
  { id: 'all', label: 'الكل' },
  { id: 'ongoing', label: 'مستمر' },
  { id: 'completed', label: 'مكتمل' },
];

export const AnimePage: React.FC<AnimePageProps> = ({ onMediaClick }) => {
  const { media, genres } = useCatalog();
  const animeList = media.filter(m => m.type === 'anime');
  const ANIME_GENRES = genres.filter(g => [12, 13, 14, 15, 1, 6, 7, 9, 10].includes(g.id));
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedSeason, setSelectedSeason] = useState('الكل');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'rating' | 'newest' | 'views'>('rating');

  const filtered = animeList
    .filter(a => {
      const matchGenre = !selectedGenre || a.genres.some(g => g.id === selectedGenre);
      const matchSeason = selectedSeason === 'الكل' || a.season === selectedSeason;
      const matchStatus = selectedStatus === 'all' || a.status === selectedStatus;
      return matchGenre && matchSeason && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return b.year - a.year;
      return b.views - a.views;
    });

  return (
    <div className="bg-black min-h-screen pb-8">
      {/* Header */}
      <div className="px-4 pt-8 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">🎌</span>
          <h1 className="text-white font-black text-2xl">الأنمي</h1>
        </div>
        <p className="text-gray-500 text-sm">أفضل مجموعة أنمي ياباني</p>
      </div>

      {/* Trending anime */}
      <div className="mb-6">
        <div className="flex gap-3 overflow-x-auto px-4 pb-2">
          {animeList.filter(a => a.trending || a.featured).map(anime => (
            <div
              key={anime.id}
              className="relative flex-shrink-0 cursor-pointer active-scale"
              style={{ width: 200, height: 120 }}
              onClick={() => onMediaClick(anime)}
            >
              <img
                src={anime.backdrop}
                alt={anime.title}
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-xl" />
              <div className="absolute bottom-0 right-0 left-0 p-3">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-yellow-400 text-xs">⭐ {anime.rating}</span>
                  {anime.status === 'ongoing' && (
                    <span className="badge bg-green-600 text-white">مستمر</span>
                  )}
                </div>
                <p className="text-white text-xs font-bold line-clamp-1">{anime.titleAr || anime.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 space-y-3 mb-4">
        {/* Status */}
        <div className="flex gap-2">
          {STATUS_LIST.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedStatus(s.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ${
                selectedStatus === s.id ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-400 border border-white/10'
              }`}
            >
              {s.label}
            </button>
          ))}
          <div className="relative mr-auto">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-white/5 border border-white/10 text-gray-300 text-xs rounded-full px-3 py-2 appearance-none pr-8"
              style={{ fontFamily: 'Cairo, sans-serif', direction: 'rtl' }}
            >
              <option value="rating" style={{ background: '#111' }}>الأعلى تقييماً</option>
              <option value="newest" style={{ background: '#111' }}>الأحدث</option>
              <option value="views" style={{ background: '#111' }}>الأكثر مشاهدة</option>
            </select>
            <FiChevronDown className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
          </div>
        </div>

        {/* Genres */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedGenre(null)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold ${
              !selectedGenre ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-400'
            }`}
          >
            الكل
          </button>
          {ANIME_GENRES.map(g => (
            <button
              key={g.id}
              onClick={() => setSelectedGenre(selectedGenre === g.id ? null : g.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                selectedGenre === g.id ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-400'
              }`}
            >
              {g.nameAr}
            </button>
          ))}
        </div>

        {/* Seasons */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {SEASONS_LIST.map(s => (
            <button
              key={s}
              onClick={() => setSelectedSeason(s)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                selectedSeason === s ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="px-4">
        <p className="text-gray-600 text-xs mb-3">{filtered.length} أنمي</p>
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <span className="text-5xl">🎌</span>
            <p className="text-gray-500 mt-3">لا توجد نتائج</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {filtered.map(item => (
              <MediaCard key={item.id} media={item} onClick={onMediaClick} size="sm" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
