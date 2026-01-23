import React, { useEffect, useState } from 'react';

interface DanmakuItem {
  id: number;
  text: string;
  top: number;
  delay: number;
  color: string;
}

interface DanmakuWelcomeProps {
  messages: string[];
  colors: string[];
  style?: 'normal' | 'colorful' | 'neon';
  theme?: 'tiger' | 'sweet';
}

const DanmakuWelcome: React.FC<DanmakuWelcomeProps> = ({ 
  messages, 
  colors, 
  style = 'normal',
  theme = 'tiger'
}) => {
  const [danmakus, setDanmakus] = useState<DanmakuItem[]>([]);
  const [show, setShow] = useState(true);

  useEffect(() => {
    // 生成弹幕
    const newDanmakus = messages.map((text, index) => ({
      id: index,
      text,
      top: Math.random() * 70 + 10, // 10% - 80% 的位置
      delay: Math.random() * 2, // 0-2秒的延迟
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    setDanmakus(newDanmakus);

    // 8秒后隐藏弹幕
    const timer = setTimeout(() => {
      setShow(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, [messages, colors]);

  if (!show) return null;

  const getTextStyle = () => {
    switch (style) {
      case 'neon':
        return {
          filter: 'drop-shadow(0 0 8px currentColor)',
          fontWeight: 'bold' as const,
        };
      case 'colorful':
        return {
          fontWeight: 'bold' as const,
        };
      default:
        return {};
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      {danmakus.map((danmaku) => (
        <div
          key={danmaku.id}
          className="absolute whitespace-nowrap text-lg font-bold animate-danmaku"
          style={{
            top: `${danmaku.top}%`,
            animationDelay: `${danmaku.delay}s`,
            color: danmaku.color,
            textShadow: theme === 'tiger' 
              ? '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8)'
              : '2px 2px 4px rgba(255,140,180,0.5), -1px -1px 2px rgba(255,140,180,0.3)',
            ...getTextStyle(),
          }}
        >
          {danmaku.text}
        </div>
      ))}
    </div>
  );
};

export default DanmakuWelcome;
