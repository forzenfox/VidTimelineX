# B站视频时间线系统

> **📁 项目文档导航**
> - **本文档**：项目全局说明、架构概览、部署指南
> - **后端README**：后端架构详细技术文档、TDD开发流程、使用说明 → [查看](./backend/README.md)
> - **前端README**：前端架构详细技术文档、组件说明、开发指南 → [查看](./frontend/README.md)

基于TDD方法开发的B站收藏夹视频时间线系统，支持自动爬取收藏夹视频、生成时间线数据，采用前后端分离架构，模块化设计和数据隔离架构。

## 项目概述

### 系统架构

```
VidTimelineX/
├── backend/           # 后端目录
│   ├── src/           # 后端源码
│   ├── tests/         # 后端测试
│   ├── update_timeline.py   # 主更新脚本
│   ├── update_frontend.py   # 前端文件更新脚本
│   ├── config.json    # 配置文件
│   ├── requirements.txt   # 依赖文件
│   └── README.md      # 后端文档
├── frontend/          # 前端目录
│   ├── src/           # 前端源码
│   ├── public/        # 前端静态资源
│   ├── tests/         # 前端测试
│   └── README.md      # 前端文档
├── docs/              # 项目文档
└── README.md          # 项目根目录文档
```

### 核心功能

1. **B站收藏夹自动爬取**
   - 自动爬取B站收藏夹视频
   - 支持多个收藏夹并行管理
   - 配置化的收藏夹URL映射

2. **时间线数据生成**
   - 按发布日期排序
   - 生成符合前端格式的 videos.json
   - 支持多个数据类型（驴酱、甜筒）

3. **封面图片管理**
   - 自动下载视频封面图片
   - 统一的图片命名规范
   - 支持批量下载和更新

4. **前端文件自动更新**
   - 自动更新前端 videos.json 文件
   - 保留前端的 tags 字段内容
   - 覆盖更新其他字段

5. **完整的测试覆盖**
   - TDD开发方法
   - 完整的测试套件
   - 确保代码质量

## 快速开始

### 环境要求

- **后端**：Python 3.8+，Playwright
- **前端**：Node.js 18+，npm 9+
- **操作系统**：Windows 11 或其他支持的操作系统

### 后端部署

1. **安装依赖**

```bash
# 进入后端目录
cd backend

# 安装Python依赖
pip install -r requirements.txt

# 安装Playwright浏览器
playwright install
```

2. **配置收藏夹**

编辑 `backend/config.json` 文件，配置收藏夹URL：

```json
{
  "favorites": {
    "tiantong": "https://space.bilibili.com/57320454/favlist?fid=3869352154&ftype=create&ctype=21",
    "lvjiang": "https://space.bilibili.com/57320454/favlist?fid=3965175154&ftype=create&ctype=21"
  },
  "crawler": {
    "timeout": 15,
    "retry": 3,
    "interval": 2,
    "full_crawl": false
  }
}
```

3. **运行更新**

```bash
# 在backend目录下执行
python update_timeline.py
```

### 前端部署

1. **安装依赖**

```bash
# 进入前端目录
cd frontend

# 安装npm依赖
npm install
```

2. **开发模式运行**

```bash
npm run dev
```

3. **构建生产版本**

```bash
npm run build
```

## 数据流程

1. **收藏夹爬取**：后端自动爬取B站收藏夹，提取视频BV号
2. **视频元数据**：根据BV号爬取视频详细信息和发布日期
3. **时间线生成**：生成符合前端格式的 videos.json 数据
4. **封面下载**：下载视频封面图片
5. **前端更新**：自动更新前端 videos.json 文件和封面图片

## 项目特点

### 后端特点

- **TDD开发**：先编写测试用例，再实现功能代码
- **模块化设计**：清晰的职责分离，高内聚低耦合
- **收藏夹管理**：自动爬取B站收藏夹视频
- **数据隔离**：支持多个数据类型（驴酱、甜筒）
- **路径管理**：智能的路径生成，自动目录创建
- **错误处理**：完善的异常捕获，智能的重试机制

### 前端特点

- **响应式设计**：适配不同屏幕尺寸
- **模块化组件**：可复用的UI组件
- **时间线展示**：按发布日期排序的视频时间线
- **视频播放**：集成B站视频播放器
- **封面图片**：统一的封面图片管理

## 部署指南

### 本地开发环境

1. **后端**：
   - Python 3.8+
   - Playwright
   - 运行 `python update_timeline.py` 更新数据

2. **前端**：
   - Node.js 18+
   - 运行 `npm run dev` 启动开发服务器

### 生产环境部署

1. **后端**：
   - 部署到服务器
   - 设置定时任务定期运行 `python update_timeline.py`

2. **前端**：
   - 运行 `npm run build` 构建生产版本
   - 部署构建产物到静态文件服务器

## 维护指南

### 1. 收藏夹管理

- **定期更新收藏夹URL**：确保收藏夹URL正确
- **分类管理**：按不同数据类型创建不同收藏夹
- **合理组织**：避免收藏夹过大，影响爬取效率

### 2. 数据管理

- **备份数据**：定期备份生成的时间线数据
- **清理冗余**：移除无效的BV号
- **检查格式**：确保生成的数据格式正确

### 3. 错误处理

- **网络问题**：检查网络连接和代理设置
- **BV号无效**：定期清理无效的BV号
- **收藏夹权限**：确保收藏夹可公开访问

### 4. 扩展开发

- **添加新功能**：在对应模块中添加新方法
- **修改配置**：通过配置文件调整系统行为
- **添加测试**：为新功能编写测试用例

## 技术栈

### 后端

- Python 3.8+
- Playwright（动态内容爬取）
- BeautifulSoup4（HTML解析）
- Requests（HTTP请求）
- Pytest（单元测试）

### 前端

- React
- TypeScript
- Vite
- Tailwind CSS
- Jest（单元测试）
- Playwright（端到端测试）

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request，共同改进系统。

---

**📝 文档更新时间**：2025-07-03
**📦 版本**：1.1.0
**🔧 维护者**：系统自动生成
