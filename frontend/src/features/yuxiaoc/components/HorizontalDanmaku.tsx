import { useMemo, useEffect, useState, useCallback } from "react";
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
  fontSize: number;
  fontWeight: number;
}

/**
 * 水平飘屏弹幕组件
 * 参照甜筒页面实现，简化逻辑
 * 从右向左滚动的弹幕效果，类似斗鱼/B站直播弹幕
 */
export const HorizontalDanmaku: React.FC<HorizontalDanmakuProps> = ({ theme, isVisible }) => {
  const [isMobile, setIsMobile] = useState(false);

  // 检测移动端视口
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 缓存持续时间，避免重复计算 - 使用固定值替代 Math.random 以避免 purity 错误
  const durationMap = useMemo(() => {
    const map = new Map<number, number>();
    // 获取弹幕池总数量
    const themeDanmaku = theme === "blood" ? danmakuData.bloodDanmaku : danmakuData.mixDanmaku;
    const commonDanmaku = danmakuData.commonDanmaku || [];
    const pool = [...themeDanmaku, ...commonDanmaku];

    for (let i = 0; i < pool.length; i++) {
      // 使用基于索引的伪随机值替代 Math.random
      const pseudoRandom = ((i * 9301 + 49297) % 233280) / 233280;
      map.set(i, (isMobile ? 10 : 8) + pseudoRandom * 4);
    }
    return map;
  }, [theme, isMobile]);

  // 生成弹幕列表 - 使用伪随机数生成器避免在 render 中调用 Math.random
  const danmakuList = useMemo(() => {
    if (!isVisible) return [];

    // 获取当前主题的弹幕数据（主题专属 + 公共弹幕）
    const themeDanmaku = theme === "blood" ? danmakuData.bloodDanmaku : danmakuData.mixDanmaku;
    const commonDanmaku = danmakuData.commonDanmaku || [];
    const pool = [...themeDanmaku, ...commonDanmaku];

    if (pool.length === 0) return [];

    // 移动端使用 5 条轨道，桌面端使用 8 条轨道
    const trackCount = isMobile ? 5 : 8;
    // 移动端弹幕数量减少
    const danmakuCount = isMobile ? 20 : 30;

    const items: DanmakuItem[] = [];

    for (let i = 0; i < danmakuCount && i < pool.length; i++) {
      const trackIndex = i % trackCount;
      const text = pool[i % pool.length]; // 循环使用弹幕文本

      // 根据主题设置颜色
      const color =
        theme === "blood"
          ? "#DC2626" // blood主题使用红色
          : "#7C3AED"; // mix主题使用紫色

      // 使用基于索引的伪随机值替代 Math.random
      const sizeRandom = ((i * 9301 + 49297) % 233280) / 233280;
      const fontSize = sizeRandom > 0.7 ? 20 : sizeRandom > 0.4 ? 17 : 14;
      const fontWeight = sizeRandom > 0.7 ? 800 : 600;

      items.push({
        id: `danmaku-${theme}-${i}`,
        text,
        color,
        top: 5 + trackIndex * (isMobile ? 18 : 12), // 均匀分布：5%, 17%, 29%...
        delay: i * 0.3,
        duration: durationMap.get(i) || (isMobile ? 10 : 8),
        fontSize,
        fontWeight,
      });
    }

    return items;
  }, [theme, isVisible, isMobile, durationMap]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-30 overflow-hidden"
      style={{
        top: "80px", // 避开导航栏和Hero区域
        height: "calc(100vh - 80px)", // 占据剩余视口高度
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
                ? `0 0 15px ${item.color}, 0 0 30px ${item.color}80, 2px 2px 6px rgba(0,0,0,0.9)`
                : `0 0 12px ${item.color}80, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff, 2px 2px 4px rgba(0,0,0,0.5)`,
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
