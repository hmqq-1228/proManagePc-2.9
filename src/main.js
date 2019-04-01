// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store/store.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import router from './router'
import $ from 'jquery'
import ajax from './assets/ajax/ajax.js'
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(iView)
Vue.use(ajax)
/* eslint-disable no-new */
var jvm = new Vue({
  el: '#app',
  $,
  store,
  router,
  components: { App },
  template: '<App/>'
})
console.log(jvm ? '' : '')
