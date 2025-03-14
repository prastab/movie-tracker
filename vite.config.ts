import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Change this to your backend server port
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')  // Optional: removes the /api prefix when forwarding
      }
    }
  }
})