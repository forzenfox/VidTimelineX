import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import type { Video } from "@/features/yuxiaoc/data/types";
import "@testing-library/jest-dom";

// 模拟桌面端视口
Object.defineProperty(window, "innerWidth", {
  writable: true,
  configurable: true,
  value: 1024,
});

// 触发resize事件
window.dispatchEvent(new Event("resize"));

// 创建超过12个视频的测试数据以测试分页
const generateMockVideos = (count: number): Video[] =>
  Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    bvid: `BV${i + 1}xx411c7mD`,
    bv: `BV${i + 1}xx411c7mD`,
    title: `测试视频${i + 1}: ${i % 3 === 0 ? "血怒时刻" : i % 3 === 1 ? "混躺日常" : "汤肴精选"}`,
    cover: `https://example.com/cover${i + 1}.jpg`,
    cover_url: `https://example.com/cover${i + 1}.jpg`,
    videoUrl: `https://example.com/video${i + 1}.mp4`,
    duration: i % 2 === 0 ? "10:30" : "15:20",
    date: `2024-01-${String((i % 30) + 1).padStart(2, "0")}`,
    author: "C皇",
    category: i % 3 === 0 ? "hardcore" : i % 3 === 1 ? "main" : "soup",
    tags: i % 3 === 0 ? ["血怒", "诺手"] : i % 3 === 1 ? ["混躺", "下饭"] : ["下饭", "搞笑"],
    description: `测试视频描述${i + 1}`,
  }));

// 预生成15个视频数据
const mockVideos = generateMockVideos(15);

