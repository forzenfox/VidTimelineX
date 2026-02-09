import React from "react";
import type { Theme } from "../data/types";
import { titles } from "../data/videos";
import { Crown, Fish, Swords, Shield, TowerControl, Skull, Sparkles, Target } from "lucide-react";

interface TitleHallProps {
  theme: Theme;
}

const iconMap: Record<string, React.ReactNode> = {
  C皇: <Crown className="w-6 h-6" />,
  鳃皇: <Fish className="w-6 h-6" />,
  鱼酱: <Fish className="w-6 h-6" />,
  反驴复鱼: <Swords className="w-6 h-6" />,
  "solo king": <Target className="w-6 h-6" />,
  鱼人: <Fish className="w-6 h-6" />,
  峡谷第一混: <Shield className="w-6 h-6" />,
  峡谷鬼见愁: <Skull className="w-6 h-6" />,
  峡谷养爹人: <Sparkles className="w-6 h-6" />,
  塔下战神: <TowerControl className="w-6 h-6" />,
  塔之子: <TowerControl className="w-6 h-6" />,
};

export const TitleHall: React.FC<TitleHallProps> = ({ theme }) => {
  const isBlood = theme === "blood";

  // 将称号分组，第一组显示重点称号
  const featuredTitles = titles.slice(0, 4);
  const regularTitles = titles.slice(4);

  return (
    <section
      id="titles"
      className="py-20 px-4"
      style={{
        background: "linear-gradient(180deg, #0F0F23 0%, #1E1B4B 100%)",
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
            称号殿堂
          </h2>
          <p className="text-gray-400 text-lg">C皇的荣耀称号集合</p>
        </div>

        {/* Featured Titles - Large Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {featuredTitles.map(title => (
            <div
              key={title.id}
              className="group relative p-6 rounded-2xl transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${title.color}20 0%, rgba(30, 27, 75, 0.8) 100%)`,
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
                  className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `${title.color}30`,
                    color: title.color,
                    boxShadow: `0 0 20px ${title.color}40`,
                  }}
                >
                  {iconMap[title.name] || <Crown className="w-6 h-6" />}
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: title.color }}>
                  {title.name}
                </h3>
                <p className="text-sm text-gray-400">{title.description}</p>
              </div>

              {/* Border Glow on Hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  boxShadow: `inset 0 0 30px ${title.color}30, 0 0 30px ${title.color}40`,
                }}
              />
            </div>
          ))}
        </div>

        {/* Regular Titles - Smaller Cards */}
        <div className="grid grid-cols-3 md:grid-cols-7 gap-3">
          {regularTitles.map(title => (
            <div
              key={title.id}
              className="group relative p-4 rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer"
              style={{
                background: "rgba(30, 27, 75, 0.5)",
                border: `1px solid ${title.color}40`,
              }}
            >
              {/* Content */}
              <div className="relative z-10 text-center">
                <div
                  className="w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center"
                  style={{
                    background: `${title.color}20`,
                    color: title.color,
                  }}
                >
                  {iconMap[title.name] || <Crown className="w-5 h-5" />}
                </div>
                <h3 className="text-sm font-bold mb-1" style={{ color: title.color }}>
                  {title.name}
                </h3>
                <p className="text-xs text-gray-500">{title.description}</p>
              </div>

              {/* Hover Glow */}
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  boxShadow: `0 0 20px ${title.color}30`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TitleHall;
