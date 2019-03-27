import Vue from 'vue'
import Vuex from 'vuex'
// import $ from 'jquery'

Vue.use(Vuex)
const state = {
  slideMenuGroup: [],
  slideMenu: [],
  // 激活的导航索引
  activeNavIndex: 'group_0_0',
  count: 0,
  userId: '',
  userName: '',
  userLoginInfo: '',
  debug: true,
  proId: '',
  navType: '',
  goodType: '',
  routerList: [],
  DevelopmentTab: 'DynamicsTask',
  // 项目类型
  projectType: [
    {label: '公司项目', value: '0'},
    {label: '部门项目', value: '1'},
    {label: '小组项目', value: '2'},
    {label: '个人项目', value: '3'},
    {label: '集团战略', value: '4'},
    {label: '产品研发', value: '5'}
  ],
  fileFormat: ['jpg', 'jpeg', 'png', 'gif'],
  // baseServiceUrl: 'http://10.0.5.241:8089'
  // baseServiceUrl: 'http://10.0.5.29:8088'
  // baseServiceUrl: 'https://ityp.baho.cn:8094/pms2'
  // baseServiceUrl: 'https://pms.baho.cn/pms'
  baseServiceUrl: 'https://ityp.baho.cn:8094/pms'
  // baseServiceUrl: 'http://10.0.5.241:8089'
  // baseServiceUrl: 'http://10.0.5.240:8088'
}
const mutations = {
  add (state) {
    state.count += 1
  },
  setRouterName (state, obj) {
    var flag = false
    var k = ''
    if (state.routerList.length > 0) {
      for (var i = 0; i < state.routerList.length; i++) {
        if (state.routerList[i].type === obj.type || state.routerList[i].id === obj.id) {
          flag = true
          k = i
          break
        }
      }
      if (flag) {
        state.routerList.splice(k, state.routerList.length, obj)
      } else {
        state.routerList.push(obj)
      }
    } else {
      state.routerList.push(obj)
    }
    flag = false
  },
  resetBreadcrumb: function (state, index) {
    state.routerList.splice(index, state.routerList.length)
  },
  // 设置侧边栏导航的激活
  setSlidNavActive: function (state, index) {
    // j
  }
}
export default new Vuex.Store({
  state,
  mutations
})
