import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Schedule from '@/components/Schedule'
import MyDep from '@/components/MyDep'
import MyTask from '@/components/MyTask'
import MyPro from '@/components/MyPro'
import MyPro3 from '@/components/MyPro3'
import ProEdit from '@/components/ProEdit'
import TestUpload from '@/components/TestUpload'
import Wellcome from '@/components/Wellcome'
import ProDetail from '@/components/ProDetail'
import ProDetail2 from '@/components/ProDetail2'
// Schedule TestUpload Wellcome

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Wellcome',
      component: Wellcome
    },
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
      path: '/MyTask/:TaskId',
      name: 'MyTaskArgs',
      component: MyTask
    },
    {
      path: '/MyPro',
      name: 'MyPro',
      component: MyPro
    },
    {
      path: '/MyPro3',
      name: 'MyPro3',
      component: MyPro3
    },
    {
      path: '/ProEdit',
      name: 'ProEdit',
      component: ProEdit
    },
    {
      path: '/ProEdit/:proId',
      name: 'ProEditParam',
      component: ProEdit
    },
    {
      path: '/TestUpload',
      name: 'TestUpload',
      component: TestUpload
    },
    {
      path: '/ProDetail',
      name: 'ProDetail',
      component: ProDetail
    },
    {
      path: '/ProDetail2',
      name: 'ProDetail2',
      component: ProDetail2
    }
  ]
})
