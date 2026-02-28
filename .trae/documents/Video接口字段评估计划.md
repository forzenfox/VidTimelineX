# Video 接口字段评估计划

## 目标

评估 `Video` 接口中各个字段的用途，删除无用的字段。

## 当前接口定义

位置：[types.ts](file:///d:\workspace\VidTimelineX\frontend\src\components\video\types.ts#L7-L27)

## 字段使用情况分析

### 核心字段（必须保留）

| 字段名         | 使用次数 | 主要用途                 |
| ----------- | ---- | -------------------- |
| `id`        | 10+  | React key、无障碍标签、数据去重 |
| `title`     | 15+  | 视频标题显示、搜索过滤、alt属性    |
| `date`      | 3+   | 视频日期显示               |
| `videoUrl`  | 1    | 跳转B站观看链接             |
| `bv`        | 12+  | BV号显示、播放器URL生成、封面命名  |
| `cover`     | 10+  | 本地封面图路径              |
| `cover_url` | 2    | B站CDN封面图（性能优化）       |
| `tags`      | 4+   | 标签显示、搜索过滤            |
| `duration`  | 3+   | 视频时长显示               |
| `author`    | 6+   | UP主显示                |

### 建议删除的字段

| 字段名           | 原因                    |
| ------------- | --------------------- |
| `bvid`        | 与 `bv` 字段重复，仅测试中使用    |
| `category`    | 接口定义存在但实际数据从未使用       |
| `subCategory` | 接口定义存在但实际数据从未使用       |
| `createdAt`   | 接口定义存在但实际数据从未使用       |
| `views`       | 仅 tiantong 模块使用，非核心功能 |
| `icon`        | 仅 tiantong 模块使用，非核心功能 |
| `description` | 后端已获取但前端从未展示          |

## 执行计划

### 步骤 1：修改 Video 接口

删除以下 7 个无用字段：

* `bvid`

* `category`

* `subCategory`

* `createdAt`

* `views`

* `icon`

* `description`

### 步骤 2：检查并清理相关引用

搜索并删除任何引用这些字段的代码：

* `views` 在 tiantong 模块有使用

* `icon` 在 tiantong 模块有使用

* 其他字段无实际引用

### 步骤 3：运行测试验证

执行单元测试确保修改不影响现有功能

## 预期结果

* 删除 7 个无用字段

* 接口更加精简，减少维护负担

* 需要同步清理 tiantong 模块中对 `views` 和 `icon` 的引用

