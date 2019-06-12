<template>
  <!-- 项目基本信息 -->
  <div class="ProBaseInfo">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="项目名称" prop="proName">
        <Input v-model="formValidate.proName" placeholder="请输入项目名称" />
      </FormItem>
      <FormItem label="项目类型" prop="proType">
        <Select v-model="formValidate.proType" placeholder="请选择项目类型" @on-change="getProjectType($event)">
          <Option value="集团战略">集团战略</Option>
          <Option value="公司项目">公司项目</Option>
          <Option value="部门项目">部门项目</Option>
          <Option value="小组项目">小组项目</Option>
          <Option value="个人项目">个人项目</Option>
          <Option value="产品研发">产品研发</Option>
        </Select>
      </FormItem>
      <div v-if="projectPath" class="proTypePath">{{projectPath}}</div>
      <FormItem label="负责人" prop="proManager">
        <el-autocomplete style="width: 100%"
                         v-model="formValidate.proManager"
                         :fetch-suggestions="querySearchAsync"
                         placeholder="请输入项目负责人姓名"
                         :trigger-on-focus="false"
                         @select="handleSelect"
        ></el-autocomplete>
      </FormItem>
      <FormItem label="开始时间" prop="startDate">
        <DatePicker type="datetime" v-bind:value="formValidate.startDate" :options="startTimeOption" format="yyyy-MM-dd HH:mm:ss" @on-change="startDateChange" @on-open-change="startTimeChange" placeholder="请输入开始时间" style="width: 100%"></DatePicker>
      </FormItem>
      <FormItem label="结束时间" prop="endDate">
        <DatePicker type="datetime" v-bind:value="formValidate.endDate" :options="endTimeOption" format="yyyy-MM-dd HH:mm:ss" @on-change="endDateChange" @on-open-change="endTimeChange" placeholder="请输入结束时间" style="width: 100%"></DatePicker>
      </FormItem>
      <FormItem label="项目简介" prop="desc">
        <Input v-model="formValidate.desc" type="textarea" placeholder="请输入项目简介" />
      </FormItem>
      <FormItem label="自动加入" prop="delivery">
        <i-switch v-model="formValidate.delivery" size="large">
          <!--<span slot="open">On</span>-->
          <!--<span slot="close">Off</span>-->
        </i-switch>
        <span style="color: #cf9236; font-size: 12px; margin-left: 10px;">{{formValidate.deliveryTips}}</span>
      </FormItem>
      <!--<el-form-item label="自动加入" prop="delivery">-->
        <!--<el-switch v-model="formValidate.delivery"></el-switch>-->
        <!--<span style="color: #cf9236; font-size: 12px; margin-left: 10px;">{{formValidate.deliveryTips}}</span>-->
      <!--</el-form-item>-->
      <!--基本信息 项目附件-->
      <FormItem label="项目附件" prop="desc2">
        <component v-bind:is="compArr.FileUploadComp" v-on:FilePreEmit="GetFilePreData" v-bind:FileDataList="proFileList" fileFormId="ProBaseInfo" v-bind:clearInfo="IsClear" v-on:FileDataEmit="GetFileInfo"></component>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
        <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
      </FormItem>
    </Form>
    <!-- 产品研发 树形弹窗 -->
    <el-dialog title="产品研发" :visible.sync="ResDepTreeDialog" width="35%">
      <div class="showImg">
        <el-tree
          :data="data2"
          show-checkbox
          @check="ResDepChangeState"
          node-key="id"
          ref="treeForm"
          :check-strictly="true"
          @check-change="ResDepHandleClick"
          :props="ResDepDefaultProps">
        </el-tree>
      </div>
      <div style="text-align: center;margin: 40px 0">
        <el-button type="primary" @click="getPathProject()">确定选择</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import FileUploadComp from '../CustomComp/FileUploadComp.vue'
