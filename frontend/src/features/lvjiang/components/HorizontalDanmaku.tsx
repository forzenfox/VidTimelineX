import { useMemo } from "react";
import { dongzhuDanmaku, kaigeDanmaku, commonDanmaku } from "../data";
import {
  DanmakuGenerator,
  type DanmakuMessage,
} from "@/shared/danmaku";

interface HorizontalDanmakuProps {
  theme: "dongzhu" | "kaige";
  isVisible: boolean;
}

export function HorizontalDanmaku({ theme, isVisible }: HorizontalDanmakuProps) {
  const danmakuList = useMemo(() => {
    if (!isVisible) return [];

    const pool =
      theme === "dongzhu"
        ? [...dongzhuDanmaku, ...commonDanmaku]
        : [...kaigeDanmaku, ...commonDanmaku];

    const generator = new DanmakuGenerator({
      theme: theme as "dongzhu" | "kaige",
      textPool: pool,
      users: [],
      colorType: "primary",
      danmakuType: "horizontal",
      randomColor: false,
      randomSize: false,
    });

    const messages = generator.generateBatch({
      count: 20,
      type: "horizontal",
      theme: theme as "dongzhu" | "kaige",
    });

    return messages.map(msg => ({
      id: msg.id,
      text: msg.text,
      top: msg.top || 0,
      delay: msg.delay || 0,
      duration: msg.duration || 8000,
    }));
  }, [theme, isVisible]);

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {danmakuList.map(item => (
        <div
          key={item.id}
          className="absolute whitespace-nowrap font-bold"
          style={{
            top: `${item.top * 100}%`,
            left: 0,
            transform: "translateX(100vw)",
            opacity: 1,
            animation: `lvjiang-danmaku-horizontal ${item.duration}ms linear ${item.delay}ms forwards`,
            fontSize: theme === "dongzhu" ? "18px" : "20px",
            color: theme === "dongzhu" ? "#3498DB" : "#F39C12",
            textShadow:
              theme === "dongzhu"
                ? "2px 2px 4px rgba(52, 152, 219, 0.5), -1px -1px 2px rgba(255, 255, 255, 0.6)"
                : "2px 2px 4px rgba(0, 0, 0, 0.8), -1px -1px 2px rgba(243, 156, 18, 0.6)",
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