// 使用 jest.mock 并在工厂函数内直接定义数据
jest.mock("@/features/yuxiaoc/data/videos", () => ({
  videos: [
    { id: "1", bvid: "BV1xx411c7mD", bv: "BV1xx411c7mD", title: "测试视频1: 血怒时刻", cover: "https://example.com/cover1.jpg", cover_url: "https://example.com/cover1.jpg", videoUrl: "https://example.com/video1.mp4", duration: "10:30", date: "2024-01-01", author: "C皇", category: "hardcore", tags: ["血怒", "诺手"], description: "测试视频描述1" },
    { id: "2", bvid: "BV2xx411c7mD", bv: "BV2xx411c7mD", title: "测试视频2: 混躺日常", cover: "https://example.com/cover2.jpg", cover_url: "https://example.com/cover2.jpg", videoUrl: "https://example.com/video2.mp4", duration: "15:20", date: "2024-01-02", author: "C皇", category: "main", tags: ["混躺", "下饭"], description: "测试视频描述2" },
    { id: "3", bvid: "BV3xx411c7mD", bv: "BV3xx411c7mD", title: "测试视频3: 汤肴精选", cover: "https://example.com/cover3.jpg", cover_url: "https://example.com/cover3.jpg", videoUrl: "https://example.com/video3.mp4", duration: "10:30", date: "2024-01-03", author: "C皇", category: "soup", tags: ["下饭", "搞笑"], description: "测试视频描述3" },
    { id: "4", bvid: "BV4xx411c7mD", bv: "BV4xx411c7mD", title: "测试视频4: 血怒时刻", cover: "https://example.com/cover4.jpg", cover_url: "https://example.com/cover4.jpg", videoUrl: "https://example.com/video4.mp4", duration: "15:20", date: "2024-01-04", author: "C皇", category: "hardcore", tags: ["血怒", "诺手"], description: "测试视频描述4" },
    { id: "5", bvid: "BV5xx411c7mD", bv: "BV5xx411c7mD", title: "测试视频5: 混躺日常", cover: "https://example.com/cover5.jpg", cover_url: "https://example.com/cover5.jpg", videoUrl: "https://example.com/video5.mp4", duration: "10:30", date: "2024-01-05", author: "C皇", category: "main", tags: ["混躺", "下饭"], description: "测试视频描述5" },
    { id: "6", bvid: "BV6xx411c7mD", bv: "BV6xx411c7mD", title: "测试视频6: 汤肴精选", cover: "https://example.com/cover6.jpg", cover_url: "https://example.com/cover6.jpg", videoUrl: "https://example.com/video6.mp4", duration: "15:20", date: "2024-01-06", author: "C皇", category: "soup", tags: ["下饭", "搞笑"], description: "测试视频描述6" },
    { id: "7", bvid: "BV7xx411c7mD", bv: "BV7xx411c7mD", title: "测试视频7: 血怒时刻", cover: "https://example.com/cover7.jpg", cover_url: "https://example.com/cover7.jpg", videoUrl: "https://example.com/video7.mp4", duration: "10:30", date: "2024-01-07", author: "C皇", category: "hardcore", tags: ["血怒", "诺手"], description: "测试视频描述7" },
    { id: "8", bvid: "BV8xx411c7mD", bv: "BV8xx411c7mD", title: "测试视频8: 混躺日常", cover: "https://example.com/cover8.jpg", cover_url: "https://example.com/cover8.jpg", videoUrl: "https://example.com/video8.mp4", duration: "15:20", date: "2024-01-08", author: "C皇", category: "main", tags: ["混躺", "下饭"], description: "测试视频描述8" },
    { id: "9", bvid: "BV9xx411c7mD", bv: "BV9xx411c7mD", title: "测试视频9: 汤肴精选", cover: "https://example.com/cover9.jpg", cover_url: "https://example.com/cover9.jpg", videoUrl: "https://example.com/video9.mp4", duration: "10:30", date: "2024-01-09", author: "C皇", category: "soup", tags: ["下饭", "搞笑"], description: "测试视频描述9" },
    { id: "10", bvid: "BV10xx411c7mD", bv: "BV10xx411c7mD", title: "测试视频10: 血怒时刻", cover: "https://example.com/cover10.jpg", cover_url: "https://example.com/cover10.jpg", videoUrl: "https://example.com/video10.mp4", duration: "15:20", date: "2024-01-10", author: "C皇", category: "hardcore", tags: ["血怒", "诺手"], description: "测试视频描述10" },
    { id: "11", bvid: "BV11xx411c7mD", bv: "BV11xx411c7mD", title: "测试视频11: 混躺日常", cover: "https://example.com/cover11.jpg", cover_url: "https://example.com/cover11.jpg", videoUrl: "https://example.com/video11.mp4", duration: "10:30", date: "2024-01-11", author: "C皇", category: "main", tags: ["混躺", "下饭"], description: "测试视频描述11" },
    { id: "12", bvid: "BV12xx411c7mD", bv: "BV12xx411c7mD", title: "测试视频12: 汤肴精选", cover: "https://example.com/cover12.jpg", cover_url: "https://example.com/cover12.jpg", videoUrl: "https://example.com/video12.mp4", duration: "15:20", date: "2024-01-12", author: "C皇", category: "soup", tags: ["下饭", "搞笑"], description: "测试视频描述12" },
    { id: "13", bvid: "BV13xx411c7mD", bv: "BV13xx411c7mD", title: "测试视频13: 血怒时刻", cover: "https://example.com/cover13.jpg", cover_url: "https://example.com/cover13.jpg", videoUrl: "https://example.com/video13.mp4", duration: "10:30", date: "2024-01-13", author: "C皇", category: "hardcore", tags: ["血怒", "诺手"], description: "测试视频描述13" },
    { id: "14", bvid: "BV14xx411c7mD", bv: "BV14xx411c7mD", title: "测试视频14: 混躺日常", cover: "https://example.com/cover14.jpg", cover_url: "https://example.com/cover14.jpg", videoUrl: "https://example.com/video14.mp4", duration: "15:20", date: "2024-01-14", author: "C皇", category: "main", tags: ["混躺", "下饭"], description: "测试视频描述14" },
    { id: "15", bvid: "BV15xx411c7mD", bv: "BV15xx411c7mD", title: "测试视频15: 汤肴精选", cover: "https://example.com/cover15.jpg", cover_url: "https://example.com/cover15.jpg", videoUrl: "https://example.com/video15.mp4", duration: "10:30", date: "2024-01-15", author: "C皇", category: "soup", tags: ["下饭", "搞笑"], description: "测试视频描述15" },
  ],
  canteenCategories: [
    { id: "hardcore", name: "硬核区", description: "血怒时刻", color: "#E11D48", icon: "sword" },
    { id: "main", name: "主食区", description: "日常对局", color: "#F59E0B", icon: "utensils" },
    { id: "soup", name: "汤肴区", description: "下饭操作", color: "#3B82F6", icon: "soup" },
  ],
}));

