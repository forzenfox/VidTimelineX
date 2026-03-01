# 移动端自适应UI适配规格文档

## 变更ID
adapt-mobile-responsive-ui

## Why
当前项目中的移动端不支持提示组件 (`MobileNotSupported.tsx`) 阻止了用户在移动设备上访问网站，这不利于本地调试和移动端的用户体验。yuxiaoc页面已经实现了优秀的移动端UI适配方案，包括响应式导航栏、移动端优化的视频展示、侧边栏弹幕的抽屉式设计等。本规格旨在将yuxiaoc页面的移动端适配方案推广到其他页面（lvjiang、tiantong），确保整个项目的移动端体验一致性。

## What Changes
- **移除** `MobileNotSupported.tsx` 的提示功能，允许移动端访问
- **优化** lvjiang页面的移动端UI，参考yuxiaoc实现
- **优化** tiantong页面的移动端UI，参考yuxiaoc实现
- **统一** 视频卡片在移动端的展示样式
- **统一** 弹幕侧边栏在移动端的抽屉式设计
- **优化** 导航栏在移动端的响应式表现
- **确保** 所有页面风格一致性

## Impact
- 受影响的页面: lvjiang, tiantong
- 受影响的组件: Header, VideoCard, SideDanmaku/DanmakuTower, IconToolbar
- 受影响的样式: 各页面的CSS样式文件

## ADDED Requirements

### Requirement: 移除移动端不支持提示
**Reason**: 方便本地调试和移动端访问

#### Scenario: 移动端访问
- **WHEN** 用户使用移动设备访问网站
- **THEN** 不再显示"移动端暂不支持"提示页面
- **AND** 正常显示网站内容

### Requirement: 视频卡片移动端适配
**Description**: 视频卡片在移动端采用优化的布局

#### Scenario: 移动端视频列表
- **WHEN** 用户在移动端查看视频列表
- **THEN** 视频卡片使用垂直布局（封面在上，信息在下）
- **AND** 封面使用16:9比例
- **AND** 标题限制2行显示
- **AND** 元信息（作者、日期、播放量）简化显示

#### Scenario: 移动端网格视图
- **WHEN** 用户在移动端切换到网格视图
- **THEN** 使用2列网格布局
- **AND** 卡片间距适当缩小
- **AND** 保持触摸友好的点击区域（最小44x44px）

### Requirement: 弹幕侧边栏移动端适配
**Description**: 参考yuxiaoc的DanmakuTower实现移动端抽屉式设计

#### Scenario: 移动端弹幕显示
- **WHEN** 用户在移动端访问页面
- **THEN** 弹幕侧边栏默认隐藏
- **AND** 显示浮动按钮（右下角）用于打开弹幕抽屉
- **AND** 点击浮动按钮从底部弹出弹幕抽屉（占屏幕60%高度）
- **AND** 抽屉支持手势下滑关闭
- **AND** 点击遮罩层可关闭抽屉

#### Scenario: 桌面端弹幕显示
- **WHEN** 用户在桌面端访问页面
- **THEN** 弹幕侧边栏固定在右侧（宽度320px）
- **AND** 主内容区自动留出右侧空间

### Requirement: 导航栏移动端适配
**Description**: 参考yuxiaoc的Header实现响应式导航栏

#### Scenario: 移动端导航栏
- **WHEN** 用户在移动端查看导航栏
- **THEN** Logo和主题切换按钮始终可见
- **AND** 导航链接折叠为快捷按钮（仅显示图标）
- **AND** 次级元素（如外部链接）在移动端隐藏
- **AND** 导航栏支持滚动时背景模糊效果

### Requirement: 工具栏移动端适配
**Description**: 使用IconToolbar替代VideoViewToolbar

#### Scenario: 移动端工具栏
- **WHEN** 用户在移动端查看视频区域
- **THEN** 显示IconToolbar（纯图标模式）
- **AND** 包含视图切换、搜索、筛选、排序功能
- **AND** 搜索状态在工具栏上方显示

## MODIFIED Requirements

### Requirement: lvjiang页面移动端适配
**Current**: 使用SideDanmaku组件，但移动端样式不够完善
**Modified**: 
- 参考yuxiaoc的DanmakuTower实现移动端抽屉式弹幕
- 优化Header组件的移动端响应式表现
- 确保IconToolbar在移动端正确显示
- 调整主内容区的padding-right响应式逻辑

### Requirement: tiantong页面移动端适配
**Current**: 使用ResponsiveSidebarDanmu，但移动端体验需要优化
**Modified**:
- 参考yuxiaoc的DanmakuTower实现移动端抽屉式弹幕
- 优化Header组件的移动端响应式表现
- 确保IconToolbar在移动端正确显示
- 调整主内容区的padding-right响应式逻辑

### Requirement: MobileNotSupported组件
**Current**: 显示"移动端暂不支持"提示页面
**Modified**: 移除或注释掉该提示，允许移动端正常访问

## REMOVED Requirements
无

## 设计系统参考

### 移动端断点
- 移动端: < 768px
- 平板端: 768px - 1023px
- 桌面端: >= 1024px

### 颜色主题一致性
- 各页面保持现有的主题颜色配置
- 确保在移动端也有良好的对比度（WCAG AA标准）

### 触摸目标尺寸
- 最小触摸目标: 44x44px
- 触摸目标间距: 最小8px

### 动画规范
- 微交互: 150-300ms
- 抽屉打开/关闭: 300ms ease-out
- 尊重prefers-reduced-motion设置

## 参考实现
- yuxiaoc/YuxiaocPage.tsx - 主页面布局
- yuxiaoc/components/Header.tsx - 响应式导航栏
- yuxiaoc/components/DanmakuTower.tsx - 移动端抽屉式弹幕
- yuxiaoc/components/CanteenHall.tsx - 视频展示区域
- components/video-view/IconToolbar.tsx - 移动端工具栏
