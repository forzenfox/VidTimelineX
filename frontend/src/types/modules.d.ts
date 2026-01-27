// 声明文件，支持导入文本文件
declare module '*.txt?raw' {
  const content: string;
  export default content;
}

// 声明文件，支持导入JSON文件
declare module '*.json' {
  const content: any;
  export default content;
}
