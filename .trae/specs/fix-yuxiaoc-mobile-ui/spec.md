# Yuxiaoc页面移动端UI优化规格说明

## Why

通过Playwright移动端UI测试分析，发现Yuxiaoc粉丝站页面在移动端（iPhone 14 Pro 393x852）存在多项UI问题：
1. **水平飘屏弹幕字体过大、速度过快** - 需要针对移动端优化
2. **"斗鱼直播间"按钮在移动端显示异常** - 需要隐藏或简化
3. **搜索按钮下拉框超出屏幕** - 宽度320px在移动端可能溢出
4. **字体过小** - 多处使用10px字体，可读性差

这些问题严重影响移动端用户体验，需要进行系统性优化。

## What Changes

- **优化水平飘屏弹幕移动端显示** - 缩小字体、降低速度，保持单行显示
- **隐藏"斗鱼直播间"按钮** - 在移动端(<768px)隐藏该按钮
- **修复搜索下拉框溢出** - 调整移动端下拉框宽度和位置
- **调整字体大小** - 将10px字体调整为最小12px
- **优化触摸目标大小** - 确保所有可点击元素符合WCAG 44x44px标准
- **添加减少动画偏好支持** - 尊重用户系统设置

## Impact

- **Affected specs**: Yuxiaoc粉丝站移动端用户体验
- **Affected code**: 
  - `frontend/src/features/yuxiaoc/components/HorizontalDanmaku.tsx`
  - `frontend/src/features/yuxiaoc/components/Header.tsx`
  - `frontend/src/components/video-view/SearchButton.tsx`
  - `frontend/src/features/yuxiaoc/components/TitleHall.tsx`
  - `frontend/src/features/yuxiaoc/components/CVoiceArchive.tsx`
  - `frontend/src/features/yuxiaoc/components/DanmakuTower.tsx`
  - `frontend/src/features/yuxiaoc/styles/yuxiaoc.css`

## ADDED Requirements

### Requirement: 水平飘屏弹幕移动端优化

The system SHALL optimize horizontal danmaku for mobile:

#### Scenario: 移动端显示
- **GIVEN** 用户在移动端访问页面 (视口宽度 < 640px)
- **WHEN** 水平飘屏弹幕显示时
- **THEN** 弹幕字体大小缩小至 10-12px
- **AND** 弹幕滚动速度降低 (duration 增加至 10-18秒)
- **AND** 保持单行显示 (white-space: nowrap)
- **AND** 弹幕轨道数量减少至 5 条

#### Scenario: 桌面端显示
- **GIVEN** 用户在桌面端访问页面 (视口宽度 >= 640px)
- **WHEN** 水平飘屏弹幕显示时
- **THEN** 保持原有字体大小 (14-20px)
- **AND** 保持原有滚动速度 (6-14秒)
- **AND** 保持 8 条弹幕轨道

### Requirement: 搜索下拉框移动端适配

The system SHALL fix search dropdown overflow on mobile:

#### Scenario: 移动端搜索下拉框
- **GIVEN** 用户在移动端点击搜索按钮
- **WHEN** 搜索下拉框打开时
- **THEN** 下拉框宽度适配视口 (max-width: calc(100vw - 32px))
- **AND** 下拉框位置不超出屏幕右侧
- **AND** 下拉框左侧对齐或居中显示

### Requirement: 字体大小可读性

The system SHALL ensure minimum font size of 12px on mobile:

#### Scenario: 称号标签
- **GIVEN** 移动端称号标签显示
- **THEN** 字体大小不小于12px

#### Scenario: 技能标签
- **GIVEN** 移动端技能标签显示
- **THEN** 字体大小不小于12px

#### Scenario: 时间戳
- **GIVEN** 移动端时间戳显示
- **THEN** 字体大小不小于12px

### Requirement: 减少动画偏好支持

The system SHALL respect `prefers-reduced-motion` user preference:

#### Scenario: 用户开启减少动画
- **GIVEN** 用户系统设置开启减少动画
- **WHEN** 页面加载和交互时
- **THEN** 禁用或简化所有动画效果
- **AND** 保持基本功能可用

## MODIFIED Requirements

### Requirement: "斗鱼直播间"按钮移动端隐藏

**Current Implementation:**
- "斗鱼直播间"按钮在移动端显示，文字换行异常

**Modified Requirement:**
- **GIVEN** 移动端视口宽度小于768px
- **THEN** 隐藏"斗鱼直播间"按钮
- **AND** 保留Logo和主题切换按钮

### Requirement: 触摸目标大小

**Modified Requirement:**
- **GIVEN** 移动端交互元素
- **THEN** 所有可点击元素最小尺寸为44x44px
- **AND** 相邻可点击元素间距不小于8px

## REMOVED Requirements

无移除的需求。

## 设计规范参考

基于ui-ux-pro-max技能推荐：

### 颜色方案（保持现有）
- **血怒模式**: 
  - Primary: #E11D48
  - Background: #0F0F23
  - Text: #E2E8F0
- **混躺模式**:
  - Primary: #D97706
  - Background: #F8FAFC
  - Text: #0F172A

### 字体规范
- **移动端最小字号**: 12px
- **弹幕移动端字号**: 10-12px
- **标题字号**: 使用clamp()实现响应式
- **行高**: 1.5-1.6保证可读性

### 响应式断点
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px

### 动画规范
- **弹幕桌面端速度**: 6-14秒
- **弹幕移动端速度**: 10-18秒（更慢）
- **缓动函数**: linear
- **减少动画**: 支持prefers-reduced-motion

### 布局规范
- **搜索下拉框最大宽度**: calc(100vw - 32px)
- **触摸目标最小尺寸**: 44x44px
- **元素间距**: >= 8px
