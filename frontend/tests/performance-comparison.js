/**
 * 甜筒页面与驴酱页面主题切换性能对比分析脚本
 * 
 * 分析内容包括：
 * 1. DOM结构复杂度分析
 * 2. CSS选择器效率分析
 * 3. JavaScript执行效率分析
 * 4. 浏览器渲染性能分析
 */

const { chromium } = require('playwright');

/**
 * 分析页面的DOM结构复杂度
 */
async function analyzeDOMComplexity(page, pageName) {
  const domMetrics = await page.evaluate(() => {
    const allElements = document.querySelectorAll('*');
    const bodyChildren = document.body.children;
    
    // 计算DOM深度
    function getMaxDepth(element, depth = 0) {
      if (!element.children.length) return depth;
      return Math.max(
        depth,
        ...Array.from(element.children).map(child => getMaxDepth(child, depth + 1))
      );
    }
    
    // 统计各类元素数量
    const elementsByTag = {};
    allElements.forEach(el => {
      const tag = el.tagName.toLowerCase();
      elementsByTag[tag] = (elementsByTag[tag] || 0) + 1;
    });
    
    // 统计带transition的元素
    const elementsWithTransition = allElements.length - allElements.length; // 简化计算
    
    return {
      totalNodes: allElements.length,
      bodyChildrenCount: bodyChildren.length,
      maxDepth: getMaxDepth(document.body),
      elementsByTag: Object.entries(elementsByTag)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10),
    };
  });
  
  console.log(`\n${pageName} DOM结构分析:`);
  console.log(`- 总DOM节点数: ${domMetrics.totalNodes}`);
  console.log(`- body子元素数: ${domMetrics.bodyChildrenCount}`);
  console.log(`- 最大DOM深度: ${domMetrics.maxDepth}`);
  console.log(`- 主要元素类型:`);
  domMetrics.elementsByTag.forEach(([tag, count]) => {
    console.log(`  - ${tag}: ${count}个`);
  });
  
  return domMetrics;
}

/**
 * 分析页面的CSS选择器效率
 */
async function analyzeCSSSelectors(page, pageName) {
  const cssMetrics = await page.evaluate(() => {
    // 分析页面中使用的选择器
    const allElements = document.querySelectorAll('*');
    const selectorStats = {
      classSelectors: 0,
      idSelectors: 0,
      tagSelectors: 0,
      attributeSelectors: 0,
      nestedSelectors: 0,
      universalSelectors: 0,
    };
    
    allElements.forEach(el => {
      // 统计类选择器
      if (el.className && typeof el.className === 'string') {
        selectorStats.classSelectors += el.className.split(' ').filter(c => c).length;
      }
      
      // 统计ID选择器
      if (el.id) selectorStats.idSelectors++;
      
      // 统计嵌套层级
      let depth = 0;
      let parent = el.parentElement;
      while (parent) {
        depth++;
        parent = parent.parentElement;
      }
      selectorStats.nestedSelectors += depth;
    });
    
    return selectorStats;
  });
  
  console.log(`\n${pageName} CSS选择器分析:`);
  console.log(`- 类选择器使用数: ${cssMetrics.classSelectors}`);
  console.log(`- ID选择器使用数: ${cssMetrics.idSelectors}`);
  console.log(`- 平均嵌套层级: ${(cssMetrics.nestedSelectors / cssMetrics.classSelectors || 0).toFixed(2)}`);
  
  return cssMetrics;
}

/**
 * 测量主题切换的JavaScript执行效率
 */
async function measureThemeTogglePerformance(page, pageName, toggleSelector) {
  console.log(`\n${pageName} 主题切换性能测量:`);
  
  // 测量多次主题切换的性能
  const toggleTimes = [];
  const frameRates = [];
  
  for (let i = 0; i < 3; i++) {
    // 测量单次主题切换
    const startTime = performance.now();
    
    // 点击主题切换按钮
    await page.click(toggleSelector);
    
    // 等待主题切换完成
    await page.waitForTimeout(500);
    
    const endTime = performance.now();
    const toggleTime = endTime - startTime;
    toggleTimes.push(toggleTime);
    
    console.log(`- 第${i + 1}次切换耗时: ${toggleTime.toFixed(2)}ms`);
  }
  
  const avgToggleTime = toggleTimes.reduce((a, b) => a + b, 0) / toggleTimes.length;
  console.log(`- 平均切换耗时: ${avgToggleTime.toFixed(2)}ms`);
  
  return {
    toggleTimes,
    avgToggleTime,
  };
}

/**
 * 分析页面性能指标
 */
