# 命名规范文档

## 1. 概述

本文档定义了 VidTimelineX 前端项目的命名规范，确保代码的一致性和可读性。所有新创建的文件、函数、变量、组件等都应遵循本规范。

---

## 2. 核心原则

### 2.1 清晰明了
- 名称应该清晰表达意图
- 避免使用缩写（除非是通用缩写）
- 使用完整的英文单词

### 2.2 一致性
- 相同概念使用相同的命名
- 遵循已有的命名习惯
- 不要混用不同的命名风格

### 2.3 可读性
- 名称应该易于朗读和记忆
- 使用有意义的名称，而不是数字后缀
- 避免过长的名称（建议不超过 50 个字符）

---

## 3. 文件命名规范

### 3.1 React 组件文件

**规则**：大驼峰命名（PascalCase），`.tsx` 扩展名

**✅ 正确示例**：
```
Button.tsx
VideoCard.tsx
HorizontalDanmaku.tsx
LoadingAnimation.tsx
```

**❌ 错误示例**：
```
button.tsx              // ❌ 小写
video-card.tsx          // ❌ 连字符
video_card.tsx          // ❌ 下划线
Button.jsx              // ❌ 应该使用.tsx
```

### 3.2 Hook 文件

**规则**：小写，`use` 前缀，连字符分隔，`.ts` 或 `.tsx` 扩展名

**✅ 正确示例**：
```
use-mobile.ts
usePagination.tsx
useVideoFilter.tsx
useDanmaku.ts
```

**❌ 错误示例**：
```
useMobile.ts            // ❌ 大驼峰
mobile-hook.ts          // ❌ 缺少 use 前缀
use_mobile.ts           // ❌ 下划线
use-mobile.js           // ❌ 应该使用.ts
```

### 3.3 工具函数文件

**规则**：小写，连字符分隔，`.ts` 扩展名

**✅ 正确示例**：
```
cdn.ts
preload.ts
data-loader.ts
error-handler.ts
string-utils.ts
```

**❌ 错误示例**：
```
Cdn.ts                  // ❌ 大驼峰
dataLoader.ts           // ❌ 大驼峰
data_loader.ts          // ❌ 下划线
utils.ts                // ❌ 名称太泛
```

### 3.4 类型定义文件

**规则**：小写，连字符分隔，`.ts` 扩展名

**✅ 正确示例**：
```
types.ts
video-types.ts
danmaku-types.ts
user-types.ts
```

**❌ 错误示例**：
```
Types.ts                // ❌ 大驼峰
videoTypes.ts           // ❌ 大驼峰
type-definitions.ts     // ❌ 太长
```

### 3.5 样式文件

**规则**：小写，连字符分隔，`.css` 扩展名

**✅ 正确示例**：
```
globals.css
variables.css
animations.css
button-styles.css
layout.css
```

**❌ 错误示例**：
```
Globals.css             // ❌ 大驼峰
buttonStyles.css        // ❌ 大驼峰
style.css               // ❌ 名称太泛
```

### 3.6 测试文件

**规则**：与被测文件同名 + 测试类型后缀，`.test.tsx` 或 `.e2e.tsx`

**单元测试**：`.test.tsx` 或 `.test.ts`
**E2E 测试**：`.e2e.tsx` 或 `.e2e.ts`

**✅ 正确示例**：
```
Button.test.tsx
HorizontalDanmaku.test.tsx
theme-switching.e2e.tsx
video-playback.e2e.tsx
compatibility.e2e.ts
```

**❌ 错误示例**：
```
Button.test.js          // ❌ 应该使用.ts
button-test.tsx         // ❌ 应该使用.test
ButtonTest.tsx          // ❌ 缺少.test 后缀
test-button.tsx         // ❌ 命名不规范
```

### 3.7 配置文件

**规则**：小写，点号分隔

**✅ 正确示例**：
```
vite.config.ts
jest.config.cjs
eslint.config.js
tsconfig.json
playwright.config.ts
tailwind.config.js
```

