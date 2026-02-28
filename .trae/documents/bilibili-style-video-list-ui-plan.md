# B站风格视频列表UI排版优化计划

## 目标
参照B站视频列表UI的排版设计，优化 `frontend/src/` 下所有页面的视频列表UI排版，**保持现有数据字段不变**，重点提升用户体验。

## B站视频列表UI排版特点分析

根据提供的截图，B站视频列表的排版特点：

### 1. 列表项整体布局
```
┌─────────────────────────────────────────────────────┐
│ ┌──────────────┐  ┌──────────────────────────────┐  │
│ │              │  │ 标题 (16px, semibold)         │  │
│ │   封面图     │  │ 简介 (14px, 灰色)             │  │
│ │  (16:9比例)  │  │ 简介 (14px, 灰色)             │  │
│ │   圆角8px    │  ├──────────────────────────────┤  │
│ │  时长标签    │  │ 👁 播放量  💬 评论  📅 日期    │  │
│ └──────────────┘  └──────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

- **左侧封面图区域**：固定宽度，16:9比例
- **右侧信息区域**：flex布局，垂直排列
- **整体间距**：列表项之间有清晰的分隔

### 2. 封面图区域排版
- 比例：严格的16:9
- 圆角：8px
- 时长标签：右上角，深色背景+白色文字
- 悬停效果：播放按钮遮罩淡入

### 3. 信息区域排版
- **标题**：
  - 位置：信息区顶部
  - 字体：16px，font-weight: 600
  - 行数：最多2行，超出省略
  - 间距：与封面顶部对齐

- **简介**（如有）：
  - 位置：标题下方
  - 字体：14px，灰色(#9499A0)
  - 行数：最多2行
  - 与标题间距：8px

- **元信息**：
  - 位置：信息区底部
  - 字体：12px，灰色
  - 布局：水平排列，图标+文字
  - 与简介间距：12px

### 4. 列表间距与分隔
- 列表项间距：16px
- 分隔方式：间距分隔（无分割线）
- 内边距：列表项整体有适当内边距

### 5. 响应式排版
- **桌面端**：封面180px宽度，信息区自适应
- **平板端**：封面160px宽度
- **移动端**：封面140px宽度，或切换为垂直布局

## 当前系统分析

### 现有数据字段（保持不变）
```typescript
interface Video {
  id: string;
  title: string;
  date: string;
  videoUrl: string;
  bv: string;
  cover: string;
  cover_url?: string;
  tags: string[];
  duration: string;
  author?: string;
  views?: number | string;
}
```

### 需要优化的排版问题

#### 1. VideoCard 列表模式排版问题
- [ ] 封面与信息区的间距不合理
- [ ] 标题字体大小和行高需要调整
- [ ] 元信息排列过于紧凑
- [ ] 缺少清晰的视觉层次

#### 2. VideoList 排版问题
- [ ] 列表项间距不一致
- [ ] 缺少统一的分隔感

#### 3. VideoGrid 排版问题
- [ ] 网格间距需要统一
- [ ] 卡片内边距需要优化

## 实施计划

### Phase 1: VideoCard 列表模式排版优化（TDD）

#### 任务 1.1: 编写排版测试
- **测试文件**: `tests/unit/components/video/VideoCard.layout.test.tsx`
- **测试内容**:
  - 封面图区域尺寸测试（16:9比例）
  - 标题样式测试（字体大小、行数限制）
  - 元信息布局测试（水平排列）
  - 整体间距测试
  - 响应式布局测试

#### 任务 1.2: 实现列表模式排版
- **文件**: `src/components/video/VideoCard.tsx`
- **排版优化点**:

```tsx
// 列表模式布局结构
<div className="flex gap-4 p-3">  {/* 整体容器：flex布局，16px间距 */}
  {/* 封面区域：固定宽度 */}
  <div className="w-[180px] shrink-0">  {/* 桌面端180px，不收缩 */}
    <div className="aspect-video rounded-lg overflow-hidden relative">
      <img />  {/* 16:9封面图 */}
      <span className="absolute top-2 right-2">{duration}</span>  {/* 时长标签 */}
    </div>
  </div>
  
  {/* 信息区域：flex-1，垂直布局 */}
  <div className="flex-1 flex flex-col min-w-0">  {/* min-w-0防止溢出 */}
    {/* 标题：顶部 */}
    <h3 className="text-base font-semibold line-clamp-2">
      {title}
    </h3>
    
    {/* 元信息：底部 */}
    <div className="mt-auto flex items-center gap-4 text-xs text-gray-500">
      <span>👤 {author}</span>
      <span>📅 {date}</span>
      {views && <span>👁 {views}</span>}
    </div>
  </div>
