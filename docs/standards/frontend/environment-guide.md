# 环境变量规范指南

## 1. 概述

本文档定义了 VidTimelineX 前端项目的环境变量使用规范，包括命名规则、文件组织、类型定义、使用方法和安全最佳实践。所有环境变量的使用都应遵循本规范。

---

## 2. 环境变量文件组织

### 2.1 标准文件结构

```
frontend/
├── .env.example              # 环境变量示例（提交到 Git）
├── .env.development          # 开发环境变量（提交到 Git）
├── .env.production           # 生产环境变量（提交到 Git）
├── .env.development.local    # 开发环境本地变量（不提交）
├── .env.production.local     # 生产环境本地变量（不提交）
└── .env                      # 通用环境变量（不提交）
```

### 2.2 文件优先级

Vite 环境变量的加载优先级（从高到低）：

1. `.env` - 通用环境变量
2. `.env.[mode]` - 指定模式的环境变量
3. `.env.[mode].local` - 指定模式的本地环境变量
4. `.env.[mode].local` > `.env.[mode]` > `.env`

**示例**：
```bash
# 开发模式（npm run dev）加载顺序：
.env.development.local    # 优先级最高
.env.development          # 优先级中等
.env                      # 优先级最低
```

### 2.3 Git 提交规则

**✅ 应该提交**：
- `.env.example` - 示例文件
- `.env.development` - 开发环境配置
- `.env.production` - 生产环境配置

**❌ 不应提交**：
- `.env` - 通用环境变量
- `.env.*.local` - 本地环境变量
- 包含敏感信息的文件

**.gitignore 配置**：
```gitignore
# 环境变量
.env
.env.*.local

# 敏感信息
.env.secret
.env.local
```

---

## 3. 环境变量命名规范

### 3.1 命名规则

**规则**：
- 所有环境变量必须使用 `VITE_` 前缀
- 使用全大写字母
- 单词间使用下划线分隔
- 名称应该清晰表达用途

**✅ 正确示例**：
```bash
VITE_API_BASE_URL=http://localhost:3000/api
VITE_CUSTOM_DOMAIN=example.com
VITE_USE_JSDELIVR_CDN=false
VITE_BASE_URL=/
VITE_HMR_ENABLED=false
VITE_ANALYZE_BUILD=false
```

**❌ 错误示例**：
```bash
API_BASE_URL=...           # ❌ 缺少 VITE_ 前缀
VITE_apiBaseUrl=...        # ❌ 不是全大写
VITE_APIBASEURL=...        # ❌ 缺少下划线分隔
VITE_URL=...               # ❌ 名称太泛
```

### 3.2 命名分类

#### API 配置
```bash
VITE_API_BASE_URL              # API 基础 URL
VITE_API_VERSION               # API 版本号
VITE_API_TIMEOUT               # API 请求超时时间
```

#### CDN 配置
```bash
VITE_USE_JSDELIVR_CDN          # 是否使用 jsDelivr CDN
VITE_CDN_BASE_URL              # CDN 基础 URL
```

#### 构建配置
```bash
VITE_BASE_URL                  # 应用基础路径
VITE_CUSTOM_DOMAIN             # 自定义域名
VITE_ANALYZE_BUILD             # 是否分析构建
VITE_ENABLE_MINIFICATION       # 是否启用代码压缩
```

#### 开发配置
```bash
VITE_HMR_ENABLED               # 是否启用热模块替换
VITE_DISABLE_WEBSOCKET         # 是否禁用 WebSocket
```

#### 功能开关
```bash
VITE_ENABLE_DANMAKU            # 是否启用弹幕功能
VITE_ENABLE_ANALYTICS          # 是否启用分析功能
```

---

## 4. 环境变量类型定义

### 4.1 创建类型定义文件

**文件位置**：`src/env.d.ts`

