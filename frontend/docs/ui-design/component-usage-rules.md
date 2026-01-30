# 组件使用规则文档

## 1. 文档信息

- **文档名称**：组件使用规则文档
- **版本**：1.0
- **最后更新**：2026-01-28
- **作者**：UI 设计团队
- **适用范围**：亿口甜筒·时光视频集应用

## 2. 组件分类

### 2.1 全局组件

- **UI 组件**：位于 `src/components/ui/` 目录，包括按钮、卡片、输入框等基础组件
- **通用组件**：位于 `src/components/` 目录，如 `PerformanceMonitor.tsx`

### 2.2 甜筒页面组件

- **核心组件**：位于 `src/features/tiantong/components/` 目录
  - `HorizontalDanmaku.tsx`：水平弹幕组件
  - `LoadingAnimation.tsx`：加载动画组件
  - `SidebarDanmu.tsx`：侧边弹幕组件
  - `ThemeToggle.tsx`：主题切换组件
  - `TimelineItem.tsx`：时间线项组件
  - `VideoCard.tsx`：视频卡片组件
  - `VideoModal.tsx`：视频模态框组件
  - `VideoTimeline.tsx`：视频时间线组件

### 2.3 驴酱页面组件

- **核心组件**：位于 `src/features/lvjiang/components/` 目录
  - `Header.tsx`：页面头部组件
  - `HorizontalDanmaku.tsx`：水平弹幕组件
  - `LoadingAnimation.tsx`：加载动画组件
  - `SideDanmaku.tsx`：侧边弹幕组件
  - `VideoModal.tsx`：视频模态框组件
  - `VideoTimeline.tsx`：视频时间线组件

## 3. 组件使用规则

### 3.1 水平弹幕组件（HorizontalDanmaku）

#### 3.1.1 甜筒页面版本

**组件路径**：`src/features/tiantong/components/HorizontalDanmaku.tsx`

**属性说明**：
| 属性名 | 类型 | 必选 | 默认值 | 说明 |
|-------|------|------|--------|------|
| theme | `"tiger" \| "sweet"` | 是 | 无 | 当前主题 |

**使用示例**：

```tsx
import { HorizontalDanmaku } from "./components/HorizontalDanmaku";

// 在页面中使用
<HorizontalDanmaku theme={theme} />;
```

**最佳实践**：

- 放置在页面最顶层，确保能覆盖整个页面
- 与侧边弹幕组件配合使用时，注意 z-index 层级

#### 3.1.2 驴酱页面版本

**组件路径**：`src/features/lvjiang/components/HorizontalDanmaku.tsx`

**属性说明**：
| 属性名 | 类型 | 必选 | 默认值 | 说明 |
|-------|------|------|--------|------|
| theme | `"dongzhu" \| "kaige"` | 是 | 无 | 当前主题 |
| isVisible | `boolean` | 是 | 无 | 是否可见 |

**使用示例**：

```tsx
import { HorizontalDanmaku } from "./components/HorizontalDanmaku";

// 在页面中使用
<HorizontalDanmaku theme={theme} isVisible={showDanmaku} />;
```

### 3.2 侧边弹幕组件（SidebarDanmu/SideDanmaku）

#### 3.2.1 甜筒页面版本

**组件路径**：`src/features/tiantong/components/SidebarDanmu.tsx`

**属性说明**：
| 属性名 | 类型 | 必选 | 默认值 | 说明 |
|-------|------|------|--------|------|
| theme | `"tiger" \| "sweet"` | 否 | `"tiger"` | 当前主题 |

**使用示例**：

```tsx
import SidebarDanmu from "./components/SidebarDanmu";

// 在页面中使用
<SidebarDanmu theme={theme} />;
```

**最佳实践**：

- 放置在页面右侧，作为辅助信息区域
- 与水平弹幕组件配合使用时，注意 z-index 层级

#### 3.2.2 驴酱页面版本

