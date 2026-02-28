# Checklist

## 阶段 1：共享弹幕库验证

### Task 1.2 - 类型定义
- [ ] DanmakuMessage 接口包含所有必需字段（id, text, color, size, userId, userName, userAvatar, timestamp, top, delay, duration）
- [ ] DanmakuUser 接口定义正确（id, name, avatar, level, badge）
- [ ] DanmakuPoolConfig 接口包含所有配置项
- [ ] 所有类型导出正确
- [ ] types.test.ts 测试通过率 100%

### Task 1.3 - 配置管理
- [ ] THEME_COLORS 包含所有 6 个主题的颜色（blood, mix, dongzhu, kaige, tiger, sweet）
- [ ] DANMAKU_TYPE_WEIGHTS 定义正确
- [ ] SIZE_THRESHOLDS 定义正确（3, 8）
- [ ] 主题配置映射表完整
- [ ] config.test.ts 测试通过率 100%

### Task 1.4 - 工具函数
- [ ] getSizeByTextLength 正确判断尺寸（<=3 为 large, <=8 为 medium, >8 为 small）
- [ ] getThemeColor 返回正确的主题颜色
- [ ] getRandomDanmakuType 正确随机返回类型
- [ ] generateTimestamp 返回正确格式的时间字符串
- [ ] getDanmakuColor 返回正确的颜色值
- [ ] utils.test.ts 测试覆盖率 > 90%

### Task 1.5 - 弹幕生成器
- [ ] DanmakuGenerator 构造函数正确接收配置
- [ ] generateMessage 方法生成包含用户信息的弹幕（侧边栏模式）
- [ ] generateMessage 方法生成只包含文本的弹幕（飘屏模式）
- [ ] generateBatch 方法批量生成指定数量的弹幕
- [ ] 弹幕的 color、size 字段正确计算
- [ ] generator.test.ts 测试通过率 100%

### Task 1.6 - React Hooks
- [ ] useDanmaku Hook 正确管理弹幕状态
- [ ] useDanmakuPool Hook 正确管理弹幕池
- [ ] Hooks 正确清理副作用
- [ ] hooks.test.tsx 测试通过率 100%

### Task 1.7 - 统一导出
- [ ] 所有类型从 index.ts 正确导出
- [ ] 所有工具函数从 index.ts 正确导出
- [ ] DanmakuGenerator 类从 index.ts 正确导出
- [ ] Hooks 从 index.ts 正确导出
- [ ] TypeScript 编译无错误

### Task 1.8 - 使用文档
- [ ] README.md 包含安装和使用说明
- [ ] API 文档完整清晰
- [ ] 示例代码可运行
- [ ] 示例代码展示侧边栏和飘屏两种使用场景

## 阶段 2：lvjiang 项目迁移验证

### Task 2.1 - SideDanmaku.tsx
- [ ] 导入语句使用共享库（@/shared/danmaku）
- [ ] 使用 DanmakuGenerator 生成初始弹幕
- [ ] 使用 generator.generateMessage 生成新弹幕
- [ ] 移除本地 getSizeByTextLength 调用
- [ ] 移除本地 getDanmakuColor 调用
- [ ] TypeScript 编译通过
- [ ] 现有测试全部通过
- [ ] 性能无退化（首屏 < 100ms）
- [ ] 视觉效果一致

### Task 2.2 - HorizontalDanmaku.tsx
- [ ] 导入语句使用共享库
- [ ] 使用 DanmakuGenerator 生成弹幕
- [ ] 飘屏弹幕不包含用户信息
- [ ] 现有测试全部通过
- [ ] 动画流畅（60fps）

### Task 2.3 - 清理本地工具函数
- [ ] danmakuColors.ts 已删除或注释
- [ ] data/index.ts 更新导出
- [ ] 无引用错误

## 阶段 3：yuxiaoc 项目迁移验证

