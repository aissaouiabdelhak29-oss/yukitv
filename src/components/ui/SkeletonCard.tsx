import React from 'react';

interface SkeletonCardProps {
  type?: 'poster' | 'wide' | 'banner';
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ type = 'poster' }) => {
  if (type === 'banner') {
    return (
      <div className="skeleton w-full h-64 rounded-2xl" />
    );
  }
  if (type === 'wide') {
    return (
      <div className="skeleton rounded-xl" style={{ width: 240, height: 135 }} />
    );
  }
  return (
    <div className="flex flex-col gap-2" style={{ width: 120 }}>
      <div className="skeleton rounded-xl aspect-poster" style={{ height: 180 }} />
      <div className="skeleton h-3 rounded w-3/4" />
      <div className="skeleton h-3 rounded w-1/2" />
    </div>
  );
};

export const SkeletonRow: React.FC = () => (
  <div className="px-4 mb-6">
    <div className="skeleton h-5 w-32 rounded mb-3" />
    <div className="flex gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  </div>
);
