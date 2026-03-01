# 项目结构规范文档

## 1. 概述

本文档定义了 VidTimelineX 前端项目的目录结构规范，确保代码组织的一致性、可维护性和可扩展性。所有新创建的文件和目录都应遵循本规范。

---

## 2. 核心原则

### 2.1 关注点分离
- **业务逻辑**与**UI 组件**分离
- **通用代码**与**特定功能代码**分离
- **数据**与**视图**分离

### 2.2 模块化设计
- 按**功能模块**组织代码（如：lvjiang、tiantong、yuxiaoc）
- 每个模块包含完整的组件、数据、样式
- 模块间通过明确的接口通信

### 2.3 可维护性
- 目录层级不超过 4 层
- 单个目录内文件不超过 20 个
- 使用清晰的命名，避免缩写

---

## 3. 目录结构

### 3.1 标准目录结构

```
frontend/
├── src/                          # 源代码目录
│   ├── app/                      # 应用核心配置
│   │   ├── App.tsx               # 应用根组件（路由容器）
│   │   ├── main.tsx              # React DOM 渲染入口
│   │   └── routes.tsx            # 路由配置
│   ├── components/               # 公共组件
│   │   ├── ui/                   # 基础 UI 组件（基于 Radix UI）
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── business/             # 业务组件
│   │   │   ├── video/            # 视频相关组件
│   │   │   └── video-view/       # 视图组件
│   │   └── figma/                # Figma 设计系统组件
│   ├── features/                 # 功能模块（按业务划分）
│   │   ├── lvjiang/              # 驴酱模块
│   │   │   ├── components/       # 驴酱业务组件
│   │   │   ├── data/             # 驴酱数据
│   │   │   ├── styles/           # 驴酱样式
│   │   │   └── LvjiangPage.tsx   # 驴酱页面组件
│   │   ├── tiantong/             # 甜筒模块
│   │   │   ├── components/       # 甜筒业务组件
│   │   │   ├── data/             # 甜筒数据
│   │   │   ├── styles/           # 甜筒样式
│   │   │   └── TiantongPage.tsx  # 甜筒页面组件
│   │   └── yuxiaoc/              # 余小 C 模块
│   │       ├── components/       # 余小 C 业务组件
│   │       ├── data/             # 余小 C 数据
│   │       ├── styles/           # 余小 C 样式
│   │       └── YuxiaocPage.tsx   # 余小 C 页面组件
│   ├── hooks/                    # 公共自定义 Hook
│   │   ├── use-mobile.ts
│   │   ├── usePagination.tsx
│   │   └── ...
│   ├── shared/                   # 共享库
│   │   └── danmaku/              # 弹幕库
│   │       ├── components/       # 弹幕组件
│   │       ├── hooks/            # 弹幕 Hook
│   │       ├── utils/            # 弹幕工具函数
│   │       └── types/            # 弹幕类型定义
│   ├── styles/                   # 全局样式
│   │   ├── animations.css
│   │   ├── components.css
│   │   ├── globals.css
│   │   ├── utilities.css
│   │   └── variables.css
│   ├── utils/                    # 工具函数
│   │   ├── cdn.ts
│   │   └── preload.ts
│   └── types/                    # 全局类型定义
│       └── modules.d.ts
├── tests/                        # 测试文件
│   ├── unit/                     # 单元测试
│   ├── integration/              # 集成测试
│   ├── e2e/                      # 端到端测试
│   │   ├── desktop/              # 桌面端 E2E
│   │   └── mobile/               # 移动端 E2E
│   ├── fixtures/                 # 测试数据
│   ├── utils/                    # 测试工具函数
│   └── docs/                     # 测试文档
├── public/                       # 静态资源
│   └── thumbs/                   # 视频缩略图
├── scripts/                      # 构建脚本
├── .env.development              # 开发环境变量
├── .env.production               # 生产环境变量
├── .env.example                  # 环境变量示例
├── package.json                  # 项目依赖配置
├── vite.config.ts                # Vite 构建配置
├── tsconfig.json                 # TypeScript 配置
├── jest.config.cjs               # Jest 测试配置
├── eslint.config.js              # ESLint 配置
├── playwright.config.ts          # Playwright 配置
└── README.md                     # 项目说明文档
```

### 3.2 目录职责说明

#### `src/app/` - 应用核心
- **职责**：应用启动、路由配置、全局状态
- **包含**：
  - `App.tsx`：应用根组件（路由容器）
  - `main.tsx`：React DOM 渲染入口
  - `routes.tsx`：路由配置
- **规则**：
  - ✅ 只包含应用级别的配置
  - ❌ 不包含业务逻辑
  - ❌ 不包含具体组件实现

#### `src/components/` - 公共组件
- **职责**：可复用的 UI 组件和业务组件
- **子目录**：
  - `ui/`：基础 UI 组件（基于 Radix UI 封装）
  - `business/`：跨模块复用的业务组件
  - `figma/`：Figma 设计系统相关组件
