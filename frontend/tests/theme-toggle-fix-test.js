// 主题切换修复测试脚本
// 在浏览器控制台中运行此脚本，测试甜筒页面的主题切换功能

console.log('=== 甜筒页面主题切换修复测试 ===');

// 测试函数
async function testThemeToggle() {
  console.log('开始测试甜筒页面主题切换功能...');
  
  // 检查当前主题
  const currentTheme = document.documentElement.classList.contains('theme-sweet') ? 'sweet' : 'tiger';
  console.log(`当前主题: ${currentTheme}`);
  
  // 查找主题切换按钮
  const themeToggleButton = document.querySelector('.flex-1 > .flex-shrink-0 > .flex-shrink-0 > button');
  
  if (!themeToggleButton) {
    console.error('未找到主题切换按钮');
    return;
  }
  
  // 点击主题切换按钮
  themeToggleButton.click();
  console.log('点击主题切换按钮');
  
  // 等待主题切换完成
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 检查主题是否切换
  const newTheme = document.documentElement.classList.contains('theme-sweet') ? 'sweet' : 'tiger';
  console.log(`切换后主题: ${newTheme}`);
  
  // 验证主题是否切换成功
  if (newTheme !== currentTheme) {
    console.log('✅ 主题切换成功！');
    
    // 再次点击切换回原主题
    themeToggleButton.click();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const finalTheme = document.documentElement.classList.contains('theme-sweet') ? 'sweet' : 'tiger';
    console.log(`最终主题: ${finalTheme}`);
    
    if (finalTheme === currentTheme) {
      console.log('✅ 主题切换双向功能正常！');
      return true;
    } else {
      console.error('❌ 主题切换回原主题失败！');
      return false;
    }
  } else {
    console.error('❌ 主题切换失败！');
    return false;
  }
}

// 运行测试
async function runTest() {
  // 确保我们在甜筒页面
  if (window.location.pathname !== '/tiantong') {
    console.log('正在跳转到甜筒页面...');
    window.location.href = 'http://localhost:3001/tiantong';
    
    // 等待页面加载完成
    window.onload = async () => {
      const result = await testThemeToggle();
      console.log(result ? '测试通过！' : '测试失败！');
    };
  } else {
    const result = await testThemeToggle();
    console.log(result ? '测试通过！' : '测试失败！');
  }
}

// 启动测试
runTest();
