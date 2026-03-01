# 项目文档目录优化方案

## 1. 现状分析

### 1.1 当前文档分布

| 位置                     | 文档类型    | 数量 | 状态  | 问题            |
| ---------------------- | ------- | -- | --- | ------------- |
| `docs/`                | 项目级规范文档 | 5个 | 现有  | 结构清晰，但缺少索引    |
| `frontend/` 根目录        | 前端规范文档  | 7个 | 现有  | 与代码文件混放，根目录臃肿 |
| `frontend/docs/`       | 前端文档索引  | -  | 已删除 | ~~内容单薄~~（已清理） |
| `frontend/tests/docs/` | 测试文档    | 1个 | 现有  | 分散在测试目录中      |
| `frontend/src/shared/` | 组件文档    | 1个 | 现有  | 孤立在源码中        |

> **注意**：`.trae/` 目录下的文档不需要进行管理，保持现状即可。

#### 详细文档清单

**`docs/`** **目录：**

* README.md

* 前端编码规范.md

* 前端样式管理规范.md

* 后端编码规范.md

* 法律法规与合规性调研报告.md

**`frontend/`** **根目录：**

* README.md

* STRUCTURE.md

* NAMING\_CONVENTION.md

* COMPONENT\_GUIDE.md

* ENV\_GUIDE.md

* COMMIT\_CONVENTION.md

* HOOKS.md

**`frontend/tests/`** **目录：**

* README.md

* docs/testing-guidelines.md

### 1.2 主要问题

1. **文档分散**：前端文档分布在多个位置，需要整合
2. **层级混乱**：规范文档、技术文档混在一起
3. **索引不足**：缺少统一的文档导航入口
4. **命名不统一**：中英文混合，大小写不一致
5. **归档缺失**：已完成的历史文档未归档

> **范围说明**：本文档优化方案仅针对 `docs/` 和 `frontend/` 目录下的文档，`.trae/` 目录下的文档保持现状，不进行迁移或修改。

## 2. 优化目标

1. **统一入口**：建立清晰的文档导航体系
2. **分类明确**：按文档类型和功能模块分类
3. **层级清晰**：项目级 → 模块级 → 功能级
4. **命名规范**：统一命名规则和文件格式
5. **维护便捷**：易于更新、归档和查找

## 3. 优化方案

### 3.1 目标文档结构

```
docs/                                      # 项目文档根目录
├── README.md                              # 文档中心首页
├── guides/                                # 开发指南
│   ├── getting-started.md                 # 快速入门
│   ├── frontend/                          # 前端开发指南
│   │   ├── README.md                      # 前端文档首页
│   │   ├── getting-started.md             # 前端快速入门
│   │   ├── development.md                 # 前端开发规范
│   │   ├── testing.md                     # 前端测试指南
│   │   └── deployment.md                  # 前端部署指南
│   └── backend/                           # 后端开发指南（可选）
│       ├── README.md                      # 后端文档首页
│       ├── getting-started.md             # 后端快速入门
│       ├── development.md                 # 后端开发规范
│       ├── testing.md                     # 后端测试指南
│       └── deployment.md                  # 后端部署指南
├── standards/                             # 规范文档
│   ├── frontend/                          # 前端规范
│   │   ├── coding-standards.md            # 前端编码规范（从 docs/前端编码规范.md 迁移）
│   │   ├── style-guide.md                 # 前端样式规范（从 docs/前端样式管理规范.md 迁移）
│   │   ├── project-structure.md           # 项目结构规范（从 frontend/STRUCTURE.md 迁移）
│   │   ├── naming-conventions.md          # 命名规范（从 frontend/NAMING_CONVENTION.md 迁移）
│   │   ├── component-guide.md             # 组件规范（从 frontend/COMPONENT_GUIDE.md 迁移）
│   │   ├── environment-guide.md           # 环境变量规范（从 frontend/ENV_GUIDE.md 迁移）
│   │   ├── commit-conventions.md          # 提交规范（从 frontend/COMMIT_CONVENTION.md 迁移）
│   │   └── git-hooks.md                   # Hooks规范（从 frontend/HOOKS.md 迁移）
│   └── backend/                           # 后端规范（可选）
│       └── coding-standards.md            # 后端编码规范（从 docs/后端编码规范.md 迁移）
├── plans/                                 # 开发计划（可选，仅管理新计划）
│   ├── README.md                          # 计划文档导航
│   ├── active/                            # 进行中计划
│   ├── completed/                         # 已完成计划
│   └── archived/                          # 已归档计划
├── specs/                                 # 功能规格（可选，仅管理新规格）
│   ├── README.md                          # 规格文档导航
│   └── [feature-name]/                    # 各功能规格目录
│       ├── spec.md
│       ├── tasks.md
│       └── checklist.md
├── components/                            # 组件文档
│   └── danmaku.md                         # 弹幕组件文档（从 frontend/src/shared/danmaku/README.md 复制）
├── reports/                               # 分析报告
│   └── README.md                          # 报告文档导航
└── archive/                               # 归档文档
    └── 2026/                              # 按年份归档

> **目录说明**：
> - `guides/`、`standards/`、`components/`、`reports/`、`archive/` 为必须创建的目录
> - `plans/` 和 `specs/` 为可选目录，仅当需要在 `docs/` 下管理新的计划和规格时创建
> - `.trae/documents/` 和 `.trae/specs/` 保持现状，不进行迁移
```

