import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'red' | 'white';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'red',
}) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  const colors = { red: 'border-red-600', white: 'border-white' };

  return (
    <div className={`${sizes[size]} border-2 border-transparent ${colors[color]} border-t-current rounded-full animate-spin`} />
  );
};

export const FullPageLoader: React.FC<{ message?: string }> = ({ message }) => (
  <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
    <div className="text-3xl font-black mb-6" style={{
      background: 'linear-gradient(135deg, #e50914 0%, #ff6b6b 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    }}>
      YUKI
    </div>
    <LoadingSpinner size="md" color="red" />
    {message && <p className="text-gray-500 text-sm mt-4">{message}</p>}
  </div>
);
