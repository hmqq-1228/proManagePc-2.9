<template>
    <div class="communications">
      <div class="title">沟通</div>
      <div style="padding: 15px">
        <div class="el-textarea" v-loading="loadingRe">
          <!--enctype="multipart/form-data"-->
          <form id="uploadFile">
            <textarea
              name="content"
              class="el-textarea__inner"
              id="textArea"
              type="text"
              v-model="commitComent"
            ></textarea>
            <div class="hisFileUplBox">
              <div style="display: inline-block">
                <!-- 引入 附件上传 组件 -->
                <component
                  v-bind:is="compArr.FileUploadComp"
                  fileFormId="HistoryFileUpl"
                  v-on:FilePreEmit="GetFilePreData"
                  v-bind:clearInfo="IsClear"
                  v-on:FileDataEmit="GetFileInfo"
                  :filUrl="filUrl"
                ></component>
              </div>
              <div>
                <i-button type="info" v-bind:disabled="butnDisabled" @click="addMarkInfo()">回复</i-button>
              </div>
            </div>
          </form>
        </div>
        <!--操作记录 历史记录-->
        <div class="discription lis" style="margin-top: 15px;">
          <!-- 历史记录 评论 引入组件-->
          <!--<component-->
            <!--v-bind:is="compArr.CommentLogs"-->
            <!--fileFormId="CommentLogs"-->
            <!--v-on:FilePreEmit="GetFilePreData"-->
            <!--:commentList="taskLogs"-->
          <!--&gt;</component>-->
          <div class="timeLine">
            <Timeline v-if="commentList && commentList.length > 0" style="overflow-y: scroll; height: 375px;">
              <Timeline-item color="green" v-for="(comment, index) in commentList" v-bind:key="index">
                <p class="time">{{comment.createDate}}</p>
                <p class="content" v-bind:title="comment.content">{{comment.customer_name}}说: {{comment.content}}</p>
                <span v-for="(com, index2) in comment.attachment" v-bind:key="index2">
              <p class="content" v-if="com.showName">附件:
                <span style="display: inline-block"> {{com.showName}}</span>
                <span v-if="com.isImg" style="display: inline-block;color: #53b5ff;margin-left: 10px;cursor: pointer;" @click="GetFilePreData(com)">预览</span>
                <span style="margin-left: 10px;display: inline-block;"><a v-bind:href="com.downloadUrl"> 下载<i style="font-weight: bold !important; padding: 5px; color: chocolate;" class="el-icon-download"></i></a></span>
              </p>
            </span>
              </Timeline-item>
            </Timeline>
            <div class="noComment" v-if="commentList.length === 0">还没有人发言呦~</div>
          </div>
          <div style="text-align: center" v-if="commentList.length>0">
            <Page
              :total="commentTotalNum"
              size="small"
              :page-size="10"
              show-total
              @on-change="commentPageChange($event)"
            ></Page>
          </div>
        </div>
      </div>
      <!-- 图片预览 -->
      <el-dialog title="图片预览" :visible.sync="dialogShowImg1">
        <div class="showImg">
          <img v-bind:src="commentPreviewUrl1" alt>
        </div>
      </el-dialog>
    </div>
</template>

