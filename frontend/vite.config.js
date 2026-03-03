import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // 0.0.0.0 → accept external connections
    port: 5173,
    strictPort: true,
    cors: true,
    // explicitly allow HTTP
    https: false,
    allowedHosts: "all"
  }
})
