#!/usr/bin/env python3
"""
前端文件更新脚本

用于将后端生成的视频数据和封面图片更新到前端项目中。

用法：
  python update_frontend.py [选项]

选项：
  --help, -h              显示帮助信息
  --data-type, -t         指定要更新的数据类型，可选值: lvjiang, tiantong
                          默认更新所有数据类型
  --backend-dir, -b       指定后端数据目录
  --frontend-dir, -f      指定前端项目目录

示例：
  # 更新所有数据类型
  python update_frontend.py
  
  # 只更新 lvjiang 数据
  python update_frontend.py --data-type lvjiang
  
  # 指定自定义目录
  python update_frontend.py --backend-dir ./data --frontend-dir ../frontend
"""

import argparse
from src.updater.frontend_updater import update_frontend_files


def parse_args():
    """解析命令行参数
    
    Returns:
        argparse.Namespace: 解析后的参数
    """
    parser = argparse.ArgumentParser(description='前端文件更新脚本')
    
    parser.add_argument(
        '--data-type', '-t',
        type=str,
        choices=['lvjiang', 'tiantong'],
        action='append',
        help='指定要更新的数据类型'
    )
    
    parser.add_argument(
        '--backend-dir', '-b',
        type=str,
        default='./data',
        help='指定后端数据目录'
    )
    
    return parser.parse_args()


def main():
    """主函数"""
    # 解析命令行参数
    args = parse_args()
    
    # 确定要更新的数据类型
    data_types = args.data_type
    if not data_types:
        data_types = ['lvjiang', 'tiantong']
    
    # 构造配置
    config = {
        'backend_data_dir': args.backend_dir
    }
    
    # 执行更新
    for data_type in data_types:
        print(f"\n=== 更新 {data_type} 前端文件 ===")
        result = update_frontend_files(data_type, config)
        
        print(f"结果: {'成功' if result['success'] else '失败'}")
        print(f"消息: {result.get('message', '')}")
        
        if 'merge_result' in result:
            merge_msg = result['merge_result'].get('message', '')
            print(f"合并结果: {merge_msg}")
        
        if 'copy_result' in result:
            copy_msg = result['copy_result'].get('message', '')
            print(f"复制结果: {copy_msg}")
        
        if not result['success']:
            all_success = False
    
    print("\n=== 更新完成 ===")
    if all_success:
        print("所有数据类型更新成功！")
    else:
        print("部分数据类型更新失败，请检查错误信息。")


if __name__ == "__main__":
    main()