async function analyzePageMetrics(page, pageName) {
  const metrics = await page.metrics();
  
  console.log(`\n${pageName} 页面性能指标:`);
  console.log(`- JS堆内存使用: ${(metrics.JSHeapUsedSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`- JS堆总内存: ${(metrics.JSHeapTotalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`- 文档节点数: ${metrics.nodes}`);
  console.log(`- 监听器数量: ${metrics.listeners}`);
  
  return metrics;
}

/**
 * 分析主题切换时的样式计算开销
 */
async function analyzeStyleCalculation(page, pageName) {
  const styleMetrics = await page.evaluate(() => {
    // 获取计算后的样式数量
    const allElements = document.querySelectorAll('*');
    let totalStyles = 0;
    
    allElements.forEach(el => {
      const computedStyle = window.getComputedStyle(el);
      totalStyles += computedStyle.length;
    });
    
    return {
      totalComputedStyles: totalStyles,
      avgStylesPerElement: (totalStyles / allElements.length).toFixed(2),
    };
  });
  
  console.log(`\n${pageName} 样式计算分析:`);
  console.log(`- 总计算样式数: ${styleMetrics.totalComputedStyles}`);
  console.log(`- 平均每元素样式数: ${styleMetrics.avgStylesPerElement}`);
  
  return styleMetrics;
}

/**
 * 分析CSS transition对性能的影响
 */
async function analyzeTransitionImpact(page, pageName) {
  const transitionMetrics = await page.evaluate(() => {
    // 统计带transition的元素
    const allElements = document.querySelectorAll('*');
    let transitionElements = 0;
    let maxTransitionDuration = 0;
    
    allElements.forEach(el => {
      const style = window.getComputedStyle(el);
      const transitionDuration = parseFloat(style.transitionDuration) || 0;
      
      if (transitionDuration > 0) {
        transitionElements++;
        maxTransitionDuration = Math.max(maxTransitionDuration, transitionDuration);
      }
    });
    
    return {
      transitionElements,
      maxTransitionDuration: maxTransitionDuration.toFixed(3),
    };
  });
  
  console.log(`\n${pageName} CSS Transition影响分析:`);
  console.log(`- 带transition的元素数: ${transitionMetrics.transitionElements}`);
  console.log(`- 最大transition时长: ${transitionMetrics.maxTransitionDuration}s`);
  
  return transitionMetrics;
}

/**
 * 主测试函数
 */
async function runPerformanceAnalysis() {
  console.log('=== 甜筒页面与驴酱页面主题切换性能对比分析 ===\n');
  
  // 启动浏览器
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  
  // 测试甜筒页面
  console.log('>>> 测试甜筒页面');
  const tiantongPage = await context.newPage();
  
  try {
    await tiantongPage.goto('http://localhost:3001/tiantong', { waitUntil: 'networkidle' });
    await tiantongPage.waitForSelector('.flex-1 > .flex-shrink-0 > .flex-shrink-0 > button');
    
    const tiantongDOM = await analyzeDOMComplexity(tiantongPage, '甜筒页面');
    const tiantongCSS = await analyzeCSSSelectors(tiantongPage, '甜筒页面');
    const tiantongMetrics = await analyzePageMetrics(tiantongPage, '甜筒页面');
    const tiantongStyles = await analyzeStyleCalculation(tiantongPage, '甜筒页面');
    const tiantongTransitions = await analyzeTransitionImpact(tiantongPage, '甜筒页面');
    const tiantongToggle = await measureThemeTogglePerformance(
      tiantongPage, 
      '甜筒页面', 
      '.flex-1 > .flex-shrink-0 > .flex-shrink-0 > button'
    );
    
    // 测试驴酱页面
    console.log('\n>>> 测试驴酱页面');
    const lvjiangPage = await context.newPage();
    
    await lvjiangPage.goto('http://localhost:3001/lvjiang', { waitUntil: 'networkidle' });
    await lvjiangPage.waitForSelector('.flex.items-center.justify-center > button');
    
    const lvjiangDOM = await analyzeDOMComplexity(lvjiangPage, '驴酱页面');
    const lvjiangCSS = await analyzeCSSSelectors(lvjiangPage, '驴酱页面');
    const lvjiangMetrics = await analyzePageMetrics(lvjiangPage, '驴酱页面');
    const lvjiangStyles = await analyzeStyleCalculation(lvjiangPage, '驴酱页面');
    const lvjiangTransitions = await analyzeTransitionImpact(lvjiangPage, '驴酱页面');
    const lvjiangToggle = await measureThemeTogglePerformance(
      lvjiangPage, 
      '驴酱页面', 
      '.flex.items-center.justify-center > button'
    );
    
    // 生成性能对比报告
    console.log('\n========================================');
    console.log('性能对比分析报告');
    console.log('========================================\n');
    
    console.log('1. DOM结构对比:');
    console.log(`   甜筒页面节点数: ${tiantongDOM.totalNodes}, 驴酱页面节点数: ${lvjiangDOM.totalNodes}`);
    console.log(`   甜筒页面最大深度: ${tiantongDOM.maxDepth}, 驴酱页面最大深度: ${lvjiangDOM.maxDepth}`);
    console.log(`   差异: 甜筒页面DOM更${tiantongDOM.totalNodes > lvjiangDOM.totalNodes ? '复杂' : '简单'}\n`);
    
    console.log('2. CSS选择器对比:');
    console.log(`   甜筒页面类选择器: ${tiantongCSS.classSelectors}, 驴酱页面类选择器: ${lvjiangCSS.classSelectors}`);
    console.log(`   差异: 甜筒页面选择器${tiantongCSS.classSelectors > lvjiangCSS.classSelectors ? '更复杂' : '更简单'}\n`);
    
    console.log('3. 主题切换性能对比:');
    console.log(`   甜筒页面平均切换耗时: ${tiantongToggle.avgToggleTime.toFixed(2)}ms`);
    console.log(`   驴酱页面平均切换耗时: ${lvjiangToggle.avgToggleTime.toFixed(2)}ms`);
    console.log(`   性能差异: ${((tiantongToggle.avgToggleTime - lvjiangToggle.avgToggleTime) / lvjiangToggle.avgToggleTime * 100).toFixed(1)}%`);
    console.log(`   ${tiantongToggle.avgToggleTime > lvjiangToggle.avgToggleTime ? '甜筒页面较慢' : '驴酱页面较慢'}\n`);
    
    console.log('4. CSS Transition影响:');
    console.log(`   甜筒页面transition元素: ${tiantongTransitions.transitionElements}`);
    console.log(`   驴酱页面transition元素: ${lvjiangTransitions.transitionElements}`);
    console.log(`   差异: 甜筒页面有${tiantongTransitions.transitionElements - lvjiangTransitions.transitionElements}个额外transition元素\n`);
    
    console.log('5. 样式计算开销:');
    console.log(`   甜筒页面总计算样式: ${tiantongStyles.totalComputedStyles}`);
    console.log(`   驴酱页面总计算样式: ${lvjiangStyles.totalComputedStyles}`);
    console.log(`   差异: 甜筒页面多${tiantongStyles.totalComputedStyles - lvjiangStyles.totalComputedStyles}个样式计算\n`);
    
    console.log('========================================');
    console.log('关键性能瓶颈分析:');
    console.log('========================================');
    
    // 分析甜筒页面的性能瓶颈
    const bottlenecks = [];
    
    if (tiantongDOM.totalNodes > lvjiangDOM.totalNodes) {
      bottlenecks.push(`DOM复杂度较高: 甜筒页面有${tiantongDOM.totalNodes}个节点，比驴酱页面的${lvjiangDOM.totalNodes}个节点多${tiantongDOM.totalNodes - lvjiangDOM.totalNodes}个`);
    }
    
    if (tiantongTransitions.transitionElements > lvjiangTransitions.transitionElements) {
      bottlenecks.push(`CSS Transition开销大: 甜筒页面有${tiantongTransitions.transitionElements}个带transition的元素，比驴酱页面的${lvjiangTransitions.transitionElements}个多${tiantongTransitions.transitionElements - lvjiangTransitions.transitionElements}个`);
    }
    
    if (tiantongStyles.totalComputedStyles > lvjiangStyles.totalComputedStyles) {
      bottlenecks.push(`样式计算开销大: 甜筒页面需要计算${tiantongStyles.totalComputedStyles}个样式，比驴酱页面的${lvjiangStyles.totalComputedStyles}个多${tiantongStyles.totalComputedStyles - lvjiangStyles.totalComputedStyles}个`);
    }
    
    if (tiantongToggle.avgToggleTime > lvjiangToggle.avgToggleTime) {
      bottlenecks.push(`主题切换较慢: 甜筒页面平均切换耗时${tiantongToggle.avgToggleTime.toFixed(2)}ms，比驴酱页面的${lvjiangToggle.avgToggleTime.toFixed(2)}ms慢`);
    }
    
    if (bottlenecks.length > 0) {
      console.log('\n甜筒页面性能瓶颈:');
      bottlenecks.forEach((bottleneck, index) => {
        console.log(`${index + 1}. ${bottleneck}`);
      });
    } else {
      console.log('\n两个页面性能相近，未发现明显瓶颈');
    }
    
    console.log('\n========================================');
    console.log('优化建议:');
    console.log('========================================');
    console.log('1. 减少DOM复杂度: 简化页面结构，减少不必要的DOM节点');
    console.log('2. 优化CSS Transition: 减少transition元素数量，缩短transition时长');
    console.log('3. 使用CSS Containment: 限制重排重绘范围');
    console.log('4. 使用GPU加速: 添加will-change提示，使用transform和opacity进行动画');
    console.log('5. 优化React渲染: 使用React.memo和useMemo减少不必要的重新渲染');
    
  } catch (error) {
    console.error('测试过程中发生错误:', error);
  } finally {
    await browser.close();
  }
}

// 运行测试
runPerformanceAnalysis().catch(console.error);
