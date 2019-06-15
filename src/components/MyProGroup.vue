<template>
  <div class="MyPro">
    <div>{{getSelectProjectType?'' : ''}}</div>
    <div class="MyProCnt">
      <div class="MyProHeader">
        <div>
          <div class="MyProHeaItem search">
            <Input search enter-button @on-search="searchPro" v-model="searchProVal" placeholder="请输入要查找的项目" />
          </div>
          <div class="MyProHeaItem search">
            <Input search enter-button @on-search="searchProManager" v-model="searchProManagerVal" placeholder="请搜索项目负责人姓名" />
          </div>
        </div>
        <!--<div class="MyProHeaItem addBtn"><Button type="primary" v-on:click="newAdd()">新增项目</Button></div>-->
      </div>
      <!--tabs 切换-->
      <div class="tabsTit">
        <Tabs v-model="statusVal">
          <TabPane label="全部" name=""></TabPane>
          <TabPane label="进行中" name="2"></TabPane>
          <TabPane label="已完成" name="3"></TabPane>
          <TabPane label="未开始" name="0"></TabPane>
          <TabPane label="已暂停" name="4"></TabPane>
        </Tabs>
      </div>
      <div class="content" style="margin-top: 15px;">
        <div style="padding: 0px;" class="clear">
          <div style="margin-bottom: 15px; float: left; width: 50%; min-width: 571px; padding-right: 20px;box-sizing: border-box;" @click.stop="toProDetail(item.projectUID)" v-for="item in projectViewData" :key="item.projectUID">
            <Card :bordered="true">
              <div class="groupItemTit" slot="title" :title="item.projectName">
                <div class="groupItemTitCnt" @click="toProDetail(item.projectUID)"><span style="color: #888; font-weight: normal">{{item.projectType}}</span>：{{item.projectName}}</div>
                <div class="taskStateBiaoNew" v-bind:class="item.tagStyle">{{item.statusInfo}}</div>
              </div>
              <a href="#" slot="extra" v-if="item.timeoutButton === 1" @click.stop="stopePro(item.projectUID)" style="margin-left: 6px;" title="暂停">
                <Icon type="ios-pause" style="font-size: 20px;"/>
              </a>
              <a href="#" slot="extra" v-if="item.timeoutButton === 2" @click.stop="startPro(item.projectUID)" style="margin-left: 6px;" title="开启">
                <Icon type="ios-play" style="font-size: 20px;"/>
              </a>
              <a href="#" slot="extra" @click.stop="responsePro(item.projectUID)" style="margin-left: 6px;" title="回复">
                <Icon type="ios-create" style="font-size: 20px;"/>
              </a>
              <a href="#" slot="extra" v-if="item.isDelProject" @click.stop="delPro(item.projectUID, item.projectType)" style="margin-left: 6px;" title="删除">
                <Icon type="ios-trash" style="font-size: 20px;color:#2D8CF0"/>
              </a>
              <div style="display: flex; justify-content: space-between;">
                <div style="width: 50%; display: flex;">
                  <div class="textIntro">负责人：{{item.projectManager}}</div>
                  <div style="width: 150px; margin-left: 10px;">
                    <Progress :percent="item.proportion" :stroke-width="5" status="active" />
                  </div>
                </div>
                <div style="width: 50%; text-align: right; color: #888"><span style="margin-left: 15px;">{{item.startDate}} 至 {{item.endDate}}</span></div>
              </div>
            </Card>
          </div>
        </div>
        <div class="nodata" v-if="projectViewData.length === 0">
          <div style="width:165px; margin: 0 auto; margin-top: 50px;"><img src="../../static/img/nodata.png" /></div>
          <div style="text-align: center; color: #666; margin-top: 15px; font-size: 14px;">暂无数据</div>
        </div>
      </div>
    </div>
    <el-dialog title="项目暂停" :visible.sync="projectStopeVisible" width="350px" center>
      <span style="font-size: 15px;">请选择您要暂停项目的方式</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="stopeProject(stopeId, '1')">只暂停项目</el-button>
        <el-button type="primary" size="mini" @click="stopeProject(stopeId, '2')">暂停项目和任务</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="项目开启"
      :visible.sync="projectStopeVisible2"
      width="350px"
      center>
      <span style="font-size: 15px;">确定开启项目且修改时间吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="startProject(stopeId)">开启不修改时间</el-button>
        <el-button type="primary" size="mini" @click="startEditProject()">开启修改时间</el-button>
      </span>
    </el-dialog>
    <!--<el-dialog title="图片预览" :visible.sync="dialogShowImg">-->
      <!--<div class="showImg"><img v-bind:src="commentPreviewUrl" alt=""></div>-->
    <!--</el-dialog>-->
    <!--产品研发 end-->
    <!--抽屉 回复 历史记录-->
    <!--新增 抽屉 查看历史记录 start-->
    <Drawer title="历史记录" width="740" :closable="false" v-model="DrawerHistory">
      <div @click="hidePanel">
        <div class="el-textarea" v-loading="historyLoading">
          <!--enctype="multipart/form-data"-->
          <form id="uploadFile">
            <div class="peopleList" style="right: 0;top: 0;" v-if="selectUserDiaShow2">
              <Input prefix="ios-search-outline" placeholder="请输人员姓名或拼音(如'张三'或 'zs')" style="width: 270px"  autofocus v-model="searchPeople" v-focus ref="re"/>
              <ul>
                <li v-for="(item, index) in options42" :key="index" @click="checkPeople(item)">{{item.Name + ' (' + item.jName + ')'}}</li>
              </ul>
            </div>
            <textarea
              name="content"
              class="el-textarea__inner"
              id="textArea"
              type="text"
              v-model="commitComent"
              v-on:input="inputFunt"
              @keyup.delete ="deleteText"
              @keyup.shift.50="inputConent"
              @click="getTxt1CursorPosition"
              v-focus
            ></textarea>
            <div class="cannetProject2">
              <div>
                <component v-bind:is="compArr.FileUploadComp" fileFormId="proHistory" v-bind:clearInfo="IsClear" v-on:FileDataEmit="GetFileInfo"></component>
              </div>
              <div><i-button type="info" v-bind:disabled="butnDisabled" @click="addMarkInfo()">回复</i-button></div>
            </div>
          </form>
        </div>
         <!--操作记录-->
        <div class="discription lis" style="margin-top: 15px;">
          <!-- 历史记录 评论 引入组件-->
          <component v-bind:is="compArr.CommentLogs" fileFormId="ProCommentLogs" :commentList="taskLogs"></component>
          <div style="text-align: center">
            <Page :total="commentTotalNum" size="small" :page-size="10" show-total ref="currentPageNum" @on-change="commentPageChange($event)"></Page>
          </div>
        </div>
      </div>
    </Drawer>
    <!--<el-dialog title="图片预览" :visible.sync="dialogShowImg1">-->
      <!--<div class="showImg"><img v-bind:src="commentPreviewUrl1" alt=""></div>-->
    <!--</el-dialog>-->
    <!--分页 start-->
    <div style="padding: 10px 0 30px 0; text-align: center;">
      <!--<Page :total="pageTotalRow" :page-size="10" :current="myProjectViewPayload.pageNum" size="small" @on-change="pageNumChange" />-->
      <el-pagination
        @current-change="pageNumChange($event)"
        background
        :current-page = 'myProjectViewPayload.pageNum'
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="pageTotalRow">
      </el-pagination>
    </div>
    <!--分页 end-->
  </div>
