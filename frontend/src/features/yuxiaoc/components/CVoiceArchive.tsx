import React, { useMemo } from "react";
import type { Theme } from "../data/types";
import voicesData from "../data/voices.json";
import { Volume2, Quote, Sparkles, Sword, Brain, MessageCircle } from "lucide-react";

interface CVoiceArchiveProps {
  theme: Theme;
}

// 分类图标映射
const categoryIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  skill: Sword,
  philosophy: Brain,
  classic: MessageCircle,
  blood: Sword,
};

// 分类颜色映射
const categoryColorMap: Record<string, string> = {
  skill: "#E11D48",
  philosophy: "#F59E0B",
  classic: "#3B82F6",
  blood: "#DC2626",
};

// 分类标签映射
const categoryLabelMap: Record<string, string> = {
  skill: "技能",
  philosophy: "哲学",
  classic: "经典",
  blood: "血怒",
};

/**
 * C言C语典藏馆组件
 * 从 JSON 配置文件加载语录数据，根据主题显示不同的语录
 */
export const CVoiceArchive: React.FC<CVoiceArchiveProps> = ({ theme }) => {
  const isBlood = theme === "blood";

  // 主题配色配置
  const themeColors = useMemo(() => {
    if (isBlood) {
      return {
        // 血怒模式 - 深色配色
        background: "linear-gradient(180deg, #0F0F23 0%, #1E1B4B 100%)",
        cardBg: "linear-gradient(135deg, rgba(30, 27, 75, 0.8) 0%, rgba(15, 15, 35, 0.9) 100%)",
        itemBg: "rgba(30, 27, 75, 0.5)",
        textPrimary: "#E2E8F0",
        textSecondary: "#94A3B8",
      };
    }
    // 混躺模式 - 明亮配色
    return {
      background: "linear-gradient(180deg, #FEF3C7 0%, #FDE68A 100%)",
      cardBg: "linear-gradient(135deg, rgba(254, 243, 199, 0.8) 0%, rgba(254, 243, 199, 0.9) 100%)",
      itemBg: "rgba(254, 243, 199, 0.5)",
      textPrimary: "#78350F",
      textSecondary: "#92400E",
    };
  }, [isBlood]);

  // 从 JSON 获取当前主题的语录数据
  const voices = useMemo(() => {
    return voicesData[theme] || { featured: { text: "", author: "", category: "classic" }, list: [] };
  }, [theme]);

  // 获取特色语录的分类颜色
  const featuredCategoryColor = useMemo(() => {
    const category = voices.featured?.category || "classic";
    return categoryColorMap[category] || "#94A3B8";
  }, [voices]);

  return (
    <section
      id="voices"
      className="py-16 px-4"
      style={{
        background: themeColors.background,
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-10">
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
            {isBlood ? "血怒宣言" : "C言C语典藏馆"}
          </h2>
          <p style={{ color: themeColors.textSecondary }}>
            {isBlood ? "战斗语录，激情澎湃" : "经典语录，永流传"}
          </p>
        </div>

        {/* Philosophy Wall - Featured Quote */}
        <div
          className="mb-8 p-6 md:p-10 rounded-3xl relative overflow-hidden"
          style={{
            background: themeColors.cardBg,
            border: `2px solid ${isBlood ? "rgba(225, 29, 72, 0.3)" : "rgba(245, 158, 11, 0.3)"}`,
            boxShadow: isBlood
              ? "0 0 40px rgba(225, 29, 72, 0.2), inset 0 0 40px rgba(225, 29, 72, 0.1)"
              : "0 0 40px rgba(245, 158, 11, 0.2), inset 0 0 40px rgba(245, 158, 11, 0.1)",
          }}
        >
          {/* Decorative Elements */}
          <div className="absolute top-4 left-4 opacity-20">
            <Quote className="w-12 h-12" style={{ color: featuredCategoryColor }} />
          </div>
          <div className="absolute bottom-4 right-4 opacity-20 rotate-180">
            <Quote className="w-12 h-12" style={{ color: featuredCategoryColor }} />
          </div>

          {/* Content */}
          <div className="relative z-10 text-center">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
              style={{
                background: isBlood ? "rgba(225, 29, 72, 0.2)" : "rgba(245, 158, 11, 0.2)",
                border: `1px solid ${isBlood ? "rgba(225, 29, 72, 0.3)" : "rgba(245, 158, 11, 0.3)"}`,
              }}
            >
              <Sparkles className="w-4 h-4" style={{ color: isBlood ? "#E11D48" : "#F59E0B" }} />
              <span
                className="text-sm font-bold"
                style={{ color: isBlood ? "#E11D48" : "#F59E0B" }}
              >
                {isBlood ? "血怒长廊" : "哲学长廊"}
              </span>
            </div>

            <blockquote
              className="text-xl md:text-3xl font-bold mb-4"
              style={{
                fontFamily: "Chakra Petch, sans-serif",
                color: themeColors.textPrimary,
                textShadow: isBlood
                  ? "0 0 20px rgba(225, 29, 72, 0.3)"
                  : "0 0 20px rgba(245, 158, 11, 0.3)",
              }}
            >
              &ldquo;{voices.featured?.text || "混与躺轮回不止，这把混，下把躺"}&rdquo;
            </blockquote>

            <div className="flex items-center justify-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: isBlood
                    ? "linear-gradient(135deg, #E11D48, #DC2626)"
                    : "linear-gradient(135deg, #F59E0B, #3B82F6)",
                }}
              >
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <p style={{ color: themeColors.textSecondary }}>
                —— {voices.featured?.author || "C皇 · 峡谷哲学"}
              </p>
            </div>
          </div>
        </div>

        {/* Voices Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {voices.list?.map(voice => {
            const color = categoryColorMap[voice.category] || "#94A3B8";
            const IconComponent = categoryIconMap[voice.category] || Volume2;
            const categoryLabel = categoryLabelMap[voice.category] || "其他";

            return (
              <div
                key={voice.id}
                className="group relative p-4 rounded-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
                style={{
                  background: themeColors.itemBg,
                  border: `1px solid ${color}30`,
                }}
              >
                {/* Category Badge */}
                <div
                  className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                  style={{
                    background: `${color}20`,
                    color: color,
                  }}
                >
                  {categoryLabel}
                </div>

                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `${color}20`,
                    color: color,
                    boxShadow: `0 0 10px ${color}30`,
                  }}
                >
                  <IconComponent className="w-5 h-5" />
                </div>

                {/* Quote */}
                <div className="relative">
                  <Quote className="absolute -top-1 -left-1 w-3 h-3 opacity-20" style={{ color }} />
                  <p
                    className="text-sm font-bold pl-4 leading-tight"
                    style={{ color: themeColors.textPrimary }}
                  >
                    {voice.text}
                  </p>
                </div>

                {/* Hover Effect */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    boxShadow: `0 0 20px ${color}25`,
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

export default CVoiceArchive;
