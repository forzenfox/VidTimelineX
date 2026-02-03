#!/usr/bin/env python3
"""
配置管理模块测试
"""

import pytest
from pathlib import Path
from src.utils.config import get_config, get_data_type_config


def test_get_config():
    """测试获取配置"""
    config = get_config()
    assert isinstance(config, dict)
    assert "favorites" in config
    assert isinstance(config["favorites"], dict)


def test_get_data_type_config():
    """测试获取数据类型配置"""
    config = get_data_type_config("tiantong")
    assert isinstance(config, dict)
    assert "DATA_TYPE_DIR" in config
    assert "THUMBS_DIR" in config
    assert "TIMELINE_FILE" in config


def test_config_file_creation():
    """测试配置文件创建"""
    from src.utils.config import CONFIG_FILE
    # 确保配置文件目录存在
    CONFIG_FILE.parent.mkdir(parents=True, exist_ok=True)
    # 测试获取配置不会抛出异常
    config = get_config()
    assert isinstance(config, dict)
