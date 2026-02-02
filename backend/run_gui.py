#!/usr/bin/env python3
"""
启动GUI界面的脚本
"""

import sys
import os

# 添加项目根目录到Python路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from PyQt5.QtWidgets import QApplication
    from src.gui.main_window import MainWindow
    from src.utils.path_manager import ensure_directories
    
    def main():
        """主函数"""
        # 确保数据目录存在
        ensure_directories('lvjiang')
        ensure_directories('tiantong')
        
        # 创建应用实例
        app = QApplication(sys.argv)
        
        # 创建主窗口
        window = MainWindow()
        window.show()
        
        # 运行应用
        sys.exit(app.exec_())
    
    if __name__ == "__main__":
        main()
        
except ImportError as e:
    print(f"导入错误: {e}")
    print("请确保已安装所需的依赖包:")
    print("pip install PyQt5")
    sys.exit(1)

except Exception as e:
    print(f"启动错误: {e}")
    sys.exit(1)
