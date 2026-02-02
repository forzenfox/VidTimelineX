import sys
import os
import json
import threading
from PyQt5.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, QLineEdit, QPushButton,
    QTextEdit, QListWidget, QListWidgetItem, QMessageBox, QGroupBox,
    QFileDialog, QComboBox, QProgressBar
)
from PyQt5.QtCore import Qt
from src.crawler.auto_crawler import BiliBiliAutoCrawler
from src.utils.path_manager import get_data_paths


class TimelineWidget(QWidget):
    """
    时间线管理GUI模块
    实现时间线的生成、查看等功能的界面
    """
    
    def __init__(self, data_type):
        """
        初始化时间线管理界面
        
        Args:
            data_type: 数据类型，用于区分甜筒和驴酱数据
        """
        super().__init__()
        self.data_type = data_type
        self.data_paths = get_data_paths(data_type)
        self.timeline_files = []
        self.init_ui()
    
    def init_ui(self):
        """
        初始化用户界面
        """
        layout = QVBoxLayout()
        
        # 设置标题
        title_label = QLabel("时间线管理")
        title_label.setStyleSheet("font-size: 16px; font-weight: bold;")
        layout.addWidget(title_label)
        
        # 时间线操作区
        operation_group = QGroupBox("时间线操作")
        operation_layout = QHBoxLayout()
        
        generate_button = QPushButton("生成时间线")
        generate_button.clicked.connect(self.generate_timeline)
        
        refresh_button = QPushButton("刷新时间线列表")
        refresh_button.clicked.connect(self.load_timeline_list)
        
        export_button = QPushButton("导出时间线")
        export_button.clicked.connect(self.export_timeline)
        
        operation_layout.addWidget(generate_button)
        operation_layout.addWidget(refresh_button)
        operation_layout.addWidget(export_button)
        operation_group.setLayout(operation_layout)
        layout.addWidget(operation_group)
        
        # 时间线列表和内容
        main_content_layout = QHBoxLayout()
        
        # 时间线列表
        list_group = QGroupBox("时间线列表")
        list_layout = QVBoxLayout()
        
        self.timeline_list = QListWidget()
        self.timeline_list.setMinimumWidth(200)
        self.timeline_list.itemClicked.connect(self.on_timeline_item_clicked)
        
        list_layout.addWidget(self.timeline_list)
        list_group.setLayout(list_layout)
        main_content_layout.addWidget(list_group)
        
        # 时间线内容
        content_group = QGroupBox("时间线内容")
        content_layout = QVBoxLayout()
        
        self.timeline_content = QTextEdit()
        self.timeline_content.setReadOnly(True)
        self.timeline_content.setMinimumHeight(300)
        
        content_layout.addWidget(self.timeline_content)
        content_group.setLayout(content_layout)
        main_content_layout.addWidget(content_group)
        
        layout.addLayout(main_content_layout)
        
        # 生成进度
        progress_group = QGroupBox("生成进度")
        progress_layout = QVBoxLayout()
        
        self.progress_bar = QProgressBar()
        self.progress_bar.setRange(0, 100)
        self.progress_bar.setValue(0)
        
        self.progress_text = QTextEdit()
        self.progress_text.setReadOnly(True)
        self.progress_text.setMinimumHeight(100)
        
        progress_layout.addWidget(self.progress_bar)
        progress_layout.addWidget(self.progress_text)
        progress_group.setLayout(progress_layout)
        layout.addWidget(progress_group)
        
        self.setLayout(layout)
        
        # 加载时间线列表
        self.load_timeline_list()
    
    def update_data_type(self, data_type):
        """
        更新数据类型
        
        Args:
            data_type: 新的数据类型
        """
        self.data_type = data_type
        self.data_paths = get_data_paths(data_type)
        self.load_timeline_list()
    
    def load_timeline_list(self):
        """
        加载时间线列表
        """
        # 清空列表
        self.timeline_list.clear()
        self.timeline_files = []
        self.timeline_content.clear()
        
        # 获取时间线目录
        timeline_dir = self.data_paths['timeline']
        
        if not os.path.exists(timeline_dir):
            QMessageBox.information(self, "信息", "时间线目录不存在")
            return
        
        # 遍历时间线文件
        for filename in os.listdir(timeline_dir):
            if filename.endswith('.json'):
                # 提取时间线名称
                timeline_name = filename.replace('.json', '')
                
                # 添加到列表
                item = QListWidgetItem(timeline_name)
                item.setData(Qt.UserRole, {
                    'filename': filename,
                    'name': timeline_name
                })
                self.timeline_list.addItem(item)
                self.timeline_files.append({
                    'filename': filename,
                    'name': timeline_name,
                    'path': os.path.join(timeline_dir, filename)
                })
    
    def on_timeline_item_clicked(self, item):
        """
        时间线列表项点击事件
        
        Args:
            item: 点击的列表项
        """
        data = item.data(Qt.UserRole)
        filename = data.get('filename')
        name = data.get('name')
        
        # 显示时间线内容
        timeline_path = os.path.join(self.data_paths['timeline'], filename)
        
        if os.path.exists(timeline_path):
            try:
                with open(timeline_path, 'r', encoding='utf-8') as f:
                    timeline_data = json.load(f)
                
                # 格式化时间线内容
                content_text = f"时间线名称: {name}\n\n"
                content_text += "视频列表:\n"
                
                for i, video in enumerate(timeline_data.get('videos', []), 1):
                    bv_id = video.get('bv_id', '未知')
                    title = video.get('title', '未知标题')
                    pubdate = video.get('pubdate', '未知时间')
                    
                    content_text += f"{i}. [{bv_id}] {title} (发布时间: {pubdate})\n"
                
                content_text += f"\n总视频数: {len(timeline_data.get('videos', []))}\n"
                content_text += f"生成时间: {timeline_data.get('generated_at', '未知')}\n"
                
                self.timeline_content.setText(content_text)
                
            except Exception as e:
                self.timeline_content.setText(f"读取时间线失败: {str(e)}")
        else:
            self.timeline_content.setText("时间线文件不存在")
    
    def generate_timeline(self):
        """
        生成时间线
        """
        # 清空进度
        self.progress_bar.setValue(0)
        self.progress_text.clear()
        
        # 启动线程执行生成
        thread = threading.Thread(target=self._generate_timeline_thread)
        thread.daemon = True
        thread.start()
    
    def _generate_timeline_thread(self):
        """
        生成时间线的线程函数
        """
        try:
            # 创建爬虫实例
            crawler = BiliBiliAutoCrawler(data_type=self.data_type)
            
            # 生成时间线
            self.progress_text.append("开始生成时间线...")
            self.progress_text.append("正在加载视频数据...")
            
            # 调用生成时间线方法
            timeline_path = crawler.generate_timeline()
            
            if timeline_path:
                self.progress_text.append(f"时间线生成成功: {timeline_path}")
                self.progress_text.append("正在更新时间线列表...")
                
                # 重新加载时间线列表
                self.load_timeline_list()
                
                # 显示成功消息
                QMessageBox.information(self, "成功", "时间线生成成功")
            else:
                self.progress_text.append("时间线生成失败: 未生成时间线文件")
                QMessageBox.warning(self, "警告", "时间线生成失败")
                
        except Exception as e:
            self.progress_text.append(f"时间线生成失败: {str(e)}")
            QMessageBox.critical(self, "错误", f"生成失败: {str(e)}")
        finally:
            self.progress_bar.setValue(100)
    
    def export_timeline(self):
        """
        导出时间线
        """
        selected_items = self.timeline_list.selectedItems()
        if not selected_items:
            QMessageBox.warning(self, "警告", "请选择一个时间线")
            return
        
        item = selected_items[0]
        data = item.data(Qt.UserRole)
        filename = data.get('filename')
        name = data.get('name')
        
        # 选择导出文件路径
        save_path, _ = QFileDialog.getSaveFileName(
            self, "导出时间线", f"{name}.json", "JSON文件 (*.json);;文本文件 (*.txt);;所有文件 (*.*)"
        )
        
        if not save_path:
            return
        
        # 读取时间线文件
        timeline_path = os.path.join(self.data_paths['timeline'], filename)
        
        if not os.path.exists(timeline_path):
            QMessageBox.warning(self, "警告", "时间线文件不存在")
            return
        
        try:
            if save_path.endswith('.txt'):
                # 导出为文本文件
                with open(timeline_path, 'r', encoding='utf-8') as f:
                    timeline_data = json.load(f)
                
                # 格式化文本内容
                text_content = f"时间线名称: {name}\n\n"
                text_content += "视频列表:\n"
                
                for i, video in enumerate(timeline_data.get('videos', []), 1):
                    bv_id = video.get('bv_id', '未知')
                    title = video.get('title', '未知标题')
                    pubdate = video.get('pubdate', '未知时间')
                    
                    text_content += f"{i}. [{bv_id}] {title} (发布时间: {pubdate})\n"
                
                text_content += f"\n总视频数: {len(timeline_data.get('videos', []))}\n"
                text_content += f"生成时间: {timeline_data.get('generated_at', '未知')}\n"
                
                with open(save_path, 'w', encoding='utf-8') as f:
                    f.write(text_content)
            else:
                # 导出为JSON文件
                import shutil
                shutil.copy2(timeline_path, save_path)
            
            QMessageBox.information(self, "成功", f"时间线导出成功: {save_path}")
            
        except Exception as e:
            QMessageBox.critical(self, "错误", f"导出失败: {str(e)}")
