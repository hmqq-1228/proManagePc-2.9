import $ from 'jquery'
import store from '@/store/store.js'
import router from '@/router'
const install = function (Vue, options) {
  Vue.prototype.ajax = function (actionName, postData) {
    var baseurl
    if (postData.payload) {
      postData.payload = JSON.parse(postData.payload)
      postData.payload.userId = store.state.userId
      postData.payload = JSON.stringify(postData.payload)
    } else {
      if (typeof postData === 'string') {
        var zzPostData = JSON.parse(postData)
        zzPostData.userId = store.state.userId
        postData = JSON.stringify(zzPostData)
      } else {
        if (postData.userId) {
          // j
        } else {
          postData.userId = store.state.userId
        }
      }
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
        // router.push('/page404')
        if (data.code === 201) {
          // alert('ajax:' + data.code)
          // store._mutations.ddLogin[0]()
        } else if (data.code === 404) {
          router.push('/page404')
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
  Vue.prototype.alert = function (test) {
    if (store.state.debug) {
      return window.alert(test)
    }
  }
  // Vue.prototype.isImage = function (fileName) {
  //   if (fileName) {
  //     var geshi = fileName.substr(-4).indexOf('.') > -1 ? fileName.toLowerCase().substr(-3) : fileName.toLowerCase().substr(-4)
  //   }
  //   var isImg = false
  //   for (var i = 0; i < store.state.fileFormat.length; i++) {
  //     if (store.state.fileFormat[i] === geshi) {
  //       isImg = true
  //     } else {
  //       isImg = false
  //     }
  //   }
  //   return isImg
  // }
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
  // 图片预览
  Vue.prototype.imgPreview = function (previewUrl, fileName) {
    if (previewUrl && this.isImage(fileName)) {
      store.state.imgPreviewShow = true
      store.state.imgPreviewSrc = previewUrl
    }
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
  // 获取当前时间
  Vue.prototype.getNowTime = function () {
    var myDate = new Date()
    var year = myDate.getFullYear()
    var month = (myDate.getMonth() + 1) < 10 ? '0' + (myDate.getMonth() + 1) : (myDate.getMonth() + 1)
    var date = myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate()
    var hour = myDate.getHours() < 10 ? '0' + myDate.getHours() : myDate.getHours()
    var min = myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes()
    var sec = myDate.getSeconds() < 10 ? '0' + myDate.getSeconds() : myDate.getSeconds()
    return year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + sec
  }
  /**
   * 获取基于某个时间的某段时间之后的时间 如：获取一小时后的时间
   * 第一个参数为时间段，整数，以毫秒计
   * 第二个参数为基于的时间 字符串，默认当前
   */
  Vue.prototype.getLaterTime = function (msecond, btime) {
    var myDate = btime ? new Date(btime) : new Date()
    var laterTimeStamp = myDate.getTime() + msecond
    myDate = new Date(laterTimeStamp)
    var year = myDate.getFullYear()
    var month = (myDate.getMonth() + 1) < 10 ? '0' + (myDate.getMonth() + 1) : (myDate.getMonth() + 1)
    var date = myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate()
    var hour = myDate.getHours() < 10 ? '0' + myDate.getHours() : myDate.getHours()
    var min = myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes()
    var sec = myDate.getSeconds() < 10 ? '0' + myDate.getSeconds() : myDate.getSeconds()
    return year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + sec
  }
  Vue.prototype.getBeforeTime = function (msecond, btime) {
    var myDate = btime ? new Date(btime) : new Date()
    var laterTimeStamp = myDate.getTime() - msecond
    myDate = new Date(laterTimeStamp)
    var year = myDate.getFullYear()
    var month = (myDate.getMonth() + 1) < 10 ? '0' + (myDate.getMonth() + 1) : (myDate.getMonth() + 1)
    var date = myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate()
    var hour = myDate.getHours() < 10 ? '0' + myDate.getHours() : myDate.getHours()
    var min = myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes()
    var sec = myDate.getSeconds() < 10 ? '0' + myDate.getSeconds() : myDate.getSeconds()
    return year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + sec
  }
  // 常规时间格式 兼容苹果的时间格式 replace(/-/g, '/')
  Vue.prototype.dateCompatibility = function (baseDate) {
    var finalDate = ''
    if (this.testBrowser() === 'Safari') {
      finalDate = baseDate.replace(/-/g, '/')
    } else {
      finalDate = baseDate
    }
    return finalDate
  }
}
export default {
  install
}
