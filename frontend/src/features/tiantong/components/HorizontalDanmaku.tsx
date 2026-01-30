import { useMemo, useState } from "react";
import danmakuData from "../data/danmaku-processed.json";

interface HorizontalDanmakuProps {
  theme: "tiger" | "sweet";
}

interface DanmakuItem {
  id: string;
  text: string;
  top: number;
  delay: number;
  duration: number;
  color: string;
}

/**
 * 甜筒页面横向飘屏弹幕组件
 * 参照驴酱页面实现，改为受控组件模式
 */
export function HorizontalDanmaku({ theme }: HorizontalDanmakuProps) {
  // 生成随机持续时间映射，只在组件挂载时执行一次
  const [durationMap] = useState(() => {
    const map = new Map<number, number>();
    if (danmakuData && danmakuData.length > 0) {
      for (let i = 0; i < danmakuData.length; i++) {
        map.set(i, 6 + Math.random() * 4);
      }
    }
    return map;
  });

  const danmakuList = useMemo(() => {
    // 确保 danmakuData 存在且不是空数组
    if (!danmakuData || danmakuData.length === 0) {
      console.warn("Danmaku data is empty or undefined");
      return [];
    }

    const items: DanmakuItem[] = [];
    const trackCount = 8;

    // 使用所有弹幕数据，不再限制20条
    for (let i = 0; i < danmakuData.length; i++) {
      const trackIndex = i % trackCount;
      const danmaku = danmakuData[i];

      // 为每个主题使用固定颜色，与背景形成明显对比
      const color = theme === "tiger" ? "rgb(255, 95, 0)" : "rgb(255, 105, 180)";

      items.push({
        id: `${danmaku.id}-${i}`,
        text: danmaku.text,
        top: 10 + trackIndex * 10,
        delay: i * 0.2, // 减少延迟，使弹幕更密集
        duration: durationMap.get(i) || 8, // 使用预生成的随机持续时间
        color: color,
      });
    }

    return items;
  }, [theme, durationMap]);

  // 即使没有弹幕数据，也渲染组件结构
  return (
    <div className="fixed inset-0 pointer-events-none z-31 overflow-hidden">
      {danmakuList.map(item => (
        <div
          key={item.id}
          className="absolute whitespace-nowrap font-bold"
          style={{
            top: `${item.top}%`,
            left: 0,
            transform: "translateX(100vw)",
            opacity: 1,
            zIndex: 61,
            animation: `danmaku ${item.duration}s linear ${item.delay}s forwards`,
            fontSize: theme === "tiger" ? "20px" : "18px",
            color: item.color,
            textShadow:
              theme === "tiger"
                ? "2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8)"
                : "2px 2px 4px rgba(255,140,180,0.8), -1px -1px 2px rgba(255,140,180,0.6)",
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
