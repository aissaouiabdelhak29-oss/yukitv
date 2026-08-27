import React from 'react';
import { Media } from '../../types';
import { MediaCard, WideCard } from './MediaCard';

interface SectionRowProps {
  title: string;
  icon?: string;
  items: Media[];
  onItemClick: (media: Media) => void;
  cardSize?: 'sm' | 'md' | 'lg';
  showType?: boolean;
  type?: 'poster' | 'wide';
  progressMap?: Record<number, number>;
  viewAllLabel?: string;
  onViewAll?: () => void;
}

export const SectionRow: React.FC<SectionRowProps> = ({
  title,
  icon,
  items,
  onItemClick,
  cardSize = 'md',
  showType = false,
  type = 'poster',
  progressMap = {},
  viewAllLabel,
  onViewAll,
}) => {
  if (items.length === 0) return null;

  return (
    <div className="mb-6">
      {/* Header */}
      <div className="flex items-center justify-between px-4 mb-3">
        <div className="flex items-center gap-2">
          {icon && <span className="text-lg">{icon}</span>}
          <h2 className="text-white font-bold text-base">{title}</h2>
        </div>
        {onViewAll && (
          <button
            className="text-red-400 text-xs font-semibold active:opacity-70"
            onClick={onViewAll}
          >
            {viewAllLabel || 'عرض الكل'}
          </button>
        )}
      </div>

      {/* Scroll row */}
      <div className="scroll-x px-4">
        {type === 'wide'
          ? items.map(item => (
              <WideCard
                key={item.id}
                media={item}
                progress={progressMap[item.id] || Math.floor(Math.random() * 80) + 10}
                onClick={onItemClick}
              />
            ))
          : items.map(item => (
              <MediaCard
                key={item.id}
                media={item}
                onClick={onItemClick}
                size={cardSize}
                showType={showType}
              />
            ))}
      </div>
    </div>
  );
};
