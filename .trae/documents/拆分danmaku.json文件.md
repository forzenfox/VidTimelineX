## 任务目标
将 `d:\File\workSpace\AI-test\VidTimelineX\frontend\src\features\yuxiaoc\data\danmaku.json` 中的用户信息单独拆分出来，存放到 `users.json` 文件中。

## 当前数据结构分析
`danmaku.json` 包含以下字段：
- `users`: 用户列表（需要拆分出来）
- `bloodDanmaku`: 血怒主题弹幕
- `mixDanmaku`: 混躺主题弹幕
- `commonDanmaku`: 公共弹幕

## 需要修改的文件

### 1. 新建文件
- `d:\File\workSpace\AI-test\VidTimelineX\frontend\src\features\yuxiaoc\data\users.json` - 存放 users 数据

### 2. 修改文件
- `d:\File\workSpace\AI-test\VidTimelineX\frontend\src\features\yuxiaoc\data\danmaku.json` - 移除 users 字段
- `d:\File\workSpace\AI-test\VidTimelineX\frontend\src\features\yuxiaoc\components\DanmakuTower.tsx` - 添加 users.json 导入
- `d:\File\workSpace\AI-test\VidTimelineX\frontend\tests\unit\components\features\yuxiaoc\DanmakuTower.test.tsx` - 更新 mock 数据，添加 users.json mock

### 3. 不需要修改的文件
- `HorizontalDanmaku.tsx` - 不使用 users 数据
- `HorizontalDanmaku.test.tsx` - 不使用 users 数据

## 具体变更内容

### users.json 内容
```json
{
  "users": [
    { "id": "1", "name": "鱼吧小将", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=1" },
    { "id": "2", "name": "C皇铁粉", "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=2" },
    ...
  ]
}
```

### danmaku.json 修改后内容
```json
{
  "bloodDanmaku": [...],
  "mixDanmaku": [...],
  "commonDanmaku": [...]
}
```

### DanmakuTower.tsx 修改
- 添加: `import usersData from "../data/users.json";`
- 修改: `const users = useMemo(() => usersData.users, []);`

请确认这个方案后，我将开始执行具体的文件修改。