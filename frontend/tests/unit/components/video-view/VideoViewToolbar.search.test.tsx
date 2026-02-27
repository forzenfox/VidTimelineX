import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { VideoViewToolbar } from "@/components/video-view/VideoViewToolbar";
import type { FilterState } from "@/hooks/types";
import "@testing-library/jest-dom";

describe("VideoViewToolbar 搜索功能测试", () => {
  const mockOnViewModeChange = jest.fn();
  const mockOnFilterChange = jest.fn();
  const mockOnSearch = jest.fn();
  const mockOnClearHistory = jest.fn();

  const defaultFilter: FilterState = {
    duration: "all",
    timeRange: "all",
    sortBy: "newest",
  };

  beforeEach(() => {
    mockOnViewModeChange.mockClear();
    mockOnFilterChange.mockClear();
    mockOnSearch.mockClear();
    mockOnClearHistory.mockClear();
  });

  describe("SearchButton 渲染", () => {
    test("TC-001: VideoViewToolbar 渲染 SearchButton 组件", () => {
      render(
        <VideoViewToolbar
          viewMode="grid"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          onSearch={mockOnSearch}
        />
      );

      // SearchButton 应该存在（直接是输入框）
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    test("TC-002: SearchButton 使用 variant='expanded' 模式", () => {
      render(
        <VideoViewToolbar
          viewMode="grid"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          onSearch={mockOnSearch}
        />
      );

      // expanded 模式下应该直接显示搜索输入框
      const searchInput = screen.getByPlaceholderText(/搜索/i);
      expect(searchInput).toBeInTheDocument();
    });

    test("TC-003: SearchButton 接收 onSearch prop", () => {
      render(
        <VideoViewToolbar
          viewMode="grid"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          onSearch={mockOnSearch}
        />
      );

      const searchInput = screen.getByPlaceholderText(/搜索/i);
      fireEvent.change(searchInput, { target: { value: "测试搜索" } });
      fireEvent.keyDown(searchInput, { key: "Enter" });

      expect(mockOnSearch).toHaveBeenCalledWith("测试搜索");
    });

    test("TC-004: 搜索建议不应再显示", () => {
      const suggestions = ["建议1", "建议2", "建议3"];

      render(
        <VideoViewToolbar
          viewMode="grid"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          onSearch={mockOnSearch}
          searchSuggestions={suggestions}
        />
      );

      // 聚焦输入框
      const searchInput = screen.getByPlaceholderText(/搜索/i);
      fireEvent.focus(searchInput);

      // 搜索建议不应该显示（功能已移除）
      suggestions.forEach(suggestion => {
        expect(screen.queryByText(suggestion)).not.toBeInTheDocument();
      });
    });

    test("TC-005: SearchButton 接收 searchHistory prop", () => {
      const history = ["历史1", "历史2"];

      render(
        <VideoViewToolbar
          viewMode="grid"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          onSearch={mockOnSearch}
          searchHistory={history}
        />
      );

      // 聚焦输入框显示历史
      const searchInput = screen.getByPlaceholderText(/搜索/i);
      fireEvent.focus(searchInput);

      // 搜索历史应该显示
      expect(screen.getByText(/搜索历史/i)).toBeInTheDocument();
      history.forEach(item => {
        expect(screen.getByText(item)).toBeInTheDocument();
      });
    });

    test("TC-006: SearchButton 接收 onClearHistory prop", () => {
      const history = ["历史1", "历史2"];

      render(
        <VideoViewToolbar
          viewMode="grid"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          onSearch={mockOnSearch}
          searchHistory={history}
          onClearHistory={mockOnClearHistory}
        />
      );

      // 聚焦输入框显示历史
      const searchInput = screen.getByPlaceholderText(/搜索/i);
      fireEvent.focus(searchInput);

      // 点击清除历史按钮（按钮文本是"清空"）
      const clearButton = screen.getByText(/清空/i);
      fireEvent.click(clearButton);

      expect(mockOnClearHistory).toHaveBeenCalled();
    });
  });

  describe("搜索功能集成", () => {
    test("TC-007: 搜索输入并回车触发搜索", () => {
      render(
        <VideoViewToolbar
          viewMode="grid"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          onSearch={mockOnSearch}
        />
      );

      const searchInput = screen.getByPlaceholderText(/搜索/i);
      fireEvent.change(searchInput, { target: { value: "甜筒" } });
      fireEvent.keyDown(searchInput, { key: "Enter" });

      expect(mockOnSearch).toHaveBeenCalledWith("甜筒");
    });

    test("TC-008: 点击搜索建议不再触发搜索（功能已移除）", () => {
      const suggestions = ["甜筒直播", "甜筒集锦"];

      render(
        <VideoViewToolbar
          viewMode="grid"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          onSearch={mockOnSearch}
          searchSuggestions={suggestions}
        />
      );

      // 聚焦输入框
      const searchInput = screen.getByPlaceholderText(/搜索/i);
      fireEvent.focus(searchInput);

      // 搜索建议不应该显示
      suggestions.forEach(suggestion => {
        expect(screen.queryByText(suggestion)).not.toBeInTheDocument();
      });
    });

    test("TC-009: 点击搜索历史触发搜索", () => {
      const history = ["之前的搜索"];

      render(
        <VideoViewToolbar
          viewMode="grid"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          onSearch={mockOnSearch}
          searchHistory={history}
        />
      );

      // 聚焦输入框显示历史
      const searchInput = screen.getByPlaceholderText(/搜索/i);
      fireEvent.focus(searchInput);

      const historyItem = screen.getByText("之前的搜索");
      fireEvent.click(historyItem);

      expect(mockOnSearch).toHaveBeenCalledWith("之前的搜索");
    });

    test("TC-010: 搜索框为空时回车不触发搜索", () => {
      render(
        <VideoViewToolbar
          viewMode="grid"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          onSearch={mockOnSearch}
        />
      );

      const searchInput = screen.getByPlaceholderText(/搜索/i);
      fireEvent.change(searchInput, { target: { value: "" } });
      fireEvent.keyDown(searchInput, { key: "Enter" });

      // 空值不会触发搜索
      expect(mockOnSearch).not.toHaveBeenCalled();
    });
  });

  describe("布局测试", () => {
    test("TC-011: 搜索框位于工具栏左侧", () => {
      const { container } = render(
        <VideoViewToolbar
          viewMode="grid"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          onSearch={mockOnSearch}
        />
      );

      const toolbar = container.firstChild as HTMLElement;
      const children = toolbar.children;

      // 第一个子元素应该是搜索框容器
      expect(children[0]).toBeInTheDocument();
      // 搜索框在容器内部
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    test("TC-012: 工具栏包含所有子组件", () => {
      render(
        <VideoViewToolbar
          viewMode="grid"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          onSearch={mockOnSearch}
        />
      );

      // 搜索输入框
      expect(screen.getByRole("textbox")).toBeInTheDocument();
      // 视图切换
      expect(screen.getByRole("group")).toBeInTheDocument();
      // 筛选按钮
      expect(screen.getByRole("button", { name: /筛选/i })).toBeInTheDocument();
      // 排序按钮
      expect(screen.getByRole("button", { name: /最新发布/i })).toBeInTheDocument();
    });
  });

  describe("可选 props 处理", () => {
    test("TC-013: 不传搜索 props 时不渲染 SearchButton", () => {
      render(
        <VideoViewToolbar
          viewMode="grid"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
        />
      );

      // 不应该渲染搜索输入框
      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    });

    test("TC-014: 仅传 onSearch 时渲染 SearchButton", () => {
      render(
        <VideoViewToolbar
          viewMode="grid"
          onViewModeChange={mockOnViewModeChange}
          filter={defaultFilter}
          onFilterChange={mockOnFilterChange}
          onSearch={mockOnSearch}
        />
      );

      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });
  });
});