```typescript
/// <reference types="vite/client" />

/**
 * 导入元数据环境变量接口
 * 
 * @description 定义项目中所有可用的环境变量
 * 所有环境变量必须使用 VITE_ 前缀
 */
interface ImportMetaEnv {
  /**
   * API 基础 URL
   * @example "http://localhost:3000/api"
   */
  readonly VITE_API_BASE_URL: string;

  /**
   * 自定义域名
   * @example "vx.forzenfox.com"
   * @optional
   */
  readonly VITE_CUSTOM_DOMAIN?: string;

  /**
   * 是否使用 jsDelivr CDN
   * @default "false"
   */
  readonly VITE_USE_JSDELIVR_CDN: string;

  /**
   * 应用基础路径
   * @default "/"
   */
  readonly VITE_BASE_URL: string;

  /**
   * 是否启用 HMR（热模块替换）
   * @default "false"
   */
  readonly VITE_HMR_ENABLED: string;

  /**
   * 是否禁用 WebSocket 连接
   * @default "true"
   */
  readonly VITE_DISABLE_WEBSOCKET: string;

  /**
   * 是否分析构建
   * @default "false"
   */
  readonly VITE_ANALYZE_BUILD: string;

  /**
   * 是否启用代码压缩
   * @default "true"
   */
  readonly VITE_ENABLE_MINIFICATION: string;
}

/**
 * 导入元数据接口
 */
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

### 4.2 更新 TypeScript 配置

**文件位置**：`tsconfig.app.json`

```json
{
  "compilerOptions": {
    "types": ["vite/client"],
    "typeRoots": ["./node_modules/@types", "./src/types"]
  },
  "include": ["src/**/*", "src/env.d.ts"]
}
```

---

## 5. 环境变量使用规范

### 5.1 在代码中使用

**✅ 正确示例**：
```typescript
// src/utils/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiClient = {
  baseURL: API_BASE_URL,
  timeout: 30000,
};

// src/utils/cdn.ts
const useCDN = import.meta.env.VITE_USE_JSDELIVR_CDN === "true";

export const getAssetUrl = (path: string) => {
  if (useCDN) {
    return `https://cdn.jsdelivr.net/gh/owner/repo${path}`;
  }
  return path;
};
```

**❌ 错误示例**：
```typescript
// ❌ 直接使用，缺少类型检查
const url = import.meta.env.VITE_API_BASE_URL;

// ❌ 使用 process.env（Create React App 风格）
const url = process.env.REACT_APP_API_BASE_URL;

// ❌ 使用未定义的环境变量
const url = import.meta.env.VITE_UNDEFINED_VAR;
```

### 5.2 在配置中使用

**Vite 配置**：
```typescript
// vite.config.ts
import { defineConfig } from "vite";

export default defineConfig({
  base: import.meta.env.VITE_BASE_URL || "/",
  
  server: {
    port: 3000,
    // 使用环境变量配置代理
    proxy: {
      "/api": {
        target: import.meta.env.VITE_API_BASE_URL,
        changeOrigin: true,
      },
    },
  },
  
  build: {
    minify: import.meta.env.VITE_ENABLE_MINIFICATION !== "false",
    // 使用环境变量控制分析工具
    rollupOptions: {
      plugins: [
        import.meta.env.VITE_ANALYZE_BUILD === "true" && visualizer(),
      ].filter(Boolean),
    },
  },
});
```

### 5.3 条件判断

**✅ 正确示例**：
```typescript
// 字符串比较
const isProduction = import.meta.env.PROD;
const isDevelopment = import.meta.env.DEV;

// 环境变量值比较
const useCDN = import.meta.env.VITE_USE_JSDELIVR_CDN === "true";
const analyzeBuild = import.meta.env.VITE_ANALYZE_BUILD === "true";

// 可选值处理
const customDomain = import.meta.env.VITE_CUSTOM_DOMAIN ?? "default.com";
```

**❌ 错误示例**：
```typescript
// ❌ 直接作为布尔值使用
if (import.meta.env.VITE_USE_JSDELIVR_CDN) {}  // 始终是 true（非空字符串）

// ❌ 使用数字比较
if (import.meta.env.VITE_API_TIMEOUT > 30000) {}  // 字符串比较

