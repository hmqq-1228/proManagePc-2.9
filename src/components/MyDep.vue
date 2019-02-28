<template>
  <div class="MyDep">
    <el-main>
      <div class="el-main-box">
        <div class="el-main-left">
          <div class="contentTop">
            <div class="paiTaskTitTab">
              <div class="paiTask pai active" v-on:click="testValue9()">派任务</div>
              <!--<div class="paiTask share">发分享(@Ta)</div>-->
            </div>
            <div class="paiTaskIptBox" v-loading="loading3">
              <div class="paiTaskIptLeft">
                <div class="paiTaskIptIcon"><i class="el-icon-edit-outline"></i></div>
                <div class="paiTaskIptWrap"><input v-on:focus="inputFocus()" v-model="taskNameText" v-on:blur="iptBlur()" type="text" placeholder="请输入您要安排的任务" /></div>
              </div>
              <div class="paiTaskIptRight">
                <div class="paiTaskIptRightIcon" v-on:click="selectUser($event)"><i class="el-icon-edit-outline"></i></div>
                <div class="paiTaskIptRightCnt" v-on:click="selectUser($event)">
                  <!--<span v-for="user in taskForm.value9" :key="user"> {{user?user.split('-')[0]:defImplementerName}}</span>-->
                  <span v-if="taskForm.value9.length > 0" v-for="user in taskForm.value9" :key="user"> {{user.split('-')[0]}}</span>
                  <span v-if="taskForm.value9.length === 0">{{defImplementer.name}}</span>
                  <!--<span> {{defImplementer.name}}</span>-->
                </div>
                <div class="paiTaskIptRightIcon" v-on:click="selectDate($event)"><i class="el-icon-date"></i></div>
                <div class="paiTaskIptRightCnt" v-on:click="selectDate($event)">时间</div>
                <div class="paiTaskIptRightIcon" v-on:click="selectLevel($event)"><i class="el-icon-bell"></i></div>
              </div>
            </div>
            <!--任务关联 项目组成员 简介-->
            <div class="taskRelation" v-if="taskRelationShow">
              <div class="relationHeader">
                <div class="proBelong">
                  <!--所属项目 <i class="el-icon-arrow-down"></i>-->
                  <el-select v-model="projectBelong" placeholder="请选择关联项目">
                    <el-option
                      v-for="item in options"
                      :key="item.projectUID"
                      :label="item.projectName"
                      :value="item.projectUID">
                    </el-option>
                  </el-select>
                </div>
                <!--<div class="taskExecutor">-->
                  <!--参与人 <i class="el-icon-date"></i>-->
                <!--</div>-->
              </div>
              <div class="relationIntro">
                <textarea class="relationIntroArea" v-model="taskIntro" placeholder="请输入任务简介"></textarea>
              </div>
            </div>
            <!--附件选择-->
            <div class="taskFileUpload">
              <div class="fileUploadCao">
                <div class="selectLeft">
                  <form id="uploadFile" enctype="multipart/form-data">
                    <input type="file" v-on:change="fileChange" id="myfile" name="myfile" placeholder="请选择文件"/><br><br>
                      <!--<el-button type="primary" @click="addMarkInfo()">提 交</el-button>-->
                  </form>
                </div>
                <div class="selectRight">
                  <div class="selectMoreInfo" v-on:click="moreClick()">
                    <i v-bind:class="moreIcon"></i><span style="margin-left: 6px;">{{moreText}}</span>
                  </div>
                  <div class="submitBtn" v-on:click="depSub()"><el-button type="primary">发布</el-button></div>
                </div>
              </div>
              <div class="fileUploadPre"></div>
            </div>
          </div>
          <!--上传的图片在此预览-->
          <div class="uploadFilePre"></div>
          <!--动态标签页面 tags-->
          <div class="tabsBox">
            <el-tabs v-model="currentTab" @tab-click="handleClick">
              <el-tab-pane v-bind:label="tab.tabName" v-bind:name="tab.tabComp" v-for="tab in tabs" v-bind:key="tab.tabComp"></el-tab-pane>
            </el-tabs>
            <component v-bind:is="currentTabComponent" v-bind:recall="isRecall"></component>
          </div>
        </div>
        <!--<div class="el-main-right">-->
          <!--<div style="font-size: 16px;">置顶公告</div>-->
          <!--<div class="gonggaoBox">-->
            <!--暂无置顶公告，企业超级管理员可在“所有动态”中对单条动态进行置顶操作-->
          <!--</div>-->
          <!--<div class="userOnline">-->
            <!--<div class="OnlineText">在线同事</div>-->
            <!--<div class="OnlineNum">在线24人，共781人</div>-->
          <!--</div>-->
          <!--<div class="userOnlineList">-->
            <!--<div class="userOnlineItem">赵</div>-->
            <!--<div class="userOnlineItem">钱</div>-->
            <!--<div class="userOnlineItem">孙</div>-->
            <!--<div class="userOnlineItem">李</div>-->
            <!--<div class="userOnlineItem">周</div>-->
            <!--<div class="userOnlineItem">吴</div>-->
            <!--<div class="userOnlineItem">郑</div>-->
            <!--<div class="userOnlineItem">王</div>-->
            <!--<div class="userOnlineItem">冯</div>-->
            <!--<div class="userOnlineItem">陈</div>-->
            <!--<div class="userOnlineItem">诸</div>-->
            <!--<div class="userOnlineItem">魏</div>-->
            <!--<div class="userOnlineItem">蒋</div>-->
            <!--<div class="userOnlineItem">沈</div>-->
            <!--<div class="userOnlineItem">韩</div>-->
            <!--<div class="userOnlineItem">杨</div>-->
            <!--<div class="userOnlineItem">朱</div>-->
            <!--<div class="userOnlineItem">...</div>-->
          <!--</div>-->
        <!--</div>-->
      </div>
    </el-main>
    <!--发动态 人员选择-->
    <div class="selectUserDialog" v-bind:style="{ top: selectUserTop + 'px', left: selectUserLeft + 'px' }" v-if="selectUserDiaShow">
      <div class="selectUserIpt">
        <el-select v-model="taskForm.value9" multiple filterable remote style="width: 100%;"
                   :reserve-keyword="false" placeholder="请输人员姓名或拼音(如'张三'或 'zs')"
                   :remote-method="remoteMethod" :loading="loading2">
          <el-option v-for="item in options4" :key="item.ID" :label="item.Name + ' (' + item.jName + ')'"
                     :value="item.Name + '-' + item.ID">
          </el-option>
        </el-select>
      </div>
      <div style="color: #dd6161;font-size: 12px; transform: scale(0.9)" v-if="taskForm.value9.length===0">* 如果此项不选，则默认自己</div>
      <div class="selectUserBtn" v-on:click="selectUserClick()"><el-button>确定</el-button></div>
    </div>
    <!--发动态 时间选择 -->
    <div class="selectDateDialog" v-bind:style="{ top: selectDateTop + 'px', left: selectDateLeft + 'px' }" v-if="selectDateDiaShow">
      <div class="selectDateBox">
        <div class="selectDateItem">
          <el-date-picker
            v-model="selDateStart"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择开始时间">
          </el-date-picker>
        </div>
        <!--<div style="margin-left: 10px; margin-right: 10px;">至</div>-->
        <div class="selectDateItem">
          <el-date-picker
            v-model="selDateEnd"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择结束时间">
          </el-date-picker>
        </div>
      </div>
      <div class="selectUserBtn">
        <el-button v-on:click="selectDateCancel()">取消</el-button>
        <el-button v-on:click="selectDateOk()">确定</el-button>
      </div>
    </div>
    <!---->
    <!--发动态 任务级别选择-->
    <div class="depTaskLevel" v-bind:style="{ height: taskLevelHeight + 'px', top: taskLevelTop + 'px', left: taskLevelLeft + 'px'}" v-on:mouseleave="rateMouseLeave()">
      <div class="rateBox">
        <el-rate v-model="levelValue"></el-rate>
      </div>
    </div>
    <!---->
  </div>
