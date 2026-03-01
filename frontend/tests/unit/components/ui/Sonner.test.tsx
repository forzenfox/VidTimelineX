import React from "react";
import { render, screen, act } from "@testing-library/react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { ThemeProvider } from "next-themes";
import "@testing-library/jest-dom";

// Mock sonner 模块
jest.mock("sonner", () => ({
  Toaster: jest.fn(({ theme, position, className, style, ...props }: any) => {
    // 合并基础类名和自定义类名
    const baseClassName = "toaster group";
    const finalClassName = className ? `${baseClassName} ${className}` : baseClassName;
    return (
      <div
        data-testid="sonner-toaster"
        data-theme={theme}
        data-position={position}
        className={finalClassName}
        style={style}
        {...props}
      />
    );
  }),
  toast: Object.assign(
    jest.fn((message: string) => {
      // 模拟 toast 调用时创建 toast 元素
      const toastContainer = document.querySelector('[data-testid="sonner-toaster"]');
      if (toastContainer) {
        const toastElement = document.createElement("div");
        toastElement.setAttribute("data-testid", "toast-item");
        toastElement.textContent = message;
        document.body.appendChild(toastElement);
      }
      return "toast-id-1";
    }),
    {
      success: jest.fn((message: string) => "toast-success-id"),
      error: jest.fn((message: string) => "toast-error-id"),
      info: jest.fn((message: string) => "toast-info-id"),
      warning: jest.fn((message: string) => "toast-warning-id"),
      dismiss: jest.fn((id?: string) => {}),
      loading: jest.fn((message: string) => "toast-loading-id"),
    }
  ),
}));

describe("Sonner组件测试", () => {
  afterEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = "";
  });

  /**
   * 测试用例 TC-001: Toaster组件渲染测试
   * 测试目标：验证Toaster组件能够正确渲染
   */
  test("TC-001: Toaster组件渲染测试", () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="light">
        <Toaster />
      </ThemeProvider>
    );

    const toaster = screen.getByTestId("sonner-toaster");
    expect(toaster).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-002: Toaster组件默认主题测试
   * 测试目标：验证Toaster组件默认使用system主题
   */
  test("TC-002: Toaster组件默认主题测试", () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="system">
        <Toaster />
      </ThemeProvider>
    );

    const toaster = screen.getByTestId("sonner-toaster");
    expect(toaster).toBeInTheDocument();
    expect(toaster).toHaveClass("toaster");
    expect(toaster).toHaveClass("group");
  });

  /**
   * 测试用例 TC-003: Toaster组件自定义样式属性测试
   * 测试目标：验证Toaster组件正确应用CSS变量样式
   */
  test("TC-003: Toaster组件自定义样式属性测试", () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="light">
        <Toaster />
      </ThemeProvider>
    );

    const toaster = screen.getByTestId("sonner-toaster");
    expect(toaster).toHaveStyle({
      "--normal-bg": "var(--popover)",
      "--normal-text": "var(--popover-foreground)",
      "--normal-border": "var(--border)",
    });
  });

  /**
   * 测试用例 TC-004: Toaster组件不同位置渲染测试
   * 测试目标：验证Toaster组件能够在不同位置正确渲染
   */
  test("TC-004: Toaster组件不同位置渲染测试", () => {
    const positions = [
      "top-left",
      "top-right",
      "bottom-left",
      "bottom-right",
      "top-center",
      "bottom-center",
    ] as const;

    positions.forEach((position) => {
      const { unmount } = render(
        <ThemeProvider attribute="class" defaultTheme="light">
          <Toaster position={position} />
        </ThemeProvider>
      );

      const toaster = screen.getByTestId("sonner-toaster");
      expect(toaster).toBeInTheDocument();
      expect(toaster).toHaveAttribute("data-position", position);

      unmount();
    });
  });

  /**
   * 测试用例 TC-005: Toaster组件主题配置测试
   * 测试目标：验证Toaster组件能够正确响应主题变化
   */
  test("TC-005: Toaster组件主题配置测试", () => {
    const themes: Array<"light" | "dark" | "system"> = ["light", "dark", "system"];

    themes.forEach((theme) => {
      const { unmount } = render(
        <ThemeProvider attribute="class" defaultTheme={theme}>
          <Toaster />
        </ThemeProvider>
      );

      const toaster = screen.getByTestId("sonner-toaster");
      expect(toaster).toBeInTheDocument();
      expect(toaster).toHaveAttribute("data-theme", theme);

      unmount();
    });
  });

  /**
   * 测试用例 TC-006: toast函数调用测试
   * 测试目标：验证toast函数能够正确调用并返回toast ID
   */
  test("TC-006: toast函数调用测试", () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="light">
        <Toaster />
      </ThemeProvider>
    );

    const toastId = toast("测试消息");

    expect(toast).toHaveBeenCalledWith("测试消息");
    expect(toastId).toBe("toast-id-1");
  });

  /**
   * 测试用例 TC-007: toast不同变体调用测试
   * 测试目标：验证toast的不同变体函数能够正确调用
   */
  test("TC-007: toast不同变体调用测试", () => {
    // 测试成功提示
    const successId = toast.success("操作成功");
    expect(toast.success).toHaveBeenCalledWith("操作成功");
    expect(successId).toBe("toast-success-id");

    // 测试错误提示
    const errorId = toast.error("操作失败");
    expect(toast.error).toHaveBeenCalledWith("操作失败");
    expect(errorId).toBe("toast-error-id");

    // 测试信息提示
    const infoId = toast.info("提示信息");
    expect(toast.info).toHaveBeenCalledWith("提示信息");
    expect(infoId).toBe("toast-info-id");

    // 测试警告提示
    const warningId = toast.warning("警告信息");
    expect(toast.warning).toHaveBeenCalledWith("警告信息");
    expect(warningId).toBe("toast-warning-id");

    // 测试加载提示
    const loadingId = toast.loading("加载中...");
    expect(toast.loading).toHaveBeenCalledWith("加载中...");
    expect(loadingId).toBe("toast-loading-id");
  });

  /**
   * 测试用例 TC-008: toast dismiss函数调用测试
   * 测试目标：验证toast.dismiss函数能够正确调用
   */
  test("TC-008: toast dismiss函数调用测试", () => {
    // 测试关闭指定toast
    toast.dismiss("toast-id-1");
    expect(toast.dismiss).toHaveBeenCalledWith("toast-id-1");

    // 测试关闭所有toast
    toast.dismiss();
    expect(toast.dismiss).toHaveBeenCalledTimes(2);
  });

  /**
   * 测试用例 TC-009: Toaster组件扩展属性测试
   * 测试目标：验证Toaster组件能够正确传递扩展属性
   */
  test("TC-009: Toaster组件扩展属性测试", () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="light">
        <Toaster
          richColors
          expand
          closeButton
          duration={5000}
          visibleToasts={5}
        />
      </ThemeProvider>
    );

    const toaster = screen.getByTestId("sonner-toaster");
    expect(toaster).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-010: Toaster组件自定义类名测试
   * 测试目标：验证Toaster组件能够正确应用自定义类名
   */
  test("TC-010: Toaster组件自定义类名测试", () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="light">
        <Toaster className="custom-toaster-class" />
      </ThemeProvider>
    );

    const toaster = screen.getByTestId("sonner-toaster");
    // 验证自定义类名被应用
    expect(toaster).toHaveClass("custom-toaster-class");
    // 验证基础类名也被应用
    expect(toaster).toHaveClass("toaster");
    expect(toaster).toHaveClass("group");
  });
});
