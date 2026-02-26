# 时间轴视图切换与筛选功能 Spec

## Why
当前页面视频数量较多（50-62个），现有时光轴布局导致用户浏览效率低下，无法快速定位目标内容。需要实现视图模式切换（时光轴/网格/列表）、筛选排序功能，并记忆用户偏好。

## What Changes
- 新增视图切换组件（ViewSwitcher）
- 新增筛选下拉组件（FilterDropdown）
- 新增排序下拉组件（SortDropdown）
- 新增视频网格视图（VideoGrid）
- 新增视频列表视图（VideoList）
- 新增用户偏好Hook（useViewPreferences）
- 新增视频筛选Hook（useVideoFilter）
- 支持本地存储用户偏好

## Impact
- Affected specs: 时间轴展示优化产品需求文档、时间轴展示优化-交互设计规格
- Affected code: 
  - frontend/src/features/tiantong/
  - frontend/src/features/lvjiang/
  - frontend/src/components/video-view/ (新建)

---

## ADDED Requirements

### Requirement: 视图模式切换功能
系统应提供三种视图模式供用户切换：时光轴模式、网格模式、列表模式。

#### Scenario: 用户切换视图模式
- **WHEN** 用户点击视图切换按钮（时光轴/网格/列表）
- **THEN** 
  - 页面切换到对应的视图模式
  - 切换过程有300ms淡入淡出动画
  - 滚动位置重置到页面顶部
  - 视图模式保存到localStorage

#### Scenario: 用户返回页面恢复视图模式
- **WHEN** 用户返回页面且localStorage中保存了视图偏好
- **THEN** 页面自动恢复到上次使用的视图模式

### Requirement: 视频筛选功能
系统应提供按视频时长和发布时间筛选视频的功能。

#### Scenario: 用户筛选视频
- **WHEN** 用户选择筛选条件并点击"应用"按钮
- **THEN**
  - 视频列表更新为符合筛选条件的视频
  - 筛选触发器文字更新为当前筛选条件
  - 无结果时显示空状态组件

#### Scenario: 用户重置筛选条件
- **WHEN** 用户点击"重置"按钮
- **THEN**
  - 所有筛选条件恢复为默认值
  - 视频列表恢复显示全部视频

### Requirement: 视频排序功能
系统应提供按发布时间和播放量排序视频的功能。

#### Scenario: 用户切换排序方式
- **WHEN** 用户从排序下拉菜单选择排序方式
- **THEN**
  - 视频列表按选择的方式重新排序
  - 排序立即生效，无需点击确认

### Requirement: 响应式布局
系统在不同的屏幕尺寸下应有适当的布局调整。

#### Scenario: 移动端视图
- **WHEN** 屏幕宽度小于768px
- **THEN**
  - 网格模式显示2列
  - 工具栏变为两行布局
  - 列表模式使用紧凑布局

---

## MODIFIED Requirements

### Requirement: VideoTimeline 组件扩展
现有VideoTimeline组件需支持视图模式切换。

#### Scenario: 渲染不同视图模式
- **WHEN** viewMode 属性为 'timeline'
- **THEN** 渲染现有时光轴布局（左右交替）
- **WHEN** viewMode 属性为 'grid'
- **THEN** 渲染网格布局（CSS Grid）
- **WHEN** viewMode 属性为 'list'
- **THEN** 渲染列表布局（Flexbox）

---

## Implementation Guide

### 组件结构
```
src/
├── components/
│   └── video-view/
│       ├── ViewSwitcher.tsx      # 视图切换器
│       ├── FilterDropdown.tsx    # 筛选下拉
│       ├── SortDropdown.tsx      # 排序下拉
│       ├── VideoGrid.tsx         # 网格视图
│       ├── VideoList.tsx         # 列表视图
│       ├── EmptyState.tsx        # 空状态
│       └── index.ts             # 导出入口
├── hooks/
│   ├── useViewPreferences.ts    # 用户偏好Hook
│   └── useVideoFilter.ts        # 视频筛选Hook
```

### 类型定义
```typescript
export type ViewMode = 'timeline' | 'grid' | 'list';
export type DurationFilter = 'all' | 'short' | 'medium' | 'long';
export type TimeRangeFilter = 'all' | 'week' | 'month' | 'year';
export type SortOption = 'newest' | 'oldest' | 'popular';

export interface FilterState {
  duration: DurationFilter;
  timeRange: TimeRangeFilter;
  sortBy: SortOption;
}

export interface UserPreferences {
  viewMode: ViewMode;
  filter: FilterState;
}
```

### 样式规范
- 视图切换按钮：高度36px，圆角8px，最小宽度64px
- 筛选面板：宽度280px，圆角12px，阴影xl
- 网格布局：桌面4列/平板3列/移动2列
- 动画时长：视图切换300ms，按钮悬停150ms

### 依赖
- React 18+
- TypeScript
- Tailwind CSS
- Lucide React 图标库
