import React from 'react';
import { Genre } from '../../types';

interface GenreBadgeProps {
  genre: Genre;
  selected?: boolean;
  onClick?: () => void;
}

export const GenreBadge: React.FC<GenreBadgeProps> = ({ genre, selected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 active:scale-95 ${
        selected
          ? 'bg-red-600 text-white'
          : 'bg-white/5 border border-white/10 text-gray-400'
      }`}
    >
      {genre.nameAr}
    </button>
  );
};
