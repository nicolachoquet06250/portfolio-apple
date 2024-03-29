import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import ssl from "@vitejs/plugin-basic-ssl"
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    extensions: ['.ts', '.json', '.vue'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '$': path.resolve(__dirname, 'vite')
    }
  },
  plugins: [
    ssl(),
    vue({
      script: {
        defineModel: true
      }
    }),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      devOptions: {
        enabled: true
      },
      manifest: {
        "id": "/",
        "name": "Apple WebOS Portfolio Nicolas Choquet",
        "short_name": "Nicolas Choquet",
        "start_url": "/",
        "scope": "/",
        "display": "fullscreen",
        "dir": "ltr",
        "theme_color": "#000000",
        "background_color": "#000000",
        "lang": "fr",
        "description": "Portfolio du développeur Nicolas Choquet sous forme de système d'exploitation web qui s'adapte au support.",
        "orientation": "portrait",
        "icons": [
          {
            "src": "/img/apple-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
          },
          {
            "src": "/img/apple-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
          }
        ],
        "categories": [
          "navigation",
          "personalization"
        ],
        "screenshots": [
          {
            "label": "loading desktop",
            "src": "/manifest/screenshots/desktop/loading.png",
            "type": "image/png",
            "form_factor": "wide",
            "sizes": "2191x1060"
          },
          {
            "label": "login desktop",
            "src": "/manifest/screenshots/desktop/login.png",
            "type": "image/png",
            "form_factor": "wide",
            "sizes": "2191x1060"
          },
          {
            "label": "desktop",
            "src": "/manifest/screenshots/desktop/desktop.png",
            "type": "image/png",
            "form_factor": "wide",
            "sizes": "2191x1060"
          },
          {
            "label": "mobile unlock screen",
            "src": "/manifest/screenshots/mobile/unlock-screen.png",
            "type": "image/png",
            "form_factor": "narrow",
            "sizes": "517x1058"
          }
        ],
        "launch_handler": {
          client_mode: 'focus-existing'
        },
        "scope_extensions": [
          {"origin": 'www.nicolaschoquet.fr'}
        ],
        "edge_side_panel": {
          "preferred_width": 400
        },
        "handle_links": "preferred",
        "protocol_handlers": [
          {
            "protocol": "web+ncAppleOsApp",
            "url": "/?app=%s"
          }
        ],
        "shortcuts": [
          {
            "name": "Finder",
            "url": "?app=finder",
            "description": "Ouvrir le finder",
            "icons": [
              {
                "purpose": "maskable",
                "src": "/manifest/shortcuts/finder.png",
                "type": "image/png",
                "sizes": "96x96"
              }
            ]
          },
          {
            "name": "Terminal",
            "url": "/?app=terminal",
            "description": "Ouvrir le terminal",
            "icons": [
              {
                "purpose": "maskable",
                "src": "/manifest/shortcuts/terminal.png",
                "type": "image/png",
                "sizes": "96x96"
              }
            ]
          }
        ],
        "related_applications": [{
          "platform": "webapp",
          "url": "https://www.nicolaschoquet.fr/manifest.webmanifest"
        }],
        "prefer_related_applications": true,
      }
    })
  ],
  // server: {
  //   https: true
  // }
})
