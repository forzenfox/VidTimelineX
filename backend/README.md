# VidTimelineX - 后端项目

> **📁 项目文档导航**
>
> - **根目录README**：项目全局说明、架构概览、部署指南 → [查看](../README.md)
> - **本文档**：后端架构详细技术文档、TDD开发流程、使用说明
>
> 基于TDD方法开发的B站收藏夹视频时间线系统后端，支持自动爬取收藏夹视频、生成时间线数据，采用模块化设计和数据隔离架构。

## 项目概述

### 架构特点

1. **TDD开发方法**
   - 先编写测试用例，再实现功能代码
   - 完整的测试覆盖，确保代码质量
   - 遵循严格的测试驱动开发流程

2. **模块化设计**
   - 清晰的职责分离
   - 高内聚低耦合的代码结构
   - 便于维护和扩展

3. **收藏夹管理**
   - 自动爬取B站收藏夹视频
   - 支持多个收藏夹并行管理
   - 配置化的收藏夹URL映射

4. **数据隔离**
   - 支持多个数据类型（驴酱、甜筒）
   - 独立的数据存储结构
   - 统一的配置管理

5. **路径管理**
   - 智能的路径生成
   - 自动目录创建
   - 统一的数据存储结构

6. **错误处理**
   - 完善的异常捕获
   - 智能的重试机制
   - 详细的日志输出

## 目录结构

```
backend/
├── src/                 # 主源码目录
│   ├── crawler/         # 爬虫核心模块
│   │   ├── __init__.py
│   │   ├── favorites_crawler.py     # 收藏夹爬取模块
│   │   ├── video_crawler.py         # 视频元数据爬取模块
│   │   └── timeline_generator.py    # 时间线生成模块
│   ├── downloader/      # 下载模块
│   │   ├── __init__.py
│   │   └── download_thumbs.py       # 封面图片下载模块
│   ├── updater/         # 更新模块
│   │   ├── __init__.py
│   │   └── frontend_updater.py      # 前端文件更新模块
│   └── utils/           # 工具函数
│       ├── __init__.py
│       ├── config.py    # 配置管理
│       └── path_manager.py  # 路径管理
├── scripts/             # 脚本目录
│   ├── add_to_favorites_api.py     # 添加到收藏夹API脚本
│   ├── add_to_favorites_concurrent.py  # 并发添加到收藏夹脚本
│   ├── lvjiang-bv.txt   # 驴酱BV号
│   └── tiantong-bv.txt  # 甜筒BV号
├── tests/               # 测试目录
│   ├── conftest.py
│   ├── test_config.py             # 配置管理测试
│   ├── test_config_crawl_mode.py  # 爬取模式配置测试
│   ├── test_path_manager.py       # 路径管理测试
│   ├── test_favorites_crawler.py  # 收藏夹爬取测试
│   ├── test_video_crawler.py      # 视频元数据测试
│   ├── test_timeline_generator.py # 时间线生成测试
│   ├── test_cover_downloader.py   # 封面下载测试
│   ├── test_frontend_format.py     # 前端格式测试
│   ├── test_memory_integration.py  # 内存处理集成测试
│   ├── test_performance.py         # 性能测试
│   ├── test_update_frontend.py    # 前端更新测试
│   └── test_update_timeline.py    # 时间线更新测试
├── main.py              # 主更新脚本
├── update_frontend.py   # 前端更新脚本
├── requirements.txt     # 依赖文件
├── config.json          # 配置文件
├── .gitignore           # Git忽略文件
└── README.md            # 项目说明文档
```

## 功能模块

### 1. 收藏夹爬取模块 (src/crawler/favorites_crawler.py)

**功能**：
- 自动爬取B站收藏夹页面
- 处理动态内容加载
- 提取视频BV号到内存
- 支持API和网页两种爬取方式

**核心方法**：
- `crawl_favorites(url)`: 爬取收藏夹页面
- `extract_bv_codes(html)`: 从HTML中提取BV号
- `run_with_memory()`: 运行内存处理模式的爬取任务
- `crawl_favorites_to_memory(data_type)`: 爬取单个收藏夹到内存
- `run()`: 运行完整爬取任务（兼容模式）

### 2. 视频元数据爬取模块 (src/crawler/video_crawler.py)

**功能**：
- 从内存BV列表爬取视频详细元数据
- 智能的重试机制
- 多维度数据提取
- 增量爬取支持

**核心方法**：
- `crawl_from_bv_list(bv_list, data_type, full_crawl=False)`: 从内存BV列表爬取
- `crawl_video_metadata(bv_code)`: 爬取单个视频元数据
- `_parse_video_page(html, bv_code)`: 解析视频页面
- `is_video_crawled(bv_code, timeline_file)`: 检查视频是否已爬取
- 多种数据提取辅助方法

