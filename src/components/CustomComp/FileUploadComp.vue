<template>
  <div class="FileUploadComp" v-loading="loading21">
    <div>{{getClipBackVal?'':''}}</div>
    <form class="FileCompForm" :id="lalala" enctype="multipart/form-data">
      <div class="FileCompFormIcon"><img src="../../../static/img/fujian.png" alt=""></div>
      <div class="FileCompIptWrap">{{buttonStr}}
        <!--fileFormId-->
        <input type="file" class="aaa" :disabled="commentDis" name="myfile" :id="lalala + '_myfile2'" @change="getFileName">
      </div>
      <!--<div class="FileCompIptText">{{uploadFileName}}</div>-->
      <div style="padding-top: 6px; margin-left: 15px;" v-if="clipboard">
        <!--@keydown="slipKeydown"-->
        <div style="width: 80px; height: 30px; line-height: 30px; overflow: hidden; display: inline-block; border: 1px solid #99D3F5; border-radius: 4px; padding-left: 2px;">
          <textarea style="border: none; width: 95px; height: 100%; resize: none; font-size: 12px;" :id="slipTextareaId" placeholder="此处粘贴截图" v-bind:value="textareaVal" @keydown="slipKeydown"></textarea>
        </div>
        <!--<div contenteditable id="ieDiv" style="width: 50px; height: 50px; border: 1px solid #aaa; display: inline-block;">-->
          <!--<img src="" />-->
        <!--</div>-->
        <!--<div style="width: 30px; height: 30px; overflow: hidden; border: 1px solid #aaa; display: inline-block;">-->
          <!--<img src="http://localhost:8080/static/img/doing.e21ad06.png" />-->
        <!--</div>-->
      </div>
    </form>
    <div style="font-size: 12px">
      <span style="color: #f00" v-if="fileListComment.length === 5">最多选择 <span style="font-size: 16px;font-weight: bold;">{{fileListComment.length}}</span> 个{{selectType}}:</span>
      <span v-if="fileListComment.length < 5">已选 <span style="color: #409EFF;font-size: 16px;font-weight: bold;">{{fileListComment.length}}</span> 个{{selectType}}:</span>
      <!--<span style="color: #888;" v-if="fileListComment.length === 0">暂无附件</span>-->
      <span style="color: #409EFF" v-if="fileListComment.length > 0" v-for="(file, index) in fileListComment" v-bind:key="index">
        <span style="color: #333" @click="FilePreEmitFuc(file.previewUrl, file.fileName, file.attachmentId)">{{index+1}}、{{file.fileName}}</span>
        <div style="color: #409EFF;display: inline-block;cursor: pointer;" class="el-icon-close" @click="delUploadFileComment(file.attachmentId)"></div>;&nbsp;&nbsp;
      </span>
    </div>
    <!-- 图片预览 -->
    <!--<el-dialog title="截图上传" :visible.sync="slipPreShow" width="40%">-->
      <!--<div class="showImg">-->
        <!--<img v-bind:src="slipPreSrc" alt>-->
      <!--</div>-->
      <!--<span slot="footer" class="dialog-footer">-->
        <!--<el-button size="small" @click="slipPreShow = false">取 消</el-button>-->
        <!--<el-button size="small" type="primary" @click="slipImgUpload(base64Data)">确 定</el-button>-->
      <!--</span>-->
    <!--</el-dialog>-->
  </div>
</template>

