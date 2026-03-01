# 前端项目结构及规范优化计划

## 📋 项目概述

**项目名称**：VidTimelineX 前端项目结构及规范优化  
**优化目标**：提升代码可维护性、统一命名规范、优化目录结构、建立完整规范文档  
**预计周期**：分阶段实施，优先解决高优先级问题

---

## 🎯 优化目标

### 主要目标
1. **统一命名规范** - 消除文件命名不一致问题
2. **清晰组件职责** - 重新组织组件目录结构
3. **优化路由配置** - 分离关注点，提升可维护性
4. **规范环境管理** - 添加类型定义和标准化配置
5. **优化测试结构** - 合并重复目录，统一测试规范
6. **建立规范文档** - 创建完整的项目开发规范文档

### 次要目标
1. **增强性能监控** - 建立专门的 Performance 目录
2. **优化数据管理** - 分离模拟数据和类型定义
3. **改进样式组织** - 建立主题系统

---

## 📊 当前问题分析

### 高优先级问题 🔴

#### 1. 测试文件命名不一致
**现状**：
- `tests/e2e/tiantong/*.e2e.tsx` - 使用 `.e2e.tsx` 后缀
- `tests/e2e/lvjiang/page-navigation.e2e.tsx` - 使用 `.e2e.tsx` 后缀
- `tests/mobile/*.mobile.spec.ts` - 使用 `.spec.ts` 后缀
- 刚移动的 `danmaku-theme.e2e.tsx` - 使用 `.e2e.tsx` 后缀

**影响**：
- 新开发者容易混淆
- IDE 和工具链配置复杂
- 不符合 Playwright 官方推荐

#### 2. 路由配置分散
**现状**：
- `src/app/App.tsx` 包含 HomePage 组件实现和空导出
- `src/app/routes.tsx` 依赖 App.tsx 的 HomePage 导出
- 路由配置和页面组件耦合

**影响**：
- 循环依赖风险
- 代码职责不清晰
- 不利于代码复用

#### 3. 缺乏统一规范文档
**现状**：
- ✅ 已创建完整规范文档（STRUCTURE.md、NAMING_CONVENTION.md、COMPONENT_GUIDE.md、ENV_GUIDE.md、COMMIT_CONVENTION.md）
- ✅ 已更新 README.md 引用新规范

**状态**：✅ 已完成

### 中优先级问题 🟡

#### 4. 组件职责不清晰
**现状**：
```
src/components/
├── ui/              # 基础 UI 组件（30+ Radix UI 封装）
├── video/           # VideoCard, VideoModal（业务组件）
├── video-view/      # FilterDropdown, ViewSwitcher（视图组件）
├── figma/           # ImageWithFallback（设计系统）
├── MobileNotSupported.tsx
└── PerformanceMonitor.tsx
```

**问题**：
- `video/` 和 `video-view/` 都是业务组件，但分散在两个目录
- `MobileNotSupported` 和 `PerformanceMonitor` 是通用组件，与业务组件同级
- 缺少清晰的分类标准

### 低优先级问题 🟢

#### 5. 数据文件组织不当
**现状**：
- JSON 文件（`users.json`、`videos.json`）与 TypeScript 代码混在一起
- 缺少数据加载函数的统一管理

#### 6. 样式文件组织可优化
**现状**：
- 5 个 CSS 文件（`animations.css`、`components.css`、`globals.css`、`utilities.css`、`variables.css`）
- 缺少主题相关文件
- 职责有重叠

#### 7. 缺少性能监控目录
**现状**：
- `PerformanceMonitor.tsx` 组件孤立存在
- 没有专门的性能监控工具函数

---

## 🚀 实施计划

### 第一阶段：高优先级优化（立即执行）

#### ~~任务 1.1：统一测试文件命名规范~~ ✅ 已完成
**状态**：✅ 已完成 - `danmaku-theme.e2e.tsx` 已移动到正确位置

#### ~~任务 1.2：重构路由配置~~ ⏸️ 暂缓
**说明**：当前路由配置运行正常，暂不重构

#### ~~任务 1.3：创建/更新开发规范文档~~ ✅ 已完成
**状态**：✅ 已完成
- ✅ 创建 `STRUCTURE.md` - 项目结构规范文档
- ✅ 创建 `NAMING_CONVENTION.md` - 命名规范文档
- ✅ 创建 `COMPONENT_GUIDE.md` - 组件组织规范指南
- ✅ 创建 `ENV_GUIDE.md` - 环境变量规范指南
- ✅ 创建 `COMMIT_CONVENTION.md` - Git 提交规范指南
- ✅ 更新 `README.md` 引用新规范

#### ~~任务 1.4：添加环境变量类型定义~~ ✅ 已完成
**状态**：✅ 已完成
- ✅ 创建 `src/env.d.ts` 文件
- ✅ 定义 `ImportMetaEnv` 接口，包含所有环境变量
- ✅ 更新 `tsconfig.app.json` 包含类型定义
- ✅ 更新 `vite.config.ts` 使用类型化的环境变量
- ✅ 创建 `.env.example` 模板文件

