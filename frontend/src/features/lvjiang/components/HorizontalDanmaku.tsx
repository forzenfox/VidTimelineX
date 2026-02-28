import { useMemo } from "react";
import danmakuData from "../data/danmaku.json";

interface HorizontalDanmakuProps {
  theme: "dongzhu" | "kaige";
  isVisible?: boolean;
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
 * 驴酱页面横向飘屏弹幕组件
 * 参照 yuxiaoc 页面实现，使用 useMemo 优化
 */
export function HorizontalDanmaku({ theme, isVisible = true }: HorizontalDanmakuProps) {
  // 根据主题获取弹幕池
  const textPool = useMemo(() => {
    return theme === "dongzhu"
      ? [...danmakuData.dongzhuDanmaku, ...danmakuData.commonDanmaku]
      : [...danmakuData.kaigeDanmaku, ...danmakuData.commonDanmaku];
  }, [theme]);

  // durationMap 放入 useMemo，随 theme 变化重新生成 - 使用伪随机数替代 Math.random
  const durationMap = useMemo(() => {
    const map = new Map<number, number>();
    for (let i = 0; i < textPool.length; i++) {
      // 使用基于索引的伪随机值替代 Math.random
      const pseudoRandom = ((i * 9301 + 49297) % 233280) / 233280;
      // duration: 8-12 秒，与 yuxiaoc 页面保持一致
      map.set(i, 8 + pseudoRandom * 4);
    }
    return map;
  }, [theme, textPool]);

  const danmakuList = useMemo(() => {
    if (!isVisible) return [];

    const trackCount = 8;
    const color = theme === "dongzhu" ? "#1A5276" : "#B9770E";

    return textPool.map((text, i) => ({
      id: `danmaku-${theme}-${i}`, // ID 包含主题，确保唯一性
      text,
      top: 10 + (i % trackCount) * 10, // 10%, 20%, 30%...
      // delay: 0.3 秒，与 yuxiaoc 页面保持一致
      delay: i * 0.3,
      duration: durationMap.get(i) || 8,
      color: color,
    }));
  }, [theme, isVisible, textPool, durationMap]);

  // 即使没有弹幕数据，也渲染组件结构
  return (
    <div className="fixed inset-0 pointer-events-none z-31 overflow-hidden">
      {danmakuList.map(item => (
        <div
          key={item.id}
          className="absolute whitespace-nowrap font-bold px-4 py-1 rounded-full"
          style={{
            top: `${item.top}%`,
            left: 0,
            transform: "translateX(100vw)",
            opacity: 1,
            animation: `danmaku ${item.duration}s linear ${item.delay}s forwards`,
            fontSize: theme === "dongzhu" ? "20px" : "22px",
            color: item.color,
            // 参照 yuxiaoc 页面实现，取消光晕效果，只保留白色描边
            textShadow:
              theme === "dongzhu"
                ? "-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff, 2px 2px 4px rgba(0,0,0,0.5)"
                : "-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff, 2px 2px 4px rgba(0,0,0,0.5)",
            background: `${item.color}20`,
            border: `1px solid ${item.color}40`,
            fontWeight: "800",
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
}
