# 哔哩哔哩时间线 - 前端项目

> **📁 项目文档导航**
> - **根目录README**：项目全局说明、架构概览、部署指南 → [查看](../README.md)
> - **本文档**：前端详细技术文档、安装指南、测试说明

## 项目概述

哔哩哔哩时间线是一个基于现代前端技术栈构建的视频内容展示平台，主要用于展示和分享两位主播（驴酱和甜筒）的精彩视频集。该项目采用 React 19 与 Vite 构建，结合了 Tailwind CSS 4 和 Radix UI 组件库，提供流畅的用户体验和响应式设计。项目的核心功能包括视频时间线展示、弹幕互动效果、主题切换、搜索过滤以及视频弹窗播放等，为用户打造沉浸式的视频浏览体验。

本项目采用模块化架构设计，将驴酱视频集和甜筒视频集分别作为独立的页面模块进行管理，每个模块都包含完整的组件体系和数据结构。这种设计使得项目具有良好的可扩展性和维护性，便于后续功能迭代和主题扩展。项目还集成了完善的代码质量保障体系，包括 ESLint 静态检查、Prettier 代码格式化以及 Jest 单元测试，确保代码的一致性和可靠性。

### 设备兼容性

> **重要提示**：当前项目**仅支持 PC 和平板设备**，不支持手机设备。在手机设备上访问可能会导致布局错乱、功能异常等问题，建议使用 PC 或平板设备获得最佳体验。

## 主要功能

### 视频时间线展示

项目提供两种不同的视频时间线展示风格，分别服务于驴酱和甜筒两个视频集。驴酱视频集采用时间轴式的布局，将视频按照发布日期倒序排列，用户可以直观地浏览和选择感兴趣的视频内容。每个时间节点都配有缩略图、标题和关键信息标签，点击即可打开视频弹窗进行观看。甜筒视频集则采用分类筛选加时间分组的复合布局，支持按类别（全部高光、甜筒天籁、霸总热舞、反差萌场面、224日常）进行快速筛选，同时按日期将视频分组展示，便于用户按时间线回顾内容。

### 主题切换系统

项目实现了完善的主题切换功能，支持多种视觉风格的动态切换。甜筒视频集提供老虎主题（tiger）和甜筒主题（sweet）两种风格，老虎主题采用橙色调的硬核设计风格，甜筒主题则使用粉色系的软萌风格，用户可以通过顶部的主题切换按钮一键切换。驴酱视频集同样支持洞主主题（dongzhu）和凯哥主题（kaige）两种风格，分别对应家猪和野猪两种视觉主题，通过暖色调和深色调的差异营造不同的氛围感。主题切换采用 CSS 变量实现，性能优良且过渡流畅。

### 弹幕互动效果

项目内置两种弹幕组件，为页面增添互动氛围。水平弹幕（HorizontalDanmaku）在页面顶部滚动显示，随主题切换展示不同的弹幕内容；侧边弹幕（SideDanmaku and SidebarDanmu）则位于页面右侧，实时显示用户互动信息和统计数字。弹幕系统使用 useMemo 和 useEffect 进行状态管理，确保性能优化的同时保持视觉效果的新鲜感。所有弹幕数据均从配置文件动态加载，支持主题联动和定时更新。

### 视频弹窗播放

每个视频卡片都支持点击打开弹窗进行详情查看和播放模拟。视频弹窗采用 Radix UI Dialog 组件实现，提供流畅的打开动画和键盘事件支持（按 ESC 键关闭）。弹窗内部包含视频标题、嵌入式播放器占位、跳转原站链接以及弹幕提示信息。弹窗还支持无障碍访问，包含适当的 ARIA 标签和键盘导航支持，确保所有用户都能正常使用该功能。

### 搜索与筛选

甜筒视频集提供了完整的搜索和筛选功能。搜索框支持实时输入和自动补全，会根据用户输入从视频标题中提取匹配建议。系统还会记录用户的搜索历史，支持快速重复搜索和历史清除功能。分类筛选器使用 Lucide React 图标增强视觉识别，用户可以快速切换不同的内容类别。筛选结果会实时更新，并通过数量统计反馈筛选状态。

## 技术栈

### 核心框架

