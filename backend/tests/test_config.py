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
    assert "datatype" in config
    assert isinstance(config["datatype"], dict)


def test_get_data_type_config():
    """测试获取数据类型配置"""
    config = get_data_type_config("tiantong")
    assert isinstance(config, dict)
    assert "DATA_TYPE_DIR" in config
    assert "TIMELINE_FILE" in config


def test_config_file_creation():
    """测试配置文件创建"""
    from src.utils.config import CONFIG_FILE
    # 确保配置文件目录存在
    CONFIG_FILE.parent.mkdir(parents=True, exist_ok=True)
    # 测试获取配置不会抛出异常
    config = get_config()
    assert isinstance(config, dict)


def test_frontend_config():
    """测试前端配置读取"""
    config = get_config()
    # 测试frontend配置存在
    assert "frontend" in config
    assert isinstance(config["frontend"], dict)
    # 测试thumbs_dir配置存在
    assert "thumbs_dir" in config["frontend"]
    assert isinstance(config["frontend"]["thumbs_dir"], str)


def test_get_frontend_thumbs_dir():
    """测试获取前端图片存储路径"""
    from src.utils.config import get_frontend_thumbs_dir
    thumbs_dir = get_frontend_thumbs_dir()
    assert isinstance(thumbs_dir, Path)
    assert thumbs_dir.name == "thumbs"
