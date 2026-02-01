import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const customDomain = env.VITE_CUSTOM_DOMAIN;
  const baseUrl = customDomain ? `https://${customDomain}/` : env.VITE_BASE_URL || "/";

  return {
    base: baseUrl,
    plugins: [
      react({
        router: {
          prefetchLinks: true,
        },
      }),
      tailwindcss(),
      ViteImageOptimizer({
        png: { quality: 80 },
        jpeg: { quality: 80 },
        jpg: { quality: 80 },
        webp: { quality: 85 },
        gif: { quality: 70 },
      }),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: [
          "favicon.ico",
          "favicon-32x32.png",
          "favicon-16x16.png",
          "apple-touch-icon.png",
          "android-chrome-192x192.png",
          "android-chrome-512x512.png",
          "thumbs/**/*.{jpg,png,svg}",
        ],
        manifest: {
          name: "哔哩哔哩时间线",
          short_name: "时间线",
          description: "探索驴酱和甜筒的精彩视频内容",
          theme_color: "#ff6b00",
          background_color: "#ffffff",
          display: "standalone",
          orientation: "landscape",
          scope: "/",
          start_url: "/",
          lang: "zh-CN",
          categories: ["entertainment", "video"],
          icons: [
            {
              src: "/android-chrome-192x192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any maskable",
            },
            {
              src: "/android-chrome-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
            },
            {
              src: "/apple-touch-icon.png",
              sizes: "180x180",
              type: "image/png",
              purpose: "apple-touch-icon",
            },
          ],
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
          runtimeCaching: [
            {
              urlPattern: ({ url }) => url.hostname.includes("hdslb.com"),
              handler: "CacheFirst",
              options: {
                cacheName: "bilibili-cdn-images",
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 7,
                },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern: ({ url }) => url.pathname.startsWith("/thumbs/"),
              handler: "CacheFirst",
              options: {
                cacheName: "local-thumbnails",
                expiration: {
                  maxEntries: 200,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
          ],
          cleanupOutdatedCaches: true,
          skipWaiting: true,
          clientsClaim: true,
        },
        devOptions: {
          enabled: false,
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
