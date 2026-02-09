import React, { useState } from "react";
import type { Theme, Video } from "../data/types";
import { videos, canteenCategories } from "../data/videos";
import { Sword, Utensils, Soup, Play, Clock, Tag } from "lucide-react";

interface CanteenHallProps {
  theme: Theme;
  onVideoClick: (video: Video) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  sword: <Sword className="w-5 h-5" />,
  utensils: <Utensils className="w-5 h-5" />,
  soup: <Soup className="w-5 h-5" />,
};

export const CanteenHall: React.FC<CanteenHallProps> = ({ theme, onVideoClick }) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const isBlood = theme === "blood";

  const filteredVideos =
    activeCategory === "all" ? videos : videos.filter(v => v.category === activeCategory);

  return (
    <section
      id="canteen"
      className="py-20 px-4"
      style={{
        background: "linear-gradient(180deg, #1E1B4B 0%, #0F0F23 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2
            className="text-4xl md:text-5xl font-black mb-4"
            style={{
              fontFamily: "Russo One, sans-serif",
              color: isBlood ? "#E11D48" : "#F59E0B",
              textShadow: isBlood
                ? "0 0 30px rgba(225, 29, 72, 0.5)"
                : "0 0 30px rgba(245, 158, 11, 0.5)",
            }}
          >
            食堂大殿
          </h2>
          <p className="text-gray-400 text-lg">下饭经典，血怒时刻，应有尽有</p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button
            onClick={() => setActiveCategory("all")}
            className="px-6 py-3 rounded-full font-bold transition-all duration-300 flex items-center gap-2"
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
                    ? "0 0 20px rgba(225, 29, 72, 0.4)"
                    : "0 0 20px rgba(245, 158, 11, 0.4)"
                  : "none",
            }}
          >
            全部
          </button>
          {canteenCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="px-6 py-3 rounded-full font-bold transition-all duration-300 flex items-center gap-2"
              style={{
                background: activeCategory === cat.id ? cat.color : "rgba(30, 27, 75, 0.5)",
                color: activeCategory === cat.id ? "white" : "#94A3B8",
                border: `2px solid ${activeCategory === cat.id ? cat.color : "rgba(148, 163, 184, 0.3)"}`,
                boxShadow: activeCategory === cat.id ? `0 0 20px ${cat.color}40` : "none",
              }}
            >
              {iconMap[cat.icon]}
              {cat.name}
            </button>
          ))}
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video, index) => (
            <div
              key={video.id}
              onClick={() => onVideoClick(video)}
              className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: "rgba(30, 27, 75, 0.5)",
                border: `1px solid ${isBlood ? "rgba(225, 29, 72, 0.2)" : "rgba(245, 158, 11, 0.2)"}`,
                animationDelay: `${index * 0.1}s`,
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
                    className="w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: isBlood
                        ? "linear-gradient(135deg, #E11D48, #DC2626)"
                        : "linear-gradient(135deg, #F59E0B, #3B82F6)",
                      boxShadow: isBlood
                        ? "0 0 30px rgba(225, 29, 72, 0.6)"
                        : "0 0 30px rgba(245, 158, 11, 0.6)",
                    }}
                  >
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>
                {/* Duration Badge */}
                <div
                  className="absolute bottom-2 right-2 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1"
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
              <div className="p-5">
                <h3
                  className="text-white font-bold mb-3 line-clamp-2 text-lg group-hover:line-clamp-none transition-all"
                  style={{
                    fontFamily: "Chakra Petch, sans-serif",
                  }}
                >
                  {video.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {video.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                      style={{
                        background: isBlood
                          ? "rgba(225, 29, 72, 0.15)"
                          : "rgba(245, 158, 11, 0.15)",
                        color: isBlood ? "#E11D48" : "#F59E0B",
                        border: `1px solid ${isBlood ? "rgba(225, 29, 72, 0.3)" : "rgba(245, 158, 11, 0.3)"}`,
                      }}
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hover Border Glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  boxShadow: isBlood
                    ? "inset 0 0 30px rgba(225, 29, 72, 0.2), 0 0 30px rgba(225, 29, 72, 0.3)"
                    : "inset 0 0 30px rgba(245, 158, 11, 0.2), 0 0 30px rgba(245, 158, 11, 0.3)",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CanteenHall;
