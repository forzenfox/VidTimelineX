#!/usr/bin/env python3
"""
审核界面测试脚本
用于测试基于Flask的视频审核界面
"""

from flask import Flask, render_template, request, redirect, url_for
import json
import os
from pathlib import Path

app = Flask(__name__)

# 配置文件路径
CONFIG_PATH = Path('data/config.json')
PENDING_PATH = Path('data/pending.json')
APPROVED_PATH = Path('data/approved.json')
REJECTED_PATH = Path('data/rejected.json')

# 确保数据目录存在
os.makedirs('data', exist_ok=True)

# 生成测试数据
def generate_test_data():
    """生成测试数据"""
    test_data = {
        "videos": [
            {
                "id": 1,
                "bv": "BV1ZHiyBkExG",
                "url": "https://www.bilibili.com/video/BV1ZHiyBkExG",
                "title": "《原神》哥伦比娅角色PV——「存于何处」",
                "description": "夜晚打湿她的睫毛，惊喜像阳光一样落在她脚边。",
                "publish_date": "2026-01-21",
                "views": 3010487,
                "danmaku": 56581,
                "up主": "原神",
                "thumbnail": "//i1.hdslb.com/bfs/archive/57b7a6358b0a552852242e66d1610eada2ac61b6.jpg@100w_100h_1c.png",
                "crawled_at": "2026-01-21 12:00:00",
                "review_status": "pending",
                "review_note": ""
            },
            {
                "id": 2,
                "bv": "BV16SveBSEyi",
                "url": "https://www.bilibili.com/video/BV16SveBSEyi",
                "title": "《原神》千星奇域 -「月之四」版本传说套装PV - 晨曦朝露",
                "description": "一元复始，礼规更新。新的传说套装「晨曦朝露」即将登场。",
                "publish_date": "2026-01-20",
                "views": 880000,
                "danmaku": 12000,
                "up主": "原神千星奇域",
                "thumbnail": "//i0.hdslb.com/bfs/archive/f03d0a2fc7a903cfe1641a70a15ec992e569b821.jpg@100w_100h_1c.png",
                "crawled_at": "2026-01-21 12:01:00",
                "review_status": "pending",
                "review_note": ""
            },
            {
                "id": 3,
                "bv": "BV1rbi8BrE7p",
                "url": "https://www.bilibili.com/video/BV1rbi8BrE7p",
                "title": "《原神》提瓦特风尚·衣装PV - 嘉夜沈邃",
                "description": "冬天飘来了鲜花与柑橘，她的指尖落满星光。",
                "publish_date": "2026-01-19",
                "views": 1200000,
                "danmaku": 25000,
                "up主": "原神",
                "thumbnail": "//i2.hdslb.com/bfs/archive/8d3a7d361d42dcd76cb471e5b49cfc6d0b2e2de3.jpg@100w_100h_1c.png",
                "crawled_at": "2026-01-21 12:02:00",
                "review_status": "pending",
                "review_note": ""
            }
        ]
    }
    
    # 保存测试数据
    with open(PENDING_PATH, 'w', encoding='utf-8') as f:
        json.dump(test_data, f, ensure_ascii=False, indent=2)
    
    # 创建空的已通过和已拒绝文件
    with open(APPROVED_PATH, 'w', encoding='utf-8') as f:
        json.dump({"videos": []}, f, ensure_ascii=False, indent=2)
    
    with open(REJECTED_PATH, 'w', encoding='utf-8') as f:
        json.dump({"videos": []}, f, ensure_ascii=False, indent=2)
    
    print("生成了测试数据")

# 加载数据
def load_data(path):
    """加载JSON数据"""
    if path.exists():
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {"videos": []}

# 保存数据
def save_data(path, data):
    """保存JSON数据"""
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# 首页
@app.route('/')
def index():
    """首页"""
    pending_data = load_data(PENDING_PATH)
    approved_data = load_data(APPROVED_PATH)
    rejected_data = load_data(REJECTED_PATH)
    
    return render_template('index.html', 
                          pending_count=len(pending_data['videos']),
                          approved_count=len(approved_data['videos']),
                          rejected_count=len(rejected_data['videos']))

# 待审核列表
@app.route('/pending')
def pending():
    """待审核列表"""
    pending_data = load_data(PENDING_PATH)
    return render_template('pending.html', videos=pending_data['videos'])

