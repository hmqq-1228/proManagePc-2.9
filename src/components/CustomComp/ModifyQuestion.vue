<template>
  <div class="ModifyQuestion">
    <div class="planTaskBox">
      <el-form ref="modifyTask" :model="detailTaskform" :rules="modifyTaskRules" label-width="80px">
        <el-form-item label="问题名称" prop="jobName" maxlength="100" width="100">
          <el-input class="planNameIpt" v-model="detailTaskform.questionName"></el-input>
        </el-form-item>
        <el-form-item label="问题级别" prop="jobLevel" maxlength="100" width="100">
          <div class="ratestar" style="padding-top: 6px;">
            <el-rate v-model="detailTaskform.questionLevel" v-on:change="levelChange($event)"></el-rate>
          </div>
        </el-form-item>
        <el-form-item label="开始时间" prop="taskStartDate">
          <el-col :span="24">
            <el-date-picker style="width: 100%" type="datetime"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期"
                            v-model="detailTaskform.queStartDate"
                            :picker-options="pickerOptionsTaskSt"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="完成时间" prop="taskFinishDate">
          <el-col :span="24">
            <el-date-picker type="datetime" style="width: 100%"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期"
                            v-model="detailTaskform.queFinishDate"
                            :picker-options="pickerOptionsTaskEt"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="问题描述" maxlength="100" width="100">
          <el-input class="planNameIpt" type="textarea" style="resize:none;" :rows="2" v-model="detailTaskform.description"></el-input>
        </el-form-item>
        <el-form-item label="问题附件">
          <component v-bind:is="compArr.FileUploadComp" v-bind:FileDataList="taskFileList" fileFormId="ModifyTask" v-bind:clearInfo="IsClear" v-on:FilePreEmit="GetFilePreData" v-on:FileDataEmit="GetFileInfo"></component>
        </el-form-item>
        <div style="text-align: center">
          <el-button type="primary" @click="modifyTaskSub('modifyTask')">保存</el-button>
          <el-button @click="shutComp('modifyTaskVisible')">关 闭</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import FileUploadComp from '../FileUploadComp.vue'
