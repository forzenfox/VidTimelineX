#!/usr/bin/env python3
"""
部署脚本
用于安装依赖和启动系统
"""

import os
import sys
import subprocess


def install_dependencies():
    """安装依赖包"""
    print("=== 安装依赖包 ===")
    
    # 安装PyQt5
    print("安装PyQt5...")
    subprocess.run([sys.executable, "-m", "pip", "install", "PyQt5"])
    
    # 安装其他依赖
    print("安装其他依赖...")
    subprocess.run([sys.executable, "-m", "pip", "install", "requests", "beautifulsoup4"])
    
    print("依赖安装完成")


def start_gui():
    """启动GUI界面"""
    print("=== 启动GUI界面 ===")
    
    # 运行GUI启动脚本
    subprocess.run([sys.executable, "run_gui.py"])


def start_cli():
    """启动命令行界面"""
    print("=== 启动命令行界面 ===")
    
    # 运行命令行脚本
    subprocess.run([sys.executable, "main.py", "--help"])


def main():
    """主函数"""
    print("=== VidTimelineX 部署脚本 ===")
    print("1. 安装依赖")
    print("2. 启动GUI界面")
    print("3. 启动命令行界面")
    print("4. 退出")
    
    choice = input("请选择操作: ")
    
    if choice == "1":
        install_dependencies()
    elif choice == "2":
        start_gui()
    elif choice == "3":
        start_cli()
    elif choice == "4":
        print("退出")
    else:
        print("无效选择")


if __name__ == "__main__":
    main()
