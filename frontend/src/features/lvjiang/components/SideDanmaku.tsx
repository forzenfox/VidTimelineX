import React, { useEffect, useState, useMemo, useRef, useLayoutEffect } from "react";
import { dongzhuDanmaku, kaigeDanmaku } from "../data";
import { MessageCircle, X } from "lucide-react";

interface SideDanmakuProps {
  theme: "dongzhu" | "kaige";
}

interface DanmakuMessage {
  id: string;
  text: string;
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
      className={`theme-transition rounded-lg px-3 py-2 ${theme === "dongzhu" ? "border-1" : "border-1"}`}
      style={{
        background:
          theme === "dongzhu"
            ? index % 2 === 0
              ? "rgba(93, 173, 226, 0.15)"
              : "rgba(255, 254, 247, 0.4)"
            : index % 2 === 0
              ? "rgba(44, 62, 80, 0.4)"
              : "rgba(52, 73, 94, 0.3)",
        border:
          theme === "dongzhu"
            ? "1px solid rgba(174, 214, 241, 0.5)"
            : "1px solid rgba(231, 76, 60, 0.3)",
        borderRadius: theme === "dongzhu" ? "12px" : "4px",
        position: "relative",
        minHeight: "40px",
        height: "auto",
        padding: "8px 12px",
        boxSizing: "border-box",
        marginBottom: "8px",
      }}
    >
      {theme === "dongzhu" && (
        <div className="absolute top-1 right-1 text-xs opacity-20" style={{ color: "#5DADE2" }}>
          🐾
        </div>
      )}
      {theme === "kaige" && (
        <div
          className="absolute top-0 right-0 w-8 h-8 opacity-10"
          style={{
            background:
              "linear-gradient(135deg, transparent 40%, #E74C3C 40%, #E74C3C 60%, transparent 60%)",
          }}
        />
      )}

      <div
        className="font-medium"
        style={{
          color: theme === "dongzhu" ? "#5D6D7E" : "#ECF0F1",
          fontSize: "14px",
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

  const initialMessages = useMemo(() => {
    const seed = 12345; // 固定种子值确保纯度
    const now = new Date();
    return Array.from({ length: 16 }, (_, i) => ({
      id: `msg-${seed}-${i}`,
      text: pool[i % pool.length], // 使用索引确保一致性
      timestamp: new Date(now.getTime() - (16 - i) * 1000).toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    }));
  }, [pool]);

  const [displayMessages, setDisplayMessages] = useState<DanmakuMessage[]>(initialMessages);

  // 智能滚动到最新消息
  useLayoutEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [displayMessages]);

  useEffect(() => {
    const interval = setInterval(
      () => {
        const newMessage: DanmakuMessage = {
          id: `msg-${Date.now()}-${Math.random()}`,
          text: pool[Math.floor(Math.random() * pool.length)],
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
      },
      2000 + Math.random() * 2000
    );

    return () => clearInterval(interval);
  }, [pool]);

  // 弹幕内容渲染
  const renderDanmakuContent = (isInDrawer: boolean) => (
    <>
      {/* Header - 聊天室标题 */}
      <div
        className="flex items-center gap-2 px-4 py-3 font-bold theme-transition"
        style={{
          background:
            theme === "dongzhu"
              ? "linear-gradient(135deg, #AED6F1, #D4E8F0)"
              : "linear-gradient(135deg, #2C3E50, #34495E)",
          borderBottom: theme === "dongzhu" ? "2px solid #5DADE2" : "2px solid #E74C3C",
          color: theme === "dongzhu" ? "#5D6D7E" : "#ECF0F1",
        }}
      >
        {theme === "dongzhu" ? (
          <>
            <div className="text-2xl">🐷</div>
            <div className="flex-1">
              <div className="text-sm">聊天室</div>
              <div className="text-xs opacity-70">家猪·洞主专区</div>
            </div>
          </>
        ) : (
          <>
            <div className="text-2xl">🐗</div>
            <div className="flex-1">
              <div className="text-sm">聊天室</div>
              <div className="text-xs opacity-70">野猪·凯哥专区</div>
            </div>
          </>
        )}
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
        className="flex-1 overflow-y-auto p-2 scrollbar-hide side-danmaku-content"
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
                  backgroundColor: theme === "dongzhu" ? "rgba(93, 173, 226, 0.5)" : "rgba(231, 76, 60, 0.5)",
                }}
              />
            </div>
            {renderDanmakuContent(true)}
          </div>
        </>
      )}

      {/* 使用style标签添加响应式样式 */}
      <style>{`
        /* 桌面端/平板端（>=1024px）：显示侧边栏，隐藏移动端按钮 */
        @media (min-width: 1024px) {
          .side-danmaku-sidebar {
            display: flex !important;
          }
          .side-danmaku-mobile-btn {
            display: none !important;
          }
        }
        
        /* 移动端（<1024px）：隐藏侧边栏，显示移动端按钮 */
        @media (max-width: 1023px) {
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
