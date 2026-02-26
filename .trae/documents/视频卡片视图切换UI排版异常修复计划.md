# 视频卡片视图切换UI排版异常修复计划

## 项目概述

修复所有页面切换到网格视图或列表视图后，视频卡片的UI排版异常问题。问题涉及视频卡片在不同视图模式下的尺寸、布局和主题兼容性问题。

***

## 问题分析

### 问题现象

通过DevTools分析发现以下问题：

#### 1. 网格视图问题

* **卡片尺寸溢出**：网格列宽为 226.75px，但卡片宽度为 352px

* **原因**：VideoCard 组件的 `sizeStyles.card` 包含固定宽度类 `w-full sm:w-76 md:w-88`

* **影响**：卡片超出网格单元格，导致布局错乱

#### 2. 列表视图问题

* **卡片宽度不正确**：列表视图下卡片宽度应为 100%，但实际显示为固定宽度

* **原因**：VideoCard 组件的尺寸样式覆盖了列表容器的宽度约束

* **影响**：卡片无法正确填充列表容器

#### 3. 主题兼容性问题

* **深色主题下卡片背景**：tiger 主题下卡片背景为浅色 `rgb(255, 253, 249)`

* **原因**：VideoCard 组件使用硬编码的主题颜色，而非 CSS 变量

* **影响**：深色主题下卡片与页面背景不协调

### 根本原因

1. **VideoCard.tsx** 中的 `getSizeStyles` 函数返回固定宽度类：

   ```typescript
   case "medium":
     return {
       card: "w-full sm:w-76 md:w-88", // 问题：固定宽度覆盖了网格/列表约束
       ...
     };
   ```

2. **VideoGrid.tsx** 和 **VideoList.tsx** 传递的 `className` 被固定宽度类覆盖

3. **VideoCard.tsx** 中的 `getThemeColors` 函数返回硬编码颜色值，而非使用 CSS 变量

***

## 任务列表

### 任务1: 修复 VideoCard 组件尺寸样式

* **Priority**: P0

* **Depends on**: None

* **Description**:

  * 修改 `getSizeStyles` 函数，移除固定宽度类

  * 网格视图：卡片宽度由网格容器控制，不设置固定宽度

  * 列表视图：卡片宽度为 100%

  * 保留 `w-full` 类，移除响应式固定宽度类 `sm:w-76 md:w-88`

* **Files to modify**:

  * `frontend/src/components/video/VideoCard.tsx`

* **Success Criteria**:

  * 网格视图下卡片正确适应网格列宽

  * 列表视图下卡片宽度为 100%

* **Test Requirements**:

  * `human-judgement` TR-1.1: 网格视图卡片不溢出

  * `human-judgement` TR-1.2: 列表视图卡片宽度正确

***

### 任务2: 修复 VideoCard 组件主题兼容性

* **Priority**: P0

* **Depends on**: 任务1

* **Description**:

  * 修改 `getThemeColors` 函数，使用 CSS 变量替代硬编码颜色

  * 或移除内联样式，改用 Tailwind 主题类

  * 确保在 tiger、sweet、blood、mix 等主题下卡片样式正确

* **Files to modify**:

  * `frontend/src/components/video/VideoCard.tsx`

* **Success Criteria**:

  * 卡片在所有主题下背景色与页面协调

  * 深色主题下文字清晰可见

* **Test Requirements**:

  * `human-judgement` TR-2.1: tiger 主题下卡片样式正确

  * `human-judgement` TR-2.2: sweet 主题下卡片样式正确

  * `human-judgement` TR-2.3: blood 主题下卡片样式正确

  * `human-judgement` TR-2.4: mix 主题下卡片样式正确

***

### 任务3: 优化 VideoGrid 组件布局

* **Priority**: P1

* **Depends on**: 任务1

* **Description**:

  * 检查网格布局配置是否正确

  * 确保响应式列数正确工作

  * 添加必要的间距和溢出处理

* **Files to modify**:

  * `frontend/src/components/video-view/VideoGrid.tsx`

* **Success Criteria**:

  * 网格布局在不同屏幕尺寸下正确显示

* **Test Requirements**:

  * `human-judgement` TR-3.1: 移动端网格布局正确

  * `human-judgement` TR-3.2: 平板端网格布局正确

  * `human-judgement` TR-3.3: 桌面端网格布局正确

***

### 任务4: 优化 VideoList 组件布局

* **Priority**: P1

* **Depends on**: 任务1

