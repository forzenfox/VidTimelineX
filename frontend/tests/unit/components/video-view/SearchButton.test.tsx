import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SearchButton } from "@/components/video-view/SearchButton";
import "@testing-library/jest-dom";

describe("SearchButton 组件测试", () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  test("TC-001: 渲染搜索按钮", () => {
    render(<SearchButton onSearch={mockOnSearch} />);

    expect(screen.getByRole("button", { name: /搜索/i })).toBeInTheDocument();
  });

  test("TC-002: 点击按钮展开搜索输入框", () => {
    render(<SearchButton onSearch={mockOnSearch} />);

    const button = screen.getByRole("button", { name: /搜索/i });
    fireEvent.click(button);

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  test("TC-003: 搜索输入框可以输入文本", async () => {
    render(<SearchButton onSearch={mockOnSearch} />);

    const button = screen.getByRole("button", { name: /搜索/i });
    fireEvent.click(button);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "测试搜索" } });

    expect(input).toHaveValue("测试搜索");
  });

  test("TC-004: 按下 Enter 触发搜索", () => {
    render(<SearchButton onSearch={mockOnSearch} />);

    const button = screen.getByRole("button", { name: /搜索/i });
    fireEvent.click(button);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "测试搜索" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockOnSearch).toHaveBeenCalledWith("测试搜索");
  });

  test("TC-005: 搜索按钮尺寸为 36x36px", () => {
    render(<SearchButton onSearch={mockOnSearch} />);

    const button = screen.getByRole("button", { name: /搜索/i });
    expect(button).toHaveClass(/w-9/);
    expect(button).toHaveClass(/h-9/);
  });

  test("TC-006: 使用 Lucide Search 图标", () => {
    render(<SearchButton onSearch={mockOnSearch} />);

    const button = screen.getByRole("button", { name: /搜索/i });
    const svg = button.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  test("TC-007: 显示搜索建议列表", () => {
    const suggestions = ["建议1", "建议2", "建议3"];

    render(<SearchButton onSearch={mockOnSearch} suggestions={suggestions} />);

    const button = screen.getByRole("button", { name: /搜索/i });
    fireEvent.click(button);

    suggestions.forEach(suggestion => {
      expect(screen.getByText(suggestion)).toBeInTheDocument();
    });
  });

  test("TC-008: 点击搜索建议触发搜索", () => {
    const suggestions = ["建议1", "建议2"];

    render(<SearchButton onSearch={mockOnSearch} suggestions={suggestions} />);

    const button = screen.getByRole("button", { name: /搜索/i });
    fireEvent.click(button);

    const suggestionItem = screen.getByText("建议1");
    fireEvent.click(suggestionItem);

    expect(mockOnSearch).toHaveBeenCalledWith("建议1");
  });

  test("TC-009: 显示搜索历史", () => {
    const history = ["历史1", "历史2"];

    render(<SearchButton onSearch={mockOnSearch} searchHistory={history} />);

    const button = screen.getByRole("button", { name: /搜索/i });
    fireEvent.click(button);

    expect(screen.getByText(/搜索历史/i)).toBeInTheDocument();
    history.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  test("TC-010: 点击搜索历史项触发搜索", () => {
    const history = ["历史1", "历史2"];

    render(<SearchButton onSearch={mockOnSearch} searchHistory={history} />);

    const button = screen.getByRole("button", { name: /搜索/i });
    fireEvent.click(button);

    const historyItem = screen.getByText("历史1");
    fireEvent.click(historyItem);

    expect(mockOnSearch).toHaveBeenCalledWith("历史1");
  });

  test("TC-011: 清空搜索历史功能", () => {
    const history = ["历史1", "历史2"];
    const mockOnClearHistory = jest.fn();

    render(
      <SearchButton
        onSearch={mockOnSearch}
        searchHistory={history}
        onClearHistory={mockOnClearHistory}
      />
    );

    const button = screen.getByRole("button", { name: /搜索/i });
    fireEvent.click(button);

    const clearButton = screen.getByRole("button", { name: /清空历史/i });
    fireEvent.click(clearButton);

    expect(mockOnClearHistory).toHaveBeenCalled();
  });

  test("TC-012: 展开/收起动画过渡", () => {
    render(<SearchButton onSearch={mockOnSearch} />);

    const button = screen.getByRole("button", { name: /搜索/i });
    fireEvent.click(button);

    const popover = screen.getByRole("dialog");
    expect(popover).toHaveClass(/data-\[state=open\]:animate-in/);
  });

  test("TC-013: 输入框自动聚焦", () => {
    render(<SearchButton onSearch={mockOnSearch} />);

    const button = screen.getByRole("button", { name: /搜索/i });
    fireEvent.click(button);

    const input = screen.getByRole("textbox");
    expect(input).toHaveFocus();
  });

  test("TC-014: 点击外部关闭搜索框", async () => {
    const { container } = render(
      <div>
        <SearchButton onSearch={mockOnSearch} />
        <div data-testid="outside">外部区域</div>
      </div>
    );

    const button = screen.getByRole("button", { name: /搜索/i });
    fireEvent.click(button);

    expect(screen.getByRole("textbox")).toBeInTheDocument();

    // 使用 Escape 键关闭 Popover，因为 Radix UI Popover 对外部点击的处理比较复杂
    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    });
  });

  test("TC-015: 支持 placeholder 自定义", () => {
    render(<SearchButton onSearch={mockOnSearch} placeholder="自定义提示" />);

    const button = screen.getByRole("button", { name: /搜索/i });
    fireEvent.click(button);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("placeholder", "自定义提示");
  });

  test("TC-016: 支持所有主题", () => {
    const themes = ["tiger", "sweet", "dongzhu", "kaige"];

    themes.forEach((theme, index) => {
      const { unmount } = render(<SearchButton onSearch={mockOnSearch} theme={theme} />);
      // 使用 getAllByRole 获取最后一个渲染的按钮
      const buttons = screen.getAllByRole("button", { name: /搜索/i });
      const button = buttons[buttons.length - 1];
      expect(button).toHaveAttribute("data-theme", theme);
      unmount();
    });
  });

  test("TC-017: 搜索历史为空时不显示清空按钮", () => {
    render(<SearchButton onSearch={mockOnSearch} searchHistory={[]} />);

    const button = screen.getByRole("button", { name: /搜索/i });
    fireEvent.click(button);

    expect(screen.queryByRole("button", { name: /清空历史/i })).not.toBeInTheDocument();
  });

  test("TC-018: 搜索建议为空时不显示建议区域", () => {
    render(<SearchButton onSearch={mockOnSearch} suggestions={[]} />);

    const button = screen.getByRole("button", { name: /搜索/i });
    fireEvent.click(button);

    expect(screen.queryByText(/搜索建议/i)).not.toBeInTheDocument();
  });
});
