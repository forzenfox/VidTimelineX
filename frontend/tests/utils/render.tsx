/**
 * 测试渲染工具函数
 * 提供统一的渲染工具函数
 */

import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import "@testing-library/jest-dom";

/**
 * 自定义渲染函数，添加全局样式
 */
export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, options);
}

/**
 * 渲染组件并返回容器
 */
export function renderComponent(
  component: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
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
  const { default: waitFor } = await import("@testing-library/dom");
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
): Promise<HTMLElement> {
  const { default: waitFor } = await import("@testing-library/dom");
  return waitFor(() => document.body.textContent?.includes(text), options) as Promise<HTMLElement>;
}

/**
 * 模拟用户点击事件
 */
export function simulateClick(element: HTMLElement) {
  element.click();
}

/**
 * 模拟用户输入事件
 */
export function simulateInput(element: HTMLInputElement, value: string) {
  element.value = value;
  element.dispatchEvent(new Event('input', { bubbles: true }));
}

/**
 * 模拟用户键盘事件
 */
export function simulateKeyPress(element: HTMLElement, key: string) {
  element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}

/**
 * 清理所有渲染
 */
export function cleanupAll() {
  const { cleanup } = require("@testing-library/react");
  cleanup();
}
