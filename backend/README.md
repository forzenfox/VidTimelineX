# B站视频爬虫系统

> **📁 项目文档导航**
> - **根目录README**：项目全局说明、架构概览、部署指南 → [查看](../README.md)
> - **本文档**：后端详细技术文档、爬虫系统、审核工具说明
>
> 一个用于爬取B站视频元数据并生成时间线数据的爬虫系统，支持从文件读取BV号列表和关键词搜索两种爬取模式。

## 项目结构

```
backend/
├── src/                 # 主源码目录
│   ├── crawler/         # 爬虫核心模块
│   │   ├── __init__.py
│   │   └── auto_crawler.py       # 自动化爬虫实现
│   ├── downloader/      # 下载模块
│   │   ├── __init__.py
│   │   └── download_thumbs.py    # 缩略图下载功能
│   ├── commands/        # 命令行工具
│   │   ├── __init__.py
│   │   └── approve_videos.py            # 视频审核工具
│   └── utils/           # 工具函数
│       ├── __init__.py
│       └── config.py    # 配置文件
├── data/                # 数据存储目录
│   ├── raw/             # 原始爬取数据
│   │   ├── pending.json     # 待审核视频列表
│   │   ├── approved.json    # 已通过审核视频列表
│   │   └── rejected.json    # 已拒绝视频列表
│   ├── processed/       # 处理后的数据
│   │   └── videos.json      # 前端时间线数据
│   ├── sources/         # BV号来源文件
│   │   ├── lvjiang-bv.txt   # 驴酱UP主的BV号列表
│   │   └── tiantong-bv.txt  # 甜筒UP主的BV号列表
│   └── README.md        # 数据目录说明
├── tests/               # 测试目录
│   ├── __init__.py
│   ├── playwright_test.py          # Playwright测试
│   ├── test_load_bv_list.py        # BV号列表加载测试
│   ├── test_review_interface.py    # 审核界面测试
│   ├── test_search_api.py          # 搜索API测试
│   ├── test_storage_solutions.py   # 存储方案测试
│   └── test_video_metadata.py      # 视频元数据测试
├── main.py              # 主入口脚本
└── README.md            # 项目说明文档
```

## 功能模块

### 1. 爬虫核心模块 (src/crawler/)
- **auto_crawler.py**: 实现B站视频元数据爬取功能，支持从文件读取BV号列表和关键词搜索两种模式，包含视频元数据解析、重试机制、请求频率控制等功能。

### 2. 下载模块 (src/downloader/)
- **download_thumbs.py**: 实现视频封面下载功能，支持从videos.json读取视频列表并下载封面图片到前端目录。可作为独立脚本运行或被其他模块调用。

### 3. 命令行工具 (src/commands/)
- **approve_videos.py**: 视频审核工具，用于将待审核视频移动到已通过或已拒绝列表。

### 4. 工具模块 (src/utils/)
- **config.py**: 配置文件，包含爬虫系统的各种配置参数，如请求头、数据存储路径、超时设置等。

### 5. 主入口脚本 (main.py)
提供命令行界面，支持两种爬取模式：
- **file**: 从指定文件读取BV号列表进行爬取
- **keyword**: 根据关键词搜索视频进行爬取

## 安装和依赖

### 环境要求
- Python 3.8+
- Windows 11 或其他支持的操作系统

### 安装依赖
```bash
# 安装基础依赖
pip install -r requirements.txt

# 安装Playwright浏览器
playwright install
```

## 使用方法

### 1. 从文件爬取BV号（默认模式，默认使用驴酱的BV号列表）
```bash
python main.py --mode file
```

### 指定不同的BV号文件
```bash
# 爬取驴酱的视频
python main.py --mode file --bv-file ./data/sources/lvjiang-bv.txt

# 爬取甜筒的视频
python main.py --mode file --bv-file ./data/sources/tiantong-bv.txt
```

### 2. 关键词搜索爬取
```bash
python main.py --mode keyword --keywords 原神 崩坏星穹铁道 --max-pages 2
```

### 3. 查看帮助信息
```bash
python main.py --help
```

### 4. 控制封面下载
```bash
# 默认自动下载封面到前端目录
python main.py

# 跳过封面下载
python main.py --no-download-covers
```

### 5. 独立运行封面下载
```bash
python src/downloader/download_thumbs.py data/videos.json frontend/public/thumbs/
```

## 封面图片功能

### 封面存储位置
下载的封面图片保存到前端项目目录：
```
frontend/public/thumbs/
```

