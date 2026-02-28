import React, { useMemo, useState, useEffect } from "react";
import type { Theme, Video } from "../data/types";
import { videos } from "../data/videos";
import { Search } from "lucide-react";
import VideoCard from "../../../components/video/VideoCard";
import { VideoViewToolbar } from "../../../components/video-view/VideoViewToolbar";
import { IconToolbar } from "../../../components/video-view/IconToolbar";
import { useVideoView } from "../hooks/useVideoView";

interface CanteenHallProps {
  theme: Theme;
  onVideoClick: (video: Video) => void;
}

/**
 * 时光轴节点组件
 * 64px圆形节点，带主题图标和发光效果
 */
const TimelineNode: React.FC<{
  index: number;
  theme: Theme;
  onClick: () => void;
}> = React.memo(({ index, theme, onClick }) => {
  const isBlood = theme === "blood";

  const nodeStyle = useMemo(
    () => ({
      background: isBlood
        ? "linear-gradient(135deg, #E11D48, #9F1239)"
        : "linear-gradient(135deg, #D97706, #B45309)",
      border: `4px solid ${isBlood ? "#1E1B4B" : "#FFFFFF"}`,
      boxShadow: isBlood
        ? "0 0 20px rgba(225, 29, 72, 0.6), 0 0 40px rgba(225, 29, 72, 0.3)"
        : "0 0 20px rgba(217, 119, 6, 0.6), 0 0 40px rgba(217, 119, 6, 0.3)",
    }),
    [isBlood]
  );

  // 主题图标：血怒用火焰，混躺用面条
  const nodeIcon = isBlood ? "🔥" : "🍜";

  return (
    <div
      className="hidden sm:flex absolute left-1/2 -ml-8 w-16 h-16 rounded-full items-center justify-center cursor-pointer hover:scale-125 z-20 transition-all duration-300"
      style={nodeStyle}
      onClick={onClick}
      data-testid={`timeline-node-${index}`}
    >
      <span className="text-2xl select-none">{nodeIcon}</span>
    </div>
  );
});

/**
 * 时光轴连接线组件
 * 连接节点和卡片的水平线
 */
const TimelineConnector: React.FC<{
  isLeft: boolean;
  theme: Theme;
}> = React.memo(({ isLeft, theme }) => {
  const isBlood = theme === "blood";

  const connectorStyle = useMemo(
    () => ({
      background: isBlood
        ? isLeft
          ? "linear-gradient(to left, rgba(225, 29, 72, 0.5), transparent)"
          : "linear-gradient(to right, rgba(225, 29, 72, 0.5), transparent)"
        : isLeft
          ? "linear-gradient(to left, rgba(217, 119, 6, 0.5), transparent)"
          : "linear-gradient(to right, rgba(217, 119, 6, 0.5), transparent)",
      boxShadow: isBlood ? "0 0 10px rgba(225, 29, 72, 0.3)" : "0 0 10px rgba(217, 119, 6, 0.3)",
    }),
    [isBlood, isLeft]
  );

  return (
    <div
      className={`hidden sm:block absolute top-1/2 -mt-px h-0.5 w-12 ${isLeft ? "right-0" : "left-0"}`}
      style={connectorStyle}
    />
  );
});

/**
 * 单个视频项组件 - 桌面端时光轴布局
 * 移动端使用垂直列表布局
 */
