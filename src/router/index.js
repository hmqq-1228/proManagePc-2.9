import Vue from 'vue'
import Router from 'vue-router'
/**
 *  ==================================================================== ZhangH
 */
import goodsDetail from '@/components/goodsDetail'
// 商品档案详情
import goodsfileDetail from '@/components/goodsfileDetail'
import HelloWorld from '@/components/HelloWorld'
import Wellcome from '@/components/Wellcome'
/**
 *  ==================================================================== HuangM
 */
import MyDep from '@/components/MyDep'
import MyTask from '@/components/MyTask'
// import MyPro3 from '@/components/MyPro3'
import GoodsManage from '@/components/GoodsManage'
import GoodsArchives from '@/components/GoodsArchives'
import GoodsArchives2 from '@/components/GoodsArchives2'
import ProDetail2 from '@/components/ProDetail2'
import ProblemFeedback from '@/components/ProblemFeedback'
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
import goodsDetail2 from '@/components/goodsDetail2'
import page404 from '@/components/page404'
import GroupAdmin from '@/components/GroupAdmin'
import TTEST from '@/components/TTEST'
Vue.use(Router)

export default new Router({
  routes: [
    /** ProblemFeedback
     *  ===================================================== ZhangH
     */
    {
      path: '/goodsDetail',
      name: 'goodsDetail',
      component: goodsDetail
    },
    // 商品档案详情
    {
      path: '/goodsfileDetail',
      name: 'goodsfileDetail',
      component: goodsfileDetail
    },
    {
      path: '/goodsfileDetail/:spuId',
      name: 'goodsfileDetail1',
      component: goodsfileDetail
    },
    {
      path: '/goodsDetail/:proId',
      name: 'goodsDetailPath',
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
      path: '/MyDep',
      name: 'MyDep',
      component: MyDep
    },
    // {
    //   path: '/MyPro3',
    //   name: 'MyPro3',
    //   component: MyPro3
    // },
    {
      path: '/ProDetail2',
      name: 'ProDetail2',
      component: ProDetail2
    },
    {
      path: '/ProblemFeedback',
      name: 'ProblemFeedback',
      component: ProblemFeedback
    },
    {
      path: '/GoodsArchives',
      name: 'GoodsArchives',
      component: GoodsArchives
    },
    {
      path: '/GoodsArchives2',
      name: 'GoodsArchives2',
      component: GoodsArchives2
    },
    {
      path: '/ProblemFeedback/:ProbId',
      name: 'ProblemFeedback2',
      component: ProblemFeedback
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
      path: '/MyTaskNew/:TaskId',
      name: 'MyTaskNew2',
      component: MyTaskNew
    },
    {
      path: '/CompUse',
      name: 'CompUse',
      component: CompUse
    },
    {
      path: '/goodsDetail2',
      name: 'goodsDetail2',
      component: goodsDetail2
    },
    {
      path: '/page404',
      name: 'page404',
      component: page404
    },
    {
      path: '/GroupAdmin',
      name: 'GroupAdmin',
      component: GroupAdmin
    },
    {
      path: '/TTEST',
      name: 'TTEST',
      component: TTEST
    }
  ]
})
