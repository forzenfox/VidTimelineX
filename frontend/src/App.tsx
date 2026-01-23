import { Routes, Route } from "react-router-dom";

// 主页组件
const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Bilibili Timeline</h1>
        <p className="text-xl text-gray-600 mb-8">欢迎使用统一后的Bilibili Timeline应用</p>
        <div className="flex flex-wrap justify-center gap-4">
          <a 
            href="/lvjiang" 
            className="px-6 py-3 rounded-full font-bold bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            进入Lvjiang功能
          </a>
          <a 
            href="/tiantong" 
            className="px-6 py-3 rounded-full font-bold bg-green-500 text-white hover:bg-green-600 transition-colors"
          >
            进入Tiantong功能
          </a>
        </div>
      </div>
    </div>
  );
};

// Lvjiang项目页面
const LvjiangPage = () => {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Lvjiang项目功能</h1>
      <p className="text-gray-600">这里将集成Lvjiang项目的核心功能</p>
    </div>
  );
};

// Tiantong项目页面
const TiantongPage = () => {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Tiantong项目功能</h1>
      <p className="text-gray-600">这里将集成Tiantong项目的核心功能</p>
    </div>
  );
};

// 404页面
const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">页面未找到</p>
        <a 
          href="/" 
          className="px-6 py-3 rounded-full font-bold bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          返回首页
        </a>
      </div>
    </div>
  );
};

// 主应用组件
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/lvjiang" element={<LvjiangPage />} />
      <Route path="/tiantong" element={<TiantongPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}