#!/usr/bin/env python3
"""
项目配置文件
统一管理项目的配置参数
"""

from pathlib import Path


# 项目根目录
PROJECT_ROOT = Path(__file__).parent.parent.parent

# 数据存储目录
DATA_DIR = PROJECT_ROOT / "data"

# BV号来源目录
BV_SOURCES_DIR = DATA_DIR / "sources"

# BV号文件路径（默认使用驴酱的BV号列表）
BV_FILE_PATH = BV_SOURCES_DIR / "lvjiang-bv.txt"

# 默认BV文件配置
DEFAULT_BV_FILES = {
    'lvjiang': BV_SOURCES_DIR / "lvjiang-bv.txt",
    'tiantong': BV_SOURCES_DIR / "tiantong-bv.txt"
}

# 存储文件路径
PENDING_FILE = DATA_DIR / "pending.json"
APPROVED_FILE = DATA_DIR / "approved.json"
REJECTED_FILE = DATA_DIR / "rejected.json"

# 时间线数据目录
TIMELINE_DATA_DIR = DATA_DIR
TIMELINE_OUTPUT_FILE = TIMELINE_DATA_DIR / "videos.json"

# 请求配置
REQUEST_TIMEOUT = 15  # 请求超时时间（秒）
MAX_RETRIES = 3  # 最大重试次数
INITIAL_RETRY_DELAY = 2  # 初始重试间隔（秒）
REQUEST_INTERVAL = 2  # 请求间隔（秒）

# 浏览器配置
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Referer': 'https://www.bilibili.com/',
    'Connection': 'keep-alive'
}

# 搜索配置
DEFAULT_KEYWORDS = ['洞主', '凯哥']
DEFAULT_MAX_PAGES = 1
DEFAULT_ORDER = 'pubdate'  # 搜索排序方式：totalrank, click, pubdate, stow

# 日志配置
LOG_LEVEL = "INFO"  # 日志级别：DEBUG, INFO, WARNING, ERROR, CRITICAL
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