**组件路径**：`src/features/lvjiang/components/SideDanmaku.tsx`

**属性说明**：
| 属性名 | 类型 | 必选 | 默认值 | 说明 |
|-------|------|------|--------|------|
| theme | `"dongzhu" \| "kaige"` | 是 | 无 | 当前主题 |

**使用示例**：

```tsx
import { SideDanmaku } from "./components/SideDanmaku";

// 在页面中使用
<SideDanmaku theme={theme} />;
```

### 3.3 视频时间线组件（VideoTimeline）

#### 3.3.1 甜筒页面版本

**组件路径**：`src/features/tiantong/components/VideoTimeline.tsx`

**属性说明**：
| 属性名 | 类型 | 必选 | 默认值 | 说明 |
|-------|------|------|--------|------|
| theme | `"tiger" \| "sweet"` | 是 | 无 | 当前主题 |
| onVideoClick | `(video: Video) => void` | 是 | 无 | 视频点击回调函数 |

**使用示例**：

```tsx
import { VideoTimeline } from "./components/VideoTimeline";

// 在页面中使用
<VideoTimeline
  theme={theme}
  onVideoClick={video => {
    console.log("Video click passed to TiantongPage:", video.title);
    setSelectedVideo(video);
  }}
/>;
```

#### 3.3.2 驴酱页面版本

**组件路径**：`src/features/lvjiang/components/VideoTimeline.tsx`

**属性说明**：
| 属性名 | 类型 | 必选 | 默认值 | 说明 |
|-------|------|------|--------|------|
| theme | `"dongzhu" \| "kaige"` | 是 | 无 | 当前主题 |
| onVideoClick | `(video: Video) => void` | 是 | 无 | 视频点击回调函数 |

**使用示例**：

```tsx
import { VideoTimeline } from "./components/VideoTimeline";

// 在页面中使用
<VideoTimeline theme={theme} onVideoClick={handleVideoClick} />;
```

### 3.4 视频模态框组件（VideoModal）

#### 3.4.1 甜筒页面版本

**组件路径**：`src/features/tiantong/components/VideoModal.tsx`

**属性说明**：
| 属性名 | 类型 | 必选 | 默认值 | 说明 |
|-------|------|------|--------|------|
| video | `Video` | 是 | 无 | 视频数据 |
| onClose | `() => void` | 是 | 无 | 关闭模态框回调 |
| theme | `"tiger" \| "sweet"` | 是 | 无 | 当前主题 |

**使用示例**：

```tsx
import VideoModal from "./components/VideoModal";

// 在页面中使用
{
  selectedVideo && (
    <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} theme={theme} />
  );
}
```

#### 3.4.2 驴酱页面版本

**组件路径**：`src/features/lvjiang/components/VideoModal.tsx`

**属性说明**：
| 属性名 | 类型 | 必选 | 默认值 | 说明 |
|-------|------|------|--------|------|
| video | `Video` | 是 | 无 | 视频数据 |
| theme | `"dongzhu" \| "kaige"` | 是 | 无 | 当前主题 |
| onClose | `() => void` | 是 | 无 | 关闭模态框回调 |

**使用示例**：

```tsx
import { VideoModal } from "./components/VideoModal";

// 在页面中使用
<VideoModal video={selectedVideo} theme={theme} onClose={handleCloseModal} />;
```

### 3.5 主题切换组件（ThemeToggle）

**组件路径**：`src/features/tiantong/components/ThemeToggle.tsx`

**属性说明**：
| 属性名 | 类型 | 必选 | 默认值 | 说明 |
|-------|------|------|--------|------|
| currentTheme | `"tiger" \| "sweet"` | 是 | 无 | 当前主题 |
| onToggle | `() => void` | 是 | 无 | 主题切换回调 |

**使用示例**：

```tsx
import ThemeToggle from "./components/ThemeToggle";

// 在页面中使用
<ThemeToggle currentTheme={theme} onToggle={handleToggleTheme} />;
```

