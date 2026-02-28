# 视图切换界面全面UI优化计划

## 项目概述

运用专业的UI/UX设计技能（ui-ux-pro-max），对视图切换界面（View Switching UI）进行全面的UI优化，确保在不同页面和不同主题模式下保持统一的UI风格与视觉样式。

***

## \[x] 任务1: 优化边框系统 - 颜色与粗细统一

* **Priority**: P0

* **Depends On**: None

* **Description**:

  * 确保视图切换组件的边框颜色与当前激活的主题方案精确匹配

  * 根据主题规范统一视图切换组件的边框宽度（1px）

  * 使用 `--border` CSS 变量确保边框在所有主题下正确显示

  * 移除可能导致布局抖动的 `scale-105` 变换（根据 ui-ux-pro-max 建议）

* **Success Criteria**:

  * 边框颜色在所有主题下精确匹配主题变量

  * 边框粗细统一为1px

  * 无布局抖动问题

* **Test Requirements**:

  * `programmatic` TR-1.1: 使用 `--border` CSS 变量

  * `human-judgement` TR-1.2: 所有主题下边框颜色正确

  * `human-judgement` TR-1.3: hover 状态无布局移位

* **Notes**: 遵循 ui-ux-pro-max 建议："No layout shift on hover states"

***

## \[x] 任务2: 建立清晰的视觉层次

* **Priority**: P0

* **Depends On**: 任务1

* **Description**:

  * 通过边框样式、阴影和背景色区分激活状态与非激活状态

  * 激活按钮：使用 `bg-primary` + `text-primary-foreground` + 柔和阴影

  * 非激活按钮：使用 `bg-transparent` + `text-muted-foreground`

  * 确保激活状态的视觉权重明显高于非激活状态

* **Success Criteria**:

  * 激活状态与非激活状态视觉对比明显

  * 激活状态的视觉权重突出

* **Test Requirements**:

  * `human-judgement` TR-2.1: 激活状态视觉上更突出

  * `programmatic` TR-2.2: 使用 `--primary` 和 `--muted-foreground` 变量

* **Notes**: 建立清晰的视觉层级关系

***

## \[x] 任务3: 优化交互反馈与过渡动画

* **Priority**: P0

* **Depends On**: 任务2

* **Description**:

  * 优化视图切换时的过渡动画（150-300ms）

  * 确保动画与整体主题风格协调

  * 使用 `transition-colors` 替代 `transition-all` 更精确

  * 实现 `prefers-reduced-motion` 支持（无障碍）

  * 使用颜色/透明度过渡替代缩放变换

* **Success Criteria**:

  * 过渡动画流畅自然（200ms）

  * 支持无障碍动效设置

  * 无布局抖动

* **Test Requirements**:

  * `programmatic` TR-3.1: 过渡时间 150-300ms

  * `programmatic` TR-3.2: 使用 `transition-colors`

  * `programmatic` TR-3.3: 实现 `prefers-reduced-motion` 支持

  * `human-judgement` TR-3.4: 动画感觉响应迅速不拖沓

* **Notes**: 遵循 ui-ux-pro-max 建议："Use color/opacity transitions, avoid scale transforms"

***

## \[x] 任务4: 响应式适配优化

* **Priority**: P1

* **Depends On**: 任务3

* **Description**:

  * 确保优化后的视图切换UI在不同屏幕尺寸和设备上均能保持一致的视觉表现和用户体验

  * 优化移动端视图（375px）

  * 优化平板视图（768px）

  * 优化桌面视图（1024px, 1440px）

  * 确保无水平滚动

* **Success Criteria**:

  * 在所有屏幕尺寸下视觉表现一致

  * 无布局问题或水平滚动

* **Test Requirements**:

  * `human-judgement` TR-4.1: 375px 下显示正常

  * `human-judgement` TR-4.2: 768px 下显示正常

  * `human-judgement` TR-4.3: 1024px 下显示正常

  * `human-judgement` TR-4.4: 1440px 下显示正常

* **Notes**: 遵循 ui-ux-pro-max 建议："Responsive at 375px, 768px, 1024px, 1440px"

***

## \[x] 任务5: 主题切换兼容性验证

* **Priority**: P0

* **Depends On**: 任务4

