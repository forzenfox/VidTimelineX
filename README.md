# 时光视频集 (Mohen Time Video Collection)

一个用于展示和管理主播视频的时光轴集合，方便粉丝群体了解主播的视频历史。

## 项目概述

本项目是一个基于网页的视频时光轴展示系统，主要功能包括：
- 从B站(Bilibili)爬取视频元数据
- 下载和管理视频缩略图
- 以时光轴形式展示视频历史
- 响应式设计，支持移动端浏览
- 美观的UI界面，带有动画效果

## 功能特点

- **视频元数据爬取**：自动从B站获取视频标题和发布时间
- **缩略图管理**：自动下载和处理视频缩略图
- **时光轴展示**：以时间顺序展示视频，带有动画效果
- **响应式设计**：适配不同屏幕尺寸
- **美观UI**：采用电影胶片风格的设计元素
- **无版权字体**：使用适合非商业用途的字体

## 文件结构

```
mohen-shiguang/
├── .trae/              # 保持不变
├── backend/            # 后端Python脚本
│   ├── crawl_metadata.py
│   └── download_thumbs.py
├── data/               # 数据目录（保持不变）
│   ├── bv.txt
│   ├── config.json
│   └── timeline.json
├── docs/               # 文档目录
│   └── 项目分析文档.md
├── frontend/           # 前端文件
│   ├── index.html
│   ├── scripts/
│   │   └── main.js
│   └── styles/
│       └── main.css
├── media/              # 媒体文件目录（保持不变）
│   └── thumbs/
├── .gitignore          # 保持不变
├── README.md           # 保持不变
└── requirements.txt    # Python依赖管理
```

## 技术栈

- **前端**：HTML5, CSS3, JavaScript
- **后端**：Python 3
- **爬虫**：requests, BeautifulSoup4
- **数据格式**：JSON

## 设置指南

### 1. 环境准备

1. 确保安装了 Python 3.6 或更高版本
2. 安装所需依赖：

```bash
pip install requests beautifulsoup4
```

### 2. 配置爬虫目标

编辑 `data/config.json` 文件，添加要爬取的视频URL：

```json
{
  "targets": [
    {
      "url": "https://www.bilibili.com/video/BV1xx411c7mW"
    },
    {
      "url": "https://www.bilibili.com/video/BV1yy4y1t75U"
    }
  ]
}
```

### 3. 运行爬虫

执行爬虫脚本以获取视频元数据并下载缩略图：

```bash
python backend/crawl_metadata.py
```

该脚本会：
1. 读取 `config.json` 中的视频URL
2. 爬取视频元数据（标题、发布时间）
3. 调用 `download_thumbs.py` 下载缩略图
4. 更新 `timeline.json` 文件

## 使用说明

### 查看时光轴

1. **启动本地HTTP服务器**：
   ```bash
   python -m http.server 8000
   ```

2. **通过浏览器访问**：
   - 打开任何现代浏览器（Chrome、Firefox、Edge等）
   - 在地址栏输入 `http://localhost:8000/frontend` 并按回车
   - 浏览器会加载 `index.html` 页面，显示时光视频集的时光轴效果

3. **停止服务器**：
   - 回到运行服务器的终端窗口
   - 按下 `Ctrl+C` 组合键停止服务器

### 添加新视频

1. 编辑 `data/config.json` 文件，在 `targets` 数组中添加新的视频URL
2. 重新运行爬虫脚本：`python backend/crawl_metadata.py`
3. 刷新浏览器页面 (`http://localhost:8000/frontend`) 查看更新后的时光轴

## 技术细节

### 爬虫功能

- **crawl_metadata.py**：负责从B站爬取视频元数据
  - 提取视频标题和发布时间
  - 当无法获取发布时间时，使用当前日期作为默认值
  - 调用 `download_thumbs.py` 处理缩略图

- **download_thumbs.py**：负责下载和管理缩略图
  - 确保URL协议正确
  - 计算缩略图存储路径
  - 更新 `timeline.json` 文件中的缩略图路径

### 前端功能

- **index.html**：时光轴展示页面
  - 加载 `timeline.json` 数据
  - 以时光轴形式展示视频
  - 实现动画效果和响应式设计
  - 支持视频播放

## 注意事项

1. **非商业用途**：本项目仅用于粉丝群体的非商业传播
2. **遵守robots协议**：爬虫会遵守B站的robots.txt规则
3. **版权声明**：视频内容版权归原作者所有
4. **字体使用**：使用无版权要求的字体，适合非商业用途

## 许可证

本项目采用 MIT 许可证，仅用于非商业目的。

## 更新日志

- 2026-01-06：项目初始化，实现基本功能
  - 创建视频元数据爬虫
  - 实现缩略图下载功能
  - 设计时光轴UI界面
  - 设置Git版本控制
