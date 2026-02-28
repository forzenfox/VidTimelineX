# 搜索框 UI 优化计划

## 问题分析

从截图可以看出，搜索框存在**双层边框**问题：
1. **外层容器边框** - SearchButton 组件的容器有边框
2. **内层输入框边框** - input 元素本身也有边框

这种双层边框造成视觉冗余，影响用户体验。

## 优化方案

### 方案 1: 移除外层容器边框（推荐）

**修改文件**: `frontend/src/components/video-view/SearchButton.tsx`

**修改内容**:
```tsx
// expanded 模式下，移除外层容器边框
<div
  data-theme={theme}
  data-testid={dataTestId}
  className={cn(
    "w-80 bg-popover rounded-xl shadow-lg",
    // 移除: border border-border
    className
  )}
>
```

**效果**: 只保留输入框的边框，外层容器无边框，视觉更简洁。

### 方案 2: 移除内层输入框边框

**修改内容**:
```tsx
<input
  className={cn(
    "w-full h-10 pl-9 pr-9 rounded-lg",
    "bg-muted/50",
    // 移除: border border-border/50
    "text-sm text-foreground placeholder:text-muted-foreground",
    "outline-none focus:ring-2 focus:ring-ring",
    "transition-all duration-200"
  )}
/>
```

**效果**: 输入框无边框，依靠背景色区分，但可能不够明显。

### 方案 3: 使用单边框设计

将外层容器边框改为仅底部边框，内层无边框：
```tsx
// 外层
<div className="w-80 bg-popover border-b border-border rounded-xl shadow-lg">

// 内层
<input className="... border-0 ..." />
```

## 推荐方案

**采用方案 1：移除外层容器边框**

理由：
1. 输入框本身需要边框来标识可输入区域
2. 外层容器无边框更简洁
3. 阴影效果（shadow-lg）已足够区分层次
4. 符合现代 UI 设计趋势

## 实施计划

### 阶段 1: 修改 SearchButton 组件

**文件**: `frontend/src/components/video-view/SearchButton.tsx`

**修改位置**: expanded 模式的容器样式

**修改前**:
```tsx
<div
  data-theme={theme}
  data-testid={dataTestId}
  className={cn(
    "w-80 bg-popover border border-border rounded-xl shadow-lg",
    className
  )}
>
```

**修改后**:
```tsx
<div
  data-theme={theme}
  data-testid={dataTestId}
  className={cn(
    "w-80 bg-popover rounded-xl shadow-lg",
    className
  )}
>
```

### 阶段 2: 验证效果

1. 启动开发服务器
2. 在浏览器中查看 PC 端搜索框
3. 确认只有一层边框（输入框边框）
4. 检查移动端搜索功能是否正常

### 阶段 3: 运行测试

确保所有相关测试通过：
- SearchButton 测试
- VideoViewToolbar 测试
- TiantongPage 测试
- LvjiangPage 测试

## 预期效果

### 优化前（双层边框）
```
┌─────────────────────────────┐  ← 外层容器边框
│ ┌─────────────────────────┐ │
│ │  🔍 搜索视频...         │ │  ← 内层输入框边框
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### 优化后（单层边框）
```
┌─────────────────────────────┐
│                             │
│  🔍 搜索视频...             │  ← 只有输入框边框
│                             │
└─────────────────────────────┘
```

## 文件修改清单

1. `frontend/src/components/video-view/SearchButton.tsx`
   - 移除 expanded 模式下外层容器的边框

## 验收标准

- [ ] 搜索框只有一层边框（输入框边框）
- [ ] 外层容器无边框
- [ ] 阴影效果保留
- [ ] 所有相关测试通过
- [ ] 移动端搜索功能正常
- [ ] PC 端搜索功能正常
