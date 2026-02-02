import sys
import os
import json
from PyQt5.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, QLineEdit, QPushButton,
    QTextEdit, QListWidget, QListWidgetItem, QMessageBox, QGroupBox,
    QFileDialog, QComboBox, QCheckBox, QSpinBox, QDoubleSpinBox
)
from PyQt5.QtCore import Qt
from src.utils.config import get_config, save_config, get_data_type_config
from src.utils.path_manager import get_data_paths, ensure_directories


class SettingsWidget(QWidget):
    """
    设置管理GUI模块
    实现系统配置、数据类型管理等功能的界面
    """
    
    def __init__(self, data_type):
        """
        初始化设置管理界面
        
        Args:
            data_type: 数据类型，用于区分甜筒和驴酱数据
        """
        super().__init__()
        self.data_type = data_type
        self.config = get_config()
        self.init_ui()
    
    def init_ui(self):
        """
        初始化用户界面
        """
        layout = QVBoxLayout()
        
        # 设置标题
        title_label = QLabel("系统设置")
        title_label.setStyleSheet("font-size: 16px; font-weight: bold;")
        layout.addWidget(title_label)
        
        # 数据类型设置
        data_type_group = QGroupBox("数据类型设置")
        data_type_layout = QVBoxLayout()
        
        # 数据类型管理
        data_type_manage_layout = QHBoxLayout()
        
        data_type_label = QLabel("当前数据类型:")
        self.current_data_type_label = QLabel(self.data_type)
        self.current_data_type_label.setStyleSheet("font-weight: bold;")
        
        data_type_manage_layout.addWidget(data_type_label)
        data_type_manage_layout.addWidget(self.current_data_type_label)
        data_type_manage_layout.addStretch()
        
        data_type_layout.addLayout(data_type_manage_layout)
        
        # 数据类型路径
        path_layout = QVBoxLayout()
        path_layout.addWidget(QLabel("数据类型路径:"))
        
        data_paths = get_data_paths(self.data_type)
        
        for key, path in data_paths.items():
            path_row_layout = QHBoxLayout()
            path_row_layout.addWidget(QLabel(f"{key}:", alignment=Qt.AlignLeft))
            path_label = QLabel(str(path))
            path_label.setWordWrap(True)
            path_row_layout.addWidget(path_label, 1)
            path_layout.addLayout(path_row_layout)
        
        data_type_layout.addLayout(path_layout)
        data_type_group.setLayout(data_type_layout)
        layout.addWidget(data_type_group)
        
        # 系统配置
        system_group = QGroupBox("系统配置")
        system_layout = QVBoxLayout()
        
        # 爬虫配置
        crawler_layout = QVBoxLayout()
        crawler_layout.addWidget(QLabel("爬虫配置:"))
        
        # 超时设置
        timeout_layout = QHBoxLayout()
        timeout_label = QLabel("请求超时 (秒):")
        self.timeout_spin = QSpinBox()
        self.timeout_spin.setRange(1, 60)
        self.timeout_spin.setValue(self.config.get('crawler', {}).get('timeout', 30))
        
        timeout_layout.addWidget(timeout_label)
        timeout_layout.addWidget(self.timeout_spin)
        timeout_layout.addStretch()
        crawler_layout.addLayout(timeout_layout)
        
        # 重试次数
        retry_layout = QHBoxLayout()
        retry_label = QLabel("重试次数:")
        self.retry_spin = QSpinBox()
        self.retry_spin.setRange(0, 10)
        self.retry_spin.setValue(self.config.get('crawler', {}).get('retry', 3))
        
        retry_layout.addWidget(retry_label)
        retry_layout.addWidget(self.retry_spin)
        retry_layout.addStretch()
        crawler_layout.addLayout(retry_layout)
        
        system_layout.addLayout(crawler_layout)
        
        # 数据存储配置
        storage_layout = QVBoxLayout()
        storage_layout.addWidget(QLabel("数据存储配置:"))
        
        # 自动创建目录
        auto_create_layout = QHBoxLayout()
        auto_create_label = QLabel("自动创建目录:")
        self.auto_create_check = QCheckBox()
        self.auto_create_check.setChecked(self.config.get('storage', {}).get('auto_create', True))
        
        auto_create_layout.addWidget(auto_create_label)
        auto_create_layout.addWidget(self.auto_create_check)
        auto_create_layout.addStretch()
        storage_layout.addLayout(auto_create_layout)
        
        system_layout.addLayout(storage_layout)
        system_group.setLayout(system_layout)
        layout.addWidget(system_group)
        
        # 应用按钮
        button_layout = QHBoxLayout()
        
        save_button = QPushButton("保存设置")
        save_button.clicked.connect(self.save_settings)
        
        reset_button = QPushButton("重置默认")
        reset_button.clicked.connect(self.reset_settings)
        
        button_layout.addWidget(save_button)
        button_layout.addWidget(reset_button)
        button_layout.addStretch()
        layout.addLayout(button_layout)
        
        self.setLayout(layout)
    
    def update_data_type(self, data_type):
        """
        更新数据类型
        
        Args:
            data_type: 新的数据类型
        """
        self.data_type = data_type
        # 更新当前数据类型标签
        self.current_data_type_label.setText(data_type)
        
        # 更新数据类型路径
        # 这里需要重新构建数据类型路径部分
        # 为了简化，我们可以重新加载整个窗口
        # 实际应用中可以优化为只更新路径部分
        self.init_ui()
    
    def save_settings(self):
        """
        保存设置
        """
        try:
            # 更新配置
            self.config['crawler'] = {
                'timeout': self.timeout_spin.value(),
                'retry': self.retry_spin.value()
            }
            
            self.config['storage'] = {
                'auto_create': self.auto_create_check.isChecked()
            }
            
            # 保存配置
            save_config(self.config)
            
            QMessageBox.information(self, "成功", "设置保存成功")
            
        except Exception as e:
            QMessageBox.critical(self, "错误", f"保存失败: {str(e)}")
    
    def reset_settings(self):
        """
        重置默认设置
        """
        # 确认重置
        reply = QMessageBox.question(
            self, "重置确认", 
            "确定要重置为默认设置吗？",
            QMessageBox.Yes | QMessageBox.No, QMessageBox.No
        )
        
        if reply == QMessageBox.Yes:
            # 重置为默认值
            self.timeout_spin.setValue(30)
            self.retry_spin.setValue(3)
            self.auto_create_check.setChecked(True)
            
            # 重置配置
            default_config = {
                'crawler': {
                    'timeout': 30,
                    'retry': 3
                },
                'storage': {
                    'auto_create': True
                }
            }
            
            try:
                save_config(default_config)
                QMessageBox.information(self, "成功", "设置已重置为默认值")
            except Exception as e:
                QMessageBox.critical(self, "错误", f"重置失败: {str(e)}")
    
    def refresh_paths(self):
        """
        刷新路径显示
        """
        # 这里可以添加刷新路径显示的逻辑
        pass
