# Tasks

## 阶段 1：创建共享弹幕库（1-2 天）

### Day 1.1：基础架构

- [x] **Task 1.1**: 创建目录结构
  - [x] 创建 `frontend/src/shared/danmaku/` 目录
  - [x] 创建 `frontend/tests/unit/shared/danmaku/` 测试目录

- [x] **Task 1.2**: 实现 `types.ts`（类型定义）
  - [x] 定义 DanmakuMessage 接口
  - [x] 定义 DanmakuUser 接口
  - [x] 定义 DanmakuPoolConfig 接口
  - [x] 定义 DanmakuTheme 类型
  - [x] 定义 DanmakuSize 类型
  - [x] 定义 DanmakuType 类型
  - [x] 定义 BatchOptions 接口
  - [x] 定义 UseDanmakuConfig 接口
  - [x] 编写 types.test.ts 单元测试

- [x] **Task 1.3**: 实现 `config.ts`（配置管理）
  - [x] 定义 THEME_COLORS 常量（所有 6 个主题颜色）
  - [x] 定义 DANMAKU_TYPE_WEIGHTS 常量
  - [x] 定义 SIZE_THRESHOLDS 常量
  - [x] 定义主题配置映射表
  - [x] 编写 config.test.ts 单元测试

- [x] **Task 1.4**: 实现 `utils.ts`（工具函数）
  - [x] 实现 `getSizeByTextLength(text: string): DanmakuSize`
  - [x] 实现 `getThemeColor(theme: DanmakuTheme, type: ColorType): string`
  - [x] 实现 `getRandomDanmakuType(): DanmakuType`
  - [x] 实现 `generateTimestamp(date?: Date): string`
  - [x] 实现 `getDanmakuColor(theme: DanmakuTheme): string`
  - [x] 编写 utils.test.ts 单元测试（覆盖率 > 90%）

### Day 1.2：核心功能

- [x] **Task 1.5**: 实现 `generator.ts`（弹幕生成器）
  - [x] 定义 GeneratorConfig 接口
  - [x] 实现 DanmakuGenerator 类
  - [x] 实现构造函数（接收 GeneratorConfig）
  - [x] 实现 `generateMessage(index: number): DanmakuMessage` 方法
  - [x] 实现 `generateBatch(options: BatchOptions): DanmakuMessage[]` 方法
  - [x] 编写 generator.test.ts 单元测试

- [x] **Task 1.6**: 实现 `hooks.ts`（React Hooks）
  - [x] 实现 `useDanmaku(config: UseDanmakuConfig)` Hook
  - [x] 实现 `useDanmakuPool(config: DanmakuPoolConfig)` Hook
  - [x] 编写 hooks.test.tsx 单元测试

- [x] **Task 1.7**: 实现 `index.ts`（统一导出）
  - [x] 导出所有类型
  - [x] 导出所有工具函数
  - [x] 导出 DanmakuGenerator 类
  - [x] 导出所有 Hooks

- [x] **Task 1.8**: 编写使用文档
  - [x] 创建 README.md
  - [x] 编写 API 文档
  - [x] 提供示例代码

## 阶段 2：迁移 lvjiang 项目（1 天）

- [x] **Task 2.1**: 迁移 SideDanmaku.tsx
  - [x] 更新导入语句使用共享库
  - [x] 使用 DanmakuGenerator 生成弹幕
  - [x] 移除本地工具函数调用
  - [x] 运行现有测试验证功能

- [x] **Task 2.2**: 迁移 HorizontalDanmaku.tsx
  - [x] 更新导入语句使用共享库
  - [x] 使用 DanmakuGenerator 生成弹幕
  - [x] 运行现有测试验证功能

- [x] **Task 2.3**: 清理本地工具函数
  - [x] 删除或注释 danmakuColors.ts
  - [x] 更新 data/index.ts 导出
  - [x] 运行性能基准测试

## 阶段 3：迁移 yuxiaoc 项目（1 天）