### 3.6 加载动画组件（LoadingAnimation）

#### 3.6.1 甜筒页面版本

**组件路径**：`src/features/tiantong/components/LoadingAnimation.tsx`

**使用示例**：

```tsx
import { LoadingAnimation } from "./components/LoadingAnimation";

// 在页面中使用
<LoadingAnimation />;
```

#### 3.6.2 驴酱页面版本

**组件路径**：`src/features/lvjiang/components/LoadingAnimation.tsx`

**属性说明**：
| 属性名 | 类型 | 必选 | 默认值 | 说明 |
|-------|------|------|--------|------|
| onComplete | `(theme: "dongzhu" \| "kaige") => void` | 是 | 无 | 加载完成回调 |

**使用示例**：

```tsx
import { LoadingAnimation } from "./components/LoadingAnimation";

// 在页面中使用
<LoadingAnimation onComplete={handleLoadingComplete} />;
```

## 4. 组件最佳实践

### 4.1 通用最佳实践

1. **组件导入**：
   - 使用相对路径导入组件
   - 对于频繁使用的组件，考虑创建统一的导出文件

2. **组件放置**：
   - 遵循页面布局规范，将组件放置在合适的位置
   - 注意组件之间的层级关系和 z-index 设置

3. **属性传递**：
   - 明确传递必要的属性
   - 对于可选属性，提供合理的默认值
   - 使用 TypeScript 类型定义，确保类型安全

4. **状态管理**：
   - 合理使用 React 状态管理，避免不必要的重渲染
   - 对于复杂状态，考虑使用 useReducer 或状态管理库

5. **性能优化**：
   - 使用 React.memo 缓存组件
   - 使用 useCallback 和 useMemo 优化函数和计算值
   - 对于大型列表，使用虚拟滚动

### 4.2 特定组件最佳实践

#### 4.2.1 时间线组件

- **数据处理**：对视频数据进行合理的过滤和排序
- **加载策略**：考虑使用懒加载或分页加载大量视频数据
- **用户交互**：提供清晰的点击反馈和加载状态

#### 4.2.2 弹幕组件

- **性能优化**：限制同时显示的弹幕数量，避免性能问题
- **样式控制**：使用 CSS 动画实现平滑的弹幕效果
- **用户体验**：确保弹幕不遮挡重要内容

#### 4.2.3 模态框组件

- ** accessibility**：确保模态框符合可访问性标准
- **键盘导航**：支持 ESC 键关闭模态框
- **背景处理**：点击背景可以关闭模态框

## 5. 组件版本控制

### 5.1 版本管理

- **组件版本**：每个组件应在文件头部注释中注明版本信息
- **变更记录**：记录组件的重要变更和更新

### 5.2 兼容性

- **向后兼容**：修改组件时应保持向后兼容
- **废弃警告**：对于将要废弃的属性，提供明确的警告信息
- **迁移指南**：当组件有重大变更时，提供迁移指南

## 6. 组件测试

### 6.1 测试策略

- **单元测试**：测试组件的基本功能和属性
- **集成测试**：测试组件与其他组件的交互
- **视觉测试**：测试组件的视觉效果

### 6.2 测试工具

- 使用 Jest 和 React Testing Library 进行单元测试
- 使用 Playwright 或 Cypress 进行集成测试
- 使用 Storybook 进行组件开发和测试

## 7. 参考资料

- **组件文件**：
  - `src/features/tiantong/components/` 目录下的所有组件文件
  - `src/features/lvjiang/components/` 目录下的所有组件文件

- **测试文件**：
  - `src/tests/unit/components/features/tiantong/` 目录下的测试文件
  - `src/tests/unit/components/features/lvjiang/` 目录下的测试文件

- **设计规范**：
  - React 组件设计最佳实践
  - Tailwind CSS 组件使用指南
