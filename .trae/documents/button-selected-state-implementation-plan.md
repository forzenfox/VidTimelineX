# 全局按钮选中状态样式优化 - 详细执行计划

## 一、影响分析

### 1.1 受影响的组件清单

#### 核心组件（需修改）

| 组件                   | 文件路径                                               | 当前实现                             | 影响程度 |
| -------------------- | -------------------------------------------------- | -------------------------------- | ---- |
| ViewSwitcher         | `src/components/video-view/ViewSwitcher.tsx`       | `aria-pressed` + 条件类名            | 高    |
| CycleViewButton      | `src/components/video-view/CycleViewButton.tsx`    | 需检查                              | 中    |
| SearchButton         | `src/components/video-view/SearchButton.tsx`       | 条件类名                             | 中    |
| PaginationControls   | `src/components/video-view/PaginationControls.tsx` | `data-active`                    | 高    |
| SidebarMenuButton    | `src/components/ui/sidebar.tsx`                    | `data-active` + Tailwind         | 高    |
| SidebarMenuSubButton | `src/components/ui/sidebar.tsx`                    | `data-active` + Tailwind         | 高    |
| PaginationLink       | `src/components/ui/pagination.tsx`                 | `data-active` + `buttonVariants` | 高    |
| Header (yuxiaoc)     | `src/features/yuxiaoc/components/Header.tsx`       | 内联样式 + `isActive`                | 中    |
| ThemeToggle          | `src/features/tiantong/components/ThemeToggle.tsx` | `active:scale-95`                | 低    |

#### 样式文件（需修改）

| 文件             | 路径                          | 修改内容                 |
| -------------- | --------------------------- | -------------------- |
| variables.css  | `src/styles/variables.css`  | 添加选中状态CSS变量          |
| components.css | `src/styles/components.css` | 添加全局选中状态样式           |
| globals.css    | `src/styles/globals.css`    | 可能需要调整hover/active样式 |

#### 测试文件（需创建/修改）

| 测试文件                        | 路径                                                             | 测试内容    |
| --------------------------- | -------------------------------------------------------------- | ------- |
| ViewSwitcher.test.tsx       | `tests/unit/components/video-view/ViewSwitcher.test.tsx`       | 已存在，需更新 |
| PaginationControls.test.tsx | `tests/unit/components/video-view/PaginationControls.test.tsx` | 需创建     |
| selected-state.test.tsx     | `tests/unit/styles/selected-state.test.tsx`                    | 需创建     |
| sidebar-selected.test.tsx   | `tests/unit/components/ui/sidebar-selected.test.tsx`           | 需创建     |

### 1.2 依赖关系图

```
variables.css (CSS变量)
    ↓
components.css (全局样式)
    ↓
┌─────────────────────────────────────────────────────────┐
│                    组件层                                │
├─────────────────────────────────────────────────────────┤
│  ViewSwitcher     →  使用 aria-pressed + data-active    │
│  PaginationControls → 使用 data-active                  │
│  SidebarMenuButton → 使用 data-active                   │
│  SearchButton     →  使用条件类名                        │
│  Header           →  使用内联样式                        │
└─────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────┐
│                    测试层                                │
├─────────────────────────────────────────────────────────┤
│  单元测试 (Jest + React Testing Library)                │
│  集成测试 (组件交互测试)                                 │
│  E2E测试 (Playwright)                                   │
└─────────────────────────────────────────────────────────┘
```

### 1.3 风险评估矩阵

| 风险     | 可能性 | 影响 | 风险等级 | 缓解措施             |
| ------ | --- | -- | ---- | ---------------- |
| 样式冲突   | 中   | 高  | 高    | 使用CSS变量，渐进式迁移    |
| 主题适配错误 | 中   | 高  | 高    | 为每个主题定义变量，充分测试   |
| 无障碍问题  | 低   | 高  | 中    | 保持aria-pressed属性 |
| 性能影响   | 低   | 低  | 低    | CSS过渡动画优化        |
| 测试覆盖不足 | 中   | 中  | 中    | TDD方法论，80%+覆盖率   |

***

## 二、执行计划

### 2.1 阶段一：CSS变量定义（预计时间：1小时）

#### 任务清单

* [ ] 在 `variables.css` 中添加选中状态CSS变量

* [ ] 为每个主题定义对应的选中状态颜色

* [ ] 添加RGB值变量用于阴影效果

#### 实现步骤

**步骤 1.1：定义基础选中状态变量**

