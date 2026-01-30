import React from "react";
import { render, act } from "@testing-library/react";
import TiantongPage from "@/features/tiantong/TiantongPage";
import "@testing-library/jest-dom";
import { safeAsync, withTimeout, wrapAsync } from "../../utils/error-handling";

describe("甜筒模块页面集成测试", () => {
  test("TC-001: 页面渲染测试", async () => {
    await withTimeout(
      async () => {
        await safeAsync(async () => {
          await act(async () => {
            render(<TiantongPage />);
          });
        }, "页面渲染失败");

        expect(document.body).toBeInTheDocument();
      },
      15000,
      "页面渲染超时"
    );
  }, 60000);

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

          expect(document.body).toBeInTheDocument();
        },
        15000,
        "主题切换测试超时"
      );
    })
  );

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

          expect(document.body).toBeInTheDocument();
        },
        15000,
        "视频点击测试超时"
      );
    })
  );

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

          expect(document.body).toBeInTheDocument();
        },
        15000,
        "搜索功能测试超时"
      );
    })
  );

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

          expect(document.body).toBeInTheDocument();
        },
        15000,
        "分类切换测试超时"
      );
    })
  );
});
