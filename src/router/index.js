import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Schedule from '@/components/Schedule'
import MyDep from '@/components/MyDep'
import MyTask from '@/components/MyTask'
import MyPro from '@/components/MyPro'
import MyPro2 from '@/components/MyPro2'
import ProEdit from '@/components/ProEdit'
import ProEdit2 from '@/components/ProEdit2'
import TestUpload from '@/components/TestUpload'
// Schedule TestUpload

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/HelloWorld',
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
      path: '/MyPro2',
      name: 'MyPro2',
      component: MyPro2
    },
    {
      path: '/ProEdit',
      name: 'ProEdit',
      component: ProEdit
    },
    {
      path: '/ProEdit2',
      name: 'ProEdit2',
      component: ProEdit2
    },
    {
      path: '/TestUpload',
      name: 'TestUpload',
      component: TestUpload
    }
  ]
})
