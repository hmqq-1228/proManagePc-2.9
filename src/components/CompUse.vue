<template>
  <div class="CompUse">
    <div class="CompIntroItem">
      <h3>FileUploadComp:多附件上传</h3>
      <div class="CompIntroStepTit">HTML中使用组件</div>
      <div class="CompIntroCodes">
        <pre>&lt;component v-bind:is="compArr.FileUploadComp"
          v-bind:FileDataList="taskFileList"
          fileFormId="ModifyTask"
          v-bind:clearInfo="IsClear"
          v-on:FilePreEmit="GetFilePreData"
          v-on:FileDataEmit="GetFileInfo"&gt;&lt;component&gt;
        </pre>
      </div>
      <div class="CompIntroStepTit">组件引入</div>
      <div class="CompIntroCodes">
        <pre>import FileUploadComp from './CustomComp/FileUploadComp.vue'</pre>
      </div>
      <div class="CompIntroStepTit">组件注册</div>
      <div class="CompIntroCodes">
        <pre>
  name: '...',
  components: {
    FileUploadComp,
    TaskDetailComp,
    ModifyTask
  },
  data () {
    ...
  }
        </pre>
      </div>
      <div class="CompIntroStepTit">变量声明</div>
      <div class="CompIntroCodes">
        <pre>
  data () {
    return {
      compArr: {
        FileUploadComp: 'FileUploadComp'
      },
      // <span class="zhushi">接收到的组件数组 新组件</span>
      FileUploadArr: [],
      // <span class="zhushi">是否让子组件清空文件 新组件</span>
      IsClear: false,
      // <span class="zhushi">附件复显列表</span>
      taskFileList: [],
    }
  }
        </pre>
      </div>
      <div class="CompIntroStepTit">方法声明</div>
      <div class="CompIntroCodes">
        <pre>// <span class="zhushi">附件 附件预览</span>
    GetFilePreData (obj) {
      this.log('obj::', obj)
      if (obj.previewUrl && this.isImage(obj.fileName)) {
        this.showBigImage1(obj.previewUrl)
      }
    },
    // <span class="zhushi">获取附件上传组件发来的附件信息 新组件 传过来的obj为数组</span>
    GetFileInfo (obj) {
      if (obj) {
        this.IsClear = false
      }
      this.FileUploadArr = obj
    },
    // <span class="zhushi">将附件Id以逗号分隔拼接起来</span>
    SetFileIdStr () {
      var that = this
      var FileIdStr = ''
      for (var i = 0; i &lt; that.FileUploadArr.length; i++) {
        var splitIcon = ','
        if (i === that.FileUploadArr.length - 1) {
          splitIcon = ''
        }
        FileIdStr = FileIdStr + that.FileUploadArr[i].attachmentId + splitIcon
      }
      that.FileUploadArr = []
      return FileIdStr
    },
        </pre>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompUse'
}
</script>

<style scoped>
  *{
    /*font-family: "Helvetica Neue",Helvetica,Verdana,Arial,sans-serif;*/
  }
  .CompIntroItem{}
  .CompIntroItem h3{
    color: #28558c;
    line-height: 30px;
  }
  .CompIntroStepTit{
    font-size: 14px;
    margin-top: 5px;
    font-family: "Helvetica Neue",Helvetica,Verdana,Arial,sans-serif;
  }
  .CompIntroCodes{
    background-color: #f5f5f5;
    font-size: 12px;
    border: 1px solid #ccc;
    padding: 5px;
  }
  .zhushi{
    color: #aaa;
  }
</style>
