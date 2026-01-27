# 测试代码编写规范指南

## 1. 概述

本文档详细说明了项目测试代码的编写规范、最佳实践和常见模式，旨在确保测试代码的质量、可维护性和一致性。

## 2. 测试类型和目录结构

### 2.1 测试类型

- **单元测试**：测试单个组件、函数或Hook的功能
- **集成测试**：测试多个组件或模块之间的交互
- **端到端测试**：测试完整的用户流程，从开始到结束

### 2.2 目录结构

```
tests/
├── unit/                          # 单元测试
│   ├── components/                # 组件单元测试
│   │   ├── common/            # 通用组件测试
│   │   ├── ui/                # UI组件测试
│   │   └── features/          # 功能模块组件测试
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
├── utils/                       # 测试工具函数
│   ├── rendering/               # 渲染相关工具函数
│   ├── error-handling/          # 错误处理相关工具函数
│   ├── mocks/                   # 模拟数据和服务
│   ├── assertions/              # 自定义断言函数
│   └── performance/             # 性能测试工具
├── shared/                      # 共享测试资源
│   ├── constants/               # 测试常量
│   ├── selectors/               # 测试选择器
│   ├── fixtures/                # 共享测试数据
│   └── mocks/                   # 共享模拟服务
└── docs/                        # 测试文档
```

## 3. 命名规范

### 3.1 测试文件命名

- **单元测试**：`[ComponentName].test.tsx`
  - 示例：`Button.test.tsx`, `useMobile.test.ts`

- **集成测试**：`[FeatureName]-[TestType].test.tsx`
  - 示例：`content-area.test.tsx`, `page-integration.test.tsx`

- **端到端测试**：`[FeatureName]-[Scenario].e2e.tsx`
  - 示例：`video-playback.e2e.tsx`, `theme-switching.e2e.tsx`

### 3.2 测试套件命名

- 使用描述性的测试套件名称，清晰说明测试的组件或功能
- 格式：`describe("组件名称/功能描述 测试", () => { ... })`
- 示例：`describe("Button组件测试", () => { ... })`

### 3.3 测试用例命名

- 使用清晰、描述性的测试用例名称
- 包含测试用例ID（TC-XXX）和测试名称
- 格式：`test("TC-XXX: 测试名称", () => { ... })`
- 示例：`test("TC-001: Button渲染测试", () => { ... })`

## 4. 测试结构

### 4.1 基本结构（AAA原则）

```typescript
import React from "react";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import Component from "@/components/Component";
import "@testing-library/jest-dom";

describe("组件名称测试", () => {
  /**
   * 测试用例 TC-XXX: 测试名称
   * 测试目标：测试目标说明
   * 测试场景：测试场景描述
   */
  test("TC-XXX: 测试名称", () => {
    // Arrange - 准备测试数据和环境
    const mockProps = { /* 模拟属性 */ };
    const mockCallback = jest.fn();

    // Act - 执行测试操作
    const { container } = render(<Component {...mockProps} onEvent={mockCallback} />);
    fireEvent.click(screen.getByRole("button"));

    // Assert - 验证测试结果
    expect(screen.getByText("预期文本")).toBeInTheDocument();
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    cleanup();
  });
});
```

### 4.2 异步测试结构

```typescript
test("TC-XXX: 异步操作测试", async () => {
  // Arrange
  const mockAsyncFunction = jest.fn().mockResolvedValue({ data: "test" });

  // Act
  render(<Component fetchData={mockAsyncFunction} />);
  fireEvent.click(screen.getByRole("button"));

  // Assert
  await waitFor(() => {
    expect(screen.getByText("加载完成")).toBeInTheDocument();
  });
  expect(mockAsyncFunction).toHaveBeenCalledTimes(1);
});
```

## 5. 测试最佳实践

### 5.1 测试覆盖范围

- **正常流程**：测试组件的基本功能和正常使用场景
- **边界条件**：测试组件在边界值下的行为
- **异常情况**：测试组件在异常情况下的行为
- **交互测试**：测试用户与组件的交互行为
- **状态管理**：测试组件的状态变化和管理

### 5.2 Mock策略

- **最小化原则**：只Mock必要的部分，不要过度Mock
- **真实性原则**：Mock数据应该尽可能接近真实数据
- **可维护性原则**：Mock数据应该易于理解和修改
- **复用性原则**：Mock数据应该在多个测试中复用

### 5.3 断言使用

- 使用`@testing-library/jest-dom`提供的断言函数
- 优先使用用户可见的元素进行断言，而不是内部实现
- 使用明确的断言消息，提高测试失败时的可读性
- 避免使用`toBeTruthy()`或`toBeFalsy()`等模糊断言

