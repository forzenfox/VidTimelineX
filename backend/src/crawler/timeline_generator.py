#!/usr/bin/env python3
"""
时间线生成器模块
用于生成前端所需的时间线数据
"""

import json
import re
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
    
    def _extract_bv_from_item(self, item):
        """从时间线条目中提取 BV 号
        
        Args:
            item: 时间线条目
            
        Returns:
            str: BV 号，未找到返回空字符串
        """
        if not isinstance(item, dict):
            return ''
        
        bv = None
        
        # 1. 从 videoUrl 字段提取（优先级最高）
        if not bv and 'videoUrl' in item:
            url = item.get('videoUrl', '')
            match = re.search(r'(BV[0-9A-Za-z]+)', url)
            if match:
                bv = match.group(1)
        
        # 2. 从 cover 字段提取（支持带或不带 BV 前缀的格式）
        if not bv and 'cover' in item:
            cover = item.get('cover', '')
            # 检查是否带 BV 前缀
            if cover.startswith('BV'):
                bv = cover.split('.')[0]
            else:
                # 尝试从文件名中提取可能的 BV 号格式
                # 匹配类似 15NzrBBEJQ.jpg 的格式
                match = re.search(r'([0-9A-Za-z]{10,})\.[a-zA-Z]+$', cover)
                if match:
                    # 假设这是一个 BV 号（不带前缀）
                    bv = f"BV{match.group(1)}"
        
        # 3. 从嵌套的 video 对象中提取
        if not bv and 'video' in item:
            video_info = item.get('video')
            if isinstance(video_info, dict):
                bv = video_info.get('bv')
        
        # 4. 从顶级 bv 字段提取
        if not bv and 'bv' in item:
            bv = item.get('bv')
        
        return bv if bv else ''
    
    def generate_timeline(self, videos):
        """生成时间线数据
        
        Args:
            videos: 视频元数据列表
            
        Returns:
            list: 时间线数据（符合前端 videos.json 格式）
        """
        timeline_data = []
        
        sorted_videos = sorted(videos, key=lambda x: x.get('publish_date', ''), reverse=True)
        
        for i, video in enumerate(sorted_videos):
            bv = video.get('bv', '')
            thumbnail = video.get('thumbnail', '')
            
            # 直接使用bv字段，不添加额外的BV前缀
            cover = f"{bv}.jpg" if bv else ""
            
            # 处理日期格式，只保留日期部分
            publish_date = video.get('publish_date', '')
            date_str = publish_date
            
            if publish_date:
                date_obj = None
                try:
                    # 尝试解析不同格式的日期字符串
                    if ' ' in publish_date:
                        # 包含时间的格式，如 "2026-01-17"
                        date_obj = datetime.strptime(publish_date, "%Y-%m-%d %H:%M:%S")
                    elif '-' in publish_date:
                        # 只包含日期的格式，如 "2026-01-17"
                        date_obj = datetime.strptime(publish_date, "%Y-%m-%d")
                    elif '年' in publish_date:
                        # 中文格式，如 "2026年01月17日"
                        date_obj = datetime.strptime(publish_date, "%Y年%m月%d日")
                    else:
                        # 其他格式，保持不变
                        date_str = publish_date
                except ValueError:
                    # 解析失败，保持原始值
                    date_str = publish_date
                else:
                    # 格式化为只包含日期的字符串
                    if date_obj:
                        date_str = date_obj.strftime("%Y-%m-%d")
            
            # 修复cover_url协议，确保使用https
            cover_url = thumbnail
            if cover_url and cover_url.startswith('http://'):
                cover_url = cover_url.replace('http://', 'https://')
            
            timeline_item = {
                "id": str(i + 1),
                "date": date_str,
                "title": video.get('title'),
                "videoUrl": video.get('url'),
                "cover": cover,
                "cover_url": cover_url,
                "tags": [],
                "duration": video.get('duration')
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
            output_file.parent.mkdir(parents=True, exist_ok=True)
            
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
        
        config = get_data_paths(data_type)
        output_file = config.get('TIMELINE_FILE')
        
        existing_timeline = self.load_existing_timeline(output_file)
        
        new_timeline_data = self.generate_timeline(videos)
        
        if not new_timeline_data and not existing_timeline:
            return {"success": False, "message": "无视频数据"}
        
        all_timeline_data = []
        existing_bvs = set()
        
        # 处理现有时间线数据
        for item in existing_timeline:
            if isinstance(item, dict):
                bv = self._extract_bv_from_item(item)
                if bv:
                    existing_bvs.add(bv)
                    all_timeline_data.append(item)
        
        # 处理新时间线数据，确保不重复
        for item in new_timeline_data:
            if isinstance(item, dict):
                bv = self._extract_bv_from_item(item)
                if bv and bv not in existing_bvs:
                    existing_bvs.add(bv)
                    all_timeline_data.append(item)
        
        # 最终去重，确保没有重复数据
        final_timeline_data = []
        final_bvs = set()
        
        for item in all_timeline_data:
            if isinstance(item, dict):
                bv = self._extract_bv_from_item(item)
                if bv and bv not in final_bvs:
                    final_bvs.add(bv)
                    final_timeline_data.append(item)
            elif item not in final_timeline_data:
                # 非字典类型数据直接添加（如果不存在）
                final_timeline_data.append(item)
        
        all_timeline_data = final_timeline_data
        
        all_timeline_data.sort(key=lambda x: x.get('date', ''), reverse=True)
        
        for i, item in enumerate(all_timeline_data):
            item['id'] = str(i + 1)
        
        saved = self.save_timeline(all_timeline_data, output_file)
        
        if saved:
            return {"success": True, "count": len(all_timeline_data)}
        else:
            return {"success": False, "message": "保存失败"}
