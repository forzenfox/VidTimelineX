# 视频列表分页功能实现计划

## 任务概述
为视频列表视图（grid/list）实现高效的分页机制，确保在视频数量超过预设阈值时自动启用分页，提升用户体验和页面性能。

## 当前状态分析

### 现有架构
1. **视频展示组件**:
   - `VideoGrid.tsx` - 网格视图（2/3/4列响应式）
   - `VideoList.tsx` - 列表视图（垂直排列）
   - `VideoTimeline.tsx` - 时间线视图（已有，不参与分页）

2. **状态管理**:
   - `useViewPreferences.tsx` - 管理视图模式（timeline/grid/list）
   - `useVideoFilter.tsx` - 管理过滤和排序状态
   - `types.ts` - 类型定义

3. **已有UI组件**:
   - `pagination.tsx` - 现成的分页UI组件（shadcn/ui风格）

4. **使用页面**:
   - `TiantongPage.tsx` - 甜筒页面
   - `LvjiangPage.tsx` - 驴酱页面

### 当前问题
- 视频数量过多时（>100条）全部渲染，导致：
  - 首屏加载缓慢
  - 滚动卡顿
  - 内存占用高
  - 用户体验差

## 优化目标

### 核心指标
- 首屏加载时间 < 1秒
- 视频数量 > 100条时仍保持流畅
- 分页切换响应时间 < 300ms
- 支持每页显示数量自定义（12/24/48）

### 功能需求
1. 自动分页阈值：视频数量 > 24条时启用分页
2. 默认每页显示：12条（grid）/ 12条（list）
3. 分页控件：页码导航 + 上一页/下一页 + 每页数量选择器
4. 状态保持：视图切换时保持分页状态
5. 性能优化：虚拟滚动或懒加载

## 实现方案

### 1. 新建 usePagination Hook
**文件**: `frontend/src/hooks/usePagination.tsx`

```typescript
interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  pageSizeOptions?: number[];
}

interface UsePaginationReturn {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  paginatedItems: T[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  goToNextPage: () => void;
  goToPrevPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
}
```

### 2. 新建 PaginationControls 组件
**文件**: `frontend/src/components/video-view/PaginationControls.tsx`

包含：
- 每页显示数量选择器（12/24/48）
- 上一页/下一页按钮
- 页码导航（显示当前页前后各2页）
- 总页数/总条数显示

### 3. 更新类型定义
**文件**: `frontend/src/hooks/types.ts`

```typescript
export interface PaginationConfig {
  currentPage: number;
  pageSize: number;
}

export interface UserPreferences {
  viewMode: ViewMode;
  filter: FilterState;
  pagination: PaginationConfig; // 新增
}
```

### 4. 更新 useViewPreferences Hook
**文件**: `frontend/src/hooks/useViewPreferences.tsx`

- 添加分页状态持久化到 localStorage
- 视图切换时保持分页状态

### 5. 更新 VideoGrid 组件
**文件**: `frontend/src/components/video-view/VideoGrid.tsx`

- 添加分页支持
- 集成 PaginationControls
- 空状态处理

### 6. 更新 VideoList 组件
**文件**: `frontend/src/components/video-view/VideoList.tsx`

- 添加分页支持
- 集成 PaginationControls
- 空状态处理

### 7. 更新页面组件
**文件**: 
- `frontend/src/features/tiantong/TiantongPage.tsx`
- `frontend/src/features/lvjiang/LvjiangPage.tsx`

- 集成分页状态管理
- 处理分页阈值逻辑

### 8. 性能优化
- 使用 `React.memo` 优化子组件渲染
- 使用 `useMemo` 缓存分页计算结果
- 考虑实现虚拟滚动（视频数量 > 200时）

## 实现步骤

### Phase 1: 核心Hook和类型（TDD）
1. 创建 `usePagination.test.tsx` 测试文件
2. 实现 `usePagination.tsx` Hook
3. 更新 `types.ts` 类型定义

### Phase 2: 分页控件组件
1. 创建 `PaginationControls.test.tsx` 测试文件
2. 实现 `PaginationControls.tsx` 组件

### Phase 3: 视图组件集成
1. 更新 `VideoGrid.tsx` 添加分页支持
2. 更新 `VideoList.tsx` 添加分页支持
3. 创建对应的测试文件

### Phase 4: 页面集成
1. 更新 `TiantongPage.tsx`
2. 更新 `LvjiangPage.tsx`
3. 运行所有相关测试

### Phase 5: 性能优化
1. 添加虚拟滚动支持（可选）
2. 性能测试和优化

## 代码结构

```
frontend/src/
├── hooks/
│   ├── usePagination.tsx          # 新增
│   ├── usePagination.test.tsx     # 新增
│   ├── useViewPreferences.tsx     # 修改
│   └── types.ts                   # 修改
├── components/video-view/
│   ├── PaginationControls.tsx     # 新增
│   ├── PaginationControls.test.tsx # 新增
│   ├── VideoGrid.tsx              # 修改
│   ├── VideoGrid.test.tsx         # 新增
│   ├── VideoList.tsx              # 修改
│   └── VideoList.test.tsx         # 新增
└── features/
    ├── tiantong/
    │   └── TiantongPage.tsx       # 修改
    └── lvjiang/
        └── LvjiangPage.tsx        # 修改
```

## 测试策略

### 单元测试覆盖
1. **usePagination Hook**:
   - 初始化状态测试
   - 页码切换逻辑
   - 每页数量变更
   - 边界条件（空数据、单页、多页）

2. **PaginationControls 组件**:
   - 渲染测试
   - 按钮交互测试
   - 页码选择测试
   - 每页数量选择测试

3. **VideoGrid/VideoList**:
   - 分页数据渲染
   - 空状态显示
   - 分页控件集成

### 集成测试
- 视图切换时分页状态保持
- 过滤后分页重置
- 大数据量性能测试

## 验收标准

### 功能验收
- [ ] 视频数量 ≤ 12条时不显示分页控件
- [ ] 视频数量 > 12条时自动启用分页
- [ ] 分页控件包含：上一页、页码、下一页、每页数量选择
- [ ] 每页数量可选：12/24/48
- [ ] 从grid/list切换回timeline时，返回timeline视图（不参与分页）
- [ ] 从timeline切换到grid/list时，保持分页状态
- [ ] 过滤/排序后自动回到第1页

### 性能验收
- [ ] 100条视频首屏加载 < 1秒
- [ ] 分页切换响应 < 300ms
- [ ] 内存占用优化（无内存泄漏）

### 兼容性验收
- [ ] 响应式布局正常（移动端/平板/桌面）
- [ ] 键盘导航支持
- [ ] 屏幕阅读器友好

## 技术细节

### 分页算法
```typescript
const totalPages = Math.ceil(totalItems / pageSize);
const startIndex = (currentPage - 1) * pageSize;
const endIndex = Math.min(startIndex + pageSize, totalItems);
const paginatedItems = items.slice(startIndex, endIndex);
```

### 状态持久化
```typescript
// localStorage key: vidtimelinex_pagination
type StoredPagination = {
  [pageKey: string]: {
    currentPage: number;
    pageSize: number;
  }
}
```

### 视图特定配置
```typescript
const VIEW_CONFIG = {
  grid: {
    defaultPageSize: 12,
    pageSizeOptions: [12, 24, 48],
  },
  list: {
    defaultPageSize: 12,
    pageSizeOptions: [12, 24, 48],
  },
  timeline: {
    // 时间线视图不参与分页
    enabled: false,
  },
};
```
