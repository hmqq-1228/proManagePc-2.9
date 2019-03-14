<template>
  <div class="CommentLogs">
    <Timeline v-if="commentList && commentList.length > 0">
      <Timeline-item color="green" v-for="(comment, index) in commentList" v-bind:key="index">
        <p class="time">{{comment.oTime}}</p>
        <p class="content" v-bind:title="comment.content">{{comment.comment}}, {{comment.oContent}}</p>
        <span v-for="(com, index2) in comment.uploads" v-bind:key="index2">
                <p class="content" v-if="com.showName">附件:
                  <span style="display: inline-block"> {{com.showName}}</span>
                  <span v-if="com.isImage" style="display: inline-block;color: #53b5ff;margin-left: 10px;cursor: pointer;" @click="showImagePreCom(com.previewUrl, com.showName)">预览</span>
                  <span style="margin-left: 10px;display: inline-block;"><a v-bind:href="com.downloadUrl"> 下载<i style="font-weight: bold !important; padding: 5px; color: chocolate;" class="el-icon-download"></i></a></span>
                </p>
              </span>
      </Timeline-item>
    </Timeline>
    <div class="noComment" v-if="commentList.length === 0">还没有人发言呦~</div>
    <!--<el-dialog title="图片预览" :visible.sync="dialogShowImg">-->
      <!--<div style="z-index: 9999" class="showImg"><img v-bind:src="commentPreviewUrl" alt=""></div>-->
    <!--</el-dialog>-->
  </div>
</template>

<script>
// comment: "上传文件"
// oContent: "由董广发表评论"
// oName: "这个是测试跳转001"
// oTime: "2019-03-13 10:44:53"
// oTitle: "项目"
// uploads: Array(2)
// downloadUrl: "https://ityp.baho.cn:8094/pms/file/downloadFile?realUrl=user/ceshi/2019-03/20190313104449035.png&showName=apple253.png"
// id: "A9e997395100e48358657284076af60cb"
// isImage: true
// previewUrl: "http://baho.oss-cn-hangzhou.aliyuncs.com/user/ceshi/2019-03/20190313104449035.png?Expires=1867805089&OSSAccessKeyId=LTAIvZRrSH0xRwa0&Signature=POuwUS6BGrSaxBPmVEHXbAbPZH8%3D"
// realUrl: "user/ceshi/2019-03/20190313104449035.png"
// showName: "apple253.png"
export default {
  props: ['commentList'],
  name: 'CommentLogs',
  data () {
    return {
      commentPreviewUrl: '',
      dialogShowImg: false
    }
  },
  methods: {
    showImagePreCom: function (previewUrl, fileName) {
      this.log(123)
      this.$emit('FilePreEmit', {previewUrl, fileName})
      // if (url) {
      //   this.commentPreviewUrl = url
      //   this.dialogShowImg = true
      // }
    }
  }
}
</script>

<style scoped>
  div img{
    width: 100%;
  }
  .time{
    font-size: 14px;
    font-weight: bold;
  }
  .content{
    color: #777;
    padding-left: 5px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .noComment{
    height: 50px;
    text-align: center;
    line-height: 50px;
    color: #aaa;
  }
</style>
