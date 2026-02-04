#!/usr/bin/env python3
"""
视频封面下载模块

从B站视频页面获取封面图片并保存到本地目录。

功能：
- 从videos.json读取视频列表
- 下载每个视频的封面图片到指定目录
- 可作为独立脚本运行，也可被其他模块导入调用

Usage (as script):
  python download_thumbs.py <videos.json> <thumbs_output_dir> [--quiet]

Usage (as module):
  from src.downloader.download_thumbs import download_all_covers
  download_all_covers(videos_path, thumbs_dir, quiet=False)

Requirements:
  - Python 3.8+
  - requests (install with `pip install -r requirements.txt`)
"""

import sys
import re
import json
import time
from pathlib import Path
from urllib.parse import urlparse
from typing import Optional, List, Dict, Any

from src.utils.config import get_frontend_thumbs_dir


try:
    import requests
except Exception:
    print("Missing dependency: requests. Install it with:\n  pip install -r requirements.txt")
    sys.exit(1)


DELAY_SECONDS = 0.8


def get_og_image(html: str) -> Optional[str]:
    """从HTML中提取og:image URL
    
    Args:
        html: 页面HTML内容
        
    Returns:
        封面图片URL，如果未找到返回None
    """
    m = re.search(r'<meta\s+property=["\']og:image["\']\s+content=["\']([^"\']+)["\']', html, re.I)
    if m:
        return m.group(1)
    m = re.search(r'<meta\s+name=["\']twitter:image["\']\s+content=["\']([^"\']+)["\']', html, re.I)
    if m:
        return m.group(1)
    m = re.search(r'"pic"\s*:\s*"([^"]+)"', html)
    if m:
        return m.group(1)
    return None


def sanitize_ext(pathname: str) -> str:
    """从URL中提取文件扩展名
    
    Args:
        pathname: 文件路径或URL
        
    Returns:
        文件扩展名（含点号），如'.jpg'
    """
    ext = Path(urlparse(pathname).path).suffix
    if ext:
        return ext
    return ".jpg"


def ensure_protocol(url: str) -> str:
    """确保URL具有正确的协议头
    
    Args:
        url: 输入的URL字符串
        
    Returns:
        处理后的URL字符串
    """
    url = url.encode('utf-8').decode('unicode_escape')
    
    if url.startswith("//"):
        return "https:" + url
    elif not url.startswith("http://") and not url.startswith("https://"):
        return "https:" + url
    return url


def extract_bvid(video_url: str) -> Optional[str]:
    """从视频URL中提取BV号
    
    Args:
        video_url: B站视频URL
        
    Returns:
        BV号字符串，如'BV195zoB2EFY'，未找到返回None
    """
    m = re.search(r'(BV[0-9A-Za-z]+)', video_url)
    if m:
        return m.group(1)
    return None


def choose_filename(bvid: str, ext: str) -> str:
    """生成封面文件名
    
    Args:
        bvid: 视频BV号
        ext: 文件扩展名
        
    Returns:
        文件名，如'BV195zoB2EFY.jpg'
    """
    return f"{bvid}{ext}"


def download_binary(url: str, outpath: Path) -> bool:
    """下载二进制文件
    
    Args:
        url: 下载URL
        outpath: 保存路径
        
    Returns:
        下载成功返回True，失败返回False
    """
    try:
        headers = {"User-Agent": "Mozilla/5.0 (thumb-fetcher)"}
        with requests.get(url, headers=headers, stream=True, timeout=20) as r:
            r.raise_for_status()
            outpath.parent.mkdir(parents=True, exist_ok=True)
            with outpath.open("wb") as f:
                for chunk in r.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
        return True
    except Exception:
        return False


def get_cover_filename(bvid: str, html: str) -> str:
    """根据视频信息生成封面文件名
    
    Args:
        bvid: 视频BV号
        html: 页面HTML内容（用于提取扩展名）
        
    Returns:
        文件名，如 'BV195zoB2EFY.jpg'
    """
    og_image = get_og_image(html)
    if og_image:
        ext = sanitize_ext(og_image)
        return f"{bvid}{ext}"
    return f"{bvid}.jpg"


def get_existing_covers(thumbs_dir: Path) -> set:
    """获取已存在的封面列表
    
    一次性读取目录下所有图片文件名，提取BV号。
    
    Args:
        thumbs_dir: 封面保存目录
        
    Returns:
        set: 已存在的BV号集合
    """
    existing_covers = set()
    
    if not thumbs_dir.exists():
        return existing_covers
    
    for img_file in thumbs_dir.iterdir():
        if img_file.is_file() and img_file.suffix.lower() in ('.jpg', '.jpeg', '.png', '.webp'):
            # 提取BV号（文件名去除扩展名）
            bvid = img_file.stem
            if bvid and 'BV' in bvid:
                existing_covers.add(bvid)
    
    return existing_covers


