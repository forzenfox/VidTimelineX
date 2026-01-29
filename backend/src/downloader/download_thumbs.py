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
  from download_thumbs import download_all_covers
  download_all_covers(videos_path, thumbs_dir, quiet=False)

Requirements:
  - Python 3.8+
  - requests (install with `pip install -r requirements.txt`)
"""
import sys
import re
import json
import time
import argparse
from pathlib import Path
from urllib.parse import urlparse
from typing import Optional, List, Dict, Any

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


def download_cover(video: Dict[str, Any], thumbs_dir: Path, quiet: bool = False) -> Optional[Path]:
    """下载单个视频的封面
    
    Args:
        video: 视频数据字典
        thumbs_dir: 封面保存目录
        quiet: 静默模式，减少日志输出
        
    Returns:
        成功返回文件路径，失败返回None
    """
    video_url = video.get('videoUrl', '')
    bvid = extract_bvid(video_url)
    
    if not bvid:
        if not quiet:
            print(f"  [跳过] 无法提取BV号: {video_url}")
        return None
    
    try:
        if not quiet:
            print(f"  请求页面: {video_url}")
        
        headers = {"User-Agent": "Mozilla/5.0 (thumb-fetcher)"}
        resp = requests.get(video_url, headers=headers, timeout=15)
        
        if resp.status_code != 200:
            if not quiet:
                print(f"  [失败] HTTP {resp.status_code}")
            return None
        
        html = resp.text
        img_url = get_og_image(html)
        
        if not img_url:
            if not quiet:
                print(f"  [失败] 未找到封面图片")
            return None
        
        img_url = ensure_protocol(img_url)
        ext = sanitize_ext(img_url)
        filename = choose_filename(bvid, ext)
        outpath = thumbs_dir / filename
        
        if not quiet:
            print(f"  下载封面: {img_url}")
        
        if download_binary(img_url, outpath):
            if not quiet:
                print(f"  [成功] {outpath}")
            return outpath
        else:
            if not quiet:
                print(f"  [失败] 下载失败")
            return None
            
    except Exception as e:
        if not quiet:
            print(f"  [错误] {str(e)}")
        return None


def download_all_covers(videos_path: Path, thumbs_dir: Path, quiet: bool = False) -> Dict[str, int]:
    """下载所有视频封面
    
    Args:
        videos_path: videos.json文件路径
        thumbs_dir: 封面保存目录
        quiet: 静默模式
        
    Returns:
        包含成功和失败数量的字典 {'success': int, 'failed': int, 'skipped': int}
    """
    if not videos_path.exists():
        if not quiet:
            print(f"[错误] videos.json不存在: {videos_path}")
        return {'success': 0, 'failed': 0, 'skipped': 0}
    
    with videos_path.open("r", encoding="utf-8") as f:
        data = json.load(f)
    
    videos = data if isinstance(data, list) else data.get("videos", [])
    
    if not quiet:
        print(f"找到 {len(videos)} 个视频")
        print(f"封面保存目录: {thumbs_dir}")
    
    thumbs_dir.mkdir(parents=True, exist_ok=True)
    
    results = {'success': 0, 'failed': 0, 'skipped': 0}
    
    for idx, video in enumerate(videos):
        video_url = video.get('videoUrl', '')
        
        if not video_url or "BV" not in video_url:
            results['skipped'] += 1
            continue
        
        if "bilibili.com" not in video_url:
            results['skipped'] += 1
            continue
        
        outpath = download_cover(video, thumbs_dir, quiet)
        
        if outpath:
            results['success'] += 1
        else:
            results['failed'] += 1
        
        time.sleep(DELAY_SECONDS)
    
    if not quiet:
        print(f"\n下载完成: 成功 {results['success']}, 失败 {results['failed']}, 跳过 {results['skipped']}")
    
    return results


def main():
    """主函数，命令行入口"""
    parser = argparse.ArgumentParser(description='下载B站视频封面图片')
    parser.add_argument('videos_json', type=Path, help='videos.json文件路径')
    parser.add_argument('thumbs_dir', type=Path, help='封面保存目录')
    parser.add_argument('--quiet', '-q', action='store_true', help='静默模式，减少输出')
    
    args = parser.parse_args()
    
    results = download_all_covers(args.videos_json, args.thumbs_dir, args.quiet)
    
    sys.exit(0 if results['success'] > 0 else 1)


if __name__ == "__main__":
    main()
