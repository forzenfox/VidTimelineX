# 数据隔离方案设计

## 1. 方案目标

- **完全隔离**：确保甜筒相关数据与驴酱相关数据完全分离
- **可扩展性**：支持未来可能的其他数据类型扩展
- **兼容性**：保持与现有系统功能的兼容性
- **易于管理**：简化数据管理和维护

## 2. 隔离层次

### 2.1 存储层隔离

#### 2.1.1 目录结构设计

```
data/
├── common/              # 公共数据
│   └── bv-lists/        # BV号文件目录
│       ├── lvjiang-bv.txt    # 驴酱BV号文件
│       └── tiantong-bv.txt   # 甜筒BV号文件
├── lvjiang/             # 驴酱数据
│   ├── pending.json     # 待审核视频
│   ├── approved.json    # 已通过视频
│   ├── rejected.json    # 已拒绝视频
│   ├── videos.json      # 时间线数据
│   └── thumbs/          # 封面图片
├── tiantong/            # 甜筒数据
│   ├── pending.json     # 待审核视频
│   ├── approved.json    # 已通过视频
│   ├── rejected.json    # 已拒绝视频
│   ├── videos.json      # 时间线数据
│   └── thumbs/          # 封面图片
└── [其他类型]/           # 未来扩展
```

#### 2.1.2 数据文件隔离

- **每种数据类型**拥有独立的：
  - 待审核文件（pending.json）
  - 已通过文件（approved.json）
  - 已拒绝文件（rejected.json）
  - 时间线数据文件（videos.json）
  - 封面图片目录（thumbs/）

### 2.2 配置层隔离

- **配置文件结构**：
  - 主配置文件：通用配置
  - 数据类型配置：每种数据类型的特定配置

- **配置项**：
  - 数据存储路径
  - 爬取参数
  - 其他类型特定配置

### 2.3 代码层隔离

- **数据类型枚举**：定义数据类型常量
- **路径管理**：根据数据类型动态生成路径
- **存储逻辑**：基于数据类型的存储和读取
- **业务逻辑**：数据类型相关的业务逻辑隔离

## 3. 实现方案

### 3.1 配置管理

#### 3.1.1 配置文件结构

```python
# src/utils/config.py

# 数据类型定义
DATA_TYPES = {
    'LVJIANG': 'lvjiang',    # 驴酱
    'TIANTONG': 'tiantong'   # 甜筒
}

# 主配置
class Config:
    # 通用配置
    PROJECT_ROOT = Path(__file__).parent.parent.parent
    DATA_DIR = PROJECT_ROOT / "data"
    
    # 公共数据目录
    COMMON_DIR = DATA_DIR / "common"
    BV_LISTS_DIR = COMMON_DIR / "bv-lists"
    
    # 请求配置
    REQUEST_TIMEOUT = 15
    MAX_RETRIES = 3
    INITIAL_RETRY_DELAY = 2
    REQUEST_INTERVAL = 2
    
    # 浏览器配置
    HEADERS = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Referer': 'https://www.bilibili.com/',
        'Connection': 'keep-alive'
    }

# 数据类型配置
def get_data_type_config(data_type):
    """获取数据类型配置"""
    data_type_dir = Config.DATA_DIR / data_type
    return {
        'DATA_TYPE_DIR': data_type_dir,
        'PENDING_FILE': data_type_dir / "pending.json",
        'APPROVED_FILE': data_type_dir / "approved.json",
        'REJECTED_FILE': data_type_dir / "rejected.json",
        'TIMELINE_FILE': data_type_dir / "videos.json",
        'THUMBS_DIR': data_type_dir / "thumbs"
    }
```

### 3.2 路径管理

```python
# src/utils/path_manager.py

from pathlib import Path
from src.utils.config import Config, DATA_TYPES

def get_bv_file_path(data_type):
    """获取BV号文件路径"""
    file_names = {
        'lvjiang': 'lvjiang-bv.txt',
        'tiantong': 'tiantong-bv.txt'
    }
    return Config.BV_LISTS_DIR / file_names.get(data_type, f'{data_type}-bv.txt')

def get_data_paths(data_type):
    """获取数据存储路径"""
    config = get_data_type_config(data_type)
    return config

def ensure_directories(data_type):
    """确保目录存在"""
    config = get_data_type_config(data_type)
    for path in config.values():
        if isinstance(path, Path) and path.suffix == '':
            path.mkdir(parents=True, exist_ok=True)
```

