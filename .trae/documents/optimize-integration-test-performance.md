# 集成测试性能优化方案

## 问题分析

当前 `page-integration.test.tsx` 测试执行时间过长（20.315秒），主要原因：

1. **超时设置过长**：每个测试用例设置 15秒 超时
2. **React.lazy 动态导入**：每次渲染都需等待组件加载
3. **QueryClient 重试机制**：配置了指数退避重试，最大延迟30秒
4. **复杂组件渲染**：完整渲染整个页面组件，包含多个子组件和副作用
5. **测试用例数量**：5个集成测试顺序执行

## 优化目标

* 将测试执行时间从 20秒 降低到 5秒 以内

* 保持测试覆盖率和准确性

* 遵循 TDD 原则，先写测试再优化

## 实施步骤

### 阶段 1：Mock 优化（预计减少 30% 时间）

#### 1.1 Mock 动态导入组件

**文件**: `tests/integration/tiantong/page-integration.test.tsx`

```typescript
// 添加 Mock 预加载
jest.mock("@/features/tiantong/components/SidebarDanmu", () => {
  return function MockSidebarDanmu({ theme }: { theme: string }) {
    return <div data-testid="sidebar-danmu">Sidebar Danmu - {theme}</div>;
  };
});
```

#### 1.2 Mock QueryClient 配置

```typescript
// 创建轻量级 QueryClient
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,  // 禁用重试
        staleTime: 0,
        cacheTime: 0,
      },
    },
  });
```

### 阶段 2：测试结构优化（预计减少 40% 时间）

#### 2.1 使用 beforeEach 共享渲染逻辑

```typescript
describe("甜筒模块页面集成测试", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
  });

  afterEach(() => {
    queryClient.clear();
  });
  
  // 测试用例...
});
```

#### 2.2 减少超时时间

```typescript
// 从 15000ms 减少到 5000ms
await withTimeout(async () => { ... }, 5000, "操作超时");
```

### 阶段 3：并行执行优化（预计减少 20% 时间）

#### 3.1 确保测试独立性

* 每个测试使用独立的 QueryClient 实例

* 清理 DOM 状态

* 避免测试间状态共享

#### 3.2 使用 Jest 并行执行

```typescript
// jest.config.cjs 已配置 maxWorkers: "75%"
// 确保测试文件内测试用例相互独立
```

### 阶段 4：验证优化效果

#### 4.1 执行测试对比

```bash
# 优化前基准测试
npm test -- tests/integration/tiantong/page-integration.test.tsx

# 优化后测试
npm test -- tests/integration/tiantong/page-integration.test.tsx
```

#### 4.2 覆盖率检查

```bash
npm run test:coverage -- --testPathPattern=page-integration
```

## 预期效果

| 指标      | 优化前     | 优化后  | 提升    |
| ------- | ------- | ---- | ----- |
| 总执行时间   | 20.315s | \~5s | 75% ↓ |
| 单测试平均时间 | \~4s    | \~1s | 75% ↓ |
| 超时风险    | 高       | 低    | 显著改善  |

## 风险评估

| 风险               | 影响 | 缓解措施                 |
| ---------------- | -- | -------------------- |
| Mock 不完整导致测试失效   | 高  | 验证每个 Mock 的行为与真实组件一致 |
| QueryClient 配置差异 | 中  | 确保测试配置覆盖生产环境关键路径     |
| 并行执行引入竞态条件       | 低  | 使用独立实例，避免共享状态        |

## 回滚计划

如果优化后出现问题：

1. 恢复原始测试文件
2. 逐一验证每个 Mock 的正确性
3. 调整超时时间至中间值（如 8000ms）

## 实施检查清单

* [ ] Mock SidebarDanmu 组件

* [ ] 创建测试专用 QueryClient

* [ ] 优化超时设置

* [ ] 添加 beforeEach/afterEach

* [ ] 验证测试通过率

* [ ] 验证代码覆盖率

* [ ] 对比执行时间

