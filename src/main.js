import { createApp } from 'vue'
import App from './App.vue'
import router from '@/routes'

// Import our custom CSS
import './assets/scss/main.scss'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

createApp(App).use(router).mount('#app')