# 审核操作
@app.route('/review/<int:video_id>', methods=['POST'])
def review(video_id):
    """审核操作"""
    action = request.form.get('action')
    note = request.form.get('note', '')
    
    # 加载待审核数据
    pending_data = load_data(PENDING_PATH)
    
    # 查找视频
    video = None
    video_index = -1
    
    for i, v in enumerate(pending_data['videos']):
        if v.get('id') == video_id:
            video = v
            video_index = i
            break
    
    if video and video_index >= 0:
        # 移除视频
        pending_data['videos'].pop(video_index)
        
        # 更新视频状态
        video['review_status'] = action
        video['review_note'] = note
        video['reviewed_at'] = '2026-01-21 12:00:00'  # 简化处理
        
        # 保存到对应文件
        if action == 'approve':
            approved_data = load_data(APPROVED_PATH)
            approved_data['videos'].append(video)
            save_data(APPROVED_PATH, approved_data)
        elif action == 'reject':
            rejected_data = load_data(REJECTED_PATH)
            rejected_data['videos'].append(video)
            save_data(REJECTED_PATH, rejected_data)
        
        # 保存待审核数据
        save_data(PENDING_PATH, pending_data)
    
    return redirect(url_for('pending'))

# 已通过列表
@app.route('/approved')
def approved():
    """已通过列表"""
    approved_data = load_data(APPROVED_PATH)
    return render_template('approved.html', videos=approved_data['videos'])

# 已拒绝列表
@app.route('/rejected')
def rejected():
    """已拒绝列表"""
    rejected_data = load_data(REJECTED_PATH)
    return render_template('rejected.html', videos=rejected_data['videos'])

# 生成时间线
@app.route('/generate')
def generate():
    """生成时间线"""
    # 加载已通过的视频数据
    approved_data = load_data(APPROVED_PATH)
    videos = approved_data.get('videos', [])
    
    # 按照发布日期排序（降序）
    videos.sort(key=lambda x: x.get('publish_date', ''), reverse=True)
    
    # 生成timeline数据
    timeline_data = []
    for video in videos:
        timeline_item = {
            "id": video.get('id'),
            "date": video.get('publish_date'),
            "title": video.get('title'),
            "content": video.get('description', ''),
            "video": {
                "bv": video.get('bv'),
                "url": video.get('url')
            },
            "thumbnail": video.get('thumbnail'),
            "views": video.get('views'),
            "danmaku": video.get('danmaku'),
            "up主": video.get('up主')
        }
        timeline_data.append(timeline_item)
    
    # 保存到前端目录
    timeline_path = Path('../frontend/public/timeline.json')
    timeline_path.parent.mkdir(exist_ok=True)
    
    with open(timeline_path, 'w', encoding='utf-8') as f:
        json.dump(timeline_data, f, ensure_ascii=False, indent=2)
    
    print(f"生成了时间线数据，保存到: {timeline_path}")
    print(f"时间线包含 {len(timeline_data)} 个视频")
    
    return redirect(url_for('index'))