const TimelineVideoItem: React.FC<{
  video: Video;
  index: number;
  theme: Theme;
  onVideoClick: (video: Video) => void;
}> = React.memo(({ video, index, theme, onVideoClick }) => {
  const isLeft = index % 2 === 0;
  const isBlood = theme === "blood";

  return (
    <div
      key={video.id}
      className={`relative mb-8 sm:mb-16 flex items-center ${isLeft ? "sm:justify-start" : "sm:justify-end"} justify-start pl-8 sm:pl-0`}
      data-testid={`timeline-item-${index}`}
    >
      {/* 移动端简化节点 - 小圆点 */}
      <div
        className="sm:hidden absolute left-4 w-3 h-3 rounded-full -ml-1.5 z-10"
        style={{
          background: isBlood ? "#E11D48" : "#D97706",
          border: `2px solid ${isBlood ? "#1E1B4B" : "#FFFFFF"}`,
          top: "24px",
        }}
      />

      {/* 时间节点 - 桌面端显示在中心 */}
      <TimelineNode index={index} theme={theme} onClick={() => onVideoClick(video)} />

      {/* 视频卡片容器 */}
      <div
        className={`relative w-full sm:max-w-sm sm:w-5/12 ${isLeft ? "sm:pr-20" : "sm:pl-20"} sm:px-0`}
      >
        {/* 连接线 - 桌面端显示 */}
        <TimelineConnector isLeft={isLeft} theme={theme} />

        {/* 视频卡片 */}
        <VideoCard
          video={video}
          onClick={onVideoClick}
          theme={theme}
          index={index}
          size="medium"
          layout="vertical"
        />
      </div>
    </div>
  );
});

/**
 * 时光轴视图组件
 * 包含时间轴线、节点、连接线和视频卡片
 */
const TimelineView: React.FC<{
  videos: Video[];
  theme: Theme;
  onVideoClick: (video: Video) => void;
}> = React.memo(({ videos, theme, onVideoClick }) => {
  const isBlood = theme === "blood";

  const centerLineStyle = useMemo(
    () => ({
      background: isBlood
        ? "linear-gradient(to bottom, #E11D48, #9F1239, #E11D48)"
        : "linear-gradient(to bottom, #D97706, #B45309, #D97706)",
      boxShadow: isBlood
        ? "0 0 20px rgba(225, 29, 72, 0.5), 0 0 40px rgba(225, 29, 72, 0.2)"
        : "0 0 20px rgba(217, 119, 6, 0.5), 0 0 40px rgba(217, 119, 6, 0.2)",
    }),
    [isBlood]
  );

  const videoItems = useMemo(() => {
    return videos.map((video, index) => (
      <TimelineVideoItem
        key={video.id}
        video={video}
        index={index}
        theme={theme}
        onVideoClick={onVideoClick}
      />
    ));
  }, [videos, theme, onVideoClick]);

  return (
    <div className="relative py-4">
      {/* 中心时间轴线 - 桌面端显示 */}
      <div
        className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-1 -ml-0.5 rounded-full"
        style={centerLineStyle}
        data-testid="timeline-center-line"
      />

      {/* 移动端简化时间轴线 - 位置调整到left-4与节点对齐 */}
      <div
        className="sm:hidden absolute left-4 top-0 bottom-0 w-0.5 rounded-full"
        style={{
          background: isBlood
            ? "linear-gradient(to bottom, #E11D48, #9F1239)"
            : "linear-gradient(to bottom, #D97706, #B45309)",
          opacity: 0.5,
        }}
        data-testid="timeline-mobile-line"
      />

      {/* 视频节点列表 */}
      <div className="relative space-y-6 sm:space-y-0">{videoItems}</div>
    </div>
  );
});

