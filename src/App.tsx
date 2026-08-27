import React, { useState, useEffect, useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import { BottomNav } from './components/layout/BottomNav';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { SearchPage } from './pages/SearchPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ProfilePage } from './pages/ProfilePage';
import { DetailPage } from './pages/DetailPage';
import { PlayerPage } from './pages/PlayerPage';
import { Media } from './types';
import { useStore } from './store/useStore';

type AppView =
  | { type: 'tab' }
  | { type: 'detail'; media: Media }
  | { type: 'player'; media: Media; episodeId?: number; seasonId?: number };

// ============ Splash Screen ============
const SplashScreen: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1400),
      setTimeout(onDone, 2200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(229,9,20,0.15) 0%, transparent 70%)',
          opacity: phase >= 1 ? 1 : 0,
        }}
      />

      {/* Logo */}
      <div
        className="relative mb-3 transition-all duration-700"
        style={{
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(20px)',
        }}
      >
        <span
          className="text-8xl font-black tracking-widest"
          style={{
            fontFamily: 'Cairo, sans-serif',
            background: 'linear-gradient(135deg, #e50914 0%, #ff4444 50%, #e50914 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          YUKI
        </span>
        {/* Underline */}
        <div
          className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-red-600 via-red-400 to-red-600 transition-all duration-700"
          style={{ width: phase >= 2 ? '100%' : '0%' }}
        />
      </div>

      {/* Tagline */}
      <div
        className="transition-all duration-500"
        style={{
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? 'translateY(0)' : 'translateY(10px)',
        }}
      >
        <p className="text-gray-400 text-sm tracking-widest font-medium">
          أفلام • مسلسلات • أنمي
        </p>
      </div>

      {/* Loading bar */}
      <div
        className="absolute bottom-16 left-8 right-8 transition-all duration-500"
        style={{ opacity: phase >= 3 ? 1 : 0 }}
      >
        <div className="h-0.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-red-600 rounded-full"
            style={{
              width: phase >= 3 ? '100%' : '0%',
              transition: 'width 0.8s ease',
            }}
          />
        </div>
      </div>

      {/* Version */}
      <div className="absolute bottom-8 text-gray-700 text-xs">
        v1.0.0
      </div>
    </div>
  );
};

// ============ No Internet ============
const NoInternetBanner: React.FC<{ isOnline: boolean }> = ({ isOnline }) => {
  const [visible, setVisible] = useState(!isOnline);

  useEffect(() => {
    if (!isOnline) {
      setVisible(true);
    } else {
      // Show "back online" for 3s then hide
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(t);
    }
  }, [isOnline]);

  if (!visible) return null;

  return (
    <div
      className={`fixed top-0 inset-x-0 z-[100] py-2.5 px-4 flex items-center justify-center gap-2 transition-all duration-300 ${
        isOnline ? 'bg-green-600' : 'bg-orange-600'
      }`}
      style={{ maxWidth: 448, margin: '0 auto' }}
    >
      <span>{isOnline ? '✅' : '📡'}</span>
      <p className="text-white text-xs font-bold">
        {isOnline ? 'عاد الاتصال بالإنترنت' : 'لا يوجد اتصال - وضع عدم الاتصال'}
      </p>
    </div>
  );
};

