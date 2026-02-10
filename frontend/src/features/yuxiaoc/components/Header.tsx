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
    label: "直播间",
    icon: Radio,
    url: "https://www.douyu.com/123456",
  },
  {
    id: "yuba",
    label: "鱼吧",
    icon: MessageCircle,
    url: "https://yuba.douyu.com/group/123456",
  },
  {
    id: "bilibili",
    label: "B站",
    icon: PlayCircle,
    url: "https://space.bilibili.com/xxx",
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

      const sections = navItems.map((item) => document.getElementById(item.id));
      const scrollPosition = scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
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
                <Crown className="w-6 h-6 text-white" />
                <div className="absolute bottom-0 right-0 bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                  LIVE
                </div>
              </div>
              <div>
                <h1
                  className="text-lg font-black leading-tight cursor-pointer transition-colors duration-300"
                  onClick={() => scrollToSection("hero")}
                  style={{
                    fontFamily: "Russo One, sans-serif",
                    color: isBlood ? "#E11D48" : "#F59E0B",
                  }}
                >
                  C皇驾到
                </h1>
                <p className="text-xs" style={{ color: isBlood ? "#94A3B8" : "#475569" }}>
                  斗鱼 123456
                </p>
              </div>
            </div>

            {/* Navigation - Desktop */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
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

            {/* External Links - Middle Section */}
            <div className="hidden lg:flex items-center gap-4">
              {externalLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium transition-colors"
                    style={{
                      color: isBlood ? "#94A3B8" : "#475569",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = isBlood ? "#E11D48" : "#F59E0B";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = isBlood ? "#94A3B8" : "#475569";
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden xl:inline">{link.label}</span>
                  </a>
                );
              })}
            </div>

            {/* Right Section - Theme Toggle & Quick Actions */}
            <div className="flex items-center gap-2">
              {/* Quick Action Buttons */}
              <div className="flex items-center gap-1 mr-2">
                {navItems.slice(1, 4).map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={`quick-${item.id}`}
                      onClick={() => scrollToSection(item.id)}
                      className="flex items-center gap-1 px-2 py-1.5 rounded-lg transition-all duration-200 text-xs font-medium"
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
                      <Icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={onThemeToggle}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105"
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
                    <Sword className="w-4 h-4" />
                    <span className="hidden sm:inline">血怒模式</span>
                  </>
                ) : (
                  <>
                    <Fish className="w-4 h-4" />
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
          className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
          style={{
            background: isBlood
              ? "linear-gradient(135deg, #E11D48 0%, #DC2626 100%)"
              : "linear-gradient(135deg, #F59E0B 0%, #3B82F6 100%)",
            boxShadow: isBlood
              ? "0 4px 20px rgba(225, 29, 72, 0.4)"
              : "0 4px 20px rgba(245, 158, 11, 0.4)",
          }}
        >
          <ChevronUp className="w-6 h-6 text-white" />
        </button>
      )}
    </>
  );
};

export default Header;
