# 部署指南

## 系统要求

- **操作系统**: Windows 10/11
- **Python版本**: Python 3.7 或更高版本
- **内存**: 至少 2GB
- **存储空间**: 至少 100MB

## 安装步骤

### 1. 克隆项目

```bash
git clone <项目地址>
cd VidTimelineX/backend
```

### 2. 安装依赖

使用部署脚本安装依赖：

```bash
python deploy.py
```

然后选择 "1. 安装依赖" 选项。

或者手动安装依赖：

```bash
pip install PyQt5 requests beautifulsoup4
```

### 3. 启动系统

#### 启动GUI界面

使用部署脚本启动GUI界面：

```bash
python deploy.py
```

然后选择 "2. 启动GUI界面" 选项。

或者直接运行：

```bash
python run_gui.py
```

#### 启动命令行界面

使用部署脚本启动命令行界面：

```bash
python deploy.py
```

然后选择 "3. 启动命令行界面" 选项。

或者直接运行：

```bash
python main.py
```

## 使用说明

### GUI界面使用

1. **数据类型切换**：在状态栏中点击 "驴酱" 或 "甜筒" 标签切换数据类型

2. **爬虫功能**：
   - 输入BV号爬取单个视频
   - 选择BV号文件批量爬取视频

3. **数据管理**：
   - 查看视频数据列表
   - 搜索视频数据
   - 导入/导出视频数据

4. **封面管理**：
   - 查看视频封面
   - 下载所选封面
   - 批量下载封面

5. **时间线管理**：
   - 生成时间线
   - 查看时间线内容
   - 导出时间线

6. **设置管理**：
   - 修改爬虫配置
   - 修改存储配置

### 命令行界面使用

```bash
python main.py --data-type <数据类型> --mode <爬取模式> [其他参数]
```

#### 参数说明

- `--data-type`: 数据类型，可选值：`lvjiang`（驴酱）或 `tiantong`（甜筒）
- `--mode`: 爬取模式，可选值：`file`（从文件读取BV号）或 `keyword`（关键词搜索）
- `--bv-file`: BV号文件路径
- `--keywords`: 搜索关键词列表
- `--max-pages`: 关键词搜索的最大页码
- `--no-download-covers`: 不下载视频封面图片

#### 示例

从文件爬取驴酱数据：

```bash
python main.py --data-type lvjiang --mode file --bv-file data/sources/lvjiang-bv.txt
```

关键词搜索爬取甜筒数据：

```bash
python main.py --data-type tiantong --mode keyword --keywords 原神 崩坏星穹铁道
```

## 数据结构

### 数据目录结构

```
backend/
├── data/
│   ├── lvjiang/          # 驴酱数据
│   │   ├── approved.json  # 已通过的视频
│   │   ├── pending.json   # 待审核的视频
│   │   ├── rejected.json  # 已拒绝的视频
│   │   ├── videos.json    # 时间线数据
│   │   └── thumbs/        # 封面图片
│   ├── tiantong/          # 甜筒数据
│   │   └── ...            # 同驴酱
│   └── sources/           # 数据源
│       ├── lvjiang-bv.txt # 驴酱BV号列表
│       └── tiantong-bv.txt # 甜筒BV号列表
```

### 数据文件格式

#### approved.json / pending.json / rejected.json

```json
{
  "videos": [
    {
      "bv": "12345678",
      "url": "https://www.bilibili.com/video/BV12345678",
      "title": "视频标题",
      "description": "视频描述",
      "publish_date": "2023-01-01",
      "views": 1000,
      "danmaku": 100,
      "up主": "UP主名称",
      "cover_url": "封面URL",
      "thumbnail": "封面路径",
      "duration": "05:30",
      "crawled_at": "2023-01-01 12:00:00",
      "review_status": "approved",
      "review_note": ""
    }
  ]
}
```

#### videos.json（时间线数据）

```json
[
  {
    "id": "1",
    "title": "视频标题",
    "date": "2023-01-01",
    "videoUrl": "https://www.bilibili.com/video/BV12345678",
    "cover": "BV12345678.jpg",
    "cover_url": "封面URL",
    "tags": [],
    "duration": "05:30"
  }
]
```

## 常见问题

### 1. GUI界面无法启动

**解决方案**：
- 确保已安装PyQt5
- 确保Python版本为3.7或更高
- 检查系统是否支持GUI界面

### 2. 爬虫爬取失败

**解决方案**：
- 检查网络连接
- 检查BV号是否正确
- 检查B站是否可访问

### 3. 封面下载失败

**解决方案**：
- 检查网络连接
- 检查封面URL是否有效
- 检查存储空间是否充足

### 4. 数据类型切换失败

**解决方案**：
- 确保数据目录存在
- 检查权限是否足够

## 系统维护

### 数据备份

定期备份 `data` 目录，防止数据丢失。

### 日志管理

系统运行过程中的日志会显示在GUI界面的日志区域或命令行界面中。

### 性能优化

- 对于大量视频数据，建议分批爬取
- 定期清理不需要的视频数据
- 优化网络连接以提高爬取速度

## 联系方式

如有问题或建议，请联系系统管理员。
