import React from 'react';
import { Link } from 'react-router-dom';

/**
 * 导航页面 - 网站入口，提供视频集选择选项
 */
const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col items-center justify-center p-4">
      {/* 网站标题 */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
          B站视频集导航
        </h1>
        <p className="text-gray-600 text-lg md:text-xl">
          选择您想要观看的视频集
        </p>
      </div>

      {/* 视频集选项卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* 洞主凯哥视频集卡片 */}
        <Link
          to="/dongzhu-kaige"
          className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-2 border-transparent hover:border-blue-300"
        >
          <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-6xl mb-2">🎮</div>
              <h2 className="text-2xl font-bold">洞主凯哥视频集</h2>
            </div>
          </div>
          <div className="p-6">
            <p className="text-gray-600">
              观看洞主和凯哥的精彩游戏视频集锦
            </p>
            <div className="mt-4 flex items-center text-blue-600 font-medium">
              进入视频集 →
            </div>
          </div>
        </Link>

        {/* 亿口甜筒视频集卡片 */}
        <Link
          to="/yi-kou-tian-tong"
          className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-2 border-transparent hover:border-purple-300"
        >
          <div className="h-48 bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-6xl mb-2">🍦</div>
              <h2 className="text-2xl font-bold">亿口甜筒视频集</h2>
            </div>
          </div>
          <div className="p-6">
            <p className="text-gray-600">
              观看亿口甜筒的精彩视频内容
            </p>
            <div className="mt-4 flex items-center text-purple-600 font-medium">
              进入视频集 →
            </div>
          </div>
        </Link>
      </div>

      {/* 页脚信息 */}
      <div className="mt-16 text-center text-gray-500 text-sm">
        <p>© 2026 B站视频集导航 | 纯静态网站</p>
      </div>
    </div>
  );
};

export default Home;