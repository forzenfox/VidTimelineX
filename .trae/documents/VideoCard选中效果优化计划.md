# VideoCard 选中效果优化计划

## 目标

优化视频卡片的选中效果，确保：

1. 覆盖全局的选中效果
2. 视频封面悬停覆盖层主题色，透明度50%
3. 播放按钮背景主题色

## 当前状态分析

### 当前代码（第 177-192 行）

```tsx
<div
  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
  style={{ background: `${colors.primary}80` }}
>
  <div
    className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-300"
    style={{ background: `${colors.primary}CC` }}
    aria-hidden="true"
  >
    <Play
      className="ml-1"
      size={28}
      style={{ color: colors.primaryForeground, fill: colors.primaryForeground }}
    />
  </div>
</div>
```

### 透明度对照表

| 十六进制 | 透明度  |
| ---- | ---- |
| 80   | 50%  |
| CC   | 80%  |
| FF   | 100% |

## 修改方案

### 1. 视频封面悬停覆盖层（第 179 行）

**当前**：`background: ${colors.primary}80`（50%透明度）
**需求**：透明度50%
**结论**：已符合需求，无需修改

### 2. 播放按钮背景（第 183 行）

**当前**：`background: ${colors.primary}CC`（80%透明度）
**需求**：主题色背景
**修改**：`background: ${colors.primary}`（100%不透明）

## 文件修改清单

| 文件路径                                                      | 修改内容           |
| --------------------------------------------------------- | -------------- |
| `frontend/src/components/video/VideoCard.tsx`             | 播放按钮背景改为不透明主题色 |
| `frontend/tests/unit/components/video/VideoCard.test.tsx` | 更新测试用例         |

## 测试验证

1. 运行单元测试：`npm test`
2. 运行代码检查：`npm run lint`
3. 手动验证各主题悬停效果

