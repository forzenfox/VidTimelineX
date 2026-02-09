import React, { useMemo, useEffect, useState } from "react";
import type { Theme } from "../data/types";
import danmakuData from "../data/danmaku.json";

interface HorizontalDanmakuProps {
  theme: Theme;
  isVisible: boolean;
}

interface DanmakuItem {
  id: string;
  text: string;
  color: string;
  top: number;
  delay: number;
  duration: number;
  speed: "slow" | "normal" | "fast" | "large";
}

// 预生成的随机数数组，避免在 render 中使用 Math.random
const RANDOM_SEEDS = Array.from({ length: 60 }, () => Math.random());

/**
 * 水平飘屏弹幕组件
 * 从右向左滚动的弹幕效果，类似斗鱼/B站直播弹幕
 */
export const HorizontalDanmaku: React.FC<HorizontalDanmakuProps> = ({ theme, isVisible }) => {
  const [mounted, setMounted] = useState(false);

  // 使用 requestAnimationFrame 避免在 effect 中直接调用 setState
  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(rafId);
  }, []);

  const danmakuList = useMemo(() => {
    if (!isVisible || !mounted) return [];

    // 获取当前主题的弹幕数据
    const pool = danmakuData[theme]?.horizontal || [];
    if (pool.length === 0) return [];

    const items: DanmakuItem[] = [];
    const trackCount = 8; // 弹幕轨道数量，参考lvjiang实现

    for (let i = 0; i < 30; i++) {
      const danmaku = pool[i % pool.length];
      const speed = (danmaku.speed as "slow" | "normal" | "fast" | "large") || "normal";
      let duration = 10;
      if (speed === "fast") duration = 6;
      if (speed === "slow") duration = 14;

      // 使用预生成的随机种子
      const randomDelay = RANDOM_SEEDS[i] || 0;
      const randomDuration = RANDOM_SEEDS[i + 30] || 0;

      items.push({
        id: `danmaku-${theme}-${i}`,
        text: danmaku.text,
        color: danmaku.color,
        top: 10 + (i % trackCount) * 10, // 8条轨道均匀分布：10%, 20%, 30%, 40%, 50%, 60%, 70%, 80%
        delay: i * 0.3 + randomDelay * 2, // 随机延迟，避免同时出现
        duration: duration + randomDuration * 3,
        speed: speed,
      });
    }
    return items;
  }, [theme, isVisible, mounted]);

  if (!isVisible || !mounted) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-30 overflow-hidden"
      style={{
        top: "120px", // 避开导航栏和Hero区域
        height: "calc(100vh - 120px)", // 占据剩余视口高度
      }}
    >
      {/* CSS 动画定义 */}
      <style>{`
        @keyframes yuxiao-danmaku-scroll {
          0% {
            transform: translateX(100vw);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>

      {danmakuList.map(item => (
        <div
          key={item.id}
          className="absolute whitespace-nowrap font-bold px-4 py-1 rounded-full"
          style={{
            top: `${item.top}%`,
            left: 0,
            transform: "translateX(100vw)",
            opacity: 1,
            animation: `yuxiao-danmaku-scroll ${item.duration}s linear ${item.delay}s forwards`,
            fontSize: item.speed === "large" ? "18px" : "14px",
            color: item.color,
            background: `${item.color}15`,
            border: `1px solid ${item.color}40`,
            textShadow: `0 0 10px ${item.color}60, 0 0 20px ${item.color}40`,
            fontWeight: item.speed === "large" ? 800 : 600,
            letterSpacing: "0.5px",
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
};

export default HorizontalDanmaku;
