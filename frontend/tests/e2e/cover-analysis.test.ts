import { test } from "@playwright/test";

test.describe("视频封面加载分析", () => {
  test("分析甜筒页面视频封面的加载情况", async ({ page }) => {
    const imageLoadResults: {
      url: string;
      status: string;
      source: string;
      type: "local" | "cdn" | "fallback";
      error?: string;
    }[] = [];

    const consoleMessages: string[] = [];
    const networkRequests: { url: string; status: number; type: string }[] = [];

    page.on("console", msg => {
      const text = msg.text();
      consoleMessages.push(`[${msg.type()}] ${text}`);
      if (text.includes("[Image]") || text.includes("跨域") || text.includes("回退")) {
        console.log(`控制台: ${text}`);
      }
    });

    page.on("response", response => {
      const url = response.url();
      const status = response.status();
      const type = response.request().resourceType();

      if (type === "image") {
        networkRequests.push({ url, status, type });
      }
    });

    await page.goto("http://localhost:3001/tiantong", { waitUntil: "networkidle" });

    await page.waitForTimeout(2000);

    const images = await page.locator("img[data-image-url]").all();
    console.log(`\n找到 ${images.length} 张带有 data-image-url 属性的图片`);

    for (const img of images) {
      const imageUrl = await img.getAttribute("data-image-url");
      const imageSource = await img.getAttribute("data-image-source");
      const corsStatus = await img.getAttribute("data-cors-status");

      let source: "local" | "cdn" | "fallback" = "local";
      if (
        imageUrl?.includes("hdslb") ||
        imageUrl?.includes("bilibili") ||
        imageUrl?.includes("bilivideo")
      ) {
        source = "cdn";
      } else if (imageSource === "fallback") {
        source = "fallback";
      }

      imageLoadResults.push({
        url: imageUrl || "unknown",
        status: corsStatus || "ok",
        source,
        type: imageSource === "fallback" ? "fallback" : source,
      });
    }

    console.log("\n=== 图片加载结果汇总 ===");
    const localCount = imageLoadResults.filter(r => r.type === "local").length;
    const cdnCount = imageLoadResults.filter(r => r.type === "cdn").length;
    const fallbackCount = imageLoadResults.filter(r => r.type === "fallback").length;

    console.log(`本地加载: ${localCount} 张`);
    console.log(`CDN 加载: ${cdnCount} 张`);
    console.log(`回退加载: ${fallbackCount} 张`);

    console.log("\n=== 详细加载情况 ===");
    imageLoadResults.forEach((result, index) => {
      const displayUrl = result.url.length > 80 ? result.url.substring(0, 80) + "..." : result.url;
      console.log(`${index + 1}. [${result.type.toUpperCase()}] ${displayUrl}`);
    });

    console.log("\n=== 网络请求统计 ===");
    const cdnRequests = networkRequests.filter(
      r => r.url.includes("hdslb") || r.url.includes("bilibili") || r.url.includes("bilivideo")
    );
    const localRequests = networkRequests.filter(r => r.url.includes("/thumbs/"));
    const failedRequests = networkRequests.filter(r => r.status >= 400);

    console.log(`B站 CDN 请求: ${cdnRequests.length} 次`);
    console.log(`本地 thumbs 请求: ${localRequests.length} 次`);
    console.log(`失败的请求: ${failedRequests.length} 次`);

    if (failedRequests.length > 0) {
      console.log("\n=== 失败的请求详情 ===");
      failedRequests.forEach(req => {
        console.log(`  - ${req.status}: ${req.url}`);
      });
    }

    console.log("\n=== 控制台关键消息 ===");
    const relevantMessages = consoleMessages.filter(
      m => m.includes("[Image]") || m.includes("跨域") || m.includes("回退") || m.includes("CORS")
    );
    relevantMessages.forEach(msg => {
      console.log(msg);
    });
  });
});