### 3. 时间线生成模块 (src/crawler/timeline_generator.py)

**功能**：
- 生成前端所需的时间线数据
- 按发布日期排序
- 保存为JSON格式
- 支持多个数据类型
- 输出格式与前端 videos.json 完全一致

**核心方法**：
- `generate_timeline(videos)`: 生成时间线数据
- `save_timeline(timeline_data, output_file)`: 保存时间线数据
- `run(videos, data_type)`: 运行时间线生成任务
- `_extract_bv_from_item(item)`: 从时间线条目提取BV号

### 4. 封面下载模块 (src/downloader/download_thumbs.py)

**功能**：
- 从B站视频页面获取封面图片
- 下载封面图片到本地目录
- 支持批量下载
- 智能去重，已存在不重复下载

**核心方法**：
- `get_og_image(html)`: 从HTML中提取封面URL
- `download_binary(url, outpath)`: 下载二进制文件
- `download_cover(video, thumbs_dir)`: 下载单个视频封面
- `download_all_covers(videos_path, thumbs_dir)`: 批量下载所有封面
- `main()`: 命令行入口

### 4. 配置管理模块 (src/utils/config.py)

**功能**：
- 统一的配置管理
- 收藏夹URL映射
- 数据类型定义
- 路径配置

**核心方法**：
- `get_config()`: 获取配置
- `get_data_type_config(data_type)`: 获取数据类型配置
- `save_config(config)`: 保存配置

### 5. 路径管理模块 (src/utils/path_manager.py)

**功能**：
- 智能的路径生成
- 自动目录创建
- 统一的数据存储结构
- 路径管理工具函数

**核心方法**：
- `get_bv_file_path(data_type)`: 获取BV号文件路径
- `get_data_paths(data_type)`: 获取数据存储路径
- `ensure_directories(data_type)`: 确保目录存在
- `get_all_data_types()`: 获取所有数据类型

### 6. 主更新脚本 (main.py)

**功能**：
- 一键执行完整更新流程
- 模块化的流程控制
- 详细的日志输出
- 支持多个数据类型
- 内存处理模式

**执行流程**：
1. 爬取收藏夹获取BV号到内存
2. 从内存BV列表爬取视频元数据
3. 生成时间线数据
4. 下载封面图片
5. 更新前端文件

**内存处理模式**：
- BV号直接在内存中传递，无需存储到文件
- 减少IO操作，提高运行效率
- 简化流程，直接从内存BV列表爬取

## 安装和依赖

### 环境要求
- Python 3.8+
- Windows 11、macOS 或 Linux
- 网络连接（用于爬取B站数据和安装依赖）

### 安装依赖

```bash
# 在backend目录下执行
pip install -r requirements.txt

# 安装Playwright浏览器（用于收藏夹爬取和浏览器自动化）
# 注意：这一步可能需要较长时间和良好的网络条件
playwright install
```

**重要说明**：
- Playwright是项目的必要依赖，用于处理B站收藏夹的动态内容加载
- 对于收藏夹爬取功能，Playwright是不可或缺的
- 对于浏览器自动化脚本（如add_to_favorites_concurrent.py），Playwright也是必要的

### 依赖说明

| 依赖项 | 版本 | 用途 |
|-------|------|------|
| requests | >=2.28.0 | HTTP请求处理 |
| beautifulsoup4 | >=4.11.0 | HTML解析 |
| playwright | >=1.47.0,<1.50.0 | 动态内容爬取和浏览器自动化 |
| pytest | >=7.0.0 | 单元测试 |
| python-dotenv | >=0.20.0 | 环境变量管理（可选） |

### 虚拟环境设置（推荐）

```bash
# 创建虚拟环境
python -m venv .venv

# 激活虚拟环境
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# 安装依赖
pip install -r requirements.txt
playwright install
```

## 使用方法

### 1. 配置收藏夹

**配置文件**：`config.json`

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

**配置项说明**：

| 配置项 | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| `favorites` | object | - | 收藏夹配置 |
| `favorites.tiantong` | string | - | 甜筒收藏夹URL |
| `favorites.lvjiang` | string | - | 驴酱收藏夹URL |
| `crawler` | object | - | 爬虫配置 |
| `crawler.timeout` | number | 15 | 请求超时时间（秒） |
| `crawler.retry` | number | 3 | 请求失败重试次数 |
| `crawler.interval` | number | 2 | 请求间隔（秒） |
| `crawler.full_crawl` | boolean | false | 是否全量爬取 |

**注意事项**：
- 收藏夹URL需要确保该收藏夹**公开可见**
- `full_crawl: false` 为增量模式，只爬取新增视频
- `full_crawl: true` 为全量模式，会重新爬取所有视频
- 建议定期使用增量模式更新，全量模式仅在数据损坏时使用

### 2. 运行更新

#### 完整更新流程

