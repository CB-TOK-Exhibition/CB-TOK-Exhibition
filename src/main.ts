import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

//THIS CSS FILE IS FOR TAILWIND
import '@/CSS/tailwind.css'

//THIS CSS FILE APPLIES GLOBALLY
import '@/CSS/static.css'

createApp(App).use(store).use(router).mount('#app')
