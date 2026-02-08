# VidTimelineX - B站视频时间线系统

> **📁 项目文档导航**
> - **本文档**：项目全局说明、架构概览、快速开始
> - **后端README**：后端架构详细技术文档、TDD开发流程、使用说明 → [查看](./backend/README.md)
> - **前端README**：前端架构详细技术文档、组件说明、开发指南 → [查看](./frontend/README.md)

基于TDD方法开发的B站收藏夹视频时间线系统，支持自动爬取收藏夹视频、生成时间线数据，采用前后端分离架构。

## 系统架构

```
VidTimelineX/
├── backend/           # 后端目录
│   ├── src/           # 后端源码
│   ├── tests/         # 后端测试
│   ├── main.py        # 主更新脚本
│   └── README.md      # 后端详细文档
├── frontend/          # 前端目录
│   ├── src/           # 前端源码
│   ├── public/        # 前端静态资源
│   ├── tests/         # 前端测试
│   └── README.md      # 前端详细文档
├── docs/              # 项目文档
└── README.md          # 项目根目录文档
```

## 核心功能

1. **B站收藏夹自动爬取** - 自动爬取B站收藏夹视频，支持多个收藏夹并行管理
2. **时间线数据生成** - 按发布日期排序，生成符合前端格式的 videos.json
3. **封面图片管理** - 自动下载视频封面图片，支持批量下载和智能去重
4. **前端文件自动更新** - 自动更新前端 videos.json 文件，保留 tags 字段
5. **视频时间线展示** - 驴酱时间轴式布局、甜筒分类筛选加时间分组布局
6. **主题切换系统** - 支持驴酱主题（洞主/凯哥）和甜筒主题（老虎/甜筒）
7. **弹幕互动效果** - 水平弹幕和侧边弹幕，支持主题联动
8. **搜索与筛选** - 实时搜索、自动补全、搜索历史、分类筛选
9. **完整的测试覆盖** - TDD开发方法，单元测试、集成测试、E2E测试

## 技术栈

### 后端
- **Python 3.8+** - 后端开发语言
- **Playwright** - 动态内容爬取和浏览器自动化
- **Requests** - HTTP请求处理
- **BeautifulSoup4** - HTML解析
- **Pytest** - 单元测试框架

### 前端
- **React 19** - 前端UI框架
- **TypeScript 5** - 类型安全
- **Vite 7** - 构建工具和开发服务器
- **Tailwind CSS 4** - CSS框架
- **Radix UI** - 无样式组件库
- **Jest** - 单元测试框架

## 快速开始

### 环境要求

- **后端**：Python 3.8+，Playwright
- **前端**：Node.js 18+，npm 9+
- **操作系统**：Windows 11、macOS 或 Linux

### 基本部署步骤

#### 1. 克隆项目

```bash
git clone <repository-url>
cd VidTimelineX
```

#### 2. 后端设置

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt
playwright install
```

详细说明请参考 [backend/README.md](./backend/README.md)。

#### 3. 前端设置

```bash
cd frontend
npm install
```

详细说明请参考 [frontend/README.md](./frontend/README.md)。

#### 4. 运行项目

**启动后端服务**：

```bash
cd backend
python main.py
```

**启动前端开发服务器**：

```bash
cd frontend
npm run dev
```

前端开发服务器默认运行在 http://localhost:5173

## 开发模式

### 后端开发

```bash
cd backend
pytest                    # 运行测试
pytest --cov=src         # 查看测试覆盖率
```

详细说明请参考 [backend/README.md](./backend/README.md)。

### 前端开发

```bash
cd frontend
npm run dev              # 开发模式
npm test                 # 运行测试
npm run test:coverage    # 生成测试覆盖率报告
npm run lint             # 代码检查
```

详细说明请参考 [frontend/README.md](./frontend/README.md)。

## 常见问题

### 1. Playwright安装失败

- 检查网络连接
- 尝试使用代理
- 手动下载浏览器驱动

### 2. 前端依赖安装失败

- 清除npm缓存：`npm cache clean --force`
- 删除node_modules和package-lock.json后重新安装
- 使用npm镜像源：`npm config set registry https://registry.npmmirror.com`

更多问题请参考 [backend/README.md](./backend/README.md) 和 [frontend/README.md](./frontend/README.md)。

## 许可证

本项目采用 MIT 许可证开源。详细内容请参阅 [LICENSE](LICENSE) 文件。

## 贡献

欢迎提交Issue和Pull Request，共同改进系统。

---
