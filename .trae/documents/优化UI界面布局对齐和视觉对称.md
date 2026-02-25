## 问题分析

### 1. 容器宽度不一致
- Header: `max-w-7xl` (1280px)
- CanteenHall: `max-w-7xl` (1280px)
- CVoiceArchive: `max-w-6xl` (1152px)
- TitleHall: `max-w-6xl` (1152px)
- HeroSection: `max-w-4xl` (896px)

### 2. 标题对齐问题
- 标题居中显示，与下方左对齐的卡片网格不一致

### 3. 内边距不一致
- 各组件使用不同的 padding 值

## 优化方案

### 1. 统一容器宽度
将所有内容区统一为 `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`，与导航栏保持一致

### 2. 标题对齐优化
- 将标题区域改为左对齐，与内容网格对齐
- 或者将标题和内容都改为居中对齐，保持一致

### 3. 内边距统一
统一使用 `py-16 px-4 sm:px-6 lg:px-8` 作为标准内边距

## 修改文件列表
1. `CVoiceArchive.tsx` - 第100行: max-w-6xl → max-w-7xl
2. `TitleHall.tsx` - 第78行: max-w-6xl → max-w-7xl
3. `HeroSection.tsx` - 第130行: max-w-4xl → max-w-7xl

## 预期效果
- 所有内容区左右边界对齐
- 视觉层次更加统一
- 整体布局更加专业