import Vue from 'vue'
import Vuex from 'vuex'
// import $ from 'jquery'

Vue.use(Vuex)
const state = {
  count: 0,
  baseServiceUrl: 'http://10.0.5.66:8089'
}
const mutations = {
  add (state) {
    state.count += 1
  }
}
export default new Vuex.Store({
  state,
  mutations
})
