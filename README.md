# Bilibili视频时光轴项目

## 项目概述

本项目是一个个人非商用的视频爬取、审核和发布系统，用于从B站根据关键词搜索视频，爬取视频信息，经过人工审核后生成时光轴并部署到GitHub Pages。

**核心功能**：自动化爬取、人工审核、时光轴展示、GitHub Pages部署（含自定义域名）、自动化CI/CD。

**访问地址**：
- 自定义域名：https://vx.forzenfox.com
- GitHub Pages：https://forzenfox.github.io/VidTimelineX/

## 系统架构

```
Bilibili API → 后端爬取脚本 → 审核界面 → 前端构建 → GitHub Pages
              (Python/Flask)            (React/Vite)  (自定义域名)
                        ↑                              ↑
                   数据存储                         GitHub Actions
                   (JSON)                          (自动化部署)
```

## 快速开始

### 环境要求
- Python 3.8+
- Node.js 20+

### 安装命令

```bash
# 前端
cd frontend && npm install

# 后端
cd backend && pip install -r requirements.txt
```

### 启动命令

```bash
# 前端开发
cd frontend && npm run dev

# 后端爬取
cd backend && python main.py --mode keyword --keywords 原神

# 前端构建
cd frontend && npm run build
```

## 文档索引

| 文档 | 说明 | 位置 |
|-----|------|------|
| **根目录README** | 项目全局说明 | README.md（本文档） |
| **前端详细文档** | 前端技术栈、架构、安装、测试 | [frontend/README.md](frontend/README.md) |
| **后端详细文档** | 后端爬虫、审核、数据格式 | [backend/README.md](backend/README.md) |
| **部署配置** | GitHub Actions工作流说明 | [docs/GitHub部署配置技术文档.md](docs/GitHub部署配置技术文档.md) |
| **域名配置** | 自定义域名配置指南 | [docs/自定义域名配置指南.md](docs/自定义域名配置指南.md) |
| **编码规范** | 前端代码规范 | [docs/前端编码规范.md](docs/前端编码规范.md) |
| **合规性调研** | 法律法规合规说明 | [docs/法律法规与合规性调研报告.md](docs/法律法规与合规性调研报告.md) |

## 项目结构摘要

```
VidTimelineX/
├── .github/workflows/     # CI/CD配置
├── frontend/              # 前端（React 19 + Vite）
│   ├── src/features/      # 驴酱、甜筒模块
│   └── tests/             # 测试（135 tests）
├── backend/               # 后端（Python + Flask）
│   ├── src/crawler/       # 爬虫模块
│   └── data/              # 数据存储
└── docs/                  # 详细文档
```

## 版本发布流程

```bash
# 1. 开发分支测试
cd frontend && npm run lint && npm run test:ci && npm run build

# 2. 创建PR合并到master（自动触发部署）
gh pr create --base master --head develop

# 3. 合并PR触发自动部署到GitHub Pages

# 4. 验证部署
# 访问 https://vx.forzenfox.com
```

## 法律法规合规性

本项目为个人非商用项目，严格遵守以下原则：
- **合理使用**：仅用于个人学习、研究目的
- **遵守robots.txt**：尊重B站的爬虫协议
- **低频率请求**：避免对服务器造成负担
- **仅提供链接**：不存储视频内容，仅提供跳转链接

详细合规性分析请参考 [docs/法律法规与合规性调研报告.md](docs/法律法规与合规性调研报告.md)。

## 常见问题

| 问题 | 解决方案 |
|-----|---------|
| 前端测试失败 | `cd frontend && npm run test:ci` |
| 构建后资源路径错误 | 检查 `VITE_CUSTOM_DOMAIN` 环境变量 |
| GitHub Pages部署失败 | 检查GitHub Actions日志，确认权限配置 |
| 自定义域名解析失败 | 配置A记录指向GitHub Pages IP，等待DNS生效 |

## 参考资源

- [GitHub Pages自定义域名文档](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [前端详细文档](frontend/README.md)
- [后端详细文档](backend/README.md)

## 许可证

本项目为个人非商用项目，仅供学习和研究使用。

---

**注意**：使用时请严格遵守相关法律法规和平台规则。
