module.exports = {
  env: {
    jest: true,
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jest/recommended",
    "plugin:jest/style",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["@typescript-eslint", "jest", "react", "react-hooks"],
  rules: {
    // Jest相关规则
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error",
    "jest/expect-expect": [
      "error",
      {
        assertFunctionNames: ["expect", "expectElementToHaveClass"],
      },
    ],

    // 测试代码特定规则
    "jest/no-conditional-expect": "error",
    "jest/no-duplicate-hooks": "error",
    "jest/no-test-prefixes": "error",
    "jest/prefer-hooks-on-top": "error",
    "jest/prefer-spy-on": "warn",
    "jest/prefer-strict-equal": "warn",
    "jest/require-to-throw-message": "warn",
    "jest/valid-describe": "error",

    // React相关规则
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",

    // TypeScript相关规则
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/no-empty-function": "warn",
    "@typescript-eslint/no-non-null-assertion": "warn",

    // 通用规则
    "no-console": "warn",
    "no-debugger": "error",
    "no-unused-vars": "off",
    "prefer-const": "error",
    "arrow-body-style": ["warn", "as-needed"],
  },
  overrides: [
    {
      files: ["**/*.test.ts", "**/*.test.tsx", "**/*.e2e.ts", "**/*.e2e.tsx"],
      rules: {
        "jest/expect-expect": "error",
        "jest/no-standalone-expect": "error",
        "jest/no-commented-out-tests": "warn",
      },
    },
    {
      files: ["tests/utils/**/*.ts", "tests/utils/**/*.tsx"],
      rules: {
        "jest/expect-expect": "off",
      },
    },
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
};