# 创建模板目录和文件
def create_templates():
    """创建模板目录和文件"""
    # 创建模板目录
    os.makedirs('templates', exist_ok=True)
    
    # 创建index.html
    index_html = '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>视频审核系统</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .stats {
            display: flex;
            justify-content: space-around;
            margin: 20px 0;
        }
        .stat-box {
            text-align: center;
            padding: 20px;
            background-color: #f0f0f0;
            border-radius: 8px;
        }
        .btn {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin: 5px;
        }
        .btn:hover {
            background-color: #45a049;
        }
        .btn-secondary {
            background-color: #008CBA;
        }
        .btn-secondary:hover {
            background-color: #007bb5;
        }
        .btn-danger {
            background-color: #f44336;
        }
        .btn-danger:hover {
            background-color: #da190b;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>视频审核系统</h1>
        <p>欢迎使用视频审核系统，您可以在这里审核自动爬取的视频，决定是否添加到最终的时间线中。</p>
        
        <div class="stats">
            <div class="stat-box">
                <h3>待审核</h3>
                <p>{{ pending_count }}</p>
                <a href="/pending" class="btn">查看</a>
            </div>
            <div class="stat-box">
                <h3>已通过</h3>
                <p>{{ approved_count }}</p>
                <a href="/approved" class="btn btn-secondary">查看</a>
            </div>
            <div class="stat-box">
                <h3>已拒绝</h3>
                <p>{{ rejected_count }}</p>
                <a href="/rejected" class="btn btn-danger">查看</a>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
            <a href="/generate" class="btn">生成时间线</a>
        </div>
    </div>
</body>
</html>'''
    
    # 创建pending.html
    pending_html = '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>待审核视频</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .video-item {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
            background-color: #f9f9f9;
        }
        .video-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .video-info {
            margin-bottom: 10px;
            font-size: 14px;
            color: #666;
        }
        .video-actions {
            margin-top: 15px;
        }
        .btn {
            display: inline-block;
            padding: 8px 16px;
            text-decoration: none;
            border-radius: 4px;
            margin-right: 10px;
            font-size: 14px;
        }
        .btn-approve {
            background-color: #4CAF50;
            color: white;
        }
        .btn-approve:hover {
            background-color: #45a049;
        }
        .btn-reject {
            background-color: #f44336;
            color: white;
        }
        .btn-reject:hover {
            background-color: #da190b;
        }
        .btn-back {
            background-color: #008CBA;
            color: white;
        }
        .btn-back:hover {
            background-color: #007bb5;
        }
        .form-group {
            margin: 10px 0;
        }
        textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            resize: vertical;
            min-height: 80px;
        }
        img {
            max-width: 200px;
            max-height: 150px;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>待审核视频</h1>
        <a href="/" class="btn btn-back">返回首页</a>
        
        {% if videos %}
            {% for video in videos %}
                <div class="video-item">
                    <div class="video-title">{{ video.title }}</div>
                    <div class="video-info">
                        <p>URL: <a href="{{ video.url }}" target="_blank">{{ video.url }}</a></p>
                        <p>发布时间: {{ video.publish_date }}</p>
                        <p>播放量: {{ video.views }}</p>
                        <p>弹幕数: {{ video.danmaku }}</p>
                        <p>UP主: {{ video.up主 }}</p>
                    </div>
                    {% if video.thumbnail %}
                        <img src="{{ video.thumbnail }}" alt="缩略图">
                    {% endif %}
                    <form class="video-actions" action="/review/{{ video.id }}" method="post">
                        <div class="form-group">
                            <label for="note-{{ video.id }}">备注：</label>
                            <textarea id="note-{{ video.id }}" name="note" placeholder="请输入备注信息"></textarea>
                        </div>
                        <button type="submit" name="action" value="approve" class="btn btn-approve">通过</button>
                        <button type="submit" name="action" value="reject" class="btn btn-reject">拒绝</button>
                    </form>
                </div>
            {% endfor %}
        {% else %}
            <p>暂无待审核视频</p>
        {% endif %}
    </div>
</body>
</html>'''
    
    # 创建approved.html
    approved_html = '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>已通过视频</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .video-item {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
            background-color: #f0fff0;
        }
        .video-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .video-info {
            margin-bottom: 10px;
            font-size: 14px;
            color: #666;
        }
        .btn-back {
            display: inline-block;
            padding: 8px 16px;
            background-color: #008CBA;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin-bottom: 20px;
        }
        .btn-back:hover {
            background-color: #007bb5;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>已通过视频</h1>
        <a href="/" class="btn-back">返回首页</a>
        
        {% if videos %}
            {% for video in videos %}
                <div class="video-item">
                    <div class="video-title">{{ video.title }}</div>
                    <div class="video-info">
                        <p>URL: <a href="{{ video.url }}" target="_blank">{{ video.url }}</a></p>
                        <p>发布时间: {{ video.publish_date }}</p>
                        <p>审核时间: {{ video.reviewed_at }}</p>
                        <p>备注: {{ video.review_note }}</p>
                    </div>
                </div>
            {% endfor %}
        {% else %}
            <p>暂无已通过视频</p>
        {% endif %}
    </div>
</body>
</html>'''
    
    # 创建rejected.html
    rejected_html = '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>已拒绝视频</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .video-item {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
            background-color: #fff0f0;
        }
        .video-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .video-info {
            margin-bottom: 10px;
            font-size: 14px;
            color: #666;
        }
        .btn-back {
            display: inline-block;
            padding: 8px 16px;
            background-color: #008CBA;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin-bottom: 20px;
        }
        .btn-back:hover {
            background-color: #007bb5;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>已拒绝视频</h1>
        <a href="/" class="btn-back">返回首页</a>
        
        {% if videos %}
            {% for video in videos %}
                <div class="video-item">
                    <div class="video-title">{{ video.title }}</div>
                    <div class="video-info">
                        <p>URL: <a href="{{ video.url }}" target="_blank">{{ video.url }}</a></p>
                        <p>发布时间: {{ video.publish_date }}</p>
                        <p>审核时间: {{ video.reviewed_at }}</p>
                        <p>备注: {{ video.review_note }}</p>
                    </div>
                </div>
            {% endfor %}
        {% else %}
            <p>暂无已拒绝视频</p>
        {% endif %}
    </div>
</body>
</html>'''
    
    # 写入模板文件
    with open('templates/index.html', 'w', encoding='utf-8') as f:
        f.write(index_html)
    
    with open('templates/pending.html', 'w', encoding='utf-8') as f:
        f.write(pending_html)
    
    with open('templates/approved.html', 'w', encoding='utf-8') as f:
        f.write(approved_html)
    
    with open('templates/rejected.html', 'w', encoding='utf-8') as f:
        f.write(rejected_html)
    
    print("创建了模板文件")

if __name__ == '__main__':
    # 生成测试数据
    generate_test_data()
    
    # 创建模板文件
    create_templates()
    
    # 检查Flask是否安装
    try:
        import flask
        try:
            from importlib.metadata import version
            print("Flask已安装，版本:", version("flask"))
        except:
            print("Flask已安装")
    except ImportError:
        print("Flask未安装，需要运行: pip install flask")
        exit(1)
    
    # 启动应用
    print("\n启动审核界面测试...")
    print("请打开浏览器访问: http://localhost:5000")
    print("按 Ctrl+C 退出")
    
    app.run(debug=True, host='localhost', port=5000)