**❌ 错误示例**：
```
Vite.config.ts          // ❌ 大驼峰
vite-config.ts          // ❌ 应该使用点号
config.vite.ts          // ❌ 顺序错误
```

### 3.8 数据文件

**规则**：小写，连字符分隔，`.json` 或 `.ts` 扩展名

**✅ 正确示例**：
```
users.json
videos.json
danmaku.txt
danmaku-colors.ts
video-data.ts
```

**❌ 错误示例**：
```
Users.json              // ❌ 大驼峰
videosData.json         // ❌ 大驼峰
data.json               // ❌ 名称太泛
```

---

## 4. 代码命名规范

### 4.1 变量命名

**规则**：小驼峰命名（camelCase）

**✅ 正确示例**：
```typescript
const userName = "张三";
const videoList: Video[] = [];
const isPlaying = true;
const maxCount = 100;
```

**❌ 错误示例**：
```typescript
const UserName = "张三";     // ❌ 大驼峰
const video_list = [];       // ❌ 下划线
const vList = [];            // ❌ 缩写
const data = {};             // ❌ 名称太泛
```

### 4.2 常量命名

**规则**：全大写，下划线分隔

**✅ 正确示例**：
```typescript
const MAX_VIDEO_COUNT = 100;
const API_BASE_URL = "https://api.example.com";
const DEFAULT_THEME = "tiger";
```

**❌ 错误示例**：
```typescript
const maxVideoCount = 100;   // ❌ 小驼峰
const MaxVideoCount = 100;   // ❌ 大驼峰
const MAX_VIDEO_COUNT=100;   // ❌ 缺少空格
```

### 4.3 函数命名

**规则**：小驼峰命名，使用动词开头

**✅ 正确示例**：
```typescript
function getUserInfo() {}
function handleVideoClick() {}
function fetchVideoList() {}
function validateForm() {}
function calculateTotalPrice() {}
```

**❌ 错误示例**：
```typescript
function UserInfo() {}       // ❌ 缺少动词
function videoClick() {}     // ❌ 缺少 handle 前缀
function VideoClick() {}     // ❌ 大驼峰
function fetch() {}          // ❌ 名称太泛
```

### 4.4 组件命名

**规则**：大驼峰命名，使用名词或名词短语

**✅ 正确示例**：
```typescript
const Button = () => {};
const VideoCard = () => {};
const LoadingAnimation = () => {};
const HorizontalDanmaku = () => {};
```

**❌ 错误示例**：
```typescript
const button = () => {};     // ❌ 小写
const video_card = () => {}; // ❌ 下划线
const Btn = () => {};        // ❌ 缩写
```

### 4.5 Hook 命名

**规则**：小驼峰命名，必须以 `use` 开头

**✅ 正确示例**：
```typescript
function useMobile() {}
function usePagination() {}
function useVideoFilter() {}
function useDanmaku() {}
```

**❌ 错误示例**：
```typescript
function Mobile() {}         // ❌ 缺少 use 前缀
function UseMobile() {}      // ❌ 大写 Use
function use_mobile() {}     // ❌ 下划线
```

### 4.6 类型命名

**规则**：大驼峰命名

**✅ 正确示例**：
```typescript
interface Video {
  id: string;
  title: string;
}

type DanmakuType = "sidebar" | "horizontal";

interface UserProps {
  name: string;
  age: number;
}
```

**❌ 错误示例**：
```typescript
interface video { }          // ❌ 小写
type danmaku_type = ...;     // ❌ 小写 + 下划线
interface User_Props { }     // ❌ 下划线
```

---

## 5. 测试命名规范

### 5.1 测试套件命名

**规则**：描述性名称，包含 "测试" 或 "Test"

**✅ 正确示例**：
```typescript
describe("Button 组件测试", () => {});
describe("ThemeToggle 主题切换测试", () => {});
describe("useMobile Hook 测试", () => {});
```