### 封面命名规则
封面图片以视频BV号命名，格式为 `{BV号}.jpg`：
- 例如：`BV195zoB2EFY.jpg`、`BV1ybzXBDEJa.jpg`

### 使用说明
- 封面下载在生成 `videos.json` 时间线数据后自动执行
- 原始 `videos.json` 中的 `cover` 字段继续使用外部Bilibili URL
- 本地封面主要用于备份或前端项目需要时使用
- 使用 `--no-download-covers` 参数可跳过封面下载

### 独立脚本用法
```bash
# 基本用法
python src/downloader/download_thumbs.py <videos.json路径> <封面保存目录>

# 静默模式（减少输出）
python src/downloader/download_thumbs.py data/videos.json frontend/public/thumbs/ --quiet
```

## 数据格式

### BV号文件格式 (sources/*.txt)
```
# 这是注释行，以#开头的行会被忽略
# 每行可以包含一个BV号，支持带或不带BV前缀
BV1gk4y1r77A
BV1Q7411E7X4
1jJ411g7pZ  # 不带BV前缀也可以
```

### 视频元数据格式
```json
{
  "bv": "1gk4y1r77A",
  "url": "https://www.bilibili.com/video/BV1gk4y1r77A",
  "title": "视频标题",
  "description": "视频描述",
  "publish_date": "2024-01-01",
  "views": 10000,
  "danmaku": 500,
  "up主": "UP主名称",
  "thumbnail": "https://i0.hdslb.com/bfs/archive/1gk4y1r77A.jpg",
  "duration": "05:30",
  "crawled_at": "2024-01-01 12:00:00",
  "review_status": "pending",
  "review_note": ""
}
```

### 前端时间线数据格式
```json
[
  {
    "id": "1",
    "title": "视频标题",
    "date": "2024-01-01",
    "bvid": "BV1gk4y1r77A",
    "cover": "https://i0.hdslb.com/bfs/archive/1gk4y1r77A.jpg",
    "tags": [],
    "duration": "05:30"
  }
]
```

## 配置说明

### 主配置文件
爬虫系统的主要配置在代码中定义，包括：
- 请求头和会话设置
- 数据存储路径
- 请求超时和重试机制
- 请求频率控制

### 自定义配置
可以通过修改`src/crawler/auto_crawler.py`中的相关参数来自定义配置：
- `headers`: 请求头设置
- `data_dir`: 数据存储目录
- `max_retries`: 最大重试次数
- `retry_delay`: 初始重试间隔

## 开发和测试

### 运行测试
```bash
# 运行所有测试
pytest

# 运行特定测试文件
pytest tests/test_load_bv_list.py
```

### 代码结构
- 所有核心代码位于`src/`目录下，按照功能模块划分
- 测试代码位于`tests/`目录下，与核心代码结构对应
- 数据文件位于`data/`目录下，按照数据类型组织
- 详细的数据目录说明请参考 `data/README.md`

## 最佳实践

1. **BV号文件管理**
   - BV号文件位于 `data/sources/` 目录下，按UP主分类管理
   - 定期更新对应的BV号文件，添加新的BV号
   - 使用注释对BV号进行分类和说明
   - 避免重复添加相同的BV号

2. **爬取策略**
   - 优先使用从文件爬取模式，避免频繁请求B站搜索API
   - 合理设置请求间隔，遵守B站的爬虫规则
   - 定期备份数据文件，防止数据丢失

3. **审核流程**
   - 定期审核待审核视频，将合适的视频移动到已通过列表
   - 为审核结果添加说明，便于后续管理
   - 定期清理已拒绝视频列表

## 常见问题

### 1. 爬取失败怎么办？
- 检查网络连接是否正常
- 检查BV号是否正确
- 查看日志信息，了解具体错误原因
- 爬虫系统包含重试机制，会自动重试失败的请求

### 2. 如何添加新的爬取功能？
- 在`src/crawler/`目录下创建新的模块文件
- 实现新的爬取逻辑
- 在`main.py`中添加相应的命令行参数和处理逻辑

### 3. 如何修改时间线数据格式？
- 修改`src/crawler/auto_crawler.py`中的`generate_timeline`方法
- 调整输出的JSON结构以匹配前端要求

## 贡献和维护

欢迎提交Issue和Pull Request，共同改进爬虫系统。

### 代码规范
- 使用Python标准代码风格（PEP 8）
- 为所有函数添加中文注释
- 保持代码的可读性和可维护性

### 版本管理
- 使用Git进行版本管理
- 定期提交代码，添加清晰的提交信息
- 遵循语义化版本控制规范

## 许可证

MIT License
