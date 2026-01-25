# Bilibili视频时光轴项目

## 项目概述

本项目是一个个人非商用的视频爬取、审核和发布系统，用于从B站根据关键词搜索视频，爬取视频信息，经过人工审核后生成时光轴并部署到GitHub Pages。

### 核心功能

- **自动化爬取**：定时从B站搜索并爬取视频信息
- **人工审核**：通过Flask审核界面管理视频数据
- **时光轴展示**：在前端以时光轴形式展示审核通过的视频
- **GitHub Pages部署**：支持将前端部署到GitHub Pages

## 技术栈

### 前端
- React 19 + Vite
- Tailwind CSS
- React Router
- TypeScript
- Radix UI
- Jest

### 后端
- Python
- Flask
- BeautifulSoup4
- Requests

### 数据存储
- JSON文件存储（适用于个人非商用项目）

### 部署
- GitHub Pages

## 系统架构

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Bilibili API   │ ──> │  后端爬取脚本   │ ──> │  审核界面       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                      │
                                                      ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ GitHub Pages    │ <── │  前端构建       │ <── │  数据存储       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## 安装和配置

### 1. 环境要求

- Python 3.8+
- Node.js 16+
- npm 7+

### 2. 后端安装

```bash
# 进入后端目录
cd backend

# 安装依赖
pip install -r requirements.txt
```

### 3. 前端安装

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install
```

## 使用说明

### 1. 自动化爬取

```bash
# 进入后端目录
cd backend

# 运行爬取脚本
python auto_crawler.py
```

### 2. 审核界面

```bash
# 进入后端目录
cd backend

# 运行审核界面
python test_review_interface.py

# 打开浏览器访问
# http://localhost:5000
```

### 3. 前端开发

```bash
# 进入前端目录
cd frontend

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 部署指南

### GitHub Pages部署

1. **构建前端**：
   ```bash
   cd frontend
   npm run build
   ```

2. **创建gh-pages分支**：
   ```bash
   git checkout -b gh-pages
   ```

3. **添加构建产物**：
   ```bash
   git add dist/*
   git commit -m "Deploy to GitHub Pages"
   ```

4. **推送分支**：
   ```bash
   git push origin gh-pages
   ```

5. **配置GitHub Pages**：
   - 进入GitHub仓库设置
   - 选择"Pages"
   - 源设置为"gh-pages分支"
   - 保存设置

6. **访问网站**：
   等待部署完成后，通过GitHub Pages提供的URL访问网站。

## 项目结构

```
├── backend/                # 后端代码
│   ├── data/               # 数据存储目录
│   │   ├── approved.json   # 已审核通过的视频数据
│   │   ├── pending.json    # 待审核的视频数据
│   │   └── rejected.json   # 已拒绝的视频数据
│   ├── templates/          # HTML模板
│   ├── auto_crawler.py     # 自动化爬取脚本
│   ├── crawl_metadata.py   # 爬取视频元数据
│   ├── download_thumbs.py  # 下载视频缩略图
│   ├── test_search_api.py  # 搜索API测试
│   ├── test_video_metadata.py  # 视频元数据测试
│   ├── test_storage_solutions.py  # 存储方案测试
│   └── test_review_interface.py  # 审核界面测试
├── frontend/               # 前端代码
│   ├── src/                # 源代码
│   │   ├── app/            # 应用核心配置
│   │   ├── components/     # 组件
│   │   ├── features/       # 功能模块
│   │   ├── hooks/          # 自定义钩子
│   │   └── styles/         # 样式文件
│   ├── tests/              # 测试文件
│   ├── .env.development    # 开发环境变量
│   ├── package.json        # 依赖配置
│   ├── vite.config.ts      # Vite配置
│   ├── tailwind.config.js  # Tailwind CSS配置
│   └── tsconfig.json       # TypeScript配置
├── data/                   # 共享数据
│   ├── bv.txt              # BV号列表
│   ├── config.json         # 配置文件
│   └── timeline.json       # 时光轴数据
├── docs/                   # 文档
│   ├── 前端编码规范.md       # 前端编码规范
│   ├── 后端编码规范.md       # 后端编码规范
│   ├── 法律法规与合规性调研报告.md  # 合规性调研报告
│   ├── 自动化爬取构建发布技术方案.md  # 技术方案
│   └── 项目分析文档.md        # 项目分析文档
├── media/                  # 媒体资源
│   └── thumbs/             # 视频缩略图
└── README.md               # 项目文档
```

## 维护和更新

### 1. 更新爬取关键词

编辑 `backend/auto_crawler.py` 文件中的关键词列表：

```python
# 配置关键词
keywords = ["原神", "崩坏星穹铁道", "塞尔达传说"]
```

### 2. 更新爬取频率

可以使用系统的定时任务工具（如crontab或Windows任务计划程序）来定期运行爬取脚本。

### 3. 更新前端界面

修改前端组件文件，添加新功能或优化用户体验。

## 法律法规合规性

本项目为个人非商用项目，严格遵守以下原则：

- **合理使用**：仅用于个人学习、研究目的
- **遵守robots.txt**：尊重B站的爬虫协议
- **低频率请求**：避免对服务器造成负担
- **仅提供链接**：不存储视频内容，仅提供跳转链接
- **保护个人信息**：不收集和存储用户个人敏感信息

详细的合规性分析请参考 `docs/法律法规与合规性调研报告.md`。

## 常见问题和解决方案

### 1. 爬取失败

**原因**：可能是网络问题、B站反爬机制或页面结构变化。

**解决方案**：
- 检查网络连接
- 增加请求延迟
- 更新爬取代码以适应页面结构变化

### 2. 审核界面无法启动

**原因**：可能是Flask未安装或依赖版本冲突。

**解决方案**：
- 确保安装了Flask
- 升级Flask到与Jinja2兼容的版本

### 3. 前端无法加载数据

**原因**：可能是timeline.json文件不存在或格式错误。

**解决方案**：
- 运行审核界面并生成时间线数据
- 检查timeline.json文件格式

### 4. GitHub Pages部署失败

**原因**：可能是构建配置错误或分支设置问题。

**解决方案**：
- 检查Vite配置中的base路径
- 确保gh-pages分支正确设置

## 开发指南

### 代码风格

- 前端：遵循React Hooks + TypeScript风格，使用ESLint和Prettier进行代码检查和格式化
- 后端：遵循PEP 8代码风格

### 提交规范

- 使用清晰的提交信息
- 按功能模块提交代码
- 提交前运行测试

### 测试建议

- 定期运行爬取脚本测试
- 测试审核界面功能
- 验证前端构建和部署流程

## 未来计划

- **自动化部署**：设置GitHub Actions实现自动构建和部署
- **数据持久化**：考虑使用SQLite提升数据存储性能
- **用户体验**：优化前端界面，添加更多交互功能
- **监控系统**：添加简单的监控和日志记录

## 许可证

本项目为个人非商用项目，仅供学习和研究使用。

## 联系方式

如有问题或建议，欢迎联系项目维护者。

---

**注意**：本项目为个人非商用项目，使用时请严格遵守相关法律法规和平台规则。