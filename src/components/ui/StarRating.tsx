import React, { useState } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  readonly = false,
  size = 20,
}) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = (hovered || value) > i;
        return (
          <button
            key={i}
            disabled={readonly}
            onClick={() => onChange?.(i + 1)}
            onMouseEnter={() => !readonly && setHovered(i + 1)}
            onMouseLeave={() => !readonly && setHovered(0)}
            className={`transition-transform ${!readonly ? 'active:scale-125 cursor-pointer' : 'cursor-default'}`}
          >
            {filled ? (
              <FaStar size={size} className="text-yellow-400" />
            ) : (
              <FaRegStar size={size} className="text-gray-500" />
            )}
          </button>
        );
      })}
    </div>
  );
};
