# GitHub部署配置技术文档

## 一、文档概述

本文档系统性地梳理了VidTimelineX项目的GitHub部署相关配置与实现方案，涵盖部署架构设计、CI/CD工作流配置、环境变量管理、部署触发机制及常见问题解决方案等核心内容。文档旨在为技术团队提供清晰、准确的部署指南，确保成员能够依据文档准确理解和执行GitHub部署流程。

本项目采用现代化的前端技术栈（React 19 + TypeScript + Vite），通过GitHub Actions实现自动化构建与部署，部署目标为GitHub Pages静态托管平台。项目采用双工作流设计，分别处理master主分支的部署任务和非master分支的持续集成任务，实现了开发流程的自动化与规范化。

---

## 二、部署架构设计

### 2.1 整体架构概览

本项目采用前后端分离的静态站点部署架构，前端代码通过GitHub Actions自动化构建后部署至GitHub Pages平台。整个部署流程遵循标准的现代化CI/CD实践，包括代码检出、依赖安装、代码检查、测试执行、构建打包和最终部署等关键环节。

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          GitHub部署架构图                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌──────────────┐                                                      │
│   │   GitHub     │                                                      │
│   │   Repository │                                                      │
│   └──────┬───────┘                                                      │
│          │                                                              │
│          │ Push / Dispatch                                              │
│          ▼                                                              │
│   ┌──────────────────────────────────────────────────────────────┐     │
│   │                    GitHub Actions                             │     │
│   │  ┌─────────────────────┐  ┌─────────────────────────────┐    │     │
│   │  │   deploy.yml        │  │   ci-non-master.yml         │    │     │
│   │  │   (master分支)      │  │   (非master分支)            │    │     │
│   │  └──────────┬──────────┘  └──────────────┬──────────────┘    │     │
│   │             │                             │                   │     │
│   │             ▼                             ▼                   │     │
│   │  ┌─────────────────────┐  ┌─────────────────────────────┐    │     │
│   │  │ 构建 + 部署         │  │ 构建 + 测试（无部署）        │    │     │
│   │  │                     │  │                             │    │     │
│   │  │ 1. Checkout         │  │ 1. Checkout                 │    │     │
│   │  │ 2. Node.js Setup    │  │ 2. Node.js Setup            │    │     │
│   │  │ 3. npm install      │  │ 3. npm install              │    │     │
│   │  │ 4. Lint             │  │ 4. Lint                     │    │     │
│   │  │ 5. Test             │  │ 5. Test                     │    │     │
│   │  │ 6. Build            │  │ 6. Build                    │    │     │
│   │  │ 7. Upload Artifacts │  │                             │    │     │
│   │  │ 8. Deploy Pages     │  │                             │    │     │
│   │  │ 9. CNAME Config     │  │                             │    │     │
│   │  └─────────────────────┘  └─────────────────────────────┘    │     │
│   └──────────────────────────────────────────────────────────────┘     │
│                              │                                          │
│                              │ Deploy                                   │
│                              ▼                                          │
│   ┌──────────────────────────────────────────────────────────────┐     │
│   │                   GitHub Pages                               │     │
│   │                                                              │     │
│   │   自定义域名: https://vx.forzenfox.com/                      │     │
│   │                                                              │     │
│   │   备用地址: https://用户名.github.io/VidTimelineX/           │     │
│   │                                                              │     │
│   └──────────────────────────────────────────────────────────────┘     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 分支策略说明

项目采用Git Flow的简化分支模型，主要包含以下分支类型：