### 3.2 文档迁移计划

#### 阶段1：创建新目录结构

1. 创建 `docs/guides/frontend/` 和 `docs/guides/backend/`
2. 创建 `docs/standards/frontend/` 和 `docs/standards/backend/`
3. 创建 `docs/components/`
4. 创建 `docs/reports/`
5. 创建 `docs/archive/`

> **注意**：`.trae/documents/` 和 `.trae/specs/` 保持现状，不进行迁移。

#### 阶段2：迁移规范文档

**从** **`docs/`** **迁移：**

| 原位置                | 新位置                                           | 操作 |
| ------------------ | --------------------------------------------- | -- |
| `docs/前端编码规范.md`   | `docs/standards/frontend/coding-standards.md` | 移动 |
| `docs/前端样式管理规范.md` | `docs/standards/frontend/style-guide.md`      | 移动 |
| `docs/后端编码规范.md`   | `docs/standards/backend/coding-standards.md`  | 移动 |

**从** **`frontend/`** **根目录迁移：**

| 原位置                             | 新位置                                     | 操作 |
| ------------------------------- | --------------------------------------- | -- |
| `frontend/STRUCTURE.md`         | `docs/standards/frontend/project-structure.md`  | 移动 |
| `frontend/NAMING_CONVENTION.md` | `docs/standards/frontend/naming-conventions.md`     | 移动 |
| `frontend/COMPONENT_GUIDE.md`   | `docs/standards/frontend/component-guide.md` | 移动 |
| `frontend/ENV_GUIDE.md`         | `docs/standards/frontend/environment-guide.md`        | 移动 |
| `frontend/COMMIT_CONVENTION.md` | `docs/standards/frontend/commit-conventions.md`     | 移动 |
| `frontend/HOOKS.md`             | `docs/standards/frontend/git-hooks.md`      | 移动 |

**保留在** **`frontend/`** **根目录：**

| 文档                   | 原因             |
| -------------------- | -------------- |
| `frontend/README.md` | 项目入口文档，需保留在根目录 |

#### 阶段3：创建开发计划目录（可选）

如需在 `docs/` 目录下管理新的开发计划，可创建以下结构：

```
docs/plans/
├── README.md          # 计划文档导航
├── active/            # 进行中计划
├── completed/         # 已完成计划
└── archived/          # 已归档计划
```

> **注意**：`.trae/documents/` 目录下的现有计划文档保持现状，不进行迁移。

#### 阶段4：创建功能规格目录（可选）

如需在 `docs/` 目录下管理新的功能规格，可创建以下结构：

