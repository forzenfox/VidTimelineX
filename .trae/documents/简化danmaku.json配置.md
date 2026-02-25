## 任务目标
简化 `yuxiaoc/data/danmaku.json` 配置，参照 `lvjiang` 和 `tiantong` 的方案，并创建构建时融合脚本。

## 设计方案

### 1. 简化 danmaku.json 结构
参照 `lvjiang/danmaku.json`，只保留纯文本数组：
```json
{
  "bloodDanmaku": [
    "C皇血怒时刻！",
    "无情铁手！",
    ...
  ],
  "mixDanmaku": [...],
  "commonDanmaku": [...]
}
```

### 2. 创建 danmakuColors.ts 颜色配置
参照 `tiantong/danmakuColors.ts`，统一配置颜色方案：
- **blood 主题**：红色系 `#E11D48`、`#DC2626`、`#F87171`
- **mix 主题**：琥珀/蓝色系 `#F59E0B`、`#3B82F6`、`#10B981`
- **common 弹幕**：中性色 `#6B7280`、`#8B5CF6`

### 3. 创建 buildDanmaku.ts 构建脚本
在 `scripts/` 目录下创建构建脚本：
- 读取 `users.json` 和简化后的 `danmaku.json`
- 融合生成 `danmaku-processed.json`
- 每个弹幕项包含：id、text、user、color、type 等

### 4. 修改组件
- **HorizontalDanmaku.tsx**：使用简化后的数据和统一颜色配置
- **DanmakuTower.tsx**：使用简化后的数据和统一颜色配置

### 5. 颜色可见性保证
- 在深色/亮色背景下都能清晰可见
- 使用高对比度颜色
- 添加文字阴影增强可读性

## 需要修改的文件清单

### 数据文件
1. `yuxiaoc/data/danmaku.json` - 简化结构
2. `yuxiaoc/data/danmakuColors.ts` - 新建颜色配置
3. `scripts/buildDanmakuYuxiaoc.ts` - 新建构建脚本
4. `yuxiaoc/data/danmaku-processed.json` - 构建生成

### 组件文件
5. `yuxiaoc/components/HorizontalDanmaku.tsx` - 更新数据读取
6. `yuxiaoc/components/DanmakuTower.tsx` - 更新数据读取

### 测试文件
7. `tests/unit/components/features/yuxiaoc/HorizontalDanmaku.test.tsx`
8. `tests/unit/components/features/yuxiaoc/DanmakuTower.test.tsx`

### 配置文件
9. `package.json` - 添加构建脚本命令

请确认这个方案后，我将开始执行修改。