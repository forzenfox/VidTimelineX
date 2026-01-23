# B站视频集导航网站

## 项目简介

这是一个基于React + TypeScript + Vite + Tailwind CSS构建的纯静态网站，提供两个独立的B站视频集页面：

1. **洞主凯哥视频集**：专门展示与"洞主凯哥"相关的视频内容
2. **亿口甜筒视频集**：专门展示与"亿口甜筒"相关的视频内容

## 技术栈

- **前端框架**：React 19
- **类型系统**：TypeScript 5.9
- **构建工具**：Vite 7
- **样式框架**：Tailwind CSS 4
- **路由管理**：React Router DOM 7
- **UI组件库**：自定义组件

## 项目结构

```
frontend/
├── public/                 # 静态资源
├── src/
│   ├── assets/            # 图片、视频等资源
│   ├── components/        # 通用组件
│   │   └── VideoCard.tsx  # 视频卡片组件
│   ├── data/              # 视频数据
│   │   ├── types.ts       # 类型定义
│   │   ├── dongzhuKaiGeVideos.ts  # 洞主凯哥视频数据
│   │   └── yiKouTianTongVideos.ts # 亿口甜筒视频数据
│   ├── pages/             # 页面组件
│   │   ├── Home.tsx       # 导航页面
│   │   ├── DongZhuKaiGe.tsx  # 洞主凯哥视频集页面
│   │   ├── YiKouTianTong.tsx # 亿口甜筒视频集页面
│   │   └── NotFound.tsx   # 404页面
│   ├── App.tsx            # 应用入口组件
│   ├── main.tsx           # 项目入口文件
│   └── index.css          # 全局样式
├── .gitignore             # Git忽略文件
├── README.md              # 项目说明文档
├── eslint.config.js       # ESLint配置
├── index.html             # HTML模板
├── package.json           # 项目依赖
├── postcss.config.js      # PostCSS配置
├── tailwind.config.js     # Tailwind CSS配置
├── tsconfig.json          # TypeScript配置
└── vite.config.ts         # Vite配置
```

## 功能特性

- ✅ 导航页面，提供清晰的视频集选择
- ✅ 两个独立的视频集页面，内容互不干扰
- ✅ 基于URL路径的页面访问
- ✅ 视频卡片展示，支持点击播放
- ✅ 响应式设计，适配不同设备
- ✅ 404页面处理
- ✅ 支持直接URL访问特定视频集

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173/ 查看网站

### 构建生产版本

```bash
npm run build
```

构建产物将生成在 `dist` 目录中

### 预览构建结果

```bash
npm run preview
```

## 部署到GitHub Pages

### 手动部署

1. 构建生产版本：`npm run build`
2. 将 `dist` 目录的内容推送到GitHub仓库的 `gh-pages` 分支
3. 在GitHub仓库设置中启用GitHub Pages，选择 `gh-pages` 分支作为源

### 自动化部署

可以使用GitHub Actions实现自动化部署，示例配置如下：

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## 视频数据管理

视频数据存储在 `src/data/` 目录下的两个文件中：

1. `dongzhuKaiGeVideos.ts`：洞主凯哥视频集数据
2. `yiKouTianTongVideos.ts`：亿口甜筒视频集数据

### 添加新视频

1. 编辑对应的数据文件
2. 按照以下格式添加视频条目：

```typescript
{
  id: '唯一ID',
  title: '视频标题',
  description: '视频描述',
  url: '视频URL链接',
  thumbnail: '视频缩略图URL',
  date: '发布日期',
  tags: ['标签1', '标签2']
}
```

3. 重新构建项目：`npm run build`
4. 部署更新后的网站

## 自定义配置

### 修改网站标题和描述

编辑 `public/index.html` 文件中的 `<title>` 和 `<meta name="description">` 标签

### 修改主题样式

修改 `tailwind.config.js` 文件中的主题配置，或直接在组件中使用Tailwind CSS类

### 修改路由配置

编辑 `src/App.tsx` 文件中的路由配置

## 浏览器兼容性

- Chrome (最新2个版本)
- Firefox (最新2个版本)
- Safari (最新2个版本)
- Edge (最新2个版本)

## 许可证

MIT

## 贡献

欢迎提交Issue和Pull Request

## 联系方式

如有问题或建议，请通过以下方式联系：

- GitHub Issues：https://github.com/你的用户名/仓库名称/issues

## 更新日志

### v1.0.0 (2026-01-24)
- 初始版本发布
- 实现导航页面
- 实现洞主凯哥视频集页面
- 实现亿口甜筒视频集页面
- 实现404页面
- 支持基于URL的页面访问
- 响应式设计适配不同设备