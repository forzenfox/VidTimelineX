#!/usr/bin/env python3
"""
将待审核视频移动到已通过审核列表
"""

import json
from pathlib import Path

def main():
    # 加载待审核数据
    pending_path = Path('data/pending.json')
    with open(pending_path, 'r', encoding='utf-8') as f:
        pending_data = json.load(f)
    
    pending_videos = pending_data.get('videos', [])
    
    if not pending_videos:
        print("没有待审核视频")
        return
    
    # 加载已通过数据
    approved_path = Path('data/approved.json')
    with open(approved_path, 'r', encoding='utf-8') as f:
        approved_data = json.load(f)
    
    approved_videos = approved_data.get('videos', [])
    
    # 移动前5个待审核视频到已通过列表
    videos_to_approve = pending_videos[:5]
    approved_videos.extend(videos_to_approve)
    
    # 更新已通过数据
    approved_data['videos'] = approved_videos
    with open(approved_path, 'w', encoding='utf-8') as f:
        json.dump(approved_data, f, ensure_ascii=False, indent=2)
    
    # 更新待审核数据
    pending_data['videos'] = pending_videos[5:]
    with open(pending_path, 'w', encoding='utf-8') as f:
        json.dump(pending_data, f, ensure_ascii=False, indent=2)
    
    print(f"已将 {len(videos_to_approve)} 个视频从待审核列表移动到已通过列表")
    print(f"当前待审核视频数: {len(pending_data['videos'])}")
    print(f"当前已通过视频数: {len(approved_data['videos'])}")

if __name__ == "__main__":
    main()
