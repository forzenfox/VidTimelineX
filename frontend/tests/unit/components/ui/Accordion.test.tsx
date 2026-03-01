import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import "@testing-library/jest-dom";

describe("Accordion组件测试", () => {
  /**
   * 测试用例 TC-001: 组件渲染测试
   * 测试目标：验证Accordion组件及其子组件能够正确渲染
   */
  test("TC-001: 组件渲染测试", () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>标题1</AccordionTrigger>
          <AccordionContent>内容1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>标题2</AccordionTrigger>
          <AccordionContent>内容2</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    // 验证 Accordion 容器渲染 - 使用 data-slot 属性查询
    const accordion = document.querySelector("[data-slot='accordion']");
    expect(accordion).toBeInTheDocument();

    // 验证 AccordionItem 渲染
    const accordionItems = document.querySelectorAll("[data-slot='accordion-item']");
    expect(accordionItems).toHaveLength(2);

    // 验证 AccordionTrigger 渲染
    const triggers = document.querySelectorAll("[data-slot='accordion-trigger']");
    expect(triggers).toHaveLength(2);
    expect(screen.getByText("标题1")).toBeInTheDocument();
    expect(screen.getByText("标题2")).toBeInTheDocument();

    // 验证 AccordionContent 渲染
    const contents = document.querySelectorAll("[data-slot='accordion-content']");
    expect(contents).toHaveLength(2);
  });

  /**
   * 测试用例 TC-002: 展开/折叠交互测试
   * 测试目标：验证点击AccordionTrigger能够展开/折叠AccordionContent
   */
  test("TC-002: 展开/折叠交互测试", async () => {
    const user = userEvent.setup();

    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>标题1</AccordionTrigger>
          <AccordionContent>内容1</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByText("标题1");

    // 初始状态：内容未展开（data-state 为 closed）
    const content = document.querySelector("[data-slot='accordion-content']");
    expect(content).toHaveAttribute("data-state", "closed");

    // 点击触发器展开内容
    await user.click(trigger);

    // 验证内容已展开
    await waitFor(() => {
      expect(content).toHaveAttribute("data-state", "open");
    });

    // 再次点击触发器折叠内容
    await user.click(trigger);

    // 验证内容已折叠
    await waitFor(() => {
      expect(content).toHaveAttribute("data-state", "closed");
    });
  });

  /**
   * 测试用例 TC-003: 多项目展开测试
   * 测试目标：验证type="multiple"时允许多个AccordionItem同时展开
   */
  test("TC-003: 多项目展开测试", async () => {
    const user = userEvent.setup();

    render(
      <Accordion type="multiple">
        <AccordionItem value="item-1">
          <AccordionTrigger>标题1</AccordionTrigger>
          <AccordionContent>内容1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>标题2</AccordionTrigger>
          <AccordionContent>内容2</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>标题3</AccordionTrigger>
          <AccordionContent>内容3</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger1 = screen.getByText("标题1");
    const trigger2 = screen.getByText("标题2");
    const trigger3 = screen.getByText("标题3");

    // 展开第一个项目
    await user.click(trigger1);
    await waitFor(() => {
      expect(trigger1).toHaveAttribute("data-state", "open");
    });

    // 展开第二个项目
    await user.click(trigger2);
    await waitFor(() => {
      expect(trigger2).toHaveAttribute("data-state", "open");
    });

    // 展开第三个项目
    await user.click(trigger3);
    await waitFor(() => {
      expect(trigger3).toHaveAttribute("data-state", "open");
    });

    // 验证三个项目都处于展开状态
    expect(trigger1).toHaveAttribute("data-state", "open");
    expect(trigger2).toHaveAttribute("data-state", "open");
    expect(trigger3).toHaveAttribute("data-state", "open");
  });

  /**
   * 测试用例 TC-004: 单项目模式展开测试
   * 测试目标：验证type="single"时只能有一个AccordionItem展开
   */
  test("TC-004: 单项目模式展开测试", async () => {
    const user = userEvent.setup();

    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>标题1</AccordionTrigger>
          <AccordionContent>内容1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>标题2</AccordionTrigger>
          <AccordionContent>内容2</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger1 = screen.getByText("标题1");
    const trigger2 = screen.getByText("标题2");

    // 展开第一个项目
    await user.click(trigger1);
    await waitFor(() => {
      expect(trigger1).toHaveAttribute("data-state", "open");
    });

    // 展开第二个项目
    await user.click(trigger2);
    await waitFor(() => {
      expect(trigger2).toHaveAttribute("data-state", "open");
    });

    // 验证第一个项目已自动折叠
    await waitFor(() => {
      expect(trigger1).toHaveAttribute("data-state", "closed");
    });

    // 验证只有第二个项目处于展开状态
    expect(trigger1).toHaveAttribute("data-state", "closed");
    expect(trigger2).toHaveAttribute("data-state", "open");
  });

  /**
   * 测试用例 TC-005: 自定义类名测试
   * 测试目标：验证Accordion组件能够正确应用自定义类名
   */
  test("TC-005: 自定义类名测试", async () => {
    const user = userEvent.setup();

    render(
      <Accordion type="single" collapsible className="custom-accordion-class">
        <AccordionItem value="item-1" className="custom-item-class">
          <AccordionTrigger className="custom-trigger-class">
            标题1
          </AccordionTrigger>
          <AccordionContent className="custom-content-class">
            内容1
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    // 验证 Accordion 容器具有自定义类名
    const accordion = document.querySelector("[data-slot='accordion']");
    expect(accordion).toHaveClass("custom-accordion-class");

    // 验证 AccordionItem 具有自定义类名
    const accordionItem = document.querySelector("[data-slot='accordion-item']");
    expect(accordionItem).toHaveClass("custom-item-class");

    // 验证 AccordionTrigger 具有自定义类名
    const trigger = document.querySelector("[data-slot='accordion-trigger']");
    expect(trigger).toHaveClass("custom-trigger-class");

    // 先展开 AccordionContent，因为折叠状态下内部内容可能不在 DOM 中
    await user.click(screen.getByText("标题1"));

    // 等待内容展开
    await waitFor(() => {
      const contentWrapper = document.querySelector("[data-slot='accordion-content']");
      expect(contentWrapper).toHaveAttribute("data-state", "open");
    });

    // 验证 AccordionContent 内部 div 具有自定义类名
    // AccordionContent 的 className 是应用到内部 div，而不是 data-slot 元素
    const contentWrapper = document.querySelector("[data-slot='accordion-content']");
    expect(contentWrapper).toBeInTheDocument();
    // 内部 div 应该有自定义类名
    const contentInner = contentWrapper?.querySelector(".custom-content-class");
    expect(contentInner).toBeInTheDocument();
    expect(contentInner).toHaveTextContent("内容1");
  });

  /**
   * 测试用例 TC-006: 默认展开项测试
   * 测试目标：验证defaultValue能够正确设置默认展开的AccordionItem
   */
  test("TC-006: 默认展开项测试", async () => {
    render(
      <Accordion type="single" collapsible defaultValue="item-2">
        <AccordionItem value="item-1">
          <AccordionTrigger>标题1</AccordionTrigger>
          <AccordionContent>内容1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>标题2</AccordionTrigger>
          <AccordionContent>内容2</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    // 等待默认展开状态生效
    await waitFor(() => {
      const trigger2 = screen.getByText("标题2");
      expect(trigger2).toHaveAttribute("data-state", "open");
    });

    // 验证第一个项目处于折叠状态
    const trigger1 = screen.getByText("标题1");
    expect(trigger1).toHaveAttribute("data-state", "closed");
  });
});