- **规则**：
  - ✅ 组件应该是无状态的或只依赖 props
  - ✅ 组件应该有完整的 TypeScript 类型定义
  - ❌ 不应该包含特定业务模块的逻辑

#### `src/features/` - 功能模块
- **职责**：按业务功能组织的模块
- **子目录**：每个功能模块（如 lvjiang、tiantong、yuxiaoc）
- **模块结构**：
  ```
  feature-name/
  ├── components/       # 该模块专用的业务组件
  ├── data/            # 该模块的数据（JSON、TypeScript 数据）
  ├── styles/          # 该模块专用的样式
  └── FeaturePage.tsx  # 该模块的页面组件
  ```
- **规则**：
  - ✅ 模块应该自包含，不依赖其他模块的内部实现
  - ✅ 模块间通过明确的接口通信
  - ❌ 不应该直接导入其他模块的内部文件

#### `src/hooks/` - 公共 Hook
- **职责**：可复用的自定义 React Hook
- **规则**：
  - ✅ Hook 应该有完整的 TypeScript 类型定义
  - ✅ Hook 应该是通用的，不依赖特定业务
  - ❌ Hook 不应该包含副作用（除非必要）

#### `src/shared/` - 共享库
- **职责**：跨模块共享的功能库
- **子目录**：每个共享库（如 danmaku）
- **规则**：
  - ✅ 共享库应该有完整的 API 文档
  - ✅ 共享库应该是独立的，不依赖业务代码
  - ❌ 共享库不应该包含业务逻辑

#### `src/styles/` - 全局样式
- **职责**：全局 CSS 变量、动画、工具类
- **文件**：
  - `variables.css`：CSS 变量定义
  - `animations.css`：动画定义
  - `components.css`：组件级样式
  - `globals.css`：全局样式
  - `utilities.css`：工具类
- **规则**：
  - ✅ 样式应该使用 CSS 变量
  - ✅ 样式应该遵循 BEM 或其他命名规范
  - ❌ 不应该在 CSS 中硬编码颜色值

#### `tests/` - 测试文件
- **职责**：所有测试代码
- **子目录**：
  - `unit/`：单元测试（组件、Hook、工具函数）
  - `integration/`：集成测试（模块间交互）
  - `e2e/`：端到端测试（完整用户流程）
  - `fixtures/`：测试数据
  - `utils/`：测试工具函数
- **规则**：
  - ✅ 测试文件应该与源代码目录结构对应
  - ✅ 测试应该覆盖正常流程、边界条件和异常情况
  - ❌ 测试不应该依赖外部服务（使用 Mock）

---

## 4. 文件组织最佳实践

### 4.1 组件文件组织

**✅ 正确示例**：
```typescript
// src/components/ui/button.tsx
import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(`btn btn-${variant} btn-${size}`, className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
```

**❌ 错误示例**：
```typescript
// 一个文件包含多个组件
export const Button = () => {};
export const Input = () => {};
export const Dialog = () => {};

// 组件包含业务逻辑
const Button = () => {
  const { user } = useAuth(); // ❌ 不应该依赖特定业务
  return <button>{user.name}</button>;
};
```

### 4.2 模块文件组织

**✅ 正确示例**：
```
src/features/tiantong/
├── components/
│   ├── HorizontalDanmaku.tsx    # 横向弹幕组件
│   ├── LoadingAnimation.tsx     # 加载动画组件
│   ├── SidebarDanmu.tsx         # 侧边栏弹幕组件
│   ├── ThemeToggle.tsx          # 主题切换组件
│   ├── VideoCard.tsx            # 视频卡片组件
│   └── VideoTimeline.tsx        # 视频时间线组件
├── data/
│   ├── danmaku.txt              # 弹幕数据
│   ├── danmakuColors.ts         # 弹幕颜色配置
│   ├── data.ts                  # 数据导出
│   ├── index.ts                 # 数据索引
│   ├── types.ts                 # 数据类型定义
│   ├── users.json               # 用户数据
│   └── videos.json              # 视频数据
├── styles/
│   └── tiantong.css             # 模块样式
└── TiantongPage.tsx             # 页面组件
```

**❌ 错误示例**：
```
src/features/tiantong/
├── TiantongPage.tsx             # 页面组件
├── HorizontalDanmaku.tsx        # ❌ 组件直接在模块根目录
├── danmaku.txt                  # ❌ 数据直接在模块根目录
├── users.json                   # ❌ 数据直接在模块根目录
└── style.css                    # ❌ 样式文件命名不统一
```

### 4.3 测试文件组织

**✅ 正确示例**：
```
tests/
├── unit/
│   └── components/
│       └── features/
│           └── tiantong/
│               ├── HorizontalDanmaku.test.tsx
│               ├── LoadingAnimation.test.tsx
│               └── ThemeToggle.test.tsx
├── integration/
│   └── tiantong/
│       ├── content-area.test.tsx
│       └── page-integration.test.tsx
└── e2e/
    └── tiantong/
        ├── danmaku-theme.e2e.tsx
        ├── theme-switching.e2e.tsx
        └── video-playback.e2e.tsx
```

