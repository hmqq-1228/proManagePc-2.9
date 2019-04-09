<template>
  <div class="MyPro">
    <div class="MyProCnt">
      <div class="MyProHeader">
        <div class="MyProHeaItem search">
          <Input search enter-button @on-search="searchPro" v-model="searchProVal" placeholder="请输入要查找的项目" />
        </div>
        <div class="MyProHeaItem addBtn"><Button type="primary" v-on:click="newAdd()">新增项目</Button></div>
      </div>
      <!--条件选择-->
      <div class="selectBox">
        <Select v-model="model1" style="width:200px" class="select1">
          <Option v-for="item in selectList1" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Select v-model="model2" style="width:200px">
          <Option v-for="item in proTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
        <div class="cntItem" v-for="item in projectViewData" :key="item.projectUID">
          <div class="cntItemLeft" @click="toProDetail(item.projectUID)">
            <div class="proTit">项目名称: {{item.projectName}}</div>
            <div class="proPrincipals">负责人: {{item.projectManager}}</div>
            <div class="proDuration">{{item.startDate}} 至 {{item.endDate}}</div>
          </div>
          <div class="cntItemRight">
            <div class="proType"><span>项目类型: {{item.projectType}}</span></div>
            <div class="proType">
              <div style="text-align: right;font-size: 12px;display: inline-block" v-if="item.dayNum < 0 && item.state != '3'">已逾期 <span style="font-size: 18px;color: #f00;font-weight: bold;">{{Math.abs(item.dayNum)}}</span> 天</div>
              <div style="text-align: right;font-size: 12px;display: inline-block" v-if="item.dayNum >= 0 && item.state != '3'">剩余 <span style="font-size: 18px;color: #27CF97;font-weight: bold;">{{item.dayNum}}</span> 天</div>
              <div style="text-align: right;font-size: 12px;color: #3a8ee6;font-weight: bold;display: inline-block" v-if="item.state === '3'">项目已完成</div>
            </div>
            <div class="proPregress">
              <i-circle :percent="item.proportion" :size="60">
                <span class="demo-Circle-inner" v-if="item.proportion < 50" style="font-size:18px;color: chocolate;">{{item.proportion}}%</span>
                <span class="demo-Circle-inner" v-if="item.proportion >= 50 && item.proportion < 80" style="font-size:18px;color: #409EFF;">{{item.proportion}}%</span>
                <span class="demo-Circle-inner" v-if="item.proportion >= 80" style="font-size:18px;color: #13ce66;">{{item.proportion}}%</span>
              </i-circle>
            </div>
            <div style="text-align: right; padding-right: 30px;">
              <Button size="small" style="margin-left: 15px;" @click="responsePro(item.projectUID)">回复</Button>
              <Button v-if="item.isDelProject" size="small" @click="delPro(item.projectUID, item.projectType)">删除</Button>
            </div>
            <div class="taskStateBiao" v-bind:class="item.tagStyle">{{item.statusInfo}}</div>
          </div>
        </div>
        <div class="nodata" v-if="projectViewData.length === 0">
          <div style="width:165px; margin: 0 auto; margin-top: 50px;"><img src="../../static/img/nodata.png" /></div>
          <div style="text-align: center; color: #666; margin-top: 15px; font-size: 14px;">暂无数据</div>
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
      <Modal v-model="newAddDiaModel" :loading="createProFormLoading" width="620" title="新建项目" @on-ok="newCreateOk" @on-cancel="newCreateCancel">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="项目名称" prop="projectName">
            <el-input v-model="ruleForm.projectName"></el-input>
          </el-form-item>
          <el-form-item label="项目类型" prop="projectType" v-if="!showProjectType">
            <el-select style="width: 100%" v-model="ruleForm.projectType" placeholder="请选择项目类型" @change="getProjectType($event)">
              <el-option v-for="item in proTypeListPure" :value="item.label" :key="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <div style="display: flex;justify-content: space-between" v-if="showProjectType">
            <el-form-item label="项目类型" prop="projectType" style="width: 50%;">
              <el-select style="width: 100%" v-model="ruleForm.projectType" placeholder="请选择项目类型" @change="getProjectType($event)">
                <el-option v-for="item in proTypeListPure" :value="item.label" :key="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
            <!--<div style="width: 50%" @click="showProType('5')">-->
              <!--<el-form-item label="项目分类" prop="projectPath">-->
                <!--<el-input v-model="ruleForm.projectPath" readonly></el-input>-->
              <!--</el-form-item>-->
            <!--</div>-->
          </div>
          <!--<div v-if="projectPath" class="proTypePath">{{projectPath}}</div>-->
          <!--<el-input v-model="projectPath" readonly placeholder="请选择项目类型" style="width: 52%;"></el-input>-->
          <el-form-item label="项目周期" prop="value2">
            <el-date-picker style="width: 100%"
              v-model="ruleForm.value2"
              type="daterange"
              range-separator="至"
              @change= 'ctime($event)'
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
            <!--<div v-if="!ruleForm.showName" style="color: #999;font-size: 12px;">暂无附件</div>-->
            <div v-if="!ruleForm.showName">
              <!--附件上传 组件 引入附件上传组件  v-bind:clearInfo=""-->
              <component v-bind:is="FileUploadComp" fileFormId="createPro" v-bind:clearInfo="IsClear" v-on:FileDataEmit="GetFileInfo"></component>
              <!--<a v-bind:href="ruleForm.downloadUrl" download="项目附件">{{ruleForm.showName}}-->
                <!--<i style="font-weight: bold !important; padding: 5px; color: chocolate;" class="el-icon-download"></i>-->
              <!--</a>-->
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
        <!---->
        <!--<Spin size="large" fix v-if="spinShow"></Spin>-->
      </Modal>
    </div>
    <el-dialog title="图片预览" :visible.sync="dialogShowImg">
      <div class="showImg"><img v-bind:src="commentPreviewUrl" alt=""></div>
    </el-dialog>
    <!-- 完善产品信息 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogGoods"
      width="30%"
      center
    >
      <span>是否完善产品信息？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="jumpInfo">跳过</el-button>
        <el-button type="primary" @click="perfectInfo">去完善</el-button>
      </span>
    </el-dialog>
    <!--对话框 项目分类 产品研发 start-->
    <el-dialog title="产品研发" :visible.sync="dialogFormVisible" width="35%">
      <div class="showImg">
        <el-tree
          :data="data2"
          show-checkbox
          @check="changeState"
          node-key="id"
          ref="treeForm"
          :check-strictly="true"
          @check-change="handleClick"
          :props="defaultProps">
        </el-tree>
      </div>
      <div style="text-align: center;margin: 40px 0">
        <el-button type="primary" @click="getPathProject()">确定选择</el-button>
      </div>
    </el-dialog>
    <!-- 完善商品信息 -->
    <Drawer title="商品信息" width="740" :closable="false" v-model="goodsEdit">
      <component
        v-bind:is="compArr.goodsInfo"
        fileFormId="BaseInfoEdit"
        v-on:FilePreEmit="GetFilePreData"
        v-bind:ProBaseInfoShow="goodsEdit"
        v-on:ProBaseInfoCallback="ProBaseInfoCallbackFuc"
        :proId="proId"
        @cancel="cancelGoods"
      ></component>
    </Drawer>
    <!--产品研发 end-->
    <!--抽屉 回复 历史记录-->
    <!--新增 抽屉 查看历史记录 start-->
    <Drawer title="历史记录" width="740" :closable="false" v-model="DrawerHistory">
      <div class="el-textarea" v-loading="historyLoading">
        <!--enctype="multipart/form-data"-->
        <form id="uploadFile">
          <textarea name="content" class="el-textarea__inner" id="textArea" type="text" v-model="commitComent"></textarea>
          <div class="cannetProject2">
            <div>
              <component v-bind:is="FileUploadComp" fileFormId="proHistory" v-bind:clearInfo="IsClear" v-on:FileDataEmit="GetFileInfo"></component>
            </div>
            <div><i-button type="info" v-bind:disabled="butnDisabled" @click="addMarkInfo()">回复</i-button></div>
          </div>
        </form>
      </div>
      <!--操作记录-->
      <div class="discription lis" style="margin-top: 15px;">
        <!-- 历史记录 评论 引入组件-->
        <component v-bind:is="compArr.CommentLogs" fileFormId="ProCommentLogs" v-on:FilePreEmit="GetFilePreData" :commentList="taskLogs"></component>
        <div style="text-align: center">
          <Page :total="commentTotalNum" size="small" :page-size="10" show-total @on-change="commentPageChange($event)"></Page>
        </div>
      </div>
    </Drawer>
    <el-dialog title="图片预览" :visible.sync="dialogShowImg1">
      <div class="showImg"><img v-bind:src="commentPreviewUrl1" alt=""></div>
    </el-dialog>
    <!--分页 start-->
    <div style="padding: 10px 0 30px 0; text-align: center;">
      <Page :total="pageTotalRow" :page-size="10" :current="myProjectViewPayload.pageNum" size="small" @on-change="pageNumChange" />
    </div>
    <!--分页 end-->
  </div>
