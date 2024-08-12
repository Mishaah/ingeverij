import { createRouter, createWebHashHistory } from 'vue-router'
import home from '@/views/home.vapor.vue'
import about from '@/views/about.vapor.vue'
import anagrammar from '@/views/anagrammar.vapor.vue'
import contact from '@/views/contact.vapor.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/home',
      name: 'homeView',
      component: home,
    },
    {
      path: '/about',
      name: 'aboutView',
      component: about,
    },
    {
      path: '/',
      name: 'anagrammarView',
      component: anagrammar,
    },
    {
      path: '/contact',
      name: 'contactView',
      component: contact,
    },
  ],
})

export default router