**类型定义**：
```typescript
// src/env.d.ts
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_CUSTOM_DOMAIN?: string;
  readonly VITE_USE_JSDELIVR_CDN: string;
  readonly VITE_BASE_URL: string;
  readonly VITE_HMR_ENABLED: string;
  readonly VITE_DISABLE_WEBSOCKET: string;
  readonly VITE_ANALYZE_BUILD: string;
  readonly VITE_ENABLE_MINIFICATION: string;
}
```

---

### 第二阶段：中优先级优化（短期执行）

#### 任务 2.1：重新组织组件目录结构
**目标**：清晰划分基础组件、业务组件和布局组件

**步骤**：
1. 创建 `src/components/business/` 目录
2. 将 `video/` 和 `video-view/` 移动到 `business/`
3. 将 `MobileNotSupported.tsx` 和 `PerformanceMonitor.tsx` 移动到 `business/` 或创建 `src/components/layout/`
4. 更新所有导入路径
5. 运行类型检查和测试验证

**新结构**：
```
src/components/
├── ui/                      # 基础 UI 组件（不变）
├── business/                # 业务组件（新增）
│   ├── video/              # 视频相关组件
│   │   ├── VideoCard.tsx
│   │   └── VideoModal.tsx
│   ├── video-view/         # 视图组件
│   │   ├── FilterDropdown.tsx
│   │   └── ViewSwitcher.tsx
│   ├── MobileNotSupported.tsx
│   └── PerformanceMonitor.tsx
└── figma/                  # Figma 设计系统（不变）
```

**注意事项**：
- 使用批量重命名工具确保所有导入路径正确更新
- 检查是否有硬编码的路径字符串
- 验证 Jest 配置中的路径映射

---

#### 任务 2.2：优化测试目录结构
**目标**：合并重复目录，统一 E2E 测试规范

**步骤**：
1. 将 `tests/mobile/` 重命名为 `tests/e2e/mobile/`
2. 将 `tests/config/` 合并到 `tests/utils/`
3. 更新 Playwright 配置文件中的路径
4. 更新 Jest 配置中的路径忽略模式
5. 更新所有测试文件中的相对导入路径
6. 验证所有测试能正常执行

**新结构**：
```
tests/
├── unit/                    # 单元测试（不变）
├── integration/             # 集成测试（不变）
├── e2e/                     # E2E 测试（统一）
│   ├── desktop/            # 桌面端 E2E（可选）
│   └── mobile/             # 移动端 E2E（从根目录移动）
├── fixtures/               # 测试数据（不变）
├── utils/                  # 测试工具（合并 config/）
└── docs/                   # 测试文档（不变）
```

**注意事项**：
- 移动端测试的特殊配置需要保留
- 确保 `playwright.mobile.config.ts` 仍然能正确找到测试文件
- 更新 CI/CD 中的测试命令

---

#### 任务 2.3：标准化环境变量配置
**目标**：统一环境变量管理，提供标准化配置模板

**步骤**：
1. 审查现有 `.env.development` 和 `.env.production` 文件
2. 创建 `.env.example` 模板文件（不包含敏感信息）✅ 已完成
3. 标准化环境变量命名和使用方式
4. 更新 Vite 配置使用类型化的环境变量 ✅ 已完成
5. 添加环境变量使用文档

**示例 `.env.example`**：
```bash
# API 配置
VITE_API_BASE_URL=http://localhost:3000/api

# CDN 配置
VITE_USE_JSDELIVR_CDN=false

# 构建配置
VITE_BASE_URL=/
VITE_ENABLE_MINIFICATION=true
```

**注意事项**：
- `.env.example` 不应该包含敏感信息
- 在 `.gitignore` 中确保 `.env*.local` 被忽略
- 更新 README.md 中的环境变量说明

---

### 第三阶段：低优先级优化（长期执行）

#### 任务 3.1：优化数据文件组织
**目标**：分离模拟数据、数据加载函数和类型定义

**步骤**：
1. 在每个 feature 模块下创建 `data/mock/` 目录
2. 将 JSON 文件移动到 `mock/` 目录
3. 创建 `data/loaders/` 目录存放数据加载函数
4. 创建 `data/types/` 目录存放数据类型定义
5. 更新所有数据相关的导入路径

**新结构**：
```
src/features/tiantong/
├── data/
│   ├── mock/               # 模拟数据
│   ├── loaders/            # 数据加载函数
│   └── types/              # 数据类型定义
└── TiantongPage.tsx
```

---

#### 任务 3.2：改进样式文件组织
**目标**：建立清晰的样式层次结构和主题系统

**步骤**：
1. 创建 `src/styles/base/` 目录
2. 将 `variables.css` 和 `globals.css` 移动到 `base/`
3. 创建 `src/styles/themes/` 目录
4. 将主题相关样式分离到独立文件
5. 创建 `src/styles/index.css` 统一导入
6. 更新所有样式相关的导入路径

