import React, { useState, useMemo } from "react";
import type { Theme, Video } from "../data/types";
import { videos, canteenCategories } from "../data/videos";
import { Sword, Utensils, Soup, Search, X } from "lucide-react";
import VideoCard from "../../../components/video/VideoCard";

interface CanteenHallProps {
  theme: Theme;
  onVideoClick: (video: Video) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  sword: <Sword className="w-4 h-4" />,
  utensils: <Utensils className="w-4 h-4" />,
  soup: <Soup className="w-4 h-4" />,
};

export const CanteenHall: React.FC<CanteenHallProps> = ({ theme, onVideoClick }) => {
  // 分类相关状态 - 暂时屏蔽，等数据支持后恢复
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const isBlood = theme === "blood";

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

  // 根据主题调整分类顺序 - 暂时屏蔽，等数据支持后恢复
  const sortedCategories = useMemo(() => {
    if (isBlood) {
      // 血怒模式：硬核区优先
      return [...canteenCategories].sort((a, b) => {
        if (a.id === "hardcore") return -1;
        if (b.id === "hardcore") return 1;
        return 0;
      });
    } else {
      // 混躺模式：主食区优先
      return [...canteenCategories].sort((a, b) => {
        if (a.id === "main") return -1;
        if (b.id === "main") return 1;
        return 0;
      });
    }
  }, [isBlood]);

  // 过滤视频
  const filteredVideos = useMemo(() => {
    let result = videos;

    // 按分类过滤 - 暂时禁用，等数据支持后恢复
    /*
    if (activeCategory !== "all") {
      result = result.filter(v => v.category === activeCategory);
    }
    */

    // 按搜索词过滤
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        v =>
          v.title.toLowerCase().includes(query) ||
          v.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return result;
  }, [searchQuery]); // 移除 activeCategory 依赖

  // 清空搜索
  const clearSearch = () => {
    setSearchQuery("");
    // 重置分类 - 暂时屏蔽，等数据支持后恢复
    // setActiveCategory("all");
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

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-6">
          <div
            className="relative flex items-center"
            style={{
              background: themeColors.searchBg,
              border: `1px solid ${themeColors.borderColor}`,
              borderRadius: "9999px",
            }}
          >
            <Search
              className="absolute left-4 w-5 h-5"
              style={{ color: themeColors.accentColor }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="搜索视频标题或标签..."
              className="w-full pl-12 pr-10 py-3 bg-transparent focus:outline-none rounded-full"
              style={{
                fontFamily: "Chakra Petch, sans-serif",
                color: themeColors.textPrimary,
              }}
              placeholder-color={themeColors.textMuted}
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 p-1 rounded-full hover:bg-black/5 transition-colors"
              >
                <X className="w-4 h-4" style={{ color: themeColors.textMuted }} />
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs - 暂时屏蔽，等数据支持后恢复 */}
        {/*
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <button
            onClick={() => setActiveCategory("all")}
            className="px-4 py-2 rounded-full font-bold transition-all duration-300 flex items-center gap-1.5 text-sm"
            style={{
              background:
                activeCategory === "all"
                  ? isBlood
                    ? "linear-gradient(135deg, #E11D48, #DC2626)"
                    : "#D97706"
                  : themeColors.cardBg,
              color: activeCategory === "all" ? "white" : themeColors.textSecondary,
              border: `2px solid ${
                activeCategory === "all"
                  ? isBlood
                    ? "#E11D48"
                    : "#D97706"
                  : themeColors.borderColor
              }`,
              boxShadow:
                activeCategory === "all"
                  ? isBlood
                    ? "0 0 15px rgba(225, 29, 72, 0.4)"
                    : "0 0 15px rgba(217, 119, 6, 0.3)"
                  : "none",
            }}
          >
            全部
          </button>
          {sortedCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="px-4 py-2 rounded-full font-bold transition-all duration-300 flex items-center gap-1.5 text-sm"
              style={{
                background:
                  activeCategory === cat.id
                    ? isBlood
                      ? cat.color
                      : "#D97706"
                    : themeColors.cardBg,
                color: activeCategory === cat.id ? "white" : themeColors.textSecondary,
                border: `2px solid ${activeCategory === cat.id ? (isBlood ? cat.color : "#D97706") : themeColors.borderColor}`,
                boxShadow:
                  activeCategory === cat.id
                    ? `0 0 15px ${isBlood ? cat.color : "rgba(217, 119, 6, 0.3)"}`
                    : "none",
              }}
            >
              {iconMap[cat.icon]}
              {cat.name}
            </button>
          ))}
        </div>
        */}

        {/* Video Count */}
        <div className="text-center mb-4">
          <span className="text-sm" style={{ color: themeColors.textMuted }}>
            共 <span style={{ color: themeColors.accentColor }}>{filteredVideos.length}</span>{" "}
            个视频
            {searchQuery && (
              <span className="ml-2">
                搜索: <span style={{ color: themeColors.textSecondary }}>"{searchQuery}"</span>
              </span>
            )}
          </span>
        </div>

        {/* Videos Grid - 响应式网格布局：移动端2列，平板端3列，桌面端4列 */}
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

        {/* Empty State */}
        {filteredVideos.length === 0 && (
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
              onClick={() => {
                setSearchQuery("");
                // 重置分类 - 暂时屏蔽，等数据支持后恢复
                // setActiveCategory("all");
              }}
              className="text-sm underline"
              style={{ color: themeColors.accentColor }}
            >
              清除搜索
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CanteenHall;
