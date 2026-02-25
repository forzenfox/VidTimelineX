## 任务目标
参照 `tiantong/data/users.json` 的格式，优化 `yuxiaoc/data/users.json` 的结构。

## 当前结构 vs 目标结构

### 当前结构（yuxiaoc/users.json）
```json
{
  "users": [
    { "id": "1", "name": "...", "avatar": "..." },
    ...
  ]
}
```

### 目标结构（参照 tiantong/users.json）
```json
[
  { "id": "1", "name": "...", "avatar": "..." },
  ...
]
```

## 需要修改的文件

### 1. 修改 users.json
- 去掉外层的 `"users"` 键，直接返回数组

### 2. 修改 DanmakuTower.tsx
- 修改导入方式：`import users from "../data/users.json"`（原来是 `usersData.users`）
- 修改使用方式：`const users = useMemo(() => users, [])`（原来是 `usersData.users`）

### 3. 修改 DanmakuTower.test.tsx
- 更新 mock 数据格式，去掉 `"users"` 键

请确认这个方案后，我将开始执行修改。