### Task 3.1 - DanmakuTower.tsx
- [ ] 导入语句使用共享库
- [ ] 使用 DanmakuGenerator 生成弹幕
- [ ] 主题切换功能正常
- [ ] 现有测试全部通过

### Task 3.2 - HorizontalDanmaku.tsx
- [ ] 导入语句使用共享库
- [ ] 使用 DanmakuGenerator 生成弹幕
- [ ] 弹幕池组合正确（theme + common）
- [ ] 现有测试全部通过

### Task 3.3 - 删除冗余文件
- [ ] danmaku-processed.json 已删除
- [ ] build-danmaku-yuxiaoc.js 已标记为废弃
- [ ] package.json 更新（移除构建命令）
- [ ] 无构建错误

## 阶段 4：tiantong 项目迁移验证

### Task 4.1 - SidebarDanmu.tsx
- [ ] 导入语句使用共享库
- [ ] 使用 DanmakuGenerator 生成弹幕
- [ ] 移除本地 danmuUserMap 逻辑
- [ ] 用户信息显示正确
- [ ] 现有测试全部通过

### Task 4.2 - 简化飘屏数据
- [ ] HorizontalDanmaku.tsx 使用 TXT 文件（import ... from "./danmaku.txt?raw"）
- [ ] danmaku-processed.json 已删除
- [ ] process-danmaku.js 已删除
- [ ] package.json 更新（移除构建命令）
- [ ] 文件体积减少 88%（27KB → 2KB）
- [ ] 动画流畅（60fps）

## 阶段 5：全面测试验证

### Task 5.1 - 测试覆盖率
- [ ] 侧边栏弹幕测试覆盖率 > 90%
- [ ] 飘屏弹幕测试覆盖率 > 85%
- [ ] 共享库测试覆盖率 > 95%
- [ ] 所有测试通过
- [ ] 无 TypeScript 错误

### Task 5.2 - 性能基准
- [ ] 首屏渲染 < 100ms
- [ ] 弹幕生成 < 5ms/条
- [ ] 内存占用减少 > 40%
- [ ] 动画帧率 ≥ 60fps
- [ ] 文件体积减少 > 50%

### Task 5.3 - 代码质量
- [ ] TypeScript 编译通过
- [ ] 无 ESLint 错误
- [ ] 代码注释完整（中文）
- [ ] 文档清晰完整
- [ ] 示例代码可运行

## 阶段 6：CI 配置验证

### Task 6.1 - package.json 更新
- [ ] prebuild 脚本已移除 process-danmaku.js 调用
- [ ] prebuild 脚本已移除 build-danmaku-yuxiaoc.js 调用
- [ ] prebuild 脚本更新为提示信息或空操作
- [ ] npm run prebuild 执行无错误
- [ ] npm run build 执行无错误

### Task 6.2 - GitHub Actions 更新
- [ ] master-ci.yml 已移除 prebuild 步骤
- [ ] ci-non-master.yml 已移除 prebuild 步骤
- [ ] deploy.yml 已移除 prebuild 步骤（如存在）
- [ ] CI 配置文件语法正确
- [ ] CI 工作流文件通过 YAML 验证

### Task 6.3 - CI 流程验证
- [ ] 本地 npm run build:ci 测试通过
- [ ] 提交代码触发 CI 运行
- [ ] CI 无 prebuild 相关错误
- [ ] CI 完整流程执行成功
- [ ] CI 执行时间减少（移除 prebuild 步骤）

## 最终验收

### 功能验收
- [ ] 三个项目侧边栏弹幕功能正常
- [ ] 三个项目飘屏弹幕功能正常
- [ ] 主题切换功能正常
- [ ] 响应式布局正常
- [ ] 所有测试通过

### 交付物验收
- [ ] 共享弹幕库（shared/danmaku/）创建完成
- [ ] 三个项目迁移完成
- [ ] 冗余文件已删除
- [ ] 构建脚本已清理
- [ ] 使用文档完整
