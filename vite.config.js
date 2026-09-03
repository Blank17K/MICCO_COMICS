import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    root: './frontEnd',
    plugins: [react()],
    server: {
        port: 3000,
        // If you're using Express on a different port, proxy API requests
        proxy: {
        '/api': {
            target: 'http://localhost:5000',
            changeOrigin: true,
        }
        }
    },
    build: {
        outDir: 'dist',
        // If your Express serves static files from a 'dist' folder
        emptyOutDir: true,
    }
})