// ============ Main App ============
export default function App() {
  const { activeTab, setActiveTab } = useStore();
  const [view, setView] = useState<AppView>({ type: 'tab' });
  const [showSplash, setShowSplash] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [viewHistory, setViewHistory] = useState<AppView[]>([]);

  // Network detection
  useEffect(() => {
    const up = () => setIsOnline(true);
    const down = () => setIsOnline(false);
    window.addEventListener('online', up);
    window.addEventListener('offline', down);
    return () => {
      window.removeEventListener('online', up);
      window.removeEventListener('offline', down);
    };
  }, []);

  const navigateTo = useCallback((newView: AppView) => {
    setViewHistory(prev => [...prev, view]);
    setView(newView);
  }, [view]);

  const navigateBack = useCallback(() => {
    const prev = viewHistory[viewHistory.length - 1];
    if (prev) {
      setView(prev);
      setViewHistory(h => h.slice(0, -1));
    } else {
      setView({ type: 'tab' });
    }
  }, [viewHistory]);

  // Browser back button
  useEffect(() => {
    const handlePop = (e: PopStateEvent) => {
      e.preventDefault();
      navigateBack();
    };
    if (view.type !== 'tab') {
      window.history.pushState(null, '', window.location.href);
      window.addEventListener('popstate', handlePop);
    }
    return () => window.removeEventListener('popstate', handlePop);
  }, [view, navigateBack]);

  const handleMediaClick = useCallback((media: Media) => {
    navigateTo({ type: 'detail', media });
  }, [navigateTo]);

  const handlePlay = useCallback((media: Media, episodeId?: number, seasonId?: number) => {
    navigateTo({ type: 'player', media, episodeId, seasonId });
  }, [navigateTo]);

  const handleBack = useCallback(() => {
    navigateBack();
  }, [navigateBack]);

  const handleTabChange = useCallback((tab: string) => {
    setView({ type: 'tab' });
    setViewHistory([]);
    setActiveTab(tab);
  }, [setActiveTab]);

  const splashDone = useCallback(() => setShowSplash(false), []);

  // ---- Render ----
  if (showSplash) {
    return (
      <>
        <SplashScreen onDone={splashDone} />
        <Toaster position="top-center" toastOptions={toastOptions} />
      </>
    );
  }

  const playerView = view as { type: 'player'; media: Media; episodeId?: number; seasonId?: number };
  const detailView = view as { type: 'detail'; media: Media };

  return (
    <div
      className="bg-black min-h-screen relative overflow-hidden"
      style={{ maxWidth: 448, margin: '0 auto' }}
    >
      <Toaster position="top-center" toastOptions={toastOptions} />
      <NoInternetBanner isOnline={isOnline} />

      {/* ===== Player ===== */}
      {view.type === 'player' && (
        <div className="min-h-screen">
          <PlayerPage
            media={playerView.media}
            episodeId={playerView.episodeId}
            seasonId={playerView.seasonId}
            onBack={handleBack}
          />
        </div>
      )}

      {/* ===== Detail ===== */}
      {view.type === 'detail' && (
        <div className="min-h-screen overflow-y-auto pb-24">
          <DetailPage
            media={detailView.media}
            onBack={handleBack}
            onPlay={handlePlay}
            onMediaClick={handleMediaClick}
          />
        </div>
      )}

      {/* ===== Tabs ===== */}
      {view.type === 'tab' && (
        <div className="min-h-screen overflow-y-auto">
          {activeTab === 'home' && (
            <HomePage
              onMediaClick={handleMediaClick}
              onTabChange={handleTabChange}
            />
          )}
          {activeTab === 'explore' && (
            <ExplorePage onMediaClick={handleMediaClick} />
          )}
          {activeTab === 'search' && (
            <SearchPage onMediaClick={handleMediaClick} />
          )}
          {activeTab === 'favorites' && (
            <FavoritesPage
              onMediaClick={handleMediaClick}
              onTabChange={handleTabChange}
            />
          )}
          {activeTab === 'profile' && (
            <ProfilePage onMediaClick={handleMediaClick} />
          )}
        </div>
      )}

      {/* Bottom Nav - hidden in player */}
      {view.type !== 'player' && (
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      )}
    </div>
  );
}

// Toast configuration
const toastOptions = {
  style: {
    background: '#1a1a1a',
    color: '#fff',
    fontFamily: 'Cairo, Tajawal, sans-serif',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.08)',
    padding: '12px 16px',
    direction: 'rtl' as const,
    fontSize: '14px',
  },
  duration: 3000,
  success: {
    iconTheme: { primary: '#e50914', secondary: '#fff' },
  },
  error: {
    iconTheme: { primary: '#ff4444', secondary: '#fff' },
  },
};