* **Description**:

  * 验证视图切换UI在所有主题下的显示效果

  * Tiantong 页面：tiger 主题（深色）、sweet 主题（亮色）

  * Lvjiang 页面：dongzhu 主题（亮色）、kaige 主题（深色）

  * Yuxiaoc 页面：blood 主题、mix 主题

  * 验证主题切换过程中的过渡效果和样式一致性

* **Success Criteria**:

  * 在所有主题下视觉表现一致

  * 主题切换无视觉断层或样式错乱

* **Test Requirements**:

  * `human-judgement` TR-5.1: tiger 主题下显示正常

  * `human-judgement` TR-5.2: sweet 主题下显示正常

  * `human-judgement` TR-5.3: dongzhu 主题下显示正常

  * `human-judgement` TR-5.4: kaige 主题下显示正常

  * `human-judgement` TR-5.5: blood/mix 主题下显示正常

* **Notes**: 确保所有主题下视觉风格统一

***

## \[x] 任务6: 更新单元测试

* **Priority**: P1

* **Depends On**: 任务5

* **Description**:

  * 更新 ViewSwitcher.test.tsx 测试用例

  * 确保测试覆盖新的样式改进

  * 验证无布局抖动（无 scale 变换）

* **Success Criteria**:

  * 所有测试通过

* **Test Requirements**:

  * `programmatic` TR-6.1: npm run test:unit 通过

* **Notes**: 遵循 TDD 流程

***

## \[x] 任务7: 代码格式化和静态检查

* **Priority**: P1

* **Depends On**: 任务6

* **Description**:

  * 运行 Prettier 进行代码格式化

  * 运行 ESLint 进行静态代码检查

* **Success Criteria**:

  * 代码格式化完成

  * 无 lint 错误

* **Test Requirements**:

  * `programmatic` TR-7.1: npm run lint 通过

  * `programmatic` TR-7.2: prettier --check 通过

* **Notes**: 遵循项目的编码规范

***

## 设计规范总结

### 边框系统

| 元素   | 边框样式                        | 说明     |
| ---- | --------------------------- | ------ |
| 容器边框 | `border-border`             | 使用主题变量 |
| 边框粗细 | `1px`                       | 统一粗细   |
| 圆角   | `rounded-xl` / `rounded-lg` | 容器/按钮  |

### 视觉层次

| 状态    | 背景               | 文字                        | 阴影                            |
| ----- | ---------------- | ------------------------- | ----------------------------- |
| 激活    | `bg-primary`     | `text-primary-foreground` | `shadow-md shadow-primary/20` |
| 非激活   | `bg-transparent` | `text-muted-foreground`   | 无                             |
| Hover | `bg-muted/50`    | `text-foreground`         | 无                             |

### 动画规范

| 属性   | 值                        | 说明           |
| ---- | ------------------------ | ------------ |
| 过渡时间 | 200ms                    | 150-300ms 范围 |
| 缓动函数 | `ease-out`               | 进入动画         |
| 过渡属性 | `transition-colors`      | 避免 scale 变换  |
| 无障碍  | `prefers-reduced-motion` | 尊重用户设置       |

### 响应式断点

| 断点     | 说明  |
| ------ | --- |
| 375px  | 移动端 |
| 768px  | 平板  |
| 1024px | 桌面  |
| 1440px | 大屏  |

***

## ui-ux-pro-max 专业设计建议要点

### ❌ 反模式（避免）

* 使用 `scale-105` 等缩放变换（会导致布局抖动）

* 使用 `transition-all`（太宽泛）

* 动画时间 > 500ms（太慢）

### ✅ 最佳实践

* 使用 `transition-colors duration-200`

* 使用颜色/透明度过渡替代缩放

* 所有可点击元素有 `cursor-pointer`

* Focus 状态对键盘导航友好

* 尊重 `prefers-reduced-motion` 设置

***

## 验收标准

1. ✅ 边框颜色与所有主题精确匹配
2. ✅ 边框粗细统一为1px
3. ✅ 激活状态与非激活状态视觉层次清晰
4. ✅ 过渡动画流畅自然（200ms）
5. ✅ 无布局抖动问题
6. ✅ 支持 `prefers-reduced-motion` 无障碍设置
7. ✅ 在所有屏幕尺寸下表现一致
8. ✅ 在所有主题下视觉风格统一
9. ✅ 所有单元测试通过
10. ✅ 代码格式化和 lint 检查通过

