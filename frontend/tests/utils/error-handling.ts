/**
 * 测试错误处理工具
 * 提供增强的错误处理机制，提高测试脚本的稳定性和可靠性
 */

/**
 * 错误类型枚举
 */
export enum ErrorType {
  ASSERTION = "assertion",
  NETWORK = "network",
  TIMEOUT = "timeout",
  RENDERING = "rendering",
  STATE = "state",
  UNKNOWN = "unknown",
}

/**
 * 错误信息接口
 */
export interface ErrorInfo {
  type: ErrorType;
  message: string;
  stack?: string;
  details?: unknown;
}

/**
 * 测试结果统计接口
 */
export interface TestStats {
  total: number;
  passed: number;
  failed: number;
  errors: ErrorInfo[];
  duration: number;
}

/**
 * 安全地执行异步操作，捕获并处理错误
 * @param fn 要执行的异步函数
 * @param errorMessage 错误消息
 * @returns 执行结果或错误对象
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  errorMessage: string = "异步操作失败"
): Promise<T | Error> {
  try {
    return await fn();
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    return error instanceof Error ? error : new Error(String(error));
  }
}

/**
 * 安全地执行同步操作，捕获并处理错误
 * @param fn 要执行的同步函数
 * @param errorMessage 错误消息
 * @returns 执行结果或错误对象
 */
export function safeSync<T>(fn: () => T, errorMessage: string = "同步操作失败"): T | Error {
  try {
    return fn();
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    return error instanceof Error ? error : new Error(String(error));
  }
}

/**
 * 重试异步操作
 * @param fn 要执行的异步函数
 * @param maxRetries 最大重试次数
 * @param delay 重试延迟（毫秒）
 * @param backoffFactor 退避因子，用于指数退避
 * @returns 执行结果
 */
export async function retryAsync<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
  backoffFactor: number = 1.5
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`尝试 ${i + 1} 失败:`, lastError.message);

      if (i < maxRetries - 1) {
        const backoffDelay = delay * Math.pow(backoffFactor, i);
        console.warn(`等待 ${Math.round(backoffDelay)}ms 后重试...`);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      }
    }
  }

  throw lastError;
}

/**
 * 重试同步操作
 * @param fn 要执行的同步函数
 * @param maxRetries 最大重试次数
 * @param delay 重试延迟（毫秒）
 * @returns 执行结果
 */
export function retrySync<T>(fn: () => T, maxRetries: number = 3, delay: number = 1000): T {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`尝试 ${i + 1} 失败:`, lastError.message);

      if (i < maxRetries - 1) {
        console.warn(`等待 ${delay}ms 后重试...`);
        // 同步延迟
        const start = Date.now();
        while (Date.now() - start < delay) {
          // 空循环实现同步延迟
        }
      }
    }
  }

  throw lastError;
}

/**
 * 超时处理
 * @param fn 要执行的异步函数
 * @param timeout 超时时间（毫秒）
 * @param timeoutMessage 超时消息
 * @returns 执行结果
 */
export async function withTimeout<T>(
  fn: () => Promise<T>,
  timeout: number = 10000,
  timeoutMessage: string = "操作超时"
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(timeoutMessage)), timeout);
  });

  return Promise.race([fn(), timeoutPromise]);
}

/**
 * 延迟执行
 * @param ms 延迟时间（毫秒）
 * @returns Promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 包装异步操作以在测试中使用
 * @param fn 要执行的异步函数
 * @returns 包装后的函数
 */
export function wrapAsync(fn: () => Promise<void>): () => Promise<void> {
  return async () => {
    try {
      await fn();
    } catch (error) {
      console.error("测试执行失败:", error);
      throw error;
    }
  };
}

/**
 * 包装同步操作以在测试中使用
 * @param fn 要执行的同步函数
 * @returns 包装后的函数
 */
export function wrapSync(fn: () => void): () => void {
  return () => {
    try {
      fn();
    } catch (error) {
      console.error("测试执行失败:", error);
      throw error;
    }
  };
}

/**
 * 分类错误
 * @param error 错误对象
 * @returns 错误信息
 */
