import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // 👈 bind to all network interfaces
    port: 3000,      // 👈 optional (default), explicitly set
    strictPort: true // 👈 optional: prevent auto-incrementing port
  }
})
