# Git 提交规范指南

## 1. 概述

本文档定义了 VidTimelineX 前端项目的 Git 提交规范，包括 Commit Message 格式、提交类型、分支命名、PR/MR 规范等。所有代码提交都应遵循本规范，以保证项目历史的清晰和可维护性。

---

## 2. Commit Message 格式规范

### 2.1 基本格式

Commit Message 应该遵循 **Conventional Commits** 规范，格式如下：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**说明**：
- `type`：提交类型（必填）
- `scope`：影响范围（可选）
- `subject`：简短描述（必填）
- `body`：详细描述（可选）
- `footer`：页脚，用于关联 Issue 或 BREAKING CHANGE（可选）

### 2.2 提交类型（type）

| 类型 | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat(danmaku): 添加横向弹幕功能` |
| `fix` | 修复 bug | `fix(video): 修复视频播放卡顿问题` |
| `docs` | 文档更新 | `docs(README): 更新安装说明` |
| `style` | 代码格式（不影响代码运行） | `style(button): 格式化按钮组件代码` |
| `refactor` | 重构（既不是新功能也不是 bug 修复） | `refactor(structure): 重构组件目录结构` |
| `perf` | 性能优化 | `perf(danmaku): 优化弹幕渲染性能` |
| `test` | 添加或修改测试 | `test(e2e): 添加主题切换 E2E 测试` |
| `build` | 构建系统或外部依赖的变更 | `build(vite): 更新 Vite 配置` |
| `ci` | CI/CD 配置变更 | `ci(github): 更新 GitHub Actions 配置` |
| `chore` | 其他不修改源代码的变更 | `chore(deps): 更新依赖版本` |
| `revert` | 回滚之前的提交 | `revert: 回滚 "feat(danmaku): 添加新功能"` |

### 2.3 影响范围（scope）

scope 用于说明 commit 影响的范围，通常是模块名、组件名或文件名。

**常用 scope**：
```
# 功能模块
danmaku          # 弹幕相关
video            # 视频相关
lvjiang          # 驴酱模块
tiantong         # 甜筒模块
yuxiaoc          # 余小 C 模块

# 组件
button           # 按钮组件
dialog           # 对话框组件
video-card       # 视频卡片组件

# 系统
app              # 应用核心配置
routes           # 路由配置
styles           # 样式文件
utils            # 工具函数
hooks            # 自定义 Hook
config           # 配置文件
```

### 2.4 简短描述（subject）

**规则**：
- 使用中文描述
- 简洁明了，不超过 50 个字符
- 使用祈使句语气（"添加" 而不是 "添加了"）
- 不要以句号结尾

**✅ 正确示例**：
```
feat(danmaku): 添加横向弹幕功能
fix(video): 修复视频播放卡顿问题
docs(README): 更新安装说明
```

**❌ 错误示例**：
```
feat: 添加了一个新的横向弹幕功能，这个功能可以实现...  # ❌ 太长
fix: 修复了 bug  # ❌ 描述不清晰
feat(danmaku): 添加了横向弹幕功能。 # ❌ 以句号结尾
```

### 2.5 详细描述（body）

**规则**：
- 详细说明变更内容
- 解释为什么需要这个变更
- 说明变更的影响
- 可以包含代码示例

**示例**：
```
refactor(structure): 重构组件目录结构

- 将 video/ 和 video-view/ 移动到 business/ 目录
- 创建 layout/ 目录存放布局组件
- 更新所有导入路径

这样可以更清晰地组织组件，区分基础组件和业务组件。

迁移指南：
1. 运行 npm run migrate:components
2. 检查导入路径是否正确
3. 运行测试验证功能
```

### 2.6 页脚（footer）

**关联 Issue**：
```
fix(video): 修复视频加载失败问题

Closes #123
Fixes #456
```

**BREAKING CHANGE**：
```
feat(api): 更新 API 客户端接口

BREAKING CHANGE: API 客户端的 request 方法现在返回 Promise 而不是使用回调函数。

迁移指南：
// 旧代码
api.request('/users', (data) => {
  console.log(data);
});

// 新代码
api.request('/users').then((data) => {
  console.log(data);
});
```

---

## 3. 完整提交示例

### 3.1 新功能提交

```bash
git commit -m "feat(danmaku): 添加弹幕主题切换功能

- 添加 ThemeToggle 组件
- 实现主题切换逻辑
- 添加主题切换动画

Closes #789"
```

### 3.2 Bug 修复提交

```bash
git commit -m "fix(video): 修复视频播放卡顿问题

修复了在低性能设备上视频播放卡顿的问题。

原因：视频解码器未正确初始化
解决方案：添加解码器初始化检查

