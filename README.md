# B站视频时间线系统

> **📁 项目文档导航**
> - **本文档**：项目全局说明、架构概览、快速开始
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
│   ├── main.py        # 主更新脚本
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

### 基本部署步骤

1. **后端**：
   - 进入 `backend` 目录
   - 安装依赖：`pip install -r requirements.txt`
   - 安装Playwright：`playwright install`
   - 配置 `config.json` 中的收藏夹URL
   - 运行：`python main.py`

2. **前端**：
   - 进入 `frontend` 目录
   - 安装依赖：`npm install`
   - 开发模式：`npm run dev`
   - 生产构建：`npm run build`

## 许可证

本项目采用 MIT 许可证开源。详细内容请参阅 [LICENSE](LICENSE) 文件。

## 贡献

欢迎提交Issue和Pull Request，共同改进系统。

---

**📝 文档更新时间**：2026-02-04
**📦 版本**：1.2.0
**🔧 维护者**：系统自动生成
