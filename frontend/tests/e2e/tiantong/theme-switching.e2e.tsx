import { test, expect } from "@playwright/test";

test("甜筒模块主题切换功能测试", async ({ page }) => {
  // 导航到甜筒页面
  await page.goto("http://localhost:5173/tiantong");

  // 验证页面加载成功
  await expect(page).toHaveTitle(/甜筒/);

  // 测试主题切换功能
  const themeToggle = page.getByRole("switch");
  await themeToggle.click();

  // 验证主题切换成功
  await expect(page).toHaveAttribute("html", { "data-theme": "sweet" });

  // 切换回老虎主题
  await themeToggle.click();
  await expect(page).toHaveAttribute("html", { "data-theme": "tiger" });
});