```css
/* 在 variables.css 中添加 */
:root {
  /* ========== 选中状态变量 ========== */
  --selected-bg: var(--primary);
  --selected-foreground: var(--primary-foreground);
  --selected-border: var(--primary);
  --selected-shadow-color: rgba(230, 126, 34, 0.2);
  --selected-ring: var(--primary);
  --selected-indicator: var(--primary);
}
```

**步骤 1.2：为各主题定义覆盖变量**

```css
/* Tiger 主题（默认） */
:root {
  --selected-bg: var(--tiger-primary);
  --selected-foreground: #fff;
  --selected-border: var(--tiger-primary);
  --selected-shadow-color: rgba(230, 126, 34, 0.2);
}

/* Sweet 主题 */
[data-theme="sweet"] {
  --selected-bg: var(--sweet-primary);
  --selected-foreground: #fff;
  --selected-border: var(--sweet-primary);
  --selected-shadow-color: rgba(255, 140, 180, 0.2);
}

/* Blood 主题 */
[data-theme="blood"] {
  --selected-bg: #e11d48;
  --selected-foreground: #fff;
  --selected-border: #e11d48;
  --selected-shadow-color: rgba(225, 29, 72, 0.2);
}

/* Mix 主题 */
[data-theme="mix"] {
  --selected-bg: #f59e0b;
  --selected-foreground: #fff;
  --selected-border: #f59e0b;
  --selected-shadow-color: rgba(245, 158, 11, 0.2);
}

/* Dongzhu 主题 */
[data-theme="dongzhu"] {
  --selected-bg: #5dade2;
  --selected-foreground: #fff;
  --selected-border: #5dade2;
  --selected-shadow-color: rgba(93, 173, 226, 0.2);
}

/* Kaige 主题 */
[data-theme="kaige"] {
  --selected-bg: #e74c3c;
  --selected-foreground: #fff;
  --selected-border: #e74c3c;
  --selected-shadow-color: rgba(231, 76, 60, 0.2);
}
```

### 2.2 阶段二：全局样式定义（预计时间：1.5小时）

#### 任务清单

* [ ] 在 `components.css` 中添加选中状态基础样式

* [ ] 添加选中状态的hover/active/focus样式

* [ ] 添加过渡动画

#### 实现步骤

**步骤 2.1：添加选中状态基础样式**

```css
/* 在 components.css 中添加 */

/* ========== 选中状态样式 ========== */

/* 基础选中状态 */
[data-active="true"],
[aria-pressed="true"] {
  background-color: var(--selected-bg);
  color: var(--selected-foreground);
  border-color: var(--selected-border);
  box-shadow: 0 2px 8px var(--selected-shadow-color);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 选中状态悬停效果 */
[data-active="true"]:hover,
[aria-pressed="true"]:hover {
  filter: brightness(1.1);
  box-shadow: 0 4px 12px var(--selected-shadow-color);
}

/* 选中状态按下效果 */
[data-active="true"]:active,
[aria-pressed="true"]:active {
  transform: scale(0.98);
  filter: brightness(0.95);
}

/* 选中状态焦点效果 */
[data-active="true"]:focus-visible,
[aria-pressed="true"]:focus-visible {
  outline: 2px solid var(--selected-ring);
  outline-offset: 2px;
}

/* 选中状态过渡动画 */
@keyframes selected-pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}

/* 选中状态指示器（可选） */
[data-selected-indicator="true"]::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 2px;
  background-color: var(--selected-indicator);
  border-radius: 1px;
}
```

### 2.3 阶段三：组件迁移（预计时间：3小时）

#### 任务清单

* [ ] 迁移 ViewSwitcher 组件

* [ ] 迁移 PaginationControls 组件

* [ ] 迁移 SearchButton 组件

* [ ] 验证 SidebarMenuButton 组件

#### 实现步骤

**步骤 3.1：迁移 ViewSwitcher 组件**

修改 `src/components/video-view/ViewSwitcher.tsx`：

```tsx
// 修改前
className={cn(
  "h-10 min-w-[72px] rounded-lg px-3.5 py-2 text-sm font-medium cursor-pointer",
  "flex items-center justify-center gap-2",
  "transition-colors duration-200 ease-out",
  "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  isActive
    ? theme === "kaige"
      ? "bg-[#E74C3C] text-white shadow-md shadow-[#E74C3C]/20"
      : "bg-primary text-primary-foreground shadow-md shadow-primary/20"
    : "bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
)}

// 修改后
className={cn(
  "h-10 min-w-[72px] rounded-lg px-3.5 py-2 text-sm font-medium cursor-pointer",
  "flex items-center justify-center gap-2",
  "transition-colors duration-200 ease-out",
  "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  isActive
    ? "shadow-md"
    : "bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
)}
```