### 5.4 测试独立性

- 每个测试应该独立运行，不依赖其他测试
- 使用`afterEach()`清理测试环境
- 避免在测试之间共享状态
- 为每个测试提供独立的Mock数据

### 5.5 测试可读性

- 使用清晰、描述性的测试名称
- 添加详细的测试注释，说明测试目标和场景
- 保持测试代码简洁，避免复杂的逻辑
- 使用一致的代码风格和缩进

## 6. 常见测试场景

### 6.1 组件渲染测试

```typescript
test("TC-XXX: 组件渲染测试", () => {
  render(<Component />);
  expect(screen.getByRole("heading")).toBeInTheDocument();
  expect(screen.getByTestId("component-container")).toBeInTheDocument();
});
```

### 6.2 组件交互测试

```typescript
test("TC-XXX: 按钮点击测试", () => {
  const onButtonClick = jest.fn();
  render(<Button onClick={onButtonClick}>点击我</Button>);
  fireEvent.click(screen.getByText("点击我"));
  expect(onButtonClick).toHaveBeenCalledTimes(1);
});
```

### 6.3 组件状态测试

```typescript
test("TC-XXX: 输入框状态测试", () => {
  render(<Input placeholder="请输入内容" />);
  const input = screen.getByPlaceholderText("请输入内容");
  fireEvent.change(input, { target: { value: "测试内容" } });
  expect(input).toHaveValue("测试内容");
});
```

### 6.4 异步操作测试

```typescript
test("TC-XXX: 异步数据加载测试", async () => {
  const mockData = { id: 1, name: "测试数据" };
  const mockFetch = jest.fn().mockResolvedValue(mockData);
  
  render(<DataComponent fetchData={mockFetch} />);
  
  expect(screen.getByText("加载中...")).toBeInTheDocument();
  
  await waitFor(() => {
    expect(screen.getByText(mockData.name)).toBeInTheDocument();
  });
  
  expect(mockFetch).toHaveBeenCalledTimes(1);
});
```

### 6.5 错误处理测试

```typescript
test("TC-XXX: 错误处理测试", async () => {
  const mockFetch = jest.fn().mockRejectedValue(new Error("网络错误"));
  
  render(<DataComponent fetchData={mockFetch} />);
  fireEvent.click(screen.getByText("加载数据"));
  
  await waitFor(() => {
    expect(screen.getByText("网络错误")).toBeInTheDocument();
  });
});
```

## 7. 测试工具使用

### 7.1 渲染工具

```typescript
import { renderWithProviders } from "@/tests/utils/render";

// 使用增强的渲染函数
test("TC-XXX: 组件渲染测试", () => {
  const { container } = renderWithProviders(<Component />);
  expect(container).toBeInTheDocument();
});
```

### 7.2 错误处理工具

```typescript
import { safeAsync, retryAsync } from "@/tests/utils/error-handling";

// 使用安全的异步操作
test("TC-XXX: 安全异步操作测试", async () => {
  const result = await safeAsync(() => fetchData());
  expect(result).not.toBeInstanceOf(Error);
});

// 使用重试机制
test("TC-XXX: 重试机制测试", async () => {
  const result = await retryAsync(() => fetchData(), 3, 1000);
  expect(result).toBeDefined();
});
```

### 7.3 自定义断言

```typescript
import { expectElementToHaveClass } from "@/tests/utils/assertions";

test("TC-XXX: 元素样式测试", () => {
  render(<Component />);
  const element = screen.getByTestId("test-element");
  expectElementToHaveClass(element, "expected-class");
});
```

### 7.4 性能测试

```typescript
import { measureRenderPerformance } from "@/tests/utils/performance";

test("TC-XXX: 组件渲染性能测试", async () => {
  const averageTime = await measureRenderPerformance(<Component />, 10);
  expect(averageTime).toBeLessThan(100); // 平均渲染时间小于100ms
});
```

## 8. 测试覆盖率

### 8.1 覆盖率指标

- **语句覆盖率**：> 80%
- **分支覆盖率**：> 80%
- **函数覆盖率**：> 80%
- **行覆盖率**：> 80%

### 8.2 覆盖率报告

- 生成覆盖率报告：`npm run test:coverage`
- 覆盖率报告位置：`coverage/`
- 查看报告：打开 `coverage/index.html`

### 8.3 提高覆盖率

- 编写测试用例时考虑边界条件和异常情况
- 使用测试覆盖率工具识别未覆盖的代码
- 为未覆盖的代码添加测试用例
- 定期审查测试覆盖率报告

## 9. 测试执行

### 9.1 运行所有测试