* **Description**:

  * 检查列表布局配置是否正确

  * 确保卡片在列表模式下正确显示

  * 优化水平布局的封面尺寸

* **Files to modify**:

  * `frontend/src/components/video-view/VideoList.tsx`

* **Success Criteria**:

  * 列表布局正确显示

  * 封面尺寸符合设计规范

* **Test Requirements**:

  * `human-judgement` TR-4.1: 列表视图卡片布局正确

  * `human-judgement` TR-4.2: 封面尺寸正确

***

### 任务5: 更新相关单元测试

* **Priority**: P1

* **Depends on**: 任务1, 任务2, 任务3, 任务4

* **Description**:

  * 更新 VideoCard.test.tsx 测试用例

  * 更新 VideoGrid.test.tsx 测试用例

  * 更新 VideoList.test.tsx 测试用例

  * 确保测试覆盖新的样式变化

* **Files to modify**:

  * `frontend/tests/unit/components/video/VideoCard.test.tsx`

  * `frontend/tests/unit/components/video-view/VideoGrid.test.tsx`

  * `frontend/tests/unit/components/video-view/VideoList.test.tsx`

* **Success Criteria**:

  * 所有测试通过

* **Test Requirements**:

  * `programmatic` TR-5.1: npm run test:unit 通过

***

### 任务6: 代码格式化和静态检查

* **Priority**: P1

* **Depends on**: 任务5

* **Description**:

  * 运行 Prettier 进行代码格式化

  * 运行 ESLint 进行静态代码检查

* **Success Criteria**:

  * 代码格式化完成

  * 无 lint 错误

* **Test Requirements**:

  * `programmatic` TR-6.1: npm run lint 通过

***

## 设计规范

### VideoCard 尺寸样式修改

| 视图模式 | 修改前                      | 修改后      |
| ---- | ------------------------ | -------- |
| 网格视图 | `w-full sm:w-76 md:w-88` | `w-full` |
| 列表视图 | `w-full sm:w-76 md:w-88` | `w-full` |

### VideoCard 主题颜色修改

| 主题    | 修改前（硬编码）              | 修改后（CSS变量）                |
| ----- | --------------------- | ------------------------- |
| tiger | `background: #FFFDF9` | `background: var(--card)` |
| sweet | `background: #FFF5F8` | `background: var(--card)` |
| blood | `background: #1E1B4B` | `background: var(--card)` |
| mix   | `background: #FEF3C7` | `background: var(--card)` |

### 响应式网格布局

| 屏幕尺寸                 | 列数 | 间距    |
| -------------------- | -- | ----- |
| 移动端 (< 640px)        | 2列 | gap-3 |
| 平板端 (640px - 1024px) | 3列 | gap-4 |
| 桌面端 (> 1024px)       | 4列 | gap-4 |

***

## 验收标准

1. 网格视图下视频卡片正确适应网格列宽，不溢出
2. 列表视图下视频卡片宽度为 100%
3. 所有主题下视频卡片背景色与页面协调
4. 深色主题下卡片文字清晰可见
5. 响应式布局在不同屏幕尺寸下正确工作
6. 所有单元测试通过
7. 代码格式化和静态检查通过

***

## 技术实现建议

### VideoCard.tsx 修改建议

```typescript
// 修改前
const getSizeStyles = (size: string) => {
  switch (size) {
    case "medium":
      return {
        card: "w-full sm:w-76 md:w-88", // 固定宽度
        title: "text-base",
        info: "text-xs sm:text-sm",
      };
    // ...
  }
};

// 修改后
const getSizeStyles = (size: string) => {
  switch (size) {
    case "medium":
      return {
        card: "w-full", // 由父容器控制宽度
        title: "text-base",
        info: "text-xs sm:text-sm",
      };
    // ...
  }
};
```

### 主题颜色修改建议

使用 Tailwind 主题类替代内联样式：

```typescript
// 修改前
<div
  style={{
    background: colors.background,
    border: `2px solid ${colors.border}`,
  }}
>

// 修改后
<div
  className="bg-card border-2 border-border"
>
```

***

## 风险评估

| 风险         | 影响 | 缓解措施             |
| ---------- | -- | ---------------- |
| 样式修改影响其他组件 | 中  | 使用 CSS 变量确保主题一致性 |
| 响应式布局破坏    | 低  | 充分测试不同屏幕尺寸       |
| 单元测试失败     | 低  | 同步更新测试用例         |

