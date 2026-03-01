# Git Hooks 配置说明

## 📋 当前配置

本项目使用 **Husky** 管理 Git hooks，配置在 `frontend/` 目录下。

## 🔧 Pre-commit 钩子功能

每次执行 `git commit` 时，会自动运行以下检查：

### 1. 代码格式化和 ESLint 检查 ✅
- 使用 `lint-staged` 对暂存区文件进行检查
- 自动修复 ESLint 和 Prettier 问题
- 支持的文件类型：
  - `**/*.{ts,tsx,js,jsx}` - ESLint + Prettier
  - `**/*.{css,scss,json,md}` - Prettier

### 2. TypeScript 类型检查 🔷
- 运行 `tsc --noEmit` 进行类型检查
- 确保代码没有类型错误
- 使用 `tsconfig.app.json` 配置

### 3. 单元测试 🧪（在 CI 中执行）
- **Pre-commit 钩子不包含单元测试**（避免提交等待时间过长）
- 单元测试在 CI/CD 流程中严格执行
- 本地可使用 `npm test` 手动运行测试

## 🎨 输出样式

钩子使用彩色输出方便识别：
- 🟢 绿色 - 检查通过
- 🔴 红色 - 检查失败（阻止提交）
- 🟡 黄色 - 警告（不阻止提交）

## 📝 配置位置

- **Husky 配置**: `frontend/.husky/pre-commit`
- **Lint-staged 配置**: `frontend/package.json` -> `lint-staged`
- **ESLint 配置**: `frontend/eslint.config.js`
- **Prettier 配置**: `frontend/.prettierrc.json`

## ⚙️ 自定义配置

### 修改检查规则

编辑 `frontend/package.json` 中的 `lint-staged` 配置：

```json
"lint-staged": {
  "**/*.{ts,tsx,js,jsx}": [
    "eslint --fix",
    "prettier --write"
  ]
}
```

### 禁用某项检查

编辑 `frontend/.husky/pre-commit`，注释掉对应的检查步骤。

### 跳过 Pre-commit 钩子

如果遇到特殊情况需要跳过检查，可以使用：

```bash
git commit -m "your message" --no-verify
```

**注意**: 不建议频繁使用，仅在紧急情况下使用。

## 🚀 安装

Husky 会在 `npm install` 时自动安装（通过 `prepare` 脚本）。

如果需要手动重新安装：

```bash
cd frontend
npm install
```

## 📊 检查流程

```
git commit
    ↓
[1] 代码格式化和 ESLint 检查
    ↓ 失败 ❌ → 阻止提交
    ↓ 通过 ✅
[2] TypeScript 类型检查
    ↓ 失败 ❌ → 阻止提交
    ↓ 通过 ✅
[3] 提交成功 🎉
    ↓
📝 单元测试在 CI/CD 中执行
```

## 💡 最佳实践

1. **本地运行检查**: 提交前可以手动运行 `npm run lint` 和 `npm test` 预检查
2. **小步提交**: 每次提交只修改少量文件，减少检查时间
3. **修复优先**: 如果检查失败，优先修复问题而不是跳过钩子
4. **CI 验证**: Pre-commit 钩子主要保证基本质量，完整测试在 CI 中运行

## 🔗 相关资源

- [Husky 文档](https://typicode.github.io/husky/)
- [Lint-staged 文档](https://github.com/okonet/lint-staged)
- [ESLint 文档](https://eslint.org/)
- [Prettier 文档](https://prettier.io/)
