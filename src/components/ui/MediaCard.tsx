import React, { useState } from 'react';
import { Media } from '../../types';
import { useStore } from '../../store/useStore';
import { FiStar } from 'react-icons/fi';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

interface MediaCardProps {
  media: Media;
  onClick: (media: Media) => void;
  size?: 'sm' | 'md' | 'lg';
  showType?: boolean;
}

const TYPE_COLORS: Record<string, string> = {
  movie: 'bg-blue-600',
  series: 'bg-purple-600',
  anime: 'bg-pink-600',
};

const TYPE_LABELS: Record<string, string> = {
  movie: 'فيلم',
  series: 'مسلسل',
  anime: 'أنمي',
};

export const MediaCard: React.FC<MediaCardProps> = ({
  media, onClick, size = 'md', showType = false
}) => {
  const { isFavorite, toggleFavorite, isAuthenticated } = useStore();
  const [imgError, setImgError] = useState(false);
  const isFav = isFavorite(media.id);

  const widthMap = { sm: 108, md: 130, lg: 158 };
  const cardW = widthMap[size];

  return (
    <div
      className="relative flex-shrink-0 cursor-pointer active-scale group"
      style={{ width: cardW }}
      onClick={() => onClick(media)}
    >
      {/* Poster container */}
      <div
        className="relative rounded-2xl overflow-hidden mb-2 shadow-lg"
        style={{ aspectRatio: '2/3' }}
      >
        {!imgError ? (
          <img
            src={media.poster}
            alt={media.titleAr || media.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
            <span className="text-4xl mb-2">🎬</span>
            <span className="text-gray-600 text-xs text-center px-2">{media.titleAr || media.title}</span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

        {/* Rating - top left */}
        <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/60 backdrop-blur-sm rounded-lg px-1.5 py-0.5">
          <FiStar size={9} className="text-yellow-400 fill-yellow-400" />
          <span className="text-white text-xs font-bold leading-none">{media.rating.toFixed(1)}</span>
        </div>

        {/* Type badge - top right */}
        {showType && (
          <div className={`absolute top-2 left-2 badge text-white ${TYPE_COLORS[media.type]}`}>
            {TYPE_LABELS[media.type]}
          </div>
        )}

        {/* Favorite button */}
        {isAuthenticated && (
          <button
            className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center active:scale-90 transition-transform"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(media.id);
            }}
          >
            {isFav
              ? <FaHeart size={11} className="text-red-500" />
              : <FaRegHeart size={11} className="text-white" />
            }
          </button>
        )}

        {/* Quality badge */}
        {media.quality && (
          <div className="absolute bottom-2 left-2">
            <span className="badge bg-yellow-500 text-black">{media.quality}</span>
          </div>
        )}

        {/* Status for series/anime */}
        {media.status === 'ongoing' && (
          <div className="absolute top-8 left-2">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-xs font-bold">مستمر</span>
            </div>
          </div>
        )}
      </div>

      {/* Text info */}
      <p className="text-white text-xs font-bold line-clamp-2 leading-tight">
        {media.titleAr || media.title}
      </p>
      <p className="text-gray-500 text-xs mt-0.5">{media.year}</p>
    </div>
  );
};

// ===========================
// Wide Card (Continue Watching)
// ===========================
export const WideCard: React.FC<{
  media: Media;
  progress: number;
  onClick: (m: Media) => void;
}> = ({ media, progress, onClick }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="flex-shrink-0 cursor-pointer active-scale group"
      style={{ width: 220 }}
      onClick={() => onClick(media)}
    >
      <div className="relative rounded-2xl overflow-hidden mb-2 shadow-lg" style={{ aspectRatio: '16/9' }}>
        {!imgError ? (
          <img
            src={media.backdrop}
            alt={media.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <span className="text-3xl">🎬</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <span className="text-white text-lg" style={{ marginRight: -2 }}>▶</span>
          </div>
        </div>

        {/* Type badge */}
        <div className={`absolute top-2 right-2 badge text-white ${TYPE_COLORS[media.type]}`}>
          {TYPE_LABELS[media.type]}
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 inset-x-0 h-1 bg-gray-800">
          <div
            className="h-full bg-red-500"
            style={{ width: `${progress}%`, borderRadius: '0 0 8px 8px' }}
          />
        </div>
      </div>

      {/* Info */}
      <p className="text-white text-xs font-bold line-clamp-1">{media.titleAr || media.title}</p>
      <div className="flex items-center justify-between mt-0.5">
        <p className="text-gray-500 text-xs">{progress}% مكتمل</p>
        <p className="text-gray-600 text-xs">{media.year}</p>
      </div>
    </div>
  );
};
