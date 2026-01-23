import React from 'react';
import { danmuPool } from '@/data/hu_mockData';

const HorizontalDanmu: React.FC = () => {
  // Triple the data to ensure smooth infinite scroll without gaps
  const displayItems = [...danmuPool, ...danmuPool, ...danmuPool];

  return (
    <div className="w-full overflow-hidden bg-primary/10 py-2 relative z-0">
      <div className="flex animate-[scroll-left_25s_linear_infinite] whitespace-nowrap hover:[animation-play-state:paused] w-max">
        {displayItems.map((item, index) => (
          <span
            key={`${item.id}-${index}`}
            className="mx-8 text-lg font-medium inline-flex items-center"
            style={{ 
              color: item.color || 'var(--primary)',
              opacity: 0.8
            }}
          >
            {item.type === 'super' && <span className="mr-1 text-xl">👑</span>}
            {item.type === 'gift' && <span className="mr-1 text-xl">🎁</span>}
            {item.text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default HorizontalDanmu;