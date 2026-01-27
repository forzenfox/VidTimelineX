#!/usr/bin/env python3
"""
Playwright测试脚本，用于分析B站视频页面结构
提取视频标题、发布日期、BV号、缩略图、标签和时长信息
"""

from playwright.sync_api import sync_playwright
import re


def analyze_bilibili_video(bv_code):
    """
    分析B站视频页面，提取所需元信息
    
    Args:
        bv_code: 视频BV号
    
    Returns:
        dict: 包含视频元信息的字典
    """
    with sync_playwright() as p:
        # 启动浏览器
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        try:
            # 打开视频页面
            video_url = f"https://www.bilibili.com/video/BV{bv_code}"
            page.goto(video_url, wait_until="networkidle")
            
            # 等待页面加载完成
            page.wait_for_timeout(2000)
            
            # 提取视频标题
            title = page.title()
            # 移除B站后缀
            title = re.sub(r'_哔哩哔哩_bilibili$', '', title)
            print(f"标题: {title}")
            
            # 提取发布日期
            publish_date = ""
            try:
                # 尝试从页面中查找发布日期元素
                date_elements = page.query_selector_all('span, div')
                for element in date_elements:
                    text = element.text_content().strip()
                    if re.search(r'\d{4}-\d{2}-\d{2}|\d{4}年\d{1,2}月\d{1,2}日', text):
                        publish_date = text
                        # 转换中文日期格式为 YYYY-MM-DD
                        if '年' in publish_date and '月' in publish_date:
                            publish_date = publish_date.replace('年', '-').replace('月', '-').replace('日', '')
                        break
                
                # 如果没找到，尝试从script标签中提取
                if not publish_date:
                    page_source = page.content()
                    date_match = re.search(r'"pubdate"\s*:\s*"(\d{4}-\d{2}-\d{2})"', page_source)
                    if date_match:
                        publish_date = date_match.group(1)
                        
            except Exception as e:
                print(f"提取发布日期失败: {e}")
            
            print(f"发布日期: {publish_date}")
            
            # 提取BV号
            print(f"BV号: BV{bv_code}")
            
            # 提取缩略图
            thumbnail = ""
            try:
                # 从meta标签中提取og:image
                og_image = page.query_selector('meta[property="og:image"]')
                if og_image:
                    thumbnail = og_image.get_attribute('content')
                else:
                    # 从twitter标签提取
                    twitter_image = page.query_selector('meta[name="twitter:image"]')
                    if twitter_image:
                        thumbnail = twitter_image.get_attribute('content')
            except Exception as e:
                print(f"提取缩略图失败: {e}")
            
            print(f"缩略图: {thumbnail}")
            
            # 提取视频标签
            tags = []
            try:
                # 查找标签元素
                tag_elements = page.query_selector_all('.tag-link')
                for tag_element in tag_elements:
                    tag_text = tag_element.text_content().strip()
                    if tag_text:
                        tags.append(tag_text)
            except Exception as e:
                print(f"提取标签失败: {e}")
            
            print(f"标签: {tags}")
            
            # 提取视频时长
            duration = ""
            try:
                # 查找时长元素
                duration_element = page.query_selector('.video-info .duration')
                if duration_element:
                    duration = duration_element.text_content().strip()
                else:
                    # 尝试从视频播放器中提取
                    player_duration = page.query_selector('.bpx-player-time-total')
                    if player_duration:
                        duration = player_duration.text_content().strip()
                    else:
                        # 从页面源码中提取
                        page_source = page.content()
                        duration_match = re.search(r'"duration"\s*:\s*(\d+)', page_source)
                        if duration_match:
                            # 转换秒数为 HH:MM:SS 格式
                            seconds = int(duration_match.group(1))
                            hours = seconds // 3600
                            minutes = (seconds % 3600) // 60
                            seconds = seconds % 60
                            if hours > 0:
                                duration = f"{hours:02d}:{minutes:02d}:{seconds:02d}"
                            else:
                                duration = f"{minutes:02d}:{seconds:02d}"
            except Exception as e:
                print(f"提取时长失败: {e}")
            
            print(f"时长: {duration}")
            
            # 关闭浏览器
            browser.close()
            
            # 返回提取的元信息
            return {
                "title": title,
                "publish_date": publish_date,
                "bv": bv_code,
                "thumbnail": thumbnail,
                "tags": tags,
                "duration": duration
            }
            
        except Exception as e:
            print(f"分析视频失败: {e}")
            browser.close()
            return None


if __name__ == "__main__":
    # 测试示例：使用前端videos.json中第一个视频的BV号
    bv_code = "1xx411c7mD"
    print(f"开始分析视频: BV{bv_code}")
    result = analyze_bilibili_video(bv_code)
    
    if result:
        print("\n提取结果:")
        for key, value in result.items():
            print(f"{key}: {value}")
    else:
        print("\n分析失败")
