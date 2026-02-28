# 移除排序组件"最多播放"选项计划

## 任务概述
从排序组件中移除"最多播放"选项，因为本系统未采集视频的播放量元数据。

## 当前状态分析

### 涉及文件
1. **SortDropdown.tsx** - 排序下拉组件，定义了排序选项列表
2. **SortDropdown.test.tsx** - 排序组件的单元测试
3. **types.ts** - 定义了 SortOption 类型

### 当前排序选项
```typescript
const sortOptions = [
  { value: "newest", label: "最新发布" },
  { value: "oldest", label: "最早发布" },
  { value: "popular", label: "最多播放" },  // 需要移除
];
```

## 优化内容

### 1. 移除"最多播放"选项
- 从 `sortOptions` 数组中移除 `{ value: "popular", label: "最多播放" }`
- 保留"最新发布"和"最早发布"两个选项

### 2. 更新类型定义（可选）
- 可以考虑从 `SortOption` 类型中移除 `"popular"`
- 但考虑到可能的历史数据兼容性，暂时保留类型定义，仅移除UI选项

### 3. 更新测试文件
- 移除测试中对"最多播放"的断言
- 更新 TC-002、TC-004、TC-006 测试用例

## 实现步骤

### 步骤1：更新 SortDropdown.tsx
移除 `sortOptions` 数组中的 "popular" 选项

### 步骤2：更新 SortDropdown.test.tsx
- TC-002: 移除对"最多播放"的文本内容断言
- TC-004: 移除对"最多播放"的文本内容断言
- TC-006: 修改测试用例，使用"oldest"选项代替"popular"测试高亮标识

### 步骤3：运行测试验证
确保所有单元测试通过

## 代码变更详情

### SortDropdown.tsx 变更
```typescript
// 修改前
const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "最新发布" },
  { value: "oldest", label: "最早发布" },
  { value: "popular", label: "最多播放" },
];

// 修改后
const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "最新发布" },
  { value: "oldest", label: "最早发布" },
];
```

### SortDropdown.test.tsx 变更
```typescript
// TC-002: 移除以下断言
expect(menuContent).toHaveTextContent("最多播放");

// TC-004: 移除以下断言
expect(menuContent).toHaveTextContent("最多播放");

// TC-006: 修改测试用例
// 修改前：测试 "popular" 选项的高亮
render(<SortDropdown sortBy="popular" onSortChange={mockOnSortChange} />);
// ...
const popularButton = Array.from(buttons || []).find(btn =>
  btn.textContent?.includes("最多播放")
);

// 修改后：测试 "oldest" 选项的高亮
render(<SortDropdown sortBy="oldest" onSortChange={mockOnSortChange} />);
// ...
const oldestButton = Array.from(buttons || []).find(btn =>
  btn.textContent?.includes("最早发布")
);
```

## 测试策略
- 遵循TDD方法，先更新测试再修改实现
- 验证排序菜单只显示两个选项
- 验证剩余选项功能正常

## 验收标准
- [ ] 排序下拉菜单只显示"最新发布"和"最早发布"两个选项
- [ ] "最多播放"选项不再显示在UI中
- [ ] 所有单元测试通过
- [ ] 剩余排序功能正常工作
