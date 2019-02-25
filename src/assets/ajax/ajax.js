import $ from 'jquery'
import store from '@/store/store.js'
// import router from '@/router'
const install = function (Vue, options) {
  Vue.prototype.ajax = function (actionName, postData) {
    var baseurl
    if (postData.payload) {
      postData.payload = JSON.parse(postData.payload)
      postData.payload.userId = store.state.userId
      postData.payload = JSON.stringify(postData.payload)
    } else {
      postData.userId = store.state.userId
    }
    baseurl = store.state.baseServiceUrl + actionName
    return $.ajax({
      url: baseurl,
      type: 'POST',
      async: true,
      xhrFields: {
        withCredentials: true,
        useDefaultXhrHeader: false
      },
      crossDomain: true,
      data: postData,
      success: function (data) {
        if (data.code === 201) {
          // alert('ajax:' + data.code)
          // store._mutations.ddLogin[0]()
        }
      }
    })
  }
  Vue.prototype.log = function (mark, cont) {
    if (store.state.debug) {
      if (cont) {
        return window.console.log(mark, cont)
      } else {
        return window.console.log(mark)
      }
    }
  }
  // 判断是否是图片
  Vue.prototype.isImage = function (fileName) {
    var geshi = fileName.substr(-4).indexOf('.') > -1 ? fileName.toLowerCase().substr(-3) : fileName.toLowerCase().substr(-4)
    var isImg = false
    for (var i = 0; i < store.state.fileFormat.length; i++) {
      if (store.state.fileFormat[i] === geshi) {
        isImg = true
      }
    }
    return isImg
  }
  Vue.prototype.alert = function (test) {
    if (store.state.debug) {
      return window.alert(test)
    }
  }
  Vue.prototype.isImage = function (fileName) {
    var geshi = fileName.substr(-4).indexOf('.') > -1 ? fileName.toLowerCase().substr(-3) : fileName.toLowerCase().substr(-4)
    var isImg = false
    for (var i = 0; i < store.state.fileFormat.length; i++) {
      if (store.state.fileFormat[i] === geshi) {
        isImg = true
      }
    }
    return isImg
  }
  // 检测浏览器类型
  Vue.prototype.testBrowser = function () {
    var userAgent = navigator.userAgent
    var isOpera = userAgent.indexOf('Opera') > -1
    if (isOpera) {
      return 'Opera'
    }
    if (userAgent.indexOf('Firefox') > -1) {
      return 'FF'
    }
    if (userAgent.indexOf('Chrome') > -1) {
      return 'Chrome'
    }
    if (userAgent.indexOf('Safari') > -1) {
      return 'Safari'
    }
    if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera) {
      return 'IE'
    }
  }
}
export default {
  install
}
