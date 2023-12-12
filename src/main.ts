import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import erudaPlugin from '$/plugins/eruda'

createApp(App).use(erudaPlugin).mount('#app')
