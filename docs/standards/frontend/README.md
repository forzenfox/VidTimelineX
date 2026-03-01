# 前端开发规范

> 本目录包含 VidTimelineX 前端项目的所有开发规范文档。

## 规范文档列表

| 文档 | 说明 | 优先级 |
|------|------|--------|
| [coding-standards.md](./coding-standards.md) | 前端编码规范 - React + TypeScript 代码风格、最佳实践 | 必读 |
| [style-guide.md](./style-guide.md) | 前端样式管理规范 - Tailwind CSS 使用、主题管理、响应式设计 | 必读 |
| [project-structure.md](./project-structure.md) | 项目结构规范 - 目录组织、文件命名、导入路径 | 必读 |
| [naming-conventions.md](./naming-conventions.md) | 命名规范 - 文件、变量、组件、CSS 命名规则 | 必读 |
| [component-guide.md](./component-guide.md) | 组件组织规范 - 组件分类、编写规范、性能优化 | 必读 |
| [environment-guide.md](./environment-guide.md) | 环境变量规范 - 环境变量管理、类型定义、安全实践 | 必读 |
| [commit-conventions.md](./commit-conventions.md) | Git 提交规范 - Commit Message 格式、分支管理、PR 规范 | 必读 |
| [git-hooks.md](./git-hooks.md) | Git Hooks 说明 - Husky 配置、lint-staged、自动化检查 | 推荐 |

## 快速参考

### 新成员入门阅读顺序

1. **project-structure.md** - 了解项目结构
2. **naming-conventions.md** - 掌握命名规则
3. **coding-standards.md** - 学习编码规范
4. **component-guide.md** - 理解组件开发
5. **commit-conventions.md** - 熟悉提交规范

### 日常开发参考

- **编写代码时**：参考 coding-standards.md
- **创建组件时**：参考 component-guide.md + naming-conventions.md
- **提交代码时**：参考 commit-conventions.md + git-hooks.md
- **配置环境时**：参考 environment-guide.md
- **编写样式时**：参考 style-guide.md

## 规范执行

所有规范通过以下工具强制执行：

- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **Husky** - Git 钩子
- **lint-staged** - 提交前检查

## 更新记录

| 日期 | 更新内容 |
|------|----------|
| 2026-03-01 | 规范文档迁移至 docs/standards/frontend/ 目录 |

---

[返回文档中心](../../README.md)
