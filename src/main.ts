import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

//THIS CSS FILE IS FOR TAILWIND
import '@/CSS/tailwind.css'
import '@/CSS/static.css'
import '@/CSS/animations.css'
import '@/assets/fonts/robato.css'

createApp(App).use(store).use(router).mount('#app')