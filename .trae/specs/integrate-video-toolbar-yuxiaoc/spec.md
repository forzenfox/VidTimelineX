# Yuxiaoc页面视频区域工具栏集成规格文档

## 变更ID

integrate-video-toolbar-yuxiaoc

## 为什么

Yuxiaoc页面的视频区域（CanteenHall）目前只有简单的搜索框，缺乏统一的视频视图工具栏。为了提升用户体验和保持与Tiantong、Lvjiang页面的一致性，需要集成现有的VideoViewToolbar组件，提供搜索、筛选、排序和视图切换功能。

## 目标

在yuxiaoc页面的CanteenHall（食堂大殿/血怒时刻）区域集成视频视图工具栏，支持：

* 视频搜索功能

* 视图模式切换（网格/列表/时间轴）

* 筛选和排序功能

* 双主题适配（血怒/混躺）

## 设计规范

### UI设计风格

基于ui-ux-pro-max技能分析，采用以下设计方向：

* **风格**: Gaming风格（#13 Gaming）- 深色主题配合霓虹强调色

* **配色方案**:

  * 血怒主题: 深紫背景(#0F0F23) + 玫瑰红强调(#E11D48)

  * 混躺主题: 浅灰背景(#F8FAFC) + 琥珀强调(#D97706)

* **效果**: 微妙的玻璃态效果（backdrop-blur）+ 发光阴影

* **字体**: Russo One（标题）+ Chakra Petch（正文）

### 工具栏布局

```
桌面端 (≥640px):
┌──────────────────────────────────────────────────────┐
│ [🔍 搜索框          ] [▦ 网格] [▤ 列表] [⏱️ 排序] [🔽 筛选] │
└──────────────────────────────────────────────────────┘

移动端 (<640px):
┌─────────────────────────┐
│ [🔍] [▭] [⏱️] [🔽]      │
└─────────────────────────┘
```

## 变更内容

### 新增功能

1. **VideoViewToolbar集成**: 在CanteenHall中集成VideoViewToolbar组件
2. **视图模式切换**: 支持网格/列表/时间轴三种视图模式
3. **搜索功能增强**: 使用SearchButton组件替代现有搜索框
4. **筛选排序**: 添加FilterDropdown和SortDropdown组件
5. **响应式适配**: 移动端显示图标工具栏，PC端显示完整工具栏

### 修改文件

* `frontend/src/features/yuxiaoc/components/CanteenHall.tsx` - 集成工具栏

* `frontend/src/components/video-view/VideoViewToolbar.tsx` - 添加theme属性支持

* `frontend/src/components/video-view/IconToolbar.tsx` - 添加theme属性支持

### 新增文件

* `frontend/src/features/yuxiaoc/hooks/useVideoView.ts` - 视频视图状态管理hook

* `frontend/tests/unit/features/yuxiaoc/CanteenHall.toolbar.test.tsx` - 工具栏集成测试

## ADDED Requirements

### Requirement: 视频视图工具栏集成

系统应在CanteenHall区域提供统一的视频视图工具栏。

#### Scenario: 桌面端显示完整工具栏

* **GIVEN** 用户访问yuxiaoc页面

* **WHEN** 视口宽度 ≥ 640px

* **THEN** 显示VideoViewToolbar组件，包含搜索框、视图切换、排序和筛选按钮

#### Scenario: 移动端显示图标工具栏

* **GIVEN** 用户访问yuxiaoc页面

* **WHEN** 视口宽度 < 640px

* **THEN** 显示IconToolbar组件，使用图标按钮节省空间

#### Scenario: 血怒主题样式

* **GIVEN** 当前主题为血怒(blood)

* **WHEN** 渲染工具栏

* **THEN** 使用深紫背景 + 玫瑰红强调色的配色方案

#### Scenario: 混躺主题样式

* **GIVEN** 当前主题为混躺(mix)

* **WHEN** 渲染工具栏

* **THEN** 使用浅灰背景 + 琥珀强调色的配色方案

#### Scenario: 视图模式切换

* **GIVEN** 用户在CanteenHall区域

* **WHEN** 点击视图切换按钮

* **THEN** 视频列表以对应模式显示（网格/列表/时间轴）

#### Scenario: 搜索功能

* **GIVEN** 用户在CanteenHall区域

* **WHEN** 在搜索框输入关键词

* **THEN** 视频列表实时过滤显示匹配结果

#### Scenario: 筛选功能

* **GIVEN** 用户在CanteenHall区域

* **WHEN** 使用筛选下拉菜单

* **THEN** 视频列表按筛选条件过滤

#### Scenario: 排序功能

* **GIVEN** 用户在CanteenHall区域

* **WHEN** 使用排序下拉菜单

* **THEN** 视频列表按选定方式排序

## MODIFIED Requirements

### Requirement: 现有搜索功能

**原实现**: 使用原生input元素实现搜索
**新实现**: 使用SearchButton组件，支持展开/收起动画和历史记录

### Requirement: 视频列表展示

**原实现**: 仅支持网格视图
**新实现**: 支持网格/列表/时间轴三种视图模式

## 技术实现

### 组件结构

```
CanteenHall
├── VideoViewToolbar (桌面端)
│   ├── SearchButton
│   ├── ViewSwitcher
│   ├── SortDropdown
│   └── FilterDropdown
├── IconToolbar (移动端)
│   ├── SearchButton (icon variant)
│   ├── CycleViewButton
│   ├── SortDropdown (icon variant)
│   └── FilterDropdown (icon variant)
└── VideoContent
    ├── VideoGrid (网格视图)
    ├── VideoList (列表视图)
    └── VideoTimeline (时间轴视图)
```

### 状态管理

使用useVideoView hook管理以下状态：

* viewMode: 'grid' | 'list' | 'timeline'

* filter: FilterState

* searchQuery: string

* filteredVideos: Video\[]

### 主题适配

工具栏组件通过theme属性接收当前主题：

```typescript
interface ToolbarProps {
  theme: 'blood' | 'mix';
}
```

根据主题应用不同的CSS变量：

* 血怒主题: --accent-color: #E11D48, --bg-card: rgba(30, 27, 75, 0.7)

* 混躺主题: --accent-color: #D97706, --bg-card: rgba(255, 255, 255, 0.9)

## 验收标准

### 功能验收

* [ ] 桌面端显示完整VideoViewToolbar

* [ ] 移动端显示IconToolbar

* [ ] 视图切换功能正常工作

* [ ] 搜索功能正常工作

* [ ] 筛选功能正常工作

* [ ] 排序功能正常工作

### 样式验收

* [ ] 血怒主题样式正确

* [ ] 混躺主题样式正确

* [ ] 工具栏与页面整体风格一致

* [ ] 响应式布局正确

### 测试验收

* [ ] 单元测试覆盖率 ≥ 80%

* [ ] 所有测试通过

* [ ] TDD流程遵循

## 依赖关系

* 依赖: video-view组件库（已存在）

* 依赖: useVideoFilter hook（已存在）

* 依赖: useViewPreferences hook（已存在）

