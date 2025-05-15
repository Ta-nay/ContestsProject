import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/contests': {
        target: 'http://localhost:3069',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
