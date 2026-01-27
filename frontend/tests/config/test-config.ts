/**
 * 测试配置文件
 * 统一管理测试相关的配置和常量
 */

// 测试环境类型
const TEST_ENV_TYPE = process.env.TEST_ENV || 'development';

// 测试超时配置
export const TEST_TIMEOUTS = {
  // 基础测试超时时间（毫秒）
  BASE: 10000,
  // 集成测试超时时间（毫秒）
  INTEGRATION: 15000,
  // 端到端测试超时时间（毫秒）
  E2E: 30000,
  // 异步操作超时时间（毫秒）
  ASYNC: 5000,
  // 重试延迟时间（毫秒）
  RETRY_DELAY: 1000,
};

// 测试重试配置
export const TEST_RETRY = {
  // 最大重试次数
  MAX_RETRIES: 3,
  // 重试间隔（毫秒）
  INTERVAL: 1000,
  // 退避因子
  BACKOFF_FACTOR: 1.5,
};

// 测试选择器配置
export const TEST_SELECTORS = {
  // 通用选择器
  COMMON: {
    // 页面容器
    PAGE_CONTAINER: 'data-testid=page-container',
    // 加载动画
    LOADING_ANIMATION: 'data-testid=loading-animation',
    // 错误提示
    ERROR_MESSAGE: 'data-testid=error-message',
    // 成功提示
    SUCCESS_MESSAGE: 'data-testid=success-message',
    // 导航栏
    NAVBAR: 'data-testid=navbar',
    // 页脚
    FOOTER: 'data-testid=footer',
    // 标题
    TITLE: 'data-testid=title',
    // 描述
    DESCRIPTION: 'data-testid=description',
  },
  
  // 甜筒模块选择器
  TIANTONG: {
    // 视频卡片
    VIDEO_CARD: 'data-testid=video-card',
    // 视频模态框
    VIDEO_MODAL: 'data-testid=video-modal',
    // 主题切换按钮
    THEME_TOGGLE: 'data-testid=theme-toggle',
    // 侧边栏弹幕
    SIDEBAR_DANMU: 'data-testid=sidebar-danmu',
    // 视频时间线
    VIDEO_TIMELINE: 'data-testid=video-timeline',
    // 加载动画
    LOADING_ANIMATION: 'data-testid=loading-animation',
    // 弹幕欢迎
    DANMAKU_WELCOME: 'data-testid=danmaku-welcome',
    // 时间线项目
    TIMELINE_ITEM: 'data-testid=timeline-item',
    // 搜索框
    SEARCH_INPUT: 'data-testid=search-input',
    // 搜索按钮
    SEARCH_BUTTON: 'data-testid=search-button',
    // 分类标签
    CATEGORY_TAG: 'data-testid=category-tag',
    // 视频播放按钮
    PLAY_BUTTON: 'data-testid=play-button',
  },
  
  // 绿江模块选择器
  LVJIANG: {
    // 水平弹幕
    HORIZONTAL_DANMAKU: 'data-testid=horizontal-danmaku',
    // 侧边弹幕
    SIDE_DANMAKU: 'data-testid=side-danmaku',
    // 视频模态框
    VIDEO_MODAL: 'data-testid=video-modal',
    // 视频时间线
    VIDEO_TIMELINE: 'data-testid=video-timeline',
    // 头部
    HEADER: 'data-testid=header',
    // 导航菜单
    NAV_MENU: 'data-testid=nav-menu',
    // 内容区域
    CONTENT_AREA: 'data-testid=content-area',
  },
  
  // UI组件选择器
  UI: {
    // 按钮
    BUTTON: 'data-testid=button',
    // 输入框
    INPUT: 'data-testid=input',
    // 卡片
    CARD: 'data-testid=card',
    // 下拉菜单
    DROPDOWN: 'data-testid=dropdown',
    // 复选框
    CHECKBOX: 'data-testid=checkbox',
    // 单选按钮
    RADIO: 'data-testid=radio',
    // 开关
    SWITCH: 'data-testid=switch',
    // 滑块
    SLIDER: 'data-testid=slider',
    // 标签
    TAG: 'data-testid=tag',
    // 徽章
    BADGE: 'data-testid=badge',
    // 进度条
    PROGRESS: 'data-testid=progress',
    // 分隔线
    DIVIDER: 'data-testid=divider',
    // 工具提示
    TOOLTIP: 'data-testid=tooltip',
    // 弹出框
    POPOVER: 'data-testid=popover',
    // 对话框
    DIALOG: 'data-testid=dialog',
    // 抽屉
    DRAWER: 'data-testid=drawer',
    // 表格
    TABLE: 'data-testid=table',
    // 分页
    PAGINATION: 'data-testid=pagination',
    // 表单
    FORM: 'data-testid=form',
    // 表单字段
    FORM_FIELD: 'data-testid=form-field',
  },
};

// 测试模拟数据配置
export const TEST_MOCKS = {
  // 视频数据
  VIDEO: {
    id: '1',
    title: '测试视频',
    category: 'sing',
    tags: ['测试', '视频'],
    cover: 'https://example.com/cover.jpg',
    date: '2024-01-01',
    views: '10万',
    bvid: 'BV1xx411c7mD',
    duration: '10:30',
  },
  
  // 主题配置
  THEME: {
    // 主题类型
    TYPES: ['dongzhu', 'kaige'] as const,
    // 默认主题
    DEFAULT: 'dongzhu',
  },
  
  // 用户数据
  USER: {
    id: '1',
    name: '测试用户',
    email: 'test@example.com',
    avatar: 'https://example.com/avatar.jpg',
  },
  
  // 评论数据
  COMMENT: {
    id: '1',
    content: '测试评论',
    author: '测试用户',
    date: '2024-01-01',
    likes: 10,
  },
};

