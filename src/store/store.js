import Vue from 'vue'
import Vuex from 'vuex'
// import $ from 'jquery'

Vue.use(Vuex)
const state = {
  count: 0,
  routerList: [],
  fileFormat: ['jpg', 'jpeg', 'png', 'gif'],
  // baseServiceUrl: 'http://10.0.5.66:8089'
  // baseServiceUrl: 'http://10.0.5.29:8088'
  // baseServiceUrl: 'https://ityp.baho.cn:8094/pms2'
  baseServiceUrl: 'https://pms.baho.cn/pms'
  // baseServiceUrl: 'https://ityp.baho.cn:8094/pms'
  // baseServiceUrl: 'http://10.0.5.29:8088'
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
  }
}
export default new Vuex.Store({
  state,
  mutations
})
