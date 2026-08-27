import React, { useState, useEffect, useRef } from 'react';
import { Media } from '../types';
import {
  movies, series, animeList, featuredMedia,
  trendingMedia, topRatedMedia, allMedia
} from '../data/mockData';
import { useStore } from '../store/useStore';
import { SectionRow } from '../components/ui/SectionRow';
import { FiPlay, FiInfo, FiStar, FiBell } from 'react-icons/fi';

interface HomePageProps {
  onMediaClick: (media: Media) => void;
  onTabChange: (tab: string) => void;
}

// ============ Hero Banner ============
const HeroBanner: React.FC<{
  media: Media;
  onPlay: () => void;
  onDetails: () => void;
}> = ({ media, onPlay, onDetails }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full overflow-hidden" style={{ height: '65vw', maxHeight: 360 }}>
      {/* Image */}
      {!loaded && <div className="absolute inset-0 skeleton" />}
      <img
        src={media.backdrop}
        alt={media.title}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
      />

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

      {/* Top bar */}
      <div className="absolute top-0 right-0 left-0 flex items-center justify-between p-4 pt-5">
        {/* YUKI logo */}
        <div
          className="text-3xl font-black tracking-widest"
          style={{
            fontFamily: 'Cairo, sans-serif',
            background: 'linear-gradient(135deg, #e50914 0%, #ff6b6b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          YUKI
        </div>
        <button className="w-9 h-9 rounded-full glass flex items-center justify-center active:scale-90">
          <FiBell size={18} className="text-gray-300" />
        </button>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 right-0 left-0 p-4 pb-5">
        {/* Type + Genre badges */}
        <div className="flex items-center gap-2 mb-2">
          <span className={`badge ${media.type === 'movie' ? 'bg-blue-600' : media.type === 'anime' ? 'bg-pink-600' : 'bg-purple-600'} text-white`}>
            {media.type === 'movie' ? 'فيلم' : media.type === 'anime' ? 'أنمي' : 'مسلسل'}
          </span>
          {media.genres.slice(0, 2).map(g => (
            <span key={g.id} className="text-gray-400 text-xs">{g.nameAr}</span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-white font-black text-2xl leading-tight mb-2 drop-shadow-lg">
          {media.titleAr || media.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1">
            <FiStar size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-yellow-400 font-bold text-sm">{media.rating}</span>
          </div>
          <span className="text-gray-400 text-sm">{media.year}</span>
          {media.quality && (
            <span className="badge bg-yellow-500 text-black">{media.quality}</span>
          )}
          {media.duration && (
            <span className="text-gray-400 text-xs">{media.duration} دقيقة</span>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-300 text-xs leading-relaxed line-clamp-2 mb-4 max-w-xs">
          {media.description}
        </p>

        {/* Buttons */}
        <div className="flex gap-2.5">
          <button
            onClick={onPlay}
            className="flex items-center gap-2 bg-red-600 text-white font-bold px-6 py-2.5 rounded-2xl active:scale-95 transition-transform shadow-lg"
            style={{ boxShadow: '0 4px 20px rgba(229,9,20,0.4)' }}
          >
            <FiPlay className="fill-white" size={16} />
            <span>شاهد</span>
          </button>
          <button
            onClick={onDetails}
            className="flex items-center gap-2 glass text-white font-semibold px-5 py-2.5 rounded-2xl active:scale-95 transition-transform"
          >
            <FiInfo size={16} />
            <span>التفاصيل</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ============ Featured Carousel ============
const FeaturedCarousel: React.FC<{
  items: Media[];
  onPlay: (m: Media) => void;
  onDetails: (m: Media) => void;
}> = ({ items, onPlay, onDetails }) => {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % items.length);
    }, 6000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <div className="relative">
      <HeroBanner
        media={items[current]}
        onPlay={() => onPlay(items[current])}
        onDetails={() => onDetails(items[current])}
      />
      {/* Indicator dots */}
      <div className="absolute bottom-[70px] right-0 left-0 flex justify-center gap-1.5">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="rounded-full transition-all duration-400"
            style={{
              width: i === current ? 20 : 6,
              height: 4,
              background: i === current ? '#e50914' : 'rgba(255,255,255,0.3)',
            }}
          />
        ))}
      </div>
    </div>
  );
};

// ============ Anime Season Banner ============
const AnimeSeasonBanner: React.FC<{ onViewAll: () => void }> = ({ onViewAll }) => (
  <div
    className="mx-4 mb-5 rounded-2xl overflow-hidden relative cursor-pointer active:scale-98"
    style={{
      background: 'linear-gradient(135deg, #1a0533 0%, #2d0a47 50%, #0d1a3a 100%)',
      minHeight: 80,
    }}
    onClick={onViewAll}
  >
    <div className="absolute inset-0 opacity-30">
      <div className="absolute top-2 right-4 text-6xl opacity-50">🌸</div>
      <div className="absolute bottom-2 left-4 text-4xl opacity-30">⭐</div>
    </div>
    <div className="relative p-4 flex items-center justify-between">
      <div>
        <p className="text-pink-300 text-xs font-semibold mb-1">موسم الخريف 2024</p>
        <h3 className="text-white font-black text-lg">أنمي الموسم</h3>
        <p className="text-gray-400 text-xs mt-1">أحدث حلقات الأنمي</p>
      </div>
      <div className="text-4xl">🎌</div>
    </div>
  </div>
);

// ============ Home Page ============
export const HomePage: React.FC<HomePageProps> = ({ onMediaClick, onTabChange }) => {
  const { watchProgress } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  // Continue watching
  const continueWatching = watchProgress
    .filter(p => p.progress > 0 && p.progress < 95)
    .map(p => allMedia.find(m => m.id === p.mediaId))
    .filter(Boolean) as Media[];

  const progressMap: Record<number, number> = {};
  watchProgress.forEach(p => { progressMap[p.mediaId] = p.progress; });

  // Suggestions based on genres watched
  const watchedGenreIds = new Set(
    continueWatching.flatMap(m => m.genres.map(g => g.id))
  );
  const suggested = watchedGenreIds.size > 0
    ? allMedia
        .filter(m => !continueWatching.find(c => c.id === m.id))
        .filter(m => m.genres.some(g => watchedGenreIds.has(g.id)))
        .slice(0, 10)
    : topRatedMedia.slice(0, 10);

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div
            className="text-5xl font-black mb-6"
            style={{
              fontFamily: 'Cairo, sans-serif',
              background: 'linear-gradient(135deg, #e50914 0%, #ff6b6b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            YUKI
          </div>
          <div className="flex gap-1.5 justify-center">
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                className="w-2 h-2 bg-red-500 rounded-full"
                style={{
                  animation: 'bounce 1s infinite',
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const featured = featuredMedia.length >= 3
    ? featuredMedia
    : [...featuredMedia, ...allMedia.filter(m => !m.featured)].slice(0, 4);

  return (
    <div className="bg-black min-h-screen pb-24">
      {/* Hero Carousel */}
      <FeaturedCarousel
        items={featured}
        onPlay={onMediaClick}
        onDetails={onMediaClick}
      />

      <div className="mt-5">
        {/* Continue Watching */}
        {continueWatching.length > 0 && (
          <SectionRow
            title="متابعة المشاهدة"
            icon="▶️"
            items={continueWatching}
            onItemClick={onMediaClick}
            type="wide"
            progressMap={progressMap}
          />
        )}

        {/* Trending */}
        <SectionRow
          title="الأكثر مشاهدة الآن"
          icon="🔥"
          items={trendingMedia}
          onItemClick={onMediaClick}
          cardSize="md"
          showType
          onViewAll={() => onTabChange('explore')}
        />

        {/* Latest Movies */}
        <SectionRow
          title="أحدث الأفلام"
          icon="🎬"
          items={movies.slice(0, 10)}
          onItemClick={onMediaClick}
          cardSize="md"
          onViewAll={() => onTabChange('explore')}
        />

        {/* Latest Series */}
        <SectionRow
          title="أحدث المسلسلات"
          icon="📺"
          items={series.slice(0, 8)}
          onItemClick={onMediaClick}
          cardSize="md"
          onViewAll={() => onTabChange('explore')}
        />

        {/* Anime Season Banner */}
        <AnimeSeasonBanner onViewAll={() => onTabChange('explore')} />

        {/* Latest Anime */}
        <SectionRow
          title="أنمي الموسم"
          icon="🎌"
          items={animeList.slice(0, 8)}
          onItemClick={onMediaClick}
          cardSize="md"
          onViewAll={() => onTabChange('explore')}
        />

        {/* Top Rated */}
        <SectionRow
          title="الأعلى تقييماً"
          icon="⭐"
          items={topRatedMedia.slice(0, 10)}
          onItemClick={onMediaClick}
          cardSize="lg"
          showType
          onViewAll={() => onTabChange('explore')}
        />

        {/* Suggested */}
        <SectionRow
          title="مقترح لك"
          icon="✨"
          items={suggested}
          onItemClick={onMediaClick}
          cardSize="md"
          showType
        />

        {/* Similar Based on Watching */}
        <SectionRow
          title="قد يعجبك أيضاً"
          icon="🎯"
          items={allMedia.slice(3, 13)}
          onItemClick={onMediaClick}
          cardSize="md"
          showType
        />

        {/* New additions */}
        <SectionRow
          title="جديد على YUKI"
          icon="🆕"
          items={[...movies, ...series, ...animeList].slice(-8).reverse()}
          onItemClick={onMediaClick}
          cardSize="md"
          showType
        />
      </div>
    </div>
  );
};
