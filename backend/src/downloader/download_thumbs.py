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
from typing import Optional, List, Dict, Any, Set

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
        video_url: B站视频URL或包含BV号的字符串
        
    Returns:
        BV号字符串，如'BV195zoB2EFY'，未找到返回None
    """
    if not video_url:
        return None
    m = re.search(r'(BV[0-9A-Za-z]+)', video_url)
    if m:
        return m.group(1)
    return None


def convert_to_webp(input_path: Path, output_path: Path, quality: int = 85) -> bool:
    """将图片转换为 WebP 格式
    
    Args:
        input_path: 输入图片路径
        output_path: 输出 WebP 路径
        quality: 压缩质量 (0-100)
        
    Returns:
        转换成功返回 True
    """
    try:
        from PIL import Image
        with Image.open(input_path) as img:
            # 转换为 RGB 模式（处理 RGBA 等）
            if img.mode in ('RGBA', 'LA', 'P'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                if img.mode in ('RGBA', 'LA'):
                    background.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
                    img = background
                else:
                    img = img.convert('RGB')
            elif img.mode != 'RGB':
                img = img.convert('RGB')
            
            img.save(output_path, 'WEBP', quality=quality, method=6)
        return True
    except Exception as e:
        print(f"转换 WebP 失败: {e}")
        return False


def get_existing_cover_filename(thumbs_dir: Path, bvid: str) -> Optional[str]:
    """获取已存在封面的文件名
    
    Args:
        thumbs_dir: 封面目录
        bvid: BV号
        
    Returns:
        文件名（如 BV1.webp），不存在返回 None
    """
    for ext in ['.webp', '.jpg', '.jpeg', '.png']:
        filepath = thumbs_dir / f"{bvid}{ext}"
        if filepath.exists() and filepath.stat().st_size > 0:
            return f"{bvid}{ext}"
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


def download_binary(url: str, outpath: Path, quiet: bool = False) -> bool:
    """下载二进制文件
    
    Args:
        url: 下载URL
        outpath: 保存路径
        quiet: 静默模式，减少日志输出
        
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
    except requests.exceptions.Timeout:
        if not quiet:
            print(f"  [失败] 下载超时: {url}")
        return False
    except requests.exceptions.HTTPError as e:
        if not quiet:
            print(f"  [失败] HTTP错误 {e.response.status_code}: {url}")
        return False
    except requests.exceptions.ConnectionError:
        if not quiet:
            print(f"  [失败] 连接错误: {url}")
        return False
    except Exception as e:
        if not quiet:
            print(f"  [失败] 下载异常: {str(e)}: {url}")
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


