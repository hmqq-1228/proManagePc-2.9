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
  </div>
</template>

<script>
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
