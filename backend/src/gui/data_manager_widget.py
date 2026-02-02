import sys
import os
import json
from PyQt5.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, QLineEdit, QPushButton,
    QTextEdit, QTableWidget, QTableWidgetItem, QMessageBox, QGroupBox,
    QHeaderView, QFileDialog, QComboBox
)
from PyQt5.QtCore import Qt
from src.utils.path_manager import get_data_paths


class DataManagerWidget(QWidget):
    """
    数据管理GUI模块
    实现视频数据的查看、编辑、删除等功能的界面
    """
    
    def __init__(self, data_type):
        """
        初始化数据管理界面
        
        Args:
            data_type: 数据类型，用于区分甜筒和驴酱数据
        """
        super().__init__()
        self.data_type = data_type
        self.data_paths = get_data_paths(data_type)
        self.bv_data = []
        self.init_ui()
    
    def init_ui(self):
        """
        初始化用户界面
        """
        layout = QVBoxLayout()
        
        # 设置标题
        title_label = QLabel("视频数据管理")
        title_label.setStyleSheet("font-size: 16px; font-weight: bold;")
        layout.addWidget(title_label)
        
        # 数据操作区
        operation_group = QGroupBox("数据操作")
        operation_layout = QHBoxLayout()
        
        refresh_button = QPushButton("刷新数据")
        refresh_button.clicked.connect(self.load_data)
        
        export_button = QPushButton("导出数据")
        export_button.clicked.connect(self.export_data)
        
        import_button = QPushButton("导入数据")
        import_button.clicked.connect(self.import_data)
        
        operation_layout.addWidget(refresh_button)
        operation_layout.addWidget(export_button)
        operation_layout.addWidget(import_button)
        operation_group.setLayout(operation_layout)
        layout.addWidget(operation_group)
        
        # 搜索区
        search_group = QGroupBox("数据搜索")
        search_layout = QHBoxLayout()
        
        search_label = QLabel("搜索:")
        self.search_input = QLineEdit()
        self.search_input.setPlaceholderText("请输入BV号或标题")
        
        search_button = QPushButton("搜索")
        search_button.clicked.connect(self.search_data)
        
        search_layout.addWidget(search_label)
        search_layout.addWidget(self.search_input, 1)
        search_layout.addWidget(search_button)
        search_group.setLayout(search_layout)
        layout.addWidget(search_group)
        
        # 数据表格
        table_group = QGroupBox("视频数据列表")
        table_layout = QVBoxLayout()
        
        self.data_table = QTableWidget()
        self.data_table.setColumnCount(5)
        self.data_table.setHorizontalHeaderLabels(["BV号", "标题", "UP主", "发布时间", "操作"])
        self.data_table.horizontalHeader().setSectionResizeMode(QHeaderView.Stretch)
        
        table_layout.addWidget(self.data_table)
        table_group.setLayout(table_layout)
        layout.addWidget(table_group)
        
        # 数据详情
        detail_group = QGroupBox("视频详情")
        detail_layout = QVBoxLayout()
        
        self.detail_text = QTextEdit()
        self.detail_text.setReadOnly(True)
        self.detail_text.setMinimumHeight(200)
        
        detail_layout.addWidget(self.detail_text)
        detail_group.setLayout(detail_layout)
        layout.addWidget(detail_group)
        
        self.setLayout(layout)
        
        # 加载数据
        self.load_data()
    
    def update_data_type(self, data_type):
        """
        更新数据类型
        
        Args:
            data_type: 新的数据类型
        """
        self.data_type = data_type
        self.data_paths = get_data_paths(data_type)
        self.load_data()
    
    def load_data(self):
        """
        加载视频数据
        """
        # 清空数据
        self.bv_data = []
        self.data_table.setRowCount(0)
        self.detail_text.clear()
        
        # 获取BV号文件路径
        bv_files_dir = self.data_paths['bv_files']
        
        if not os.path.exists(bv_files_dir):
            QMessageBox.information(self, "信息", "数据目录不存在")
            return
        
        # 遍历BV号文件
        for filename in os.listdir(bv_files_dir):
            if filename.endswith('.json'):
                bv_id = filename.replace('.json', '')
                file_path = os.path.join(bv_files_dir, filename)
                
                try:
                    # 读取视频数据
                    with open(file_path, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                    
                    # 添加到数据列表
                    self.bv_data.append({
                        'bv_id': bv_id,
                        'title': data.get('title', '未知标题'),
                        'up': data.get('up', '未知UP主'),
                        'pubdate': data.get('pubdate', '未知时间'),
                        'data': data
                    })
                    
                except Exception as e:
                    print(f"读取文件失败: {file_path}, 错误: {str(e)}")
        
        # 更新表格
        self._update_table()
    
    def _update_table(self):
        """
        更新数据表格
        """
        self.data_table.setRowCount(len(self.bv_data))
        
        for row, item in enumerate(self.bv_data):
            # BV号
            bv_item = QTableWidgetItem(item['bv_id'])
            bv_item.setFlags(Qt.ItemIsEnabled | Qt.ItemIsSelectable)
            self.data_table.setItem(row, 0, bv_item)
            
            # 标题
            title_item = QTableWidgetItem(item['title'])
            title_item.setFlags(Qt.ItemIsEnabled | Qt.ItemIsSelectable)
            self.data_table.setItem(row, 1, title_item)
            
            # UP主
            up_item = QTableWidgetItem(item['up'])
            up_item.setFlags(Qt.ItemIsEnabled | Qt.ItemIsSelectable)
            self.data_table.setItem(row, 2, up_item)
            
            # 发布时间
            pubdate_item = QTableWidgetItem(item['pubdate'])
            pubdate_item.setFlags(Qt.ItemIsEnabled | Qt.ItemIsSelectable)
            self.data_table.setItem(row, 3, pubdate_item)
            
            # 操作按钮
            button_layout = QHBoxLayout()
            
            view_button = QPushButton("查看")
            view_button.setFixedSize(60, 25)
            view_button.clicked.connect(lambda checked, r=row: self.view_data(r))
            
            edit_button = QPushButton("编辑")
            edit_button.setFixedSize(60, 25)
            edit_button.clicked.connect(lambda checked, r=row: self.edit_data(r))
            
            delete_button = QPushButton("删除")
            delete_button.setFixedSize(60, 25)
            delete_button.clicked.connect(lambda checked, r=row: self.delete_data(r))
            
            button_layout.addWidget(view_button)
            button_layout.addWidget(edit_button)
            button_layout.addWidget(delete_button)
            
            # 创建操作单元格
            button_widget = QWidget()
            button_widget.setLayout(button_layout)
            self.data_table.setCellWidget(row, 4, button_widget)
        
        # 连接表格点击事件
        self.data_table.cellClicked.connect(self.on_cell_clicked)
    
    def on_cell_clicked(self, row, column):
        """
        表格单元格点击事件
        
        Args:
            row: 行索引
            column: 列索引
        """
        if 0 <= row < len(self.bv_data):
            self.view_data(row)
    
    def view_data(self, row):
        """
        查看视频数据详情
        
        Args:
            row: 数据行索引
        """
        if 0 <= row < len(self.bv_data):
            data = self.bv_data[row]['data']
            # 格式化数据为JSON字符串
            formatted_data = json.dumps(data, ensure_ascii=False, indent=2)
            self.detail_text.setText(formatted_data)
    
    def edit_data(self, row):
        """
        编辑视频数据
        
        Args:
            row: 数据行索引
        """
        if 0 <= row < len(self.bv_data):
            bv_id = self.bv_data[row]['bv_id']
            data = self.bv_data[row]['data']
            
            # 这里可以实现更复杂的编辑界面
            # 简单实现：显示一个消息框，提示编辑功能
            QMessageBox.information(self, "编辑数据", f"编辑功能开发中，BV号: {bv_id}")
    
    def delete_data(self, row):
        """
        删除视频数据
        
        Args:
            row: 数据行索引
        """
        if 0 <= row < len(self.bv_data):
            bv_id = self.bv_data[row]['bv_id']
            title = self.bv_data[row]['title']
            
            # 确认删除
            reply = QMessageBox.question(
                self, "删除确认", 
                f"确定要删除视频 '{title}' (BV号: {bv_id}) 吗？",
                QMessageBox.Yes | QMessageBox.No, QMessageBox.No
            )
            
            if reply == QMessageBox.Yes:
                # 删除文件
                file_path = os.path.join(self.data_paths['bv_files'], f"{bv_id}.json")
                
                try:
                    if os.path.exists(file_path):
                        os.remove(file_path)
                    
                    # 从数据列表中移除
                    self.bv_data.pop(row)
                    # 更新表格
                    self._update_table()
                    # 清空详情
                    self.detail_text.clear()
                    
                    QMessageBox.information(self, "成功", "数据删除成功")
                    
                except Exception as e:
                    QMessageBox.critical(self, "错误", f"删除失败: {str(e)}")
    
    def search_data(self):
        """
        搜索视频数据
        """
        search_text = self.search_input.text().strip().lower()
        
        if not search_text:
            QMessageBox.warning(self, "警告", "请输入搜索内容")
            return
        
        # 过滤数据
        filtered_data = []
        for item in self.bv_data:
            if (
                search_text in item['bv_id'].lower() or
                search_text in item['title'].lower() or
                search_text in item['up'].lower()
            ):
                filtered_data.append(item)
        
        # 更新表格
        self.data_table.setRowCount(len(filtered_data))
        
        for row, item in enumerate(filtered_data):
            # BV号
            bv_item = QTableWidgetItem(item['bv_id'])
            bv_item.setFlags(Qt.ItemIsEnabled | Qt.ItemIsSelectable)
            self.data_table.setItem(row, 0, bv_item)
            
            # 标题
            title_item = QTableWidgetItem(item['title'])
            title_item.setFlags(Qt.ItemIsEnabled | Qt.ItemIsSelectable)
            self.data_table.setItem(row, 1, title_item)
            
            # UP主
            up_item = QTableWidgetItem(item['up'])
            up_item.setFlags(Qt.ItemIsEnabled | Qt.ItemIsSelectable)
            self.data_table.setItem(row, 2, up_item)
            
            # 发布时间
            pubdate_item = QTableWidgetItem(item['pubdate'])
            pubdate_item.setFlags(Qt.ItemIsEnabled | Qt.ItemIsSelectable)
            self.data_table.setItem(row, 3, pubdate_item)
            
            # 操作按钮
            button_layout = QHBoxLayout()
            
            view_button = QPushButton("查看")
            view_button.setFixedSize(60, 25)
            view_button.clicked.connect(lambda checked, r=row, d=filtered_data: self.view_data_by_index(r, d))
            
            edit_button = QPushButton("编辑")
            edit_button.setFixedSize(60, 25)
            edit_button.clicked.connect(lambda checked, r=row, d=filtered_data: self.edit_data_by_index(r, d))
            
            delete_button = QPushButton("删除")
            delete_button.setFixedSize(60, 25)
            delete_button.clicked.connect(lambda checked, r=row, d=filtered_data: self.delete_data_by_index(r, d))
            
            button_layout.addWidget(view_button)
            button_layout.addWidget(edit_button)
            button_layout.addWidget(delete_button)
            
            # 创建操作单元格
            button_widget = QWidget()
            button_widget.setLayout(button_layout)
            self.data_table.setCellWidget(row, 4, button_widget)
    
    def view_data_by_index(self, row, data_list):
        """
        通过索引查看数据
        
        Args:
            row: 索引
            data_list: 数据列表
        """
        if 0 <= row < len(data_list):
            data = data_list[row]['data']
            # 格式化数据为JSON字符串
            formatted_data = json.dumps(data, ensure_ascii=False, indent=2)
            self.detail_text.setText(formatted_data)
    
    def edit_data_by_index(self, row, data_list):
        """
        通过索引编辑数据
        
        Args:
            row: 索引
            data_list: 数据列表
        """
        if 0 <= row < len(data_list):
            bv_id = data_list[row]['bv_id']
            QMessageBox.information(self, "编辑数据", f"编辑功能开发中，BV号: {bv_id}")
    
    def delete_data_by_index(self, row, data_list):
        """
        通过索引删除数据
        
        Args:
            row: 索引
            data_list: 数据列表
        """
        if 0 <= row < len(data_list):
            bv_id = data_list[row]['bv_id']
            
            # 查找原始数据中的索引
            original_index = -1
            for i, item in enumerate(self.bv_data):
                if item['bv_id'] == bv_id:
                    original_index = i
                    break
            
            if original_index != -1:
                self.delete_data(original_index)
    
    def export_data(self):
        """
        导出视频数据
        """
        if not self.bv_data:
            QMessageBox.warning(self, "警告", "没有数据可导出")
            return
        
        # 选择导出文件路径
        file_path, _ = QFileDialog.getSaveFileName(
            self, "导出数据", "", "JSON文件 (*.json);;所有文件 (*.*)"
        )
        
        if not file_path:
            return
        
        try:
            # 准备导出数据
            export_data = []
            for item in self.bv_data:
                export_data.append(item['data'])
            
            # 写入文件
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(export_data, f, ensure_ascii=False, indent=2)
            
            QMessageBox.information(self, "成功", f"数据导出成功: {file_path}")
            
        except Exception as e:
            QMessageBox.critical(self, "错误", f"导出失败: {str(e)}")
    
    def import_data(self):
        """
        导入视频数据
        """
        # 选择导入文件路径
        file_path, _ = QFileDialog.getOpenFileName(
            self, "导入数据", "", "JSON文件 (*.json);;所有文件 (*.*)"
        )
        
        if not file_path:
            return
        
        try:
            # 读取导入数据
            with open(file_path, 'r', encoding='utf-8') as f:
                import_data = json.load(f)
            
            # 检查数据格式
            if not isinstance(import_data, list):
                QMessageBox.warning(self, "警告", "数据格式错误，应为数组")
                return
            
            # 导入数据
            imported_count = 0
            for data in import_data:
                bv_id = data.get('bv_id')
                if not bv_id:
                    continue
                
                # 保存数据
                save_path = os.path.join(self.data_paths['bv_files'], f"{bv_id}.json")
                with open(save_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                
                imported_count += 1
            
            # 重新加载数据
            self.load_data()
            
            QMessageBox.information(self, "成功", f"数据导入成功，共导入 {imported_count} 条数据")
            
        except Exception as e:
            QMessageBox.critical(self, "错误", f"导入失败: {str(e)}")
