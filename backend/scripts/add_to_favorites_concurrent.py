#!/usr/bin/env python3
"""
批量添加B站视频到收藏夹脚本（无头模式+并发版）

从指定的BV号列表文件中读取视频ID，并批量添加这些视频到B站用户的指定收藏夹中。
脚本使用无头模式运行，支持并发处理多个视频。

使用方法:
    python add_to_favorites_concurrent.py --bv-file <bv文件路径> --fav-folder <收藏夹名称> [--workers <并发数>] [--headless] [--max-retries <重试次数>] [--retry-delay <重试间隔>]

示例:
    # 无头模式，4个并发，默认重试3次
    python add_to_favorites_concurrent.py --bv-file lvjiang-bv.txt --fav-folder "洞凯"

    # 有界面模式，2个并发，重试5次，间隔3秒
    python add_to_favorites_concurrent.py --bv-file lvjiang-bv.txt --fav-folder "洞凯" --no-headless --workers 2 --max-retries 5 --retry-delay 3

    # 强制重新登录
    python add_to_favorites_concurrent.py --bv-file lvjiang-bv.txt --fav-folder "洞凯" --force-login

参数说明:
    --bv-file: BV号列表文件路径（必填）
    --fav-folder: 目标收藏夹名称（必填）
    --cookie-file: Cookie保存文件路径（默认: ~/.bilibili_cookies.json）
    --force-login: 强制重新登录
    --headless: 使用无头模式（默认启用）
    --workers: 最大并发数（默认: 4）
    --max-retries: 最大重试次数（默认: 3）
    --retry-delay: 重试间隔秒数（默认: 2）
"""

import argparse
import time
import json
import os
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading
from playwright.sync_api import sync_playwright
import playwright


