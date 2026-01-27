#!/usr/bin/env python3
"""
数据存储方案测试脚本
用于比较不同存储方案（JSON文件、SQLite）的性能和易用性
"""

import json
import sqlite3
import time
import os
from pathlib import Path

class StorageTester:
    def __init__(self):
        self.test_data = {
            "videos": [
                {
                    "bv": "BV1ZHiyBkExG",
                    "url": "https://www.bilibili.com/video/BV1ZHiyBkExG",
                    "title": "《原神》哥伦比娅角色PV——「存于何处」",
                    "description": "夜晚打湿她的睫毛，惊喜像阳光一样落在她脚边。",
                    "publish_date": "2026-01-21",
                    "views": 3010487,
                    "danmaku": 56581,
                    "up主": "原神",
                    "thumbnail": "//i1.hdslb.com/bfs/archive/57b7a6358b0a552852242e66d1610eada2ac61b6.jpg",
                    "crawled_at": "2026-01-21 12:00:00",
                    "review_status": "pending",
                    "review_note": ""
                },
                {
                    "bv": "BV16SveBSEyi",
                    "url": "https://www.bilibili.com/video/BV16SveBSEyi",
                    "title": "《原神》千星奇域 -「月之四」版本传说套装PV - 晨曦朝露",
                    "description": "一元复始，礼规更新。新的传说套装「晨曦朝露」即将登场。",
                    "publish_date": "2026-01-20",
                    "views": 880000,
                    "danmaku": 12000,
                    "up主": "原神千星奇域",
                    "thumbnail": "//i0.hdslb.com/bfs/archive/f03d0a2fc7a903cfe1641a70a15ec992e569b821.jpg",
                    "crawled_at": "2026-01-21 12:01:00",
                    "review_status": "pending",
                    "review_note": ""
                },
                {
                    "bv": "BV1rbi8BrE7p",
                    "url": "https://www.bilibili.com/video/BV1rbi8BrE7p",
                    "title": "《原神》提瓦特风尚·衣装PV - 嘉夜沈邃",
                    "description": "冬天飘来了鲜花与柑橘，她的指尖落满星光。",
                    "publish_date": "2026-01-19",
                    "views": 1200000,
                    "danmaku": 25000,
                    "up主": "原神",
                    "thumbnail": "//i2.hdslb.com/bfs/archive/8d3a7d361d42dcd76cb471e5b49cfc6d0b2e2de3.jpg",
                    "crawled_at": "2026-01-21 12:02:00",
                    "review_status": "pending",
                    "review_note": ""
                }
            ]
        }
        
        # 生成更多测试数据
        for i in range(4, 104):
            self.test_data["videos"].append({
                "bv": f"BV{i:08d}",
                "url": f"https://www.bilibili.com/video/BV{i:08d}",
                "title": f"测试视频 {i}",
                "description": f"这是测试视频 {i} 的描述",
                "publish_date": "2026-01-21",
                "views": 10000 * i,
                "danmaku": 1000 * i,
                "up主": f"测试UP主 {i}",
                "thumbnail": f"//i0.hdslb.com/bfs/archive/test{i}.jpg",
                "crawled_at": "2026-01-21 12:00:00",
                "review_status": "pending",
                "review_note": ""
            })
        
        print(f"生成了 {len(self.test_data['videos'])} 条测试数据")
    
    def test_json_storage(self):
        """测试JSON文件存储"""
        print("\n=== 测试JSON文件存储 ===")
        
        # 测试文件路径
        json_file = "test_storage.json"
        
        # 1. 测试写入性能
        start_time = time.time()
        
        try:
            with open(json_file, 'w', encoding='utf-8') as f:
                json.dump(self.test_data, f, ensure_ascii=False, indent=2)
            
            write_time = time.time() - start_time
            file_size = os.path.getsize(json_file) / 1024  # KB
            
            print(f"写入时间: {write_time:.4f} 秒")
            print(f"文件大小: {file_size:.2f} KB")
            
        except Exception as e:
            print(f"写入错误: {e}")
            return False
        
        # 2. 测试读取性能
        start_time = time.time()
        
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                loaded_data = json.load(f)
            
            read_time = time.time() - start_time
            
            print(f"读取时间: {read_time:.4f} 秒")
            print(f"加载数据条数: {len(loaded_data.get('videos', []))}")
            
        except Exception as e:
            print(f"读取错误: {e}")
            return False
        
        # 3. 测试修改性能
        start_time = time.time()
        
        try:
            # 加载数据
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # 修改第一条数据
            if data.get('videos'):
                data['videos'][0]['review_status'] = 'approved'
                data['videos'][0]['review_note'] = '测试修改'
            
            # 写回数据
            with open(json_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            
            modify_time = time.time() - start_time
            print(f"修改时间: {modify_time:.4f} 秒")
            
        except Exception as e:
            print(f"修改错误: {e}")
            return False
        
        # 4. 测试删除性能
        start_time = time.time()
        
        try:
            # 加载数据
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # 删除最后一条数据
            if data.get('videos') and len(data['videos']) > 0:
                data['videos'].pop()
            
            # 写回数据
            with open(json_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            
            delete_time = time.time() - start_time
            print(f"删除时间: {delete_time:.4f} 秒")
            print(f"删除后数据条数: {len(data.get('videos', []))}")
            
        except Exception as e:
            print(f"删除错误: {e}")
            return False
        
        # 清理测试文件
        if os.path.exists(json_file):
            os.remove(json_file)
        
        print("✓ JSON文件存储测试完成")
        return True
    
    def test_sqlite_storage(self):
        """测试SQLite存储"""
        print("\n=== 测试SQLite存储 ===")
        
        # 测试数据库路径
        db_file = "test_storage.db"
        
        # 清理旧文件
        if os.path.exists(db_file):
            os.remove(db_file)
        
        # 连接数据库
        conn = None
        
        try:
            # 1. 创建数据库和表
            conn = sqlite3.connect(db_file)
            cursor = conn.cursor()
            
            # 创建视频表
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS videos (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    bv TEXT UNIQUE,
                    url TEXT,
                    title TEXT,
                    description TEXT,
                    publish_date TEXT,
                    views INTEGER,
                    danmaku INTEGER,
                    up主 TEXT,
                    thumbnail TEXT,
                    crawled_at TEXT,
                    review_status TEXT,
                    review_note TEXT
                )
            ''')
            
            # 2. 测试写入性能
            start_time = time.time()
            
            # 批量插入数据
            for video in self.test_data['videos']:
                cursor.execute('''
                    INSERT INTO videos (bv, url, title, description, publish_date, views, danmaku, up主, thumbnail, crawled_at, review_status, review_note)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    video['bv'], video['url'], video['title'], video['description'],
                    video['publish_date'], video['views'], video['danmaku'], video['up主'],
                    video['thumbnail'], video['crawled_at'], video['review_status'], video['review_note']
                ))
            
            conn.commit()
            write_time = time.time() - start_time
            
            # 获取数据库大小
            file_size = os.path.getsize(db_file) / 1024  # KB
            
            print(f"写入时间: {write_time:.4f} 秒")
            print(f"数据库大小: {file_size:.2f} KB")
            
            # 3. 测试读取性能
            start_time = time.time()
            
            cursor.execute('SELECT * FROM videos')
            rows = cursor.fetchall()
            
            read_time = time.time() - start_time
            
            print(f"读取时间: {read_time:.4f} 秒")
            print(f"读取数据条数: {len(rows)}")
            
            # 4. 测试修改性能
            start_time = time.time()
            
            cursor.execute('''
                UPDATE videos SET review_status = ?, review_note = ? WHERE id = 1
            ''', ('approved', '测试修改'))
            conn.commit()
            
            modify_time = time.time() - start_time
            print(f"修改时间: {modify_time:.4f} 秒")
            
            # 5. 测试删除性能
            start_time = time.time()
            
            cursor.execute('DELETE FROM videos WHERE id = (SELECT MAX(id) FROM videos)')
            conn.commit()
            
            delete_time = time.time() - start_time
            
            # 验证删除结果
            cursor.execute('SELECT COUNT(*) FROM videos')
            count = cursor.fetchone()[0]
            
            print(f"删除时间: {delete_time:.4f} 秒")
            print(f"删除后数据条数: {count}")
            
            # 6. 测试查询性能
            start_time = time.time()
            
            cursor.execute('SELECT * FROM videos WHERE review_status = ?', ('pending',))
            pending_videos = cursor.fetchall()
            
            query_time = time.time() - start_time
            print(f"查询时间: {query_time:.4f} 秒")
            print(f"查询结果条数: {len(pending_videos)}")
            
        except Exception as e:
            print(f"错误: {e}")
            return False
        finally:
            if conn:
                conn.close()
        
        # 清理测试文件
        if os.path.exists(db_file):
            os.remove(db_file)
        
        print("✓ SQLite存储测试完成")
        return True
    
    def run_all_tests(self):
        """运行所有测试"""
        print("开始存储方案测试...")
        
        # 测试JSON存储
        self.test_json_storage()
        
        # 测试SQLite存储
        self.test_sqlite_storage()
        
        print("\n=== 存储方案对比 ===")
        print("JSON文件存储:")
        print("  优点: 简单易用, 可读性好, 无需额外依赖")
        print("  缺点: 大文件读写慢, 并发操作不安全, 查询功能弱")
        print("  适用: 数据量小, 结构简单的场景")
        print("\nSQLite存储:")
        print("  优点: 轻量级, 查询功能强, 并发操作安全, 数据量大时性能好")
        print("  缺点: 复杂度较高, 需要SQL知识, 可读性不如JSON")
        print("  适用: 数据量较大, 需要复杂查询的场景")
        print("\n对于个人项目建议:")
        print("- 数据量小时(几百条), 使用JSON文件存储")
        print("- 数据量大时(几千条+), 使用SQLite存储")
        print("- 可以先使用JSON, 后续根据需要迁移到SQLite")

if __name__ == "__main__":
    tester = StorageTester()
    tester.run_all_tests()
