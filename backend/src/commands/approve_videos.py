#!/usr/bin/env python3
"""
视频审核工具
用于将待审核视频移动到已通过或已拒绝列表，支持根据duration字段进行筛选
"""

import json
import argparse
from pathlib import Path

# 导入配置文件
from src.utils.config import DATA_DIR, PENDING_FILE, APPROVED_FILE, REJECTED_FILE


def approve_videos(limit=5, check_duration=False):
    """将待审核视频移动到已通过审核列表
    
    Args:
        limit (int): 批准的视频数量限制
        check_duration (bool): 是否检查duration字段
    """
    # 加载待审核数据
    with open(PENDING_FILE, 'r', encoding='utf-8') as f:
        pending_data = json.load(f)
    
    pending_videos = pending_data.get('videos', [])
    
    if not pending_videos:
        print("没有待审核视频")
        return
    
    # 筛选视频
    if check_duration:
        # 筛选包含有效duration字段的视频
        videos_to_approve = [v for v in pending_videos if 'duration' in v and v['duration'] != '00:00'][:limit]
    else:
        # 直接获取前limit个视频
        videos_to_approve = pending_videos[:limit]
    
    if not videos_to_approve:
        if check_duration:
            print("没有包含有效duration字段的视频")
        else:
            print("没有待审核视频")
        return
    
    # 加载已通过数据
    with open(APPROVED_FILE, 'r', encoding='utf-8') as f:
        approved_data = json.load(f)
    
    approved_videos = approved_data.get('videos', [])
    
    # 移动视频到已通过列表
    approved_videos.extend(videos_to_approve)
    
    # 更新已通过数据
    approved_data['videos'] = approved_videos
    with open(APPROVED_FILE, 'w', encoding='utf-8') as f:
        json.dump(approved_data, f, ensure_ascii=False, indent=2)
    
    # 从待审核列表中移除已批准的视频
    remaining_videos = [v for v in pending_videos if v not in videos_to_approve]
    pending_data['videos'] = remaining_videos
    with open(PENDING_FILE, 'w', encoding='utf-8') as f:
        json.dump(pending_data, f, ensure_ascii=False, indent=2)
    
    # 打印结果
    if check_duration:
        print(f"已将 {len(videos_to_approve)} 个包含duration字段的视频从待审核列表移动到已通过列表")
    else:
        print(f"已将 {len(videos_to_approve)} 个视频从待审核列表移动到已通过列表")
    print(f"当前待审核视频数: {len(pending_data['videos'])}")
    print(f"当前已通过视频数: {len(approved_data['videos'])}")


def reject_videos(limit=5):
    """将待审核视频移动到已拒绝列表
    
    Args:
        limit (int): 拒绝的视频数量限制
    """
    # 加载待审核数据
    with open(PENDING_FILE, 'r', encoding='utf-8') as f:
        pending_data = json.load(f)
    
    pending_videos = pending_data.get('videos', [])
    
    if not pending_videos:
        print("没有待审核视频")
        return
    
    # 获取前limit个视频
    videos_to_reject = pending_videos[:limit]
    
    # 加载已拒绝数据
    with open(REJECTED_FILE, 'r', encoding='utf-8') as f:
        rejected_data = json.load(f)
    
    rejected_videos = rejected_data.get('videos', [])
    
    # 移动视频到已拒绝列表
    rejected_videos.extend(videos_to_reject)
    
    # 更新已拒绝数据
    rejected_data['videos'] = rejected_videos
    with open(REJECTED_FILE, 'w', encoding='utf-8') as f:
        json.dump(rejected_data, f, ensure_ascii=False, indent=2)
    
    # 从待审核列表中移除已拒绝的视频
    remaining_videos = [v for v in pending_videos if v not in videos_to_reject]
    pending_data['videos'] = remaining_videos
    with open(PENDING_FILE, 'w', encoding='utf-8') as f:
        json.dump(pending_data, f, ensure_ascii=False, indent=2)
    
    # 打印结果
    print(f"已将 {len(videos_to_reject)} 个视频从待审核列表移动到已拒绝列表")
    print(f"当前待审核视频数: {len(pending_data['videos'])}")
    print(f"当前已拒绝视频数: {len(rejected_data['videos'])}")


def main():
    """主函数，提供命令行界面"""
    parser = argparse.ArgumentParser(description='视频审核工具')
    parser.add_argument('--action', type=str, default='approve', choices=['approve', 'reject'],
                        help='审核动作：approve（批准）或reject（拒绝）')
    parser.add_argument('--limit', type=int, default=5,
                        help='处理的视频数量限制')
    parser.add_argument('--check-duration', action='store_true',
                        help='是否检查视频duration字段（仅适用于approve动作）')
    
    args = parser.parse_args()
    
    if args.action == 'approve':
        approve_videos(limit=args.limit, check_duration=args.check_duration)
    else:
        reject_videos(limit=args.limit)


if __name__ == "__main__":
    main()