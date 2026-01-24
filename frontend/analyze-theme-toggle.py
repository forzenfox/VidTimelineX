#!/usr/bin/env python3
from playwright.sync_api import sync_playwright

# 主题切换按钮分析脚本

def analyze_theme_toggle():
    with sync_playwright() as p:
        # 启动浏览器
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        
        # 访问本地开发服务器
        page.goto("http://localhost:3001/")
        
        # 等待页面加载完成
        page.wait_for_load_state("networkidle")
        
        # 查找主题切换按钮
        theme_toggle = page.locator("button[role='switch']")
        
        # 获取按钮的尺寸和位置
        button_bounding_box = theme_toggle.bounding_box()
        print(f"按钮尺寸和位置: {button_bounding_box}")
        
        # 获取按钮的CSS样式
        button_computed_style = theme_toggle.evaluate("element => window.getComputedStyle(element)")
        print(f"按钮样式: {button_computed_style['width']} x {button_computed_style['height']}")
        print(f"按钮边框圆角: {button_computed_style['borderRadius']}")
        
        # 获取甜筒主题下的爱心图标
        heart_icon = page.locator("button[role='switch'] .lucide-heart")
        heart_bounding_box = heart_icon.bounding_box()
        print(f"爱心图标尺寸和位置: {heart_bounding_box}")
        
        # 获取文字标签
        sweet_text = page.locator("button[role='switch'] span:text('SWEET')")
        sweet_text_bounding_box = sweet_text.bounding_box()
        print(f"SWEET文字尺寸和位置: {sweet_text_bounding_box}")
        
        # 切换到老虎主题
        theme_toggle.click()
        
        # 等待主题切换完成
        page.wait_for_timeout(1000)
        
        # 获取老虎主题下的皇冠图标
        crown_icon = page.locator("button[role='switch'] .lucide-crown")
        crown_bounding_box = crown_icon.bounding_box()
        print(f"皇冠图标尺寸和位置: {crown_bounding_box}")
        
        # 获取TIGER文字
        tiger_text = page.locator("button[role='switch'] span:text('TIGER')")
        tiger_text_bounding_box = tiger_text.bounding_box()
        print(f"TIGER文字尺寸和位置: {tiger_text_bounding_box}")
        
        # 计算间距
        if heart_bounding_box and sweet_text_bounding_box:
            heart_to_text_distance = sweet_text_bounding_box['x'] - (heart_bounding_box['x'] + heart_bounding_box['width'])
            print(f"爱心图标到SWEET文字的距离: {heart_to_text_distance}px")
        
        if crown_bounding_box and tiger_text_bounding_box:
            crown_to_text_distance = crown_bounding_box['x'] - (tiger_text_bounding_box['x'] + tiger_text_bounding_box['width'])
            print(f"皇冠图标到TIGER文字的距离: {crown_to_text_distance}px")
        
        # 分析最合适的调整方案
        print("\n--- 调整方案分析 ---")
        print("问题: 爱心图标遮挡SWEET文字")
        print("建议调整:")
        print("1. 减小滑块宽度或调整滑块位置")
        print("2. 调整爱心图标的位置，向左移动")
        print("3. 调整SWEET文字的位置，向右移动")
        print("4. 减小文字大小或图标大小")
        
        # 关闭浏览器
        browser.close()

if __name__ == "__main__":
    analyze_theme_toggle()