export function classifyError(error: unknown): ErrorInfo {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  if (message.includes("expect") || message.includes("AssertionError")) {
    return {
      type: ErrorType.ASSERTION,
      message,
      stack,
      details: error,
    };
  }

  if (message.includes("network") || message.includes("fetch") || message.includes("axios")) {
    return {
      type: ErrorType.NETWORK,
      message,
      stack,
      details: error,
    };
  }

  if (message.includes("timeout") || message.includes("timed out")) {
    return {
      type: ErrorType.TIMEOUT,
      message,
      stack,
      details: error,
    };
  }

  if (message.includes("render") || message.includes("React") || message.includes("DOM")) {
    return {
      type: ErrorType.RENDERING,
      message,
      stack,
      details: error,
    };
  }

  if (message.includes("state") || message.includes("context") || message.includes("reducer")) {
    return {
      type: ErrorType.STATE,
      message,
      stack,
      details: error,
    };
  }

  return {
    type: ErrorType.UNKNOWN,
    message,
    stack,
    details: error,
  };
}

/**
 * 处理错误
 * @param error 错误对象
 * @param errorMessage 错误消息
 * @returns 处理后的错误信息
 */
export function handleError(
  error: unknown,
  errorMessage: string = "处理错误时发生异常"
): ErrorInfo {
  console.error(`${errorMessage}:`, error);
  return classifyError(error);
}

/**
 * 创建测试结果统计器
 * @returns 测试结果统计对象和相关方法
 */
export function createTestStats() {
  const stats: TestStats = {
    total: 0,
    passed: 0,
    failed: 0,
    errors: [],
    duration: 0,
  };

  let startTime = Date.now();

  return {
    /**
     * 开始测试
     */
    start: () => {
      startTime = Date.now();
    },

    /**
     * 记录测试通过
     */
    pass: () => {
      stats.total++;
      stats.passed++;
    },

    /**
     * 记录测试失败
     * @param error 错误对象
     */
    fail: (error: unknown) => {
      stats.total++;
      stats.failed++;
      stats.errors.push(classifyError(error));
    },

    /**
     * 结束测试
     * @returns 测试结果统计
     */
    end: (): TestStats => {
      stats.duration = Date.now() - startTime;
      return stats;
    },

    /**
     * 获取当前统计
     * @returns 测试结果统计
     */
    getStats: (): TestStats => {
      return {
        ...stats,
        duration: Date.now() - startTime,
      };
    },

    /**
     * 打印统计结果
     */
    printStats: function () {
      const finalStats = this.end();
      console.log("\n=== 测试结果统计 ===");
      console.log(`总测试数: ${finalStats.total}`);
      console.log(`通过数: ${finalStats.passed}`);
      console.log(`失败数: ${finalStats.failed}`);
      console.log(`成功率: ${((finalStats.passed / finalStats.total) * 100).toFixed(2)}%`);
      console.log(`总执行时间: ${finalStats.duration}ms`);

      if (finalStats.errors.length > 0) {
        console.log("\n=== 错误详情 ===");
        finalStats.errors.forEach((error, index) => {
          console.log(`\n错误 ${index + 1}: ${error.type}`);
          console.log(`消息: ${error.message}`);
          if (error.stack) {
            console.log(`堆栈: ${error.stack.split("\n")[1]}`);
          }
        });
      }

      return finalStats;
    },
  };
}

/**
 * 安全地执行测试用例
 * @param testFn 测试函数
 * @param testName 测试名称
 * @returns 测试结果
 */
export async function safeTest(
  testFn: () => Promise<void> | void,
  testName: string = "测试"
): Promise<boolean> {
  try {
    if (testFn.constructor.name === "AsyncFunction") {
      await testFn();
    } else {
      testFn();
    }
    console.log(`✅ ${testName} 通过`);
    return true;
  } catch (error) {
    console.error(`❌ ${testName} 失败:`, error);
    return false;
  }
}

/**
 * 批量执行测试用例
 * @param tests 测试用例数组
 * @returns 测试结果统计
 */
export async function runTests(
  tests: Array<{ name: string; fn: () => Promise<void> | void }>
): Promise<TestStats> {
  const stats = createTestStats();
  stats.start();

  for (const test of tests) {
    const passed = await safeTest(test.fn, test.name);
    if (passed) {
      stats.pass();
    } else {
      stats.fail(new Error(`测试 ${test.name} 失败`));
    }
  }

  return stats.end();
}
