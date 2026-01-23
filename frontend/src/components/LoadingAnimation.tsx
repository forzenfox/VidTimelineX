import { useEffect, useState } from 'react';

interface LoadingAnimationProps {
  onComplete: (theme: 'kaige' | 'dongzhu') => void;
}

export function LoadingAnimation({ onComplete }: LoadingAnimationProps) {
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [footprintPositions] = useState([
    { top: '20%', left: '15%', delay: 0 },
    { top: '40%', left: '30%', delay: 0.3 },
    { top: '30%', left: '50%', delay: 0.6 },
    { top: '50%', left: '25%', delay: 0.9 },
    { top: '60%', left: '40%', delay: 1.2 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCompleted(true);
          return 100;
        }
        return prev + 1; // 每50ms增加1%，总时间5秒
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleEnter = (theme: 'kaige' | 'dongzhu') => {
    if (isEntering) return;
    setIsEntering(true);
    setTimeout(() => onComplete(theme), 800);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center`}
      style={{ overflow: 'hidden' }}
    >
      {/* 背景分区 */}
      <div className="absolute inset-0">
        {/* 左侧：凯哥主题 */}
        <div 
          className="absolute top-0 left-0 bottom-0 overflow-hidden"
          style={{
            width: '50%', // 明确设置宽度为50%
            background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)'
          }}
        >
          {/* 野猪纹路装饰 */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(15)].map((_, i) => (
              <div
                key={`kaige-${i}`}
                className="absolute h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"
                style={{
                  top: `${(i + 1) * 6}%`,
                  left: 0,
                  right: 0,
                  animation: `boar-pattern 3s ease-in-out ${i * 0.1}s infinite`,
                  transform: `skewY(${i % 2 === 0 ? 2 : -2}deg)`
                }}
              />
            ))}
          </div>
          <div className="absolute inset-0 opacity-10">
            {[...Array(10)].map((_, i) => (
              <div
                key={`kaige-vert-${i}`}
                className="absolute w-1 bg-gradient-to-b from-transparent via-red-500 to-transparent"
                style={{
                  left: `${(i + 1) * 9}%`,
                  top: 0,
                  bottom: 0,
                  animation: `boar-pattern 3s ease-in-out ${i * 0.15}s infinite`,
                  transform: `skewX(${i % 2 === 0 ? 2 : -2}deg)`
                }}
              />
            ))}
          </div>
        </div>
        
        {/* 右侧：洞主主题 */}
        <div 
          className="absolute top-0 right-0 bottom-0 overflow-hidden"
          style={{
            width: '50%', // 明确设置宽度为50%
            background: 'linear-gradient(135deg, #FFFEF7 0%, #D4E8F0 50%, #5DADE2 100%)'
          }}
        >
          {/* 小猪脚印装饰 */}
          {footprintPositions.map((pos, index) => (
            <div
              key={`dongzhu-${index}`}
              className="absolute text-6xl opacity-0"
              style={{
                top: pos.top,
                left: pos.left,
                animation: `pig-footprint 2s ease-in-out ${pos.delay}s infinite`,
                color: 'rgba(93, 173, 226, 0.3)'
              }}
            >
              🐾
            </div>
          ))}
        </div>
      </div>

      {/* 中心内容 */}
      <div className="relative z-50 flex flex-col items-center gap-6">
        {/* 疯狂星期二Logo - 双主题渐变 */}
        <div 
          className="text-6xl sm:text-7xl md:text-8xl font-black tracking-wider"
          style={{
            animation: 'logo-fade-in 1.5s ease-out 0.5s both, pulse-glow 2s ease-in-out 2s infinite',
            background: 'linear-gradient(90deg, #E74C3C 0%, #9B59B6 50%, #5DADE2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 0 30px rgba(155, 89, 182, 0.5)',
            display: 'inline-block' // 确保渐变文本正常显示
          }}
        >
          疯狂星期二
        </div>

        {/* 进度条容器 - 包含两侧图标 */}
        <div 
          className="flex items-center justify-center gap-4"
          style={{
            opacity: isCompleted ? 0 : 1,
            transform: isCompleted ? 'translateY(-10px)' : 'translateY(0)',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            animation: 'logo-fade-in 1.5s ease-out 1.5s both'
          }}
        >
          {/* 左侧：凯哥图标 */}
          <div 
            className="text-3xl"
            style={{
              color: '#E74C3C',
              animation: 'logo-fade-in 1.5s ease-out 1.5s both',
              textShadow: '0 0 15px rgba(231, 76, 60, 0.8)'
            }}
          >
            🐗
          </div>
          
          {/* 进度条 - 双主题渐变 */}
          <div 
            className="w-64 sm:w-80 h-2 sm:h-3 rounded-full overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(155, 89, 182, 0.5)',
              width: '300px', // 明确设置宽度
              height: '3px' // 明确设置高度
            }}
          >
            <div 
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #E74C3C 0%, #9B59B6 50%, #5DADE2 100%)',
                boxShadow: '0 0 10px rgba(155, 89, 182, 0.5)',
                height: '100%' // 明确设置高度
              }}
            />
          </div>
          
          {/* 右侧洞主图标 */}
          <div 
            className="text-3xl"
            style={{
              color: '#5DADE2',
              animation: 'logo-fade-in 1.5s ease-out 1.5s both',
              textShadow: '0 0 15px rgba(93, 173, 226, 0.8)'
            }}
          >
            🐷
          </div>
        </div>

        {/* 加载提示 */}
        <div 
          className="text-sm sm:text-lg opacity-80"
          style={{
            color: '#9B59B6',
            animation: 'logo-fade-in 1.5s ease-out 2s both',
            opacity: isCompleted ? 0 : 1,
            transform: isCompleted ? 'translateY(-10px)' : 'translateY(0)',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {isCompleted ? '请选择你邀约对象' : `正在搜索约会对象... ${progress}%`}
        </div>

        {/* 交互按钮区域 */}
        <div 
          className="enter-button-container flex gap-4"
          style={{
            opacity: isCompleted ? 1 : 0,
            transform: isCompleted ? 'translateY(0)' : 'translateY(20px)',
            pointerEvents: isCompleted ? 'auto' : 'none',
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s'
          }}
        >
          {/* 左侧：凯哥主题按钮 */}
          <button
            className={`enter-button ${isEntering ? 'entering' : ''}`}
            onClick={() => handleEnter('kaige')}
            disabled={isEntering}
            style={{
              // 凯哥主题红色渐变按钮
              background: 'linear-gradient(135deg, #1A1A2E 0%, #E74C3C 50%, #C0392B 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '50px',
              padding: '16px 32px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 4px 25px rgba(231, 76, 60, 0.5), 0 0 35px rgba(231, 76, 60, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              minWidth: '180px'
            }}
          >
            <span className="button-content flex items-center justify-center gap-2" style={{ position: 'relative', zIndex: 2 }}>
              <span>🐗</span>
              <span>{isEntering ? '正在进入...' : '凯哥'}</span>
            </span>
          </button>
          
          {/* 右侧：洞主主题按钮 */}
          <button
            className={`enter-button ${isEntering ? 'entering' : ''}`}
            onClick={() => handleEnter('dongzhu')}
            disabled={isEntering}
            style={{
              // 洞主主题天蓝色渐变按钮
              background: 'linear-gradient(135deg, #FFFEF7 0%, #5DADE2 50%, #85C1E2 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '50px',
              padding: '16px 32px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 4px 25px rgba(93, 173, 226, 0.5), 0 0 35px rgba(93, 173, 226, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              minWidth: '180px'
            }}
          >
            <span className="button-content flex items-center justify-center gap-2" style={{ position: 'relative', zIndex: 2 }}>
              <span>🐷</span>
              <span>{isEntering ? '正在进入...' : '洞主'}</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}