
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import path from 'path';

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    ViteImageOptimizer({
      png: {
        quality: 80,
      },
      jpeg: {
        quality: 80,
      },
      jpg: {
        quality: 80,
      },
      webp: {
        quality: 85,
      },
      gif: {
        quality: 70,
      },
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'build',
    // 代码分割配置
    rollupOptions: {
      output: {
        // 代码分割策略
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-*', 'lucide-react'],
          'state-vendor': ['@tanstack/react-query'],
          'util-vendor': ['date-fns', 'zod'],
        },
        // 静态资源命名
        assetFileNames: 'assets/[name]-[hash:8].[ext]',
        chunkFileNames: 'chunks/[name]-[hash:8].js',
        entryFileNames: 'entry/[name]-[hash:8].js',
      },
    },
    // 启用压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      mangle: {
        toplevel: true,
      },
    },
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 启用 brotli 压缩
    brotliSize: true,
    // 禁用 sourcemap
    sourcemap: false,
    // 启用 tree shaking
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    open: true,
  },
  // 优化依赖预构建
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
    exclude: ['@radix-ui/react-*'],
    esbuildOptions: {
      // 优化 ESBuild 配置
      target: 'esnext',
      define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      },
      // 启用 tree shaking
      treeShaking: true,
    },
  },
});