| 分支名称 | 用途 | 保护策略 | 触发工作流 |
|---------|------|---------|-----------|
| master | 主分支，稳定可部署版本 | 强制代码审查，限制直接推送 | deploy.yml |
| develop | 开发分支，日常开发集成 | 建议代码审查 | ci-non-master.yml |
| feature/* | 功能分支，新功能开发 | 可直接推送 | ci-non-master.yml |
| fix/* | 修复分支，bug修复 | 可直接推送 | ci-non-master.yml |

master分支作为唯一的生产部署分支，任何代码变更都必须经过完整的CI流程验证后才能合并。合并到master分支后，将自动触发deploy.yml工作流执行部署任务。非master分支的代码变更会触发ci-non-master.yml工作流，执行完整的构建和测试流程但不进行部署，以便在代码合并前验证变更的正确性。

### 2.3 部署环境配置

本项目区分开发和生产两种环境，通过Vite的环境变量机制实现配置管理。同时支持自定义域名和GitHub Pages子路径两种部署方式。

**生产环境配置**（frontend/.env.production）：

```properties
# 生产环境变量配置
# 自定义域名配置（使用自定义域名时取消注释并修改为你的域名）
# VITE_CUSTOM_DOMAIN=vx.forzenfox.com

# 备用配置：使用GitHub Pages子路径
# VITE_BASE_URL=/VidTimelineX/

# 默认使用根路径（配合自定义域名使用）
VITE_BASE_URL=/
```

**开发环境配置**（frontend/.env.development）：

```properties
# WebSocket/HMR配置
# 禁用WebSocket连接，避免纯静态站点的开发环境错误
VITE_HMR_ENABLED=false
VITE_DISABLE_WEBSOCKET=true

# 构建优化配置
VITE_ANALYZE_BUILD=false
VITE_ENABLE_MINIFICATION=true

# 可选：配置自定义域名进行本地预览测试
# VITE_CUSTOM_DOMAIN=vx.forzenfox.com
```

在GitHub Actions部署工作流中，VITE_CUSTOM_DOMAIN变量被显式设置为vx.forzenfox.com，以支持自定义域名部署。这一配置确保了构建产物中的静态资源引用路径正确指向自定义域名，同时工作流会自动生成CNAME文件以完成域名配置验证。

---

## 三、CI/CD工作流配置详解

### 3.1 主部署工作流（deploy.yml）

deploy.yml工作流负责将master分支的代码自动部署至GitHub Pages，是项目自动化部署的核心配置。

**工作流文件路径**：.github/workflows/deploy.yml

**触发条件**：

```yaml
on:
  push:
    branches: [master]
  workflow_dispatch:
    inputs:
      custom_domain:
        description: 'Custom domain (e.g., vx.forzenfox.com)'
        required: false
        default: ''
```

工作流支持三种触发方式：代码推送触发（仅master分支）、手动触发（workflow_dispatch）、带自定义域名参数触发。手动触发功能允许运维人员在需要时重新执行部署任务，并可选择指定自定义域名参数。

**权限配置**：

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

权限配置遵循最小权限原则，仅请求部署所需的必要权限。contents: read用于检出代码，pages: write用于部署: write页面，id-token用于OIDC身份验证。

**并发控制**：

```yaml
concurrency:
  group: "pages"
  cancel-in-progress: false
```

并发组设置为"pages"，确保同一时间只有一个部署任务在执行。cancel-in-progress设置为false，表示即使有新的推送也不会取消正在进行的部署任务，这保证了部署的完整性和一致性。

**完整工作流配置**：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [master]
  workflow_dispatch:
    inputs:
      custom_domain:
        description: 'Custom domain (e.g., vx.forzenfox.com)'
        required: false
        default: ''

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
          
      - name: Install dependencies
        run: npm ci
        working-directory: frontend
        
      - name: Lint code
        run: npm run lint
        working-directory: frontend
        
      - name: Run tests
        run: npm run test:ci
        working-directory: frontend
        
      - name: Build project
        run: npm run build
        working-directory: frontend
        env:
          VITE_CUSTOM_DOMAIN: ${{ github.event.inputs.custom_domain || 'vx.forzenfox.com' }}
          
      - name: Upload build artifacts
        uses: actions/upload-pages-artifact@v3
        with:
          path: frontend/build/
          
      - name: Configure custom domain
        if: github.event.inputs.custom_domain != '' || true
        run: |
          echo "${{ github.event.inputs.custom_domain || 'vx.forzenfox.com' }}" > frontend/build/CNAME
        shell: bash
          
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**工作流执行步骤说明**：

第一阶段为构建阶段（build job），包含以下关键步骤：

1. **Checkout**：使用actions/checkout@v4检出代码，版本v4相比v3有性能优化，支持更快的代码检出速度。

2. **Node.js Setup**：配置Node.js 20运行环境，使用npm缓存加速依赖安装。cache-dependency-path指定了缓存依赖路径为frontend/package-lock.json，确保只有frontend目录的依赖变化才会触发缓存失效。

3. **Install Dependencies**：执行npm ci命令安装依赖，相比npm install，npm ci会严格按照package-lock.json安装依赖，确保构建的一致性。working-directory指定在frontend目录下执行命令。

4. **Lint Code**：执行代码静态检查，使用项目配置的ESLint规则检查代码质量，确保代码符合项目编码规范。

5. **Run Tests**：执行测试套件，test:ci命令以CI模式运行Jest，生成覆盖率报告并限制最大工作进程数以优化执行时间。

6. **Build Project**：执行生产构建，生成静态站点文件。构建时显式设置VITE_CUSTOM_DOMAIN环境变量为vx.forzenfox.com，确保静态资源路径正确指向自定义域名。

7. **Configure Custom Domain**：将自定义域名写入CNAME文件，该文件用于GitHub Pages验证域名所有权。构建产物中的CNAME文件确保部署后域名解析正确。

8. **Upload Build Artifacts**：上传构建产物到GitHub Actions，使用actions/upload-pages-artifact@v3将frontend/build目录的内容上传为部署产物。

第二阶段为部署阶段（deploy job）：

1. **Dependencies**：deploy job依赖build job完成，确保只有构建成功后才会执行部署。

2. **Environment**：配置部署环境为github-pages，此配置会在GitHub仓库的Settings > Environments页面创建对应的部署记录，便于追踪部署历史。

3. **Deploy to GitHub Pages**：使用actions/deploy-pages@v4执行实际部署操作，该action会自动将build artifact部署到GitHub Pages平台。

### 3.2 持续集成工作流（ci-non-master.yml）

ci-non-master.yml工作流负责处理非master分支的代码变更，执行完整的构建和测试流程但不进行部署。

**工作流文件路径**：.github/workflows/ci-non-master.yml

**触发条件**：

```yaml
on:
  push:
    branches-ignore: [master]
```

工作流在除master外的所有分支发生代码推送时触发，包括develop分支、功能分支（feature/*）、修复分支（fix/*）等。

**完整工作流配置**：

```yaml
name: CI for Non-master Branches

on:
  push:
    branches-ignore: [master]

permissions:
  contents: read

concurrency:
  group: "ci-${{ github.ref }}"
  cancel-in-progress: true

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
          
      - name: Install dependencies
        run: npm ci
        working-directory: frontend
        
      - name: Static analysis (Lint)
        run: npm run lint
        working-directory: frontend
        
      - name: Run tests
        run: npm run test:ci
        working-directory: frontend
        
      - name: Build project
        run: npm run build
        working-directory: frontend
        env:
          VITE_BASE_URL: /
```

**工作流执行步骤说明**：

ci工作流的执行步骤与deploy.yml的build job类似，包含代码检出、Node.js环境配置、依赖安装、代码检查、测试执行和生产构建。关键差异在于：

1. **并发控制**：使用分支引用（github.ref）作为并发组标识，不同分支的CI任务相互独立，不会互相影响。

2. **取消进行中的任务**：cancel-in-progress设置为true，当同一分支有新的推送时，会自动取消正在进行的CI任务，避免资源浪费和结果混乱。

3. **无部署步骤**：ci工作流只执行到构建步骤，不进行部署操作，确保非生产分支的代码变更不会意外发布。

---

## 四、前端构建配置

### 4.1 Vite构建配置详解

项目的构建配置集中在frontend/vite.config.ts文件中，该文件定义了完整的构建参数和插件配置。

**配置文件路径**：frontend/vite.config.ts

**完整配置代码**：

```typescript
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // 自定义域名配置
  const customDomain = env.VITE_CUSTOM_DOMAIN;
  const baseUrl = customDomain 
    ? `https://${customDomain}/` 
    : (env.VITE_BASE_URL || "/");

  return {
    base: baseUrl,
    plugins: [
      react(),
      tailwindcss(),
      ViteImageOptimizer({
        png: {
          quality: 80,
        },
        jpeg: {
          quality: 80,
        },
        jpg: {
          quality: 80,
        },
        webp: {
          quality: 85,
        },
        gif: {
          quality: 70,
        }),
    ],
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      target: "esnext",
      outDir: "build",
      rollupOptions: {
        output: {
          assetFileNames: "assets/[name]-[hash:8].[ext]",
          chunkFileNames: "chunks/[name]-[hash:8].js",
          entryFileNames: "entry/[name]-[hash:8].js",
        },
      },
      minify: "esbuild",
      cssCodeSplit: true,
      brotliSize: true,
      sourcemap: false,
      emptyOutDir: true,
    },
    server: {
      port: 3000,
      open: true,
      proxy: {
        "/bilibili-img": {
          target: "https://i1.hdslb.com",
          changeOrigin: true,
          secure: false,
          rewrite: path => path.replace(/^\/bilibili-img/, ""),
          configure: proxy => {
            proxy.on("proxyReq", proxyReq => {
              proxyReq.setHeader("Referer", "https://www.bilibili.com/");
              proxyReq.setHeader("Origin", "https://www.bilibili.com");
            }),
          },
        },
        "/unsplash": {
          target: "https://images.unsplash.com",
          changeOrigin: true,
          secure: false,
          rewrite: path => path.replace(/^\/unsplash/, ""),
          configure: proxy => {
            proxy.on("proxyReq", proxyReq => {
              proxyReq.setHeader("Referer", "https://images.unsplash.com/");
              proxyReq.setHeader("Origin", "https://images.unsplash.com");
            }),
          },
        },
      },
    },
    optimizeDeps: {
      include: ["react", "react-dom", "react-router-dom", "@tanstack/react-query"],
      exclude: ["@radix-ui/react-*"],
      esbuildOptions: {
        target: "esnext",
        define: {
          "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
        },
        treeShaking: true,
      },
    },
  };
});
```

**配置参数详解**：

1. **base参数**：配置基础路径，支持两种模式。当设置了VITE_CUSTOM_DOMAIN环境变量时，自动生成`https://{domain}/`格式的基础路径，适用于自定义域名部署；否则使用VITE_BASE_URL的值，默认为"/"。这种灵活的配置方式支持同时兼容自定义域名和GitHub Pages子路径部署场景。

2. **plugins配置**：启用React插件、Tailwind CSS插件和图片优化插件。ViteImageOptimizer配置了各类型图片的压缩质量，PNG和JPEG质量为80%，WebP为85%，GIF为70%。

3. **resolve配置**：配置模块解析行为，添加.js、.jsx、.ts、.tsx、.json等文件扩展名自动补全。alias配置将"@"符号指向src目录，简化导入路径。

4. **build配置**：构建参数详细说明如下：
   - target: "esnext" - 使用最新的ECMAScript特性
   - outDir: "build" - 输出目录为build，符合GitHub Pages默认查找路径
   - assetFileNames: "assets/[name]-[hash:8].[ext]" - 资源文件命名格式，包含8位哈希值用于缓存控制
   - chunkFileNames: "chunks/[name]-[hash:8].js" - 代码分割块命名格式
   - entryFileNames: "entry/[name]-[hash:8].js" - 入口文件命名格式
   - minify: "esbuild" - 使用esbuild进行代码压缩，速度快效果好
   - cssCodeSplit: true - 启用CSS代码分割
   - brotliSize: true - 生成Brotli压缩大小报告
   - sourcemap: false - 生产环境不生成sourcemap，减少构建产物大小
   - emptyOutDir: true - 构建前清空输出目录

5. **server配置**：开发服务器配置，包括端口3000、自动打开浏览器和API代理设置。代理配置用于解决B站图片和Unsplash图片的跨域访问问题。

6. **optimizeDeps配置**：优化依赖预构建，include指定需要预构建的依赖，exclude排除不需要预构建的依赖。

### 4.2 package.json构建脚本

**配置文件路径**：frontend/package.json

**构建相关脚本配置**：

```json
{
  "scripts": {
    "dev": "vite --host",
    "prebuild": "node scripts/process-danmaku.js",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "lint": "eslint .",
    "lint:test": "eslint tests --config .eslintrc.test.js",
    "preview": "vite preview",
    "test": "jest",
    "test:ci": "jest --ci --coverage --maxWorkers=100%"
  }
}
```

**脚本功能说明**：

| 脚本名称 | 命令 | 功能说明 |
|---------|------|---------|
| dev | vite --host | 启动开发服务器，--host参数允许外部访问 |
| prebuild | node scripts/process-danmaku.js | 构建前脚本，处理弹幕数据 |
| build | vite build | 执行生产构建，生成静态文件 |
| build:dev | vite build --mode development | 执行开发模式构建，用于测试构建流程 |
| lint | eslint . | 执行ESLint代码检查 |
| lint:test | eslint tests --config .eslintrc.test.js | 使用测试专用配置检查测试代码 |
| preview | vite preview | 预览生产构建结果 |
| test:ci | jest --ci --coverage --maxWorkers=100% | CI模式运行测试，生成覆盖率报告 |

---

## 五、部署步骤说明

### 5.1 自动化部署流程

当代码变更推送到master分支时，GitHub Actions自动执行以下部署流程：

```
步骤1：代码触发
    │
    ▼
┌─────────────────┐
│ Push to master  │ ──> GitHub检测到推送，触发deploy.yml工作流
└─────────────────┘
    │
    ▼
步骤2：环境准备
    │
    ▼
┌─────────────────┐
│ Checkout        │ ──> 检出master分支代码
│ Node.js Setup   │ ──> 安装Node.js 20环境
│ npm ci          │ ──> 安装项目依赖
└─────────────────┘
    │
    ▼
步骤3：质量检查
    │
    ▼
┌─────────────────┐
│ npm run lint    │ ──> 执行ESLint代码检查
│                 │     检查通过才能继续
└─────────────────┘
    │
    ▼
步骤4：测试验证
    │
    ▼
┌─────────────────┐
│ npm run test:ci │ ──> 运行完整测试套件
│                 │     生成覆盖率报告
└─────────────────┘
    │
    ▼
步骤5：构建打包
    │
    ▼
┌─────────────────┐
│ npm run build   │ ──> 执行生产构建
│ VITE_CUSTOM_DOM │     设置为vx.forzenfox.com
│AIN=vx.forzenfox.│     自动生成CNAME文件
│com             │
└─────────────────┘
    │
    ▼
步骤5.5：域名配置
    │
    ▼
┌─────────────────┐
│ CNAME File      │ ──> 生成CNAME文件
│                 │     内容：vx.forzenfox.com
└─────────────────┘
    │
    ▼
步骤6：部署上线
    │
    ▼
┌─────────────────┐
│ Upload Pages    │ ──> 上传构建产物
│ Artifact        │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ Deploy to Pages │ ──> 部署到GitHub Pages
└─────────────────┘
    │
    ▼
步骤7：完成
    │
    ▼
┌─────────────────────────────────────────────────────────┐
│ 部署成功                                                │
│ • 自定义域名: https://vx.forzenfox.com                  │
│ • 备用地址: https://用户名.github.io/VidTimelineX/      │
└─────────────────────────────────────────────────────────┘
```

### 5.2 手动触发部署

在某些情况下（如部署失败需要重试或需要重新部署同一版本），可以通过手动触发方式执行部署：

1. 进入GitHub仓库页面
2. 点击"Actions"标签
3. 选择"Deploy to GitHub Pages"工作流
4. 点击"Run workflow"按钮
5. 选择要部署的分支（通常是master）
6. 点击"Run workflow"确认执行

### 5.3 本地构建测试

在代码推送到master之前，建议先在本地执行完整的构建流程进行验证：

```bash
# 进入前端目录
cd frontend

# 安装依赖（如果尚未安装）
npm install

# 执行代码检查
npm run lint

# 运行测试
npm run test:ci

# 执行生产构建
npm run build

# 预览构建结果
npm run preview
```

本地构建验证通过后，再将代码推送到master分支触发自动化部署。

---

## 六、环境变量配置

### 6.1 环境变量文件位置

项目使用Vite的环境变量管理机制，配置文件位于frontend目录：

| 文件名 | 用途 | 是否提交到Git |
|--------|------|--------------|
| .env.development | 开发环境变量 | 是 |
| .env.production | 生产环境变量 | 是 |
| .env.local | 本地覆盖变量 | 否 |

### 6.2 变量说明

**VITE_CUSTOM_DOMAIN**：设置自定义域名，用于支持vx.forzenfox.com等自定义域名部署。设置此变量后，Vite会自动生成`https://{domain}/`格式的基础路径。优先级高于VITE_BASE_URL。

**VITE_BASE_URL**：设置应用的基础路径，在GitHub Pages子路径部署时必须正确配置。生产环境构建时默认为/，开发环境默认使用/。仅在VITE_CUSTOM_DOMAIN未设置时生效。

**VITE_HMR_ENABLED**：控制热模块替换功能，在纯静态站点环境中应禁用以避免错误。

**VITE_DISABLE_WEBSOCKET**：禁用WebSocket连接，用于纯静态部署环境。

**VITE_ANALYZE_BUILD**：控制是否启用构建分析工具，用于性能优化分析。

**VITE_ENABLE_MINIFICATION**：控制是否启用代码压缩，默认为true。

### 6.3 GitHub Actions中的环境变量

在GitHub Actions工作流中，通过env参数传递环境变量：

```yaml
- name: Build project
  run: npm run build
  working-directory: frontend
  env:
    VITE_CUSTOM_DOMAIN: ${{ github.event.inputs.custom_domain || 'vx.forzenfox.com' }}
```

这种方式确保在CI环境中使用正确的配置值，绕过本地环境变量文件的设置。通过支持workflow_dispatch输入参数，可以灵活指定不同的自定义域名进行部署。

---

## 七、常见问题及解决方案

### 7.1 构建相关问题

**问题1：构建后资源路径错误**

**症状**：部署后页面加载正常，但图片、样式等静态资源无法显示，控制台出现404错误。

**原因**：VITE_BASE_URL或VITE_CUSTOM_DOMAIN配置与实际部署路径不匹配。

**解决方案**：确保deploy.yml中的环境变量设置正确：

```yaml
- name: Build project
  run: npm run build
  working-directory: frontend
  env:
    VITE_CUSTOM_DOMAIN: vx.forzenfox.com
```

同时检查vite.config.ts中的base配置应使用环境变量：

```typescript
const customDomain = env.VITE_CUSTOM_DOMAIN;
const baseUrl = customDomain 
  ? `https://${customDomain}/` 
  : (env.VITE_BASE_URL || "/");

return {
  base: baseUrl,
  // ...
};
```

**问题2：npm ci安装依赖失败**

**症状**：GitHub Actions执行npm ci时报错，提示依赖版本不匹配或找不到package-lock.json。

**原因**：package-lock.json文件可能未提交、损坏或与package.json不同步。

**解决方案**：确保package-lock.json已提交到版本控制：

```bash
# 检查文件状态
git status frontend/package-lock.json

# 如果未跟踪，添加到版本控制
git add frontend/package-lock.json
git commit -m "Add package-lock.json"
git push
```

**问题3：构建产物过大**

**症状**：构建时间过长或部署包体过大。

**原因**：可能未正确配置代码分割、压缩或图片优化。

**解决方案**：检查vite.config.ts配置：

```typescript
build: {
  minify: "esbuild",
  cssCodeSplit: true,
  brotliSize: true,
  // ...
}
```

确保图片优化插件已正确配置，并且未将大文件纳入版本控制。

### 7.2 部署相关问题

**问题4：GitHub Pages部署失败**

**症状**：工作流执行到deploy步骤时失败，错误信息包含"page build failure"或"permission denied"。

**原因**：可能是GitHub Pages未正确配置、权限不足或仓库类型不支持。

**解决方案**：检查以下配置：

1. 确认仓库类型为Public或已启用GitHub Pages的Private部署

2. 在仓库Settings > Pages中检查部署配置：
   - Source应设置为"Deploy from a branch"
   - Branch应设置为"gh-pages"或"/(root)"

3. 确认工作流权限配置正确：

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

**问题5：部署后页面404**

**症状**：访问部署的URL时显示404错误页面。

**原因**：单页应用（SPA）路由需要服务端支持，否则刷新或直接访问子路由会404。

**解决方案**：由于GitHub Pages原生不支持SPA路由重定向，需要使用HashRouter替代BrowserRouter。在前端代码中使用react-router-dom的HashRouter模式，确保路由信息包含在URL哈希中。

**问题6：部署历史记录为空**

**症状**：GitHub仓库的Deployments页面没有部署记录。

**原因**：deploy.yml中未正确配置environment部分。

**解决方案**：确保deploy job中包含environment配置：

```yaml
deploy:
  environment:
    name: github-pages
    url: ${{ steps.deployment.outputs.page_url }}
  needs: build
  runs-on: ubuntu-latest
  steps:
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v4
```

### 7.3 测试相关问题

**问题7：测试超时**

**症状**：CI中的测试步骤超时失败。

**原因**：测试用例过多或存在异步测试未正确处理。

**解决方案**：优化测试配置，增加超时时间或优化测试执行速度：

```json
{
  "test:ci": "jest --ci --coverage --maxWorkers=100%"
}
```

或者将测试分布在多个工作进程执行，避免单进程阻塞。

**问题8：ESLint检查失败**

**症状**：Lint步骤报错，代码不符合项目规范。

**原因**：代码中存在格式错误、未使用的变量、缺少导入等ESLint规则违规。

**解决方案**：运行ESLint自动修复：

```bash
cd frontend
npm run lint
```

查看具体的错误信息，修复代码问题后重新提交。

### 7.4 自定义域名相关问题

**问题9：自定义域名解析失败**

**症状**：访问vx.forzenfox.com显示DNS错误或无法访问。

**原因**：DNS记录未正确配置或未完全生效。

**解决方案**：

1. 确认已在域名管理控制台添加A记录：
   - 主机记录：@
   - 记录值：185.199.108.153、185.199.109.153、185.199.110.153、185.199.111.153

2. 验证DNS解析：

```bash
nslookup vx.forzenfox.com
# 或
dig vx.forzenfox.com +short
```

3. 等待DNS生效（通常几分钟到几小时），可使用https://dnschecker.org进行全球验证。

**问题10：GitHub Pages未识别自定义域名**

**症状**：GitHub仓库Settings中Custom domain显示警告或验证失败。

**原因**：DNS记录未正确配置、域名被其他服务占用或CNAME文件缺失。

**解决方案**：

1. 确认DNS A记录已正确配置并等待生效
2. 在GitHub仓库Settings > Pages中手动输入自定义域名并保存
3. 确认工作流中包含CNAME文件生成步骤：

```yaml
- name: Configure custom domain
  run: |
    echo "vx.forzenfox.com" > frontend/build/CNAME
```

**问题11：HTTPS证书申请失败**

**症状**：自定义域名无法使用HTTPS访问，GitHub Pages设置中HTTPS选项不可用。

**原因**：域名解析未完成或Let's Encrypt证书签发失败。

**解决方案**：

1. 确认DNS解析已生效（使用nslookup验证）
2. 在GitHub Pages设置中勾选"Enforce HTTPS"
3. 等待几分钟后刷新页面查看证书状态
4. GitHub会自动通过Let's Encrypt为自定义域名签发SSL证书，无需手动配置

**问题12：CNAME文件被覆盖**

**症状**：重新部署后自定义域名配置丢失。

**原因**：构建过程中CNAME文件被删除或未正确生成。

**解决方案**：确保工作流中包含CNAME文件生成步骤，且在Upload build artifacts步骤之前执行。

---

## 八、自定义域名配置

### 8.1 自定义域名概述

本项目支持使用自定义域名（如vx.forzenfox.com）代替GitHub Pages默认的子域名访问网站。使用自定义域名具有以下优势：

- **品牌一致性**：使用自有域名，提升品牌形象
- **专业性**：自定义域名更专业可信
- **记忆性**：域名更易于用户记忆
- **SEO优化**：自定义域名对搜索引擎更友好

### 8.2 支持的域名类型

| 类型 | 示例 | 配置方式 |
|-----|------|---------|
| 根域名 | forzenfox.com | 配置A记录 |
| 子域名 | vx.forzenfox.com | 配置A记录或CNAME |
| www前缀 | www.forzenfox.com | 配置CNAME记录 |

### 8.3 域名配置步骤

**步骤1：GitHub仓库配置**

1. 进入GitHub仓库的Settings > Pages
2. 在"Custom domain"输入框中输入：`vx.forzenfox.com`
3. 点击"Save"保存配置
4. 勾选"Enforce HTTPS"启用HTTPS

**步骤2：DNS配置**

在域名管理控制台添加以下DNS记录：

| 记录类型 | 主机记录 | 记录值 | TTL |
|---------|---------|--------|-----|
| A | @ | 185.199.108.153 | 自动 |
| A | @ | 185.199.109.153 | 自动 |
| A | @ | 185.199.110.153 | 自动 |
| A | @ | 185.199.111.153 | 自动 |
| CNAME（可选）| www | 你的用户名.github.io | 自动 |

**步骤3：验证配置**

1. 使用`nslookup vx.forzenfox.com`验证DNS解析
2. 在GitHub Pages设置页面查看域名验证状态
3. 等待HTTPS证书签发（通常几分钟内完成）

### 8.4 项目配置修改

项目已预置自定义域名支持，配置文件位置：

| 配置文件 | 修改内容 |
|---------|---------|
| frontend/vite.config.ts | 支持VITE_CUSTOM_DOMAIN环境变量 |
| frontend/.env.production | 可配置VITE_CUSTOM_DOMAIN |
| .github/workflows/deploy.yml | 自动生成CNAME文件 |

如需修改默认自定义域名，编辑以下位置：

1. **deploy.yml**（默认域名）：
   ```yaml
   VITE_CUSTOM_DOMAIN: vx.forzenfox.com
   ```

2. **本地环境变量**：
   在frontend/.env.production中取消注释：
   ```properties
   VITE_CUSTOM_DOMAIN=vx.forzenfox.com
   ```

### 8.5 访问地址配置

| 环境 | 访问地址 |
|-----|---------|
| 自定义域名 | https://vx.forzenfox.com |
| GitHub Pages（备选） | https://你的用户名.github.io/VidTimelineX/ |

---

## 九、最佳实践建议

### 9.1 部署前检查清单

在将代码推送到master分支之前，建议执行以下检查：

- [ ] 本地运行npm run lint确认无代码规范问题
- [ ] 本地运行npm run test:ci确认所有测试通过
- [ ] 本地运行npm run build确认构建成功
- [ ] 检查package.json和package-lock.json版本一致
- [ ] 确认新增的依赖已添加到package.json
- [ ] 确认环境变量配置正确，特别是VITE_CUSTOM_DOMAIN
- [ ] 确认DNS记录已正确配置并生效（如使用自定义域名）
- [ ] 确认GitHub仓库中Custom domain设置正确

### 9.2 分支管理建议

1. **功能开发**：在feature/*分支开发新功能，开发完成后创建Pull Request合并到develop分支
2. **Bug修复**：在fix/*分支修复问题，完成后直接合并到master或develop分支
3. **发布准备**：从develop分支创建release分支进行最终测试，确认无误后合并到master
4. **Hotfix**：紧急修复可直接在master分支进行，但事后应同步到develop分支

### 9.3 监控与回滚

**部署监控**：通过GitHub Actions页面可以查看每次部署的执行状态和日志。部署完成后会生成部署记录，可在仓库的Deployments页面查看历史部署。

**回滚策略**：如果部署出现问题，可以通过以下方式回滚：

1. **快速回退**：在GitHub Actions页面找到之前的成功部署记录，点击"Re-run job"重新执行
2. **代码回滚**：创建新分支，基于之前的稳定提交修复问题，然后合并到master触发新部署

---

## 十、附录

### 10.1 相关文件索引

| 文件路径 | 说明 |
|---------|------|
| .github/workflows/deploy.yml | 主部署工作流配置 |
| .github/workflows/ci-non-master.yml | 非master分支CI配置 |
| frontend/vite.config.ts | Vite构建配置 |
| frontend/package.json | 项目依赖和脚本配置 |
| frontend/.env.development | 开发环境变量 |
| frontend/.env.production | 生产环境变量 |

### 10.2 GitHub Actions版本信息

| Action | 版本 | 用途 |
|--------|------|------|
| actions/checkout | v4 | 代码检出 |
| actions/setup-node | v4 | Node.js环境配置 |
| actions/upload-pages-artifact | v3 | 上传构建产物 |
| actions/deploy-pages | v4 | 部署到GitHub Pages |

### 10.3 自定义域名配置资源

| 资源 | 链接 |
|-----|------|
| GitHub Pages自定义域名文档 | https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site |
| DNS查询工具 | https://dnschecker.org |
| Let's Encrypt证书 | https://letsencrypt.org/ |

### 10.4 参考资源

- GitHub Actions官方文档：https://docs.github.com/en/actions
- GitHub Pages官方文档：https://docs.github.com/en/pages
- Vite官方文档：https://vitejs.dev/
- Jest官方文档：https://jestjs.io/

---

**文档版本**：2.0.0

**最后更新**：2026年2月1日

**维护团队**：VidTimelineX开发组
