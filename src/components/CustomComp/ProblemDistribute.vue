<template>
  <!--任务派发 任务分解 创建动态 折叠表单-->
  <div class="ProblemDistribute">
    <div style="position: relative;width: 100%;">
      <div v-loading="loading32">
        <div class="paiTaskIptBox" style="position: relative;">
          <div class="selectUserDialog2" style="right: 0;top: 0;" v-if="selectUserDiaShow2">
            <div class="selectUserIpt">
              <el-select v-model="taskForm2.value9" multiple filterable remote style="width: 100%;"
                         :reserve-keyword="false" placeholder="请输人员姓名或拼音(如'张三'或 'zs')"
                         :remote-method="remoteMethod2" :loading="loading22">
                <el-option v-for="item in options42" :key="item.ID" :label="item.Name + ' (' + item.jName + ')'"
                           :value="item.Name + '-' + item.ID">
                </el-option>
              </el-select>
            </div>
            <div style="color: #dd6161;font-size: 12px; transform: scale(0.9)" v-if="taskForm2.value9.length===0">* 如果此项不选，则默认自己</div>
            <div class="selectUserBtn" v-on:click="selectUserClick2()"><el-button>确定</el-button></div>
          </div>
          <div class="selectDateDialog2"  style="right: 0;top: 0;z-index: 999;" v-if="selectDateDiaShow2">
            <div class="selectDateBox">
              <div class="selectDateItem">
                <el-date-picker
                  v-model="selDateStart2"
                  type="datetime"
                  :picker-options="pickerOptions3"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择开始时间">
                </el-date-picker>
              </div>
              <div class="selectDateItem">
                <el-date-picker
                  v-model="selDateEnd2"
                  type="datetime"
                  :picker-options="pickerOptions3"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择结束时间">
                </el-date-picker>
              </div>
            </div>
            <div class="selectUserBtn">
              <el-button v-on:click="selectDateCancel2()">取消</el-button>
              <el-button v-on:click="selectDateOk2()">确定</el-button>
            </div>
          </div>
          <div class="depTaskLevel2" v-bind:style="{ height: taskLevelHeight2 + 'px', top: taskLevelTop2 + 'px', left: taskLevelLeft2 + 'px'}" v-on:mouseleave="rateMouseLeave2()">
            <div class="rateBox">
              <el-rate v-model="levelValue2"></el-rate>
            </div>
          </div>
          <div class="paiTaskIptLeft">
            <div class="paiTaskIptIcon"><i class="el-icon-edit-outline"></i></div>
            <div class="paiTaskIptWrap"><input v-on:focus="inputFocus2()" v-model="taskNameText2" v-on:blur="iptBlur2()" type="text" placeholder="请输入新建问题名称" /></div>
          </div>
          <div class="paiTaskIptRight">
            <div class="paiTaskIptRightIcon" v-on:click="selectUser2($event)"><i class="el-icon-edit-outline"></i></div>
            <div class="paiTaskIptRightCnt" v-on:click="selectUser2($event)">
              <span v-if="taskForm2.value9.length > 0" v-for="user in taskForm2.value9" :key="user"> {{user.split('-')[0]}}</span>
              <span v-if="taskForm2.value9.length === 0">{{getUserName}}</span>
            </div>
            <div class="paiTaskIptRightIcon" v-on:click="selectDate2($event)"><i class="el-icon-date"></i></div>
            <div class="paiTaskIptRightCnt" v-on:click="selectDate2($event)">时间</div>
            <div class="paiTaskIptRightIcon" v-on:click="selectLevel2($event)"><i class="el-icon-bell"></i></div>
          </div>
        </div>
        <div class="taskRelation" v-if="taskRelationShow2">
          <div class="relationIntro">
            <textarea class="relationIntroArea" v-model="taskIntro2" placeholder="请输入问题简介"></textarea>
          </div>
        </div>
        <div class="taskFileUpload">
          <div class="fileUploadCao">
            <div class="selectLeft">
              <!-- 任务分解 -->
              <component v-bind:is="compArr.FileUploadComp" fileFormId="TaskDistribute2" v-bind:clearInfo="IsClear" v-on:FileDataEmit="GetFileInfo"></component>
            </div>
            <div class="selectRight2">
              <div class="selectMoreInfo" v-on:click="moreClick2()">
                <i v-bind:class="moreIcon2"></i><span style="margin-left: 6px;">{{moreText2}}</span>
              </div>
              <div class="submitBtn" v-on:click="depSub2()"><i-button type="info">分解</i-button></div>
              <div class="submitBtn" v-on:click="cancelDevide()"><i-button :disabled="cancelBtn">取消</i-button></div>
            </div>
          </div>
          <div class="fileUploadPre"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FileUploadComp from '../CustomComp/FileUploadComp.vue'
