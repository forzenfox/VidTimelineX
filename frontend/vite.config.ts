import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // 自定义域名配置
  const customDomain = env.VITE_CUSTOM_DOMAIN;
  const baseUrl = customDomain ? `https://${customDomain}/` : env.VITE_BASE_URL || "/";

  return {
    base: baseUrl,
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
      }),
    ],
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      target: "esnext",
      outDir: "build",
      rollupOptions: {
        output: {
          assetFileNames: "assets/[name]-[hash:8].[ext]",
          chunkFileNames: "chunks/[name]-[hash:8].js",
          entryFileNames: "entry/[name]-[hash:8].js",
        },
      },
      minify: "esbuild",
      cssCodeSplit: true,
      brotliSize: true,
      sourcemap: false,
      emptyOutDir: true,
    },
    server: {
      port: 3000,
      open: true,
      proxy: {
        "/bilibili-img": {
          target: "https://i1.hdslb.com",
          changeOrigin: true,
          secure: false,
          rewrite: path => path.replace(/^\/bilibili-img/, ""),
          configure: proxy => {
            proxy.on("proxyReq", proxyReq => {
              proxyReq.setHeader("Referer", "https://www.bilibili.com/");
              proxyReq.setHeader("Origin", "https://www.bilibili.com");
            });
          },
        },
        "/unsplash": {
          target: "https://images.unsplash.com",
          changeOrigin: true,
          secure: false,
          rewrite: path => path.replace(/^\/unsplash/, ""),
          configure: proxy => {
            proxy.on("proxyReq", proxyReq => {
              proxyReq.setHeader("Referer", "https://images.unsplash.com/");
              proxyReq.setHeader("Origin", "https://images.unsplash.com");
            });
          },
        },
      },
    },
    optimizeDeps: {
      include: ["react", "react-dom", "react-router-dom", "@tanstack/react-query"],
      exclude: ["@radix-ui/react-*"],
      esbuildOptions: {
        target: "esnext",
        define: {
          "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
        },
        treeShaking: true,
      },
    },
  };
});
