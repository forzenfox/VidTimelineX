import React from "react";
import { Link } from "react-router-dom";
import { PlayCircle } from "lucide-react";

// 首页组件
export const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
      <title>哔哩哔哩时间线 - 探索精彩视频内容</title>
      <meta
        name="description"
        content="探索哔哩哔哩视频集，发现精彩内容，包含驴酱视频集和甜筒视频集"
      />
      <meta name="keywords" content="哔哩哔哩, 时间线, 视频集, 驴酱, 甜筒, 洞主, 凯哥" />
      <meta name="author" content="哔哩哔哩时间线" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="哔哩哔哩时间线 - 探索精彩视频内容" />
      <meta property="og:description" content="探索哔哩哔哩视频集，发现精彩内容" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://example.com" />

      <div className="text-center max-w-3xl">
        {/* 标题区域 */}
        <h1 className="text-5xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          哔哩哔哩时间线
        </h1>
        <p className="text-xl text-gray-600 mb-12">探索哔哩哔哩视频集，发现精彩内容</p>

        {/* 导航卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 驴酱视频集卡片 */}
          <Link
            to="/lvjiang"
            className="group p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-200"
            aria-label="查看驴酱视频集"
          >
            <div className="flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <PlayCircle size={48} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">驴酱视频集</h2>
              <p className="text-gray-500 text-center">
                探索驴酱公会的精彩视频内容，包含洞主、凯哥等主播的经典时刻
              </p>
            </div>
          </Link>

          {/* 甜筒视频集卡片 */}
          <Link
            to="/tiantong"
            className="group p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-pink-200"
            aria-label="查看甜筒视频集"
          >
            <div className="flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <PlayCircle size={48} className="text-pink-600" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">甜筒视频集</h2>
              <p className="text-gray-500 text-center">
                记录亿口甜筒的时光碎片，包含唱歌、跳舞、搞笑等精彩内容
              </p>
            </div>
          </Link>

          {/* C皇粉丝站卡片 */}
          <Link
            to="/yuxiaoc"
            className="group p-8 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-red-200"
            aria-label="查看C皇粉丝站"
          >
            <div className="flex flex-col items-center justify-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                style={{ background: "linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)" }}
              >
                <span className="text-4xl">👑</span>
              </div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">C皇驾到</h2>
              <p className="text-gray-500 text-center">
                余小C专属粉丝站，混与躺轮回不止，血怒时刻精彩呈现
              </p>
            </div>
          </Link>
        </div>

        {/* 页脚 */}
        <footer className="mt-16 text-gray-500 text-sm">
          <p>© 2026 哔哩哔哩时间线 - 探索精彩视频内容</p>
        </footer>
      </div>
    </div>
  );
};

// 默认导出一个空组件，因为路由配置已迁移到 routes.tsx
export default function App() {
  return null;
}
