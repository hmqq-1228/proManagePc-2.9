<template>
  <div>
      <div class="slidTop">
        <div v-bind:class="'topState' + taskBasicMsg.status"><img src="../../../static/img/stataNew.png" alt="">{{taskBasicMsg.statusStr}}</div>
        <div><span>紧急程度: </span><span><Rate v-model="taskBasicMsg.jobLevel" disabled/></span></div>
        <div style="display: flex;justify-content: space-between">
          <div style="width: 50px;" v-if="taskBasicMsg.showDeleteFlag" @click="delTask(taskBasicMsg.uid)"><Icon type="ios-trash-outline" size="24" color="#53b5ff"/></div>
          <div @click="modifyTask()" style="width: 50px;padding-top: 3px;font-size: 14px;color: #409EFF" v-if="taskBasicMsg.showMenu===0?false:true"><i class="el-icon-edit" style="font-size: 18px;color: #409EFF"></i> 修改</div>
        </div>
      </div>
      <div class="taskMsg">
        <div class="taskLf">
          <div class="taskName">{{taskBasicMsg.jobName}}</div>
          <div class="taskDetail" v-bind:title="taskBasicMsg.description">{{taskBasicMsg.description}}</div>
        </div>
        <div class="taskRt">
          <div v-if="taskBasicMsg.status === '0'"><img src="../../../static/img/unstart.png" alt=""></div>
          <div v-if="taskBasicMsg.status === '1'"><img src="../../../static/img/doing.png" alt=""></div>
          <div v-if="taskBasicMsg.status === '2'"><img src="../../../static/img/finish.png" alt=""></div>
        </div>
      </div>
      <div class="taskTime">
        <el-collapse>
          <el-collapse-item style="padding: 0 10px;">
            <template slot="title">
              <img src="../../../static/img/time.png" alt=""><span style="margin-left: 10px;">起止时间: {{taskBasicMsg.taskStartDate}} 到 {{taskBasicMsg.taskFinishDate}}</span>
              <div style="margin-left: 10%;" v-if="taskBasicMsg.dayNum && taskBasicMsg.dayNum >= 0">剩余 <span style="color: #53b5ff;font-size: 16px;font-weight: bold">{{taskBasicMsg.dayNum}}</span> 天</div>
              <div style="margin-left: 10%;" v-if="taskBasicMsg.dayNum && taskBasicMsg.dayNum < 0"><span style="color:red;font-size: 16px;">已逾期</span></div>
              <div style="margin-left: 10%;" v-if="!taskBasicMsg.dayNum"><span v-bind:class="'topState' + taskBasicMsg.status">{{taskBasicMsg.statusStr}}</span></div>
            </template>
            <div class="managePro">
              <div><img src="../../../static/img/fuzeren.png" alt=""><span class="proLabel">负责人:</span><span>{{taskBasicMsg.userName}}</span></div>
              <div><img src="../../../static/img/faqiren.png" alt=""><span class="proLabel">创建人:</span><span>{{taskBasicMsg.createrName}}</span></div>
            </div>
            <div class="managePro" style="margin-top: 10px;">
              <div><img src="../../../static/img/kaishi.png" alt=""><span class="proLabel">实际开始:</span><span v-if="taskBasicMsg.dealWithDate">{{taskBasicMsg.dealWithDate}}</span><span style="color: #888;" v-if="!taskBasicMsg.dealWithDate">暂未开始</span></div>
              <div><img src="../../../static/img/jiesu.png" alt=""><span class="proLabel">实际结束:</span><span v-if="taskBasicMsg.realFinishDate">{{taskBasicMsg.realFinishDate}}</span><span style="color: #888;" v-if="!taskBasicMsg.realFinishDate">暂未完成</span></div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="cannetProject">
        <div style="display: inline-block"><img src="../../../static/img/guanlian.png" alt=""><span>关联项目:</span></div>
        <span class="linkProject" v-if="taskBasicMsg.reProjectList.length > 0" v-for="(project, index) in taskBasicMsg.reProjectList" v-bind:key="index" @click="getNextPlan(project.projectUID)">{{project.projectName}}</span>
        <span style="font-size: 14px;color: #888;" v-if="!taskBasicMsg.reProjectList || taskBasicMsg.reProjectList.length === 0" >未关联项目</span>
      </div>
      <div class="cannetProject">
        <div style="display: inline-block"><img src="../../../static/img/xiangmu.png" alt=""><span>所属项目:</span></div>
        <div style="display: inline-block">{{taskBasicMsg.projectName}}</div>
      </div>
      <div class="cannetProject">
        <div style="display: inline-block"><img src="../../../static/img/taskFa.png" alt=""><span>父级任务:</span></div>
        <div style="display: inline-block;color: #409EFF;cursor: pointer;" v-if="taskBasicMsg.parentTaskName" @click="toDetail(taskBasicMsg.parentTaskID)">{{taskBasicMsg.parentTaskName}}</div>
        <div style="display: inline-block;color: #888;" v-if="!taskBasicMsg.parentTaskName">无父级任务</div>
      </div>
      <div class="cannetProjectFile">
        <div style="display: inline-block"><img src="../../../static/img/fujian.png" alt=""><span>任务附件:</span></div>
        <div style="display: inline-block;font-size: 14px;line-height: 26px;" v-if="taskBasicMsg.attachment">
          <span v-for="(file, index) in taskBasicMsg.attachment" v-bind:key="index" style="margin-left: 10px;">
            <span style="display: inline-block;">{{file.showName}}</span>
            <span v-if="file.isImg" @click="showImagePre(file.previewUrl, file.showName)" style="display: inline-block;color: #53b5ff;cursor: pointer;">预览</span>
            <span style="display: inline-block;"><a v-bind:href="file.downurl"> 下载<i style="font-weight: bold !important; padding: 5px; color: chocolate;" class="el-icon-download"></i></a></span>
          </span>
        </div>
        <div style="display: inline-block;font-size: 14px;color: #888;" v-if="!taskBasicMsg.attachment || taskBasicMsg.attachment.length === 0">暂无附件</div>
      </div>
      <div class="cannetProject" v-if="taskBasicMsg.showMenu===0?false:true">
        <Button v-if="taskBasicMsg.status === '0'" type="warning" style="margin-right: 20px;" @click="startTask(taskBasicMsg.uid)">任务开始</Button>
        <Button v-if="taskBasicMsg.status === '1'" type="success" style="margin-right: 20px;" @click="finishedTask()">任务完成</Button>
        <Button type="info" style="margin-right: 20px;" @click="transferTask()">任务移交</Button>
        <Button type="info" @click="taskToDevided(taskBasicMsg.uid)">任务分解</Button>
      </div>
      <div class="cannetProject" v-if="taskBasicMsg.isRestart">
        <Button v-if="taskBasicMsg.status === '2'" type="primary" style="margin-right: 20px;" @click="isReStartTask(taskBasicMsg.uid)">任务重启</Button>
      </div>
      <!-- 任务分解 引入组件-->
      <component v-bind:is="compArr.TaskDistribute"
                 fileFormId="TaskDistribute"
                 v-bind:TaskDistributeShow="toShowDevided"
                 v-on:DistributeFormVisible="DistributeFormVisibleFuc"
                 v-on:TaskDistributeCallback="TaskDistributeCallbackFuc"
                 :nodeId="currentNodeId">
      </component>
      <!-- 任务分解 end -->
      <div class="cannetProject1">
        <div style="display: inline-block"><img src="../../../static/img/taskList.png" alt=""><span>子任务<span style="color: #409EFF">({{childTaskList.length}})</span></span></div>
      </div>
      <div class="taskListChild">
        <div class="taskItemChild" v-if="childTaskList.length > 0" v-for="(childTask, index) in childTaskList" v-bind:key="index">
          <div class="childTaskName" @click="toDetail(childTask.uid)"><Icon type="md-copy" size="16" color="#409EFF"/> {{childTask.jobName}}</div>
          <div class="childTaskMsg">
            <div style="width: 60px;" v-bind:class="'childTaskStyle' + childTask.status">{{childTask.statusStr}}</div>
            <div style="width: 100px;" v-if="childTask.dayNum >= 0">剩余 <span style="color: #13ce66;font-size: 18px;">{{childTask.dayNum}}</span> 天</div>
            <div style="width: 100px;" v-if="childTask.dayNum < 0">逾期 <span style="color: #f00;font-size: 18px;">{{Math.abs(childTask.dayNum)}}</span> 天</div>
            <div style="width: 160px;">{{childTask.userName}}</div>
            <div style="margin-right: 0" class="taskDel" @click="childTaskDelete(childTask.uid)"><Icon type="md-close" size="18"/></div>
          </div>
        </div>
        <div class="taskItemChild2" style="text-align: center;color: #aaa;" v-if="childTaskList.length === 0">
          暂无子任务
        </div>
      </div>
      <div class="cannetProject1">
        <div style="display: inline-block"><img src="../../../static/img/goutong.png" alt=""><span>沟 通</span></div>
      </div>
      <div class="el-textarea" v-loading="loading2">
        <textarea name="content" class="el-textarea__inner" id="textArea2" type="text" v-model="commitComent"></textarea>
        <div class="cannetProject21">
          <!--引入组件 详情 沟通-->
          <component v-bind:is="compArr.FileUploadComp" fileFormId="taskDetailConnect" v-bind:clearInfo="IsClear" v-on:FileDataEmit="GetFileInfo"></component>
          <div><i-button type="info" style="margin-top: 6px;" v-bind:disabled="butnDisabled" @click="taskDetailconnect()">回复</i-button></div>
        </div>
      </div>
      <div class="cannetProject1-1">
        <div style="display: inline-block"><img src="../../../static/img/jilu.png" alt=""><span>沟通记录</span></div>
      </div>
      <div class="timeLine">
        <Timeline v-if="commentList && commentList.length > 0">
          <Timeline-item color="green" v-for="(comment, index) in commentList" v-bind:key="index">
            <p class="time">{{comment.createDate}}</p>
            <p class="content" v-bind:title="comment.content">{{comment.customer_name}}说: {{comment.content}}</p>
            <span v-for="(com, index2) in comment.attachment" v-bind:key="index2">
              <p class="content" v-if="com.showName">附件:
                <span style="display: inline-block"> {{com.showName}}</span>
                <span v-if="com.isImg" style="display: inline-block;color: #53b5ff;margin-left: 10px;cursor: pointer;" @click="showImagePreCom(com.previewUrl)">预览</span>
                <span style="margin-left: 10px;display: inline-block;"><a v-bind:href="com.downloadUrl"> 下载<i style="font-weight: bold !important; padding: 5px; color: chocolate;" class="el-icon-download"></i></a></span>
              </p>
            </span>
          </Timeline-item>
        </Timeline>
        <div class="noComment" v-if="commentList.length === 0">还没有人发言呦~</div>
        <div style="text-align: center">
          <Page :total="totalNum" size="small" :page-size="pageSize" show-total @on-change="getCurrentPage($event)"></Page>
        </div>
      </div>
      <div class="cannetProject1-1" style="margin-top: 0">
        <div style="display: inline-block"><img src="../../../static/img/history.png" alt=""><span>操作记录</span></div>
      </div>
      <div class="timeLine">
        <Timeline>
          <Timeline-item v-for="(history, index) in historyList" v-bind:key="index">
            <p class="time">{{history.oTime}}</p>
            <p class="content">{{history.oName}}{{history.oContent}}</p>
            <span v-for="(his, index2) in history.attachment" v-bind:key="index2">
              <p class="content" v-if="his.showName"><span>附件:</span>
                <span style="display: inline-block"> {{his.showName}}</span>
                <span v-if="his.isImg" style="display: inline-block;color: #53b5ff;margin-left: 10px;cursor: pointer;" @click="showImagePreCom(his.previewUrl)">预览</span>
                <span style="margin-left: 10px;display: inline-block;"><a v-bind:href="his.downloadUrl"> 下载<i style="font-weight: bold !important; padding: 5px; color: chocolate;" class="el-icon-download"></i></a></span>
              </p>
            </span>
          </Timeline-item>
        </Timeline>
        <div style="text-align: center">
          <Page :total="totalHistoryNum" size="small" :page-size="pageSize" show-total @on-change="getCurrentHistoryPage($event)"></Page>
        </div>
      </div>
    <!--<Drawer class="drawerScroll" title="修改任务" :closable="false" width="40%" v-model="modifyTaskVisible">-->
      <!--&lt;!&ndash; 修改任务 编辑任务 引入组件 &ndash;&gt;-->
      <!--<component v-bind:is="compArr.ModifyTask" v-bind:DrawerOpen="modifyTaskVisible" fileFormId="ModifyTask" v-on:FilePreEmit="GetFilePreData" v-on:ModifyTaskCallback="ModifyTaskCallbackFuc" :nodeId="currentNodeId"></component>-->
    <!--</Drawer>-->
  </div>
