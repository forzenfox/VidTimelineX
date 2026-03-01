import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import "@testing-library/jest-dom";

describe("Sheet组件测试", () => {
  /**
   * 测试用例 TC-001: 组件渲染测试
   * 测试目标：验证Sheet组件及其子组件能够正确渲染
   */
  test("TC-001: 组件渲染测试", () => {
    render(
      <Sheet>
        <SheetTrigger>打开面板</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>面板标题</SheetTitle>
            <SheetDescription>面板描述</SheetDescription>
          </SheetHeader>
          <div>面板内容</div>
          <SheetFooter>
            <button>确认</button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );

    // 验证 Sheet 容器渲染 - Sheet 使用 DialogPrimitive.Root 可能不直接渲染到 DOM
    // 但我们能验证触发按钮存在即可
    expect(screen.getByText("打开面板")).toBeInTheDocument();

    // 验证 SheetTrigger 渲染 - 通过 data-slot 属性查询
    const trigger = document.querySelector("[data-slot='sheet-trigger']");
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveTextContent("打开面板");
  });

  /**
   * 测试用例 TC-002: 打开/关闭交互测试
   * 测试目标：验证点击触发按钮能够打开Sheet，点击关闭按钮能够关闭Sheet
   */
  test("TC-002: 打开/关闭交互测试", async () => {
    const user = userEvent.setup();

    render(
      <Sheet>
        <SheetTrigger>打开面板</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>测试标题</SheetTitle>
          </SheetHeader>
          <div>测试内容</div>
        </SheetContent>
      </Sheet>
    );

    const triggerButton = screen.getByText("打开面板");

    // 点击触发按钮打开面板
    await user.click(triggerButton);

    // 等待面板内容渲染
    await waitFor(() => {
      expect(screen.getByText("测试标题")).toBeInTheDocument();
      expect(screen.getByText("测试内容")).toBeInTheDocument();
    });

    // 验证面板内容具有正确的 data-slot 属性
    const sheetContent = document.querySelector("[data-slot='sheet-content']");
    expect(sheetContent).toBeInTheDocument();

    // 点击关闭按钮（X按钮）
    const closeButton = screen.getByText("Close").parentElement;
    await user.click(closeButton!);

    // 验证面板已关闭
    await waitFor(() => {
      expect(screen.queryByText("测试标题")).not.toBeInTheDocument();
    });
  });

  /**
   * 测试用例 TC-003: 右侧位置测试
   * 测试目标：验证side="right"时Sheet从右侧滑出
   */
  test("TC-003: 右侧位置测试", async () => {
    const user = userEvent.setup();

    render(
      <Sheet>
        <SheetTrigger>打开右侧面板</SheetTrigger>
        <SheetContent side="right">
          <SheetTitle>右侧面板</SheetTitle>
        </SheetContent>
      </Sheet>
    );

    // 打开面板
    await user.click(screen.getByText("打开右侧面板"));

    // 验证面板从右侧滑出
    await waitFor(() => {
      const sheetContent = document.querySelector("[data-slot='sheet-content']");
      expect(sheetContent).toBeInTheDocument();
      expect(sheetContent).toHaveClass("right-0");
      expect(sheetContent).toHaveClass("border-l");
    });
  });

  /**
   * 测试用例 TC-004: 左侧位置测试
   * 测试目标：验证side="left"时Sheet从左侧滑出
   */
  test("TC-004: 左侧位置测试", async () => {
    const user = userEvent.setup();

    render(
      <Sheet>
        <SheetTrigger>打开左侧面板</SheetTrigger>
        <SheetContent side="left">
          <SheetTitle>左侧面板</SheetTitle>
        </SheetContent>
      </Sheet>
    );

    // 打开面板
    await user.click(screen.getByText("打开左侧面板"));

    // 验证面板从左侧滑出
    await waitFor(() => {
      const sheetContent = document.querySelector("[data-slot='sheet-content']");
      expect(sheetContent).toBeInTheDocument();
      expect(sheetContent).toHaveClass("left-0");
      expect(sheetContent).toHaveClass("border-r");
    });
  });

  /**
   * 测试用例 TC-005: 顶部位置测试
   * 测试目标：验证side="top"时Sheet从顶部滑出
   */
  test("TC-005: 顶部位置测试", async () => {
    const user = userEvent.setup();

    render(
      <Sheet>
        <SheetTrigger>打开顶部面板</SheetTrigger>
        <SheetContent side="top">
          <SheetTitle>顶部面板</SheetTitle>
        </SheetContent>
      </Sheet>
    );

    // 打开面板
    await user.click(screen.getByText("打开顶部面板"));

    // 验证面板从顶部滑出
    await waitFor(() => {
      const sheetContent = document.querySelector("[data-slot='sheet-content']");
      expect(sheetContent).toBeInTheDocument();
      expect(sheetContent).toHaveClass("top-0");
      expect(sheetContent).toHaveClass("border-b");
    });
  });

  /**
   * 测试用例 TC-006: 底部位置测试
   * 测试目标：验证side="bottom"时Sheet从底部滑出
   */
  test("TC-006: 底部位置测试", async () => {
    const user = userEvent.setup();

    render(
      <Sheet>
        <SheetTrigger>打开底部面板</SheetTrigger>
        <SheetContent side="bottom">
          <SheetTitle>底部面板</SheetTitle>
        </SheetContent>
      </Sheet>
    );

    // 打开面板
    await user.click(screen.getByText("打开底部面板"));

    // 验证面板从底部滑出
    await waitFor(() => {
      const sheetContent = document.querySelector("[data-slot='sheet-content']");
      expect(sheetContent).toBeInTheDocument();
      expect(sheetContent).toHaveClass("bottom-0");
      expect(sheetContent).toHaveClass("border-t");
    });
  });

  /**
   * 测试用例 TC-007: 自定义类名测试
   * 测试目标：验证Sheet组件能够正确应用自定义类名
   */
  test("TC-007: 自定义类名测试", async () => {
    const user = userEvent.setup();

    render(
      <Sheet>
        <SheetTrigger className="custom-trigger-class">触发器</SheetTrigger>
        <SheetContent className="custom-content-class">
          <SheetHeader className="custom-header-class">
            <SheetTitle className="custom-title-class">自定义标题</SheetTitle>
            <SheetDescription className="custom-description-class">
              自定义描述
            </SheetDescription>
          </SheetHeader>
          <SheetFooter className="custom-footer-class">
            <button>按钮</button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );

    // 验证触发按钮具有自定义类名
    const trigger = document.querySelector("[data-slot='sheet-trigger']");
    expect(trigger).toHaveClass("custom-trigger-class");

    // 打开面板
    await user.click(screen.getByText("触发器"));

    // 等待并验证内容具有自定义类名
    await waitFor(() => {
      const content = document.querySelector("[data-slot='sheet-content']");
      expect(content).toHaveClass("custom-content-class");

      const header = document.querySelector("[data-slot='sheet-header']");
      expect(header).toHaveClass("custom-header-class");

      const title = document.querySelector("[data-slot='sheet-title']");
      expect(title).toHaveClass("custom-title-class");

      const description = document.querySelector("[data-slot='sheet-description']");
      expect(description).toHaveClass("custom-description-class");

      const footer = document.querySelector("[data-slot='sheet-footer']");
      expect(footer).toHaveClass("custom-footer-class");
    });
  });

  /**
   * 测试用例 TC-008: SheetClose按钮功能测试
   * 测试目标：验证SheetClose组件能够正确关闭面板
   */
  test("TC-008: SheetClose按钮功能测试", async () => {
    const user = userEvent.setup();

    render(
      <Sheet>
        <SheetTrigger>打开面板</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>面板标题</SheetTitle>
          </SheetHeader>
          <div>面板内容</div>
          <SheetFooter>
            <SheetClose asChild>
              <button className="close-btn">关闭按钮</button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );

    // 打开面板
    await user.click(screen.getByText("打开面板"));

    // 等待面板打开
    await waitFor(() => {
      expect(screen.getByText("面板标题")).toBeInTheDocument();
    });

    // 点击自定义关闭按钮
    const closeBtn = screen.getByText("关闭按钮");
    await user.click(closeBtn);

    // 验证面板已关闭
    await waitFor(() => {
      expect(screen.queryByText("面板标题")).not.toBeInTheDocument();
    });
  });

  /**
   * 测试用例 TC-009: 默认打开状态测试
   * 测试目标：验证Sheet能够正确渲染默认打开状态
   */
  test("TC-009: 默认打开状态测试", async () => {
    render(
      <Sheet defaultOpen>
        <SheetTrigger>触发器</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>默认打开的面板</SheetTitle>
            <SheetDescription>这是描述</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );

    // 等待面板渲染
    await waitFor(() => {
      expect(screen.getByText("默认打开的面板")).toBeInTheDocument();
      expect(screen.getByText("这是描述")).toBeInTheDocument();
    });

    // 验证面板具有正确的 data-slot 属性
    const sheetContent = document.querySelector("[data-slot='sheet-content']");
    expect(sheetContent).toBeInTheDocument();

    // 验证遮罩层具有正确的 data-slot 属性
    const sheetOverlay = document.querySelector("[data-slot='sheet-overlay']");
    expect(sheetOverlay).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-010: 受控组件测试
   * 测试目标：验证Sheet作为受控组件能够正确响应open状态变化
   */
  test("TC-010: 受控组件测试", async () => {
    const user = userEvent.setup();

    const TestControlledSheet = () => {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>外部打开</button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>受控面板</SheetTitle>
              </SheetHeader>
              <div>内容</div>
            </SheetContent>
          </Sheet>
        </>
      );
    };

    render(<TestControlledSheet />);

    // 初始状态下面板未打开
    expect(screen.queryByText("受控面板")).not.toBeInTheDocument();

    // 通过外部按钮打开面板
    await user.click(screen.getByText("外部打开"));

    // 验证面板已打开
    await waitFor(() => {
      expect(screen.getByText("受控面板")).toBeInTheDocument();
    });

    // 点击关闭按钮
    const closeButton = screen.getByText("Close").parentElement;
    await user.click(closeButton!);

    // 验证面板已关闭
    await waitFor(() => {
      expect(screen.queryByText("受控面板")).not.toBeInTheDocument();
    });
  });
});
