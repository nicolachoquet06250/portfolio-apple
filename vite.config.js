import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  plugins: [
    vue({
      script: {
        defineModel: true
      }
    }),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: 'Apple WebOS Portfolio Nicolas Choquet',
        short_name: 'Nicolas Choquet',
        description: "Portfolio du développeur Nicolas Choquet sous forme de système d'exploitation web qui s'adapte au support.",
        theme_color: '#000000',
        orientation: 'portrait',
        display: 'standalone',
        icons: [
          {
            src: '/img/apple-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/img/apple-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