class BiliBiliFavoritesAdderConcurrent:
    """并发添加B站视频到收藏夹"""
    
    def __init__(self, bv_file, fav_folder, cookie_file=None, force_login=False, headless=True, max_workers=4, max_retries=3, retry_delay=2):
        """初始化添加器
        
        Args:
            bv_file: BV号列表文件路径
            fav_folder: 目标收藏夹名称
            cookie_file: Cookie保存文件路径，默认为 None
            force_login: 是否强制重新登录，默认为 False
            headless: 是否使用无头模式，默认为 True
            max_workers: 最大并发数，默认为 4
            max_retries: 最大重试次数，默认为 3
            retry_delay: 重试间隔（秒），默认为 2
        """
        self.bv_file = Path(bv_file)
        self.fav_folder = fav_folder
        self.cookie_file = Path(cookie_file) if cookie_file else Path.home() / '.bilibili_cookies.json'
        self.force_login = force_login
        self.headless = headless
        self.max_workers = max_workers
        self.max_retries = max_retries
        self.retry_delay = retry_delay
        self.bv_codes = []
        self.lock = threading.Lock()
        self.success_count = 0
        self.fail_count = 0
        self.retry_count = 0
        self.success_bv_codes = []  # 存储成功添加的BV号
    
    def read_bv_codes(self):
        """读取BV号列表文件
        
        Returns:
            bool: 读取成功返回True，否则返回False
        """
        print(f"读取BV号列表文件: {self.bv_file}")
        try:
            if not self.bv_file.exists():
                print(f"错误: 文件不存在 - {self.bv_file}")
                return False
            
            with open(self.bv_file, 'r', encoding='utf-8') as f:
                lines = f.readlines()
            
            # 提取BV号
            for line in lines:
                line = line.strip()
                if line and 'BV' in line:
                    # 提取完整的BV号
                    bv_start = line.find('BV')
                    if bv_start != -1:
                        # 提取BV号部分（BV开头，后面跟数字和字母）
                        bv_code = line[bv_start:]
                        # 确保只提取BV号部分，去除可能的其他字符
                        import re
                        bv_match = re.search(r'BV[0-9A-Za-z]+', bv_code)
                        if bv_match:
                            self.bv_codes.append(bv_match.group(0))
            
            # 去重
            self.bv_codes = list(set(self.bv_codes))
            print(f"成功读取 {len(self.bv_codes)} 个唯一的BV号")
            return len(self.bv_codes) > 0
        except Exception as e:
            print(f"读取文件失败: {e}")
            return False
    
    def check_login_status(self, page):
        """检查当前页面登录状态
        
        Args:
            page: Playwright page对象
            
        Returns:
            bool: 已登录返回True，否则返回False
        """
        try:
            # 先检查登录按钮（未登录时显示）
            try:
                login_btn = page.locator('.go-login-btn').first
                if login_btn.is_visible():
                    return False
            except:
                pass
            
            return True
        except Exception as e:
            print(f"检查登录状态时出错: {e}")
            return False
    
    def add_single_video(self, bv_code):
        """添加单个视频到收藏夹（线程安全，支持重试）
        
        Args:
            bv_code: BV号
            
        Returns:
            bool: 添加成功返回True，否则返回False
        """
        last_error = None
        
        for attempt in range(1, self.max_retries + 1):
            try:
                playwright = sync_playwright().start()
                browser = playwright.chromium.launch(headless=self.headless)
                context = browser.new_context()
                page = context.new_page()
                
                # 尝试加载Cookie
                if self.cookie_file.exists():
                    try:
                        import json
                        with open(self.cookie_file, 'r', encoding='utf-8') as f:
                            cookies = json.load(f)
                        context.add_cookies(cookies)
                    except:
                        pass
                
                try:
                    video_url = f"https://www.bilibili.com/video/{bv_code}"
                    page.goto(video_url, timeout=30000, wait_until='domcontentloaded')
                    page.wait_for_timeout(2000)
                    
                    # 检查登录状态
                    if not self.check_login_status(page):
                        with self.lock:
                            print(f"[{bv_code}] 未登录，跳过")
                            self.fail_count += 1
                        return False
                    
                    # 查找收藏按钮
                    collect_button = page.locator('.video-fav.video-toolbar-left-item').first
                    if not collect_button:
                        with self.lock:
                            if attempt < self.max_retries:
                                print(f"[{bv_code}] 未找到收藏按钮，{self.retry_delay}秒后重试 ({attempt}/{self.max_retries})")
                                last_error = "未找到收藏按钮"
                            else:
                                print(f"[{bv_code}] 未找到收藏按钮，已达最大重试次数")
                                self.fail_count += 1
                        if attempt < self.max_retries:
                            time.sleep(self.retry_delay)
                            continue
                        return False
                    
                    try:
                        collect_button.wait_for(state='visible', timeout=10000)
                    except:
                        with self.lock:
                            if attempt < self.max_retries:
                                print(f"[{bv_code}] 收藏按钮不可见，{self.retry_delay}秒后重试 ({attempt}/{self.max_retries})")
                                last_error = "收藏按钮不可见"
                            else:
                                print(f"[{bv_code}] 收藏按钮不可见，已达最大重试次数")
                                self.fail_count += 1
                        if attempt < self.max_retries:
                            time.sleep(self.retry_delay)
                            continue
                        return False
                    
                    # 检查收藏状态
                    button_class = collect_button.get_attribute('class') or ''
                    if 'on' in button_class:
                        with self.lock:
                            print(f"[{bv_code}] ✅ 已收藏，跳过")
                            self.success_count += 1
                            self.success_bv_codes.append(bv_code)
                        return True
                    
                    # 点击收藏按钮
                    collect_button.click()
                    page.wait_for_timeout(2000)
                    
                    # 查找弹窗
                    dialog_found = False
                    dialog_selectors = ['.collection-m-exp', '.bili-dialog-bomb', '.fav-dialog']
                    for selector in dialog_selectors:
                        try:
                            if page.locator(selector).is_visible():
                                dialog_found = True
                                break
                        except:
                            continue
                    
                    if not dialog_found:
                        with self.lock:
                            if attempt < self.max_retries:
                                print(f"[{bv_code}] 未找到收藏夹弹窗，{self.retry_delay}秒后重试 ({attempt}/{self.max_retries})")
                                last_error = "未找到收藏夹弹窗"
                            else:
                                print(f"[{bv_code}] 未找到收藏夹弹窗，已达最大重试次数")
                                self.fail_count += 1
                        if attempt < self.max_retries:
                            time.sleep(self.retry_delay)
                            continue
                        return False
                    
                    # 使用JavaScript点击复选框
                    js_click = f"""
                    (function() {{
                        const items = document.querySelectorAll('.group-list ul li');
                        for (const item of items) {{
                            const title = item.querySelector('.fav-title');
                            if (title && title.textContent.includes('{self.fav_folder}')) {{
                                const checkbox = item.querySelector('input[type="checkbox"]');
                                if (checkbox) {{
                                    checkbox.click();
                                    return true;
                                }}
                            }}
                        }}
                        return false;
                    }})();
                    """
                    
                    result = page.evaluate(js_click)
                    page.wait_for_timeout(1000)
                    
                    # 点击确认按钮
                    confirm_selectors = [
                        '.collection-m-exp .bottom .btn.submit-move',
                        '.fav-dialog .btn-primary',
                        'button:has-text("确定")'
                    ]
                    
                    confirm_button = None
                    for selector in confirm_selectors:
                        try:
                            button = page.locator(selector).first
                            if button.is_visible():
                                confirm_button = button
                                break
                        except:
                            continue
                    
                    if confirm_button:
                        # 等待按钮启用
                        try:
                            for _ in range(20):  # 最多等待10秒
                                if not confirm_button.is_disabled():
                                    break
                                page.wait_for_timeout(500)
                        except:
                            pass
                        
                        confirm_button.click()
                        page.wait_for_timeout(2000)
                    
                    with self.lock:
                        print(f"[{bv_code}] ✅ 收藏成功")
                        self.success_count += 1
                        self.success_bv_codes.append(bv_code)
                    return True
                    
                finally:
                    browser.close()
                    playwright.stop()
                    
            except Exception as e:
                last_error = str(e)
                with self.lock:
                    if attempt < self.max_retries:
                        print(f"[{bv_code}] 添加失败: {e}，{self.retry_delay}秒后重试 ({attempt}/{self.max_retries})")
                    else:
                        print(f"[{bv_code}] 添加失败: {e}，已达最大重试次数")
                        self.fail_count += 1
                if attempt < self.max_retries:
                    time.sleep(self.retry_delay)
                    continue
        
        # 所有重试都失败
        with self.lock:
            self.retry_count += 1
            print(f"[{bv_code}] ❌ 收藏失败，已重试 {self.max_retries} 次")
        return False
    
    def run(self):
        """运行添加任务
        
        Returns:
            bool: 任务成功返回True，否则返回False
        """
        print("=" * 60)
        print("批量添加B站视频到收藏夹任务开始（无头模式+并发）")
        print("=" * 60)
        
        # 读取BV号列表
        if not self.read_bv_codes():
            print("没有可用的BV号，任务终止")
            return False
        
        print(f"\n开始批量添加 {len(self.bv_codes)} 个视频到收藏夹 '{self.fav_folder}'")
        print(f"使用 {self.max_workers} 个并发线程")
        print("-" * 60)
        
        start_time = time.time()
        
        # 使用线程池并发处理
        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            futures = {executor.submit(self.add_single_video, bv): bv for bv in self.bv_codes}
            
            completed = 0
            for future in as_completed(futures):
                completed += 1
                bv = futures[future]
                try:
                    future.result()
                except Exception as e:
                    with self.lock:
                        print(f"[{bv}] 处理异常: {e}")
                        self.fail_count += 1
        
        end_time = time.time()
        
        # 输出结果
        print("\n" + "=" * 60)
        print("任务完成")
        print("=" * 60)
        print(f"总处理视频数: {len(self.bv_codes)}")
        print(f"成功添加: {self.success_count}")
        print(f"添加失败: {self.fail_count}")
        if self.retry_count > 0:
            print(f"重试次数: {self.retry_count}")
        print(f"总耗时: {end_time - start_time:.2f} 秒")
        print(f"平均速度: {len(self.bv_codes) / (end_time - start_time):.2f} 个/秒")
        
        # 删除成功的BV号
        if self.success_bv_codes:
            print("\n" + "-" * 60)
            print("删除成功的BV号")
            print("-" * 60)
            removed_count = remove_success_bv_codes(self.bv_file, self.success_bv_codes)
            print(f"删除结果: 共删除 {removed_count} 个BV号")
        
        return self.success_count > 0


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


