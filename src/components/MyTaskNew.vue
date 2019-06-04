<template>
  <div class="MyTaskNew">
    <div class="contentTop" v-loading="loading3">
      <div class="paiTaskTitTab">
        <div class="paiTask pai active">新建任务</div>
      </div>
      <component v-bind:is="compArr.QuickCreateTaskComp"
                 fileFormId="QuickCreateTaskComp"
                 v-on:FilePreEmit="GetFilePreData"
                 v-on:ActionResThrow="ActionResThrowFuc">
      </component>
    </div>
    <div class="searchItem">
      <div>
        <el-select v-model="optionsValue" placeholder="请选择" @change="myTaskStyleChange($event)">
          <el-option
            v-for="item in optionsTask"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div>
        <el-select v-model="optionsValue2" placeholder="请选择" @change="taskTypeState($event)">
          <el-option
            v-for="item in optionsTask2"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div>
        <el-select v-model="optionsValue3" placeholder="请选择" @change="taskOfProject($event)">
          <el-option label="全部项目" value=""></el-option>
          <el-option
            v-for="item in projectList"
            :key="item.projectUID"
            :label="item.projectName"
            :value="item.projectName">
          </el-option>
        </el-select>
      </div>
      <div>
        <el-input placeholder="请输入搜索内容" v-model="input3">
          <el-button type="primary" slot="prepend">任务搜索</el-button>
          <!--<template slot="prepend" style="background-color: #fff;">任务搜索</template>-->
        </el-input>
      </div>
    </div>
    <div style="padding: 0px; margin-top: 20px;" class="clear">
      <div class="cardWrap" v-for="(myTask, index) in myTaskList" :key="index" @click="toDetail(myTask.uid)">
        <Card :bordered="true">
          <div class="groupItemTit" slot="title" :title="myTask.jobName">
            <div class="groupItemTitCnt">
              <span style="color: #888; font-weight: normal">任务:</span>{{myTask.jobName}}
            </div>
            <div class="taskStateBiaoNew" v-bind:class="myTask.tagStyle">{{myTask.statusStr}}</div>
          </div>
          <div slot="extra" style="color: #888" class="taskManager" :title="myTask.userName">负责人：{{myTask.userName}}</div>
          <div style="display: flex; justify-content: space-between;">
            <div style="width: 50%; display: flex;">
              <div class="textIntro">项目：{{myTask.projectName}}</div>
            </div>
            <div style="width: 50%; text-align: right; color: #888"><span style="margin-left: 15px;">{{myTask.taskStartDate.split(' ')[0]}} 至 {{myTask.taskFinishDate.split(' ')[0]}}</span></div>
          </div>
        </Card>
      </div>
    </div>
    <!---->
    <div style="text-align: center;margin-top: 40px;margin-bottom: 40px;">
      <el-pagination
        background
        layout="prev, pager, next, total"
        @current-change="pageNumChenge($event)"
        :page-size="8"
        :current-page="myTaskViewPayload.pageNum"
        :total="totalRowNum">
      </el-pagination>
    </div>
    <!---->
    <!-- Part05 start 抽屉 任务详情 -->
    <Drawer title="任务详情" class="drawerScroll" :closable="false" width="750" v-model="TaskDetailCompShow">
      <component v-bind:is="compArr.TaskDetailComp"
                 v-bind:taskDrawerOpen="TaskDetailCompShow"
                 v-bind:modifyTaskRes="modifyTaskRes"
                 v-on:FilePreEmit="GetFilePreData"
                 v-on:toPlanDetail="toPlanDetailFuc"
                 v-on:showEditForm="showEditFormFuc"
                 v-on:taskShow="taskShowFuc"
                 v-on:ActionResThrow="ActionResThrowFuc"
                 v-on:TaskDelCallback="TaskDelCallbackFuc"
                 :nodeId="currentNodeId">
      </component>
    </Drawer>
    <!---->
    <!--修改任务 编辑任务 任务 修改-->
    <Drawer class="drawerScroll" title="修改任务" :closable="false" width="750" v-model="modifyTaskVisible">
      <!-- 修改任务 编辑任务 引入组件 -->
      <component v-bind:is="compArr.ModifyTask"
                 v-bind:DrawerOpen="modifyTaskVisible"
                 fileFormId="ModifyTask"
                 v-on:FilePreEmit="GetFilePreData"
                 v-on:ModifyTaskCallback="ModifyTaskCallbackFuc"
                 v-on:ShutCompEmit="ShutCompEmitFuc"
                 :nodeId="currentNodeId">
      </component>
    </Drawer>
    <!---->
    <!-- Part06 start 抽屉 计划详情 -->
    <Drawer title="计划详情" class="drawerScroll" :closable="false" width="750" v-model="value444">
      <component v-bind:is="compArr.PlanDetailComp"
                 v-bind:taskDrawerOpen="value444"
                 :nodeId="currentNodeId"
                 v-on:ActionResThrow="ActionResThrowFuc"
                 v-on:addChildMsg="addChildMsgFuc"
                 v-on:toChildMsg="toChildMsgFuc"
                 v-on:PlanDelCallback="PlanDelCallbackFuc">
      </component>
    </Drawer>
    <!--新增 添加计划或者任务 start-->
    <Drawer class="drawerScroll" title="计划表单" :closable="false" width="40%" v-model="bgCoverShow">
      <component v-bind:is="compArr.CreatePlanOrTask"
                 v-bind:DrawerOpen="bgCoverShow"
                 fileFormId="CreatePlanTask"
                 v-on:CreatePlanTaskCallback="CreatePlanTaskCallbackFuc"
                 :nodeId="currentNodeId">
      </component>
    </Drawer>
    <el-dialog title="项目列表" :visible.sync="projectListShow">
      <component v-bind:is="compArr.linkProject" v-bind:linkId="taskLinkId" v-bind:proListShow="projectListShow" v-on:dialogGoodsShow="dialogGoodsShowFuc" v-on:showFlag="showFlagFuc"></component>
    </el-dialog>
    <Drawer title="商品信息" width="740" :closable="false" v-model="goodsEdit">
      <component
        v-bind:is="compArr.goodsInfo"
        fileFormId="BaseInfoEdit"
        v-on:FilePreEmit="GetFilePreData"
        v-bind:ProBaseInfoShow="goodsEdit"
        v-on:ProBaseInfoCallback="ProBaseInfoCallbackFuc"
        :proId="proId"
        @cancel="cancelGoods"
      ></component>
    </Drawer>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="dialogShowImg1">
      <div class="showImg"><img v-bind:src="commentPreviewUrl1" alt=""></div>
    </el-dialog>
    <!-- 完善产品信息 -->
    <el-dialog title="提示" :visible.sync="dialogGoods" width="30%" center>
      <span>是否完善产品信息？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="jumpInfo">跳过</el-button>
        <el-button type="primary" @click="perfectInfo">去完善</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import FileUploadComp from './CustomComp/FileUploadComp.vue'
