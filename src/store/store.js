import Vue from 'vue'
import Vuex from 'vuex'
// import $ from 'jquery'

Vue.use(Vuex)
const state = {
  count: 0,
  routerList: [{
    name: '',
    id: ''
  }],
  fileFormat: ['jpg', 'jpeg', 'png', 'gif'],
  // baseServiceUrl: 'http://10.0.5.66:8089',
  // baseServiceUrl: 'http://10.0.5.29:8088'
  baseServiceUrl: 'http://ityp.baho.cn/pms'
  // baseServiceUrl: 'http://10.0.5.29:8088'
}
const mutations = {
  add (state) {
    state.count += 1
  },
  setRouterName (state, obj) {
    for (var i = 0; i < state.routerList.length; i++) {
      if (state.routerList[i].id === obj.id) {
        state.routerList.splice(i + 1)
        state.routerList[i].name = obj.name
        state.routerList[i].id = obj.id
      } else {
        state.routerList.push(obj)
      }
    }
  }
}
export default new Vuex.Store({
  state,
  mutations
})
