优化HeroSection中的按钮排版，使其更加紧凑美观。

**当前问题：**

* 按钮分为两组，中间有较大间距（mb-16 + mt-4）

* 整体占用高度较大

**优化方案：**
将四个按钮整合为 2x2 网格布局：

1. 桌面端：四个按钮呈 2x2 网格排列
2. 移动端：保持垂直排列
3. 减少间距，使整体更紧凑

**具体修改：**

* 使用 CSS Grid 布局替代 Flex 布局

* 桌面端：`grid-cols-2` 两列布局

* 移动端：`grid-cols-1` 单列布局

* 统一使用 `gap-3` 间距

* 移除两组之间的大间距

**涉及文件：**

* `d:\File\workSpace\AI-test\VidTimelineX\frontend\src\features\yuxiaoc\components\HeroSection.tsx`

