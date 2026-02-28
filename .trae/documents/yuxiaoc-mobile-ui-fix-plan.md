# Yuxiaoc页面移动端UI修复计划

## 问题分析总结

基于Playwright测试（400x679尺寸）和用户截图，发现以下问题：

### 问题1: 鱼吧链接/B站合集按钮遮挡
**Playwright验证结果（400x679）**: 
- ✅ 按钮未被遮挡，可正常点击
- 按钮位置正常，z-index层级正确
- **但用户截图显示在混躺模式下可能有视觉问题**

**分析**: 
- 按钮在移动端使用单列布局 (`grid-cols-1`)
- 按钮样式在混躺模式（亮色主题）下使用白色背景
- 可能与页面背景融合导致视觉上的"遮挡"感

### 问题2: 时光轴视图UI排版异常
**当前实现**:
- 桌面端：双侧排列，节点在中心，卡片左右交替
- 移动端：垂直列表，但节点和连接线被隐藏 (`hidden sm:flex`)

**问题**:
- 移动端时光轴线在左侧 (left: 24px)，但视频卡片居中
- 视觉不协调，空间利用不足

**优化方案**: 
- 移动端改为：时光轴线在左侧，视频卡片在右侧排列
- 添加简化的移动端节点（小圆点）

### 问题3: 搜索框位置超出屏幕
**Playwright验证结果**:
- ❌ 搜索框 left: -51px，超出屏幕左侧
- 需要修复为居中显示

---

## 修复步骤

### 步骤1: 修复搜索框位置问题（高优先级）

**文件**: `frontend/src/components/video-view/SearchButton.tsx`

**问题**: 下拉框使用 `right-0` 定位，在移动端导致位置偏移

**修复方案**:
```tsx
// 当前代码（约258-265行）
<div
  className={cn(
    "absolute top-full right-0 mt-2 rounded-xl ...",
    "w-[calc(100vw-32px)] max-w-[320px] sm:w-80"
  )}
>

// 修复后 - 移动端居中，桌面端右对齐
<div
  className={cn(
    "absolute top-full mt-2 rounded-xl ...",
    "left-4 right-4 sm:left-auto sm:right-0",
    "sm:w-80"
  )}
>
```

**或者使用居中方案**:
```tsx
<div
  className={cn(
    "fixed sm:absolute top-16 left-1/2 -translate-x-1/2 sm:translate-x-0",
    "sm:top-full sm:left-auto sm:right-0 mt-2 rounded-xl ...",
    "w-[calc(100vw-32px)] max-w-[360px] sm:w-80"
  )}
>
```

**验收标准**:
- 移动端搜索框不超出屏幕
- 桌面端保持右对齐

---

### 步骤2: 优化移动端时光轴视图UI

**文件**: `frontend/src/features/yuxiaoc/components/CanteenHall.tsx`

**当前问题**:
- 移动端时光轴线在左侧，但视频卡片居中
- 节点和连接线在移动端被隐藏

**优化方案**:

#### 2.1 修改移动端时光轴线位置
```tsx
// 当前（约173-182行）
<div
  className="sm:hidden absolute left-6 top-0 bottom-0 w-0.5 rounded-full"
  ...
/>

// 优化后 - 调整位置，与卡片对齐
<div
  className="sm:hidden absolute left-4 top-0 bottom-0 w-0.5 rounded-full"
  ...
/>
```

#### 2.2 添加移动端简化节点
```tsx
// 在TimelineVideoItem组件中添加移动端节点
<div className="sm:hidden absolute left-4 w-3 h-3 rounded-full -ml-1.5 z-10"
  style={{
    background: isBlood ? '#E11D48' : '#D97706',
    border: `2px solid ${isBlood ? '#1E1B4B' : '#FFFFFF'}`,
    top: '24px',
  }}
/>
```

#### 2.3 修改视频卡片布局（移动端左对齐）
```tsx
// 当前（约101行）
className={`relative mb-8 sm:mb-16 flex items-center ${isLeft ? "sm:justify-start" : "sm:justify-end"} justify-center`}

// 优化后 - 移动端左对齐，留出左侧时光轴空间
className={`relative mb-8 sm:mb-16 flex items-center ${isLeft ? "sm:justify-start" : "sm:justify-end"} justify-start pl-8 sm:pl-0`}
```

#### 2.4 修改卡片容器（移动端全宽）
```tsx
// 当前（约109行）
className={`relative w-full max-w-sm sm:w-5/12 ${isLeft ? "sm:pr-20" : "sm:pl-20"} px-4 sm:px-0`}

// 优化后 - 移动端使用剩余空间
className={`relative w-full sm:max-w-sm sm:w-5/12 ${isLeft ? "sm:pr-20" : "sm:pl-20"} sm:px-0`}
```

**验收标准**:
- 移动端时光轴线在左侧
- 视频卡片在时光轴线右侧排列
- 添加简化的移动端节点（小圆点）
- 布局协调，空间利用合理

---

### 步骤3: 优化按钮视觉样式（混躺模式）

**文件**: `frontend/src/features/yuxiaoc/components/HeroSection.tsx`

**问题**: 混躺模式下按钮使用白色背景，可能与页面背景融合

**修复方案**:
```tsx
// 鱼吧链接和B站合集按钮（约311-346行）
// 添加更明显的边框或阴影

<a
  ...
  style={{
    background: isBlood ? "rgba(30, 27, 75, 0.6)" : "#FFFFFF",
    color: isBlood ? "#E2E8F0" : "#0F172A",
    // 增强边框可见度
    border: isBlood 
      ? "1px solid rgba(225, 29, 72, 0.4)" 
      : "1px solid #D97706",  // 混躺模式使用主题色边框
    boxShadow: isBlood
      ? "0 4px 15px rgba(225, 29, 72, 0.2)"
      : "0 4px 15px rgba(217, 119, 6, 0.15)",  // 混躺模式添加主题色阴影
  }}
>
```

**验收标准**:
- 混躺模式下按钮边框更明显
- 按钮与背景有清晰区分

---

### 步骤4: 测试验证

**测试内容**:
1. 使用Playwright模拟400x679尺寸测试
2. 验证搜索框位置正确
3. 验证时光轴视图显示正常
4. 验证按钮样式优化
5. 检查混躺模式和血怒模式

---

## 技术细节

### 响应式断点
- 移动端: < 640px (sm)
- 桌面端: >= 640px

### 关键样式类
```css
/* 搜索框居中 */
.fixed sm:absolute top-16 left-1/2 -translate-x-1/2  /* 移动端居中 */
.sm:top-full sm:left-auto sm:right-0 sm:translate-x-0  /* 桌面端右对齐 */

/* 时光轴移动端 */
.sm:hidden  /* 移动端显示，桌面端隐藏 */
.hidden sm:flex  /* 桌面端显示，移动端隐藏 */

/* 布局调整 */
.pl-8 sm:pl-0  /* 移动端左侧留出时光轴空间 */
.justify-start sm:justify-center  /* 移动端左对齐 */
```

### 文件清单
1. `frontend/src/components/video-view/SearchButton.tsx` - 搜索框位置
2. `frontend/src/features/yuxiaoc/components/CanteenHall.tsx` - 时光轴视图
3. `frontend/src/features/yuxiaoc/components/HeroSection.tsx` - 按钮样式

---

## 验收标准

- [ ] 搜索框在移动端不超出屏幕
- [ ] 时光轴视图在移动端：轴线左侧，卡片右侧
- [ ] 混躺模式下按钮边框更明显
- [ ] 所有测试通过
