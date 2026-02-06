#!/usr/bin/env python3
"""
项目配置文件
统一管理项目的配置参数
"""

from pathlib import Path
import json


# 项目根目录
PROJECT_ROOT = Path(__file__).parent.parent.parent

# 数据存储目录
DATA_DIR = PROJECT_ROOT / "data"

# 配置文件路径
CONFIG_FILE = PROJECT_ROOT / "config.json"


# 配置校验函数
def validate_config(config):
    """校验配置文件
    
    Args:
        config: 配置信息
        
    Returns:
        bool: 校验是否通过
    """
    if not isinstance(config, dict):
        print("配置文件格式错误: 配置必须是一个字典")
        return False
    
    # 校验datatype配置
    if 'datatype' not in config:
        print("配置文件错误: 缺少datatype配置")
        return False
    
    datatype_config = config['datatype']
    if not isinstance(datatype_config, dict):
        print("配置文件错误: datatype配置必须是一个字典")
        return False
    
    # 校验每个数据类型的配置
    for data_type, data_config in datatype_config.items():
        if not isinstance(data_config, dict):
            print(f"配置文件错误: {data_type}配置必须是一个字典")
            return False
        
        if 'favorites_url' not in data_config:
            print(f"配置文件错误: {data_type}缺少favorites_url配置")
            return False
        
        if 'backend_timeline_file' not in data_config:
            print(f"配置文件错误: {data_type}缺少backend_timeline_file配置")
            return False
        
        if 'frontend_timeline_file' not in data_config:
            print(f"配置文件错误: {data_type}缺少frontend_timeline_file配置")
            return False
    
    # 校验crawler配置
    if 'crawler' not in config:
        print("配置文件错误: 缺少crawler配置")
        return False
    
    crawler_config = config['crawler']
    if not isinstance(crawler_config, dict):
        print("配置文件错误: crawler配置必须是一个字典")
        return False
    
    # 校验frontend配置
    if 'frontend' not in config:
        print("配置文件错误: 缺少frontend配置")
        return False
    
    frontend_config = config['frontend']
    if not isinstance(frontend_config, dict):
        print("配置文件错误: frontend配置必须是一个字典")
        return False
    
    return True


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
                
                # 校验配置
                if not validate_config(config):
                    print("配置文件校验失败，程序终止")
                    exit(1)
                
                return config
        except Exception as e:
            print(f"读取配置文件失败: {e}")
            exit(1)
    else:
        print(f"配置文件不存在: {CONFIG_FILE}")
        exit(1)


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
    config = get_config()
    data_config = config['datatype'].get(data_type, {})
    
    if not data_config:
        print(f"配置文件错误: 缺少{data_type}配置")
        exit(1)
    
    backend_timeline_file = Path(data_config['backend_timeline_file'])
    if not backend_timeline_file.is_absolute():
        backend_timeline_file = PROJECT_ROOT / backend_timeline_file
    
    data_type_dir = backend_timeline_file.parent
    
    return {
        'DATA_TYPE_DIR': data_type_dir,
        'TIMELINE_FILE': backend_timeline_file
    }


def get_frontend_timeline_file(data_type):
    """获取前端时间线文件路径
    
    Args:
        data_type: 数据类型
        
    Returns:
        Path: 前端时间线文件路径
    """
    config = get_config()
    data_config = config['datatype'].get(data_type, {})
    
    if not data_config:
        print(f"配置文件错误: 缺少{data_type}配置")
        exit(1)
    
    frontend_timeline_file = Path(data_config['frontend_timeline_file'])
    if not frontend_timeline_file.is_absolute():
        frontend_timeline_file = PROJECT_ROOT / frontend_timeline_file
    
    return frontend_timeline_file


def get_all_data_types():
    """获取所有数据类型
    
    Returns:
        list: 数据类型列表
    """
    config = get_config()
    return list(config['datatype'].keys())


def get_favorites_config():
    """获取收藏夹配置
    
    Returns:
        dict: 收藏夹配置
    """
    config = get_config()
    favorites_config = {}
    
    for data_type, data_config in config['datatype'].items():
        favorites_config[data_type] = data_config.get('favorites_url', '')
    
    return favorites_config


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
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Referer': 'https://www.bilibili.com/'
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
