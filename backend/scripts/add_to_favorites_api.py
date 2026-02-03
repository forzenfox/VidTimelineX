#!/usr/bin/env python3
"""
批量添加B站视频到收藏夹脚本（API版）

使用B站官方API进行视频收藏，速度比浏览器版快10-50倍。
支持并发处理和智能频率控制，避免请求频率限制。

使用方法:
    python add_to_favorites_api.py --bv-file <bv文件路径> --fav-folder <收藏夹名称>
    python add_to_favorites_api.py --list-fav  # 查看收藏夹列表

示例:
    # 根据收藏夹名称收藏（推荐）
    python add_to_favorites_api.py --bv-file lvjiang-bv.txt --fav-folder "洞凯"

    # 查看所有收藏夹
    python add_to_favorites_api.py --list-fav

    # 根据收藏夹ID收藏
    python add_to_favorites_api.py --bv-file lvjiang-bv.txt --fav-id 3965175154

    # 降低频率限制（适合敏感账号）
    python add_to_favorites_api.py --bv-file ... --fav-folder "洞凯" --min-delay 0.5 --retry-delay 3

参数说明:
    --bv-file: BV号列表文件路径（必填）
    --fav-folder: 收藏夹名称（支持模糊匹配）
    --fav-id: 收藏夹ID（优先于--fav-folder）
    --workers: 最大并发数（默认: 4）
    --max-retries: 最大重试次数（默认: 3）
    --retry-delay: 重试间隔秒数（默认: 2）
    --min-delay: 最小请求间隔秒数（默认: 0.3）
"""

import argparse
import time
import json
import re
import os
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading
from urllib.parse import urlencode
import requests


