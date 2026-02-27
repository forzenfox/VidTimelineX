# 简化搜索框UI逻辑计划（TDD方法）

## 目标
使用TDD方法简化搜索框的UI逻辑，使其更加简洁易用。

## TDD执行流程

### 阶段1：编写失败的测试（Red）

#### 步骤1：更新测试代码 - 叉叉图标功能
- [ ] 添加测试：搜索框在有内容时显示叉叉图标
- [ ] 添加测试：点击叉叉图标清空搜索内容
- [ ] 添加测试：点击叉叉图标触发onClear回调
- [ ] 运行测试，确保测试失败（因为功能还未实现）

#### 步骤2：更新测试代码 - 移除底部按钮
- [ ] 删除测试：不应再显示"重置搜索"按钮
- [ ] 删除测试：不应再显示"搜索"按钮
- [ ] 运行测试，确保相关测试失败

#### 步骤3：更新测试代码 - 下拉框只显示搜索历史
- [ ] 删除测试：不应再显示搜索建议
- [ ] 修改测试：下拉框只在有搜索历史时显示
- [ ] 添加测试：搜索历史为空时不显示下拉框
- [ ] 运行测试，确保测试失败

### 阶段2：实现功能使测试通过（Green）

#### 步骤4：实现叉叉图标功能
- [ ] 导入X图标
- [ ] 在expanded模式搜索框右侧添加叉叉图标
- [ ] 在icon模式搜索框右侧添加叉叉图标
- [ ] 点击叉叉图标执行handleReset函数
- [ ] 运行测试，确保测试通过

#### 步骤5：移除底部按钮
- [ ] 删除expanded模式下拉框底部的按钮区域
- [ ] 删除icon模式下拉框底部的按钮区域
- [ ] 运行测试，确保测试通过

#### 步骤6：简化下拉框内容
- [ ] 删除expanded模式下拉框中的搜索建议区域
- [ ] 删除icon模式下拉框中的搜索建议区域
- [ ] 修改下拉框显示条件：open && searchHistory.length > 0
- [ ] 运行测试，确保测试通过

### 阶段3：重构优化（Refactor）

#### 步骤7：代码重构
- [ ] 检查代码重复，提取公共组件
- [ ] 优化样式类名
- [ ] 确保代码可读性
- [ ] 运行测试，确保所有测试仍然通过

## 详细实现步骤

### 1. 叉叉图标实现
```tsx
// 导入X图标
import { Search, Clock, X } from "lucide-react";

// 在搜索框中添加叉叉图标
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
  <input ... />
  {hasQuery && (
    <button
      type="button"
      aria-label="清空"
      onClick={handleReset}
      className="absolute right-3 top-1/2 -translate-y-1/2 ..."
    >
      <X className="w-4 h-4" />
    </button>
  )}
</div>
```

### 2. 下拉框简化
```tsx
{open && searchHistory.length > 0 && (
  <div className="...">
    {/* 只保留搜索历史 */}
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-medium text-muted-foreground">搜索历史</span>
        {onClearHistory && <button onClick={handleClearHistory}>清空</button>}
      </div>
      {/* 历史列表 */}
    </div>
  </div>
)}
```

## 文件修改清单
1. `d:\workspace\VidTimelineX\frontend\tests\unit\components\video-view\SearchButton.test.tsx`（先修改）
2. `d:\workspace\VidTimelineX\frontend\src\components\video-view\SearchButton.tsx`（后修改）

## 测试执行命令
```bash
cd d:\workspace\VidTimelineX\frontend
npm test -- tests/unit/components/video-view/SearchButton.test.tsx
```

## 预期效果
- 搜索框更加简洁，只有输入框和叉叉图标
- 下拉框只在有搜索历史时显示
- 用户通过回车键触发搜索
- 点击叉叉图标快速清空搜索
