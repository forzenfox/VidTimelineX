import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SearchButton } from "@/components/video-view/SearchButton";
import "@testing-library/jest-dom";

describe("SearchButton 组件测试", () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  test("TC-001: 渲染搜索按钮（icon模式）", () => {
    render(<SearchButton onSearch={mockOnSearch} variant="icon" />);

    expect(screen.getByRole("button", { name: /搜索/i })).toBeInTheDocument();
  });

  test("TC-002: 渲染搜索输入框（expanded模式）", () => {
    render(<SearchButton onSearch={mockOnSearch} variant="expanded" />);

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  test("TC-003: expanded模式下搜索输入框可以输入文本", () => {
    render(<SearchButton onSearch={mockOnSearch} variant="expanded" />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "测试搜索" } });

    expect(input).toHaveValue("测试搜索");
  });

  test("TC-004: 按下 Enter 触发搜索", () => {
    render(<SearchButton onSearch={mockOnSearch} variant="expanded" />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "测试搜索" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockOnSearch).toHaveBeenCalledWith("测试搜索");
  });

  test("TC-005: icon模式下搜索按钮尺寸为 36x36px", () => {
    render(<SearchButton onSearch={mockOnSearch} variant="icon" />);

    const button = screen.getByRole("button", { name: /搜索/i });
    expect(button).toHaveClass(/w-9/);
    expect(button).toHaveClass(/h-9/);
  });

  test("TC-006: 使用 Lucide Search 图标", () => {
    render(<SearchButton onSearch={mockOnSearch} variant="expanded" />);

    const input = screen.getByRole("textbox");
    const container = input.parentElement?.parentElement;
    const svg = container?.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  test("TC-007: 搜索框在有内容时显示叉叉图标", () => {
    render(<SearchButton onSearch={mockOnSearch} variant="expanded" />);

    const input = screen.getByRole("textbox");
    
    // 初始状态不应该显示叉叉图标
    expect(screen.queryByRole("button", { name: /清空/i })).not.toBeInTheDocument();
    
    // 输入内容后应该显示叉叉图标
    fireEvent.change(input, { target: { value: "测试搜索" } });
    expect(screen.getByRole("button", { name: /清空/i })).toBeInTheDocument();
  });

  test("TC-008: 点击叉叉图标清空搜索内容", () => {
    render(<SearchButton onSearch={mockOnSearch} variant="expanded" />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "测试搜索" } });
    
    // 点击叉叉图标
    const clearButton = screen.getByRole("button", { name: /清空/i });
    fireEvent.click(clearButton);
    
    // 搜索内容应该被清空
    expect(input).toHaveValue("");
  });

  test("TC-009: 点击叉叉图标触发onClear回调", () => {
    const mockOnClear = jest.fn();
    render(
      <SearchButton 
        onSearch={mockOnSearch} 
        variant="expanded" 
        currentQuery="测试查询"
        onClear={mockOnClear}
      />
    );

    // 点击叉叉图标
    const clearButton = screen.getByRole("button", { name: /清空/i });
    fireEvent.click(clearButton);
    
    // onClear应该被调用
    expect(mockOnClear).toHaveBeenCalled();
  });

  test("TC-010: 显示搜索历史", () => {
    const history = ["历史1", "历史2"];

    render(<SearchButton onSearch={mockOnSearch} variant="expanded" searchHistory={history} />);

    const input = screen.getByRole("textbox");
    fireEvent.focus(input);

    expect(screen.getByText(/搜索历史/i)).toBeInTheDocument();
    history.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  test("TC-011: 点击搜索历史项触发搜索", () => {
    const history = ["历史1", "历史2"];

    render(<SearchButton onSearch={mockOnSearch} variant="expanded" searchHistory={history} />);

    const input = screen.getByRole("textbox");
    fireEvent.focus(input);

    const historyItem = screen.getByText("历史1");
    fireEvent.click(historyItem);

    expect(mockOnSearch).toHaveBeenCalledWith("历史1");
  });

  test("TC-012: 清空搜索历史功能", () => {
    const history = ["历史1", "历史2"];
    const mockOnClearHistory = jest.fn();

    render(
      <SearchButton
        onSearch={mockOnSearch}
        variant="expanded"
        searchHistory={history}
        onClearHistory={mockOnClearHistory}
      />
    );

    const input = screen.getByRole("textbox");
    fireEvent.focus(input);

    const clearButton = screen.getByText(/清空/i);
    fireEvent.click(clearButton);

    expect(mockOnClearHistory).toHaveBeenCalled();
  });

  test("TC-013: 点击外部关闭搜索下拉框", async () => {
    const history = ["历史1"];
    const { container } = render(
      <div>
        <SearchButton onSearch={mockOnSearch} variant="expanded" searchHistory={history} />
        <div data-testid="outside">外部区域</div>
      </div>
    );

    const input = screen.getByRole("textbox");
    fireEvent.focus(input);

    // 确认下拉框显示
    expect(screen.getByText(/搜索历史/i)).toBeInTheDocument();

    // 点击外部区域
    const outside = screen.getByTestId("outside");
    fireEvent.mouseDown(outside);

    await waitFor(() => {
      expect(screen.queryByText(/搜索历史/i)).not.toBeInTheDocument();
    });
  });

  test("TC-014: 支持 placeholder 自定义", () => {
    render(<SearchButton onSearch={mockOnSearch} variant="expanded" placeholder="自定义提示" />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("placeholder", "自定义提示");
  });

  test("TC-015: 支持所有主题", () => {
    const themes = ["tiger", "sweet", "dongzhu", "kaige"];

    themes.forEach((theme, index) => {
      const { unmount } = render(<SearchButton onSearch={mockOnSearch} variant="expanded" theme={theme} />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("data-theme", theme);
      unmount();
    });
  });

  test("TC-016: 搜索历史为空时不显示下拉框", () => {
    render(<SearchButton onSearch={mockOnSearch} variant="expanded" searchHistory={[]} />);

    const input = screen.getByRole("textbox");
    fireEvent.focus(input);

    // 搜索历史为空时不应该显示下拉框
    expect(screen.queryByText(/搜索历史/i)).not.toBeInTheDocument();
  });

  test("TC-017: 搜索历史为空时不显示清空按钮", () => {
    render(<SearchButton onSearch={mockOnSearch} variant="expanded" searchHistory={[]} />);

    const input = screen.getByRole("textbox");
    fireEvent.focus(input);

    expect(screen.queryByText(/清空/i)).not.toBeInTheDocument();
  });

  test("TC-018: 不应再显示搜索建议", () => {
    const suggestions = ["建议1", "建议2"];
    render(<SearchButton onSearch={mockOnSearch} variant="expanded" suggestions={suggestions} />);

    const input = screen.getByRole("textbox");
    fireEvent.focus(input);

    // 不应该显示搜索建议
    expect(screen.queryByText(/搜索建议/i)).not.toBeInTheDocument();
    suggestions.forEach(suggestion => {
      expect(screen.queryByText(suggestion)).not.toBeInTheDocument();
    });
  });

  test("TC-019: 不应再显示重置搜索按钮", () => {
    const mockOnClear = jest.fn();
    render(
      <SearchButton
        onSearch={mockOnSearch}
        variant="expanded"
        currentQuery="测试查询"
        onClear={mockOnClear}
      />
    );

    const input = screen.getByRole("textbox");
    fireEvent.focus(input);

    // 不应该显示重置搜索按钮
    expect(screen.queryByRole("button", { name: /重置搜索/i })).not.toBeInTheDocument();
  });

  test("TC-020: 不应再显示搜索按钮", () => {
    render(<SearchButton onSearch={mockOnSearch} variant="expanded" />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "测试搜索" } });
    fireEvent.focus(input);

    // 不应该显示搜索按钮（使用回车键替代）
    const searchButtons = screen.queryAllByRole("button", { name: /^搜索$/i });
    // 只应该有搜索图标按钮，没有搜索提交按钮
    expect(searchButtons.length).toBe(0);
  });

  test("TC-021: icon模式下点击按钮显示下拉框", () => {
    const history = ["历史1"];
    render(<SearchButton onSearch={mockOnSearch} variant="icon" searchHistory={history} />);

    const button = screen.getByRole("button", { name: /搜索/i });
    fireEvent.click(button);

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  test("TC-022: icon模式下有搜索历史时显示下拉框", () => {
    const history = ["历史1", "历史2"];
    render(<SearchButton onSearch={mockOnSearch} variant="icon" searchHistory={history} />);

    const button = screen.getByRole("button", { name: /搜索/i });
    fireEvent.click(button);

    history.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  test("TC-023: icon模式下搜索历史为空时不显示下拉框内容", () => {
    render(<SearchButton onSearch={mockOnSearch} variant="icon" searchHistory={[]} />);

    const button = screen.getByRole("button", { name: /搜索/i });
    fireEvent.click(button);

    // 有输入框但不应该有下拉框内容
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.queryByText(/搜索历史/i)).not.toBeInTheDocument();
  });
});
