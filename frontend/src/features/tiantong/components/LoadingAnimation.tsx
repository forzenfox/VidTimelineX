import React from "react";

const LoadingAnimation = () => {
  return (
    <div
      data-testid="loading-animation"
      className="flex items-center justify-center min-h-screen bg-background"
    >
      <div className="relative w-24 h-24">
        {/* 金属光泽流动效果 - 深橙→亮橙渐变 */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#E67E22] via-[#F39C12] to-[#E67E22] animate-shimmer opacity-70 mask-image: radial-gradient(circle at center, transparent 20%, black 70%) border-radius: 50% filter: brightness(1.2)" />

        {/* 旋转虎头 - 1秒/圈 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-16 h-16 animate-spin text-[#E67E22]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* 虎头SVG路径 - 简化版 */}
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
            <circle cx="8" cy="14" r="1" />
            <circle cx="16" cy="14" r="1" />
            <path d="M8 8h8" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
