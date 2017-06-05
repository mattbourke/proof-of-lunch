import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import ProofOfLunch from '@/components/ProofOfLunch'
import ValidateWork from '@/components/ValidateWork'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/proof-of-lunch',
      name: 'ProofOfLunch',
      component: ProofOfLunch
    },
    {
      path: '/validate-work',
      name: 'ValidateWork',
      component: ValidateWork
    }
  ]
})
