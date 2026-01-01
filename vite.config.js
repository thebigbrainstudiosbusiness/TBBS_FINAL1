import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
  build: {
    sourcemap: false,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react'],
          'react-dom': ['react-dom'],
          'framer-motion': ['framer-motion'],
          '@sanity/client': ['@sanity/client'],
          '@emailjs/browser': ['@emailjs/browser'],
        },
      },
    },
  },
})