```bash
npm test
```

### 9.2 运行单元测试

```bash
npm run test:unit
```

### 9.3 运行集成测试

```bash
npm run test:integration
```

### 9.4 运行端到端测试

```bash
npm run test:e2e
```

### 9.5 运行特定测试

```bash
# 运行特定文件的测试
npm test -- tests/unit/components/ui/Button.test.tsx

# 运行匹配特定模式的测试
npm test -- --testNamePattern="Button"

# 运行测试并查看详细输出
npm test -- --verbose
```

### 9.6 运行测试并监听文件变化

```bash
npm run test:watch
```

## 10. 调试测试

### 10.1 调试单个测试

```bash
npm test -- --testNamePattern="测试名称" --verbose
```

### 10.2 使用console.log

```typescript
test("TC-XXX: 调试测试", () => {
  const component = render(<Component />);
  console.log("组件HTML:", component.container.innerHTML);
  // 其他测试代码
});
```

### 10.3 使用浏览器开发者工具

- 在测试中添加 `debug()` 函数
- 运行测试时会打开浏览器开发者工具

```typescript
import { debug } from "@testing-library/react";

test("TC-XXX: 调试测试", () => {
  render(<Component />);
  debug(); // 打开浏览器开发者工具
  // 其他测试代码
});
```

### 10.4 常见问题调试

| 问题 | 可能原因 | 解决方案 |
|------|----------|----------|
| 测试超时 | 异步操作没有正确处理 | 使用 `waitFor` 或 `findBy*` 函数 |
| 元素未找到 | 元素还未渲染或选择器错误 | 使用 `waitFor` 等待元素出现，检查选择器 |
| Mock函数未被调用 | 组件没有正确调用函数 | 检查组件代码，确保函数被正确调用 |
| 状态未更新 | 状态更新是异步的 | 使用 `waitFor` 等待状态更新 |

## 11. CI/CD集成

### 11.1 GitHub Actions配置

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

### 11.2 覆盖率阈值配置

在 `jest.config.js` 中配置覆盖率阈值：

```javascript
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80,
  },
},
```

## 12. 测试维护

### 12.1 代码审查

- **定期审查**：定期审查测试代码，确保质量
- **重构优化**：及时重构重复代码，提高可维护性
- **文档更新**：及时更新测试文档，保持文档同步
- **问题修复**：及时修复失败的测试，保持测试稳定性

### 12.2 测试更新

- **代码变更**：当组件或函数代码变更时，更新相应的测试
- **新功能**：添加新功能时，编写相应的测试
- **Bug修复**：修复Bug时，添加测试用例防止回归
- **性能优化**：优化性能时，添加性能测试

### 12.3 测试清理

- **删除过时测试**：删除不再需要的测试用例
- **合并重复测试**：合并功能重复的测试用例
- **更新Mock数据**：更新过时的Mock数据
- **清理测试环境**：确保测试环境的一致性

## 13. 常见问题FAQ

### 13.1 如何添加新的测试？

1. 确定测试类型（单元测试、集成测试、E2E测试）
2. 在对应的目录下创建测试文件
3. 按照命名规范命名文件
4. 编写测试用例，遵循AAA原则
5. 运行测试验证

### 13.2 如何使用Mock数据？

1. 在`tests/fixtures/`目录下创建Mock数据文件
2. 导入Mock数据到测试文件
3. 在测试中使用Mock数据
4. 确保Mock数据的真实性和可维护性

### 13.3 如何提高测试覆盖率？

1. 编写测试用例时考虑边界条件和异常情况
2. 使用测试覆盖率工具识别未覆盖的代码
3. 为未覆盖的代码添加测试用例
4. 定期审查测试覆盖率报告

### 13.4 如何处理异步测试？

1. 使用`async/await`处理异步操作
2. 使用`waitFor`等待异步元素出现
3. 使用`findBy*`函数查找异步渲染的元素
4. 设置合理的超时时间

### 13.5 如何编写可靠的Mock？

1. 了解被Mock的服务或函数的真实行为
2. 模拟真实的返回值和错误情况
3. 为Mock函数添加合理的延迟，模拟网络请求
4. 在多个测试中复用Mock，提高可维护性

## 14. 结论

遵循本指南可以帮助您编写高质量、可维护的测试代码，提高测试覆盖率，确保项目的质量和稳定性。测试代码是项目的重要组成部分，应该与业务代码一样受到重视和维护。

定期审查和更新测试代码，确保测试与业务逻辑同步，是保持项目质量的关键。通过合理的测试策略和工具使用，可以提高测试的效率和有效性，为项目的持续集成和交付提供保障。