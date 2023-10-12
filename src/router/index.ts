import { createRouter, createWebHistory } from 'vue-router'
import DailyMenu from '@/views/DailyMenu.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/daily-menu'
    },
    {
      path: '/daily-menu',
      name: 'daily-menu',
      component: DailyMenu,
      meta: {
        title: 'Daily menu'
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title + ' - ' + (import.meta.env.VITE_TITLE || 'Healtheat')
  next()
})

export default router
