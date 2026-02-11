import React, { useMemo, useEffect, useState } from "react";
import type { Theme } from "../data/types";
import danmakuData from "../data/danmaku.json";
import { getDanmakuColor, getCommonDanmakuColor } from "../data/danmakuColors";

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
  fontSize: number;
  fontWeight: number;
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

    // 获取当前主题的弹幕数据（主题专属 + 公共弹幕）
    const themeDanmaku = theme === "blood" ? danmakuData.bloodDanmaku : danmakuData.mixDanmaku;
    const commonDanmaku = danmakuData.commonDanmaku || [];
    // 合并主题专属弹幕和公共弹幕
    const pool = [...themeDanmaku, ...commonDanmaku];

    if (pool.length === 0) return [];

    const items: DanmakuItem[] = [];
    const trackCount = 8; // 弹幕轨道数量

    for (let i = 0; i < 30; i++) {
      const text = pool[i % pool.length];
      
      // 根据主题统一分配颜色
      const isCommon = i >= themeDanmaku.length;
      const color = isCommon 
        ? getCommonDanmakuColor() 
        : getDanmakuColor(theme);

      // 随机分配速度 (6-14秒)
      const randomDuration = RANDOM_SEEDS[i % RANDOM_SEEDS.length];
      const duration = 6 + randomDuration * 8;

      // 随机字体大小 (14-20px)
      const fontSize = 14 + Math.floor(randomDuration * 6);
      const fontWeight = randomDuration > 0.7 ? 800 : 600;

      // 使用预生成的随机种子
      const randomDelay = RANDOM_SEEDS[(i + 30) % RANDOM_SEEDS.length];

      items.push({
        id: `danmaku-${theme}-${i}`,
        text,
        color,
        top: 10 + (i % trackCount) * 10, // 8条轨道均匀分布
        delay: i * 0.3 + randomDelay * 2, // 随机延迟，避免同时出现
        duration,
        fontSize,
        fontWeight,
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
            fontSize: `${item.fontSize}px`,
            color: item.color,
            background: `${item.color}15`,
            border: `1px solid ${item.color}40`,
            textShadow: theme === "blood"
              ? `0 0 10px ${item.color}80, 0 0 20px ${item.color}40, 2px 2px 4px rgba(0,0,0,0.8)`
              : `0 0 8px ${item.color}60, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff`,
            fontWeight: item.fontWeight,
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
