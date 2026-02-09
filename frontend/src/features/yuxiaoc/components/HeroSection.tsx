import React from "react";
import type { Theme } from "../data/types";
import { Crown, Gamepad2, ExternalLink, Sword, Shield } from "lucide-react";

interface HeroSectionProps {
  theme: Theme;
}

/**
 * Hero区域组件
 * 根据主题显示不同的背景、标题和描述
 */
export const HeroSection: React.FC<HeroSectionProps> = ({ theme }) => {
  const isBlood = theme === "blood";

  // 主题特定的内容配置
  const themeContent = {
    blood: {
      subtitle: "血怒之下，众生平等；无情铁手，致残打击！",
      description: "诺克萨斯即将崛起，大杀四方，断头台！",
      rageLabel: "当前血怒值",
      ragePercentage: "100%",
      primaryButton: "进入直播间",
      secondaryButton: "观看血怒时刻",
      gradient: "linear-gradient(135deg, #0F0F23 0%, #1E1B4B 50%, #0F0F23 100%)",
      orbColors: ["#E11D48", "#DC2626"],
      icon: Sword,
    },
    mix: {
      subtitle: "混与躺轮回不止，这把混，下把躺",
      description: "峡谷路远，混躺轮回。吃饭要紧，下饭经典。",
      rageLabel: "当前混躺值",
      ragePercentage: "50%",
      primaryButton: "进入直播间",
      secondaryButton: "浏览食堂",
      gradient: "linear-gradient(135deg, #1E1B4B 0%, #0F0F23 50%, #1E1B4B 100%)",
      orbColors: ["#F59E0B", "#3B82F6"],
      icon: Shield,
    },
  };

  const content = themeContent[theme];
  const IconComponent = content.icon;

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden"
      style={{
        background: content.gradient,
      }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl animate-pulse-glow"
          style={{
            background: `radial-gradient(circle, ${content.orbColors[0]} 0%, transparent 70%)`,
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl animate-pulse-glow"
          style={{
            background: `radial-gradient(circle, ${content.orbColors[1]} 0%, transparent 70%)`,
            animationDelay: "1s",
          }}
        />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(to right, ${isBlood ? "#E11D48" : "#F59E0B"} 1px, transparent 1px),
              linear-gradient(to bottom, ${isBlood ? "#E11D48" : "#F59E0B"} 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Theme-specific decorative elements */}
        {isBlood && (
          <>
            {/* Blood Rage decorative lines */}
            <div
              className="absolute top-1/3 right-10 w-32 h-1 rounded-full opacity-30"
              style={{
                background: "linear-gradient(90deg, transparent, #E11D48, transparent)",
                transform: "rotate(-45deg)",
              }}
            />
            <div
              className="absolute bottom-1/3 left-10 w-24 h-1 rounded-full opacity-30"
              style={{
                background: "linear-gradient(90deg, transparent, #DC2626, transparent)",
                transform: "rotate(45deg)",
              }}
            />
          </>
        )}
        {!isBlood && (
          <>
            {/* Mix/Lie decorative circles */}
            <div
              className="absolute top-1/4 right-1/4 w-4 h-4 rounded-full opacity-40"
              style={{ background: "#F59E0B" }}
            />
            <div
              className="absolute bottom-1/3 left-1/3 w-3 h-3 rounded-full opacity-40"
              style={{ background: "#3B82F6" }}
            />
            <div
              className="absolute top-2/3 right-1/3 w-2 h-2 rounded-full opacity-40"
              style={{ background: "#10B981" }}
            />
          </>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Avatar */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            {/* Glow Ring */}
            <div
              className="absolute inset-0 rounded-full animate-blood-rage"
              style={{
                background: isBlood
                  ? "linear-gradient(135deg, #E11D48, #F59E0B, #E11D48)"
                  : "linear-gradient(135deg, #F59E0B, #3B82F6, #F59E0B)",
                transform: "scale(1.1)",
                filter: "blur(8px)",
              }}
            />
            {/* Avatar Container */}
            <div
              className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4"
              style={{
                borderColor: isBlood ? "#E11D48" : "#F59E0B",
                boxShadow: isBlood
                  ? "0 0 30px rgba(225, 29, 72, 0.5)"
                  : "0 0 30px rgba(245, 158, 11, 0.5)",
              }}
            >
              <img
                src="https://apic.douyucdn.cn/upload/avatar_v3/202101/6b4c26c9f8c84c9e8d0e8f5c5c5c5c5c_middle.jpg"
                alt="C皇头像"
                className="w-full h-full object-cover"
                onError={e => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80";
                }}
              />
              {/* Crown Icon Overlay */}
              <div
                className="absolute -top-2 left-1/2 transform -translate-x-1/2"
                style={{
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
                }}
              >
                <Crown
                  className="w-8 h-8"
                  style={{ color: isBlood ? "#F59E0B" : "#E11D48" }}
                  fill="currentColor"
                />
              </div>
            </div>

            {/* Theme indicator badge */}
            <div
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold"
              style={{
                background: isBlood
                  ? "linear-gradient(135deg, #E11D48, #DC2626)"
                  : "linear-gradient(135deg, #F59E0B, #3B82F6)",
                color: "white",
                boxShadow: isBlood
                  ? "0 2px 10px rgba(225, 29, 72, 0.5)"
                  : "0 2px 10px rgba(245, 158, 11, 0.5)",
              }}
            >
              {isBlood ? "血怒模式" : "混躺模式"}
            </div>
          </div>
        </div>

        {/* Main Title */}
        <h1
          className="text-5xl md:text-7xl font-black mb-4"
          style={{
            fontFamily: "Russo One, sans-serif",
            background: isBlood
              ? "linear-gradient(135deg, #E11D48 0%, #F59E0B 50%, #E11D48 100%)"
              : "linear-gradient(135deg, #F59E0B 0%, #3B82F6 50%, #F59E0B 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: isBlood
              ? "0 0 40px rgba(225, 29, 72, 0.3)"
              : "0 0 40px rgba(245, 158, 11, 0.3)",
          }}
        >
          C皇驾到
        </h1>

        {/* Subtitle */}
        <p
          className="text-xl md:text-2xl mb-3"
          style={{
            fontFamily: "Chakra Petch, sans-serif",
            color: "#E2E8F0",
          }}
        >
          {content.subtitle}
        </p>

        {/* Secondary Subtitle */}
        <p className="text-base md:text-lg mb-8 text-gray-400">{content.description}</p>

        {/* Rage/Mix Indicator */}
        <div className="w-full max-w-md mx-auto mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-white font-bold flex items-center gap-2">
              <IconComponent className="w-4 h-4" />
              {content.rageLabel}
            </span>
            <span className="font-bold" style={{ color: isBlood ? "#E11D48" : "#F59E0B" }}>
              {content.ragePercentage}
            </span>
          </div>
          <div
            className="h-3 rounded-full overflow-hidden"
            style={{ backgroundColor: "rgba(30, 27, 75, 0.8)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: content.ragePercentage,
                background: isBlood
                  ? "linear-gradient(90deg, #E11D48 0%, #F59E0B 100%)"
                  : "linear-gradient(90deg, #F59E0B 0%, #3B82F6 100%)",
                boxShadow: isBlood
                  ? "0 0 20px rgba(225, 29, 72, 0.8)"
                  : "0 0 20px rgba(245, 158, 11, 0.8)",
              }}
            />
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://www.douyu.com/123456"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105"
            style={{
              background: isBlood
                ? "linear-gradient(135deg, #E11D48 0%, #DC2626 100%)"
                : "linear-gradient(135deg, #F59E0B 0%, #3B82F6 100%)",
              boxShadow: isBlood
                ? "0 0 30px rgba(225, 29, 72, 0.5)"
                : "0 0 30px rgba(245, 158, 11, 0.5)",
            }}
          >
            <Gamepad2 className="w-5 h-5" />
            <span>{content.primaryButton}</span>
          </a>

          <button
            onClick={() => {
              const element = document.getElementById("canteen");
              if (element) element.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105"
            style={{
              background: "transparent",
              border: `2px solid ${isBlood ? "#E11D48" : "#F59E0B"}`,
              color: isBlood ? "#E11D48" : "#F59E0B",
            }}
          >
            <ExternalLink className="w-5 h-5" />
            <span>{content.secondaryButton}</span>
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div
          className="w-6 h-10 rounded-full border-2 flex items-start justify-center p-1"
          style={{ borderColor: isBlood ? "#E11D48" : "#F59E0B" }}
        >
          <div
            className="w-1.5 h-3 rounded-full animate-bounce"
            style={{ backgroundColor: isBlood ? "#E11D48" : "#F59E0B" }}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
