# VideoCard 主题色透明度问题修复计划

## 问题分析

### 现象
- `VideoCard.tsx` 第 179 行使用 `style={{ background: `${colors.primary}CC` }}` 设置 80% 透明度的主题色
- 其他页面（blood、mix、dongzhu、kaige）正常显示透明效果
- 只有 tiantong 页面（tiger/sweet 主题）无效，但改成 `FF` 就会生效

### 根本原因

在 `VideoCard.tsx` 的 `getThemeColors` 函数中，不同主题的 `primary` 颜色使用了不同的格式：

| 主题 | primary 格式 | 示例值 | 拼接 CC 后 |
|------|-------------|--------|-----------|
| tiger | `rgb(...)` | `rgb(255, 95, 0)` | `rgb(255, 95, 0)CC` ❌ 无效 |
| sweet | `rgb(...)` | `rgb(255, 140, 120)` | `rgb(255, 140, 120)CC` ❌ 无效 |
| blood | `#xxxxxx` | `#E11D48` | `#E11D48CC` ✅ 有效 |
| mix | `#xxxxxx` | `#F59E0B` | `#F59E0BCC` ✅ 有效 |
| dongzhu | `#xxxxxx` | `#5DADE2` | `#5DADE2CC` ✅ 有效 |
| kaige | `#xxxxxx` | `#E74C3C` | `#E74C3CCC` ✅ 有效 |

**问题核心**：`rgb(...)` 格式的颜色值后面直接拼接 `CC` 会产生无效的 CSS 颜色值，而 `#xxxxxx` hex 格式拼接 `CC` 后是有效的 8 位 hex 颜色（带 alpha 通道）。

### 为什么改成 FF 会生效？
用户可能是在 hex 格式下测试的，`#xxxxxxFF` 表示完全不透明，浏览器可以正确解析。

## 修复方案

### 方案：统一使用 hex 格式

将 `tiger` 和 `sweet` 主题的 `primary` 颜色从 `rgb(...)` 格式转换为 `#xxxxxx` hex 格式：

- `rgb(255, 95, 0)` → `#FF5F00`
- `rgb(255, 140, 120)` → `#FF8C78`

### 修改文件
- `d:\workspace\VidTimelineX\frontend\src\components\video\VideoCard.tsx`

### 具体修改内容

```typescript
// 修改前
case "tiger":
  return {
    primary: "rgb(255, 95, 0)",
    ...
  };
case "sweet":
  return {
    primary: "rgb(255, 140, 120)",
    ...
  };

// 修改后
case "tiger":
  return {
    primary: "#FF5F00",
    ...
  };
case "sweet":
  return {
    primary: "#FF8C78",
    ...
  };
```

## 验证步骤
1. 启动开发服务器
2. 访问 tiantong 页面
3. 切换 tiger 和 sweet 主题
4. 悬停视频卡片，确认透明遮罩层正常显示
