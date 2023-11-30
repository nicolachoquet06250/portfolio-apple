import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'

if (import.meta.env.MODE === 'development') {
    import('https://cdn.jsdelivr.net/npm/eruda').then(() => { 
        eruda.init()
    });
}

createApp(App).mount('#app')
