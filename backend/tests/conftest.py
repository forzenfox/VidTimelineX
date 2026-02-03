#!/usr/bin/env python3
"""
测试配置文件
"""

import pytest
from pathlib import Path

# 项目根目录
PROJECT_ROOT = Path(__file__).parent.parent

# 数据目录
DATA_DIR = PROJECT_ROOT / "data"

@pytest.fixture
def project_root():
    """项目根目录"""
    return PROJECT_ROOT

@pytest.fixture
def data_dir():
    """数据目录"""
    return DATA_DIR
