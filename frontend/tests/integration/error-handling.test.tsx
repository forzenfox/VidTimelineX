import React, { useState, useEffect, ReactNode } from "react";
import { render, act, cleanup, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

// 错误边界组件
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div data-testid="error-fallback">
            <h2>出错了</h2>
            <p data-testid="error-message">{this.state.error?.message}</p>
            <button
              data-testid="retry-btn"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              重试
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

// 可能抛出错误的组件
const BuggyComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("组件渲染错误");
  }
  return <div data-testid="buggy-component">正常渲染</div>;
};

// 异步错误组件
const AsyncErrorComponent = () => {
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 模拟 API 调用失败
      await new Promise((_, reject) => {
        setTimeout(() => reject(new Error("网络请求失败")), 100);
      });
      setData("数据");
    } catch (err) {
      setError(err instanceof Error ? err.message : "未知错误");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button data-testid="fetch-btn" onClick={fetchData} disabled={loading}>
        {loading ? "加载中..." : "获取数据"}
      </button>
      {error && <div data-testid="async-error">{error}</div>}
      {data && <div data-testid="async-data">{data}</div>}
    </div>
  );
};

// 表单验证组件
const FormWithValidation = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("邮箱不能为空");
      return;
    }

    if (!email.includes("@")) {
      setError("请输入有效的邮箱地址");
      return;
    }

    setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit} data-testid="test-form">
      <input
        data-testid="email-input"
        type="text"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="请输入邮箱"
      />
      {error && <div data-testid="form-error">{error}</div>}
      {submitted && <div data-testid="form-success">提交成功</div>}
      <button type="submit" data-testid="submit-btn">
        提交
      </button>
    </form>
  );
};

describe("错误处理集成测试", () => {
  afterEach(() => {
    cleanup();
  });

  test("TC-ERROR-001: 错误边界应该捕获渲染错误", () => {
    const { getByTestId, rerender } = render(
      <ErrorBoundary>
        <BuggyComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    // 正常渲染
    expect(getByTestId("buggy-component")).toBeInTheDocument();

    // 触发错误
    rerender(
      <ErrorBoundary>
        <BuggyComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    // 错误边界应该显示 fallback
    expect(getByTestId("error-fallback")).toBeInTheDocument();
    expect(getByTestId("error-message")).toHaveTextContent("组件渲染错误");
  });

  test("TC-ERROR-002: 错误边界应该支持重试功能", () => {
    const { getByTestId, rerender } = render(
      <ErrorBoundary>
        <BuggyComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    // 确认错误状态
    expect(getByTestId("error-fallback")).toBeInTheDocument();

    // 修复错误
    rerender(
      <ErrorBoundary>
        <BuggyComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    // 点击重试
    act(() => {
      fireEvent.click(getByTestId("retry-btn"));
    });

    // 应该恢复正常渲染
    expect(getByTestId("buggy-component")).toBeInTheDocument();
  });

  test("TC-ERROR-003: 异步错误应该被正确处理", async () => {
    const { getByTestId } = render(<AsyncErrorComponent />);

    // 点击获取数据按钮
    act(() => {
      fireEvent.click(getByTestId("fetch-btn"));
    });

    // 等待错误显示
    await waitFor(() => {
      expect(getByTestId("async-error")).toBeInTheDocument();
    });

    expect(getByTestId("async-error")).toHaveTextContent("网络请求失败");
  });

  test("TC-ERROR-004: 表单验证应该正确显示错误信息", () => {
    const { getByTestId } = render(<FormWithValidation />);

    // 提交空表单
    act(() => {
      fireEvent.click(getByTestId("submit-btn"));
    });

    expect(getByTestId("form-error")).toHaveTextContent("邮箱不能为空");

    // 输入无效邮箱
    act(() => {
      fireEvent.change(getByTestId("email-input"), { target: { value: "invalid-email" } });
    });

    act(() => {
      fireEvent.click(getByTestId("submit-btn"));
    });

    expect(getByTestId("form-error")).toHaveTextContent("请输入有效的邮箱地址");
  });

  test("TC-ERROR-005: 表单验证通过后应该成功提交", () => {
    const { getByTestId, queryByTestId } = render(<FormWithValidation />);

    // 输入有效邮箱
    act(() => {
      fireEvent.change(getByTestId("email-input"), { target: { value: "test@example.com" } });
    });

    // 提交表单
    act(() => {
      fireEvent.click(getByTestId("submit-btn"));
    });

    // 不应该显示错误
    expect(queryByTestId("form-error")).not.toBeInTheDocument();

    // 应该显示成功消息
    expect(getByTestId("form-success")).toBeInTheDocument();
    expect(getByTestId("form-success")).toHaveTextContent("提交成功");
  });

  test("TC-ERROR-006: 自定义错误 fallback 应该正确渲染", () => {
    const customFallback = <div data-testid="custom-error">自定义错误页面</div>;

    const { getByTestId } = render(
      <ErrorBoundary fallback={customFallback}>
        <BuggyComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(getByTestId("custom-error")).toBeInTheDocument();
    expect(getByTestId("custom-error")).toHaveTextContent("自定义错误页面");
  });
});