def download_cover(video: Dict[str, Any], thumbs_dir: Path, quiet: bool = False, 
                   existing_covers: set = None, enable_webp_conversion: bool = True) -> Dict[str, Any]:
    """下载单个视频的封面
    
    新流程：
    1. 从 video['bv'] 获取 BV 号（不再依赖 videoUrl）
    2. 检查封面是否已存在
    3. 下载原图到临时文件
    4. 转换为 WebP 格式（可选）
    5. 删除原图，保留 WebP
    6. 返回实际文件名
    
    Args:
        video: 视频数据字典，优先使用 'bv' 字段
        thumbs_dir: 封面保存目录
        quiet: 静默模式，减少日志输出
        existing_covers: 已存在的BV号集合（可选，用于内存检查）
        enable_webp_conversion: 是否转换为 WebP 格式
        
    Returns:
        包含结果信息的字典: {
            'status': 'success' | 'skipped' | 'failed',
            'bvid': str,
            'filename': str (实际下载的文件名),
            'cover': str (同 filename，用于更新 videos.json),
            'path': Path (文件路径)
        }
    """
    # 1. 从 bv 字段获取 BV 号（优先级最高）
    bvid = video.get('bv', '')
    
    # 如果 bv 字段不存在，尝试从 cover 字段提取（兼容旧数据）
    if not bvid:
        cover = video.get('cover', '')
        bvid = extract_bvid(cover)
    
    # 如果还没有，尝试从 videoUrl 提取（最后的回退）
    if not bvid:
        video_url = video.get('videoUrl', '')
        bvid = extract_bvid(video_url)
    
    if not bvid:
        if not quiet:
            print(f"  [跳过] 无法获取 BV 号")
        return {'status': 'failed', 'bvid': None, 'filename': None, 'cover': None, 'path': None}
    
    # 2. 检查封面是否已存在
    if is_cover_exists(thumbs_dir, bvid, existing_covers=existing_covers):
        existing_file = get_existing_cover_filename(thumbs_dir, bvid)
        if not quiet:
            print(f"  [跳过] 封面已存在: {bvid}")
        return {
            'status': 'skipped', 
            'bvid': bvid, 
            'filename': existing_file or f"{bvid}.webp",
            'cover': existing_file or f"{bvid}.webp",
            'path': None
        }
    
    # 3. 下载原图
    # 优先使用 cover_url，如果没有则尝试使用 thumbnail
    cover_url = video.get('cover_url', '') or video.get('thumbnail', '')
    if not cover_url:
        if not quiet:
            print(f"  [失败] 没有 cover_url 或 thumbnail")
        return {'status': 'failed', 'bvid': bvid, 'filename': None, 'cover': None, 'path': None}
    
    try:
        cover_url = ensure_protocol(cover_url)
        ext = sanitize_ext(cover_url)
        
        # 下载到临时文件
        temp_filename = f"{bvid}_temp{ext}"
        temp_path = thumbs_dir / temp_filename
        
        if not quiet:
            print(f"  下载: {cover_url}")
        
        if not download_binary(cover_url, temp_path, quiet):
            return {'status': 'failed', 'bvid': bvid, 'filename': None, 'cover': None, 'path': None}
        
        # 4. 转换为 WebP（如果启用）
        if enable_webp_conversion:
            webp_path = thumbs_dir / f"{bvid}.webp"
            if convert_to_webp(temp_path, webp_path):
                # 删除原图
                temp_path.unlink()
                actual_filename = f"{bvid}.webp"
                actual_path = webp_path
            else:
                # 转换失败，保留原图
                actual_filename = temp_filename
                actual_path = temp_path
        else:
            actual_filename = temp_filename
            actual_path = temp_path
        
        if not quiet:
            print(f"  [成功] {actual_filename}")
        
        return {
            'status': 'success',
            'bvid': bvid,
            'filename': actual_filename,
            'cover': actual_filename,  # 用于更新 videos.json
            'path': actual_path
        }
        
    except Exception as e:
        if not quiet:
            print(f"  [错误] {str(e)}")
        return {'status': 'failed', 'bvid': bvid, 'filename': None, 'cover': None, 'path': None}


def load_videos_json(videos_path: Path) -> List[Dict]:
    """加载 videos.json
    
    Args:
        videos_path: 文件路径
        
    Returns:
        视频数据列表
    """
    with videos_path.open("r", encoding="utf-8") as f:
        data = json.load(f)
    return data if isinstance(data, list) else data.get("videos", [])


def save_videos_json(videos_path: Path, videos: List[Dict]) -> bool:
    """保存 videos.json
    
    Args:
        videos_path: 文件路径
        videos: 视频数据列表
        
    Returns:
        保存成功返回 True
    """
    try:
        with videos_path.open('w', encoding='utf-8') as f:
            json.dump(videos, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"保存 videos.json 失败: {e}")
        return False


