import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  define: {
    // 为构建提供默认环境变量
    'import.meta.env.VITE_SUPABASE_URL': process.env.VITE_SUPABASE_URL ? `"${process.env.VITE_SUPABASE_URL}"` : '"https://placeholder.supabase.co"',
    'import.meta.env.VITE_SUPABASE_ANON_KEY': process.env.VITE_SUPABASE_ANON_KEY ? `"${process.env.VITE_SUPABASE_ANON_KEY}"` : '"placeholder_key"',
  },
})