def main():
    """主函数"""
    # 解析命令行参数
    parser = argparse.ArgumentParser(
        description='批量添加B站视频到收藏夹脚本（无头模式+并发版）',
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument('--bv-file', required=True, help='BV号列表文件路径')
    parser.add_argument('--fav-folder', required=True, help='目标收藏夹名称')
    parser.add_argument('--cookie-file', default=None, help='Cookie保存文件路径（默认: ~/.bilibili_cookies.json）')
    parser.add_argument('--force-login', action='store_true', help='强制重新登录，忽略已保存的Cookie')
    parser.add_argument('--headless', action='store_true', default=True, help='使用无头模式（默认: True）')
    parser.add_argument('--no-headless', dest='headless', action='store_false', help='不使用无头模式')
    parser.add_argument('--workers', type=int, default=4, help='最大并发数（默认: 4）')
    parser.add_argument('--max-retries', type=int, default=3, help='最大重试次数（默认: 3）')
    parser.add_argument('--retry-delay', type=int, default=2, help='重试间隔秒数（默认: 2）')
    
    args = parser.parse_args()
    
    # 创建添加器实例
    adder = BiliBiliFavoritesAdderConcurrent(
        args.bv_file,
        args.fav_folder,
        args.cookie_file,
        args.force_login,
        args.headless,
        args.workers,
        args.max_retries,
        args.retry_delay
    )
    
    # 运行任务
    success = adder.run()
    
    if success:
        print("\n✅ 任务执行成功！")
    else:
        print("\n❌ 任务执行失败！")
    
    return 0 if success else 1


if __name__ == "__main__":
    import sys
    sys.exit(main())
