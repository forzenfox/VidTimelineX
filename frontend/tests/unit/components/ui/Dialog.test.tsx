import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import "@testing-library/jest-dom";

describe("Dialog组件测试", () => {
  /**
   * 测试用例 TC-001: 组件渲染测试
   * 测试目标：验证Dialog组件及其子组件能够正确渲染
   */
  test("TC-001: 组件渲染测试", () => {
    render(
      <Dialog>
        <DialogTrigger>打开对话框</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>对话框标题</DialogTitle>
            <DialogDescription>对话框描述</DialogDescription>
          </DialogHeader>
          <div>对话框内容</div>
          <DialogFooter>
            <button>确认</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    // 验证触发按钮已渲染
    expect(screen.getByText("打开对话框")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-002: Dialog打开/关闭交互测试
   * 测试目标：验证点击触发按钮能够打开Dialog，点击关闭按钮能够关闭Dialog
   */
  test("TC-002: Dialog打开/关闭交互测试", async () => {
    render(
      <Dialog>
        <DialogTrigger>打开对话框</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>测试标题</DialogTitle>
          </DialogHeader>
          <div>测试内容</div>
        </DialogContent>
      </Dialog>
    );

    const triggerButton = screen.getByText("打开对话框");

    // 点击触发按钮打开对话框
    fireEvent.click(triggerButton);

    // 等待对话框内容渲染
    await waitFor(() => {
      expect(screen.getByText("测试标题")).toBeInTheDocument();
      expect(screen.getByText("测试内容")).toBeInTheDocument();
    });

    // 验证对话框内容具有正确的 data-slot 属性
    const dialogContent = screen.getByText("测试内容").closest("[data-slot='dialog-content']");
    expect(dialogContent).toBeInTheDocument();

    // 点击关闭按钮（X按钮）
    const closeButton = screen.getByText("Close").parentElement;
    fireEvent.click(closeButton!);

    // 验证对话框已关闭
    await waitFor(() => {
      expect(screen.queryByText("测试标题")).not.toBeInTheDocument();
    });
  });

  /**
   * 测试用例 TC-003: 自定义类名测试
   * 测试目标：验证Dialog组件能够正确应用自定义类名
   */
  test("TC-003: 自定义类名测试", async () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <button className="custom-trigger-class">触发器</button>
        </DialogTrigger>
        <DialogContent className="custom-content-class">
          <DialogHeader className="custom-header-class">
            <DialogTitle className="custom-title-class">自定义标题</DialogTitle>
          </DialogHeader>
          <DialogFooter className="custom-footer-class">
            <button>按钮</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    // 验证触发按钮具有自定义类名
    const trigger = screen.getByText("触发器");
    expect(trigger).toHaveClass("custom-trigger-class");

    // 打开对话框
    fireEvent.click(trigger);

    // 等待并验证内容具有自定义类名
    await waitFor(() => {
      const content = screen.getByText("自定义标题").closest("[data-slot='dialog-content']");
      expect(content).toHaveClass("custom-content-class");

      const header = screen.getByText("自定义标题").closest("[data-slot='dialog-header']");
      expect(header).toHaveClass("custom-header-class");

      const title = screen.getByText("自定义标题");
      expect(title).toHaveClass("custom-title-class");

      const footer = screen.getByText("按钮").closest("[data-slot='dialog-footer']");
      expect(footer).toHaveClass("custom-footer-class");
    });
  });

  /**
   * 测试用例 TC-004: Header/Footer/Title/Description渲染测试
   * 测试目标：验证Dialog的各个子组件能够正确渲染
   */
  test("TC-004: Header/Footer/Title/Description渲染测试", async () => {
    render(
      <Dialog>
        <DialogTrigger>打开</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>标题文本</DialogTitle>
            <DialogDescription>描述文本</DialogDescription>
          </DialogHeader>
          <div>主要内容</div>
          <DialogFooter>
            <button>取消</button>
            <button>确定</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    // 打开对话框
    fireEvent.click(screen.getByText("打开"));

    // 等待并验证各个子组件渲染
    await waitFor(() => {
      // 验证标题
      const title = screen.getByText("标题文本");
      expect(title).toBeInTheDocument();
      expect(title).toHaveAttribute("data-slot", "dialog-title");

      // 验证描述
      const description = screen.getByText("描述文本");
      expect(description).toBeInTheDocument();
      expect(description).toHaveAttribute("data-slot", "dialog-description");

      // 验证头部
      const header = title.closest("[data-slot='dialog-header']");
      expect(header).toBeInTheDocument();

      // 验证底部
      const footer = screen.getByText("取消").closest("[data-slot='dialog-footer']");
      expect(footer).toBeInTheDocument();

      // 验证按钮
      expect(screen.getByText("取消")).toBeInTheDocument();
      expect(screen.getByText("确定")).toBeInTheDocument();
    });
  });

  /**
   * 测试用例 TC-005: Close按钮功能测试
   * 测试目标：验证DialogClose组件能够正确关闭对话框
   */
  test("TC-005: Close按钮功能测试", async () => {
    render(
      <Dialog>
        <DialogTrigger>打开对话框</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>对话框标题</DialogTitle>
          </DialogHeader>
          <div>对话框内容</div>
          <DialogFooter>
            <DialogClose asChild>
              <button>关闭按钮</button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    // 打开对话框
    fireEvent.click(screen.getByText("打开对话框"));

    // 等待对话框打开
    await waitFor(() => {
      expect(screen.getByText("对话框标题")).toBeInTheDocument();
    });

    // 点击自定义关闭按钮
    const closeBtn = screen.getByText("关闭按钮");
    fireEvent.click(closeBtn);

    // 验证对话框已关闭
    await waitFor(() => {
      expect(screen.queryByText("对话框标题")).not.toBeInTheDocument();
    });
  });

  /**
   * 测试用例 TC-006: 受控组件测试
   * 测试目标：验证Dialog作为受控组件能够正确响应open状态变化
   */
  test("TC-006: 受控组件测试", async () => {
    const TestControlledDialog = () => {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>外部打开</button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>受控对话框</DialogTitle>
              </DialogHeader>
              <div>内容</div>
            </DialogContent>
          </Dialog>
        </>
      );
    };

    render(<TestControlledDialog />);

    // 初始状态下对话框未打开
    expect(screen.queryByText("受控对话框")).not.toBeInTheDocument();

    // 通过外部按钮打开对话框
    fireEvent.click(screen.getByText("外部打开"));

    // 验证对话框已打开
    await waitFor(() => {
      expect(screen.getByText("受控对话框")).toBeInTheDocument();
    });

    // 点击关闭按钮
    const closeButton = screen.getByText("Close").parentElement;
    fireEvent.click(closeButton!);

    // 验证对话框已关闭
    await waitFor(() => {
      expect(screen.queryByText("受控对话框")).not.toBeInTheDocument();
    });
  });

  /**
   * 测试用例 TC-007: 默认打开状态测试
   * 测试目标：验证Dialog能够正确渲染默认打开状态
   */
  test("TC-007: 默认打开状态测试", async () => {
    render(
      <Dialog defaultOpen>
        <DialogTrigger>触发器</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>默认打开的对话框</DialogTitle>
            <DialogDescription>这是描述</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    // 等待对话框渲染
    await waitFor(() => {
      expect(screen.getByText("默认打开的对话框")).toBeInTheDocument();
      expect(screen.getByText("这是描述")).toBeInTheDocument();
    });

    // 验证对话框具有正确的 data-slot 属性
    const dialogContent = screen.getByText("默认打开的对话框").closest("[data-slot='dialog-content']");
    expect(dialogContent).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-008: 复杂Dialog结构测试
   * 测试目标：验证包含完整结构的复杂Dialog能够正确渲染和交互
   */
  test("TC-008: 复杂Dialog结构测试", async () => {
    const mockConfirm = jest.fn();

    render(
      <Dialog>
        <DialogTrigger asChild>
          <button className="open-btn">打开设置</button>
        </DialogTrigger>
        <DialogContent className="settings-dialog">
          <DialogHeader>
            <DialogTitle>设置</DialogTitle>
            <DialogDescription>配置您的应用程序设置</DialogDescription>
          </DialogHeader>
          <div className="settings-content">
            <label>
              <input type="checkbox" /> 启用通知
            </label>
            <label>
              <input type="checkbox" /> 暗黑模式
            </label>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <button className="cancel-btn">取消</button>
            </DialogClose>
            <button className="confirm-btn" onClick={mockConfirm}>
              保存
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    // 验证触发按钮
    const trigger = screen.getByText("打开设置");
    expect(trigger).toHaveClass("open-btn");

    // 打开对话框
    fireEvent.click(trigger);

    // 等待并验证完整结构
    await waitFor(() => {
      // 验证标题和描述
      expect(screen.getByText("设置")).toBeInTheDocument();
      expect(screen.getByText("配置您的应用程序设置")).toBeInTheDocument();

      // 验证内容
      expect(screen.getByText("启用通知")).toBeInTheDocument();
      expect(screen.getByText("暗黑模式")).toBeInTheDocument();

      // 验证按钮
      expect(screen.getByText("取消")).toBeInTheDocument();
      expect(screen.getByText("保存")).toBeInTheDocument();
    });

    // 测试保存按钮
    fireEvent.click(screen.getByText("保存"));
    expect(mockConfirm).toHaveBeenCalled();

    // 测试取消按钮关闭对话框
    fireEvent.click(screen.getByText("取消"));

    await waitFor(() => {
      expect(screen.queryByText("设置")).not.toBeInTheDocument();
    });
  });
});