</div>
```

#### 任务 1.3: 响应式排版适配
- 桌面端（≥1024px）：封面180px
- 平板端（768px-1023px）：封面160px
- 移动端（<768px）：封面140px 或切换布局

### Phase 2: VideoCard 网格模式排版优化（TDD）

#### 任务 2.1: 编写网格模式测试
- **测试文件**: `tests/unit/components/video/VideoCard.grid.test.tsx`

#### 任务 2.2: 实现网格模式排版
- **排版优化点**:

```tsx
// 网格模式布局结构
<div className="flex flex-col gap-2">  {/* 垂直布局，8px间距 */}
  {/* 封面区域：100%宽度 */}
  <div className="aspect-video rounded-lg overflow-hidden relative">
    <img />
    <span className="absolute top-2 right-2">{duration}</span>
  </div>
  
  {/* 信息区域 */}
  <div className="px-1">
    <h3 className="text-sm font-medium line-clamp-2">{title}</h3>
    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
      <span>{author}</span>
      <span>·</span>
      <span>{date}</span>
    </div>
  </div>
</div>
```

### Phase 3: VideoList 容器排版优化（TDD）

#### 任务 3.1: 编写容器排版测试
- **测试文件**: `tests/unit/components/video-view/VideoList.layout.test.tsx`

#### 任务 3.2: 实现容器排版
- **文件**: `src/components/video-view/VideoList.tsx`
- **排版优化点**:

```tsx
// 列表容器
<div className="flex flex-col gap-4">  {/* 列表项间距16px */}
  {videos.map((video, index) => (
    <div key={video.id} className="group">
      <VideoCard 
        layout="horizontal"
        className="transition-all duration-200 hover:bg-gray-50 rounded-lg"
      />
    </div>
  ))}
</div>
```

### Phase 4: VideoGrid 容器排版优化（TDD）

#### 任务 4.1: 编写网格容器测试
- **测试文件**: `tests/unit/components/video-view/VideoGrid.layout.test.tsx`

#### 任务 4.2: 实现网格容器排版
- **文件**: `src/components/video-view/VideoGrid.tsx`
- **排版优化点**:

```tsx
// 网格容器
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {videos.map((video) => (
    <VideoCard 
      key={video.id}
      layout="vertical"
      className="h-full"
    />
  ))}
</div>
```

### Phase 5: 工具栏排版优化

#### 任务 5.1: VideoViewToolbar 排版优化
- **文件**: `src/components/video-view/VideoViewToolbar.tsx`
- **优化点**:
  - 视图切换按钮间距统一
  - 筛选/排序按钮对齐方式
  - 移动端适配

#### 任务 5.2: FilterDropdown/SortDropdown 排版优化
- **优化点**:
  - 下拉面板内边距统一
  - 选项间距统一
  - 选中状态样式

### Phase 6: 页面集成与响应式测试

#### 任务 6.1: TiantongPage 排版验证
- **测试**: `tests/integration/tiantong/layout.test.tsx`
- **验证点**:
  - 列表视图排版正确
  - 网格视图排版正确
  - 响应式适配正常

#### 任务 6.2: LvjiangPage 排版验证
- **测试**: `tests/integration/lvjiang/layout.test.tsx`

#### 任务 6.3: E2E排版验证
- **测试**: `tests/e2e/video-list-layout.e2e.tsx`
- **验证点**:
  - 不同屏幕尺寸下的排版
  - 悬停效果
  - 整体视觉一致性

## 排版规范定义

### 间距规范
```css
/* 列表项间距 */
--list-item-gap: 16px;

