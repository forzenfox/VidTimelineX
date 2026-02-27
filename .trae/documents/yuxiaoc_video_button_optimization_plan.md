# Yuxiaoc页面视频跳转按钮优化计划

## 任务概述
对yuxiaoc页面的视频跳转按钮（secondaryButton）进行优化，使其与其他按钮保持一致并添加双主题适配的图标。

## 当前状态分析

### 当前代码位置
- 文件：`frontend/src/features/yuxiaoc/components/HeroSection.tsx`
- 当前按钮文案：
  - 混躺主题："浏览食堂"
  - 血怒主题："观看血怒时刻"

### 当前按钮实现问题
1. 按钮缺少图标，与其他按钮（进入直播间、鱼吧链接、B站合集）不一致
2. 按钮使用的是 `<button>` 元素，而其他按钮使用 `<a>` 元素并带有 `inline-flex items-center justify-center gap-2` 样式

## 优化内容

### 1. 文案修改
| 主题 | 当前文案 | 新文案 |
|------|----------|--------|
| 混躺(mix) | "浏览食堂" | "下饭操作" |
| 血怒(blood) | "观看血怒时刻" | "高能集锦" |

### 2. 图标添加
- 添加与视频/播放相关的图标
- 使用 `lucide-react` 中的 `Video` 或 `Play` 图标
- 确保图标支持双主题（通过CSS样式适配）

### 3. 样式统一
- 将按钮改为与其他按钮一致的样式
- 添加 `inline-flex items-center justify-center gap-2` 类名
- 保持现有的主题颜色适配

## 实现步骤

### 步骤1：更新 HeroSection.tsx
1. 导入 `Video` 图标从 `lucide-react`
2. 修改 `themeContent` 中的 `secondaryButton` 文案
3. 更新按钮结构，添加图标和统一样式

### 步骤2：更新测试文件
1. 更新 `HeroSection.test.tsx` 中的测试用例 TC-006 和 TC-007
2. 修改文案断言以匹配新文案

### 步骤3：运行测试验证
1. 运行单元测试确保所有测试通过
2. 验证按钮渲染和交互正常

## 代码变更详情

### HeroSection.tsx 变更
```typescript
// 1. 导入 Video 图标
import { Crown, Gamepad2, ExternalLink, Sword, Shield, MessageCircle, PlayCircle, Video } from "lucide-react";

// 2. 修改文案
themeContent = {
  blood: {
    ...
    secondaryButton: "高能集锦",  // 从 "观看血怒时刻" 修改
    ...
  },
  mix: {
    ...
    secondaryButton: "下饭操作",  // 从 "浏览食堂" 修改
    ...
  }
}

// 3. 更新按钮结构
<button ...>
  <Video className="w-5 h-5" />
  <span>{content.secondaryButton}</span>
</button>
```

### HeroSection.test.tsx 变更
```typescript
// TC-006: 血怒模式按钮测试 - 更新文案断言
expect(screen.getByText("高能集锦")).toBeInTheDocument();

// TC-007: 混躺模式按钮测试 - 更新文案断言
expect(screen.getByText("下饭操作")).toBeInTheDocument();
```

## 测试策略
- 遵循TDD方法，先更新测试再修改实现
- 验证两个主题下的按钮文案正确显示
- 验证按钮图标正确渲染
- 验证按钮点击事件正常工作

## 验收标准
- [ ] 混躺主题下按钮显示"下饭操作"文案
- [ ] 血怒主题下按钮显示"高能集锦"文案
- [ ] 按钮带有Video图标
- [ ] 图标支持双主题（颜色随主题变化）
- [ ] 按钮样式与其他跳转按钮保持一致
- [ ] 所有单元测试通过
