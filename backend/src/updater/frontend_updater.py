#!/usr/bin/env python3
"""
前端文件更新模块

用于将后端生成的视频数据更新到前端项目中。

功能：
- 合并 videos.json 文件，保留前端的 tags 字段
- 支持 lvjiang 和 tiantong 两个数据类型

注意：封面图片现在直接下载到前端目录，无需复制操作。
"""

import json
import re
from pathlib import Path
from typing import Dict, List, Any


def extract_bv_from_url(url: str) -> str:
    """从视频 URL 中提取 BV 号
    
    Args:
        url: 视频 URL
        
    Returns:
        str: BV 号
    """
    match = re.search(r'(BV[0-9A-Za-z]+)', url)
    if match:
        return match.group(1)
    return ''


def extract_bv_from_cover(cover: str) -> str:
    """从封面文件名中提取 BV 号
    
    Args:
        cover: 封面文件名
        
    Returns:
        str: BV 号
    """
    if cover.startswith('BV'):
        return cover.split('.')[0]
    return ''


def merge_videos_json(backend_file: Path, frontend_file: Path) -> Dict[str, Any]:
    """合并后端和前端的 videos.json 文件
    
    保留前端文件的 "tags" 字段内容，其他字段覆盖更新。
    
    Args:
        backend_file: 后端生成的 videos.json 文件路径
        frontend_file: 前端的 videos.json 文件路径
        
    Returns:
        dict: 合并结果
    """
    try:
        # 读取后端数据
        with open(backend_file, 'r', encoding='utf-8') as f:
            backend_data = json.load(f)
        
        if not isinstance(backend_data, list):
            return {"success": False, "message": "后端数据格式错误"}
        
        # 读取前端数据
        frontend_tags = {}
        if frontend_file.exists():
            with open(frontend_file, 'r', encoding='utf-8') as f:
                frontend_data = json.load(f)
            
            if isinstance(frontend_data, list):
                # 提取前端数据中的 tags
                for item in frontend_data:
                    if isinstance(item, dict):
                        # 从 URL 或封面中提取 BV 号
                        bv = extract_bv_from_url(item.get('videoUrl', ''))
                        if not bv:
                            bv = extract_bv_from_cover(item.get('cover', ''))
                        
                        if bv:
                            frontend_tags[bv] = item.get('tags', [])
        
        # 合并数据
        merged_data = []
        for item in backend_data:
            if isinstance(item, dict):
                # 提取 BV 号
                bv = extract_bv_from_url(item.get('videoUrl', ''))
                if not bv:
                    bv = extract_bv_from_cover(item.get('cover', ''))
                
                # 保留前端的 tags
                if bv and bv in frontend_tags:
                    item['tags'] = frontend_tags[bv]
                else:
                    item['tags'] = []
                
                merged_data.append(item)
        
        # 按日期排序
        merged_data.sort(key=lambda x: x.get('date', ''), reverse=True)
        
        # 重新生成 ID
        for i, item in enumerate(merged_data):
            item['id'] = str(i + 1)
        
        # 保存到前端文件
        frontend_file.parent.mkdir(parents=True, exist_ok=True)
        with open(frontend_file, 'w', encoding='utf-8') as f:
            json.dump(merged_data, f, ensure_ascii=False, indent=2)
        
        return {
            "success": True,
            "merged_count": len(merged_data),
            "message": f"成功合并 {len(merged_data)} 条视频数据"
        }
        
    except Exception as e:
        return {
            "success": False,
            "message": f"合并失败: {str(e)}"
        }





def update_frontend_files(data_type: str, config: Dict[str, Any]) -> Dict[str, Any]:
    """更新前端文件
    
    Args:
        data_type: 数据类型，可选值: lvjiang, tiantong
        config: 配置字典，包含路径信息
        
    Returns:
        dict: 更新结果
    """
    try:
        # 获取路径
        backend_data_dir = Path(config.get('backend_data_dir', './data'))
        frontend_data_dir = Path(config.get('frontend_data_dir', '../frontend'))
        
        # 后端文件路径
        backend_videos_file = backend_data_dir / data_type / 'videos.json'
        
        # 前端文件路径
        frontend_videos_file = frontend_data_dir / 'src' / 'features' / data_type / 'data' / 'videos.json'
        
        # 验证路径
        if not backend_videos_file.exists():
            return {
                "success": False,
                "message": f"后端文件不存在: {backend_videos_file}"
            }
        
        # 合并 videos.json
        merge_result = merge_videos_json(backend_videos_file, frontend_videos_file)
        
        return {
            "success": merge_result['success'],
            "merge_result": merge_result,
            "message": f"更新 {data_type} 前端文件完成"
        }
        
    except Exception as e:
        return {
            "success": False,
            "message": f"更新失败: {str(e)}"
        }


def main(data_types: List[str] = None):
    """主函数
    
    Args:
        data_types: 要更新的数据类型列表，默认更新所有
    """
    if data_types is None:
        data_types = ['lvjiang', 'tiantong']
    
    # 默认配置
    config = {
        'backend_data_dir': './data',
        'frontend_data_dir': '../frontend'
    }
    
    for data_type in data_types:
        print(f"\n=== 更新 {data_type} 前端文件 ===")
        result = update_frontend_files(data_type, config)
        
        print(f"结果: {'成功' if result['success'] else '失败'}")
        print(f"消息: {result.get('message', '')}")
        
        if 'merge_result' in result:
            merge_msg = result['merge_result'].get('message', '')
            print(f"合并结果: {merge_msg}")


if __name__ == "__main__":
    main()
