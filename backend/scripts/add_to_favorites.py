#!/usr/bin/env python3
"""
批量添加B站视频到收藏夹脚本

从指定的BV号列表文件中读取视频ID，并批量添加这些视频到B站用户的指定收藏夹中。
脚本会提示用户手动登录B站，然后自动执行后续的添加操作。

使用方法:
    python add_to_favorites.py --bv-file <bv文件路径> --fav-folder <收藏夹名称>

示例:
    python add_to_favorites.py --bv-file data/sources/lvjiang-bv.txt --fav-folder "我的收藏夹"
"""

import argparse
import time
from pathlib import Path
from playwright.sync_api import sync_playwright

class BiliBiliFavoritesAdder:
    def __init__(self, bv_file, fav_folder):
        """初始化添加器
        
        Args:
            bv_file: BV号列表文件路径
            fav_folder: 目标收藏夹名称
        """
        self.bv_file = Path(bv_file)
        self.fav_folder = fav_folder
        self.bv_codes = []
        self.browser = None
        self.page = None
    
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
    
    def start_browser(self):
        """启动浏览器并导航到B站首页
        
        Returns:
            bool: 启动成功返回True，否则返回False
        """
        print("启动浏览器...")
        try:
            playwright = sync_playwright().start()
            # 启动有界面的浏览器，便于用户登录
            self.browser = playwright.chromium.launch(headless=False)
            self.page = self.browser.new_page()
            
            # 导航到B站首页
            print("导航到B站首页...")
            self.page.goto("https://www.bilibili.com", timeout=60000)
            self.page.wait_for_load_state('networkidle', timeout=60000)
            
            return True
        except Exception as e:
            print(f"启动浏览器失败: {e}")
            return False
    
    def wait_for_login(self):
        """等待用户登录
        
        Returns:
            bool: 登录成功返回True，否则返回False
        """
        print("\n=== 登录提示 ===")
        print("请在浏览器中登录您的B站账号:")
        print("1. 点击登录按钮")
        print("2. 使用扫码或账号密码登录")
        print("3. 登录完成后，按回车键继续...")
        
        # 等待用户输入
        input()
        
        # 验证登录状态
        try:
            # 检查是否有用户头像元素
            self.page.wait_for_load_state('networkidle', timeout=30000)
            # 尝试点击用户头像，验证是否已登录
            try:
                # 等待用户头像加载
                self.page.wait_for_selector('.header-login-entry', timeout=10000)
                print("错误: 似乎还未登录成功，请重新尝试登录")
                return False
            except:
                # 没有找到登录入口，说明已登录
                print("登录成功！")
                return True
        except Exception as e:
            print(f"验证登录状态失败: {e}")
            return False
    
    def add_video_to_favorites(self, bv_code):
        """添加单个视频到收藏夹
        
        Args:
            bv_code: BV号
            
        Returns:
            bool: 添加成功返回True，否则返回False
        """
        print(f"\n处理视频: {bv_code}")
        try:
            # 构建视频URL
            video_url = f"https://www.bilibili.com/video/{bv_code}"
            print(f"打开视频页面: {video_url}")
            
            # 打开视频页面
            self.page.goto(video_url, timeout=60000)
            self.page.wait_for_load_state('networkidle', timeout=60000)
            
            # 等待视频页面加载完成
            time.sleep(2)
            
            # 查找收藏按钮
            print("查找收藏按钮...")
            # 尝试不同的收藏按钮选择器
            collect_buttons = [
                '.video-fav.video-toolbar-left-item',
                '.video-fav',
                'div[title*="收藏"]',
                'button:has-text("收藏")'
            ]
            
            collect_button = None
            for selector in collect_buttons:
                try:
                    collect_button = self.page.locator(selector).first
                    if collect_button.is_visible():
                        print(f"找到收藏按钮: {selector}")
                        break
                except:
                    continue
            
            if not collect_button:
                print("错误: 未找到收藏按钮")
                return False
            
            # 检查收藏按钮状态
            print("检查收藏按钮状态...")
            
            # 检查是否已收藏
            is_collected = False
            
            try:
                # 检查是否有"on"类（表示已收藏）
                button_class = collect_button.get_attribute('class', default='')
                if 'on' in button_class:
                    print("检测到收藏按钮有'on'类，视频已收藏")
                    is_collected = True
                
                # 检查按钮颜色（蓝色表示已收藏）
                if not is_collected:
                    try:
                        # 尝试获取图标颜色
                        icon = collect_button.locator('svg, i').first
                        if icon:
                            color = icon.evaluate("el => getComputedStyle(el).color")
                            # 检查是否为蓝色系
                            if 'blue' in color.lower() or '#1e80ff' in color.lower() or '#00a1d6' in color.lower():
                                print(f"检测到收藏按钮为蓝色: {color}，视频已收藏")
                                is_collected = True
                    except:
                        pass
                
                # 检查按钮文本（如果有"已收藏"等字样）
                if not is_collected:
                    try:
                        button_text = collect_button.text_content()
                        if '已收藏' in button_text or '收藏ed' in button_text:
                            print(f"检测到收藏按钮文本: {button_text}，视频已收藏")
                            is_collected = True
                    except:
                        pass
            except Exception as e:
                print(f"检查收藏状态时出错: {e}")
            
            # 如果已收藏，直接跳过
            if is_collected:
                print("视频已收藏，跳过此视频")
                return True
            
            # 点击收藏按钮
            print("点击收藏按钮...")
            collect_button.click()
            time.sleep(3)  # 增加等待时间
            
            # 查找收藏夹选择界面
            print("查找收藏夹选择界面...")
            
            # 尝试多种弹窗选择器
            dialog_selectors = [
                '.bili-dialog-bomb',
                '.collection-m-exp',
                '.fav-dialog',
                'div[class*="dialog"]'
            ]
            
            dialog_found = False
            for selector in dialog_selectors:
                try:
                    print(f"尝试查找弹窗: {selector}")
                    if self.page.locator(selector).is_visible():
                        print(f"找到弹窗: {selector}")
                        dialog_found = True
                        break
                except:
                    continue
            
            # 如果没有找到弹窗，等待一段时间后再次尝试
            if not dialog_found:
                print("首次查找未找到弹窗，等待后再次尝试...")
                time.sleep(3)
                for selector in dialog_selectors:
                    try:
                        if self.page.locator(selector).is_visible():
                            print(f"找到弹窗: {selector}")
                            dialog_found = True
                            break
                    except:
                        continue
            
            # 如果仍然没有找到弹窗，可能已收藏或操作失败
            if not dialog_found:
                print("错误: 收藏夹弹窗未出现，可能已收藏或操作失败")
                # 检查是否已收藏的其他迹象
                try:
                    # 检查收藏按钮是否有"已收藏"状态
                    if collect_button.locator('.on').is_visible() or 'on' in collect_button.get_attribute('class', default=''):
                        print("检测到已收藏状态，跳过此视频")
                        return True
                except:
                    pass
                return True  # 假设已收藏
            
            # 查找目标收藏夹
            print(f"查找目标收藏夹: {self.fav_folder}")
            # 尝试查找收藏夹列表
            try:
                # 尝试多种收藏夹列表选择器
                list_selectors = [
                    '.group-list ul li',
                    '.fav-item',
                    'ul[class*="fav"] li',
                    'li[class*="fav"]'
                ]
                
                fav_items = []
                for selector in list_selectors:
                    try:
                        print(f"尝试查找收藏夹列表: {selector}")
                        items = self.page.locator(selector).all()
                        if len(items) > 0:
                            print(f"找到 {len(items)} 个收藏夹选项")
                            fav_items = items
                            break
                    except:
                        continue
                
                if not fav_items:
                    print("错误: 未找到收藏夹列表")
                    return False
                
                # 查找目标收藏夹
                target_fav = None
                target_name = None
                
                for item in fav_items:
                    try:
                        # 尝试多种收藏夹名称选择器
                        name_selectors = [
                            '.fav-title',
                            '.fav-name',
                            'span[title]',
                            'span'
                        ]
                        
                        fav_name = None
                        for name_selector in name_selectors:
                            try:
                                fav_name = item.locator(name_selector).text_content()
                                if fav_name:
                                    break
                            except:
                                continue
                        
                        if fav_name and self.fav_folder in fav_name:
                            target_fav = item
                            target_name = fav_name
                            print(f"找到目标收藏夹: {fav_name}")
                            break
                    except:
                        continue
                
                if not target_fav:
                    print(f"错误: 未找到目标收藏夹 '{self.fav_folder}'")
                    # 尝试关闭弹窗
                    try:
                        close_selectors = [
                            '.collection-m-exp .title .close',
                            '.fav-dialog .close',
                            '.bili-dialog-bomb .close',
                            'i[class*="close"]',
                            'button[class*="close"]'
                        ]
                        
                        for close_selector in close_selectors:
                            try:
                                close_button = self.page.locator(close_selector).first
                                if close_button.is_visible():
                                    print(f"点击关闭按钮: {close_selector}")
                                    close_button.click()
                                    break
                            except:
                                continue
                    except:
                        pass
                    return False
                
                # 点击目标收藏夹
                print("选择目标收藏夹...")
                target_fav.click()
                time.sleep(2)  # 增加等待时间
                
                # 尝试多种确认按钮选择器
                confirm_selectors = [
                    '.collection-m-exp .bottom .btn.submit-move',
                    '.fav-dialog .btn-primary',
                    'button[class*="submit"]',
                    'button[class*="confirm"]',
                    'button:has-text("确定")',
                    'button:has-text("确认")'
                ]
                
                confirm_button = None
                for selector in confirm_selectors:
                    try:
                        print(f"尝试查找确认按钮: {selector}")
                        button = self.page.locator(selector).first
                        if button.is_visible():
                            print(f"找到确认按钮: {selector}")
                            confirm_button = button
                            break
                    except:
                        continue
                
                if not confirm_button:
                    print("错误: 未找到确认按钮")
                    return False
                
                # 点击确认按钮
                print("点击确认按钮...")
                confirm_button.click()
                time.sleep(3)  # 增加等待时间
                print(f"成功添加视频 {bv_code} 到收藏夹 '{target_name}'")
                return True
                    
            except Exception as e:
                print(f"处理收藏夹选择失败: {e}")
                return False
                
        except Exception as e:
            print(f"添加视频失败: {e}")
            return False
    
    def run(self):
        """运行添加任务
        
        Returns:
            bool: 任务成功返回True，否则返回False
        """
        print("=== 批量添加B站视频到收藏夹任务开始 ===")
        
        # 读取BV号列表
        if not self.read_bv_codes():
            print("没有可用的BV号，任务终止")
            return False
        
        # 启动浏览器
        if not self.start_browser():
            print("浏览器启动失败，任务终止")
            return False
        
        # 等待用户登录
        if not self.wait_for_login():
            print("登录失败，任务终止")
            if self.browser:
                self.browser.close()
            return False
        
        # 批量添加视频
        success_count = 0
        fail_count = 0
        
        print(f"\n开始批量添加 {len(self.bv_codes)} 个视频到收藏夹 '{self.fav_folder}'")
        
        for i, bv_code in enumerate(self.bv_codes, 1):
            print(f"\n[{i}/{len(self.bv_codes)}]")
            if self.add_video_to_favorites(bv_code):
                success_count += 1
            else:
                fail_count += 1
            
            # 为了避免请求过快，添加延迟
            time.sleep(3)
        
        # 关闭浏览器
        if self.browser:
            self.browser.close()
        
        # 输出结果
        print("\n=== 任务完成 ===")
        print(f"总处理视频数: {len(self.bv_codes)}")
        print(f"成功添加: {success_count}")
        print(f"添加失败: {fail_count}")
        
        return success_count > 0

def main():
    """主函数"""
    # 解析命令行参数
    parser = argparse.ArgumentParser(description='批量添加B站视频到收藏夹脚本')
    parser.add_argument('--bv-file', required=True, help='BV号列表文件路径')
    parser.add_argument('--fav-folder', required=True, help='目标收藏夹名称')
    args = parser.parse_args()
    
    # 创建添加器实例
    adder = BiliBiliFavoritesAdder(args.bv_file, args.fav_folder)
    
    # 运行任务
    success = adder.run()
    
    if success:
        print("\n任务执行成功！")
    else:
        print("\n任务执行失败！")
    
    return 0 if success else 1

if __name__ == "__main__":
    import sys
    sys.exit(main())