</template>

<script>
import CommentLogs from './CustomComp/CommentLogs.vue'
import FileUploadComp from './CustomComp/FileUploadComp.vue'
import goodsInfo from './CustomComp/goodsInfo.vue'
import ProBaseInfo from './CustomComp/ProBaseInfo.vue'
export default {
  name: 'MyPro',
  components: {
    FileUploadComp,
    CommentLogs,
    ProBaseInfo,
    goodsInfo
  },
  data () {
    return {
      // 光标位置
      position: 0,
      // 搜索组织架构人员
      searchPeople: '',
      // @成员
      peopleList: [],
      // refshPlan: false
      loading22: false,
      // 获取默认的人员
      options42: [],
      // @人员
      peopleValue: [],
      // 判断是否出现@人员
      selectUserDiaShow2: false,
      commentTotalNum: 0,
      // commentPreviewUrl1: '',
      // dialogShowImg1: false,
      // 加载转圈
      createProLoading: false,
      projectStopeVisible: false,
      projectStopeVisible2: false,
      stopeId: '',
      // shi
      DrawerBaseEdit: false,
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
        ProBaseInfo: 'ProBaseInfo',
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
      // data2: [],
      // 产品研发 显示具体类型
      projectPath: '',
      projectPathId: '',
      // 新增 对话框 产品研发
      // dialogFormVisible: false,
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
      searchProManagerVal: '',
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
      // 项目分类列表
      proTypeListPure: this.$store.state.projectType,
      // dialogShowImg: false,
      // commentPreviewUrl: '',
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
        projectManager: '',
        userId: this.$store.state.userId,
        // 项目状态（0:未开始； 2：进行中:3：已完成;"":全部）
        status: '',
        pageNum: 1,
        // 类型（1:我创建的；2:我负责的; 3:我参与的;"":全部）
        type: '',
        // 项目类型 公司项目:'0' 部门项目:'1' 小组项目:'2' 个人项目:'3' 集团战略:'4' 产品研发:'5'  全部: ''
        projectType: '4',
        // 项目分类记录id
        projectClassifyId: '',
        pageSize: 10
      },
      pickerOptions0: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  created: function () {
    // 查询用户信息
    this.getUserInfo()
  },
  mounted: function () {
    /** 设置侧边栏激活状态 */
    this.$store.commit('setNavActive', {navName: '集团战略', childNavName: ''})
  },
  computed: {
    getSelectProjectType: function () {
      var that = this
      // that.log('abcdefg')
      // that.model2 = that.$store.state.selectProjectType
      that.myProjectViewPayload.projectType = that.$store.state.selectProjectType
      this.queryMyProjectView()
      return this.$store.state.selectProjectType
    }
  },
  watch: {
    // 历史记录 显示与隐藏
    DrawerHistory: function (val, old) {
      if (!val) {
        // this.log('DrawerHistory:', val)
        this.pageN = 1
        // this.currentPageNum = 1
        this.$refs['currentPageNum'].currentPage = 1
        // this.log('currentPageNum:', this.currentPageNum)
      }
    },
    // 历史记录输入框
    commitComent: function (val, oVal) {
      if (val) {
        this.butnDisabled = false
      } else {
        this.butnDisabled = true
      }
      let str = val.charAt(val.length - 1)
      if (str === '@') {
        this.selectUserDiaShow2 = true
        this.searchPeople = ''
        if (this.selectUserDiaShow2) {
          setTimeout(() => {
            this.$refs['re'].focus()
          }, 200)
        }
      } else {
        this.selectUserDiaShow2 = false
      }
    },
    searchPeople: function (val, old) {
      if (val) {
        this.getPeople()
      }
      if (val === '') {
        this.searchPeople = ''
        this.getPeople()
      }
    },
    pageNum: function (val, old) {
      this.myProjectViewPayload.pageNum = val
      this.log(22222)
      this.queryMyProjectView()
    },
    searchProVal: function (val, old) {
      this.log(33333)
      this.myProjectViewPayload.projectName = val
      this.queryMyProjectView()
      // if (val) {
      //   this.queryMyProjectView()
      // }
    },
    searchProManagerVal: function (val, oV) {
      this.myProjectViewPayload.projectManager = val
      this.queryMyProjectView()
    },
    statusVal: function (val1, val2) {
      if (val1) {
        this.myProjectViewPayload.status = val1
      } else {
        this.myProjectViewPayload.status = ''
      }
      this.myProjectViewPayload.pageNum = 1
      this.queryMyProjectView()
    }
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.focus()
      }
    }
  },
  methods: {
    // 获取当前光标的位置
    getPosition (element) {
      let cursorPos = 0
      if (document.selection) { // IE
        var selectRange = document.selection.createRange()
        selectRange.moveStart('character', -element.value.length)
        cursorPos = selectRange.text.length
      } else if (element.selectionStart || element.selectionStart === '0') {
        cursorPos = element.selectionStart
      }
      this.position = cursorPos
    },
    // 调取获取光标的位置
    getTxt1CursorPosition (e) {
      this.getPosition(e.target)
    },
    // 设置光标位置
    setCaretPosition (ctrl, pos) {
      if (ctrl.setSelectionRange) {
        ctrl.focus()
        ctrl.setSelectionRange(pos, pos)
        console.log(ctrl.setSelectionRange)
      } else if (ctrl.createTextRange) {
        console.log(2)
        var range = ctrl.createTextRange()
        range.collapse(true)
        range.moveEnd('character', pos)
        range.moveStart('character', pos)
        range.select()
      }
    },
    setPos: function (o) {
      if (o.setSelectionRange) { // W3C
        setTimeout(function () {
          o.setSelectionRange(2, 2)
          o.focus()
        }, 100)
      } else if (o.createTextRange) { // IE
        var textRange = o.createTextRange()
        textRange.moveStart('character', 1)
        textRange.moveEnd('character', 0)
        textRange.select()
      }
    },
    // 点击任意区域取消弹窗
    hidePanel (event) {
      let sp2 = document.querySelector('.peopleList')
      if (sp2) {
        if (!sp2.contains(event.target)) {
          this.selectUserDiaShow2 = false
        }
      }
    },
    // 键盘删除事件
    deleteText () {
      let content = this.commitComent
      let content1 = this.commitComent
      let delBefore = content.substring(0, this.position)
      let delAfter = content1.substring(this.position)
      let position = delBefore.lastIndexOf('@', this.position)
      let str = delBefore.substring(position, this.position)
      this.peopleList.forEach((item, index) => {
        if (str === '@' + item.Name + '(' + item.jName + ')' + '\xa0' || str === '@' + item.Name + '(' + item.jName) {
          let textarea = this.commitComent
          let contentB = textarea.substring(0, position)
          let ele = document.querySelector('.el-textarea__inner')
          this.setPos(ele)
          this.commitComent = contentB + delAfter
        }
      })
    },
    // 点击获取@人员
    checkPeople (item) {
      let that = this
      that.peopleList.push(item)
      that.selectUserDiaShow2 = false
      $('.el-textarea__inner').focus()
      // that.commitComent = that.commitComent + item.Name + '(' + item.jName + ')' + '\xa0\xa0\xa0'
      let content1 = that.commitComent
      let content2 = that.commitComent
      let before = content1.substring(0, that.position)
      let after = content2.substring(that.position)
      let ele = document.querySelector('.el-textarea__inner')
      that.setPos(ele)
      that.commitComent = before + item.Name + '(' + item.jName + ')' + '\xa0\xa0' + after
    },
    // 获取默认的人员
    getPeople () {
      let that = this
      that.ajax('/myProject/autoCompleteNames', {projectManager: that.searchPeople, projectId: that.proId}).then(res => {
        if (res.code === 200) {
          that.options42 = res.data
          this.loading22 = false
        }
      })
    },
    // 检测历史记录输入功能
    inputFunt (e) {
      this.getTxt1CursorPosition(e)
    },
    // 获取@的事件
    inputConent () {
      this.selectUserDiaShow2 = true
      this.searchPeople = ''
      if (this.selectUserDiaShow2) {
        setTimeout(() => {
          this.$refs['re'].focus()
        }, 200)
      }
    },
    // 预览
    // GetFilePreData (obj) {
    //   this.log('obj::', obj)
    //   if (obj.previewUrl && this.isImage(obj.fileName)) {
    //     this.showBigImage1(obj.previewUrl)
    //   }
    // },
    // showBigImage1: function (url) {
    //   if (url) {
    //     this.commentPreviewUrl1 = url
    //     this.dialogShowImg1 = true
    //   }
    // },
    // 确定选择
    // getPathProject: function () {
    //   this.dialogFormVisible = false
    // },
    // 新增 产品研发
    // handleClick: function (data, checked, node) {
    //   var that = this
    //   // that.log('产品研发子级data：', data)
    //   // that.log('产品研发子级checked：', checked)
    //   that.i++
    //   if (that.i % 2 === 0) {
    //     if (checked) {
    //       that.$refs.treeForm.setCheckedNodes([])
    //       that.$refs.treeForm.setCheckedNodes([data])
    //     } else {
    //       that.$refs.treeForm.setCheckedNodes([])
    //     }
    //   }
    // },
    // 新增
    // getFileName: function () {
    //   var filePath = $('#myfile').val()
    //   var arr = filePath.split('\\')
    //   var fileName = arr[arr.length - 1]
    //   $('.showFileName').html(fileName)
    // },
    // 新增 点击“回复”按钮
    addMarkInfo () {
      var that = this
      that.addProjectCommentPayload.contentId = that.proId
      that.addProjectCommentPayload.content = that.commitComent
      that.addProjectCommentPayload.attachmentId = that.SetFileIdStr()
      that.peopleList = that.peopleList.filter(item => that.commitComent.indexOf(item.Name + '(' + item.jName + ')') !== -1)
      that.addProjectCommentPayload.memberList = that.peopleList
      if (that.commitComent) {
        that.ajax('/comment/addComment', JSON.stringify(that.addProjectCommentPayload)).then(res => {
          that.log('addProjectComment:', res)
          if (res.code === 200) {
            that.IsClear = true
            that.peopleList = []
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
    // showBigImage: function (url) {
    //   if (url) {
    //     this.commentPreviewUrl = url
    //     this.dialogShowImg = true
    //   }
    // },
    // 新增 获取历史记录
    getHistoryCont () {
      var that = this
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
          that.taskLogs = res.data.list
          that.commentTotalNum = res.data.totalRow
        }
      })
    },
    pageNumChange: function (num) {
      this.log('num:', num)
      this.pageNum = num
    },
    // 点击回复 项目列表页上的回复 评论项目
    responsePro: function (pId) {
      this.proId = pId
      this.DrawerHistory = true
      this.commitComent = ''
      this.peopleList = []
      this.getPeople()
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
    // 暂停项目
    stopePro: function (pId) {
      var that = this
      that.projectStopeVisible = true
      that.stopeId = pId
    },
    stopeProject: function (id, type) {
      var that = this
      this.ajax('/myProject/timeoutProject', {projectId: id, projectOnly: type}).then(res => {
        if (res.code === 200) {
          that.queryMyProjectView()
          that.$message.success(res.msg)
          that.projectStopeVisible = false
        } else {
          that.$message.warning(res.msg)
          that.projectStopeVisible = false
        }
      })
    },
    // 开启项目
    startPro: function (pId) {
      var that = this
      that.projectStopeVisible2 = true
      that.stopeId = pId
    },
    startProject: function (id) {
      var that = this
      that.ajax('/myProject/timeonProject', {projectId: id}).then(res => {
        if (res.code === 200) {
          that.queryMyProjectView()
          that.$message.success('项目已开启')
          that.projectStopeVisible2 = false
        } else {
          that.$message.warning(res.msg)
          that.projectStopeVisible2 = false
        }
      })
    },
    startEditProject: function () {
      var that = this
      that.DrawerBaseEdit = true
      that.projectStopeVisible2 = false
    },
    // 新增搜索项目
    searchPro: function (iptName) {
      this.myProjectViewPayload.pageNum = 1
      this.myProjectViewPayload.projectName = iptName
      this.queryMyProjectView()
    },
    searchProManager: function (iptName) {
      this.log('iptName:', iptName)
      this.myProjectViewPayload.pageNum = 1
      this.myProjectViewPayload.projectManager = iptName
      this.log(9999999)
      this.queryMyProjectView()
    },
    // 新增 查询用户信息
    getUserInfo: function () {
      var that = this
      this.ajax('/myProject/getUserInfo', {}).then(res => {
        if (res.code === 200) {
          // console.log('getUserInfo', res)
          that.$store.state.userId = res.data.ID
          that.Mid = res.data.ID
        }
      })
    },
    // 查询个人项目列表 (项目卡片)
    queryMyProjectView () {
      var that = this
      this.ajax('/myProject/organizeStrategy', that.myProjectViewPayload).then(res => {
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
            } else if (res.data.list[i].state === '4') {
              res.data.list[i].tagStyle = 'stoped'
              res.data.list[i].statusInfo = '已暂停'
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
    // 获取附件上传组件发来的附件信息
    GetFileInfo (obj) {
      if (obj) {
        this.IsClear = false
      }
      this.FileUploadArr = obj
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

<style>
  .ivu-card{
    box-shadow:0 1px 6px rgba(0,0,0,.1)
  }
  .ivu-card:hover{
    box-shadow:0 1px 6px rgba(45,140,240,.6)
  }
  .ivu-card .groupItemTit{
    display: flex;
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    font-weight: 700;
  }
  .ivu-card:hover .groupItemTit{
    color: #2d8cf0;
  }
</style>
<style scoped>
.MyProCnt{
  min-width: 600px;
  /*max-width: 1000px;*/
}
  .clear:after{ content: ""; display: block;height: 0;visibility: hidden;clear: both;}
  .groupItemTit{
    color: #555;
  }
  .groupItemTitCnt{
    max-width:250px;
    font-size: 16px;
    overflow:hidden;
    cursor: pointer;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  .textIntro{
    width: 100px;
    color: #888;
  }
  .MyProHeader{
    display: flex;
    padding: 10px;
    justify-content: space-between;
    background-color: #f5f8fa;
  }
  .MyProHeaItem.search:nth-of-type(2){
    margin-left: 20px;
  }
  .MyProHeaItem.search{
    width: 400px;
    display: inline-block;
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
  .taskStateBiao.stoped{
    background-color: #e97474;
  }
  .taskStateBiaoNew{
    text-align: center;
    padding: 0px 5px;
    font-size: 12px;
    margin-left: 10px;
    border-radius: 6px;
  }
  .taskStateBiaoNew.noStart{
    color: #ffb400;
    border: 1px solid #ffb400;
  }
  .taskStateBiaoNew.isDoing{
    color: #13ce66;
    border: 1px solid #13ce66;
  }
  .taskStateBiaoNew.finished{
    color: #3a8ee6;
    border: 1px solid #3a8ee6;
  }
  .taskStateBiaoNew.stoped{
    color: #ccc;
    border: 1px solid #ccc;
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
.peopleList {
  width:300px;
  height: 370px;
  padding: 20px 10px;
  background-color: #fff;
  position: absolute;
  z-index: 200;
  border-radius: 6px;
  box-shadow: 0 2px 10px 0 rgba(0,0,0,.2);
}
.peopleList ul {
  list-style: none;
  width:270px;
  max-height:300px;
  overflow: auto;
  margin-top:10px;
}
.peopleList ul li{
  list-style: none;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #f2f2f2;
  cursor: pointer;
}
.peopleList ul li:hover{
  background: #f5f8fa;
}
  /*历史记录 start*/
  /*历史记录 end*/
</style>
<style>
  el-col-self:nth-child(2n + 1){
    margin-right: 10px;
  }
</style>