</template>

<script>
import CommentLogs from './CustomComp/CommentLogs.vue'
import FileUploadComp from './FileUploadComp.vue'
import goodsInfo from './CustomComp/goodsInfo.vue'
export default {
  name: 'MyPro',
  components: {
    FileUploadComp,
    CommentLogs,
    goodsInfo
  },
  data () {
    return {
      // 完善茶品信息
      dialogGoods: false,
      // 商品信息
      goodsEdit: false,
      commentTotalNum: 0,
      commentPreviewUrl1: '',
      dialogShowImg1: false,
      // 加载转圈
      createProLoading: false,
      // shi
      pageN: 1,
      // 附件上传 是否让子组件清空文件
      IsClear: false,
      // 附件上传 附件ID拼接成字符串
      FileUploadIdStr: '',
      // 接收到的组件数组
      FileUploadArr: [],
      // 引入附件上传组件
      FileUploadComp: 'FileUploadComp',
      compArr: {
        CommentLogs: 'CommentLogs',
        FileUploadComp: 'FileUploadComp',
        goodsInfo: 'goodsInfo'
      },
      // 新建项目 表单
      spinShow: false,
      createProFormLoading: true,
      // 产品研发 树形结构 单选
      i: 0,
      // 新增
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 产品研发 项目类型数据
      data2: [],
      // 产品研发 显示具体类型
      projectPath: '',
      projectPathId: '',
      // 新增 对话框 产品研发
      dialogFormVisible: false,
      // 新增
      totalData: 0,
      // 新增
      taskLogs: [],
      showProjectType: false,
      butnDisabled: true,
      proId: '',
      commitComent: '',
      // 新增 历史loading
      historyLoading: false,
      notMore: false,
      // 新增 历史记录 抽屉
      DrawerHistory: false,
      // 总条数
      pageTotalRow: 10,
      // 页码
      pageNum: 1,
      // 历史记录 页码
      logPageNum: 1,
      // 搜索项目
      searchProVal: '',
      // 是否选择了"新建项目模板"
      isModel: false,
      duration: 100,
      // 新增
      autoCompleteNamesPayload: {
        projectManager: ''
      },
      // 新建项目 模板Id
      modId: '',
      modelList: [],
      statusVal: '',
      newAddDialog: false,
      newAddDiaModel: false,
      // 类型（1:我创建的；2:我负责的; 3:我参与的;"":全部）
      selectList1: [
        {
          value: 'all',
          label: '全部项目'
        },
        {
          value: '2',
          label: '我负责的'
        },
        {
          value: '1',
          label: '我创建的'
        },
        {
          value: '3',
          label: '我参与的'
        }
      ],
      // 项目分类列表
      proTypeListPure: this.$store.state.projectType,
      // 项目分类列表 (带“全部”)
      proTypeList: [
        {
          value: 'all',
          label: '全部项目'
        }
      ],
      model1: 'all',
      model2: 'all',
      dialogShowImg: false,
      commentPreviewUrl: '',
      projectViewData: {},
      totalModelNum: 0,
      // 模板
      modelData: {
        pageNum: '1',
        pageSize: 5
      },
      // 新增 添加评论
      addProjectCommentPayload: {
        projectUID: '',
        content: '',
        formIds: ''
      },
      // 查询个人项目列表
      myProjectViewPayload: {
        // 项目名称，模糊查询
        projectName: '',
        userId: this.$store.state.userId,
        // 项目状态（0:未开始； 2：进行中:3：已完成;"":全部）
        status: '',
        pageNum: 1,
        // 类型（1:我创建的；2:我负责的; 3:我参与的;"":全部）
        type: '',
        // 项目类型 公司项目:'0' 部门项目:'1' 小组项目:'2' 个人项目:'3' 集团战略:'4' 产品研发:'5'  全部: ''
        projectType: '',
        // 项目分类记录id
        projectClassifyId: '',
        pageSize: 10
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
      }
    }
  },
  created: function () {
    // activeNavIndex: this.$store.state.activeNavIndex,
    // j
    var that = this
    this.proTypeList = this.proTypeList.concat(that.$store.state.projectType)
    // 查询个人项目列表
    this.queryMyProjectView()
    // j
    // this.queryProjectTypeList()
    // 查询用户信息
    this.getUserInfo()
    // 查询模板信息
    // this.getModelDetail()
    // 初始化token
    // this.settoken()
  },
  watch: {
    // 历史记录输入框
    commitComent: function (val, oVal) {
      if (val) {
        this.butnDisabled = false
      } else {
        this.butnDisabled = true
      }
    },
    pageNum: function (val, old) {
      this.myProjectViewPayload.pageNum = val
      this.queryMyProjectView()
    },
    searchProVal: function (val, old) {
      this.myProjectViewPayload.projectName = val
      this.queryMyProjectView()
      // if (val) {
      //   this.queryMyProjectView()
      // }
    },
    statusVal: function (val1, val2) {
      if (val1) {
        this.myProjectViewPayload.status = val1
      } else {
        this.myProjectViewPayload.status = ''
      }
      this.myProjectViewPayload.pageNum = 1
      this.queryMyProjectView()
    },
    model1: function (val1, val2) {
      this.log('model1-val1:', val1)
      if (val1 && val1 !== 'all') {
        this.log('走了：', val1)
        this.myProjectViewPayload.type = val1
      } else {
        this.myProjectViewPayload.type = ''
      }
      this.myProjectViewPayload.pageNum = 1
      this.queryMyProjectView()
    },
    model2: function (val1, val2) {
      if (val1 && val1 !== 'all') {
        this.myProjectViewPayload.projectType = val1
      } else {
        this.myProjectViewPayload.projectType = ''
      }
      this.myProjectViewPayload.pageNum = 1
      this.queryMyProjectView()
    }
  },
  methods: {
    // 取消商品信息
    cancelGoods () {
      this.goodsEdit = false
    },
    // 预览
    GetFilePreData (obj) {
      this.log('obj::', obj)
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
    // 确定选择
    getPathProject: function () {
      this.dialogFormVisible = false
    },
    // 新增 产品研发
    handleClick: function (data, checked, node) {
      var that = this
      // that.log('产品研发子级data：', data)
      // that.log('产品研发子级checked：', checked)
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
    // 新增 产品研发
    changeState: function (data, checked, node) {
      this.log('changeState:', data)
      this.ruleForm.projectClassifyId = data.id
      this.ruleForm.projectPath = data.specificPath
      this.projectPathId = data.id
    },
    // 新增 对话框 产品研发类型树形结构
    getProjectType: function (e) {
      // var that = this
      // if (e === '5' || e === '产品研发') {
      //   // that.showProject = false
      //   that.showProjectType = true
      //   that.dialogFormVisible = true
      //   that.ajax('/myProject/getProjectClassifyTree', {}).then(res => {
      //     // that.log('getUserInfo', res)
      //     if (res.code === 200) {
      //       that.data2 = res.data
      //     }
      //   })
      // } else {
      //   that.showProject = true
      //   that.showProjectType = false
      //   that.projectPath = ''
      //   that.projectPathId = ''
      //   that.ruleForm.projectClassifyId = ''
      // }
    },
    showProType: function (e) {
      this.getProjectType(e)
    },
    // 新增
    getFileName: function () {
      var filePath = $('#myfile').val()
      var arr = filePath.split('\\')
      var fileName = arr[arr.length - 1]
      $('.showFileName').html(fileName)
    },
    // 新增 点击“回复”按钮
    addMarkInfo () {
      var that = this
      that.addProjectCommentPayload.contentId = that.proId
      that.addProjectCommentPayload.content = that.commitComent
      that.addProjectCommentPayload.attachmentId = that.SetFileIdStr()
      if (that.commitComent) {
        that.ajax('/comment/addComment', that.addProjectCommentPayload).then(res => {
          that.log('addProjectComment:', res)
          if (res.code === 200) {
            that.IsClear = true
            that.$message({
              type: 'success',
              message: res.msg
            })
            that.getHistoryCont()
            that.commitComent = ''
          }
        })
      }
    },
    showBigImage: function (url) {
      if (url) {
        this.commentPreviewUrl = url
        this.dialogShowImg = true
      }
    },
    // 新增 获取历史记录
    getHistoryCont () {
      var that = this
      // var planid = this.$route.params.pid
      that.ajax('/myProject/getLogAndComment', {projectUID: that.proId, pageSize: 10, pageNum: that.pageN}).then(res => {
        that.log('getLogAndComment:', res)
        if (res.code === 200) {
          for (var i = 0; i < res.data.list.length; i++) {
            for (var j = 0; j < res.data.list[i].uploads.length; j++) {
              if (that.isImage(res.data.list[i].uploads[j].showName)) {
                res.data.list[i].uploads[j].isImage = true
              } else {
                res.data.list[i].uploads[j].isImage = false
              }
              var downurl = that.$store.state.baseServiceUrl + '/file/downloadFile?realUrl=' + res.data.list[i].uploads[j].realUrl + '&showName=' + res.data.list[i].uploads[j].showName
              res.data.list[i].uploads[j].downloadUrl = downurl
            }
          }
          // that.taskLogs = []
          that.taskLogs = res.data.list
          // that.log('taskLogs:', that.taskLogs)
          that.commentTotalNum = res.data.totalRow
          // if (that.taskLogs.length === that.totalData) {
          //   that.log('ss', that.taskLogs)
          //   that.notMore = true
          // }
          // that.log('taskLogs:', res)
        }
      })
    },
    pageNumChange: function (num) {
      this.log('num:', num)
      this.pageNum = num
    },
    confirm () {
      this.$Modal.confirm({
        title: 'Title',
        content: '<p>Content of dialog</p><p>Content of dialog</p>',
        onOk: () => {
          // this.$Message.info('Clicked ok')
        },
        onCancel: () => {
          // this.$Message.info('Clicked cancel')
        }
      })
    },
    // 点击回复 项目列表页上的回复 评论项目
    responsePro: function (pId) {
      this.proId = pId
      this.DrawerHistory = true
      this.getHistoryCont()
    },
    // 删除项目
    delPro: function (pId, pType) {
      var that = this
      this.$Modal.confirm({
        title: '删除项目！',
        loading: true,
        content: '确定要删除此项目？此操作不可撤回！',
        onOk: () => {
          this.ajax('/myProject/delProjectById', {projectUID: pId}).then(res => {
            // this.log('delProjectById', res)
            if (res.code === 200) {
              this.$Message.info('删除成功！')
              this.$Modal.remove()
              that.queryMyProjectView()
              if (pType === '集团战略') {
                that.$store.state.menuRefresh = true
              }
            }
          })
        },
        onCancel: () => {
          // this.$Message.info('Clicked cancel')
        }
      })
    },
    // 新增搜索项目
    searchPro: function (iptName) {
      this.log('iptName:', iptName)
      this.myProjectViewPayload.projectName = iptName
      this.queryMyProjectView()
    },
    // 新增 查询用户信息
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
    // 查询个人项目列表 (项目卡片)
    // queryProjectTypeList () {
    //   // var that = this
    //   this.ajax('/general/myProjectList', {}).then(res => {
    //     console.log('项目类型:', res)
    //     if (res.code === 200) {
    //       // res.data.list
    //     }
    //   })
    // },
    // 查询个人项目列表 (项目卡片)
    queryMyProjectView () {
      var that = this
      this.ajax('/myProject/myProjectView', that.myProjectViewPayload).then(res => {
        // console.log('项目卡片', res)
        if (res.code === 200) {
          // res.data.list
          this.pageTotalRow = res.data.totalRow
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
          that.projectViewData = res.data.list
        }
      })
    },
    // 新建 点击项目列表项 前往项目详请
    toProDetail: function (id) {
      this.$store.state.proId = id
      this.$router.push('/goodsDetail')
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
      // this.$Message.info('Clicked cancel')
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
      this.ruleForm.value2.push(result)
      this.ruleForm.value2.push(resultEnd)
      console.log(this.ruleForm.value2)
    },
    // 新建 点击顶部新建项目按钮
    newAdd: function () {
      var that = this
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
    // 新建 新建项目 模板选择 打开相应的表单
    openProCreatedForm: function (modelId) {
      this.newAddDiaModel = true
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
    ctime (e) {
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
    // 新建项目 立即创建项目 (模板) 提交基本信息
    submitModelForm (formName) {
      var that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (that.Mid) {
            that.ajax('/myProject/addModelProject',
              {
                projectName: this.ruleForm.projectName,
                projectType: this.ruleForm.projectType,
                startDate: this.ruleForm.value2[0],
                endDate: this.ruleForm.value2[1],
                projectManagerID: that.Mid,
                projectManager: this.ruleForm.projectManager,
                modelId: that.modId,
                introduction: this.ruleForm.introduction,
                // 附件ID
                attachmentId: that.SetFileIdStr(),
                // 如果项目类型是产品研发 projectClassifyId为研发下的分类ID
                projectClassifyId: that.ruleForm.projectClassifyId
              }).then(res => {
              console.log('立即创建(muban):', res)
              that.$Modal.remove()
              that.newAddDialog = false
              that.newAddDiaModel = false
              if (res.code === 200) {
                // 通知附件上传子组件清空附件域
                that.IsClear = true
                that.projectUID = res.data
                that.$store.state.proId = res.data
                that.createProFormLoading = false
                // that.$router.push('/ProDetail')
                if (that.ruleForm.projectType === '产品研发') {
                  this.dialogGoods = true
                } else {
                  this.$router.push('/goodsDetail')
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
    // 去完善信息
    perfectInfo () {
      this.proId = this.$store.state.proId
      this.$router.push('/goodsDetail')
      this.$store.state.goPerfect = true
      this.goodsEdit = true
      this.dialogGoods = false
    },
    // 跳过
    jumpInfo () {
      this.$router.push('/goodsDetail')
    },
    // 商品上传成功后续
    ProBaseInfoCallbackFuc (res) {
      var that = this
      if (res.code === 200) {
        that.$Message.success('保存成功!')
        that.$router.push('/goodsDetail')
        that.goodsEdit = false
      } else {
        that.$message({
          message: res.msg,
          type: 'warning'
        })
      }
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
                introduction: that.ruleForm.introduction,
                attachmentId: that.SetFileIdStr(),
                // 如果类型是产品研发，下面的分类id
                projectClassifyId: that.ruleForm.projectClassifyId
              }).then(res => {
              console.log('立即创建:', res)
              that.$Modal.remove()
              that.newAddDialog = false
              that.newAddDiaModel = false
              if (res.code === 200) {
                that.IsClear = true
                that.projectUID = res.data
                that.$store.state.proId = res.data
                if (that.ruleForm.projectType === '产品研发') {
                  this.dialogGoods = true
                } else {
                  this.$router.push('/goodsDetail')
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
    commentPageChange: function (e) {
      this.pageN = e
      this.getHistoryCont()
    }
  }
}
</script>

<style scoped>
.MyProCnt{
  min-width: 600px;
  /*max-width: 1000px;*/
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
  .el-col-self:nth-child(2n + 1){
    margin-right: 10px;
  }
  .proTypePath{
    font-size: 12px;
    padding-left: 100px;
    margin-top: -16px;
    color: #777;
    margin-bottom: 10px;
  }
  /*历史记录 start*/
  .el-textarea{
    margin-top: 15px;
    margin-left: 0px;
  }
  .el-textarea__inner{
    width: 100%;
    min-height: 80px;
  }
  .cannetProject2{
    width: 100%;
    color: #1296db;
    display: flex;
    justify-content: space-between;
    line-height: 40px;
    font-size: 14px;
    /*font-family: '黑体';*/
    padding:0 10px;
    background-color: #f5f8fa;
  }
  .cannetProject2 div img{
    float: left;
    margin-top: 10px;
    margin-right: 10px;
    width: 18px;
  }
  .showFileName{
    float: right;
    margin-left: 10px;
  }
  /*新增 操作记录*/
  .TimeLine:last-of-type .timeCont{
    border-left: none !important;
  }
  .quan{
    width: 17px;
    height: 17px;
    border: 1px solid #3a8ee6;
    border-radius: 8px;
    display: inline-block;
    line-height:17px;
    text-align: center;
    font-size: 10px;
    color: #3a8ee6;
  }
  .timeDate{
    display: inline-block;
    margin-left: 16px;
    position: absolute;
    top: 4px;
    font-weight: bold;
  }
  .timeCont{
    padding-top: 20px;
    margin-left: 8px;
    border-left: 1px solid #ddd;
    padding-left: 30px;
    font-size: 14px;
    color: #999;
    padding-bottom: 1px;
  }
  .contBoxContentWrap{
    margin-top: 6px;
    margin-bottom: 6px;
    background-color: #f5f5f5;
  }
  .contentHide .contBoxContentWrap{
    display: none;
  }
  .contentHide .contBoxContent{
    display: none;
  }
  .contentShow .contBoxContent{
    display: block;
  }
  .contBoxContent{
    color: #999;
    font-size: 12px;
    padding-left: 8px;
    line-height: 22px;
  }
  .filepre{
    color: #3a8ee6;
    margin-right: 10px;
    cursor: pointer;
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
.nodata div img{
  width: 100%;
}
  .file:hover {
    background: #AADFFD;
    border-color: #78C3F3;
    color: #004974;
    text-decoration: none;
  }
  .showImg>img{
    width: 100%;
  }
  /*历史记录 start*/
  /*历史记录 end*/
</style>
<style>
  el-col-self:nth-child(2n + 1){
    margin-right: 10px;
  }
</style>
