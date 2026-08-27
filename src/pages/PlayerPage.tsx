import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Media, Server, Episode } from '../types';
import { useStore } from '../store/useStore';
import {
  FiArrowRight, FiPlay, FiPause, FiVolume2, FiVolumeX,
  FiMaximize, FiMinimize, FiSettings,
  FiRotateCcw, FiRotateCw, FiLock
} from 'react-icons/fi';
import { MdSpeed } from 'react-icons/md';
import toast from 'react-hot-toast';

interface PlayerPageProps {
  media: Media;
  episodeId?: number;
  seasonId?: number;
  onBack: () => void;
}

function findEpisode(media: Media, episodeId?: number, seasonId?: number): Episode | null {
  if (!media.seasons) return null;
  for (const season of media.seasons) {
    if (seasonId && season.id !== seasonId) continue;
    const ep = season.episodes.find((e: Episode) => e.id === episodeId);
    if (ep) return ep;
  }
  return media.seasons[0]?.episodes[0] ?? null;
}

const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export const PlayerPage: React.FC<PlayerPageProps> = ({
  media, episodeId, seasonId, onBack
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedServer, setSelectedServer] = useState(0);
  const [showMenu, setShowMenu] = useState<'server' | 'speed' | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [buffering, setBuffering] = useState(false);
  const [error, setError] = useState(false);
  const [locked, setLocked] = useState(false);
  const [doubleTapSide, setDoubleTapSide] = useState<'left' | 'right' | null>(null);

  const { updateWatchProgress, getProgress } = useStore();

  const episode = media.type !== 'movie' ? findEpisode(media, episodeId, seasonId) : null;
  const servers: Server[] = episode?.servers ?? media.servers ?? [];
  const currentServer = servers[selectedServer];
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const title = episode
    ? `${media.titleAr ?? media.title} • الحلقة ${episode.number}`
    : (media.titleAr ?? media.title);

  // Restore progress on mount
  useEffect(() => {
    const saved = getProgress(media.id, episodeId);
    if (saved && saved.currentTime > 10 && videoRef.current) {
      videoRef.current.currentTime = saved.currentTime;
      toast.success(`استمرار من ${formatTime(saved.currentTime)} ▶`, { duration: 2000 });
    }
  }, []);

  // Auto-save progress
  useEffect(() => {
    const interval = setInterval(() => {
      if (!videoRef.current || duration <= 0) return;
      updateWatchProgress({
        mediaId: media.id,
        mediaType: media.type,
        episodeId,
        seasonId,
        progress: Math.round((currentTime / duration) * 100),
        currentTime,
        duration,
        updatedAt: new Date().toISOString(),
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [currentTime, duration]);

  // Controls auto-hide
  const scheduleHide = useCallback(() => {
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => {
      if (isPlaying && !showMenu) setShowControls(false);
    }, 3500);
  }, [isPlaying, showMenu]);

  const handleTap = () => {
    if (locked) return;
    setShowControls(true);
    scheduleHide();
  };

  // Double tap to seek
  const handleDoubleTap = (side: 'left' | 'right') => {
    if (locked) return;
    const v = videoRef.current;
    if (!v) return;
    const secs = side === 'right' ? 10 : -10;
    v.currentTime = Math.max(0, Math.min(v.currentTime + secs, duration));
    setDoubleTapSide(side);
    setTimeout(() => setDoubleTapSide(null), 600);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => setError(true));
    } else {
      v.pause();
    }
    scheduleHide();
  };

  const seek = (secs: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.max(0, Math.min(v.currentTime + secs, duration));
  };

  const handleSeekBar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const t = (parseFloat(e.target.value) / 100) * duration;
    v.currentTime = t;
    setCurrentTime(t);
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(!muted);
  };

  const toggleFullscreen = async () => {
    const el = containerRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {}
  };

  const changeSpeed = (speed: number) => {
    if (videoRef.current) videoRef.current.playbackRate = speed;
    setPlaybackRate(speed);
    setShowMenu(null);
  };

  const changeServer = (index: number) => {
    setSelectedServer(index);
    setShowMenu(null);
    toast.success(`تم التبديل إلى ${servers[index].name}`);
  };

  const formatTime = (t: number) => {
    const h = Math.floor(t / 3600);
    const m = Math.floor((t % 3600) / 60);
    const s = Math.floor(t % 60);
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  if (!currentServer) {
    return (
      <div className="bg-black min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <button onClick={onBack} className="absolute top-5 right-5 p-2">
          <FiArrowRight className="text-white" size={24} />
        </button>
        <span className="text-6xl mb-5">📡</span>
        <h2 className="text-white font-black text-xl mb-2">لا يوجد مصدر فيديو</h2>
        <p className="text-gray-500 text-sm mb-6">
          لم يتم ربط فيديو بهذا المحتوى بعد.<br />
          أضف السيرفرات من لوحة التحكم.
        </p>
        <button onClick={onBack} className="bg-red-600 text-white px-8 py-3 rounded-2xl font-bold active:scale-95">
          العودة
        </button>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen flex flex-col select-none">
      {/* ===== Video Player ===== */}
      <div
        ref={containerRef}
        className="relative w-full bg-black flex-shrink-0"
        style={{ aspectRatio: '16/9', maxHeight: isFullscreen ? '100vh' : undefined }}
        onClick={handleTap}
      >
        <video
          ref={videoRef}
          src={currentServer.url}
          className="w-full h-full object-contain"
          playsInline
          onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime ?? 0)}
          onDurationChange={() => setDuration(videoRef.current?.duration ?? 0)}
          onPlay={() => { setIsPlaying(true); scheduleHide(); }}
          onPause={() => { setIsPlaying(false); setShowControls(true); }}
          onWaiting={() => setBuffering(true)}
          onPlaying={() => setBuffering(false)}
          onError={() => setError(true)}
          onEnded={() => {
            setIsPlaying(false);
            setShowControls(true);
            updateWatchProgress({
              mediaId: media.id,
              mediaType: media.type,
              episodeId,
              seasonId,
              progress: 100,
              currentTime: duration,
              duration,
              updatedAt: new Date().toISOString(),
            });
            toast.success('انتهت المشاهدة ✅');
          }}
        />

        {/* Buffering spinner */}
        {buffering && !error && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-14 h-14 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20">
            <span className="text-5xl mb-3">⚠️</span>
            <p className="text-white font-bold mb-1">حدث خطأ في التشغيل</p>
            <p className="text-gray-500 text-sm mb-5">تحقق من اتصالك أو جرب سيرفراً آخر</p>
            <div className="flex gap-3">
              <button
                onClick={() => { setError(false); videoRef.current?.load(); videoRef.current?.play(); }}
                className="bg-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold active:scale-95"
              >
                إعادة المحاولة
              </button>
              <button
                onClick={onBack}
                className="bg-white/10 text-white px-5 py-2.5 rounded-xl text-sm active:scale-95"
              >
                العودة
              </button>
            </div>
          </div>
        )}

        {/* Double-tap indicator */}
        {doubleTapSide && (
          <div
            className={`absolute top-1/2 -translate-y-1/2 pointer-events-none ${
              doubleTapSide === 'right' ? 'right-8' : 'left-8'
            }`}
          >
            <div className="flex flex-col items-center">
              <span className="text-white text-2xl font-black">
                {doubleTapSide === 'right' ? '⏩' : '⏪'}
              </span>
              <span className="text-white text-xs font-bold mt-1">
                {doubleTapSide === 'right' ? '+10 ث' : '-10 ث'}
              </span>
            </div>
          </div>
        )}

        {/* Menus */}
        {showMenu === 'speed' && (
          <div
            className="absolute top-14 left-4 z-30 rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}
            onClick={e => e.stopPropagation()}
          >
            <p className="text-gray-500 text-xs px-4 py-2 border-b border-white/10">سرعة التشغيل</p>
            {SPEEDS.map(s => (
              <button
                key={s}
                onClick={() => changeSpeed(s)}
                className="w-full px-5 py-3 text-sm flex items-center justify-between active:bg-white/5"
                style={{ color: playbackRate === s ? '#e50914' : '#fff' }}
              >
                <span>{s}x</span>
                {playbackRate === s && <span className="text-red-500">✓</span>}
              </button>
            ))}
          </div>
        )}

        {showMenu === 'server' && (
          <div
            className="absolute top-14 right-4 z-30 rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', minWidth: 160 }}
            onClick={e => e.stopPropagation()}
          >
            <p className="text-gray-500 text-xs px-4 py-2 border-b border-white/10">اختر السيرفر</p>
            {servers.map((s, i) => (
              <button
                key={s.id}
                onClick={() => changeServer(i)}
                className="w-full px-4 py-3 flex items-center justify-between active:bg-white/5"
                style={{ color: selectedServer === i ? '#e50914' : '#fff' }}
              >
                <span className="text-sm">{s.name}</span>
                <span className="text-xs text-gray-500">{s.quality}</span>
              </button>
            ))}
          </div>
        )}

        {/* Controls overlay */}
        {showControls && !error && (
          <div
            className="absolute inset-0 flex flex-col justify-between z-10"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, transparent 25%, transparent 65%, rgba(0,0,0,0.9) 100%)',
            }}
          >
            {/* Top bar */}
            <div className="flex items-center px-4 pt-4">
              <button
                onClick={(e) => { e.stopPropagation(); onBack(); }}
                className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center mr-3"
              >
                <FiArrowRight className="text-white" size={20} />
              </button>
              <p className="text-white text-sm font-bold flex-1 text-center line-clamp-1 mx-2">{title}</p>
              <div className="flex items-center gap-2">
                {/* Speed */}
                <button
                  onClick={(e) => { e.stopPropagation(); setShowMenu(showMenu === 'speed' ? null : 'speed'); }}
                  className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-lg"
                >
                  <MdSpeed className="text-white" size={14} />
                  <span className="text-white text-xs font-bold">{playbackRate}x</span>
                </button>
                {/* Server/Settings */}
                <button
                  onClick={(e) => { e.stopPropagation(); setShowMenu(showMenu === 'server' ? null : 'server'); }}
                  className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center"
                >
                  <FiSettings className="text-white" size={15} />
                </button>
                {/* Lock */}
                <button
                  onClick={(e) => { e.stopPropagation(); setLocked(!locked); toast.success(locked ? 'تم فتح الشاشة' : 'تم قفل الشاشة'); }}
                  className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center"
                >
                  <FiLock className={locked ? 'text-red-400' : 'text-white'} size={15} />
                </button>
              </div>
            </div>

            {/* Seek areas (double tap) */}
            <div className="flex flex-1" onClick={e => e.stopPropagation()}>
              <div className="flex-1 h-full" onDoubleClick={() => handleDoubleTap('left')} />
              <div className="w-16 flex items-center justify-center" onClick={togglePlay}>
                {/* Center play/pause */}
              </div>
              <div className="flex-1 h-full" onDoubleClick={() => handleDoubleTap('right')} />
            </div>

            {/* Center: play/pause + seek */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{ zIndex: 5 }}
            >
              <button
                onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                className="w-16 h-16 rounded-full flex items-center justify-center pointer-events-auto active:scale-90 transition-transform"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                {isPlaying
                  ? <FiPause className="text-white" size={28} />
                  : <FiPlay className="text-white fill-white" size={28} style={{ marginRight: -2 }} />
                }
              </button>
            </div>

            {/* Skip buttons */}
            <div className="absolute inset-0 flex items-center justify-between px-8 pointer-events-none">
              <button
                onClick={(e) => { e.stopPropagation(); seek(-10); }}
                className="flex flex-col items-center pointer-events-auto active:scale-90 transition-transform"
              >
                <FiRotateCcw className="text-white" size={22} />
                <span className="text-white text-xs mt-0.5">10</span>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); seek(10); }}
                className="flex flex-col items-center pointer-events-auto active:scale-90 transition-transform"
              >
                <FiRotateCw className="text-white" size={22} />
                <span className="text-white text-xs mt-0.5">10</span>
              </button>
            </div>

            {/* Bottom controls */}
            <div className="px-4 pb-4" onClick={e => e.stopPropagation()}>
              {/* Time + Seek bar */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-white text-xs font-mono">{formatTime(currentTime)}</span>
                <div className="flex-1">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={0.1}
                    value={progress}
                    onChange={handleSeekBar}
                    className="w-full"
                    style={{
                      background: `linear-gradient(to right, #e50914 ${progress}%, rgba(255,255,255,0.2) ${progress}%)`,
                    }}
                  />
                </div>
                <span className="text-gray-400 text-xs font-mono">{formatTime(duration)}</span>
              </div>

              {/* Controls row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={toggleMute} className="active:scale-90 transition-transform">
                    {muted
                      ? <FiVolumeX className="text-white" size={20} />
                      : <FiVolume2 className="text-white" size={20} />
                    }
                  </button>
                  <span
                    className="text-white text-xs font-bold px-2 py-0.5 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.15)' }}
                  >
                    {currentServer.quality}
                  </span>
                </div>

                <button onClick={toggleFullscreen} className="active:scale-90 transition-transform">
                  {isFullscreen
                    ? <FiMinimize className="text-white" size={20} />
                    : <FiMaximize className="text-white" size={20} />
                  }
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Locked indicator */}
        {locked && (
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/50 rounded-xl px-3 py-2">
            <FiLock className="text-red-400" size={14} />
            <span className="text-white text-xs">الشاشة مقفلة</span>
            <button
              onClick={() => setLocked(false)}
              className="text-red-400 text-xs font-bold ml-2"
            >
              فتح
            </button>
          </div>
        )}
      </div>

      {/* ===== Info Below Player ===== */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24">
        {/* Title & meta */}
        <h2 className="text-white font-black text-lg leading-tight mb-2">{title}</h2>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="badge bg-white/10 text-gray-300">{media.year}</span>
          <span className="badge bg-yellow-500 text-black">{currentServer.quality}</span>
          {media.duration && <span className="badge bg-white/10 text-gray-300">{media.duration} دقيقة</span>}
          {media.language && <span className="badge bg-white/10 text-gray-300">{media.language}</span>}
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4">
          {episode?.description ?? media.description}
        </p>

        {/* Servers */}
        {servers.length > 1 && (
          <div className="mb-5">
            <p className="text-gray-500 text-xs font-bold mb-2 uppercase tracking-wider">السيرفرات</p>
            <div className="flex gap-2 flex-wrap">
              {servers.map((server, i) => (
                <button
                  key={server.id}
                  onClick={() => changeServer(i)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95"
                  style={{
                    background: selectedServer === i ? '#e50914' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${selectedServer === i ? '#e50914' : 'rgba(255,255,255,0.1)'}`,
                    color: '#fff',
                  }}
                >
                  <span>{server.name}</span>
                  <span className="badge bg-black/20 text-current">{server.quality}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Episode list for series */}
        {episode && media.seasons && (
          <div>
            <p className="text-gray-500 text-xs font-bold mb-2 uppercase tracking-wider">حلقات الموسم</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {media.seasons[0]?.episodes.slice(0, 20).map((ep: Episode) => (
                <button
                  key={ep.id}
                  className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold transition-all active:scale-90"
                  style={{
                    background: ep.id === episodeId ? '#e50914' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${ep.id === episodeId ? '#e50914' : 'rgba(255,255,255,0.08)'}`,
                    color: ep.id === episodeId ? '#fff' : '#9ca3af',
                  }}
                >
                  {ep.number}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
