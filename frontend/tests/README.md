# 测试目录结构说明

## 概述

本文档说明了项目测试文件的组织结构、命名规范和使用指南。

## 目录结构

```
tests/
├── unit/                          # 单元测试
│   ├── components/                # 组件单元测试
│   │   ├── common/            # 通用组件测试
│   │   ├── ui/                # UI组件测试
│   │   └── features/          # 功能模块组件测试
│   │       ├── tiantong/       # 甜筒模块组件测试
│   │       └── lvjiang/       # 驴酱模块组件测试
│   ├── hooks/                    # Hooks单元测试
│   └── utils/                    # 工具函数单元测试
├── integration/                    # 集成测试
│   ├── tiantong/                 # 甜筒模块集成测试
│   ├── lvjiang/                  # 驴酱模块集成测试
│   └── cross-module/             # 跨模块集成测试
├── e2e/                         # 端到端测试
│   ├── tiantong/                 # 甜筒模块E2E测试
│   └── lvjiang/                  # 驴酱模块E2E测试
├── fixtures/                     # 测试数据
│   ├── videos.ts                 # 视频测试数据
│   └── danmaku.ts               # 弹幕测试数据
├── utils/                       # 测试工具函数
│   └── render.tsx               # 渲染工具函数
└── setup.ts                     # 测试配置
```

## 命名规范

### 单元测试命名规范

```
格式：[ComponentName].test.tsx
示例：
- ThemeToggle.test.tsx
- VideoCard.test.tsx
- Header.test.tsx
```

### 集成测试命名规范

```
格式：[FeatureName]-[TestType].test.tsx
示例：
- visual-baseline.test.tsx
- core-flow.test.tsx
- content-area.test.tsx
```

### E2E测试命名规范

```
格式：[FeatureName]-[Scenario].e2e.tsx
示例：
- video-playback.e2e.tsx
- theme-switching.e2e.tsx
```

## 测试类型说明

### 单元测试 (Unit Tests)

**目的**：测试单个组件、函数或Hook的功能

**位置**：`tests/unit/`

**特点**：
- 测试范围小，专注于单个功能点
- 执行速度快，通常在几秒内完成
- 不依赖外部服务，使用Mock数据
- 测试覆盖率要求：> 80%

**示例**：
- 组件渲染测试
- 组件交互测试
- 组件状态管理测试
- Hook功能测试
- 工具函数测试

### 集成测试 (Integration Tests)

**目的**：测试多个组件或模块之间的交互

**位置**：`tests/integration/`

**特点**：
- 测试范围中等，测试组件间的交互
- 执行速度中等，通常在几十秒内完成
- 可能使用Mock服务，但更接近真实环境
- 测试覆盖率要求：> 70%

**示例**：
- 页面核心流程测试
- 视觉基底测试
- 内容区测试
- 交互测试
- 兼容性测试
- 性能测试

### 端到端测试 (E2E Tests)

**目的**：测试完整的用户流程，从开始到结束

**位置**：`tests/e2e/`

**特点**：
- 测试范围大，测试完整的用户流程
- 执行速度较慢，通常在几分钟内完成
- 使用真实环境或接近真实的Mock环境
- 测试覆盖率要求：> 60%

**示例**：
- 用户登录流程
- 视频播放流程
- 主题切换流程
- 数据加载流程

## 测试数据使用指南

### Fixtures目录

**位置**：`tests/fixtures/`

**用途**：提供测试用的Mock数据

**示例**：
```typescript
// videos.ts
export const mockVideos: Video[] = [
  {
    id: "1",
    title: "测试视频1",
    category: "sing",
    tags: ["测试"],
    cover: "https://example.com/cover1.jpg",
    date: "2024-01-01",
    views: "10万",
    icon: Heart,
    bvid: "BV1xx411c7mD",
    duration: "10:30"
  }
];

// danmaku.ts
export const mockDanmaku: Danmu[] = [
  {
    id: "1",
    text: "欢迎来到老虎主题！",
    type: "normal",
    user: "user1",
    color: "#FF5F00"
  }
];
```

### Mock使用原则

1. **最小化原则**：只Mock必要的部分，不要过度Mock
2. **真实性原则**：Mock数据应该尽可能接近真实数据
3. **可维护性原则**：Mock数据应该易于理解和修改
4. **复用性原则**：Mock数据应该在多个测试中复用

## 测试工具函数使用指南

### Utils目录

**位置**：`tests/utils/`

**用途**：提供测试用的工具函数

**示例**：
```typescript
// render.tsx
export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, options);
}

export function renderComponent(
  component: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(component, options);
}

export async function waitForElement(
  callback: () => HTMLElement | null,
  options?: {
    timeout?: number;
    interval?: number;
  }
): Promise<HTMLElement> {
  const { default: waitFor } = await import("@testing-library/dom");
  return waitFor(callback, options) as Promise<HTMLElement>;
}
```

### 工具函数使用原则

