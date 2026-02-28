# 响应式工具栏设计计划（TDD）

## 目标
将纯图标化设计仅应用于移动端（<640px），PC端（≥640px）恢复使用图标+文字的组合设计。

## 设计规范

### 断点定义
- **移动端**: < 640px - 纯图标化设计
- **平板端**: 640px - 1024px - 图标+文字设计
- **桌面端**: > 1024px - 图标+文字设计

### 移动端布局（<640px）
```
┌─────────────────────────┐
│ [🔍] [⏱️] [🔽] [▭]      │
└─────────────────────────┘
```
- 搜索按钮（图标）- 点击展开搜索框
- 排序按钮（图标）
- 筛选按钮（图标）
- 视图切换按钮（图标，循环切换）

### PC端布局（≥640px）
```
桌面端 (>1024px):
┌──────────────────────────────────────────────────────┐
│ [🔍 搜索] [⏱️ 排序] [🔽 筛选]  [▦ 网格] [▤ 列表] [▭ 时间线]  │
└──────────────────────────────────────────────────────┘

平板端 (640px-1024px):
┌─────────────────────────────────────┐
│ [🔍 搜索] [⏱️ 排序] [🔽 筛选]          │
│ [▦ 网格] [▤ 列表] [▭ 时间线]          │
└─────────────────────────────────────┘
```

## TDD 实施计划

### 阶段 1: FilterDropdown 响应式改造

#### Step 1.1: 编写测试（先写测试）
文件: `frontend/tests/unit/components/video-view/FilterDropdown.responsive.test.tsx`
- 测试 `variant="icon"` 时渲染纯图标按钮
- 测试 `variant="default"` 时渲染图标+文字按钮
- 测试按钮尺寸：icon 模式 36x36px，default 模式更高
- 测试两种模式的功能一致性

#### Step 1.2: 实现功能
文件: `frontend/src/components/video-view/FilterDropdown.tsx`
- 添加 `variant?: 'icon' | 'default'` 属性，默认 'default'
- `variant="icon"`: 纯图标按钮（36×36px）+ 指示点
- `variant="default"`: 图标+文字按钮（原有样式）

#### Step 1.3: 运行测试验证

---

### 阶段 2: SortDropdown 响应式改造

#### Step 2.1: 编写测试（先写测试）
文件: `frontend/tests/unit/components/video-view/SortDropdown.responsive.test.tsx`
- 测试 `variant="icon"` 时渲染纯图标按钮
- 测试 `variant="default"` 时渲染图标+文字按钮
- 测试两种模式的功能一致性

#### Step 2.2: 实现功能
文件: `frontend/src/components/video-view/SortDropdown.tsx`
- 添加 `variant?: 'icon' | 'default'` 属性，默认 'default'
- `variant="icon"`: 纯图标按钮（36×36px）
- `variant="default"`: 图标+文字按钮（原有样式）

#### Step 2.3: 运行测试验证

---

### 阶段 3: ViewSwitcher 响应式改造

#### Step 3.1: 编写测试（先写测试）
文件: `frontend/tests/unit/components/video-view/ViewSwitcher.responsive.test.tsx`
- 测试 `variant="icon"` 时渲染 CycleViewButton（单个循环按钮）
- 测试 `variant="default"` 时渲染三个独立按钮（图标+文字）
- 测试视图切换功能在两种模式下都正常工作

#### Step 3.2: 实现功能
文件: `frontend/src/components/video-view/ViewSwitcher.tsx`
- 添加 `variant?: 'icon' | 'default'` 属性，默认 'default'
- `variant="icon"`: 使用 CycleViewButton 组件
- `variant="default"`: 使用原有的三个独立按钮

#### Step 3.3: 运行测试验证

---

### 阶段 4: SearchButton 响应式改造

#### Step 4.1: 编写测试（先写测试）
文件: `frontend/tests/unit/components/video-view/SearchButton.responsive.test.tsx`
- 测试 `variant="icon"` 时渲染图标按钮，点击展开
- 测试 `variant="expanded"` 时保持展开状态
- 测试搜索功能在两种模式下都正常工作

#### Step 4.2: 实现功能
文件: `frontend/src/components/video-view/SearchButton.tsx`
- 添加 `variant?: 'icon' | 'expanded'` 属性
- `variant="icon"`: 图标按钮（36×36px），点击展开
- `variant="expanded"`: 保持展开状态的搜索输入框

#### Step 4.3: 运行测试验证

---

### 阶段 5: IconToolbar 响应式改造

#### Step 5.1: 编写测试（先写测试）
文件: `frontend/tests/unit/components/video-view/IconToolbar.responsive.test.tsx`
- 测试移动端（<640px）渲染纯图标组件
- 测试 PC 端（≥640px）渲染图标+文字组件
- 测试响应式切换