项目基于 React 19.2.0 构建，充分利用了最新版本的特性，包括 Suspense 异步加载、useMemo 和 useCallback 性能优化等。路由管理采用 React Router DOM 7.10.0，实现客户端路由和页面导航。状态管理方面，项目使用 @tanstack/react-query 5.83.0 进行服务器状态管理，配合 React 内置的 useState 和 useReducer 处理本地状态。对于需要跨组件共享的轻量级状态，项目采用 React Context 模式实现。

### 构建工具

Vite 7.2.4 作为项目的构建工具，提供极速的开发体验和优化的生产构建。开发环境下，Vite 利用原生 ES 模块实现即时启动和热模块替换（HMR）；生产构建时，则采用 Rollup 进行代码分割和优化，生成高性能的静态资源。Vite Image Optimizer 插件用于自动优化图片资源，在保证质量的前提下减小文件体积。项目还配置了路径别名（@ 指向 src 目录），简化模块导入路径。

### 样式方案

Tailwind CSS 4.1.17 作为主要的样式框架，提供原子化的 utility 类实现快速样式开发。配合 @tailwindcss/postcss 和 @tailwindcss/vite 插件，实现与 Vite 的深度集成。Tailwind Merge 和 clsx 库用于动态类名拼接，确保样式组合的灵活性。tw-animate-css 库为项目添加了丰富的动画效果，包括淡入淡出、滑动、脉冲等过渡动画。样式文件中还包含自定义的 CSS 变量，用于主题切换和响应式设计。

### 组件库

项目采用 Radix UI 作为无样式组件库的基础，提供了 Dialog、Dropdown Menu、Tooltip、Switch、Select、Tabs 等 30 余个交互组件。这些组件默认不带样式，开发者可以根据项目需求自由定制外观，同时获得完善的无障碍支持。cmdk 库用于实现命令面板功能，embla-carousel-react 用于走马灯组件，sonner 用于 toast 通知提示。

### 类型安全

TypeScript 5.9 为项目提供完整的类型支持，包括类型检查、自动补全和重构工具。所有组件、数据结构和 Hook 都有明确的类型定义，确保代码的可靠性和可维护性。tsconfig.app.json 和 tsconfig.node.json 分别配置应用代码和配置文件的编译选项，合理的配置优化了类型检查的性能。

### 测试框架

Jest 30.2 作为单元测试框架，配合 @testing-library/react 16.3.2 和 @testing-library/jest-dom 6.9.1 提供组件测试支持。ts-jest 用于处理 TypeScript 测试文件的转译，jest-environment-jsdom 模拟浏览器环境。测试配置包括代码覆盖率阈值、报告格式等，确保测试的规范性和可追溯性。

### 代码质量

ESLint 9.39.1 结合 typescript-eslint 8.46.4 进行静态代码分析，Prettier 3.8.1 确保代码格式的一致性。eslint-plugin-react-hooks 检查 React Hook 的使用规则，eslint-plugin-react-refresh 验证组件热更新的正确性。lint-staged 和 husky 实现了 Git 提交前的自动检查，确保问题代码不会进入版本库。

## 项目结构