**步骤 3.2：迁移 PaginationControls 组件**

修改 `src/components/video-view/PaginationControls.tsx`：

```tsx
// 确保使用 data-active 属性
<button
  data-active={currentPage === page}
  aria-current={currentPage === page ? "page" : undefined}
  className={cn(
    "px-3 py-1 rounded-md transition-all",
    currentPage === page
      ? "shadow-md"
      : "bg-transparent hover:bg-muted/50"
  )}
>
```

### 2.4 阶段四：测试验证（预计时间：2小时）

#### 任务清单

* [ ] 编写CSS变量单元测试

* [ ] 编写选中状态样式测试

* [ ] 编写组件集成测试

* [ ] 执行E2E测试验证

***

## 三、TDD方法论实施

### 3.1 测试优先原则

所有代码修改必须遵循TDD流程：

1. **Red**：先编写失败的测试
2. **Green**：编写最小代码使测试通过
3. **Refactor**：重构代码优化质量

### 3.2 测试文件结构

```
tests/
├── unit/
│   ├── styles/
│   │   └── selected-state.test.tsx      # CSS变量和样式测试
│   └── components/
│       ├── video-view/
│       │   ├── ViewSwitcher.selected.test.tsx
│       │   └── PaginationControls.selected.test.tsx
│       └── ui/
│           └── sidebar-selected.test.tsx
├── integration/
│   └── selected-state-integration.test.tsx
└── e2e/
    └── selected-state-visual.e2e.tsx
```

### 3.3 测试用例设计

#### 单元测试：CSS变量

```typescript
// tests/unit/styles/selected-state.test.tsx

describe('Selected State CSS Variables', () => {
  describe('Default (Tiger) Theme', () => {
    it('should have correct selected background color', () => {
      // 测试默认主题的选中背景色
    });

    it('should have correct selected foreground color', () => {
      // 测试默认主题的选中前景色
    });

    it('should have correct selected shadow color', () => {
      // 测试默认主题的选中阴影色
    });
  });

  describe('Kaige Theme', () => {
    beforeEach(() => {
      document.body.setAttribute('data-theme', 'kaige');
    });

    it('should use red color for selected state', () => {
      // 测试凯哥主题的选中状态颜色
    });
  });

  // 其他主题测试...
});
```

#### 单元测试：ViewSwitcher组件

```typescript
// tests/unit/components/video-view/ViewSwitcher.selected.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { ViewSwitcher } from '@/components/video-view/ViewSwitcher';

describe('ViewSwitcher Selected State', () => {
  const mockOnViewModeChange = jest.fn();
  const viewModes = ['timeline', 'grid', 'list'] as const;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('aria-pressed attribute', () => {
    it('should have aria-pressed="true" for selected button', () => {
      render(
        <ViewSwitcher 
          viewMode="timeline" 
          onViewModeChange={mockOnViewModeChange} 
        />
      );

      const timelineButton = screen.getByRole('button', { name: '时光轴' });
      expect(timelineButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('should have aria-pressed="false" for non-selected buttons', () => {
      render(
        <ViewSwitcher 
          viewMode="timeline" 
          onViewModeChange={mockOnViewModeChange} 
        />
      );

      const gridButton = screen.getByRole('button', { name: '网格' });
      expect(gridButton).toHaveAttribute('aria-pressed', 'false');
    });
  });

  describe('visual styling', () => {
    it('should apply selected background color to active button', () => {
      render(
        <ViewSwitcher 
          viewMode="timeline" 
          onViewModeChange={mockOnViewModeChange} 
        />
      );

      const timelineButton = screen.getByRole('button', { name: '时光轴' });
      const styles = window.getComputedStyle(timelineButton);
      
      expect(styles.backgroundColor).not.toBe('transparent');
    });

    it('should apply shadow to selected button', () => {
      render(
        <ViewSwitcher 
          viewMode="timeline" 
          onViewModeChange={mockOnViewModeChange} 
        />
      );

      const timelineButton = screen.getByRole('button', { name: '时光轴' });
      const styles = window.getComputedStyle(timelineButton);
      
      expect(styles.boxShadow).not.toBe('none');
    });
  });

  describe('theme adaptation', () => {
    it('should use red color in kaige theme', () => {
      document.body.setAttribute('data-theme', 'kaige');
      
      render(
        <ViewSwitcher 
          viewMode="timeline" 
          onViewModeChange={mockOnViewModeChange}
          theme="kaige"
        />
      );

      const timelineButton = screen.getByRole('button', { name: '时光轴' });
      const styles = window.getComputedStyle(timelineButton);
      
      // 验证红色主题
      expect(styles.backgroundColor).toMatch(/rgb\(231,\s*76,\s*60\)/);
    });
  });
});
```

