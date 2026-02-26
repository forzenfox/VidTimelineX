# UI分析与原型设计计划

## 项目概述

**项目名称**: 时光影像馆 (VidTimelineX)  
**项目类型**: React + TypeScript 前端应用  
**目标**: 使用DevTools对网站进行全面UI分析，并在Pencil中创建高保真原型设计稿

---

## 一、网站结构分析

### 1.1 页面架构

网站包含以下主要页面：

| 页面 | 路由 | 描述 | 主题色 |
|------|------|------|--------|
| 首页 (Home) | `/` | 导航入口，展示三个子站点卡片 | 渐变色 (粉紫橙) |
| 驴酱档案馆 | `/lvjiang` | 洞主、凯哥视频集 | 蓝色系 (洞主) / 红色系 (凯哥) |
| 甜筒时光机 | `/tiantong` | 亿口甜筒视频集 | 橙色虎纹 (老虎) / 粉色 (甜美) |
| C皇荣耀殿 | `/yuxiaoc` | 余小C视频集 | 深色血怒 / 亮色混躺 |

### 1.2 技术栈

- **框架**: React 18 + TypeScript
- **样式**: Tailwind CSS 4.x
- **构建工具**: Vite
- **UI组件**: Radix UI + shadcn/ui
- **图标**: Lucide React
- **路由**: React Router DOM

---

## 二、UI设计系统分析

### 2.1 色彩方案

#### 首页 (HomePage) 色彩
```css
/* 背景渐变 */
background: linear-gradient(135deg, #FDF2F8 0%, #FFF7ED 25%, #FEF3C7 50%, #FDF2F8 75%, #FFF7ED 100%);

/* 主色调 */
--home-primary: #ec4899 (粉色)
--home-secondary: #f97316 (橙色)
--home-accent: #8b5cf6 (紫色)

/* 卡片光效 */
驴酱卡片: #3b82f6 (蓝色光晕)
甜筒卡片: #ec4899 (粉色光晕)
C皇卡片: #e11d48 (红色光晕)
```

#### 驴酱档案馆 (Lvjiang) 双主题

**洞主主题 (dongzhu) - 明亮模式:**
```css
--background: linear-gradient(to bottom, #FFFEF7, #FFF9E6)
--accent: #3498DB (蓝色)
--text: #5D6D7E (灰蓝)
--border: #AED6F1 (浅蓝)
```

**凯哥主题 (kaige) - 深色模式:**
```css
--background: linear-gradient(to bottom, #1A1A2E, #0F3460)
--accent: #E74C3C (红色)
--text: #ECF0F1 (白色)
--border: #E74C3C (红色)
```

#### 甜筒时光机 (Tiantong) 双主题

**老虎主题 (tiger):**
```css
--background: #2c3e50 (深蓝灰)
--primary: #e67e22 (橙色)
--secondary: #f39c12 (金黄)
--card: #34495e
--border: #e67e22
```

**甜美主题 (sweet):**
```css
--background: rgb(255, 248, 220) (奶油色)
--primary: rgb(255, 140, 180) (粉色)
--secondary: rgb(255, 215, 0) (金色)
--card: rgb(255, 255, 255)
--border: rgb(255, 230, 150)
```

#### C皇荣耀殿 (Yuxiaoc) 双主题

**血怒模式 (blood):**
```css
--background: #0F0F23 (深蓝黑)
--backgroundGradient: linear-gradient(180deg, #0F0F23 0%, #1E1B4B 100%)
--textPrimary: #E2E8F0
--textSecondary: #94A3B8
--accent: #E11D48 (红色)
--accentSecondary: #F59E0B (橙色)
--border: rgba(225, 29, 72, 0.3)
```

**混躺模式 (mix):**
```css
--background: #F8FAFC
--backgroundGradient: linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)
--textPrimary: #0F172A
--textSecondary: #334155
--accent: #D97706 (琥珀色)
--accentSecondary: #2563EB (蓝色)
--border: rgba(226, 232, 240, 0.8)
```

### 2.2 字体系统

```css
/* 显示字体 - 标题 */
font-family: "Righteous", cursive;

/* 正文字体 */
font-family: "Poppins", sans-serif;

/* 中文回退 */
font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "PingFang SC", "Microsoft YaHei", sans-serif;
```

