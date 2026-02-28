# Yuxiaoc页面飘屏弹幕修复计划

## 问题描述

yuxiaoc页面只能看到一条飘屏弹幕，而期望看到多条弹幕同时滚动。

## 根因分析

### 1. 轨道分配逻辑问题

**DanmakuGenerator.getRandomTop()** (src/shared/danmaku/generator.ts:217-221):
```typescript
private getRandomTop(): number {
  const trackCount = 8;
  const trackIndex = Math.floor(Math.random() * trackCount);
  return trackIndex / trackCount;  // 返回 0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875
}
```

**问题**: 使用 `Math.random()` 随机分配轨道，20条弹幕随机分配到8条轨道，导致：
- 某些轨道分配多条弹幕，相互重叠
- 某些轨道没有弹幕
- 视觉上看起来只有一条弹幕（其他被遮挡或未分配到可见轨道）

### 2. 与正常实现的对比

**甜筒页面实现** (src/features/tiantong/components/HorizontalDanmaku.tsx:43-58):
```typescript
const trackCount = 8;

for (let i = 0; i < textPool.length; i++) {
  const trackIndex = i % trackCount;  // 使用索引取模，确保均匀分布
  const text = textPool[i];
  const color = theme === "tiger" ? "rgb(255, 95, 0)" : "rgb(255, 105, 180)";

  items.push({
    id: `danmaku-${i}`,
    text,
    top: 10 + trackIndex * 10,        // 10%, 20%, 30%... 均匀分布
    delay: i * 0.2,                   // 200ms间隔，弹幕更密集
    duration: durationMap.get(i) || 8,
    color: color,
  });
}
```

**甜筒页面的优点**:
1. **轨道分配**：使用 `i % trackCount` 索引取模，确保每条轨道均匀分配弹幕
2. **延迟时间**：`i * 0.2` 秒（200ms），比yuxiaoc的300ms更密集
3. **持续时间缓存**：使用useState缓存duration，避免重复计算
4. **简化实现**：不依赖DanmakuGenerator，直接使用原始数据

**yuxiaoc页面当前实现** (src/features/yuxiaoc/components/HorizontalDanmaku.tsx:40-72):
```typescript
// 问题1：使用DanmakuGenerator，内部随机分配轨道
const generator = new DanmakuGenerator({
  textPool: pool,
  theme: theme,
  danmakuType: "horizontal",
  randomColor: true,
  randomSize: true,
});

const messages = generator.generateBatch({
  count: danmakuCount,  // 30条
  type: "horizontal",
  theme: theme,
  randomColor: true,
  randomSize: true,
});

// 问题2：虽然这里使用索引取模，但DanmakuGenerator内部已经随机分配了top和delay
return messages.map((msg, i) => ({
  id: msg.id,
  text: msg.text,
  color: msg.color,
  top: 5 + (i % trackCount) * (isMobile ? 18 : 12),  // 这里覆盖了内部的随机top
  delay: msg.delay || i * 300,  // 使用内部的delay（index * 300）
  duration: msg.duration || (isMobile ? 10 + Math.random() * 5 : 8 + Math.random() * 7),
  // ...
}));
```

### 3. 动画延迟问题

DanmakuGenerator.generateMessage() (src/shared/danmaku/generator.ts:99):
```typescript
message.delay = index * 300;  // 每条弹幕延迟300ms
```

30条弹幕，每条延迟300ms：
- 第1条：0ms延迟
- 第30条：8700ms延迟

这导致弹幕是依次出现，而不是同时滚动，进一步降低了"多条弹幕"的视觉效果。

## 修复方案（参照甜筒页面实现）

### 核心思路

完全参照甜筒页面的实现方式，简化yuxiaoc的HorizontalDanmaku组件：

1. **移除DanmakuGenerator依赖**：直接使用danmaku.json数据
2. **索引取模分配轨道**：确保每条轨道均匀分配弹幕
3. **优化延迟时间**：从300ms减少到200ms
4. **缓存持续时间**：使用useState避免重复计算

### 具体代码修改

```typescript
// src/features/yuxiaoc/components/HorizontalDanmaku.tsx

import { useMemo, useEffect, useState } from "react";
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

  // 缓存持续时间，避免重复计算
  const [durationMap] = useState(() => {
    const map = new Map<number, number>();
    // 获取弹幕池总数量
    const themeDanmaku = theme === "blood" ? danmakuData.bloodDanmaku : danmakuData.mixDanmaku;
    const commonDanmaku = danmakuData.commonDanmaku || [];
    const pool = [...themeDanmaku, ...commonDanmaku];
    
    for (let i = 0; i < pool.length; i++) {
      map.set(i, (isMobile ? 10 : 8) + Math.random() * 4);
    }
    return map;
  });

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
      const color = theme === "blood" 
        ? "#DC2626"  // blood主题使用红色
        : "#7C3AED"; // mix主题使用紫色

      // 随机字体大小
      const sizeRandom = Math.random();
      const fontSize = sizeRandom > 0.7 ? 20 : sizeRandom > 0.4 ? 17 : 14;
      const fontWeight = sizeRandom > 0.7 ? 800 : 600;

      items.push({
        id: `danmaku-${theme}-${i}`,
        text,
        color,
        top: 5 + trackIndex * (isMobile ? 18 : 12),  // 均匀分布：5%, 17%, 29%...
        delay: i * 0.2,  // 200ms间隔，比原来的300ms更密集
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
        top: "80px",
        height: "calc(100vh - 80px)",
      }}
    >
      <style>{`
        @keyframes yuxiao-danmaku-scroll {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
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
```

## 关键改进点

| 方面 | 原实现 | 甜筒实现 | 修复后 |
|------|--------|----------|--------|
| 数据源 | DanmakuGenerator | 直接使用txt | 直接使用json |
| 轨道分配 | 随机分配 | 索引取模 | 索引取模 |
| 延迟间隔 | 300ms | 200ms | 200ms |
| 持续时间 | 每次重新计算 | useState缓存 | useState缓存 |
| 代码复杂度 | 高（依赖Generator） | 低（直接映射） | 低（直接映射） |

## 测试计划

根据TDD原则，先编写测试用例：

1. **单元测试**: 验证弹幕轨道分配均匀（每条轨道有且仅有相同数量的弹幕）
2. **单元测试**: 验证延迟时间正确设置（间隔200ms）
3. **单元测试**: 验证持续时间缓存有效
4. **E2E测试**: 验证页面上可见多条弹幕同时滚动

## 实施步骤

1. 编写/更新单元测试
2. 修改HorizontalDanmaku组件（参照甜筒实现）
3. 运行测试验证修复
4. 手动验证页面效果

## 风险评估

- **低风险**: 仅修改yuxiaoc组件，不影响其他模块
- **可回滚**: 修改简单，可随时回滚到原始实现
- **参考验证**: 甜筒页面已实现并验证此方案有效