// 测试环境配置
export const TEST_ENV = {
  // 环境类型
  TYPE: TEST_ENV_TYPE,
  // 是否为开发环境
  IS_DEV: TEST_ENV_TYPE === 'development',
  // 是否为测试环境
  IS_TEST: TEST_ENV_TYPE === 'test',
  // 是否为CI环境
  IS_CI: process.env.CI === 'true',
  // 是否为生产环境
  IS_PROD: TEST_ENV_TYPE === 'production',
  // 是否启用详细日志
  VERBOSE: process.env.VERBOSE === 'true',
  // 是否启用调试模式
  DEBUG: process.env.DEBUG === 'true',
  // 是否启用覆盖率
  COVERAGE: process.env.COVERAGE === 'true',
};

// 测试报告配置
export const TEST_REPORT = {
  // 覆盖率阈值
  COVERAGE_THRESHOLD: {
    branches: 50,
    functions: 50,
    lines: 50,
    statements: 50,
  },
  // 覆盖率报告目录
  COVERAGE_DIR: 'coverage',
  // 测试报告目录
  REPORT_DIR: 'test-results',
  // 报告格式
  REPORT_FORMATS: ['text', 'lcov', 'json-summary', 'html'],
  // 是否生成详细报告
  DETAILED: TEST_ENV.IS_DEV,
};

// 测试并行度配置
export const TEST_PARALLELISM = {
  // 最大并行工作线程数
  MAX_WORKERS: process.env.MAX_WORKERS || '75%',
  // 是否启用并行测试
  ENABLED: true,
  // 测试分组
  GROUPS: {
    unit: 'unit',
    integration: 'integration',
    e2e: 'e2e',
  },
};

// 测试缓存配置
export const TEST_CACHE = {
  // 是否启用缓存
  ENABLED: true,
  // 缓存目录
  DIR: 'node_modules/.jest-cache',
  // 缓存清理间隔（天）
  CLEANUP_INTERVAL: 7,
};

// 测试过滤配置
export const TEST_FILTER = {
  // 包含的测试模式
  INCLUDE: process.env.TEST_INCLUDE ? process.env.TEST_INCLUDE.split(',') : [],
  // 排除的测试模式
  EXCLUDE: process.env.TEST_EXCLUDE ? process.env.TEST_EXCLUDE.split(',') : [],
  // 测试标签
  TAGS: process.env.TEST_TAGS ? process.env.TEST_TAGS.split(',') : [],
};

// 测试数据生成配置
export const TEST_DATA = {
  // 生成数量
  COUNT: {
    SMALL: 5,
    MEDIUM: 10,
    LARGE: 20,
  },
  // 随机种子
  SEED: process.env.TEST_SEED ? parseInt(process.env.TEST_SEED) : Math.floor(Math.random() * 10000),
};

// 测试日志配置
export const TEST_LOGGING = {
  // 日志级别
  LEVEL: process.env.TEST_LOG_LEVEL || 'info',
  // 是否启用控制台日志
  CONSOLE: true,
  // 是否启用文件日志
  FILE: TEST_ENV.IS_CI,
  // 日志文件
  FILE_PATH: 'test-results/test.log',
};

// 测试工具配置
export const TEST_TOOLS = {
  // Playwright配置
  PLAYWRIGHT: {
    // 超时时间（毫秒）
    TIMEOUT: 30000,
    // 是否启用视频录制
    VIDEO: TEST_ENV.IS_CI,
    // 是否启用截图
    SCREENSHOT: TEST_ENV.IS_CI,
    // 浏览器类型
    BROWSER: process.env.PLAYWRIGHT_BROWSER || 'chromium',
    // 是否启用无头模式
    HEADLESS: TEST_ENV.IS_CI,
  },
  
  // Jest配置
  JEST: {
    // 是否启用详细模式
    VERBOSE: TEST_ENV.VERBOSE,
    // 是否启用覆盖率
    COVERAGE: TEST_ENV.COVERAGE,
    // 是否启用缓存
    CACHE: TEST_CACHE.ENABLED,
    // 最大并行工作线程数
    MAX_WORKERS: TEST_PARALLELISM.MAX_WORKERS,
  },
};

// 测试API配置
export const TEST_API = {
  // API基础URL
  BASE_URL: process.env.TEST_API_URL || 'http://localhost:3001',
  // API超时时间（毫秒）
  TIMEOUT: 10000,
  // 是否启用API模拟
  MOCK_ENABLED: true,
  // 模拟延迟（毫秒）
  MOCK_DELAY: 500,
};

// 动态配置生成函数
export function getConfig(env: string = TEST_ENV_TYPE) {
  return {
    TEST_ENV_TYPE: env,
    TEST_TIMEOUTS,
    TEST_RETRY,
    TEST_SELECTORS,
    TEST_MOCKS,
    TEST_ENV: {
      ...TEST_ENV,
      TYPE: env,
      IS_DEV: env === 'development',
      IS_TEST: env === 'test',
      IS_PROD: env === 'production',
    },
    TEST_REPORT,
    TEST_PARALLELISM,
    TEST_CACHE,
    TEST_FILTER,
    TEST_DATA,
    TEST_LOGGING,
    TEST_TOOLS,
    TEST_API,
  };
}

// 导出默认配置
export default {
  TEST_ENV_TYPE,
  TEST_TIMEOUTS,
  TEST_RETRY,
  TEST_SELECTORS,
  TEST_MOCKS,
  TEST_ENV,
  TEST_REPORT,
  TEST_PARALLELISM,
  TEST_CACHE,
  TEST_FILTER,
  TEST_DATA,
  TEST_LOGGING,
  TEST_TOOLS,
  TEST_API,
  getConfig,
};

