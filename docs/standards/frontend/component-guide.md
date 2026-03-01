# 组件组织规范指南

## 1. 概述

本文档定义了 VidTimelineX 前端项目的组件组织规范，包括组件分类、编写规范、最佳实践和性能优化建议。所有新创建的组件都应遵循本规范。

---

## 2. 组件分类

### 2.1 组件层级结构

```
组件层级
├── Level 1: 页面组件 (Pages)
│   └── 例：HomePage, LvjiangPage, TiantongPage
│
├── Level 2: 布局组件 (Layouts)
│   └── 例：Header, Footer, Sidebar
│
├── Level 3: 业务组件 (Business Components)
│   └── 例：VideoCard, Danmaku, VideoTimeline
│
└── Level 4: 基础 UI 组件 (UI Components)
    └── 例：Button, Input, Dialog, Tooltip
```

### 2.2 组件目录组织

```
src/components/
├── ui/                      # 基础 UI 组件
│   ├── accordion.tsx
│   ├── alert-dialog.tsx
│   ├── alert.tsx
│   ├── avatar.tsx
│   ├── badge.tsx
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── progress.tsx
│   ├── select.tsx
│   ├── separator.tsx
│   ├── skeleton.tsx
│   ├── switch.tsx
│   ├── tabs.tsx
│   ├── textarea.tsx
│   ├── toggle.tsx
│   └── tooltip.tsx
│
├── business/                # 业务组件
│   ├── video/
│   │   ├── VideoCard.tsx
│   │   └── VideoModal.tsx
│   └── video-view/
│       ├── CycleViewButton.tsx
│       ├── EmptyState.tsx
│       ├── FilterDropdown.tsx
│       ├── IconToolbar.tsx
│       ├── PaginationControls.tsx
│       ├── SearchButton.tsx
│       ├── SortDropdown.tsx
│       ├── VideoGrid.tsx
│       ├── VideoList.tsx
│       ├── VideoViewToolbar.tsx
│       └── ViewSwitcher.tsx
│
└── figma/                   # Figma 设计系统组件
    └── ImageWithFallback.tsx
```

### 2.3 功能模块组件

```
src/features/[module]/components/
├── lvjiang/
│   ├── Header.tsx
│   ├── HorizontalDanmaku.tsx
│   ├── LoadingAnimation.tsx
│   ├── SideDanmaku.tsx
│   └── VideoTimeline.tsx
│
├── tiantong/
│   ├── HorizontalDanmaku.tsx
│   ├── LoadingAnimation.tsx
│   ├── SidebarDanmu.tsx
│   ├── ThemeToggle.tsx
│   ├── VideoCard.tsx
│   └── VideoTimeline.tsx
│
└── yuxiaoc/
    ├── CVoiceArchive.tsx
    ├── CanteenHall.tsx
    ├── DanmakuTower.tsx
    ├── Header.tsx
    ├── HeroSection.tsx
    ├── HorizontalDanmaku.tsx
    ├── LoadingAnimation.tsx
    └── TitleHall.tsx
```

---

## 3. 组件职责说明

### 3.1 基础 UI 组件 (`src/components/ui/`)

**职责**：
- 提供通用的 UI 元素
- 基于 Radix UI 封装
- 不带业务逻辑
- 完全通过 props 控制行为

**特点**：
- ✅ 高度可复用
- ✅ 无状态或仅有 UI 状态
- ✅ 完整的 TypeScript 类型定义
- ✅ 支持无障碍访问（a11y）

**示例**：
```typescript
// src/components/ui/button.tsx
import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(`btn btn-${variant} btn-${size}`, className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
```

### 3.2 业务组件 (`src/components/business/`)

**职责**：
- 实现具体业务功能
- 组合基础 UI 组件
- 可包含业务逻辑
- 跨模块复用

**特点**：
- ✅ 依赖基础 UI 组件
- ✅ 可包含状态管理
- ✅ 可调用 API 或 Hook
- ✅ 有明确的业务含义

