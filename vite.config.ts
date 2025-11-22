import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    hmr: true,
    proxy: {
      "/api": {
        target: "http://localhost:8081",//调用微服务版本的 后端要讲这里改成7071端口
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/admin'),
      }
    }
  },
})
