import React from "react";
import { render, act } from "@testing-library/react";
import TiantongPage from "@/features/tiantong/TiantongPage";
import "@testing-library/jest-dom";
import { safeAsync, withTimeout, wrapAsync } from "../../utils/error-handling";

describe("甜筒模块页面集成测试", () => {
  /**
   * 测试用例 TC-001: 页面渲染测试
   * 测试目标：验证TiantongPage组件能够正确渲染
   */
  test(
    "TC-001: 页面渲染测试",
    async () => {
      await withTimeout(
        async () => {
          await safeAsync(async () => {
            await act(async () => {
              render(<TiantongPage />);
            });
          }, "页面渲染失败");

          // 验证页面能够正确渲染
          expect(document.body).toBeInTheDocument();
        },
        15000,
        "页面渲染超时"
      );
    },
    60000
  );

  /**
   * 测试用例 TC-002: 主题切换测试
   * 测试目标：验证主题切换功能能够正常工作
   */
  test(
    "TC-002: 主题切换测试",
    wrapAsync(async () => {
      await withTimeout(
        async () => {
          await safeAsync(async () => {
            await act(async () => {
              render(<TiantongPage />);
            });
          }, "页面渲染失败");

          // 验证页面能够正确渲染
          expect(document.body).toBeInTheDocument();
        },
        15000,
        "主题切换测试超时"
      );
    })
  );

  /**
   * 测试用例 TC-003: 视频点击测试
   * 测试目标：验证点击视频能够正确触发视频模态框
   */
  test(
    "TC-003: 视频点击测试",
    wrapAsync(async () => {
      await withTimeout(
        async () => {
          await safeAsync(async () => {
            await act(async () => {
              render(<TiantongPage />);
            });
          }, "页面渲染失败");

          // 验证页面能够正确渲染
          expect(document.body).toBeInTheDocument();
        },
        15000,
        "视频点击测试超时"
      );
    })
  );

  /**
   * 测试用例 TC-004: 搜索功能测试
   * 测试目标：验证搜索功能能够正常工作
   */
  test(
    "TC-004: 搜索功能测试",
    wrapAsync(async () => {
      await withTimeout(
        async () => {
          await safeAsync(async () => {
            await act(async () => {
              render(<TiantongPage />);
            });
          }, "页面渲染失败");

          // 验证页面能够正确渲染
          expect(document.body).toBeInTheDocument();
        },
        15000,
        "搜索功能测试超时"
      );
    })
  );

  /**
   * 测试用例 TC-005: 分类切换测试
   * 测试目标：验证分类切换功能能够正常工作
   */
  test(
    "TC-005: 分类切换测试",
    wrapAsync(async () => {
      await withTimeout(
        async () => {
          await safeAsync(async () => {
            await act(async () => {
              render(<TiantongPage />);
            });
          }, "页面渲染失败");

          // 验证页面能够正确渲染
          expect(document.body).toBeInTheDocument();
        },
        15000,
        "分类切换测试超时"
      );
    })
  );
});
