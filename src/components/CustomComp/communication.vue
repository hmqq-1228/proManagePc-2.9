<template>
    <div class="communications">
      <!--<Tabs type="card">-->
        <div class="title">
          <div class="list" @click="toCom" :class="type===1 ? 'active':''"><span>沟通</span><i class="el-icon-refresh" style="margin-left: -10px" @click.stop="refreshCom"></i></div>
          <div class="list" @click="toOperation" :class="type===2 ? 'active':''"><span>操作记录</span><i class="el-icon-refresh" style="margin-left: -10px" @click.stop="refreshOp"></i></div>
        </div>
        <!--<TabPane label="沟通">-->
        <div style="padding:0 15px 15px 15px" v-if="type===1">
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
              <div class="timeLine">
                <Timeline v-if="commentList && commentList.length > 0" style="overflow-y: auto; height: 390px;">
                  <Timeline-item color="green" v-for="(comment, index) in commentList" v-bind:key="index">
                    <p class="time">{{comment.createDate}}</p>
                    <p class="content"  v-bind:title="comment.content">{{comment.customer_name}}说: {{comment.content}}</p>
                    <span v-for="(com, index2) in comment.attachment" v-bind:key="index2">
                      <p class="content" v-if="com.showName">附件:
                        <span style="display: inline-block"> {{com.showName}}</span>
                        <span v-if="com.isImg" style="display: inline-block;color: #53b5ff;margin-left: 10px;cursor: pointer;" @click="GetFilePreData(com)">预览</span>
                        <span style="margin-left: 10px;display: inline-block;"><a v-bind:href="com.downloadUrl"> 下载<i style="font-weight: bold !important; padding: 5px; color: chocolate;" class="el-icon-download"></i></a></span>
                      </p>
                    </span>
                  </Timeline-item>
                </Timeline>
                <div class="noComment" v-if="commentList.length === 0" style="height: 420px;">还没有人发言呦~</div>
              </div>
              <div style="text-align: center" v-if="commentList.length>0">
                <Page
                  :total="commentTotalNum"
                  size="small"
                  :page-size="5"
                  show-total
                  @on-change="commentPageChange($event)"
                ></Page>
              </div>
            </div>
          </div>
        <!--</TabPane>-->
        <!--<TabPane label="操作记录">-->
        <div class="timeLine" style="padding:25px 15px" v-if="type===2">
            <Timeline style="overflow-y: auto; height: 505px;" v-if="historyList && historyList.length>0">
              <Timeline-item v-for="(history, index) in historyList" v-bind:key="index">
                <p class="time">{{history.oTime}}</p>
                <p class="content">{{history.oName}}{{history.oContent}}</p>
                <span v-for="(his, index2) in history.attachment" v-bind:key="index2">
                  <p class="content" v-if="his.showName"><span>附件:</span>
                    <span style="display: inline-block"> {{his.showName}}</span>
                    <span v-if="his.isImg" style="display: inline-block;color: #53b5ff;margin-left: 10px;cursor: pointer;" @click="showImagePre(his.previewUrl, his.showName)">预览</span>
                    <span style="margin-left: 10px;display: inline-block;"><a v-bind:href="his.downloadUrl"> 下载<i style="font-weight: bold !important; padding: 5px; color: chocolate;" class="el-icon-download"></i></a></span>
                  </p>
                </span>
              </Timeline-item>
            </Timeline>
            <div class="noComment" v-if="historyList.length === 0" style="height: 420px;">还没有操作记录呦~</div>
            <div style="text-align: center;margin-top:40px" v-if="historyList.length>0">
              <Page :total="totalHistoryNum" size="small" :page-size="pageSize" show-total @on-change="getCurrentHistoryPage($event)"></Page>
            </div>
          </div>
        <!--</TabPane>-->
      <!--</Tabs>-->
      <!-- 图片预览 -->
      <el-dialog title="图片预览" :visible.sync="dialogShowImg1">
        <div class="showImg">
          <img v-bind:src="commentPreviewUrl1" alt style="width: 100%">
        </div>
      </el-dialog>
      <Drawer
        title="成员管理"
        width="740"
        :closable="false"
        v-model="DrawerMember"
        v-loading="DrawerMemberShow"
      >
        <component
          v-bind:is="compArr.member"
          v-bind:proId="proId"
          v-bind:groupId="groupId"
          v-bind:DrawerMemberShow="DrawerMember"
        ></component>
      </Drawer>
    </div>
</template>
<style>
  .ivu-tabs-bar {
    margin-bottom: 0;
  }
</style>
<script>
import FileUploadComp from './FileUploadComp.vue'
import CommentLogs from './CommentLogs.vue'
import member from './members.vue'
export default {
  components: {
    FileUploadComp,
    CommentLogs,
    member
  },
  data () {
    return {
      type: 1,
      totalHistoryNum: 0,
      pageSize: 10,
      pageNo: 1,
      compArr: {
        FileUploadComp,
        CommentLogs,
        member
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
      // 操作记录
      historyList: [],
      commentTotalNum: 0,
      pageN: 1,
      // 新增 添加评论
      addProjectCommentPayload: {
        content: '',
        attachmentId: '',
        contentId: ''
      },
      filUrl: '/file/uploadGoodsFileAjax',
      DrawerMember: false,
      proId: this.$route.params.spuId,
      DrawerMemberShow: false,
      groupId: '1'
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
    this.getHistoryList()
  },
  methods: {
    refreshCom () {
      this.getHistoryCont()
    },
    refreshOp () {
      this.getHistoryList()
    },
    toCom () {
      this.type = 1
    },
    toOperation () {
      this.type = 2
    },
    // 历史记录 分页值改变
    commentPageChange: function (e) {
      this.pageN = e
      this.getHistoryCont()
    },
    getCurrentHistoryPage (e) {
      this.pageNo = e
      this.getHistoryList()
    },
    // 历史记录 点击回复
    addMarkInfo () {
      var that = this
      that.loadingRe = true
      that.addProjectCommentPayload.contentId = this.$route.params.spuId
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
        spuId: this.$route.params.spuId,
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
    // 操作记录
    getHistoryList: function () {
      var that = this
      that.ajax('/archives/getArchivesLog', {
        spuId: this.$route.params.spuId,
        pageSize: 10,
        pageNum: that.pageNo
      }).then(res => {
        if (res.code === 200) {
          that.historyList = res.data.list
          that.totalHistoryNum = res.data.totalRow
          // if (that.historyList.length > 0) {
          //   for (var i = 0; i < that.historyList.length; i++) {
          //     for (var j = 0; j < that.historyList[i].attachment.length; j++) {
          //       if (that.isImage(res.data.list[i].attachment[j].showName)) {
          //         res.data.list[i].attachment[j].isImg = true
          //       } else {
          //         res.data.list[i].attachment[j].isImg = false
          //       }
          //       res.data.list[i].attachment[j].downloadUrl = that.$store.state.baseServiceUrl + '/file/downloadFile?realUrl=' + res.data.list[i].attachment[j].realUrl + '&showName=' + res.data.list[i].attachment[j].showName
          //     }
          //   }
          // }
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
    },
    member () {
      this.DrawerMember = true
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
  font-size: 14px;
  line-height: 40px;
  text-indent: 15px;
  background: #f5f8fa;
  color:#333;
  letter-spacing: 2px;
  font-weight: bold;
}
.communications .title .list {
  float: left;
  cursor: pointer;
  margin-right: 15px;
}
.communications .title .active {
  color:#2d8cf0;
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
.noComment {
  text-align: center;
  line-height: 300px;
}
.content{
  padding-left: 5px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
