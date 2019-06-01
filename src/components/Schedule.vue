<template>
  <div class="Schedule">
    <div>{{slideMenu?'':''}}</div>
    <div class="scheduleHeader">
      <!-- 临时性 返回我的任务 c1e2fa -->
      <div class="headerCnt">
        <div class="headerCntTit">
          <div>
            <i class="el-icon-caret-left" v-on:click="monBefore()"></i>
            <span v-on:click="testComp">{{year}}年{{month}}月</span>
            <i class="el-icon-caret-right" v-on:click="monNext()"></i>
          </div>
          <div class="radioSelect">
            <el-checkbox-group v-model="checkList">
              <el-checkbox label="我的日程"></el-checkbox>
              <el-checkbox label="我的任务"></el-checkbox>
              <el-checkbox label="我的发起"></el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class="typeSelect">
          <div class="newAddSchedule">
            <el-button type="primary" v-on:click="createSchedule($event)">新建日程</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="contentData">
      <div class="weekHeader">
        <div class="weekItem">日</div>
        <div class="weekItem">一</div>
        <div class="weekItem">二</div>
        <div class="weekItem">三</div>
        <div class="weekItem">四</div>
        <div class="weekItem">五</div>
        <div class="weekItem">六</div>
      </div>
      <div class="grids">
        <div class="grid" v-bind:class="day.isToday?'isToday':''" v-for="(day, index) in monGrids" :key="day.id" v-on:dblclick="gridDoubleClick(day, index, $event)">
          <div class="dayDate" v-bind:class="day.light?'light2':''">{{day.date===0?'':day.date}}<span class="task" v-if="day.isRest === 1">休</span><span class="task1" v-if="day.isRest === 2"><img
            src="../../static/img/rest.png" alt=""></span></div>
          <div class="taskBox" v-if="day.date===0?'':day.date">
            <div class="taskItem" v-bind:class="taskItem.light?'light':''" v-for="taskItem in day.dayTaskList" :key="taskItem.mark_id"
                 v-on:mouseover="mouseover(taskItem.id, $event)" v-on:mouseleave="mouseout(taskItem.id)">
              {{taskItem.title}}
            </div>
            <div class="taskItemMore" v-bind:class="day.moreLight?'light':''" v-if="day.totalNum > 4"><span v-on:click="moreClick(index, day.date, $event)">+{{day.totalNum - 4}}更多</span></div>
          </div>
        </div>
      </div>
      <!-- 新建日程 悬浮窗 -->
      <div class="newScheduleForm" v-if="newScheduleFormShow" v-bind:style="{ top: newScheduleTop + 'px', left: newScheduleLeft + 'px' }">
        <div class="formArrow" v-bind:style="{ top: newScheduleArrowTop + 'px', left: newScheduleArrowLeft + 'px'}"></div>
        <div class="newScheduleIpt"><el-input v-model="newScheduleTit" placeholder="请输入要做什么"></el-input></div>
        <div class="newScheduleDate">
          <el-date-picker style="width: 170px; padding-right: 15px;" value-format="yyyy-MM-dd HH:mm:ss" v-model="value1" :picker-options="pickerOptions" type="datetime" placeholder="选择开始时间"></el-date-picker>
          <el-date-picker style="width: 170px; padding-right: 15px;" value-format="yyyy-MM-dd HH:mm:ss" v-model="value2" :picker-options="pickerOptions2" type="datetime" placeholder="选择结束时间"></el-date-picker>
        </div>
        <div class="durationSelect">
          <el-select v-model="durationValue" placeholder="请选择提醒时间">
            <el-option
              v-for="item in durationOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="formBtnBox">
          <div class="formBtn formBtnCancel" v-on:click="newScheduleCancel()">取消</div>
          <div class="formBtn formBtnOk" v-on:click="newScheduleOk()">确定</div>
        </div>
      </div>
      <!-- 点击更多 悬浮窗出来 -->
      <div class="taskItemMoreList" v-if="moreListShow" v-on:mouseleave="moreMouseout()" v-bind:style="{ top: moreDetailTop + 'px', left: moreDetailLeft + 'px' }">
        <div class="taskItemMoreDate">{{month}}月{{currentGridData.currentDate}}日</div>
        <div class="MoreTitleBox">
          <div class="taskItemMoreTitle" v-for="moreItem in moreTaskList" :key="moreItem.markId" v-on:mouseover="mouseover(moreItem.id, $event, 'more')" v-on:mouseleave="mouseout(moreItem.id)">{{moreItem.title}}</div>
        </div>
        <div class="morePagination">
          <el-pagination small layout="prev, pager, next" :page-size="5" :total="totalRow" @current-change="currentChange($event)"></el-pagination>
        </div>
        <div class="close" v-on:click="close()"><i class="el-icon-close"></i> </div>
      </div>
      <!--简易详情悬浮窗-->
      <div class="ScheduleDetail" v-on:mouseover="detailMouseOver()" v-on:mouseleave="detailMouseOut()" v-if="ScheduleDetailShow" v-bind:style="{ top: detailTop + 'px', left: detailLeft + 'px' }">
        <div class="detailFormArrow" v-bind:style="{ top: detailArrowTop + 'px', left: detailArrowLeft + 'px'}"></div>
        <div class="detailTit">{{titleType}}</div>
        <div class="newScheduleIpt"><el-input v-bind:disabled="detailCanEdit" v-model="detailScheduleTit" placeholder="请输入要做什么"></el-input></div>
        <div class="newScheduleDate">
          <el-date-picker v-bind:disabled="detailCanEdit" style="width: 50%; padding-right: 15px;" value-format="yyyy-MM-dd HH:mm:ss" v-model="detailValue1" type="datetime" placeholder="选择开始时间"></el-date-picker>
          <el-date-picker v-bind:disabled="detailCanEdit" style="width: 50%;" value-format="yyyy-MM-dd HH:mm:ss" v-model="detailValue2" type="datetime" placeholder="选择结束时间"></el-date-picker>
        </div>
        <div class="durationSelect" v-if="currentTargetType===1?true:false">
          <el-select v-bind:disabled="detailCanEdit" v-model="detailDurationValue" placeholder="请选择提醒时间">
            <el-option
              v-for="item in durationOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="formBtnBox">
          <div class="formBtn formBtnCancel" v-if="currentTargetType<=1?true:false" v-on:click="detailDel()">{{detailEditBtn?'取消':'删除'}}</div>
          <div class="formBtn formBtnOk" v-if="currentTargetType<=1?true:false" v-on:click="detailEdit()">{{detailEditBtn?'保存':'编辑'}}</div>
          <div class="formBtn toTaskDetail" v-else v-on:click="toTaskDetail()">查看详情</div>
        </div>
      </div>
    </div>
    <el-dialog title="图片预览" :visible.sync="dialogShowImg">
      <div class="showImg"><img v-bind:src="commentPreviewUrl" alt=""></div>
    </el-dialog>
    <!--抽屉 任务详情-->
    <Drawer title="任务详情" class="drawerScroll" :closable="false" width="740" v-model="TaskDetailCompShow">
      <component v-bind:is="compArr.TaskDetailComp"
                 v-bind:taskDrawerOpen="TaskDetailCompShow"
                 v-bind:modifyTaskRes="modifyTaskRes"
                 v-on:FilePreEmit="GetFilePreData"
                 v-on:taskShow="taskShowFuc"
                 v-on:toPlanDetail="toPlanDetailFuc"
                 v-on:showEditForm="showEditFormFuc"
                 v-on:CompThrow="CompThrowFuc"
                 v-on:ActionResThrow="ActionResThrowFuc"
                 v-on:TaskDelCallback="TaskDelCallbackFuc"
                 :nodeId="currentTargetId">
      </component>
    </Drawer>
    <!-- 任务详情 end -->
    <!--修改任务 编辑任务 任务 修改-->
    <Drawer class="drawerScroll" title="修改任务" :closable="false" width="40%" v-model="modifyTaskVisible">
      <!-- 修改任务 编辑任务 引入组件 -->
      <component v-bind:is="compArr.ModifyTask"
                 v-bind:DrawerOpen="modifyTaskVisible"
                 fileFormId="ModifyTask"
                 v-on:FilePreEmit="GetFilePreData"
                 v-on:ModifyTaskCallback="ModifyTaskCallbackFuc"
                 v-on:ShutCompEmit="ShutCompEmitFuc"
                 :nodeId="currentTargetId">
      </component>
    </Drawer>
    <el-dialog title="项目列表" :visible.sync="projectListShow">
      <component v-bind:is="compArr.linkProject" v-bind:linkId="taskLinkId" v-bind:proListShow="projectListShow" v-on:dialogGoodsShow="dialogGoodsShowFuc" v-on:showFlag="showFlagFuc"></component>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="dialogGoods" width="30%" center>
      <span>是否完善产品信息？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="jumpInfo">跳过</el-button>
        <el-button type="primary" @click="perfectInfo">去完善</el-button>
      </span>
    </el-dialog>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="dialogShowImg1">
      <div class="showImg"><img v-bind:src="commentPreviewUrl1" alt=""></div>
    </el-dialog>
  </div>