export const CanteenHall: React.FC<CanteenHallProps> = ({ theme, onVideoClick }) => {
  const isBlood = theme === "blood";

  // 检测移动端视口
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 使用useVideoView hook管理视频视图状态
  const {
    viewMode,
    setViewMode,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    filteredVideos,
    resetFilters,
  } = useVideoView(videos);

  // 主题配色
  const themeColors = {
    background: isBlood ? "linear-gradient(180deg, #1E1B4B 0%, #0F0F23 100%)" : "#FFFFFF",
    cardBg: isBlood ? "rgba(30, 27, 75, 0.5)" : "#FFFFFF",
    textPrimary: isBlood ? "#E2E8F0" : "#0F172A",
    textSecondary: isBlood ? "#94A3B8" : "#334155",
    textMuted: isBlood ? "#64748B" : "#64748B",
    borderColor: isBlood ? "rgba(225, 29, 72, 0.3)" : "#E2E8F0",
    accentColor: isBlood ? "#E11D48" : "#D97706",
    searchBg: isBlood ? "rgba(30, 27, 75, 0.5)" : "#F8FAFC",
  };

  // 处理搜索
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // 清除搜索
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  // 渲染视频列表
  const renderVideoContent = () => {
    if (filteredVideos.length === 0) {
      return (
        <div className="text-center py-12">
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{
              background: isBlood ? "rgba(225, 29, 72, 0.1)" : "rgba(217, 119, 6, 0.1)",
            }}
          >
            <Search className="w-8 h-8" style={{ color: themeColors.accentColor }} />
          </div>
          <p className="mb-2" style={{ color: themeColors.textSecondary }}>
            没有找到匹配的视频
          </p>
          <button
            onClick={resetFilters}
            className="text-sm underline"
            style={{ color: themeColors.accentColor }}
          >
            清除筛选
          </button>
        </div>
      );
    }

    switch (viewMode) {
      case "list":
        return (
          <div className="space-y-4">
            {filteredVideos.map((video, index) => (
              <VideoCard
                key={video.id}
                video={video}
                onClick={onVideoClick}
                theme={theme}
                index={index}
                size="medium"
                layout="horizontal"
              />
            ))}
          </div>
        );
      case "timeline":
        // 时间轴视图 - 使用新的TimelineView组件
        return <TimelineView videos={filteredVideos} theme={theme} onVideoClick={onVideoClick} />;
      case "grid":
      default:
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredVideos.map((video, index) => (
              <VideoCard
                key={video.id}
                video={video}
                onClick={onVideoClick}
                theme={theme}
                index={index}
                size="small"
                layout="vertical"
              />
            ))}
          </div>
        );
    }
  };

  return (
    <section
      id="canteen"
      className="py-16 px-4"
      style={{
        background: themeColors.background,
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-8">
          <h2
            className="text-3xl md:text-4xl font-black mb-3"
            style={{
              fontFamily: "Russo One, sans-serif",
              color: themeColors.accentColor,
              textShadow: isBlood
                ? "0 0 30px rgba(225, 29, 72, 0.5)"
                : "0 0 30px rgba(217, 119, 6, 0.3)",
            }}
          >
            {isBlood ? "血怒时刻" : "食堂大殿"}
          </h2>
          <p style={{ color: themeColors.textSecondary }}>
            {isBlood ? "硬核操作，天神下凡" : "下饭经典，吃饱为止"}
          </p>
        </div>

        {/* Video View Toolbar - 桌面端 */}
        <div className="hidden sm:block mb-6">
          <VideoViewToolbar
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            filter={filter}
            onFilterChange={setFilter}
            onSearch={handleSearch}
            searchQuery={searchQuery}
            onClearSearch={handleClearSearch}
            theme={theme}
          />
        </div>

        {/* Icon Toolbar - 移动端 */}
        <div className="sm:hidden mb-6">
          <IconToolbar
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            filter={filter}
            onFilterChange={setFilter}
            onSearch={handleSearch}
            searchQuery={searchQuery}
            onClearSearch={handleClearSearch}
            theme={theme}
            isMobile={true}
          />
        </div>

        {/* Video Count */}
        <div className="text-center mb-4">
          <span className="text-sm" style={{ color: themeColors.textMuted }}>
            共 <span style={{ color: themeColors.accentColor }}>{filteredVideos.length}</span>{" "}
            个视频
            {searchQuery && (
              <span className="ml-2">
                搜索:{" "}
                <span style={{ color: themeColors.textSecondary }}>&quot;{searchQuery}&quot;</span>
              </span>
            )}
          </span>
        </div>

        {/* Videos Content */}
        {renderVideoContent()}
      </div>
    </section>
  );
};

export default CanteenHall;