1. **封装性原则**：将常用的测试逻辑封装成工具函数
2. **可读性原则**：工具函数应该有清晰的命名和文档
3. **复用性原则**：工具函数应该在多个测试中复用
4. **类型安全原则**：工具函数应该有完整的类型定义

## 测试编写指南

### 基本结构

```typescript
import React from "react";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import Component from "@/components/Component";
import "@testing-library/jest-dom";

describe("组件名称测试", () => {
  /**
   * 测试用例 TC-XXX: 测试名称
   * 测试目标：测试目标说明
   */
  test("TC-XXX: 测试名称", () => {
    // Arrange - 准备测试数据
    const mockData = { ... };

    // Act - 执行测试操作
    const { container } = render(<Component {...mockData} />);
    fireEvent.click(screen.getByRole("button"));

    // Assert - 验证测试结果
    expect(screen.getByText("预期文本")).toBeInTheDocument();

    // Cleanup - 清理测试环境
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });
});
```

### 测试最佳实践

1. **AAA原则**：Arrange（准备）、Act（执行）、Assert（断言）
2. **独立性原则**：每个测试应该独立运行，不依赖其他测试
3. **可读性原则**：测试代码应该易于理解和维护
4. **描述性原则**：测试名称和描述应该清晰说明测试目的
5. **覆盖率原则**：测试应该覆盖正常流程、边界条件和异常情况

### 常见测试场景

1. **正常流程测试**：验证组件在正常情况下的行为
2. **边界条件测试**：验证组件在边界值下的行为
3. **异常情况测试**：验证组件在异常情况下的行为
4. **交互测试**：验证组件的用户交互行为
5. **性能测试**：验证组件的性能表现

## 测试覆盖率目标

### 覆盖率指标

- **语句覆盖率**：> 80%
- **分支覆盖率**：> 80%
- **函数覆盖率**：> 80%
- **行覆盖率**：> 80%

### 覆盖率报告

**生成命令**：
```bash
npm run test:coverage
```

**报告位置**：`coverage/`

**查看报告**：
```bash
npm run test:coverage
open coverage/index.html
```

## 运行测试

### 运行所有测试

```bash
npm test
```

### 运行单元测试

```bash
npm run test:unit
```

### 运行集成测试

```bash
npm run test:integration
```

### 运行E2E测试

```bash
npm run test:e2e
```

### 运行测试并监听文件变化

```bash
npm run test:watch
```

### 运行测试并生成覆盖率报告

```bash
npm run test:coverage
```

## CI/CD集成

### GitHub Actions配置

```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - name: Run Unit Tests
        run: npm run test:unit
      - name: Run Integration Tests
        run: npm run test:integration
      - name: Run E2E Tests
        run: npm run test:e2e
      - name: Upload Coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: unittests
```

## 常见问题FAQ

### Q1: 如何添加新的测试？

**A**：
1. 确定测试类型（单元测试、集成测试、E2E测试）
2. 在对应的目录下创建测试文件
3. 按照命名规范命名文件
4. 编写测试用例
5. 运行测试验证

### Q2: 如何使用Mock数据？

**A**：
1. 在`tests/fixtures/`目录下创建Mock数据文件
2. 导入Mock数据到测试文件
3. 在测试中使用Mock数据
4. 确保Mock数据的真实性和可维护性

### Q3: 如何提高测试覆盖率？

**A**：
1. 编写测试用例时考虑边界条件和异常情况
2. 使用测试覆盖率工具识别未覆盖的代码
3. 为未覆盖的代码添加测试用例
4. 定期审查测试覆盖率报告

### Q4: 如何调试失败的测试？

**A**：
1. 使用`npm test -- --testNamePattern="测试名称"`运行单个测试
2. 使用`npm test -- --verbose`查看详细的测试输出
3. 在测试文件中添加`console.log`输出调试信息
4. 使用浏览器的开发者工具查看渲染结果

### Q5: 如何处理异步测试？

**A**：
1. 使用`async/await`处理异步操作
2. 使用`waitFor`等待异步元素出现
3. 使用`act`包装异步操作
4. 设置合理的超时时间

## 维护指南

### 代码审查

1. **定期审查**：定期审查测试代码，确保质量
2. **重构优化**：及时重构重复代码，提高可维护性
3. **文档更新**：及时更新测试文档，保持文档同步
4. **问题修复**：及时修复失败的测试，保持测试稳定性

### 性能优化

1. **并行执行**：使用Jest的并行执行功能提高测试速度
2. **缓存优化**：使用Jest的缓存功能减少重复编译时间
3. **选择性执行**：只运行相关的测试，减少不必要的测试执行
4. **监控优化**：监控测试执行时间，优化慢速测试

## 版本历史

### V1.0 (2026-01-24)
- 初始版本，建立基本的测试目录结构
- 定义命名规范和测试类型说明
- 创建测试工具函数和Mock数据
- 更新Jest配置和package.json脚本

---

**文档版本**: V1.0
**最后更新**: 2026-01-24
**维护人员**: 测试团队
