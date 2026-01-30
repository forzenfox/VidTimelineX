module.exports = {
  // 测试环境设置
  testEnvironment: "jest-environment-jsdom",

  // 模块解析配置
  modulePaths: ["<rootDir>/src"],

  // 模块名称映射，使用正确的配置语法
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  // 转换规则
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.test.json",
        // 启用快速编译
        fast: true,
      },
    ],
  },

  // 文件扩展名处理
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],

  // 测试文件匹配模式 - 适配新的目录结构
  testMatch: [
    "**/tests/unit/**/*.test.(ts|tsx|js|jsx)",
    "**/tests/integration/**/*.test.(ts|tsx|js|jsx)",
    "**/tests/e2e/**/*.test.(ts|tsx|js|jsx)",
  ],

  // 启用并行测试
  maxWorkers: "75%",
  // 测试超时时间
  testTimeout: 30000,
  // 禁用测试顺序随机化
  testSequencer: "@jest/test-sequencer",
  // 启用详细输出
  verbose: true,
  // 显示测试执行时间
  displayName: {
    name: "FRONTEND",
    color: "blue",
  },
  // 启用测试缓存
  cache: true,
  // 缓存目录
  cacheDirectory: "<rootDir>/node_modules/.jest-cache",
  // 缓存清理阈值（文件数）
  cacheThreshold: 10000,
  // 缓存压缩
  cacheCompression: true,
  // 测试路径忽略模式
  testPathIgnorePatterns: [
    "node_modules",
    "dist",
    "build",
    "coverage",
    "test-results",
    ".next",
    ".nuxt",
    ".vite",
    ".turbo",
  ],
  // 测试名称忽略模式
  testNameIgnorePatterns: ["\\.d\\.ts$", "\\.test\\.d\\.ts$"],
  // 模块路径忽略模式
  modulePathIgnorePatterns: ["node_modules", "dist", "build"],
  // 测试排序器
  testSequencer: "@jest/test-sequencer",
  // 测试环境变量
  testEnvironmentOptions: {
    customExportConditions: [""],
  },
  // 测试路径映射
  testPathPattern: undefined,
  // 测试名称模式
  testNamePattern: undefined,
  // 测试文件扩展名
  testFileExtensions: ["test.ts", "test.tsx", "test.js", "test.jsx"],
  // 测试超时配置
  testTimeout: 30000,
  // 测试重试配置
  retryTimes: 3,
  // 测试失败后是否退出
  bail: 0,
  // 测试输出格式
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: "test-results",
        outputName: "junit.xml",
      },
    ],
  ],
  // 测试覆盖率配置
  coverageDirectory: "<rootDir>/coverage",
  coverageReporters: ["text", "lcov", "json-summary", "html"],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/app/main.tsx",
    "!src/app/App.tsx",
    "!src/app/routes.tsx",
  ],
  // 测试设置文件
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  setupFiles: ["<rootDir>/tests/setup-global.ts"],
  // 全局变量
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.test.json",
      fast: true,
    },
  },
};
