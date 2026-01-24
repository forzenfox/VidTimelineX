import React, { useState, useRef, useEffect, useMemo } from "react";
import { Pause, Play, TrendingUp, Trash2, Zap, MessageCircle, Gift, Crown } from "lucide-react";
import { danmuPool, Danmu } from "@/data/hu_mockData";
import { useIsMobile } from "@/hooks/use-mobile";

// 模拟用户数据
const mockUsers = [
  {
    id: "1",
    name: "叫我润浩",
    level: 34,
    badge: "火箭筒",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face",
  },
  {
    id: "2",
    name: "甜筒",
    level: 21,
    badge: "火箭筒",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
  },
  {
    id: "3",
    name: "Phoenix_IND",
    level: 28,
    badge: "火箭筒",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
  },
  {
    id: "4",
    name: "皇甫德德",
    level: 16,
    badge: "",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=40&h=40&fit=crop&crop=face",
  },
  {
    id: "5",
    name: "护驾...",
    level: 30,
    badge: "火箭筒",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
  },
  {
    id: "6",
    name: "漫游未来wt",
    level: 27,
    badge: "火箭筒",
    avatar:
      "https://images.unsplash.com/photo-1494790108275-2616b612b5bc?w=40&h=40&fit=crop&crop=face",
  },
  {
    id: "7",
    name: "熊熊要的奶垫",
    level: 19,
    badge: "火箭筒",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
  },
  {
    id: "8",
    name: "提着酱油的少年",
    level: 27,
    badge: "",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
  },
  {
    id: "9",
    name: "宇宇吃饱饱",
    level: 45,
    badge: "火箭筒",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=face",
  },
  {
    id: "10",
    name: "WHWDD1",
    level: 11,
    badge: "",
    avatar:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=40&h=40&fit=crop&crop=face",
  },
];

interface SidebarDanmuProps {
  theme?: "tiger" | "sweet";
}