**字体层级:**
- 页面主标题: 5xl-7xl (48-72px), font-display
- 页面副标题: xl-2xl (20-24px), font-body
- 卡片标题: 2xl (24px), font-bold
- 正文内容: base (16px), font-normal
- 标签/徽章: xs (12px), font-medium

### 2.3 间距系统

基于 Tailwind CSS 默认间距:
- `p-4`: 16px
- `p-6`: 24px
- `p-8`: 32px
- `gap-4`: 16px
- `gap-6`: 24px
- `gap-8`: 32px
- `rounded-3xl`: 24px (卡片圆角)
- `rounded-2xl`: 16px (按钮圆角)
- `rounded-full`: 9999px (圆形元素)

### 2.4 组件规范

#### 玻璃拟态卡片 (Glass Card)
```css
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6);
  border-radius: 24px;
  padding: 32px;
}
```

#### 导航卡片 (Bento Grid Card)
- 宽度: 自适应 (grid-cols-1 md:grid-cols-3)
- 内边距: 32px (p-8)
- 圆角: 24px (rounded-3xl)
- 悬停效果: translateY(-8px), 发光阴影

#### 视频卡片 (Video Card)
- 缩略图: 16:9 比例
- 圆角: 12-16px
- 阴影: 0 4px 6px rgba(0,0,0,0.1)
- 悬停: scale(1.02), 阴影增强

#### 徽章/标签 (Badge)
- 内边距: px-3 py-1 (12px 4px)
- 圆角: rounded-full
- 字体: 12px, medium

---

## 三、页面详细分析

### 3.1 首页 (HomePage)

**布局结构:**
```
┌─────────────────────────────────────────┐
│           装饰性背景元素                 │
│    (浮动光斑 + 网格纹理)                 │
├─────────────────────────────────────────┤
│                                         │
│     ┌─────────────────────────┐         │
│     │    Sparkles 标签        │         │
│     │    "发现精彩 · 珍藏时光" │         │
│     └─────────────────────────┘         │
│                                         │
│         时光影像馆 (主标题)              │
│    珍藏每一个精彩瞬间... (副标题)        │
│                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │ 驴酱档案 │ │ 甜筒时光 │ │ C皇荣耀  │ │
│  │   馆     │ │   机     │ │   殿     │ │
│  │ [Users]  │ │ [Heart]  │ │ [Crown]  │ │
│  │ [标签组] │ │ [标签组] │ │ [标签组] │ │
│  └──────────┘ └──────────┘ └──────────┘ │
│                                         │
│         © 2026 时光影像馆               │
│                                         │
└─────────────────────────────────────────┘
```

**关键尺寸:**
- 主标题: text-5xl sm:text-6xl lg:text-7xl
- 卡片图标: w-24 h-24 (96px)
- 卡片间距: gap-6 lg:gap-8
- 页面内边距: p-4 sm:p-6 lg:p-8

### 3.2 驴酱档案馆 (LvjiangPage)

**布局结构:**
```
┌─────────────────────────────────────────┐
│  [HorizontalDanmaku - 顶部飘屏弹幕]      │
├─────────────────────────────────────────┤
│  Header (Logo + 主题切换按钮)            │
├─────────────────────────────────────────┤
│                                         │
│  [装饰背景 - 随机脚印/斜纹]              │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │      VideoTimeline              │    │
│  │  (视频时间线列表)                │    │
│  └─────────────────────────────────┘    │
│                                         │
│  [标签云 - 经典梗]                       │
│                                         │
│  Footer                                 │
│                                         │
├─────────────────────────────────────────┤
│  [SideDanmaku - 右侧弹幕栏]             │
└─────────────────────────────────────────┘
```

**主题切换:**
- 洞主: 明亮暖色调，🐾 脚印装饰
- 凯哥: 深色冷色调，斜纹装饰

### 3.3 甜筒时光机 (TiantongPage)

