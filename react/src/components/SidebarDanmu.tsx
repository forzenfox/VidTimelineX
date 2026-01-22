import React, { useState, useRef, useEffect } from 'react';
import { Pause, Play, TrendingUp, Trash2, Zap, MessageCircle, Gift, Crown } from 'lucide-react';
import { danmuPool, Danmu } from '@/data/mockData';

// 模拟用户数据
const mockUsers = [
  { id: '1', name: '叫我润浩', level: 34, badge: '火箭筒', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face' },
  { id: '2', name: '甜筒', level: 21, badge: '火箭筒', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face' },
  { id: '3', name: 'Phoenix_IND', level: 28, badge: '火箭筒', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face' },
  { id: '4', name: '皇甫德德', level: 16, badge: '', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=40&h=40&fit=crop&crop=face' },
  { id: '5', name: '护驾...', level: 30, badge: '火箭筒', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face' },
  { id: '6', name: '漫游未来wt', level: 27, badge: '火箭筒', avatar: 'https://images.unsplash.com/photo-1494790108275-2616b612b5bc?w=40&h=40&fit=crop&crop=face' },
  { id: '7', name: '熊熊要的奶垫', level: 19, badge: '火箭筒', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face' },
  { id: '8', name: '提着酱油的少年', level: 27, badge: '', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face' },
  { id: '9', name: '宇宇吃饱饱', level: 45, badge: '火箭筒', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=face' },
  { id: '10', name: 'WHWDD1', level: 11, badge: '', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=40&h=40&fit=crop&crop=face' },
];

interface SidebarDanmuProps {
  theme?: 'tiger' | 'sweet';
}

const SidebarDanmu: React.FC<SidebarDanmuProps> = ({ theme = 'tiger' }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<'normal' | 'fast' | 'slow'>('normal');
  const [localDanmuPool, setLocalDanmuPool] = useState<Danmu[]>(danmuPool);
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<HTMLDivElement>(null);

  // 根据主题设置颜色
  const themeColors = {
    tiger: {
      headerBg: 'bg-secondary/20',
      headerText: 'text-muted-foreground',
      chatBg: 'bg-[#1a1a1a]',
      chatText: 'text-white',
      inputBg: 'bg-[#2a2a2a]',
      border: 'border-border',
      buttonBg: 'hover:bg-white/10',
      buttonText: 'text-white'
    },
    sweet: {
      headerBg: 'bg-secondary/20',
      headerText: 'text-muted-foreground',
      chatBg: 'bg-[#fff5f8]',
      chatText: 'text-gray-800',
      inputBg: 'bg-[#fff0f5]',
      border: 'border-border',
      buttonBg: 'hover:bg-gray-100',
      buttonText: 'text-gray-800'
    }
  };

  // 当前主题的颜色
  const colors = themeColors[theme];

  const handleClear = () => {
    setLocalDanmuPool([]);
  };

  const getAnimationDuration = () => {
    switch(speed) {
      case 'slow': return '40s';
      case 'fast': return '15s';
      default: return '25s';
    }
  };

  // 为每条弹幕分配一个随机用户
  const displayItems = localDanmuPool.map((item) => ({
    ...item,
    user: mockUsers[Math.floor(Math.random() * mockUsers.length)]
  }));

  // 重复数据三次，确保无缝滚动
  const repeatedItems = [...displayItems, ...displayItems, ...displayItems];

  return (
    <div className="h-[calc(100vh-100px)] sticky top-4 flex flex-col bg-card border-2 border-border rounded-xl shadow-custom overflow-hidden">
      {/* 顶部信息栏 - 模仿斗鱼 */}
      <div className={`p-3 ${colors.headerBg} border-b ${colors.border} tiger-stripe`}>
        {/* 模仿斗鱼排行榜 */}
        <div className="flex items-center justify-between text-xs mb-3 overflow-x-auto scrollbar-hide">
          <div className="flex space-x-2">
            <button className={`px-2 py-0.5 rounded-full border text-xs ${theme === 'tiger' ? 'bg-primary text-primary-foreground border-primary' : 'bg-primary text-primary-foreground border-primary'}`}>
              在线榜
            </button>
            <button className={`px-2 py-0.5 rounded-full border text-xs ${theme === 'tiger' ? 'bg-transparent text-muted-foreground border-border' : 'bg-transparent text-muted-foreground border-border'}`}>
              活跃榜
            </button>
            <button className={`px-2 py-0.5 rounded-full border text-xs ${theme === 'tiger' ? 'bg-transparent text-muted-foreground border-border' : 'bg-transparent text-muted-foreground border-border'}`}>
              贵宾({Math.floor(Math.random() * 100) + 100})
            </button>
            <button className={`px-2 py-0.5 rounded-full border text-xs ${theme === 'tiger' ? 'bg-transparent text-muted-foreground border-border' : 'bg-transparent text-muted-foreground border-border'}`}>
              钻粉({Math.floor(Math.random() * 100) + 200})
            </button>
          </div>
        </div>
        
        {/* 模仿斗鱼提示信息 */}
        <div className={`flex items-center justify-between text-xs ${colors.headerText} overflow-x-auto scrollbar-hide`}>
          <div className="flex-1 text-center">
            <span className="text-xs">斗鱼严禁未成年人打赏</span>
          </div>
          <div className="flex-1 flex justify-center">
            <button className={`px-1.5 py-0.25 rounded text-xs ${theme === 'tiger' ? 'bg-primary text-primary-foreground' : 'bg-primary text-primary-foreground'}`}>
              钻粉权益
            </button>
          </div>
        </div>
      </div>

      {/* 聊天区域 - 模仿斗鱼聊天框 */}
      <div className={`flex-1 overflow-hidden ${colors.chatBg} ${colors.chatText} p-3 relative`} ref={scrollRef}>
        {localDanmuPool.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-muted-foreground p-6 text-center h-full">
            <Zap size={48} className="mb-4 opacity-20" />
            <p>弹幕池空空如也~</p>
            <p className="text-xs mt-2">等待弹幕中...</p>
          </div>
        ) : (
          <div 
            className="absolute top-0 left-0 w-full" 
            ref={animationRef}
            style={{
              animation: isPlaying ? `scroll-up ${getAnimationDuration()} linear infinite` : 'none',
            }}
          >
            <div className="space-y-3 py-3">
              {repeatedItems.map((item, idx) => (
                <DanmuItem key={`${item.id}-${idx}`} item={item} theme={theme} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 底部操作栏 - 模仿斗鱼输入框 */}
      <div className={`p-3 border-t ${colors.border} ${colors.inputBg}`}>
        <div className="flex items-center space-x-2">
          <button className={`p-2 rounded-md ${colors.buttonBg} transition-colors`}>
            <Gift size={18} className={colors.buttonText} />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="这里输入聊天内容"
              className={`w-full pl-4 pr-10 py-2 rounded-full ${theme === 'tiger' ? 'bg-[#3a3a3a] text-white border border-[#555]' : 'bg-white text-gray-800 border border-gray-200'} focus:outline-none focus:border-primary text-sm`}
              disabled
            />
          </div>
          <button className="px-4 py-2 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition-colors" disabled>
            发送
          </button>
        </div>
      </div>
    </div>
  );
};

// 模仿斗鱼弹幕样式
interface DanmuItemProps {
  item: Danmu & { user?: any };
  theme?: 'tiger' | 'sweet';
}

const DanmuItem: React.FC<DanmuItemProps> = ({ item, theme = 'tiger' }) => {
  const isSpecial = item.type !== 'normal';
  const isGift = item.type === 'gift';
  const isSuper = item.type === 'super';

  // 根据主题设置弹幕颜色
  const danmuTheme = {
    tiger: {
      nickname: 'text-white',
      levelBg: 'bg-primary/20',
      levelText: 'text-primary',
      badgeBg: 'bg-secondary/20',
      badgeText: 'text-secondary',
      normalText: 'text-gray-200',
      giftText: 'text-yellow-400',
      superText: 'text-red-400'
    },
    sweet: {
      nickname: 'text-gray-800',
      levelBg: 'bg-primary/20',
      levelText: 'text-primary',
      badgeBg: 'bg-pink-200',
      badgeText: 'text-pink-800',
      normalText: 'text-gray-600',
      giftText: 'text-pink-500',
      superText: 'text-red-500'
    }
  };

  const danmuColors = danmuTheme[theme];
  
  return (
    <div className="flex items-start gap-2">
      {/* 用户头像 */}
      <div className="shrink-0">
        <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/30">
          <img 
            src={item.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face'} 
            alt={item.user?.name} 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      {/* 弹幕内容 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {/* 用户昵称 */}
          <span className={`font-medium text-sm ${danmuColors.nickname}`}>
            {item.user?.name || '游客'}
          </span>
          
          {/* 用户等级 */}
          <span className={`text-xs ${danmuColors.levelBg} ${danmuColors.levelText} px-1.5 py-0.5 rounded`}>
            Lv.{item.user?.level || 1}
          </span>
          
          {/* 徽章 */}
          {item.user?.badge && (
            <span className={`text-xs ${danmuColors.badgeBg} ${danmuColors.badgeText} px-1.5 py-0.5 rounded flex items-center gap-1`}>
              <Crown size={10} />
              {item.user.badge}
            </span>
          )}
        </div>
        
        {/* 弹幕文本 */}
        <div className={`text-sm ${danmuColors.normalText}`}>
          {isGift && (
            <span className={`flex items-center gap-1 ${danmuColors.giftText}`}>
              <Gift size={14} />
              <span>{item.text}</span>
            </span>
          )}
          {isSuper && (
            <span className={`flex items-center gap-1 ${danmuColors.superText} font-medium`}>
              <Crown size={14} />
              <span>{item.text}</span>
            </span>
          )}
          {!isGift && !isSuper && (
            <span>{item.text}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarDanmu;