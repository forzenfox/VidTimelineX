import { test, expect } from "@playwright/test";

/**
 * 甜筒页面弹幕主题切换 E2E 测试
 *
 * 测试场景：
 * 1. 访问甜筒页面
 * 2. 等待飘屏弹幕出现
 * 3. 点击主题切换按钮
 * 4. 验证新主题的弹幕出现
 * 5. 验证弹幕颜色匹配新主题
 */

test.describe("甜筒页面弹幕主题切换测试", () => {
  // 测试 1：主题切换后弹幕应该重新触发
  test("应该主题切换后弹幕重新触发", async ({ page }) => {
    // 访问甜筒页面
    await page.goto("/tiantong");

    // 等待页面加载完成
    await expect(page.locator("h1")).toContainText("亿口甜筒");

    // 等待横向弹幕出现
    const danmakuElement = page.locator('[data-testid="horizontal-danmaku"]');
    await expect(danmakuElement).toBeVisible({ timeout: 5000 });

    // 获取初始弹幕文本
    const initialDanmakuText = await danmakuElement.textContent();
    expect(initialDanmakuText).toContain("Horizontal danmaku");
    expect(initialDanmakuText).toContain("tiger");

    // 点击主题切换按钮
    const toggleButton = page.locator('[data-testid="theme-toggle"] [data-testid="toggle-button"]');
    await expect(toggleButton).toBeVisible();
    await toggleButton.click();

    // 等待弹幕重新渲染（通过 render count 变化）
    await page.waitForFunction(
      () => {
        const el = document.querySelector('[data-testid="horizontal-danmaku"]');
        if (!el) return false;
        const count = Number(el.getAttribute("data-render-count"));
        return count > 1;
      },
      { timeout: 3000 }
    );

    // 验证弹幕已经更新为新主题
    const updatedDanmakuText = await danmakuElement.textContent();
    expect(updatedDanmakuText).toContain("sweet");

    // 验证弹幕重新渲染了
    const renderCount = await danmakuElement.getAttribute("data-render-count");
    expect(Number(renderCount)).toBeGreaterThan(1);
  });

  // 测试 2：多次切换主题时弹幕应该每次都重新渲染
  test("应该多次切换主题时弹幕每次都重新渲染", async ({ page }) => {
    // 访问甜筒页面
    await page.goto("/tiantong");

    // 等待页面加载完成
    await expect(page.locator("h1")).toContainText("亿口甜筒");

    // 等待横向弹幕出现
    const danmakuElement = page.locator('[data-testid="horizontal-danmaku"]');
    await expect(danmakuElement).toBeVisible({ timeout: 5000 });

    const toggleButton = page.locator('[data-testid="theme-toggle"] [data-testid="toggle-button"]');

    // 第一次切换
    await toggleButton.click();
    await page.waitForFunction(
      () => {
        const el = document.querySelector('[data-testid="horizontal-danmaku"]');
        if (!el) return false;
        const count = Number(el.getAttribute("data-render-count"));
        return count > 1;
      },
      { timeout: 3000 }
    );
    const renderCount1 = await danmakuElement.getAttribute("data-render-count");

    // 第二次切换
    await toggleButton.click();
    await page.waitForFunction(
      (prevCount: number) => {
        const el = document.querySelector('[data-testid="horizontal-danmaku"]');
        if (!el) return false;
        const count = Number(el.getAttribute("data-render-count"));
        return count > prevCount;
      },
      Number(renderCount1),
      { timeout: 3000 }
    );
    const renderCount2 = await danmakuElement.getAttribute("data-render-count");

    // 第三次切换
    await toggleButton.click();
    await page.waitForFunction(
      (prevCount: number) => {
        const el = document.querySelector('[data-testid="horizontal-danmaku"]');
        if (!el) return false;
        const count = Number(el.getAttribute("data-render-count"));
        return count > prevCount;
      },
      Number(renderCount2),
      { timeout: 3000 }
    );
    const renderCount3 = await danmakuElement.getAttribute("data-render-count");

    // 验证渲染次数递增
    expect(Number(renderCount2)).toBeGreaterThan(Number(renderCount1));
    expect(Number(renderCount3)).toBeGreaterThan(Number(renderCount2));
  });

  // 测试 3：主题切换后弹幕颜色应该匹配新主题
  test("应该主题切换后弹幕颜色匹配新主题", async ({ page }) => {
    // 访问甜筒页面
    await page.goto("/tiantong");

    // 等待页面加载完成
    await expect(page.locator("h1")).toContainText("亿口甜筒");

    // 等待横向弹幕出现
    const danmakuElement = page.locator('[data-testid="horizontal-danmaku"]');
    await expect(danmakuElement).toBeVisible({ timeout: 5000 });

    // 验证初始主题（tiger）的弹幕颜色
    const initialText = await danmakuElement.textContent();
    expect(initialText).toContain("tiger");

    // 点击主题切换按钮
    const toggleButton = page.locator('[data-testid="theme-toggle"] [data-testid="toggle-button"]');
    await toggleButton.click();

    // 等待弹幕更新
    await page.waitForFunction(
      () => {
        const el = document.querySelector('[data-testid="horizontal-danmaku"]');
        if (!el) return false;
        const count = Number(el.getAttribute("data-render-count"));
        return count > 1;
      },
      { timeout: 3000 }
    );

    // 验证新主题（sweet）的弹幕颜色
    const updatedText = await danmakuElement.textContent();
    expect(updatedText).toContain("sweet");
  });
});
