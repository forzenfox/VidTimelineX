# UI 优化实施计划

## 问题分析

### 问题 1：视图切换区域和视频卡片区域间隔太小
- **影响页面**：所有使用 VideoViewToolbar 的页面（TiantongPage、LvjiangPage）
- **问题描述**：VideoViewToolbar 与 VideoGrid/VideoList 之间没有足够的间距
- **当前状态**：两个组件直接相邻，没有足够的视觉呼吸空间

### 问题 2：驴酱页面筛选和排序组件被遮挡
- **影响页面**：LvjiangPage
- **问题描述**：
  1. 筛选和排序组件可能被视频卡片遮挡
  2. 这些组件位置应该与视图切换区域相对固定
- **当前状态**：VideoViewToolbar 包含 ViewSwitcher、FilterDropdown、SortDropdown，但可能缺少正确的 z-index 或定位

***

## 任务列表

### [ ] 任务 1：增加 VideoViewToolbar 与视频列表之间的间距
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 在 VideoViewToolbar 组件上添加底部间距
  - 确保在所有页面（TiantongPage、LvjiangPage）都有一致的间距
  - 间距大小应该符合设计规范（建议使用 pt-6 或 pt-8）
- **Success Criteria**:
  - VideoViewToolbar 与 VideoGrid/VideoList 之间有明显的视觉分隔
  - 所有页面保持一致的间距
- **Test Requirements**:
  - `human-judgement` TR-1.1: 视觉检查间距是否合理
- **Files to modify**:
  - `frontend/src/components/video-view/VideoViewToolbar.tsx`

### [ ] 任务 2：确保 VideoViewToolbar 有正确的层级和定位
- **Priority**: P0
- **Depends On**: 任务 1
- **Description**: 
  - 确保 VideoViewToolbar 有正确的 z-index
  - 确保筛选和排序组件的下拉菜单不会被遮挡
  - 添加必要的相对定位
- **Success Criteria**:
  - FilterDropdown 和 SortDropdown 的下拉菜单完全可见
  - 下拉菜单不会被视频卡片遮挡
- **Test Requirements**:
  - `human-judgement` TR-2.1: 检查下拉菜单是否完全可见
  - `human-judgement` TR-2.2: 检查在不同视图模式下都正常工作
- **Files to modify**:
  - `frontend/src/components/video-view/VideoViewToolbar.tsx`
  - `frontend/src/components/video-view/FilterDropdown.tsx` (可能需要)
  - `frontend/src/components/video-view/SortDropdown.tsx` (可能需要)

### [ ] 任务 3：优化驴酱页面的布局结构
- **Priority**: P1
- **Depends On**: 任务 2
- **Description**: 
  - 检查 LvjiangPage 的布局结构
  - 确保 VideoViewToolbar 有正确的定位
  - 验证与 TiantongPage 保持一致的布局模式
- **Success Criteria**:
  - LvjiangPage 与 TiantongPage 有一致的布局
  - 所有组件都正确显示，没有遮挡
- **Test Requirements**:
  - `human-judgement` TR-3.1: 对比两个页面的布局一致性
- **Files to modify**:
  - `frontend/src/features/lvjiang/LvjiangPage.tsx` (可能需要)

### [ ] 任务 4：更新相关测试
- **Priority**: P1
- **Depends On**: 任务 1, 任务 2, 任务 3
- **Description**: 
  - 检查是否需要更新 VideoViewToolbar 相关测试
  - 确保测试覆盖新的间距和定位更改
- **Success Criteria**:
  - 所有现有测试通过
- **Test Requirements**:
  - `programmatic` TR-4.1: `npm run test:unit` 通过
- **Files to modify**:
  - 可能需要更新相关测试文件

***

## 设计规范

### 间距规范
| 元素 | 间距大小 | Tailwind 类 |
|------|---------|------------|
| VideoViewToolbar 底部间距 | 24px-32px | `pb-6` 或 `pb-8` |
| 组件内部间距 | 16px-24px | 保持现有 |

### 层级规范
| 组件 | z-index | 说明 |
|------|---------|------|
| VideoViewToolbar | 10 | 确保在内容之上 |
| 下拉菜单 | 50 | 确保在所有内容之上 |

***

## 验收标准

1. VideoViewToolbar 与视频卡片区域之间有明显的间距
2. 筛选和排序组件的下拉菜单完全可见，不被遮挡
3. 所有页面（TiantongPage、LvjiangPage）布局一致
4. 所有现有测试通过