### 3.4 测试覆盖要求

| 测试类型  | 覆盖率要求 | 关键指标         |
| ----- | ----- | ------------ |
| 单元测试  | ≥ 80% | 语句、分支、函数、行覆盖 |
| 集成测试  | ≥ 70% | 组件交互场景       |
| E2E测试 | 关键路径  | 用户交互流程       |

***

## 四、资源分配

### 4.1 人力资源

| 角色    | 职责         | 预计工时 |
| ----- | ---------- | ---- |
| 前端开发  | CSS变量、组件修改 | 4小时  |
| UI设计师 | 视觉验证、主题适配  | 1小时  |
| QA工程师 | 测试验证       | 2小时  |

### 4.2 时间线

```
Day 1:
├── 09:00 - 10:00: 阶段一 - CSS变量定义
├── 10:00 - 11:30: 阶段二 - 全局样式定义
├── 11:30 - 12:00: 代码审查
├── 14:00 - 17:00: 阶段三 - 组件迁移
└── 17:00 - 18:00: 阶段四 - 测试验证

Day 2:
├── 09:00 - 11:00: 补充测试、修复问题
├── 11:00 - 12:00: 文档更新
└── 14:00 - 16:00: 最终验证、发布
```

***

## 五、风险缓解策略

### 5.1 技术风险

| 风险     | 缓解措施                  | 负责人   |
| ------ | --------------------- | ----- |
| 样式冲突   | 使用CSS变量，避免全局选择器冲突     | 前端开发  |
| 主题适配错误 | 为每个主题编写独立测试用例         | QA工程师 |
| 性能问题   | 使用CSS过渡而非JavaScript动画 | 前端开发  |

### 5.2 回滚计划

如果出现严重问题，可以快速回滚：

1. **CSS变量回滚**：删除新增的CSS变量定义
2. **组件回滚**：恢复组件中的条件类名实现
3. **Git回滚**：使用 `git revert` 回滚特定提交

### 5.3 监控指标

| 指标    | 目标值    | 监控方式                     |
| ----- | ------ | ------------------------ |
| 测试通过率 | 100%   | CI/CD Pipeline           |
| 代码覆盖率 | ≥ 80%  | Jest Coverage Report     |
| 性能影响  | < 10ms | Lighthouse Performance   |
| 无障碍评分 | 100    | Lighthouse Accessibility |

***

## 六、验收标准

### 6.1 功能验收

* [ ] 所有选中状态按钮显示正确的背景色

* [ ] 所有主题下选中状态颜色正确

* [ ] 选中状态有正确的阴影效果

* [ ] 选中状态有正确的过渡动画

* [ ] hover/active/focus状态正常工作

### 6.2 非功能验收

* [ ] 单元测试覆盖率 ≥ 80%

* [ ] 所有测试用例通过

* [ ] 无TypeScript类型错误

* [ ] 无ESLint警告

* [ ] Lighthouse性能评分 ≥ 90

* [ ] Lighthouse无障碍评分 = 100

### 6.3 文档验收

* [ ] 更新组件文档

* [ ] 更新样式指南

* [ ] 更新测试文档

***

## 七、执行检查清单

### 阶段一完成标准

* [ ] CSS变量已添加到 `variables.css`

* [ ] 所有主题都有对应的选中状态变量

* [ ] 变量命名符合项目规范

### 阶段二完成标准

* [ ] 全局样式已添加到 `components.css`

* [ ] 样式选择器正确匹配 `data-active` 和 `aria-pressed`

* [ ] 过渡动画流畅

### 阶段三完成标准

* [ ] ViewSwitcher 组件已迁移

* [ ] PaginationControls 组件已迁移

* [ ] SearchButton 组件已迁移

* [ ] 所有组件测试通过

### 阶段四完成标准

* [ ] 单元测试覆盖率 ≥ 80%

* [ ] 集成测试通过

* [ ] E2E测试通过

* [ ] 视觉回归测试通过

