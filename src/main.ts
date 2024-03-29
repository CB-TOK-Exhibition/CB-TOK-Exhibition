import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import { auth } from './firebase'
auth.onAuthStateChanged((user) => {
    if (user) store.commit("setUser", user)
    else console.log("logged out")
})

// PRIMEVUE
import PrimeVue from 'primevue/config'
import Dropdown from 'primevue/dropdown';
import Toast from 'primevue/toast';
import Paginator from 'primevue/paginator';
import ToastService from 'primevue/toastservice';
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

// SWIPER
import SwiperCore, { Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
SwiperCore.use([Navigation]);

//LOADERS
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

//CSS FILES
import '@/CSS/tailwind.css'
import '@/CSS/static.css'
import '@/CSS/animations.css'
import '@/assets/fonts/robato.css'

const app = createApp(App)
app.component('Dropdown', Dropdown);
app.component('Toast', Toast);
app.component('Paginator', Paginator)
app.component("PulseLoader", PulseLoader)
app.use(store).use(router).use(PrimeVue).use(ToastService)
app.mount('#app')