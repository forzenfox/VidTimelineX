import React from 'react';
import { useDeviceDetect, useIsMobile, useIsTablet, useIsDesktop } from '@/hooks/use-mobile';
import { withDeviceSpecificComponent, useDynamicComponent } from '@/hooks/use-dynamic-component';

// 移动端组件示例
const MobileComponent = () => {
  return (
    <div className="bg-blue-100 p-4 rounded-lg">
      <h2 className="text-xl font-bold text-blue-800 mb-2">移动端组件</h2>
      <p className="text-blue-600">这是专门为移动端优化的组件，触摸友好，布局简洁。</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm">
          按钮1
        </button>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm">
          按钮2
        </button>
      </div>
    </div>
  );
};

// 平板组件示例
const TabletComponent = () => {
  return (
    <div className="bg-green-100 p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-green-800 mb-3">平板组件</h2>
      <p className="text-green-600 mb-4">这是专门为平板设备优化的组件，兼顾了屏幕空间和便携性。</p>
      <div className="grid grid-cols-3 gap-4">
        <button className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl">
          平板按钮1
        </button>
        <button className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl">
          平板按钮2
        </button>
        <button className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl">
          平板按钮3
        </button>
      </div>
    </div>
  );
};

// 桌面组件示例
const DesktopComponent = () => {
  return (
    <div className="bg-purple-100 p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-purple-800 mb-4">桌面端组件</h2>
      <p className="text-purple-600 mb-6">这是专门为桌面设备优化的组件，充分利用大屏幕空间，提供丰富的交互选项。</p>
      <div className="grid grid-cols-4 gap-5">
        <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-all hover:-translate-y-1">
          桌面按钮1
        </button>
        <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-all hover:-translate-y-1">
          桌面按钮2
        </button>
        <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-all hover:-translate-y-1">
          桌面按钮3
        </button>
        <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-all hover:-translate-y-1">
          桌面按钮4
        </button>
      </div>
    </div>
  );
};

// 使用高阶组件包装的设备特定组件
const DynamicComponentWithHOC = withDeviceSpecificComponent({
  mobile: MobileComponent,
  tablet: TabletComponent,
  desktop: DesktopComponent,
  fallback: <div className="bg-gray-100 p-4 rounded-lg">加载中...</div>
});

// 主演示组件
const DeviceDemo: React.FC = () => {
  const device = useDeviceDetect();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();
  
  // 使用动态加载钩子（模拟异步加载）
  const AsyncDynamicComponent = useDynamicComponent({
    mobile: () => Promise.resolve({ default: MobileComponent }),
    tablet: () => Promise.resolve({ default: TabletComponent }),
    desktop: () => Promise.resolve({ default: DesktopComponent })
  });

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">设备动态加载演示</h1>
      
      {/* 设备信息显示 */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-3 text-gray-700">当前设备信息</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-500">设备类型</div>
            <div className="font-bold text-lg text-blue-600">{device || '检测中...'}</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-sm text-gray-500">是否移动端</div>
            <div className={`font-bold text-lg ${isMobile ? 'text-green-600' : 'text-red-600'}`}>
              {isMobile ? '是' : '否'}
            </div>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg">
            <div className="text-sm text-gray-500">是否平板</div>
            <div className={`font-bold text-lg ${isTablet ? 'text-yellow-600' : 'text-red-600'}`}>
              {isTablet ? '是' : '否'}
            </div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="text-sm text-gray-500">是否桌面端</div>
            <div className={`font-bold text-lg ${isDesktop ? 'text-purple-600' : 'text-red-600'}`}>
              {isDesktop ? '是' : '否'}
            </div>
          </div>
        </div>
      </div>
      
      {/* 静态设备特定组件演示 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">静态设备特定组件</h2>
        <p className="text-gray-600 mb-4">使用高阶组件 withDeviceSpecificComponent 实现</p>
        <DynamicComponentWithHOC />
      </div>
      
      {/* 异步动态加载组件演示 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">异步动态加载组件</h2>
        <p className="text-gray-600 mb-4">使用钩子 useDynamicComponent 实现，支持懒加载</p>
        <AsyncDynamicComponent />
      </div>
      
      {/* 响应式设计演示 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">传统响应式设计对比</h2>
        <p className="text-gray-600 mb-4">使用 CSS 媒体查询实现的响应式布局</p>
        <div className="bg-orange-100 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-orange-800 mb-3">响应式容器</h3>
          <p className="text-orange-600 mb-4">这个容器会根据屏幕尺寸自动调整布局和样式。</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="bg-orange-200 p-3 rounded-lg text-center">
              <span className="font-bold">1</span>
            </div>
            <div className="bg-orange-200 p-3 rounded-lg text-center">
              <span className="font-bold">2</span>
            </div>
            <div className="bg-orange-200 p-3 rounded-lg text-center">
              <span className="font-bold">3</span>
            </div>
            <div className="bg-orange-200 p-3 rounded-lg text-center">
              <span className="font-bold">4</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 技术说明 */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">技术实现说明</h2>
        <div className="space-y-3 text-gray-600">
          <p>1. <strong>设备检测</strong>：使用 window.matchMedia API 监听断点变化，性能更优</p>
          <p>2. <strong>组件加载策略</strong>：</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>移动端：加载轻量级组件，优化触摸体验</li>
            <li>平板：兼顾屏幕空间和便携性</li>
            <li>桌面端：充分利用大屏幕，提供丰富功能</li>
          </ul>
          <p>3. <strong>懒加载支持</strong>：使用 React.lazy 和 Suspense 实现组件异步加载</p>
          <p>4. <strong>向后兼容</strong>：保持原有 useIsMobile 钩子的功能不变</p>
        </div>
      </div>
    </div>
  );
};

export default DeviceDemo;
