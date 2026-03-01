import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import "@testing-library/jest-dom";

describe("Tabs组件测试", () => {
  /**
   * 测试用例 TC-001: 组件渲染测试
   * 测试目标：验证Tabs组件及其子组件能够正确渲染
   */
  test("TC-001: 组件渲染测试", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">标签1</TabsTrigger>
          <TabsTrigger value="tab2">标签2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">内容1</TabsContent>
        <TabsContent value="tab2">内容2</TabsContent>
      </Tabs>
    );

    // 验证 Tabs 容器渲染 - 使用 data-slot 属性查询
    expect(screen.getByRole("tablist").parentElement).toHaveAttribute("data-slot", "tabs");
    // 验证 TabsList 渲染
    expect(screen.getByRole("tablist")).toHaveAttribute("data-slot", "tabs-list");
    // 验证 TabsTrigger 渲染
    expect(screen.getByText("标签1")).toBeInTheDocument();
    expect(screen.getByText("标签2")).toBeInTheDocument();
    // 验证默认选中的内容渲染
    expect(screen.getByText("内容1")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-002: Tab切换交互测试
   * 测试目标：验证点击Tab能够切换显示对应的内容
   */
  test("TC-002: Tab切换交互测试", async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">标签1</TabsTrigger>
          <TabsTrigger value="tab2">标签2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">内容1</TabsContent>
        <TabsContent value="tab2">内容2</TabsContent>
      </Tabs>
    );

    // 初始状态：内容1可见
    expect(screen.getByText("内容1")).toBeVisible();
    // 验证标签1处于active状态
    expect(screen.getByText("标签1")).toHaveAttribute("data-state", "active");
    expect(screen.getByText("标签2")).toHaveAttribute("data-state", "inactive");

    // 点击标签2
    const tab2Trigger = screen.getByText("标签2");
    await user.click(tab2Trigger);

    // 验证标签状态切换
    await waitFor(() => {
      expect(tab2Trigger).toHaveAttribute("data-state", "active");
    });
    expect(screen.getByText("标签1")).toHaveAttribute("data-state", "inactive");
  });

  /**
   * 测试用例 TC-003: 默认选中Tab测试
   * 测试目标：验证默认选中的Tab能够正确显示
   */
  test("TC-003: 默认选中Tab测试", () => {
    render(
      <Tabs defaultValue="tab2">
        <TabsList>
          <TabsTrigger value="tab1">标签1</TabsTrigger>
          <TabsTrigger value="tab2">标签2</TabsTrigger>
          <TabsTrigger value="tab3">标签3</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">内容1</TabsContent>
        <TabsContent value="tab2">内容2</TabsContent>
        <TabsContent value="tab3">内容3</TabsContent>
      </Tabs>
    );

    // 验证默认选中 tab2
    expect(screen.getByText("标签2")).toHaveAttribute("data-state", "active");
    expect(screen.getByText("标签1")).toHaveAttribute("data-state", "inactive");
    expect(screen.getByText("标签3")).toHaveAttribute("data-state", "inactive");

    // 验证内容2可见
    expect(screen.getByText("内容2")).toBeVisible();
  });

  /**
   * 测试用例 TC-004: 自定义类名测试
   * 测试目标：验证自定义类名能够正确应用到组件
   */
  test("TC-004: 自定义类名测试", () => {
    render(
      <Tabs defaultValue="tab1" className="custom-tabs-class">
        <TabsList className="custom-list-class">
          <TabsTrigger value="tab1" className="custom-trigger-class">
            标签1
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" className="custom-content-class">
          内容1
        </TabsContent>
      </Tabs>
    );

    // 验证自定义类名已应用 - 使用 data-slot 属性定位元素
    const tabsContainer = screen.getByRole("tablist").parentElement;
    expect(tabsContainer).toHaveClass("custom-tabs-class");
    expect(tabsContainer).toHaveAttribute("data-slot", "tabs");

    const tabsList = screen.getByRole("tablist");
    expect(tabsList).toHaveClass("custom-list-class");
    expect(tabsList).toHaveAttribute("data-slot", "tabs-list");

    const tabsTrigger = screen.getByText("标签1");
    expect(tabsTrigger).toHaveClass("custom-trigger-class");
    expect(tabsTrigger).toHaveAttribute("data-slot", "tabs-trigger");

    const tabsContent = screen.getByText("内容1");
    expect(tabsContent).toHaveClass("custom-content-class");
    expect(tabsContent).toHaveAttribute("data-slot", "tabs-content");
  });

  /**
   * 测试用例 TC-005: 禁用Tab测试
   * 测试目标：验证禁用的Tab无法被点击切换
   */
  test("TC-005: 禁用Tab测试", async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">标签1</TabsTrigger>
          <TabsTrigger value="tab2" disabled>
            标签2
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">内容1</TabsContent>
        <TabsContent value="tab2">内容2</TabsContent>
      </Tabs>
    );

    const tab2Trigger = screen.getByText("标签2");

    // 验证标签2被禁用
    expect(tab2Trigger).toBeDisabled();

    // 尝试点击禁用的标签
    await user.click(tab2Trigger);

    // 验证内容没有切换，标签1仍然处于active状态
    expect(screen.getByText("标签1")).toHaveAttribute("data-state", "active");
    expect(tab2Trigger).toHaveAttribute("data-state", "inactive");
    // 验证内容1仍然可见
    expect(screen.getByText("内容1")).toBeVisible();
  });

  /**
   * 测试用例 TC-006: 多个Tab切换测试
   * 测试目标：验证多个Tab之间能够正常切换
   */
  test("TC-006: 多个Tab切换测试", async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">标签1</TabsTrigger>
          <TabsTrigger value="tab2">标签2</TabsTrigger>
          <TabsTrigger value="tab3">标签3</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">内容1</TabsContent>
        <TabsContent value="tab2">内容2</TabsContent>
        <TabsContent value="tab3">内容3</TabsContent>
      </Tabs>
    );

    // 初始状态验证
    expect(screen.getByText("标签1")).toHaveAttribute("data-state", "active");
    expect(screen.getByText("内容1")).toBeVisible();

    // 切换到标签2
    await user.click(screen.getByText("标签2"));
    await waitFor(() => {
      expect(screen.getByText("标签2")).toHaveAttribute("data-state", "active");
    });
    expect(screen.getByText("标签1")).toHaveAttribute("data-state", "inactive");
    expect(screen.getByText("标签3")).toHaveAttribute("data-state", "inactive");

    // 切换到标签3
    await user.click(screen.getByText("标签3"));
    await waitFor(() => {
      expect(screen.getByText("标签3")).toHaveAttribute("data-state", "active");
    });
    expect(screen.getByText("标签1")).toHaveAttribute("data-state", "inactive");
    expect(screen.getByText("标签2")).toHaveAttribute("data-state", "inactive");

    // 切换回标签1
    await user.click(screen.getByText("标签1"));
    await waitFor(() => {
      expect(screen.getByText("标签1")).toHaveAttribute("data-state", "active");
    });
    expect(screen.getByText("标签2")).toHaveAttribute("data-state", "inactive");
    expect(screen.getByText("标签3")).toHaveAttribute("data-state", "inactive");
  });
});
