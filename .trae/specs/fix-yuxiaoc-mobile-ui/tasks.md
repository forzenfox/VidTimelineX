# Yuxiaoc页面移动端UI优化任务列表

## 任务依赖关系
```
Task 1 (HorizontalDanmaku优化)
    └── Task 2 (Header隐藏直播间按钮)
            └── Task 3 (SearchButton下拉框修复)
                    └── Task 4 (字体大小调整)
                            └── Task 5 (减少动画支持)
                                    └── Task 6 (测试验证)
```

## 任务详情

- [x] **Task 1: 优化水平飘屏弹幕移动端显示**
  - **目标**: 修复HorizontalDanmaku组件在移动端的字体和速度问题
  - **文件**: `frontend/src/features/yuxiaoc/components/HorizontalDanmaku.tsx`
  - **步骤**:
    1. [x] 添加视口宽度检测 (useState + useEffect + resize listener)
    2. [x] 移动端(<640px)字体大小固定为12px
    3. [x] 移动端弹幕滚动速度增加至10-18秒
    4. [x] 移动端轨道数量减少至5条
    5. [x] 桌面端保持原有设置(14-20px字体, 6-14秒速度, 8条轨道)
    6. [x] 保持单行显示(white-space: nowrap)
  - **验收标准**:
    - 移动端弹幕字体12px、速度更慢
    - 保持单行显示
    - 桌面端保持原有效果

- [x] **Task 2: 隐藏"斗鱼直播间"按钮**
  - **目标**: 在移动端隐藏Header中的"斗鱼直播间"按钮
  - **文件**: `frontend/src/features/yuxiaoc/components/Header.tsx`
  - **步骤**:
    1. [x] 找到"斗鱼直播间"按钮代码(约第144-173行)
    2. [x] 添加`hidden md:flex`类
    3. [x] 确保Logo和主题切换按钮在移动端正常显示
    4. [x] 调整导航栏布局，移除按钮后保持对齐
  - **验收标准**:
    - 移动端(<768px)"斗鱼直播间"按钮隐藏
    - 桌面端按钮正常显示
    - 导航栏布局正常

- [x] **Task 3: 修复搜索下拉框移动端溢出**
  - **目标**: 修复SearchButton组件在移动端的下拉框溢出问题
  - **文件**: `frontend/src/components/video-view/SearchButton.tsx`
  - **步骤**:
    1. [x] 找到icon模式下的下拉框代码(约第258-265行)
    2. [x] 修改下拉框宽度: `w-80` → `w-[calc(100vw-32px)] max-w-[320px] sm:w-80`
    3. [x] 添加响应式类
    4. [x] 确保下拉框在移动端不超出屏幕
  - **验收标准**:
    - 移动端搜索下拉框宽度适配视口
    - 下拉框不超出屏幕右侧
    - 桌面端保持原有宽度

- [x] **Task 4: 调整字体大小确保可读性**
  - **目标**: 将所有10px字体调整为最小12px
  - **文件**:
    - `frontend/src/features/yuxiaoc/components/TitleHall.tsx`
    - `frontend/src/features/yuxiaoc/components/CVoiceArchive.tsx`
    - `frontend/src/features/yuxiaoc/components/DanmakuTower.tsx`
  - **步骤**:
    1. [x] 搜索所有使用10px字样的代码
    2. [x] 在TitleHall组件中调整称号标签字体大小(text-[10px] → text-xs)
    3. [x] 在CVoiceArchive组件中调整技能标签字体大小(text-[10px] → text-xs)
    4. [x] 在DanmakuTower组件中调整时间戳字体大小(text-[10px] → text-xs)
  - **验收标准**:
    - 所有标签字体大小 >= 12px
    - 时间戳字体大小 >= 12px
    - 在移动端可读性良好

- [x] **Task 5: 添加减少动画偏好支持**
  - **目标**: 支持prefers-reduced-motion媒体查询
  - **文件**: `frontend/src/features/yuxiaoc/styles/yuxiaoc.css`
  - **步骤**:
    1. [x] 检查CSS中是否已有`@media (prefers-reduced-motion: reduce)`规则
    2. [x] 确认已禁用或简化动画效果
  - **验收标准**:
    - 支持prefers-reduced-motion媒体查询
    - 减少动画模式下动画被禁用或简化
    - 基本功能保持可用

- [x] **Task 6: 测试验证**
  - **目标**: 使用Playwright验证所有修复
  - **步骤**:
    1. [x] 使用Playwright模拟iPhone 14 Pro进行测试
    2. [x] 验证弹幕字体为12px、速度更慢
    3. [x] 验证"斗鱼直播间"按钮在移动端隐藏
    4. [x] 验证搜索下拉框不溢出
    5. [x] 验证字体大小符合规范(>=12px)
    6. [x] 生成测试报告
  - **验收标准**:
    - 所有UI问题已修复
    - 移动端用户体验良好
    - 测试报告通过

## 技术实现要点

### 1. 视口宽度检测
```tsx
const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const checkMobile = () => {
    setIsMobile(window.innerWidth < 640);
  };
  checkMobile();
  window.addEventListener('resize', checkMobile);
  return () => window.removeEventListener('resize', checkMobile);
}, []);
```

### 2. 响应式类使用
```jsx
// 隐藏按钮示例
<a className="hidden md:flex ...">斗鱼直播间</a>

// 下拉框宽度适配
<div className="w-[calc(100vw-32px)] max-w-[320px] sm:w-80 ...">
```

### 3. 弹幕参数配置
```tsx
const danmakuConfig = isMobile ? {
  fontSize: 12,  // 固定12px
  duration: { min: 10, max: 18 },
  trackCount: 5
} : {
  fontSize: { min: 14, max: 20 },
  duration: { min: 6, max: 14 },
  trackCount: 8
};
```

### 4. 触摸目标规范
- 最小尺寸: 44x44px
- 相邻间距: >= 8px
- 使用 `min-w-[44px] min-h-[44px]` 确保触摸目标大小

### 5. 字体规范
- 移动端最小: 12px (text-xs)
- 弹幕移动端: 12px (固定)
- 正文推荐: 14px (text-sm) 或 16px (text-base)
