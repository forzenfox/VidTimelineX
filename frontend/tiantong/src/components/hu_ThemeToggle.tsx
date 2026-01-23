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
        relative min-h-[3rem] h-12 w-24 rounded-full p-1 transition-all duration-400 shadow-custom hover:shadow-lg active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        ${currentTheme === 'tiger' ? 'bg-[rgb(30,25,20)] border-2 border-[rgb(255,110,20)]' : 'bg-[rgb(255,220,225)] border-2 border-[rgb(255,120,160)]'}
      `}
      aria-label={`切换到${currentTheme === 'tiger' ? '甜筒' : '老虎'}主题`}
      role="switch"
      aria-checked={currentTheme === 'sweet'}
    >
      <div className={`absolute inset-0 flex items-center px-3 text-xs font-bold w-full h-full z-10 transition-all duration-300 ${currentTheme === 'tiger' ? 'justify-start' : 'justify-end'}`}>
        <span className={`transition-all duration-300 ease-in-out ${currentTheme === 'tiger' ? 'text-white opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}
          style={{ textShadow: '0 0 2px rgba(255,110,20,0.8)' }}
        >
          TIGER
        </span>
        <span className={`transition-all duration-300 ease-in-out ml-auto ${currentTheme === 'tiger' ? 'opacity-0 translate-x-2' : 'text-[rgb(255,80,120)] opacity-100 translate-x-0'}`}
          style={{ textShadow: '0 0 2px rgba(255,255,255,0.8)' }}
        >
          SWEET
        </span>
      </div>
      
      <div
        className={`
          absolute top-1 bottom-1 w-8 rounded-full flex items-center justify-center transition-all duration-400 transform ease-in-out z-0 shadow-inner
          ${currentTheme === 'tiger' ? 'translate-x-14 bg-[rgb(255,95,0)]' : 'translate-x-0 bg-[rgb(255,140,180)]'}
        `}
      >
        <div className="transition-transform duration-300 ease-in-out">
          {currentTheme === 'tiger' ? (
            <Crown size={16} className="text-white" />
          ) : (
            <Heart size={16} className="text-white" />
          )}
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;