def is_cover_exists(thumbs_dir: Path, bvid: str, html: str = None, existing_covers: set = None) -> bool:
    """检查封面图片是否已存在
    
    Args:
        thumbs_dir: 封面保存目录
        bvid: 视频BV号
        html: 页面HTML内容（可选，用于确定扩展名）
        existing_covers: 已存在的BV号集合（可选，用于内存检查）
        
    Returns:
        存在返回True，否则返回False
    """
    # 优先使用内存中的集合进行检查
    if existing_covers is not None:
        return bvid in existing_covers
    
    # 回退到传统的文件系统检查
    possible_exts = ['.jpg', '.jpeg', '.png', '.webp']
    
    if html:
        filename = get_cover_filename(bvid, html)
        filepath = thumbs_dir / filename
        if filepath.exists() and filepath.stat().st_size > 0:
            return True
    
    for ext in possible_exts:
        filepath = thumbs_dir / f"{bvid}{ext}"
        if filepath.exists() and filepath.stat().st_size > 0:
            return True
    
    return False


def download_cover(video: Dict[str, Any], thumbs_dir: Path, quiet: bool = False, existing_covers: set = None) -> Dict[str, Any]:
    """下载单个视频的封面
    
    Args:
        video: 视频数据字典
        thumbs_dir: 封面保存目录
        quiet: 静默模式，减少日志输出
        existing_covers: 已存在的BV号集合（可选，用于内存检查）
        
    Returns:
        包含结果信息的字典: {
            'status': 'success' | 'skipped' | 'failed',
            'bvid': str,
            'filename': str (实际下载的文件名),
            'path': Path (文件路径)
        }
    """
    video_url = video.get('videoUrl', '')
    bvid = extract_bvid(video_url)
    
    if not bvid:
        if not quiet:
            print(f"  [跳过] 无法提取BV号: {video_url}")
        return {'status': 'failed', 'bvid': None, 'filename': None, 'path': None}
    
    # 检查封面是否已存在
    if is_cover_exists(thumbs_dir, bvid, existing_covers=existing_covers):
        existing_file = None
        if existing_covers is None or bvid in existing_covers:
            # 仅当需要时才检查文件系统
            for check_ext in ['.jpg', '.jpeg', '.png', '.webp']:
                check_file = thumbs_dir / f"{bvid}{check_ext}"
                if check_file.exists() and check_file.stat().st_size > 0:
                    existing_file = f"{bvid}{check_ext}"
                    break
        if not quiet:
            print(f"  [跳过] 封面已存在: {bvid}")
        return {'status': 'skipped', 'bvid': bvid, 'filename': existing_file or f"{bvid}.jpg", 'path': None}
    
    # 优先使用 cover_url 下载封面
    cover_url = video.get('cover_url', '')
    if cover_url:
        try:
            cover_url = ensure_protocol(cover_url)
            ext = sanitize_ext(cover_url)
            filename = choose_filename(bvid, ext)
            outpath = thumbs_dir / filename
            
            if not quiet:
                print(f"  使用 cover_url 下载: {cover_url}")
            
            if download_binary(cover_url, outpath):
                if not quiet:
                    print(f"  [成功] {outpath}")
                return {'status': 'success', 'bvid': bvid, 'filename': filename, 'path': outpath}
            else:
                if not quiet:
                    print(f"  [失败] cover_url 下载失败，尝试传统方法")
        except Exception as e:
            if not quiet:
                print(f"  [错误] cover_url 处理失败: {str(e)}，尝试传统方法")
    
    # 回退到传统方法
    try:
        if not quiet:
            print(f"  请求页面: {video_url}")
        
        headers = {"User-Agent": "Mozilla/5.0 (thumb-fetcher)"}
        resp = requests.get(video_url, headers=headers, timeout=15)
        
        if resp.status_code != 200:
            if not quiet:
                print(f"  [失败] HTTP {resp.status_code}")
            return {'status': 'failed', 'bvid': bvid, 'filename': None, 'path': None}
        
        html = resp.text
        
        img_url = get_og_image(html)
        if img_url:
            img_url = ensure_protocol(img_url)
            ext = sanitize_ext(img_url)
        else:
            ext = '.jpg'
        filename = choose_filename(bvid, ext)
        outpath = thumbs_dir / filename
        
        if not quiet:
            print(f"  下载封面: {img_url or 'unknown'}")
        
        if img_url and download_binary(img_url, outpath):
            if not quiet:
                print(f"  [成功] {outpath}")
            return {'status': 'success', 'bvid': bvid, 'filename': filename, 'path': outpath}
        else:
            if not quiet:
                print(f"  [失败] 下载失败")
            return {'status': 'failed', 'bvid': bvid, 'filename': None, 'path': None}
            
    except Exception as e:
        if not quiet:
            print(f"  [错误] {str(e)}")
        return {'status': 'failed', 'bvid': bvid, 'filename': None, 'path': None}


