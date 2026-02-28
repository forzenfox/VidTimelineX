# 天通页面侧边弹幕问题修复计划

## 问题描述

天通页面的侧边弹幕（SidebarDanmu 组件）显示的文字内容均为"默认弹幕"，而不是实际的弹幕数据。

## 问题定位

### 根本原因

在 `SidebarDanmu.tsx` 中，`DanmakuGenerator` 初始化时 `textPool` 被设置为**空数组** `[]`，导致生成弹幕时只能返回默认值"默认弹幕"。

**问题代码：**

```typescript
// SidebarDanmu.tsx 第 27-34 行
const generator = useMemo(() => {
  return new DanmakuGenerator({
    textPool: [],  // ❌ 空数组！
    users: usersList,
    theme: theme,
    danmakuType: "sidebar",
    randomColor: false,
    randomSize: false,
  });
}, [usersList, theme]);
```

**对比正确实现：**

* `HorizontalDanmaku.tsx` 正确地从 `danmaku.txt` 读取数据

* `lvjiang/SideDanmaku.tsx` 和 `yuxiaoc/DanmakuTower.tsx` 都正确传入了弹幕文本池

### 影响范围

* 侧边弹幕区域所有弹幕内容都显示为"默认弹幕"

* 不影响飘屏弹幕（HorizontalDanmaku 组件正常工作）

## 修复方案

### 方案概述

为 `SidebarDanmu` 组件添加弹幕数据导入，并将 `textPool` 正确传递给 `DanmakuGenerator`。

### 具体步骤

#### 步骤 1：导入弹幕数据

在 `SidebarDanmu.tsx` 中导入弹幕文本数据：

```typescript
import danmakuText from "../data/danmaku.txt?raw";
```

#### 步骤 2：创建弹幕文本池

使用 `useMemo` 处理弹幕文本数据：

```typescript
const danmakuPool = useMemo(() => {
  return danmakuText.split('\n').filter(line => line.trim());
}, [danmakuText]);
```

#### 步骤 3：修正 DanmakuGenerator 配置

将 `textPool` 参数改为使用导入的弹幕数据：

```typescript
const generator = useMemo(() => {
  return new DanmakuGenerator({
    textPool: danmakuPool,  // ✅ 使用导入的弹幕数据
    users: usersList,
    theme: theme,
    danmakuType: "sidebar",
    randomColor: false,
    randomSize: false,
  });
}, [danmakuPool, usersList, theme]);
```

### 参考实现

参考 `yuxiaoc/DanmakuTower.tsx` 的实现方式。

## 测试验证

### 手动测试

1. 启动开发服务器
2. 访问天通页面（/tiantong）
3. 检查右侧侧边弹幕区域
4. 验证弹幕内容是否为实际的弹幕文本（而非"默认弹幕"）
5. 切换主题（虎将/甜筒），验证弹幕正常显示

### 自动化测试

1. 更新 `SidebarDanmu.test.tsx` 测试文件
2. 添加弹幕数据加载的测试用例
3. 运行现有测试确保无回归

## 文件清单

* 修改：`frontend/src/features/tiantong/components/SidebarDanmu.tsx`

* 测试：`frontend/tests/unit/components/features/tiantong/SidebarDanmu.test.tsx`（如有）

## 注意事项

1. 保持代码风格与现有代码一致
2. 遵循 TDD 原则，先写测试再修改代码
3. 确保弹幕数据文件 `danmaku.txt` 存在且包含有效数据
4. 修改后验证飘屏弹幕不受影响

