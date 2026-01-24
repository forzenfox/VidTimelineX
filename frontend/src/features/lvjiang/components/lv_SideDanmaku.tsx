import { useEffect, useState, useMemo } from "react";
import { dongzhuDanmaku, kaigeDanmaku } from "../data/lv_danmaku";

interface SideDanmakuProps {
  theme: "dongzhu" | "kaige";
}

interface DanmakuMessage {
  id: string;
  text: string;
  timestamp: string;
}

export function SideDanmaku({ theme }: SideDanmakuProps) {
  const pool = useMemo(() => (theme === "dongzhu" ? dongzhuDanmaku : kaigeDanmaku), [theme]);

  const initialMessages = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      // eslint-disable-next-line react-hooks/purity
      id: `msg-${Date.now()}-${i}`,
      // eslint-disable-next-line react-hooks/purity
      text: pool[Math.floor(Math.random() * pool.length)],
      // eslint-disable-next-line react-hooks/purity
      timestamp: new Date(Date.now() - (50 - i) * 1000).toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    }));
  }, [pool]);

  const [messages, setMessages] = useState<DanmakuMessage[]>(initialMessages);
  const [displayMessages, setDisplayMessages] = useState<DanmakuMessage[]>(
    initialMessages.slice(-15)
  );

  // 持续添加新弹幕
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

        setMessages(prev => {
          const updated = [...prev, newMessage];
          if (updated.length > 100) {
            return updated.slice(-100);
          }
          return updated;
        });

        setDisplayMessages(prev => {
          const updated = [...prev, newMessage];
          if (updated.length > 15) {
            return updated.slice(-15);
          }
          return updated;
        });
      },
      2000 + Math.random() * 2000
    );

    return () => clearInterval(interval);
  }, [pool]);

  return (
    <div
      className="fixed right-0 top-0 bottom-0 w-80 flex flex-col theme-transition"
      style={{
        background:
          theme === "dongzhu"
            ? "linear-gradient(to left, rgba(255, 254, 247, 0.95), rgba(255, 254, 247, 0.85))"
            : "linear-gradient(to left, rgba(22, 33, 62, 0.95), rgba(22, 33, 62, 0.85))",
        borderLeft: theme === "dongzhu" ? "3px solid #AED6F1" : "3px solid #E74C3C",
        boxShadow:
          theme === "dongzhu"
            ? "-5px 0 15px rgba(93, 173, 226, 0.2)"
            : "-5px 0 15px rgba(231, 76, 60, 0.3)",
        zIndex: 20,
      }}
    >
      {/* 弹幕区头部 - 模拟斗鱼样式 */}
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
      </div>

      {/* 弹幕滚动区域 */}
      <div className="flex-1 overflow-hidden flex flex-col-reverse p-2 gap-2">
        {displayMessages.map((msg, index) => (
          <div
            key={msg.id}
            className="theme-transition rounded-lg px-3 py-2"
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
              animation: "danmaku-vertical 0.5s ease-out",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* 装饰图案 */}
            {theme === "dongzhu" && (
              <div
                className="absolute top-1 right-1 text-xs opacity-20"
                style={{ color: "#5DADE2" }}
              >
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

            {/* 时间戳 */}
            <div
              className="text-xs mb-1 opacity-60"
              style={{
                color: theme === "dongzhu" ? "#85929E" : "#BDC3C7",
              }}
            >
              {msg.timestamp}
            </div>

            {/* 弹幕内容 */}
            <div
              className="font-medium"
              style={{
                color: theme === "dongzhu" ? "#5D6D7E" : "#ECF0F1",
                fontSize: "14px",
                lineHeight: "1.4",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* 底部装饰 */}
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
    </div>
  );
}