**示例**：
```typescript
// src/components/business/video/VideoCard.tsx
import React from "react";
import { Card } from "@/components/ui/card";
import { useVideoView } from "@/hooks/useVideoView";

export interface VideoCardProps {
  video: Video;
  onViewChange?: (view: "grid" | "list") => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onViewChange }) => {
  const { handleClick } = useVideoView();

  return (
    <Card onClick={() => handleClick(video)}>
      <img src={video.cover} alt={video.title} />
      <h3>{video.title}</h3>
      <p>{video.duration}</p>
    </Card>
  );
};
```

### 3.3 模块专用组件 (`src/features/[module]/components/`)

**职责**：
- 实现特定业务模块的功能
- 仅在该模块内使用
- 可包含模块特定的业务逻辑
- 不对外暴露

**特点**：
- ✅ 高度定制化
- ✅ 依赖模块数据
- ✅ 可包含复杂业务逻辑
- ❌ 不可跨模块复用

**示例**：
```typescript
// src/features/tiantong/components/ThemeToggle.tsx
import React from "react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/features/tiantong/hooks/useTheme";

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div data-testid="theme-toggle">
      <Switch
        data-testid="toggle-button"
        checked={theme === "sweet"}
        onCheckedChange={toggleTheme}
      />
      <span>{theme === "tiger" ? "老虎主题" : "甜筒主题"}</span>
    </div>
  );
};
```

### 3.4 页面组件 (`src/features/[module]/[Module]Page.tsx`)

**职责**：
- 组合模块内所有组件
- 管理页面级状态
- 处理路由参数
- 协调组件间通信

**特点**：
- ✅ 顶层组件
- ✅ 管理全局状态
- ✅ 处理数据获取
- ✅ 协调子组件

**示例**：
```typescript
// src/features/tiantong/TiantongPage.tsx
import React from "react";
import { Header } from "./components/Header";
import { HorizontalDanmaku } from "./components/HorizontalDanmaku";
import { VideoTimeline } from "./components/VideoTimeline";
import { useVideoData } from "./hooks/useVideoData";

export const TiantongPage: React.FC = () => {
  const { videos, loading } = useVideoData();

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div>
      <Header />
      <HorizontalDanmaku />
      <VideoTimeline videos={videos} />
    </div>
  );
};
```

---

## 4. 组件编写规范

### 4.1 组件结构

**标准组件结构**：
```typescript
import React from "react";
// 1. 导入依赖（React、第三方库）

import { Button } from "@/components/ui/button";
// 2. 导入绝对路径（@/）

import { VideoCard } from "./VideoCard";
// 3. 导入相对路径（同目录）

import "./styles.css";
// 4. 导入样式

// 5. 类型定义
export interface ComponentProps {
  prop1: string;
  prop2?: number;
  onEvent?: () => void;
}

// 6. 组件实现
export const Component: React.FC<ComponentProps> = ({ prop1, prop2, onEvent }) => {
  // 6.1 Hook 调用
  const [state, setState] = React.useState();
  
  // 6.2 事件处理函数
  const handleClick = () => {
    onEvent?.();
  };
  
  // 6.3 渲染
  return (
    <div>
      <Button onClick={handleClick}>{prop1}</Button>
    </div>
  );
};

// 7. 显示名称
Component.displayName = "Component";
```

### 4.2 Props 接口定义

**✅ 正确示例**：
```typescript
// 简单 Props
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

// 复杂 Props
export interface VideoCardProps {
  video: Video;                    // 必需
  showTags?: boolean;              // 可选，默认 false
  onVideoClick?: (video: Video) => void;  // 回调函数
  className?: string;              // 样式覆盖
}
```

**❌ 错误示例**：
```typescript
// ❌ 使用 any
interface Props {
  data: any;
}

// ❌ 缺少类型定义
const Component = (props) => {};

// ❌ Props 太泛
interface Props {
  config: object;
}
```

