import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "@/components/ui/select";
import "@testing-library/jest-dom";

/**
 * Select 组件测试套件
 * 测试 Select 下拉选择组件的所有功能
 */
describe("Select组件测试", () => {
  /**
   * 测试用例 TC-001: 组件渲染测试
   * 测试目标：验证 Select 组件及其所有子组件能够正确渲染
   */
  test("TC-001: 组件渲染测试", () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="请选择一个选项" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>分组标签</SelectLabel>
            <SelectItem value="option1">选项一</SelectItem>
            <SelectItem value="option2">选项二</SelectItem>
            <SelectSeparator />
            <SelectItem value="option3">选项三</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );

    // 验证触发器渲染
    const trigger = document.querySelector('[data-slot="select-trigger"]');
    expect(trigger).toBeInTheDocument();

    // 验证占位符文本
    expect(screen.getByText("请选择一个选项")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-002: Select 打开/关闭交互测试
   * 测试目标：验证点击触发器可以打开和关闭下拉菜单
   */
  test("TC-002: Select 打开/关闭交互测试", async () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="请选择一个选项" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">选项一</SelectItem>
          <SelectItem value="option2">选项二</SelectItem>
        </SelectContent>
      </Select>
    );

    // 获取触发器
    const trigger = document.querySelector('[data-slot="select-trigger"]') as HTMLElement;
    expect(trigger).toBeInTheDocument();

    // 点击触发器打开下拉菜单
    fireEvent.click(trigger);

    // 等待并验证下拉内容是否渲染
    const content = document.querySelector('[data-slot="select-content"]');
    expect(content).toBeInTheDocument();

    // 验证选项是否显示
    expect(screen.getByText("选项一")).toBeInTheDocument();
    expect(screen.getByText("选项二")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-003: 选项选择测试
   * 测试目标：验证选择选项后触发器显示正确的值
   */
  test("TC-003: 选项选择测试", () => {
    const mockOnValueChange = jest.fn();

    render(
      <Select onValueChange={mockOnValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="请选择一个选项" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">选项一</SelectItem>
          <SelectItem value="option2">选项二</SelectItem>
        </SelectContent>
      </Select>
    );

    // 获取触发器并点击打开
    const trigger = document.querySelector('[data-slot="select-trigger"]') as HTMLElement;
    fireEvent.click(trigger);

    // 点击选项
    const option = screen.getByText("选项一");
    fireEvent.click(option);

    // 验证回调被调用
    expect(mockOnValueChange).toHaveBeenCalledWith("option1");
  });

  /**
   * 测试用例 TC-004: 自定义类名测试
   * 测试目标：验证自定义类名能够正确应用到组件上
   */
  test("TC-004: 自定义类名测试", () => {
    render(
      <Select>
        <SelectTrigger className="custom-trigger-class">
          <SelectValue placeholder="请选择" />
        </SelectTrigger>
        <SelectContent className="custom-content-class">
          <SelectGroup>
            <SelectLabel className="custom-label-class">标签</SelectLabel>
            <SelectItem value="option1" className="custom-item-class">
              选项一
            </SelectItem>
          </SelectGroup>
          <SelectSeparator className="custom-separator-class" />
        </SelectContent>
      </Select>
    );

    // 验证触发器自定义类名
    const trigger = document.querySelector('[data-slot="select-trigger"]');
    expect(trigger).toHaveClass("custom-trigger-class");

    // 点击打开下拉菜单
    fireEvent.click(trigger as HTMLElement);

    // 验证内容区自定义类名
    const content = document.querySelector('[data-slot="select-content"]');
    expect(content).toHaveClass("custom-content-class");

    // 验证选项自定义类名
    const item = document.querySelector('[data-slot="select-item"]');
    expect(item).toHaveClass("custom-item-class");

    // 验证标签自定义类名
    const label = document.querySelector('[data-slot="select-label"]');
    expect(label).toHaveClass("custom-label-class");

    // 验证分隔符自定义类名
    const separator = document.querySelector('[data-slot="select-separator"]');
    expect(separator).toHaveClass("custom-separator-class");
  });

  /**
   * 测试用例 TC-005: 禁用状态测试
   * 测试目标：验证禁用状态的 Select 无法打开下拉菜单
   */
  test("TC-005: 禁用状态测试", () => {
    render(
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="禁用状态" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">选项一</SelectItem>
        </SelectContent>
      </Select>
    );

    // 获取触发器
    const trigger = document.querySelector('[data-slot="select-trigger"]') as HTMLElement;
    expect(trigger).toBeDisabled();

    // 尝试点击禁用的触发器
    fireEvent.click(trigger);

    // 验证下拉菜单未打开
    const content = document.querySelector('[data-slot="select-content"]');
    expect(content).not.toBeInTheDocument();
  });

  /**
   * 测试用例 TC-006: SelectGroup 分组测试
   * 测试目标：验证 SelectGroup 和 SelectLabel 能够正确分组显示
   */
  test("TC-006: SelectGroup 分组测试", () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="请选择" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>第一组</SelectLabel>
            <SelectItem value="group1-option1">组1选项1</SelectItem>
            <SelectItem value="group1-option2">组1选项2</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>第二组</SelectLabel>
            <SelectItem value="group2-option1">组2选项1</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );

    // 打开下拉菜单
    const trigger = document.querySelector('[data-slot="select-trigger"]') as HTMLElement;
    fireEvent.click(trigger);

    // 验证分组标签
    expect(screen.getByText("第一组")).toBeInTheDocument();
    expect(screen.getByText("第二组")).toBeInTheDocument();

    // 验证所有选项
    expect(screen.getByText("组1选项1")).toBeInTheDocument();
    expect(screen.getByText("组1选项2")).toBeInTheDocument();
    expect(screen.getByText("组2选项1")).toBeInTheDocument();

    // 验证分组元素
    const groups = document.querySelectorAll('[data-slot="select-group"]');
    expect(groups.length).toBe(2);
  });

  /**
   * 测试用例 TC-007: SelectValue 显示测试
   * 测试目标：验证选中值后 SelectValue 正确显示选中的文本
   */
  test("TC-007: SelectValue 显示测试", () => {
    render(
      <Select defaultValue="option2">
        <SelectTrigger>
          <SelectValue placeholder="请选择一个选项" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">选项一</SelectItem>
          <SelectItem value="option2">选项二</SelectItem>
        </SelectContent>
      </Select>
    );

    // 验证默认值显示
    expect(screen.getByText("选项二")).toBeInTheDocument();

    // 验证占位符不存在
    expect(screen.queryByText("请选择一个选项")).not.toBeInTheDocument();
  });

  /**
   * 测试用例 TC-008: 不同尺寸测试
   * 测试目标：验证不同尺寸的 SelectTrigger 能够正确渲染
   */
  test("TC-008: 不同尺寸测试", () => {
    render(
      <div>
        <Select>
          <SelectTrigger size="default" data-testid="default-trigger">
            <SelectValue placeholder="默认尺寸" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">选项一</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger size="sm" data-testid="sm-trigger">
            <SelectValue placeholder="小尺寸" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">选项一</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );

    // 验证默认尺寸触发器
    const defaultTrigger = document.querySelector('[data-size="default"]');
    expect(defaultTrigger).toBeInTheDocument();

    // 验证小尺寸触发器
    const smTrigger = document.querySelector('[data-size="sm"]');
    expect(smTrigger).toBeInTheDocument();
  });
});