Fixes #456"
```

### 3.3 重构提交

```bash
git commit -m "refactor(structure): 重构组件目录结构

- 将 video/ 和 video-view/ 移动到 business/ 目录
- 创建 layout/ 目录存放布局组件
- 更新所有导入路径

这样可以更清晰地组织组件，区分基础组件和业务组件。

Related to #123"
```

### 3.4 文档提交

```bash
git commit -m "docs(README): 更新安装说明

- 添加 Node.js 版本要求
- 更新依赖安装步骤
- 添加常见问题解答"
```

### 3.5 性能优化提交

```bash
git commit -m "perf(danmaku): 优化弹幕渲染性能

- 使用虚拟滚动减少 DOM 节点数量
- 实现弹幕池复用机制
- 优化弹幕更新算法

性能提升：
- 渲染时间减少 60%
- 内存使用减少 40%
- FPS 从 30 提升到 60

Fixes #321"
```

---

## 4. 分支命名规范

### 4.1 分支类型

| 分支类型 | 命名格式 | 说明 |
|---------|---------|------|
| 主分支 | `main` | 主分支，用于生产环境 |
| 开发分支 | `develop` | 开发分支，用于日常开发 |
| 功能分支 | `feature/<name>` | 新功能开发 |
| 修复分支 | `fix/<name>` | Bug 修复 |
| 发布分支 | `release/<version>` | 发布新版本 |
| 热修复分支 | `hotfix/<name>` | 生产环境紧急修复 |

### 4.2 分支命名示例

**✅ 正确示例**：
```
feature/danmaku-theme          # 弹幕主题功能
fix/video-playback-issue       # 视频播放问题修复
release/v1.2.0                 # v1.2.0 版本发布
hotfix/login-bug               # 登录 bug 紧急修复
refactor/component-structure   # 组件结构重构
```

**❌ 错误示例**：
```
feature-1                      # ❌ 描述不清晰
fix_bug                        # ❌ 缺少斜杠
new-feature                    # ❌ 缺少类型前缀
test                           # ❌ 描述不清晰
```

### 4.3 分支管理策略

**Git Flow 工作流**：
```
main (生产环境)
  ↑
  └── develop (开发分支)
        ↑
        ├── feature/danmaku-theme
        ├── feature/video-player
        └── fix/login-bug
```

**分支合并规则**：
1. 功能分支从 `develop` 分支创建
2. 功能开发完成后合并回 `develop` 分支
3. 发布时从 `develop` 创建 `release` 分支
4. 发布完成后合并到 `main` 和 `develop` 分支
5. 紧急修复从 `main` 创建 `hotfix` 分支

---

## 5. Pull Request 规范

### 5.1 PR 标题格式

PR 标题应遵循 Commit Message 格式：

```
<type>(<scope>): <subject>
```

**示例**：
```
feat(danmaku): 添加弹幕主题切换功能
fix(video): 修复视频播放卡顿问题
refactor(structure): 重构组件目录结构
```

### 5.2 PR 描述模板

```markdown
## 📋 变更说明

<!-- 简要描述此 PR 的变更内容 -->

## 🔗 关联 Issue

<!-- 关联的 Issue 编号 -->
Closes #123
Fixes #456

## 📝 测试步骤

<!-- 如何测试此变更 -->

1. 启动开发服务器：`npm run dev`
2. 访问 /tiantong 页面
3. 点击主题切换按钮
4. 验证弹幕颜色是否正确切换

## ✅ 检查清单

<!-- 确保完成以下检查 -->

- [ ] 代码通过 ESLint 检查
- [ ] 代码通过 Prettier 格式化
- [ ] TypeScript 类型检查通过
- [ ] 所有测试通过
- [ ] 添加了必要的测试用例
- [ ] 更新了相关文档

## 📸 截图（如适用）

<!-- 如果是 UI 变更，添加截图 -->

## 📋 其他说明

<!-- 其他需要说明的内容 -->
```

### 5.3 PR 审查流程

1. **创建 PR**：填写完整的 PR 描述
2. **自动化检查**：等待 CI/CD 检查完成
3. **代码审查**：至少需要 1 人审查通过
4. **修改反馈**：根据审查意见修改代码
5. **合并 PR**：审查通过后合并到目标分支

---

## 6. 代码审查检查清单

### 6.1 提交规范检查
- [ ] Commit Message 是否遵循 Conventional Commits 格式？
- [ ] 提交类型是否正确？
- [ ] 描述是否清晰明了？
- [ ] 是否关联了 Issue（如适用）？

### 6.2 代码质量检查
- [ ] 代码是否通过 ESLint 检查？
- [ ] 代码是否通过 Prettier 格式化？
- [ ] TypeScript 类型检查是否通过？
- [ ] 是否避免了 `any` 类型？

### 6.3 测试检查
- [ ] 是否添加了必要的测试用例？
- [ ] 所有测试是否通过？
- [ ] 测试覆盖率是否满足要求？

### 6.4 文档检查
- [ ] 是否更新了相关文档？
- [ ] 代码注释是否完整？
- [ ] JSDoc 注释是否规范？

### 6.5 功能检查
- [ ] 功能是否按预期工作？
- [ ] 是否有性能问题？
- [ ] 是否有安全问题？
- [ ] 是否有兼容性问题？

---

## 7. 常用 Git 命令

### 7.1 分支操作

```bash
# 创建新分支
git checkout -b feature/danmaku-theme
git switch -c feature/danmaku-theme