### 4.3 组件类型

**函数组件（推荐）**：
```typescript
import React from "react";

export const Component: React.FC<Props> = (props) => {
  return <div>{props.children}</div>;
};
```

**带 forwardRef 的组件**：
```typescript
import React from "react";

export const Component = React.forwardRef<HTMLDivElement, Props>(
  (props, ref) => {
    return <div ref={ref}>{props.children}</div>;
  }
);

Component.displayName = "Component";
```

### 4.4 状态管理

**使用 useState**：
```typescript
const [isOpen, setIsOpen] = React.useState(false);
const [count, setCount] = React.useState(0);
```

**使用 useReducer（复杂状态）**：
```typescript
const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "SET_DATA":
      return { ...state, data: action.payload };
    default:
      return state;
  }
};

const [state, dispatch] = React.useReducer(reducer, initialState);
```

### 4.5 事件处理

**✅ 正确示例**：
```typescript
// 定义事件处理函数
const handleClick = React.useCallback(() => {
  // 处理逻辑
}, []);

// 使用
<Button onClick={handleClick}>点击</Button>

// 带参数的事件处理
const handleChange = React.useCallback((value: string) => {
  // 处理逻辑
}, []);

<Input onChange={handleChange} />
```

**❌ 错误示例**：
```typescript
// ❌ 在 JSX 中创建函数
<Button onClick={() => handleClick()}>点击</Button>

// ❌ 直接调用
<Button onClick={handleClick()}>点击</Button>
```

---

## 5. 组件导入导出规范

### 5.1 导出方式

**命名导出（推荐）**：
```typescript
// ✅ 推荐：命名导出
export const Button = () => {};
export const Input = () => {};

// 导入
import { Button, Input } from "@/components/ui";
```

**默认导出（避免）**：
```typescript
// ❌ 避免：默认导出
export default Button;

// 导入
import Button from "@/components/ui/button";
```

### 5.2 索引文件

**创建索引文件**：
```typescript
// src/components/ui/index.ts
export { Button } from "./button";
export { Input } from "./input";
export { Dialog } from "./dialog";
export { Tooltip } from "./tooltip";
```

**使用索引文件导入**：
```typescript
// ✅ 推荐：从索引文件导入
import { Button, Input, Dialog } from "@/components/ui";

// ❌ 避免：直接导入深层路径
import Button from "@/components/ui/button/button";
```

### 5.3 循环依赖避免

**✅ 正确示例**：
```typescript
// Button.tsx
import { Icon } from "@/components/ui/icon";

export const Button = () => <Icon />;

// Icon.tsx
// 不导入 Button
```

**❌ 错误示例**：
```typescript
// Button.tsx
import { Icon } from "@/components/ui/icon";
export const Button = () => <Icon />;

// Icon.tsx
import { Button } from "@/components/ui/button";  // ❌ 循环依赖
export const Icon = () => <Button />;
```

---

## 6. 组件性能优化

### 6.1 React.memo

**使用场景**：Props 变化少，渲染开销大的组件

```typescript
import React from "react";

export const VideoCard = React.memo(({ video, onVideoClick }) => {
  return (
    <div onClick={() => onVideoClick(video)}>
      <img src={video.cover} alt={video.title} />
      <h3>{video.title}</h3>
    </div>
  );
});

VideoCard.displayName = "VideoCard";
```

### 6.2 useMemo

**使用场景**：计算开销大的派生值

```typescript
const filteredVideos = React.useMemo(() => {
  return videos.filter(video => 
    video.tags.includes(selectedTag)
  );
}, [videos, selectedTag]);
```

### 6.3 useCallback

**使用场景**：传递给子组件的回调函数

```typescript
const handleVideoClick = React.useCallback((video: Video) => {
  // 处理逻辑
}, []);

// 传递给 memo 组件
<VideoCard video={video} onVideoClick={handleVideoClick} />
```

### 6.4 懒加载

**使用场景**：大型组件，非首屏组件

