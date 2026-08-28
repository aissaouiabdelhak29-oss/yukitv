import React, { useState, useEffect } from 'react';
import { Media, Episode, Season } from '../types';
import { useStore } from '../store/useStore';
import { getMediaDetails } from '../lib/supabase';
import { GenreBadge } from '../components/ui/GenreBadge';
import { StarRating } from '../components/ui/StarRating';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { MediaCard } from '../components/ui/MediaCard';
import {
  FiPlay, FiArrowRight, FiHeart, FiShare2, FiDownload,
  FiStar, FiClock, FiCalendar, FiGlobe, FiFilm, FiTv,
  FiChevronDown, FiChevronUp, FiMonitor
} from 'react-icons/fi';
import toast from 'react-hot-toast';

interface DetailPageProps {
  media: Media;
  onBack: () => void;
  onPlay: (media: Media, episodeId?: number, seasonId?: number) => void;
  onMediaClick: (media: Media) => void;
}

export const DetailPage: React.FC<DetailPageProps> = ({
  media: initialMedia, onBack, onPlay, onMediaClick
}) => {
  const { isFavorite, toggleFavorite, isAuthenticated, setRating, ratings } = useStore();
  const [media, setMedia] = useState<Media>(initialMedia);
  const [loading, setLoading] = useState(true);
  const [expandedSeason, setExpandedSeason] = useState<number | null>(null);
  const [selectedServer, setSelectedServer] = useState(0);
  const isFav = isFavorite(media.id);
  const userRating = ratings[media.id] || 0;

  useEffect(() => {
    let alive = true;
    setLoading(true);
    getMediaDetails(initialMedia).then(detailed => {
      if (!alive) return;
      setMedia(detailed);
      setExpandedSeason(detailed.seasons?.[0]?.id || null);
    }).catch(err => {
      console.error('Failed to load details:', err);
      toast.error('تعذر تحميل التفاصيل');
    }).finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [initialMedia.id]);

  const handlePlay = (episodeId?: number, seasonId?: number) => {
    onPlay(media, episodeId, seasonId);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: media.titleAr || media.title, text: media.description });
    } else {
      toast.success('تم نسخ الرابط');
    }
  };

  const servers = media.servers || [];
  const hasServers = servers.length > 0;
  const hasSeasons = media.seasons && media.seasons.length > 0;

  return (
    <div className="min-h-screen bg-black">
      {/* Backdrop */}
      <div className="relative w-full" style={{ height: '55vw', maxHeight: 320 }}>
        <img
          src={media.backdrop}
          alt={media.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

        {/* Top bar */}
        <div className="absolute top-0 right-0 left-0 flex items-center justify-between p-4 pt-5">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full glass flex items-center justify-center active:scale-90 transition-transform"
          >
            <FiArrowRight size={20} className="text-white" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-full glass flex items-center justify-center active:scale-90"
            >
              <FiShare2 size={18} className="text-white" />
            </button>
            {isAuthenticated && (
              <button
                onClick={() => {
                  toggleFavorite(media.id);
                  toast(isFav ? 'تم الإزالة من المفضلة' : 'تم الإضافة للمفضلة');
                }}
                className="w-10 h-10 rounded-full glass flex items-center justify-center active:scale-90"
              >
                {isFav
                  ? <FiHeart size={18} className="text-red-500 fill-red-500" />
                  : <FiHeart size={18} className="text-white" />
                }
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative -mt-16 px-4 pb-24">
        {/* Poster + Info */}
        <div className="flex gap-4 mb-5">
          <div
            className="flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            style={{ width: 120, aspectRatio: '2/3' }}
          >
            <img
              src={media.poster}
              alt={media.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 pt-16">
            <div className="flex items-center gap-2 mb-2">
              <span className={`badge ${media.type === 'movie' ? 'bg-blue-600' : media.type === 'anime' ? 'bg-pink-600' : 'bg-purple-600'} text-white`}>
                {media.type === 'movie' ? 'فيلم' : media.type === 'anime' ? 'أنمي' : 'مسلسل'}
              </span>
              {media.quality && (
                <span className="badge bg-yellow-500 text-black">{media.quality}</span>
              )}
            </div>
            <h1 className="text-white font-black text-xl leading-tight mb-1">
              {media.titleAr || media.title}
            </h1>
            {media.originalTitle && media.originalTitle !== media.title && (
              <p className="text-gray-500 text-xs mb-2">{media.originalTitle}</p>
            )}
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-1">
                <FiStar size={12} className="text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-400 font-bold text-sm">{media.rating}</span>
              </div>
              <span className="text-gray-400 text-xs">{media.year}</span>
              {media.duration && (
                <span className="text-gray-400 text-xs flex items-center gap-1">
                  <FiClock size={10} />
                  {media.duration} د
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Play Button */}
        {hasServers && (
          <button
            onClick={() => handlePlay()}
            className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-bold py-3.5 rounded-2xl active:scale-95 transition-transform shadow-lg mb-4"
            style={{ boxShadow: '0 4px 20px rgba(229,9,20,0.4)' }}
          >
            <FiPlay className="fill-white" size={18} />
            <span>شاهد الآن</span>
          </button>
        )}

        {/* Servers for movies */}
        {media.type === 'movie' && servers.length > 1 && (
          <div className="mb-4">
            <p className="text-gray-400 text-xs mb-2 flex items-center gap-1">
              <FiMonitor size={12} />
              اختر السيرفر
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {servers.map((server, i) => (
                <button
                  key={server.id}
                  onClick={() => setSelectedServer(i)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    i === selectedServer
                      ? 'bg-red-600 text-white'
                      : 'glass text-gray-300'
                  }`}
                >
                  {server.name}
                  <span className="px-1 py-0.5 rounded bg-white/20 text-[10px]">{server.quality}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="mb-5">
          <p className="text-gray-300 text-sm leading-relaxed">
            {media.description}
          </p>
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {media.director && (
            <div className="glass rounded-xl p-3">
              <p className="text-gray-500 text-[10px] mb-1">المخرج</p>
              <p className="text-white text-xs font-bold">{media.director}</p>
            </div>
          )}
          {media.language && (
            <div className="glass rounded-xl p-3">
              <p className="text-gray-500 text-[10px] mb-1">اللغة</p>
              <p className="text-white text-xs font-bold">{media.language}</p>
            </div>
          )}
          {media.country && (
            <div className="glass rounded-xl p-3">
              <p className="text-gray-500 text-[10px] mb-1">البلد</p>
              <p className="text-white text-xs font-bold">{media.country}</p>
            </div>
          )}
          <div className="glass rounded-xl p-3">
            <p className="text-gray-500 text-[10px] mb-1">المشاهدات</p>
            <p className="text-white text-xs font-bold">{media.views.toLocaleString('ar-SA')}</p>
          </div>
        </div>

        {/* Genres */}
        <div className="flex flex-wrap gap-2 mb-5">
          {media.genres.map(g => (
            <GenreBadge key={g.id} name={g.nameAr || g.name} />
          ))}
        </div>

        {/* Cast */}
        {media.cast && media.cast.length > 0 && (
          <div className="mb-5">
            <h3 className="text-white font-bold text-sm mb-2">طاقم التمثيل</h3>
            <div className="flex flex-wrap gap-2">
              {media.cast.map((actor, i) => (
                <span key={i} className="glass px-3 py-1.5 rounded-lg text-gray-300 text-xs">
                  {actor}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* User Rating */}
        <div className="glass rounded-2xl p-4 mb-5">
          <h3 className="text-white font-bold text-sm mb-2">قيّم هذا المحتوى</h3>
          <StarRating
            rating={userRating}
            onRate={(r) => {
              setRating(media.id, r);
              toast.success('تم حفظ التقييم');
            }}
          />
        </div>

        {/* Seasons & Episodes */}
        {hasSeasons && (
          <div className="mb-5">
            <h3 className="text-white font-bold text-base mb-3 flex items-center gap-2">
              <FiTv size={18} className="text-red-500" />
              الحلقات
            </h3>
            {media.seasons?.map((season: Season) => (
              <div key={season.id} className="mb-2">
                <button
                  onClick={() => setExpandedSeason(expandedSeason === season.id ? null : season.id)}
                  className="w-full flex items-center justify-between glass rounded-xl p-3 active:scale-98 transition-transform"
                >
                  <span className="text-white text-sm font-bold">{season.titleAr || season.title}</span>
                  <span className="text-gray-400 text-xs">{season.episodes.length} حلقة</span>
                  {expandedSeason === season.id
                    ? <FiChevronUp size={18} className="text-gray-400" />
                    : <FiChevronDown size={18} className="text-gray-400" />
                  }
                </button>

                {expandedSeason === season.id && (
                  <div className="mt-2 space-y-2">
                    {season.episodes.map((ep: Episode) => (
                      <button
                        key={ep.id}
                        onClick={() => handlePlay(ep.id, season.id)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-right"
                      >
                        <div className="relative flex-shrink-0 rounded-lg overflow-hidden" style={{ width: 100, aspectRatio: '16/9' }}>
                          <img
                            src={ep.thumbnail || media.backdrop}
                            alt={ep.titleAr || ep.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                              <FiPlay size={14} className="text-white fill-white" style={{ marginRight: -1 }} />
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs font-bold line-clamp-1">
                            {ep.number}. {ep.titleAr || ep.title}
                          </p>
                          <p className="text-gray-500 text-[10px] mt-0.5">
                            {ep.duration > 0 && `${ep.duration} دقيقة`}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Trailer */}
        {media.trailer && (
          <div className="mb-5">
            <h3 className="text-white font-bold text-sm mb-2">الإعلان</h3>
            <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
              <iframe
                src={media.trailer}
                className="w-full h-full border-0"
                allowFullScreen
                title="trailer"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