# 切换分支
git checkout develop
git switch develop

# 查看分支
git branch
git branch -a  # 查看所有分支（包括远程）

# 删除分支
git branch -d feature/danmaku-theme
git branch -D feature/danmaku-theme  # 强制删除

# 推送分支到远程
git push origin feature/danmaku-theme
```

### 7.2 提交操作

```bash
# 添加文件
git add <file>
git add .  # 添加所有文件

# 提交
git commit -m "feat(danmaku): 添加弹幕主题功能"

# 修改最后一次提交
git commit --amend -m "feat(danmaku): 添加弹幕主题功能"

# 查看提交历史
git log
git log --oneline  # 简洁显示
git log --graph  # 图形化显示
```

### 7.3 合并操作

```bash
# 合并分支
git checkout develop
git merge feature/danmaku-theme

# 变基
git checkout feature/danmaku-theme
git rebase develop

# 解决冲突后继续变基
git rebase --continue

# 取消变基
git rebase --abort
```

### 7.4 标签操作

```bash
# 创建标签
git tag v1.0.0
git tag -a v1.0.0 -m "发布 v1.0.0"

# 推送标签
git push origin v1.0.0
git push origin --tags  # 推送所有标签

# 查看标签
git tag
git tag -l "v1.*"  # 查看 v1.x 版本
```

---

## 8. 自动化配置

### 8.1 Commitlint 配置

**安装**：
```bash
npm install -D @commitlint/config-conventional @commitlint/cli
```

**配置文件**（`commitlint.config.js`）：
```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert',
      ],
    ],
    'subject-full-stop': [2, 'never', '.'],
    'subject-case': [0],
  ],
};
```

### 8.2 Husky 配置

**安装**：
```bash
npm install -D husky
npx husky install
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit $1'
```

### 8.3 package.json 配置

```json
{
  "scripts": {
    "commit": "git-cz",
    "prepare": "husky install"
  },
  "devDependencies": {
    "commitizen": "^4.3.0",
    "cz-conventional-changelog": "^3.3.0",
    "@commitlint/cli": "^17.0.0",
    "@commitlint/config-conventional": "^17.0.0",
    "husky": "^8.0.0"
  },
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  }
}
```

---

## 9. 常见问题 FAQ

### Q1: 如何修改之前的提交信息？
**A**: 
```bash
# 修改最后一次提交
git commit --amend -m "新的提交信息"

# 修改之前的提交（交互式变基）
git rebase -i HEAD~3  # 修改最近 3 次提交
```

### Q2: 如何合并多个提交？
**A**:
```bash
# 使用交互式变基
git rebase -i HEAD~3

# 在编辑器中将 pick 改为 squash 或 fixup
# squash: 合并提交，保留所有提交信息
# fixup: 合并提交，丢弃提交信息
```

### Q3: 如何回滚已推送的提交？
**A**:
```bash
# 创建一个新的回滚提交
git revert <commit-hash>
git push origin main

# 或者强制回滚（不推荐，会修改历史）
git reset --hard <commit-hash>
git push origin main --force
```

### Q4: 如何处理提交冲突？
**A**:
```bash
# 1. 停止变基
git rebase --abort

# 2. 拉取最新代码
git pull origin develop

# 3. 重新变基
git rebase develop

# 4. 解决冲突
# 编辑冲突文件，解决冲突标记

# 5. 继续变基
git rebase --continue
```

### Q5: 如何查看某人的提交历史？
**A**:
```bash
# 查看某人的所有提交
git log --author="用户名"

# 查看某人在某段时间的提交
git log --author="用户名" --since="2024-01-01" --until="2024-12-31"
```

---

## 10. 更新记录

| 版本 | 日期 | 更新内容 | 负责人 |
|------|------|----------|--------|
| v1.0 | 2026-03-01 | 初始版本，定义 Git 提交规范 | - |

---

**文档版本**: v1.0  
**最后更新**: 2026-03-01  
**维护人员**: VidTimelineX 开发团队