```
frontend/
├── src/
│   ├── app/                  # 应用核心配置
│   │   ├── App.tsx           # 首页组件
│   │   ├── main.tsx          # React DOM 渲染入口
│   │   └── routes.tsx        # 路由配置
│   ├── components/           # 公共组件
│   │   ├── ui/               # UI 基础组件（基于 Radix UI）
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── tooltip.tsx
│   │   │   └── ...          # 共30+ UI 组件
│   │   ├── figma/            # Figma相关组件
│   │   │   └── ImageWithFallback.tsx
│   │   ├── MobileNotSupported.tsx  # 移动端提示组件
│   │   └── PerformanceMonitor.tsx  # 性能监控组件
│   ├── features/             # 功能模块（按业务划分）
│   │   ├── lvjiang/          # 驴酱模块
│   │   │   ├── LvjiangPage.tsx   # 驴酱页面组件
│   │   │   ├── components/   # 驴酱业务组件
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── HorizontalDanmaku.tsx
│   │   │   │   ├── LoadingAnimation.tsx
│   │   │   │   ├── SideDanmaku.tsx
│   │   │   │   ├── VideoModal.tsx
│   │   │   │   └── VideoTimeline.tsx
│   │   │   ├── data/         # 驴酱数据
│   │   │   └── styles/       # 驴酱样式
│   │   └── tiantong/         # 甜筒模块
│   │       ├── TiantongPage.tsx  # 甜筒页面组件
│   │       ├── components/   # 甜筒业务组件
│   │       │   ├── HorizontalDanmaku.tsx
│   │       │   ├── LoadingAnimation.tsx
│   │       │   ├── SidebarDanmu.tsx
│   │       │   ├── ThemeToggle.tsx
│   │       │   ├── TimelineItem.tsx
│   │       │   ├── VideoCard.tsx
│   │       │   └── VideoModal.tsx
│   │       ├── data/         # 甜筒数据
│   │       └── styles/       # 甜筒样式
│   ├── hooks/                # 公共自定义钩子
│   │   ├── use-mobile.ts    # 响应式设备检测
│   │   └── use-dynamic-component.tsx  # 动态组件加载
│   ├── styles/              # 全局样式
│   │   ├── animations.css   # 动画样式
│   │   ├── components.css   # 组件样式
│   │   ├── globals.css      # 全局 CSS 变量和基础样式
│   │   ├── utilities.css    # 工具类样式
│   │   └── variables.css    # CSS 变量定义
│   └── setupTests.ts        # 测试环境配置
├── tests/                    # 测试文件
│   ├── unit/                 # 单元测试（22个测试套件）
│   ├── integration/          # 集成测试
│   ├── e2e/                  # 端到端测试（Playwright）
│   ├── fixtures/             # 测试数据
│   └── utils/                # 测试工具函数
├── public/                  # 静态资源
│   └── thumbs/              # 视频缩略图
├── .env.development         # 开发环境变量
├── .env.production          # 生产环境变量
├── package.json             # 项目依赖配置
├── vite.config.ts           # Vite 构建配置
├── tailwind.config.js       # Tailwind CSS 配置
├── tsconfig.json            # TypeScript 基础配置
├── tsconfig.app.json        # 应用代码 TypeScript 配置
├── jest.config.js           # Jest 测试配置
├── eslint.config.js         # ESLint 配置
├── playwright.config.ts     # Playwright 配置
├── .prettierrc.json         # Prettier 格式配置
└── README.md                # 项目说明文档
```

### 目录说明

