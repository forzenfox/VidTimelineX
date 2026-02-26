# 列表展示UI排版优化计划

## 项目概述

根据 `时间轴展示优化产品需求文档.md` 第 87-93 行的需求，列表模式应该显示更多视频信息（标题、UP主、时长、日期），并缩小视频封面图片大小以在单页展示 15-25 个视频。当前列表模式的封面图使用了 16:9 比例的 `aspect-video`，导致每行占用空间过大，需要优化。

***

## [x] 任务1: 分析当前列表展示的问题

* **Priority**: P0

* **Depends On**: None

* **Description**:

  * 分析 VideoList 组件当前使用的 VideoCard 配置

  * 确认封面图比例和尺寸问题

  * 识别与需求文档的差距

* **Success Criteria**:

  * 完成问题分析报告

* **Test Requirements**:

  * `human-judgement` TR-1.1: 确认当前封面使用 aspect-video (16:9)

  * `human-judgement` TR-1.2: 确认单页展示数量少于需求（应 15-25 个）

***

## [x] 任务2: 创建列表模式专用的小尺寸卡片

* **Priority**: P0

* **Depends On**: 任务1

* **Description**:

  * 在 VideoCard 组件中添加 `compact` 尺寸选项

  * 封面比例从 16:9 (aspect-video) 改为固定宽度 96px，高度 128px

  * 保持信息展示完整（标题、UP主、时长、日期）

* **Success Criteria**:

  * 新增 `compact` 尺寸

  * 封面比例调整后视觉协调

* **Test Requirements**:

  * `programmatic` TR-2.1: VideoCard 支持 size="compact"

  * `human-judgement` TR-2.2: 封面比例缩小后仍清晰可见

***

## [x] 任务3: 更新 VideoList 组件使用紧凑布局

* **Priority**: P0

* **Depends On**: 任务2

* **Description**:

  * 修改 VideoList 组件，使用 `size="compact"`

  * 调整卡片间距（gap）以实现更紧凑的布局

  * 确保信息完整展示

* **Success Criteria**:

  * VideoList 使用紧凑尺寸

  * 单页可展示 15-25 个视频

* **Test Requirements**:

  * `programmatic` TR-3.1: VideoList 设置 size="compact"

  * `human-judgement` TR-3.2: 页面可展示更多视频

***

## [x] 任务4: 主题兼容性验证

* **Priority**: P0

* **Depends On**: 任务3

* **Description**:

  * 验证优化后的列表模式在所有主题下的显示效果

  * tiantong 页面：tiger、sweet 主题

  * lvjiang 页面：dongzhu、kaige 主题

  * yuxiaoc 页面：blood、mix 主题

* **Success Criteria**:

  * 所有主题下显示正常

* **Test Requirements**:

  * `human-judgement` TR-4.1: tiger 主题下正常

  * `human-judgement` TR-4.2: sweet 主题下正常

  * `human-judgement` TR-4.3: dongzhu 主题下正常

  * `human-judgement` TR-4.4: kaige 主题下正常

***

## [x] 任务5: 更新单元测试

* **Priority**: P1

* **Depends On**: 任务4

* **Description**:

  * 更新 VideoList 相关测试

  * 添加 compact 尺寸的测试用例

* **Success Criteria**:

  * 所有测试通过

* **Test Requirements**:

  * `programmatic` TR-5.1: npm run test:unit 通过

***

## [x] 任务6: 代码格式化和静态检查

* **Priority**: P1

* **Depends On**: 任务5

* **Description**:

  * 运行 Prettier 格式化代码

  * 运行 ESLint 静态检查

* **Success Criteria**:

  * 代码格式化完成

  * 无 lint 错误

* **Test Requirements**:

  * `programmatic` TR-6.1: npm run lint 通过

  * `programmatic` TR-6.2: prettier --check 通过

***

## 设计规范

### 列表模式卡片规格

| 属性   | 当前值                 | 优化后值                | 说明      |
| ---- | ------------------- | ------------------- | ------- |
| 尺寸选项 | small/medium/large  | 新增 compact          | 紧凑型     |
| 封面比例 | aspect-video (16:9) | w-24 h-32 (固定尺寸) | 3:4 纵向  |
| 行高   | ~180px             | ~140px             | 减少约 22% |
| 单页展示 | 8-12 个              | 15-25 个             | 提升 2 倍  |

### 紧凑卡片信息展示

- 封面图：固定 96x128px (w-24 h-32)
- 标题：最多 2 行，超出省略
- UP 主：显示
- 时长：显示
- 日期：显示

---

## 验收标准

1. ✅ 列表模式使用紧凑型卡片
2. ✅ 单页可展示 15-25 个视频
3. ✅ 视频信息完整展示（标题、UP主、时长、日期）
4. ✅ 所有主题下显示正常
5. ✅ 所有单元测试通过
6. ✅ 代码格式化和 lint 检查通过
