<template>
  <div class="HelloWorld">
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-if="router.id" v-for="(router, index) in setRouterNameList" v-bind:key="index"><span style="display: inline-block" @click="getNextPlan(router.id)">{{router.name}}</span></el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="hello" style="margin-top: 15px;">
      <Drawer class="drawerScroll" :closable="false" width="40%" v-model="value4">
        <div class="slidTop">
          <div v-bind:class="'topState' + taskBasicMsg.status"><img src="../../static/img/stataNew.png" alt="">{{taskBasicMsg.statusStr}}</div>
          <div><span>紧急程度: </span><span><Rate v-model="taskBasicMsg.jobLevel" disabled/></span></div>
        </div>
        <div class="taskMsg">
          <div class="taskLf">
            <div class="taskName">{{taskBasicMsg.jobName}}</div>
            <div class="taskDetail" v-bind:title="taskBasicMsg.description">{{taskBasicMsg.description}}</div>
          </div>
          <div class="taskRt">
            <div v-if="taskBasicMsg.status === '0'"><img src="../../static/img/unstart.png" alt=""></div>
            <div v-if="taskBasicMsg.status === '1'"><img src="../../static/img/doing.png" alt=""></div>
            <div v-if="taskBasicMsg.status === '2'"><img src="../../static/img/finish.png" alt=""></div>
          </div>
        </div>
        <div class="taskTime">
          <el-collapse>
            <el-collapse-item style="padding: 0 10px;">
              <template slot="title">
                <img src="../../static/img/time.png" alt=""><span style="margin-left: 10px;">起止时间: {{taskBasicMsg.taskStartDate}} 到 {{taskBasicMsg.taskFinishDate}}</span>
                <div style="margin-left: 10%;" v-if="taskBasicMsg.dayNum && taskBasicMsg.dayNum >= 0">剩余 <span style="color: #53b5ff;font-size: 16px;font-weight: bold">{{taskBasicMsg.dayNum}}</span> 天</div>
                <div style="margin-left: 10%;" v-if="taskBasicMsg.dayNum && taskBasicMsg.dayNum < 0"><span style="color:red;font-size: 16px;">已逾期</span></div>
                <div style="margin-left: 10%;" v-if="!taskBasicMsg.dayNum"><span style="color:#27CF97;font-size: 16px;">已完成</span></div>
              </template>
              <div class="managePro">
                <div><img src="../../static/img/fuzeren.png" alt=""><span class="proLabel">负责人:</span><span>{{taskBasicMsg.userName}}</span></div>
                <div><img src="../../static/img/faqiren.png" alt=""><span class="proLabel">创建人:</span><span>{{taskBasicMsg.createrName}}</span></div>
              </div>
              <div class="managePro" style="margin-top: 10px;">
                <div><img src="../../static/img/kaishi.png" alt=""><span class="proLabel">实际开始:</span><span v-if="taskBasicMsg.dealWithDate">{{taskBasicMsg.dealWithDate}}</span><span v-if="!taskBasicMsg.dealWithDate">暂未开始</span></div>
                <div><img src="../../static/img/jiesu.png" alt=""><span class="proLabel">实际结束:</span><span v-if="taskBasicMsg.realFinishDate">{{taskBasicMsg.realFinishDate}}</span><span v-if="!taskBasicMsg.realFinishDate">暂未完成</span></div>
              </div>
            </el-collapse-item>
           </el-collapse>
        </div>
        <div class="cannetProject">
          <div style="display: inline-block"><img src="../../static/img/guanlian.png" alt=""><span>关联项目:</span></div>
          <span class="linkProject" v-if="taskBasicMsg.reProjectList.length > 0" v-for="(project, index) in taskBasicMsg.reProjectList" v-bind:key="index" @click="getNextPlan(project.projectUID)">{{project.projectName}}</span>
          <span v-if="!taskBasicMsg.reProjectList || taskBasicMsg.reProjectList.length === 0" >未关联项目</span>
        </div>
        <div class="cannetProject">
          <div style="display: inline-block"><img src="../../static/img/xiangmu.png" alt=""><span>所属项目:</span></div>
          <div style="display: inline-block">{{taskBasicMsg.projectName}}</div>
        </div>
        <div class="cannetProject">
          <div style="display: inline-block"><img src="../../static/img/fujian.png" alt=""><span>项目附件:</span></div>
          <div style="display: inline-block;font-size: 14px;" v-if="taskBasicMsg.showName">
            <span style="display: inline-block;">{{taskBasicMsg.showName}}</span>
            <span v-if="taskBasicMsg.isImg" @click="showImagePre" style="margin-left: 10px;display: inline-block;color: #53b5ff;cursor: pointer;">预览</span>
            <span style="margin-left: 10px;display: inline-block;"><a v-bind:href="downurl"> 下载<i style="font-weight: bold !important; padding: 5px; color: chocolate;" class="el-icon-download"></i></a></span>
          </div>
          <div style="display: inline-block;font-size: 14px;" v-if="!taskBasicMsg.showName">暂无附件</div>
        </div>
        <div class="cannetProject" v-if="false">
          <Button type="primary" style="margin-right: 30px;">Primary</Button><Button type="primary" style="margin-right: 30px;">Primary</Button><Button type="primary">Primary</Button>
        </div>
        <div class="cannetProject1">
          <div style="display: inline-block"><img src="../../static/img/goutong.png" alt=""><span>沟 通</span></div>
        </div>
        <div class="el-textarea" v-loading="loading">
          <form id="uploadFile" enctype="multipart/form-data">
            <textarea name="content" class="el-textarea__inner" id="textArea" type="text" v-model="commitComent"></textarea>
            <div class="cannetProject2">
              <div style="display: inline-block">
                <img src="../../static/img/fujian.png" alt="">
                <a href="javascript:;" class="file" @change="getFileName">选择文件
                  <input type="file" name="myfile" id="myfile">
                </a>
                <input type="hidden" name="rid" v-bind:value="rid">
                <input type="hidden" name="rtype" v-bind:value="3">
                <span class="showFileName"></span>
              </div>
              <div><i-button type="info" v-bind:disabled="butnDisabled" @click="addMarkInfo()">回复</i-button></div>
            </div>
          </form>
        </div>
        <div class="cannetProject1-1">
          <div style="display: inline-block"><img src="../../static/img/jilu.png" alt=""><span>沟通记录</span></div>
        </div>
        <div class="timeLine">
          <Timeline v-if="commentList && commentList.length > 0">
            <Timeline-item color="green" v-for="(comment, index) in commentList" v-bind:key="index">
              <p class="time">{{comment.createDate}}</p>
              <p class="content" v-bind:title="comment.content">{{comment.customer_name}}说: {{comment.content}}</p>
              <p class="content" v-if="comment.showName">附件:
                <span style="display: inline-block"> {{comment.showName}}</span>
                <span v-if="comment.isImg" style="display: inline-block;color: #53b5ff;margin-left: 10px;cursor: pointer;" @click="showImagePreCom(comment.previewUrl)">预览</span>
                <span style="margin-left: 10px;display: inline-block;"><a v-bind:href="comment.downloadUrl"> 下载<i style="font-weight: bold !important; padding: 5px; color: chocolate;" class="el-icon-download"></i></a></span>
              </p>
            </Timeline-item>
          </Timeline>
          <div class="noComment" v-if="commentList.length === 0">还没有人发言呦~</div>
          <div style="text-align: center">
            <Page :total="totalNum" size="small" :page-size="pageSize" show-total @on-change="getCurrentPage($event)"></Page>
          </div>
        </div>
        <div class="cannetProject1-1" style="margin-top: 0">
          <div style="display: inline-block"><img src="../../static/img/history.png" alt=""><span>操作记录</span></div>
        </div>
        <div class="timeLine">
          <Timeline>
            <Timeline-item v-for="(history, index) in historyList" v-bind:key="index">
              <p class="time">{{history.oTime}}</p>
              <p class="content">{{history.oName}}{{history.oContent}}</p>
              <p class="content" v-if="history.showName"><span>附件:</span>
                <span style="display: inline-block"> {{history.showName}}</span>
                <span v-if="history.isImg" style="display: inline-block;color: #53b5ff;margin-left: 10px;cursor: pointer;" @click="showImagePreCom(history.previewUrl)">预览</span>
                <span style="margin-left: 10px;display: inline-block;"><a v-bind:href="history.downloadUrl"> 下载<i style="font-weight: bold !important; padding: 5px; color: chocolate;" class="el-icon-download"></i></a></span>
              </p>
            </Timeline-item>
          </Timeline>
          <div style="text-align: center">
            <Page :total="totalHistoryNum" size="small" :page-size="pageSize" show-total @on-change="getCurrentHistoryPage($event)"></Page>
          </div>
        </div>
      </Drawer>
      <el-dialog title="图片预览" :visible.sync="dialogFormVisible">
        <div class="showImg"><img v-bind:src="taskBasicMsg.previewUrl" alt=""></div>
      </el-dialog>
      <el-dialog title="图片预览" :visible.sync="dialogShowImg">
        <div class="showImg"><img v-bind:src="commentPreviewUrl" alt=""></div>
      </el-dialog>
     <div class="topperTitle">
       <div class="topCon">
         <div class="topConLf">
           <div class="title">{{proDetailMsg.projectName}}</div>
           <div class="proDetail" v-bind:title="proDetailMsg.content">{{proDetailMsg.content}}</div>
         </div>
         <div class="topConRt">
           <div style="margin-left: 25%;">
             <div class="myMsg"><div><img src="../../static/img/my.png" alt=""></div><div style="margin-left: 10px;">{{proDetailMsg.projectManager}}</div></div>
             <div class="dataMsg"><div><img src="../../static/img/data.png" alt=""></div><div style="margin-left: 10px;">{{startPlanDate}} 到 {{endPlanDate}}</div></div>
           </div>
           <div class="imgBox" v-if="proDetailMsg.state === '0'"><img src="../../static/img/unstart.png" alt=""></div>
           <div class="imgBox" v-if="proDetailMsg.state === '2'"><img src="../../static/img/doing.png" alt=""></div>
           <div class="imgBox" v-if="proDetailMsg.state === '3'"><img src="../../static/img/finish.png" alt=""></div>
         </div>
       </div>
       <div class="planList">
         <div class="planName">项目计划</div>
         <div class="planBox">
           <div v-if="planList.length > 0" v-bind:class="activeId === plan.id ? 'active' : ''" v-for="plan in planList" v-bind:key="plan.id" @click="selectProject(plan.id,$event)">{{plan.name}}</div>
         </div>
       </div>
     </div>
      <div class="devide">
        <div>项目详情</div>
      </div>
      <div class="block">
        <el-tree
          :data="data5"
          node-key="id"
          @node-expand="getNodeMsg($event)"
          :expand-on-click-node="false">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span class="dataName" @click="showDetailPage(data)">{{data.name}}</span>
            <span class="proMsg">
              <span class="treeName">
                <span v-if="data.type === '2'">
                  <span style="float: left"><img style="width: 16px;" src="../../static/img/my.png" alt=""></span>
                  <span style="float: left;margin-left: 16px;">{{data.userName}}</span>
                </span>
              </span>
              <span class="treeState">
                 <span v-if="data.type === '2'">
                  <span style="float: left"><img style="width: 16px;" src="../../static/img/noted.png" alt=""></span>
                  <span v-if="data.status === '0'" style="float: left;margin-left: 16px;color: #ffd04b;">未确认</span>
                  <span v-if="data.status === '1'" style="float: left;margin-left: 16px;color: #53b5ff;">进行中</span>
                  <span v-if="data.status === '2'" style="float: left;margin-left: 16px;color: #27CF97;">已完成</span>
                 </span>
              </span>
              <span class="treeTime">
                <span style="float: left"><img style="width: 16px;" src="../../static/img/data.png" alt=""></span>
                <span style="float: left;margin-left: 16px;">{{data.start}} - {{data.finish}}</span>
              </span>
            </span>
          </span>
        </el-tree>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: ['proId'],
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      rid: '',
      taskId: '',
      pageSize: 5,
      downurl: '',
      fileName: '',
      totalNum: 1,
      currentProId: '',
      totalHistoryNum: 1,
      dialogShowImg: false,
      commentPreviewUrl: '',
      loading: false,
      value4: false,
      valueSlide: 5,
      activeId: '',
      proDetailMsg: '',
      taskList: [],
      planList: [],
      historyList: [],
      setRouterNameList: [],
      startPlanDate: '',
      endPlanDate: '',
      taskBasicMsg: '',
      commitComent: '',
      butnDisabled: true,
      dialogFormVisible: false,
      data5: [],
      commentList: [],
      taskComment: {
        uid: '',
        pageNum: 1,
        pageSize: 5
      },
      taskHistoryList: {
        uid: '',
        pageNum: 1,
        pageSize: 5
      }
    }
  },
  created: function () {
    // this.getProjectDetail()
    // this.setRouterNameList = this.$store.state.routerList
    // console.log('setRouterNameList', this.setRouterNameList)
  },
  watch: {
    proId: function (val, oVal) {
      this.currentProId = val
      this.getProjectDetail()
    },
    commitComent: function (val, oVal) {
      if (val) {
        this.butnDisabled = false
      } else {
        this.butnDisabled = true
      }
    },
    fileName: function (val, oval) {
    }
  },
  methods: {
    getNodeMsg: function (e) {
      // this.value4 = true
      var that = this
      this.$set(e, 'children', [])
      that.ajax('/leader/getPlanOrTaskById', {id: e.id}).then(res => {
        if (res.code === 200) {
          for (var i = 0; i < res.data.planOrJobList.length; i++) {
            res.data.planOrJobList[i].start = res.data.planOrJobList[i].start.split(' ')[0]
            res.data.planOrJobList[i].finish = res.data.planOrJobList[i].finish.split(' ')[0]
            res.data.planOrJobList[i].children = [{
              id: 1,
              name: '测试'
            }]
          }
          e.children = res.data.planOrJobList
        }
      })
    },
    getProjectDetail: function () {
      var that = this
      // that.setRouterNameList = []
      console.log('setRouterNameList', that.setRouterNameList)
      // that.$store.state.routerList = []
      that.ajax('/leader/getPlanOrTaskByProjectId', {projectUID: that.currentProId}).then(res => {
        if (res.code === 200) {
          that.proDetailMsg = res.data.projectDetail
          that.$store.commit('setRouterName', {name: res.data.projectDetail.projectName, id: res.data.projectDetail.projectUID})
          that.setRouterNameList = that.$store.state.routerList
          that.startPlanDate = res.data.projectDetail.startDate.split(' ')[0]
          that.endPlanDate = res.data.projectDetail.endDate.split(' ')[0]
          that.planList = res.data.planOrJobList
          that.activeId = res.data.planOrJobList[0].id
          that.selectProjectId()
        }
      })
    },
    selectProjectId: function () {
      var that = this
      that.ajax('/leader/getPlanOrTaskById', {id: that.activeId}).then(res => {
        if (res.code === 200) {
          for (var i = 0; i < res.data.planOrJobList.length; i++) {
            res.data.planOrJobList[i].start = res.data.planOrJobList[i].start.split(' ')[0]
            res.data.planOrJobList[i].finish = res.data.planOrJobList[i].finish.split(' ')[0]
            res.data.planOrJobList[i].children = [{
              id: 1,
              name: '测试'
            }]
          }
          that.data5 = res.data.planOrJobList
        }
      })
    },
    selectProject: function (id, e) {
      var that = this
      that.data5 = []
      var obj = e.currentTarget
      if (id) {
        that.activeId = id
      }
      $(obj).addClass('active').siblings().removeClass('active')
      if ($(obj).hasClass('active')) {
        that.ajax('/leader/getPlanOrTaskById', {id: that.activeId}).then(res => {
          if (res.code === 200) {
            for (var i = 0; i < res.data.planOrJobList.length; i++) {
              res.data.planOrJobList[i].start = res.data.planOrJobList[i].start.split(' ')[0]
              res.data.planOrJobList[i].finish = res.data.planOrJobList[i].finish.split(' ')[0]
              res.data.planOrJobList[i].children = [{
                id: 1,
                name: '测试'
              }]
            }
            that.data5 = res.data.planOrJobList
          }
        })
      }
    },
    showDetailPage: function (data) {
      var that = this
      if (data.type === '2') {
        that.taskId = data.id
        that.taskComment.uid = data.id
        that.taskHistoryList.uid = data.id
        that.value4 = true
        that.getCommicateCont()
        that.getHistoryList()
        that.ajax('/leader/getTaskBasic', {uid: that.taskId}).then(res => {
          if (res.code === 200) {
            that.taskBasicMsg = res.data
            that.rid = res.data.uid
            if (that.isImage(res.data.showName)) {
              res.data.isImg = true
            } else {
              res.data.isImg = false
            }
            that.downurl = that.$store.state.baseServiceUrl + '/file/downloadFile?realUrl=' + res.data.realUrl + '&showName=' + res.data.showName
          }
        })
      }
    },
    showImagePre: function () {
      this.dialogFormVisible = true
    },
    showImagePreCom: function (url) {
      if (url) {
        this.commentPreviewUrl = url
        this.dialogShowImg = true
      }
    },
    getCommicateCont: function () {
      var that = this
      that.ajax('/leader/getTaskComment', that.taskComment).then(res => {
        if (res.code === 200) {
          that.commentList = res.data.list
          that.totalNum = res.data.totalRow
          for (var i = 0; i < that.commentList.length; i++) {
            if (that.isImage(res.data.list[i].showName)) {
              res.data.list[i].isImg = true
            } else {
              res.data.list[i].isImg = false
            }
            res.data.list[i].downloadUrl = that.$store.state.baseServiceUrl + '/file/downloadFile?realUrl=' + res.data.list[i].realUrl + '&showName=' + res.data.list[i].showName
          }
        }
      })
    },
    getCurrentPage: function (e) {
      this.taskComment.pageNum = e
      this.getCommicateCont()
    },
    getHistoryList: function () {
      var that = this
      that.ajax('/leader/getTaskLog', that.taskHistoryList).then(res => {
        if (res.code === 200) {
          that.historyList = res.data.list
          that.totalHistoryNum = res.data.totalRow
          for (var i = 0; i < that.historyList.length; i++) {
            if (that.isImage(res.data.list[i].showName)) {
              res.data.list[i].isImg = true
              that.historyList[i].downloadUrl = that.$store.state.baseServiceUrl + '/file/downloadFile?realUrl=' + res.data.list[i].realUrl + '&showName=' + res.data.list[i].showName
            } else {
              res.data.list[i].isImg = false
            }
          }
        }
      })
    },
    getCurrentHistoryPage: function (e) {
      this.taskHistoryList.pageNum = e
      this.getHistoryList()
    },
    getFileName: function () {
      var filePath = $('#myfile').val()
      var arr = filePath.split('\\')
      var fileName = arr[arr.length - 1]
      $('.showFileName').html(fileName)
    },
    addMarkInfo () {
      var that = this
      var url = that.$store.state.baseServiceUrl
      var formData = new FormData($('#uploadFile')[0])
      var taxtV = $('#textArea').val()
      that.loading = true
      if (taxtV) {
        $.ajax({
          type: 'post',
          url: url + '/general/addOrEditComment',
          data: formData,
          cache: false,
          processData: false,
          contentType: false,
          crossDomain: true,
          xhrFields: {
            withCredentials: true
          }
        }).then(function (data) {
          if (data.code === 200) {
            that.$message({
              type: 'success',
              message: data.msg
            })
            that.getCommicateCont()
            $('#textArea').val('')
            that.commitComent = ''
            $('.showFileName').html('')
            that.loading = false
          } else {
            that.$message({
              type: 'error',
              message: data.msg
            })
            $('.showFileName').html('')
            that.loading = false
          }
        })
      } else {
        that.$message({
          type: 'error',
          message: '备注不能为空！'
        })
        that.loading = false
      }
    },
    getNextPlan: function (pId) {
      var that = this
      that.value4 = false
      that.planList = []
      that.data5 = []
      that.currentProId = pId
      // that.$store.commit('setRouterName', {name: name, id: pId})
      that.setRouterNameList = that.$store.state.routerList
      that.getProjectDetail()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  /*display: inline-block;*/
  margin: 0 10px;
}
a {
  color: #1296db;
}
.topCon{
  display: flex;
  justify-content: space-between;
}
.topConLf{
  width: 75%;
}
  .title{
    height: 30px;
    color: chocolate;
    font-size: 18px;
    font-family: '黑体';
    font-weight: bold;
  }
  .proDetail{
    font-size: 14px;
    color: #666;
    text-indent: 2em;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    text-overflow:ellipsis;
    overflow: hidden;
  }
  .proDetail{
    overflow:hidden;
    text-overflow:ellipsis;
    display:-webkit-box;
    -webkit-line-clamp:3;
    -webkit-box-orient:vertical;
  }
  .topConRt{
    width: 25%;
    position: relative;
  }
  .imgBox{
    position: absolute;
    top: 0;
    right: 0;
    width: 120px;
  }
  .imgBox img{
    width: 100%;
  }
  .myMsg,.dataMsg{
    color: #888;
    display: flex;
    font-size: 15px;
    justify-content: start;
    line-height: 25px;
  }
  .planName{
    width: 20px;
    font-size: 14px;
    color: #fff;
    float: left;
    padding: 10px 2px;
    text-align: center;
    background-color: #3ca00b;
    border-radius: 6px;
  }
  .planList{
    width: 96%;
    display: flex;
    margin-top: 30px;
  }
  .planBox{
    width: 98%;
    float: left;
  }
.planBox div{
  padding: 4px 20px;
  float: left;
  border-radius: 4px;
  background-color: #ebeef5;
  margin-left: 25px;
  margin-top: 15px;
  color: #777;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
}
  .devide{
    height: 40px;
    clear: both;
    line-height: 40px;
    padding: 0 10px;
    font-size: 16px;
    color: #999;
    margin-top: 20px;
    background-color: #f5f5f5;
  }
.custom-tree-node {
  flex: 1;
  align-items: center;
  font-size: 14px;
  padding-right: 8px;
}
.treeName{
 width: 240px;
}
.treeTime{
  float: right;
}
.treeState{
  width: 100px;
}
  .proMsg{
    width: 700px;
    float: right;
    display: flex;
    justify-content: space-between;
  }
.planBox .active{
    color: #fff;
    background-color: #409EFF;
  }
.dataName{
  display: inline-block;
}
  .dataName:hover{
    color: chocolate;
  }
  .slidTop{
    height: 40px;
    line-height: 40px;
    font-size: 15px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #f1f1f1;
  }
  .topState0 img,.topState1 img,.topState2 img{
    float: left;
    margin-top: 6px;
  }
.topState0{
  color: #ffc107;
}
.topState1{
  color: #26a2ff;
}
.topState2{
  color: #27CF97;
}
  .taskLf{
    padding: 10px;
    width: 80%;
  }
  .taskName{
    font-size: 16px;
    font-weight: bold;
    font-family: '黑体';
  }
  .taskDetail{
    font-size: 14px;
    margin-top: 10px;
    text-indent: 2em;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    text-overflow:ellipsis;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }
  .taskRt{
    width: 20%;
    position: relative;
  }
  .taskRt div{
    width: 90px;
    float: right;
    margin: 10px;
  }
.taskRt div img{
  width: 100%;
}
  .taskMsg{
    background-color: #f5f8fa;
    display: flex;
    justify-content: space-between;
  }
  .managePro{
    display: flex;
    justify-content: space-between;
  }
  .managePro div{
    width: 50%;
  }
.managePro div img{
  float: left;
  margin-right: 20px;
}
.managePro div .proLabel{
  color: #1296db;
  display: inline-block;
  margin-right: 20px;
}
  .cannetProject{
    height: 49px;
    line-height: 49px;
    border-bottom: 1px solid #f1f1f1;
    font-size: 15px;
    font-family: '黑体';
    padding:0 10px;
  }
.cannetProject1{
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #f1f1f1;
  background-color: #f5f8fa;
  font-size: 16px;
  font-family: '黑体';
  font-weight: bold;
  padding:0 10px;
}
.cannetProject1-1{
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #f1f1f1;
  background-color: #f5f8fa;
  font-size: 16px;
  font-family: '黑体';
  font-weight: bold;
  padding:0 10px;
  margin-top: 20px;
  border-top: 1px solid #f1f1f1;
}
.cannetProject2{
  height: 40px;
  width: 90%;
  color: #1296db;
  display: flex;
  justify-content: space-between;
  line-height: 40px;
  font-size: 14px;
  /*font-family: '黑体';*/
  padding:0 10px;
  background-color: #f5f8fa;
}
.cannetProject2 div img{
  float: left;
  margin-top: 10px;
  margin-right: 10px;
  width: 18px;
}
.cannetProject div img{
  float: left;
  margin-top: 15px;
  margin-right: 10px;
}
.cannetProject1 div img{
  float: left;
  margin-top: 9px;
  margin-right: 10px;
}
.cannetProject1-1 div img{
  float: left;
  margin-top: 9px;
  margin-right: 10px;
}
  .el-textarea{
    margin-top: 20px;
    margin-left: 10px;
  }
  .el-textarea__inner{
    width: 90%;
    min-height: 80px;
  }
.file {
  position: relative;
  display: inline-block;
  background: #D0EEFF;
  border: 1px solid #99D3F5;
  border-radius: 4px;
  padding: 4px 12px;
  overflow: hidden;
  color: #1E88C7;
  text-decoration: none;
  text-indent: 0;
  line-height: 20px;
  margin-top: 6px;
}
.file input {
  position: absolute;
  font-size: 100px;
  right: 0;
  top: 0;
  opacity: 0;
}
.file:hover {
  background: #AADFFD;
  border-color: #78C3F3;
  color: #004974;
  text-decoration: none;
}
  .showFileName{
    float: right;
    margin-left: 10px;
  }
.time{
  font-size: 14px;
  font-weight: bold;
}
.content{
  padding-left: 5px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.timeLine{
  padding: 20px;
}
  .linkProject{
    color: #fff;
    font-size: 14px;
    padding: 4px 10px;
    background-color: #409EFF;
    margin-right: 10px;
    border-radius: 4px;
    cursor: pointer;
  }
.linkProject:hover{
  background-color: #1771ff;
}
  .showImg img{
    width: 100%;
  }
  .noComment{
    height: 50px;
    text-align: center;
    line-height: 50px;
    color: #aaa;
  }
</style>
