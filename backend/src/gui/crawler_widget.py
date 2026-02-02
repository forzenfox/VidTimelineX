import sys
import os
import json
import threading
from PyQt5.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, QLineEdit, QPushButton,
    QTextEdit, QProgressBar, QFileDialog, QMessageBox, QGroupBox
)
from PyQt5.QtCore import Qt, QTimer
from src.crawler.auto_crawler import BiliBiliAutoCrawler
from src.utils.path_manager import get_bv_file_path


class CrawlerWidget(QWidget):
    """
    爬虫功能GUI模块
    实现视频爬取、批量操作等功能的界面
    """
    
    def __init__(self, data_type):
        """
        初始化爬虫功能界面
        
        Args:
            data_type: 数据类型，用于区分甜筒和驴酱数据
        """
        super().__init__()
        self.data_type = data_type
        self.crawler = None
        self.is_crawling = False
        self.init_ui()
    
    def init_ui(self):
        """
        初始化用户界面
        """
        layout = QVBoxLayout()
        
        # 设置标题
        title_label = QLabel("视频爬虫功能")
        title_label.setStyleSheet("font-size: 16px; font-weight: bold;")
        layout.addWidget(title_label)
        
        # 单个BV号爬取
        single_crawl_group = QGroupBox("单个视频爬取")
        single_crawl_layout = QVBoxLayout()
        
        bv_layout = QHBoxLayout()
        bv_label = QLabel("BV号:")
        self.bv_input = QLineEdit()
        self.bv_input.setPlaceholderText("请输入BV号")
        crawl_button = QPushButton("爬取")
        crawl_button.clicked.connect(self.crawl_single_video)
        
        bv_layout.addWidget(bv_label)
        bv_layout.addWidget(self.bv_input, 1)
        bv_layout.addWidget(crawl_button)
        
        single_crawl_layout.addLayout(bv_layout)
        single_crawl_group.setLayout(single_crawl_layout)
        layout.addWidget(single_crawl_group)
        
        # 批量爬取
        batch_crawl_group = QGroupBox("批量视频爬取")
        batch_crawl_layout = QVBoxLayout()
        
        file_layout = QHBoxLayout()
        file_label = QLabel("BV号文件:")
        self.file_path_input = QLineEdit()
        self.file_path_input.setPlaceholderText("请选择包含BV号的文件")
        browse_button = QPushButton("浏览")
        browse_button.clicked.connect(self.browse_file)
        
        file_layout.addWidget(file_label)
        file_layout.addWidget(self.file_path_input, 1)
        file_layout.addWidget(browse_button)
        
        batch_button = QPushButton("批量爬取")
        batch_button.clicked.connect(self.crawl_batch_videos)
        
        batch_crawl_layout.addLayout(file_layout)
        batch_crawl_layout.addWidget(batch_button)
        batch_crawl_group.setLayout(batch_crawl_layout)
        layout.addWidget(batch_crawl_group)
        
        # 状态和日志
        status_group = QGroupBox("爬取状态")
        status_layout = QVBoxLayout()
        
        self.status_text = QTextEdit()
        self.status_text.setReadOnly(True)
        self.status_text.setMinimumHeight(200)
        
        self.progress_bar = QProgressBar()
        self.progress_bar.setRange(0, 100)
        self.progress_bar.setValue(0)
        
        status_layout.addWidget(self.status_text)
        status_layout.addWidget(self.progress_bar)
        status_group.setLayout(status_layout)
        layout.addWidget(status_group)
        
        self.setLayout(layout)
    
    def update_data_type(self, data_type):
        """
        更新数据类型
        
        Args:
            data_type: 新的数据类型
        """
        self.data_type = data_type
        self.status_text.append(f"数据类型已更新为: {data_type}")
    
    def browse_file(self):
        """
        浏览文件对话框
        """
        file_path, _ = QFileDialog.getOpenFileName(
            self, "选择BV号文件", "", "文本文件 (*.txt);;所有文件 (*.*)"
        )
        if file_path:
            self.file_path_input.setText(file_path)
    
    def crawl_single_video(self):
        """
        爬取单个视频
        """
        bv_id = self.bv_input.text().strip()
        if not bv_id:
            QMessageBox.warning(self, "警告", "请输入BV号")
            return
        
        if self.is_crawling:
            QMessageBox.warning(self, "警告", "正在爬取中，请等待完成")
            return
        
        # 清空状态
        self.status_text.clear()
        self.status_text.append(f"开始爬取视频: {bv_id}")
        self.progress_bar.setValue(0)
        
        # 创建爬虫实例
        self.crawler = BiliBiliAutoCrawler(data_type=self.data_type)
        
        # 启动线程执行爬取
        self.is_crawling = True
        thread = threading.Thread(target=self._crawl_single_video_thread, args=(bv_id,))
        thread.daemon = True
        thread.start()
        
        # 启动定时器更新状态
        self.timer = QTimer(self)
        self.timer.timeout.connect(self._update_status)
        self.timer.start(100)
    
    def _crawl_single_video_thread(self, bv_id):
        """
        爬取单个视频的线程函数
        
        Args:
            bv_id: BV号
        """
        try:
            # 调用爬虫爬取视频
            result = self.crawler.crawl_video(bv_id)
            
            if result:
                self.status_text.append(f"爬取成功: {result.get('title', '未知标题')}")
                self.status_text.append(f"视频信息已保存到: {get_bv_file_path(bv_id, self.data_type)}")
            else:
                self.status_text.append("爬取失败: 未获取到视频信息")
                
        except Exception as e:
            self.status_text.append(f"爬取失败: {str(e)}")
        finally:
            self.is_crawling = False
            self.progress_bar.setValue(100)
            self.timer.stop()
    
    def crawl_batch_videos(self):
        """
        批量爬取视频
        """
        file_path = self.file_path_input.text().strip()
        if not file_path:
            QMessageBox.warning(self, "警告", "请选择BV号文件")
            return
        
        if not os.path.exists(file_path):
            QMessageBox.warning(self, "警告", "所选文件不存在")
            return
        
        if self.is_crawling:
            QMessageBox.warning(self, "警告", "正在爬取中，请等待完成")
            return
        
        # 读取BV号列表
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                bv_list = [line.strip() for line in f if line.strip()]
            
            if not bv_list:
                QMessageBox.warning(self, "警告", "文件中没有有效的BV号")
                return
            
        except Exception as e:
            QMessageBox.critical(self, "错误", f"读取文件失败: {str(e)}")
            return
        
        # 清空状态
        self.status_text.clear()
        self.status_text.append(f"开始批量爬取，共 {len(bv_list)} 个视频")
        self.progress_bar.setValue(0)
        
        # 创建爬虫实例
        self.crawler = BiliBiliAutoCrawler(data_type=self.data_type)
        
        # 启动线程执行批量爬取
        self.is_crawling = True
        thread = threading.Thread(target=self._crawl_batch_videos_thread, args=(bv_list,))
        thread.daemon = True
        thread.start()
        
        # 启动定时器更新状态
        self.timer = QTimer(self)
        self.timer.timeout.connect(self._update_status)
        self.timer.start(100)
    
    def _crawl_batch_videos_thread(self, bv_list):
        """
        批量爬取视频的线程函数
        
        Args:
            bv_list: BV号列表
        """
        total = len(bv_list)
        success_count = 0
        failure_count = 0
        
        try:
            for i, bv_id in enumerate(bv_list):
                # 更新进度
                progress = int((i + 1) / total * 100)
                self.progress_bar.setValue(progress)
                
                self.status_text.append(f"[{i+1}/{total}] 开始爬取: {bv_id}")
                
                try:
                    # 调用爬虫爬取视频
                    result = self.crawler.crawl_video(bv_id)
                    
                    if result:
                        self.status_text.append(f"[{i+1}/{total}] 爬取成功: {result.get('title', '未知标题')}")
                        success_count += 1
                    else:
                        self.status_text.append(f"[{i+1}/{total}] 爬取失败: 未获取到视频信息")
                        failure_count += 1
                        
                except Exception as e:
                    self.status_text.append(f"[{i+1}/{total}] 爬取失败: {str(e)}")
                    failure_count += 1
            
            # 爬取完成
            self.status_text.append(f"\n批量爬取完成")
            self.status_text.append(f"成功: {success_count} 个")
            self.status_text.append(f"失败: {failure_count} 个")
            
        except Exception as e:
            self.status_text.append(f"批量爬取失败: {str(e)}")
        finally:
            self.is_crawling = False
            self.progress_bar.setValue(100)
            self.timer.stop()
    
    def _update_status(self):
        """
        更新爬取状态
        """
        # 这里可以添加更多状态更新逻辑
        pass