```bash
# 在backend目录下执行
python main.py
```

**执行流程**：
1. 爬取收藏夹获取BV号到内存
2. 从内存BV列表爬取视频元数据
3. 生成时间线数据
4. 下载封面图片
5. 更新前端文件

#### 单独运行各个模块

```bash
# 仅爬取收藏夹
python -m src.crawler.favorites_crawler

# 仅生成时间线
python -m src.crawler.timeline_generator

# 仅下载封面
python -m src.downloader.download_thumbs data/lvjiang/videos.json data/lvjiang/thumbs

# 仅更新前端文件
python update_frontend.py
```

### 3. 查看结果

**生成的文件**：
- **时间线数据**：`data/{data_type}/videos.json`

**内存处理模式**：
- **无BV号文件**：BV号直接在内存中传递，无需存储到文件
- **减少文件操作**：提高运行效率，减少文件系统开销

**时间线数据格式**（与前端 videos.json 完全一致）：

```json
[
  {
    "id": "1",
    "date": "2023-12-01",
    "title": "视频标题",
    "videoUrl": "https://www.bilibili.com/video/BV1xx411c7mD",
    "cover": "BV1xx411c7mD.jpg",
    "cover_url": "https://i0.hdslb.com/bfs/archive/1xx411c7mD.jpg",
    "tags": [],
    "duration": "05:30"
  }
]
```

**封面图片目录**：`data/{data_type}/thumbs/`

**封面图片文件**：`{BV号}.jpg`（如 `BV19YzYBjELJ.jpg`）

### 4. 调试和日志

**启用详细日志**：

```bash
# 设置环境变量
export DEBUG=1

# 运行更新
python main.py
```

**查看日志文件**：

```bash
# 日志文件位置（如果配置了日志输出）
tail -f logs/app.log
```

### 5. 定时任务设置

#### Windows 任务计划程序

1. 打开"任务计划程序"
2. 创建基本任务
3. 设置触发器（如每天凌晨2点）
4. 设置操作：启动程序
   - 程序：`python.exe`
   - 参数：`main.py`
   - 起始于：`D:\workspace\VidTimelineX\backend`

#### Linux/Mac cron

```bash
# 编辑crontab
crontab -e

# 添加定时任务（每天凌晨2点运行）
0 2 * * * cd /path/to/VidTimelineX/backend && /usr/bin/python3 main.py >> logs/cron.log 2>&1
```

### 6. 性能优化

#### 并发爬取

```bash
# 使用并发脚本添加到收藏夹
python scripts/add_to_favorites_concurrent.py
```

#### 增量更新

```json
{
  "crawler": {
    "full_crawl": false
  }
}
```

#### 缓存优化

- BV号在内存中传递，减少文件IO
- 已爬取的视频会跳过，避免重复请求
- 封面图片智能去重，避免重复下载

## 测试

### 运行测试

```bash
# 运行所有测试
pytest

# 运行特定测试文件
pytest tests/test_favorites_crawler.py

# 运行时间线生成测试
pytest tests/test_timeline_generator.py

# 查看测试覆盖率
pytest --cov=src
```

### 测试用例

| 测试模块 | 测试数量 | 说明 |
|---------|---------|------|
| 配置管理 | 5 | 配置文件读写、数据类型配置、前端配置 |
| 路径管理 | 2 | 路径生成、目录创建 |
| 收藏夹爬取 | 5 | BV号提取、内存处理、配置获取 |
| 视频元数据 | 6 | 内存BV列表爬取、元数据爬取、增量逻辑 |
| 时间线生成 | 6 | 数据生成、文件保存、任务运行、增量更新 |
| 封面下载 | 25 | HTML解析、文件下载、批量处理 |
| 前端格式验证 | 11 | 输出格式与前端 videos.json 一致性验证 |
| 内存处理集成 | 4 | 内存处理流程、无文件操作、BV列表传递 |
| 性能测试 | 1 | 内存处理 vs 文件处理性能比较 |
| **总计** | **81** | **完整测试覆盖** |

## 配置说明

### 数据类型定义

在 `src/utils/config.py` 中定义：

```python
DATA_TYPES = {
    'LVJIANG': 'lvjiang',    # 驴酱
    'TIANTONG': 'tiantong'   # 甜筒
}
```

### 收藏夹配置

在 `config.json` 中配置收藏夹URL：

```json
{
  "favorites": {
    "tiantong": "收藏夹URL",
    "lvjiang": "收藏夹URL"
  }
}
```

### 爬虫配置

在 `src/utils/config.py` 中配置：

