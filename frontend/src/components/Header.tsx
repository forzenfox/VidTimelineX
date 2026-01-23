import { Sun, Moon } from 'lucide-react';

interface HeaderProps {
  theme: 'dongzhu' | 'kaige';
  onThemeToggle: () => void;
}

export function Header({ theme, onThemeToggle }: HeaderProps) {
  return (
    <header 
      className="sticky top-0 z-40 theme-transition"
      style={{
        background: theme === 'dongzhu'
          ? 'linear-gradient(135deg, rgba(255, 254, 247, 0.95), rgba(174, 214, 241, 0.95))'
          : 'linear-gradient(135deg, rgba(22, 33, 62, 0.95), rgba(26, 26, 46, 0.95))',
        backdropFilter: 'blur(10px)',
        borderBottom: theme === 'dongzhu'
          ? '3px solid #AED6F1'
          : '3px solid #E74C3C',
        boxShadow: theme === 'dongzhu'
          ? '0 4px 20px rgba(93, 173, 226, 0.3)'
          : '0 4px 20px rgba(231, 76, 60, 0.4)'
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo区 */}
          <div className="flex items-center gap-4">
            <div 
              className="text-5xl font-black gradient-text"
            >
              驴酱
            </div>
            <div 
              className="px-4 py-2 rounded-full font-bold text-sm"
              style={{
                background: 'rgba(255, 215, 0, 0.2)',
                border: '2px solid #FFD700',
                color: '#B8860B'
              }}
            >
              🐴 发抛驴
            </div>
          </div>

          {/* 主播信息 */}
          <div className="flex items-center gap-8">
            {/* 洞主信息 */}
            <div 
              className={`flex items-center gap-3 px-4 py-2 rounded-xl theme-transition ${theme === 'dongzhu' ? 'ring-2 ring-offset-2' : 'opacity-60'}`}
              style={{
                background: theme === 'dongzhu'
                  ? 'rgba(174, 214, 241, 0.3)'
                  : 'rgba(174, 214, 241, 0.15)',
                border: '2px solid #AED6F1',
                ringColor: theme === 'dongzhu' ? '#5DADE2' : 'transparent'
              }}
            >
              <div className="text-3xl">🐷</div>
              <div>
                <div 
                  className="font-bold"
                  style={{ color: theme === 'dongzhu' ? '#5D6D7E' : '#85929E' }}
                >
                  歌神洞庭湖
                </div>
                <div className="text-xs opacity-70" style={{ color: '#85929E' }}>
                  白胖·洞主·便利
                </div>
              </div>
            </div>

            {/* 凯哥信息 */}
            <div 
              className={`flex items-center gap-3 px-4 py-2 rounded-xl theme-transition ${theme === 'kaige' ? 'ring-2 ring-offset-2' : 'opacity-60'}`}
              style={{
                background: theme === 'kaige'
                  ? 'rgba(231, 76, 60, 0.3)'
                  : 'rgba(231, 76, 60, 0.1)',
                border: '2px solid #E74C3C',
                ringColor: theme === 'kaige' ? '#E74C3C' : 'transparent'
              }}
            >
              <div className="text-3xl">🐗</div>
              <div>
                <div 
                  className="font-bold"
                  style={{ color: theme === 'kaige' ? '#ECF0F1' : '#E74C3C' }}
                >
                  狼牙山凯哥
                </div>
                <div className="text-xs opacity-70" style={{ color: theme === 'kaige' ? '#BDC3C7' : '#E74C3C' }}>
                  黑胖·凯哥·分开
                </div>
              </div>
            </div>
          </div>

          {/* 主题切换 */}
          <button
            onClick={onThemeToggle}
            className="group relative overflow-hidden px-6 py-3 rounded-full font-bold theme-transition hover:scale-110"
            style={{
              background: theme === 'dongzhu'
                ? 'linear-gradient(135deg, #D4E8F0, #5DADE2)'
                : 'linear-gradient(135deg, #E74C3C, #C0392B)',
              border: theme === 'dongzhu'
                ? '2px solid #5DADE2'
                : '2px solid #C0392B',
              color: '#fff',
              boxShadow: theme === 'dongzhu'
                ? '0 4px 15px rgba(93, 173, 226, 0.4)'
                : '0 4px 15px rgba(231, 76, 60, 0.4)'
            }}
          >
            <div className="flex items-center gap-2">
              {theme === 'dongzhu' ? (
                <>
                  <Moon size={20} />
                  <span>切换到野猪·凯哥</span>
                </>
              ) : (
                <>
                  <Sun size={20} />
                  <span>切换到家猪·洞主</span>
                </>
              )}
            </div>
          </button>
        </div>

        {/* 副标题栏 */}
        <div className="mt-4 flex items-center justify-center gap-6 text-sm">
          <a
            href="https://www.douyu.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:underline theme-transition"
            style={{
              color: theme === 'dongzhu' ? '#85929E' : '#BDC3C7'
            }}
          >
            <span>🎮</span>
            <span>斗鱼直播间</span>
          </a>
          <div style={{ color: theme === 'dongzhu' ? '#AED6F1' : '#34495E' }}>|</div>
          <a
            href="https://space.bilibili.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:underline theme-transition"
            style={{
              color: theme === 'dongzhu' ? '#85929E' : '#BDC3C7'
            }}
          >
            <span>📺</span>
            <span>B站合集</span>
          </a>
          <div style={{ color: theme === 'dongzhu' ? '#AED6F1' : '#34495E' }}>|</div>
          <a
            href="https://www.douyu.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:underline theme-transition"
            style={{
              color: theme === 'dongzhu' ? '#85929E' : '#BDC3C7'
            }}
          >
            <span>💬</span>
            <span>鱼吧链接</span>
          </a>
        </div>
      </div>

      {/* 装饰线 */}
      <div 
        className="h-1 theme-transition"
        style={{
          background: theme === 'dongzhu'
            ? 'linear-gradient(90deg, transparent, #AED6F1, #5DADE2, #AED6F1, transparent)'
            : 'linear-gradient(90deg, transparent, #E74C3C, #C0392B, #E74C3C, transparent)'
        }}
      />
    </header>
  );
}