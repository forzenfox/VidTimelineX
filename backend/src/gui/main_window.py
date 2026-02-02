#!/usr/bin/env python3
"""
主窗口模块
实现应用的主窗口，包含导航栏、内容区域和状态栏
"""

from PyQt5.QtWidgets import (
    QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, QTreeWidget, 
    QTreeWidgetItem, QStatusBar, QLabel, QProgressBar, QTextEdit,
    QStackedWidget, QTabWidget, QPushButton
)
from PyQt5.QtCore import Qt
from PyQt5.QtGui import QIcon

from src.gui.crawler_widget import CrawlerWidget
from src.gui.data_manager_widget import DataManagerWidget
from src.gui.cover_widget import CoverWidget
from src.gui.timeline_widget import TimelineWidget
from src.gui.settings_widget import SettingsWidget


class MainWindow(QMainWindow):
    """主窗口类"""
    
    def __init__(self):
        """初始化主窗口"""
        super().__init__()
        self.setWindowTitle("VidTimelineX")
        self.setGeometry(100, 100, 1200, 800)
        
        # 当前数据类型
        self.current_data_type = 'lvjiang'
        
        # 初始化UI
        self.init_ui()
    
    def init_ui(self):
        """初始化UI"""
        # 中心widget
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        
        # 主布局
        main_layout = QHBoxLayout(central_widget)
        
        # 左侧导航栏
        self.nav_tree = QTreeWidget()
        self.nav_tree.setHeaderLabel("功能导航")
        self.setup_nav_tree()
        self.nav_tree.itemClicked.connect(self.on_nav_item_clicked)
        main_layout.addWidget(self.nav_tree, 1)
        
        # 右侧内容区域
        self.content_stack = QStackedWidget()
        self.setup_content_stack()
        main_layout.addWidget(self.content_stack, 4)
        
        # 状态栏
        self.status_bar = QStatusBar()
        self.setStatusBar(self.status_bar)
        
        # 状态信息
        self.status_label = QLabel("就绪")
        self.status_bar.addWidget(self.status_label)
        
        # 数据类型切换
        self.data_type_tab = QTabWidget()
        self.data_type_tab.addTab(QWidget(), "驴酱")
        self.data_type_tab.addTab(QWidget(), "甜筒")
        self.data_type_tab.currentChanged.connect(self.on_data_type_changed)
        self.status_bar.addPermanentWidget(self.data_type_tab)
        
        # 进度条
        self.progress_bar = QProgressBar()
        self.progress_bar.setMaximumWidth(200)
        self.progress_bar.setVisible(False)
        self.status_bar.addPermanentWidget(self.progress_bar)
        
        # 日志区域
        self.log_edit = QTextEdit()
        self.log_edit.setReadOnly(True)
        self.log_edit.setMaximumHeight(100)
        main_layout.addWidget(self.log_edit, 1)
    
    def setup_nav_tree(self):
        """设置导航树"""
        # 爬虫功能
        crawler_item = QTreeWidgetItem(self.nav_tree, ["爬虫功能"])
        
        # 数据管理
        data_item = QTreeWidgetItem(self.nav_tree, ["数据管理"])
        
        # 封面管理
        cover_item = QTreeWidgetItem(self.nav_tree, ["封面管理"])
        
        # 时间线
        timeline_item = QTreeWidgetItem(self.nav_tree, ["时间线"])
        
        # 系统设置
        settings_item = QTreeWidgetItem(self.nav_tree, ["系统设置"])
        
        # 展开所有项
        self.nav_tree.expandAll()
    
    def setup_content_stack(self):
        """设置内容堆栈"""
        # 爬虫功能
        self.crawler_widget = CrawlerWidget(self.current_data_type)
        
        # 数据管理
        self.data_manager_widget = DataManagerWidget(self.current_data_type)
        
        # 封面管理
        self.cover_widget = CoverWidget(self.current_data_type)
        
        # 时间线
        self.timeline_widget = TimelineWidget(self.current_data_type)
        
        # 系统设置
        self.settings_widget = SettingsWidget(self.current_data_type)
        
        # 添加到堆栈
        self.content_stack.addWidget(self.crawler_widget)
        self.content_stack.addWidget(self.data_manager_widget)
        self.content_stack.addWidget(self.cover_widget)
        self.content_stack.addWidget(self.timeline_widget)
        self.content_stack.addWidget(self.settings_widget)
    
    def on_nav_item_clicked(self, item, column):
        """处理导航项点击事件"""
        item_text = item.text(column)
        
        # 根据点击的项切换内容
        if item_text == "爬虫功能":
            self.content_stack.setCurrentWidget(self.crawler_widget)
        elif item_text == "数据管理":
            self.content_stack.setCurrentWidget(self.data_manager_widget)
        elif item_text == "封面管理":
            self.content_stack.setCurrentWidget(self.cover_widget)
        elif item_text == "时间线":
            self.content_stack.setCurrentWidget(self.timeline_widget)
        elif item_text == "系统设置":
            self.content_stack.setCurrentWidget(self.settings_widget)
    
    def on_data_type_changed(self, index):
        """处理数据类型变化"""
        data_types = ['lvjiang', 'tiantong']
        if 0 <= index < len(data_types):
            self.current_data_type = data_types[index]
            self.update_status(f"切换到数据类型: {self.current_data_type}")
            
            # 通知所有子widget数据类型变化
            self.crawler_widget.update_data_type(self.current_data_type)
            self.data_manager_widget.update_data_type(self.current_data_type)
            self.cover_widget.update_data_type(self.current_data_type)
            self.timeline_widget.update_data_type(self.current_data_type)
            self.settings_widget.update_data_type(self.current_data_type)
    
    def update_status(self, message):
        """更新状态信息"""
        self.status_label.setText(message)
        self.log_edit.append(message)
    
    def show_progress(self, value, message):
        """显示进度"""
        self.progress_bar.setVisible(True)
        self.progress_bar.setValue(value)
        self.status_label.setText(message)
    
    def hide_progress(self):
        """隐藏进度条"""
        self.progress_bar.setVisible(False)
        self.status_label.setText("就绪")
