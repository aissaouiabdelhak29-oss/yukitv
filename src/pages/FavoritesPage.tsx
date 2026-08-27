import React from 'react';
import { Media } from '../types';
import { useCatalog } from '../lib/useCatalog';
import { useStore } from '../store/useStore';
import { MediaCard } from '../components/ui/MediaCard';
import { FiHeart } from 'react-icons/fi';

interface FavoritesPageProps {
  onMediaClick: (media: Media) => void;
  onTabChange: (tab: string) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({ onMediaClick, onTabChange }) => {
  const { favorites, isAuthenticated } = useStore();
  const { media: allMedia } = useCatalog();

  const favoriteItems = allMedia.filter(m => favorites.includes(m.id));
  const movies = favoriteItems.filter(m => m.type === 'movie');
  const series = favoriteItems.filter(m => m.type === 'series');
  const anime = favoriteItems.filter(m => m.type === 'anime');

  if (!isAuthenticated) {
    return (
      <div className="bg-black min-h-screen flex flex-col items-center justify-center pb-24 px-8">
        <div className="text-6xl mb-4">❤️</div>
        <h2 className="text-white font-black text-xl mb-2">قائمة المفضلة</h2>
        <p className="text-gray-400 text-sm text-center mb-6">
          سجل دخولك لحفظ المفضلة ومتابعتها على جميع أجهزتك
        </p>
        <button
          onClick={() => onTabChange('profile')}
          className="bg-red-600 text-white font-bold px-8 py-3 rounded-2xl active:scale-95 transition-transform"
        >
          تسجيل الدخول
        </button>
      </div>
    );
  }

  if (favoriteItems.length === 0) {
    return (
      <div className="bg-black min-h-screen flex flex-col items-center justify-center pb-24 px-8">
        <div className="text-6xl mb-4 animate-bounce">💔</div>
        <h2 className="text-white font-black text-xl mb-2">لا يوجد مفضلة بعد</h2>
        <p className="text-gray-400 text-sm text-center mb-6">
          استعرض الأفلام والمسلسلات وأضف المفضلة بالضغط على ❤️
        </p>
        <button
          onClick={() => onTabChange('explore')}
          className="bg-red-600 text-white font-bold px-8 py-3 rounded-2xl active:scale-95 transition-transform"
        >
          استكشاف المحتوى
        </button>
      </div>
    );
  }

  const Section: React.FC<{ title: string; emoji: string; items: Media[] }> = ({ title, emoji, items }) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 px-4 mb-3">
          <span>{emoji}</span>
          <h2 className="text-white font-bold">{title}</h2>
          <span className="text-gray-500 text-sm">({items.length})</span>
        </div>
        <div className="grid grid-cols-3 gap-3 px-4">
          {items.map(item => (
            <MediaCard key={item.id} media={item} onClick={onMediaClick} size="sm" />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-black min-h-screen pb-28">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <FiHeart className="text-red-500 fill-red-500" size={20} />
          <h1 className="text-white font-black text-xl">المفضلة</h1>
        </div>
        <p className="text-gray-500 text-sm">{favoriteItems.length} عنصر محفوظ</p>
      </div>

      <Section title="الأفلام" emoji="🎬" items={movies} />
      <Section title="المسلسلات" emoji="📺" items={series} />
      <Section title="الأنمي" emoji="🎌" items={anime} />
    </div>
  );
};
