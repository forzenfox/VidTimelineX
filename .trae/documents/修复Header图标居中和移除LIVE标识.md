## 修复内容

### 问题1: 图标不在正中间
**位置**: Header.tsx 第115-131行
**原因**: Crown图标容器虽然使用了`flex items-center justify-center`，但图标本身可能需要更精确的居中
**修复方案**: 确保图标完全居中，添加`mx-auto`或调整flex布局

### 问题2: 头像的LIVE标识
**位置**: Header.tsx 第128-130行
**代码**:
```tsx
<div className="absolute bottom-0 right-0 bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">
  LIVE
</div>
```
**修复方案**: 删除这段LIVE标识代码

### 修改文件
- `frontend/src/features/yuxiaoc/components/Header.tsx`

### 验证步骤
1. 修改代码后运行Header相关测试
2. 在浏览器中验证图标居中效果
3. 确认LIVE标识已移除