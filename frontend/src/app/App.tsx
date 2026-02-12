import React from "react";
import { Link } from "react-router-dom";
import { Users, Heart, Crown, Sparkles } from "lucide-react";

// 首页组件
export const HomePage = () => {
  return (
    <div
      className="min-h-screen relative overflow-hidden animate-gradient-flow"
      style={{
        background:
          "linear-gradient(135deg, #FDF2F8 0%, #FFF7ED 25%, #FEF3C7 50%, #FDF2F8 75%, #FFF7ED 100%)",
      }}
    >
      {/* 装饰性背景元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 浮动光斑 */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-300/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute top-40 right-20 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />

        {/* 网格纹理 */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* SEO Meta Tags */}
      <title>时光影像馆 - 珍藏每一个精彩瞬间</title>
      <meta
        name="description"
        content="珍藏每一个精彩瞬间，重温那些难忘时光。探索驴酱档案馆、甜筒时光机、C皇荣耀殿，发现更多精彩内容。"
      />
      <meta name="keywords" content="时光影像馆, 视频集, 驴酱, 甜筒, C皇, 洞主, 凯哥, 余小C" />
      <meta name="author" content="时光影像馆" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="时光影像馆 - 珍藏每一个精彩瞬间" />
      <meta property="og:description" content="珍藏每一个精彩瞬间，重温那些难忘时光" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://example.com" />

      {/* 主内容区 */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="text-center max-w-5xl w-full">
          {/* 标题区域 */}
          <div className="animate-fade-in-up mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
              <Sparkles className="w-4 h-4 text-pink-500" />
              <span className="text-sm font-medium text-gray-600">发现精彩 · 珍藏时光</span>
            </div>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 animate-fade-in-up delay-100">
            时光影像馆
          </h1>

          <p className="font-body text-xl sm:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto animate-fade-in-up delay-200">
            珍藏每一个精彩瞬间，重温那些难忘时光
          </p>

          {/* Bento Grid 导航卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* 驴酱档案馆卡片 */}
            <Link
              to="/lvjiang"
              className="group relative p-8 rounded-3xl glass-card card-lvjiang transition-all duration-500 hover:-translate-y-2 opacity-0 animate-fade-in-up delay-300"
              aria-label="进入驴酱档案馆"
            >
              {/* 悬停光效 */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:to-blue-600/5 transition-all duration-500" />

              <div className="relative flex flex-col items-center justify-center">
                {/* 图标容器 */}
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-blue-500/30 animate-float-glow">
                  <Users size={48} className="text-white" />
                </div>

                {/* 标签 */}
                <div className="flex gap-2 mb-4">
                  <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
                    搞笑
                  </span>
                  <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
                    热血
                  </span>
                </div>

                <h2 className="font-display text-2xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors">
                  驴酱档案馆
                </h2>

                <p className="text-gray-500 text-center text-sm leading-relaxed">
                  洞主、凯哥的经典时刻
                  <br />
                  笑点与热血并存
                </p>

                {/* 悬停箭头 */}
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-blue-500 text-sm font-medium flex items-center gap-1">
                    进入探索{" "}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </div>
            </Link>

            {/* 甜筒时光机卡片 */}
            <Link
              to="/tiantong"
              className="group relative p-8 rounded-3xl glass-card card-tiantong transition-all duration-500 hover:-translate-y-2 opacity-0 animate-fade-in-up delay-400"
              aria-label="进入甜筒时光机"
            >
              {/* 悬停光效 */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-pink-500/0 to-pink-500/0 group-hover:from-pink-500/10 group-hover:to-pink-600/5 transition-all duration-500" />

              <div className="relative flex flex-col items-center justify-center">
                {/* 图标容器 */}
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-pink-500/30">
                  <Heart size={48} className="text-white group-hover:animate-heartbeat" />
                </div>

                {/* 标签 */}
                <div className="flex gap-2 mb-4">
                  <span className="px-3 py-1 text-xs font-medium bg-pink-100 text-pink-600 rounded-full">
                    甜美
                  </span>
                  <span className="px-3 py-1 text-xs font-medium bg-pink-100 text-pink-600 rounded-full">
                    歌声
                  </span>
                </div>

                <h2 className="font-display text-2xl font-bold mb-3 text-gray-800 group-hover:text-pink-600 transition-colors">
                  甜筒时光机
                </h2>

                <p className="text-gray-500 text-center text-sm leading-relaxed">
                  亿口甜筒的甜美瞬间
                  <br />
                  歌声与舞姿交织
                </p>

                {/* 悬停箭头 */}
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-pink-500 text-sm font-medium flex items-center gap-1">
                    进入探索{" "}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </div>
            </Link>

            {/* C皇荣耀殿卡片 */}
            <Link
              to="/yuxiaoc"
              className="group relative p-8 rounded-3xl glass-card card-yuxiaoc transition-all duration-500 hover:-translate-y-2 opacity-0 animate-fade-in-up delay-500"
              aria-label="进入C皇荣耀殿"
            >
              {/* 悬停光效 */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-red-500/0 to-red-500/0 group-hover:from-red-500/10 group-hover:to-red-600/5 transition-all duration-500" />

              <div className="relative flex flex-col items-center justify-center">
                {/* 图标容器 */}
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-red-500/30">
                  <Crown size={48} className="text-white animate-crown-shine" />
                </div>

                {/* 标签 */}
                <div className="flex gap-2 mb-4">
                  <span className="px-3 py-1 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                    血怒
                  </span>
                  <span className="px-3 py-1 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                    高光
                  </span>
                </div>

                <h2 className="font-display text-2xl font-bold mb-3 text-gray-800 group-hover:text-red-600 transition-colors">
                  C皇荣耀殿
                </h2>

                <p className="text-gray-500 text-center text-sm leading-relaxed">
                  余小C的高光时刻
                  <br />
                  混与躺的艺术哲学
                </p>

                {/* 悬停箭头 */}
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-red-500 text-sm font-medium flex items-center gap-1">
                    进入探索{" "}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* 页脚 */}
          <footer className="mt-16 animate-fade-in-up delay-500">
            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
              <Sparkles className="w-4 h-4" />
              <span>© 2026 时光影像馆 · 用心记录每一份热爱</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

// 默认导出一个空组件，因为路由配置已迁移到 routes.tsx
export default function App() {
  return null;
}
