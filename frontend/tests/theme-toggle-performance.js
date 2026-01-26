// 主题切换性能测试脚本
// 在浏览器控制台中运行此脚本进行性能测试

console.log('=== 主题切换性能测试 ===');

// 测试函数
async function testThemeTogglePerformance(pageUrl, toggleSelector, testName) {
  console.log(`\n开始测试: ${testName}`);
  
  // 打开新标签页
  const newTab = window.open(pageUrl, '_blank');
  
  // 等待页面加载完成
  await new Promise(resolve => {
    newTab.onload = resolve;
  });
  
  // 执行主题切换测试
  const toggleButton = newTab.document.querySelector(toggleSelector);
  
  if (!toggleButton) {
    console.error(`未找到主题切换按钮: ${toggleSelector}`);
    newTab.close();
    return;
  }
  
  // 执行5次主题切换，测量平均时间
  const toggleTimes = [];
  
  for (let i = 0; i < 5; i++) {
    // 使用Performance API测量主题切换时间
    performance.mark('theme-toggle-start');
    
    // 点击主题切换按钮
    toggleButton.click();
    
    // 等待主题切换动画完成
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    performance.mark('theme-toggle-end');
    performance.measure('theme-toggle', 'theme-toggle-start', 'theme-toggle-end');
    
    // 获取测量结果
    const measures = performance.getEntriesByName('theme-toggle');
    const duration = measures[measures.length - 1].duration;
    toggleTimes.push(duration);
    
    console.log(`第 ${i + 1} 次主题切换耗时: ${duration.toFixed(2)}ms`);
  }
  
  // 计算平均时间
  const averageTime = toggleTimes.reduce((sum, time) => sum + time, 0) / toggleTimes.length;
  console.log(`\n${testName} 平均主题切换时间: ${averageTime.toFixed(2)}ms`);
  
  // 关闭测试标签页
  newTab.close();
  
  return averageTime;
}

// 运行测试
async function runTests() {
  // 测试甜筒页面
  const tiantongAverage = await testThemeTogglePerformance(
    'http://localhost:3001/tiantong',
    '.flex-1 > .flex-shrink-0 > .flex-shrink-0 > button',
    '甜筒页面'
  );
  
  // 测试驴酱页面
  const lvjiangAverage = await testThemeTogglePerformance(
    'http://localhost:3001/lvjiang',
    '.flex.items-center.justify-center > button',
    '驴酱页面'
  );
  
  console.log('\n=== 性能测试总结 ===');
  console.log(`甜筒页面平均主题切换时间: ${tiantongAverage.toFixed(2)}ms`);
  console.log(`驴酱页面平均主题切换时间: ${lvjiangAverage.toFixed(2)}ms`);
  
  // 清除性能标记和测量
  performance.clearMarks();
  performance.clearMeasures();
}

// 启动测试
runTests();