export default {
  name: 'ProblemDistribute',
  props: ['nodeId', 'TaskDistributeShow', 'cancelBtnShow'],
  components: {
    FileUploadComp
  },
  data () {
    return {
      // 取消按钮禁用
      cancelBtn: false,
      // 引入组件
      compArr: {
        FileUploadComp: 'FileUploadComp'
      },
      // 附件上传 组件 是否让子组件清空文件 新组件
      IsClear: false,
      // 附件上传 组件 接收到的组件数组 新组件
      FileUploadArr: [],
      // toShowDevided: false,
      loading32: false,
      selectUserDiaShow2: false,
      // 任务分解
      taskForm2: {
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
      loading22: false,
      moreUserSelectPayload2: {
        projectManager: ''
      },
      options42: [],
      selectDateDiaShow2: false,
      selDateStart2: '',
      pickerOptions3: {},
      selDateEnd2: '',
      levelValue2: 3,
      defImplementer: {
        name: this.$store.state.userName,
        id: this.$store.state.userId
      },
      taskRelationShow2: false,
      taskIntro2: '',
      moreText2: '更多',
      taskLevelHeight2: 0,
      taskLevelTop2: '',
      taskLevelLeft2: '',
      taskNameText2: '',
      moreIcon2: 'el-icon-arrow-down',
      tranManageArr2: ['taskLevelHeight2'],
      fileList2: [],
      // 任务开始
      CommunityTaskPayload2: {
        // projectUID: '1',
        parentId: '1',
        pStr: '',
        attachmentId: '',
        description: '',
        questionName: '',
        questionLevel: 3,
        queStartDate: '',
        queFinishDate: '',
        userId: '',
        _jfinal_token: '',
        userName: ''
      }
    }
  },
  watch: {
    TaskDistributeShow: function (val, old) {
      this.log('val:', val)
      this.log('old:', old)
      if (val) {
        this.log('55555555', this.nodeId)
        // this.toShowDevided = val
        this.getPlanTaskDetail()
      }
    },
    cancelBtnShow: function (val, oV) {
      console.log('btn:', val)
      if (val) {
        this.cancelBtn = true
      }
    }
  },
  computed: {
    getUserName: function () {
      var that = this
      that.defImplementer.name = this.$store.state.userName
      that.defImplementer.id = this.$store.state.userId
      return this.$store.state.userName
    }
  },
  methods: {
    getPlanTaskDetail () {
      var that = this
      that.ajax('/question/getDetailById', {id: that.nodeId}).then(res => {
        if (res.code === 200) {
          that.selDateStart2 = res.data.queStartDate
          that.selDateEnd2 = res.data.queFinishDate
          // that.defImplementer.name = res.data.userName
          // that.defImplementer.id = res.data.userId
          var st = res.data.queStartDate.split(' ')[0] + ' 00:00:00'
          var et = res.data.queFinishDate
          var sT = new Date(st)
          var eT = new Date(et)
          var disabledStarTime = sT.getTime()
          var disabledEndTime = eT.getTime()
          that.pickerOptions3.disabledDate = function (time) {
            return time.getTime() < disabledStarTime || time.getTime() > disabledEndTime
          }
        }
      })
    },
    // 附件上传 组件 拼接附件上传的id为字符串
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
    // 附件上传 组件 获取附件上传组件发来的附件信息
    // 附件上传 组件 获取附件上传组件发来的附件信息 新组件
    GetFileInfo (obj) {
      if (obj) {
        this.IsClear = false
      }
      this.FileUploadArr = obj
    },
    remoteMethod2 (query) {
      var that = this
      if (query !== '') {
        this.loading22 = true
        that.moreUserSelectPayload2.projectManager = query
        this.ajax('/myProject/autoCompleteNames', that.moreUserSelectPayload2).then(res => {
          that.log('autoCompleteNames:', res)
          if (res.code === 200) {
            that.options42 = res.data
            this.loading22 = false
          }
        })
      } else {
        this.options42 = []
      }
    },
    selectUserClick2: function () {
      this.selectUserDiaShow2 = false
      this.log(this.taskForm2.value9)
    },
    selectDateCancel2: function () {
      this.selectDateDiaShow2 = false
      // this.TaskDistributeShow = false
    },
    selectDateOk2: function () {
      var that = this
      var st = new Date(that.selDateStart2).getTime()
      var et = new Date(that.selDateEnd2).getTime()
      if (st > et) {
        that.$message.warning('时间区间选择不合理')
      } else {
        this.selectDateDiaShow2 = false
      }
    },
    rateMouseLeave2: function () {
      // this.alert(1)
      this.taskLevelHeight2 = 0
    },
    inputFocus2: function () {
      var that = this
      // this.taskRelationShow2 = true
      if (that.moreText2 === '更多') {
        that.moreText2 = '收起'
        this.moreIcon2 = 'el-icon-arrow-up'
        this.taskRelationShow2 = true
      } else {
        that.moreText2 = '更多'
        this.moreIcon2 = 'el-icon-arrow-down'
        this.taskRelationShow2 = false
      }
    },
    iptBlur2: function () {
      // this.taskRelationShow = false
    },
    selectUser2: function (e) {
      // 时间弹窗 与 人员选择弹窗 不共存  selectUserDiaShow selectDateDiaShow
      // this.selectDateDiaShow = false
      var obj = e.currentTarget
      this.selectUserDiaShow2 = true
      this.selectUserLeft2 = $(obj).offset().left
      this.selectUserTop2 = $(obj).offset().top
      // 所有的伸缩窗 隐藏
      this.transitionManage2('', true)
    },
    selectDate2: function (e) {
      // 所有的伸缩窗 隐藏
      this.getPlanTaskDetail()
      this.transitionManage2('', true)
      if (e) {
        var obj = e.currentTarget
        this.selectDateDiaShow2 = true
        this.selectDateLeft2 = $(obj).offset().left - 420
        this.selectDateTop2 = $(obj).offset().top - 102
      }
      // this.log(123)
    },
    selectLevel2: function (e) {
      var obj = e.currentTarget
      this.taskLevelLeft2 = $(obj).offset().left - 165
      this.taskLevelTop2 = $(obj).offset().top + 32
      this.taskLevelHeight2 = 46
      // 其它悬浮窗为隐藏状态
      // this.dialogManage2('', true)
    },
    moreClick2: function () {
      var that = this
      if (that.moreText2 === '更多') {
        that.moreText2 = '收起'
        this.moreIcon2 = 'el-icon-arrow-up'
        this.taskRelationShow2 = true
      } else {
        that.moreText2 = '更多'
        this.moreIcon2 = 'el-icon-arrow-down'
        this.taskRelationShow2 = false
      }
    },
    depSub2: function () {
      var that = this
      that.loading32 = true
      var fileStr = ''
      for (var j = 0; j < this.fileList2.length; j++) {
        if (j === that.fileList2.length - 1) {
          fileStr = fileStr + that.fileList2[j].attachmentId
        } else {
          fileStr = fileStr + that.fileList2[j].attachmentId + ','
        }
      }
      // 如果有任务名
      if (that.taskNameText2) {
        // value9有值
        var selectUserStr = ''
        if (that.taskForm2.value9.length > 0) {
          for (var i = 0; i < that.taskForm2.value9.length; i++) {
            if (i === 0) {
              selectUserStr = that.taskForm2.value9[0]
            } else {
              selectUserStr = selectUserStr + '_' + that.taskForm2.value9[i]
            }
          }
        } else {
          // value9没有值，取默认
          selectUserStr = that.defImplementer.name + '-' + that.defImplementer.id
        }
        // that.CommunityTaskPayload2.projectUID = that.$store.state.proId
        that.CommunityTaskPayload2.parentId = that.nodeId
        that.CommunityTaskPayload2.attachmentId = that.SetFileIdStr()
        that.CommunityTaskPayload2.pStr = selectUserStr
        that.CommunityTaskPayload2.questionName = that.taskNameText2
        that.CommunityTaskPayload2.queStartDate = that.selDateStart2
        that.CommunityTaskPayload2.queFinishDate = that.selDateEnd2
        that.CommunityTaskPayload2.questionLevel = that.levelValue2
        that.CommunityTaskPayload2.description = that.taskIntro2
        that.CommunityTaskPayload2._jfinal_token = that.token
        that.log('attachmentId:', that.CommunityTaskPayload2.attachmentId)
        that.ajax('/question/addQuestion', that.CommunityTaskPayload2).then(res => {
          that.$emit('TaskDistributeCallback', res, that.nodeId)
          if (res.code === 200) {
            that.isRecall2 = that.isRecall2 + 1
            that.IsClear = true
            that.$message({
              message: '任务创建成功',
              type: 'success'
            })
            // that.toDetail()
            // that.selectProjectId()
            // that.getHistoryList()
            // 清空发动态的表单
            that.clearDynamicsForm2()
          } else {
            that.$message({
              message: res.msg,
              type: 'warning'
            })
          }
          that.loading32 = false
        })
      } else {
        that.$message({
          message: '请填写动态任务名',
          type: 'warning'
        })
        that.loading32 = false
      }
    },
    cancelDevide: function () {
      var that = this
      that.taskRelationShow2 = false
      // that.toShowDevided = false
      that.$emit('DistributeFormVisible', false)
      that.clearDynamicsForm2()
    },
    clearDynamicsForm2: function () {
      this.taskNameText2 = ''
      this.fileList2 = []
      this.CommunityTaskPayload2.questionName = ''
      this.CommunityTaskPayload2.queStartDate = ''
      this.CommunityTaskPayload2.queFinishDate = ''
      this.taskIntro2 = ''
      this.CommunityTaskPayload2.description = ''
      this.attachmentId2 = ''
      this.CommunityTaskPayload2.formId = ''
      this.taskForm2.value9 = []
      this.levelValue2 = 3
      $('#myfileDel').val('')
      this.moreClick2()
    },
    transitionManage2: function (target, allTranHide) {
      var that = this
      if (!allTranHide) {
        if (that[target]) {
          for (var i = 0; i < that.tranManageArr2.length; i++) {
            if (that.tranManageArr2[i] !== target) {
              that[that.tranManageArr2[i]] = 0
            }
          }
        }
      } else if (allTranHide) {
        // allDiaHide为true (即:所有悬浮窗隐藏)
        for (var t = 0; t < that.tranManageArr2.length; t++) {
          that[that.tranManageArr2[t]] = 0
        }
      }
    }
    // 伸缩框管理函数
  }
}
</script>

<style scoped>
  /*任务分解*/
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
    color: #409EFF;
    font-size: 18px;
    margin-right: 6px;
    line-height: 28px;
  }
  .paiTaskIptWrap{
    width: 100%;
    line-height: 28px;
    font-size: 14px;
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
  .depTaskLevel2{
    width: 200px;
    height: 0px;
    text-align: center;
    position: fixed;
    overflow: hidden;
    margin-top: -1px;
    background-color: #fff;
    transition: height 0.3s;
    z-index:2;
  }
  .rateBox{
    padding: 12px;
    border: 1px solid #a9b8bf;
  }
  .fileUploadCao{
    display: flex;
    justify-content: space-between;
    padding: 10px;
  }
  .selectLeft{
    _line-height: 30px;
  }
  .selectRight{
    width: 163px;
    display: flex;
  }
  .selectRight2{
    width: 210px;
    display: flex;
    justify-content: flex-end;
  }
  .selectMoreInfo{
    line-height: 30px;
  }
  .submitBtn{
    margin-left: 15px;
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
  .selectDateDialog2{
    _width: 300px;
    padding: 0px 20px 20px 20px;
    background-color: #fff;
    position: absolute;
    border-radius: 6px;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,.2);
  }
  .selectUserDialog2{
    width: 300px;
    padding: 20px 10px;
    background-color: #fff;
    position: absolute;
    border-radius: 6px;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,.2);
    z-index:2
  }
  .selectUserBtn{
    text-align: center;
    margin-top: 20px;
  }
  .selectDateItem{
    margin-top: 20px;
  }
</style>