const SidebarDanmu: React.FC<SidebarDanmuProps> = ({ theme = "tiger" }) => {
  const isMobile = useIsMobile();
  const [vipCount, setVipCount] = useState(150);
  const [diamondCount, setDiamondCount] = useState(250);

  useEffect(() => {
    const interval = setInterval(() => {
      setVipCount(prev => Math.floor(Math.random() * 50) + prev);
      setDiamondCount(prev => Math.floor(Math.random() * 100) + prev);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  const [localDanmuPool, setLocalDanmuPool] = useState<Danmu[]>(danmuPool);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<"slow" | "normal" | "fast">("normal");
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<HTMLDivElement>(null);

  // 根据设计文档设置老虎主题颜色
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
      headerBg: "bg-[#fff5f8]",
      headerText: "text-gray-800",
      chatBg: "bg-[#fff5f8]",
      chatText: "text-gray-800",
      inputBg: "bg-[#fff0f5]",
      border: "border-border",
      buttonBg: "hover:bg-gray-100",
      buttonText: "text-gray-800",
      onlineBadge: "bg-primary/20 text-primary",
      vipButton: "bg-primary/10 text-primary border-primary/30",
      normalButton: "bg-transparent text-muted-foreground border-border",
    },
  };

  // 当前主题的颜色
  const colors = themeColors[theme];

  const handleClear = () => {
    setLocalDanmuPool([]);
  };

  const getAnimationDuration = () => {
    switch (speed) {
      case "slow":
        return "40s";
      case "fast":
        return "15s";
      default:
        return "25s";
    }
  };

  // 为每条弹幕分配一个随机用户（使用 useMemo 避免重新渲染时变化）
  interface DanmuWithUser extends Danmu {
    user: User;
  }

  const displayItems = useMemo<DanmuWithUser[]>(() => {
    return localDanmuPool.map(item => ({
      ...item,
      // eslint-disable-next-line react-hooks/purity
      user: mockUsers[Math.floor(Math.random() * mockUsers.length)],
    }));
  }, [localDanmuPool]);

  // 重复数据三次，确保无缝滚动
  const repeatedItems = [...displayItems, ...displayItems, ...displayItems];

  return (
    <div
      className={`${isMobile ? "fixed bottom-0 left-0 right-0 h-64 z-30 border-t border-b border-[#E67E22]" : "h-[calc(100vh-120px)] sticky top-20 border-2 border-[#E67E22] z-30"} flex flex-col bg-[#2C3E50] tiger-stripe-primary overflow-hidden shadow-tiger`}
    >
      {/* 顶部标签栏 - 设计文档优化版 */}
      <div className={`h-12 bg-[#2C3E50] tiger-stripe-primary border-b border-[#E67E22] flex items-center justify-between px-4`}>
        {/* 排行榜标签 - 均匀分布 */}
        <button
          className={`flex-1 flex items-center justify-center transition-all ${theme === "tiger" ? "text-[#F39C12] border-b-2 border-[#E67E22]" : "text-[#BDC3C7] hover:text-[#F39C12]"} font-bold text-xs md:text-sm`}
        >
          <span className="hidden sm:inline">在线榜</span>
          <span className="sm:hidden">在线</span>
        </button>
        <button
          className={`flex-1 flex items-center justify-center transition-all ${theme === "tiger" ? "text-[#BDC3C7] hover:text-[#F39C12]" : "text-[#BDC3C7] hover:text-[#F39C12]"} font-bold text-xs md:text-sm`}
        >
          <span className="hidden sm:inline">活跃榜</span>
          <span className="sm:hidden">活跃</span>
        </button>
        <button
          className={`flex-1 flex items-center justify-center transition-all ${theme === "tiger" ? "text-[#BDC3C7] hover:text-[#F39C12]" : "text-[#BDC3C7] hover:text-[#F39C12]"} font-bold text-xs md:text-sm`}
        >
          <span className="hidden sm:inline">贵宾</span>
          <span className="sm:hidden">V</span>
          ({vipCount})
        </button>
        <button
          className={`flex-1 flex items-center justify-center transition-all ${theme === "tiger" ? "text-[#BDC3C7] hover:text-[#F39C12]" : "text-[#BDC3C7] hover:text-[#F39C12]"} font-bold text-xs md:text-sm`}
        >
          <span className="hidden sm:inline">钻粉</span>
          <span className="sm:hidden">D</span>
          ({diamondCount})
        </button>
      </div>
      
      {/* 提示信息 - 独立模块 */}
      <div className={`p-3 sm:p-4 ${colors.headerBg} border-b ${colors.border}`}>
        <div className={`flex items-center justify-between text-xs ${colors.headerText}`}>
          <span className="text-xs">斗鱼严禁未成年人打赏</span>
          <button
            className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${colors.vipButton} flex items-center gap-1.5 tiger-spread-effect`}
          >
            <Zap size={14} />
            钻粉权益
          </button>
        </div>
      </div>

      {/* 直播公告区 - 设计文档优化版 */}
      <div className="h-16 bg-gradient-to-r from-[#E67E22] to-[#2C3E50] border border-[#BDC3C7] flex items-center p-4">
        {/* 左侧虎头图标 */}
        <div className="mr-3 text-[#BDC3C7]">
          🐯
        </div>
        {/* 公告文字 - 金属光泽流动效果 */}
        <div className="flex-1">
          <div className="text-sm font-bold text-white announcement-text">
            感谢大家支持甜筒！❤️
          </div>
          <div className="text-xs text-white/80">
            👸大小姐驾到，统统闪开！✨
          </div>
        </div>
        {/* 右侧虎爪图标 */}
        <div className="ml-3 text-[#BDC3C7]">
          👆
        </div>
      </div>

      {/* 弹幕互动区 - 设计文档优化版 */}
      <div
        className={`flex-1 overflow-hidden ${colors.chatBg} ${colors.chatText} p-4 relative border-t border-b border-[#E67E22]`}
        ref={scrollRef}
      >
        {localDanmuPool.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-[#7F8C8D] p-6 text-center h-full">
            <Zap size={48} className="mb-4 opacity-20 text-[#E67E22]" />
            <p className="text-base font-medium">弹幕池空空如也~</p>
            <p className="text-xs mt-2">等待弹幕中...</p>
          </div>
        ) : (
          <div
            className="absolute top-0 left-0 w-full"
            ref={animationRef}
            style={{
              animation: isPlaying ? `scroll-up ${getAnimationDuration()} linear infinite` : "none",
            }}
          >
            <div className="space-y-3 py-4">
              {repeatedItems.map((item, idx) => (
                <DanmuItem key={`${item.id}-${idx}`} item={item} theme={theme} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 底部操作栏 - 设计文档优化版 */}
      <div className={`p-3 sm:p-4 border-t border-[#E67E22] ${colors.inputBg}`}>
        <div className="flex items-center gap-2 sm:gap-3">
          <button className={`p-2 rounded-lg ${colors.buttonBg} transition-colors tiger-spread-effect`}>
            <Gift size={18} className={colors.buttonText} />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="这里输入聊天内容"
              className={`w-full pl-4 pr-10 py-2.5 rounded-full ${theme === "tiger" ? "bg-[#34495E] text-[#BDC3C7] border border-[#7F8C8D]" : "bg-white text-gray-800 border border-gray-200"} focus:outline-none focus:border-[#E67E22] text-sm`}
              disabled
            />
          </div>
          <button
            className={`px-5 py-2.5 rounded-full ${theme === "tiger" ? "bg-[#E67E22] text-white" : "bg-primary text-white"} font-medium hover:bg-[#D35400] transition-colors text-sm tiger-spread-effect`}
            disabled
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
};

// 模仿斗鱼弹幕样式 - 优化版：文字层级清晰，颜色柔和
interface User {
  id: string;
  name: string;
  level: number;
  badge: string;
  avatar: string;
}

interface DanmuItemProps {
  item: Danmu & { user?: User };
  theme?: "tiger" | "sweet";
}

const DanmuItem: React.FC<DanmuItemProps> = ({ item, theme = "tiger" }) => {
  const isSpecial = item.type !== "normal";
  const isGift = item.type === "gift";
  const isSuper = item.type === "super";

  // 根据设计文档设置弹幕颜色
  const danmuTheme = {
    tiger: {
      nickname: "text-[#BDC3C7]", // 金属银，保证清晰可读
      levelBg: "bg-[#E67E22]/20", // 深橙背景，20%透明度
      levelText: "text-[#F39C12]", // 亮橙文字
      badgeBg: "bg-[#E67E22]/30", // 深橙背景，30%透明度
      badgeText: "text-[#F39C12]", // 亮橙文字
      normalText: "text-[#BDC3C7]", // 金属银主文字
      giftText: "text-[#F39C12]", // 亮橙礼物文字
      superText: "text-[#D35400]", // 暗橙超级弹幕文字
    },
    sweet: {
      nickname: "text-gray-800",
      levelBg: "bg-primary/20",
      levelText: "text-primary",
      badgeBg: "bg-pink-200",
      badgeText: "text-pink-800",
      normalText: "text-gray-600",
      giftText: "text-pink-500",
      superText: "text-red-500",
    },
  };

  const danmuColors = danmuTheme[theme];

  return (
    <div className="flex items-start gap-3">
      {/* 用户头像 - 左对齐 */}
      <div className="shrink-0 mt-0.5">
        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#E67E22]">
          <img
            src={
              item.user?.avatar ||
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face"
            }
            alt={item.user?.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* 弹幕内容 - 设计文档优化版 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          {/* 用户昵称 - 金属银，保证清晰可读 */}
          <span className={`font-medium text-sm sm:text-base ${danmuColors.nickname}`}>
            {item.user?.name || "游客"}
          </span>

          {/* 用户等级 - 深橙背景，亮橙文字 */}
          <span
            className={`text-xs ${danmuColors.levelBg} ${danmuColors.levelText} px-1.5 py-0.5 rounded`}
          >
            Lv.{item.user?.level || 1}
          </span>

          {/* 徽章 - 深橙背景，亮橙文字 */}
          {item.user?.badge && (
            <span
              className={`text-xs ${danmuColors.badgeBg} ${danmuColors.badgeText} px-1.5 py-0.5 rounded flex items-center gap-1`}
            >
              <Crown size={10} />
              {item.user.badge}
            </span>
          )}
        </div>

        {/* 弹幕文本 - 设计文档优化版 */}
        <div className={`leading-relaxed ${danmuColors.normalText} p-2 bg-[#34495E] border border-[#E67E22] rounded text-sm sm:text-base`}>
          {isGift && (
            <span className={`flex items-center gap-1.5 ${danmuColors.giftText}`}>
              <Gift size={14} />
              <span>{item.text}</span>
            </span>
          )}
          {isSuper && (
            <span className={`flex items-center gap-1.5 ${danmuColors.superText} font-medium`}>
              <Crown size={14} />
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
