import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  // 配置静态资源基础路径，用于GitHub Pages部署
  base: '/', // 如果部署到GitHub Pages的子目录，需要修改为'/仓库名称/'
})
