import React, { useState, useRef, useMemo, useLayoutEffect, useEffect } from "react";
import { Zap, MessageCircle } from "lucide-react";
import { DanmakuGenerator, DanmakuMessage } from "@/shared/danmaku";
import danmakuData from "../data/danmaku.json";
import usersData from "../data/users.json";

interface SidebarDanmuProps {
  theme?: "tiger" | "sweet";
}

/**
 * 侧边弹幕组件 - 桌面端固定侧边栏 / 移动端底部抽屉
 * 参照 yuxiaoc 页面实现动态生成方案
 * @param theme - 主题类型：tiger（虎将）或 sweet（甜筒）
 */
const SidebarDanmu: React.FC<SidebarDanmuProps> = ({ theme = "tiger" }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [displayMessages, setDisplayMessages] = useState<DanmakuMessage[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  // 创建弹幕生成器（参考 yuxiaoc 实现）
  const generator = useMemo(() => {
    const textPool =
      theme === "tiger"
        ? [...danmakuData.tigerDanmaku, ...danmakuData.commonDanmaku]
        : [...danmakuData.sweetDanmaku, ...danmakuData.commonDanmaku];

    // 转换用户数据格式以匹配 DanmakuUser 类型
    const danmakuUsers = (
      usersData as Array<{ id: string; name: string; level: number; badge: string; avatar: string }>
    ).map(user => ({
      ...user,
      badge: [user.badge], // 将 string 转换为 string[]
    }));

    return new DanmakuGenerator({
      textPool: textPool,
      users: danmakuUsers,
      theme: theme,
      danmakuType: "sidebar",
      randomColor: true,
      randomSize: true,
    });
  }, [theme]);

  // 初始化弹幕消息（带时间戳）- 参考 yuxiaoc 实现
  const initialMessages = useMemo(() => {
    const now = new Date();
    const messages = generator.generateBatch({
      count: 12,
      type: "sidebar",
      theme: theme,
    });
    // 调整时间戳，使其按顺序递减
    return messages.map((msg, i) => ({
      ...msg,
      timestamp: new Date(now.getTime() - (12 - i) * 2000).toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    }));
  }, [generator, theme]);

  // 设置初始状态
  useEffect(() => {
    setDisplayMessages(initialMessages);
  }, [initialMessages]);

  // 智能滚动到最新消息 - 统一处理桌面端和移动端
  useLayoutEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [displayMessages]);

  // 定期添加新弹幕（动态生成）- 参考 yuxiaoc 实现
  useEffect(() => {
    const interval = setInterval(() => {
      const messages = generator.generateBatch({
        count: 1,
        type: "sidebar",
        theme: theme,
      });
      if (messages.length === 0) return;

      const newMessage = messages[0];
      setDisplayMessages(prev => {
        const updated = [...prev, newMessage];
        // 最多保留16条消息
        return updated.length > 16 ? updated.slice(-16) : updated;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [generator, theme]);

  const isTiger = theme === "tiger";

  /**
   * 渲染弹幕内容 - 参照 yuxiaoc 实现
   */
  const renderDanmakuContent = () => (
    <>
      {/* Header - 大小姐驾到 */}
      <div
        className="flex items-center gap-3 px-4 py-3 font-bold shrink-0 h-12"
        style={{
          background: isTiger
            ? "linear-gradient(135deg, rgba(230, 126, 34, 0.3), rgba(44, 62, 80, 0.2))"
            : "linear-gradient(135deg, rgba(244, 114, 156, 0.15), rgba(253, 230, 224, 0.08))",
          borderBottom: isTiger ? "2px solid #E67E22" : "2px solid #F4729C",
        }}
      >
        {/* 左侧图标 */}
        <div className={isTiger ? "text-[#BDC3C7]" : "text-[#F4729C]"}>{isTiger ? "🐯" : "🍦"}</div>

        {/* 公告文字 - 居中显示 */}
        <div className="flex-1 text-center">
          <div className={`text-sm font-bold ${isTiger ? "text-white" : "text-[#F4729C]"}`}>
            {isTiger ? "👸大小姐驾到，统统闪开！✨" : "👸小甜筒来咯，啾咪~✨"}
          </div>
        </div>

        {/* 右侧 LIVE 指示器 */}
        <div className="flex items-center gap-1">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: isTiger ? "#E67E22" : "#F4729C" }}
          />
          <span className={`text-xs ${isTiger ? "text-[#E67E22]" : "text-[#F4729C]"}`}>LIVE</span>
        </div>
      </div>

      {/* 弹幕互动区 - 参照 yuxiaoc 实现，简化布局 */}
      <div
        ref={contentRef}
        className={`flex-1 overflow-y-auto p-4 scrollbar-hide ${isTiger ? "bg-[#2C3E50] text-[#BDC3C7]" : "bg-[#FFFDF9]/95 text-[#F4729C]"} ${isTiger ? "border-t border-b border-[#E67E22]" : ""}`}
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

        {displayMessages.length === 0 ? (
          <div
            className={`flex flex-col items-center justify-center p-6 text-center h-full ${isTiger ? "text-[#7F8C8D]" : "text-[#F4729C]/70"}`}
          >
            <Zap
              size={48}
              className={`mb-4 opacity-20 ${isTiger ? "text-[#E67E22]" : "text-[#F4729C]"}`}
            />
            <p className="text-base font-medium">弹幕池空空如也~</p>
            <p className="text-xs mt-2">等待弹幕中...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayMessages.map((message, index) => (
              <div
                key={message.id}
                className="mb-3 rounded-lg px-3 py-2 transition-all duration-300"
                style={{
                  background:
                    index % 2 === 0
                      ? isTiger
                        ? "rgba(230, 126, 34, 0.1)"
                        : "rgba(244, 114, 156, 0.1)"
                      : isTiger
                        ? "rgba(230, 126, 34, 0.05)"
                        : "rgba(244, 114, 156, 0.05)",
                  border: isTiger
                    ? "1px solid rgba(230, 126, 34, 0.2)"
                    : "1px solid rgba(244, 114, 156, 0.2)",
                  animation: `fadeInUp 0.3s ease-out ${index === displayMessages.length - 1 ? 0 : index * 0.05}s both`,
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
                  <span className={`text-xs ${isTiger ? "text-[#7F8C8D]" : "text-[#F793B1]"}`}>
                    {message.timestamp}
                  </span>
                </div>

                {/* Message Text */}
                <div
                  className="text-sm leading-relaxed break-words"
                  style={{
                    color: isTiger ? "#BDC3C7" : "#F4729C",
                    fontSize:
                      message.size === "large"
                        ? "15px"
                        : message.size === "small"
                          ? "12px"
                          : "13px",
                    fontWeight: message.size === "large" ? 700 : 500,
                  }}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 底部 Footer - 参考 yuxiaoc 简洁设计 */}
      <div
        className={`p-3 text-center text-xs font-medium border-t ${
          isTiger
            ? "bg-[#2C3E50] border-[#E67E22] text-[#BDC3C7]"
            : "bg-[#FFFDF9] border-[#FDE6E0] text-[#F4729C]"
        }`}
      >
        <span className="opacity-80">{isTiger ? "🐯 威虎弹幕区 🐯" : "🍦 甜筒弹幕区 🍦"}</span>
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
          top: "117px", // 调整top值以匹配导航栏实际高度（头像64px + padding）
          bottom: 0,
          width: "320px",
          display: "none", // 默认隐藏，媒体查询控制显示
          flexDirection: "column",
          zIndex: 20,
          background: isTiger ? "#2C3E50" : "rgba(255, 253, 249, 0.98)",
          borderLeft: isTiger ? "3px solid #E67E22" : "3px solid #F4729C",
          boxShadow: isTiger
            ? "-5px 0 20px rgba(230, 126, 34, 0.3)"
            : "-5px 0 20px rgba(244, 114, 156, 0.25)",
        }}
      >
        {renderDanmakuContent()}
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
          background: isTiger
            ? "linear-gradient(135deg, #E67E22 0%, #D35400 100%)"
            : "linear-gradient(135deg, #F4729C 0%, #FDE6E0 100%)",
          boxShadow: isTiger
            ? "0 4px 15px rgba(230, 126, 34, 0.4)"
            : "0 4px 15px rgba(244, 114, 156, 0.4)",
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
            data-testid="danmaku-drawer-overlay"
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
            data-testid="danmaku-drawer"
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
              background: isTiger ? "#2C3E50" : "rgba(255, 253, 249, 0.98)",
              borderTop: isTiger ? "3px solid #E67E22" : "3px solid #F4729C",
              boxShadow: isTiger
                ? "0 -5px 20px rgba(230, 126, 34, 0.3)"
                : "0 -5px 20px rgba(244, 114, 156, 0.25)",
            }}
          >
            {/* 拖动条 - 点击可关闭 */}
            <div
              className="w-full h-6 flex items-center justify-center cursor-pointer shrink-0"
              onClick={() => setIsDrawerOpen(false)}
              style={{
                background: isTiger ? "#2C3E50" : "rgba(255, 253, 249, 0.98)",
              }}
            >
              <div
                className="w-12 h-1 rounded-full"
                style={{
                  backgroundColor: isTiger ? "rgba(230, 126, 34, 0.5)" : "rgba(244, 114, 156, 0.5)",
                }}
              />
            </div>
            {renderDanmakuContent()}
          </div>
        </>
      )}

      {/* 使用style标签添加响应式样式和动画 */}
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
        
        /* 弹幕入场动画 */
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

export default SidebarDanmu;
