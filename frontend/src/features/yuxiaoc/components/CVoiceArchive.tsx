import React from "react";
import type { Theme } from "../data/types";
import { cVoices } from "../data/videos";
import { Volume2, Quote, Sparkles } from "lucide-react";

interface CVoiceArchiveProps {
  theme: Theme;
}

export const CVoiceArchive: React.FC<CVoiceArchiveProps> = ({ theme }) => {
  const isBlood = theme === "blood";

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "skill":
        return "#E11D48";
      case "philosophy":
        return "#F59E0B";
      case "classic":
        return "#3B82F6";
      default:
        return "#94A3B8";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "skill":
        return "技能";
      case "philosophy":
        return "哲学";
      case "classic":
        return "经典";
      default:
        return "其他";
    }
  };

  return (
    <section
      id="voices"
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
            C言C语典藏馆
          </h2>
          <p className="text-gray-400 text-lg">经典语录，永流传</p>
        </div>

        {/* Philosophy Wall - Featured Quote */}
        <div
          className="mb-12 p-8 md:p-12 rounded-3xl relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(30, 27, 75, 0.8) 0%, rgba(15, 15, 35, 0.9) 100%)",
            border: `2px solid ${isBlood ? "rgba(225, 29, 72, 0.3)" : "rgba(245, 158, 11, 0.3)"}`,
            boxShadow: isBlood
              ? "0 0 40px rgba(225, 29, 72, 0.2), inset 0 0 40px rgba(225, 29, 72, 0.1)"
              : "0 0 40px rgba(245, 158, 11, 0.2), inset 0 0 40px rgba(245, 158, 11, 0.1)",
          }}
        >
          {/* Decorative Elements */}
          <div className="absolute top-4 left-4 opacity-20">
            <Quote className="w-16 h-16" style={{ color: isBlood ? "#E11D48" : "#F59E0B" }} />
          </div>
          <div className="absolute bottom-4 right-4 opacity-20 rotate-180">
            <Quote className="w-16 h-16" style={{ color: isBlood ? "#E11D48" : "#F59E0B" }} />
          </div>

          {/* Content */}
          <div className="relative z-10 text-center">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
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
                哲学长廊
              </span>
            </div>

            <blockquote
              className="text-2xl md:text-4xl font-bold mb-6"
              style={{
                fontFamily: "Chakra Petch, sans-serif",
                color: "#E2E8F0",
                textShadow: isBlood
                  ? "0 0 20px rgba(225, 29, 72, 0.3)"
                  : "0 0 20px rgba(245, 158, 11, 0.3)",
              }}
            >
              "混与躺轮回不止，这把混，下把躺"
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
              <p className="text-gray-400">—— C皇 · 峡谷哲学</p>
            </div>
          </div>
        </div>

        {/* Voices Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cVoices.map(voice => {
            const color = getCategoryColor(voice.category);
            return (
              <div
                key={voice.id}
                className="group relative p-5 rounded-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
                style={{
                  background: "rgba(30, 27, 75, 0.5)",
                  border: `1px solid ${color}30`,
                }}
              >
                {/* Category Badge */}
                <div
                  className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold"
                  style={{
                    background: `${color}20`,
                    color: color,
                  }}
                >
                  {getCategoryLabel(voice.category)}
                </div>

                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `${color}20`,
                    color: color,
                    boxShadow: `0 0 15px ${color}30`,
                  }}
                >
                  <Volume2 className="w-6 h-6" />
                </div>

                {/* Quote */}
                <div className="relative">
                  <Quote className="absolute -top-1 -left-1 w-4 h-4 opacity-20" style={{ color }} />
                  <p className="text-base font-bold pl-5" style={{ color: "#E2E8F0" }}>
                    {voice.text}
                  </p>
                </div>

                {/* Hover Effect */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    boxShadow: `0 0 30px ${color}25`,
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