def download_all_covers(videos_path: Path, thumbs_dir: Path = None, quiet: bool = False,
                       max_workers: int = 4, update_videos_json: bool = True,
                       enable_webp_conversion: bool = True) -> Dict[str, Any]:
    """下载所有视频封面

    新流程：
    1. 加载 videos.json
    2. 预过滤：只保留需要下载的视频（封面不存在或为空）
    3. 并发下载封面
    4. 更新 videos.json 中的 cover 字段为实际文件名
    5. 保存更新后的 videos.json

    Args:
        videos_path: videos.json 文件路径
        thumbs_dir: 封面保存目录（默认使用配置文件中的前端路径）
        quiet: 静默模式
        max_workers: 并发下载线程数
        update_videos_json: 是否更新 videos.json 中的 cover 字段
        enable_webp_conversion: 是否转换为 WebP 格式

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
    
    # 1. 加载 videos.json
    videos = load_videos_json(videos_path)
    
    if not quiet:
        print(f"找到 {len(videos)} 个视频")
        print(f"封面保存目录: {thumbs_dir}")
        print(f"并发下载线程数: {max_workers}")
    
    thumbs_dir.mkdir(parents=True, exist_ok=True)
    
    # 2. 批量预加载已存在的封面
    existing_covers = get_existing_covers(thumbs_dir)
    if not quiet:
        print(f"已存在 {len(existing_covers)} 个封面")
    
    results = {'success': 0, 'failed': 0, 'skipped': 0, 'downloaded_files': {}}
    
    # 3. 预过滤：只保留需要下载的视频
    videos_need_download = []
    for video in videos:
        bv = video.get('bv', '')
        # 如果没有 bv 字段，尝试从 cover 提取（兼容旧数据）
        if not bv:
            bv = extract_bvid(video.get('cover', ''))
        # 如果还没有，尝试从 videoUrl 提取
        if not bv:
            bv = extract_bvid(video.get('videoUrl', ''))
        
        # 检查是否需要下载
        if bv:
            if bv not in existing_covers:
                videos_need_download.append(video)
            else:
                # 已存在，记录到结果中
                results['skipped'] += 1
                existing_file = get_existing_cover_filename(thumbs_dir, bv)
                if existing_file:
                    results['downloaded_files'][bv] = existing_file
        else:
            # 无法获取 BV 号，跳过
            results['skipped'] += 1
    
    if not quiet:
        print(f"需要下载 {len(videos_need_download)} 个封面")
    
    if not videos_need_download:
        if not quiet:
            print("没有需要下载的封面")
        # 仍然需要更新 videos.json 中已存在封面的文件名
        # 继续执行更新逻辑，跳过下载部分
    
    # 4. 并发下载（只在有需要下载的视频时执行）
    if videos_need_download:
        from concurrent.futures import ThreadPoolExecutor, as_completed
        
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            # 提交下载任务
            future_to_video = {}
            for video in videos_need_download:
                future = executor.submit(
                    download_cover,
                    video,
                    thumbs_dir,
                    quiet,
                    existing_covers,
                    enable_webp_conversion
                )
                future_to_video[future] = video
            
            # 收集结果
            for future in as_completed(future_to_video):
                try:
                    result = future.result()
                    bvid = result['bvid']
                    filename = result.get('cover') or result.get('filename')
                    
                    if result['status'] == 'success':
                        results['success'] += 1
                        if bvid and filename:
                            results['downloaded_files'][bvid] = filename
                            # 将新下载的封面添加到集合中
                            existing_covers.add(bvid)
                    elif result['status'] == 'skipped':
                        results['skipped'] += 1
                        if bvid and filename:
                            results['downloaded_files'][bvid] = filename
                    else:
                        results['failed'] += 1
                except Exception as e:
                    if not quiet:
                        print(f"  [错误] 任务执行失败: {str(e)}")
                    results['failed'] += 1
    
    # 5. 更新 videos.json 中的 cover 字段
    if update_videos_json and results['downloaded_files']:
        updated_count = 0
        for video in videos:
            bv = video.get('bv', '')
            if not bv:
                bv = extract_bvid(video.get('cover', ''))
            if not bv:
                bv = extract_bvid(video.get('videoUrl', ''))
            
            if bv in results['downloaded_files']:
                # 更新 cover 为实际文件名
                old_cover = video.get('cover', '')
                new_cover = results['downloaded_files'][bv]
                video['cover'] = new_cover
                updated_count += 1
                
                if not quiet:
                    print(f"  更新 cover: {old_cover} -> {new_cover}")
        
        # 保存更新后的 videos.json
        if save_videos_json(videos_path, videos):
            if not quiet:
                print(f"已更新 {updated_count} 条视频的 cover 字段")
        else:
            if not quiet:
                print(f"更新 videos.json 失败")
    
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