/* 卡片内边距 */
--card-padding: 12px;

/* 封面与信息区间距 */
--cover-info-gap: 16px;

/* 信息区内元素间距 */
--info-element-gap: 8px;

/* 元信息元素间距 */
--meta-item-gap: 16px;
```

### 尺寸规范
```css
/* 封面宽度（列表模式） */
--cover-width-desktop: 180px;
--cover-width-tablet: 160px;
--cover-width-mobile: 140px;

/* 封面圆角 */
--cover-radius: 8px;

/* 时长标签 */
--duration-padding: 4px 8px;
--duration-radius: 4px;
```

### 字体规范
```css
/* 列表模式标题 */
--list-title-size: 16px;
--list-title-weight: 600;
--list-title-line-clamp: 2;

/* 网格模式标题 */
--grid-title-size: 14px;
--grid-title-weight: 500;

/* 元信息 */
--meta-size: 12px;
--meta-color: #9499A0;
```

## TDD开发流程

每个排版优化任务遵循：

1. **编写排版测试**（Red）
   - 测试布局结构
   - 测试间距尺寸
   - 测试响应式表现

2. **实现排版代码**（Green）
   - 使用Tailwind CSS类
   - 遵循排版规范

3. **验证测试通过**（Refactor）
   - 确保所有测试通过
   - 优化代码可读性

## 文件变更清单

### 修改文件
1. `src/components/video/VideoCard.tsx` - 优化卡片排版
2. `src/components/video-view/VideoList.tsx` - 优化列表容器排版
3. `src/components/video-view/VideoGrid.tsx` - 优化网格容器排版
4. `src/components/video-view/VideoViewToolbar.tsx` - 优化工具栏排版
5. `src/components/video-view/FilterDropdown.tsx` - 优化筛选下拉排版
6. `src/components/video-view/SortDropdown.tsx` - 优化排序下拉排版

### 新增测试文件
1. `tests/unit/components/video/VideoCard.layout.test.tsx`
2. `tests/unit/components/video/VideoCard.grid.test.tsx`
3. `tests/unit/components/video-view/VideoList.layout.test.tsx`
4. `tests/unit/components/video-view/VideoGrid.layout.test.tsx`
5. `tests/integration/tiantong/layout.test.tsx`
6. `tests/integration/lvjiang/layout.test.tsx`
7. `tests/e2e/video-list-layout.e2e.tsx`

## 验收标准

### 排版正确性
- [ ] 封面图严格保持16:9比例
- [ ] 列表模式封面宽度：桌面180px/平板160px/移动140px
- [ ] 标题最多显示2行，超出省略
- [ ] 元信息水平排列，间距16px
- [ ] 列表项间距统一为16px

### 视觉层次
- [ ] 标题与元信息有明显视觉区分
- [ ] 封面与信息区有清晰分隔
- [ ] 列表项之间有明确分隔感

### 响应式表现
- [ ] 桌面端排版正常
- [ ] 平板端排版正常
- [ ] 移动端排版正常或切换布局

### 用户体验
- [ ] 悬停效果流畅自然
- [ ] 点击区域明确
- [ ] 视觉焦点清晰

### 测试覆盖
- [ ] 单元测试覆盖率 >= 80%
- [ ] 集成测试覆盖主要布局场景
- [ ] E2E测试覆盖响应式布局

## 依赖关系

```
Phase 1 (VideoCard列表排版)
    ↓
Phase 2 (VideoCard网格排版)
    ↓
Phase 3 (VideoList容器排版)
    ↓
Phase 4 (VideoGrid容器排版)
    ↓
Phase 5 (工具栏排版)
    ↓
Phase 6 (集成测试)
```

## 时间安排

- Phase 1: 2天（含TDD）
- Phase 2: 1天（含TDD）
- Phase 3: 1天（含TDD）
- Phase 4: 1天（含TDD）
- Phase 5: 1天
- Phase 6: 1天

总计：约7天
