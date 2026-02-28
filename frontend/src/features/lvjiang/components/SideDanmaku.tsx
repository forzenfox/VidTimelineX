import React, { useEffect, useState, useMemo, useRef, useLayoutEffect } from "react";
import { dongzhuDanmaku, kaigeDanmaku, users } from "../data";
import {
  getDanmakuColor,
  getSizeByTextLength,
} from "../data/danmakuColors";
import { MessageCircle, X, MessageSquare } from "lucide-react";

interface SideDanmakuProps {
  theme: "dongzhu" | "kaige";
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

interface DanmakuItemProps {
  message: DanmakuMessage;
  theme: "dongzhu" | "kaige";
  index: number;
}

const DanmakuItem = React.memo(({ message, theme, index }: DanmakuItemProps) => {
  return (
    <div
      key={message.id}
      className="danmaku-item rounded-lg px-3 py-2 theme-transition"
      style={{
        background:
          index % 2 === 0
            ? theme === "dongzhu"
              ? "rgba(93, 173, 226, 0.15)"
              : "rgba(44, 62, 80, 0.4)"
            : theme === "dongzhu"
              ? "rgba(255, 254, 247, 0.4)"
              : "rgba(52, 73, 94, 0.3)",
        border:
          theme === "dongzhu"
            ? `1px solid ${message.color}40`
            : `1px solid ${message.color}30`,
        borderRadius: theme === "dongzhu" ? "12px" : "4px",
        position: "relative",
        minHeight: "40px",
        height: "auto",
        padding: "8px 12px",
        boxSizing: "border-box",
        marginBottom: "8px",
        animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`,
      }}
    >
      {/* 主题装饰元素 */}
      {theme === "dongzhu" && (
        <div className="absolute top-1 right-1 text-xs opacity-20" style={{ color: "#5DADE2" }}>
          🐾
        </div>
      )}
      {theme === "kaige" && (
        <div
          className="absolute top-0 right-0 w-8 h-8 opacity-10"
          style={{
            background: `linear-gradient(135deg, transparent 40%, ${message.color} 40%, ${message.color} 60%, transparent 60%)`,
          }}
        />
      )}

      {/* 用户信息行 */}
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
        <span className="text-xs text-gray-500">{message.timestamp}</span>
      </div>

      {/* 弹幕文本 */}
      <div
        className="leading-relaxed break-words"
        style={{
          color: theme === "dongzhu" ? "#5D6D7E" : "#ECF0F1",
          fontSize:
            message.size === "large" ? "15px" : message.size === "small" ? "12px" : "13px",
          fontWeight: message.size === "large" ? 700 : 500,
          lineHeight: "1.4",
          wordWrap: "break-word",
          whiteSpace: "normal",
        }}
      >
        {message.text}
      </div>
    </div>
  );
});

DanmakuItem.displayName = "DanmakuItem";

export function SideDanmaku({ theme }: SideDanmakuProps) {
  const pool = useMemo(() => (theme === "dongzhu" ? dongzhuDanmaku : kaigeDanmaku), [theme]);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [displayMessages, setDisplayMessages] = useState<DanmakuMessage[]>([]);

  // 用户列表
  const usersList = useMemo(() => users, []);

  // 初始化弹幕消息
  const initialMessages = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 12 }, (_, i) => {
      const text = pool[i % pool.length];
      const user = usersList[i % usersList.length];
      const size = getSizeByTextLength(text);
      const color = getDanmakuColor(theme);

      return {
        id: `initial-${i}`,
        text: text || "弹幕",
        color: color,
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
  }, [pool, usersList, theme]);

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
      const randomIndex = Math.floor(Math.random() * pool.length);
      const randomText = pool[randomIndex];
      const randomUser = usersList[Math.floor(Math.random() * usersList.length)];

      if (!randomText || !randomUser) return;

      const size = getSizeByTextLength(randomText);
      const color = getDanmakuColor(theme);

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
  }, [pool, usersList, theme]);

  // 弹幕内容渲染
  const renderDanmakuContent = (isInDrawer: boolean) => (
    <>
      {/* Header - 聊天室标题 */}
      <div
        className="flex items-center gap-3 px-4 py-3 font-bold theme-transition"
        style={{
          background:
            theme === "dongzhu"
              ? "linear-gradient(135deg, #AED6F1, #D4E8F0)"
              : "linear-gradient(135deg, #2C3E50, #34495E)",
          borderBottom: theme === "dongzhu" ? "2px solid #5DADE2" : "2px solid #E74C3C",
          color: theme === "dongzhu" ? "#5D6D7E" : "#ECF0F1",
        }}
      >
        <MessageSquare className="w-5 h-5" />
        <div className="flex-1">
          <div className="text-sm">聊天室</div>
          <div className="text-xs opacity-70">
            {theme === "dongzhu" ? "家猪·洞主专区" : "野猪·凯哥专区"}
          </div>
        </div>
        {/* LIVE 状态指示器 */}
        <div className="flex items-center gap-1">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: theme === "dongzhu" ? "#5DADE2" : "#E74C3C" }}
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
        className="flex-1 overflow-y-auto p-3 scrollbar-hide side-danmaku-content"
        style={{
          scrollBehavior: "smooth",
          overflowX: "hidden",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <style>
          {`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
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
            
            .danmaku-item {
              animation: fadeInUp 0.3s ease-out both;
            }
          `}
        </style>
        {displayMessages.map((message, index) => (
          <DanmakuItem key={message.id} message={message} theme={theme} index={index} />
        ))}
      </div>

      {/* Footer */}
      <div
        className="px-4 py-2 text-center text-xs opacity-50 theme-transition"
        style={{
          background: theme === "dongzhu" ? "rgba(93, 173, 226, 0.15)" : "rgba(44, 62, 80, 0.4)",
          borderTop: theme === "dongzhu" ? "1px solid #AED6F1" : "1px solid #E74C3C",
          color: theme === "dongzhu" ? "#85929E" : "#BDC3C7",
        }}
      >
        {theme === "dongzhu" ? "软萌弹幕区 🐷" : "硬核弹幕区 🐗"}
      </div>
    </>
  );

  return (
    <>
      {/* 桌面端/平板端：右侧固定侧边栏 */}
      <div
        className="side-danmaku-sidebar"
        style={{
          position: "fixed",
          right: 0,
          top: "160px",
          bottom: 0,
          width: "320px",
          display: "none", // 默认隐藏，媒体查询控制显示
          flexDirection: "column",
          zIndex: 20,
          background:
            theme === "dongzhu"
              ? "linear-gradient(to left, rgba(255, 254, 247, 0.95), rgba(255, 254, 247, 0.85))"
              : "linear-gradient(to left, rgba(22, 33, 62, 0.95), rgba(22, 33, 62, 0.85))",
          borderLeft: theme === "dongzhu" ? "3px solid #AED6F1" : "3px solid #E74C3C",
          boxShadow:
            theme === "dongzhu"
              ? "-5px 0 15px rgba(93, 173, 226, 0.2)"
              : "-5px 0 15px rgba(231, 76, 60, 0.3)",
        }}
      >
        {renderDanmakuContent(false)}
      </div>

      {/* 移动端：浮动按钮 */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        aria-label="打开弹幕"
        className="side-danmaku-mobile-btn"
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
          background:
            theme === "dongzhu"
              ? "linear-gradient(135deg, #5DADE2 0%, #3498DB 100%)"
              : "linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)",
          boxShadow:
            theme === "dongzhu"
              ? "0 4px 15px rgba(93, 173, 226, 0.4)"
              : "0 4px 15px rgba(231, 76, 60, 0.4)",
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
            className="side-danmaku-drawer-overlay"
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
            className="side-danmaku-drawer"
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
              background:
                theme === "dongzhu"
                  ? "linear-gradient(to top, rgba(255, 254, 247, 0.98), rgba(255, 254, 247, 0.95))"
                  : "linear-gradient(to top, rgba(22, 33, 62, 0.98), rgba(22, 33, 62, 0.95))",
              borderTop: theme === "dongzhu" ? "3px solid #AED6F1" : "3px solid #E74C3C",
              boxShadow:
                theme === "dongzhu"
                  ? "0 -5px 20px rgba(93, 173, 226, 0.3)"
                  : "0 -5px 20px rgba(231, 76, 60, 0.3)",
            }}
          >
            {/* 拖动条 */}
            <div
              className="side-danmaku-drag-handle w-full h-6 flex items-center justify-center cursor-pointer"
              onClick={() => setIsDrawerOpen(false)}
            >
              <div
                className="w-12 h-1 rounded-full"
                style={{
                  backgroundColor:
                    theme === "dongzhu" ? "rgba(93, 173, 226, 0.5)" : "rgba(231, 76, 60, 0.5)",
                }}
              />
            </div>
            {renderDanmakuContent(true)}
          </div>
        </>
      )}

      {/* 使用 style 标签添加响应式样式 */}
      <style>{`
        /* 桌面端/平板端（>=768px）：显示侧边栏，隐藏移动端按钮 */
        @media (min-width: 768px) {
          .side-danmaku-sidebar {
            display: flex !important;
          }
          .side-danmaku-mobile-btn {
            display: none !important;
          }
        }
        
        /* 移动端（<768px）：隐藏侧边栏，显示移动端按钮 */
        @media (max-width: 767px) {
          .side-danmaku-sidebar {
            display: none !important;
          }
          .side-danmaku-mobile-btn {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}