def download_all_covers(videos_path: Path, thumbs_dir: Path = None, quiet: bool = False, max_workers: int = 4) -> Dict[str, Any]:
    """下载所有视频封面
    
    Args:
        videos_path: videos.json文件路径
        thumbs_dir: 封面保存目录（默认使用配置文件中的前端路径）
        quiet: 静默模式
        max_workers: 并发下载线程数
        
    Returns:
        包含结果信息的字典: {
            'success': int,
            'failed': int,
            'skipped': int,
            'downloaded_files': Dict[str, str]  # bvid -> filename
        }
    """
    # 使用默认的前端路径
    if thumbs_dir is None:
        thumbs_dir = get_frontend_thumbs_dir()
    
    if not videos_path.exists():
        if not quiet:
            print(f"[错误] videos.json不存在: {videos_path}")
        return {'success': 0, 'failed': 0, 'skipped': 0, 'downloaded_files': {}}
    
    with videos_path.open("r", encoding="utf-8") as f:
        data = json.load(f)
    
    videos = data if isinstance(data, list) else data.get("videos", [])
    
    if not quiet:
        print(f"找到 {len(videos)} 个视频")
        print(f"封面保存目录: {thumbs_dir}")
        print(f"并发下载线程数: {max_workers}")
    
    thumbs_dir.mkdir(parents=True, exist_ok=True)
    
    # 批量预加载已存在的封面
    existing_covers = get_existing_covers(thumbs_dir)
    if not quiet:
        print(f"已存在 {len(existing_covers)} 个封面")
    
    results = {'success': 0, 'failed': 0, 'skipped': 0, 'downloaded_files': {}}
    
    # 过滤有效视频
    valid_videos = []
    for video in videos:
        video_url = video.get('videoUrl', '')
        if video_url and "BV" in video_url and "bilibili.com" in video_url:
            valid_videos.append(video)
        else:
            results['skipped'] += 1
    
    if not valid_videos:
        if not quiet:
            print("没有有效的视频URL")
        return results
    
    # 并发下载
    from concurrent.futures import ThreadPoolExecutor, as_completed
    
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        # 提交下载任务
        future_to_video = {}
        for video in valid_videos:
            future = executor.submit(download_cover, video, thumbs_dir, quiet, existing_covers)
            future_to_video[future] = video
        
        # 收集结果
        for future in as_completed(future_to_video):
            video = future_to_video[future]
            try:
                result = future.result()
                bvid = extract_bvid(video.get('videoUrl', ''))
                
                if result['status'] == 'success':
                    results['success'] += 1
                    if bvid and result['filename']:
                        results['downloaded_files'][bvid] = result['filename']
                        # 将新下载的封面添加到集合中
                        existing_covers.add(bvid)
                elif result['status'] == 'skipped':
                    results['skipped'] += 1
                    if bvid and result['filename']:
                        results['downloaded_files'][bvid] = result['filename']
                else:
                    results['failed'] += 1
            except Exception as e:
                if not quiet:
                    print(f"  [错误] 任务执行失败: {str(e)}")
                results['failed'] += 1
    
    if not quiet:
        print(f"\n下载完成: 成功 {results['success']}, 失败 {results['failed']}, 跳过 {results['skipped']}")
    
    return results


def main():
    """主函数，命令行入口"""
    import argparse
    
    parser = argparse.ArgumentParser(description='下载B站视频封面图片')
    parser.add_argument('videos_json', type=Path, help='videos.json文件路径')
    parser.add_argument('thumbs_dir', type=Path, nargs='?', default=None, help='封面保存目录（默认使用配置文件中的前端路径）')
    parser.add_argument('--quiet', '-q', action='store_true', help='静默模式，减少输出')
    parser.add_argument('--max-workers', type=int, default=4, help='并发下载线程数（默认：4）')
    
    args = parser.parse_args()
    
    results = download_all_covers(args.videos_json, args.thumbs_dir, args.quiet, args.max_workers)
    
    sys.exit(0 if results['success'] > 0 else 1)


if __name__ == "__main__":
    main()