</template>

<script>
import DynamicsMy from './DynamicsMy.vue'
import DynamicsSubordinate from './DynamicsSubordinate.vue'
import DynamicsPublic from './DynamicsPublic.vue'
import DynamicsTags from './DynamicsTags.vue'
import DynamicsPro from './DynamicsPro.vue'
export default {
  name: 'MyDep',
  components: {
    DynamicsMy,
    DynamicsPublic,
    DynamicsSubordinate,
    DynamicsTags,
    DynamicsPro
  },
  data () {
    return {
      // 默认指派
      defImplementerName: '李四',
      defImplementer: {
        name: '张三',
        id: ''
      },
      // 任务级别
      levelValue: 3,
      // top
      taskLevelTop: '',
      // left
      taskLevelLeft: '',
      // 任务级别 div高度
      taskLevelHeight: 0,
      formData: '',
      // 附件id
      attachmentId: '',
      // 所属项目
      projectBelong: '',
      // 子级页面数据是否重调以刷新
      isRecall: 0,
      selDateStart: '',
      selDateEnd: '',
      activeName: 'second',
      testData: 'Test Data',
      loading2: false,
      loading3: false,
      loading: false,
      options4: [],
      options: [],
      selectUserDiaShow: false,
      taskRelationShow: false,
      selectDateDiaShow: false,
      // 悬浮窗管理 数组
      diaManageArr: ['selectUserDiaShow', 'selectDateDiaShow'],
      // 伸缩窗管理 数组
      tranManageArr: ['taskLevelHeight'],
      selectUserTop: '',
      selectUserLeft: '',
      selectDateTop: '',
      selectDateLeft: '',
      moreText: '更多',
      moreIcon: 'el-icon-arrow-down',
      currentTab: this.$store.state.DevelopmentTab,
      tabs: [
        {tabName: '任务动态', tabComp: 'DynamicsMy'},
        // {tabName: '下属动态', tabComp: 'DynamicsSubordinate'},
        // {tabName: '公开动态', tabComp: 'DynamicsPublic'},
        {tabName: '项目动态', tabComp: 'DynamicsPro'}
      ],
      taskIntro: '',
      taskNameText: '',
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
      moreUserSelectPayload: {
        projectManager: ''
      },
      CommunityTaskPayload: {
        projectUID: '',
        planId: '',
        taskId: '',
        jobName: '',
        description: '',
        startTime: '',
        endTime: '',
        jobLevel: '3',
        // 附件id
        attachmentId: '',
        pStr: ''
      }
    }
  },
  watch: {
    // 如果 `testData` 发生改变，这个函数就会运行
    testData: function (newQuestion, oldQuestion) {
    },
    currentTab: function (newQuestion, oldQuestion) {
      this.$store.state.DevelopmentTab = newQuestion
    },
    selDateStart: function (newQuestion, oldQuestion) {
      this.log('newQuestion:', newQuestion)
    },
    projectBelong: function (newQuestion, oldQuestion) {
      this.log('projectBelong:', newQuestion)
    },
    formData: function (newQuestion, oldQuestion) {
      this.log('新的newQuestion:', newQuestion)
    },
    levelValue: function (newQuestion, oldQuestion) {
      this.CommunityTaskPayload.jobLevel = newQuestion.toString()
    },
    // 监听人员选择 触发悬浮窗管理
    selectUserDiaShow: function (newQuestion, oldQuestion) {
      this.dialogManage('selectUserDiaShow')
    },
    // 监听日期选择 触发悬浮窗管理
    selectDateDiaShow: function (newQuestion, oldQuestion) {
      this.dialogManage('selectDateDiaShow')
    },
    // 监听任务级别伸缩窗
    taskLevelHeight: function (newQuestion, oldQuestion) {
      this.transitionManage('taskLevelHeight')
      // if () {}
    }
  },
  created () {
    this.getUserInfo()
    this.getProBelong()
    this.setDefaultTime()
  },
  computed: {
    currentTabComponent: function () {
      return this.currentTab
    }
  },
  methods: {
    testValue9: function () {
      this.log('taskFormvalue9:', this.taskForm.value9)
      this.log('defImplementer:', this.defImplementer)
    },
    // 悬浮窗管理函数
    dialogManage: function (target, allDiaHide) {
      var that = this
      // allDiaHide为false
      if (!allDiaHide) {
        if (that[target]) {
          for (var i = 0; i < that.diaManageArr.length; i++) {
            if (that.diaManageArr[i] !== target) {
              that[that.diaManageArr[i]] = false
            }
          }
        }
      } else if (allDiaHide) {
        // allDiaHide为true (即:所有悬浮窗隐藏)
        for (var t = 0; t < that.diaManageArr.length; t++) {
          that[that.diaManageArr[t]] = false
        }
      }
    },
    // 伸缩框管理函数
    transitionManage: function (target, allTranHide) {
      var that = this
      if (!allTranHide) {
        if (that[target]) {
          for (var i = 0; i < that.tranManageArr.length; i++) {
            if (that.tranManageArr[i] !== target) {
              that[that.tranManageArr[i]] = 0
            }
          }
        }
      } else if (allTranHide) {
        // allDiaHide为true (即:所有悬浮窗隐藏)
        for (var t = 0; t < that.tranManageArr.length; t++) {
          that[that.tranManageArr[t]] = 0
        }
      }
    },
    getUserInfo: function () {
      var that = this
      this.ajax('/general/getUserInfo', {}).then(res => {
        if (res.code === 200) {
          that.log('getUserInfo', res)
          // var defaultUser = res.data.Name + '(' + res.data.jName + ')'
          // var defaultUser1 = res.data.Name + '-' + res.data.ID
          // this.taskForm.value8.push(defaultUser)
          that.defImplementer.name = res.data.Name
          that.defImplementer.id = res.data.ID
          // this.taskForm.value9.push(defaultUser1)
        }
      })
    },
    // 设置任务级别
    selectLevel: function (e) {
      var obj = e.currentTarget
      this.taskLevelLeft = $(obj).offset().left - 165
      this.taskLevelTop = $(obj).offset().top + 32
      this.taskLevelHeight = 46
      // 其它悬浮窗为隐藏状态
      this.dialogManage('', true)
    },
    // 鼠标离开 任务级别 div关闭
    rateMouseLeave: function () {
      // this.alert(1)
      this.taskLevelHeight = 0
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
    // 获取所属项目
    getProBelong: function () {
      var that = this
      that.ajax('/community/getAllProject', {}).then(res => {
        if (res.code === 200) {
          this.log('getAllProject:', res)
          this.projectBelong = res.data[0].projectUID
          this.options = res.data
        }
      })
    },
    // 更多
    moreClick: function () {
      var that = this
      if (that.moreText === '更多') {
        that.moreText = '收起'
        this.moreIcon = 'el-icon-arrow-up'
        this.taskRelationShow = true
      } else {
        that.moreText = '更多'
        this.moreIcon = 'el-icon-arrow-down'
        this.taskRelationShow = false
      }
    },
    // 测试异步请求走状态
    testAjaxVuex: function () {
      // that.$store.commit('callService', that.testAjaxVuexData)
    },
    // 跳转至nTest
    routerTest: function () {
      // this.$router.push('/Test')
    },
    // 选择任务负责人
    selectUser: function (e) {
      // 时间弹窗 与 人员选择弹窗 不共存  selectUserDiaShow selectDateDiaShow
      // this.selectDateDiaShow = false
      var obj = e.currentTarget
      this.selectUserDiaShow = true
      this.selectUserLeft = $(obj).offset().left - 400
      this.selectUserTop = $(obj).offset().top - 100
      // 所有的伸缩窗 隐藏
      this.transitionManage('', true)
    },
    // 设置默认时间
    setDefaultTime: function () {
      // 获取当前时间
      var startTime = this.getNowFormartTime()
      var date = new Date(startTime)
      var nextDayStamp = date.getTime() + (24 * 60 * 60 * 1000)
      var nextDateObj = new Date(nextDayStamp)
      var nextDayYear = nextDateObj.getFullYear()
      var nextDayMonth = nextDateObj.getMonth() + 1
      var nextDayDate = nextDateObj.getDate()
      var nextDayHours = nextDateObj.getHours()
      var nextDayMinutes = nextDateObj.getMinutes()
      // this.log(456)
      if (nextDayMonth < 10) {
        nextDayMonth = '0' + nextDayMonth
      }
      if (nextDayDate < 10) {
        nextDayDate = '0' + nextDayDate
      }
      if (nextDayHours < 10) {
        nextDayHours = '0' + nextDayHours
      }
      if (nextDayMinutes < 10) {
        nextDayMinutes = '0' + nextDayMinutes
      }
      var endTime = nextDayYear + '-' + nextDayMonth + '-' + nextDayDate + ' ' + nextDayHours + ':' + nextDayMinutes + ':00'
      this.selDateStart = startTime
      this.selDateEnd = endTime
    },
    // 选择时间
    selectDate: function (e) {
      // 所有的伸缩窗 隐藏
      this.transitionManage('', true)
      if (e) {
        var obj = e.currentTarget
        this.selectDateDiaShow = true
        this.selectDateLeft = $(obj).offset().left - 420
        this.selectDateTop = $(obj).offset().top - 102
      }
      // this.log(123)
    },
    // 选择时间取消
    selectDateCancel: function () {
      this.selectDateDiaShow = false
    },
    // 选择时间确定
    selectDateOk: function () {
      this.selectDateDiaShow = false
    },
    inputFocus: function () {
      var that = this
      // this.taskRelationShow = true
      if (that.moreText === '更多') {
        that.moreText = '收起'
        this.moreIcon = 'el-icon-arrow-up'
        this.taskRelationShow = true
      } else {
        that.moreText = '更多'
        this.moreIcon = 'el-icon-arrow-down'
        this.taskRelationShow = false
      }
    },
    iptBlur: function () {
      // this.taskRelationShow = false
    },
    handleClick (tab, event) {
      console.log(tab, event)
    },
    // 创建任务 提交
    depSub: function () {
      var that = this
      that.loading3 = true
      // 如果有任务名
      if (that.taskNameText) {
        // value9有值
        var selectUserStr = ''
        if (that.taskForm.value9.length > 0) {
          for (var i = 0; i < that.taskForm.value9.length; i++) {
            if (i === 0) {
              selectUserStr = that.taskForm.value9[0]
            } else {
              selectUserStr = selectUserStr + '_' + that.taskForm.value9[i]
            }
          }
        } else {
          // value9没有值，取默认
          selectUserStr = that.defImplementer.name + '-' + that.defImplementer.id
        }
        that.CommunityTaskPayload.attachmentId = that.attachmentId
        that.CommunityTaskPayload.pStr = selectUserStr
        that.CommunityTaskPayload.jobName = that.taskNameText
        that.CommunityTaskPayload.startTime = that.selDateStart
        that.CommunityTaskPayload.endTime = that.selDateEnd
        that.CommunityTaskPayload.projectUID = that.projectBelong
        that.CommunityTaskPayload.description = that.taskIntro
        that.ajax('/community/addCommunityTask', that.CommunityTaskPayload).then(res => {
          if (res.code === 200) {
            that.isRecall = that.isRecall + 1
            that.$message({
              message: '任务创建成功',
              type: 'success'
            })
            // 清空发动态的表单
            that.clearDynamicsForm()
          } else {
            that.$message({
              message: res.msg,
              type: 'warning'
            })
          }
          that.loading3 = false
        })
      } else {
        that.$message({
          message: '请填写动态任务名',
          type: 'warning'
        })
        that.loading3 = false
      }
      // if (that.taskForm.value9.length > 0 && that.taskNameText) {
      //   var selectUserStr = ''
      //   for (var i = 0; i < that.taskForm.value9.length; i++) {
      //     if (i === 0) {
      //       selectUserStr = that.taskForm.value9[0]
      //     } else {
      //       selectUserStr = selectUserStr + '_' + that.taskForm.value9[i]
      //     }
      //   }
      //   // selDateStart projectBelong
      // } else {
      //   that.$message({
      //     message: '有必填项未填写',
      //     type: 'warning'
      //   })
      //   that.loading3 = false
      // }
    },
    // 派任务（发动态）清空表单
    clearDynamicsForm: function () {
      this.taskNameText = ''
      this.CommunityTaskPayload.jobName = ''
      this.selDateStart = ''
      this.CommunityTaskPayload.startTime = ''
      this.selDateEnd = ''
      this.CommunityTaskPayload.endTime = ''
      this.taskIntro = ''
      this.CommunityTaskPayload.description = ''
      this.attachmentId = ''
      this.CommunityTaskPayload.attachmentId = ''
      this.taskForm.value9 = []
      this.levelValue = 3
      $('#myfile').val('')
      this.getProBelong()
      this.moreClick()
    },
    remoteMethod (query) {
      var that = this
      this.log('query:', query)
      if (query !== '') {
        this.loading2 = true
        that.moreUserSelectPayload.projectManager = query
        this.ajax('/general/autoCompleteNames', that.moreUserSelectPayload).then(res => {
          that.log('autoCompleteNames:', res)
          if (res.code === 200) {
            that.options4 = res.msg
            this.loading2 = false
          }
        })
      } else {
        this.options4 = []
      }
    },
    // 点击确定
    selectUserClick: function () {
      this.selectUserDiaShow = false
      this.log(this.taskForm.value9)
    },
    // 监听文件选择
    fileChange: function (file) {
      var that = this
      var obj = file.currentTarget
      var isfile = $(obj).val()
      if (isfile) {
        that.addMarkInfo()
      }
      this.log('change了', file)
    },
    // 文件上传
    addMarkInfo () {
      var that = this
      var url = that.$store.state.baseServiceUrl
      var formData = new FormData($('#uploadFile')[0])
      that.formData = formData
      if (formData) {
        $.ajax({
          type: 'post',
          url: url + '/file/uploadFileAjax',
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
            that.attachmentId = data.data.attachmentId
            that.log('attachmentId:', data.data.attachmentId)
            that.$message({
              type: 'success',
              message: '文件' + data.msg
            })
          } else if (data.code === 300) {
            that.$message({
              type: 'error',
              message: data.msg
            })
          } else {
            that.$message({
              type: 'error',
              message: data.msg
            })
          }
        })
      } else {
        // that.loading = false
        that.$message({
          type: 'error',
          message: '评论内容不能为空'
        })
      }
    }
  }
}
</script>

