import React, { useState, useMemo } from "react";
import type { Theme, Video } from "../data/types";
import { videos, canteenCategories } from "../data/videos";
import { Sword, Utensils, Soup, Play, Clock, Tag, Search, X } from "lucide-react";

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
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const isBlood = theme === "blood";

  // 根据主题调整分类顺序
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

    // 按分类过滤
    if (activeCategory !== "all") {
      result = result.filter(v => v.category === activeCategory);
    }

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
  }, [activeCategory, searchQuery]);

  // 清空搜索
  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <section
      id="canteen"
      className="py-16 px-4"
      style={{
        background: "linear-gradient(180deg, #1E1B4B 0%, #0F0F23 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-8">
          <h2
            className="text-3xl md:text-4xl font-black mb-3"
            style={{
              fontFamily: "Russo One, sans-serif",
              color: isBlood ? "#E11D48" : "#F59E0B",
              textShadow: isBlood
                ? "0 0 30px rgba(225, 29, 72, 0.5)"
                : "0 0 30px rgba(245, 158, 11, 0.5)",
            }}
          >
            {isBlood ? "血怒时刻" : "食堂大殿"}
          </h2>
          <p className="text-gray-400">{isBlood ? "硬核操作，天神下凡" : "下饭经典，吃饱为止"}</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-6">
          <div
            className="relative flex items-center"
            style={{
              background: "rgba(30, 27, 75, 0.5)",
              border: `1px solid ${isBlood ? "rgba(225, 29, 72, 0.3)" : "rgba(245, 158, 11, 0.3)"}`,
              borderRadius: "9999px",
            }}
          >
            <Search
              className="absolute left-4 w-5 h-5"
              style={{ color: isBlood ? "#E11D48" : "#F59E0B" }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="搜索视频标题或标签..."
              className="w-full pl-12 pr-10 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none rounded-full"
              style={{
                fontFamily: "Chakra Petch, sans-serif",
              }}
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <button
            onClick={() => setActiveCategory("all")}
            className="px-4 py-2 rounded-full font-bold transition-all duration-300 flex items-center gap-1.5 text-sm"
            style={{
              background:
                activeCategory === "all"
                  ? isBlood
                    ? "linear-gradient(135deg, #E11D48, #DC2626)"
                    : "linear-gradient(135deg, #F59E0B, #3B82F6)"
                  : "rgba(30, 27, 75, 0.5)",
              color: activeCategory === "all" ? "white" : "#94A3B8",
              border: `2px solid ${
                activeCategory === "all"
                  ? isBlood
                    ? "#E11D48"
                    : "#F59E0B"
                  : "rgba(148, 163, 184, 0.3)"
              }`,
              boxShadow:
                activeCategory === "all"
                  ? isBlood
                    ? "0 0 15px rgba(225, 29, 72, 0.4)"
                    : "0 0 15px rgba(245, 158, 11, 0.4)"
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
                background: activeCategory === cat.id ? cat.color : "rgba(30, 27, 75, 0.5)",
                color: activeCategory === cat.id ? "white" : "#94A3B8",
                border: `2px solid ${activeCategory === cat.id ? cat.color : "rgba(148, 163, 184, 0.3)"}`,
                boxShadow: activeCategory === cat.id ? `0 0 15px ${cat.color}40` : "none",
              }}
            >
              {iconMap[cat.icon]}
              {cat.name}
            </button>
          ))}
        </div>

        {/* Video Count */}
        <div className="text-center mb-4">
          <span className="text-sm text-gray-500">
            共{" "}
            <span style={{ color: isBlood ? "#E11D48" : "#F59E0B" }}>{filteredVideos.length}</span>{" "}
            个视频
            {searchQuery && (
              <span className="ml-2">
                搜索: <span className="text-gray-300">"{searchQuery}"</span>
              </span>
            )}
          </span>
        </div>

        {/* Videos Grid - 响应式网格布局：移动端2列，平板端3列，桌面端4列 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredVideos.map((video, index) => (
            <div
              key={video.id}
              onClick={() => onVideoClick(video)}
              className="group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.03]"
              style={{
                background: "rgba(30, 27, 75, 0.5)",
                border: `1px solid ${isBlood ? "rgba(225, 29, 72, 0.2)" : "rgba(245, 158, 11, 0.2)"}`,
                animationDelay: `${index * 0.05}s`,
              }}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={video.cover}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                  style={{
                    background: "rgba(0, 0, 0, 0.6)",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: isBlood
                        ? "linear-gradient(135deg, #E11D48, #DC2626)"
                        : "linear-gradient(135deg, #F59E0B, #3B82F6)",
                      boxShadow: isBlood
                        ? "0 0 20px rgba(225, 29, 72, 0.6)"
                        : "0 0 20px rgba(245, 158, 11, 0.6)",
                    }}
                  >
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  </div>
                </div>
                {/* Duration Badge */}
                <div
                  className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded text-xs font-bold flex items-center gap-0.5"
                  style={{
                    background: "rgba(0, 0, 0, 0.8)",
                    color: "white",
                  }}
                >
                  <Clock className="w-3 h-3" />
                  {video.duration}
                </div>
              </div>

              {/* Info */}
              <div className="p-2.5">
                <h3
                  className="text-white font-bold mb-1.5 line-clamp-2 text-xs group-hover:line-clamp-none transition-all leading-tight"
                  style={{
                    fontFamily: "Chakra Petch, sans-serif",
                  }}
                >
                  {video.title}
                </h3>
                <div className="flex flex-wrap gap-1">
                  {video.tags.slice(0, 2).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-0.5"
                      style={{
                        background: isBlood
                          ? "rgba(225, 29, 72, 0.15)"
                          : "rgba(245, 158, 11, 0.15)",
                        color: isBlood ? "#E11D48" : "#F59E0B",
                        border: `1px solid ${isBlood ? "rgba(225, 29, 72, 0.3)" : "rgba(245, 158, 11, 0.3)"}`,
                      }}
                    >
                      <Tag className="w-2.5 h-2.5" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hover Border Glow */}
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  boxShadow: isBlood
                    ? "inset 0 0 20px rgba(225, 29, 72, 0.2), 0 0 20px rgba(225, 29, 72, 0.3)"
                    : "inset 0 0 20px rgba(245, 158, 11, 0.2), 0 0 20px rgba(245, 158, 11, 0.3)",
                }}
              />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{
                background: isBlood ? "rgba(225, 29, 72, 0.1)" : "rgba(245, 158, 11, 0.1)",
              }}
            >
              <Search className="w-8 h-8" style={{ color: isBlood ? "#E11D48" : "#F59E0B" }} />
            </div>
            <p className="text-gray-400 mb-2">没有找到匹配的视频</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="text-sm underline"
              style={{ color: isBlood ? "#E11D48" : "#F59E0B" }}
            >
              清除筛选条件
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CanteenHall;
