## 问题分析

从截图可以看到，"血怒模式"和"混躺模式"两个按钮大小不一致。

## 原因

1. 两个按钮的副标题文字长度不同：

   * 血怒模式："无情铁手，血Carry"（9个字符）

   * 混躺模式："混与躺轮回不止"（7个字符）
2. 按钮没有固定宽高，导致根据内容自适应

## 修复方案

为两个按钮添加固定且相同的尺寸：

1. 添加 `w-48`（固定宽度 192px）
2. 添加 `h-32`（固定高度 128px）
3. 使用 `flex flex-col items-center justify-center` 确保内容居中

## 修改代码

```tsx
<button
  className="w-48 h-32 px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center"
  ...
>
```

两个按钮都应用相同的固定尺寸，确保大小完全一致。
