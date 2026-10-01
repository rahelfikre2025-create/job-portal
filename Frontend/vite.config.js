import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  envDir: path.resolve(__dirname, ".."),
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // Proxy API requests during development to backend
      '/api': {
        target: 'http://localhost:5011',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})