import React, { useState, useEffect } from 'react';
import { FiArrowRight, FiMonitor, FiServer } from 'react-icons/fi';
import { Media } from '../types';

interface PlayerPageProps {
  media: Media;
  episodeId?: number;
  seasonId?: number;
  onBack: () => void;
}

export const PlayerPage: React.FC<PlayerPageProps> = ({
  media, episodeId, seasonId, onBack
}) => {
  const [selectedServer, setSelectedServer] = useState(0);
  const [loading, setLoading] = useState(true);

  // اختيار السيرفر المناسب
  let servers = media.servers || [];

  // لو فيه episode، استخدم سيرفرات الحلقة
  if (episodeId && seasonId && media.seasons) {
    const season = media.seasons.find(s => s.id === seasonId);
    const episode = season?.episodes.find(e => e.id === episodeId);
    if (episode?.servers && episode.servers.length > 0) {
      servers = episode.servers;
    }
  }

  const currentUrl = servers[selectedServer]?.url || '';

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, [selectedServer, currentUrl]);

  // لو ما فيه سيرفرات
  if (servers.length === 0) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
        <button
          onClick={onBack}
          className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center z-10"
        >
          <FiArrowRight size={20} className="text-white" />
        </button>
        <div className="text-6xl mb-4">📵</div>
        <h2 className="text-white font-bold text-lg mb-2">لا يوجد سيرفرات متاحة</h2>
        <p className="text-gray-400 text-sm text-center">
          لا يوجد رابط مشاهدة متاح لهذا المحتوى حالياً
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="relative flex items-center justify-between p-4 pt-5 z-10">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full glass flex items-center justify-center active:scale-90 transition-transform"
        >
          <FiArrowRight size={20} className="text-white" />
        </button>
        <div className="flex-1 mx-4">
          <h1 className="text-white font-bold text-sm line-clamp-1 text-center">
            {media.titleAr || media.title}
          </h1>
          {episodeId && (
            <p className="text-gray-400 text-xs text-center">
              {media.seasons?.find(s => s.id === seasonId)?.title} — 
              الحلقة {media.seasons?.find(s => s.id === seasonId)?.episodes.find(e => e.id === episodeId)?.number}
            </p>
          )}
        </div>
        <div className="w-10" />
      </div>

      {/* Video iframe */}
      <div className="relative w-full bg-black" style={{ aspectRatio: '16/9' }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="flex gap-1.5">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-2 h-2 bg-red-500 rounded-full"
                  style={{ animation: `bounce 1s infinite ${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}
        {currentUrl && (
          <iframe
            src={currentUrl}
            className="w-full h-full border-0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            onLoad={() => setLoading(false)}
            title={media.title}
            sandbox="allow-scripts allow-same-origin allow-presentation"
          />
        )}
      </div>

      {/* Servers */}
      {servers.length > 1 && (
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <FiServer size={16} className="text-red-500" />
            <h3 className="text-white font-bold text-sm">اختر السيرفر</h3>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {servers.map((server, i) => (
              <button
                key={server.id}
                onClick={() => setSelectedServer(i)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  i === selectedServer
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'glass text-gray-300 hover:bg-white/10'
                }`}
              >
                <FiMonitor size={14} />
                <span>{server.name}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                  i === selectedServer ? 'bg-white/20' : 'bg-white/5'
                }`}>
                  {server.quality}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="p-4 pt-2">
        <h2 className="text-white font-bold text-base mb-1">{media.titleAr || media.title}</h2>
        <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">
          {media.description}
        </p>
      </div>
    </div>
  );
};