#### Step 5.2: 实现功能
文件: `frontend/src/components/video-view/IconToolbar.tsx`
- 使用 CSS 媒体查询切换显示
- 移动端：使用纯图标组件（variant="icon"）
- PC 端：使用图标+文字组件（variant="default"）

#### Step 5.3: 运行测试验证

---

### 阶段 6: VideoViewToolbar 更新

#### Step 6.1: 编写测试（先写测试）
文件: `frontend/tests/unit/components/video-view/VideoViewToolbar.responsive.test.tsx`
- 测试移动端隐藏，PC 端显示
- 测试所有子组件正确渲染

#### Step 6.2: 实现功能
文件: `frontend/src/components/video-view/VideoViewToolbar.tsx`
- 添加响应式类名：移动端隐藏（hidden sm:flex），PC 端显示
- 整合 SearchButton、SortDropdown、FilterDropdown、ViewSwitcher

#### Step 6.3: 运行测试验证

---

### 阶段 7: TiantongPage 更新

#### Step 7.1: 编写测试（先写测试）
文件: `frontend/tests/unit/components/features/tiantong/TiantongPage.responsive.test.tsx`
- 测试移动端显示 IconToolbar
- 测试 PC 端显示 VideoViewToolbar
- 测试搜索功能在两种模式下都正常工作

#### Step 7.2: 实现功能
文件: `frontend/src/features/tiantong/TiantongPage.tsx`
- 使用响应式布局：
  - 移动端：显示 IconToolbar（sm:hidden）
  - PC 端：显示 VideoViewToolbar（hidden sm:block）

#### Step 7.3: 运行测试验证

---

### 阶段 8: LvjiangPage 更新

#### Step 8.1: 编写测试（先写测试）
文件: `frontend/tests/unit/components/features/lvjiang/LvjiangPage.responsive.test.tsx`
- 测试移动端显示 IconToolbar
- 测试 PC 端显示 VideoViewToolbar
- 测试搜索功能在两种模式下都正常工作

#### Step 8.2: 实现功能
文件: `frontend/src/features/lvjiang/LvjiangPage.tsx`
- 使用响应式布局：
  - 移动端：显示 IconToolbar（sm:hidden）
  - PC 端：显示 VideoViewToolbar（hidden sm:block）

#### Step 8.3: 运行测试验证

---

## 技术实现方案

### CSS 媒体查询（Tailwind）
```tsx
// 移动端显示，PC端隐藏
<div className="sm:hidden">
  <IconToolbar />
</div>

// PC端显示，移动端隐藏
<div className="hidden sm:block">
  <VideoViewToolbar />
</div>
```

### 组件 variant 属性
```tsx
// FilterDropdown, SortDropdown, ViewSwitcher, SearchButton
interface Props {
  variant?: 'icon' | 'default'; // 或 'expanded' for SearchButton
}
```

## 文件清单

### 测试文件（先写）
1. `frontend/tests/unit/components/video-view/FilterDropdown.responsive.test.tsx`
2. `frontend/tests/unit/components/video-view/SortDropdown.responsive.test.tsx`
3. `frontend/tests/unit/components/video-view/ViewSwitcher.responsive.test.tsx`
4. `frontend/tests/unit/components/video-view/SearchButton.responsive.test.tsx`
5. `frontend/tests/unit/components/video-view/IconToolbar.responsive.test.tsx`
6. `frontend/tests/unit/components/video-view/VideoViewToolbar.responsive.test.tsx`
7. `frontend/tests/unit/components/features/tiantong/TiantongPage.responsive.test.tsx`
8. `frontend/tests/unit/components/features/lvjiang/LvjiangPage.responsive.test.tsx`

### 组件文件（后写）
1. `frontend/src/components/video-view/FilterDropdown.tsx` - 添加 variant 属性
2. `frontend/src/components/video-view/SortDropdown.tsx` - 添加 variant 属性
3. `frontend/src/components/video-view/ViewSwitcher.tsx` - 添加 variant 属性
4. `frontend/src/components/video-view/SearchButton.tsx` - 添加 variant 属性
5. `frontend/src/components/video-view/IconToolbar.tsx` - 响应式改造
6. `frontend/src/components/video-view/VideoViewToolbar.tsx` - 响应式改造
7. `frontend/src/features/tiantong/TiantongPage.tsx` - 使用响应式工具栏
8. `frontend/src/features/lvjiang/LvjiangPage.tsx` - 使用响应式工具栏

## 验收标准

### 移动端（<640px）
- [ ] 纯图标化设计
- [ ] 按钮尺寸 36×36px
- [ ] 视图切换使用循环按钮
- [ ] 搜索按钮点击展开

### PC端（≥640px）
- [ ] 图标+文字设计
- [ ] 视图切换显示三个独立按钮
- [ ] 搜索框保持展开状态
- [ ] 筛选/排序按钮显示文字

### 通用
- [ ] 所有主题正常显示
- [ ] 动画流畅
- [ ] 测试覆盖率 ≥ 80%
- [ ] 所有测试通过
