<template>
  <div class="FileUploadComp">
    <form class="FileCompForm" :id="fileFormId" enctype="multipart/form-data">
      <div class="FileCompFormIcon"><img src="../../static/img/fujian.png" alt=""></div>
      <div class="FileCompIptWrap">选择文件
        <input type="file" :disabled="commentDis" name="myfile" :id="fileFormId + '_myfile2'" @change="getFileName">
      </div>
      <div class="FileCompIptText">{{uploadFileName}}</div>
    </form>
    <div style="font-size: 12px">
      <span style="color: #f00" v-if="fileListComment.length === 5">最多选择 <span style="font-size: 16px;font-weight: bold;">{{fileListComment.length}}</span> 个附件:</span>
      <span v-if="fileListComment.length < 5">已选 <span style="color: #409EFF;font-size: 16px;font-weight: bold;">{{fileListComment.length}}</span> 个附件:</span>
      <!--<span style="color: #888;" v-if="fileListComment.length === 0">暂无附件</span>-->
      <span style="color: #409EFF" v-if="fileListComment.length > 0" v-for="(file, index) in fileListComment" v-bind:key="index"><span style="color: #333">{{index+1}}、</span>{{file.fileName}} <div style="color: #999;display: inline-block;" class="el-icon-close" @click="delUploadFileComment(file.attachmentId)"></div>, </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FileUploadComp',
  props: ['clearInfo', 'fileFormId'],
  data () {
    return {
      uploadFileName: '',
      uploadFileRe: '',
      commentDis: false,
      fileListComment: [],
      fileListCommentLen: 0
    }
  },
  watch: {
    clearInfo (val, old) {
      var that = this
      that.log('接收到父组件传值', val)
      if (val) {
        that.log('父组件传过来的：', val)
        that.fileListComment = []
        $('#' + that.fileFormId + '_myfile2').val('')
        that.uploadFileName = ''
      }
    }
  },
  methods: {
    getFileName: function (filename) {
      // this.log('ddddd:', filename)
      var that = this
      var filePath = $('#' + that.fileFormId + '_myfile2').val()
      var arr = filePath.split('\\')
      var fileName = arr[arr.length - 1]
      this.uploadFileName = fileName
      // $('.showFileName').html(fileName)
      if (filePath) {
        that.addMarkInfo4()
      }
    },
    addMarkInfo4 () {
      var that = this
      var url = that.$store.state.baseServiceUrl
      var formData = new FormData($('#' + that.fileFormId)[0])
      this.log(456)
      if (formData) {
        $.ajax({
          type: 'post',
          url: url + '/file/uploadFileAjax',
          data: formData,
          cache: false,
          processData: false,
          contentType: false,
          crossDomain: true,
          xhrFields: {
            withCredentials: true
          }
        }).then(function (data) {
          that.log('upload:', data)
          if (data.code === 200) {
            // that.attachmentId2 = data.data.attachmentId
            var obj = {
              attachmentId: data.data.attachmentId,
              fileName: data.data.showName
            }
            that.fileListComment.push(obj)
            that.log('fileListComment:', that.fileListComment.length)
            that.fileListCommentLen = that.fileListComment.length
            that.$message({
              type: 'success',
              message: '文件' + data.msg
            })
            that.$emit('FileDataEmit', that.fileListComment)
          } else if (data.code === 300) {
            that.$message({
              type: 'error',
              message: data.msg
            })
          } else {
            that.$message({
              type: 'error',
              message: data.msg
            })
          }
        })
      } else {
        // that.loading = false
        that.$message({
          type: 'error',
          message: '评论内容不能为空'
        })
      }
    }
  }
}
</script>

<style scoped>
  div img{
    width: 100%;
  }
  .FileUploadComp{
  }
  .FileCompForm{
    display: flex;
  }
  .FileCompFormIcon{
    width: 20px;
    padding-top: 10px;
    margin-right: 10px;
  }
  .FileCompIptWrap{
    position: relative;
    background: #D0EEFF;
    border: 1px solid #99D3F5;
    border-radius: 4px;
    padding: 4px 12px;
    overflow: hidden;
    color: #1E88C7;
    line-height: 20px;
    margin-top: 6px;
  }
  .FileCompIptWrap input{
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
  }
  .FileCompIptWrap:hover {
    background: #AADFFD;
    border-color: #78C3F3;
    color: #004974;
  }
  .FileCompIptText{
    padding-top: 16px;
    margin-left: 10px;
  }
</style>
