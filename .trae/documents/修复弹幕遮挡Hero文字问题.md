## 问题分析

从截图和代码分析，发现以下两个问题：

### 问题1：色块遮挡"C皇驾到"文字
截图中显示在头像下方有一个红色/橙色的渐变条遮挡了标题。这可能是：
- 头像下方的装饰元素或渐变效果位置不当
- 或者是有其他绝对定位的元素覆盖了标题

### 问题2："观看血怒时刻"按钮挡住鼠标图案
- 按钮区域（CTA Buttons）位置太高
- 底部的 Scroll Indicator（鼠标图案）被按钮遮挡

## 修复方案

### 修复1：检查并调整可能遮挡标题的元素
在 HeroSection.tsx 中：
1. 检查头像下方的渐变环（Glow Ring）是否过大或位置不当
2. 确保标题 `h1` 元素有足够的 `z-index` 和清晰的定位

### 修复2：调整按钮和鼠标指示器的位置
在 HeroSection.tsx 中：
1. 减少按钮区域下方的 margin/padding
2. 将 Scroll Indicator（鼠标图案）向下移动，避免被按钮遮挡
3. 或者增加按钮区域与鼠标指示器之间的间距

## 具体修改

### 修改 HeroSection.tsx

#### 修改1：调整 Scroll Indicator 位置
```tsx
// 当前位置
<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">

// 修改为更靠下
<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
```

#### 修改2：确保标题不被遮挡
检查标题样式，确保 `z-index` 正确：
```tsx
<h1 className="text-5xl md:text-7xl font-black mb-4 relative z-20">
```

#### 修改3：调整按钮区域底部间距
```tsx
{/* CTA Buttons */}
<div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
```

请确认这个修复方案后，我将开始执行修改。