class BiliBiliFavoritesAPI:
    """B站收藏API封装类"""
    
    BASE_API = "https://api.bilibili.com"
    
    def __init__(self, cookie_file=None, max_workers=4, max_retries=3, retry_delay=1, min_delay=0.5):
        """初始化
        
        Args:
            cookie_file: Cookie文件路径
            max_workers: 最大并发数
            max_retries: 最大重试次数
            retry_delay: 重试间隔（秒）
            min_delay: 最小请求间隔（秒）
        """
        self.cookie_file = Path(cookie_file) if cookie_file else Path.home() / '.bilibili_cookies.json'
        self.max_workers = max_workers
        self.max_retries = max_retries
        self.retry_delay = retry_delay
        self.min_delay = min_delay
        self.session = requests.Session()
        self.lock = threading.Lock()
        self.semaphore = threading.Semaphore(max_workers)
        self.success_count = 0
        self.fail_count = 0
        self.retry_count = 0
        self.skip_count = 0
        self.last_request_time = 0
        self.rate_limit_count = 0
        self.success_bv_codes = []  # 存储成功添加的BV号
        
        # 设置请求头
        self.session.headers.update({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36",
            "Accept": "*/*",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Content-Type": "application/x-www-form-urlencoded",
            "Origin": "https://www.bilibili.com",
            "Referer": "https://www.bilibili.com/"
        })
        
        # 加载Cookie
        self._load_cookies()
    
    def _load_cookies(self):
        """从文件加载Cookie"""
        if not self.cookie_file.exists():
            print(f"警告: Cookie文件不存在: {self.cookie_file}")
            return
        
        try:
            with open(self.cookie_file, 'r', encoding='utf-8') as f:
                cookies = json.load(f)
            
            # 构建Cookie字符串
            cookie_parts = []
            for cookie in cookies:
                name = cookie.get('name', '')
                value = cookie.get('value', '')
                cookie_parts.append(f"{name}={value}")
            
            cookie_str = "; ".join(cookie_parts)
            self.session.headers.update({"Cookie": cookie_str})
            
            # 同时设置Session Cookie
            cookie_dict = {}
            for cookie in cookies:
                name = cookie.get('name', '')
                value = cookie.get('value', '')
                if name in ['SESSDATA', 'DedeUserID', 'bili_jct', 'bili_ticket']:
                    cookie_dict[name] = value
            
            self.session.cookies.update(cookie_dict)
            
            print(f"✅ 已加载Cookie，包含 {len(cookies)} 个cookie")
            
        except Exception as e:
            print(f"加载Cookie失败: {e}")
    
    def _rate_limit_wait(self, is_retry=False):
        """请求频率控制
        
        Args:
            is_retry: 是否是重试请求
        """
        current_time = time.time()
        elapsed = current_time - self.last_request_time
        
        # 计算需要的等待时间
        wait_time = self.min_delay
        
        # 如果是重试且遇到频率限制，增加等待时间
        if is_retry:
            wait_time = max(wait_time, self.retry_delay)
        
        # 如果距离上次请求时间不足，等待
        if elapsed < wait_time:
            time.sleep(wait_time - elapsed)
        
        self.last_request_time = time.time()
    
    def get_credential(self):
        """获取认证信息
        
        Returns:
            tuple: (SESSDATA, DedeUserID, bili_jct)
        """
        cookies = self.session.cookies.get_dict()
        return (
            cookies.get('SESSDATA', ''),
            cookies.get('DedeUserID', ''),
            cookies.get('bili_jct', '')
        )
    
    def get_favorites_list(self):
        """获取收藏夹列表
        
        Returns:
            list: 收藏夹列表
        """
        SESSDATA, DedeUserID, _ = self.get_credential()
        
        if not SESSDATA or not DedeUserID:
            print("错误: 无法获取认证信息，请先登录")
            return []
        
        # 使用正确的API端点
        url = f"{self.BASE_API}/x/v3/fav/folder/created/list-all"
        params = {
            "up_mid": DedeUserID,
            "web_location": "333.1387"
        }
        
        try:
            response = self.session.get(url, params=params, timeout=10)
            
            if response.status_code != 200:
                print(f"API响应错误: {response.status_code}")
                return []
            
            data = response.json()
            
            if data.get("code") == 0:
                return data["data"]["list"]
            else:
                print(f"获取收藏夹列表失败: {data.get('message', '未知错误')}")
                return []
        except json.JSONDecodeError as e:
            print(f"JSON解析失败: {e}")
            return []
        except Exception as e:
            print(f"获取收藏夹列表失败: {e}")
            return []
    
    def get_fav_id_by_name(self, fav_name):
        """根据收藏夹名称获取ID
        
        Args:
            fav_name: 收藏夹名称
            
        Returns:
            str 或 None: 收藏夹ID，未找到返回None
        """
        fav_list = self.get_favorites_list()
        
        for fav in fav_list:
            name = fav.get("title", "")
            if fav_name in name:
                return str(fav.get("id"))
        
        return None
    
    def add_to_favorite(self, bv_code, fav_id):
        """添加视频到收藏夹
        
        Args:
            bv_code: BV号
            fav_id: 收藏夹ID
            
        Returns:
            bool: 成功返回True，失败返回False
        """
        # 获取aid（不需要频率控制，只读）
        aid = self._bv_to_aid_simple(bv_code)
        if not aid:
            with self.lock:
                print(f"[{bv_code}] ❌ 获取视频信息失败")
                self.fail_count += 1
            return False
        
        SESSDATA, DedeUserID, bili_jct = self.get_credential()
        
        if not bili_jct:
            with self.lock:
                print(f"[{bv_code}] ❌ 缺少bili_jct认证")
                self.fail_count += 1
            return False
        
        url = f"{self.BASE_API}/x/v3/fav/resource/deal"
        
        data = {
            "rid": aid,
            "type": 2,  # 2=视频
            "add_media_ids": fav_id,
            "del_media_ids": "",
            "csrf": bili_jct
        }
        
        # 使用信号量控制并发
        with self.semaphore:
            for attempt in range(1, self.max_retries + 1):
                is_retry = attempt > 1
                
                # 频率控制
                self._rate_limit_wait(is_retry=is_retry)
                
                try:
                    response = self.session.post(url, data=data, timeout=10)
                    result = response.json()
                    
                    if result.get("code") == 0:
                        with self.lock:
                            print(f"[{bv_code}] ✅ 收藏成功")
                            self.success_count += 1
                            self.success_bv_codes.append(bv_code)
                        return True
                    elif result.get("code") == -101:  # 未登录
                        with self.lock:
                            print(f"[{bv_code}] ❌ 未登录或登录已过期")
                            self.fail_count += 1
                        return False
                    elif result.get("code") == 12015:  # 已收藏
                        with self.lock:
                            print(f"[{bv_code}] ⏭️ 已收藏过，跳过")
                            self.skip_count += 1
                            self.success_bv_codes.append(bv_code)
                        return True
                    elif result.get("code") == 1101:  # 请求频率过高
                        with self.lock:
                            self.rate_limit_count += 1
                            wait_time = self.retry_delay * attempt  # 递增等待时间
                            print(f"[{bv_code}] ⚠️ 请求频率过高，{wait_time}秒后重试 ({attempt}/{self.max_retries})")
                            self.retry_count += 1
                        time.sleep(wait_time)
                    else:
                        msg = result.get("message", "未知错误")
                        if attempt < self.max_retries:
                            wait_time = self.retry_delay * attempt
                            with self.lock:
                                print(f"[{bv_code}] ❌ {msg}，{wait_time}秒后重试 ({attempt}/{self.max_retries})")
                                self.retry_count += 1
                            time.sleep(wait_time)
                        else:
                            with self.lock:
                                print(f"[{bv_code}] ❌ {msg}，已重试{self.max_retries}次")
                                self.fail_count += 1
                            return False
                            
                except Exception as e:
                    if attempt < self.max_retries:
                        wait_time = self.retry_delay * attempt
                        time.sleep(wait_time)
                    else:
                        with self.lock:
                            print(f"[{bv_code}] ❌ 请求失败: {e}")
                            self.fail_count += 1
                        return False
        
        return False
    
    def _bv_to_aid_simple(self, bv_code):
        """将BV号转换为aid（简单版，无重试）
        
        Args:
            bv_code: BV号
            
        Returns:
            int 或 None: aid，失败返回None
        """
        url = f"{self.BASE_API}/x/web-interface/view"
        params = {"bvid": bv_code}
        
        try:
            response = self.session.get(url, params=params, timeout=10)
            data = response.json()
            
            if data.get("code") == 0:
                return data["data"]["aid"]
        except:
            pass
        
        return None


