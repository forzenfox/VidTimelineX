import React from "react";
import type { Theme } from "../data/types";
import { Crown, Sword, Fish, Home, Award, Utensils, MessageSquare } from "lucide-react";

interface HeaderProps {
  theme: Theme;
  onThemeToggle: () => void;
}

const navItems = [
  { id: "hero", label: "首页", icon: Home },
  { id: "titles", label: "称号", icon: Award },
  { id: "canteen", label: "食堂", icon: Utensils },
  { id: "voices", label: "语录", icon: MessageSquare },
];

export const Header: React.FC<HeaderProps> = ({ theme, onThemeToggle }) => {
  const isBlood = theme === "blood";

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300"
      style={{
        background: isBlood ? "rgba(15, 15, 35, 0.95)" : "rgba(30, 27, 75, 0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: `1px solid ${isBlood ? "rgba(225, 29, 72, 0.3)" : "rgba(245, 158, 11, 0.3)"}`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div
              className="relative w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
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
              {/* Live badge */}
              <div className="absolute bottom-0 right-0 bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                LIVE
              </div>
            </div>
            <div>
              <h1
                className="text-lg font-black leading-tight"
                style={{
                  fontFamily: "Russo One, sans-serif",
                  color: isBlood ? "#E11D48" : "#F59E0B",
                }}
              >
                C皇驾到
              </h1>
              <p className="text-xs text-gray-400">斗鱼 123456</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                  style={{
                    color: "#94A3B8",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = isBlood ? "#E11D48" : "#F59E0B";
                    e.currentTarget.style.background = isBlood
                      ? "rgba(225, 29, 72, 0.1)"
                      : "rgba(245, 158, 11, 0.1)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = "#94A3B8";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

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
    </header>
  );
};

export default Header;