**❌ 错误示例**：
```
tests/
├── tiantong-test.tsx            # ❌ 测试类型不明确
├── test-theme.tsx               # ❌ 命名不规范
└── e2e-test.js                  # ❌ 使用.js 而不是.ts
```

---

## 5. 目录命名规范

### 5.1 目录命名规则

| 目录类型 | 命名规则 | 示例 |
|---------|---------|------|
| 功能模块 | 小写，连字符分隔 | `lvjiang/`, `tiantong/` |
| 组件目录 | 小写，复数形式 | `components/`, `hooks/` |
| 测试目录 | 小写，描述性名称 | `unit/`, `integration/`, `e2e/` |
| 数据目录 | 小写，描述性名称 | `data/`, `fixtures/` |
| 样式目录 | 小写，复数形式 | `styles/` |

### 5.2 文件命名规则

| 文件类型 | 命名规则 | 示例 |
|---------|---------|------|
| React 组件 | 大驼峰 | `Button.tsx`, `VideoCard.tsx` |
| Hook | 小写，use 前缀 | `use-mobile.ts`, `usePagination.tsx` |
| 工具函数 | 小写，连字符分隔 | `data-loader.ts`, `error-handler.ts` |
| 类型定义 | 小写，连字符分隔 | `video-types.ts`, `danmaku-types.ts` |
| 样式文件 | 小写，连字符分隔 | `button-styles.css`, `layout.css` |
| 测试文件 | 与被测文件同名 + `.test` 或 `.e2e` | `Button.test.tsx`, `theme.e2e.tsx` |
| 配置文件 | 小写，点号分隔 | `vite.config.ts`, `jest.config.cjs` |

---

## 6. 导入路径规范

### 6.1 路径别名

```typescript
// ✅ 使用路径别名
import { Button } from "@/components/ui/button";
import { useMobile } from "@/hooks/use-mobile";
import { LvjiangPage } from "@/features/lvjiang/LvjiangPage";

// ❌ 避免使用相对路径
import { Button } from "../../../components/ui/button";
```

### 6.2 导入顺序

```typescript
// 1. React 和第三方库
import React from "react";
import { useQuery } from "@tanstack/react-query";

// 2. 绝对路径导入（@/）
import { Button } from "@/components/ui/button";
import { useMobile } from "@/hooks/use-mobile";

// 3. 相对路径导入（同目录或子目录）
import { VideoCard } from "./VideoCard";
import { types } from "../types";

// 4. 样式导入
import "./styles.css";
```

---

## 7. 代码审查检查清单

### 7.1 目录结构检查
- [ ] 新文件是否放在正确的目录？
- [ ] 目录层级是否超过 4 层？
- [ ] 单个目录内文件是否超过 20 个？
- [ ] 是否遵循模块自包含原则？

### 7.2 文件命名检查
- [ ] 文件名是否符合命名规范？
- [ ] 组件文件是否使用大驼峰？
- [ ] 测试文件是否包含 `.test` 或 `.e2e` 后缀？
- [ ] 是否避免使用缩写？

### 7.3 导入路径检查
- [ ] 是否使用路径别名（@/）？
- [ ] 导入顺序是否正确？
- [ ] 是否避免跨模块导入内部文件？

---

## 8. 常见问题 FAQ

### Q1: 如何决定一个组件应该放在 `components/` 还是 `features/`？
**A**: 
- 如果组件是**通用的**、**可复用的**、**不依赖特定业务**，放在 `components/`
- 如果组件是**特定业务模块专用的**，放在 `features/[module]/components/`

**示例**：
- `Button`、`Dialog` → `components/ui/`
- `TiantongVideoCard` → `features/tiantong/components/`

### Q2: 多个模块共享的组件应该放在哪里？
**A**: 放在 `components/business/` 目录，并确保组件不依赖特定业务模块。

### Q3: 如何组织大型模块的文件？
**A**: 如果模块文件超过 20 个，可以按功能进一步分组：
```
features/tiantong/
├── components/
│   ├── danmaku/          # 弹幕相关组件
│   ├── video/            # 视频相关组件
│   └── timeline/         # 时间线相关组件
├── hooks/                # 模块专用 Hook
├── data/
├── styles/
└── TiantongPage.tsx
```

### Q4: 测试文件是否应该与源代码放在一起？
**A**: 本项目采用**独立测试目录**结构，测试文件放在 `tests/` 目录，与源代码分离。这样可以：
- 清晰区分测试代码和生产代码
- 便于组织不同类型的测试
- 避免构建工具处理测试文件

---

## 9. 更新记录

| 版本 | 日期 | 更新内容 | 负责人 |
|------|------|----------|--------|
| v1.0 | 2026-03-01 | 初始版本，定义基本目录结构规范 | - |

---

**文档版本**: v1.0  
**最后更新**: 2026-03-01  
**维护人员**: VidTimelineX 开发团队
