# 视频卡片优化计划

## 任务概述
1. 移除视频卡片中的BV号展示
2. 对每个页面的视频卡片UI进行优化设计，实现响应式自适应处理
3. 移除视频卡片的内边框距离

## 当前状态分析

### VideoCard组件当前展示字段
- 标题 ✅
- 作者 ✅
- 日期 ✅
- 时长 ✅
- **BV号** ❌ (需移除)
- 标签 ✅

### 页面布局分析

| 页面 | 组件 | 布局方式 | 当前响应式处理 |
|------|------|----------|----------------|
| tiantong | VideoTimeline | 时光轴布局（左右交替） | 固定宽度 w-5/12，小屏幕可能溢出 |
| yuxiaoc | CanteenHall | 网格布局 | grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ✅ |
| lvjiang | VideoTimeline | 时光轴布局（左右交替） | 固定宽度 w-5/12，小屏幕可能溢出 |

### 当前内边距分析
VideoCard组件当前内边距：
- 内容区域：`p-4 sm:p-4.5`（16px / 18px）
- 标签区域：`gap-1.5 mt-2`

### 响应式断点设计
- **移动端** (< 640px): 单列布局，时光轴改为垂直列表
- **平板端** (640px - 1024px): 双列布局
- **桌面端** (> 1024px): 保持现有布局

## TDD 实施计划

### 阶段一：移除BV号展示

#### Step 1: Red - 编写失败测试
修改 `VideoCard.test.tsx`：
- 移除BV号展示测试（TC-003）
- 添加"不应展示BV号"测试

#### Step 2: Green - 实现代码
修改 `components/video/VideoCard.tsx`：
- 移除 Video 图标导入
- 移除 BV号展示代码块

#### Step 3: Refactor - 重构优化
- 更新组件注释

### 阶段二：移除内边框距离

#### Step 1: Red - 编写失败测试
修改 `VideoCard.test.tsx`：
- 添加内边距测试用例

#### Step 2: Green - 实现代码
修改 `components/video/VideoCard.tsx`：
- 移除内容区域的内边距 `p-4 sm:p-4.5`
- 调整标签区域的间距

### 阶段三：响应式UI优化

#### 3.1 VideoCard组件优化
修改 `components/video/VideoCard.tsx`：
- 优化卡片尺寸系统，增加更细粒度的响应式尺寸
- 添加 `responsive` 属性支持自适应宽度

#### 3.2 tiantong VideoTimeline优化
修改 `features/tiantong/components/VideoTimeline.tsx`：
- **移动端**：隐藏时光轴中心线，改为垂直列表布局
- **平板/桌面端**：保持时光轴左右交替布局
- 添加响应式断点处理

#### 3.3 yuxiaoc CanteenHall优化
修改 `features/yuxiaoc/components/CanteenHall.tsx`：
- 当前已有响应式网格，检查是否需要调整
- 优化卡片间距和内边距

#### 3.4 lvjiang VideoTimeline优化
修改 `features/lvjiang/components/VideoTimeline.tsx`：
- **移动端**：隐藏时光轴中心线，改为垂直列表布局
- **平板/桌面端**：保持时光轴左右交替布局
- 添加响应式断点处理

### 阶段四：测试更新

更新测试文件：
- `tests/unit/components/video/VideoCard.test.tsx`
- `tests/unit/components/features/tiantong/VideoTimeline.test.tsx`
- `tests/unit/components/features/yuxiaoc/CanteenHall.test.tsx`
- `tests/unit/components/features/lvjiang/VideoTimeline.test.tsx`

### 阶段五：验证

- 运行所有测试确保通过
- 运行 lint 检查
- 手动验证各分辨率下的显示效果

## 详细修改清单

### 1. VideoCard.tsx 修改
```diff
- import { Play, Calendar, User, Clock, Video } from "lucide-react";
+ import { Play, Calendar, User, Clock } from "lucide-react";

- {video.bv && (
-   <div className="flex items-center gap-1">
-     <Video size={12} className="flex-shrink-0" aria-hidden="true" />
-     <span>{video.bv}</span>
-   </div>
- )}

- <div className={`p-4 sm:p-4.5 ${layoutStyles.content}`}>
+ <div className={`${layoutStyles.content}`}>
```

### 2. VideoTimeline.tsx 响应式优化（tiantong & lvjiang）
- 添加移动端检测逻辑
- 移动端使用单列垂直列表
- 平板/桌面端保持时光轴布局

### 3. 响应式断点CSS
```css
/* 移动端 < 640px */
.sm:hidden /* 隐藏时光轴 */
.w-full /* 全宽卡片 */

/* 平板端 640px - 1024px */
.sm:block /* 显示时光轴 */
.sm:w-5/12 /* 时光轴卡片宽度 */

/* 桌面端 > 1024px */
.lg:block /* 保持布局 */
```

## 预期结果
- 视频卡片不再展示BV号
- 视频卡片移除内边框距离
- 所有页面在不同分辨率下正常显示
- 移动端体验优化（时光轴改为垂直列表）
- 所有测试通过
