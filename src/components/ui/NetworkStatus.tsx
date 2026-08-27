import React, { useState, useEffect } from 'react';

export const NetworkStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 3000);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showBanner) return null;

  return (
    <div className={`fixed top-0 inset-x-0 z-[100] py-2 px-4 flex items-center justify-center gap-2 transition-all duration-300 ${
      isOnline ? 'bg-green-600' : 'bg-orange-600'
    }`}>
      <span className="text-sm">{isOnline ? '✅' : '📡'}</span>
      <p className="text-white text-xs font-semibold font-cairo">
        {isOnline ? 'عاد الاتصال بالإنترنت' : 'لا يوجد اتصال بالإنترنت'}
      </p>
    </div>
  );
};
