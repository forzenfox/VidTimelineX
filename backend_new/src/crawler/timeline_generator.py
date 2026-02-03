#!/usr/bin/env python3
"""
时间线生成器模块
用于生成前端所需的时间线数据
"""

import json
from pathlib import Path
from datetime import datetime
from src.utils.config import get_config
from src.utils.path_manager import get_data_paths


class TimelineGenerator:
    """时间线生成器类
    
    用于生成前端所需的时间线数据
    """
    
    def __init__(self):
        """初始化时间线生成器"""
        self.config = get_config()
    
    def load_video_metadata(self, metadata_list):
        """加载视频元数据列表
        
        Args:
            metadata_list: 视频元数据列表
            
        Returns:
            list: 视频元数据列表
        """
        return metadata_list
    
    def load_existing_timeline(self, timeline_file):
        """加载现有时间线数据
        
        Args:
            timeline_file: 时间线文件路径
            
        Returns:
            list: 现有时间线数据
        """
        try:
            if not timeline_file.exists():
                return []
            
            with open(timeline_file, 'r', encoding='utf-8') as f:
                timeline_data = json.load(f)
            
            if isinstance(timeline_data, list):
                print(f"成功加载 {len(timeline_data)} 条现有时间线数据")
                return timeline_data
            else:
                print("时间线数据格式错误，返回空列表")
                return []
        except Exception as e:
            print(f"加载现有时间线数据失败: {e}")
            return []
    
    def generate_timeline(self, videos):
        """生成时间线数据
        
        Args:
            videos: 视频元数据列表
            
        Returns:
            list: 时间线数据
        """
        timeline_data = []
        
        # 按照发布日期排序（降序）
        sorted_videos = sorted(videos, key=lambda x: x.get('publish_date', ''), reverse=True)
        
        for i, video in enumerate(sorted_videos):
            timeline_item = {
                "id": i + 1,
                "date": video.get('publish_date'),
                "title": video.get('title'),
                "content": video.get('description', ''),
                "video": {
                    "bv": video.get('bv'),
                    "url": video.get('url')
                },
                "thumbnail": video.get('thumbnail'),
                "views": video.get('views'),
                "danmaku": video.get('danmaku'),
                "up主": video.get('up主'),
                "duration": video.get('duration'),
                "crawled_at": video.get('crawled_at')
            }
            timeline_data.append(timeline_item)
        
        print(f"生成了 {len(timeline_data)} 条时间线数据")
        return timeline_data
    
    def save_timeline(self, timeline_data, output_file):
        """保存时间线数据到文件
        
        Args:
            timeline_data: 时间线数据
            output_file: 输出文件路径
            
        Returns:
            bool: 保存成功返回True，否则返回False
        """
        try:
            # 确保输出目录存在
            output_file.parent.mkdir(parents=True, exist_ok=True)
            
            # 保存时间线数据
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(timeline_data, f, ensure_ascii=False, indent=2)
            
            print(f"成功保存时间线数据到 {output_file}")
            return True
        except Exception as e:
            print(f"保存时间线数据失败: {e}")
            return False
    
    def run(self, videos, data_type):
        """运行时间线生成任务
        
        Args:
            videos: 视频元数据列表
            data_type: 数据类型
            
        Returns:
            dict: 生成结果
        """
        print(f"\n=== 生成 {data_type} 时间线数据 ===")
        
        # 获取输出文件路径
        config = get_data_paths(data_type)
        output_file = config.get('TIMELINE_FILE')
        
        # 加载现有时间线数据
        existing_timeline = self.load_existing_timeline(output_file)
        
        # 生成新视频的时间线数据
        new_timeline_data = self.generate_timeline(videos)
        
        if not new_timeline_data and not existing_timeline:
            return {"success": False, "message": "无视频数据"}
        
        # 合并数据并去重
        all_timeline_data = []
        existing_bvs = set()
        
        # 先添加现有数据
        for item in existing_timeline:
            if isinstance(item, dict):
                video_info = item.get('video', {})
                if isinstance(video_info, dict):
                    bv = video_info.get('bv')
                    if bv:
                        existing_bvs.add(bv)
                        all_timeline_data.append(item)
        
        # 再添加新数据（排除已存在的）
        for item in new_timeline_data:
            if isinstance(item, dict):
                video_info = item.get('video', {})
                if isinstance(video_info, dict):
                    bv = video_info.get('bv')
                    if bv and bv not in existing_bvs:
                        existing_bvs.add(bv)
                        all_timeline_data.append(item)
        
        # 按发布日期重新排序（降序）
        all_timeline_data.sort(key=lambda x: x.get('date', ''), reverse=True)
        
        # 重新分配ID
        for i, item in enumerate(all_timeline_data):
            item['id'] = i + 1
        
        # 保存时间线数据
        saved = self.save_timeline(all_timeline_data, output_file)
        
        if saved:
            return {"success": True, "count": len(all_timeline_data)}
        else:
            return {"success": False, "message": "保存失败"}