**❌ 错误示例**：
```typescript
describe("Button", () => {});           // ❌ 不够描述性
describe("测试", () => {});             // ❌ 太泛
describe("button test", () => {});      // ❌ 语言不一致
```

### 5.2 测试用例命名

**规则**：描述性名称，包含测试用例 ID（TC-XXX）和测试名称

**✅ 正确示例**：
```typescript
test("TC-001: Button 渲染测试", () => {});
test("TC-002: Button 点击事件测试", () => {});
test("TC-003: 主题切换后弹幕颜色应该匹配新主题", () => {});
```

**❌ 错误示例**：
```typescript
test("Button", () => {});               // ❌ 不够描述性
test("点击测试", () => {});             // ❌ 缺少 TC ID
test("TC-001", () => {});               // ❌ 缺少测试名称
test("should render button", () => {}); // ❌ 语言不一致
```

### 5.3 E2E 测试命名

**规则**：描述用户场景，使用完整的句子

**✅ 正确示例**：
```typescript
test("应该主题切换后弹幕重新触发", () => {});
test("应该多次切换主题时弹幕每次都重新渲染", () => {});
test("应该主题切换后弹幕颜色匹配新主题", () => {});
```

**❌ 错误示例**：
```typescript
test("主题切换", () => {});             // ❌ 不够描述性
test("弹幕测试", () => {});             // ❌ 太泛
test("theme switching", () => {});      // ❌ 语言不一致
```

---

## 6. CSS 命名规范

### 6.1 类名命名

**规则**：小写，连字符分隔（BEM 风格）

**✅ 正确示例**：
```css
.btn {}
.btn-primary {}
.btn--large {}
.video-card {}
.video-card__title {}
.video-card__thumbnail {}
```

**❌ 错误示例**：
```css
.Btn {}                  // ❌ 大写
.btnPrimary {}           // ❌ 大驼峰
.btn_primary {}          // ❌ 下划线
.videoCard {}            // ❌ 大驼峰
```

### 6.2 CSS 变量命名

**规则**：小写，连字符分隔，带命名空间前缀

**✅ 正确示例**：
```css
:root {
  --color-primary: #ff6b00;
  --color-secondary: #6b7280;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --font-size-base: 16px;
}
```

**❌ 错误示例**：
```css
:root {
  --colorPrimary: #ff6b00;    // ❌ 大驼峰
  --PRIMARY: #ff6b00;         // ❌ 全大写
  --spacingSmall: 0.5rem;     // ❌ 大驼峰
}
```

---

## 7. 目录命名规范

### 7.1 目录命名规则

**规则**：小写，连字符分隔（如需要）

**✅ 正确示例**：
```
src/
├── components/
├── features/
│   ├── lvjiang/
│   ├── tiantong/
│   └── yuxiaoc/
├── hooks/
└── shared/
```

**❌ 错误示例**：
```
src/
├── Components/            // ❌ 大写
├── features/
│   ├── Lvjiang/          // ❌ 大驼峰
│   └── TianTong/         // ❌ 大驼峰
└── my_hooks/             // ❌ 下划线
```

---

## 8. 常见缩写规则

### 8.1 允许的缩写

以下缩写在项目中是允许的：

| 缩写 | 全称 | 示例 |
|------|------|------|
| `btn` | button | `btn-primary` (CSS 类名) |
| `img` | image | `img-placeholder` |
| `url` | uniform resource locator | `imageUrl` |
| `id` | identifier | `userId`, `videoId` |
| `props` | properties | `componentProps` |
| `ref` | reference | `buttonRef` |
| `ctx` | context | `appCtx` |
| `env` | environment | `process.env` |
| `dev` | development | `devMode` |
| `prod` | production | `prodBuild` |
| `config` | configuration | `configFile` |
| `info` | information | `userInfo` |
| `data` | data (本身就是缩写) | `videoData` |
| `api` | application programming interface | `apiClient` |
| `cdn` | content delivery network | `cdnUrl` |

### 8.2 不允许的缩写

以下缩写在项目中是**禁止**的：