- [x] **Task 3.1**: 迁移 DanmakuTower.tsx
  - [x] 更新导入语句使用共享库
  - [x] 使用 DanmakuGenerator 生成弹幕
  - [x] 运行现有测试验证功能

- [x] **Task 3.2**: 迁移 HorizontalDanmaku.tsx
  - [x] 更新导入语句使用共享库
  - [x] 使用 DanmakuGenerator 生成弹幕
  - [x] 运行现有测试验证功能

- [x] **Task 3.3**: 删除冗余文件
  - [x] 删除 danmaku-processed.json
  - [x] 备份构建脚本（标记为废弃）
  - [x] 更新 package.json

## 阶段 4：迁移 tiantong 项目（2 天）

- [x] **Task 4.1**: 迁移 SidebarDanmu.tsx
  - [x] 更新导入语句使用共享库
  - [x] 使用 DanmakuGenerator 生成弹幕
  - [x] 移除本地用户映射逻辑
  - [x] 运行现有测试验证功能

- [x] **Task 4.2**: 简化飘屏数据
  - [x] 更新 HorizontalDanmaku.tsx 使用 TXT 文件
  - [x] 删除 danmaku-processed.json
  - [x] 删除 process-danmaku.js 构建脚本
  - [x] 更新 package.json
  - [x] 运行性能测试验证

## 阶段 5：测试和优化（1-2 天）

- [x] **Task 5.1**: 运行所有测试
  - [x] 运行单元测试并检查覆盖率
  - [x] 修复测试失败
  - [x] 确保覆盖率 > 90%

- [x] **Task 5.2**: 性能基准测试
  - [x] 首屏渲染测试（目标：< 100ms）
  - [x] 弹幕生成测试（目标：< 5ms/条）
  - [x] 内存占用测试（目标：减少 > 40%）
  - [x] 动画帧率测试（目标：≥ 60fps）

- [x] **Task 5.3**: 代码审查和文档更新
  - [x] 代码审查（规范、类型、注释）
  - [x] 更新项目文档
  - [x] 编写使用指南

## 阶段 6：更新 CI 配置（0.5 天）

- [x] **Task 6.1**: 更新 package.json 构建脚本
  - [x] 修改 `prebuild` 脚本，移除已废弃的构建命令
  - [x] 删除对 `process-danmaku.js` 的调用
  - [x] 删除对 `build-danmaku-yuxiaoc.js` 的调用
  - [x] 更新为：`"prebuild": "echo 'No prebuild required - using shared danmaku library'"`

- [x] **Task 6.2**: 更新 GitHub Actions CI 配置
  - [x] 更新 `master-ci.yml`，移除 prebuild 步骤
  - [x] 更新 `ci-non-master.yml`，移除 prebuild 步骤
  - [x] 更新 `deploy.yml`（如有 prebuild 步骤）
  - [x] 验证 CI 配置正确性

- [x] **Task 6.3**: 验证 CI 流程
  - [x] 本地验证 package.json 脚本
  - [x] 提交测试验证 CI 运行
  - [x] 确认 CI 无 prebuild 相关错误

# Task Dependencies

- Task 1.2 依赖于 Task 1.1（目录结构）
- Task 1.3 依赖于 Task 1.2（类型定义）
- Task 1.4 依赖于 Task 1.3（配置）
- Task 1.5 依赖于 Task 1.4（工具函数）
- Task 1.6 依赖于 Task 1.5（生成器）
- Task 1.7 依赖于 Task 1.5 和 Task 1.6
- Task 2.x 依赖于 Task 1.x（共享库完成）
- Task 3.x 依赖于 Task 1.x（共享库完成）
- Task 4.x 依赖于 Task 1.x（共享库完成）
- Task 5.x 依赖于 Task 2.x、3.x、4.x（所有迁移完成）
- Task 6.x 依赖于 Task 3.3 和 Task 4.2（删除构建脚本后更新 CI）
