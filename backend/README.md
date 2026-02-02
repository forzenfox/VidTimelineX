# B站视频爬虫系统

> **📁 项目文档导航**
> - **根目录README**：项目全局说明、架构概览、部署指南 → [查看](../README.md)
> - **本文档**：后端详细技术文档、爬虫系统、审核工具说明
>
> 一个用于爬取B站视频元数据并生成时间线数据的爬虫系统，支持从文件读取BV号列表和关键词搜索两种爬取模式，新增GUI界面和数据隔离功能。

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
│   ├── gui/             # GUI界面模块
│   │   ├── __init__.py
│   │   ├── crawler_widget.py       # 爬虫功能GUI
│   │   ├── data_manager_widget.py  # 数据管理GUI
│   │   ├── cover_widget.py         # 封面管理GUI
│   │   ├── timeline_widget.py      # 时间线管理GUI
│   │   ├── settings_widget.py      # 设置管理GUI
│   │   └── main_window.py          # 主窗口
│   └── utils/           # 工具函数
│       ├── __init__.py
│       ├── config.py    # 配置文件
│       └── path_manager.py  # 路径管理
├── data/                # 数据存储目录
│   ├── lvjiang/         # 驴酱数据
│   │   ├── approved.json  # 已通过的视频
│   │   ├── pending.json   # 待审核的视频
│   │   ├── rejected.json  # 已拒绝的视频
│   │   ├── videos.json    # 时间线数据
│   │   └── thumbs/        # 封面图片
│   ├── tiantong/        # 甜筒数据
│   │   └── ...            # 同驴酱
│   ├── sources/          # BV号来源文件
│   │   ├── lvjiang-bv.txt   # 驴酱UP主的BV号列表
│   │   └── tiantong-bv.txt  # 甜筒UP主的BV号列表
│   └── README.md         # 数据目录说明
├── tests/               # 测试目录
│   ├── __init__.py
│   ├── playwright_test.py          # Playwright测试
│   ├── test_load_bv_list.py        # BV号列表加载测试
│   ├── test_review_interface.py    # 审核界面测试
│   ├── test_search_api.py          # 搜索API测试
│   ├── test_storage_solutions.py   # 存储方案测试
│   ├── test_video_metadata.py      # 视频元数据测试
│   └── test_data_isolation.py      # 数据隔离测试
├── main.py              # 主入口脚本
├── run_gui.py           # GUI启动脚本
├── deploy.py            # 部署脚本
├── deploy_guide.md      # 部署指南
├── test_report.md       # 测试报告
└── README.md            # 项目说明文档
```

## 功能模块

### 1. 爬虫核心模块 (src/crawler/)
- **auto_crawler.py**: 实现B站视频元数据爬取功能，支持从文件读取BV号列表和关键词搜索两种模式，包含视频元数据解析、重试机制、请求频率控制等功能。新增数据类型参数，支持甜筒和驴酱数据隔离。

### 2. 下载模块 (src/downloader/)
- **download_thumbs.py**: 实现视频封面下载功能，支持从videos.json读取视频列表并下载封面图片到前端目录。可作为独立脚本运行或被其他模块调用。

### 3. 命令行工具 (src/commands/)
- **approve_videos.py**: 视频审核工具，用于将待审核视频移动到已通过或已拒绝列表。

### 4. GUI界面模块 (src/gui/)
- **crawler_widget.py**: 爬虫功能GUI模块，支持单个和批量视频爬取。
- **data_manager_widget.py**: 数据管理GUI模块，支持查看、搜索、导入/导出视频数据。
- **cover_widget.py**: 封面管理GUI模块，支持查看和下载视频封面。
- **timeline_widget.py**: 时间线管理GUI模块，支持生成和导出时间线。
- **settings_widget.py**: 设置管理GUI模块，支持修改系统配置。
- **main_window.py**: 主窗口模块，包含导航栏、内容区域和状态栏。

### 5. 工具模块 (src/utils/)
- **config.py**: 配置文件，包含爬虫系统的各种配置参数，如请求头、数据存储路径、超时设置等。新增数据类型配置。
- **path_manager.py**: 路径管理模块，用于管理数据存储路径和目录创建。

### 6. 主入口脚本 (main.py)
提供命令行界面，支持两种爬取模式：
- **file**: 从指定文件读取BV号列表进行爬取
- **keyword**: 根据关键词搜索视频进行爬取
新增 `--data-type` 参数，支持甜筒和驴酱数据隔离。

### 7. GUI启动脚本 (run_gui.py)
提供GUI界面启动功能，支持甜筒和驴酱数据类型切换。

### 8. 部署脚本 (deploy.py)
用于安装依赖和启动系统。

## 安装和依赖

### 环境要求
- Python 3.8+
- Windows 11 或其他支持的操作系统

### 安装依赖
```bash
# 安装基础依赖
pip install -r requirements.txt