<style scoped>
  div img{
    width: 100%;
    display: block;
  }
  .MyDep{
    position: relative;
  }
  .header{
    height: auto !important;
    padding: 10px;
    box-shadow: 0px -10px 30px #000;
    z-index: 10;
  }
  .headerCntBox{
    display: flex;
    justify-content: space-between;
  }
  .headerCntLeft{
    display: flex;
  }
  .logoBox{
    width: 150px;
  }
  .groupName{
    line-height: 30px;
  }
  .aside{
    width: 200px !important;
    height: 800px;
    color: #fff;
    background-color: #005999;
  }
  .el-main-box{
    display: flex;
  }
  .el-main-left{
    flex-grow: 1;
  }
  .el-main-right{
    width: 262px;
    box-sizing: border-box;
    padding: 20px;
    padding-left: 40px;
    padding-right: 10px;
  }
  .paiTaskTitTab{
    display: flex;
  }
  .paiTask{
    font-size: 16px;
    margin-right: 15px;
  }
  .paiTask.active{
    font-weight: bold;
  }
  .paiTaskIptBox{
    display: flex;
    margin-top: 10px;
    justify-content: space-between;
    padding: 10px 5px;
    border: 1px solid #a9b8bf;
    padding-left: 8px;
  }
  .paiTaskIptLeft{
    width: 250px;
    display: flex;
    flex-grow: 1;
  }
  .paiTaskIptIcon{
    width: 20px;
    font-size: 18px;
    margin-right: 6px;
  }
  .paiTaskIptWrap{
    width: 100%;
    line-height: 27px;
  }
  .paiTaskIptWrap input{
    width: 100%;
    outline: none;
    border: none;
  }
  .paiTaskIptRight{
    _width: 165px;
    display: flex;
  }
  .paiTaskIptRightIcon{
    border-left: 1px dashed #ccc;
    margin-right: 5px;
    font-size: 18px;
    padding-left: 5px;
    color: #1687d9;
  }
  .paiTaskIptRightCnt{
    cursor: pointer;
    margin-right: 10px;
    line-height: 25px;
  }
  .taskRelation{
    border: 1px solid #a9b8bf;
    border-top: none;
  }
  .relationHeader{
    display: flex;
    padding: 10px;
    border-bottom: 1px solid #a9b8bf;
  }
  .relationIntroArea{
    width: 100%;
    height: 100px;
    border: none;
    padding: 10px;
    box-sizing: border-box;
    resize: none;
    display: block;
  }
  .taskFileUpload{
    position: relative;
  }
  .depTaskLevel{
    width: 200px;
    height: 0px;
    text-align: center;
    position: fixed;
    top: 0;
    left: 0;
    overflow: hidden;
    z-index: 300;
    margin-top: -1px;
    background-color: #fff;
    transition: height 0.3s;
  }
  .rateBox{
    padding: 12px;
    border: 1px solid #a9b8bf;
  }
  .fileUploadCao{
    display: flex;
    justify-content: space-between;
    background-color: #f5f8fa;
    padding: 10px;
  }
  .selectLeft{
    _line-height: 30px;
  }
  .selectRight{
    width: 163px;
    display: flex;
  }
  .selectMoreInfo{
    line-height: 30px;
  }
  .submitBtn{
    margin-left: 15px;
  }
  .submitBtn div{
    width: 50px;
    padding: 6px;
    color: #fff;
    border-radius: 4px;
    text-align: center;
    color: #adb8c0;
    background-color: #e7eef3;
  }

  /*置顶公告*/
  .gonggaoBox{
    margin-top: 25px;
    font-size: 12px;
    padding: 20px;
    color: #ccc;
    border: 1px dashed #ddd;
  }
  .userOnline{
    display: flex;
    justify-content: space-between;
    margin-top: 40px;
  }
  .OnlineText{
    font-size: 14px;
  }
  .OnlineNum{
    color: #ddd;
    font-size: 12px;
  }
  .userOnlineList{
    margin-top: 20px;
    display: flex;
    flex-wrap:wrap;
  }
  .userOnlineItem{
    width: 30px;
    height: 30px;
    margin: 2px;
    background-color: #42b983;
    border-radius: 15px;
    overflow: hidden;
    text-align: center;
    line-height: 30px;
    color: #fff;
    font-size: 12px;
  }
  /**/
  .selectUserDialog{
    width: 300px;
    padding: 0px 0px 20px 0px;
    background-color: #fff;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 200;
    border-radius: 6px;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,.2);
  }
  .selectUserIpt{
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
    background-color: #f5f8fa;
  }
  .selectUserBtn{
    text-align: center;
    margin-top: 20px;
  }
  /**/
  .selectDateDialog{
    _width: 300px;
    padding: 20px 20px 20px 20px;
    background-color: #fff;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 200;
    border-radius: 6px;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,.2);
  }
  .selectDateBox{
    _display: flex;
  }
  .selectDateItem{
    margin-top: 20px;
  }
</style>
