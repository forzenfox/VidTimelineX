# 弹幕数据共享库 Spec

## Why

基于《弹幕数据加载方案综合分析》文档的结论，解决以下问题：
1. ❌ tiantong 飘屏弹幕预处理方案浪费 92% 存储空间
2. ❌ yuxiaoc 生成文件未使用，存在冗余构建步骤
3. ❌ 三个项目方案不统一，维护成本高

通过创建共享弹幕库，实现代码复用、统一方案、消除冗余构建步骤。

## What Changes

### 新增内容
- ✅ 创建 `frontend/src/shared/danmaku/` 共享弹幕库
- ✅ 统一类型定义（types.ts）
- ✅ 统一配置管理（config.ts）
- ✅ 统一工具函数（utils.ts）
- ✅ 弹幕生成器（generator.ts）
- ✅ React Hooks（hooks.ts）
- ✅ 统一导出（index.ts）
- ✅ 完整的单元测试和文档

### 影响范围
- **Affected specs**: 弹幕数据加载方案
- **Affected code**: 
  - `frontend/src/shared/danmaku/` (新增)
  - `frontend/src/features/yuxiaoc/components/DanmakuTower.tsx` (后续迁移)
  - `frontend/src/features/yuxiaoc/components/HorizontalDanmaku.tsx` (后续迁移)
  - `frontend/src/features/lvjiang/components/SideDanmaku.tsx` (后续迁移)
  - `frontend/src/features/lvjiang/components/HorizontalDanmaku.tsx` (后续迁移)
  - `frontend/src/features/tiantong/components/SidebarDanmu.tsx` (后续迁移)
  - `frontend/src/features/tiantong/components/HorizontalDanmaku.tsx` (后续迁移)

## 预期收益

| 指标 | 优化前 | 优化后 | 提升 |
|------|--------|--------|------|
| **文件体积** | 37KB | 15KB | **-59%** |
| **构建时间** | 2.5s | 0s | **-100%** |
| **CI 执行时间** | ~60s | ~57.5s | **-2.5s** |
| **开发效率** | 低 | 高 | **+60%** |
| **代码复用率** | 0% | 60% | **+60%** |

## ADDED Requirements

### Requirement: 统一类型定义
系统 SHALL 提供完整的 TypeScript 类型定义，包括：
- DanmakuMessage：弹幕消息接口
- DanmakuUser：用户信息接口
- DanmakuPoolConfig：弹幕池配置接口
- DanmakuTheme：主题类型（blood | mix | dongzhu | kaige | tiger | sweet）
- DanmakuSize：尺寸类型（small | medium | large）
- DanmakuType：弹幕类型（sidebar | horizontal）

#### Scenario: 类型安全使用
- **WHEN** 开发者导入类型
- **THEN** 可以获得完整的类型提示和检查

### Requirement: 配置管理
系统 SHALL 提供统一的配置管理模块，包括：
- THEME_COLORS：所有主题的颜色配置
- DANMAKU_TYPE_WEIGHTS：弹幕类型权重
- SIZE_THRESHOLDS：尺寸判断阈值
- 主题配置映射表

#### Scenario: 获取主题颜色
- **WHEN** 调用 `getThemeColor('dongzhu', 'primary')`
- **THEN** 返回对应主题的主色调颜色值

### Requirement: 工具函数
系统 SHALL 提供以下工具函数：
- `getSizeByTextLength(text: string): DanmakuSize` - 根据文本长度判断尺寸
- `getThemeColor(theme: DanmakuTheme, type: ColorType): string` - 获取主题颜色
- `getRandomDanmakuType(): DanmakuType` - 随机获取弹幕类型
- `generateTimestamp(date?: Date): string` - 生成时间戳字符串
- `getDanmakuColor(theme: DanmakuTheme): string` - 获取弹幕颜色

#### Scenario: 判断弹幕尺寸
- **WHEN** 调用 `getSizeByTextLength("哈哈哈")`
- **THEN** 返回 "large"（文本长度 <= 3）

#### Scenario: 生成时间戳
- **WHEN** 调用 `generateTimestamp()`
- **THEN** 返回格式化的时间字符串（如 "14:30:25"）

### Requirement: 弹幕生成器
系统 SHALL 提供 DanmakuGenerator 类，包括：
- 构造函数：接收 DanmakuPoolConfig 配置
- `generateMessage(index: number): DanmakuMessage` - 生成单条弹幕
- `generateBatch(options: BatchOptions): DanmakuMessage[]` - 批量生成弹幕
- `generateRealtime(): DanmakuMessage` - 实时生成弹幕（可选）

#### Scenario: 生成侧边栏弹幕
- **WHEN** 调用 `generator.generateBatch({ count: 12, includeUser: true })`
- **THEN** 返回包含用户信息的 12 条弹幕

#### Scenario: 生成飘屏弹幕
- **WHEN** 调用 `generator.generateBatch({ count: 20, includeUser: false })`
- **THEN** 返回只包含文本的 20 条弹幕

### Requirement: React Hooks
系统 SHALL 提供以下 React Hooks（可选）：
- `useDanmaku(config: UseDanmakuConfig)` - 弹幕管理 Hook
- `useDanmakuPool(config: DanmakuPoolConfig)` - 弹幕池管理 Hook

#### Scenario: 使用 Hook 管理弹幕
- **WHEN** 组件调用 `useDanmaku({ generator, initialCount: 12 })`
- **THEN** 返回弹幕列表和更新函数

## MODIFIED Requirements

### Requirement: 项目迁移
**原因**: 三个项目需要统一使用共享库

**迁移策略**:
1. lvjiang 项目：迁移 SideDanmaku.tsx 和 HorizontalDanmaku.tsx
2. yuxiaoc 项目：迁移组件并删除 danmaku-processed.json 冗余文件
3. tiantong 项目：迁移组件并简化飘屏数据为 TXT 文件

### Requirement: CI/CD 配置
**原因**: 移除废弃的构建步骤，优化 CI 流程

**修改内容**:
1. package.json: 更新 prebuild 脚本，移除废弃的构建命令
2. master-ci.yml: 移除 prebuild 步骤
3. ci-non-master.yml: 移除 prebuild 步骤
4. deploy.yml: 移除 prebuild 步骤（如存在）

**预期效果**:
- CI 执行时间减少 ~2.5 秒（移除 prebuild 步骤）
- 消除构建脚本维护成本
- 简化 CI 流程

## REMOVED Requirements

### Requirement: yuxiaoc 构建脚本
**原因**: 生成的 danmaku-processed.json 文件未被使用

**迁移方案**: 
- 删除 `scripts/build-danmaku-yuxiaoc.js`
- 删除 `src/features/yuxiaoc/data/danmaku-processed.json`
- 更新 package.json 移除相关构建命令

### Requirement: tiantong 预处理脚本
**原因**: 飘屏弹幕只需要文本数据，不需要预处理

**迁移方案**:
- 删除 `scripts/process-danmaku.js`
- 删除 `src/features/tiantong/data/danmaku-processed.json`
- HorizontalDanmaku.tsx 直接读取 danmaku.txt 文件

### Requirement: CI 构建步骤
**原因**: 构建脚本已删除，CI 配置需要同步更新

**迁移方案**:
- 更新 package.json 的 prebuild 脚本
- 更新所有 GitHub Actions 工作流文件
- 移除 prebuild 步骤