```python
# 请求配置
REQUEST_TIMEOUT = 15  # 请求超时时间（秒）
MAX_RETRIES = 3  # 最大重试次数
INITIAL_RETRY_DELAY = 2  # 初始重试间隔（秒）
REQUEST_INTERVAL = 2  # 请求间隔（秒）

# 数据类型配置
DATA_TYPES = {
    'LVJIANG': 'lvjiang',    # 驴酱
    'TIANTONG': 'tiantong'   # 甜筒
}

# 数据存储路径配置
def get_data_type_config(data_type):
    data_type_dir = DATA_DIR / data_type
    return {
        'DATA_TYPE_DIR': data_type_dir,
        'THUMBS_DIR': data_type_dir / "thumbs",  # 封面图片目录
        'TIMELINE_FILE': data_type_dir / "videos.json"
    }
```

### 封面下载命令行使用

```bash
# 下载指定数据类型的封面
python -m src.downloader.download_thumbs <videos.json> <thumbs_output_dir> [--quiet]

# 示例
python -m src.downloader.download_thumbs data/lvjiang/videos.json data/lvjiang/thumbs

# 静默模式（减少输出）
python -m src.downloader.download_thumbs data/lvjiang/videos.json data/lvjiang/thumbs --quiet
```

## 最佳实践

### 1. 收藏夹管理

- **定期更新收藏夹**：确保收藏夹URL正确
- **分类管理**：按不同数据类型创建不同收藏夹
- **合理组织**：避免收藏夹过大，影响爬取效率

### 2. 运行策略

- **定期执行**：设置定时任务定期更新
- **合理间隔**：避免过于频繁的请求
- **监控日志**：关注爬取结果和错误信息

### 3. 数据管理

- **备份数据**：定期备份生成的时间线数据
- **清理冗余**：移除无效的BV号
- **检查格式**：确保生成的数据格式正确

### 4. 错误处理

- **网络问题**：检查网络连接和代理设置
- **BV号无效**：定期清理无效的BV号
- **收藏夹权限**：确保收藏夹可公开访问

### 5. 扩展开发

- **添加新功能**：在对应模块中添加新方法
- **修改配置**：通过配置文件调整系统行为
- **添加测试**：为新功能编写测试用例

## 架构特点

### 核心优势

1. **TDD开发**：更可靠的代码质量
2. **模块化**：更清晰的代码结构
3. **收藏夹管理**：自动化程度更高
4. **数据隔离**：更灵活的数据管理
5. **路径管理**：更智能的存储结构
6. **错误处理**：更完善的异常处理
7. **前端集成**：自动更新前端文件

### 技术特点

1. **Playwright**：更强大的动态内容处理
2. **统一配置**：集中化的配置管理
3. **智能重试**：更可靠的爬取机制
4. **路径管理**：更灵活的存储结构
5. **前端文件自动更新**：一键同步到前端项目

## 故障排除

### 1. 收藏夹爬取失败

**可能原因**：
- 网络连接问题
- 收藏夹URL无效
- 收藏夹权限设置
- Playwright浏览器未安装

**解决方案**：
- 检查网络连接
- 验证收藏夹URL
- 确保收藏夹可公开访问
- 运行 `playwright install`

### 2. 视频元数据爬取失败

**可能原因**：
- BV号无效
- 网络请求超时
- B站API限制

**解决方案**：
- 检查BV号格式
- 增加超时时间
- 减少请求频率
- 检查网络连接

### 3. 时间线生成失败

**可能原因**：
- 元数据格式错误
- 存储空间不足
- 权限问题

**解决方案**：
- 检查元数据格式
- 确保有足够存储空间
- 检查目录权限

### 4. 测试失败

**可能原因**：
- 依赖未安装
- 配置文件缺失
- 代码变更导致

**解决方案**：
- 安装所有依赖
- 检查配置文件
- 查看测试错误信息

## 开发指南

### 1. 代码规范

遵循 `docs/后端编码规范.md`：
- 使用Python标准代码风格（PEP 8）
- 为所有函数添加中文注释
- 保持代码的可读性和可维护性
- 遵循模块化设计原则

### 2. TDD开发流程

1. **编写测试**：在 `tests/` 目录下创建测试文件
2. **运行测试**：验证测试失败
3. **实现功能**：编写最小化代码使测试通过
4. **重构代码**：优化代码结构
5. **再次测试**：确保所有测试通过

### 3. 添加新功能

1. **编写测试**：为新功能编写测试用例
2. **实现功能**：在对应模块中实现
3. **运行测试**：确保测试通过
4. **集成到主流程**：在 `update_timeline.py` 中集成

### 4. 提交代码

1. **运行测试**：确保所有测试通过
2. **代码检查**：检查代码风格和质量
3. **提交信息**：清晰的提交信息
4. **测试验证**：确保新功能正常工作

## 许可证

本项目采用 MIT 许可证开源。详细内容请参阅项目根目录的 [LICENSE](../LICENSE) 文件。

## 贡献

欢迎提交Issue和Pull Request，共同改进系统。

---