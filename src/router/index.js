import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Schedule from '@/components/Schedule'
// Schedule

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/Schedule',
      name: 'Schedule',
      component: Schedule
    }
  ]
})
