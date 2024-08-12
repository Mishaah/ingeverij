import { createRouter, createWebHashHistory } from 'vue-router'
import home from '@/views/home.vapor.vue'
import about from '@/views/about.vapor.vue'
import anagrammar from '@/views/anagrammar.vapor.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'homeView',
      component: home,
    },
    {
      path: '/about',
      name: 'aboutView',
      component: about,
    },
    {
      path: '/anagrammar',
      name: 'anagrammarView',
      component: anagrammar,
    },
  ],
})

export default router