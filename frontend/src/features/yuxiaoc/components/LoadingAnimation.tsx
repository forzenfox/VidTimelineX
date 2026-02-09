import React, { useState, useEffect } from "react";
import type { Theme } from "../data/types";

interface LoadingAnimationProps {
  onComplete: (theme: Theme) => void;
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsComplete(true);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleThemeSelect = (theme: Theme) => {
    onComplete(theme);
  };

  return (
    <div
      data-testid="loading-animation"
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #0F0F23 0%, #1E1B4B 100%)",
      }}
    >
      <div className="text-center">
        {/* C皇标题 */}
        <h1
          className="text-6xl font-black mb-8"
          style={{
            fontFamily: "Russo One, sans-serif",
            background: "linear-gradient(135deg, #E11D48 0%, #F59E0B 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 0 30px rgba(225, 29, 72, 0.5)",
          }}
        >
          C皇驾到
        </h1>

        {/* 血怒进度条 */}
        <div className="w-80 mx-auto mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-white font-bold">血怒值</span>
            <span className="text-red-500 font-bold">{progress}%</span>
          </div>
          <div
            data-testid="blood-rage-progress"
            className="h-4 rounded-full overflow-hidden"
            style={{ backgroundColor: "#1E1B4B" }}
          >
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #E11D48 0%, #F59E0B 100%)",
                boxShadow: "0 0 20px rgba(225, 29, 72, 0.8)",
              }}
            />
          </div>
        </div>

        {/* 加载文字 */}
        <p className="text-gray-400 mb-8">
          {progress < 100 ? "正在积攒血怒..." : "血怒已满！选择你的模式"}
        </p>

        {/* 主题选择按钮 */}
        {isComplete && (
          <div className="flex gap-4 justify-center">
            <button
              data-testid="theme-blood"
              onClick={() => handleThemeSelect("blood")}
              className="px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #E11D48 0%, #DC2626 100%)",
                boxShadow: "0 0 20px rgba(225, 29, 72, 0.5)",
              }}
            >
              <span className="block text-2xl mb-1">血怒模式</span>
              <span className="text-sm opacity-80">无情铁手，血Carry</span>
            </button>

            <button
              data-testid="theme-mix"
              onClick={() => handleThemeSelect("mix")}
              className="px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #F59E0B 0%, #3B82F6 100%)",
                boxShadow: "0 0 20px rgba(245, 158, 11, 0.5)",
              }}
            >
              <span className="block text-2xl mb-1">混躺模式</span>
              <span className="text-sm opacity-80">混与躺轮回不止</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingAnimation;
