#!/usr/bin/env python3
"""
数据迁移脚本
将现有数据迁移到新的目录结构中
"""

import os
import shutil
import json
from pathlib import Path


def backup_data():
    """备份现有数据"""
    data_dir = Path('data')
    backup_dir = Path('data_backup')
    
    if data_dir.exists():
        print(f"备份现有数据到 {backup_dir}")
        if backup_dir.exists():
            shutil.rmtree(backup_dir)
        shutil.copytree(data_dir, backup_dir)
        print("备份完成")
    else:
        print("数据目录不存在，跳过备份")


def create_directory_structure():
    """创建新目录结构"""
    # 创建公共目录
    common_dir = Path('data/common/bv-lists')
    common_dir.mkdir(parents=True, exist_ok=True)
    
    # 创建驴酱目录
    lvjiang_dir = Path('data/lvjiang/thumbs')
    lvjiang_dir.mkdir(parents=True, exist_ok=True)
    
    # 创建甜筒目录
    tiantong_dir = Path('data/tiantong/thumbs')
    tiantong_dir.mkdir(parents=True, exist_ok=True)
    
    print("目录结构创建完成")


def migrate_bv_files():
    """迁移BV号文件"""
    # 迁移驴酱BV号文件
    src_lvjiang = Path('data/lvjiang-bv.txt')
    dst_lvjiang = Path('data/common/bv-lists/lvjiang-bv.txt')
    if src_lvjiang.exists():
        shutil.move(src_lvjiang, dst_lvjiang)
        print(f"迁移驴酱BV号文件: {src_lvjiang} -> {dst_lvjiang}")
    
    # 迁移甜筒BV号文件
    src_tiantong = Path('data/tiantong-bv.txt')
    dst_tiantong = Path('data/common/bv-lists/tiantong-bv.txt')
    if src_tiantong.exists():
        shutil.move(src_tiantong, dst_tiantong)
        print(f"迁移甜筒BV号文件: {src_tiantong} -> {dst_tiantong}")


def migrate_video_data():
    """迁移视频数据"""
    # 迁移待审核数据
    migrate_file('pending.json', 'lvjiang')
    
    # 迁移已通过数据
    migrate_file('approved.json', 'lvjiang')
    
    # 迁移已拒绝数据
    migrate_file('rejected.json', 'lvjiang')
    
    # 迁移时间线数据
    migrate_file('videos.json', 'lvjiang')


def migrate_file(filename, data_type):
    """迁移单个文件"""
    src_file = Path('data', filename)
    dst_file = Path('data', data_type, filename)
    
    if src_file.exists():
        # 读取现有数据
        with open(src_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # 写入新位置
        with open(dst_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"迁移文件: {src_file} -> {dst_file}")
    else:
        print(f"文件不存在，跳过迁移: {src_file}")


def migrate_covers():
    """迁移封面图片"""
    # 这里需要根据实际情况实现封面迁移逻辑
    # 由于前端封面目录结构可能不同，暂时跳过
    print("封面迁移功能暂未实现")


def main():
    """主函数"""
    print("开始数据迁移...")
    
    # 1. 备份现有数据
    backup_data()
    
    # 2. 创建新目录结构
    create_directory_structure()
    
    # 3. 迁移BV号文件
    migrate_bv_files()
    
    # 4. 迁移视频数据
    migrate_video_data()
    
    # 5. 迁移封面图片
    migrate_covers()
    
    print("数据迁移完成！")


if __name__ == "__main__":
    main()
