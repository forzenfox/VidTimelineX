# 搜索框UI优化计划

## 问题分析

从用户截图可以看出，搜索按钮(icon模式)在移动端显示过小：
- 当前尺寸: 36x36px (w-9 h-9)
- 图标尺寸: 18x18px
- 在移动端触摸目标偏小，不符合WCAG 44x44px标准

## 优化方案

### 方案2: 移动端使用展开模式（用户选择）

在移动端直接显示展开模式的搜索框，而不是图标按钮。

**修改文件**: 
1. `frontend/src/features/yuxiaoc/components/CanteenHall.tsx` - 修改SearchButton调用
2. `frontend/src/components/video-view/SearchButton.tsx` - 优化展开模式样式

**修改内容**:

#### 1. CanteenHall.tsx 修改

```tsx
// 当前代码 - 使用icon模式
<SearchButton
  variant="icon"
  onSearch={handleSearch}
  ...
/>

// 优化后 - 移动端使用expanded模式
<SearchButton
  variant={isMobile ? "expanded" : "icon"}
  onSearch={handleSearch}
  ...
/>
```

#### 2. SearchButton.tsx 优化展开模式样式

```tsx
// 当前展开模式输入框 (约137行)
<input
  className={cn(
    "w-full h-10 pl-10 pr-10 rounded-lg",  // 40px高度
    "text-sm",
    ...
  )}
/>

// 优化后
<input
  className={cn(
    "w-full h-12 pl-11 pr-11 rounded-xl",  // 48px高度
    "text-base",  // 更大字体
    ...
  )}
/>
```

## 实施步骤

### 步骤1: 在CanteenHall中添加移动端检测
- 使用useState和useEffect检测视口宽度
- 根据isMobile状态切换variant

### 步骤2: 优化SearchButton展开模式样式
- 增大输入框高度到48px
- 增大字体到text-base
- 调整圆角为rounded-xl

### 步骤3: 测试验证
- 使用Playwright验证移动端显示展开模式
- 验证桌面端仍使用icon模式
- 确认所有测试通过

## 验收标准

- [ ] 移动端显示展开模式搜索框
- [ ] 桌面端保持icon模式
- [ ] 输入框高度 >= 48px
- [ ] 字体大小 >= 16px (text-base)
- [ ] 所有测试通过
