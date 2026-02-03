#!/usr/bin/env python3
"""
路径管理模块测试
"""

import pytest
from pathlib import Path
from src.utils.path_manager import get_bv_file_path, get_data_paths, ensure_directories


def test_get_bv_file_path():
    """测试获取BV号文件路径"""
    file_path = get_bv_file_path("tiantong")
    assert isinstance(file_path, Path)
    assert "tiantong-bv.txt" in str(file_path)


def test_get_data_paths():
    """测试获取数据存储路径"""
    paths = get_data_paths("tiantong")
    assert isinstance(paths, dict)
    assert "DATA_TYPE_DIR" in paths
    assert "THUMBS_DIR" in paths
    assert "TIMELINE_FILE" in paths


def test_ensure_directories():
    """测试确保目录存在"""
    # 测试不会抛出异常
    ensure_directories("tiantong")
    # 验证目录是否创建
    paths = get_data_paths("tiantong")
    for path_name, path in paths.items():
        if isinstance(path, Path) and path.suffix == '':
            assert path.exists()
