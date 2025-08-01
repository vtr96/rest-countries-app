// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    root: path.resolve(__dirname, 'frontend'),
    plugins: [react()],
    publicDir: path.resolve(__dirname, 'frontend/public'),
    build: {
        outDir: path.resolve(__dirname, 'frontend/dist')
    }
})