def read_bv_codes(file_path):
    """读取BV号列表文件
    
    Args:
        file_path: 文件路径
        
    Returns:
        list: BV号列表
    """
    bv_codes = []
    path = Path(file_path)
    
    if not path.exists():
        print(f"错误: 文件不存在 - {file_path}")
        return []
    
    try:
        with open(path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        for line in lines:
            line = line.strip()
            if line and 'BV' in line:
                bv_start = line.find('BV')
                if bv_start != -1:
                    bv_code = line[bv_start:]
                    bv_match = re.search(r'BV[0-9A-Za-z]+', bv_code)
                    if bv_match:
                        bv_codes.append(bv_match.group(0))
        
        bv_codes = list(set(bv_codes))
        print(f"✅ 读取到 {len(bv_codes)} 个唯一的BV号")
        return bv_codes
        
    except Exception as e:
        print(f"读取文件失败: {e}")
        return []


def remove_success_bv_codes(file_path, success_bv_codes):
    """从文件中删除成功的BV号
    
    Args:
        file_path: BV号列表文件路径
        success_bv_codes: 成功添加的BV号列表
        
    Returns:
        int: 删除的BV号数量
    """
    if not success_bv_codes:
        return 0
    
    path = Path(file_path)
    if not path.exists():
        print(f"警告: 文件不存在 - {file_path}")
        return 0
    
    try:
        # 读取所有行
        with open(path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        # 过滤掉包含成功BV号的行
        filtered_lines = []
        removed_count = 0
        
        for line in lines:
            line_stripped = line.strip()
            if not line_stripped:
                filtered_lines.append(line)
                continue
            
            # 检查行中是否包含成功的BV号
            contains_success_bv = False
            for bv_code in success_bv_codes:
                if bv_code in line_stripped:
                    contains_success_bv = True
                    removed_count += 1
                    break
            
            if not contains_success_bv:
                filtered_lines.append(line)
        
        # 写回过滤后的内容
        with open(path, 'w', encoding='utf-8') as f:
            f.writelines(filtered_lines)
        
        if removed_count > 0:
            print(f"✅ 已从文件中删除 {removed_count} 个成功的BV号")
        else:
            print("ℹ️ 没有需要删除的BV号")
        
        return removed_count
        
    except Exception as e:
        print(f"删除成功BV号时出错: {e}")
        return 0


def list_favorites(cookie_file):
    """列出所有收藏夹"""
    print("=" * 60)
    print("B站收藏夹列表")
    print("=" * 60)
    
    api = BiliBiliFavoritesAPI(cookie_file=cookie_file, max_retries=1)
    fav_list = api.get_favorites_list()
    
    if not fav_list:
        print("未获取到收藏夹列表")
        return
    
    print(f"\n找到 {len(fav_list)} 个收藏夹:\n")
    
    for i, fav in enumerate(fav_list, 1):
        fav_id = fav.get("id", "未知")
        name = fav.get("title", "未知")
        count = fav.get("media_count", 0)
        attr = fav.get("attr", 0)
        
        # attr=0 公开，attr=22 私密
        is_public = attr == 0
        status = "🔓 公开" if is_public else "🔒 私密"
        
        print(f"[{i}] {name}")
        print(f"    ID: {fav_id}")
        print(f"    视频数: {count}")
        print(f"    状态: {status}")
        print()
    
    print("=" * 60)
    print("使用方法:")
    print("  # 根据名称收藏（推荐）")
    print("  python add_to_favorites_api.py --bv-file <文件> --fav-folder <名称>")
    print()
    print("  # 根据ID收藏")
    print("  python add_to_favorites_api.py --bv-file <文件> --fav-id <ID>")
    print()


def run(bv_file, fav_folder=None, fav_id=None, cookie_file=None, max_workers=4, max_retries=3, retry_delay=1):
    """运行收藏任务
    
    Args:
        bv_file: BV号文件路径
        fav_folder: 收藏夹名称
        fav_id: 收藏夹ID
        cookie_file: Cookie文件路径
        max_workers: 最大并发数
        max_retries: 最大重试次数
        retry_delay: 重试间隔
    """
    print("=" * 60)
    print("批量添加B站视频到收藏夹（API版）")
    print("=" * 60)
    
    # 读取BV号
    bv_codes = read_bv_codes(bv_file)
    if not bv_codes:
        print("没有可用的BV号，任务终止")
        return False
    
    # 初始化API
    api = BiliBiliFavoritesAPI(
        cookie_file=cookie_file,
        max_workers=max_workers,
        max_retries=max_retries,
        retry_delay=retry_delay,
        min_delay=0.3  # 最小请求间隔0.3秒
    )
    
    # 获取收藏夹信息
    target_fav_id = fav_id
    target_fav_name = "未知"
    
    if target_fav_id is None and fav_folder:
        print(f"\n查找收藏夹 '{fav_folder}'...")
        target_fav_id = api.get_fav_id_by_name(fav_folder)
        if target_fav_id:
            target_fav_name = fav_folder
    
    if not target_fav_id:
        # 显示所有收藏夹供选择
        print(f"\n错误: 未找到收藏夹 '{fav_folder}'")
        print("\n可用收藏夹:")
        fav_list = api.get_favorites_list()
        for fav in fav_list:
            print(f"  - {fav.get('title')} (ID: {fav.get('id')})")
        return False
    
    print(f"\n目标收藏夹: {target_fav_name} (ID: {target_fav_id})")
    print(f"总视频数: {len(bv_codes)}")
    print(f"并发数: {max_workers}")
    print("-" * 60)
    
    start_time = time.time()
    
    # 使用线程池并发处理
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {
            executor.submit(api.add_to_favorite, bv, target_fav_id): bv 
            for bv in bv_codes
        }
        
        for future in as_completed(futures):
            bv = futures[future]
            try:
                future.result()
            except Exception as e:
                with api.lock:
                    print(f"[{bv}] 处理异常: {e}")
                    api.fail_count += 1
    
    end_time = time.time()
    
    # 输出结果
    print("\n" + "=" * 60)
    print("任务完成")
    print("=" * 60)
    print(f"总处理视频数: {len(bv_codes)}")
    print(f"成功收藏: {api.success_count}")
    print(f"已收藏跳过: {api.skip_count}")
    print(f"收藏失败: {api.fail_count}")
    if api.retry_count > 0:
        print(f"重试次数: {api.retry_count}")
    if api.rate_limit_count > 0:
        print(f"触发频率限制: {api.rate_limit_count} 次")
    print(f"总耗时: {end_time - start_time:.2f} 秒")
    print(f"平均速度: {len(bv_codes) / (end_time - start_time):.2f} 个/秒")
    
    # 删除成功的BV号
    if api.success_bv_codes:
        print("\n" + "-" * 60)
        print("删除成功的BV号")
        print("-" * 60)
        removed_count = remove_success_bv_codes(bv_file, api.success_bv_codes)
        print(f"删除结果: 共删除 {removed_count} 个BV号")
    
    return api.success_count > 0


def main():
    """主函数"""
    parser = argparse.ArgumentParser(
        description='批量添加B站视频到收藏夹（API版）',
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    
    parser.add_argument('--bv-file', help='BV号列表文件路径')
    parser.add_argument('--fav-folder', help='收藏夹名称（支持模糊匹配，如"洞凯"）')
    parser.add_argument('--fav-id', type=str, help='收藏夹ID（优先于--fav-folder）')
    parser.add_argument('--cookie-file', default=None, help='Cookie文件路径（默认: ~/.bilibili_cookies.json）')
    parser.add_argument('--list-fav', action='store_true', help='列出所有收藏夹')
    parser.add_argument('--workers', type=int, default=4, help='最大并发数（默认: 4）')
    parser.add_argument('--max-retries', type=int, default=3, help='最大重试次数（默认: 3）')
    parser.add_argument('--retry-delay', type=int, default=2, help='重试间隔秒数（默认: 2）')
    parser.add_argument('--min-delay', type=float, default=0.3, help='最小请求间隔秒数（默认: 0.3）')
    
    args = parser.parse_args()
    
    # 列出收藏夹（独立功能）
    if args.list_fav:
        list_favorites(args.cookie_file)
        return
    
    # 检查必要参数
    if not args.bv_file:
        print("错误: 必须指定 --bv-file 参数")
        print("\n使用方法:")
        print("  # 根据名称收藏（推荐）")
        print("  python add_to_favorites_api.py --bv-file <文件> --fav-folder <名称>")
        print()
        print("  # 根据ID收藏")
        print("  python add_to_favorites_api.py --bv-file <文件> --fav-id <ID>")
        print()
        print("  # 查看收藏夹列表")
        print("  python add_to_favorites_api.py --list-fav")
        return
    
    if not args.fav_folder and not args.fav_id:
        print("错误: 必须指定 --fav-folder 或 --fav-id 参数")
        print("\n使用方法:")
        print("  # 根据名称收藏（推荐）")
        print("  python add_to_favorites_api.py --bv-file <文件> --fav-folder <名称>")
        print()
        print("  # 根据ID收藏")
        print("  python add_to_favorites_api.py --bv-file <文件> --fav-id <ID>")
        print()
        print("  # 查看收藏夹列表")
        print("  python add_to_favorites_api.py --list-fav")
        return
    
    # 运行任务
    success = run(
        bv_file=args.bv_file,
        fav_folder=args.fav_folder,
        fav_id=args.fav_id,
        cookie_file=args.cookie_file,
        max_workers=args.workers,
        max_retries=args.max_retries,
        retry_delay=args.retry_delay
    )
    
    if success:
        print("\n✅ 任务执行成功！")
    else:
        print("\n❌ 任务执行失败！")
    
    return 0 if success else 1


if __name__ == "__main__":
    import sys
    sys.exit(main())
