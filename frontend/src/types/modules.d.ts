// 声明文件，支持导入文本文件
declare module "*.txt?raw" {
  const content: string;
  export default content;
}

// 声明文件，支持导入JSON文件
declare module "*.json" {
  const content: unknown;
  export default content;
}

// 声明 import.meta 环境变量类型
interface ImportMetaEnv {
  readonly BASE_URL: string;
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
