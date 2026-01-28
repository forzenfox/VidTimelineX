import { useMemo } from "react";
import { dongzhuDanmaku, kaigeDanmaku, commonDanmaku } from "../data";

interface HorizontalDanmakuProps {
  theme: "dongzhu" | "kaige";
  isVisible: boolean;
}

interface DanmakuItem {
  id: string;
  text: string;
  top: number;
  delay: number;
  duration: number;
}

export function HorizontalDanmaku({ theme, isVisible }: HorizontalDanmakuProps) {
  const danmakuList = useMemo(() => {
    if (!isVisible) return [];

    const pool =
      theme === "dongzhu"
        ? [...dongzhuDanmaku, ...commonDanmaku]
        : [...kaigeDanmaku, ...commonDanmaku];

    const items: DanmakuItem[] = [];
    for (let i = 0; i < 20; i++) {
      items.push({
        id: `danmaku-${i}`,
        // eslint-disable-next-line react-hooks/purity
        text: pool[Math.floor(Math.random() * pool.length)],
        top: 10 + (i % 8) * 10,
        delay: i * 0.3,
        // eslint-disable-next-line react-hooks/purity
        duration: 8 + Math.random() * 4,
      });
    }
    return items;
  }, [theme, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {danmakuList.map(item => (
        <div
          key={item.id}
          className="absolute whitespace-nowrap font-bold"
          style={{
            top: `${item.top}%`,
            left: 0,
            transform: "translateX(100vw)",
            opacity: 1,
            animation: `lvjiang-danmaku-horizontal ${item.duration}s linear ${item.delay}s forwards`,
            fontSize: theme === "dongzhu" ? "18px" : "20px",
            color: theme === "dongzhu" ? "#5DADE2" : "#E74C3C",
            textShadow:
              theme === "dongzhu"
                ? "2px 2px 4px rgba(93, 173, 226, 0.5), -1px -1px 2px rgba(255, 255, 255, 0.6)"
                : "2px 2px 4px rgba(0, 0, 0, 0.8), -1px -1px 2px rgba(231, 76, 60, 0.6)",
            fontWeight: "800",
            letterSpacing: "1px",
            willChange: "transform, opacity",
            backfaceVisibility: "hidden",
            perspective: 1000,
          }}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
}
