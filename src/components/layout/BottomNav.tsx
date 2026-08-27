import React from 'react';
import { FiHeart, FiUser } from 'react-icons/fi';
import { HiHome, HiOutlineHome } from 'react-icons/hi2';
import { MdExplore, MdOutlineExplore } from 'react-icons/md';
import { RiSearchLine, RiSearchFill } from 'react-icons/ri';
import { FaHeart, FaUser } from 'react-icons/fa';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  {
    id: 'home',
    label: 'الرئيسية',
    icon: HiOutlineHome,
    activeIcon: HiHome,
  },
  {
    id: 'explore',
    label: 'استكشاف',
    icon: MdOutlineExplore,
    activeIcon: MdExplore,
  },
  {
    id: 'search',
    label: 'بحث',
    icon: RiSearchLine,
    activeIcon: RiSearchFill,
  },
  {
    id: 'favorites',
    label: 'المفضلة',
    icon: FiHeart,
    activeIcon: FaHeart,
  },
  {
    id: 'profile',
    label: 'حسابي',
    icon: FiUser,
    activeIcon: FaUser,
  },
];

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50" style={{ maxWidth: 448, margin: '0 auto' }}>
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.95) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      />

      <div className="relative flex items-center justify-around px-1 py-2 pb-safe" style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          const Icon = isActive ? tab.activeIcon : tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl transition-all duration-200"
              style={{
                transform: isActive ? 'scale(1)' : 'scale(0.95)',
                transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              {/* Active background pill */}
              {isActive && (
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{ background: 'rgba(229, 9, 20, 0.12)' }}
                />
              )}

              {/* Top indicator dot */}
              {isActive && (
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full"
                  style={{ background: 'linear-gradient(90deg, transparent, #e50914, transparent)' }}
                />
              )}

              {/* Icon */}
              <div className="relative">
                <Icon
                  size={23}
                  style={{ color: isActive ? '#e50914' : '#6b7280' }}
                />
              </div>

              {/* Label */}
              <span
                className="text-xs font-bold"
                style={{
                  color: isActive ? '#e50914' : '#6b7280',
                  fontSize: '10px',
                  letterSpacing: '0.3px',
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
