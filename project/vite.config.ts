import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5000,
  },
  build: {
    outDir: 'dist',
    commonjsOptions: {
      transformMixedEsModules: true
    },
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      },
      external: (id) => {
        // Exclude Expo Router and React Native dependencies from web build
        return id.includes('expo-router') || 
               id.includes('react-native') ||
               id.includes('@expo/') ||
               id.includes('expo-')
      }
    }
  },
  publicDir: 'src/public',
  optimizeDeps: {
    exclude: ['expo-router', 'react-native']
  }
})
