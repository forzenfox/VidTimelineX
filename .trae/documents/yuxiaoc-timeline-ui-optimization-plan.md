# Yuxiaoc页面时光轴视图UI排版优化计划

## 变更ID

yuxiaoc-timeline-ui-optimization

## 为什么

当前yuxiaoc页面的时光轴视图（CanteenHall中的timeline模式）存在以下UI排版问题：

1. **时间节点视觉层级不足**：当前节点仅为简单的圆形+序号，缺乏品牌特色和视觉吸引力
2. **时间轴线设计单调**：仅使用简单渐变线条，缺乏游戏风格的动感和发光效果
3. **卡片与轴线连接感弱**：视频卡片与时间节点之间缺乏视觉连接，整体感不强
4. **移动端体验欠佳**：移动端隐藏时间轴后，视频列表缺乏时间线索引导
5. **主题特色不突出**：血怒/混躺双主题在时光轴上的视觉差异不够明显

参考tiantong和lvjiang页面的时光轴实现，以及ui-ux-pro-max技能推荐的Gaming风格设计系统，需要对yuxiaoc的时光轴UI进行全面优化。

## 目标

优化yuxiaoc页面时光轴视图的UI排版，实现：

1. **增强视觉层级**：优化时间节点设计，增加图标和发光效果
2. **强化时间轴线**：添加游戏风格的渐变发光效果
3. **改善卡片连接**：添加卡片与节点之间的视觉连接线
4. **优化移动端体验**：在移动端保留时间线索
5. **突出主题特色**：血怒/混躺主题在时光轴上有明显的视觉区分

## 参考设计

### 来自ui-ux-pro-max技能的设计系统建议

**风格**: Retro-Futurism Gaming风格
- 深色主题配合霓虹强调色
- 发光阴影效果
- 字体: Russo One（标题）+ Chakra Petch（正文）

