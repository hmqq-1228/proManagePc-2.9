<template>
  <div class="CreatePlanOrTask">
    <!--<button v-on:click="testLimit">TEST</button>-->
    <div class="bgCoverTabs">
      <el-tabs v-model="activeNameBgCover" @tab-click="handleClickPlanTask">
        <el-tab-pane label="增加计划" name="first" v-bind:disabled="panshow">
          <!--计划form-->
          <div class="planTaskBox">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
              <el-form-item label="计划名称" prop="name" maxlength="100" width="100" style="margin-bottom: 30px;">
                <el-input class="planNameIpt" v-model="form.name" style="width: 300px;" maxlength="20"></el-input>
              </el-form-item>
              <el-form-item label="开始时间" prop="date1" style="margin-bottom: 30px;">
                <el-col :span="20">
                  <el-date-picker type="datetime"
                                  :picker-options="pickerOptionsPlan"
                                  format="yyyy-MM-dd HH:mm:ss"
                                  value-format="yyyy-MM-dd HH:mm:ss"
                                  placeholder="选择日期"
                                  v-model="form.date1" style="width: 300px;"
                  ></el-date-picker>
                </el-col>
              </el-form-item>
              <el-form-item label="结束时间" prop="date2" style="margin-bottom: 30px;">
                <el-col :span="20">
                  <el-date-picker type="datetime"
                                  :picker-options="pickerOptionsPlan"
                                  format="yyyy-MM-dd HH:mm:ss"
                                  value-format="yyyy-MM-dd HH:mm:ss"
                                  placeholder="选择日期"
                                  v-model="form.date2" style="width: 300px;"
                  ></el-date-picker>
                </el-col>
              </el-form-item>
              <el-form-item label="计划描述" prop="description" maxlength="100" width="100" style="margin-bottom: 30px;">
                <el-input class="planNameIpt" type="textarea" :rows="2" v-model="form.description" style="width: 300px;"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onPlanSubmit('form')">立即创建</el-button>
                <el-button @click="onPlanTaskCancel()">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
          <!---->
        </el-tab-pane>
        <el-tab-pane label="增加任务" name="second">
          <!--任务form-->
          <div class="planTaskBox" style="position: relative;padding-top: 0;">
            <el-form ref="addTaskForm" :rules="taskRules" :model="addTaskForm" label-width="80px">
              <el-form-item label="任务名称" prop="jobName" maxlength="100" width="100">
                <el-input class="planNameIpt" v-model="addTaskForm.jobName" style="width: 300px;" v-bind:disabled="isDisabled" maxlength="20"></el-input>
              </el-form-item>
              <el-form-item label="任务级别" prop="jobLevel" maxlength="100" width="100">
                <div class="ratestar" style="padding-top: 6px;">
                  <el-rate v-model="addTaskForm.jobLevel" v-on:change="rateChange($event)" v-bind:disabled="isDisabled"></el-rate>
                </div>
              </el-form-item>
              <!--指派人员多选 多人指派-->
              <el-form-item label="任务指派" prop="userArr" maxlength="100">
                <el-col :span="24">
                  <el-select v-model="value9" multiple filterable remote style="width: 300px"
                             :reserve-keyword="false" placeholder="请输入关键词"
                             :remote-method="addTaskRemoteMethod" :loading="loading2">
                    <el-option v-for="item in addTaskOptions" :key="item.ID" :label="item.Name + ' (' + item.jName + ')'"
                               :value="item.Name + '(' + item.jName + ')' + '_' + item.ID">
                    </el-option>
                  </el-select>
                </el-col>
              </el-form-item>
              <!--开始时间-->
              <el-form-item label="开始时间" prop="date1">
                <el-col :span="20">
                  <el-date-picker type="datetime"
                                  :picker-options="pickerOptionsPlan"
                                  format="yyyy-MM-dd HH:mm:ss"
                                  value-format="yyyy-MM-dd HH:mm:ss"
                                  placeholder="选择日期"
                                  v-model="addTaskForm.date1" style="width: 300px;"
                  >
                  </el-date-picker>
                </el-col>
              </el-form-item>
              <el-form-item label="结束时间" prop="date2">
                <el-col :span="20">
                  <el-date-picker type="datetime"
                                  :picker-options="pickerOptionsPlan"
                                  format="yyyy-MM-dd HH:mm:ss"
                                  value-format="yyyy-MM-dd HH:mm:ss"
                                  placeholder="选择日期"
                                  v-model="addTaskForm.date2" style="width: 300px;"
                  ></el-date-picker>
                </el-col>
              </el-form-item>
              <el-form-item label="任务描述" prop="description" maxlength="100" width="100">
                <el-input class="planNameIpt" v-bind:disabled="isDisabled" type="textarea" :rows="2" v-model="addTaskForm.description" style="width: 300px;"></el-input>
              </el-form-item>
              <el-form-item label="添加附件" prop="description" maxlength="100" width="100">
                <!--新建任务 引入附件组件 上传文件-->
                <component v-bind:is="compArr.FileUploadComp" fileFormId="createPlanTask" v-bind:clearInfo="IsClear" v-on:FileDataEmit="GetFileInfo"></component>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onTaskSubmit('addTaskForm')">立即创建</el-button>
                <el-button @click="onPlanTaskCancel()">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
          <!---->
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import FileUploadComp from '../FileUploadComp.vue'
// nodeId
export default {
  name: 'CreatePlanOrTask',
  props: ['nodeId', 'DrawerOpen'],
  components: {
    FileUploadComp
  },
  data () {
    return {
      // 引入组件
      compArr: {
        FileUploadComp: 'FileUploadComp'
      },
      user: '',
      // 接收到的组件数组 新组件
      FileUploadArr: [],
      // 是否让子组件清空文件 新组件
      IsClear: false,
      addTaskOptions: [],
      loading2: false,
      value9: [],
      isDisabled: false,
      // 新增 切换
      panshow: false,
      // 新增 添加计划 切换
      activeNameBgCover: 'first',
      pickerOptionsPlan: {
        // disabledDate (time) {
        //   return time.getTime() > Date.now()
        // }
      },
      // 防止双击
      submitKK: true,
      // 新增 增加计划 表单
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        description: '',
        resource: '',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        jobName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        userArr: [
          { required: true, message: '请选择任务指派人', trigger: 'change' }
        ],
        jobLevel: [
          { required: true, message: '请选择任务等级', trigger: 'change' }
        ],
        date1: [
          { type: 'string', required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        date2: [
          { type: 'string', required: true, message: '请选择结束日期', trigger: 'change' }
        ]
      },
      // 增加任务 表单
      addTaskForm: {
        jobName: '',
        userArr: [],
        userName: '',
        jobLevel: 1,
        date1: '',
        date2: '',
        state2: '',
        description: ''
      },
      // 增加任务 验证
      taskRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        jobName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        userArr: [
          { required: true, message: '请选择任务指派人', trigger: 'change' }
        ],
        jobLevel: [
          { required: true, message: '请选择任务等级', trigger: 'change' }
        ],
        date1: [
          { type: 'string', required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        date2: [
          { type: 'string', required: true, message: '请选择结束日期', trigger: 'change' }
        ]
      },
      addPlanPayload: {
        parentPlanId: '',
        name: '',
        start: '',
        finish: '',
        description: ''
      },
      addTaskPayload: {
        parentId: '',
        attachmentId: '',
        jobName: '',
        taskStartDate: '2019-03-01 00:00:00',
        taskFinishDate: '',
        description: '',
        jobLevel: 1,
        pStr: []
      },
      moreUserSelectPayload: {
        projectManager: ''
      }
    }
  },
  created: function () {
    // j
  },
  watch: {
    value9: function (newValue, oldValue) {
      this.addTaskForm.userArr = newValue
      // this.log('this.taskForm.state2:', this.taskForm.state2)
    },
    nodeId: function (val, old) {
      if (val) {
        if (val.substring(0, 1) === 'J') {
          this.activeNameBgCover = 'second'
          this.panshow = true
        } else {
          this.activeNameBgCover = 'first'
          this.panshow = false
        }
      }
    },
    DrawerOpen: function (val, old) {
      if (val) {
        // this.pickerOptionsPlan.disabledDate = ''
        // this.log(889889123)
        this.dateLimit()
      }
    }
  },
  methods: {
    // 时间限定
    dateLimit: function () {
      var that = this
      that.ajax('/myProject/getPlanOrTaskDetail', {id: that.nodeId}).then(res => {
        console.log('dateLimit-res:', res)
        if (res.code === 200) {
          if (res.data.start) {
            var st = res.data.start.split(' ')[0] + ' 00:00:00'
            that.form.date1 = res.data.start
            that.addTaskForm.date1 = res.data.start
          }
          var et = res.data.finish
          var sT = new Date(st)
          var eT = new Date(et)
          that.form.date2 = res.data.finish
          that.addTaskForm.date2 = res.data.finish
          var disabledStarTime2 = sT.getTime()
          var disabledEndTime2 = eT.getTime()
          that.pickerOptionsPlan.disabledDate = function (time) {
            return time.getTime() < disabledStarTime2 || time.getTime() > disabledEndTime2
          }
          // that.pickerOptionsPlan.disabledDate()
          // that.log('delPlanOrTask:', disabledStarTime)
          // that.log('delPlanOrTask22:', disabledEndTime)
        } else {
          that.$message({
            message: res.msg
          })
        }
      })
    },
    // 新增
    handleClickPlanTask: function (tab) {
    },
    // 新建 创建添加计划
    onPlanSubmit (formName) {
      var that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          that.addPlanPayload.parentPlanId = this.nodeId
          that.addPlanPayload.name = that.form.name
          that.addPlanPayload.start = that.form.date1
          that.addPlanPayload.finish = that.form.date2
          var st = new Date(that.form.date1).getTime()
          var et = new Date(that.form.date2).getTime()
          that.addPlanPayload.description = that.form.description
          if (st <= et) {
            that.ajax('/myProject/addPlan', that.addPlanPayload).then(res => {
              that.$emit('CreatePlanTaskCallback', res)
              if (res.code === 200) {
                that.formClear()
                that.$message.success(res.msg)
              } else {
                that.$message.warning(res.msg)
              }
            })
          } else {
            that.$message.warning('时间区间选择不合理')
          }
        }
      })
    },
    // 新增 取消
    onPlanTaskCancel () {
      var that = this
      that.isDisabled = false
      that.bgCoverShow = false
      that.$emit('CreatePlanTaskCallback', 'shut')
      that.formDataClear('form')
    },
    formDataClear: function (formName) {
      this.$refs[formName].resetFields()
    },
    // 新建
    rateChange: function (rateval) {
      this.addTaskPayload.jobLevel = rateval
    },
    // 新增 增加计划任务
    addTaskRemoteMethod (query) {
      var that = this
      // this.log('query:', query)
      if (query !== '') {
        this.loading2 = true
        that.moreUserSelectPayload.projectManager = query
        this.ajax('/myProject/autoCompleteNames', that.moreUserSelectPayload).then(res => {
          // that.log('autoCompleteNames:', res)
          if (res.code === 200) {
            that.addTaskOptions = res.data
            this.loading2 = false
          }
        })
      } else {
        this.addTaskOptions = []
      }
    },
    // 新增 提交 添加任务
    // 创建添加任务
    onTaskSubmit: function (taskForm) {
      var that = this
      if (that.submitKK) {
        that.submitKK = false
        that.$refs[taskForm].validate((valid) => {
          if (valid) {
            for (var i = 0; i < that.value9.length; i++) {
              var lian = i === (that.value9.length - 1) ? '' : '_'
              that.user = that.user + that.value9[i].split('_')[0] + '-' + that.value9[i].split('_')[1] + lian
            }
            // this.log('user:', user)
            that.addTaskPayload.parentId = that.nodeId
            that.addTaskPayload.jobName = that.addTaskForm.jobName
            that.addTaskPayload.jobLevel = that.addTaskForm.jobLevel
            that.addTaskPayload.pStr = that.user
            that.addTaskPayload.taskStartDate = that.addTaskForm.date1
            that.addTaskPayload.taskFinishDate = that.addTaskForm.date2
            that.addTaskPayload.description = that.addTaskForm.description
            that.addTaskPayload.attachmentId = that.SetFileIdStr()
            var st = new Date(that.addTaskForm.date1).getTime()
            var et = new Date(that.addTaskForm.date2).getTime()
            if (st <= et) {
              that.ajax('/myTask/addTask', that.addTaskPayload).then(res => {
                that.$emit('CreatePlanTaskCallback', res)
                that.submitKK = true
                if (res.code === 200) {
                  // 告知附件子组件清空
                  that.$message.success(res.msg)
                  that.IsClear = true
                  that.formClear()
                } else {
                  that.$message.error(res.msg)
                }
              })
            } else {
              that.$message.warning('时间区间选择不合理')
            }
          }
        })
      }
    },
    // j
    GetFileInfo (obj) {
      this.log('GetFileInfo:', obj)
      if (obj) {
        this.IsClear = false
      }
      this.FileUploadArr = obj
      this.log('GetFileInfo:', obj)
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
    formClear () {
      this.$refs['form'].resetFields()
      this.$refs['addTaskForm'].resetFields()
      // j
      this.user = ''
      this.value9 = []
    }
  }
}
</script>

<style scoped>

</style>