<script>
import FileUploadComp from './FileUploadComp.vue'
import CommentLogs from './CommentLogs.vue'
export default {
  components: {
    FileUploadComp,
    CommentLogs
  },
  data () {
    return {
      compArr: {
        FileUploadComp,
        CommentLogs
      },
      // 图片预览地址
      commentPreviewUrl1: '',
      // 图片预览是否出现
      dialogShowImg1: false,
      // 是否让子组件清空文件 新组件
      IsClear: false,
      FileUploadArr: [],
      // 回复是否可以点击
      butnDisabled: true,
      loadingRe: false,
      // 回复内容
      commitComent: '',
      // 历史记录
      commentList: [],
      commentTotalNum: 0,
      pageN: 1,
      // 新增 添加评论
      addProjectCommentPayload: {
        content: '',
        attachmentId: '',
        contentId: ''
      },
      filUrl: '/file/uploadGoodsFileAjax'
    }
  },
  watch: {
    commitComent: function (val, oVal) {
      if (val) {
        this.butnDisabled = false
      } else {
        this.butnDisabled = true
      }
    }
  },
  created () {
    this.getHistoryCont()
  },
  methods: {
    // 历史记录 分页值改变
    commentPageChange: function (e) {
      this.pageN = e
      this.getHistoryCont()
    },
    // 历史记录 点击回复
    addMarkInfo () {
      var that = this
      that.loadingRe = true
      that.addProjectCommentPayload.contentId = 'SPU00001'
      that.addProjectCommentPayload.content = that.commitComent
      that.addProjectCommentPayload.attachmentId = that.SetFileIdStr()
      if (that.commitComent) {
        that.ajax('/comment/addGoodsComment', JSON.stringify(that.addProjectCommentPayload)).then(res => {
          if (res.code === 200) {
            that.IsClear = true
            that.$message({
              type: 'success',
              message: res.msg
            })
            that.loadingRe = false
            that.getHistoryCont()
            that.commitComent = ''
          } else {
            that.$message({
              type: 'success',
              message: res.msg
            })
            that.loadingRe = false
          }
        })
      }
    },
    // 历史记录 获取历史记录
    getHistoryCont () {
      var that = this
      that.ajax('/comment/getGoodsComment', {
        spuId: 'SPU00001',
        pageSize: 5,
        pageNum: that.pageN
      }).then(res => {
        if (res.code === 200) {
          that.commentList = res.data.list
          that.commentTotalNum = res.data.totalRow
          if (that.commentList.length > 0) {
            for (var i = 0; i < that.commentList.length; i++) {
              for (var j = 0; j < that.commentList[i].attachment.length; j++) {
                if (that.isImage(res.data.list[i].attachment[j].showName)) {
                  res.data.list[i].attachment[j].isImg = true
                } else {
                  res.data.list[i].attachment[j].isImg = false
                }
                res.data.list[i].attachment[j].downloadUrl = that.$store.state.baseServiceUrl + '/file/downloadGoodsFile?realUrl=' + res.data.list[i].attachment[j].realUrl + '&showName=' + res.data.list[i].attachment[j].showName
              }
            }
          }
        } else {
          that.$message.warning(res.msg)
        }
      })
    },
    // 附件 附件预览
    GetFilePreData (obj) {
      if (obj.previewUrl && this.isImage(obj.showName)) {
        this.showBigImage1(obj.previewUrl)
      }
    },
    showBigImage1: function (url) {
      if (url) {
        this.commentPreviewUrl1 = url
        this.dialogShowImg1 = true
      }
    },
    // 附件上传 获取附件上传组件发来的附件信息 新组件
    GetFileInfo (obj) {
      if (obj) {
        this.IsClear = false
      }
      this.FileUploadArr = obj
    },
    // 附件上传
    // 拼接附件上传的id为字符串
    SetFileIdStr () {
      var that = this
      var FileIdStr = ''
      for (var i = 0; i < that.FileUploadArr.length; i++) {
        var splitIcon = ','
        if (i === that.FileUploadArr.length - 1) {
          splitIcon = ''
        }
        FileIdStr = FileIdStr + that.FileUploadArr[i].attachmentId + splitIcon
      }
      that.FileUploadArr = []
      return FileIdStr
    }
  }
}
</script>

<style scoped>
.communications {
  width: 100%;
  border: 1px solid #ccc;
  /*padding: 20px;*/
}
.communications .title {
  border-bottom: 1px solid #ccc;
  width: 100%;
  height: 40px;
  font-size: 16px;
  line-height: 40px;
  text-indent: 15px;
  background: #f5f8fa;
  color:#333;
  letter-spacing: 2px;
  font-weight: bold;
}
.el-textarea {
  margin-top: 15px;
  margin-left: 0px;
}
.el-textarea__inner {
  width: 100%;
  min-height: 80px;
}
.hisFileUplBox {
  color: #1296db;
  display: flex;
  justify-content: space-between;
  line-height: 40px;
  font-size: 14px;
  /*font-family: '黑体';*/
  padding: 0 10px;
  /*background-color: #f5f8fa;*/
}
.hisFileUplBox div img {
  float: left;
  margin-top: 10px;
  margin-right: 10px;
  width: 18px;
}
  .showImg img {
    width: 100%;
  }
</style>
