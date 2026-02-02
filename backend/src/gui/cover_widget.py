import sys
import os
import json
import threading
from PyQt5.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, QLineEdit, QPushButton,
    QTextEdit, QListWidget, QListWidgetItem, QMessageBox, QGroupBox,
    QFileDialog, QComboBox
)
from PyQt5.QtCore import Qt
from PyQt5.QtGui import QPixmap
from src.utils.path_manager import get_data_paths, get_bv_file_path


class CoverWidget(QWidget):
    """
    封面管理GUI模块
    实现视频封面的查看、下载等功能的界面
    """
    
    def __init__(self, data_type):
        """
        初始化封面管理界面
        
        Args:
            data_type: 数据类型，用于区分甜筒和驴酱数据
        """
        super().__init__()
        self.data_type = data_type
        self.data_paths = get_data_paths(data_type)
        self.cover_files = []
        self.init_ui()
    
    def init_ui(self):
        """
        初始化用户界面
        """
        layout = QVBoxLayout()
        
        # 设置标题
        title_label = QLabel("视频封面管理")
        title_label.setStyleSheet("font-size: 16px; font-weight: bold;")
        layout.addWidget(title_label)
        
        # 封面操作区
        operation_group = QGroupBox("封面操作")
        operation_layout = QHBoxLayout()
        
        refresh_button = QPushButton("刷新封面列表")
        refresh_button.clicked.connect(self.load_cover_list)
        
        download_button = QPushButton("下载所选封面")
        download_button.clicked.connect(self.download_selected_cover)
        
        batch_download_button = QPushButton("批量下载封面")
        batch_download_button.clicked.connect(self.batch_download_covers)
        
        operation_layout.addWidget(refresh_button)
        operation_layout.addWidget(download_button)
        operation_layout.addWidget(batch_download_button)
        operation_group.setLayout(operation_layout)
        layout.addWidget(operation_group)
        
        # 搜索区
        search_group = QGroupBox("封面搜索")
        search_layout = QHBoxLayout()
        
        search_label = QLabel("搜索:")
        self.search_input = QLineEdit()
        self.search_input.setPlaceholderText("请输入BV号或标题")
        
        search_button = QPushButton("搜索")
        search_button.clicked.connect(self.search_covers)
        
        search_layout.addWidget(search_label)
        search_layout.addWidget(self.search_input, 1)
        search_layout.addWidget(search_button)
        search_group.setLayout(search_layout)
        layout.addWidget(search_group)
        
        # 封面列表和预览
        main_content_layout = QHBoxLayout()
        
        # 封面列表
        list_group = QGroupBox("封面列表")
        list_layout = QVBoxLayout()
        
        self.cover_list = QListWidget()
        self.cover_list.setMinimumWidth(200)
        self.cover_list.itemClicked.connect(self.on_cover_item_clicked)
        
        list_layout.addWidget(self.cover_list)
        list_group.setLayout(list_layout)
        main_content_layout.addWidget(list_group)
        
        # 封面预览
        preview_group = QGroupBox("封面预览")
        preview_layout = QVBoxLayout()
        
        # 封面图片
        self.cover_label = QLabel("请选择一个封面")
        self.cover_label.setAlignment(Qt.AlignCenter)
        self.cover_label.setMinimumSize(300, 200)
        self.cover_label.setStyleSheet("border: 1px solid #CCCCCC;")
        
        # 封面信息
        self.cover_info = QTextEdit()
        self.cover_info.setReadOnly(True)
        self.cover_info.setMinimumHeight(150)
        
        preview_layout.addWidget(self.cover_label)
        preview_layout.addWidget(self.cover_info)
        preview_group.setLayout(preview_layout)
        main_content_layout.addWidget(preview_group)
        
        layout.addLayout(main_content_layout)
        
        self.setLayout(layout)
        
        # 加载封面列表
        self.load_cover_list()
    
    def update_data_type(self, data_type):
        """
        更新数据类型
        
        Args:
            data_type: 新的数据类型
        """
        self.data_type = data_type
        self.data_paths = get_data_paths(data_type)
        self.load_cover_list()
    
    def load_cover_list(self):
        """
        加载封面列表
        """
        # 清空列表
        self.cover_list.clear()
        self.cover_files = []
        self.cover_label.setText("请选择一个封面")
        self.cover_info.clear()
        
        # 获取封面目录
        covers_dir = self.data_paths['covers']
        
        if not os.path.exists(covers_dir):
            QMessageBox.information(self, "信息", "封面目录不存在")
            return
        
        # 遍历封面文件
        for filename in os.listdir(covers_dir):
            if filename.endswith('.jpg') or filename.endswith('.png'):
                # 提取BV号
                bv_id = filename.split('.')[0]
                
                # 尝试获取视频标题
                title = "未知标题"
                bv_file_path = os.path.join(self.data_paths['bv_files'], f"{bv_id}.json")
                
                if os.path.exists(bv_file_path):
                    try:
                        with open(bv_file_path, 'r', encoding='utf-8') as f:
                            data = json.load(f)
                            title = data.get('title', '未知标题')
                    except Exception as e:
                        pass
                
                # 添加到列表
                item = QListWidgetItem(f"{bv_id} - {title}")
                item.setData(Qt.UserRole, {
                    'bv_id': bv_id,
                    'filename': filename,
                    'title': title
                })
                self.cover_list.addItem(item)
                self.cover_files.append({
                    'bv_id': bv_id,
                    'filename': filename,
                    'title': title,
                    'path': os.path.join(covers_dir, filename)
                })
    
    def on_cover_item_clicked(self, item):
        """
        封面列表项点击事件
        
        Args:
            item: 点击的列表项
        """
        data = item.data(Qt.UserRole)
        bv_id = data.get('bv_id')
        filename = data.get('filename')
        title = data.get('title')
        
        # 显示封面图片
        cover_path = os.path.join(self.data_paths['covers'], filename)
        
        if os.path.exists(cover_path):
            pixmap = QPixmap(cover_path)
            # 调整图片大小以适应标签
            scaled_pixmap = pixmap.scaled(
                self.cover_label.size(), 
                Qt.KeepAspectRatio, 
                Qt.SmoothTransformation
            )
            self.cover_label.setPixmap(scaled_pixmap)
        else:
            self.cover_label.setText("封面图片不存在")
        
        # 显示封面信息
        info_text = f"BV号: {bv_id}\n"
        info_text += f"标题: {title}\n"
        info_text += f"文件名: {filename}\n"
        info_text += f"路径: {cover_path}\n"
        
        # 尝试获取更多视频信息
        bv_file_path = os.path.join(self.data_paths['bv_files'], f"{bv_id}.json")
        if os.path.exists(bv_file_path):
            try:
                with open(bv_file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    info_text += f"UP主: {data.get('up', '未知')}\n"
                    info_text += f"发布时间: {data.get('pubdate', '未知')}\n"
            except Exception as e:
                pass
        
        self.cover_info.setText(info_text)
    
    def search_covers(self):
        """
        搜索封面
        """
        search_text = self.search_input.text().strip().lower()
        
        if not search_text:
            QMessageBox.warning(self, "警告", "请输入搜索内容")
            return
        
        # 过滤封面
        filtered_covers = []
        for cover in self.cover_files:
            if (
                search_text in cover['bv_id'].lower() or
                search_text in cover['title'].lower()
            ):
                filtered_covers.append(cover)
        
        # 更新列表
        self.cover_list.clear()
        
        for cover in filtered_covers:
            item = QListWidgetItem(f"{cover['bv_id']} - {cover['title']}")
            item.setData(Qt.UserRole, {
                'bv_id': cover['bv_id'],
                'filename': cover['filename'],
                'title': cover['title']
            })
            self.cover_list.addItem(item)
    
    def download_selected_cover(self):
        """
        下载所选封面
        """
        selected_items = self.cover_list.selectedItems()
        if not selected_items:
            QMessageBox.warning(self, "警告", "请选择一个封面")
            return
        
        item = selected_items[0]
        data = item.data(Qt.UserRole)
        bv_id = data.get('bv_id')
        
        # 选择保存路径
        save_path, _ = QFileDialog.getSaveFileName(
            self, "保存封面", f"{bv_id}.jpg", "图片文件 (*.jpg *.png);;所有文件 (*.*)"
        )
        
        if not save_path:
            return
        
        # 复制文件
        cover_path = os.path.join(self.data_paths['covers'], f"{bv_id}.jpg")
        
        if not os.path.exists(cover_path):
            # 尝试png格式
            cover_path = os.path.join(self.data_paths['covers'], f"{bv_id}.png")
            if not os.path.exists(cover_path):
                QMessageBox.warning(self, "警告", "封面文件不存在")
                return
        
        try:
            import shutil
            shutil.copy2(cover_path, save_path)
            QMessageBox.information(self, "成功", f"封面保存成功: {save_path}")
        except Exception as e:
            QMessageBox.critical(self, "错误", f"保存失败: {str(e)}")
    
    def batch_download_covers(self):
        """
        批量下载封面
        """
        if not self.cover_files:
            QMessageBox.warning(self, "警告", "没有封面可下载")
            return
        
        # 选择保存目录
        save_dir = QFileDialog.getExistingDirectory(
            self, "选择保存目录", ""
        )
        
        if not save_dir:
            return
        
        # 开始批量下载
        self.status_text = QTextEdit()
        self.status_text.setReadOnly(True)
        self.status_text.setMinimumHeight(200)
        
        # 创建进度对话框
        from PyQt5.QtWidgets import QDialog, QProgressBar, QVBoxLayout, QLabel
        
        dialog = QDialog(self)
        dialog.setWindowTitle("批量下载封面")
        dialog.setMinimumWidth(500)
        
        dialog_layout = QVBoxLayout()
        
        progress_label = QLabel("开始下载...")
        progress_bar = QProgressBar()
        progress_bar.setRange(0, len(self.cover_files))
        
        status_text = QTextEdit()
        status_text.setReadOnly(True)
        status_text.setMinimumHeight(150)
        
        dialog_layout.addWidget(progress_label)
        dialog_layout.addWidget(progress_bar)
        dialog_layout.addWidget(status_text)
        
        dialog.setLayout(dialog_layout)
        
        # 启动线程执行下载
        def download_thread():
            success_count = 0
            failure_count = 0
            
            for i, cover in enumerate(self.cover_files):
                # 更新进度
                progress = i + 1
                progress_bar.setValue(progress)
                progress_label.setText(f"下载中 ({progress}/{len(self.cover_files)})")
                
                cover_path = cover['path']
                save_path = os.path.join(save_dir, cover['filename'])
                
                try:
                    import shutil
                    shutil.copy2(cover_path, save_path)
                    status_text.append(f"[{progress}/{len(self.cover_files)}] 成功: {cover['filename']}")
                    success_count += 1
                except Exception as e:
                    status_text.append(f"[{progress}/{len(self.cover_files)}] 失败: {cover['filename']} - {str(e)}")
                    failure_count += 1
            
            # 下载完成
            status_text.append(f"\n批量下载完成")
            status_text.append(f"成功: {success_count} 个")
            status_text.append(f"失败: {failure_count} 个")
            
            # 启用关闭按钮
            dialog.setWindowTitle("批量下载封面 - 完成")
        
        # 启动线程
        thread = threading.Thread(target=download_thread)
        thread.daemon = True
        thread.start()
        
        # 显示对话框
        dialog.exec_()
