import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { MotionPlugin } from '@vueuse/motion'
import App from './App.vue'
import './style.css'
import { routes, setupRouteGuards } from './router'

const app = createApp(App)
const pinia = createPinia()

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Setup route guards after creating the router
setupRouteGuards(router)

app.use(pinia)
app.use(router)
app.use(MotionPlugin)

app.mount('#app')