### 3.3 数据存储逻辑

#### 3.3.1 爬虫模块修改

```python
# src/crawler/auto_crawler.py

class BiliBiliAutoCrawler:
    def __init__(self, data_type='lvjiang'):
        self.data_type = data_type
        self.config = get_data_type_config(data_type)
        self.headers = HEADERS
        self.session = requests.Session()
        self.session.headers.update(self.headers)
        
        # 确保目录存在
        ensure_directories(data_type)
        
        # 初始化存储文件
        self._init_storage_files()
    
    def _init_storage_files(self):
        """初始化存储文件"""
        for file_path in [self.config['PENDING_FILE'], 
                         self.config['APPROVED_FILE'], 
                         self.config['REJECTED_FILE']]:
            if not file_path.exists():
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump({"videos": []}, f, ensure_ascii=False, indent=2)
    
    # 其他方法修改为使用self.config中的路径
```

#### 3.3.2 封面下载模块修改

```python
# src/downloader/download_thumbs.py

def download_all_covers(videos_path, thumbs_dir, quiet=False):
    # 现有逻辑保持不变
    pass

# 在调用时传入正确的thumbs_dir
```

### 3.4 命令行界面修改

```python
# main.py

def main():
    parser = argparse.ArgumentParser(description='B站视频爬虫工具')
    parser.add_argument('--data-type', type=str, default='lvjiang', 
                        choices=['lvjiang', 'tiantong'],
                        help='数据类型：lvjiang（驴酱）或tiantong（甜筒）')
    # 其他参数保持不变
    
    args = parser.parse_args()
    
    # 创建对应数据类型的爬虫实例
    crawler = BiliBiliAutoCrawler(data_type=args.data_type)
    
    # 其他逻辑保持不变
```

## 4. 数据迁移方案

### 4.1 现有数据迁移

1. **备份现有数据**：
   - 备份原始data目录

2. **迁移数据**：
   - 驴酱数据：迁移到data/lvjiang/目录
   - 甜筒数据：迁移到data/tiantong/目录

3. **验证迁移**：
   - 确保数据完整性
   - 测试系统功能

### 4.2 迁移脚本

```python
# scripts/migrate_data.py

import os
import shutil
from pathlib import Path

# 迁移逻辑
```

## 5. 扩展性考虑

### 5.1 未来数据类型扩展

- **配置扩展**：在DATA_TYPES中添加新的数据类型
- **目录结构**：自动创建新数据类型的目录结构
- **代码兼容性**：保持代码对新数据类型的兼容性

### 5.2 配置文件扩展

- **支持配置文件**：未来可考虑使用YAML或JSON配置文件
- **环境变量支持**：支持通过环境变量覆盖配置

## 6. 安全性考虑

### 6.1 数据访问控制

- **路径验证**：确保数据路径安全，防止路径遍历攻击
- **权限管理**：确保文件权限正确设置

### 6.2 数据一致性

- **事务性操作**：确保数据操作的一致性
- **错误处理**：完善的错误处理机制

## 7. 实施计划

### 7.1 阶段1：配置和路径管理

- 实现配置管理模块
- 实现路径管理模块
- 创建目录结构

### 7.2 阶段2：代码修改

- 修改爬虫模块
- 修改封面下载模块
- 修改命令行界面

### 7.3 阶段3：数据迁移

- 备份现有数据
- 执行数据迁移
- 验证迁移结果

### 7.4 阶段4：测试验证

- 功能测试
- 数据隔离测试
- 性能测试

## 8. 验收标准

1. **数据隔离验证**：
   - 甜筒和驴酱数据存储在独立目录
   - 不同数据类型的操作不相互影响

2. **功能验证**：
   - 现有功能正常运行
   - 新的数据类型支持正常

3. **扩展性验证**：
   - 能够轻松添加新的数据类型
   - 配置管理灵活可控

4. **性能验证**：
   - 系统性能不劣于现有系统
   - 数据操作响应时间合理

## 9. 风险评估

### 9.1 潜在风险

1. **数据丢失**：迁移过程中可能出现数据丢失
2. **功能回归**：修改可能导致现有功能失效
3. **性能下降**：新增的路径管理可能影响性能

### 9.2 风险缓解措施

1. **数据备份**：在迁移前完全备份现有数据
2. **测试覆盖**：确保充分的测试覆盖
3. **性能优化**：优化路径管理和数据访问逻辑
