## 当前实现分析

HeroSection.tsx 第259-297行是CTA按钮区域，目前有两个按钮：
1. "进入直播间" - 链接到斗鱼直播间
2. "浏览食堂" - 滚动到食堂区域

## 修改方案

在现有两个按钮下方，增加一行两个新按钮：
1. **鱼吧链接** - 链接到斗鱼鱼吧
2. **B站合集** - 链接到B站空间

### 样式设计
- 使用与"浏览食堂"按钮类似的样式（次要按钮样式）
- 使用 flex 布局，两个按钮并排
- 添加对应图标（MessageCircle 和 PlayCircle）
- 响应式：移动端垂直排列，桌面端水平排列

### 修改位置
HeroSection.tsx 第297行后，在 `</div>` 之前插入新的按钮组

## 具体修改

```tsx
{/* Secondary Links */}
<div className="flex flex-col sm:flex-row gap-4 justify-center">
  <a
    href="https://yuba.douyu.com/group/123456"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 hover:scale-105"
    style={{
      background: isBlood ? "rgba(30, 27, 75, 0.6)" : "#FFFFFF",
      color: isBlood ? "#E2E8F0" : "#0F172A",
      border: isBlood ? "1px solid rgba(225, 29, 72, 0.4)" : "1px solid #E2E8F0",
    }}
  >
    <MessageCircle className="w-4 h-4" />
    <span>鱼吧链接</span>
  </a>
  <a
    href="https://space.bilibili.com/xxx"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 hover:scale-105"
    style={{
      background: isBlood ? "rgba(30, 27, 75, 0.6)" : "#FFFFFF",
      color: isBlood ? "#E2E8F0" : "#0F172A",
      border: isBlood ? "1px solid rgba(225, 29, 72, 0.4)" : "1px solid #E2E8F0",
    }}
  >
    <PlayCircle className="w-4 h-4" />
    <span>B站合集</span>
  </a>
</div>
```

## 需要导入的图标
确保从 lucide-react 导入 MessageCircle 和 PlayCircle（Header.tsx 中已有，可以直接复用）