import React, { useMemo, useEffect, useState } from "react";
import type { Theme } from "../data/types";
import danmakuData from "../data/danmaku.json";
import { DanmakuGenerator, type DanmakuMessage } from "@/shared/danmaku";

interface HorizontalDanmakuProps {
  theme: Theme;
  isVisible: boolean;
}



/**
 * 水平飘屏弹幕组件
 * 从右向左滚动的弹幕效果，类似斗鱼/B站直播弹幕
 */
export const HorizontalDanmaku: React.FC<HorizontalDanmakuProps> = ({ theme, isVisible }) => {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 使用 requestAnimationFrame 避免在 effect 中直接调用 setState
  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(rafId);
  }, []);

  // 检测移动端视口
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const danmakuList = useMemo(() => {
    if (!isVisible || !mounted) return [];

    // 获取当前主题的弹幕数据（主题专属 + 公共弹幕）
    const themeDanmaku = theme === "blood" ? danmakuData.bloodDanmaku : danmakuData.mixDanmaku;
    const commonDanmaku = danmakuData.commonDanmaku || [];
    // 合并主题专属弹幕和公共弹幕
    const pool = [...themeDanmaku, ...commonDanmaku];

    if (pool.length === 0) return [];

    // 创建弹幕生成器
    const generator = new DanmakuGenerator({
      textPool: pool,
      theme: theme,
      danmakuType: "horizontal",
      randomColor: true,
      randomSize: true,
    });

    // 移动端使用 5 条轨道，桌面端使用 8 条轨道
    const trackCount = isMobile ? 5 : 8;
    // 移动端弹幕数量减少
    const danmakuCount = isMobile ? 20 : 30;

    // 生成弹幕
    const messages = generator.generateBatch({
      count: danmakuCount,
      type: "horizontal",
      theme: theme,
      randomColor: true,
      randomSize: true,
    });

    // 映射为组件需要的格式
    return messages.map((msg, i) => ({
      id: msg.id,
      text: msg.text,
      color: msg.color,
      top: 10 + (i % trackCount) * (isMobile ? 16 : 10),
      delay: msg.delay || i * 300,
      duration: msg.duration || (isMobile ? 10000 + Math.random() * 8000 : 6000 + Math.random() * 8000),
      fontSize: msg.size === "large" ? 20 : msg.size === "medium" ? 17 : 14,
      fontWeight: msg.size === "large" ? 800 : 600,
    }));
  }, [theme, isVisible, mounted, isMobile]);

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
            textShadow:
              theme === "blood"
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