export default {
  name: 'ModifyQuestion',
  components: {
    FileUploadComp
  },
  props: ['nodeId', 'DrawerOpen'],
  data () {
    return {
      // 引入组件
      compArr: {
        FileUploadComp: 'FileUploadComp'
      },
      pickerOptionsTaskSt: {},
      pickerOptionsTaskEt: {},
      IsClear: false,
      // 接收到的组件数组 新组件
      FileUploadArr: [],
      taskFileList: [],
      // 新建 修改任务
      detailTaskform: {
        id: '',
        questionName: '',
        questionLevel: 2,
        queStartDate: '2019-03-10 00:00:00',
        queFinishDate: '2019-05-10 00:00:00',
        description: ''
      },
      editTaskPayload: {
        id: '1',
        questionName: '',
        questionLevel: 1,
        queStartDate: '',
        queFinishDate: '',
        description: ''
      },
      // 新建 修改任务
      modifyTaskRules: {
        questionName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        questionLevel: [
          { required: true, message: '请选择任务等级', trigger: 'change' }
        ],
        queStartDate: [
          { type: 'string', required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        queFinishDate: [
          { type: 'string', required: true, message: '请选择结束日期', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    nodeId (val, old) {
      console.log('nodeId:', val)
      if (val) {
        this.getPlanTaskDetail()
      }
    },
    DrawerOpen (val, old) {
      console.log('nodeId3333333:', this.nodeId)
      if (val) {
        this.getPlanTaskDetail()
      }
    }
  },
  methods: {
    GetFilePreData (obj) {
      // this.log(123)
      this.$emit('FilePreEmit', obj)
    },
    levelChange: function (rateval) {
      this.detailTaskform.jobLevel = rateval
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
    getPlanTaskDetail () {
      var that = this
      that.ajax('/question/getDetailById', {id: that.nodeId}).then(res => {
        that.detailTaskform.questionName = res.data.questionName
        that.detailTaskform.questionLevel = parseInt(res.data.questionLevel)
        that.detailTaskform.queStartDate = res.data.queStartDate
        that.detailTaskform.queFinishDate = res.data.queFinishDate
        that.detailTaskform.description = res.data.description
        that.taskFileList = []
        if (res.data.parentSTime) {
          var minStart = new Date(res.data.queStartDate.split(' ')[0] + ' 00:00:00').getTime()
          var minEnt = new Date(res.data.queFinishDate.split(' ')[0] + ' 00:00:00').getTime()
          var maxStart = new Date(res.data.parentSTime.split(' ')[0] + ' 00:00:00').getTime()
          var maxEnd = new Date(res.data.parentETime.split(' ')[0] + ' 00:00:00').getTime()
          that.pickerOptionsTaskSt.disabledDate = function (time) {
            return time.getTime() < maxStart || time.getTime() > minStart
          }
          that.pickerOptionsTaskEt.disabledDate = function (time) {
            return time.getTime() > maxEnd || time.getTime() < minEnt
          }
        } else if (!res.data.parentSTime) {
          var Start = new Date(res.data.queStartDate.split(' ')[0] + ' 00:00:00').getTime()
          var Ent = new Date(res.data.queFinishDate.split(' ')[0] + ' 00:00:00').getTime()
          that.pickerOptionsTaskSt.disabledDate = function (time) {
            return time.getTime() > Start
          }
          that.pickerOptionsTaskEt.disabledDate = function (time) {
            return time.getTime() < Ent
          }
        }
        var fileListArr = []
        for (var i = 0; res.data.fileList && i < res.data.fileList.length; i++) {
          var obj = {
            attachmentId: res.data.fileList[i].id,
            fileName: res.data.fileList[i].showName,
            previewUrl: res.data.fileList[i].previewUrl
          }
          fileListArr.push(obj)
        }
        that.taskFileList = that.taskFileList.concat(fileListArr)
        // for (var j = 0; j < res.data.attachment.length; j++) {
        //   res.data.attachment[j].attachmentId = res.data.attachment[j].id
        // }
        // that.fileListEdit = res.data.attachment
      })
    },
    // 获取附件上传组件发来的附件信息
    // 获取附件上传组件发来的附件信息 新组件
    GetFileInfo (obj) {
      this.log('GetFileInfo:', obj)
      if (obj) {
        this.IsClear = false
      }
      this.FileUploadArr = obj
      this.log('GetFileInfo:', obj)
    },
    modifyTaskSub: function (formName) {
      var that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          that.loadingEdit = true
          that.editTaskPayload.id = that.nodeId
          that.editTaskPayload.questionLevel = that.detailTaskform.questionLevel
          that.editTaskPayload.questionName = that.detailTaskform.questionName
          that.editTaskPayload.queStartDate = that.detailTaskform.queStartDate
          that.editTaskPayload.queFinishDate = that.detailTaskform.queFinishDate
          that.editTaskPayload.description = that.detailTaskform.description
          that.editTaskPayload.attachmentId = that.SetFileIdStr()
          var st = new Date(that.detailTaskform.queStartDate).getTime()
          var et = new Date(that.detailTaskform.queFinishDate).getTime()
          if (st < et) {
            that.ajax('/question/editQuestion', that.editTaskPayload).then(res => {
              // that.log('editTask:', res)
              that.$emit('ModifyTaskCallback', res)
              // that.$emit('ModifyTaskCallback', res)
              if (res.code === 200) {
                that.$message({
                  message: '保存成功！',
                  type: 'success'
                })
                that.IsClear = true
                that.getPlanTaskDetail()
                // that.modifyTaskVisible = false
                // that.loadingEdit = false
                // that.toDetail(that.taskIdEdit)
                // that.selectProjectId()
                // that.getHistoryList()
              } else {
                that.loadingEdit = false
              }
            })
          } else {
            that.$message.warning('时间区间选择不合理')
          }
        }
      })
    },
    shutComp: function (compModel) {
      this.$emit('ShutCompEmit', compModel)
    }
  }
}
</script>

<style scoped>

</style>