// 正确做法：
const useCDN = import.meta.env.VITE_USE_JSDELIVR_CDN === "true";
const timeout = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;
```

---

## 6. 环境变量示例文件

### 6.1 创建 .env.example

**文件位置**：`.env.example`

```bash
# ===========================================
# VidTimelineX 环境变量配置示例
# ===========================================
# 使用说明：
# 1. 复制此文件为 .env.development 或 .env.production
# 2. 根据实际需求修改配置值
# 3. 不要提交包含敏感信息的文件到 Git
# ===========================================

# -------------------------------------------
# API 配置
# -------------------------------------------
# API 基础 URL
# 开发环境：http://localhost:3000/api
# 生产环境：https://api.example.com
VITE_API_BASE_URL=http://localhost:3000/api

# API 请求超时时间（毫秒）
# VITE_API_TIMEOUT=30000

# -------------------------------------------
# CDN 配置
# -------------------------------------------
# 是否使用 jsDelivr CDN
# 可选值：true | false
# 默认值：false
VITE_USE_JSDELIVR_CDN=false

# CDN 基础 URL（可选）
# VITE_CDN_BASE_URL=https://cdn.example.com

# -------------------------------------------
# 构建配置
# -------------------------------------------
# 应用基础路径
# 使用自定义域名：/
# 使用 GitHub Pages：/仓库名/
VITE_BASE_URL=/

# 自定义域名（可选）
# VITE_CUSTOM_DOMAIN=vx.forzenfox.com

# 是否分析构建
# 可选值：true | false
# 默认值：false
VITE_ANALYZE_BUILD=false

# 是否启用代码压缩
# 可选值：true | false
# 默认值：true
VITE_ENABLE_MINIFICATION=true

# -------------------------------------------
# 开发配置
# -------------------------------------------
# 是否启用 HMR（热模块替换）
# 可选值：true | false
# 默认值：false
VITE_HMR_ENABLED=false

# 是否禁用 WebSocket 连接
# 可选值：true | false
# 默认值：true
VITE_DISABLE_WEBSOCKET=true

# -------------------------------------------
# 功能开关
# -------------------------------------------
# 是否启用弹幕功能
# 可选值：true | false
# 默认值：true
# VITE_ENABLE_DANMAKU=true

# 是否启用分析功能
# 可选值：true | false
# 默认值：false
# VITE_ENABLE_ANALYTICS=false
```

### 6.2 开发环境配置

**文件位置**：`.env.development`

```bash
# 开发环境配置
# 基于 .env.example 创建，根据开发需求调整

# API 配置
VITE_API_BASE_URL=http://localhost:3000/api

# CDN 配置（开发环境不使用 CDN）
VITE_USE_JSDELIVR_CDN=false

# 构建配置
VITE_BASE_URL=/
VITE_ANALYZE_BUILD=false
VITE_ENABLE_MINIFICATION=false

# 开发配置
VITE_HMR_ENABLED=false
VITE_DISABLE_WEBSOCKET=true
```

### 6.3 生产环境配置

**文件位置**：`.env.production`

```bash
# 生产环境配置
# 基于 .env.example 创建，根据生产需求调整

# API 配置
VITE_API_BASE_URL=https://api.example.com

# CDN 配置（生产环境使用 CDN）
VITE_USE_JSDELIVR_CDN=true

# 构建配置
VITE_BASE_URL=/
VITE_CUSTOM_DOMAIN=vx.forzenfox.com
VITE_ANALYZE_BUILD=false
VITE_ENABLE_MINIFICATION=true

# 开发配置（生产环境不需要）
# VITE_HMR_ENABLED=false
# VITE_DISABLE_WEBSOCKET=true
```

---

## 7. 安全最佳实践

### 7.1 敏感信息处理

**❌ 绝对不要提交到 Git**：
```bash
# ❌ 错误：包含敏感信息
VITE_API_SECRET_KEY=sk_1234567890
VITE_DATABASE_PASSWORD=password123
VITE_JWT_SECRET=jwt_secret_key
```

**✅ 正确做法**：
```bash
# ✅ 使用本地环境变量文件
# .env.development.local
VITE_API_SECRET_KEY=sk_1234567890