</template>

<script>
import FileUploadComp from '././FileUploadComp.vue'
import ModifyTask from './ModifyTask.vue'
import TaskDistribute from './TaskDistribute.vue'
export default {
  name: 'DrawerComp',
  props: ['nodeId', 'taskDrawerOpen', 'modifyTaskRes'],
  components: {
    ModifyTask,
    FileUploadComp,
    TaskDistribute
  },
  data () {
    return {
      rid: '',
      taskIdEdit: '',
      IsClear: false,
      loading2: false,
      loading9: false,
      loading11: false,
      showDrawer: false,
      butnDisabled: true,
      butnDisabledT: true,
      transferUserId: '',
      transferUserName: '',
      selDateEnd2: '',
      selDateStart2: '',
      taskBasicMsg: '',
      currentNodeId: '',
      commitComent: '',
      pageSize: 5,
      totalNum: 0,
      showFileUrl: '',
      toShowDevided: false,
      modifyTaskVisible: false,
      taskId: [],
      fileListTrans: [],
      commentList: [],
      historyList: [],
      FileUploadArr: [],
      childTaskList: [],
      totalHistoryNum: 0,
      pickerOptions3: {},
      disabledStarTime: '',
      disabledEndTime: '',
      taskComment: {
        uid: '',
        pageNum: 1,
        pageSize: 5
      },
      taskHistoryList: {
        uid: '',
        pageNum: 1,
        pageSize: 5
      },
      // 引入组件
      compArr: {
        ModifyTask: 'ModifyTask',
        FileUploadComp: 'FileUploadComp',
        TaskDistribute: 'TaskDistribute'
      }
    }
  },
  watch: {
    modifyTaskRes: function (val, oV) {
      if (val) {
        this.toDetail(this.nodeId)
      }
    },
    taskDrawerOpen: function (val, oV) {
      var that = this
      console.log('taskDrawerOpen', val)
      if (val) {
        that.showDrawer = true
        that.toDetail(that.nodeId)
      } else {
        that.showDrawer = false
      }
    },
    commitComent: function (val, oVal) {
      if (val) {
        this.butnDisabled = false
      } else {
        this.butnDisabled = true
      }
    }
  },
  methods: {
    resetScro: function () {
      $('.ivu-drawer-body').scrollTop(0)
    },
    toDetail: function (id) {
      var that = this
      if (id) {
        that.taskId = id
        that.getTaskChildList(id)
        that.ajax('/myTask/queryTaskDetail', {taskId: id}).then(res => {
          // this.log('查看返回：', res)
          if (res.code === 200) {
            that.taskBasicMsg = res.data
            that.rid = res.data.uid
            var st = res.data.taskStartDate.split(' ')[0] + ' 00:00:00'
            var et = res.data.taskFinishDate
            var sT = new Date(st)
            var eT = new Date(et)
            that.disabledStarTime = sT.getTime()
            that.disabledEndTime = eT.getTime()
            that.pickerOptions3.disabledDate = function (time) {
              return time.getTime() < that.disabledStarTime || time.getTime() > that.disabledEndTime
            }
            for (var n = 0; n < res.data.attachment.length; n++) {
              res.data.attachment[n].downurl = that.$store.state.baseServiceUrl + '/file/downloadFile?realUrl=' + res.data.attachment[n].realUrl + '&showName=' + res.data.attachment[n].showName
              if (that.isImage(res.data.attachment[n].showName)) {
                res.data.attachment[n].isImg = true
              } else {
                res.data.attachment[n].isImg = false
              }
            }
            that.resetScro()
            that.taskComment.uid = id
            that.taskHistoryList.uid = id
            that.getHistoryList()
            that.getCommicateCont()
          }
        })
      } else {
        that.getTaskChildList(that.taskId)
        that.ajax('/myTask/queryTaskDetail', {taskId: that.taskId}).then(res => {
          this.log('查看返回2：', res)
          if (res.code === 200) {
            that.taskBasicMsg = res.data
            that.rid = res.data.uid
            var st = res.data.taskStartDate.split(' ')[0] + ' 00:00:00'
            var et = res.data.taskFinishDate
            var sT = new Date(st)
            var eT = new Date(et)
            that.disabledStarTime = sT.getTime()
            that.disabledEndTime = eT.getTime()
            that.pickerOptions0.disabledDate = function (time) {
              return time.getTime() < that.disabledStarTime || time.getTime() > that.disabledEndTime
            }
            for (var n = 0; n < res.data.attachment.length; n++) {
              res.data.attachment[n].downurl = that.$store.state.baseServiceUrl + '/file/downloadFile?realUrl=' + res.data.attachment[n].realUrl + '&showName=' + res.data.attachment[n].showName
              if (that.isImage(res.data.attachment[n].showName)) {
                res.data.attachment[n].isImg = true
              } else {
                res.data.attachment[n].isImg = false
              }
            }
            that.resetScro()
            that.taskComment.uid = that.taskId
            that.taskHistoryList.uid = that.taskId
            that.getHistoryList()
            that.getCommicateCont()
          }
        })
      }
    },
    delTask: function (id) {
      var that = this
      // console.log('id', id)
      that.$confirm('删除本条会包括本条及其包含内容，确定删除？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      }).then(() => {
        that.ajax('/myTask/delTaskById', {taskId: id}).then(res => {
          if (res.code === 200) {
            // that.log('delPlanOrTask:', res)
            that.value4 = false
            that.getTaskChildList(id)
            // that.selectProjectId()
            that.getHistoryList()
          }
        }).catch(() => {
          // that.loading = false
        })
      })
    },
    getTaskChildList: function (id) {
      var that = this
      if (id) {
        that.ajax('/myTask/myChildTask', {taskId: id}).then(res => {
          if (res.code === 200) {
            that.childTaskList = res.data
            // that.log('that.childTaskList:', that.childTaskList)
          }
        })
      } else {
        that.ajax('/myTask/myChildTask', {taskId: that.taskId}).then(res => {
          if (res.code === 200) {
            // that.log('myChildTask:', res)
            that.childTaskList = res.data
          }
        })
      }
    },
    getHistoryList: function () {
      var that = this
      that.ajax('/myTask/getTaskLog', that.taskHistoryList).then(res => {
        if (res.code === 200) {
          that.historyList = res.data.list
          that.totalHistoryNum = res.data.totalRow
          if (that.historyList.length > 0) {
            for (var i = 0; i < that.historyList.length; i++) {
              for (var j = 0; j < that.historyList[i].attachment.length; j++) {
                if (that.isImage(res.data.list[i].attachment[j].showName)) {
                  res.data.list[i].attachment[j].isImg = true
                } else {
                  res.data.list[i].attachment[j].isImg = false
                }
                res.data.list[i].attachment[j].downloadUrl = that.$store.state.baseServiceUrl + '/file/downloadFile?realUrl=' + res.data.list[i].attachment[j].realUrl + '&showName=' + res.data.list[i].attachment[j].showName
              }
            }
          }
        }
      })
    },
    getCommicateCont: function () {
      var that = this
      that.ajax('/myTask/getTaskComment', that.taskComment).then(res => {
        if (res.code === 200) {
          that.commentList = res.data.list
          that.totalNum = res.data.totalRow
          if (that.commentList.length > 0) {
            for (var i = 0; i < that.commentList.length; i++) {
              for (var j = 0; j < that.commentList[i].attachment.length; j++) {
                if (that.isImage(res.data.list[i].attachment[j].showName)) {
                  res.data.list[i].attachment[j].isImg = true
                } else {
                  res.data.list[i].attachment[j].isImg = false
                }
                res.data.list[i].attachment[j].downloadUrl = that.$store.state.baseServiceUrl + '/file/downloadFile?realUrl=' + res.data.list[i].attachment[j].realUrl + '&showName=' + res.data.list[i].attachment[j].showName
              }
            }
          }
        } else {
          that.$message.warning(res.msg)
        }
      })
    },
    modifyTask: function () {
      var that = this
      that.$emit('showEditForm')
    },
    // // 编辑任务 修改任务 ModifyTaskCallbackFuc
    // ModifyTaskCallbackFuc: function (res) {
    //   var that = this
    //   if (res.code === 200) {
    //     that.modifyTaskVisible = false
    //     that.queryProDetail()
    //     that.toDetail(that.currentNodeId)
    //     that.$message({
    //       message: '修改成功！',
    //       type: 'success'
    //     })
    //   } else {
    //     that.$message({
    //       message: res.msg,
    //       type: 'warning'
    //     })
    //   }
    // },
    // 任务分解 返回结果处理
    TaskDistributeCallbackFuc: function (res) {
      var that = this
      if (res.code === 200) {
        that.toShowDevided = false
        // that.queryProDetail()
        // that.selectProjectId()
        // that.getHistoryList()
        // that.getTaskChildList()
        that.$message({
          message: '创建成功！',
          type: 'success'
        })
      } else {
        that.$message({
          message: res.msg,
          type: 'warning'
        })
      }
    },
    getCurrentPage: function (e) {
      this.taskComment.pageNum = e
      this.getCommicateCont()
    },
    commentPageChange: function (e) {
      this.pageN = e
      this.getHistoryCont()
    },
    getCurrentHistoryPage: function (e) {
      this.taskHistoryList.pageNum = e
      this.getHistoryList()
    },
    // 任务开始 开始任务
    startTask: function (id) {
      var that = this
      // console.log('id', id)
      that.$confirm('确定后将开始此任务，确定开始？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.ajax('/myTask/startTask', {taskId: id}).then(res => {
          if (res.code === 200) {
            that.log('dealTask:', res)
            that.toDetail(id)
            // that.selectProjectId()
            that.getHistoryList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消开始'
        })
      })
    },
    taskToDevided: function (id) {
      var that = this
      that.toShowDevided = true
      that.currentNodeId = id
      // that.taskRelationShow2 = false
    },
    // 重启
    isReStartTask: function (id) {
      var that = this
      this.log('restartTaskID', id)
      that.$confirm('是否确定重启此任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.ajax('/myTask/restartTask', {taskId: id}).then(res => {
          if (res.code === 200) {
            this.log('restartTask', res)
            that.toDetail(id)
            // that.selectProjectId()
            that.getHistoryList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 删除子任务
    childTaskDelete: function (id) {
      var that = this
      // console.log('id', id)
      that.$confirm('删除本条会包括本条及其包含内容，确定删除？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.ajax('/myTask/delTaskById', {taskId: id}).then(res => {
          if (res.code === 200) {
            // that.log('delPlanOrTask:', res)
            that.getTaskChildList(that.taskId)
            // that.selectProjectId()
            that.getHistoryList()
          }
        }).catch(() => {
          // that.loading = false
        })
      })
    },
    // 新增 点击“回复”按钮
    taskDetailconnect () {
      var that = this
      that.ajax('/comment/addComment', {
        content: that.commitComent,
        attachmentId: that.SetFileIdStr(),
        contentId: that.taskId,
        parentCommentId: '11'
      }).then(res => {
        if (res.code === 200) {
          that.IsClear = true
          // that.log('myTaskView:', res)
          that.getCommicateCont()
          // that.fileListComment = []
          that.commitComent = ''
          $('.showFileName').html('')
          $('#myfile2').val('')
          that.loading2 = false
          that.$message.success('评论成功！')
        }
      })
    },
    // 获取附件上传组件发来的附件信息 新组件
    GetFileInfo (obj) {
      this.log('GetFileInfo:', obj)
      if (obj) {
        this.IsClear = false
      }
      this.FileUploadArr = obj
      this.log('GetFileInfo:', obj)
    },
    // 预览
    GetFilePreData (obj) {
      this.log('obj::', obj)
      if (obj.previewUrl && this.isImage(obj.fileName)) {
        this.showBigImage1(obj.previewUrl)
      }
    },
    // 任务分解
    DistributeFormVisibleFuc: function (res) {
      this.toShowDevided = false
    },
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
  .taskMsg{
    background-color: #f5f8fa;
    display: flex;
    justify-content: space-between;
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
  .cannetProject21{
    width: 100%;
    display: flex;
    justify-content: space-between;
    line-height: 24px;
    font-size: 14px;
    /*font-family: '黑体';*/
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
    color: #1296db;
    display: flex;
    justify-content: space-between;
    line-height: 40px;
    font-size: 14px;
    /*font-family: '黑体';*/
    padding:0 10px;
    background-color: #f5f8fa;
  }
  .cannetProjectFile{
    line-height: 49px;
    border-bottom: 1px solid #f1f1f1;
    font-size: 15px;
    font-family: '黑体';
    padding:0 10px;
  }
  .cannetProject2 div img{
    float: left;
    margin-top: 10px;
    margin-right: 10px;
    width: 18px;
  }
  .cannetProject div img,.cannetProjectFile div img{
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
  .taskListChild{
    padding: 0 20px;
  }
  .taskItemChild{
    height: 48px;
    line-height: 48px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px dashed #f1f1f1;
  }
  .taskItemChild2{
    height: 48px;
    line-height: 48px;
  }
  .childTaskName{
    width: 30%;
    color: #409EFF;
    cursor: pointer;
    font-size: 14px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .childTaskMsg{
    width: 70%;
    text-align: right;
  }
  .childTaskMsg>div{
    display: inline-block;
    margin-right: 20px;
  }
  .taskDel:hover {
    color: #409EFF;
    cursor: pointer;
  }
  .timeLine{
    padding: 20px;
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
  .paiTaskIptWrap input{
    width: 100%;
    outline: none;
    border: none;
  }
  .submitBtn div {
    width: 50px;
    padding: 6px;
    color: #fff;
    border-radius: 4px;
    text-align: center;
    color: #adb8c0;
    background-color: #e7eef3;
  }
  .el-textarea{
    margin-top: 15px;
    margin-left: 0px;
  }
  .el-textarea__inner{
    width: 100%;
    min-height: 80px;
  }
  .noComment{
    height: 50px;
    text-align: center;
    line-height: 50px;
    color: #aaa;
  }
</style>
