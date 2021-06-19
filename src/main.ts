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

import PrimeVue from 'primevue/config'
import Dropdown from 'primevue/dropdown';
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';

import SwiperCore, { Navigation } from 'swiper'
require('swiper/swiper.scss')
require('swiper/components/navigation/navigation.scss')
SwiperCore.use([Navigation]);


const app = createApp(App)
app.component('Dropdown', Dropdown);
app.component('Toast', Toast);
app.use(store).use(router).use(PrimeVue).use(ToastService)
app.mount('#app')