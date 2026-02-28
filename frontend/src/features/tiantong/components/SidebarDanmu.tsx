import React, { useState, useRef, useMemo } from "react";
import { Zap, Gift, Crown } from "lucide-react";
import { users } from "../data";
import { useIsMobile } from "@/hooks/use-mobile";
import { DanmakuGenerator, DanmakuUser, DanmakuMessage } from "@/shared/danmaku";
import danmakuText from "../data/danmaku.txt?raw";

interface SidebarDanmuProps {
  theme?: "tiger" | "sweet";
}

const SidebarDanmu: React.FC<SidebarDanmuProps> = ({ theme = "tiger" }) => {
  const isMobile = useIsMobile();
  const [vipCount] = useState(1314);
  const [diamondCount] = useState(1000);
  const [isPlaying] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<HTMLDivElement>(null);

  const usersList = useMemo(() => {
    return users.map(user => ({
      ...user,
      badge: [user.badge],
    }));
  }, []);

  const danmakuPool = useMemo(() => {
    return danmakuText.split("\n").filter(line => line.trim());
  }, [danmakuText]);

  const generator = useMemo(() => {
    return new DanmakuGenerator({
      textPool: danmakuPool,
      users: usersList,
      theme: theme,
      danmakuType: "sidebar",
      randomColor: false,
      randomSize: false,
    });
  }, [danmakuPool, usersList, theme]);

  // 根据设计文档设置主题颜色
  const themeColors = {
    tiger: {
      headerBg: "bg-[#2C3E50] tiger-stripe-primary",
      headerText: "text-[#BDC3C7]",
      chatBg: "bg-[#2C3E50] tiger-stripe-primary",
      chatText: "text-[#BDC3C7]",
      inputBg: "bg-[#34495E]",
      border: "border-[#E67E22]",
      buttonBg: "hover:bg-[#E67E22]/20",
      buttonText: "text-[#BDC3C7]",
      onlineBadge: "bg-[#E67E22] text-white",
      vipButton: "bg-gradient-to-r from-[#E67E22] to-[#2C3E50] text-white border-[#E67E22]",
      normalButton: "bg-transparent text-[#BDC3C7] border-[#7F8C8D]",
    },
    sweet: {
      headerBg: "bg-gradient-to-r from-[#FFFDF9] to-[#FDE6E0]/80",
      headerText: "text-[#F4729C]",
      chatBg: "bg-[#FFFDF9]/95",
      chatText: "text-[#F4729C]",
      inputBg: "bg-[#FFFDF9]",
      border: "border-[#FDE6E0]",
      buttonBg: "hover:bg-[#FDE6E0]/50",
      buttonText: "text-[#F4729C]",
      onlineBadge: "bg-[#FDE6E0] text-[#F4729C]",
      vipButton: "bg-gradient-to-r from-[#FDE6E0] to-[#FFFDF9] text-[#F4729C] border-[#F4729C]/30",
      normalButton: "bg-transparent text-[#F793B1] border-[#FDE6E0]",
    },
  };

  const colors = themeColors[theme];

  const displayItems = useMemo(() => {
    const messages = generator.generateBatch({
      count: usersList.length,
      type: "sidebar",
      theme: theme,
    });
    return messages.map(msg => ({
      id: msg.id,
      text: msg.text,
      type: "normal" as const,
      user: {
        id: msg.userId || "",
        name: msg.userName || "游客",
        level: 1,
        badge: "火箭筒",
        avatar: msg.userAvatar || "",
      },
    }));
  }, [generator, usersList, theme]);

  const repeatedItems = [...displayItems, ...displayItems, ...displayItems];

  return (
    <div
      className={`${isMobile ? "fixed bottom-0 left-0 right-0 h-64 z-20 border-t border-b" : "h-[calc(100vh-180px)] sticky top-20 z-20"} flex flex-col relative ${theme === "tiger" ? "bg-[#2C3E50] tiger-stripe-primary border-2 border-[#E67E22] shadow-tiger" : "bg-card rounded-xl shadow-custom"} overflow-hidden`}
      style={theme === "tiger" ? { boxShadow: "inset 0 0 0 1px #2C3E50" } : {}}
    >
      {/* 顶部标签栏 - 设计文档优化版 */}
      <div
        className={`h-8 md:h-10 ${theme === "tiger" ? "bg-[#2C3E50] tiger-stripe-primary border-b border-[#E67E22]" : "bg-gradient-to-r from-[#FFFDF9] to-[#FDE6E0]/80 border-b border-[#FDE6E0]"} flex items-center justify-between px-4`}
      >
        {/* 排行榜标签 - 均匀分布 */}
        <button
          className={`flex-1 flex items-center justify-center transition-all font-bold text-xs md:text-sm whitespace-nowrap ${theme === "tiger" ? "text-[#F39C12] border-b-2 border-[#E67E22]" : "text-[#F793B1] border-b-2 border-[#F4729C] flex gap-1.5"}`}
        >
          <span className="hidden sm:inline">在线榜</span>
          <span className="sm:hidden">在线</span>
          {theme === "sweet" && <span className="text-xs">💖</span>}
        </button>
        <button
          className={`flex-1 flex items-center justify-center transition-all font-bold text-xs md:text-sm whitespace-nowrap ${theme === "tiger" ? "text-[#BDC3C7] hover:text-[#F39C12]" : "text-[#F793B1] hover:text-[#F4729C] hover:border-b-2 hover:border-[#F4729C] transition-all duration-200"}`}
        >
          <span className="hidden sm:inline">活跃榜</span>
          <span className="sm:hidden">活跃</span>
        </button>
        <button
          className={`flex-1 flex items-center justify-center transition-all font-bold text-xs md:text-sm whitespace-nowrap ${theme === "tiger" ? "text-[#BDC3C7] hover:text-[#F39C12]" : "text-[#F793B1] hover:text-[#F4729C] hover:border-b-2 hover:border-[#F4729C] transition-all duration-200"}`}
        >
          <span className="hidden sm:inline">贵宾</span>
          <span className="sm:hidden">V</span>({vipCount})
        </button>
        <button
          className={`flex-1 flex items-center justify-center transition-all font-bold text-xs md:text-sm whitespace-nowrap ${theme === "tiger" ? "text-[#BDC3C7] hover:text-[#F39C12]" : "text-[#F793B1] hover:text-[#F4729C] hover:border-b-2 hover:border-[#F4729C] transition-all duration-200"}`}
        >
          <span className="hidden sm:inline">钻粉</span>
          <span className="sm:hidden">D</span>({diamondCount})
        </button>
      </div>

      {/* 提示信息 - 独立模块 */}
      <div className={`p-2 ${colors.headerBg} border-b ${colors.border}`}>
        <div className={`flex items-center justify-center gap-4 text-xs ${colors.headerText}`}>
          <span className="flex-1 text-center">斗鱼严禁未成年人打赏</span>
          <button
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${colors.vipButton} flex items-center gap-1 tiger-spread-effect`}
          >
            <Zap size={12} />
            钻粉权益
          </button>
        </div>
      </div>

      {/* 直播公告区 - 设计文档优化版 */}
      <div
        className={`h-10 md:h-12 flex items-center p-4 ${
          theme === "tiger"
            ? "bg-gradient-to-r from-[#E67E22] to-[#2C3E50] border border-[#BDC3C7]"
            : "bg-gradient-to-r from-[#FFFDF9] to-[#FDE6E0] border border-[#FDE6E0] shadow-sm"
        }`}
      >
        {/* 左侧图标 */}
        <div className={`mr-3 ${theme === "tiger" ? "text-[#BDC3C7]" : "text-[#F4729C]"}`}>
          {theme === "tiger" ? "🐯" : "🍦"}
        </div>
        {/* 公告文字 - 居中显示 */}
        <div className="flex-1 text-center">
          <div
            className={`text-sm font-bold ${theme === "tiger" ? "text-white announcement-text" : "text-[#F4729C] animate-bounce-slow"}`}
          >
            {theme === "tiger" ? "👸大小姐驾到，统统闪开！✨" : "👸小甜筒来咯，啾咪~✨"}
          </div>
        </div>
        {/* 右侧图标 */}
        <div className={`ml-3 ${theme === "tiger" ? "text-[#BDC3C7]" : "text-[#F4729C]"}`}>
          {theme === "tiger" ? "🐯" : "🍦"}
        </div>
      </div>

      {/* 弹幕互动区 - 设计文档优化版 */}
      <div
        className={`flex-1 overflow-hidden ${colors.chatBg} ${colors.chatText} p-4 relative ${theme === "tiger" ? "border-t border-b border-[#E67E22]" : ""}`}
        ref={scrollRef}
      >
        {displayItems.length === 0 ? (
          <div
            className={`flex flex-col items-center justify-center p-6 text-center h-full ${theme === "tiger" ? "text-[#7F8C8D]" : "text-[#F4729C]/70"}`}
          >
            <Zap
              size={48}
              className={`mb-4 opacity-20 ${theme === "tiger" ? "text-[#E67E22]" : "text-[#F4729C]"}`}
            />
            <p className="text-base font-medium">弹幕池空空如也~</p>
            <p className="text-xs mt-2">等待弹幕中...</p>
          </div>
        ) : (
          <div
            className="absolute top-0 left-0 w-full"
            ref={animationRef}
            style={{
              animation: isPlaying ? `scroll-up 120s linear infinite` : "none",
            }}
          >
            <div className={`space-y-3 ${theme === "sweet" ? "space-y-4" : "space-y-3"} py-4`}>
              {repeatedItems.map((item, idx) => (
                <DanmuItem key={`${idx}`} item={item} theme={theme} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 底部操作栏 - 设计文档优化版 */}
      <div
        className={`p-3 sm:p-4 border-t ${theme === "tiger" ? "border-[#E67E22]" : "border-[#FDE6E0]"} ${colors.inputBg}`}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            className={`p-2 rounded-lg ${colors.buttonBg} transition-colors ${theme === "sweet" ? "hover:bg-[#FDE6E0]/70 transition-all duration-300" : ""}`}
          >
            <Gift size={18} className={colors.buttonText} />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder={theme === "sweet" ? "来和甜筒唠唠嗑～😘" : "这里输入聊天内容"}
              className={`w-full pl-4 pr-10 py-2.5 rounded-full ${
                theme === "tiger"
                  ? "bg-[#34495E] text-[#BDC3C7] border border-[#7F8C8D]"
                  : "bg-[#FFFDF9] text-[#F4729C] border border-[#FDE6E0] shadow-sm hover:shadow-md transition-all duration-300"
              } 
                focus:outline-none focus:border-[${theme === "tiger" ? "#E67E22" : "#F4729C"}] 
                text-sm`}
              disabled
            />
          </div>
          <button
            className={`px-5 py-2.5 rounded-full font-medium transition-colors text-sm ${
              theme === "tiger"
                ? "bg-[#E67E22] text-white hover:bg-[#D35400] tiger-spread-effect"
                : "bg-gradient-to-r from-[#FDE6E0] to-[#F4729C] text-white hover:shadow-lg transition-all duration-300"
            }`}
            disabled
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
};

interface User {
  id: string;
  name: string;
  level: number;
  badge: string;
  avatar: string;
}

interface DanmuItemProps {
  item: { id: string; text: string; type: "normal" | "gift" | "super"; user: User; color?: string };
  theme?: "tiger" | "sweet";
}

const DanmuItem: React.FC<DanmuItemProps> = ({ item, theme = "tiger" }) => {
  const isGift = item.type === "gift";
  const isSuper = item.type === "super";

  const user = typeof item.user === "string" ? null : item.user;

  const superDanmakuColors = {
    tiger: [
      "rgb(255, 95, 0)",
      "rgb(255, 215, 0)",
      "rgb(255, 165, 0)",
      "rgb(255, 140, 0)",
      "rgb(255, 190, 40)",
    ],
    sweet: [
      "rgb(255, 140, 180)",
      "rgb(255, 192, 203)",
      "rgb(255, 105, 180)",
      "rgb(255, 127, 80)",
      "rgb(255, 20, 147)",
    ],
  };

  // 使用 useMemo 缓存随机颜色选择器，避免在 render 中调用 Math.random
  const getRandomSuperDanmakuColor = useMemo(() => {
    return (themeName: "tiger" | "sweet") => {
      const colors = superDanmakuColors[themeName];
      // 使用当前时间戳作为种子来避免每次 render 都产生不同的随机值
      const seed = Date.now() % colors.length;
      return colors[seed];
    };
  }, []);

  // 根据设计文档设置弹幕颜色
  const danmuTheme = {
    tiger: {
      nickname: "text-[#BDC3C7]", // 金属银，保证清晰可读
      levelBg: "bg-[#E67E22]/20", // 深橙背景，20%透明度
      levelText: "text-[#F39C12]", // 亮橙文字
      badgeBg: "bg-[#E67E22]/30", // 深橙背景，30%透明度
      badgeText: "text-[#F39C12]", // 亮橙文字
      normalText: "text-[#BDC3C7]", // 金属银文字
      giftText: "text-[#F39C12]", // 亮橙礼物文字
      superText: "text-[#D35400]", // 暗橙超级弹幕文字
    },
    sweet: {
      nickname: "text-[#F4729C]",
      levelBg: "bg-[#FDE6E0]/60",
      levelText: "text-[#F4729C]",
      badgeBg: "bg-[#FDE6E0]",
      badgeText: "text-[#F4729C]",
      normalText: "text-[#F4729C]",
      giftText: "text-[#F4729C]",
      superText: "text-[#F4729C]",
    },
  };

  const danmuColors = danmuTheme[theme];

  return (
    <div className="flex items-start gap-3">
      {/* 用户头像 - 左对齐 */}
      <div className="shrink-0 mt-0.5">
        {theme === "sweet" ? (
          <div className="relative">
            {/* 甜筒主题头像框 */}
            <div
              className={`w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9 rounded-full overflow-hidden border ${
                user?.name === "甜筒"
                  ? "border-[#F4729C] bg-[#FDE6E0] p-1"
                  : "border-[#FDE6E0] bg-[#FFFDF9] p-0.5"
              }`}
            >
              <img
                src={
                  user?.avatar ||
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face"
                }
                alt={user?.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
        ) : (
          <div className={`w-9 h-9 rounded-full overflow-hidden border-2 border-[#E67E22]`}>
            <img
              src={
                user?.avatar ||
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face"
              }
              alt={user?.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* 弹幕内容 - 设计文档优化版 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          {/* 用户昵称 */}
          <span className={`font-medium text-sm sm:text-base ${danmuColors.nickname}`}>
            {user?.name || "游客"}
          </span>

          {/* 用户等级 */}
          <span
            className={`text-xs ${danmuColors.levelBg} ${danmuColors.levelText} px-1.5 py-0.5 rounded`}
          >
            Lv.{user?.level || 1}
          </span>

          {/* 徽章 */}
          {user?.badge && (
            <span
              className={`text-xs ${danmuColors.badgeBg} ${danmuColors.badgeText} px-1.5 py-0.5 rounded flex items-center gap-1 ${theme === "sweet" ? "transition-all duration-300 hover:scale-105" : ""}`}
            >
              {theme === "sweet" ? "🍦" : <Crown size={10} />}
              {theme === "sweet" ? "小甜筒" : user.badge}
            </span>
          )}
        </div>

        {/* 弹幕文本 - 设计文档优化版 */}
        <div
          className={`leading-relaxed p-2 text-sm sm:text-base rounded ${
            theme === "tiger"
              ? "bg-[#34495E] border border-[#E67E22] text-[#BDC3C7]"
              : "bg-[#FFF2C6] border border-[#F4729C]/30 text-[#F4729C] rounded-[8px] hover:border-[#F4729C]/70 transition-all duration-300"
          }`}
          style={
            theme === "sweet"
              ? { boxShadow: "0 0 0 1px #FDE6E0, 0 2px 4px rgba(244, 114, 156, 0.1)" }
              : {}
          }
        >
          {isGift && (
            <span className={`flex items-center gap-1.5 ${danmuColors.giftText}`}>
              <Gift size={14} />
              <span>{item.text}</span>
            </span>
          )}
          {isSuper && (
            <span
              className={`flex items-center gap-1.5 font-medium`}
              style={{ color: getRandomSuperDanmakuColor(theme) }}
            >
              {theme === "sweet" ? "✨" : <Crown size={14} />}
              <span>{item.text}</span>
            </span>
          )}
          {!isGift && !isSuper && <span>{item.text}</span>}
        </div>
      </div>
    </div>
  );
};

export default SidebarDanmu;
