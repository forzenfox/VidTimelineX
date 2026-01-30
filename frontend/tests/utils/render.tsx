/**
 * 测试渲染工具函数
 * 提供统一的渲染工具函数
 */

import React from "react";
import { render, RenderOptions, cleanup, screen, fireEvent } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import "@testing-library/jest-dom";

/**
 * 组件状态管理接口
 */
export interface ComponentState<T> {
  getState: () => T;
  setState: (state: T) => void;
  updateState: (updater: (prevState: T) => T) => void;
  resetState: () => void;
}

/**
 * 渲染选项接口
 */
export interface EnhancedRenderOptions<T = unknown> extends Omit<RenderOptions, "wrapper"> {
  initialState?: T;
  stateManager?: boolean;
}

/**
 * 增强的渲染结果接口
 */
export interface EnhancedRenderResult<T = unknown> {
  container: HTMLElement;
  getByText: typeof screen.getByText;
  getByRole: typeof screen.getByRole;
  getByTestId: typeof screen.getByTestId;
  queryByText: typeof screen.queryByText;
  queryByRole: typeof screen.queryByRole;
  queryByTestId: typeof screen.queryByTestId;
  state: ComponentState<T> | undefined;
  fireEvent: typeof fireEvent;
  cleanup: () => void;
}

/**
 * 创建组件状态管理器
 * @param initialState 初始状态
 * @returns 状态管理器
 */
export function createStateManager<T>(initialState: T): ComponentState<T> {
  let state = { ...initialState };
  const initialStateCopy = { ...initialState };

  return {
    getState: () => ({ ...state }),
    setState: (newState: T) => {
      state = { ...newState };
    },
    updateState: (updater: (prevState: T) => T) => {
      state = { ...updater(state) };
    },
    resetState: () => {
      state = { ...initialStateCopy };
    },
  };
}

/**
 * 自定义渲染函数，添加全局样式和状态管理
 */
export function renderWithProviders<T = unknown>(
  ui: React.ReactElement,
  options?: EnhancedRenderOptions<T>
): EnhancedRenderResult<T> {
  const { initialState, stateManager = false, ...renderOptions } = options || {};

  const result = render(ui, renderOptions);
  let state: ComponentState<T> | undefined;

  if (stateManager && initialState) {
    state = createStateManager(initialState);
  }

  return {
    container: result.container,
    getByText: screen.getByText,
    getByRole: screen.getByRole,
    getByTestId: screen.getByTestId,
    queryByText: screen.queryByText,
    queryByRole: screen.queryByRole,
    queryByTestId: screen.queryByTestId,
    state,
    fireEvent,
    cleanup: result.unmount,
  };
}

/**
 * 渲染组件并返回容器
 */
export function renderComponent(
  component: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return render(component, options);
}

/**
 * 等待元素出现
 */
export async function waitForElement(
  callback: () => HTMLElement | null,
  options?: {
    timeout?: number;
    interval?: number;
  }
): Promise<HTMLElement> {
  return waitFor(callback, options) as Promise<HTMLElement>;
}

/**
 * 等待文本出现
 */
export async function waitForText(
  text: string,
  options?: {
    timeout?: number;
    interval?: number;
  }
): Promise<boolean> {
  return waitFor(() => document.body.textContent?.includes(text), options) as Promise<boolean>;
}

/**
 * 等待元素消失
 */
export async function waitForElementToDisappear(
  callback: () => HTMLElement | null,
  options?: {
    timeout?: number;
    interval?: number;
  }
): Promise<void> {
  await waitFor(() => expect(callback()).not.toBeInTheDocument(), options);
}

/**
 * 模拟用户点击事件
 */
export function simulateClick(element: HTMLElement) {
  element.click();
}

/**
 * 模拟用户双击事件
 */
export function simulateDoubleClick(element: HTMLElement) {
  element.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
}

/**
 * 模拟用户输入事件
 */
export function simulateInput(element: HTMLInputElement, value: string) {
  element.value = value;
  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
}

/**
 * 模拟用户键盘事件
 */
export function simulateKeyPress(
  element: HTMLElement,
  key: string,
  options?: {
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
  }
) {
  element.dispatchEvent(
    new KeyboardEvent("keydown", {
      key,
      bubbles: true,
      ...options,
    })
  );
  element.dispatchEvent(
    new KeyboardEvent("keyup", {
      key,
      bubbles: true,
      ...options,
    })
  );
}

/**
 * 模拟用户鼠标悬停事件
 */
export function simulateHover(element: HTMLElement) {
  element.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
}

/**
 * 模拟用户鼠标离开事件
 */
export function simulateMouseLeave(element: HTMLElement) {
  element.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
}

/**
 * 模拟用户滚动事件
 */
export function simulateScroll(
  element: HTMLElement,
  options?: {
    scrollTop?: number;
    scrollLeft?: number;
  }
) {
  element.scrollTop = options?.scrollTop || 0;
  element.scrollLeft = options?.scrollLeft || 0;
  element.dispatchEvent(new Event("scroll", { bubbles: true }));
}

/**
 * 模拟表单提交事件
 */
export function simulateFormSubmit(form: HTMLFormElement) {
  form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
}

/**
 * 查找元素并等待其出现
 */
export async function findByTestId(
  testId: string,
  options?: {
    timeout?: number;
  }
): Promise<HTMLElement> {
  return screen.findByTestId(testId, options);
}

/**
 * 查找元素并等待其出现
 */
export async function findByRole(
  role: string,
  options?: {
    timeout?: number;
  }
): Promise<HTMLElement> {
  return screen.findByRole(role, options);
}

/**
 * 查找元素并等待其出现
 */
export async function findByText(
  text: string,
  options?: {
    timeout?: number;
  }
): Promise<HTMLElement> {
  return screen.findByText(text, options);
}

/**
 * 生成测试数据
 * @param template 数据模板
 * @param count 生成数量
 * @returns 测试数据数组
 */
export function generateTestData<T>(template: T, count: number): T[] {
  return Array.from({ length: count }, (_, index) => ({
    ...template,
    id: `${(template as unknown as { id?: string }).id || "test"}-${index + 1}`,
  }));
}

/**
 * 清理所有渲染
 */
export function cleanupAll() {
  cleanup();
}

/**
 * 安全地获取元素
 * @param selector 选择器函数
 * @param errorMessage 错误消息
 * @returns 元素或null
 */
export function safeGetElement<T extends Element>(
  selector: () => T,
  errorMessage: string = "获取元素失败"
): T | null {
  try {
    return selector();
  } catch (error) {
    console.warn(`${errorMessage}:`, error);
    return null;
  }
}

/**
 * 批量触发事件
 * @param elements 元素数组
 * @param eventType 事件类型
 */
export function triggerEvents(elements: HTMLElement[], eventType: string) {
  elements.forEach(element => {
    element.dispatchEvent(new Event(eventType, { bubbles: true }));
  });
}

/**
 * 等待指定时间
 * @param ms 等待时间（毫秒）
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 测试组件的渲染性能
 * @param component 组件
 * @param iterations 迭代次数
 * @returns 平均渲染时间（毫秒）
 */
export async function measureRenderPerformance(
  component: React.ReactElement,
  iterations: number = 10
): Promise<number> {
  const times: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    const { cleanup } = render(component);
    const end = performance.now();
    times.push(end - start);
    cleanup();
    await wait(10); // 短暂等待，避免测试之间的干扰
  }

  return times.reduce((sum, time) => sum + time, 0) / times.length;
}
