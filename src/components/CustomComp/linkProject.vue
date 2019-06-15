<template>
  <div>
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
        layout="total, prev, pager, next, jumper"
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
  </div>
</template>

<script>
import FileUploadComp from './FileUploadComp.vue'
export default {
  components: {
    FileUploadComp
  },
  name: 'linkProject',
  props: ['linkId', 'proListShow'],
  data () {
    return {
      compArr: {
        goodsInfo: 'goodsInfo',
        FileUploadComp: 'FileUploadComp'
      },
      IsClear: false,
      proFileList: [],
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
      }
    }
  },
  created () {
    var that = this
    that.getUserInfo()
    this.getProjectList()
  },
  watch: {
    proListShow: function (val, oV) {
      if (val) {
        this.getUserInfo()
        this.getProjectList()
        this.getProjectPayload.taskId = this.linkId
      }
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
    GetFilePreData (obj) {
      if (obj.previewUrl && this.isImage(obj.fileName)) {
        this.showBigImage1(obj.previewUrl)
      }
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
    getProjectPageNum: function (e) {
      this.getProjectPayload.pageNum = e
      this.currentPage = e
      this.getProjectList()
    },
    getProjectList: function () {
      var that = this
      that.getProjectPayload.taskId = that.linkId
      that.log('getProjectPayload:', that.getProjectPayload)
      that.log('linkId:', that.linkId)
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
      that.$emit('showFlag', false)
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
      this.$Message.info('请选择项目模板')
    },
    // 新建 是否选择模板 no
    cancel () {
      var that = this
      that.$emit('showFlag', true)
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
              that.$emit('showFlag', true)
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
                  that.$emit('dialogGoodsShow', true)
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
              that.$emit('showFlag', true)
              if (res.code === 200) {
                that.IsClear = true
                that.projectUID = res.data
                that.$store.state.taskEdit = true
                that.getProjectList()
                that.$store.state.proId = res.data
                if (that.ruleForm.projectType === '产品研发') {
                  // this.dialogGoods = true
                  that.$emit('dialogGoodsShow', true)
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
    }
  }
}
</script>

<style scoped>
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