# 安装PyQt5（用于GUI界面）
pip install PyQt5

# 安装其他依赖
pip install requests beautifulsoup4

# 安装Playwright浏览器（可选，用于某些测试）
playwright install
```

## 使用方法

### 1. GUI界面使用

#### 启动GUI界面
```bash
# 直接启动
python run_gui.py

# 使用部署脚本启动
python deploy.py
# 然后选择 "2. 启动GUI界面" 选项
```

#### GUI界面功能
- **数据类型切换**：在状态栏中点击 "驴酱" 或 "甜筒" 标签切换数据类型
- **爬虫功能**：输入BV号爬取单个视频，或选择BV号文件批量爬取视频
- **数据管理**：查看视频数据列表，搜索视频数据，导入/导出视频数据
- **封面管理**：查看视频封面，下载所选封面，批量下载封面
- **时间线管理**：生成时间线，查看时间线内容，导出时间线
- **设置管理**：修改爬虫配置，修改存储配置

### 2. 命令行界面使用

#### 从文件爬取BV号
```bash
# 爬取驴酱的视频（默认）
python main.py --mode file --data-type lvjiang

# 爬取甜筒的视频
python main.py --mode file --data-type tiantong --bv-file ./data/sources/tiantong-bv.txt
```

#### 关键词搜索爬取
```bash
# 爬取驴酱的视频
python main.py --mode keyword --data-type lvjiang --keywords 原神 崩坏星穹铁道 --max-pages 2

# 爬取甜筒的视频
python main.py --mode keyword --data-type tiantong --keywords 原神 崩坏星穹铁道 --max-pages 2
```

#### 查看帮助信息
```bash
python main.py --help
```

#### 控制封面下载
```bash
# 默认自动下载封面
python main.py --data-type lvjiang

# 跳过封面下载
python main.py --data-type lvjiang --no-download-covers
```

### 3. 部署脚本使用

```bash
python deploy.py
```

然后选择相应的操作：
- **1. 安装依赖**：安装系统所需的依赖包
- **2. 启动GUI界面**：启动GUI界面
- **3. 启动命令行界面**：启动命令行界面并显示帮助信息

### 4. 独立运行封面下载
```bash
python src/downloader/download_thumbs.py data/lvjiang/videos.json data/lvjiang/thumbs/
```

## 封面图片功能

### 封面存储位置
下载的封面图片保存到对应数据类型的 thumbs 目录：
```
data/lvjiang/thumbs/  # 驴酱封面
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

# 下载驴酱封面
python src/downloader/download_thumbs.py data/lvjiang/videos.json data/lvjiang/thumbs/

# 下载甜筒封面
python src/downloader/download_thumbs.py data/tiantong/videos.json data/tiantong/thumbs/

# 静默模式（减少输出）
python src/downloader/download_thumbs.py data/lvjiang/videos.json data/lvjiang/thumbs/ --quiet
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
  "cover_url": "https://i0.hdslb.com/bfs/archive/1gk4y1r77A.jpg",
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
    "videoUrl": "https://www.bilibili.com/video/BV1gk4y1r77A",
    "cover": "BV1gk4y1r77A.jpg",
    "cover_url": "https://i0.hdslb.com/bfs/archive/1gk4y1r77A.jpg",
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

### 数据隔离配置
数据隔离通过 `src/utils/config.py` 中的 `get_data_type_config` 函数实现，为不同数据类型提供独立的配置：