| 错误缩写 | 正确写法 | 原因 |
|---------|---------|------|
| `msg` | message | 不常用 |
| `param` | parameter | 不常用 |
| `prev` | previous | 可能混淆 |
| `curr` | current | 可能混淆 |
| `temp` | temporary | 太泛 |
| `val` | value | 太泛 |
| `num` | number | 太泛 |
| `str` | string | 太泛 |
| `obj` | object | 太泛 |
| `arr` | array | 太泛 |

---

## 9. 语言使用规范

### 9.1 代码命名语言

**规则**：统一使用英文

**✅ 正确示例**：
```typescript
const userName = "张三";
function getUserInfo() {}
interface VideoCardProps {}
```

**❌ 错误示例**：
```typescript
const yongHuMing = "张三";    // ❌ 拼音
const user_name = "张三";     // ❌ 下划线
const userName = "张三";      // ✅ 变量名英文，值可以是中文
```

### 9.2 注释和文档语言

**规则**：统一使用中文

**✅ 正确示例**：
```typescript
/**
 * 视频卡片组件
 * 用于展示视频信息和播放入口
 */
const VideoCard = () => {};

// 检查用户是否已登录
if (isLoggedIn) {}
```

**❌ 错误示例**：
```typescript
/**
 * Video card component
 * For displaying video information
 */
const VideoCard = () => {};

// Check if user is logged in
if (isLoggedIn) {}
```

---

## 10. 代码审查检查清单

### 10.1 文件命名检查
- [ ] 文件名是否符合命名规范？
- [ ] 组件文件是否使用大驼峰？
- [ ] Hook 文件是否以 `use` 开头？
- [ ] 测试文件是否包含 `.test` 或 `.e2e` 后缀？
- [ ] 是否避免使用缩写（除非允许）？

### 10.2 代码命名检查
- [ ] 变量是否使用小驼峰？
- [ ] 常量是否使用全大写？
- [ ] 函数是否使用动词开头？
- [ ] 组件是否使用大驼峰？
- [ ] 类型是否使用大驼峰？
- [ ] Hook 是否以 `use` 开头？

### 10.3 测试命名检查
- [ ] 测试套件是否有描述性名称？
- [ ] 测试用例是否包含 TC ID？
- [ ] 测试用例是否清晰描述测试场景？
- [ ] E2E 测试是否使用完整句子？

### 10.4 CSS 命名检查
- [ ] 类名是否使用小写 + 连字符？
- [ ] CSS 变量是否带命名空间前缀？
- [ ] 是否遵循 BEM 风格？

---

## 11. 常见问题 FAQ

### Q1: 为什么组件文件要大驼峰命名？
**A**: React 要求组件名称必须大写开头，这样 JSX 才能区分组件和 HTML 元素。文件名与组件名保持一致，便于查找和理解。

### Q2: 为什么 Hook 必须以 `use` 开头？
**A**: React 的 ESLint 插件通过 `use` 前缀识别 Hook，确保 Hook 调用规则的正确性。不以 `use` 开头的函数不会被识别为 Hook。

### Q3: 为什么测试用例要包含 TC ID？
**A**: TC ID（测试用例编号）便于：
- 追踪测试用例
- 与需求文档对应
- 快速定位失败的测试
- 统计测试覆盖率

### Q4: 为什么 CSS 类名要用连字符而不是下划线？
**A**: 
- 连字符是 CSS 社区的标准约定
- 连字符在 URL 中更友好
- 连字符更符合 BEM 命名规范

### Q5: 为什么代码命名用英文，注释用中文？
**A**: 
- 代码命名用英文：符合国际惯例，便于工具支持
- 注释用中文：便于团队理解和维护

---

## 12. 更新记录

| 版本 | 日期 | 更新内容 | 负责人 |
|------|------|----------|--------|
| v1.0 | 2026-03-01 | 初始版本，定义完整命名规范 | - |

---

**文档版本**: v1.0  
**最后更新**: 2026-03-01  
**维护人员**: VidTimelineX 开发团队
