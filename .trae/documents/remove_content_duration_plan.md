# VidTimelineX - 移除内容区域时长显示计划

## [x] 任务 1: 编写测试用例
- **Priority**: P0
- **Depends On**: None
- **Description**:
  - 为 VideoCard 组件编写测试用例
  - 验证当前内容区域有时长显示
  - 验证封面图片上有时长显示
- **Success Criteria**:
  - 测试用例编写完成
  - 测试用例能够运行并验证当前行为
- **Test Requirements**:
  - `programmatic` TR-1.1: 测试用例能够正确运行
  - `programmatic` TR-1.2: 测试用例能够检测到内容区域的时长显示
- **Notes**: 需要找到或创建测试文件

## [x] 任务 2: 移除内容区域的时长显示
- **Priority**: P0
- **Depends On**: 任务 1
- **Description**:
  - 移除 VideoCard 组件中内容区域的时长显示部分
  - 保留封面图片上的时长显示
- **Success Criteria**:
  - 内容区域不再显示时长信息
  - 封面图片上的时长显示保持不变
  - 组件其他功能正常运行
- **Test Requirements**:
  - `programmatic` TR-2.1: 测试用例验证内容区域不再渲染时长相关的 DOM 元素
  - `programmatic` TR-2.2: 测试用例验证封面图片上仍然有时长显示
- **Notes**: 需要删除第 218-223 行的时长显示代码

## [x] 任务 3: 运行测试验证修改
- **Priority**: P1
- **Depends On**: 任务 2
- **Description**:
  - 运行测试用例验证修改是否正确
  - 确保所有测试通过
- **Success Criteria**:
  - 所有测试用例通过
  - 验证内容区域没有时长显示，封面有时长显示
- **Test Requirements**:
  - `programmatic` TR-3.1: 所有测试用例通过
  - `human-judgement` TR-3.2: 视觉检查确认修改效果
- **Notes**: 运行测试命令验证修改

## [x] 任务 4: 运行开发服务器验证
- **Priority**: P1
- **Depends On**: 任务 3
- **Description**:
  - 运行开发服务器查看修改效果
  - 确保视频卡片的其他功能正常
- **Success Criteria**:
  - 开发服务器正常运行
  - 视频卡片显示正常
  - 封面有时长显示，内容区域没有时长显示
- **Test Requirements**:
  - `programmatic` TR-4.1: 开发服务器启动成功
  - `human-judgement` TR-4.2: 视觉验证修改效果符合要求
- **Notes**: 使用已有的开发服务器终端