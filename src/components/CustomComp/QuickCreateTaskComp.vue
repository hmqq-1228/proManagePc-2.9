<template>
  <div class="QuickCreateTaskComp">
    <!---->
    <el-form :model="ruleForm" class="demo-ruleForm">
      <div class="paiTaskIptBox">
        <div class="paiTaskIptLeft">
          <div class="proBelong" style="padding-right: 10px;width: 310px;border-right: 1px dashed #ccc;display: flex">
            <span style="font-size: 14px;width: 80px;line-height: 38px;">任务类型：</span>
            <el-cascader
              placeholder="请选择任务类型"
              :options="taskType"
              change-on-select
              :props="props"
              :show-all-levels = "false"
              @change="changeType"
            ></el-cascader>
          </div>
          <div style="margin-left: 10px;width: 50%;display: flex;">
            <div class="paiTaskIptIcon"><i class="el-icon-edit-outline"></i></div>
            <div class="paiTaskIptWrap"><input v-on:focus="inputFocus()" v-model="taskNameText" type="text" placeholder="请输入新建任务名称" /></div>
          </div>
        </div>
        <div class="paiTaskIptRight">
          <div class="paiTaskIptRightIcon" style="cursor: pointer" v-on:click="selectUser($event)"><i class="el-icon-edit-outline"></i></div>
          <div class="paiTaskIptRightCnt" v-on:click="selectUser($event)">
            <!--<span v-for="user in taskForm.value9" :key="user"> {{user?user.split('-')[0]:defImplementerName}}</span>-->
            <span v-if="userSelectVal.length > 0" v-for="user in userSelectVal" :key="user"> {{user.split('-')[0]}}</span>
            <span v-if="userSelectVal.length === 0">{{defImplementer.name}}</span>
          </div>
          <div class="paiTaskIptRightIcon" style="cursor: pointer" :title="selDateStart + ' 到 ' + selDateEnd" v-on:click="selectDate($event)"><i class="el-icon-date"></i></div>
          <div class="paiTaskIptRightCnt" :title="selDateStart + ' 到 ' + selDateEnd" v-on:click="selectDate($event)">时间</div>
          <div class="paiTaskIptRightIcon" style="cursor: pointer" :title="'等级:' + levelValue" v-on:click="selectLevel($event)">
            <div style="width: 24px;height: 24px;padding-left: 4px;padding-top: 4px;"><div class="levelNum">{{levelValue}}</div></div>
          </div>
        </div>
      </div>
      <!---->
      <div class="taskRelation" v-if="taskRelationShow">
        <div class="relationHeader">
          <div class="proBelong" style="position: relative" @mouseover="mouseOver" @mouseleave="mouseleave">
            <!--所属项目 <i class="el-icon-arrow-down"></i>-->
            <!--<el-select v-model="projectBelong" placeholder="请选择关联项目">-->
              <!--<el-option-->
                <!--v-for="item in options"-->
                <!--:key="item.projectUID"-->
                <!--:label="item.projectName"-->
                <!--:value="item.projectUID">-->
              <!--</el-option>-->
            <!--</el-select>-->
            <el-input v-model="proName" placeholder="请选择关联项目" readonly="readonly" style="width: 150px;float: left"></el-input>
            <Icon type="ios-close-circle-outline" style="position: absolute;font-size: 16px;cursor: pointer;right: 50px;top:8px" v-if="close" @click="reduction"/>
            <!--<el-button type="primary" size="small" @click="selectPro" style="margin-left: 10px;">请选择项目</el-button>-->
            <div style="width: 40px;height: 28px;background:#2D8CF0;text-align: center;line-height: 28px;color:#fff;float: left;margin-top: 1px;border-top-right-radius: 3px;border-bottom-right-radius: 3px;cursor: pointer" @click="selectPro" title="选择项目"><Icon type="ios-search" style="font-size: 16px;"/></div>
            <span style="color:red;line-height: 32px" v-if="options.length===0">&nbsp;&nbsp;请新建一个项目</span>
            <span style="color:#ffb400;line-height: 32px;margin-left: 15px" v-if="val.length > 0 && remark">注释：{{remark}}</span>
          </div>
        </div>
        <div class="relationIntro">
          <textarea class="relationIntroArea" v-model="taskIntro" placeholder="请输入任务简介"></textarea>
        </div>
      </div>
      <!---->
      <div class="fileAndSubbtn">
        <div class="FileUploadCompBox">
          <component v-bind:is="compArr.FileUploadComp"
                     fileFormId="QuickCreateTask"
                     v-bind:clearInfo="IsClear"
                     v-on:FilePreEmit="GetFilePreData"
                     v-on:FileDataEmit="GetFileInfo">
          </component>
        </div>
        <div class="moreAndSubbtn">
          <div class="selectMoreInfo" v-on:click="moreClick()">
            <i v-bind:class="moreIcon"></i><span style="margin-left: 6px;">{{moreText}}</span>
          </div>
          <div class="submitBtn">
            <el-button type="primary" :disabled="options.length===0" v-on:click="depSub()">发布</el-button>
          </div>
        </div>
      </div>
    </el-form>
    <!--发动态 任务级别选择-->
    <div class="depTaskLevel" v-bind:style="{ height: taskLevelHeight + 'px', top: taskLevelTop + 'px', left: taskLevelLeft + 'px'}" v-on:mouseleave="rateMouseLeave()">
      <div class="rateBox">
        <el-rate v-model="levelValue"></el-rate>
      </div>
    </div>
    <!--发动态 人员选择-->
    <div class="selectUserDialog" v-bind:style="{ top: selectUserTop + 'px', left: selectUserLeft + 'px' }" v-if="selectUserDiaShow">
      <div class="selectUserIpt">
        <el-select v-model="userSelectVal" multiple filterable remote style="width: 100%;"
                   :reserve-keyword="false" placeholder="请输人员姓名或拼音(如'张三'或 'zs')"
                   :remote-method="remoteMethod" :loading="loading2">
          <el-option v-for="item in options4" :key="item.ID" :label="item.Name + ' (' + item.jName + ')'"
                     :value="item.Name + '-' + item.ID">
          </el-option>
        </el-select>
      </div>
      <div style="color: #dd6161;font-size: 12px; transform: scale(0.9)" v-if="userSelectVal.length===0"></div>
      <div class="selectUserBtn" v-on:click="selectUserClick()"><el-button>确定</el-button></div>
    </div>
    <!--发动态 时间选择 -->
    <div class="selectDateDialog" v-bind:style="{ top: selectDateTop + 'px', left: selectDateLeft + 'px' }" v-if="selectDateDiaShow">
      <div class="selectDateBox">
        <div class="selectDateItem">
          <el-date-picker
            v-model="selDateStart"
            type="datetime"
            :picker-options="pickerOptionsPlan"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择开始时间">
          </el-date-picker>
        </div>
        <!--<div style="margin-left: 10px; margin-right: 10px;">至</div>-->
        <div class="selectDateItem">
          <el-date-picker
            v-model="selDateEnd"
            type="datetime"
            :picker-options="pickerOptionsPlan"
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
    <!--选择项目-->
    <el-dialog title="项目列表" :visible.sync="selectProject">
      <component v-bind:is="compArr.Myproject" :tableData="tableData" @ok="ok" @cancel="cancel" @dbClick="ok">
      </component>
    </el-dialog>
  </div>