<script>
export default {
  name: 'FileUploadComp',
  props: {
    clearInfo: {
      type: Boolean,
      default: false
    },
    /** 是否支持截图上传 商品档案暂不支持 */
    clipboard: {
      type: Boolean,
      default: true
    },
    fileFormId: {
      type: String,
      default: '选择文件'
    },
    FileDataList: {
      // type: Array,
      // default: []
    },
    buttonStr: {
      type: String,
      default: '选择文件'
    },
    selectType: {
      type: String,
      default: '附件'
    },
    filUrl: {
      type: String,
      default: '/file/uploadFileAjax'
    },
    limtImg: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      lalala: '',
      textareaVal: '',
      loading21: false,
      uploadFileName: '',
      uploadFileRe: '',
      commentDis: false,
      fileListComment: [],
      fileListCommentLen: 0,
      slipKK: false,
      hhhh: '',
      slipPreSrc: '',
      base64Data: '',
      slipTextareaId: '',
      callUploadBoo: false
    }
  },
  created () {
    // var that = this
    this.$store.state.uploadCount = this.$store.state.uploadCount + 1
    this.lalala = 'lala_' + this.$store.state.uploadCount
    this.slipTextareaId = 'slipTextareaId_' + this.$store.state.uploadCount
  },
  mounted: function () {
    var that = this
    var slipTextarea = document.getElementById(that.slipTextareaId)
    slipTextarea.addEventListener('paste', function (event) {
      event.preventDefault()
      var data = event.clipboardData || window.clipboardData
      if (data.items[0].getAsFile()) {
        that.log('截图内容')
      } else {
        that.$Message.warning('此处只可粘贴截图内容')
        that.textareaVal = ''
        // that.log('此处只可粘贴截图内容')
      }
      var blob = data.items[0].getAsFile()
      // that.log('blob:', blob)
      // 判断是不是图片，最好通过文件类型判断
      if (blob && !that.commentDis) {
        var reader = new FileReader()
        // 将文件读取为 DataURL
        reader.readAsDataURL(blob)
        // 文件读取完成时触发
        reader.onload = function (event) {
          // 获取base64流
          that.slipPreSrc = event.target.result
          that.$store.state.slipPreSrc = event.target.result
          that.$store.state.slipTextareaId = that.slipTextareaId
          that.$store.state.slipPreShow = true
          that.base64Data = event.target.result
          // that.slipImgUpload(event.target.result)
        }
      }
    })
  },
  watch: {
    textareaVal (val, old) {
      if (val) {
        this.textareaVal = ''
      }
    },
    FileDataList (val, old) {
      this.log('FileDataList:', val)
      if (val) {
        this.fileListComment = val
        if (val.length >= 5) {
          this.commentDis = true
        }
      }
    },
    clearInfo (val, old) {
      var that = this
      // that.log('接收到父组件传值', val)
      if (val) {
        // that.log('父组件传过来的：', val)
        that.fileListComment = []
        $('#' + that.lalala + '_myfile2').val('')
        that.uploadFileName = ''
      }
    },
    fileListCommentLen: function (val, oVal) {
      if (val >= 5) {
        this.commentDis = true
      } else if (val < 5) {
        this.commentDis = false
      }
    }
  },
  computed: {
    getClipBackVal: function () {
      var that = this
      that.callUploadBoo = this.$store.state.clipBackVal
      if (that.$store.state.clipBackVal) {
        if (that.$store.state.slipTextareaId === that.slipTextareaId) {
          that.slipImgUpload(that.base64Data)
        }
      } else {
        that.$store.state.slipPreShow = false
        // that.slipPreShow = false
      }
      return this.$store.state.clipBackVal
    }
  },
  methods: {
    slipKeydown: function (e) {
      // var that = this
      if (e.keyCode === 86) {
        // console.log('lala:', 'ctrl + v')
      }
    },
    // A
    DDD: function () {
      var a, b
      // 拿起一杯酒，向 任何一人发问
      if ((a === '诚实' && '酒1' === '毒') || (b === '诚实' && '酒1' === '毒')) {
        // 如果回答是，则当前这杯酒有毒，否则无毒
      }
    },
    slipImgUpload: function (baseData) {
      var that = this
      that.ajax('/file/uploadFileAjaxCopy', {baseData: baseData}).then(res => {
        if (res.code === 200) {
          that.$store.state.slipPreShow = false
          var obj = {
            attachmentId: res.data.attachmentId,
            fileName: res.data.showName,
            previewUrl: res.data.previewUrl
          }
          that.fileListComment.push(obj)
          that.fileListCommentLen = that.fileListComment.length
          that.$message({
            type: 'success',
            message: '文件' + res.msg
          })
          that.loading21 = false
          that.$emit('FileDataEmit', that.fileListComment)
        } else if (res.code === 300) {
          that.$message({
            type: 'error',
            message: res.msg
          })
          that.loading21 = false
        } else {
          that.$message({
            type: 'error',
            message: res.msg
          })
          that.loading21 = false
        }
      })
    },
    FilePreEmitFuc: function (previewUrl, fileName, attachmentId) {
      this.log('fileName:', fileName)
      if (previewUrl && this.isImage(fileName)) {
        this.$store.state.imgPreviewShow = true
        this.$store.state.imgPreviewSrc = previewUrl
      }
      // this.$emit('FilePreEmit', {previewUrl, fileName, attachmentId})
    },
    getFileName: function (filename) {
      var that = this
      var filePath = $('#' + that.lalala + '_myfile2').val()
      var arr = filePath.split('\\')
      var fileName = arr[arr.length - 1]
      if (filePath) {
        if (that.limtImg) {
          if (that.isImage(fileName)) {
            this.uploadFileName = fileName
            that.addMarkInfo4()
          } else {
            this.$message.warning('请上传图片')
            this.uploadFileName = ''
          }
        } else {
          that.addMarkInfo4()
          this.uploadFileName = fileName
        }
        // that.addMarkInfo4()
      }
    },
    delUploadFileComment: function (id) {
      // console.log('id', id)
      var that = this
      that.$confirm('确认删除此附件，确定删除？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.ajax('/file/deleteFile', {attachmentId: id}).then(res => {
          // this.log('选择所属项目:', res)
          if (res.code === 200) {
            that.$message.success('删除成功！')
            for (var i = 0; i < that.fileListComment.length; i++) {
              if (id === that.fileListComment[i].attachmentId) {
                that.fileListComment.splice(i, 1)
              }
            }
            that.fileListCommentLen = that.fileListComment.length
            $('#myfile2').val('')
          }
        })
      }).catch(() => {
        return false
      })
    },
    addMarkInfo4 () {
      var that = this
      that.loading21 = true
      var url = that.$store.state.baseServiceUrl
      var formData = new FormData($('#' + that.lalala)[0])
      if (formData) {
        $.ajax({
          type: 'post',
          url: url + that.filUrl,
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
            var obj = {
              attachmentId: data.data.attachmentId,
              fileName: data.data.showName,
              previewUrl: data.data.previewUrl
            }
            that.fileListComment.push(obj)
            that.fileListCommentLen = that.fileListComment.length
            that.$message({
              type: 'success',
              message: '文件' + data.msg
            })
            that.loading21 = false
            that.$emit('FileDataEmit', that.fileListComment)
          } else if (data.code === 300) {
            that.$message({
              type: 'error',
              message: data.msg
            })
            that.loading21 = false
          } else {
            that.$message({
              type: 'error',
              message: data.msg
            })
            that.loading21 = false
          }
        })
      } else {
        // that.loading = false
        that.$message({
          type: 'error',
          message: '内容不能为空'
        })
        that.loading21 = false
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
    height: 40px;
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
    height: 30px;
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
    padding-top: 10px;
    margin-left: 10px;
  }
</style>