**新结构**：
```
src/styles/
├── base/                    # 基础样式
├── components/             # 组件样式
├── utilities/              # 工具类
├── themes/                 # 主题样式（新增）
└── index.css               # 统一导出（新增）
```

---

#### 任务 3.3：建立性能监控目录
**目标**：集中管理性能监控相关代码

**步骤**：
1. 创建 `src/performance/` 目录
2. 将 `PerformanceMonitor.tsx` 移动到 `performance/components/`
3. 创建性能指标收集工具函数
4. 创建性能分析工具函数
5. 更新所有相关导入路径

**新结构**：
```
src/performance/
├── components/
├── metrics/
└── utils/
```

---

## 📅 实施时间表

### 第一阶段（第 1-2 周）✅ 已完成
- [x] ~~任务 1.1：统一测试文件命名规范~~ - 已完成
- [x] ~~任务 1.2：重构路由配置~~ - 暂缓，当前配置运行正常
- [x] ~~任务 1.3：创建/更新开发规范文档~~ - 已完成
- [x] ~~任务 1.4：添加环境变量类型定义~~ - 已完成

### 第二阶段（第 3-4 周）
- [x] ~~任务 2.1：重新组织组件目录结构~~ - ✅ 已完成
- [ ] 任务 2.2：优化测试目录结构
- [ ] 任务 2.3：标准化环境变量配置

### 第三阶段（第 5-6 周）
- [ ] 任务 3.1：优化数据文件组织
- [ ] 任务 3.2：改进样式文件组织
- [ ] 任务 3.3：建立性能监控目录

---

## ✅ 验收标准

### 代码质量
- [x] TypeScript 类型检查通过，无 `any` 类型滥用
- [ ] ESLint 检查无错误，警告数量减少 20%
- [x] Prettier 格式化检查通过

### 测试覆盖
- [ ] 所有单元测试通过（`npm run test:unit`）
- [ ] 所有集成测试通过（`npm run test:integration`）
- [ ] 所有 E2E 测试通过（`npm run test:e2e`）
- [ ] 测试覆盖率不低于当前水平

### 功能验证
- [ ] 页面路由正常工作
- [ ] 主题切换功能正常
- [ ] 弹幕功能正常
- [ ] 视频播放功能正常
- [ ] 搜索过滤功能正常

### 文档更新
- [x] 更新 README.md 中的项目结构说明
- [x] 添加完整的开发规范文档
- [x] 更新环境变量配置文档
- [x] 添加环境变量类型定义

---

## ⚠️ 风险评估

### 高风险项
1. **组件目录重构** - 可能导致大量导入路径错误
   - **缓解措施**：使用 IDE 批量重命名功能，分批次提交
   - **回滚方案**：保留 Git 历史，随时可回退

2. **测试目录重组** - 可能导致 CI/CD 流程中断
   - **缓解措施**：先在本地验证所有测试，再更新 CI 配置
   - **回滚方案**：保留原有目录作为备份

### 中风险项
1. **路由配置重构** - 可能影响 SEO 和页面加载
   - **缓解措施**：保持懒加载配置不变，验证 meta 标签
   - **回滚方案**：保留原 App.tsx 作为备份

### 低风险项
1. **环境变量类型定义** - ✅ 已完成，纯类型系统改动
2. **样式文件重组** - CSS 文件加载顺序正确即可
3. **规范文档创建** - ✅ 已完成，纯文档工作

---

## 📝 变更管理

### Git 提交规范
所有提交遵循 Conventional Commits 规范：
```
refactor(structure): 重构组件目录结构
- 移动 video/ 和 video-view/ 到 business/
- 创建 layout/ 目录
- 更新所有导入路径

feat(types): 添加环境变量类型定义
- 创建 src/env.d.ts
- 定义 ImportMetaEnv 接口
- 更新 tsconfig 配置

docs(style): 创建开发规范文档
- 添加 CONTRIBUTING.md
- 详细说明项目结构规范
- 包含命名约定和最佳实践
```

### 提交检查清单
- [ ] 代码通过 ESLint 和 Prettier 检查
- [ ] 所有测试通过
- [ ] TypeScript 类型检查通过
- [ ] 提交信息符合规范
- [ ] 更新相关文档（如适用）

---

## 📚 参考文档

- [Vite 官方文档 - 环境变量](https://vitejs.dev/guide/env-and-mode.html)
- [Playwright 测试最佳实践](https://playwright.dev/docs/best-practices)
- [React 项目结构组织](https://reactjs.org/docs/faq-structure.html)
- [TypeScript 模块解析](https://www.typescriptlang.org/docs/handbook/module-resolution.html)

---

## 🔄 持续改进

本优化计划将根据实施过程中的实际情况进行调整。每次优化完成后，应该：
1. 收集团队反馈
2. 记录遇到的问题和解决方案
3. 更新项目文档
4. 优化开发流程

---

**创建时间**：2026-03-01  
**最后更新**：2026-03-01  
**版本**：v1.3  
**负责人**：待分配
