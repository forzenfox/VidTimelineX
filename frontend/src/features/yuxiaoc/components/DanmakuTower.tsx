import React, { useEffect, useState } from "react";
import type { Theme, Danmaku } from "../data/types";
import { danmakuList } from "../data/videos";
import { MessageSquare } from "lucide-react";

interface DanmakuTowerProps {
  theme: Theme;
}

export const DanmakuTower: React.FC<DanmakuTowerProps> = ({ theme }) => {
  const [danmaku, setDanmaku] = useState<Danmaku[]>(() => danmakuList.slice(0, 8));
  const isBlood = theme === "blood";

  useEffect(() => {
    // Add new danmaku periodically
    const interval = setInterval(() => {
      const randomDanmaku = danmakuList[Math.floor(Math.random() * danmakuList.length)];
      setDanmaku(prev => {
        const newDanmaku = [...prev, { ...randomDanmaku, id: `${randomDanmaku.id}-${Date.now()}` }];
        if (newDanmaku.length > 12) {
          return newDanmaku.slice(newDanmaku.length - 12);
        }
        return newDanmaku;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const getSizeClass = (size: string) => {
    switch (size) {
      case "small":
        return "text-sm px-3 py-1.5";
      case "large":
        return "text-lg px-5 py-2.5";
      default:
        return "text-base px-4 py-2";
    }
  };

  return (
    <section
      className="py-20 px-4 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #1E1B4B 0%, #0F0F23 100%)",
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
            弹幕天梯
          </h2>
          <p className="text-gray-400 text-lg">粉丝们的实时吐槽</p>
        </div>

        {/* Danmaku Display */}
        <div
          className="relative rounded-3xl overflow-hidden p-8"
          style={{
            background:
              "linear-gradient(135deg, rgba(15, 15, 35, 0.9) 0%, rgba(30, 27, 75, 0.8) 100%)",
            border: `2px solid ${isBlood ? "rgba(225, 29, 72, 0.3)" : "rgba(245, 158, 11, 0.3)"}`,
            boxShadow: isBlood
              ? "0 0 60px rgba(225, 29, 72, 0.15), inset 0 0 60px rgba(225, 29, 72, 0.05)"
              : "0 0 60px rgba(245, 158, 11, 0.15), inset 0 0 60px rgba(245, 158, 11, 0.05)",
          }}
        >
          {/* Background Grid */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(to right, ${isBlood ? "#E11D48" : "#F59E0B"} 1px, transparent 1px),
                linear-gradient(to bottom, ${isBlood ? "#E11D48" : "#F59E0B"} 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <MessageSquare
                className="w-5 h-5"
                style={{ color: isBlood ? "#E11D48" : "#F59E0B" }}
              />
              <span className="text-sm text-gray-400">实时弹幕</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: isBlood ? "#E11D48" : "#F59E0B" }}
              />
              <span className="text-xs text-gray-500">LIVE</span>
            </div>
          </div>

          {/* Danmaku Items */}
          <div className="relative z-10 space-y-3 min-h-[300px]">
            {danmaku.map((item, index) => (
              <div
                key={item.id}
                className={`inline-block rounded-full font-bold transition-all duration-500 ${getSizeClass(item.size)}`}
                style={{
                  background: `${item.color}15`,
                  color: item.color,
                  border: `1px solid ${item.color}40`,
                  marginLeft: `${(index % 4) * 80 + 20}px`,
                  boxShadow: `0 0 15px ${item.color}20`,
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                {item.text}
              </div>
            ))}
          </div>

          {/* Glow Effect */}
          <div
            className="absolute inset-0 pointer-events-none rounded-3xl"
            style={{
              boxShadow: `inset 0 0 100px ${isBlood ? "rgba(225, 29, 72, 0.1)" : "rgba(245, 158, 11, 0.1)"}`,
            }}
          />
        </div>

        {/* Stats */}
        <div className="mt-8 flex justify-center gap-8">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: isBlood ? "#E11D48" : "#F59E0B" }}>
              {danmakuList.length}+
            </div>
            <div className="text-sm text-gray-500">经典弹幕</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: isBlood ? "#E11D48" : "#F59E0B" }}>
              实时
            </div>
            <div className="text-sm text-gray-500">滚动更新</div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default DanmakuTower;