export default {
  name: 'ProBaseInfo',
  props: ['proId', 'fileFormId', 'ProBaseInfoShow'],
  components: {
    FileUploadComp
  },
  data () {
    return {
      startTime: '',
      endTime: '',
      startTimeOption: {},
      endTimeOption: {},
      // 引入组件
      compArr: {
        FileUploadComp: 'FileUploadComp'
      },
      // 附件上传 组件 是否让子组件清空文件 新组件
      IsClear: false,
      // 附件上传 组件 接收到的组件数组 新组件
      FileUploadArr: [],
      // 附件上传 回显
      proFileList: [],
      // 成员管理 组织架构
      data2: [],
      // 成员管理 搜索成员
      autoCompleteNamesPayload: {
        projectManager: ''
      },
      // 编辑基本信息 请求体
      editBaseInfoPayload: {
        projectUID: '',
        projectName: '',
        projectType: '',
        projectManager: '',
        projectManagerID: '',
        introduction: '',
        orgFlag: '',
        startDate: '',
        endDate: '',
        formIds: '',
        projectClassifyId: '',
        attachmentId: ''
      },
      // 成员管理 负责人id
      Mid: this.$store.state.userId,
      ResDepTreeDialog: false,
      // 产品研发 树形弹窗
      ResDepDefaultProps: {
        children: 'children',
        label: 'label'
      },
      // 产品研发 显示具体类型
      projectPath: '',
      projectPathId: '',
      proDetailMsg: '',
      formValidate: {
        proName: '',
        proType: '',
        proManager: '',
        projectManagerID: '',
        projectClassifyId: '',
        startDate: '',
        endDate: '',
        desc: '',
        delivery: true,
        deliveryTips: '注：是否将该项目下的任务负责人自动加入项目小组',
        classify: ''
      },
      ruleValidate: {
        proName: [
          { required: true, message: '请输入项目名字', trigger: 'blur' }
        ],
        proType: [
          { required: true, message: '请选择项目类型', trigger: 'change' }
        ],
        proManager: [
          { required: true, message: '请选择项目负责人', trigger: 'change' }
        ],
        startDate: [
          { required: true, type: 'string', message: '请选择开始日期', trigger: 'change' }
        ],
        endDate: [
          { required: true, type: 'string', message: '请选择结束日期', trigger: 'change' }
        ],
        startDateTime: [
          { required: true, type: 'string', message: '请选择开始时间', trigger: 'change' }
        ],
        endDateTime: [
          { required: true, type: 'string', message: '请选择结束时间', trigger: 'change' }
        ],
        desc: [
          { required: false, message: '请简要填写项目描述', trigger: 'blur' },
          { type: 'string', min: 0, message: '请输入简介', trigger: 'blur' }
        ]
        // delivery: [
        //   { required: false, message: '任务负责人是否自动加入项目小组', trigger: 'change' }
        // ]
      }
    }
  },
  created () {
    // this.log(6666666666)
    // this.queryProDetail()
  },
  watch: {
    ProBaseInfoShow (val, old) {
      var that = this
      if (val) {
        that.$store.state.proId = that.proId
        this.queryProDetail()
      }
    },
    proDetailMsg: function (newVal, oldVal) {
      var that = this
      if (newVal) {
        that.proFileList = []
        var fileListArr = []
        for (var i = 0; newVal.fileList && i < newVal.fileList.length; i++) {
          var obj = {
            attachmentId: newVal.fileList[i].id,
            fileName: newVal.fileList[i].showName,
            previewUrl: newVal.fileList[i].previewUrl
          }
          fileListArr.push(obj)
        }
        that.proFileList = that.proFileList.concat(fileListArr)
      }
      this.formValidate.proName = newVal.projectName
      this.formValidate.proManager = newVal.projectManager
      this.formValidate.projectManagerID = newVal.projectManagerID
      this.formValidate.desc = newVal.content
      this.formValidate.proType = that.proTypeValueToLabel(newVal.projectType)
      this.formValidate.projectPath = newVal.classify
      this.formValidate.startDate = newVal.startDate
      this.formValidate.endDate = newVal.endDate
      this.formValidate.classify = newVal.classify
      this.projectPath = newVal.classify
      this.startTime = newVal.startDate
      this.endTime = newVal.endDate
    }
  },
  methods: {
    // 新增 获取项目详情
    queryProDetail: function () {
      var that = this
      that.ajax('/myProject/getProjectDetail', {projectUID: that.$store.state.proId}).then(res => {
        // that.log('新getProjectDetail:', res)
        if (res.code === 200) {
          // that.memberList = res.data.memberList
          that.proDetailMsg = res.data
          that.Mid = res.data.projectManagerID
          that.formValidate.proManager = res.data.projectManager
          // that.startPlanDate = res.data.startDate.split(' ')[0]
          // that.endPlanDate = res.data.endDate.split(' ')[0]
          // that.planList = res.data.planOrJobList
          // that.firstPlanId = res.data.firstPlanId
          // if (res.data.planOrJobList.length > 0) {
          //   that.activeId = res.data.planOrJobList[0].id
          // } else {
          //   that.activeId = ''
          // }
          // that.selectProjectId()
        }
      })
    },
    // 项目类型 返回值 数字转文字描述格式
    proTypeValueToLabel: function (ptype) {
      // {label: '公司项目', value: '0'},
      // {label: '部门项目', value: '1'},
      // {label: '小组项目', value: '2'},
      // {label: '个人项目', value: '3'},
      // {label: '集团战略', value: '4'},
      // {label: '产品研发', value: '5'}
      if (ptype === '0') {
        return '公司项目'
      } else if (ptype === '1') {
        return '部门项目'
      } else if (ptype === '2') {
        return '小组项目'
      } else if (ptype === '3') {
        return '个人项目'
      } else if (ptype === '4') {
        return '集团战略'
      } else if (ptype === '5') {
        return '产品研发'
      } else {
        return ptype
      }
    },
    // 新增 对话框 产品研发类型树形结构
    getProjectType: function (e) {
      var that = this
      if (e === '5' || e === '产品研发') {
        that.ResDepTreeDialog = true
        that.ajax('/myProject/getProjectClassifyTree', {}).then(res => {
          if (res.code === 200) {
            that.data2 = res.data
          }
        })
      } else {
        that.showProject = true
        that.projectPath = ''
        that.projectPathId = ''
        that.formValidate.projectClassifyId = ''
      }
    },
    // 新建 搜索选择项目负责人
    querySearchAsync (queryString, cb) {
      var that = this
      if (queryString) {
        that.autoCompleteNamesPayload.projectManager = queryString
        this.ajax('/myProject/autoCompleteNames', that.autoCompleteNamesPayload).then(res => {
          if (res.code === 200) {
            var dddarr = []
            if (res.data.length > 0) {
              for (var i = 0; i < res.data.length; i++) {
                var obj = {}
                obj.value = res.data[i].Name + ' (' + res.data[i].jName + ')'
                obj.userId = res.data[i].ID
                dddarr.push(obj)
              }
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
    handleSelect (item) {
      this.Mid = item.userId
    },
    startDateChange (date) {
      this.formValidate.startDate = date
    },
    startTimeChange () {
      this.startTimeOption = {
        disabledDate: date => {
          let startTime = this.startTime ? new Date(this.startTime).valueOf() : ''
          return date && (date.valueOf() > startTime)
        }
      }
    },
    endDateChange (date) {
      this.formValidate.endDate = date
    },
    endTimeChange () {
      let endTime = this.endTime ? new Date(this.endTime).valueOf() : ''
      this.endTimeOption = {
        disabledDate (date) {
          return date && date.valueOf() < endTime
        }
      }
    },
    handleSubmit (name) {
      var that = this
      this.log(222)
      this.$refs[name].validate((valid) => {
        if (valid) {
          that.editBaseInfoPayload.projectUID = that.proId
          that.editBaseInfoPayload.projectName = that.formValidate.proName
          that.editBaseInfoPayload.projectType = that.formValidate.proType
          that.editBaseInfoPayload.projectManager = that.formValidate.proManager
          that.editBaseInfoPayload.projectManagerID = that.Mid
          that.editBaseInfoPayload.introduction = that.formValidate.desc
          that.editBaseInfoPayload.orgFlag = that.formValidate.delivery
          that.editBaseInfoPayload.projectClassifyId = that.formValidate.projectClassifyId
          that.editBaseInfoPayload.startDate = that.DateFormat(that.formValidate.startDate)
          that.editBaseInfoPayload.endDate = that.DateFormat(that.formValidate.endDate)
          that.editBaseInfoPayload.attachmentId = that.SetFileIdStr()
          that.ajax('/myProject/editBaseInfo', that.editBaseInfoPayload).then(res => {
            that.$emit('ProBaseInfoCallback', res)
            // TaskDistributeCallback
            if (res.code === 200) {
              that.IsClear = true
            }
          })
        } else {
          this.$Message.error('有未填写的必填项!')
        }
      })
    },
    // 重置
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    // 产品研发
    ResDepChangeState: function (data, checked, node) {
      this.formValidate.projectClassifyId = data.id
      this.projectPath = data.specificPath
      this.projectPathId = data.id
    },
    // 产品研发
    ResDepHandleClick: function (data, checked, node) {
      var that = this
      that.i++
      if (that.i % 2 === 0) {
        if (checked) {
          that.$refs.treeForm.setCheckedNodes([])
          that.$refs.treeForm.setCheckedNodes([data])
        } else {
          that.$refs.treeForm.setCheckedNodes([])
        }
      }
    },
    // 产品研发 确定选择
    getPathProject: function () {
      this.ResDepTreeDialog = false
    },
    // 时间格式化
    DateFormat (date) {
      var finalFarmat = ''
      var newdate = new Date(date)
      var y = newdate.getFullYear()
      var mon = (newdate.getMonth() + 1) < 10 ? ('0' + (newdate.getMonth() + 1)) : (newdate.getMonth() + 1)
      var d = newdate.getDate() < 10 ? ('0' + newdate.getDate()) : newdate.getDate()
      var h = newdate.getHours() < 10 ? ('0' + newdate.getHours()) : newdate.getHours()
      var min = newdate.getMinutes() < 10 ? ('0' + newdate.getMinutes()) : newdate.getMinutes()
      var s = newdate.getSeconds() < 10 ? ('0' + newdate.getSeconds()) : newdate.getSeconds()
      finalFarmat = y + '-' + mon + '-' + d + ' ' + h + ':' + min + ':' + s
      return finalFarmat
    },
    // 附件上传 拼接附件上传的id为字符串
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
    // 附件上传 获取附件上传组件发来的附件信息 新组件
    GetFileInfo (obj) {
      if (obj) {
        this.IsClear = false
      }
      this.FileUploadArr = obj
    },
    // 图片预览 接着往上传
    GetFilePreData: function (obj) {
      this.$emit('FilePreEmit', obj)
    }
  }
}
</script>

<style scoped>
  .proTypePath{
    font-size: 12px;
    padding-left: 88px;
    margin-top: -16px;
    color: #777;
    margin-bottom: 10px;
  }
</style>