**src/app/** 目录包含应用的核心配置，包括应用入口、路由配置和首页组件。这个目录集中管理应用的核心逻辑，便于维护和扩展。

**src/components/** 目录包含公共组件：
- **ui/**：基于 Radix UI 构建的基础 UI 组件（30+组件），遵循统一接口设计，包含完整的类型定义和无障碍支持
- **figma/**：Figma 设计系统相关组件
- **MobileNotSupported.tsx**：移动端访问提示组件
- **PerformanceMonitor.tsx**：性能监控组件

**src/features/** 目录按业务功能组织模块，每个子目录对应一个独立的功能模块。这种模块化设计使得代码更加清晰，便于维护和扩展。每个功能模块包含：

- 页面组件（如 LvjiangPage.tsx、TiantongPage.tsx）
- 业务组件（与模块业务逻辑紧密耦合的组件）
- 数据（模块专用的数据文件）
- 样式（模块专用的样式文件）

**src/hooks/** 目录包含公共的自定义 React Hook，用于提取和复用跨模块的组件逻辑。use-mobile hook 实现了响应式设备检测，use-dynamic-component hook 提供动态组件加载能力。

**src/styles/** 目录包含全局样式文件：
- **animations.css**：动画样式定义
- **components.css**：组件级样式
- **globals.css**：全局 CSS 变量和基础样式
- **utilities.css**：工具类样式
- **variables.css**：CSS 变量定义

**tests/** 目录组织测试文件，分为单元测试、集成测试和端到端测试（Playwright）：
- **unit/**：单元测试（22个测试套件，135个测试用例）
- **integration/**：集成测试
- **e2e/**：端到端测试（Playwright）
- **fixtures/**：测试数据
- **utils/**：测试工具函数

**public/thumbs/** 目录存储视频缩略图，用于本地缓存和展示。

## 安装与设置

### 环境要求

在开始安装之前，请确保开发环境满足以下要求。操作系统支持 Windows、macOS 和 Linux，Node.js 版本需要 18.0.0 或更高版本，推荐使用 LTS 长期支持版本以获得最佳的稳定性。npm 版本应大于等于 9.0.0，或者使用 yarn、pnpm 等替代包管理器。项目开发基于 Visual Studio Code 编辑器，建议安装推荐的扩展以获得最佳的开发体验，包括 ESLint、Prettier、Tailwind CSS IntelliSense 等。

### 安装依赖

克隆项目仓库后，进入 frontend 目录执行依赖安装命令：

```bash
cd frontend
npm install
```

npm install 命令会根据 package.json 中声明的依赖关系，自动下载并安装所有必要的包。安装过程可能需要几分钟时间，取决于网络连接速度和包的大小。安装完成后，项目根目录下会生成 node_modules 目录，其中包含所有已安装的依赖包。如果遇到安装问题，可以尝试删除 node_modules 目录和 package-lock.json 文件后重新执行安装命令。

对于中国大陆地区的用户，建议配置 npm 镜像源以加速依赖下载：

```bash
npm config set registry https://registry.npmmirror.com
```

### 环境变量配置

项目使用环境变量管理敏感配置和构建参数。开发环境配置文件为 .env.development，包含了开发环境的特定设置。在项目根目录创建或修改该文件，配置必要的环境变量。如果变量涉及敏感信息，请确保不要将其提交到版本控制系统。

### 启动开发服务器

安装完成后，使用以下命令启动开发服务器：

```bash
npm run dev
```

开发服务器默认运行在 http://localhost:3000 端口，启动后会自动打开浏览器窗口。Vite 的热模块替换功能使得代码修改可以实时生效，无需刷新页面即可看到更新效果。开发模式下会启用 Source Map，便于调试和定位问题。

如果需要指定自定义端口，可以在命令中添加参数：

```bash
npm run dev -- --port 8080
```

## 构建与部署

### 生产构建

当项目开发完成需要进行部署时，执行生产构建命令：

```bash
npm run build
```

构建过程会执行以下操作：首先使用 TypeScript 编译器进行类型检查，确保代码没有类型错误；然后通过 ESLint 运行静态代码分析，验证代码质量；接着由 Vite 进行代码优化，包括 Tree Shaking、代码分割、资源压缩等；最后生成静态资源文件到 build 目录。构建产物经过优化后体积更小、加载更快，适合部署到生产环境。

开发构建命令可以生成未压缩的开发版本，便于调试：

```bash
npm run build:dev
```

### 预览构建产物

构建完成后，可以使用预览命令在本地查看生产版本的效果：

```bash
npm run preview
```

预览服务器会模拟生产环境的配置，包括资源压缩和缓存策略，确保本地预览与实际部署效果一致。

### 部署配置

项目构建产物为纯静态文件，可以部署到任何静态文件托管服务。常见的部署选项包括 Vercel、Netlify、Cloudflare Pages、GitHub Pages 以及自建的 Nginx 服务器。部署时需要将 build 目录的内容上传到服务器的 Web 根目录，并确保服务器正确配置 MIME 类型和缓存策略。

对于 SPA（单页应用）部署，由于项目使用 React Router 进行客户端路由，需要配置服务器将所有路由请求重定向到 index.html，由前端接管路由处理。Nginx 配置示例如下：

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

## 测试

### 运行测试

项目使用 Jest 框架进行单元测试，执行以下命令运行所有测试：

```bash
npm test
```

测试命令会查找项目中的测试文件（位于 **tests** 目录或以 .test.tsx/.spec.tsx 结尾的文件），执行测试并输出结果。测试框架会自动处理 TypeScript 文件的转译，无需额外配置。

### 监听模式

开发过程中可以使用监听模式运行测试，测试文件变化时自动重新执行：

```bash
npm run test:watch
```

监听模式会进入交互式界面，支持筛选测试、查看详细输出等操作，便于快速验证代码修改的正确性。

### 代码覆盖率

生成代码覆盖率报告可以帮助评估测试的完整性：

```bash
npm run test:coverage
```

覆盖率报告展示了语句、分支、函数和行四个维度的覆盖情况。项目配置的阈值要求每个维度都达到 50% 以上，未达标的测试运行会导致构建失败。报告生成在 coverage 目录，支持多种格式输出（text、lcov、json-summary）。

### MobileNotSupported 组件测试

MobileNotSupported 组件是移动端访问提示组件，提供了全面的测试用例和自动化测试脚本：

```bash
# 运行 MobileNotSupported 组件测试
npm run test:mobile-not-supported
```

测试脚本会自动执行所有测试用例并生成详细的 HTML 和 JSON 格式报告。测试报告包含：

- 测试执行时间和时长
- 测试摘要（总测试数、通过、失败、跳过、通过率）
- 详细的测试用例列表（状态、ID、名称）

详细的测试文档请参考：[tests/docs/mobile-not-supported-test-doc.md](tests/docs/mobile-not-supported-test-doc.md)

## 代码规范

### 代码检查

项目集成了 ESLint 进行静态代码分析，执行以下命令检查代码问题：

```bash
npm run lint
```

ESLint 会检查代码中的潜在问题，包括未使用的变量、不安全的语法、TypeScript 类型错误等。检查结果分为错误（error）和警告（warning）两个级别，错误必须修复才能通过，警告建议处理但不影响构建。package.json 中配置了 lint-staged，会在 Git 提交前自动执行代码检查，确保问题代码不会进入版本库。

### 代码格式化

Prettier 确保项目代码风格的一致性，执行以下命令格式化代码：

```bash
npx prettier --write "src/**/*.{ts,tsx,js,jsx}"
```

格式化会按照 .prettierrc.json 中定义的规则调整代码，包括引号类型、尾随逗号、缩进宽度、行宽度等。格式化后的代码会自动保存，无需手动调整。建议在提交代码前执行格式化操作，保持代码提交的整洁性。

### 提交前检查

项目使用 husky 配置了 Git 钩子，在执行 git commit 时自动运行代码检查和格式化。提交信息需要符合 Conventional Commits 规范，格式为 `<type>(<scope>): <description>`。常用的 type 包括 feat（新功能）、fix（修复 bug）、docs（文档更新）、refactor（代码重构）、test（测试相关）、chore（构建配置）等。

## 贡献指南

### 提交问题

发现项目问题或有功能建议时，欢迎在 GitHub 仓库提交 Issue。提交时请描述清楚问题的复现步骤、期望行为和实际行为，并提供浏览器版本、操作系统等环境信息。对于功能建议，可以说明使用场景和实现思路，便于维护者理解和评估。

### 提交代码

1. 首先 fork 项目仓库到个人账号，然后 clone 到本地进行开发。
2. 创建新的功能分支，分支名称应清晰反映本次修改的内容，例如 `feature/video-card-redesign` 或 `fix/modal-accessibility`。
3. 在本地分支上进行开发，确保代码符合项目的编码规范。
4. 编写或更新测试用例，验证修改的正确性。
5. 执行完整的测试和代码检查，确保没有引入新问题。
6. 提交代码并推送到远程仓库。
7. 创建 Pull Request，详细描述修改内容和测试结果。

### 代码审查

提交的 Pull Request 会经过代码审查，维护者会检查代码质量、设计合理性和与项目整体的一致性。审查过程中可能需要根据反馈进行修改，请保持耐心和开放的态度。审查通过后，维护者会合并代码到主分支。

## 许可证

本项目采用 MIT 许可证开源，这意味着您可以自由使用、修改和分发本项目的代码，但需要保留原始的版权声明和许可证文本。许可证的具体内容请参阅项目根目录的 LICENSE 文件。

项目中使用到的第三方库和资源各有其许可证，使用时请遵守相应的许可条款。项目文档中列出的 Attributions.md 文件包含了所有第三方资源的来源和许可信息。

## 附录

### 常用命令速查表

| 命令                  | 用途               |
| --------------------- | ------------------ |
| npm install           | 安装项目依赖       |
| npm run dev           | 启动开发服务器     |
| npm run build         | 生产构建           |
| npm run build:dev     | 开发构建           |
| npm run preview       | 预览构建产物       |
| npm run lint          | 执行代码检查       |
| npm run lint -- --fix | 自动修复代码问题   |
| npm test              | 运行测试           |
| npm run test:watch    | 监听模式运行测试   |
| npm run test:coverage | 生成测试覆盖率报告 |

### 快捷键

开发过程中可以使用以下快捷键（VS Code 环境）：

- `Ctrl + Shift + P`：打开命令面板，输入 "ESLint" 可执行 ESLint 相关操作
- `Shift + Alt + F`：使用 Prettier 格式化当前文件
- `Ctrl + Shift + B`：运行构建任务

### 资源链接

- 项目官网：https://github.com/yourusername/bilibili-timeline
- Figma 设计稿：https://www.figma.com/design/DujcdGhRT9OgO4PGCubCpj/Custom-Static-Web-UI
- React 官方文档：https://react.dev
- Vite 官方文档：https://vitejs.dev
- Tailwind CSS 官方文档：https://tailwindcss.com
- Radix UI 官方文档：https://www.radix-ui.com
