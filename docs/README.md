# VidTimelineX 项目文档中心

> 本文档是 VidTimelineX 项目的文档导航中心，汇总所有项目文档，方便快速查找。

## 文档结构概览

```
docs/
├── README.md                           # 本文档 - 文档导航中心
├── standards/                          # 开发规范文档
│   ├── frontend/                       # 前端规范
│   │   ├── coding-standards.md         # 前端编码规范
│   │   ├── style-guide.md              # 前端样式管理规范
│   │   ├── project-structure.md        # 项目结构规范
│   │   ├── naming-conventions.md       # 命名规范
│   │   ├── component-guide.md          # 组件组织规范
│   │   ├── environment-guide.md        # 环境变量规范
│   │   ├── commit-conventions.md       # Git 提交规范
│   │   └── git-hooks.md                # Git Hooks 使用说明
│   └── backend/                        # 后端规范
│       └── coding-standards.md         # 后端编码规范
├── guides/                             # 使用指南
├── components/                         # 组件文档
├── reports/                            # 报告文档
├── archive/                            # 归档文档
└── design/                             # 设计相关文档
    └── prototypes/                     # 原型设计文件
```

## 快速导航

### 前端开发规范

| 文档 | 说明 |
|------|------|
| [前端编码规范](./standards/frontend/coding-standards.md) | React + TypeScript 编码规范、组件规范、测试规范 |
| [前端样式管理规范](./standards/frontend/style-guide.md) | Tailwind CSS 使用规范、主题管理、响应式设计 |
| [项目结构规范](./standards/frontend/project-structure.md) | 目录结构、文件组织、导入路径规范 |
| [命名规范](./standards/frontend/naming-conventions.md) | 文件命名、代码命名、测试命名规范 |
| [组件组织规范](./standards/frontend/component-guide.md) | 组件分类、编写规范、最佳实践 |
| [环境变量规范](./standards/frontend/environment-guide.md) | 环境变量管理、类型定义、安全实践 |
| [Git 提交规范](./standards/frontend/commit-conventions.md) | Commit Message、分支管理、PR 规范 |
| [Git Hooks 说明](./standards/frontend/git-hooks.md) | Git Hooks 配置说明 |

### 后端开发规范

| 文档 | 说明 |
|------|------|
| [后端编码规范](./standards/backend/coding-standards.md) | Python 编码规范、TDD开发流程、测试规范 |

### 项目说明

| 文档 | 说明 |
|------|------|
| [项目根目录 README](../README.md) | 项目全局说明、架构概览、快速开始 |
| [前端 README](../frontend/README.md) | 前端详细技术文档、组件说明、开发指南 |
| [后端 README](../backend/README.md) | 后端架构详细技术文档、TDD开发流程 |

### 合规与法律

| 文档 | 说明 |
|------|------|
| [法律法规与合规性调研报告](./法律法规与合规性调研报告.md) | 项目合规性调研 |

### 技术方案

| 文档 | 说明 |
|------|------|
| [弹幕数据加载方案综合分析.md](./弹幕数据加载方案综合分析.md) | 技术方案分析 |
| [弹幕数据加载方案综合分析-执行摘要.md](./弹幕数据加载方案综合分析-执行摘要.md) | 执行摘要 |

## 其他文档位置

### 开发计划与任务文档

位于 `.trae/documents/` 目录下，包含各类功能开发计划、优化计划、问题修复计划等。

### 功能规格文档

位于 `.trae/specs/` 目录下，按功能模块组织的规格说明文档（spec.md、tasks.md、checklist.md）。

### 测试文档

位于 `frontend/tests/docs/` 目录下：

- `testing-guidelines.md` - 测试指南

### 共享组件文档

位于 `frontend/src/shared/danmaku/README.md` - 弹幕共享库说明

## 文档维护指南

1. **新增文档**：根据文档类型放入对应目录
   - 技术规范放入 `docs/standards/`
   - 使用指南放入 `docs/guides/`
   - 组件文档放入 `docs/components/`
   - 报告文档放入 `docs/reports/`
   - 开发计划放入 `.trae/documents/`
2. **更新文档**：修改文档后同步更新本文档的导航链接
3. **归档文档**：过期文档移动到 `docs/archive/` 目录
4. **命名规范**：使用英文描述性命名，如 `document-name.md`

---

**最后更新**：2026-03-01
