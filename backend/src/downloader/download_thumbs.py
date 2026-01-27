#!/usr/bin/env python3
"""
download_thumbs.py

Python 3 script to fetch video thumbnails (og:image) from Bilibili pages and save them as static files,
then write out a new timeline JSON where each event.media.thumbnail points to the saved file.

Usage:
  python download_thumbs.py data/timeline.json media/thumbs

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

try:
    import requests
except Exception:
    print("Missing dependency: requests. Install it with:\n  pip install -r requirements.txt")
    sys.exit(1)


DELAY_SECONDS = 0.8  # wait between requests


def get_og_image(html: str) -> str | None:
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
    ext = Path(urlparse(pathname).path).suffix
    if ext:
        return ext
    return ".jpg"


def ensure_protocol(url: str) -> str:
    """
    确保 URL 有正确的协议头，并处理 Unicode 转义序列
    
    Args:
        url: 输入的 URL 字符串
        
    Returns:
        处理后的 URL 字符串
    """
    # 处理 Unicode 转义序列
    url = url.encode('utf-8').decode('unicode_escape')
    
    # 确保协议头
    if url.startswith("//"):
        return "https:" + url
    elif not url.startswith("http://") and not url.startswith("https://"):
        return "https:" + url
    return url


def choose_filename(url: str, idx: int, ext: str) -> str:
    m = re.search(r'(BV[0-9A-Za-z]+)', url)
    if m:
        base = m.group(1)
    else:
        m2 = re.search(r'av(\d+)', url, re.I)
        if m2:
            base = "av" + m2.group(1)
        else:
            base = f"event{idx}"
    return f"{base}-{idx}{ext}"


def download_binary(url: str, outpath: Path):
    headers = {"User-Agent": "Mozilla/5.0 (thumb-fetcher)"}
    with requests.get(url, headers=headers, stream=True, timeout=20) as r:
        r.raise_for_status()
        outpath.parent.mkdir(parents=True, exist_ok=True)
        with outpath.open("wb") as f:
            for chunk in r.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)


def main():
    if len(sys.argv) < 3:
        print("Usage: python download_thumbs.py <videos.json> <thumbs_output_dir>")
        sys.exit(2)

    videos_path = Path(sys.argv[1])
    thumbs_dir = Path(sys.argv[2])

    if not videos_path.exists():
        print(f"videos.json not found: {videos_path}")
        sys.exit(2)

    with videos_path.open("r", encoding="utf-8") as f:
        data = json.load(f)

    videos = data if isinstance(data, list) else data.get("videos", [])
    print(f"Found {len(videos)} videos in {videos_path}")

    for idx, video in enumerate(videos):
        url = f"https://www.bilibili.com/video/{video.get('bvid', '')}"
        if not url or "BV" not in url:
            print(f"[{idx}] no valid bvid, skip")
            continue
        if "bilibili.com" not in url:
            print(f"[{idx}] url not bilibili ({url}), skip")
            continue

        try:
            print(f"[{idx}] Requesting page: {url}")
            headers = {"User-Agent": "Mozilla/5.0 (thumb-fetcher)"}
            resp = requests.get(url, headers=headers, timeout=15)
            if resp.status_code != 200:
                print(f"  -> failed to fetch page: {resp.status_code}")
                continue
            html = resp.text

            img_url = get_og_image(html)
            if not img_url:
                print("  -> og image not found, skip")
                continue

            img_url = ensure_protocol(img_url)
            ext = sanitize_ext(img_url)
            filename = choose_filename(url, idx, ext)
            outpath = thumbs_dir / filename

            print(f"  -> downloading thumbnail {img_url}  -> {outpath}")
            download_binary(img_url, outpath)

            """
            计算相对于前端public目录的相对路径
            """
            # 确保所有路径都是绝对路径，并且不包含相对路径部分
            frontend_public = Path(__file__).parent.parent / "frontend" / "public"
            frontend_public_abs = frontend_public.resolve()
            
            # 解析outpath，确保它是直接的绝对路径，不包含'..'
            outpath_abs = outpath.resolve()
            
            try:
                # 计算相对路径
                rel = outpath_abs.relative_to(frontend_public_abs)
                rel_posix = rel.as_posix()
                # 直接使用相对路径，不添加额外的thumbs前缀
                cover_path = f"/{rel_posix}"
            except ValueError:
                # 如果路径不在预期的子目录中，直接使用文件名
                cover_filename = outpath.name
                cover_path = f"/thumbs/{cover_filename}"

            video["cover"] = cover_path
            print(f"  -> saved and updated video.cover = {cover_path}")

            time.sleep(DELAY_SECONDS)
        except Exception as e:
            print(f"  -> error processing {url}: {e}")
            time.sleep(DELAY_SECONDS)

    # 直接写回原始文件
    with videos_path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Done. Updated JSON in {videos_path}")


if __name__ == "__main__":
    main()