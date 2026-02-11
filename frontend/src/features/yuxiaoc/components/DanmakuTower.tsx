import React, { useEffect, useState, useMemo, useRef, useLayoutEffect } from "react";
import type { Theme } from "../data/types";
import danmakuData from "../data/danmaku.json";
import users from "../data/users.json";
import { getDanmakuColor, getCommonDanmakuColor } from "../data/danmakuColors";
import { MessageSquare, Users, X, MessageCircle } from "lucide-react";

interface DanmakuTowerProps {
  theme: Theme;
}

interface DanmakuMessage {
  id: string;
  text: string;
  color: string;
  size: "small" | "medium" | "large";
  userId: string;
  userName: string;
  userAvatar: string;
  timestamp: string;
}

/**
 * 弹幕天梯组件 - 右侧固定侧边栏样式（桌面端/平板端）/ 底部抽屉（移动端）
 */
export const DanmakuTower: React.FC<DanmakuTowerProps> = ({ theme }) => {
  const [displayMessages, setDisplayMessages] = useState<DanmakuMessage[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const isBlood = theme === "blood";

  // 主题配色配置
  const themeColors = useMemo(() => {
    if (isBlood) {
      return {
        background: "linear-gradient(to left, rgba(15, 15, 35, 0.98), rgba(30, 27, 75, 0.95))",
        textPrimary: "#E2E8F0",
        textSecondary: "#94A3B8",
      };
    }
    // 混躺模式使用新的亮色主题配色
    return {
      background: "linear-gradient(to left, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.95))",
      textPrimary: "#0F172A",
      textSecondary: "#334155",
    };
  }, [isBlood]);

  // 用户列表（直接从 JSON 导入）
  const usersList = useMemo(() => users, []);

  // 获取当前主题的弹幕数据（主题专属 + 公共弹幕）
  const danmakuPool = useMemo(() => {
    const themeDanmaku = theme === "blood" ? danmakuData.bloodDanmaku : danmakuData.mixDanmaku;
    const commonDanmaku = danmakuData.commonDanmaku || [];
    // 合并主题专属弹幕和公共弹幕
    return [...themeDanmaku, ...commonDanmaku];
  }, [theme]);

  // 辅助函数：根据文本长度分配大小
  const getSizeByTextLength = (text: string): "small" | "medium" | "large" => {
    const length = text.length;
    if (length <= 3) return "large";
    if (length <= 8) return "medium";
    return "small";
  };

  // 辅助函数：获取弹幕颜色
  const getMessageColor = (text: string, index: number): string => {
    const themeDanmaku = theme === "blood" ? danmakuData.bloodDanmaku : danmakuData.mixDanmaku;
    const isCommon = index >= themeDanmaku.length;
    return isCommon ? getCommonDanmakuColor() : getDanmakuColor(theme);
  };

  // 初始化弹幕消息
  const initialMessages = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 12 }, (_, i) => {
      const text = danmakuPool[i % danmakuPool.length];
      const user = usersList[i % usersList.length];
      const size = getSizeByTextLength(text);
      const color = getMessageColor(text, i);

      return {
        id: `initial-${i}`,
        text: text || "弹幕",
        color: color || (isBlood ? "#E11D48" : "#F59E0B"),
        size,
        userId: user?.id || "user1",
        userName: user?.name || "用户",
        userAvatar: user?.avatar || "",
        timestamp: new Date(now.getTime() - (12 - i) * 2000).toLocaleTimeString("zh-CN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      };
    });
  }, [danmakuPool, usersList, isBlood, theme]);

  useEffect(() => {
    setDisplayMessages(initialMessages);
  }, [initialMessages]);

  // 智能滚动到最新消息
  useLayoutEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [displayMessages]);

  // 定期添加新弹幕
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * danmakuPool.length);
      const randomText = danmakuPool[randomIndex];
      const randomUser = usersList[Math.floor(Math.random() * usersList.length)];

      if (!randomText || !randomUser) return;

      const size = getSizeByTextLength(randomText);
      const color = getMessageColor(randomText, randomIndex);

      const newMessage: DanmakuMessage = {
        id: `msg-${Date.now()}-${Math.random()}`,
        text: randomText,
        color,
        size,
        userId: randomUser.id,
        userName: randomUser.name,
        userAvatar: randomUser.avatar,
        timestamp: new Date().toLocaleTimeString("zh-CN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      };

      setDisplayMessages(prev => {
        const updated = [...prev, newMessage];
        return updated.length > 16 ? updated.slice(-16) : updated;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [danmakuPool, usersList, theme]);

  // 弹幕内容渲染
  const renderDanmakuContent = (isInDrawer: boolean) => (
    <>
      {/* Header - 聊天室标题 */}
      <div
        className="flex items-center gap-3 px-4 py-3 font-bold"
        style={{
          background: isBlood
            ? "linear-gradient(135deg, rgba(225, 29, 72, 0.3), rgba(220, 38, 38, 0.2))"
            : "linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(59, 130, 246, 0.08))",
          borderBottom: isBlood ? "2px solid #E11D48" : "2px solid #F59E0B",
          color: isBlood ? "#E11D48" : "#F59E0B",
        }}
      >
        <MessageSquare className="w-5 h-5" />
        <div className="flex-1">
          <div className="text-sm">弹幕聊天室</div>
          <div className="text-xs opacity-70 flex items-center gap-1">
            <Users className="w-3 h-3" />
            {usersList.length} 人在线
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: isBlood ? "#E11D48" : "#F59E0B" }}
          />
          <span className="text-xs">LIVE</span>
        </div>
        {/* 移动端关闭按钮 */}
        {isInDrawer && (
          <button
            onClick={() => setIsDrawerOpen(false)}
            aria-label="关闭弹幕"
            className="p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Danmaku Content - 弹幕内容区 */}
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto p-3 scrollbar-hide"
        style={{
          scrollBehavior: "smooth",
          overflowX: "hidden",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {displayMessages.map((message, index) => (
          <div
            key={message.id}
            className="mb-3 rounded-lg px-3 py-2 transition-all duration-300"
            style={{
              background:
                index % 2 === 0
                  ? isBlood
                    ? "rgba(225, 29, 72, 0.1)"
                    : "#F8FAFC"
                  : isBlood
                    ? "rgba(220, 38, 38, 0.08)"
                    : "#F1F5F9",
              border: isBlood
                ? "1px solid rgba(225, 29, 72, 0.2)"
                : "1px solid rgba(245, 158, 11, 0.3)",
              animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`,
            }}
          >
            {/* User Info Row */}
            <div className="flex items-center gap-2 mb-1.5">
              <div
                className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 border"
                style={{
                  borderColor: message.color,
                  boxShadow: `0 0 8px ${message.color}40`,
                }}
              >
                <img
                  src={message.userAvatar}
                  alt={message.userName}
                  className="w-full h-full object-cover"
                />
              </div>
              <span
                className="text-xs font-medium truncate flex-1"
                style={{ color: message.color }}
              >
                {message.userName}
              </span>
              <span className="text-[10px] text-gray-500">{message.timestamp}</span>
            </div>

            {/* Message Text */}
            <div
              className="text-sm leading-relaxed break-words"
              style={{
                color: themeColors.textPrimary,
                fontSize:
                  message.size === "large" ? "15px" : message.size === "small" ? "12px" : "13px",
                fontWeight: message.size === "large" ? 700 : 500,
              }}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        className="px-4 py-2 text-center text-xs"
        style={{
          background: isBlood ? "rgba(225, 29, 72, 0.1)" : "rgba(245, 158, 11, 0.08)",
          borderTop: isBlood
            ? "1px solid rgba(225, 29, 72, 0.3)"
            : "1px solid rgba(245, 158, 11, 0.3)",
          color: isBlood ? "rgba(225, 29, 72, 0.8)" : "rgba(245, 158, 6, 0.8)",
        }}
      >
        {isBlood ? "🔥 血怒弹幕区 🔥" : "😴 混躺弹幕区 😴"}
      </div>
    </>
  );

  return (
    <>
      {/* 桌面端/平板端：右侧固定侧边栏 - 使用CSS媒体查询控制显示 */}
      <div
        className="danmaku-sidebar"
        style={{
          position: "fixed",
          right: 0,
          top: "64px",
          bottom: 0,
          width: "320px",
          display: "none", // 默认隐藏，媒体查询控制显示
          flexDirection: "column",
          zIndex: 20,
          background: themeColors.background,
          borderLeft: isBlood ? "3px solid #E11D48" : "3px solid #F59E0B",
          boxShadow: isBlood
            ? "-5px 0 20px rgba(225, 29, 72, 0.3)"
            : "-5px 0 20px rgba(245, 158, 11, 0.25)",
        }}
      >
        {renderDanmakuContent(false)}
      </div>

      {/* 移动端：浮动按钮 - 使用CSS媒体查询控制显示 */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        aria-label="打开弹幕"
        className="danmaku-mobile-button"
        style={{
          position: "fixed",
          right: "16px",
          bottom: "96px",
          zIndex: 30,
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          display: "none", // 默认隐藏，媒体查询控制显示
          alignItems: "center",
          justifyContent: "center",
          background: isBlood
            ? "linear-gradient(135deg, #E11D48 0%, #DC2626 100%)"
            : "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
          boxShadow: isBlood
            ? "0 4px 15px rgba(225, 29, 72, 0.4)"
            : "0 4px 15px rgba(245, 158, 11, 0.4)",
          border: "none",
          cursor: "pointer",
        }}
      >
        <MessageCircle style={{ width: "24px", height: "24px", color: "white" }} />
      </button>

      {/* 移动端抽屉 */}
      {isDrawerOpen && (
        <>
          {/* 遮罩层 */}
          <div
            data-testid="danmaku-drawer"
            className="danmaku-drawer-overlay"
            onClick={() => setIsDrawerOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 40,
            }}
          />
          {/* 抽屉内容 */}
          <div
            className="danmaku-drawer"
            style={{
              position: "fixed",
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 50,
              height: "60vh",
              display: "flex",
              flexDirection: "column",
              borderRadius: "16px 16px 0 0",
              overflow: "hidden",
              background: themeColors.background,
              borderTop: isBlood ? "3px solid #E11D48" : "3px solid #F59E0B",
              boxShadow: isBlood
                ? "0 -5px 20px rgba(225, 29, 72, 0.3)"
                : "0 -5px 20px rgba(245, 158, 11, 0.25)",
            }}
          >
            {/* 拖动条 */}
            <div
              className="w-full h-6 flex items-center justify-center cursor-pointer"
              onClick={() => setIsDrawerOpen(false)}
            >
              <div
                className="w-12 h-1 rounded-full"
                style={{
                  backgroundColor: isBlood ? "rgba(225, 29, 72, 0.5)" : "rgba(245, 158, 11, 0.5)",
                }}
              />
            </div>
            {renderDanmakuContent(true)}
          </div>
        </>
      )}

      {/* 使用style标签添加响应式样式 */}
      <style>{`
        /* 桌面端/平板端（>=768px）：显示侧边栏，隐藏移动端按钮 */
        @media (min-width: 768px) {
          .danmaku-sidebar {
            display: flex !important;
          }
          .danmaku-mobile-button {
            display: none !important;
          }
        }
        
        /* 移动端（<768px）：隐藏侧边栏，显示移动端按钮 */
        @media (max-width: 767px) {
          .danmaku-sidebar {
            display: none !important;
          }
          .danmaku-mobile-button {
            display: flex !important;
          }
        }
        
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
    </>
  );
};

export default DanmakuTower;