# ✅ 在后端存储敏感信息
# 前端通过 API 获取，不直接存储
```

### 7.2 环境变量验证

**创建验证工具函数**：
```typescript
// src/utils/env-validator.ts

/**
 * 环境变量验证器
 */
export const validateEnv = () => {
  const requiredEnvVars = ["VITE_API_BASE_URL", "VITE_BASE_URL"];
  
  const missing = requiredEnvVars.filter(
    (envVar) => !import.meta.env[envVar]
  );
  
  if (missing.length > 0) {
    console.error(
      "缺少必需的环境变量:",
      missing.join(", ")
    );
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
};

// 在应用启动时调用
// src/app/main.tsx
import { validateEnv } from "@/utils/env-validator";

validateEnv();
```

### 7.3 默认值处理

**✅ 提供合理的默认值**：
```typescript
// src/config/app.ts

export const config = {
  apiUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  baseUrl: import.meta.env.VITE_BASE_URL || "/",
  useCDN: import.meta.env.VITE_USE_JSDELIVR_CDN === "true",
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
};
```

---

## 8. 常见问题 FAQ

### Q1: 为什么环境变量必须以 VITE_ 开头？
**A**: Vite 默认只暴露以 `VITE_` 开头的环境变量，这是为了防止意外暴露敏感信息（如数据库密码、API 密钥等）。

### Q2: 如何在测试环境中使用不同的环境变量？
**A**: 创建 `.env.test` 文件：
```bash
# .env.test
VITE_API_BASE_URL=http://localhost:3001/api
VITE_BASE_URL=/
```

### Q3: 环境变量可以是数字或布尔值吗？
**A**: 环境变量在 Vite 中都是字符串类型。如果需要数字或布尔值，需要手动转换：
```typescript
const timeout = Number(import.meta.env.VITE_API_TIMEOUT);  // 数字
const useCDN = import.meta.env.VITE_USE_JSDELIVR_CDN === "true";  // 布尔值
```

### Q4: 如何在运行时更改环境变量？
**A**: 环境变量在构建时就被替换，无法在运行时更改。如果需要运行时配置，可以：
1. 使用配置文件（如 `config.json`）
2. 使用后端 API 提供配置
3. 使用浏览器的 localStorage

### Q5: 如何为不同的部署环境使用不同的配置？
**A**: 使用多个环境文件：
```bash
.env.development       # 本地开发
.env.staging           # 预发布环境
.env.production        # 生产环境
```

使用方式：
```bash
# 开发
npm run dev

# 预发布
npm run build -- --mode staging

# 生产
npm run build -- --mode production
```

---

## 9. 代码审查检查清单

### 9.1 命名规范检查
- [ ] 环境变量是否以 `VITE_` 开头？
- [ ] 是否使用全大写字母？
- [ ] 单词间是否使用下划线分隔？
- [ ] 名称是否清晰表达用途？

### 9.2 文件组织检查
- [ ] 是否创建了 `.env.example` 文件？
- [ ] `.env.*.local` 文件是否在 `.gitignore` 中？
- [ ] 是否包含敏感信息？

### 9.3 类型定义检查
- [ ] 是否创建了 `src/env.d.ts` 文件？
- [ ] 是否定义了所有使用的环境变量？
- [ ] 是否有完整的 JSDoc 注释？

### 9.4 使用规范检查
- [ ] 是否使用 `import.meta.env` 访问环境变量？
- [ ] 是否正确处理了字符串到布尔值/数字的转换？
- [ ] 是否提供了合理的默认值？

### 9.5 安全检查
- [ ] 是否包含敏感信息？
- [ ] 是否验证了必需的环境变量？
- [ ] 是否有适当的错误处理？

---

## 10. 更新记录

| 版本 | 日期 | 更新内容 | 负责人 |
|------|------|----------|--------|
| v1.0 | 2026-03-01 | 初始版本，定义环境变量规范 | - |

---

**文档版本**: v1.0  
**最后更新**: 2026-03-01  
**维护人员**: VidTimelineX 开发团队
