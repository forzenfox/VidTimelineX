#!/usr/bin/env python3
"""
视频数据去重脚本

用于清理 videos.json 中的重复条目
"""

import json
from pathlib import Path
from collections import OrderedDict


def dedup_videos_json(videos_path: Path) -> dict:
    """对 videos.json 进行去重
    
    Args:
        videos_path: videos.json 文件路径
        
    Returns:
        dict: 去重结果统计
    """
    if not videos_path.exists():
        print(f"文件不存在: {videos_path}")
        return {"success": False, "message": "文件不存在"}
    
    # 读取数据
    with open(videos_path, 'r', encoding='utf-8') as f:
        videos = json.load(f)
    
    if not isinstance(videos, list):
        print(f"数据格式错误: {videos_path}")
        return {"success": False, "message": "数据格式错误"}
    
    original_count = len(videos)
    print(f"原始数据: {original_count} 条")
    
    # 使用 OrderedDict 去重（保留最后出现的）
    seen = OrderedDict()
    duplicates = []
    
    for video in videos:
        if not isinstance(video, dict):
            continue
        
        # 使用 bv 字段作为唯一键
        bv = video.get('bv', '')
        if not bv:
            # 如果没有 bv 字段，尝试从 cover 或 videoUrl 提取
            cover = video.get('cover', '')
            if cover.startswith('BV'):
                bv = cover.split('.')[0]
            else:
                video_url = video.get('videoUrl', '')
                if 'BV' in video_url:
                    import re
                    match = re.search(r'(BV[0-9A-Za-z]+)', video_url)
                    if match:
                        bv = match.group(1)
        
        if bv:
            if bv in seen:
                duplicates.append(bv)
            seen[bv] = video
        else:
            # 没有BV号的视频，保留原样
            seen[f"no_bv_{id(video)}"] = video
    
    # 重建列表并重新编号
    deduped_videos = list(seen.values())
    
    # 按日期倒序排序
    deduped_videos.sort(key=lambda x: x.get('date', ''), reverse=True)
    
    # 重新编号
    for i, video in enumerate(deduped_videos, 1):
        video['id'] = str(i)
    
    deduped_count = len(deduped_videos)
    removed_count = original_count - deduped_count
    
    print(f"去重后: {deduped_count} 条")
    print(f"移除重复: {removed_count} 条")
    
    if duplicates:
        print(f"重复的BV号: {', '.join(set(duplicates))}")
    
    # 保存去重后的数据
    with open(videos_path, 'w', encoding='utf-8') as f:
        json.dump(deduped_videos, f, ensure_ascii=False, indent=2)
    
    print(f"已保存到: {videos_path}")
    
    return {
        "success": True,
        "original_count": original_count,
        "deduped_count": deduped_count,
        "removed_count": removed_count,
        "duplicates": list(set(duplicates))
    }


def main():
    """主函数"""
    import sys
    
    # 处理 lvjiang 和 tiantong 的数据
    data_types = ['lvjiang', 'tiantong']
    
    for data_type in data_types:
        videos_path = Path(f'data/{data_type}/videos.json')
        print(f"\n=== 处理 {data_type} 数据 ===")
        result = dedup_videos_json(videos_path)
        if result.get('success'):
            print(f"结果: 成功")
            print(f"  原始: {result['original_count']} 条")
            print(f"  去重后: {result['deduped_count']} 条")
            print(f"  移除: {result['removed_count']} 条")
        else:
            print(f"结果: 失败 - {result.get('message')}")


if __name__ == "__main__":
    main()
