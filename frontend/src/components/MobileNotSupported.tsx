import React from "react";
import { Monitor, Smartphone, AlertCircle } from "lucide-react";

/**
 * 移动端不支持提示组件
 * 当用户使用移动设备访问时显示此页面
 */
const MobileNotSupported: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center border border-gray-100">
          {/* 图标区域 */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <Smartphone size={48} className="text-blue-600" />
              </div>
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                <AlertCircle size={20} className="text-white" />
              </div>
            </div>
          </div>

          {/* 标题 */}
          <h1 className="text-2xl font-bold text-gray-800 mb-3">移动端暂不支持</h1>

          {/* 说明文字 */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            本网站目前仅支持桌面端和平板端访问，移动端体验可能不佳。
          </p>

          {/* 建议区域 */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Monitor size={24} className="text-blue-600" aria-label="monitor icon" />
              <h2 className="text-lg font-semibold text-gray-800">建议使用PC端访问</h2>
            </div>
            <p className="text-sm text-gray-600">
              为了获得最佳体验，请使用电脑或平板设备访问本网站
            </p>
          </div>

          {/* 功能特点 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-2xl mb-2">🎬</div>
              <div className="text-sm font-medium text-gray-700">高清视频</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-2xl mb-2">💬</div>
              <div className="text-sm font-medium text-gray-700">弹幕互动</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-2xl mb-2">🎨</div>
              <div className="text-sm font-medium text-gray-700">主题切换</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-2xl mb-2">🔍</div>
              <div className="text-sm font-medium text-gray-700">智能搜索</div>
            </div>
          </div>

          {/* 底部提示 */}
          <div className="text-xs text-gray-400">如有疑问，请联系网站管理员</div>
        </div>

        {/* 页脚 */}
        <div className="text-center mt-6 text-sm text-gray-500">
          © 2026 哔哩哔哩时间线 - 探索精彩视频内容
        </div>
      </div>
    </div>
  );
};

export default MobileNotSupported;
