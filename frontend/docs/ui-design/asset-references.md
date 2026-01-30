# 资产引用文档

## 1. 文档信息

- **文档名称**：资产引用文档
- **版本**：1.0
- **最后更新**：2026-01-28
- **作者**：UI 设计团队
- **适用范围**：亿口甜筒·时光视频集应用

## 2. 资产分类

### 2.1 图像资产

- **Logo**：应用 Logo 和页面 Logo
- **图标**：功能图标、导航图标、装饰图标等
- **视频缩略图**：视频时间线中的缩略图
- **背景图像**：页面背景、卡片背景等
- **装饰图像**：页面边角装饰图标等

### 2.2 字体资产

- **主字体**：应用主要使用的字体
- **辅助字体**：标题、强调文本等使用的字体
- **图标字体**：图标库字体

### 2.3 动画资产

- **CSS 动画**：定义在样式文件中的动画
- **SVG 动画**：SVG 格式的动画
- **GIF 动画**：GIF 格式的动画

### 2.4 样式资产

- **CSS 变量**：主题变量、颜色变量等
- **Tailwind 配置**：Tailwind CSS 配置
- **工具类**：自定义工具类

## 3. 资产引用规格

### 3.1 图像资产引用

#### 3.1.1 Logo

| 资产名称  | 路径                                | 尺寸   | 格式 | 用途         |
| --------- | ----------------------------------- | ------ | ---- | ------------ |
| 甜筒 Logo | `src/assets/logo/tiantong-logo.svg` | 120x40 | SVG  | 甜筒页面头部 |
| 驴酱 Logo | `src/assets/logo/lvjiang-logo.svg`  | 120x40 | SVG  | 驴酱页面头部 |

#### 3.1.2 图标

| 资产名称     | 路径                                | 尺寸  | 格式 | 用途           |
| ------------ | ----------------------------------- | ----- | ---- | -------------- |
| 主题切换图标 | `src/assets/icons/theme-toggle.svg` | 24x24 | SVG  | 主题切换按钮   |
| 搜索图标     | `src/assets/icons/search.svg`       | 20x20 | SVG  | 搜索框         |
| 关闭图标     | `src/assets/icons/close.svg`        | 24x24 | SVG  | 模态框关闭按钮 |
| 播放图标     | `src/assets/icons/play.svg`         | 24x24 | SVG  | 视频播放按钮   |
| 暂停图标     | `src/assets/icons/pause.svg`        | 24x24 | SVG  | 视频暂停按钮   |
| 全屏图标     | `src/assets/icons/fullscreen.svg`   | 24x24 | SVG  | 全屏切换按钮   |
| 音量图标     | `src/assets/icons/volume.svg`       | 24x24 | SVG  | 音量控制按钮   |
| 发送图标     | `src/assets/icons/send.svg`         | 20x20 | SVG  | 弹幕发送按钮   |
| 标签图标     | `src/assets/icons/tab.svg`          | 16x16 | SVG  | 侧边栏标签     |

#### 3.1.3 装饰图标

| 资产名称       | 路径                                      | 尺寸  | 格式 | 用途           |
| -------------- | ----------------------------------------- | ----- | ---- | -------------- |
| 左上角装饰图标 | `src/assets/decorations/top-left.svg`     | 60x60 | SVG  | 页面左上角装饰 |
| 右上角装饰图标 | `src/assets/decorations/top-right.svg`    | 60x60 | SVG  | 页面右上角装饰 |
| 左下角装饰图标 | `src/assets/decorations/bottom-left.svg`  | 60x60 | SVG  | 页面左下角装饰 |
| 右下角装饰图标 | `src/assets/decorations/bottom-right.svg` | 60x60 | SVG  | 页面右下角装饰 |

#### 3.1.4 视频缩略图

| 资产名称   | 路径                                  | 尺寸    | 格式 | 用途           |
| ---------- | ------------------------------------- | ------- | ---- | -------------- |
| 视频缩略图 | `src/assets/thumbnails/{videoId}.jpg` | 320x180 | JPG  | 视频时间线卡片 |

### 3.2 字体资产引用

#### 3.2.1 主要字体

| 字体名称     | 引用方式     | 字重               | 用途           |
| ------------ | ------------ | ------------------ | -------------- |
| Inter        | Google Fonts | 400, 500, 600, 700 | 主要文本、标题 |
| Noto Sans SC | Google Fonts | 400, 500, 600, 700 | 中文文本       |

#### 3.2.2 图标字体

| 字体名称     | 引用方式 | 版本    | 用途     |
| ------------ | -------- | ------- | -------- |
| Lucide React | NPM 包   | 0.360.0 | 功能图标 |

### 3.3 动画资产引用

#### 3.3.1 CSS 动画

| 动画名称  | 定义位置                 | 持续时间 | 用途         |
| --------- | ------------------------ | -------- | ------------ |
| `danmaku` | `src/styles/globals.css` | 8s       | 水平弹幕滚动 |
| `fadeIn`  | `src/styles/globals.css` | 0.5s     | 元素淡入     |
| `slideIn` | `src/styles/globals.css` | 0.3s     | 元素滑入     |
| `pulse`   | `src/styles/globals.css` | 2s       | 脉冲效果     |
| `spin`    | `src/styles/globals.css` | 1s       | 旋转效果     |

### 3.4 样式资产引用

#### 3.4.1 CSS 变量

| 变量名称             | 定义位置                 | 用途       |
| -------------------- | ------------------------ | ---------- |
| `--primary-color`    | `src/styles/globals.css` | 主题主色   |
| `--secondary-color`  | `src/styles/globals.css` | 主题辅色   |
| `--background-color` | `src/styles/globals.css` | 背景色     |
| `--text-color`       | `src/styles/globals.css` | 文本颜色   |
| `--card-background`  | `src/styles/globals.css` | 卡片背景色 |

#### 3.4.2 Tailwind 配置

| 配置项   | 定义位置             | 用途       |
| -------- | -------------------- | ---------- |
| 颜色配置 | `tailwind.config.js` | 主题颜色   |
| 字体配置 | `tailwind.config.js` | 字体家族   |
| 间距配置 | `tailwind.config.js` | 间距系统   |
| 动画配置 | `tailwind.config.js` | 自定义动画 |

## 4. 资产管理最佳实践

### 4.1 图像资产管理

- **使用 SVG 格式**：对于图标和 Logo，优先使用 SVG 格式，保证清晰度和可缩放性
- **适当压缩**：对于 JPG 和 PNG 格式的图像，进行适当的压缩
- **使用占位符**：在开发过程中使用占位符图像
- **懒加载**：对于非首屏图像，使用懒加载

### 4.2 字体资产管理

- **使用字体子集**：只包含应用中使用的字符，减少字体文件大小
- **字体预加载**：对于主要字体，使用 `<link rel="preload">` 预加载
- **字体显示策略**：使用 `font-display` 属性控制字体加载时的显示行为

### 4.3 动画资产管理

- **使用 CSS 动画**：优先使用 CSS 动画而非 JavaScript 动画
- **优化动画性能**：使用 `transform` 和 `opacity` 触发硬件加速
- **合理使用动画**：避免过度使用动画，影响性能

### 4.4 样式资产管理

- **集中管理变量**：将 CSS 变量集中定义在一个文件中
- **模块化样式**：按功能和组件模块化样式文件
- **使用 Tailwind 工具类**：优先使用 Tailwind 工具类，减少自定义 CSS
- **避免样式冲突**：使用 BEM 命名约定或 CSS Modules 避免样式冲突

## 5. 资产引用实现指南

### 5.1 技术实现

1. **图像引用**：
   - 使用相对路径引用图像资产
   - 对于 SVG 格式的图像，可以直接导入为 React 组件
   - 对于较大的图像，使用动态导入

2. **字体引用**：
   - 通过 Google Fonts CDN 引入字体
   - 对于图标字体，使用 NPM 包

3. **动画引用**：
   - 在 CSS 文件中定义动画
   - 使用 `@keyframes` 规则
   - 通过类名应用动画

4. **样式引用**：
   - 使用 CSS 变量实现主题切换
   - 通过 Tailwind 配置扩展默认样式
   - 导入必要的样式文件

### 5.2 最佳实践

1. **资产组织**：
   - 按类型组织资产文件
   - 使用清晰的命名约定
   - 定期清理未使用的资产

2. **性能优化**：
   - 压缩图像和字体文件
   - 使用适当的图像格式
   - 实现资源预加载

3. **可维护性**：
   - 文档化资产使用
   - 建立资产更新流程
   - 使用版本控制管理资产变更

4. **跨环境一致性**：
   - 确保资产在不同环境中显示一致
   - 处理资产加载失败的情况

## 6. 版本控制与变更记录

| 版本 | 日期       | 变更内容     | 作者        |
| ---- | ---------- | ------------ | ----------- |
| 1.0  | 2026-01-28 | 初始文档创建 | UI 设计团队 |

## 7. 参考资料

- **资产目录**：
  - `src/assets/`
  - `src/assets/logo/`
  - `src/assets/icons/`
  - `src/assets/decorations/`
  - `src/assets/thumbnails/`

- **样式文件**：
  - `src/styles/globals.css`
  - `src/features/tiantong/styles/tiantong.css`
  - `src/features/lvjiang/styles/index.css`

- **配置文件**：
  - `tailwind.config.js`
  - `vite.config.ts`
