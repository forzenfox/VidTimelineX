# VidTimelineX 前端测试改进计划 - 80% 覆盖率目标

## 概述
- **目标**: 在 4 周内将前端测试覆盖率从 63% 提升至 80% 以上
- **当前状态**: 
  - 行覆盖率: 63.29%
  - 语句覆盖率: 63.07%
  - 函数覆盖率: 58.16%
  - 分支覆盖率: 66.31%
- **计划周期**: 4 周（2026-03-01 至 2026-03-29）

## 背景与上下文
- 项目使用 React + TypeScript + Vite 技术栈
- 测试框架: Jest + React Testing Library + Playwright (E2E)
- 当前测试文件数: 约 93 个测试套件
- 已有测试通过率: 92 通过, 1 失败 (Avatar.test.tsx 有 5 个失败用例)

## 改进目标

### 总体目标
在 4 周内将整体测试覆盖率从 63% 提升至 80% 以上，建立完善的测试体系。

### 分阶段目标
| 周次 | 行覆盖率目标 | 关键任务 |
|------|-------------|---------|
| 第 1 周 | 70% | UI 组件测试补充 |
| 第 2 周 | 75% | 业务组件 + Hooks 测试 |
| 第 3 周 | 78% | 集成测试 + 工具函数 |
| 第 4 周 | 80%+ | 完善优化 + CI/CD |

## 功能需求

### FR-1: UI 组件测试补充
为 `src/components/ui/` 目录下缺少测试的组件编写单元测试

**零覆盖率组件 (急需补充)**:
- Dialog, DropdownMenu, Select, Tabs, Toast/Sonner
- Alert, Avatar, Badge, Card, Checkbox, Input
- Accordion, AlertDialog, AspectRatio, Breadcrumb
- Calendar, Carousel, Chart, Checkbox, Collapsible
- Command, ContextMenu, Drawer, Form, HoverCard
- InputOTP, Menubar, NavigationMenu, Pagination, Popover
- RadioGroup, Resizable, ScrollArea, Sheet, Sidebar
- Slider, Switch, Table, Textarea, Toggle, ToggleGroup, Tooltip

### FR-2: 业务组件测试完善
完善 `src/components/business/` 和 `src/features/` 下的组件测试

**重点模块**:
- video-view/ 组件 (VideoCard, VideoModal, VideoGrid, VideoList)
- lvjiang/ 模块 (VideoTimeline, SideDanmaku)
- yuxiaoc/ 模块 (CanteenHall, HeroSection, Header)
- tiantong/ 模块 (VideoCard, SidebarDanmu)

### FR-3: Hooks 测试完善
为自定义 hooks 编写完整测试

**待完善 Hooks**:
- usePagination (当前 95.34%)
- useVideoFilter (当前 88.57%)
- useVideoView (当前 68.83%)
- use-mobile (当前 97.56%)

### FR-4: 工具函数测试
完善 `src/utils/` 和 `src/shared/` 下的工具函数测试

**待完善模块**:
- utils/preload.ts (当前 76.74%)
- utils/cdn.ts (当前 96.33%)
- shared/danmaku/hooks.ts (当前 94.92%)

### FR-5: 集成测试补充
新增 10-15 个集成测试，覆盖:
- 页面渲染集成
- 数据流集成
- 主题切换集成
- 路由集成
- 错误处理集成

### FR-6: E2E 测试扩展
新增 5-8 个 E2E 测试，覆盖核心用户流程

### FR-7: 修复现有测试失败
修复 Avatar.test.tsx 中的 5 个失败用例

## 非功能需求

### NFR-1: 测试质量
- 测试应遵循 AAA 原则 (Arrange-Act-Assert)
- 测试命名规范: TC-XXX: 测试描述
- 测试应覆盖所有代码路径，包括边界情况和错误处理

### NFR-2: 覆盖率阈值
逐步提升 Jest 覆盖率阈值:
```javascript
// 第 1 周
{
  branches: 50,
  functions: 45,
  lines: 55,
  statements: 53
}

// 第 4 周
{
  branches: 72,
  functions: 75,
  lines: 80,
  statements: 78
}
```

### NFR-3: 测试执行时间
- 单元测试执行时间 < 60 秒
- 集成测试执行时间 < 30 秒
- E2E 测试执行时间 < 5 分钟

## 验收标准

### AC-1: UI 组件覆盖率达标
- **Given**: UI 组件库所有组件都有测试
- **When**: 运行测试套件
- **Then**: UI 组件整体覆盖率达到 85%+

### AC-2: 业务组件覆盖率达标
- **Given**: 业务组件补充完整测试
- **When**: 运行测试套件
- **Then**: 业务组件整体覆盖率达到 80%+

### AC-3: Hooks 覆盖率达标
- **Given**: 所有自定义 hooks 都有测试
- **When**: 运行测试套件
- **Then**: hooks 整体覆盖率达到 85%+

### AC-4: 工具函数覆盖率达标
- **Given**: 所有工具函数都有测试
- **When**: 运行测试套件
- **Then**: 工具函数整体覆盖率达到 80%+

### AC-5: 所有测试通过
- **Given**: 完整的测试套件
- **When**: 运行所有测试
- **Then**: 所有测试用例都通过，无失败

### AC-6: 整体覆盖率达标
- **Given**: 所有测试用例已编写完成
- **When**: 生成覆盖率报告
- **Then**: 
  - 行覆盖率 >= 80%
  - 语句覆盖率 >= 78%
  - 函数覆盖率 >= 75%
  - 分支覆盖率 >= 72%

## 约束条件
- 必须使用 Jest 和 React Testing Library
- 遵循项目现有的测试规范和风格
- 不修改实际业务逻辑，只补充测试
- 不进行性能优化或重构（除非是为了让测试更清晰）

## 风险与应对

| 风险 | 可能性 | 影响 | 应对措施 |
|------|--------|------|----------|
| 时间不足 | 中 | 高 | 优先保障核心模块，分阶段交付 |
| 测试不稳定 | 中 | 中 | 加强 Mock，避免外部依赖 |
| 覆盖率难以达标 | 低 | 高 | 调整阈值策略，重点覆盖核心代码 |
| 开发人员抵触 | 中 | 中 | 培训+工具支持，展示测试价值 |