```
docs/specs/
├── README.md                    # 规格文档导航
└── [feature-name]/              # 各功能规格目录
    ├── spec.md
    ├── tasks.md
    └── checklist.md
```

> **注意**：`.trae/specs/` 目录下的现有规格文档保持现状，不进行迁移。

#### 阶段5：迁移组件文档

| 原位置                                     | 新位置                          | 操作        | 说明               |
| --------------------------------------- | ---------------------------- | --------- | ---------------- |
| `frontend/src/shared/danmaku/README.md` | `docs/components/danmaku.md` | 复制（保留原文件） | 源码旁保留，docs/下创建副本 |

> **策略说明**：组件文档采用"双位置"策略
>
> * 源码目录保留：便于开发时查阅，与代码同步维护
>
> * docs/目录副本：作为统一文档中心的一部分，便于导航

#### 阶段6：创建索引文档

**必须创建的索引：**

1. 重写 `docs/README.md` 作为统一入口

   * 包含所有文档的导航链接

   * 说明文档分类和使用方法

   * 提供快速入门指南

2. 创建 `docs/guides/frontend/README.md`

   * 前端开发指南首页

   * 链接到前端相关规范文档

3. 创建 `docs/guides/backend/README.md`（可选）

   * 后端开发指南首页

4. 创建 `docs/standards/frontend/README.md`

   * 前端规范文档索引

   * 列出所有前端规范

5. 创建 `docs/standards/backend/README.md`（可选）

   * 后端规范文档索引

**可选创建的索引：**

1. `docs/plans/README.md` - 仅当在 `docs/` 目录下管理计划文档时
2. `docs/specs/README.md` - 仅当在 `docs/` 目录下管理规格文档时
3. `docs/components/README.md` - 组件文档索引

#### 阶段7：更新引用链接

1. 更新根目录 `README.md` 的文档链接
2. 更新 `frontend/README.md` 的文档链接
3. 更新 `backend/README.md` 的文档链接
4. 在旧位置添加重定向说明（可选）

### 3.3 命名规范

#### 文件命名

* 使用小写字母

* 单词间使用连字符 `-` 分隔

* 使用英文命名（便于国际化）

* 示例：`coding-standards.md`, `ui-optimization-plan.md`

#### 目录命名

* 使用小写字母

* 单词间使用连字符 `-` 分隔

* 使用单数形式

* 示例：`guides/`, `standards/`, `components/`

### 3.4 文档模板

#### 规范文档模板

```markdown
# 文档标题

> 文档概述和目的

## 1. 适用范围

## 2. 规范内容

### 2.1 子规范1
### 2.2 子规范2

## 3. 最佳实践

## 4. 相关文档

---
**最后更新**: YYYY-MM-DD
```

#### 计划文档模板

```markdown
# 计划标题

> 计划概述和目标

## 1. 背景

## 2. 目标

## 3. 任务清单

### P0 - 核心任务
- [ ] 任务1
- [ ] 任务2

### P1 - 重要任务
- [ ] 任务3

## 4. 时间规划

## 5. 验收标准

---
**状态**: 进行中/已完成/已归档
**创建日期**: YYYY-MM-DD
**完成日期**: YYYY-MM-DD
```

## 4. 实施步骤

### 步骤1：准备工作

* [x] 分析文档有效性（排除 .trae 目录）

* [x] 识别并删除无效/过期文档

### 步骤2：前端文档清理（已完成 2026-03-01）

* [x] 删除 `frontend/tests/docs/mobile-not-supported-test-doc.md`（单个组件详细测试文档，维护成本高）

* [x] 删除 `frontend/docs/README.md`（冗余导航文档，功能可整合到 frontend/README.md）

* [x] 更新 `frontend/README.md` 移除对已删除文档的引用

* [x] 更新 `frontend/tests/README.md` 移除对已删除文档的引用

### 步骤3：迁移规范文档（已完成 2026-03-01）

#### 3.1 创建目录结构

