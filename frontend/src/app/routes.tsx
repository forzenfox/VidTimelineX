import React from "react";
import { Routes, Route } from "react-router-dom";

// 懒加载组件
const HomePage = React.lazy(() => import("./App").then(module => ({ default: module.HomePage })));
const LvjiangPage = React.lazy(() => import("../features/lvjiang/LvjiangPage"));
const TiantongPage = React.lazy(() => import("../features/tiantong/TiantongPage"));

// 加载中组件
const Loading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600">加载中...</p>
    </div>
  </div>
);

// 路由配置
const AppRoutes = () => {
  return (
    <React.Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/lvjiang" element={<LvjiangPage />} />
        <Route path="/tiantong" element={<TiantongPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </React.Suspense>
  );
};

export default AppRoutes;