```python
def get_data_type_config(data_type):
    """获取数据类型配置
    
    Args:
        data_type: 数据类型
        
    Returns:
        dict: 数据类型配置
    """
    data_type_dir = DATA_DIR / data_type
    return {
        'DATA_TYPE_DIR': data_type_dir,
        'PENDING_FILE': data_type_dir / "pending.json",
        'APPROVED_FILE': data_type_dir / "approved.json",
        'REJECTED_FILE': data_type_dir / "rejected.json",
        'TIMELINE_FILE': data_type_dir / "videos.json",
        'THUMBS_DIR': data_type_dir / "thumbs"
    }
```

### 路径管理
路径管理通过 `src/utils/path_manager.py` 实现，提供以下功能：
- `get_bv_file_path`: 获取BV号文件路径
- `get_data_paths`: 获取数据存储路径
- `ensure_directories`: 确保目录存在
- `get_all_data_types`: 获取所有数据类型

### GUI配置
GUI界面的配置在 `src/gui/settings_widget.py` 中实现，包括：
- 爬虫配置（超时、重试次数）
- 存储配置（自动创建目录）

### 自定义配置
可以通过修改以下文件中的相关参数来自定义配置：
- `src/utils/config.py`: 数据存储路径和配置参数
- `src/crawler/auto_crawler.py`: 爬虫相关配置
- `src/gui/settings_widget.py`: GUI相关配置

## 开发和测试

### 运行测试
```bash
# 运行所有测试
pytest

# 运行特定测试文件
pytest tests/test_load_bv_list.py

# 运行数据隔离测试
pytest tests/test_data_isolation.py
```

### 代码结构
- 所有核心代码位于`src/`目录下，按照功能模块划分
- GUI相关代码位于`src/gui/`目录下
- 测试代码位于`tests/`目录下，与核心代码结构对应
- 数据文件位于`data/`目录下，按照数据类型组织（lvjiang和tiantong）
- 详细的数据目录说明请参考 `data/README.md`

## 最佳实践

1. **BV号文件管理**
   - BV号文件位于 `data/sources/` 目录下，按UP主分类管理
   - 定期更新对应的BV号文件，添加新的BV号
   - 使用注释对BV号进行分类和说明
   - 避免重复添加相同的BV号

2. **数据隔离管理**
   - 使用 `--data-type` 参数指定数据类型（lvjiang或tiantong）
   - 分别管理驴酱和甜筒的BV号文件
   - 定期备份各自的数据目录，防止数据丢失

3. **爬取策略**
   - 优先使用从文件爬取模式，避免频繁请求B站搜索API
   - 合理设置请求间隔，遵守B站的爬虫规则
   - 定期备份数据文件，防止数据丢失

4. **审核流程**
   - 定期审核待审核视频，将合适的视频移动到已通过列表
   - 为审核结果添加说明，便于后续管理
   - 定期清理已拒绝视频列表

5. **GUI界面使用**
   - 使用GUI界面进行日常操作，提高工作效率
   - 利用数据类型切换功能在不同数据类型之间快速切换
   - 使用批量操作功能处理大量数据

6. **系统维护**
   - 定期检查数据目录结构，确保目录存在
   - 定期清理不需要的视频数据，减少存储空间使用
   - 优化网络连接以提高爬取速度

## 常见问题

### 1. 爬取失败怎么办？
- 检查网络连接是否正常
- 检查BV号是否正确
- 查看日志信息，了解具体错误原因
- 爬虫系统包含重试机制，会自动重试失败的请求

### 2. GUI界面无法启动怎么办？
- 确保已安装PyQt5
- 确保Python版本为3.8或更高
- 检查系统是否支持GUI界面
- 查看错误信息，了解具体原因

### 3. 数据类型切换失败怎么办？
- 确保数据目录存在
- 检查权限是否足够
- 查看日志信息，了解具体原因

### 4. 封面下载失败怎么办？
- 检查网络连接
- 检查封面URL是否有效
- 检查存储空间是否充足
- 检查目标目录权限是否足够

### 5. 如何添加新的爬取功能？
- 在`src/crawler/`目录下创建新的模块文件
- 实现新的爬取逻辑
- 在`main.py`中添加相应的命令行参数和处理逻辑
- 在GUI界面中添加相应的功能模块

### 6. 如何修改时间线数据格式？
- 修改`src/crawler/auto_crawler.py`中的`generate_timeline`方法
- 调整输出的JSON结构以匹配前端要求

### 7. 如何自定义数据存储路径？
- 修改`src/utils/config.py`中的`get_data_type_config`函数
- 调整数据存储路径配置

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
