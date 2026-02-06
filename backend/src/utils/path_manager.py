#!/usr/bin/env python3
"""
路径管理模块
管理数据存储路径和目录创建
"""

from pathlib import Path
from src.utils.config import DATA_DIR


def get_data_paths(data_type):
    """获取数据存储路径
    
    Args:
        data_type: 数据类型
        
    Returns:
        dict: 数据存储路径
    """
    from src.utils.config import get_data_type_config
    return get_data_type_config(data_type)


def ensure_directories(data_type):
    """确保目录存在
    
    Args:
        data_type: 数据类型
    """
    config = get_data_paths(data_type)
    
    # 只创建数据类型目录
    config['DATA_TYPE_DIR'].mkdir(parents=True, exist_ok=True)
    # 确保时间线文件的父目录存在
    config['TIMELINE_FILE'].parent.mkdir(parents=True, exist_ok=True)


def get_all_data_types():
    """获取所有数据类型
    
    Returns:
        list: 数据类型列表
    """
    from src.utils.config import get_all_data_types as config_get_all_data_types
    return config_get_all_data_types()


def get_favorites_config():
    """获取收藏夹配置
    
    Returns:
        dict: 收藏夹配置
    """
    from src.utils.config import get_favorites_config as config_get_favorites_config
    return config_get_favorites_config()