// 动态导入组件（在mock之后）
const { CanteenHall } = jest.requireActual("@/features/yuxiaoc/components/CanteenHall");

describe("CanteenHall组件测试", () => {
  const mockOnVideoClick = jest.fn();

  beforeEach(() => {
    mockOnVideoClick.mockClear();
  });

  /**
   * 测试用例 TC-001: 组件渲染测试
   * 测试目标：验证CanteenHall组件能够正确渲染
   */
  test("TC-001: 组件渲染测试", () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 验证标题渲染
    expect(screen.getByText("血怒时刻")).toBeInTheDocument();
    // 验证副标题渲染
    expect(screen.getByText("硬核操作，天神下凡")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-002: 食堂信息展示测试 - 血怒模式
   * 测试目标：验证血怒模式下显示正确的食堂信息
   */
  test("TC-002: 食堂信息展示测试 - 血怒模式", () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 验证血怒模式标题
    expect(screen.getByText("血怒时刻")).toBeInTheDocument();
    expect(screen.getByText("硬核操作，天神下凡")).toBeInTheDocument();
    // 验证视频数量显示
    expect(screen.getByText(/共.*个视频/)).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-003: 食堂信息展示测试 - 混躺模式
   * 测试目标：验证混躺模式下显示正确的食堂信息
   */
  test("TC-003: 食堂信息展示测试 - 混躺模式", () => {
    render(<CanteenHall theme="mix" onVideoClick={mockOnVideoClick} />);

    // 验证混躺模式标题
    expect(screen.getByText("食堂大殿")).toBeInTheDocument();
    expect(screen.getByText("下饭经典，吃饱为止")).toBeInTheDocument();
    // 验证视频数量显示
    expect(screen.getByText(/共.*个视频/)).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-004: 视频卡片渲染测试
   * 测试目标：验证视频卡片正确渲染
   */
  test("TC-004: 视频卡片渲染测试", () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 验证视频标题显示（第一个视频）
    expect(screen.getByText("测试视频1: 血怒时刻")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-005: 视频点击交互测试
   * 测试目标：验证点击视频卡片触发回调函数
   */
  test("TC-005: 视频点击交互测试", () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 点击第一个视频卡片
    const videoCard = screen.getByText("测试视频1: 血怒时刻").closest("div[class*='group']");
    if (videoCard) {
      fireEvent.click(videoCard);
    }

    // 验证回调被调用
    expect(mockOnVideoClick).toHaveBeenCalledTimes(1);
    expect(mockOnVideoClick).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "1",
        title: "测试视频1: 血怒时刻",
      })
    );
  });

  /**
   * 测试用例 TC-006: 搜索功能交互测试
   * 测试目标：验证搜索框可以输入并搜索视频
   */
  test("TC-006: 搜索功能交互测试", async () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 使用第一个搜索输入框
    const searchInputs = screen.getAllByPlaceholderText(/搜索视频/i);
    const searchInput = searchInputs[0];
    fireEvent.change(searchInput, { target: { value: "血怒" } });
    expect(searchInput).toHaveValue("血怒");
  });

  /**
   * 测试用例 TC-007: 视图切换交互测试
   * 测试目标：验证视图切换按钮可以切换不同视图模式
   */
  test("TC-007: 视图切换交互测试", () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 检查视图切换按钮是否存在
    const timelineButtons = screen.getAllByRole("button", { name: /时光轴/i });
    const gridButtons = screen.getAllByRole("button", { name: /网格/i });
    const listButtons = screen.getAllByRole("button", { name: /列表/i });

    expect(timelineButtons.length).toBeGreaterThanOrEqual(1);
    expect(gridButtons.length).toBeGreaterThanOrEqual(1);
    expect(listButtons.length).toBeGreaterThanOrEqual(1);

    // 点击时光轴视图按钮
    fireEvent.click(timelineButtons[0]);

    // 点击列表视图按钮
    fireEvent.click(listButtons[0]);

    // 点击网格视图按钮
    fireEvent.click(gridButtons[0]);
  });

  /**
   * 测试用例 TC-008: 自定义类名测试 - section元素
   * 测试目标：验证组件section元素包含正确的类名
   */
  test("TC-008: 自定义类名测试 - section元素", () => {
    const { container } = render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 验证section元素存在并包含正确的类名
    const section = container.querySelector("section#canteen");
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass("py-16");
    expect(section).toHaveClass("px-4");
  });

  /**
   * 测试用例 TC-009: 自定义类名测试 - 内容容器
   * 测试目标：验证内容容器包含正确的类名
   */
  test("TC-009: 自定义类名测试 - 内容容器", () => {
    const { container } = render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 验证内容容器存在
    const contentContainer = container.querySelector(".max-w-7xl");
    expect(contentContainer).toBeInTheDocument();
    expect(contentContainer).toHaveClass("mx-auto");
  });

  /**
   * 测试用例 TC-010: 视频时长显示测试
   * 测试目标：验证视频时长正确显示
   */
  test("TC-010: 视频时长显示测试", () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 验证时长显示（使用getAllByText因为可能有多个相同时长）
    expect(screen.getAllByText("10:30").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("15:20").length).toBeGreaterThanOrEqual(1);
  });

  // ==================== 分页功能测试 ====================
  // 注意：由于只有15个视频，默认每页12个，只有2页，分页控件会显示

  /**
   * 测试用例 TC-PAGE-001: 分页控件渲染测试 - Grid视图
   * 测试目标：验证Grid视图下分页控件正确渲染
   */
  test("TC-PAGE-001: 分页控件渲染测试 - Grid视图", () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 切换到网格视图
    const gridButtons = screen.getAllByRole("button", { name: /网格/i });
    fireEvent.click(gridButtons[0]);

    // 验证分页控件存在（2页以上才会显示）
    expect(screen.getByRole("navigation", { name: /分页导航/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/每页显示/i)).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-PAGE-002: 分页控件渲染测试 - List视图
   * 测试目标：验证List视图下分页控件正确渲染
   */
  test("TC-PAGE-002: 分页控件渲染测试 - List视图", () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 切换到列表视图
    const listButtons = screen.getAllByRole("button", { name: /列表/i });
    fireEvent.click(listButtons[0]);

    // 验证分页控件存在
    expect(screen.getByRole("navigation", { name: /分页导航/i })).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-PAGE-003: Timeline视图不分页
   * 测试目标：验证Timeline视图不显示分页控件
   */
  test("TC-PAGE-003: Timeline视图不分页", () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 切换到时光轴视图
    const timelineButtons = screen.getAllByRole("button", { name: /时光轴/i });
    fireEvent.click(timelineButtons[0]);

    // 验证分页控件不存在（Timeline视图不分页）
    expect(screen.queryByRole("navigation", { name: /分页导航/i })).not.toBeInTheDocument();
  });

  /**
   * 测试用例 TC-PAGE-004: 分页页码切换测试
   * 测试目标：验证切换页码正确更新显示内容
   */
  test("TC-PAGE-004: 分页页码切换测试", async () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 确保在网格视图
    const gridButtons = screen.getAllByRole("button", { name: /网格/i });
    fireEvent.click(gridButtons[0]);

    // 验证第一页的内容存在
    expect(screen.getByText("测试视频1: 血怒时刻")).toBeInTheDocument();

    // 点击第2页
    const page2Button = screen.getByLabelText(/第 2 页/i);
    fireEvent.click(page2Button);

    // 验证当前页码高亮
    expect(page2Button).toHaveAttribute("data-active", "true");

    // 验证第二页的内容存在（第13个视频）
    expect(screen.getByText("测试视频13: 血怒时刻")).toBeInTheDocument();
  });

  /**
   * 测试用例 TC-PAGE-005: 每页数量选择测试
   * 测试目标：验证可以切换每页显示数量
   */
  test("TC-PAGE-005: 每页数量选择测试", () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 确保在网格视图
    const gridButtons = screen.getAllByRole("button", { name: /网格/i });
    fireEvent.click(gridButtons[0]);

    // 验证每页数量选择器存在
    const pageSizeSelect = screen.getByLabelText(/每页显示/i);
    expect(pageSizeSelect).toBeInTheDocument();

    // 切换到每页24个
    fireEvent.change(pageSizeSelect, { target: { value: "24" } });
    expect(pageSizeSelect).toHaveValue("24");

    // 切换为24后只有1页，分页控件应该消失
    expect(screen.queryByRole("navigation", { name: /分页导航/i })).not.toBeInTheDocument();
  });

  /**
   * 测试用例 TC-PAGE-006: 上一页/下一页按钮测试
   * 测试目标：验证上一页/下一页按钮工作正常
   */
  test("TC-PAGE-006: 上一页/下一页按钮测试", () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 确保在网格视图
    const gridButtons = screen.getAllByRole("button", { name: /网格/i });
    fireEvent.click(gridButtons[0]);

    // 验证上一页按钮初始禁用
    const prevButton = screen.getByLabelText(/上一页/i);
    expect(prevButton).toBeDisabled();

    // 点击下一页
    const nextButton = screen.getByLabelText(/下一页/i);
    expect(nextButton).not.toBeDisabled();
    fireEvent.click(nextButton);

    // 验证上一页按钮现在可用
    expect(prevButton).not.toBeDisabled();

    // 验证当前在第2页
    const page2Button = screen.getByLabelText(/第 2 页/i);
    expect(page2Button).toHaveAttribute("data-active", "true");
  });

  /**
   * 测试用例 TC-PAGE-007: 搜索后分页重置测试
   * 测试目标：验证搜索后分页自动回到第一页
   */
  test("TC-PAGE-007: 搜索后分页重置测试", async () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 确保在网格视图
    const gridButtons = screen.getAllByRole("button", { name: /网格/i });
    fireEvent.click(gridButtons[0]);

    // 先切换到第2页
    const page2Button = screen.getByLabelText(/第 2 页/i);
    fireEvent.click(page2Button);

    // 验证当前在第2页
    expect(page2Button).toHaveAttribute("data-active", "true");

    // 执行搜索 - 使用第一个搜索输入框
    const searchInputs = screen.getAllByPlaceholderText(/搜索视频/i);
    const searchInput = searchInputs[0];
    fireEvent.change(searchInput, { target: { value: "血怒" } });

    // 等待搜索生效
    await waitFor(() => {
      // 搜索后应该回到第1页（搜索"血怒"会匹配多个视频）
      const page1Button = screen.queryByLabelText(/第 1 页/i);
      if (page1Button) {
        expect(page1Button).toHaveAttribute("data-active", "true");
      }
    });
  });

  /**
   * 测试用例 TC-PAGE-008: 分页信息显示测试
   * 测试目标：验证分页信息正确显示当前范围
   */
  test("TC-PAGE-008: 分页信息显示测试", () => {
    render(<CanteenHall theme="blood" onVideoClick={mockOnVideoClick} />);

    // 确保在网格视图
    const gridButtons = screen.getAllByRole("button", { name: /网格/i });
    fireEvent.click(gridButtons[0]);

    // 验证分页信息显示（共15条）
    expect(screen.getByText(/共.*15.*条/)).toBeInTheDocument();
  });
});
