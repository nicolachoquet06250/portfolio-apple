import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import erudaPlugin from '@/plugins/eruda'

// if (import.meta.env.MODE === 'development') {
//     (async () => {
//         await import('https://cdn.jsdelivr.net/npm/eruda');
//         await import('https://cdn.jsdelivr.net/npm/eruda-dom@2.0.0/eruda-dom.min.js');
//         await import('https://cdn.jsdelivr.net/npm/eruda-features@2.0.0/eruda-features.min.js');
//         await import('https://cdn.jsdelivr.net/npm/eruda-timing@2.0.0/eruda-timing.min.js');
//         await import('https://cdn.jsdelivr.net/npm/eruda-code@2.0.0/eruda-code.min.js');
//
//         eruda.init()
//
//         eruda.add(erudaDom)
//         eruda.add(erudaFeatures)
//         eruda.add(erudaTiming)
//         eruda.add(erudaCode)
//     })()
// }

createApp(App).use(erudaPlugin).mount('#app')