</template>

<script>
import FileUploadComp from './CustomComp/FileUploadComp.vue'
import TaskDetailComp from './CustomComp/TaskDetailComp.vue'
import linkProject from './CustomComp/linkProject.vue'
import ModifyTask from './CustomComp/ModifyTask.vue'
export default {
  name: 'Schedule',
  components: {
    FileUploadComp,
    TaskDetailComp,
    ModifyTask,
    linkProject
  },
  data () {
    return {
      // 双休日期
      rest: 0,
      arrList: [],
      // 接收到的组件数组 新组件
      FileUploadArr: [],
      // 是否让子组件清空文件 新组件
      IsClear: true,
      // 引入附件上传组件 新组件
      FileUploadComp: 'FileUploadComp',
      compArr: {
        ModifyTask: 'ModifyTask',
        ModifyPlan: 'ModifyPlan',
        linkProject: 'linkProject',
        CommentLogs: 'CommentLogs',
        FileUploadComp: 'FileUploadComp',
        CreatePlanOrTask: 'CreatePlanOrTask',
        TaskDistribute: 'TaskDistribute',
        ProBaseInfo: 'ProBaseInfo',
        MemberComp: 'MemberComp',
        TaskDetailComp: 'TaskDetailComp',
        PlanDetailComp: 'PlanDetailComp'
      },
      // 项目列表
      taskLinkId: '',
      dialogGoods: false,
      projectListShow: false,
      commentPreviewUrl1: '',
      dialogShowImg1: false,
      value444: false,
      modifyTaskVisible: false,
      // 详情 抽屉显示
      TaskDetailCompShow: false,
      modifyTaskRes: 'false',
      /** 抽屉 s */
      totalHistoryNum: 1,
      historyList: [],
      pageSize: 5,
      totalNum: 1,
      loading8: false,
      butnDisabled: true,
      dialogShowImg: false,
      commentPreviewUrl: '',
      rid: '',
      commitComent: '',
      loading: false,
      taskBasicMsg: '',
      taskId: '',
      value4: false,
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
      },
      /** 抽屉 e */
      /** 今年 */
      this_year: '',
      /** 今月 */
      this_month: '',
      /** 今日 */
      this_date: '',
      testLeft: '',
      testTop: '',
      /** 点击更多 显示/隐藏 */
      moreListShow: false,
      pickerOptions: {},
      pickerOptions2: {},
      /** 大开关 */
      kk: true,
      /** 详情悬浮窗 “编辑”点击状态开关 */
      detailEditBtn: false,
      /** 详情悬浮窗 是否禁用 */
      detailCanEdit: true,
      /** 详情悬浮窗类型（任务或者日程） **/
      titleType: '',
      ScheduleDetailShow: false,
      detailTop: 0,
      detailLeft: 0,
      moreDetailLeft: 0,
      moreDetailTop: 0,
      detailArrowTop: 22,
      detailArrowLeft: -5,
      newScheduleTop: 0,
      newScheduleLeft: 0,
      newScheduleArrowTop: 0,
      newScheduleArrowLeft: 0,
      /** 当前格子传值数据 */
      currentGridData: {
        currGridIndex: 1,
        currentDate: ''
      },
      /** 鼠标经过 当前日程/任务id */
      currentTargetId: '',
      /** 鼠标经过 当前日程/任务类型 */
      currentTargetType: 1,
      totalRow: 1,
      newScheduleFormShow: false,
      /** 新建日程 多少分钟前提醒 */
      durationValue: 0,
      /** 新建日程 开始时间 结束时间 */
      value1: '',
      value2: '',
      /** 新建日程 输入标题 */
      newScheduleTit: '',
      radio: '1',
      checkList: ['我的日程'],
      year: 2018,
      month: 1,
      weekDay: 0, // 某月的一号是周几
      dateOneFormart: '', // 某月1号的格式化日期
      monthMax: 31,
      monGrids: [],
      scheduleList: [],
      allScheduleTaskId: [],
      /** 点击查看更多 */
      moreTaskList: [],
      scheduleListPayload: {
        sStartTime: '2018-12-01 00:00:00',
        /** 查询结束时间 */
        sEndTime: '2018-12-31 00:00:00',
        /** 是否查询我的日程 */
        schedule: true,
        /** 是否查询我的任务 */
        task: false,
        /** 是否查询我发起的任务 */
        launchTask: false
      },
      /** 查看更多 */
      getScheduleDetailListPayload: {
        pageNum: 1,
        pageSize: 5,
        date: '2018-12-27',
        schedule: true,
        task: false,
        launchTask: false
      },
      /** 新建日程 */
      addSchedulePayload: {
        title: '',
        startTime: '',
        endTime: '',
        minute: 15
      },
      /** 编辑日程 sdId */
      editSchedulePayload: {
        title: '',
        startTime: '',
        endTime: '',
        minute: 15,
        sdId: ''
      },
      /** 删除日程 */
      delSchedulePayload: {
        sdId: ''
      },
      durationOptions: [{
        value: 5,
        label: '开始前五分钟(默认)'
      }, {
        value: 15,
        label: '开始前十五分钟'
      }, {
        value: 30,
        label: '开始前半小时'
      }, {
        value: 60,
        label: '开始前一小时'
      }, {
        value: 1440,
        label: '开始前一天'
      }, {
        value: 0,
        label: '不提醒'
      }],
      /** 日程详情 多少分钟前提醒 */
      detailDurationValue: '',
      /** 日程详情标题 */
      detailScheduleTit: '',
      /** 日程详情 开始时间 结束时间 */
      detailValue1: '',
      detailValue2: ''
    }
  },
  watch: {
    // 如果 `testData` 发生改变，这个函数就会运行
    radio: function (newValue, oldValue) {
      var that = this
      if (newValue === '1') {
        that.scheduleListPayload.schedule = true
        that.scheduleListPayload.task = false
        that.scheduleListPayload.launchTask = false
        /** 查看更多 ***/
        that.getScheduleDetailListPayload.schedule = true
        that.getScheduleDetailListPayload.task = false
        that.getScheduleDetailListPayload.launchTask = false
      } else if (newValue === '2') {
        that.scheduleListPayload.schedule = false
        that.scheduleListPayload.task = true
        that.scheduleListPayload.launchTask = false
        /** 查看更多 ***/
        that.getScheduleDetailListPayload.schedule = false
        that.getScheduleDetailListPayload.task = true
        that.getScheduleDetailListPayload.launchTask = false
      } else if (newValue === '3') {
        that.scheduleListPayload.schedule = false
        that.scheduleListPayload.task = false
        that.scheduleListPayload.launchTask = true
        /** 查看更多 ***/
        that.getScheduleDetailListPayload.schedule = false
        that.getScheduleDetailListPayload.task = false
        that.getScheduleDetailListPayload.launchTask = true
      }
      that.dateMountInit(that.monDateOneFormart())
    },
    commitComent: function (val, oVal) {
      if (val) {
        this.butnDisabled = false
      } else {
        this.butnDisabled = true
      }
    },
    durationValue: function (newValue, oldValue) {
      // this.alert('newValue:' + newValue)
    },
    checkList: function (newValue, oldValue) {
      var that = this
      // this.log('checkbox=>newValue:', newValue)
      if (newValue.length === 1) {
        if (newValue[0] === '我的日程') {
          that.scheduleListPayload.schedule = true
          that.scheduleListPayload.task = false
          that.scheduleListPayload.launchTask = false
          /** 查看更多 ***/
          that.getScheduleDetailListPayload.schedule = true
          that.getScheduleDetailListPayload.task = false
          that.getScheduleDetailListPayload.launchTask = false
        }
        if (newValue[0] === '我的任务') {
          that.scheduleListPayload.schedule = false
          that.scheduleListPayload.task = true
          that.scheduleListPayload.launchTask = false
          /** 查看更多 ***/
          that.getScheduleDetailListPayload.schedule = false
          that.getScheduleDetailListPayload.task = true
          that.getScheduleDetailListPayload.launchTask = false
        }
        if (newValue[0] === '我的发起') {
          that.scheduleListPayload.schedule = false
          that.scheduleListPayload.task = false
          that.scheduleListPayload.launchTask = true
          /** 查看更多 ***/
          that.getScheduleDetailListPayload.schedule = false
          that.getScheduleDetailListPayload.task = false
          that.getScheduleDetailListPayload.launchTask = true
        }
      } else if (newValue.length === 2) {
        if (newValue[0] === '我的日程' && newValue[1] === '我的任务') {
          that.scheduleListPayload.schedule = true
          that.scheduleListPayload.task = true
          that.scheduleListPayload.launchTask = false
          /** 查看更多 ***/
          that.getScheduleDetailListPayload.schedule = true
          that.getScheduleDetailListPayload.task = true
          that.getScheduleDetailListPayload.launchTask = false
        } else if (newValue[0] === '我的日程' && newValue[1] === '我的发起') {
          that.scheduleListPayload.schedule = true
          that.scheduleListPayload.task = false
          that.scheduleListPayload.launchTask = true
          /** 查看更多 ***/
          that.getScheduleDetailListPayload.schedule = true
          that.getScheduleDetailListPayload.task = false
          that.getScheduleDetailListPayload.launchTask = true
        } else {
          that.scheduleListPayload.schedule = false
          that.scheduleListPayload.task = true
          that.scheduleListPayload.launchTask = true
          /** 查看更多 ***/
          that.getScheduleDetailListPayload.schedule = false
          that.getScheduleDetailListPayload.task = true
          that.getScheduleDetailListPayload.launchTask = true
        }
      } else if (newValue.length === 3) {
        that.scheduleListPayload.schedule = true
        that.scheduleListPayload.task = true
        that.scheduleListPayload.launchTask = true
        /** 查看更多 ***/
        that.getScheduleDetailListPayload.schedule = true
        that.getScheduleDetailListPayload.task = true
        that.getScheduleDetailListPayload.launchTask = true
      } else {
        that.scheduleListPayload.schedule = false
        that.scheduleListPayload.task = false
        that.scheduleListPayload.launchTask = false
        /** 查看更多 ***/
        that.getScheduleDetailListPayload.schedule = false
        that.getScheduleDetailListPayload.task = false
        that.getScheduleDetailListPayload.launchTask = false
      }
      that.dateMountInit(that.monDateOneFormart())
    },
    value1: function (newValue, oldValue) {
      var that = this
      this.value2 = this.getNextFormartTime(newValue)
      // this.log('that.value1:', that.value1)
      // this.dateTransToApple('123')
      this.pickerOptions2.disabledDate = function (time) {
        var value1Stamp = new Date(that.dateCompatibility(that.value1)).getTime()
        // return time.getTime() < Date.now() - 8.64e7 || time.getTime() > disabledStarTime
        return time.getTime() < value1Stamp - 8.64e7
      }
    }
  },
  created: function () {
    // var that = this
    /** 设置面包屑 */
    this.$store.commit('setRouterName', {name: '我的日程', parentName: 'TaskPlan', url: '/'})
    // this.$router.push('/Schedule')
    var dateObj = new Date()
    this.year = dateObj.getFullYear()
    this.month = dateObj.getMonth() + 1
    // 今年
    this.this_year = dateObj.getFullYear()
    // 今月
    this.this_month = dateObj.getMonth() + 1
    // 今日
    this.this_date = dateObj.getDate()
    // 日期挂载
    this.dateMountInit(this.monDateOneFormart())
    // 浏览器类型
    // this.alert(this.testBrowser())
    // if (!localStorage.getItem('generalMenuActive') && localStorage.getItem('generalMenuActive') !== '集团战略') {
    //   // this.log('nimanimanima------:', localStorage.getItem('generalMenuActive'))
    //   // this.log('nimanimanima------:', that.$store.state.slideMenu[p].projectType)
    //   for (var p = 0; p < that.$store.state.slideMenu.length; p++) {
    //     if (that.$store.state.slideMenu[p].projectType === '我的日程') {
    //       that.log(99999999)
    //       that.$store.state.activeNavIndex = 'general_' + p
    //       localStorage.setItem('generalMenuActive', '我的日程')
    //       // that.$store
    //     }
    //   }
    // }
  },
  mounted: function () {
    /** 设置侧边栏激活状态 */
    this.$store.commit('setNavActive', {navName: '我的日程', childNavName: ''})
  },
  computed: {
    slideMenu: function () {
      var that = this
      // this.log()
      // this.log('url地址：', window.location.href)
      if (that.$store.state.slideMenu.length > 0) {
        for (var i = 0; i < that.$store.state.slideMenu.length; i++) {
          if (that.$store.state.slideMenu[i].projectType === '我的日程') {
            that.$store.state.activeNavIndex = 'general_' + i
            localStorage.setItem('generalMenuActive', '我的日程')
          }
        }
      }
      return that.$store.state.slideMenu
    }
  },
  methods: {
    taskShowFuc: function (val) {
      var that = this
      that.projectListShow = true
      console.log('888888888', val)
      that.taskLinkId = val
    },
    showFlagFuc: function (val) {
      this.projectListShow = val
    },
    dialogGoodsShowFuc: function (val) {
      this.dialogGoods = val
    },
    // 去完善信息
    perfectInfo () {
      // this.proId = this.$store.state.proId
      this.$router.push('/goodsDetail')
      this.$store.state.goPerfect = true
      this.goodsEdit = true
      this.dialogGoods = false
      this.projectListShow = false
    },
    // 跳过
    jumpInfo () {
      this.dialogGoods = false
    },
    GetFileInfo (obj) {
      if (obj) {
        this.IsClear = false
      }
      this.FileUploadArr = obj
    },
    showImagePreCom: function (url) {
      if (url) {
        this.commentPreviewUrl = url
        this.dialogShowImg = true
      }
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
    toSchedule: function () {
      this.$router.push('/Schedule')
    },
    backTask: function () {
      this.$store.state.TaskPlanCurrentTab = 'MyTask'
      this.$router.push('/')
    },
    // 以半小时计的时间段
    getHalfHoursTime: function (dateFormart) {
      var dateObj = new Date(dateFormart)
      var timeStamp = dateObj.getTime()
      var year = dateObj.getFullYear()
      var month = dateObj.getMonth() + 1
      var date = dateObj.getDate()
      var h = dateObj.getHours()
      var m = dateObj.getMinutes()
      var forMartDate = ''
      if (m < 30) {
        m = 30
        forMartDate = year + '-' + month + '-' + date + ' ' + h + ':' + m + ':' + '00'
      } else {
        var dateNextHalfObj = new Date((60 - m) * 60 * 1000 + timeStamp)
        var dateNextYear = dateNextHalfObj.getFullYear()
        var dateNextMonth = dateNextHalfObj.getMonth() + 1
        var dateNextDate = dateNextHalfObj.getDate()
        var dateNextHours = dateNextHalfObj.getHours()
        forMartDate = dateNextYear + '-' + dateNextMonth + '-' + dateNextDate + ' ' + dateNextHours + ':00:00'
      }
      return forMartDate
    },
    // 获取当前时间
    getNowFormartTime: function () {
      var dateObj = new Date()
      var year = dateObj.getFullYear()
      var month = dateObj.getMonth() + 1
      var date = dateObj.getDate()
      var h = dateObj.getHours()
      var m = dateObj.getMinutes()
      if (month < 10) {
        month = '0' + month
      }
      if (date < 10) {
        date = '0' + date
      }
      if (h < 10) {
        h = '0' + h
      }
      if (m < 10) {
        m = '0' + m
      }
      return year + '-' + month + '-' + date + ' ' + h + ':' + m + ':' + '00'
    },
    // 当前时间一小时后的时间
    getNextFormartTime: function (st) {
      var that = this
      var dateObjNow = ''
      if (st) {
        dateObjNow = new Date(that.dateCompatibility(st))
      } else {
        // this.alert(1)
        dateObjNow = new Date()
      }
      // var dateObjNow = new Date()
      var timestr = dateObjNow.getTime() + 1 * 60 * 60 * 1000
      var dateObj = new Date(timestr)
      var year = dateObj.getFullYear()
      var month = dateObj.getMonth() + 1
      var date = dateObj.getDate()
      var h = dateObj.getHours()
      var m = dateObj.getMinutes()
      // this.alert(year + '-' + month + '-' + date + '-' + h + ':' + m)
      if (month < 10) {
        month = '0' + month
      }
      if (date < 10) {
        date = '0' + date
      }
      if (h < 10) {
        h = '0' + h
      }
      if (m < 10) {
        m = '0' + m
      }
      return year + '-' + month + '-' + date + ' ' + h + ':' + m + ':' + '00'
    },
    // 新建日程 清空表单
    newScheduleClear: function () {
      this.newScheduleTit = ''
      this.durationValue = 0
      this.value1 = ''
      this.value2 = ''
    },
    // 获取某月的天数
    getMonDays: function () {
      var that = this
      var d = new Date(that.year, that.month, 0)
      return d.getDate()
    },
    // 某月1号的格式化日期
    monDateOneFormart: function () {
      if (this.testBrowser() === 'Safari') {
        this.dateOneFormart = this.year + '/' + this.month + '/' + '01' + ' 00:00:00'
      } else {
        this.dateOneFormart = this.year + '-' + this.month + '-' + '01' + ' 00:00:00'
      }
      return this.dateOneFormart
    },
    // 日期挂载到格子初始化
    dateMountInit: function (dateFormart) {
      var that = this
      this.monGrids = []
      var myDate = new Date(dateFormart)
      this.month = myDate.getMonth() + 1
      this.monthMax = this.getMonDays()
      var weekDay = myDate.getDay()
      that.weekDay = weekDay
      // 请求体赋值
      that.scheduleListPayload.sStartTime = that.year + '-' + that.month + '-01' + ' 00:00:00'
      that.scheduleListPayload.sEndTime = that.year + '-' + that.month + '-' + that.monthMax + ' 00:00:00'
      // 日程接口调用
      this.ajax('/schedule/getScheduleList', that.scheduleListPayload).then(res => {
        // this.log('actionName:getScheduleList:', res)
        if (res.code === 200) {
          // this.log(0)
          // that.scheduleList = res.data.schedule
          for (var i = 0; i < 42; i++) {
            var obj = {
              date: 0,
              totalNum: 0,
              dayTaskList: [],
              light: false,
              isToday: false,
              moreListShow: false,
              moreLight: false,
              id: 'id_' + that.month + '_' + i,
              isRest: 0
            }
            if (i >= weekDay) {
              if (i - (weekDay - 1) <= that.monthMax) {
                obj.date = i - (weekDay - 1)
                // 如果日期是今天 今天的格子做标记标识出来
                if (that.year === that.this_year && that.month === that.this_month && that.this_date === obj.date) {
                  obj.isToday = true
                }
                // over
                var scheduleIndex = i - (weekDay - 1) - 1
                for (var t = 0; t < res.data.schedule[scheduleIndex].info.length; t++) {
                  var stype = res.data.schedule[scheduleIndex].info[t].type
                  res.data.schedule[scheduleIndex].info[t].mark_id = 'mark_' + (i - (weekDay - 1)) + '_' + stype + '_' + res.data.schedule[scheduleIndex].info[t].id
                  // res.data.schedule[scheduleIndex].info[t].showDetails = false
                }
                obj.dayTaskList = obj.dayTaskList.concat(res.data.schedule[scheduleIndex].info)
                obj.totalNum = res.data.schedule[scheduleIndex].totalNum
              }
            }
            this.monGrids.push(obj)
          }
          that.queryAllScheduleTaskId()
        } else {
        }
      })
    },
    // 获取所有天的所有任务、日程ID
    queryAllScheduleTaskId: function () {
      var that = this
      that.arrList = []
      this.ajax('/schedule/getScheduleList', that.scheduleListPayload).then(res => {
        if (res.code === 200) {
          that.allScheduleTaskId = res.data.schedule
          that.arrList = res.data.holidayMap
          that.monGrids.forEach((item, index) => {
            that.arrList.forEach((items, idx) => {
              let n, g
              // 判断n为休息日的下标
              if (items === 1) {
                n = idx
              }
              // 判断g为节假日的下标
              if (items === 2) {
                g = idx
              }
              // 判断日历中下标为n+前面没有日期的个数
              if (index === n + that.weekDay) {
                item.isRest = 1
              } else if (index === g + that.weekDay) {
                item.isRest = 2
              }
            })
          })
        } else {

        }
      })
    },
    // 上一个月
    monBefore: function () {
      if (this.month === 1) {
        this.year = this.year - 1
        this.month = 12
      } else {
        this.month = this.month - 1
      }
      this.dateMountInit(this.monDateOneFormart())
    },
    // 下一个月
    monNext: function () {
      if (this.month === 12) {
        this.year = this.year + 1
        this.month = 1
      } else {
        this.month = this.month + 1
      }
      this.dateMountInit(this.monDateOneFormart())
    },
    /** 鼠标悬停 */
    mouseover: function (targetId, e, listType) {
      var that = this
      if (that.kk) {
        var obj = e.currentTarget
        that.currentTargetId = targetId
        // that.testLeft = $(obj).parents('.taskItemMoreList').position().left
        // that.testTop = $(obj).parents('.taskItemMoreList').position().top
        if (listType === 'more') {
          if ($(obj).offset().left > 500) {
            that.testTop = $(obj).offset().top
            that.testLeft = $(obj).offset().left
            that.detailLeft = $(obj).parents('.taskItemMoreList').position().left - 380
            // that.log('top:', typeof $(obj).position().top)
            // that.detailTop = $(obj).position().top + 2000
            // that.log('that.detailTop:', that.detailTop)
            that.detailArrowLeft = 395
          } else {
            that.detailLeft = $(obj).offset().left - 40
            that.detailArrowLeft = -5
          }
          if ($(obj).offset().top > 400) {
            // that.log(222)
            // that.testTop = $(obj).parents('.taskItemMoreList').position().top
            that.detailTop = $(obj).offset().top - 340
            that.detailArrowTop = 165
          } else {
            // that.log(333)
            // that.testTop = $(obj).parents('.taskItemMoreList').position().top
            // that.testTop = $(obj).position().top
            // this.log('小于700')
            // that.alert('小于400')
            that.detailTop = $(obj).offset().top - 200
            that.detailArrowTop = 20
          }
        } else {
          // that.log(444)
          // that.alert(1)
          if ($(obj).position().left > 500) {
            that.detailLeft = $(obj).position().left - 400
            that.detailArrowLeft = 395
          } else {
            that.detailLeft = $(obj).position().left + parseInt($(obj).width())
            that.detailArrowLeft = -5
          }
          if ($(obj).position().top > 400) {
            that.detailTop = $(obj).position().top - 130
            that.detailArrowTop = 165
          } else {
            // this.log('小于700')
            that.detailTop = $(obj).position().top + 13
            that.detailArrowTop = 20
          }
        }
        // 如果新建日程弹窗是显示状态 任务/日程列表的详情弹窗不显示
        if (!this.newScheduleFormShow) {
          this.ScheduleDetailShow = true
        }
        for (var i = 0; i < that.monGrids.length; i++) {
          var isInList = false
          var isInAllId = false
          // var showDetails = false
          for (var t = 0; t < that.monGrids[i].dayTaskList.length; t++) {
            if (that.monGrids[i].dayTaskList[t].id === targetId) {
              that.currentTargetType = that.monGrids[i].dayTaskList[t].type
              isInList = true
              // titleType
              that.titleType = that.monGrids[i].dayTaskList[t].type === 1 ? '日程' : '任务'
              that.detailScheduleTit = that.monGrids[i].dayTaskList[t].title
              that.detailValue1 = that.monGrids[i].dayTaskList[t].startTime
              that.detailValue2 = that.monGrids[i].dayTaskList[t].endTime
              that.detailDurationValue = that.monGrids[i].dayTaskList[t].remindMinute
              break
            } else {
              var dayIndex = i - (that.weekDay - 1) - 1
              for (var r = 0; that.allScheduleTaskId[dayIndex] && r < that.allScheduleTaskId[dayIndex].info.length; r++) {
                if (that.allScheduleTaskId[dayIndex].info[r].id === targetId) {
                  isInAllId = true
                }
              }
            }
          }
          if (isInList) {
            that.monGrids[i].dayTaskList[t].light = true
            that.monGrids[i].light = true
          }
          if (!isInList && isInAllId) {
            that.monGrids[i].light = true
            that.monGrids[i].moreLight = true
          }
        }
      }
      // that.log('mouseover:', that.monGrids)
    },
    /** 详情弹窗 鼠标悬停 */
    detailMouseOver: function () {
      this.ScheduleDetailShow = true
      // this.detailEditBtn = false
      // this.detailCanEdit = true
    },
    /** 详情弹窗 鼠标移出 */
    detailMouseOut: function () {
      if (this.detailEditBtn) {
        // j
      } else {
        this.ScheduleDetailShow = false
      }
    },
    /** 鼠标移出 */
    mouseout: function (targetId) {
      var that = this
      if (that.kk) {
        // 待检查
        this.ScheduleDetailShow = false
        for (var i = 0; i < that.monGrids.length; i++) {
          // var isInList = false
          // var isInAllId = false
          for (var t = 0; t < that.monGrids[i].dayTaskList.length; t++) {
            if (that.monGrids[i].dayTaskList[t].id === targetId) {
              that.monGrids[i].dayTaskList[t].light = false
              that.monGrids[i].light = false
              // isInList = true
            } else {
              var dayIndex = i - (that.weekDay - 1) - 1
              for (var r = 0; that.allScheduleTaskId[dayIndex] && r < that.allScheduleTaskId[dayIndex].info.length; r++) {
                if (that.allScheduleTaskId[dayIndex].info[r].id === targetId) {
                  // that.monGrids[i].dayTaskList[t].light = true
                  that.monGrids[i].light = false
                  // isInAllId = true
                  that.monGrids[i].moreLight = false
                  // that.log('移出找到了')
                }
              }
            }
          }
        }
      }
      // that.log('mouseover:', that.monGrids)
    },
    // 点击更多 加载更多 翻页
    moreClick: function (gridIndex, date, e) {
      var that = this
      if (e) {
        var obj = e.currentTarget
        // testLeft
        if ($(obj).position().left > 600) {
          this.moreDetailLeft = $(obj).position().left - 130
        } else {
          this.moreDetailLeft = $(obj).position().left
        }
        this.moreDetailTop = $(obj).position().top - 180
      }
      // 如果新建日程弹窗是显示状态 则取消新建
      this.newScheduleCancel()
      this.moreListShow = true
      that.currentGridData.currGridIndex = gridIndex
      that.currentGridData.currentDate = date
      that.getScheduleDetailListPayload.date = that.year + '-' + that.month + '-' + date
      this.ajax('/schedule/getScheduleDetailList', that.getScheduleDetailListPayload).then(res => {
        this.log('getScheduleDetailList:', res)
        if (res.code === 200) {
          that.monGrids[gridIndex].moreListShow = true
          this.totalRow = res.data.totalRow
          for (var r = 0; r < res.data.list.length; r++) {
            res.data.list[r].markId = res.data.list[r].id + '_' + res.data.list[r].type
          }
          that.moreTaskList = res.data.list
        } else {
          // that.log(res.msg)
        }
      })
    },
    // 分页
    currentChange: function (e) {
      this.log(e)
      var that = this
      that.getScheduleDetailListPayload.pageNum = e
      that.moreClick(that.currentGridData.currGridIndex, that.currentGridData.currentDate)
      // this.alert(e)
    },
    close: function () {
      // this.log('gridIndex:', gridIndex)
      this.moreTaskList = []
      this.getScheduleDetailListPayload.pageNum = 1
      this.getScheduleDetailListPayload.pageSize = 5
      this.ScheduleDetailShow = false
      this.kk = true
      this.detailEditBtn = false
      this.detailCanEdit = true
      this.moreListShow = false
      // this.monGrids[gridIndex].moreListShow = false
    },
    moreMouseout: function () {
      // this.close()
    },
    // 新建日程
    createSchedule: function (e) {
      var obj = e.currentTarget
      this.testLeft = $(obj).offset().left
      this.testTop = $(obj).offset().top
      this.newScheduleLeft = $(obj).offset().left - 520
      this.newScheduleTop = $(obj).offset().top - 180
      this.newScheduleArrowLeft = 370
      this.newScheduleArrowTop = -5
      this.value1 = this.getNowFormartTime()
      this.value2 = this.getNextFormartTime()
      this.pickerOptions.disabledDate = function (time) {
        // return time.getTime() < Date.now() - 8.64e7 || time.getTime() > disabledStarTime
        return time.getTime() < Date.now() - 8.64e7
      }
      this.newScheduleFormShow = true
    },
    // 双击 新建日程 取消
    newScheduleCancel: function () {
      this.newScheduleFormShow = false
    },
    detailCancel: function () {
      this.ScheduleDetailShow = false
    },
    // 删除日程 // 取消编辑 取消修改
    detailDel: function () {
      var that = this
      if (!that.detailEditBtn) {
        if (that.currentTargetType === 1) {
          that.$confirm('确定删除本条日程？', '', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            that.delSchedulePayload.sdId = that.currentTargetId
            this.ajax('/schedule/delSchedule', that.delSchedulePayload).then(res => {
              this.dateMountInit(this.monDateOneFormart())
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              // this.log('delSchedule:', res)
            })
          }).catch(() => {
            // that.loading = false
          })
        } else {
          // this.log('任务在此处不可删除')
        }
      } else {
        that.kk = true
        that.detailEditBtn = false
        that.detailCanEdit = true
      }
    },
    /** 修改日程 编辑日程 */
    detailEdit: function () {
      var that = this
      // detailCanEdit
      if (!that.detailEditBtn) {
        that.kk = false
        that.detailEditBtn = true
        that.detailCanEdit = false
      } else {
        if (that.currentTargetType === 1) {
          that.editSchedulePayload.sdId = that.currentTargetId
          that.editSchedulePayload.title = that.detailScheduleTit
          that.editSchedulePayload.minute = that.detailDurationValue
          that.editSchedulePayload.startTime = that.detailValue1
          that.editSchedulePayload.endTime = that.detailValue2
          this.ajax('/schedule/editSchedule', that.editSchedulePayload).then(res => {
            this.dateMountInit(this.monDateOneFormart())
            that.ScheduleDetailShow = false
            that.moreListShow = false
            that.detailEditBtn = false
            that.detailCanEdit = true
            that.kk = true
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            // this.log('delSchedule:', res)
          })
        } else {
          // this.log('任务在此处不可修改')
        }
      }
      // 如果是保存
      if (that.detailEditBtn) {

      } else {

      }
      // this.ScheduleDetailShow = false editSchedulePayload
    },
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
      that.currentTargetId = id
      that.value444 = true
      that.TaskDetailCompShow = false
    },
    showEditFormFuc: function () {
      var that = this
      that.modifyTaskVisible = true
    },
    CompThrowFuc: function (arg) {
      this.modifyTaskRes = arg
    },
    testComp: function () {
      var that = this
      this.log('testComp:', that.modifyTaskRes)
    },
    ActionResThrowFuc: function (obj) {
      var that = this
      switch (obj.actionName) {
        case 'transferTask':
          // 任务移交
          that.TaskDetailCompShow = false
          // that.selectProjectId(that.activeId)
          break
        case 'finishTask':
          // 任务完成
          // that.selectProjectId()
          break
        case 'restartTask':
          // 任务重启
          // that.selectProjectId()
          break
        case 'startTask':
          // 任务开始
          // that.selectProjectId()
          break
        case 'decomposeTask':
          // 任务分解
          // that.selectProjectId()
          break
        default:
          this.log('')
      }
    },
    TaskDelCallbackFuc: function (res) {
      var that = this
      if (res.code === 200) {
        // that.selectProjectId()
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
    // 组件内点击了关闭 父组件执行关闭子组件操作
    ShutCompEmitFuc: function (res) {
      this[res] = false
    },
    // 编辑任务 修改任务
    ModifyTaskCallbackFuc: function (res) {
      var that = this
      this.log('ModifyTaskCallbackFuc:', res)
      if (res.code === 200) {
        that.modifyTaskVisible = false
        that.modifyTaskRes = 'true'
        // that.queryProDetail()
        // that.selectProjectId()
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
    /** 跳转至任务详情 */
    toTaskDetail: function () {
      var that = this
      if (that.currentTargetType >= 2) {
        that.showDetailPage()
        // that.$router.push('/taskDetailPage/' + that.currentTargetId)
      }
    },
    // 新建日程 确定 提交 保存
    newScheduleOk: function () {
      var that = this
      that.addSchedulePayload.startTime = this.value1
      that.addSchedulePayload.endTime = this.value2
      that.addSchedulePayload.title = that.newScheduleTit
      that.addSchedulePayload.minute = that.durationValue
      if (that.newScheduleTit && that.value1 && that.value2) {
        this.ajax('/schedule/addSchedule', that.addSchedulePayload).then(res => {
          // that.log('addSchedule:', res)
          if (res.code === 200) {
            that.dateMountInit(that.monDateOneFormart())
            that.newScheduleFormShow = false
            that.$message({
              type: 'success',
              message: '创建成功'
            })
            that.newScheduleClear()
          } else {
            that.dateMountInit(that.monDateOneFormart())
            that.newScheduleFormShow = false
            that.$message({
              type: 'warning',
              message: '创建失败'
            })
          }
        })
      } else {
        that.$message({
          type: 'warning',
          message: '表单信息不完整'
        })
      }
    },
    // 双击 新建日程
    gridDoubleClick: function (gridDay, gridIndex, e) {
      // 页面上的 “更多”列表悬浮窗消失
      this.close()
      var that = this
      var targetDate = gridDay.date
      if (targetDate) {
        var dateObj = new Date()
        var h = dateObj.getHours()
        var m = dateObj.getMinutes()
        var tt = ''
        if (this.testBrowser() === 'Safari') {
          tt = that.year + '/' + that.month + '/' + targetDate + ' ' + h + ':' + m + ':00'
        } else {
          tt = that.year + '-' + that.month + '-' + targetDate + ' ' + h + ':' + m + ':00'
        }
        // this.log('tt:', tt)
        var obj = e.currentTarget
        this.testLeft = $(obj).position().left
        this.testTop = $(obj).position().top
        // f
        if ($(obj).position().top >= 300) {
          this.newScheduleTop = $(obj).position().top - 150
          this.newScheduleArrowTop = 190
        } else {
          this.newScheduleTop = $(obj).position().top + 60
          this.newScheduleArrowTop = 20
        }
        if ($(obj).position().left > 500) {
          this.newScheduleLeft = $(obj).position().left - 370
          this.newScheduleArrowLeft = 395
        } else {
          this.newScheduleLeft = $(obj).position().left + 100
          this.newScheduleArrowLeft = -5
        }
        // this.newScheduleTop = $(obj).offset().top - 200
        // this.newScheduleLeft = $(obj).offset().left - 150
        this.value1 = this.getHalfHoursTime(tt)
        // this.value2 = this.getNextFormartTime()
        this.pickerOptions.disabledDate = function (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
        this.newScheduleFormShow = true
      }
    },
    showDetailPage: function () {
      var that = this
      // that.resetScro()
      // if (data.type === '2') {
      that.taskId = that.currentTargetId
      that.taskComment.uid = that.currentTargetId
      that.taskHistoryList.uid = that.currentTargetId
      that.TaskDetailCompShow = true
      that.getCommicateCont()
      that.getHistoryList()
      // that.ajax('/leader/getTaskBasic', {uid: that.taskId}).then(res => {
      //   if (res.code === 200) {
      //     that.taskBasicMsg = res.data
      //     that.rid = res.data.uid
      //     if (that.isImage(res.data.showName)) {
      //       res.data.isImg = true
      //     } else {
      //       res.data.isImg = false
      //     }
      //     that.downurl = that.$store.state.baseServiceUrl + '/file/downloadFile?realUrl=' + res.data.realUrl + '&showName=' + res.data.showName
      //     that.resetScro()
      //   }
      // })
      // }
    },
    resetScro: function () {
      $('.ivu-drawer-body').scrollTop(0)
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
        }
      })
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
    getFileName: function () {
      var filePath = $('#myfile').val()
      var arr = filePath.split('\\')
      var fileName = arr[arr.length - 1]
      $('.showFileName').html(fileName)
    },
    showImagePre: function () {
      this.dialogFormVisible = true
    },
    addMarkInfo () {
      var that = this
      that.loading8 = true
      that.ajax('/comment/addComment', {
        content: that.commitComent,
        attachmentId: that.SetFileIdStr(),
        contentId: that.taskId,
        parentCommentId: '11'
      }).then(res => {
        if (res.code === 200) {
          that.log('myTaskView:', res)
          that.getCommicateCont()
          that.IsClear = true
          that.fileListComment = []
          that.commitComent = ''
          $('.showFileName').html('')
          $('#myfile2').val('')
          that.loading8 = false
        } else {
          that.$message.error('评论失败！')
          that.loading8 = false
        }
      })
    }
  }
}
</script>

<style scoped>
  .mySchedule{
    padding-bottom: 50px;
    _background-color: #f1f6fa;
  }
  .header{
    _height: 120px;
    _margin-top: -50px;
    _position: relative;
    _background-color: #e3f3ff;
  }
  /*.BackToTask{*/
  /*color: #666;*/
  /*position: absolute;*/
  /*left: 0px;*/
  /*top: 7px;*/
  /*cursor: pointer;*/
  /*_background-color: #409EFF;*/
  /*}*/
  /*.BackToTask:hover{*/
  /*color: #3a8ee6;*/
  /*}*/
  .headerCnt{
    _width: 1500px;
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
  }
  .headerCntTit{
    display: flex;
    padding-top: 25px;
  }
  .headerCntTit span{
    font-size: 22px;
  }
  .radioSelect{
    padding-top: 8px;
    margin-left: 40px;
  }
  .typeSelect{
    display: flex;
    padding-top: 20px;
  }
  .newAddSchedule{
    position: relative;
    margin-left: 20px;
  }
  /** 新建日程 */
  .newScheduleForm{
    width: 400px;
    min-height: 150px;
    border-radius: 6px;
    padding: 20px 0px;
    padding-bottom: 0;
    box-sizing: border-box;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,.2);
    background-color: #fff;
    position: absolute;
    top: 45px;
    right: -10px;
    z-index: 100;
  }
  .newScheduleIpt{
    padding: 0 15px;
  }
  .durationSelect{
    padding: 0 15px;
    margin-top: 20px;
  }
  .formArrow{
    width: 10px;
    height: 10px;
    background-color: inherit;
    _background-color: blue;
    position: absolute;
    top: -5px;
    left: 30px;
    transform: rotate(45deg);
  }
  .newScheduleDate{
    display: flex;
    padding: 0px 15px;
    margin-top: 20px;
  }
  .formBtnBox{
    text-align: center;
    display: flex;
    margin-top: 20px;
    border-top: 1px solid #eee;
  }
  .formBtn{
    _width: 50%;
    flex-grow: 1;
    padding: 10px 0;
    cursor: pointer;
  }
  .formBtn.toTaskDetail{
    color: #3a8ee6;
  }
  .formBtnCancel{
    border-right: 1px solid #eee;
  }
  .formBtnOk{
    color: #3a8ee6;
  }
  .contentData{
    _width: 1500px;
    margin: 0 auto;
    margin-top: 40px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 6px;
    _min-height: 700px;
    position: relative;
  }
  .weekHeader{
    display: flex;
    text-align: center;
    padding: 5px 0;
    justify-content: space-around;
    border-bottom: 1px solid #ddd;
  }
  .grids{
    display: flex;
    flex-wrap: wrap;
    position: relative;
  }
  .grid{
    width: 14.28%;
    height: 154px;
    _position: relative;
    box-sizing: border-box;
    border-bottom: 1px solid #ddd;
    border-left: 1px solid #ddd;
  }
  .grid.isToday{
    border: 2px solid #3a8ee6;
  }
  /*.grid.light{*/
  /*_border: 1px solid red;*/
  /*background-color: #3a8ee6;*/
  /*}*/
  .grid:nth-child(1),.grid:nth-child(8),.grid:nth-child(15),.grid:nth-child(22),.grid:nth-child(29),.grid:nth-child(36){
    border-left: none;
  }
  .grid:nth-child(36),.grid:nth-child(37),.grid:nth-child(38),.grid:nth-child(39),.grid:nth-child(40),.grid:nth-child(41),.grid:nth-child(42){
    border-bottom: none;
  }
  .dayDate{
    padding: 5px 0;
    padding-left: 5px;
    text-align: left;
  }
  .dayDate .task {
    width: 25px;
    height: 25px;
    border-radius: 100px;
    border:1px solid #ccc;
    color:#fff;
    float:right;
    margin-right: 15px;
    text-align: center;
    line-height: 25px;
    background: #e84141;
  }
  .dayDate .task1 {
    width: 25px;
    height: 25px;
    float:right;
    margin-right: 15px;
  }
  .dayDate .task1 img {
    width:20px;
    height: 30px;
  }
  .dayDate.light{
    color: #fff;
    background-color: #3a8ee6;
  }
  .taskItem{
    _width: 213px;
    height: 22px;
    overflow: hidden;
    white-space:nowrap;
    text-overflow:ellipsis;
    font-size: 12px;
    padding: 3px;
    padding-left: 5px;
    margin-top: 2px;
    cursor: pointer;
    box-sizing: border-box;
    background-color: #e3f3ff;
    position: relative;
  }
  .taskItem.light{
    /*3a8ee6  8ccdfc*/
    color: #fff;
    background-color: #47b2ff;
    _background-color: #3a8ee6;
    /*background-color: #c1e2fa;*/
  }
  .taskItemMore{
    color: #005999;
    padding: 2px 0;
    padding-left: 5px;
    font-size: 12px;
    margin-top: 2px;
    background-color: #fff;
  }
  .taskItemMore span:hover{
    cursor: pointer;
  }
  .taskItemMore.light{
    background-color: #c1e2fa;
  }
  .taskItemMoreList{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    width: 250px;
    _width: 120%;
    min-height: 180px;
    background-color: #fff;
    box-shadow: 0 5px 10px 0 rgba(0,0,0,.1);
  }
  .close{
    position: absolute;
    top: 8px;
    right: 10px;
  }
  .taskItemMoreDate{
    text-align: center;
    padding: 5px 0;
    font-size: 14px;
    border-bottom: 1px solid #eee;
  }
  .MoreTitleBox{
    padding: 5px 10px;
    height: 125px;
    overflow: hidden;
    overflow-y: visible;
    box-sizing: border-box;
  }
  .taskItemMoreTitle{
    height: 21px;
    font-size: 12px;
    margin-top: 2px;
    padding: 2px 5px;
    cursor: pointer;
    box-sizing: border-box;
    background-color: rgba(42, 198, 198, 0.15);
  }
  .taskItemMoreTitle:hover{
    background-color: rgba(42, 198, 198, 0.35);
  }
  /** 分页器 */
  .morePagination{
    border-top: 1px solid #eee;
  }
  /** 详情弹窗 */
  .ScheduleDetail{
    width: 400px;
    min-height: 200px;
    padding-top: 0px;
    background-color: #fff;
    border-radius: 6px;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,.2);
    position: absolute;
    top: 0px;
    right: 0px;
    z-index: 200;
  }
  .detailFormArrow{
    width: 10px;
    height: 10px;
    /*background-color: inherit;*/
    background-color: #fff;
    position: absolute;
    top: 22px;
    left: -5px;
    transform: rotate(45deg);
  }
  .DetailCnt{
    padding: 0 10px;
  }
  .detailTit{
    text-align: center;
    padding: 10px 0;
    _border-bottom: 1px solid #eee;
  }
  /** 抽屉样式 s */
  .slidTop{
    height: 40px;
    line-height: 40px;
    font-size: 15px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #f1f1f1;
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
  .cannetProject21{
    width: 100%;
    display: flex;
    justify-content: space-between;
    line-height: 24px;
    font-size: 14px;
    /*font-family: '黑体';*/
    padding:0 10px;
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
  .timeLine{
    padding: 20px;
  }
  .time{
    font-size: 14px;
    font-weight: bold;
  }
  .content_chouti{
    padding-left: 5px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
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
  .el-textarea{
    margin-top: 20px;
    margin-left: 10px;
  }
  .el-textarea__inner{
    width: 100%;
    min-height: 80px;
  }
  .showImg>img{
    width: 100%;
  }
  .noComment{
    height: 100px;
    width: 100%;
    text-align: center;
    line-height: 100px;
    color: #999;
  }
  /** 抽屉样式 e */
</style>