**配色方案**:
- 血怒主题: 深紫背景(#0F0F23) + 玫瑰红强调(#E11D48)
- 混躺主题: 浅灰背景(#F8FAFC) + 琥珀强调(#D97706)

**关键效果**:
- CRT scanlines效果
- Neon glow（霓虹发光）: text-shadow + box-shadow
- Glitch effects（故障效果）

### 来自tiantong/lvjiang的参考

**时间节点设计**:
- 64x64px圆形节点
- 135度对角渐变背景
- 4px白色边框
- 发光阴影效果
- 主题emoji图标（🐯/🍦、🐷/🐗）

**时间轴线设计**:
- 4px宽度垂直居中
- 主题渐变色彩
- box-shadow发光效果

**卡片布局**:
- 桌面端：左右交替排列（5/12宽度）
- 移动端：全宽垂直列表

## 变更内容

### 优化1: 时间节点视觉升级

**当前实现**:
```tsx
<div className="hidden sm:flex absolute left-1/2 -ml-4 w-8 h-8 rounded-full ...">
  <span className="text-xs text-white font-bold">{index + 1}</span>
</div>
```

**优化方案**:
- 节点尺寸从32px升级到64px
- 添加主题图标（血怒: 🔥/⚔️, 混躺: 🍜/😴）
- 增强发光阴影效果
- 添加hover缩放动画

### 优化2: 时间轴线效果增强

**当前实现**:
```tsx
<div className="absolute left-4 sm:left-1/2 sm:-ml-0.5 w-1 h-full ..." />
```

**优化方案**:
- 添加动态渐变效果
- 增强发光阴影
- 添加CRT扫描线效果（可选）

### 优化3: 卡片与节点连接线

**新增实现**:
- 在卡片与节点之间添加水平连接线
- 使用主题色渐变
- 添加发光效果

### 优化4: 移动端时间线索

**优化方案**:
- 移动端显示简化版时间轴（左侧细线）
- 保留时间节点标记
- 添加时间戳显示

### 优化5: 主题视觉差异化

**血怒主题**:
- 深紫渐变背景
- 玫瑰红强调色(#E11D48)
- 火焰/剑图标
- 强烈的红色发光效果

**混躺主题**:
- 浅灰背景
- 琥珀强调色(#D97706)
- 食物/睡觉图标
- 温暖的橙色发光效果

## 修改文件

### 主要修改文件

1. `frontend/src/features/yuxiaoc/components/CanteenHall.tsx`
   - 优化时光轴视图渲染逻辑
   - 升级时间节点组件
   - 添加卡片与节点连接线
   - 优化移动端布局

### 样式文件

2. `frontend/src/features/yuxiaoc/styles/yuxiaoc.css`
   - 添加时光轴动画关键帧
   - 添加发光效果CSS变量
   - 添加节点hover动画

## 技术实现

### 组件结构

```
CanteenHall (timeline view)
├── TimelineContainer
│   ├── TimelineLine (时间轴线)
│   │   └── GradientGlowEffect
│   └── TimelineNodes
│       └── TimelineNode (每个节点)
│           ├── NodeMarker (节点标记)
│           │   ├── Icon (主题图标)
│           │   └── GlowEffect (发光效果)
│           ├── ConnectorLine (连接线)
│           └── VideoCardWrapper
│               └── VideoCard
```

### 关键样式变量

```css
/* 血怒主题 */
--timeline-line-blood: linear-gradient(to bottom, #E11D48, #9F1239);
--timeline-glow-blood: 0 0 20px rgba(225, 29, 72, 0.6);
--node-bg-blood: linear-gradient(135deg, #E11D48, #9F1239);
--connector-blood: linear-gradient(90deg, #E11D48, transparent);

/* 混躺主题 */
--timeline-line-mix: linear-gradient(to bottom, #D97706, #B45309);
--timeline-glow-mix: 0 0 20px rgba(217, 119, 6, 0.6);
--node-bg-mix: linear-gradient(135deg, #D97706, #B45309);
--connector-mix: linear-gradient(90deg, #D97706, transparent);
```

### 响应式断点

- **桌面端 (≥640px)**: 完整时光轴布局，左右交替
- **平板端 (≥768px)**: 优化间距和尺寸
- **移动端 (<640px)**: 简化时间轴，左侧显示

## 验收标准

### 视觉验收

- [ ] 时间节点尺寸为64x64px，带有主题图标
- [ ] 节点有发光阴影效果
- [ ] 节点hover时有缩放动画
- [ ] 时间轴线有渐变发光效果
- [ ] 卡片与节点之间有连接线
- [ ] 血怒主题使用红色系配色
- [ ] 混躺主题使用橙色系配色

### 交互验收

- [ ] 节点hover时有平滑过渡动画
- [ ] 点击节点可播放视频
- [ ] 移动端有简化版时间轴

### 响应式验收

- [ ] 桌面端：左右交替布局，完整时光轴
- [ ] 移动端：垂直列表，左侧简化时间轴

### 测试验收

- [ ] 单元测试覆盖率 ≥ 80%
- [ ] 所有测试通过
- [ ] TDD流程遵循

## 依赖关系

- 依赖: CanteenHall现有实现
- 依赖: yuxiaoc.css样式文件
- 依赖: VideoCard组件
- 依赖: useVideoView hook

## 实施步骤

1. **Phase 1**: 升级时间节点组件
   - 修改节点尺寸和样式
   - 添加主题图标
   - 添加发光效果

2. **Phase 2**: 优化时间轴线
   - 增强渐变效果
   - 添加发光阴影

3. **Phase 3**: 添加连接线
   - 实现卡片与节点之间的连接线
   - 添加渐变效果

4. **Phase 4**: 优化移动端
   - 实现移动端简化时间轴
   - 测试响应式布局

5. **Phase 5**: 完善主题差异化
   - 调整血怒/混躺主题配色
   - 确保视觉区分明显

6. **Phase 6**: 测试与优化
   - 编写单元测试
   - 视觉回归测试
   - 性能优化
