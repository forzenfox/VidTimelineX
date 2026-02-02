# 后端数据目录说明

本目录用于存储爬虫系统的各类数据文件。

## 目录结构

```
data/
├── raw/           # 原始爬取数据（JSON格式）
│   ├── pending.json      # 待审核视频列表
│   ├── approved.json     # 已通过审核的视频列表
│   └── rejected.json     # 已拒绝的视频列表
├── processed/     # 处理后的数据（供前端使用）
│   └── videos.json       # 时间线数据，直接供前端加载
├── sources/       # BV号来源文件（爬取任务输入）
│   ├── lvjiang-bv.txt    # 驴酱UP主的BV号列表
│   └── tiantong-bv.txt   # 甜筒UP主的BV号列表
└── README.md      # 本说明文件
```

## 文件格式

### BV号文件格式 (sources/*.txt)

```
# 这是注释行，以#开头的行会被忽略
# 每行可以包含一个BV号，支持带或不带BV前缀
BV1gk4y1r77A
BV1Q7411E7X4
1jJ411g7pZ  # 不带BV前缀也可以
```

### 视频元数据格式 (raw/*.json)

```json
{
  "bv": "1gk4y1r77A",
  "url": "https://www.bilibili.com/video/BV1gk4y1r77A",
  "title": "视频标题",
  "description": "视频描述",
  "publish_date": "2024-01-01",
  "views": 10000,
  "danmaku": 500,
  "up主": "UP主名称",
  "thumbnail": "https://i0.hdslb.com/bfs/archive/1gk4y1r77A.jpg",
  "duration": "05:30",
  "crawled_at": "2024-01-01 12:00:00",
  "review_status": "pending",
  "review_note": ""
}
```

### 前端时间线格式 (processed/videos.json)

```json
[
  {
    "id": "1",
    "title": "视频标题",
    "date": "2024-01-01",
    "videoUrl": "https://www.bilibili.com/video/BV1gk4y1r77A",
    "cover": "BV1gk4y1r77A.jpg",
    "cover_url": "https://i0.hdslb.com/bfs/archive/1gk4y1r77A.jpg",
    "tags": [],
    "duration": "05:30"
  }
]
```

## 使用说明

### 爬取指定UP主的视频

```bash
# 爬取驴酱的视频
python main.py --mode file --bv-file ./data/sources/lvjiang-bv.txt

# 爬取甜筒的视频
python main.py --mode file --bv-file ./data/sources/tiantong-bv.txt
```

### 关键词搜索爬取

```bash
python main.py --mode keyword --keywords 原神 崩坏星穹铁道 --max-pages 2
```

## 数据流程

```
BV号文件 → 爬虫解析 → 视频元数据 → 待审核列表 → 审核通过 → 已通过列表 → 时间线生成 → 前端展示
```

## 注意事项

- 请定期更新 `sources/` 目录下的 BV 号文件，添加新的视频
- `processed/videos.json` 是自动生成的，不要手动编辑
- 审核操作会修改 `raw/` 目录下的 JSON 文件
