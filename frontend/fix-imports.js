const fs = require('fs');
const path = require('path');

// 正则表达式匹配带版本号的导入路径
const versionImportRegex = /from "([^"]+)@([0-9.]+)"/g;

// 递归遍历目录
function walk(dir, callback) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walk(filePath, callback);
    } else if (stat.isFile() && (file.endsWith('.ts') || file.endsWith('.tsx'))) {
      callback(filePath);
    }
  });
}

// 修复单个文件的导入路径
function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // 替换所有带版本号的导入路径
  content = content.replace(versionImportRegex, (match, modulePath) => {
    return `from "${modulePath}"`;
  });
  
  // 如果文件内容有变化，保存修改
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed imports in: ${filePath}`);
  }
}

// 开始修复
const srcDir = path.join(__dirname, 'src');
console.log('Starting to fix import paths...');
walk(srcDir, fixFile);
console.log('Fixing import paths completed!');
