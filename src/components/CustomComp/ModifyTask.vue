<template>
  <div class="ModifyTask">
    <div class="planTaskBox">
      <el-form ref="modifyTask" :model="detailTaskform" :rules="modifyTaskRules" label-width="80px">
        <el-form-item label="任务名称" prop="jobName" maxlength="100" width="100">
          <el-input class="planNameIpt" v-model="detailTaskform.jobName"></el-input>
        </el-form-item>
        <el-form-item label="任务级别" prop="jobLevel" maxlength="100" width="100">
          <div class="ratestar" style="padding-top: 6px;">
            <el-rate v-model="detailTaskform.jobLevel" v-on:change="levelChange($event)"></el-rate>
          </div>
        </el-form-item>
        <el-form-item label="开始时间" prop="taskStartDate">
          <el-col :span="24">
            <el-date-picker style="width: 100%" type="datetime"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期"
                            v-model="detailTaskform.taskStartDate"
                            :picker-options="pickerOptionsTaskSt"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="结束时间" prop="taskFinishDate">
          <el-col :span="24">
            <el-date-picker type="datetime" style="width: 100%"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择日期"
                            v-model="detailTaskform.taskFinishDate"
                            :picker-options="pickerOptionsTaskEt"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="任务描述" maxlength="100" width="100">
          <el-input class="planNameIpt" type="textarea" style="resize:none;" :rows="2" v-model="detailTaskform.description"></el-input>
        </el-form-item>
        <el-form-item label="任务附件">
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
  name: 'ModifyTask',
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
        jobName: '',
        jobLevel: 2,
        taskStartDate: '2019-03-10 00:00:00',
        taskFinishDate: '2019-05-10 00:00:00',
        description: ''
      },
      editTaskPayload: {
        id: '1',
        jobName: '',
        jobLevel: 1,
        taskStartDate: '',
        taskFinishDate: '',
        description: ''
      },
      // 新建 修改任务
      modifyTaskRules: {
        jobName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        jobLevel: [
          { required: true, message: '请选择任务等级', trigger: 'change' }
        ],
        taskStartDate: [
          { type: 'string', required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        taskFinishDate: [
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
      if (val) {
        this.getPlanTaskDetail()
      }
    }
  },
  methods: {
    GetFilePreData (obj) {
      this.log(123)
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
      that.ajax('/myProject/getPlanOrTaskDetail', {id: that.nodeId}).then(res => {
        that.detailTaskform.jobName = res.data.jobName
        that.detailTaskform.jobLevel = parseInt(res.data.jobLevel)
        that.detailTaskform.taskStartDate = res.data.taskStartDate
        that.detailTaskform.taskFinishDate = res.data.taskFinishDate
        that.detailTaskform.description = res.data.description
        that.taskFileList = []
        var minStart = new Date(res.data.taskStartDate.split(' ')[0] + ' 00:00:00').getTime()
        var minEnt = new Date(res.data.taskFinishDate).getTime()
        var maxStart = new Date(res.data.parentSTime.split(' ')[0] + ' 00:00:00').getTime()
        var maxEnd = new Date(res.data.parentETime).getTime()
        that.pickerOptionsTaskSt.disabledDate = function (time) {
          return time.getTime() > maxStart || time.getTime() < minStart
        }
        that.pickerOptionsTaskEt.disabledDate = function (time) {
          return time.getTime() > maxEnd || time.getTime() < minEnt
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
          that.editTaskPayload.jobLevel = that.detailTaskform.jobLevel
          that.editTaskPayload.jobName = that.detailTaskform.jobName
          that.editTaskPayload.taskStartDate = that.detailTaskform.taskStartDate
          that.editTaskPayload.taskFinishDate = that.detailTaskform.taskFinishDate
          that.editTaskPayload.description = that.detailTaskform.description
          that.editTaskPayload.attachmentId = that.SetFileIdStr()
          var st = new Date(that.detailTaskform.taskStartDate).getTime()
          var et = new Date(that.detailTaskform.taskFinishDate).getTime()
          if (st <= et) {
            that.ajax('/myProject/editTask', that.editTaskPayload).then(res => {
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