import goodsInfo from './CustomComp/goodsInfo.vue'
import linkProject from './CustomComp/linkProject.vue'
import ModifyTask from './CustomComp/ModifyTask.vue'
import PlanDetailComp from './CustomComp/PlanDetailComp.vue'
import TaskDetailComp from './CustomComp/TaskDetailComp.vue'
import CreatePlanOrTask from './CustomComp/CreatePlanOrTask.vue'
import QuickCreateTaskComp from './CustomComp/QuickCreateTaskComp.vue'
// ModifyTask
export default {
  name: 'MyTaskNew',
  components: {
    ModifyTask,
    goodsInfo,
    linkProject,
    FileUploadComp,
    PlanDetailComp,
    TaskDetailComp,
    CreatePlanOrTask,
    QuickCreateTaskComp
  },
  data () {
    return {
      compArr: {
        goodsInfo: 'goodsInfo',
        linkProject: 'linkProject',
        ModifyTask: 'ModifyTask',
        FileUploadComp: 'FileUploadComp',
        PlanDetailComp: 'PlanDetailComp',
        TaskDetailComp: 'TaskDetailComp',
        CreatePlanOrTask: 'CreatePlanOrTask',
        QuickCreateTaskComp: 'QuickCreateTaskComp'
      },
      IsClear: false,
      proFileList: [],
      // 详情
      modifyTaskRes: '',
      loading3: false,
      taskNameText: '',
      // 项目列表
      taskLinkId: '',
      proId: '',
      goodsEdit: false,
      dialogGoods: false,
      projectListShow: false,
      //
      taskForm: {
        jobName: '',
        userName: '',
        jobLevel: 3,
        date1: '',
        date2: '',
        state2: '',
        value9: [],
        value8: [],
        description: '',
        taskUserId: ''
      },
      defImplementer: {
        name: '张三',
        id: ''
      },
      taskRelationShow: false,
      // 所属项目
      projectBelong: '',
      taskIntro: '',
      fileListDis: false,
      fileList: [],
      moreIcon: 'el-icon-arrow-down',
      moreText: '更多',
      options: [],
      selDateStart: '',
      selDateEnd: '',
      // 分类检索
      optionsTask: [{
        value: '2',
        label: '我负责的任务'
      }, {
        value: '3',
        label: '我发起的任务'
      }, {
        value: '4',
        label: '@我的任务'
      }],
      optionsValue: '2',
      optionsTask2: [{
        value: '',
        label: '全部任务'
      }, {
        value: 'today',
        label: '今日任务'
      }, {
        value: 'overtime',
        label: '逾期任务'
      }, {
        value: 'unstart',
        label: '未开始任务'
      }, {
        value: 'unfinish',
        label: '进行中任务'
      }, {
        value: 'finish',
        label: '已完成任务'
      }, {
        value: 'pause',
        label: '已暂停任务'
      }],
      optionsValue2: '',
      optionsValue3: '',
      projectList: [],
      myTaskViewPayload: {
        pageNum: 1,
        pageSize: '8',
        projectName: '',
        jobName: '',
        taskSource: '2',
        sType: ''
      },
      // 默认指派
      input3: '',
      myTaskList: [],
      totalRowNum: 0,
      // 详情
      TaskDetailCompShow: false,
      currentNodeId: '',
      // 修改任务
      modifyTaskVisible: false,
      // 预览
      commentPreviewUrl1: '',
      // 预览
      dialogShowImg1: false,
      // 计划详情
      value444: false,
      // addNode 表单
      activeNameBgCover: 'first',
      bgCoverShow: false
    }
  },
  created () {
    var that = this
    // this.log('url参数:', this.$route.params.TaskId)
    if (that.$route.params.TaskId) {
      that.$store.state.taskEdit = true
      that.taskId = that.$route.params.TaskId
      this.toDetail(that.$route.params.TaskId)
    }
    // that.getUserInfo()
    this.queryMyTaskView()
    this.queryMyProjectList()
  },
  mounted: function () {
    /** 设置侧边栏激活状态 */
    this.$store.commit('setNavActive', {navName: '我的任务', childNavName: ''})
  },
  watch: {
    // optionsValue3: function (newValue, oldValue) {
    //   this.myTaskViewPayload.projectName = newValue
    //   this.queryMyTaskView()
    // }
    input3: function (newValue, oldValue) {
      this.myTaskViewPayload.jobName = newValue
      this.myTaskViewPayload.pageNum = 1
      this.queryMyTaskView()
    }
  },
  methods: {
    showFlagFuc: function (val) {
      this.projectListShow = val
    },
    dialogGoodsShowFuc: function (val) {
      this.dialogGoods = val
    },
    queryMyProjectList () {
      var that = this
      this.ajax('/myProject/getAllProjectByUser', {}).then(res => {
        // this.log('选择所属项目:', res)
        if (res.code === 200) {
          that.projectList = res.data
        }
      })
    },
    myTaskStyleChange: function (e) {
      var that = this
      that.myTaskViewPayload.pageNum = 1
      that.myTaskViewPayload.taskSource = e
      that.queryMyTaskView()
    },
    taskTypeState: function (e) {
      var that = this
      that.myTaskViewPayload.pageNum = 1
      that.myTaskViewPayload.sType = e
      that.queryMyTaskView()
    },
    taskOfProject: function (e) {
      var that = this
      that.myTaskViewPayload.pageNum = 1
      that.myTaskViewPayload.projectName = e
      that.queryMyTaskView()
    },
    queryMyTaskView () {
      var that = this
      this.ajax('/myTask/myTaskView', that.myTaskViewPayload).then(res => {
        if (res.code === 200) {
          // that.log('myTaskView:', res)
          for (var i = 0; i < res.data.list.length; i++) {
            // res.data.list[i].startDate = res.data.list[i].startDate.split(' ')[0]
            // res.data.list[i].endDate = res.data.list[i].endDate.split(' ')[0]
            // j
            if (res.data.list[i].status === '0') {
              res.data.list[i].tagStyle = 'noStart'
              res.data.list[i].statusInfo = '未开始'
            } else if (res.data.list[i].status === '1') {
              res.data.list[i].tagStyle = 'isDoing'
              res.data.list[i].statusInfo = '进行中'
            } else if (res.data.list[i].status === '2') {
              res.data.list[i].tagStyle = 'finished'
              res.data.list[i].statusInfo = '已完成'
            } else if (res.data.list[i].status === '3') {
              res.data.list[i].tagStyle = 'stoped'
              res.data.list[i].statusInfo = '已暂停'
            } else if (res.data.list[i].status === '4') {
              res.data.list[i].tagStyle = 'overTime'
              res.data.list[i].statusInfo = '已逾期'
            }
          }
          that.myTaskList = res.data.list
          that.totalRowNum = res.data.totalRow
        }
      })
    },
    pageNumChenge (e) {
      // console.log('eeeeeeee', e)
      this.myTaskViewPayload.pageNum = e
      this.queryMyTaskView()
    },
    toDetail: function (id) {
      this.currentNodeId = id
      this.TaskDetailCompShow = true
    },
    // 任务详情组件
    // 附件 附件预览
    GetFilePreData (obj) {
      if (obj.previewUrl && this.isImage(obj.fileName)) {
        this.showBigImage1(obj.previewUrl)
      }
    },
    showBigImage1: function (url) {
      if (url) {
        this.commentPreviewUrl1 = url
        this.dialogShowImg1 = true
      }
    },
    toPlanDetailFuc: function (id) {
      var that = this
      that.currentNodeId = id
      that.value444 = true
      that.TaskDetailCompShow = false
    },
    taskShowFuc: function (val) {
      var that = this
      that.projectListShow = true
      console.log(val)
      that.taskLinkId = val
    },
    // 去完善信息
    perfectInfo () {
      this.proId = this.$store.state.proId
      this.$router.push('/goodsDetail')
      this.$store.state.goPerfect = true
      this.goodsEdit = true
      this.dialogGoods = false
    },
    // 商品上传成功后续
    ProBaseInfoCallbackFuc (res) {
      var that = this
      if (res.code === 200) {
        that.$Message.success('保存成功!')
        // that.$router.push('/goodsDetail')
        that.goodsEdit = false
      } else {
        that.$message({
          message: res.msg,
          type: 'warning'
        })
      }
    },
    // 取消商品信息
    cancelGoods () {
      this.goodsEdit = false
    },
    // 跳过
    jumpInfo () {
      // this.$router.push('/goodsDetail')
    },
    showEditFormFuc: function (id) {
      var that = this
      that.currentNodeId = id
      that.modifyTaskVisible = true
    },
    ActionResThrowFuc: function (obj) {
      var that = this
      if (obj.res.code === 200) {
        switch (obj.actionName) {
          case 'transferTask':
            // 任务移交
            that.TaskDetailCompShow = false
            that.queryMyTaskView(that.activeId)
            break
          case 'addCommunityTask':
            // 任务完成
            that.queryMyTaskView()
            break
          case 'finishTask':
            // 任务完成
            that.queryMyTaskView()
            break
          case 'restartTask':
            // 任务重启
            that.queryMyTaskView()
            break
          case 'startTask':
            // 任务开始
            that.queryMyTaskView()
            break
          case 'decomposeTask':
            // 任务分解
            that.queryMyTaskView()
            break
          default:
            this.log('')
        }
      }
    },
    TaskDelCallbackFuc: function (res) {
      var that = this
      if (res.code === 200) {
        that.queryMyTaskView()
        that.TaskDetailCompShow = false
        that.$message({
          message: '删除成功！',
          type: 'success'
        })
      } else {
        that.$message({
          message: res.msg,
          type: 'warning'
        })
      }
    },
    // 编辑任务 修改任务
    ModifyTaskCallbackFuc: function (res) {
      var that = this
      if (res.code === 200) {
        that.$store.state.taskEdit = true
        that.modifyTaskVisible = false
        that.queryMyTaskView()
        that.$message({
          message: '修改成功！',
          type: 'success'
        })
      } else {
        that.$message({
          message: res.msg,
          type: 'warning'
        })
      }
    },
    // 组件内点击了关闭 父组件执行关闭子组件操作
    ShutCompEmitFuc: function (res) {
      this[res] = false
    },
    // 计划 计划删除 返回结果处理
    PlanDelCallbackFuc: function (res) {
      var that = this
      if (res.code === 200) {
        that.queryMyTaskView()
        that.value444 = false
        that.$message({
          message: '删除成功！',
          type: 'success'
        })
      } else {
        that.$message({
          message: res.msg,
          type: 'warning'
        })
      }
    },
    toChildMsgFuc: function (id) {
      var that = this
      that.currentNodeId = id
      that.value444 = false
      that.TaskDetailCompShow = true
    },
    addChildMsgFuc: function (data) {
      this.addNode(data.id, data.type)
    },
    // 新建 添加子节点
    addNode: function (nodeId, nodeType) {
      var that = this
      if (nodeType) {
        if (nodeType === '1' || nodeType === '计划') {
          that.activeNameBgCover = 'first'
        } else {
          that.activeNameBgCover = 'second'
        }
      }
      this.currentNodeId = nodeId
      this.bgCoverShow = true
    },
    // 新建计划 新建任务 引入组件 返回
    CreatePlanTaskCallbackFuc: function (res) {
      var that = this
      if (res === 'shut') {
        that.bgCoverShow = false
      } else {
        if (res.code === 200) {
          that.bgCoverShow = false
          that.queryMyTaskView()
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
      }
    }
  }
}
</script>
<style>
  .ivu-card{
    box-shadow:0 1px 6px rgba(0,0,0,.1)
  }
  .ivu-card:hover{
    box-shadow:0 1px 6px rgba(45,140,240,.6)
  }
  .ivu-card .groupItemTit{
    display: flex;
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    font-weight: 700;
  }
  .ivu-card:hover .groupItemTit{
    color: #2d8cf0;
  }
</style>
<style scoped>
  .MyTaskNew{
    position: relative;
  }
  .clear:after{ content: ""; display: block;height: 0;visibility: hidden;clear: both;}
  .cardWrap{
    margin-bottom: 15px;
    float: left;
    width: 50%;
    min-width: 571px;
    padding-right: 20px;
    box-sizing: border-box;
  }
  .textIntro{
    width: 250px;
    color: #888;
    overflow:hidden;
    cursor: pointer;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  .groupItemTit{
    color: #555;
  }
  .groupItemTitCnt{
    max-width:220px;
    font-size: 16px;
    overflow:hidden;
    cursor: pointer;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  .taskManager{
    width: 200px;
    text-align: right;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  .taskStateBiaoNew{
    text-align: center;
    padding: 0px 5px;
    font-size: 12px;
    margin-left: 10px;
    border-radius: 6px;
  }
  .taskStateBiaoNew.noStart{
    color: #ffb400;
    border: 1px solid #ffb400;
  }
  .taskStateBiaoNew.isDoing{
    color: #13ce66;
    border: 1px solid #13ce66;
  }
  .taskStateBiaoNew.finished{
    color: #3a8ee6;
    border: 1px solid #3a8ee6;
  }
  .taskStateBiaoNew.stoped{
    color: #ccc;
    border: 1px solid #ccc;
  }
  .taskStateBiaoNew.overTime{
    color: #e97474;
    border: 1px solid #e97474;
  }
  .searchItem{
    margin-top: 10px;
    display: flex;
    padding: 10px;
    background-color: #f5f5f8;
  }
  .searchItem>div{
    margin-right: 10px;
  }
  .el-input-group__prepend{
    background-color: #fff;
  }
  .taskList{
    height: 100px;
    width: 100%;
    display: flex;
    padding: 20px;
    justify-content: space-between;
    border-bottom: 1px dashed #ddd;
    position: relative;
    overflow: hidden;
  }
  .taskList:hover,.taskList2:hover{
    background-color: #f5f8fa;
  }
  .taskList:hover .taskItem{
    height: 100%;
    width: 50%;
    border-left: 6px solid #409EFF;
    /*display: flex;*/
    padding-left: 20px;
  }
  .taskItem{
    height: 100%;
    width: 50%;
    border-left: 6px solid #ccc;
    /*display: flex;*/
    padding-left: 20px;
  }
  .taskName{
    padding: 10px;
    font-size: 14px;
    color: #888;
  }
  .taskMsg{
    color: #888;
    width: 50%;
    text-align: right;
    padding-right: 40px;
    font-size: 14px;
  }
  /*任务状态 标*/
  .taskTag0{
    height: 20px;
    text-align: center;
    width: 100px;
    font-size: 12px;
    background-color: #ffc107;
    transform: rotate(45deg);
    position: absolute;
    top: 8px;
    right: -32px;
    color: #fff;
  }
  .taskTag1{
    height: 20px;
    text-align: center;
    width: 100px;
    font-size: 12px;
    background-color: #27CF97;
    transform: rotate(45deg);
    position: absolute;
    top: 8px;
    right: -32px;
    color: #fff;
  }
  .taskTag2{
    height: 20px;
    text-align: center;
    width: 100px;
    font-size: 12px;
    background-color: #3a8ee6;
    transform: rotate(45deg);
    position: absolute;
    top: 8px;
    right: -32px;
    color: #fff;
  }
  .taskTag3{
    height: 20px;
    text-align: center;
    width: 100px;
    font-size: 12px;
    background-color: #e97474;
    transform: rotate(45deg);
    position: absolute;
    top: 8px;
    right: -32px;
    color: #fff;
  }
  .taskTag4{
    height: 20px;
    text-align: center;
    width: 100px;
    font-size: 12px;
    background-color: #ccc;
    transform: rotate(45deg);
    position: absolute;
    top: 8px;
    right: -32px;
    color: #fff;
  }
  .showImg > img{
    width: 100%;
  }
  .noDate{
    height: 100px;
    line-height: 100px;
    text-align: center;
    color: #999;
    font-size: 14px;
  }
</style>
