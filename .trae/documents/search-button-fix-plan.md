# 搜索按钮和搜索框缺失问题修复计划（TDD）

## 问题分析

### 问题描述
修改后，PC 端（≥640px）没有显示搜索按钮和搜索框。

### 根本原因
1. **TiantongPage.tsx** 中 PC 端使用的是 `VideoViewToolbar` 组件
2. **VideoViewToolbar** 组件没有集成 `SearchButton` 组件
3. **VideoViewToolbar** 的 props 中没有搜索相关的属性（`onSearch`, `searchSuggestions`, `searchHistory`, `onClearHistory`）

## TDD 实施计划

### 阶段 1: VideoViewToolbar - 添加 SearchButton

#### Step 1.1: 编写测试（先写测试）
文件: `frontend/tests/unit/components/video-view/VideoViewToolbar.search.test.tsx`
- 测试 VideoViewToolbar 渲染 SearchButton 组件
- 测试 SearchButton 使用 variant="expanded" 模式
- 测试搜索相关的 props 正确传递给 SearchButton
- 测试搜索功能正常工作

#### Step 1.2: 实现功能
文件: `frontend/src/components/video-view/VideoViewToolbar.tsx`
- 添加搜索相关 props 到接口定义
- 导入 SearchButton 组件
- 在工具栏中集成 SearchButton（variant="expanded"）

#### Step 1.3: 运行测试验证

---

### 阶段 2: TiantongPage - 传递搜索 props

#### Step 2.1: 编写测试（先写测试）
文件: `frontend/tests/unit/components/features/tiantong/TiantongPage.search.test.tsx`
- 测试 PC 端 VideoViewToolbar 接收搜索相关 props
- 测试搜索功能在 PC 端正常工作
- 测试搜索历史和建议功能

#### Step 2.2: 实现功能
文件: `frontend/src/features/tiantong/TiantongPage.tsx`
- 将搜索相关的 props 传递给 VideoViewToolbar

#### Step 2.3: 运行测试验证

---

### 阶段 3: LvjiangPage - 传递搜索 props

#### Step 3.1: 编写测试（先写测试）
文件: `frontend/tests/unit/components/features/lvjiang/LvjiangPage.search.test.tsx`
- 测试 PC 端 VideoViewToolbar 接收搜索相关 props
- 测试搜索功能在 PC 端正常工作

#### Step 3.2: 实现功能
文件: `frontend/src/features/lvjiang/LvjiangPage.tsx`
- 将搜索相关的 props 传递给 VideoViewToolbar

#### Step 3.3: 运行测试验证

---

## 技术实现方案

### VideoViewToolbar 接口更新
```tsx
interface VideoViewToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  filter: FilterState;
  onFilterChange: (filter: FilterState) => void;
  // 新增搜索相关 props
  onSearch?: (query: string) => void;
  searchSuggestions?: string[];
  searchHistory?: string[];
  onClearHistory?: () => void;
  className?: string;
  theme?: string;
}
```

### VideoViewToolbar 布局
```tsx
<div className="hidden sm:flex ...">
  {/* 左侧：搜索框 */}
  <SearchButton
    onSearch={onSearch}
    variant="expanded"
    searchSuggestions={searchSuggestions}
    searchHistory={searchHistory}
    onClearHistory={onClearHistory}
  />
  
  {/* 中间：视图切换 */}
  <ViewSwitcher ... />
  
  {/* 右侧：筛选、排序 */}
  <FilterDropdown ... />
  <SortDropdown ... />
</div>
```

## 文件清单

### 测试文件（先写）
1. `frontend/tests/unit/components/video-view/VideoViewToolbar.search.test.tsx`
2. `frontend/tests/unit/components/features/tiantong/TiantongPage.search.test.tsx`
3. `frontend/tests/unit/components/features/lvjiang/LvjiangPage.search.test.tsx`

### 组件文件（后写）
1. `frontend/src/components/video-view/VideoViewToolbar.tsx`
2. `frontend/src/features/tiantong/TiantongPage.tsx`
3. `frontend/src/features/lvjiang/LvjiangPage.tsx`

## 验收标准

### PC端 (≥640px)
- [ ] VideoViewToolbar 显示 SearchButton（展开状态）
- [ ] 搜索功能正常工作
- [ ] 搜索建议正常显示
- [ ] 搜索历史正常显示
- [ ] 清除历史功能正常

### 移动端 (<640px)
- [ ] IconToolbar 搜索功能保持正常

### 测试覆盖
- [ ] VideoViewToolbar 搜索测试通过
- [ ] TiantongPage 搜索测试通过
- [ ] LvjiangPage 搜索测试通过
