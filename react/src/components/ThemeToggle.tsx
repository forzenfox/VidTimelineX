import React from 'react';
import { Crown, Heart } from 'lucide-react';

interface ThemeToggleProps {
  currentTheme: 'tiger' | 'sweet';
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ currentTheme, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`
        relative h-10 w-24 rounded-full p-1 transition-all duration-300 shadow-custom
        ${currentTheme === 'tiger' ? 'bg-[rgb(50,40,30)] border-2 border-[rgb(255,95,0)]' : 'bg-[rgb(255,230,235)] border-2 border-[rgb(255,140,180)]'}
      `}
    >
      <div className={`absolute inset-0 flex items-center px-3 text-xs font-bold w-full h-full z-10 ${currentTheme === 'tiger' ? 'justify-start' : 'justify-end'}`}>
        <span className={currentTheme === 'tiger' ? 'text-white' : 'opacity-0'}
          style={{ textShadow: '0 0 2px rgba(255,95,0,0.8)' }}
        >
          TIGER
        </span>
        <span className={currentTheme === 'tiger' ? 'opacity-0' : 'text-[rgb(255,140,180)] ml-auto'}
          style={{ textShadow: '0 0 2px rgba(255,255,255,0.8)' }}
        >
          SWEET
        </span>
      </div>
      
      <div
        className={`
          absolute top-1 bottom-1 w-8 rounded-full flex items-center justify-center transition-all duration-300 transform z-0
          ${currentTheme === 'tiger' ? 'translate-x-14 bg-[rgb(255,95,0)]' : 'translate-x-0 bg-[rgb(255,140,180)]'}
        `}
      >
        {currentTheme === 'tiger' ? (
          <Crown size={16} className="text-white" />
        ) : (
          <Heart size={16} className="text-white" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;