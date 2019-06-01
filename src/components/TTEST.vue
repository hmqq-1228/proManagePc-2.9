<template>
  <div class="TTEST">
    <div class="ttpos">123</div>
    <div style="height: 100px; overflow: hidden; border: 1px solid #aaa;" id="jietuWrap" class="b1"><img id="jietuImg" :src="base64Str"></div>
    <textarea @paste="listenKeydown">123</textarea>
  </div>
</template>

<script>
export default {
  name: 'TTEST',
  data () {
    return {
      msg: '',
      base64Str: ''
    }
  },
  created () {
    this.pasteEvent()
  },
  watch: {
  },
  methods: {
    pasteEvent: function () {
      var that = this
      window.document.addEventListener('paste', function (event) {
        console.log('lala:', event.clipboardData)
        var data = event.clipboardData || window.clipboardData
        var blob = data.items[0].getAsFile()
        // 判断是不是图片，最好通过文件类型判断
        var isImg = (blob && 1) || -1
        console.log('isImg:', isImg)
        var reader = new FileReader()
        if (isImg >= 0) {
          // 将文件读取为 DataURL
          reader.readAsDataURL(blob)
        }
        // 文件读取完成时触发
        reader.onload = function (event) {
          // 获取base64流
          that.base64Str = event.target.result
          that.log('base64Str:', that.base64Str)
          // div中的img标签src属性赋值，可以直接展示图片
          // $('#jietuImg').attr('src', base64Str)
        }
      })
    },
    listenKeydown: function (e) {
      // var that = this
      if (e.keyCode === 86) {
        // this.log('粘贴:', e.clipboardData)
        // // 获取clipboardData对象
        // var data = e.clipboardData || window.clipboardData
        // that.log('clipboardData:', data)
        // // 获取图片内容
        // var blob = data.items[0].getAsFile()
        // // 判断是不是图片，最好通过文件类型判断
        // var isImg = (blob && 1) || -1
        // var reader = new FileReader()
        // if (isImg >= 0) {
        //   // 将文件读取为 DataURL
        //   reader.readAsDataURL(blob)
        // }
        // // 文件读取完成时触发
        // reader.onload = function (event) {
        //   // 获取base64流
        //   var base64Str = event.target.result
        //   // div中的img标签src属性赋值，可以直接展示图片
        //   $('#jietuImg').attr('src', base64Str)
        //   // 显示div
        //   $('#jietuWrap').css('display', 'block')
        //   // 隐藏输入文字的div
        //   $('#jietuWrap').next().css('display', 'none')
        // }
      }
    }
  }
}
</script>

<style scoped>
  .TTEST{
    position: relative;
  }
  .ttpos{
    position: fixed;
    z-index: 500;
    right: 0px;
    top: 0;
    width: 100px;
    height: 5000px;
    background-color: #aaa;
  }
</style>
