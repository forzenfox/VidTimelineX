import { Routes, Route, Link, Suspense } from "react-router-dom";
import { Home, PlayCircle } from "lucide-react";

// 使用 React.lazy 懒加载组件
const Lvjiang = React.lazy(() => import("./Lvjiang"));
const Tiantong = React.lazy(() => import("./Tiantong"));

// 加载中组件
const Loading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600">加载中...</p>
    </div>
  </div>
);

// 首页组件
const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-3xl">
        {/* 标题区域 */}
        <h1 className="text-5xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          哔哩哔哩时间线
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          探索哔哩哔哩视频集，发现精彩内容
        </p>
        
        {/* 导航卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
        </div>
        
        {/* 页脚 */}
        <footer className="mt-16 text-gray-500 text-sm">
          <p>© 2024 哔哩哔哩时间线 - 探索精彩视频内容</p>
        </footer>
      </div>
    </div>
  );
};

// 主应用组件
export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/lvjiang" element={<Lvjiang />} />
        <Route path="/tiantong" element={<Tiantong />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Suspense>
  );
}
