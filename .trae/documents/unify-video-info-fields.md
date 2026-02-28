# 统一视频信息展示字段计划

## 任务概述

统一所有视频卡片和视频弹窗的信息展示字段，确保展示：**标题、作者、日期、时长、视频ID和标签**，**移除浏览量展示**。

## 当前组件使用状态分析

### 统一组件使用情况（来自代码分析）

| 页面                        | VideoCard来源                  | VideoModal来源                  |
| ------------------------- | ---------------------------- | ----------------------------- |
| tiantong/TiantongPage.tsx | `components/video/VideoCard` | `components/video/VideoModal` |
| yuxiaoc/YuxiaocPage.tsx   | `components/video/VideoCard` | `components/video/VideoModal` |
| lvjiang/LvjiangPage.tsx   | `components/video/VideoCard` | `components/video/VideoModal` |

**关键发现**：

* ✅ 所有三个模块的页面**已经使用统一的 VideoCard 和 VideoModal 组件**

* ⚠️ 模块特定的 VideoModal 组件（tiantong、yuxiaoc、lvjiang）**已废弃**，不再被页面引用

* ⚠️ tiantong 模块的 `VideoCard.tsx` 仅被 `TimelineItem.tsx` 引用，但 `TimelineItem` 未被任何页面使用

### 当前展示字段对比

| 组件           | 标题 | 作者 | 日期 | 时长 | 视频ID | 标签 | 浏览量    |
| ------------ | -- | -- | -- | -- | ---- | -- | ------ |
| 统一VideoCard  | ✅  | ✅  | ✅  | ❌  | ❌    | ❌  | ✅(需移除) |
| 统一VideoModal | ✅  | ✅  | ✅  | ✅  | ✅    | ✅  | ❌      |

### 视频数据结构

所有模块的视频数据都包含 `bv` 字段用于存储BV号：

* tiantong: `bv: string` (必填)

* yuxiaoc: `bv: string` (必填)

* lvjiang: `bv: string` (必填)

## TDD 实施计划

### 阶段一：删除废弃文件（先清理）

**删除废弃组件文件**：

* `d:\workspace\VidTimelineX\frontend\src\features\tiantong\components\VideoCard.tsx`

* `d:\workspace\VidTimelineX\frontend\src\features\tiantong\components\VideoModal.tsx`

* `d:\workspace\VidTimelineX\frontend\src\features\tiantong\components\TimelineItem.tsx`

* `d:\workspace\VidTimelineX\frontend\src\features\yuxiaoc\components\VideoModal.tsx`

* `d:\workspace\VidTimelineX\frontend\src\features\lvjiang\components\VideoModal.tsx`

**删除废弃测试文件**：

* `d:\workspace\VidTimelineX\frontend\tests\unit\components\features\tiantong\VideoCard.test.tsx`

* `d:\workspace\VidTimelineX\frontend\tests\unit\components\features\tiantong\VideoModal.test.tsx`

* `d:\workspace\VidTimelineX\frontend\tests\unit\components\features\yuxiaoc\VideoModal.test.tsx`

* `d:\workspace\VidTimelineX\frontend\tests\unit\components\features\lvjiang\VideoModal.test.tsx`

### 阶段二：VideoCard 组件 TDD 开发

#### Step 1: Red - 编写失败测试

为 `VideoCard` 组件编写测试用例：

* 测试展示时长(duration)字段

* 测试展示BV号(video.bv)字段

* 测试展示标签(tags)字段

* 测试不展示浏览量(views)字段

#### Step 2: Green - 实现代码

修改 `components/video/VideoCard.tsx`：

* 添加 Clock 图标导入

* 移除 Eye 图标导入

* 添加时长展示

* 添加BV号展示（使用 `video.bv`）

* 添加标签展示

* 移除浏览量展示

#### Step 3: Refactor - 重构优化

* 优化代码结构

* 确保样式一致性

### 阶段三：VideoModal 组件 TDD 开发

#### Step 1: Red - 编写失败测试

为 `VideoModal` 组件编写测试用例：

* 测试视频ID显示为BV号（使用 `video.bv` 字段）

#### Step 2: Green - 实现代码

修改 `components/video/VideoModal.tsx`：

* 视频ID固定使用 `video.bv` 字段

#### Step 3: Refactor - 重构优化

* 移除不再需要的URL解析逻辑

### 阶段四：验证

* 运行所有测试确保通过

* 运行 lint 检查

* 手动验证各模块页面显示正确

## 统一展示字段规范

### 视频卡片 (VideoCard)

展示字段顺序：

1. **标题** - 主要展示，加粗显示
2. **作者** - 带用户图标 (User)
3. **日期** - 带日历图标 (Calendar)
4. **时长** - 带时钟图标 (Clock)
5. **视频ID** - 显示BV号（直接从 `video.bv` 读取）
6. **标签** - 以标签形式展示

### 视频弹窗 (VideoModal)

展示字段顺序：

1. **标题** - 弹窗标题
2. **作者** - 👤 图标
3. **日期** - 📅 图标
4. **时长** - ⏱️ 图标
5. **视频ID** - 🎬 图标，显示BV号（直接从 `video.bv` 读取）
6. **标签** - 标签样式展示

## 预期结果

* 所有视频卡片展示统一的字段（标题、作者、日期、时长、BV号、标签）

* 不再展示浏览量

* 视频ID固定显示为BV号

* 删除无用的废弃组件文件

* 保持各模块的个性化主题样式

* 所有测试通过

