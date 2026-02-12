import React, { useState, useEffect } from "react";
import type { Theme } from "../data/types";
import {
  Crown,
  Sword,
  Fish,
  Home,
  Award,
  Utensils,
  MessageSquare,
  MessageCircle,
  ChevronUp,
  Radio,
  PlayCircle,
} from "lucide-react";

interface HeaderProps {
  theme: Theme;
  onThemeToggle: () => void;
}

const navItems = [
  { id: "hero", label: "首页", icon: Home },
  { id: "titles", label: "称号", icon: Award },
  { id: "canteen", label: "食堂", icon: Utensils },
  { id: "voices", label: "语录", icon: MessageSquare },
  { id: "danmaku", label: "弹幕", icon: MessageCircle },
];

const externalLinks = [
  {
    id: "live",
    label: "斗鱼直播间",
    icon: Radio,
    url: "https://www.douyu.com/1126960",
  },
  {
    id: "bilibili",
    label: "B站合集",
    icon: PlayCircle,
    url: "https://space.bilibili.com/8985997",
  },
  {
    id: "yuba",
    label: "鱼吧链接",
    icon: MessageCircle,
    url: "https://yuba.douyu.com/discussion/11431/posts",
  },
];

export const Header: React.FC<HeaderProps> = ({ theme, onThemeToggle }) => {
  const isBlood = theme === "blood";
  const [activeSection, setActiveSection] = useState("hero");
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
      setShowScrollTop(scrollY > 500);

      // 过滤掉不存在的section，只遍历存在的section
      const existingSections = navItems
        .map((item) => {
          const element = document.getElementById(item.id);
          return element ? { id: item.id, element } : null;
        })
        .filter((item): item is { id: string; element: HTMLElement } => item !== null);

      const scrollPosition = scrollY + 100;

      // 从下往上遍历各个section
      for (let i = existingSections.length - 1; i >= 0; i--) {
        const { id, element } = existingSections[i];
        if (element.offsetTop <= scrollPosition) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    // 立即更新activeSection状态
    setActiveSection(id);
    
    // 滚动到对应的section
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300"
        style={{
          background: isScrolled
            ? isBlood
              ? "rgba(15, 15, 35, 0.98)"
              : "rgba(255, 255, 255, 0.98)"
            : isBlood
              ? "rgba(15, 15, 35, 0.85)"
              : "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${isBlood ? "rgba(225, 29, 72, 0.3)" : "rgba(245, 158, 11, 0.3)"}`,
          boxShadow: isScrolled
            ? isBlood
              ? "0 4px 20px rgba(225, 29, 72, 0.2)"
              : "0 4px 20px rgba(245, 158, 11, 0.2)"
            : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:pl-8 lg:pr-[336px]">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Live Stream Button */}
            <div className="flex items-center gap-3">
              {/* Logo - Home button */}
              <div
                className="relative w-10 h-10 rounded-full flex items-center justify-center overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-110"
                onClick={() => scrollToSection("hero")}
                style={{
                  background: isBlood
                    ? "linear-gradient(135deg, #E11D48 0%, #DC2626 100%)"
                    : "linear-gradient(135deg, #F59E0B 0%, #3B82F6 100%)",
                  boxShadow: isBlood
                    ? "0 0 20px rgba(225, 29, 72, 0.5)"
                    : "0 0 20px rgba(245, 158, 11, 0.5)",
                }}
              >
                <Crown className="w-6 h-6 text-white mx-auto" />
              </div>
              
              {/* Live Stream Button */}
              <a
                href="https://www.douyu.com/1126960"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200"
                style={{
                  color: isBlood ? "#E2E8F0" : "#0F172A",
                  background: isBlood
                    ? "linear-gradient(135deg, #E11D48 0%, #DC2626 100%)"
                    : "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                  boxShadow: isBlood
                    ? "0 2px 8px rgba(225, 29, 72, 0.4)"
                    : "0 2px 8px rgba(245, 158, 11, 0.4)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = isBlood
                    ? "0 4px 12px rgba(225, 29, 72, 0.6)"
                    : "0 4px 12px rgba(245, 158, 11, 0.6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = isBlood
                    ? "0 2px 8px rgba(225, 29, 72, 0.4)"
                    : "0 2px 8px rgba(245, 158, 11, 0.4)";
                }}
              >
                <Radio className="w-4 h-4 text-white" />
                <span>斗鱼直播间</span>
              </a>
            </div>

            {/* Navigation - Desktop */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.filter(item => item.id !== "danmaku").map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative"
                    style={{
                      color: isActive ? (isBlood ? "#E11D48" : "#F59E0B") : isBlood ? "#94A3B8" : "#475569",
                      background: isActive
                        ? isBlood
                          ? "rgba(225, 29, 72, 0.15)"
                          : "rgba(245, 158, 11, 0.15)"
                        : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = isBlood ? "#E11D48" : "#F59E0B";
                        e.currentTarget.style.background = isBlood
                          ? "rgba(225, 29, 72, 0.1)"
                          : "rgba(245, 158, 11, 0.1)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = isBlood ? "#94A3B8" : "#475569";
                        e.currentTarget.style.background = "transparent";
                      }
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {isActive && (
                      <div
                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full"
                        style={{ backgroundColor: isBlood ? "#E11D48" : "#F59E0B" }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* External Links - Middle Section - Removed */}
            {/* B站和鱼吧链接已从导航栏中移除 */}

            {/* Right Section - Theme Toggle & Quick Actions */}
            <div className="flex items-center gap-2">
              {/* Quick Action Buttons */}
              <div className="flex items-center gap-1 mr-2 lg:hidden">
                {navItems.slice(1, 4).map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={`quick-${item.id}`}
                      onClick={() => scrollToSection(item.id)}
                      className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg transition-all duration-200 text-xs font-medium"
                      style={{
                        color: isActive ? (isBlood ? "#E11D48" : "#F59E0B") : isBlood ? "#94A3B8" : "#475569",
                        background: isActive
                          ? isBlood
                            ? "rgba(225, 29, 72, 0.2)"
                            : "rgba(245, 158, 11, 0.2)"
                          : "transparent",
                        border: isActive
                          ? `1px solid ${isBlood ? "rgba(225, 29, 72, 0.5)" : "rgba(245, 158, 11, 0.5)"}`
                          : `1px solid ${isBlood ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.color = isBlood ? "#E11D48" : "#F59E0B";
                          e.currentTarget.style.background = isBlood
                            ? "rgba(225, 29, 72, 0.1)"
                            : "rgba(245, 158, 11, 0.1)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.color = isBlood ? "#94A3B8" : "#475569";
                          e.currentTarget.style.background = "transparent";
                        }
                      }}
                      title={item.label}
                    >
                      <Icon className="w-3.5 h-3.5 mx-auto" />
                      <span className="hidden sm:inline">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={onThemeToggle}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105"
                style={{
                  background: isBlood
                    ? "linear-gradient(135deg, #E11D48 0%, #DC2626 100%)"
                    : "linear-gradient(135deg, #F59E0B 0%, #3B82F6 100%)",
                  color: "white",
                  boxShadow: isBlood
                    ? "0 0 15px rgba(225, 29, 72, 0.4)"
                    : "0 0 15px rgba(245, 158, 11, 0.4)",
                }}
              >
                {isBlood ? (
                  <>
                    <Sword className="w-4 h-4 mx-auto" />
                    <span className="hidden sm:inline">血怒模式</span>
                  </>
                ) : (
                  <>
                    <Fish className="w-4 h-4 mx-auto" />
                    <span className="hidden sm:inline">混躺模式</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Progress Bar */}
        <div
          className="absolute bottom-0 left-0 h-0.5 transition-all duration-100"
          style={{
            width: `${((typeof window !== "undefined" ? window.scrollY : 0) / (document.documentElement.scrollHeight - window.innerHeight)) * 100}%`,
            background: isBlood
              ? "linear-gradient(90deg, #E11D48, #F59E0B)"
              : "linear-gradient(90deg, #F59E0B, #3B82F6)",
          }}
        />
      </header>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1 cursor-pointer"
          style={{
            right: "340px",
            background: isBlood
              ? "rgba(225, 29, 72, 0.9)"
              : "rgba(245, 158, 11, 0.9)",
            backdropFilter: "blur(8px)",
            boxShadow: isBlood
              ? "0 4px 15px rgba(225, 29, 72, 0.3)"
              : "0 4px 15px rgba(245, 158, 11, 0.3)",
            border: `1px solid ${isBlood ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.3)"}`,
          }}
        >
          <ChevronUp className="w-5 h-5 text-white" />
        </button>
      )}
    </>
  );
};

export default Header;
