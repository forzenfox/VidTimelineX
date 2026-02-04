#!/usr/bin/env python3
"""
项目配置文件
统一管理项目的配置参数
"""

from pathlib import Path
import json


# 数据类型定义
DATA_TYPES = {
    'LVJIANG': 'lvjiang',    # 驴酱
    'TIANTONG': 'tiantong'   # 甜筒
}

# 项目根目录
PROJECT_ROOT = Path(__file__).parent.parent.parent

# 数据存储目录
DATA_DIR = PROJECT_ROOT / "data"

# 公共数据目录
COMMON_DIR = DATA_DIR / "common"
BV_LISTS_DIR = COMMON_DIR / "bv-lists"

# BV号文件路径
DEFAULT_BV_FILES = {
    'lvjiang': BV_LISTS_DIR / "lvjiang-bv.txt",
    'tiantong': BV_LISTS_DIR / "tiantong-bv.txt"
}

# 配置文件路径
CONFIG_FILE = PROJECT_ROOT / "config.json"

# 默认配置
DEFAULT_CONFIG = {
    "favorites": {
        "tiantong": "https://space.bilibili.com/57320454/favlist?fid=3869352154&ftype=create&ctype=21",
        "lvjiang": "https://space.bilibili.com/57320454/favlist?fid=3965175154&ftype=create&ctype=21"
    },
    "crawler": {
        "timeout": 15,
        "retry": 3,
        "interval": 2,
        "full_crawl": False
    },
    "frontend": {
        "thumbs_dir": "../frontend/public/thumbs"
    }
}


def get_config():
    """获取配置
    
    Returns:
        dict: 配置信息
    """
    # 如果配置文件存在，读取配置
    if CONFIG_FILE.exists():
        try:
            with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
                config = json.load(f)
                # 合并默认配置
                for key, value in DEFAULT_CONFIG.items():
                    if key not in config:
                        config[key] = value
                return config
        except Exception as e:
            print(f"读取配置文件失败: {e}")
            return DEFAULT_CONFIG
    
    # 配置文件不存在，返回默认配置
    return DEFAULT_CONFIG


def save_config(config):
    """保存配置
    
    Args:
        config: 配置信息
    """
    try:
        # 确保配置文件目录存在
        CONFIG_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
            json.dump(config, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"保存配置文件失败: {e}")
        return False


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
        'THUMBS_DIR': data_type_dir / "thumbs",
        'TIMELINE_FILE': data_type_dir / "videos.json",
        'BV_FILE': BV_LISTS_DIR / f"{data_type}-bv.txt"
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


def get_frontend_thumbs_dir():
    """获取前端图片存储路径
    
    Returns:
        Path: 前端图片存储路径
    """
    config = get_config()
    thumbs_dir = config.get('frontend', {}).get('thumbs_dir', '../frontend/public/thumbs')
    # 转换为绝对路径
    return PROJECT_ROOT / thumbs_dir
