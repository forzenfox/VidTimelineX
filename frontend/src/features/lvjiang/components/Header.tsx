import { Sun, Moon, Video, Tv, MessageSquare } from "lucide-react";

interface HeaderProps {
  theme: "dongzhu" | "kaige";
  onThemeToggle: () => void;
}

/**
 * 驴酱模块头部组件
 * 支持移动端响应式布局，在移动端隐藏主播选择卡片和外部链接
 * @param theme - 当前主题（洞主/凯哥）
 * @param onThemeToggle - 主题切换回调函数
 */
export function Header({ theme, onThemeToggle }: HeaderProps) {
  return (
    <header
      data-testid="lvjiang-header"
      className="sticky top-0 z-40 theme-transition"
      style={{
        background:
          theme === "dongzhu"
            ? "linear-gradient(135deg, rgba(255, 254, 247, 0.95), rgba(174, 214, 241, 0.95))"
            : "linear-gradient(135deg, rgba(22, 33, 62, 0.95), rgba(26, 26, 46, 0.95))",
        backdropFilter: "blur(10px)",
        borderBottom: theme === "dongzhu" ? "3px solid #AED6F1" : "3px solid #E74C3C",
        boxShadow:
          theme === "dongzhu"
            ? "0 4px 20px rgba(93, 173, 226, 0.3)"
            : "0 4px 20px rgba(231, 76, 60, 0.4)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo区域 - 始终可见 */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="text-3xl md:text-5xl font-black gradient-text">驴酱</div>
            <div
              className="hidden sm:block px-3 md:px-4 py-1.5 md:py-2 rounded-full font-bold text-xs md:text-sm"
              style={{
                background: "rgba(255, 215, 0, 0.2)",
                border: "2px solid #FFD700",
                color: "#B8860B",
              }}
            >
              🐴 发抛驴
            </div>
          </div>

          {/* 主播选择卡片 - 桌面端显示，移动端隐藏 */}
          <div className="hidden md:flex items-center gap-4 lg:gap-8">
            <div
              className={`flex items-center gap-3 px-4 py-2 rounded-xl theme-transition ${theme === "dongzhu" ? "ring-2 ring-offset-2" : "opacity-60"}`}
              style={{
                background:
                  theme === "dongzhu" ? "rgba(174, 214, 241, 0.3)" : "rgba(174, 214, 241, 0.15)",
                border: "2px solid #AED6F1",
              }}
            >
              <div className="text-3xl">🐷</div>
              <div>
                <div
                  className="font-bold"
                  style={{ color: theme === "dongzhu" ? "#5D6D7E" : "#85929E" }}
                >
                  歌神洞庭湖
                </div>
                <div className="text-xs opacity-70" style={{ color: "#85929E" }}>
                  白胖·洞主·便利
                </div>
              </div>
            </div>

            <div
              className={`flex items-center gap-3 px-4 py-2 rounded-xl theme-transition ${theme === "kaige" ? "ring-2 ring-offset-2" : "opacity-60"}`}
              style={{
                background: theme === "kaige" ? "rgba(231, 76, 60, 0.3)" : "rgba(231, 76, 60, 0.1)",
                border: "2px solid #E74C3C",
              }}
            >
              <div className="text-3xl">🐗</div>
              <div>
                <div
                  className="font-bold"
                  style={{ color: theme === "kaige" ? "#ECF0F1" : "#E74C3C" }}
                >
                  狼牙山凯哥
                </div>
                <div
                  className="text-xs opacity-70"
                  style={{ color: theme === "kaige" ? "#BDC3C7" : "#E74C3C" }}
                >
                  黑胖·凯哥·分开
                </div>
              </div>
            </div>
          </div>

          {/* 右侧操作区域 - 移动端：图标按钮组，桌面端：主题切换按钮 */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* 移动端外部链接图标 */}
            <div className="flex items-center gap-1 sm:hidden">
              <a
                href="https://www.douyu.com/138243"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 hover:scale-105 cursor-pointer"
                style={{
                  color: theme === "dongzhu" ? "#85929E" : "#BDC3C7",
                }}
                title="斗鱼直播间"
              >
                <Video size={20} />
              </a>
              <a
                href="https://space.bilibili.com/393671271"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 hover:scale-105 cursor-pointer"
                style={{
                  color: theme === "dongzhu" ? "#85929E" : "#BDC3C7",
                }}
                title="B站合集"
              >
                <Tv size={20} />
              </a>
              <a
                href="https://yuba.douyu.com/discussion/199511/posts"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 hover:scale-105 cursor-pointer"
                style={{
                  color: theme === "dongzhu" ? "#85929E" : "#BDC3C7",
                }}
                title="鱼吧链接"
              >
                <MessageSquare size={20} />
              </a>
            </div>

            {/* 主题切换按钮 - 始终可见 */}
            <button
              onClick={onThemeToggle}
              className="group relative overflow-hidden p-2 md:px-6 md:py-3 rounded-full font-bold theme-transition hover:scale-110"
              style={{
                background:
                  theme === "dongzhu"
                    ? "linear-gradient(135deg, #D4E8F0, #5DADE2)"
                    : "linear-gradient(135deg, #E74C3C, #C0392B)",
                border: theme === "dongzhu" ? "2px solid #5DADE2" : "2px solid #C0392B",
                color: "#fff",
                boxShadow:
                  theme === "dongzhu"
                    ? "0 4px 15px rgba(93, 173, 226, 0.4)"
                    : "0 4px 15px rgba(231, 76, 60, 0.4)",
              }}
              title={theme === "dongzhu" ? "切换到野猪·凯哥" : "切换到家猪·洞主"}
            >
              <div className="flex items-center gap-2">
                {theme === "dongzhu" ? (
                  <Moon size={20} className="md:w-5 md:h-5" />
                ) : (
                  <Sun size={20} className="md:w-5 md:h-5" />
                )}
                <span className="hidden md:inline">
                  {theme === "dongzhu" ? "切换到野猪·凯哥" : "切换到家猪·洞主"}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* 外部链接区域 - 仅桌面端显示 */}
        <div className="hidden sm:flex mt-4 items-center justify-center gap-6">
          {/* 斗鱼直播间 */}
          <a
            href="https://www.douyu.com/138243"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg transition-all duration-200 hover:scale-105 cursor-pointer"
            style={{
              color: theme === "dongzhu" ? "#85929E" : "#BDC3C7",
            }}
          >
            <Video size={20} />
            <span className="text-sm">斗鱼直播间</span>
          </a>

          <div style={{ color: theme === "dongzhu" ? "#AED6F1" : "#34495E" }}>|</div>

          {/* B站合集 */}
          <a
            href="https://space.bilibili.com/393671271"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg transition-all duration-200 hover:scale-105 cursor-pointer"
            style={{
              color: theme === "dongzhu" ? "#85929E" : "#BDC3C7",
            }}
          >
            <Tv size={20} />
            <span className="text-sm">B站合集</span>
          </a>

          <div style={{ color: theme === "dongzhu" ? "#AED6F1" : "#34495E" }}>|</div>

          {/* 鱼吧链接 */}
          <a
            href="https://yuba.douyu.com/discussion/199511/posts"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg transition-all duration-200 hover:scale-105 cursor-pointer"
            style={{
              color: theme === "dongzhu" ? "#85929E" : "#BDC3C7",
            }}
          >
            <MessageSquare size={20} />
            <span className="text-sm">鱼吧链接</span>
          </a>
        </div>
      </div>

      <div
        className="h-1 theme-transition"
        style={{
          background:
            theme === "dongzhu"
              ? "linear-gradient(90deg, transparent, #AED6F1, #5DADE2, #AED6F1, transparent)"
              : "linear-gradient(90deg, transparent, #E74C3C, #C0392B, #E74C3C, transparent)",
        }}
      />
    </header>
  );
}