</template>

<script>
import FileUploadComp from '../CustomComp/FileUploadComp.vue'
import Myproject from '../CustomComp/Myproject.vue'
export default {
  name: 'QuickCreateTaskComp',
  components: {
    FileUploadComp,
    Myproject
  },
  data () {
    return {
      props: {
        children: 'children',
        label: 'name',
        value: 'code'
      },
      // 选择项目
      selectProject: false,
      // 我的项目
      tableData: [],
      isTrue: false,
      compArr: {
        FileUploadComp: 'FileUploadComp',
        Myproject: 'Myproject'
      },
      ruleForm: {},
      // 选择时间
      selectDateDiaShow: false,
      // 任务级别
      levelValue: 3,
      taskLevelHeight: 0,
      taskLevelTop: 0,
      taskLevelLeft: 0,
      selectDateTop: '',
      selectDateLeft: '',
      projectBelong: '',
      taskIntro: '',
      pickerOptionsPlan: {},
      moreText: '更多',
      moreIcon: 'el-icon-arrow-down',
      // 伸缩窗管理 数组
      tranManageArr: ['taskLevelHeight'],
      // 悬浮窗管理 数组
      diaManageArr: ['selectUserDiaShow', 'selectDateDiaShow'],
      selectUserDiaShow: false,
      selectUserTop: 0,
      selectUserLeft: 0,
      // 原 taskForm.value9
      userSelectVal: '',
      options4: [],
      options: [],
      selDateStart: '',
      selDateEnd: '',
      IsClear: false,
      FileUploadArr: [],
      taskNameText: '',
      loading2: false,
      taskRelationShow: false,
      defImplementerName: '李四',
      defImplementer: {
        name: '张三',
        id: ''
      },
      moreUserSelectPayload: {
        projectManager: ''
      },
      CommunityTaskPayload: {
        type: '',
        parentId: '',
        // projectUID: '',
        // planId: '',
        // taskId: '',
        jobName: '',
        description: '',
        taskStartDate: '',
        taskFinishDate: '',
        jobLevel: '3',
        // 附件id
        attachmentId: '',
        pStr: ''
      },
      pageNum: 1,
      projectType: '',
      projectName: '',
      proName: '',
      taskType: [],
      remark: '', // 备注
      val: [],
      userInfo: {},
      close: false
    }
  },
  created () {
    this.getUserInfo()
    this.getProBelong()
    this.getProjectList()
    this.getTaskType()
  },
  watch: {
    projectBelong: function (newQuestion, oldQuestion) {
      this.getProjectTime(newQuestion)
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
  methods: {
    reduction () {
      this.proName = ''
      this.projectBelong = ''
      this.queryMyTaskView()
    },
    mouseOver () {
      this.close = true
    },
    mouseleave () {
      this.close = false
    },
    getCascaderObj (val, opt) {
      return val.map(function (value, index, array) {
        for (var itm of opt) {
          if (itm.code === value) { opt = itm.children; return itm }
        }
        return null
      })
    },
    changeType (val) {
      // defImplementer.name
      this.val = val
      let item = this.getCascaderObj(val, this.taskType)
      if (item[item.length - 1].appointUserId) {
        this.defImplementer.name = item[item.length - 1].appointUserName
        this.defImplementer.id = item[item.length - 1].appointUserId
      } else {
        this.defImplementer.name = this.userInfo.Name
        this.defImplementer.id = this.userInfo.ID
      }
      this.remark = item[item.length - 1].remark
      this.CommunityTaskPayload.type = item[item.length - 1].code
      console.log(item)
    },
    getTaskType () {
      this.ajax('/myTask/getTaskTypeTree', {}).then(res => {
        if (res.code === 200) {
          this.taskType = res.data
          this.taskType.forEach((item, index) => {
            this.isDele(item)
          })
        }
      })
    },
    isDele (item) {
      if (item.children.length === 0) {
        delete item.children
      } else {
        item.children.forEach((item, index) => {
          this.isDele(item)
        })
      }
    },
    getProjectList: function () {
      var that = this
      that.ajax('/myProject/myProjectView', {
        pageNum: this.pageNum,
        pageSize: 10,
        projectType: this.projectType,
        projectName: this.projectName,
        sortType: 1
      }).then(res => {
        if (res.code === 200) {
          this.options = res.data.list
          if (res.data.list.length > 0) {
            this.proName = res.data.list[0].projectName
            this.projectBelong = res.data.list[0].projectUID
          }
        } else {
          that.$message.warning(res.msg)
        }
      })
    },
    ok (selectData) {
      this.proName = selectData.projectName
      this.projectBelong = selectData.projectUID
      this.selectProject = false
    },
    cancel () {
      this.selectProject = false
    },
    // 选择项目
    selectPro () {
      this.selectProject = true
    },
    // 附件 附件预览
    GetFilePreData (obj) {
      // this.log('GetFilePreData:', obj)
      this.$emit('FilePreEmit', obj)
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
    // 获取附件上传组件发来的附件信息
    GetFileInfo (obj) {
      if (obj) {
        this.IsClear = false
      }
      this.FileUploadArr = obj
      this.log('getFileInfo:', obj)
    },
    getUserInfo: function () {
      var that = this
      this.ajax('/myProject/getUserInfo', {}).then(res => {
        if (res.code === 200) {
          this.userInfo = res.data
          that.defImplementer.name = res.data.Name
          that.defImplementer.id = res.data.ID
        }
      })
    },
    // 选择时间
    selectDate: function (e) {
      // 所有的伸缩窗 隐藏
      this.transitionManage('', true)
      if (e) {
        var obj = e.currentTarget
        this.selectDateDiaShow = true
        this.selectDateLeft = $(obj).offset().left - 445
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
      this.selectDateDiaShow = false
    },
    // 获取所属项目
    getProBelong: function () {
      // that.ajax('/myProject/getAllProjectByUser', {}).then(res => {
      //   if (res.code === 200) {
      //     // this.log('getAllProject:', res)
      //     // this.projectBelong = res.data[0].projectUID
      //     // this.options = res.data
      //     // this.getProjectTime(this.projectBelong)
      //   }
      // })
    },
    getProjectTime: function (id) {
      var that = this
      that.ajax('/myProject/getProjectDetail', {projectUID: id}).then(res => {
        if (res.code === 200) {
          var st = res.data.startDate.split(' ')[0] + ' 00:00:00'
          var et = res.data.endDate
          var sT = new Date(st)
          var eT = new Date(et)
          that.disabledStarTime2 = sT.getTime()
          that.disabledEndTime2 = eT.getTime()
          that.pickerOptionsPlan.disabledDate = function (time) {
            return time.getTime() < that.disabledStarTime2 || time.getTime() > that.disabledEndTime2
          }
          that.selDateStart = res.data.startDate
          that.selDateEnd = res.data.endDate
          that.CommunityTaskPayload.parentId = res.data.firstPlanId
        } else {
          that.$message({
            message: res.msg
          })
        }
      })
    },
    // 点击确定
    selectUserClick: function () {
      this.selectUserDiaShow = false
    },
    // 选择任务负责人
    selectUser: function (e) {
      // 时间弹窗 与 人员选择弹窗 不共存  selectUserDiaShow selectDateDiaShow
      var obj = e.currentTarget
      this.selectUserDiaShow = true
      this.selectUserLeft = $(obj).offset().left - 400
      this.selectUserTop = $(obj).offset().top - 100
      // 所有的伸缩窗 隐藏
      this.transitionManage('', true)
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
    remoteMethod (query) {
      var that = this
      if (query !== '') {
        this.loading2 = true
        that.moreUserSelectPayload.projectManager = query
        this.ajax('/myProject/autoCompleteNames', that.moreUserSelectPayload).then(res => {
          if (res.code === 200) {
            that.options4 = res.data
            this.loading2 = false
          }
        })
      } else {
        this.options4 = []
      }
    },
    inputFocus: function () {
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
    // 鼠标离开 任务级别 div关闭
    rateMouseLeave: function () {
      this.taskLevelHeight = 0
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
    // 创建任务 提交
    depSub: function () {
      var that = this
      that.loading3 = true
      // 如果有任务名
      if (that.taskNameText) {
        // value9有值
        var selectUserStr = ''
        if (that.userSelectVal.length > 0) {
          for (var i = 0; i < that.userSelectVal.length; i++) {
            if (i === 0) {
              selectUserStr = that.userSelectVal[0]
            } else {
              selectUserStr = selectUserStr + '_' + that.userSelectVal[i]
            }
          }
        } else {
          // value9没有值，取默认
          selectUserStr = that.defImplementer.name + '-' + that.defImplementer.id
        }
        that.CommunityTaskPayload.attachmentId = that.SetFileIdStr()
        that.CommunityTaskPayload.pStr = selectUserStr
        that.CommunityTaskPayload.jobName = that.taskNameText
        that.CommunityTaskPayload.taskStartDate = that.selDateStart
        that.CommunityTaskPayload.taskFinishDate = that.selDateEnd
        that.CommunityTaskPayload.projectUID = that.projectBelong
        that.CommunityTaskPayload.description = that.taskIntro
        var st = new Date(that.selDateStart).getTime()
        var et = new Date(that.selDateEnd).getTime()
        if (st <= et) {
          that.ajax('/myTask/addTask', that.CommunityTaskPayload).then(res => {
            that.$emit('ActionResThrow', {res: res, actionName: 'addCommunityTask'})
            if (res.code === 200) {
              that.IsClear = true
              // that.isRecall = that.isRecall + 1
              that.$message({
                message: '任务创建成功',
                type: 'success'
              })
              // that.queryMyTaskView()
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
          that.$message.warning('时间选择不合理')
          that.loading3 = false
        }
      } else {
        that.$message({
          message: '请填写任务名',
          type: 'warning'
        })
        that.loading3 = false
      }
    },
    // 派任务（发动态）清空表单
    clearDynamicsForm: function () {
      this.taskNameText = ''
      this.CommunityTaskPayload.jobName = ''
      // this.selDateStart = this.startTimeFirst
      // this.CommunityTaskPayload.startTime = this.startTimeFirst
      // this.selDateEnd = this.endTimeFirst
      // this.CommunityTaskPayload.endTime = this.endTimeFirst
      this.taskIntro = ''
      this.CommunityTaskPayload.description = ''
      this.CommunityTaskPayload.attachmentId = ''
      this.userSelectVal = []
      this.levelValue = 3
      this.getProBelong()
      this.moreClick()
    }
  }
}
</script>

<style scoped>
  .paiTaskIptBox{
    display: flex;
    margin-top: 10px;
    justify-content: space-between;
    padding: 10px 5px;
    border: 1px solid #dcdfe6;
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
    margin-top: 7px;
  }
  .paiTaskIptWrap{
    width: 100%;
    line-height: 40px;
    /*margin-top: 10px;*/
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
    line-height: 40px;
  }
  .paiTaskIptRightCnt{
    cursor: pointer;
    margin-right: 10px;
    line-height: 40px;
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
  .selectMoreInfo{
    line-height: 30px;
    cursor: pointer;
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
  .fileAndSubbtn{
    display: flex;
    justify-content: space-between;
  }
  .moreAndSubbtn{
    display: flex;
    padding-top: 6px;
  }
  .FileUploadCompBox{
    width: 70%;
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
  .levelNum{
    margin-top: 4px;
    width: 20px;
    text-align: center;
    height: 20px;
    color: chocolate;
    line-height: 20px;
    border: 1px solid #ccc;
    border-radius: 12px;
    font-size: 12px;
    font-weight: bold;
  }
  /**/
</style>
