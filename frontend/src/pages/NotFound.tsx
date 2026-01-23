import React from 'react';
import { Link } from 'react-router-dom';

/**
 * 404页面 - 处理无效URL访问
 */
const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        {/* 404错误图标 */}
        <div className="text-12xl mb-6">❌</div>
        
        {/* 错误标题和描述 */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          404 - 页面未找到
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          抱歉，您访问的页面不存在或已被移除。
        </p>
        
        {/* 返回导航页面按钮 */}
        <Link
          to="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
        >
          返回导航页面
        </Link>
        
        {/* 可能的原因提示 */}
        <div className="mt-12 text-gray-500">
          <p className="mb-2">可能的原因：</p>
          <ul className="list-disc list-inside space-y-1">
            <li>URL输入错误</li>
            <li>页面已被移除</li>
            <li>链接已过期</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotFound;