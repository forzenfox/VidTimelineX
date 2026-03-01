import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from "@/components/ui/dropdown-menu";
import "@testing-library/jest-dom";

/**
 * DropdownMenu组件单元测试
 * 测试范围：DropdownMenu及其所有子组件
 */
describe("DropdownMenu组件测试", () => {
  const mockOnClick = jest.fn();
  const mockOnCheckedChange = jest.fn();
  const mockOnValueChange = jest.fn();

  beforeEach(() => {
    // 每个测试前清理DOM，避免Portal残留
    document.body.innerHTML = "";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * 测试用例 TC-001: 组件渲染测试
   * 测试目标：验证DropdownMenu及其所有子组件能够正确渲染
   */
  test("TC-001: 组件渲染测试", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger data-testid="trigger">打开菜单</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>菜单标题</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>菜单项1</DropdownMenuItem>
            <DropdownMenuItem>菜单项2</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    // 验证触发按钮渲染
    expect(screen.getByTestId("trigger")).toBeInTheDocument();
    expect(screen.getByText("打开菜单")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-002: 下拉菜单打开/关闭交互测试
   * 测试目标：验证点击触发按钮能够打开下拉菜单
   */
  test("TC-002: 下拉菜单打开/关闭交互测试", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger data-testid="trigger">打开菜单</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>菜单项</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    const trigger = screen.getByTestId("trigger");

    // 点击打开菜单
    await user.click(trigger);

    // 等待菜单内容出现在body中（Portal渲染）
    await waitFor(() => {
      const menuItems = document.querySelectorAll('[data-slot="dropdown-menu-item"]');
      expect(menuItems.length).toBeGreaterThan(0);
    });

    // 验证菜单项文本
    expect(screen.getByText("菜单项")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-003: Item点击事件测试
   * 测试目标：验证点击DropdownMenuItem能够触发onClick回调
   */
  test("TC-003: Item点击事件测试", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger data-testid="trigger">打开菜单</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={mockOnClick}>点击项</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    // 打开菜单
    await user.click(screen.getByTestId("trigger"));

    // 等待菜单项出现并点击
    await waitFor(() => {
      const menuItem = screen.getByText("点击项");
      expect(menuItem).toBeInTheDocument();
    });

    const menuItem = screen.getByText("点击项");
    await user.click(menuItem);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  /**
   * 测试用例 TC-004: Checkbox状态测试
   * 测试目标：验证DropdownMenuCheckboxItem能够正确显示和切换选中状态
   */
  test("TC-004: Checkbox状态测试", async () => {
    const user = userEvent.setup();

    const { rerender } = render(
      <DropdownMenu>
        <DropdownMenuTrigger data-testid="trigger">打开菜单</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem
            checked={false}
            onCheckedChange={mockOnCheckedChange}
            data-testid="checkbox-item"
          >
            复选框项
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    // 打开菜单
    await user.click(screen.getByTestId("trigger"));

    // 等待复选框项出现
    await waitFor(() => {
      expect(screen.getByText("复选框项")).toBeInTheDocument();
    });

    // 点击复选框项
    const checkboxItem = screen.getByTestId("checkbox-item");
    await user.click(checkboxItem);

    expect(mockOnCheckedChange).toHaveBeenCalledTimes(1);

    // 测试选中状态渲染
    rerender(
      <DropdownMenu>
        <DropdownMenuTrigger data-testid="trigger">打开菜单</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem
            checked={true}
            onCheckedChange={mockOnCheckedChange}
            data-testid="checkbox-item"
          >
            复选框项
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    // 重新打开菜单
    await user.click(screen.getByTestId("trigger"));

    await waitFor(() => {
      expect(screen.getByText("复选框项")).toBeInTheDocument();
    });
  });

  /**
   * 测试用例 TC-005: Radio状态测试
   * 测试目标：验证DropdownMenuRadioItem和DropdownMenuRadioGroup能够正确处理单选状态
   */
  test("TC-005: Radio状态测试", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger data-testid="trigger">打开菜单</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value="option1" onValueChange={mockOnValueChange}>
            <DropdownMenuRadioItem value="option1" data-testid="radio-1">选项1</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="option2" data-testid="radio-2">选项2</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    // 打开菜单
    await user.click(screen.getByTestId("trigger"));

    // 等待单选项出现
    await waitFor(() => {
      expect(screen.getByText("选项1")).toBeInTheDocument();
      expect(screen.getByText("选项2")).toBeInTheDocument();
    });

    // 点击选项2
    const option2 = screen.getByTestId("radio-2");
    await user.click(option2);

    expect(mockOnValueChange).toHaveBeenCalledWith("option2");
  });

  /**
   * 测试用例 TC-006: 自定义类名测试
   * 测试目标：验证组件能够正确应用自定义className
   */
  test("TC-006: 自定义类名测试", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger className="custom-trigger-class" data-testid="trigger">
          打开菜单
        </DropdownMenuTrigger>
        <DropdownMenuContent className="custom-content-class">
          <DropdownMenuItem className="custom-item-class" data-testid="menu-item">
            菜单项
          </DropdownMenuItem>
          <DropdownMenuLabel className="custom-label-class">标签</DropdownMenuLabel>
          <DropdownMenuSeparator className="custom-separator-class" />
        </DropdownMenuContent>
      </DropdownMenu>
    );

    // 验证触发按钮的自定义类名
    const trigger = screen.getByTestId("trigger");
    expect(trigger).toHaveClass("custom-trigger-class");

    // 打开菜单
    await user.click(trigger);

    // 等待并验证菜单项的自定义类名
    await waitFor(() => {
      const menuItem = screen.getByTestId("menu-item");
      expect(menuItem).toHaveClass("custom-item-class");
    });
  });

  /**
   * 测试用例 TC-007: 子菜单渲染测试
   * 测试目标：验证DropdownMenuSub、DropdownMenuSubTrigger和DropdownMenuSubContent能够正确渲染
   */
  test("TC-007: 子菜单渲染测试", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger data-testid="trigger">打开菜单</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger data-testid="sub-trigger">子菜单</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>子菜单项</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    // 打开主菜单
    await user.click(screen.getByTestId("trigger"));

    // 等待子菜单触发器出现
    await waitFor(() => {
      expect(screen.getByText("子菜单")).toBeInTheDocument();
    });

    // 验证子菜单触发器存在
    const subTrigger = screen.getByTestId("sub-trigger");
    expect(subTrigger).toBeInTheDocument();
    expect(subTrigger).toHaveAttribute("data-slot", "dropdown-menu-sub-trigger");
  });

  /**
   * 测试用例 TC-008: DropdownMenuShortcut渲染测试
   * 测试目标：验证DropdownMenuShortcut能够正确渲染快捷键
   */
  test("TC-008: DropdownMenuShortcut渲染测试", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger data-testid="trigger">打开菜单</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            复制
            <DropdownMenuShortcut>Ctrl+C</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            粘贴
            <DropdownMenuShortcut className="custom-shortcut">Ctrl+V</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    // 打开菜单
    await user.click(screen.getByTestId("trigger"));

    // 等待快捷键出现
    await waitFor(() => {
      expect(screen.getByText("Ctrl+C")).toBeInTheDocument();
      expect(screen.getByText("Ctrl+V")).toBeInTheDocument();
    });

    // 验证快捷键文本
    const shortcut1 = screen.getByText("Ctrl+C");
    const shortcut2 = screen.getByText("Ctrl+V");

    expect(shortcut1).toHaveAttribute("data-slot", "dropdown-menu-shortcut");
    expect(shortcut2).toHaveClass("custom-shortcut");
  });

  /**
   * 测试用例 TC-009: Item变体和inset属性测试
   * 测试目标：验证DropdownMenuItem的variant和inset属性能够正确应用
   */
  test("TC-009: Item变体和inset属性测试", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger data-testid="trigger">打开菜单</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem variant="default" data-testid="default-item">
            默认项
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" data-testid="destructive-item">
            危险项
          </DropdownMenuItem>
          <DropdownMenuItem inset data-testid="inset-item">
            缩进项
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    // 打开菜单
    await user.click(screen.getByTestId("trigger"));

    // 等待菜单项出现
    await waitFor(() => {
      expect(screen.getByTestId("default-item")).toBeInTheDocument();
    });

    // 验证不同变体的菜单项
    const defaultItem = screen.getByTestId("default-item");
    const destructiveItem = screen.getByTestId("destructive-item");
    const insetItem = screen.getByTestId("inset-item");

    expect(defaultItem).toHaveAttribute("data-variant", "default");
    expect(destructiveItem).toHaveAttribute("data-variant", "destructive");
    expect(insetItem).toHaveAttribute("data-inset", "true");
  });

  /**
   * 测试用例 TC-010: data-slot属性测试
   * 测试目标：验证所有组件具有正确的data-slot属性
   */
  test("TC-010: data-slot属性测试", async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger data-testid="trigger">打开菜单</DropdownMenuTrigger>
        <DropdownMenuContent data-testid="content">
          <DropdownMenuLabel data-testid="label">标签</DropdownMenuLabel>
          <DropdownMenuSeparator data-testid="separator" />
          <DropdownMenuGroup data-testid="group">
            <DropdownMenuItem data-testid="item">菜单项</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    // 验证触发器的data-slot属性
    const trigger = screen.getByTestId("trigger");
    expect(trigger).toHaveAttribute("data-slot", "dropdown-menu-trigger");

    // 打开菜单
    await user.click(trigger);

    // 验证其他组件的data-slot属性
    await waitFor(() => {
      expect(screen.getByTestId("item")).toHaveAttribute("data-slot", "dropdown-menu-item");
    });

    expect(screen.getByTestId("label")).toHaveAttribute("data-slot", "dropdown-menu-label");
    expect(screen.getByTestId("separator")).toHaveAttribute("data-slot", "dropdown-menu-separator");
    expect(screen.getByTestId("group")).toHaveAttribute("data-slot", "dropdown-menu-group");
  });
});