**布局结构:**
```
┌─────────────────────────────────────────┐
│  [HorizontalDanmaku]                    │
├─────────────────────────────────────────┤
│  Fixed Header                           │
│  ┌──────┬──────────────┬──────────────┐ │
│  │Avatar│ 亿口甜筒     │  Search    │ │
│  │ LIVE │ 威虎大将军   │  [输入框]   │ │
│  │      │ 12195609     │         [🌙]│ │
│  └──────┴──────────────┴──────────────┘ │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────────┬─────────────────┐ │
│  │                  │                 │ │
│  │  VideoTimeline   │  SidebarDanmu   │ │
│  │  (主内容区)       │  (侧边栏弹幕)    │ │
│  │                  │                 │ │
│  └──────────────────┴─────────────────┘ │
│                                         │
│  Footer                                 │
│                                         │
└─────────────────────────────────────────┘
```

**关键特性:**
- 固定头部，滚动时背景透明度变化
- 搜索框带历史记录和建议
- 响应式布局 (md:flex-row)
- 主内容区: flex-1, 侧边栏: w-80 lg:w-96

### 3.4 C皇荣耀殿 (YuxiaocPage)

**布局结构:**
```
┌─────────────────────────────────────────┐
│  [CRT Scanline Overlay]                 │
│  [HorizontalDanmaku]                    │
├─────────────────────────────────────────┤
│  Header (主题切换)                       │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐    │
│  │       HeroSection               │    │
│  │   (C皇头像 + 标题 + 副标题)      │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │       TitleHall                 │    │
│  │   (称号殿堂 - 网格展示)          │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │       CanteenHall               │    │
│  │   (食堂集锦 - 视频卡片)          │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │       CVoiceArchive             │    │
│  │   (C音档案馆)                   │    │
│  └─────────────────────────────────┘    │
│                                         │
│  Footer                                 │
│                                         │
├─────────────────────────────────────────┤
│  [DanmakuTower - 右侧固定弹幕]          │
└─────────────────────────────────────────┘
```

**关键特性:**
- CRT扫描线效果覆盖层
- 右侧固定弹幕塔 (桌面端 320px)
- 主内容区响应式 padding-right

---

## 四、交互元素分析

### 4.1 动画效果

| 动画名称 | 描述 | 时长 | 应用位置 |
|---------|------|------|---------|
| fadeInUp | 淡入上滑 | 0.6s | 页面元素入场 |
| heartbeat | 心跳缩放 | 1.5s | 甜筒卡片图标 |
| crown-shine | 皇冠闪烁 | 2s | C皇卡片图标 |
| float-glow | 悬浮光晕 | 3s | 驴酱卡片图标 |
| gradient-flow | 背景流动 | 15s | 首页背景 |
| danmaku | 弹幕飘屏 | 8s | 水平弹幕 |

### 4.2 悬停效果

- 卡片: translateY(-8px) + 发光阴影
- 按钮: 背景渐变 + 光泽扫过效果
- 链接: 颜色变化 + 下划线

### 4.3 主题切换

所有子页面支持双主题切换：
- 驴酱: 洞主 ↔ 凯哥
- 甜筒: 老虎 ↔ 甜美
- C皇: 血怒 ↔ 混躺

---

## 五、原型设计实施计划

### 5.1 设计工具

- **工具**: Pencil (MCP)
- **画布尺寸**: 1440px 宽度 (桌面端)
- **设计风格**: 现代、渐变、玻璃拟态

### 5.2 原型页面清单

1. **首页 (Home)** - 导航入口
2. **驴酱档案馆 (Lvjiang)** - 双主题版本
3. **甜筒时光机 (Tiantong)** - 双主题版本
4. **C皇荣耀殿 (Yuxiaoc)** - 双主题版本

### 5.3 组件库创建

需要创建的可复用组件：
- [ ] GlassCard - 玻璃拟态卡片
- [ ] NavCard - 导航卡片 (带图标)
- [ ] VideoCard - 视频卡片
- [ ] Badge - 标签徽章
- [ ] Header - 页面头部
- [ ] Footer - 页面底部
- [ ] SearchBar - 搜索框
- [ ] ThemeToggle - 主题切换按钮
- [ ] DanmakuBar - 弹幕栏

### 5.4 色彩变量定义

