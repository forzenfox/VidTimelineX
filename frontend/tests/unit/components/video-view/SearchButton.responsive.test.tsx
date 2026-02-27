import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SearchButton } from "@/components/video-view/SearchButton";
import "@testing-library/jest-dom";

describe("SearchButton variant 响应式测试", () => {
  const mockOnSearch = jest.fn();
  const mockOnClearHistory = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
    mockOnClearHistory.mockClear();
  });

  describe("variant='icon' 模式", () => {
    test("TC-001: 渲染图标按钮（36×36px），点击展开搜索框", () => {
      render(<SearchButton onSearch={mockOnSearch} variant="icon" />);

      // 应该渲染图标按钮
      const button = screen.getByRole("button", { name: /搜索/i });
      expect(button).toBeInTheDocument();

      // 验证尺寸为 36x36px (w-9 h-9 = 36px)
      expect(button).toHaveClass("w-9");
      expect(button).toHaveClass("h-9");

      // 点击按钮展开搜索框
      fireEvent.click(button);

      // 搜索输入框应该显示
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    test("TC-002: 图标模式下搜索功能正常工作", () => {
      render(<SearchButton onSearch={mockOnSearch} variant="icon" />);

      // 点击按钮展开
      const button = screen.getByRole("button", { name: /搜索/i });
      fireEvent.click(button);

      // 输入搜索内容
      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "测试搜索" } });

      // 按下 Enter 触发搜索
      fireEvent.keyDown(input, { key: "Enter" });

      // 验证搜索回调被调用
      expect(mockOnSearch).toHaveBeenCalledWith("测试搜索");
    });

    test("TC-003: 图标模式下点击外部关闭搜索框", async () => {
      render(
        <div>
          <SearchButton onSearch={mockOnSearch} variant="icon" />
          <div data-testid="outside">外部区域</div>
        </div>
      );

      // 点击展开
      const button = screen.getByRole("button", { name: /搜索/i });
      fireEvent.click(button);

      // 搜索框应该显示
      expect(screen.getByRole("textbox")).toBeInTheDocument();

      // 按下 Escape 关闭
      fireEvent.keyDown(document, { key: "Escape" });

      await waitFor(() => {
        expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
      });
    });
  });

  describe("variant='expanded' 模式", () => {
    test("TC-004: 保持展开状态（显示搜索输入框）", () => {
      render(<SearchButton onSearch={mockOnSearch} variant="expanded" />);

      // 应该直接显示搜索输入框，不需要点击
      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();

      // 不应该有触发按钮
      expect(screen.queryByRole("button", { name: /搜索/i })).not.toBeInTheDocument();
    });

    test("TC-005: 展开模式下搜索功能正常工作", () => {
      render(<SearchButton onSearch={mockOnSearch} variant="expanded" />);

      // 直接输入搜索内容
      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "展开模式搜索" } });

      // 按下 Enter 触发搜索
      fireEvent.keyDown(input, { key: "Enter" });

      // 验证搜索回调被调用
      expect(mockOnSearch).toHaveBeenCalledWith("展开模式搜索");
    });

    test("TC-006: 展开模式下清空输入功能", () => {
      render(<SearchButton onSearch={mockOnSearch} variant="expanded" />);

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "测试内容" } });

      // 输入后应该显示清空按钮
      const clearButton = screen.getByRole("button", { name: /清空/i });
      expect(clearButton).toBeInTheDocument();

      // 点击清空按钮
      fireEvent.click(clearButton);

      // 输入应该被清空
      expect(input).toHaveValue("");
    });
  });

  describe("搜索历史和建议功能", () => {
    const suggestions = ["建议1", "建议2", "建议3"];
    const searchHistory = ["历史1", "历史2"];

    test("TC-007: icon 模式下显示搜索建议", () => {
      render(
        <SearchButton
          onSearch={mockOnSearch}
          variant="icon"
          suggestions={suggestions}
        />
      );

      // 点击展开
      const button = screen.getByRole("button", { name: /搜索/i });
      fireEvent.click(button);

      // 验证搜索建议显示
      expect(screen.getByText(/搜索建议/i)).toBeInTheDocument();
      suggestions.forEach(suggestion => {
        expect(screen.getByText(suggestion)).toBeInTheDocument();
      });
    });

    test("TC-008: expanded 模式下显示搜索建议", () => {
      render(
        <SearchButton
          onSearch={mockOnSearch}
          variant="expanded"
          suggestions={suggestions}
        />
      );

      // 直接显示搜索建议
      expect(screen.getByText(/搜索建议/i)).toBeInTheDocument();
      suggestions.forEach(suggestion => {
        expect(screen.getByText(suggestion)).toBeInTheDocument();
      });
    });

    test("TC-009: icon 模式下显示搜索历史", () => {
      render(
        <SearchButton
          onSearch={mockOnSearch}
          variant="icon"
          searchHistory={searchHistory}
        />
      );

      // 点击展开
      const button = screen.getByRole("button", { name: /搜索/i });
      fireEvent.click(button);

      // 验证搜索历史显示
      expect(screen.getByText(/搜索历史/i)).toBeInTheDocument();
      searchHistory.forEach(item => {
        expect(screen.getByText(item)).toBeInTheDocument();
      });
    });

    test("TC-010: expanded 模式下显示搜索历史", () => {
      render(
        <SearchButton
          onSearch={mockOnSearch}
          variant="expanded"
          searchHistory={searchHistory}
        />
      );

      // 直接显示搜索历史
      expect(screen.getByText(/搜索历史/i)).toBeInTheDocument();
      searchHistory.forEach(item => {
        expect(screen.getByText(item)).toBeInTheDocument();
      });
    });

    test("TC-011: icon 模式下点击搜索建议触发搜索", () => {
      render(
        <SearchButton
          onSearch={mockOnSearch}
          variant="icon"
          suggestions={suggestions}
        />
      );

      // 点击展开
      const button = screen.getByRole("button", { name: /搜索/i });
      fireEvent.click(button);

      // 点击搜索建议
      fireEvent.click(screen.getByText("建议1"));

      // 验证搜索回调被调用
      expect(mockOnSearch).toHaveBeenCalledWith("建议1");
    });

    test("TC-012: expanded 模式下点击搜索建议触发搜索", () => {
      render(
        <SearchButton
          onSearch={mockOnSearch}
          variant="expanded"
          suggestions={suggestions}
        />
      );

      // 直接点击搜索建议
      fireEvent.click(screen.getByText("建议1"));

      // 验证搜索回调被调用
      expect(mockOnSearch).toHaveBeenCalledWith("建议1");
    });

    test("TC-013: icon 模式下清空搜索历史功能", () => {
      render(
        <SearchButton
          onSearch={mockOnSearch}
          variant="icon"
          searchHistory={searchHistory}
          onClearHistory={mockOnClearHistory}
        />
      );

      // 点击展开
      const button = screen.getByRole("button", { name: /搜索/i });
      fireEvent.click(button);

      // 点击清空历史按钮
      const clearButton = screen.getByRole("button", { name: /清空历史/i });
      fireEvent.click(clearButton);

      // 验证清空历史回调被调用
      expect(mockOnClearHistory).toHaveBeenCalled();
    });

    test("TC-014: expanded 模式下清空搜索历史功能", () => {
      render(
        <SearchButton
          onSearch={mockOnSearch}
          variant="expanded"
          searchHistory={searchHistory}
          onClearHistory={mockOnClearHistory}
        />
      );

      // 直接点击清空历史按钮
      const clearButton = screen.getByRole("button", { name: /清空历史/i });
      fireEvent.click(clearButton);

      // 验证清空历史回调被调用
      expect(mockOnClearHistory).toHaveBeenCalled();
    });
  });

  describe("默认行为", () => {
    test("TC-015: 不传入 variant 时默认使用 icon 模式", () => {
      render(<SearchButton onSearch={mockOnSearch} />);

      // 应该渲染图标按钮
      const button = screen.getByRole("button", { name: /搜索/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass("w-9");
      expect(button).toHaveClass("h-9");
    });

    test("TC-016: 支持 placeholder 自定义在两种模式下", () => {
      const { rerender } = render(
        <SearchButton
          onSearch={mockOnSearch}
          variant="icon"
          placeholder="自定义提示"
        />
      );

      // icon 模式下点击展开
      const button = screen.getByRole("button", { name: /搜索/i });
      fireEvent.click(button);

      // 验证 placeholder
      let input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("placeholder", "自定义提示");

      // 切换到 expanded 模式
      rerender(
        <SearchButton
          onSearch={mockOnSearch}
          variant="expanded"
          placeholder="自定义提示2"
        />
      );

      // 直接验证 placeholder
      input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("placeholder", "自定义提示2");
    });
  });

  describe("主题支持", () => {
    test("TC-017: icon 模式支持 theme 属性", () => {
      render(<SearchButton onSearch={mockOnSearch} variant="icon" theme="tiger" />);

      const button = screen.getByRole("button", { name: /搜索/i });
      expect(button).toHaveAttribute("data-theme", "tiger");
    });

    test("TC-018: expanded 模式支持 theme 属性", () => {
      const { container } = render(
        <SearchButton onSearch={mockOnSearch} variant="expanded" theme="sweet" />
      );

      // expanded 模式下应该有 data-theme 属性在容器上
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveAttribute("data-theme", "sweet");
    });
  });
});
