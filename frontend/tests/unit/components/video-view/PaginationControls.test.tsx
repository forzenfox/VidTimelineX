import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { PaginationControls } from "@/components/video-view/PaginationControls";
import "@testing-library/jest-dom";

describe("PaginationControls 组件测试", () => {
  const mockOnPageChange = jest.fn();
  const mockOnPageSizeChange = jest.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
    mockOnPageSizeChange.mockClear();
  });

  describe("TC-001: 渲染测试", () => {
    test("正确渲染分页控件", () => {
      render(
        <PaginationControls
          currentPage={1}
          totalPages={5}
          pageSize={12}
          totalItems={50}
          onPageChange={mockOnPageChange}
          onPageSizeChange={mockOnPageSizeChange}
        />
      );

      expect(screen.getByRole("navigation")).toBeInTheDocument();
      expect(screen.getByText(/共 50 条/i)).toBeInTheDocument();
    });

    test("单页时不渲染分页控件", () => {
      const { container } = render(
        <PaginationControls
          currentPage={1}
          totalPages={1}
          pageSize={12}
          totalItems={10}
          onPageChange={mockOnPageChange}
          onPageSizeChange={mockOnPageSizeChange}
        />
      );

      expect(container.firstChild).toBeNull();
    });

    test("空数据时不渲染分页控件", () => {
      const { container } = render(
        <PaginationControls
          currentPage={1}
          totalPages={0}
          pageSize={12}
          totalItems={0}
          onPageChange={mockOnPageChange}
          onPageSizeChange={mockOnPageSizeChange}
        />
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe("TC-002: 页码导航测试", () => {
    test("点击页码切换到对应页", () => {
      render(
        <PaginationControls
          currentPage={1}
          totalPages={5}
          pageSize={12}
          totalItems={50}
          onPageChange={mockOnPageChange}
          onPageSizeChange={mockOnPageSizeChange}
        />
      );

      const page3Button = screen.getByRole("button", { name: "第 3 页" });
      fireEvent.click(page3Button);

      expect(mockOnPageChange).toHaveBeenCalledWith(3);
    });

    test("点击下一页按钮", () => {
      render(
        <PaginationControls
          currentPage={1}
          totalPages={5}
          pageSize={12}
          totalItems={50}
          onPageChange={mockOnPageChange}
          onPageSizeChange={mockOnPageSizeChange}
        />
      );

      const nextButton = screen.getByRole("button", { name: /下一页/i });
      fireEvent.click(nextButton);

      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });

    test("点击上一页按钮", () => {
      render(
        <PaginationControls
          currentPage={3}
          totalPages={5}
          pageSize={12}
          totalItems={50}
          onPageChange={mockOnPageChange}
          onPageSizeChange={mockOnPageSizeChange}
        />
      );

      const prevButton = screen.getByRole("button", { name: /上一页/i });
      fireEvent.click(prevButton);

      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });

    test("第一页时上一页按钮禁用", () => {
      render(
        <PaginationControls
          currentPage={1}
          totalPages={5}
          pageSize={12}
          totalItems={50}
          onPageChange={mockOnPageChange}
          onPageSizeChange={mockOnPageSizeChange}
        />
      );

      const prevButton = screen.getByRole("button", { name: /上一页/i });
      expect(prevButton).toBeDisabled();
    });

    test("最后一页时下一页按钮禁用", () => {
      render(
        <PaginationControls
          currentPage={5}
          totalPages={5}
          pageSize={12}
          totalItems={50}
          onPageChange={mockOnPageChange}
          onPageSizeChange={mockOnPageSizeChange}
        />
      );

      const nextButton = screen.getByRole("button", { name: /下一页/i });
      expect(nextButton).toBeDisabled();
    });
  });

  describe("TC-003: 每页数量选择测试", () => {
    test("渲染每页数量选择器", () => {
      render(
        <PaginationControls
          currentPage={1}
          totalPages={5}
          pageSize={12}
          totalItems={50}
          onPageChange={mockOnPageChange}
          onPageSizeChange={mockOnPageSizeChange}
        />
      );

      expect(screen.getByLabelText(/每页显示/i)).toBeInTheDocument();
    });

    test("切换每页数量触发回调", () => {
      render(
        <PaginationControls
          currentPage={1}
          totalPages={5}
          pageSize={12}
          totalItems={50}
          onPageChange={mockOnPageChange}
          onPageSizeChange={mockOnPageSizeChange}
        />
      );

      const select = screen.getByLabelText(/每页显示/i);
      fireEvent.change(select, { target: { value: "24" } });

      expect(mockOnPageSizeChange).toHaveBeenCalledWith(24);
    });
  });

  describe("TC-004: 页码显示逻辑测试", () => {
    test("当前页高亮显示", () => {
      render(
        <PaginationControls
          currentPage={3}
          totalPages={5}
          pageSize={12}
          totalItems={50}
          onPageChange={mockOnPageChange}
          onPageSizeChange={mockOnPageSizeChange}
        />
      );

      const currentPageButton = screen.getByRole("button", { name: "第 3 页" });
      expect(currentPageButton).toHaveAttribute("data-active", "true");
    });

    test("显示省略号当页数过多", () => {
      render(
        <PaginationControls
          currentPage={5}
          totalPages={10}
          pageSize={12}
          totalItems={120}
          onPageChange={mockOnPageChange}
          onPageSizeChange={mockOnPageSizeChange}
        />
      );

      const ellipsis = screen.getAllByText("...");
      expect(ellipsis.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("TC-005: 信息显示测试", () => {
    test("显示总条数信息", () => {
      render(
        <PaginationControls
          currentPage={1}
          totalPages={5}
          pageSize={12}
          totalItems={50}
          onPageChange={mockOnPageChange}
          onPageSizeChange={mockOnPageSizeChange}
        />
      );

      expect(screen.getByText(/共 50 条/i)).toBeInTheDocument();
    });

    test("显示当前范围信息", () => {
      render(
        <PaginationControls
          currentPage={2}
          totalPages={5}
          pageSize={12}
          totalItems={50}
          onPageChange={mockOnPageChange}
          onPageSizeChange={mockOnPageSizeChange}
        />
      );

      expect(screen.getByText(/13-24/i)).toBeInTheDocument();
    });
  });
});