* [x] 创建 `docs/standards/frontend/` 目录

* [x] 创建 `docs/standards/backend/` 目录（可选）

#### 3.2 迁移项目级规范（从 `docs/`）

* [x] 移动 `docs/前端编码规范.md` → `docs/standards/frontend/coding-standards.md`

* [x] 移动 `docs/前端样式管理规范.md` → `docs/standards/frontend/style-guide.md`

* [x] 移动 `docs/后端编码规范.md` → `docs/standards/backend/coding-standards.md`

#### 3.3 迁移前端规范（从 `frontend/`）

* [x] 移动 `frontend/STRUCTURE.md` → `docs/standards/frontend/project-structure.md`

* [x] 移动 `frontend/NAMING_CONVENTION.md` → `docs/standards/frontend/naming-conventions.md`

* [x] 移动 `frontend/COMPONENT_GUIDE.md` → `docs/standards/frontend/component-guide.md`

* [x] 移动 `frontend/ENV_GUIDE.md` → `docs/standards/frontend/environment-guide.md`

* [x] 移动 `frontend/COMMIT_CONVENTION.md` → `docs/standards/frontend/commit-conventions.md`

* [x] 移动 `frontend/HOOKS.md` → `docs/standards/frontend/git-hooks.md`

#### 3.4 更新引用

* [x] 更新 `docs/README.md` 中的规范文档链接

* [x] 更新 `frontend/README.md` 中的规范文档链接

* [x] 更新 `README.md`（根目录）中的规范文档链接

### 步骤4：创建计划文档目录（可选）

* [ ] 如需在 `docs/` 下管理计划文档，创建 `docs/plans/` 目录结构

> **注意**：`.trae/documents/` 保持现状，不进行迁移

### 步骤5：创建规格文档目录（可选）

* [ ] 如需在 `docs/` 下管理规格文档，创建 `docs/specs/` 目录结构

> **注意**：`.trae/specs/` 保持现状，不进行迁移

### 步骤6：创建索引（已完成 2026-03-01）

* [x] 重写 `docs/README.md`

* [x] 创建 `docs/standards/frontend/README.md`

* [x] 创建 `docs/standards/backend/README.md`

* [x] 创建 `docs/components/danmaku.md`

### 步骤7：更新引用（已完成 2026-03-01）

* [x] 更新根目录 README

* [x] 更新 frontend README

* [x] 更新 backend README

### 步骤8：清理旧文件（已完成 2026-03-01）

* [x] 删除已迁移的旧文件（frontend/ 根目录下的规范文档）
  - 已删除：STRUCTURE.md
  - 已删除：NAMING_CONVENTION.md
  - 已删除：COMPONENT_GUIDE.md
  - 已删除：ENV_GUIDE.md
  - 已删除：COMMIT_CONVENTION.md
  - 已删除：HOOKS.md

* [x] 删除空目录（无需删除，无空目录产生）

* [ ] 验证所有链接（建议定期执行）

## 5. 预期效果

1. **统一入口**：通过 `docs/README.md` 可找到所有文档
2. **分类清晰**：规范、计划、规格、组件文档分离
3. **命名统一**：全部使用英文小写命名
4. **易于维护**：新增文档有明确位置
5. **历史可追溯**：归档文档按年份存放

## 6. 风险评估

| 风险      | 影响 | 缓解措施        |
| ------- | -- | ----------- |
| 链接失效    | 高  | 全面检查并更新所有链接 |
| 文档丢失    | 高  | 迁移前完整备份     |
| 团队成员不适应 | 中  | 提供详细的文档导航   |
| 历史记录丢失  | 低  | 保留原目录结构一段时间 |

## 7. 后续维护

1. **新增文档**：按分类放入对应目录
2. **定期归档**：每季度归档已完成计划
3. **链接检查**：每月检查文档链接有效性
4. **索引更新**：及时更新各索引文档

***

**方案制定**: 2026-03-01
**最后更新**: 2026-03-01
**实施状态**: 已完成核心步骤（步骤1-7）
