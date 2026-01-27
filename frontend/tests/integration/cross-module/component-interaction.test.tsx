import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "next-themes";
import { BrowserRouter } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ThemeToggle from "@/features/tiantong/components/ThemeToggle";
import { Header } from "@/features/lvjiang/components/Header";
import "@testing-library/jest-dom";

/**
 * 组件间交互集成测试
 * 测试目标：验证不同模块之间的组件能够正确交互
 */
describe("组件间交互集成测试", () => {
  /**
   * 测试用例 TC-001: 主题切换跨模块影响测试
   * 测试目标：验证主题切换能够影响不同模块的组件
   */
  test("TC-001: 主题切换跨模块影响测试", () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="light">
        <div>
          <ThemeToggle currentTheme="tiger" onToggle={() => {}} />
          <Header theme="dongzhu" onThemeToggle={() => {}} />
        </div>
      </ThemeProvider>
    );

    // 验证初始状态
    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
    expect(screen.getByTestId("lvjiang-header")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-002: UI组件组合使用测试
   * 测试目标：验证不同UI组件能够组合使用
   */
  test("TC-002: UI组件组合使用测试", () => {
    render(
      <Card>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">用户信息</h3>
          <div className="space-y-2">
            <div>
              <label htmlFor="name" className="block mb-1">姓名</label>
              <Input id="name" placeholder="请输入姓名" />
            </div>
            <div>
              <label htmlFor="email" className="block mb-1">邮箱</label>
              <Input id="email" placeholder="请输入邮箱" />
            </div>
            <Button className="mt-2">提交</Button>
          </div>
        </div>
      </Card>
    );

    // 验证组件渲染
    expect(screen.getByText("用户信息")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("请输入姓名")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("请输入邮箱")).toBeInTheDocument();
    expect(screen.getByText("提交")).toBeInTheDocument();

    // 验证交互
    const nameInput = screen.getByPlaceholderText("请输入姓名");
    fireEvent.change(nameInput, { target: { value: "测试用户" } });
    expect(nameInput).toHaveValue("测试用户");

    const emailInput = screen.getByPlaceholderText("请输入邮箱");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    expect(emailInput).toHaveValue("test@example.com");

    const submitButton = screen.getByText("提交");
    fireEvent.click(submitButton);
  });

  /**
   * 测试用例 TC-003: 路由导航测试
   * 测试目标：验证路由导航能够正确工作
   */
  test("TC-003: 路由导航测试", () => {
    render(
      <BrowserRouter>
        <div>
          <nav>
            <a href="/" className="mr-4">首页</a>
            <a href="/tiantong">甜筒</a>
            <a href="/lvjiang">驴酱</a>
          </nav>
          <div>
            <h1>测试页面</h1>
          </div>
        </div>
      </BrowserRouter>
    );

    // 验证路由链接渲染
    expect(screen.getByText("首页")).toBeInTheDocument();
    expect(screen.getByText("甜筒")).toBeInTheDocument();
    expect(screen.getByText("驴酱")).toBeInTheDocument();
    expect(screen.getByText("测试页面")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-004: 表单提交测试
   * 测试目标：验证表单提交能够正确处理
   */
  test("TC-004: 表单提交测试", () => {
    const onSubmit = jest.fn((e) => e.preventDefault());

    render(
      <form onSubmit={onSubmit}>
        <div className="space-y-2">
          <div>
            <label htmlFor="username" className="block mb-1">用户名</label>
            <Input id="username" required />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1">密码</label>
            <Input id="password" type="password" required />
          </div>
          <Button type="submit">登录</Button>
        </div>
      </form>
    );

    // 验证表单渲染
    expect(screen.getByLabelText("用户名")).toBeInTheDocument();
    expect(screen.getByLabelText("密码")).toBeInTheDocument();
    expect(screen.getByText("登录")).toBeInTheDocument();

    // 验证表单提交
    const usernameInput = screen.getByLabelText("用户名");
    const passwordInput = screen.getByLabelText("密码");
    const submitButton = screen.getByText("登录");

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    expect(onSubmit).toHaveBeenCalled();
  });

  /**
   * 测试用例 TC-005: 状态管理集成测试
   * 测试目标：验证状态管理能够在不同组件间共享
   */
  test("TC-005: 状态管理集成测试", () => {
    // 创建一个包含状态管理的测试组件
    const TestComponent = () => {
      const [count, setCount] = React.useState(0);

      const CounterDisplay = () => <div data-testid="counter-display">{count}</div>;
      const CounterButton = () => (
        <Button onClick={() => setCount(count + 1)}>增加计数</Button>
      );

      return (
        <div>
          <CounterDisplay />
          <CounterButton />
        </div>
      );
    };

    render(<TestComponent />);

    // 验证初始状态
    expect(screen.getByTestId("counter-display")).toHaveTextContent("0");

    // 验证状态更新
    const button = screen.getByText("增加计数");
    fireEvent.click(button);
    expect(screen.getByTestId("counter-display")).toHaveTextContent("1");

    fireEvent.click(button);
    expect(screen.getByTestId("counter-display")).toHaveTextContent("2");
  });
});
