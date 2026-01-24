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
    "^.+.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.test.json",
      },
    ],
  },
  // 文件扩展名处理
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  // 测试文件匹配模式 - 适配新的目录结构
  testMatch: [
    "**/?(*.)(spec|test).(ts|tsx|js|jsx)",
    "src/features/**/*.(spec|test).(ts|tsx|js|jsx)",
    "tests/integration/**/*.(spec|test).(ts|tsx|js|jsx)",
  ],
  // 设置测试覆盖率阈值
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  // 覆盖率报告配置
  coverageReporters: ["text", "lcov", "json-summary"],
  // 覆盖率收集目录 - 更新以适配新的目录结构
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/app/main.tsx",
    "!src/app/App.tsx",
    "!src/app/routes.tsx",
  ],
  // 测试前的设置文件 - 更新路径
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
};