```javascript
// 首页色彩
const homeColors = {
  background: "linear-gradient(135deg, #FDF2F8 0%, #FFF7ED 25%, #FEF3C7 50%, #FDF2F8 75%, #FFF7ED 100%)",
  primary: "#ec4899",
  secondary: "#f97316",
  accent: "#8b5cf6",
  glassBg: "rgba(255, 255, 255, 0.7)",
  glassBorder: "rgba(255, 255, 255, 0.5)"
};

// 驴酱-洞主
const dongzhuColors = {
  background: "linear-gradient(to bottom, #FFFEF7, #FFF9E6)",
  accent: "#3498DB",
  text: "#5D6D7E"
};

// 驴酱-凯哥
const kaigeColors = {
  background: "linear-gradient(to bottom, #1A1A2E, #0F3460)",
  accent: "#E74C3C",
  text: "#ECF0F1"
};

// 甜筒-老虎
const tigerColors = {
  background: "#2c3e50",
  primary: "#e67e22",
  card: "#34495e"
};

// 甜筒-甜美
const sweetColors = {
  background: "rgb(255, 248, 220)",
  primary: "rgb(255, 140, 180)",
  card: "rgb(255, 255, 255)"
};

// C皇-血怒
const bloodColors = {
  background: "#0F0F23",
  accent: "#E11D48",
  text: "#E2E8F0"
};

// C皇-混躺
const mixColors = {
  background: "#F8FAFC",
  accent: "#D97706",
  text: "#0F172A"
};
```

---

## 六、实施步骤（更新版）

### 阶段1: 批量创建所有.pen文件
**策略**: 先创建所有文件框架，再填充内容

1. 创建 `homepage-v1.pen`
2. 创建 `lvjiang-dongzhu-v1.pen`
3. 创建 `lvjiang-kaige-v1.pen`
4. 创建 `tiantong-tiger-v1.pen`
5. 创建 `tiantong-sweet-v1.pen`
6. 创建 `yuxiaoc-blood-v1.pen`
7. 创建 `yuxiaoc-mix-v1.pen`

### 阶段2: 填充首页原型内容
1. 创建背景渐变
2. 添加装饰元素
3. 创建导航卡片
4. 添加动画标注

### 阶段3: 填充驴酱档案馆原型
1. 洞主主题版本
2. 凯哥主题版本

### 阶段4: 填充甜筒时光机原型
1. 老虎主题版本
2. 甜美主题版本

### 阶段5: 填充C皇荣耀殿原型
1. 血怒主题版本
2. 混躺主题版本

### 阶段6: 导出与保存
1. 导出所有原型文件
2. 保存到指定目录 `d:\File\workSpace\AI-test\VidTimelineX\docs\design\prototypes\`
3. 创建设计说明文档

---

## 七、文件输出规范

### 7.1 输出目录

```
d:\File\workSpace\AI-test\VidTimelineX\docs\design\prototypes\
```

### 7.2 文件命名规范

| 序号 | 文件名 | 描述 |
|------|--------|------|
| 1 | `homepage-v1.pen` | 首页原型 |
| 2 | `lvjiang-dongzhu-v1.pen` | 驴酱-洞主主题 |
| 3 | `lvjiang-kaige-v1.pen` | 驴酱-凯哥主题 |
| 4 | `tiantong-tiger-v1.pen` | 甜筒-老虎主题 |
| 5 | `tiantong-sweet-v1.pen` | 甜筒-甜美主题 |
| 6 | `yuxiaoc-blood-v1.pen` | C皇-血怒主题 |
| 7 | `yuxiaoc-mix-v1.pen` | C皇-混躺主题 |

### 7.3 版本管理

- 版本号格式: v1, v2, v3...
- 每次重大修改递增版本号
- 保留历史版本供对比

---

## 八、设计原则

1. **一致性**: 保持各页面视觉风格统一
2. **可访问性**: 确保色彩对比度符合WCAG标准
3. **响应式**: 考虑桌面端和移动端适配
4. **交互性**: 标注关键交互动效
5. **可维护性**: 组件化设计，便于后续修改

---

## 九、注意事项

1. 所有渐变背景使用CSS linear-gradient
2. 玻璃拟态效果需标注 backdrop-filter
3. 主题切换需展示两种状态的对比
4. 弹幕效果用文字标注动画方向
5. 图片占位符使用统一尺寸比例

---

**计划制定日期**: 2026-02-26  
**实施策略**: 先创建所有.pen文件，再逐个填充内容  
**预计完成时间**: 4-6小时 (包含所有主题变体)
