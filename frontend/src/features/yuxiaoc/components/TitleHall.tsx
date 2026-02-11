import React, { useMemo } from "react";
import type { Theme } from "../data/types";
import titlesData from "../data/titles.json";
import {
  Crown,
  Fish,
  Swords,
  Shield,
  TowerControl,
  Skull,
  Sparkles,
  Target,
  Zap,
  Flame,
  User,
  Bed,
  Heart,
  Utensils,
} from "lucide-react";

interface TitleHallProps {
  theme: Theme;
}

// 图标映射表
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  crown: Crown,
  fish: Fish,
  swords: Swords,
  shield: Shield,
  tower: TowerControl,
  skull: Skull,
  sparkles: Sparkles,
  target: Target,
  zap: Zap,
  flame: Flame,
  user: User,
  bed: Bed,
  heart: Heart,
  utensils: Utensils,
};

/**
 * 称号殿堂组件
 * 从 JSON 配置文件加载称号数据，根据主题显示不同的称号
 */
export const TitleHall: React.FC<TitleHallProps> = ({ theme }) => {
  const isBlood = theme === "blood";

  // 从 JSON 获取当前主题的称号数据
  const titles = useMemo(() => {
    return titlesData[theme] || { featured: [], regular: [] };
  }, [theme]);

  // 主题配色
  const themeColors = {
    background: isBlood
      ? "linear-gradient(180deg, #0F0F23 0%, #1E1B4B 100%)"
      : "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
    cardBg: isBlood
      ? "rgba(30, 27, 75, 0.8)"
      : "#FFFFFF",
    smallCardBg: isBlood
      ? "rgba(30, 27, 75, 0.5)"
      : "#FFFFFF",
    textSecondary: isBlood ? "#94A3B8" : "#334155",
    textMuted: isBlood ? "#64748B" : "#64748B",
  };

  return (
    <section
      id="titles"
      className="py-16 px-4 sm:px-6 lg:px-8"
      style={{
        background: themeColors.background,
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-10">
          <h2
            className="text-3xl md:text-4xl font-black mb-3"
            style={{
              fontFamily: "Russo One, sans-serif",
              color: isBlood ? "#E11D48" : "#D97706",
              textShadow: isBlood
                ? "0 0 30px rgba(225, 29, 72, 0.5)"
                : "0 0 30px rgba(217, 119, 6, 0.3)",
            }}
          >
            称号殿堂
          </h2>
          <p style={{ color: themeColors.textSecondary }}>
            {isBlood ? "血怒荣耀，战斗称号" : "C皇的荣耀称号集合"}
          </p>
        </div>

        {/* Featured Titles - Large Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {titles.featured.map(title => {
            const IconComponent = iconMap[title.icon] || Crown;
            return (
              <div
                key={title.id}
                className="group relative p-5 rounded-2xl transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${title.color}20 0%, ${themeColors.cardBg} 100%)`,
                  border: `2px solid ${title.color}50`,
                }}
              >
                {/* Glow Effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at center, ${title.color}30 0%, transparent 70%)`,
                  }}
                />

                {/* Content */}
                <div className="relative z-10 text-center">
                  <div
                    className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: `${title.color}30`,
                      color: title.color,
                      boxShadow: `0 0 15px ${title.color}40`,
                    }}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold mb-1" style={{ color: title.color }}>
                    {title.name}
                  </h3>
                  <p className="text-xs" style={{ color: themeColors.textSecondary }}>{title.description}</p>
                </div>

                {/* Border Glow on Hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    boxShadow: `inset 0 0 20px ${title.color}30, 0 0 20px ${title.color}40`,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Regular Titles - Smaller Cards */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {titles.regular.map(title => {
            const IconComponent = iconMap[title.icon] || Crown;
            return (
              <div
                key={title.id}
                className="group relative p-3 rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                style={{
                  background: themeColors.smallCardBg,
                  border: `1px solid ${title.color}40`,
                }}
              >
                {/* Content */}
                <div className="relative z-10 text-center">
                  <div
                    className="w-8 h-8 mx-auto mb-2 rounded-lg flex items-center justify-center"
                    style={{
                      background: `${title.color}20`,
                      color: title.color,
                    }}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-bold mb-0.5" style={{ color: title.color }}>
                    {title.name}
                  </h3>
                  <p className="text-[10px]" style={{ color: themeColors.textMuted }}>{title.description}</p>
                </div>

                {/* Hover Glow */}
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    boxShadow: `0 0 15px ${title.color}30`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TitleHall;
