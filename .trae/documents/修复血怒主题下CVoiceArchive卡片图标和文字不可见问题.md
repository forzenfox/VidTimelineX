## 问题分析
在血怒主题下，CVoiceArchive 组件的卡片背景 `itemBg: "rgba(30, 27, 75, 0.5)"` 透明度太高，导致：
1. 图标背景色与卡片背景色对比度不足
2. 文字颜色与背景对比度不足

## 修复方案
修改血怒主题的颜色配置，提高对比度：
1. **itemBg**: 从 `rgba(30, 27, 75, 0.5)` 改为 `rgba(30, 27, 75, 0.85)` 提高不透明度
2. **分类颜色**: 调整血怒主题下的分类颜色，使用更亮的颜色确保可见性
3. **文字颜色**: 确保文字颜色与背景有足够对比度

## 具体修改
修改 `d:\File\workSpace\AI-test\VidTimelineX\frontend\src\features\yuxiaoc\components\CVoiceArchive.tsx`：
- 第59行: `itemBg` 提高不透明度
- 第21-26行: 调整分类颜色，使用更亮的色调

## 验证步骤
1. 修改后启动开发服务器
2. 切换到血怒主题
3. 检查CVoiceArchive区域的卡片图标和文字是否清晰可见