```typescript
// 懒加载组件
const VideoTimeline = React.lazy(() => import("./VideoTimeline"));

// 使用 Suspense 包裹
<React.Suspense fallback={<Loading />}>
  <VideoTimeline videos={videos} />
</React.Suspense>
```

---

## 7. 组件测试规范

### 7.1 基本测试结构

```typescript
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button 组件测试", () => {
  /**
   * 测试用例 TC-001: Button 渲染测试
   * 测试目标：验证 Button 组件能正确渲染
   */
  test("TC-001: Button 渲染测试", () => {
    // Arrange
    const buttonText = "点击我";
    
    // Act
    render(<Button>{buttonText}</Button>);
    
    // Assert
    expect(screen.getByText(buttonText)).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-002: Button 点击事件测试
   * 测试目标：验证 Button 点击事件能正确触发
   */
  test("TC-002: Button 点击事件测试", () => {
    // Arrange
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>点击</Button>);
    
    // Act
    fireEvent.click(screen.getByText("点击"));
    
    // Assert
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### 7.2 测试覆盖场景

1. **正常流程测试**：组件在正常情况下的行为
2. **边界条件测试**：组件在边界值下的行为
3. **异常情况测试**：组件在异常情况下的行为
4. **交互测试**：用户与组件的交互行为
5. **状态测试**：组件状态变化

---

## 8. 组件文档规范

### 8.1 JSDoc 注释

```typescript
/**
 * 按钮组件
 * 
 * @description 提供多种样式和尺寸的按钮
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="lg" onClick={handleClick}>
 *   点击我
 * </Button>
 * ```
 */
export const Button: React.FC<ButtonProps> = (props) => {};
```

### 8.2 Props 注释

```typescript
export interface ButtonProps {
  /**
   * 按钮变体
   * @default "default"
   */
  variant?: "default" | "primary" | "danger";
  
  /**
   * 按钮尺寸
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  
  /**
   * 点击事件处理函数
   */
  onClick?: () => void;
  
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;
}
```

---

## 9. 代码审查检查清单

### 9.1 组件结构检查
- [ ] 组件是否遵循标准结构？
- [ ] Props 接口是否有完整类型定义？
- [ ] 是否使用函数组件？
- [ ] 是否有 displayName？

### 9.2 代码质量检查
- [ ] 是否避免使用 any 类型？
- [ ] 是否使用 React.memo 优化？
- [ ] 是否使用 useCallback 缓存回调？
- [ ] 是否使用 useMemo 缓存计算结果？

### 9.3 测试检查
- [ ] 是否有完整的测试用例？
- [ ] 测试是否覆盖正常流程？
- [ ] 测试是否覆盖边界条件？
- [ ] 测试是否覆盖异常情况？

### 9.4 文档检查
- [ ] 是否有 JSDoc 注释？
- [ ] Props 是否有注释说明？
- [ ] 是否有使用示例？

---

## 10. 常见问题 FAQ

### Q1: 何时使用业务组件 vs 模块专用组件？
**A**: 
- 如果组件可以在多个模块复用 → 业务组件
- 如果组件只在一个模块使用 → 模块专用组件

### Q2: 何时使用 React.memo？
**A**: 
- Props 变化频率低
- 组件渲染开销大
- 子组件数量多
- 列表项组件

### Q3: 何时使用懒加载？
**A**: 
- 大型组件
- 非首屏组件
- 路由组件
- 模态框/对话框

### Q4: 何时使用 forwardRef？
**A**: 
- 需要透传 ref 到子元素
- 需要暴露 DOM 节点
- 需要命令式操作

---

## 11. 更新记录

| 版本 | 日期 | 更新内容 | 负责人 |
|------|------|----------|--------|
| v1.0 | 2026-03-01 | 初始版本，定义组件组织规范 | - |

---

**文档版本**: v1.0  
**最后更新**: 2026-03-01  
**维护人员**: VidTimelineX 开发团队
