<template>
  <div class="MyPro">
    <div class="MyProCnt">
      <div class="MyProHeader">
        <div class="MyProHeaItem search">
          <Input search enter-button placeholder="Enter something..." />
        </div>
        <div class="MyProHeaItem addBtn"><Button type="primary" v-on:click="newAdd()">新增项目</Button></div>
      </div>
      <!--条件选择-->
      <div class="selectBox">
        <Select v-model="model1" style="width:200px" class="select1">
          <Option v-for="item in selectList1" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Select v-model="model2" style="width:200px">
          <Option v-for="item in selectList2" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
      <!--tabs 切换-->
      <div class="tabsTit">
        <Tabs v-model="statusVal">
          <TabPane label="全部" name=""></TabPane>
          <TabPane label="进行中" name="2"></TabPane>
          <TabPane label="已完成" name="3"></TabPane>
          <TabPane label="未开始" name="0"></TabPane>
        </Tabs>
      </div>
      <div class="content">
        <div class="cntItem" v-for="item in projectViewData.list" :key="item.projectUID" @click="toProDetail(item.projectUID)">
          <div class="cntItemLeft">
            <div class="proTit">项目名称: {{item.projectName}}</div>
            <div class="proPrincipals">负责人: {{item.projectManager}}</div>
            <div class="proDuration">{{item.startDate}} 至 {{item.endDate}}</div>
          </div>
          <div class="cntItemRight">
            <div class="proType"><span>剩余时间: 3天</span><span>项目类型: {{item.projectType}}</span></div>
            <div class="proPregress">
              <i-circle :percent="item.proportion" :size="70">
                <span class="demo-Circle-inner" style="font-size:24px">{{item.proportion}}%</span>
              </i-circle>
            </div>
            <div class="taskStateBiao" v-bind:class="item.tagStyle">{{item.statusInfo}}</div>
          </div>
        </div>
        <!--<div class="cntItem">-->
          <!--<div class="cntItemLeft">-->
            <!--<div class="proTit">项目名称: 贝豪集团2019战略项目规划</div>-->
            <!--<div class="proPrincipals">负责人: 张三</div>-->
            <!--<div class="proDuration">2019-02-25 至 2019-02-28</div>-->
          <!--</div>-->
          <!--<div class="cntItemRight">-->
            <!--<div class="proType"><span>剩余时间: 3天</span><span>项目类型: 集团项目</span></div>-->
            <!--<div class="proPregress">-->
              <!--<i-circle :percent="80" :size="70">-->
                <!--<span class="demo-Circle-inner" style="font-size:24px">80%</span>-->
              <!--</i-circle>-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->
      </div>
    </div>
    <!--新建项目 对话框-->
    <div>
      <Modal v-model="newAddDialog" title="新建项目" width="620" @on-ok="ok" @on-cancel="cancel">
        <div style="padding-bottom: 10px;">
          <el-row>
            <el-col style="width: 286px; margin-right: 10px; margin-top: 10px;">
              <el-card :body-style="{ padding: '0px' }" class="cartHover">
                <div style="padding: 14px;" @click="openProCreatedForm()">
                  <div class="modelItem">
                    <span class="modelName">空白模板</span>
                    <el-tag type="danger" style="float: right">空白模板</el-tag>
                  </div>
                  <div class="modelPeo">
                    <!--<div class="modelTime">项目周期：<span style="font-size: 14px">自定义</span></div>-->
                    <div class="button">创建人：管理员</div>
                  </div>
                  <div class="bottom clearfix">
                    <time class="time"><i class="el-icon-time"></i> 2018-12-12 00:00:00</time>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col style="width: 286px; margin-top: 10px;" v-for="(model, index) in modelList" v-bind:key="index">
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
      <Modal v-model="newAddDiaModel" width="620" title="新建项目" @on-ok="newCreateOk" @on-cancel="newCreateCancel">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="项目名称" prop="projectName">
            <el-input v-model="ruleForm.projectName"></el-input>
          </el-form-item>
          <el-form-item label="项目类型" prop="projectType">
            <!--<el-input v-model="ruleForm.projectType"></el-input>-->
            <el-select style="width: 100%" v-model="ruleForm.projectType" placeholder="请选择项目类型">
              <el-option label="集团战略" value="集团战略"></el-option>
              <el-option label="公司项目" value="公司项目"></el-option>
              <el-option label="部门项目" value="部门项目"></el-option>
              <el-option label="小组项目" value="小组项目"></el-option>
              <el-option label="个人项目" value="个人项目"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目周期" prop="value2">
            <el-date-picker style="width: 100%"
                            v-model="ruleForm.value2"
                            type="daterange"
                            range-separator="至"
                            @change= 'ctime($event)'
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd"
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
            <el-input type="textarea" style="" rows = '10' v-model="ruleForm.introduction"></el-input>
          </el-form-item>
          <el-form-item label="项目附件" v-if="!ruleForm.showName">
            <div v-if="!ruleForm.showName" style="color: #999;font-size: 12px;">暂无附件</div>
            <div v-if="ruleForm.showName">
              <a v-bind:href="ruleForm.downloadUrl" download="项目附件">{{ruleForm.showName}}
                <i style="font-weight: bold !important; padding: 5px; color: chocolate;" class="el-icon-download"></i>
              </a>
            </div>
            <!--<div style="color:#409EFF" v-on:click="downFuc($event)" v-bind:data-showname="ruleForm.showName" v-bind:data-realurl="ruleForm.realUrl">-->
            <!--{{ruleForm.showName}}<i style="font-weight: bold; padding: 5px;" class="el-icon-download"></i>-->
            <!--</div>-->
          </el-form-item>
          <!--<el-form-item style="height: 40px; clear: both;">-->
          <!--</el-form-item>-->
          <!--<el-form-item style="width: 880px;text-align: center;margin-top: 30px;">-->
            <!--<el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>-->
            <!--<el-button @click="resetForm('ruleForm')">重置</el-button>-->
          <!--</el-form-item>-->
        </el-form>
      </Modal>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyPro',
  data () {
    return {
      // 是否选择了"新建项目模板"
      isModel: false,
      duration: 0,
      modId: '',
      modelList: [],
      statusVal: '',
      newAddDialog: false,
      newAddDiaModel: false,
      selectList1: [
        {
          value: 'all',
          label: '全部项目'
        },
        {
          value: 'managedByMe',
          label: '我负责的'
        },
        {
          value: 'createdByMe',
          label: '我创建的'
        },
        {
          value: 'myJoin',
          label: '我参与的'
        }
      ],
      selectList2: [
        {
          value: 'all',
          label: '全部项目'
        },
        {
          value: '0',
          label: '公司项目'
        },
        {
          value: '1',
          label: '部门项目'
        },
        {
          value: '2',
          label: '小组项目'
        },
        {
          value: '3',
          label: '个人项目'
        }
      ],
      model1: 'all',
      model2: 'all',
      projectViewData: {},
      totalModelNum: 0,
      // 模板
      modelData: {
        pageNum: '1',
        pageSize: 5
      },
      // 查询个人项目列表
      myProjectViewPayload: {
        userId: this.$store.state.userId,
        status: '',
        pageNum: '1',
        projectType: '',
        pageSize: 10
      },
      ruleForm: {
        projectName: '',
        projectManager: '',
        delivery: false,
        projectType: '',
        showName: '',
        downloadUrl: '',
        previewUrl: '',
        resource: '',
        realUrl: '',
        position: '',
        introduction: '',
        value2: []
      },
      rules: {
        projectName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
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
      }
    }
  },
  created: function () {
    // 查询个人项目列表
    this.queryMyProjectView()
    // j
    this.queryProjectTypeList()
    // 查询用户信息
    this.getUserInfo()
    // 查询模板信息
    // this.getModelDetail()
    // 初始化token
    this.settoken()
  },
  watch: {
    statusVal: function (val1, val2) {
      if (val1) {
        this.myProjectViewPayload.status = val1
      } else {
        this.myProjectViewPayload.status = ''
      }
      this.queryMyProjectView()
    },
    model2: function (val1, val2) {
      if (val1 && val1 !== 'all') {
        this.myProjectViewPayload.projectType = val1
      } else {
        this.myProjectViewPayload.projectType = ''
      }
      this.queryMyProjectView()
    }
  },
  methods: {
    settoken: function () {
      this.ajax('/general/setToken', {}).then(res => {
        this.token = res._jfinal_token
      })
    },
    getUserInfo: function () {
      var that = this
      this.ajax('/general/getUserInfo', {}).then(res => {
        if (res.code === 200) {
          console.log('getUserInfo', res)
          that.ruleForm.projectManager = res.data.Name + ' (' + res.data.jName + ')'
          that.Mid = res.data.ID
        }
      })
    },
    // 查询个人项目列表 (项目卡片)
    queryProjectTypeList () {
      // var that = this
      this.ajax('/general/myProjectList', {}).then(res => {
        console.log('项目类型:', res)
        if (res.code === 200) {
          // res.data.list
        }
      })
    },
    // 查询个人项目列表 (项目卡片)
    queryMyProjectView () {
      var that = this
      this.ajax('/general/myProjectView', that.myProjectViewPayload).then(res => {
        console.log('项目卡片', res)
        if (res.code === 200) {
          // res.data.list
          for (var i = 0; i < res.data.list.length; i++) {
            res.data.list[i].startDate = res.data.list[i].startDate.split(' ')[0]
            res.data.list[i].endDate = res.data.list[i].endDate.split(' ')[0]
            // j
            if (res.data.list[i].state === '0') {
              res.data.list[i].tagStyle = 'noStart'
              res.data.list[i].statusInfo = '未开始'
            } else if (res.data.list[i].state === '2') {
              res.data.list[i].tagStyle = 'isDoing'
              res.data.list[i].statusInfo = '进行中'
            } else if (res.data.list[i].state === '3') {
              res.data.list[i].tagStyle = 'finished'
              res.data.list[i].statusInfo = '已完成'
            }
          }
          that.projectViewData = res.data
        }
      })
    },
    toProDetail: function (id) {
      this.$store.state.proId = id
      this.$router.push('/')
    },
    /**
     *
     *  新建项目
     *
     **/
    // 新建 是否选择模板 ok
    ok () {
      this.newAddDiaModel = true
      this.$Message.info('Clicked ok')
    },
    // 新建 是否选择模板 no
    cancel () {
      this.$Message.info('Clicked cancel')
    },
    // 新建 提交表单
    newCreateOk () {
      if (this.isModel) {
        this.submitModelForm('ruleForm')
      } else {
        this.submitForm('ruleForm')
      }
    },
    // 新建 取消
    newCreateCancel () {
      // j
    },
    // 查询模板信息
    getModelDetail: function () {
      var that = this
      this.ajax('/model/getModelDetail', {modelId: that.modId}).then(res => {
        if (res.code === 200) {
          // that.ruleForm.projectName = res.data.modelName
          that.duration = res.data.duration
          that.ruleForm.projectType = res.data.modelType
          that.setDefuleTime()
        }
      })
    },
    // 默认时间
    setDefuleTime: function () {
      var n = parseInt(this.duration)
      console.log('n', n)
      var nowData = new Date()
      var year = nowData.getFullYear()
      var month = (nowData.getMonth() + 1) < 10 ? '0' + (nowData.getMonth() + 1) : (nowData.getMonth() + 1)
      var day = nowData.getDate() < 10 ? '0' + nowData.getDate() : nowData.getDate()
      var result = year + '-' + month + '-' + day
      console.log('nowData', result)
      var getTime = new Date().getTime()
      var addTime = 24 * 60 * 60 * n * 1000
      var endTime = getTime + addTime
      var nowEndData = new Date(endTime)
      var yearEnd = nowEndData.getFullYear()
      var monthEnd = (nowEndData.getMonth() + 1) < 10 ? '0' + (nowEndData.getMonth() + 1) : (nowEndData.getMonth() + 1)
      var dayEnd = nowEndData.getDate() < 10 ? '0' + nowEndData.getDate() : nowEndData.getDate()
      var resultEnd = yearEnd + '-' + monthEnd + '-' + dayEnd
      this.ruleForm.value2.push(result)
      this.ruleForm.value2.push(resultEnd)
    },
    newAdd: function () {
      var that = this
      this.newAddDialog = true
      that.ajax('/model/getModelList', that.modelData).then(res => {
        if (res.code === 200) {
          that.log('getModelList:', res)
          that.modelList = res.data.list
          that.totalModelNum = res.data.totalRow
        }
        // console.log('个人任务:', that.taskListData)
      })
    },
    // 打开新建项目表单
    openProCreatedForm: function (modelId) {
      this.newAddDiaModel = true
      if (modelId) {
        this.modId = modelId
        // 是否选择了 "项目模板"
        this.isModel = true
        this.getModelDetail()
      } else {
        this.isModel = false
      }
      // this.$router.push('/NewAddPro')
    },
    ctime (e) {
      console.log(e)
    },
    querySearchAsync (queryString, cb) {
      var that = this
      if (queryString) {
        that.autoCompleteNamesPayload.projectManager = queryString
        this.ajax('/general/autoCompleteNames', that.autoCompleteNamesPayload).then(res => {
          // console.log('search:', res)
          if (res.code === 200) {
            var dddarr = []
            if (res.msg.length > 0) {
              for (var i = 0; i < res.msg.length; i++) {
                var obj = {}
                obj.value = res.msg[i].Name + ' (' + res.msg[i].jName + ')'
                obj.userId = res.msg[i].ID
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
    handleSelect (item) {
      // console.log(item.userId)
      this.Mid = item.userId
    },
    // 立即创建 (模板) 提交基本信息
    submitModelForm (formName) {
      var that = this
      var fileV = false
      // var fileV = $('#myfile').val()
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (that.Mid) {
            that.loading = true
            that.ajax('/model/addProject',
              {
                projectManagerID: that.Mid,
                modelId: that.modId,
                projectName: this.ruleForm.projectName,
                projectType: this.ruleForm.projectType,
                startDate: this.ruleForm.value2[0],
                endDate: this.ruleForm.value2[1],
                projectManager: this.ruleForm.projectManager,
                introduction: this.ruleForm.introduction
              }).then(res => {
              console.log('立即创建(muban):', res)
              if (res.code === 200) {
                that.token = res._jfinal_token
                that.projectUID = res.data
                if (!fileV) {
                  that.loading = false
                  // console.log('model', res)
                  if (that.projectUID) {
                    this.$store.state.proId = that.projectUID
                    this.$router.push('/ProEdit')
                    // that.$router.push('/proDetails/' + that.projectUID)
                  }
                } else {
                  that.delayfuc()
                }
              } else {
                this.$message({
                  type: 'error',
                  message: res.msg
                })
                that.loading = false
              }
            })
          } else {
            that.loading = false
            that.$message.error('请重新选择项目负责人')
          }
        } else {
          // console.log('网络错误!!')
          that.loading = false
          return false
        }
      })
    },
    // 立即创建 (空白模板) 提交基本信息
    submitForm (formName) {
      var that = this
      var fileV = false
      // var fileV = $('#myfile').val()
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (that.Mid) {
            that.loading = true
            that.ajax('/general/addBaseInfo',
              {
                projectManagerID: that.Mid,
                projectName: this.ruleForm.projectName,
                projectType: this.ruleForm.projectType,
                startDate: this.ruleForm.value2[0],
                endDate: this.ruleForm.value2[1],
                projectManager: this.ruleForm.projectManager,
                introduction: this.ruleForm.introduction,
                _jfinal_token: this.token
              }).then(res => {
              console.log('立即创建:', res)
              if (res.code === 200) {
                that.token = res._jfinal_token
                that.projectUID = res.projectUID
                if (!fileV) {
                  that.loading = false
                  // console.log('model', res)
                  if (that.projectUID) {
                    this.$store.state.proId = that.projectUID
                    this.$router.push('/ProEdit')
                    // that.$router.push('/proDetails/' + that.projectUID)
                  }
                } else {
                  that.delayfuc()
                }
              } else {
                this.$message({
                  type: 'error',
                  message: res.msg
                })
                that.loading = false
              }
            })
          } else {
            that.loading = false
            that.$message.error('请重新选择项目负责人')
          }
        } else {
          // console.log('网络错误!!')
          that.loading = false
          return false
        }
      })
    },
    // 重置 基本信息表单重置按钮
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
.MyProCnt{
  min-width: 600px;
  max-width: 1000px;
}
  .MyProHeader{
    display: flex;
    padding: 20px 10px;
    justify-content: space-between;
    background-color: #f5f8fa;
  }
  .MyProHeaItem{}
  .MyProHeaItem.search{
    width: 400px;
  }
  .selectBox{
    padding: 20px 10px;
  }
  .select1{
    margin-right: 20px;
  }
  /* content */
  .content{
    /**/
  }
  .cntItem{
    display: flex;
    box-sizing: border-box;
    border-left: 6px solid #eee;
    border-bottom: 1px solid #eee;
    border-top: 1px solid #eee;
    border-right: 1px solid #eee;
    border-radius: 5px;
    padding: 20px 0 20px 20px;
    background-color: #fff;
    margin-top: 10px;
    margin-bottom: 20px;
    position: relative;
    overflow: hidden;
  }
  .cntItem:hover{
    border-left: 6px solid #3a8ee6;
    border-bottom: 1px solid #eee;
    border-top: 1px solid #eee;
    border-right: 1px solid #eee;
    box-shadow: 0px 0px 6px #ddd;
  }
  .cntItem>div:nth-child(1){
    width: 70%;
    box-sizing: border-box;
  }
.cntItem>div:nth-child(2){
  width: 30%;
  box-sizing: border-box;
}
  .proTit{
    color: #555;
    font-size: 20px;
  }
  .proPrincipals{
    color: #8c939d;
    font-size: 16px;
    line-height: 50px;
  }
  .proDuration{
    color: #8c939d;
    font-size: 14px;
  }
  .proType{
    text-align: right;
    padding-right: 30px;
    color: #8c939d;
  }
  .proPregress{
    text-align: right;
    padding-right: 40px;
    padding-top: 10px;
  }
  .taskStateBiao{
    width: 100px;
    text-align: center;
    background-color: #3a8ee6;
    position: absolute;
    right: -33px;
    top: 9px;
    color: #fff;
    transform: rotate(45deg);
  }
  .taskStateBiao.noStart{
    background-color: #ffb400;
  }
  .taskStateBiao.isDoing{
    background-color: #13ce66;
  }
  .taskStateBiao.finished{
    background-color: #3a8ee6;
  }
  /*新建模板*/
  .cartHover:hover{
    background-color: #f5f8f8;
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
</style>
