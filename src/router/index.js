import Vue from 'vue'
import Router from 'vue-router'
/**
 *  ==================================================================== ZhangH
 */
import goodsDetail from '@/components/goodsDetail'
import HelloWorld from '@/components/HelloWorld'
import Wellcome from '@/components/Wellcome'
/**
 *  ==================================================================== HuangM
 */
import MyDep from '@/components/MyDep'
import MyTask from '@/components/MyTask'
import MyPro3 from '@/components/MyPro3'
import GoodsManage from '@/components/GoodsManage'
import ProDetail2 from '@/components/ProDetail2'
/**
 *  ==================================================================== DongG
 */
import MyTaskNew from '@/components/MyTaskNew'
import MyDepNew from '@/components/MyDepNew'
import TEST from '@/components/TEST'
import Schedule from '@/components/Schedule'
import MyPro from '@/components/MyPro'
import ProDetail from '@/components/ProDetail'
import TestUpload from '@/components/TestUpload'
import CompUse from '@/components/CompUse'

Vue.use(Router)

export default new Router({
  routes: [
    /**
     *  ===================================================== ZhangH
     */
    {
      path: '/goodsDetail',
      name: 'goodsDetail',
      component: goodsDetail
    },
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
    /**
     *  ===================================================== HuangM
     */
    {
      path: '/GoodsManage',
      name: 'GoodsManage',
      component: GoodsManage
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
      path: '/MyDep',
      name: 'MyDep',
      component: MyDep
    },
    {
      path: '/MyPro3',
      name: 'MyPro3',
      component: MyPro3
    },
    {
      path: '/ProDetail2',
      name: 'ProDetail2',
      component: ProDetail2
    },
    /**
     *  ===================================================== DongG
     */
    {
      path: '/TEST',
      name: 'TEST',
      component: TEST
    },
    {
      path: '/Schedule',
      name: 'Schedule',
      component: Schedule
    },
    {
      path: '/MyDepNew',
      name: 'MyDepNew',
      component: MyDepNew
    },
    {
      path: '/MyPro',
      name: 'MyPro',
      component: MyPro
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
      path: '/MyTaskNew',
      name: 'MyTaskNew',
      component: MyTaskNew
    },
    {
      path: '/CompUse',
      name: 'CompUse',
      component: CompUse
    }
  ]
})
