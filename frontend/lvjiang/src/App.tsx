import { Routes, Route, Link } from "react-router-dom";
import { Home, PlayCircle } from "lucide-react";
import Lvjiang from "./Lvjiang";

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
          
          {/* 其他视频集卡片（占位） */}
          <div className="p-8 bg-white rounded-2xl shadow-xl border-2 border-gray-100 opacity-75">
            <div className="flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <PlayCircle size={48} className="text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-gray-800">更多视频集</h2>
              <p className="text-gray-500 text-center">
                敬请期待更多精彩视频集内容
              </p>
            </div>
          </div>
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
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/lvjiang" element={<Lvjiang />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}
