import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Schedule from '@/components/Schedule'
import MyDep from '@/components/MyDep'
import MyTask from '@/components/MyTask'
import MyPro from '@/components/MyPro'
import ProEdit from '@/components/ProEdit'
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
    },
    {
      path: '/MyDep',
      name: 'MyDep',
      component: MyDep
    },
    {
      path: '/MyTask',
      name: 'MyTask',
      component: MyTask
    },
    {
      path: '/MyPro',
      name: 'MyPro',
      component: MyPro
    },
    {
      path: '/ProEdit',
      name: 'ProEdit',
      component: ProEdit
    }
  ]
})
