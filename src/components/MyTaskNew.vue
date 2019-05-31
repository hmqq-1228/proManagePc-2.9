<template>
  <div class="MyTaskNew">
    <div class="contentTop" v-loading="loading3">
      <div class="paiTaskTitTab">
        <div class="paiTask pai active">新建任务</div>
      </div>
      <component v-bind:is="compArr.QuickCreateTaskComp" fileFormId="QuickCreateTaskComp" v-on:ActionResThrow="ActionResThrowFuc"></component>
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
          <div slot="extra" style="color: #888">负责人：{{myTask.userName}}</div>
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
    <el-dialog
      title="项目列表"
      :visible.sync="projectListShow"
    >
      <div class="projectListTop">
        <div>
          <el-input style="width: 350px;" v-model="inputProject" placeholder="请输入项目名称"></el-input>
          <el-select v-model="valueSelect" placeholder="请选择">
            <el-option
              v-for="item in optionsProject"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div><el-button type="primary" icon="el-icon-edit" @click="newAdd()">新建项目</el-button></div>
      </div>
      <div class="tabbox">
        <el-table
          ref="multipleTable"
          :cell-class-name="rowClass"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%">
          <!--<el-table-column-->
            <!--type="selection"-->
            <!--width="55">-->
          <!--</el-table-column>-->
          <el-table-column
            prop="projectName"
            label="项目名称"
            width="220">
          </el-table-column>
          <el-table-column
            prop="projectManager"
            label="负责人"
            width="120">
          </el-table-column>
          <el-table-column
            prop="startDate"
            label="开始日期"
            width="180">
          </el-table-column>
          <el-table-column
            prop="endDate"
            label="结束日期"
            width="180">
          </el-table-column>
          <el-table-column
            prop="stateStr"
            label="项目状态"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button v-if="scope.row.checked === '0'"
                size="mini"
                type="primary"
                @click="handleEdit(scope.$index, scope.row)">关联项目</el-button>
              <el-button v-if="scope.row.checked === '1'"
                 size="mini"
                 type=""
                 @click="concelEdit(scope.$index, scope.row)">解除关联</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--<el-button @click="toggleSelection([tableData[1], tableData[2]])">切换第二、第三行的选中状态</el-button>-->
        <div style="text-align: center;margin-top: 20px;">
          <el-pagination
            background
            :current-page="currentPage"
            @current-change="getProjectPageNum($event)"
            layout="total, prev, pager, next"
            :total="tableDataRow">
          </el-pagination>
        </div>
      </div>
      <Modal v-model="newAddDialog" title="新建项目" width="620" @on-ok="ok" @on-cancel="cancel">
        <div style="padding-bottom: 10px;">
          <el-row>
            <el-col class="el-col-self" style="width: 286px; margin-top: 10px;">
              <el-card :body-style="{ padding: '0px' }" class="cartHover">
                <div style="padding: 14px;" @click="openProCreatedForm()">
                  <div class="modelItem">
                    <span class="modelName">空白模板</span>
                    <el-tag type="danger" style="float: right">空白模板</el-tag>
                  </div>
                  <div class="modelPeo">
                    <div class="button">创建人：管理员</div>
                  </div>
                  <div class="bottom clearfix">
                    <time class="time"><i class="el-icon-time"></i> 2018-12-12 00:00:00</time>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col class="el-col-self" style="width: 286px; margin-top: 10px;" v-for="(model, index) in modelList" v-bind:key="index">
              <el-card :body-style="{ padding: '0px' }" class="cartHover">
                <div style="padding: 14px;" @click="openProCreatedForm(model.id)">
                  <div class="modelItem">
                    <span class="modelName" v-bind:title="model.modelName">{{model.modelName}}</span>
                    <el-tag type="warning" style="float: right">{{model.modelType}}</el-tag>
                  </div>
                  <div class="modelPeo">
                    <!--<div class="modelTime">项目周期：<span>{{model.duration}}</span> 天</div>-->
                    <div class="button">创建人：{{model.creator}}</div>
                  </div>
                  <div class="bottom clearfix">
                    <time class="time"><i class="el-icon-time"></i> {{model.createDate}}</time>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </Modal>
      <!--新建项目 表单 dialog-->
      <Modal v-model="newAddDiaModel" :loading="createProFormLoading" width="620" title="新建项目" ok-text="创建且关联" @on-ok="newCreateOk" @on-cancel="newCreateCancel">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="项目名称" prop="projectName">
            <el-input v-model="ruleForm.projectName"></el-input>
          </el-form-item>
          <el-form-item label="项目类型" prop="projectType">
            <el-select style="width: 100%" v-model="ruleForm.projectType" placeholder="请选择项目类型">
              <el-option v-for="item in proTypeListPure" :value="item.label" :key="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目周期" prop="value2">
            <el-date-picker style="width: 100%"
                            v-model="ruleForm.value2"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            :picker-options="pickerOptions0"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="项目负责人" prop="projectManager">
            <el-autocomplete style="width: 100%"
                             v-model="ruleForm.projectManager"
                             :fetch-suggestions="querySearchAsync"
                             placeholder="请输入项目负责人姓名"
                             :trigger-on-focus="false"
                             @select="handleSelect"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item class="proIntroduce" label="项目简介" prop="introduction" style="clear: both;">
            <el-input type="textarea" style="" rows = '4' v-model="ruleForm.introduction"></el-input>
          </el-form-item>
          <el-form-item label="项目附件" v-if="!ruleForm.showName">
            <div v-if="!ruleForm.showName">
              <!--附件上传 组件 引入附件上传组件  v-bind:clearInfo=""-->
              <component v-bind:is="compArr.FileUploadComp" v-bind:FileDataList="proFileList" fileFormId="createPro" v-bind:clearInfo="IsClear" v-on:FileDataEmit="GetFileInfo"></component>
            </div>
          </el-form-item>
        </el-form>
      </Modal>
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
import FileUploadComp from './FileUploadComp.vue'
import goodsInfo from './CustomComp/goodsInfo.vue'
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
      modId: '',
      proId: '',
      goodsEdit: false,
      isModel: false,
      modelList: [],
      dialogGoods: false,
      newAddDiaModel: false,
      createProFormLoading: false,
      proTypeListPure: this.$store.state.projectType,
      duration: '',
      autoCompleteNamesPayload: {
        projectManager: ''
      },
      ruleForm: {
        projectName: '',
        projectManager: '',
        delivery: false,
        projectType: '公司项目',
        showName: '',
        downloadUrl: '',
        previewUrl: '',
        resource: '',
        realUrl: '',
        position: '',
        introduction: '',
        value2: [],
        projectPath: '',
        projectClassifyId: ''
      },
      rules: {
        projectName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        projectPath: [
          { required: true, message: '请选择项目分类', trigger: 'blur' }
        ],
        projectType: [
          { required: true, message: '请输入项目类型', trigger: 'change' }
        ],
        value2: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        projectManager: [
          { required: true, message: '请输入项目经理', trigger: 'change' }
        ]
      },
      pickerOptions0: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      projectListShow: false,
      projectIdStr: '',
      inputProject: '',
      valueSelect: '',
      currentPage: 1,
      tableData: [],
      FileUploadArr: [],
      projectIdList: [],
      checkedProject: [],
      checkedProjectList: [],
      totalModelNum: 0,
      // 模板
      modelData: {
        pageNum: '1',
        pageSize: 5
      },
      tableDataRow: 0,
      newAddDialog: false,
      optionsProject: [{
        label: '全部项目',
        value: ''
      },
      {
        label: '公司项目',
        value: '0'
      },
      {
        label: '部门项目',
        value: '1'
      },
      {
        label: '小组项目',
        value: '2'
      },
      {
        label: '个人项目',
        value: '3'
      },
      {
        label: '集团战略',
        value: '4'
      },
      {
        label: '产品研发',
        value: '5'
      }
      ],
      getProjectPayload: {
        pageNum: 1,
        pageSize: 10,
        taskId: '',
        taskName: '',
        projectType: ''
      },
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
    that.getUserInfo()
    this.queryMyTaskView()
    this.queryMyProjectList()
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
    },
    inputProject: function (val, oV) {
      var that = this
      that.getProjectPayload.taskName = val
      that.getProjectPayload.pageNum = 1
      that.currentPage = 1
      that.getProjectList()
    },
    valueSelect: function (val, oV) {
      var that = this
      // console.log('6666', val)
      that.getProjectPayload.projectType = val
      that.getProjectPayload.pageNum = 1
      that.currentPage = 1
      that.getProjectList()
    }
  },
  methods: {
    getUserInfo: function () {
      var that = this
      this.ajax('/myProject/getUserInfo', {}).then(res => {
        if (res.code === 200) {
          // console.log('getUserInfo', res)
          that.$store.state.userId = res.data.ID
          that.ruleForm.projectManager = res.data.Name + ' (' + res.data.jName + ')'
          that.Mid = res.data.ID
        }
      })
    },
    handleEdit: function (index, row) {
      console.log('gggggg', index, row)
      var that = this
      that.ajax('/myProject/bindProject', {
        taskId: that.getProjectPayload.taskId,
        projectIds: row.projectUID,
        checked: 1
      }).then(res => {
        if (res.code === 200) {
          this.log('关联项目:', res)
          that.$message.success('关联成功！')
          that.getProjectList()
          that.$store.state.taskEdit = true
        } else {
          that.$message.warning(res.msg)
        }
      })
    },
    concelEdit: function (index, row) {
      console.log('mmmmm', index, row)
      var that = this
      that.ajax('/myProject/bindProject', {
        taskId: that.getProjectPayload.taskId,
        projectIds: row.projectUID,
        checked: 0
      }).then(res => {
        if (res.code === 200) {
          that.$message.success('取消关联成功！')
          that.getProjectList()
          that.$store.state.taskEdit = true
        } else {
          that.$message.warning(res.msg)
        }
      })
    },
    // 获取附件上传组件发来的附件信息
    GetFileInfo (obj) {
      if (obj) {
        this.IsClear = false
      }
      this.FileUploadArr = obj
      this.log('getFileInfo:', obj)
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
          that.log('myTaskView:', res)
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
      that.getProjectPayload.taskId = val
      if (val) {
        that.getProjectList()
      }
    },
    getProjectPageNum: function (e) {
      this.getProjectPayload.pageNum = e
      this.currentPage = e
      this.getProjectList()
    },
    getProjectList: function () {
      var that = this
      that.checkedProject = []
      that.ajax('/myProject/getRelateProject', that.getProjectPayload).then(res => {
        if (res.code === 200) {
          that.tableData = res.data.list
          that.tableDataRow = res.data.totalRow
        } else {
          that.$message.warning(res.msg)
        }
      })
    },
    newAdd: function () {
      var that = this
      that.projectListShow = false
      this.newAddDialog = true
      that.ajax('/myProject/getModelList', that.modelData).then(res => {
        if (res.code === 200) {
          that.log('getModelList:', res)
          that.modelList = res.data.list
          that.totalModelNum = res.data.totalRow
        }
        // console.log('个人任务:', that.taskListData)
      })
    },
    // 新建 是否选择模板 ok
    ok () {
      this.newAddDiaModel = true
      this.$Message.info('Clicked ok')
    },
    // 新建 是否选择模板 no
    cancel () {
      this.projectListShow = true
      // this.$Message.info('Clicked cancel')
    },
    // 新建 新建项目 模板选择 打开相应的表单
    openProCreatedForm: function (modelId) {
      var that = this
      that.ruleForm.value2 = []
      this.newAddDiaModel = true
      that.ajax('/myTask/getJob', {taskId: that.getProjectPayload.taskId}).then(res => {
        if (res.code === 200) {
          that.ruleForm.projectName = res.data.jobName
          that.ruleForm.introduction = res.data.description
          that.ruleForm.value2.push(res.data.taskStartDate)
          that.ruleForm.value2.push(res.data.taskFinishDate)
          console.log('个人任务:', this.ruleForm.value2)
        }
      })
      if (modelId) {
        this.modId = modelId
        // 是否选择了 "项目模板"
        this.isModel = true
        this.showProjectType = true
        this.getModelDetail()
      } else {
        this.showProjectType = false
        this.setDefuleTime()
        this.isModel = false
      }
      // this.$router.push('/NewAddPro')
    },
    // 查询模板信息
    getModelDetail: function () {
      var that = this
      this.ajax('/myProject/getModelDetail', {modelId: that.modId}).then(res => {
        if (res.code === 200) {
          // that.ruleForm.projectName = res.data.modelName
          that.duration = res.data.duration
          that.log('that.duration:', that.duration)
          that.ruleForm.projectType = res.data.modelType
          that.setDefuleTime()
        }
      })
    },
    // 默认时间
    setDefuleTime: function () {
      this.ruleForm.value2 = []
      var n = parseInt(this.duration)
      console.log('n', n)
      var nowData = new Date()
      var year = nowData.getFullYear()
      var month = (nowData.getMonth() + 1) < 10 ? '0' + (nowData.getMonth() + 1) : (nowData.getMonth() + 1)
      var day = nowData.getDate() < 10 ? '0' + nowData.getDate() : nowData.getDate()
      var hour = nowData.getHours() < 10 ? '0' + nowData.getHours() : nowData.getHours()
      var minus = nowData.getMinutes() < 10 ? '0' + nowData.getMinutes() : nowData.getMinutes()
      var second = nowData.getSeconds() < 10 ? '0' + nowData.getSeconds() : nowData.getSeconds()
      var result = year + '-' + month + '-' + day + ' ' + hour + ':' + minus + ':' + second
      console.log('nowData', result)
      var getTime = new Date().getTime()
      var addTime = 24 * 60 * 60 * n * 1000
      var endTime = getTime + addTime
      var nowEndData = new Date(endTime)
      var yearEnd = nowEndData.getFullYear()
      var monthEnd = (nowEndData.getMonth() + 1) < 10 ? '0' + (nowEndData.getMonth() + 1) : (nowEndData.getMonth() + 1)
      var dayEnd = nowEndData.getDate() < 10 ? '0' + nowEndData.getDate() : nowEndData.getDate()
      var hourEnd = nowEndData.getHours() < 10 ? '0' + nowEndData.getHours() : nowEndData.getHours()
      var minusEnd = nowEndData.getMinutes() < 10 ? '0' + nowEndData.getMinutes() : nowEndData.getMinutes()
      var secondEnd = nowEndData.getSeconds() < 10 ? '0' + nowEndData.getSeconds() : nowEndData.getSeconds()
      var resultEnd = yearEnd + '-' + monthEnd + '-' + dayEnd + ' ' + hourEnd + ':' + minusEnd + ':' + secondEnd
      if (this.duration) {
        this.ruleForm.value2.push(result)
        this.ruleForm.value2.push(resultEnd)
      }
      console.log(this.ruleForm.value2)
    },
    // 新建 提交表单
    newCreateOk () {
      if (this.isModel) {
        this.submitModelForm('ruleForm')
      } else {
        this.submitForm('ruleForm')
      }
    },
    // 新建项目 立即创建项目 (模板) 提交基本信息
    submitModelForm (formName) {
      var that = this
      that.$refs[formName].validate((valid) => {
        if (valid) {
          if (that.Mid) {
            that.ajax('/myProject/addBaseInfo',
              {
                projectName: that.ruleForm.projectName,
                projectType: that.ruleForm.projectType,
                startDate: that.ruleForm.value2[0],
                endDate: that.ruleForm.value2[1],
                projectManagerID: that.Mid,
                projectManager: that.ruleForm.projectManager,
                modelId: that.modId,
                relateTaskId: that.getProjectPayload.taskId,
                introduction: that.ruleForm.introduction,
                // 附件ID
                attachmentId: that.SetFileIdStr(),
                // 如果项目类型是产品研发 projectClassifyId为研发下的分类ID
                projectClassifyId: that.ruleForm.projectClassifyId
              }).then(res => {
              console.log('立即创建(muban):', res)
              that.$Modal.remove()
              that.newAddDialog = false
              that.newAddDiaModel = false
              that.projectListShow = true
              if (res.code === 200) {
                // 通知附件上传子组件清空附件域
                that.IsClear = true
                that.$store.state.taskEdit = true
                that.getProjectList()
                that.createProFormLoading = false
                that.projectUID = res.data
                that.$store.state.proId = res.data
                // that.$router.push('/ProDetail')
                if (that.ruleForm.projectType === '产品研发') {
                  this.dialogGoods = true
                }
                if (that.ruleForm.projectType === '集团战略') {
                  that.$store.state.menuRefresh = true
                }
                // console.log(that.ruleForm.projectType)
              } else {
                this.$message({
                  type: 'error',
                  message: res.msg
                })
                that.createProFormLoading = false
              }
            })
          } else {
            that.createProFormLoading = false
            that.$message.error('请重新选择项目负责人')
          }
        } else {
          // console.log('网络错误!!')
          that.createProFormLoading = false
          return false
        }
      })
    },
    // 新建项目 立即创建项目 (空白模板) 提交基本信息
    submitForm (formName) {
      var that = this
      // var fileV = $('#myfile').val()
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (that.Mid) {
            that.ajax('/myProject/addBaseInfo',
              {
                projectName: that.ruleForm.projectName,
                projectType: that.ruleForm.projectType,
                startDate: that.ruleForm.value2[0],
                endDate: that.ruleForm.value2[1],
                projectManager: that.ruleForm.projectManager,
                projectManagerID: that.Mid,
                relateTaskId: that.getProjectPayload.taskId,
                introduction: that.ruleForm.introduction,
                attachmentId: that.SetFileIdStr(),
                // 如果类型是产品研发，下面的分类id
                projectClassifyId: that.ruleForm.projectClassifyId
              }).then(res => {
              console.log('立即创建:', res)
              that.$Modal.remove()
              that.newAddDialog = false
              that.newAddDiaModel = false
              that.projectListShow = true
              if (res.code === 200) {
                that.IsClear = true
                that.projectUID = res.data
                that.$store.state.taskEdit = true
                that.getProjectList()
                that.$store.state.proId = res.data
                if (that.ruleForm.projectType === '产品研发') {
                  this.dialogGoods = true
                }
                if (that.ruleForm.projectType === '集团战略') {
                  that.$store.state.menuRefresh = true
                }
              } else {
                this.$message({
                  type: 'error',
                  message: res.msg
                })
              }
            })
          } else {
            that.$message.error('请重新选择项目负责人')
          }
        } else {
          // console.log('网络错误!!')
          that.createProFormLoading = false
          // that.newAddDiaModel = true
          return false
        }
      })
    },
    // 重置 基本信息表单重置按钮
    resetForm (formName) {
      this.$refs[formName].resetFields()
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
    // 新建 搜索选择项目负责人
    querySearchAsync (queryString, cb) {
      var that = this
      if (queryString) {
        that.autoCompleteNamesPayload.projectManager = queryString
        this.ajax('/myProject/autoCompleteNames', that.autoCompleteNamesPayload).then(res => {
          // console.log('search:', res)
          if (res.code === 200) {
            var dddarr = []
            if (res.data.length > 0) {
              for (var i = 0; i < res.data.length; i++) {
                var obj = {}
                obj.value = res.data[i].Name + ' (' + res.data[i].jName + ')'
                obj.userId = res.data[i].ID
                // obj.jName = res.msg[i].jName
                dddarr.push(obj)
              }
              // 调用 callback 返回建议列表的数据
              cb(dddarr)
            } else {
              var aaaddd = []
              that.$message('未能搜索到该人员')
              cb(aaaddd)
            }
          }
        })
      }
    },
    // 新建 人员选择
    handleSelect (item) {
      // console.log(item.userId)
      this.Mid = item.userId
    },
    // 新建 取消
    newCreateCancel () {
      // j
    },
    rowClass ({ row, column, rowIndex, columnIndex }) {
      // console.log('rowStyle', columnIndex)
      if (columnIndex === 4) {
        if (row.state === '0') {
          return 'unstartStyle'
        } else if (row.state === '2') {
          return 'underwayStyle'
        } else if (row.state === '3') {
          return 'finishStyle'
        } else if (row.state === '4') {
          return 'pauseStyle'
        }
      }
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
  .projectListTop{
    display: flex;
    justify-content: space-between;
  }
  .tabbox{
    border-top: 1px solid #f5f8fa;
    margin-top: 20px;
  }
  .modelItem{
    display: inline-block;
    width: 100%;
  }
  .modelName{
    font-size: 18px;
    _font-family: 黑体;
    width: 72%;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .modelPeo{
    height: 24px;
    line-height: 24px;
    margin-top: 10px;
  }
  .el-col-self:nth-child(2n + 1){
    margin-right: 10px;
  }
</style>
