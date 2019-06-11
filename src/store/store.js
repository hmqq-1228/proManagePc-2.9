import Vue from 'vue'
import Vuex from 'vuex'
// import $ from 'jquery'

Vue.use(Vuex)
const state = {
  /** 截图上传 start */
  slipPreShow: false,
  slipPreSrc: '',
  slipTextareaId: '',
  clipBackVal: false,
  /** 截图上传 end */
  /** 图片预览 start */
  imgPreviewShow: false,
  imgPreviewSrc: '',
  /** 图片预览 end */
  navList: [],
  navActive: '3',
  codeArr: [],
  sortType: '1',
  goodsName: '',
  spuCode: '',
  permission: '',
  endCostPrice: '',
  searchUserName: '',
  sortTypeName: '创建时间',
  startCostPrice: '',
  currentNodeIndex: 0,
  timeDialogVisible: false,
  defaultParentStart: '',
  defaultParentFinish: '',
  resetDragStart: '',
  resetDragFinish: '',
  nodeDragRefresh: false,
  // dragResetDate: false,
  currentDraggedData: {},
  editFlag: false,
  taskEdit: false,
  stopeFlag: false,
  goPerfect: false,
  refshPlan: false,
  slideMenuGroup: [],
  slideMenu: [],
  menuRefresh: false,
  treeLevel: -1,
  uploadCount: 0,
  dragedElementId: '',
  // 激活的导航索引
  activeNavIndex: 'group_0_0',
  count: 0,
  userId: '',
  userName: '',
  jName: '',
  userLoginInfo: '',
  debug: true,
  proId: '',
  menuId: '',
  NavActiveData: {},
  spuId: '',
  navType: '',
  goodType: '',
  goodCode: '',
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
  /** 选中的项目类型 主要区分集团战略和非集团战略 */
  selectProjectType: '',
  fileFormat: ['jpg', 'jpeg', 'png', 'gif'],
  // baseServiceUrl: 'http://10.0.5.29:8088'
  // baseServiceUrl: 'https://ityp.baho.cn:8094/pms2'
  // baseServiceUrl: 'https://pms.baho.cn/pms'
  baseServiceUrl: 'https://ityp.baho.cn:8094/pms'
  // 郭宋恒
  // baseServiceUrl: 'http://10.0.5.241:8089'
  // baseServiceUrl: 'http://10.0.5.240:8088'
}
const mutations = {
  add (state) {
    state.count += 1
  },
  uploadCountAdd (state) {
    state.uploadCount += 1
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
  },
  // 设置侧边栏导航的激活
  useNavActive: function (state, navObj) {
    for (var t = 0; t < state.navList.length; t++) {
      if (state.navList[t].menuName === navObj.navName) {
        if (navObj.navName === '集团战略(作废)') {
          state.navActive = state.proId
          state.menuId = state.proId
        } else if (navObj.navName === '商品管理') {
          for (var n = 0; n < state.navList[t].dataList.length; n++) {
            if (navObj.childNavName === state.navList[t].dataList[n].menuName) {
              state.navActive = state.navList[t].dataList[n].menuId.toString()
              state.menuId = state.navList[t].dataList[n].menuId.toString()
              break
            }
          }
        } else if (navObj.navName === '项目管理') {
          for (var p = 0; p < state.navList[t].dataList.length; p++) {
            if (navObj.childNavName === state.navList[t].dataList[p].menuName) {
              state.navActive = state.navList[t].dataList[p].menuId.toString()
              state.menuId = state.navList[t].dataList[p].menuId.toString()
              break
            }
          }
        } else if (navObj.navName === '工作报告') {
          for (var k = 0; k < state.navList[t].dataList.length; k++) {
            if (navObj.childNavName === state.navList[t].dataList[k].menuName) {
              state.navActive = state.navList[t].dataList[k].menuId.toString()
              state.menuId = state.navList[t].dataList[k].menuId.toString()
              break
            }
          }
        } else {
          state.navActive = state.navList[t].menuId.toString()
          state.menuId = state.navList[t].menuId.toString()
        }
        break
      }
    }
  },
  setNavActive: function (state, navObj) {
    state.NavActiveData = navObj
  },
  /** 时间限制 */
  /** 示例: this.$store.commit('setDateOption', {OptionObj: that.dateTimeOpt, startDate: '2019-04-10 00:00:00', endDate: '2019-04-25 00:00:00'}) */
  setDateOption: function (state, obj) {
    obj.OptionObj.disabledDate = function (targetDateTime) {
      var startTime = new Date(obj.startDate).getTime()
      var endTime = new Date(obj.endDate).getTime()
      var targetDateStamp = new Date(targetDateTime).getTime()
      return targetDateStamp < startTime || targetDateStamp > endTime
    }
  }
}
export default new Vuex.Store({
  state,
  mutations
})
