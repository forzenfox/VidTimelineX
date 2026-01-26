import React, { useEffect, useMemo, useState } from "react";

interface DanmakuItem {
  id: number;
  text: string;
  top: number;
  delay: number;
  duration: number;
  color: string;
}

interface DanmakuWelcomeProps {
  messages: string[];
  colors: string[];
  style?: "normal" | "colorful" | "neon";
  theme?: "tiger" | "sweet";
}

/**
 * 甜筒欢迎弹幕组件
 * 实现固定轨道系统，优化动画效果和性能
 */
const DanmakuWelcome: React.FC<DanmakuWelcomeProps> = ({
  messages,
  colors,
  style = "normal",
  theme = "tiger",
}) => {
  const [show, setShow] = useState(true);

  // 使用固定轨道系统生成弹幕数据
  const danmakus = useMemo(() => {
    if (!show || messages.length === 0) return [];

    const items: DanmakuItem[] = [];
    const trackCount = 8;

    for (let i = 0; i < 20; i++) {
      const trackIndex = i % trackCount;
      items.push({
        id: i,
        text: messages[Math.floor(Math.random() * messages.length)],
        top: 10 + trackIndex * 10,
        delay: i * 0.3,
        duration: 8 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    return items;
  }, [messages, colors, show]);

  useEffect(() => {
    // 当主题变化时，重置show状态为true
    setShow(true);

    const timer = setTimeout(() => {
      setShow(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, [theme]);

  if (!show) return null;

  const getTextStyle = () => {
    switch (style) {
      case "neon":
        return {
          filter: "drop-shadow(0 0 8px currentColor)",
          fontWeight: "bold" as const,
        };
      case "colorful":
        return {
          fontWeight: "bold" as const,
        };
      default:
        return {};
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      {danmakus.map(danmaku => (
        <div
          key={danmaku.id}
          className="absolute whitespace-nowrap font-bold"
          style={{
            top: `${danmaku.top}%`,
            transform: "translateX(100vw)",
            animation: `danmaku-move ${danmaku.duration}s linear ${danmaku.delay}s forwards`,
            fontSize: theme === "sweet" ? "18px" : "18px",
            color: danmaku.color,
            textShadow:
              theme === "tiger"
                ? "2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8)"
                : "2px 2px 4px rgba(255,140,180,0.8), -1px -1px 2px rgba(255,140,180,0.6)",
            fontWeight: "800",
            letterSpacing: "1px",
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
