<template>
  <div class="ProDetail" style="position: relative;margin-top: 15px;">
    <div>{{getStoreProId?'':''}} {{slideMenu?'':''}} {{slideMenuGroup ? '' : ''}}</div>
    <!-- Part01 start 项目标题 项目简介 项目一级计划 基本信息入口 历史记录入口 等-->
    <div class="fileModel" v-if="showFileModel">
      <div style="text-align: center;height: 30px;line-height: 30px;color: #999;border-bottom: 1px solid #f1f1f1">共 <span style="color: chocolate;font-size: 16px;font-weight: bold;">{{proDetailMsg.fileList.length}}</span> 个附件</div>
      <div class="fileItem" v-for="fileItem in proDetailMsg.fileList" :key="fileItem.previewUrl">
        <div style="width: 60%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;" :title="fileItem.showName">{{fileItem.showName}}</div>
        <div class="fileDone">
          <div style="width: 50%;cursor: pointer" v-if="fileItem.isImg" @click="showImagePre(fileItem.previewUrl, fileItem.showName)">预览</div>
          <div style="width: 50%;"><a v-bind:download="fileItem.showName" v-bind:href="fileItem.downloadUrl">下载</a></div>
        </div>
      </div>
      <div class="fileItem" style="position: relative;margin-top: 20px;border-bottom: none">
        <div class="fileClose" @click="fileClose()">关闭</div>
      </div>
    </div>
    <el-dialog title="图片预览" :visible.sync="dialogFormVisible">
      <div class="showImg"><img v-bind:src="showFileUrl" alt=""></div>
    </el-dialog>
    <div class="topperTitle">
      <div class="topCon">
        <div class="topConLf">
          <div class="title">{{proDetailMsg.projectName}}</div>
          <div class="proDetail" v-bind:title="proDetailMsg.content">{{proDetailMsg.content}}</div>
        </div>
        <div class="topConRt">
          <div>
            <div class="myMsg">
              <div><img src="../../static/img/my.png" alt=""></div><div style="margin-left: 10px;">{{proDetailMsg.projectManager}}</div>
            </div>
            <div class="dataMsg"><div><img src="../../static/img/data.png" alt=""></div><div style="margin-left: 10px;">{{startPlanDate}} 到 {{endPlanDate}}</div></div>
            <div class="myMsg">
              <div style="color: #28558c; font-size: 20px; margin-top: -6px"><Icon type="ios-image" /></div>
              <div style="margin-left: 10px; color: #28558c;">附件:
                <span v-if="proDetailMsg.fileList && proDetailMsg.fileList.length > 0">
                    <span style="cursor: pointer;color: #409EFF;font-size: 14px;" @click="showFileModelClick()">查看附件</span>
                  </span>
                <span style="color: #aaa;font-size: 14px" v-if="!proDetailMsg.fileList || proDetailMsg.fileList.length === 0">暂无附件</span>
              </div>
            </div>
            <div class="editHistoryBtn" style="margin-top: 8px; color: #2d8cf0;">
              <Icon size="20" style="margin-top: -3px;" type="ios-create-outline" />
              <span style="margin-right: 10px; margin-left: 5px;" v-on:click="proBaseEditClick()">基本信息</span>
              <Icon size="20" style="margin-top: -3px;" type="ios-time-outline" />
              <span style="margin-left: 5px;" v-on:click="openHisDrawer">历史记录</span>
            </div>
          </div>
          <div class="imgBox" v-if="proDetailMsg.state === '0'"><img src="../../static/img/unstart.png" alt=""></div>
          <div class="imgBox" v-if="proDetailMsg.state === '2'"><img src="../../static/img/doing.png" alt=""></div>
          <div class="imgBox" v-if="proDetailMsg.state === '3'"><img src="../../static/img/finish.png" alt=""></div>
        </div>
      </div>
      <!-- 项目成员列表 -->
      <div class="memList">
        <div class="memName"><Icon size="30" type="ios-person-outline" /></div>
        <div class="memBox">
          <div v-if="memberList.length > 0" v-for="(member, memIndex) in memberList" v-bind:key="member.userName + '-' + memIndex">{{member.userName}}</div>
          <div class="moreBtn" v-on:click="moreMemberClick()">
            <Button size="small" style="width: 84px;" type="primary">更多 / 编辑</Button>
          </div>
        </div>
      </div>
      <!-- 一级计划 项目计划 start -->
      <div class="planList">
        <div class="planName">项<br />目<br />计<br />划</div>
        <div class="planBox" style="position: relative;">
          <div v-if="planList.length > 0" v-bind:class="activeId === plan.id ? 'active' : ''" v-for="plan in planList" v-bind:key="plan.id" @click="FirstLevelNodeClick(plan.id, 'QueryFirstLevelChild', $event,)">{{plan.name}}</div>
          <Button style="width: 84px; margin-top: 16px; margin-left: 20px; position: absolute; right: 1px;" size="small" type="primary" v-on:click="FistLevelPlanDetail()">添加 / 编辑</Button>
        </div>
      </div>
    </div>
    <!-- Part01 end -->
    <!-- Part02 start 项目详情 title -->
    <div class="devide">
      <div class="proTreeHeader">
        <div>项目详情</div>
        <div v-if="planList.length > 0" style="padding-right: 6px;">
          <Button size="small" type="primary" style="width: 84px;" v-on:click="addNode(activeId)">+ 计划 / 任务</Button>
        </div>
      </div>
    </div>
    <!--项目计划树 树形结构 老版本 start-->
    <div class="block">
      <el-tree
        :data="data5"
        node-key="id"
        @node-expand="getNodeMsg($event)"
        :expand-on-click-node="false">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span class="dataName" @click="showDetailPage(data)">{{data.name}}</span>
            <span class="proMsg">
              <span class="treeName">
                <span v-if="data.type === '2'">
                  <span style="float: left"><img style="width: 16px;" src="../../static/img/my.png" alt=""></span>
                  <span style="float: left;margin-left: 16px;">{{data.userName}}</span>
                </span>
              </span>
              <span class="treeState">
                 <span v-if="data.type === '2'">
                  <span style="float: left"><img style="width: 16px;" src="../../static/img/noted.png" alt=""></span>
                  <span v-if="data.status === '0'" style="float: left;margin-left: 16px;color: #ffd04b;">未确认</span>
                  <span v-if="data.status === '1'" style="float: left;margin-left: 16px;color: #53b5ff;">进行中</span>
                  <span v-if="data.status === '2'" style="float: left;margin-left: 16px;color: #27CF97;">已完成</span>
                 </span>
              </span>
              <span class="treeTime">
                <span style="float: left"><img style="width: 16px;" src="../../static/img/data.png" alt=""></span>
                <span style="float: left;margin-left: 16px;">{{data.start}} - {{data.finish}}</span>
              </span>
              <span class="treeTime">
                <Dropdown @on-click="moreSelectOptions($event, data.id, data.type, data)">
                  <a href="javascript:void(0)">更多操作<Icon type="ios-arrow-down"></Icon></a>
                  <DropdownMenu slot="list">
                    <DropdownItem name="add">添加</DropdownItem>
                    <DropdownItem name="del">删除</DropdownItem>
                    <DropdownItem name="edit">编辑</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </span>
            </span>
          </span>
      </el-tree>
    </div>
    <!-- Part02 end -->
    <!-- Part05 start 抽屉 任务详情 -->
    <Drawer title="任务详情" class="drawerScroll" :closable="false" width="750" v-model="TaskDetailCompShow">
      <component v-bind:is="compArr.TaskDetailComp"
                 v-bind:taskDrawerOpen="TaskDetailCompShow"
                 v-bind:modifyTaskRes="modifyTaskRes"
                 v-on:FilePreEmit="GetFilePreData"
                 v-on:toPlanDetail="toPlanDetailFuc"
                 v-on:showEditForm="showEditFormFuc"
                 v-on:ActionResThrow="ActionResThrowFuc"
                 v-on:TaskDelCallback="TaskDelCallbackFuc"
                 :nodeId="currentNodeId">
      </component>
    </Drawer>
    <!-- Part06 start 抽屉 计划详情 -->
    <Drawer title="计划详情" class="drawerScroll" :closable="false" width="750" v-model="value444">
      <component v-bind:is="compArr.PlanDetailComp"
                 v-bind:taskDrawerOpen="value444"
                 :nodeId="currentNodeId"
                 v-on:ActionResThrow="ActionResThrowFuc"
                 v-on:addChildMsg="addChildMsgFuc"
                 v-on:toChildMsg="toChildMsgFuc"
                 v-on:PlanDelCallback="PlanDelCallbackFuc">
      </component>
    </Drawer>
    <!-- Part03 start 抽屉 成员管理 -->
    <Drawer title="成员管理" width="740" :closable="false" v-model="DrawerMember" v-loading="DrawerMemberShow">
      <component v-bind:is="compArr.MemberComp" v-bind:proId="proId" v-bind:DrawerMemberShow="DrawerMember" v-on:addMembersInfo="updataPageInfo" v-on:delMembersInfo="updataPageDelMember" v-on:addPeopleInfo="updataPageAddPeople"></component>
    </Drawer>
    <!-- Part03 end -->
    <!--新增 抽屉 编辑基本信息 修改基本信息 start-->
    <Drawer title="基本信息" width="740" :closable="false" v-model="DrawerBaseEdit">
      <component v-bind:is="compArr.ProBaseInfo"
                 fileFormId="BaseInfoEdit"
                 v-on:FilePreEmit="GetFilePreData"
                 v-bind:ProBaseInfoShow="DrawerBaseEdit"
                 v-on:ProBaseInfoCallback="ProBaseInfoCallbackFuc"
                 :proId="proId">
      </component>
    </Drawer>
    <!--新增 抽屉 一级计划详情 start -->
    <Drawer title="一级计划 / 任务" width="740" :closable="false" v-model="FirstLevelTask">
      <div class="tableHeader">
        <div class="tableProTitle">项目名:{{proDetailMsg.projectName}}</div>
        <div class="tableProBtn" style="margin-bottom: 10px;">
          <Button type="primary" size="small" v-on:click="addNode(firstPlanId)">添加一级</Button>
        </div>
      </div>
      <el-table :data="FirstLevelPlanList" border style="width: 100%">
        <el-table-column prop="planName" label="计划/任务" width="280"></el-table-column>
        <el-table-column prop="planType" label="类型" width="70"></el-table-column>
        <el-table-column prop="planDateDur" label="时间" width="200"></el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template slot-scope="scope">
            <el-button @click="planHandleClick(scope.row, 'edit')" type="text" size="small">编辑</el-button>
            <el-button @click="planHandleClick(scope.row, 'add')" type="text" size="small">添加</el-button>
            <el-button @click="planHandleClick(scope.row, 'del')" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </Drawer>
    <!--新增 抽屉 一级计划详情 end -->
    <!--新增 抽屉 查看历史记录 start-->
    <Drawer title="历史记录" width="740" :closable="false" v-model="DrawerHistory">
      <div class="el-textarea" v-loading="loadingRe">
        <!--enctype="multipart/form-data"-->
        <form id="uploadFile">
          <textarea name="content" class="el-textarea__inner" id="textArea" type="text" v-model="commitComent"></textarea>
          <div class="hisFileUplBox">
            <div style="display: inline-block">
              <!-- 引入 附件上传 组件 -->
              <component v-bind:is="compArr.FileUploadComp" fileFormId="HistoryFileUpl" v-on:FilePreEmit="GetFilePreData" v-bind:clearInfo="IsClear" v-on:FileDataEmit="GetFileInfo"></component>
            </div>
            <div><i-button type="info" v-bind:disabled="butnDisabled" @click="addMarkInfo()">回复</i-button></div>
          </div>
        </form>
      </div>
      <!--操作记录 历史记录-->
      <div class="discription lis" style="margin-top: 15px;">
        <!-- 历史记录 评论 引入组件-->
        <component v-bind:is="compArr.CommentLogs" fileFormId="CommentLogs" v-on:FilePreEmit="GetFilePreData" :commentList="taskLogs"></component>
        <div style="text-align: center">
          <Page :total="commentTotalNum" size="small" :page-size="10" show-total @on-change="commentPageChange($event)"></Page>
        </div>
      </div>
    </Drawer>
    <!--新增 添加计划或者任务 start-->
    <Drawer class="drawerScroll" title="计划表单" :closable="false" width="40%" v-model="bgCoverShow">
      <component v-bind:is="compArr.CreatePlanOrTask" v-bind:DrawerOpen="bgCoverShow" fileFormId="CreatePlanTask" v-on:CreatePlanTaskCallback="CreatePlanTaskCallbackFuc" :nodeId="currentNodeId"></component>
    </Drawer>
    <!--新增 抽屉 编辑计划 修改计划 start-->
    <Drawer class="drawerScroll" title="编辑计划" :closable="false" width="40%" v-model="planEditShow">
      <component v-bind:is="compArr.ModifyPlan" v-bind:DrawerOpen="planEditShow" fileFormId="ModifyPlan" v-on:ModifyPlanCallback="ModifyPlanCallbackFuc" :nodeId="currentNodeId"></component>
    </Drawer>
    <!--修改任务 编辑任务 任务 修改-->
    <Drawer class="drawerScroll" title="修改任务" :closable="false" width="40%" v-model="modifyTaskVisible">
      <!-- 修改任务 编辑任务 引入组件 -->
      <component v-bind:is="compArr.ModifyTask"
                 v-bind:DrawerOpen="modifyTaskVisible"
                 fileFormId="ModifyTask"
                 v-on:FilePreEmit="GetFilePreData"
                 v-on:ModifyTaskCallback="ModifyTaskCallbackFuc"
                 v-on:ShutCompEmit="ShutCompEmitFuc"
                 :nodeId="currentNodeId">
      </component>
    </Drawer>
    <!--删除确认-->
    <Modal v-model="modal2" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>将删除此项及其下的所有子项.</p>
        <p>确定要删除?</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="modal_loading" @click="delNode">确认删除</Button>
      </div>
    </Modal>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="dialogShowImg1">
      <div class="showImg"><img v-bind:src="commentPreviewUrl1" alt=""></div>
    </el-dialog>
  </div>
</template>

<script>
import FileUploadComp from './FileUploadComp.vue'
import CommentLogs from './CustomComp/CommentLogs.vue'
import CreatePlanOrTask from './CustomComp/CreatePlanOrTask.vue'
import ModifyPlan from './CustomComp/ModifyPlan.vue'
import ModifyTask from './CustomComp/ModifyTask.vue'
import TaskDistribute from './CustomComp/TaskDistribute.vue'
import ProBaseInfo from './CustomComp/ProBaseInfo.vue'
import MemberComp from './CustomComp/MemberComp.vue'
import TaskDetailComp from './CustomComp/TaskDetailComp.vue'
import PlanDetailComp from './CustomComp/PlanDetailComp.vue'
// DrawerComp
export default {
  name: 'ProDetail',
  components: {
    CommentLogs,
    ModifyPlan,
    ModifyTask,
    FileUploadComp,
    CreatePlanOrTask,
    TaskDistribute,
    ProBaseInfo,
    MemberComp,
    TaskDetailComp,
    PlanDetailComp
  },
  data () {
    return {
      // 引入组件
      compArr: {
        ModifyTask: 'ModifyTask',
        ModifyPlan: 'ModifyPlan',
        CommentLogs: 'CommentLogs',
        FileUploadComp: 'FileUploadComp',
        CreatePlanOrTask: 'CreatePlanOrTask',
        TaskDistribute: 'TaskDistribute',
        ProBaseInfo: 'ProBaseInfo',
        MemberComp: 'MemberComp',
        TaskDetailComp: 'TaskDetailComp',
        PlanDetailComp: 'PlanDetailComp'
      },
      // 接收到的组件数组 新组件
      FileUploadArr: [],
      // 是否让子组件清空文件 新组件
      IsClear: false,
      // 新增 编辑基本信息 抽屉
      DrawerBaseEdit: false,
      // 新增 成员管理 抽屉
      DrawerMember: false,
      proId: '',
      // 项目附件
      showFileModel: false,
      dialogFormVisible: false,
      showFileUrl: '',
      proDetailMsg: '',
      memberList: [],
      startPlanDate: '',
      endPlanDate: '',
      planList: '',
      firstPlanId: '',
      currentNodeId: '',
      activeId: '',
      data5: [],
      options4: [],
      // 新增 项目组成员列表
      proGrpMemList: [],
      // 详情
      modifyTaskRes: '',
      // 详情 抽屉显示
      TaskDetailCompShow: false,
      // 详情 计划详情
      value444: false,
      DrawerMemberShow: false,
      loading2: false,
      loadingMan: false,
      dialogShowImg1: false,
      // 组织架构
      organizationalShow: false,
      // 编辑计划 修改计划
      planEditShow: false,
      // 编辑任务 修改任务
      modifyTaskVisible: false,
      // 确认
      modal_loading: false,
      // 确认
      modal2: false,
      // 历史记录 抽屉
      DrawerHistory: false,
      // 历史记录
      loadingRe: false,
      commentPreviewUrl1: '',
      // 历史记录
      pageN: 1,
      // 历史记录
      taskLogs: [],
      // 历史记录
      commentTotalNum: 0,
      // 历史记录
      commitComent: '',
      // 历史记录
      butnDisabled: false,
      // 一级计划
      FirstLevelTask: false,
      // 一级计划 详情 planList数据处理
      FirstLevelPlanList: [],
      // 添加计划 添加任务 切换
      activeNameBgCover: 'first',
      bgCoverShow: false,
      // 新增
      taskForm: {
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
      // 新增
      moreUserSelectPayload: {
        projectManager: ''
      },
      // 新增 添加评论
      addProjectCommentPayload: {
        projectUID: '',
        content: '',
        attachmentId: ''
      }
    }
  },
  created: function () {
    if (this.$store.state.proId || this.$route.params.proId) {
      this.proId = this.$store.state.proId || this.$route.params.proId
      this.$store.state.proId = this.proId
      // this.queryProDetail()
    }
  },
  watch: {
    proId: function (val, oVal) {
      var that = this
      // this.currentProId = val
      // this.currentType = this.type
      localStorage.setItem('proId', val)
      var findId = false
      for (var t = 0; that.$store.state.slideMenuGroup.length > 0 && t < that.$store.state.slideMenuGroup[0].projectList.length; t++) {
        if (that.$store.state.slideMenuGroup[0].projectList[t].projectUID === that.proId) {
          findId = true
          that.$store.state.activeNavIndex = 'group_0_' + t
        }
      }
      if (!findId) {
        for (var p = 0; p < that.$store.state.slideMenu.length; p++) {
          if (that.$store.state.slideMenu[p].projectType === localStorage.getItem('generalMenuActive')) {
            that.$store.state.activeNavIndex = 'general_' + p
          }
        }
      }
      this.queryProDetail()
    },
    commitComent: function (val, oVal) {
      if (val) {
        this.butnDisabled = false
      } else {
        this.butnDisabled = true
      }
    },
    planList: function (val, old) {
      var that = this
      if (val) {
        that.FirstLevelPlanList = []
        for (var i = 0; i < val.length; i++) {
          var obj = {
            planName: val[i].name,
            planType: val[i].type === '1' ? '计划' : '任务',
            planStartDate: val[i].start.split(' ')[0],
            planFinishDate: val[i].finish.split(' ')[0],
            planDateDur: val[i].start.split(' ')[0] + ' 至 ' + val[i].finish.split(' ')[0],
            planId: val[i].id,
            description: val[i].description ? val[i].description : ''
          }
          that.FirstLevelPlanList.push(obj)
        }
      }
    }
  },
  computed: {
    slideMenuGroup: function () {
      var that = this
      if (!this.$route.params.proId && !that.$store.state.proId) {
        if (that.$store.state.slideMenuGroup.length > 0 && that.$store.state.slideMenuGroup[0].projectList.length > 0) {
          if (localStorage.getItem('proId')) {
            that.$store.state.proId = localStorage.getItem('proId')
            that.proId = localStorage.getItem('proId')
          } else {
            that.$store.state.proId = that.$store.state.slideMenuGroup[0].projectList[0].projectUID
            that.proId = that.$store.state.slideMenuGroup[0].projectList[0].projectUID
            localStorage.setItem('proId', that.proId)
            that.$store.state.activeNavIndex = 'group_0_0'
          }
        }
      } else {
        // that.log(555555)
      }
      return that.$store.state.slideMenuGroup
    },
    getStoreProId: function () {
      var that = this
      that.proId = this.$store.state.proId
      return this.$store.state.proId
    },
    slideMenu: function () {
      var that = this
      if (!this.$route.params.proId && !that.$store.state.proId) {
        if (that.$store.state.slideMenuGroup.length === 0 && that.$store.state.slideMenu.length > 0) {
          if (localStorage.getItem('proId')) {
            that.$store.state.proId = localStorage.getItem('proId')
            that.proId = localStorage.getItem('proId')
          } else {
            // that.$store.state.proId = that.$store.state.slideMenu[0].projectList[0].projectUID
            // that.proId = that.$store.state.slideMenu[0].projectList[0].projectUID
            // localStorage.setItem('proId', that.proId)
          }
        }
      }
      return that.$store.state.slideMenu
    }
  },
  methods: {
    // 项目附件model
    showFileModelClick: function () {
      this.showFileModel = true
    },
    fileClose: function () {
      this.showFileModel = false
    },
    showImagePre: function (url, showName) {
      if (this.isImage(showName)) {
        this.dialogFormVisible = true
        this.showFileUrl = url
      }
    },
    showEditFormFuc: function () {
      var that = this
      that.modifyTaskVisible = true
    },
    proBaseEditClick () {
      this.DrawerBaseEdit = true
    },
    // 编辑 基本信息 返回结果处理
    ProBaseInfoCallbackFuc: function (res) {
      var that = this
      if (res.code === 200) {
        that.$Message.success('保存成功!')
        that.queryProDetail()
        that.DrawerBaseEdit = false
      } else {
        that.$message({
          message: res.msg,
          type: 'warning'
        })
      }
    },
    // 附件 附件预览
    GetFilePreData (obj) {
      this.log('obj::', obj)
      if (obj.previewUrl && this.isImage(obj.fileName)) {
        this.showBigImage1(obj.previewUrl)
      }
    },
    // 附件上传 获取附件上传组件发来的附件信息 新组件
    GetFileInfo (obj) {
      this.log('GetFileInfo:', obj)
      if (obj) {
        this.IsClear = false
      }
      this.FileUploadArr = obj
    },
    // 附件上传
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
    showBigImage1: function (url) {
      if (url) {
        this.commentPreviewUrl1 = url
        this.dialogShowImg1 = true
      }
    },
    // 新增 获取项目详情
    queryProDetail: function () {
      var that = this
      that.ajax('/myProject/getProjectDetail', {projectUID: that.$store.state.proId}).then(res => {
        that.log('新getProjectDetail:', res)
        if (res.code === 200) {
          that.memberList = res.data.memberList
          that.proDetailMsg = res.data
          that.startPlanDate = res.data.startDate.split(' ')[0]
          that.endPlanDate = res.data.endDate.split(' ')[0]
          that.planList = res.data.planOrJobList
          that.firstPlanId = res.data.firstPlanId
          for (var i = 0; i < res.data.fileList.length; i++) {
            if (that.isImage(res.data.fileList[i].showName)) {
              res.data.fileList[i].isImg = true
            } else {
              res.data.fileList[i].isImg = false
            }
            res.data.fileList[i].downloadUrl = that.$store.state.baseServiceUrl + '/file/downloadFile?realUrl=' + res.data.fileList[i].realUrl + '&showName=' + res.data.fileList[i].showName
          }
          if (res.data.planOrJobList.length > 0) {
            that.activeId = res.data.planOrJobList[0].id
          } else {
            that.activeId = ''
          }
          that.selectProjectId(that.activeId, 'QueryFirstLevelChild')
        }
      })
    },
    FirstLevelNodeClick: function (nodeId, flag, e) {
      var that = this
      this.selectProjectId(nodeId, flag, e)
      this.currentNodeId = nodeId
      if (nodeId.substring(0, 1) === 'J') {
        that.TaskDetailCompShow = true
      } else {
        that.value444 = true
      }
    },
    // 根据计划或任务Id 获取子级结构
    selectProjectId: function (id, type, e) {
      var that = this
      that.data5 = []
      if (id) {
        this.currentNodeId = id
      }
      // if (id.substring(0, 1) === 'J') {
      //   // that.TaskDetailCompShow = true
      // } else {
      //   // that.value444 = true
      // }
      if (type === 'QueryFirstLevelChild') {
        that.activeId = id
        if (e) {
          var obj = e.currentTarget
          $(obj).addClass('active').siblings().removeClass('active')
        }
      }
      that.ajax('/myProject/getPlanOrTaskById', {id: that.activeId}).then(res => {
        if (res.code === 200) {
          for (var i = 0; i < res.data.length; i++) {
            res.data[i].start = res.data[i].start.split(' ')[0]
            res.data[i].finish = res.data[i].finish.split(' ')[0]
            res.data[i].children = [{
              id: 1,
              name: '测试'
            }]
          }
          that.data5 = res.data
        }
      })
    },
    showDetailPage: function (data) {
      var that = this
      this.currentNodeId = data.id
      if (data.type === '2') {
        that.TaskDetailCompShow = true
        // that.taskId = data.id
        // that.taskComment.uid = data.id
        // that.taskHistoryList.uid = data.id
        // that.TaskDetailCompShow = true
        // that.getCommicateCont()
        // that.getHistoryList()
        // that.toDetail(data.id)
      } else if (data.type === '1') {
        that.value444 = true
        // that.toPlanDetail(data.id)
      }
    },
    toDetail: function (id) {
      var that = this
      if (id) {
        that.taskId = id
      }
    },
    // 点击 项目详情 下的树结构节点 获取子计划或任务
    getNodeMsg: function (e) {
      var that = this
      this.$set(e, 'children', [])
      that.ajax('/myProject/getPlanOrTaskById', {id: e.id}).then(res => {
        if (res.code === 200) {
          for (var i = 0; i < res.data.length; i++) {
            res.data[i].start = res.data[i].start.split(' ')[0]
            res.data[i].finish = res.data[i].finish.split(' ')[0]
            res.data[i].children = [{
              id: 1,
              name: '测试'
            }]
          }
          e.children = res.data
        }
      })
    },
    // 历史记录 点击“历史记录”打开历史记录抽屉
    openHisDrawer () {
      this.DrawerHistory = true
      this.getHistoryCont()
    },
    // 历史记录 获取历史记录
    getHistoryCont () {
      var that = this
      that.ajax('/myProject/getLogAndComment', {projectUID: that.proId, pageSize: 10, pageNum: that.pageN}).then(res => {
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
    // 历史记录 分页值改变
    commentPageChange: function (e) {
      this.pageN = e
      this.getHistoryCont()
    },
    // 历史记录 点击回复
    addMarkInfo () {
      var that = this
      that.loadingRe = true
      that.addProjectCommentPayload.projectUID = that.proId
      that.addProjectCommentPayload.content = that.commitComent
      that.addProjectCommentPayload.attachmentId = that.SetFileIdStr()
      if (that.commitComent) {
        that.ajax('/myProject/addProjectComment', that.addProjectCommentPayload).then(res => {
          if (res.code === 200) {
            that.IsClear = true
            that.$message({
              type: 'success',
              message: res.msg
            })
            that.loadingRe = false
            that.getHistoryCont()
            that.commitComent = ''
          } else {
            that.$message({
              type: 'success',
              message: res.msg
            })
            that.loadingRe = false
          }
        })
      }
    },
    // 成员管理
    updataPageInfo: function (info) {
      var that = this
      that.queryProDetail()
    },
    // 成员管理
    updataPageDelMember: function (info) {
      var that = this
      that.queryProDetail()
    },
    // 成员管理
    updataPageAddPeople: function (info) {
      var that = this
      that.queryProDetail()
    },
    // 成员管理
    moreMemberClick: function () {
      this.DrawerMember = true
      // this.queryProGroupMember()
    },
    // 新增 成员搜索
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
    // 点击 组织架构
    organizationalClick () {
      // this.organizationalShow = true
      // this.getDepartment()
    },
    // 一级计划
    // 一级计划 详情
    FistLevelPlanDetail () {
      this.FirstLevelTask = true
    },
    addChildMsgFuc: function (data) {
      this.addNode(data.id, data.type)
    },
    toChildMsgFuc: function (id) {
      var that = this
      that.currentNodeId = id
      that.value444 = false
      that.TaskDetailCompShow = true
    },
    toPlanDetailFuc: function (id) {
      var that = this
      that.currentNodeId = id
      that.value444 = true
      that.TaskDetailCompShow = false
    },
    // 计划删除 返回结果处理
    PlanDelCallbackFuc: function (res) {
      var that = this
      if (res.code === 200) {
        that.selectProjectId()
        that.value444 = false
        that.$message({
          message: '删除成功！',
          type: 'success'
        })
      } else {
        that.$message({
          message: res.msg,
          type: 'warning'
        })
      }
    },
    TaskDelCallbackFuc: function (res) {
      var that = this
      if (res.code === 200) {
        that.selectProjectId()
        that.TaskDetailCompShow = false
        that.$message({
          message: '删除成功！',
          type: 'success'
        })
      } else {
        that.$message({
          message: res.msg,
          type: 'warning'
        })
      }
    },
    // 新建 添加子节点
    addNode: function (nodeId, nodeType) {
      var that = this
      if (nodeType) {
        if (nodeType === '1' || nodeType === '计划') {
          that.activeNameBgCover = 'first'
        } else {
          that.activeNameBgCover = 'second'
        }
      }
      this.currentNodeId = nodeId
      this.bgCoverShow = true
      that.ajax('/myProject/getPlanOrTaskDetail', {id: nodeId}).then(res => {
        if (res.code === 200) {
          var st = res.data.start.split(' ')[0] + ' 00:00:00'
          var et = res.data.finish
          var sT = new Date(st)
          var eT = new Date(et)
          that.form.date1 = res.data.start
          that.form.date2 = res.data.finish
          that.addTaskForm.date1 = res.data.start
          that.addTaskForm.date2 = res.data.finish
          that.disabledStarTime2 = sT.getTime()
          that.disabledEndTime2 = eT.getTime()
          that.pickerOptionsPlan.disabledDate = function (time) {
            return time.getTime() < that.disabledStarTime2 || time.getTime() > that.disabledEndTime2
          }
        } else {
          that.$message({
            message: res.msg
          })
        }
      })
    },
    planHandleClick (row, clickType) {
      var that = this
      that.currentNodeId = row.planId
      if (clickType === 'edit') {
        if (row.planType === '计划') {
          that.planEditShow = true
        } else if (row.planType === '任务') {
          // 编辑任务
          that.modifyTask(that.currentNodeId)
        }
      } else if (clickType === 'add') {
        that.addNode(row.planId, row.planType)
      } else if (clickType === 'del') {
        that.modal2 = true
      }
    },
    moreSelectOptions: function (nodeName, nodeId, nodeType, nodeData) {
      var that = this
      this.currentNodeId = nodeId
      if (nodeName === 'add') {
        this.addNode(nodeId, nodeType)
      } else if (nodeName === 'del') {
        this.modal2 = true
      } else if (nodeName === 'edit') {
        if (nodeType === '2') {
          that.modifyTask(nodeId)
        } else if (nodeType === '1') {
          that.planEditShow = true
        }
      }
    },
    // 新建计划 新建任务 引入组件 返回
    CreatePlanTaskCallbackFuc: function (res) {
      var that = this
      if (res === 'shut') {
        that.bgCoverShow = false
      } else {
        if (res.code === 200) {
          that.bgCoverShow = false
          that.queryProDetail()
          that.$message({
            message: '创建成功！',
            type: 'success'
          })
        } else {
          that.$message({
            message: res.msg,
            type: 'warning'
          })
        }
      }
    },
    // 编辑任务 修改任务
    modifyTask: function (id) {
      var that = this
      that.taskIdEdit = id
      that.modifyTaskVisible = true
    },
    // 新建 展开更多 删除子节点
    delNode: function () {
      var that = this
      this.modal_loading = true
      that.ajax('/myProject/delPlanOrTask', {id: that.currentNodeId}).then(res => {
        if (res.code === 200) {
          that.queryProDetail()
          this.modal_loading = false
          this.modal2 = false
          that.$message({
            message: '删除成功！',
            type: 'success'
          })
        } else {
          that.loading = false
          that.$message({
            message: res.msg
          })
        }
      })
    },
    // 修改计划 编辑计划
    // 编辑计划 修改计划
    ModifyPlanCallbackFuc: function (res) {
      var that = this
      if (res === 'shut') {
        that.planEditShow = false
      } else {
        if (res.code === 200) {
          that.planEditShow = false
          that.queryProDetail()
          that.$message({
            message: '修改成功！',
            type: 'success'
          })
        } else {
          that.$message({
            message: res.msg,
            type: 'warning'
          })
        }
      }
    },
    // 编辑任务 修改任务
    ModifyTaskCallbackFuc: function (res) {
      var that = this
      this.log('ModifyTaskCallbackFuc:', res)
      if (res.code === 200) {
        that.modifyTaskVisible = false
        that.queryProDetail()
        that.selectProjectId()
        that.$message({
          message: '修改成功！',
          type: 'success'
        })
      } else {
        that.$message({
          message: res.msg,
          type: 'warning'
        })
      }
    },
    // 组件内点击了关闭 父组件执行关闭子组件操作
    ShutCompEmitFuc: function (res) {
      this[res] = false
    },
    ActionResThrowFuc: function (obj) {
      var that = this
      switch (obj.actionName) {
        case 'transferTask':
          // 任务移交
          that.TaskDetailCompShow = false
          that.selectProjectId(that.activeId)
          break
        case 'finishTask':
          // 任务完成
          that.selectProjectId()
          break
        case 'restartTask':
          // 任务重启
          that.selectProjectId()
          break
        case 'startTask':
          // 任务开始
          that.selectProjectId()
          break
        case 'decomposeTask':
          // 任务分解
          that.selectProjectId()
          break
        default:
          this.log('')
      }
    }
  }
}
</script>

<style scoped>
  div img{
    width: 100%;
  }
  .topCon{
    display: flex;
    justify-content: space-between;
  }
  .topConLf{
    width: 75%;
  }
  .topConRt{
    width: 240px;
    position: relative;
  }
  .title{
    height: 30px;
    color: chocolate;
    font-size: 18px;
    font-family: '黑体';
    font-weight: bold;
  }
  .proDetail{
    font-size: 14px;
    color: #666;
    text-indent: 2em;
    padding-top: 20px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    text-overflow:ellipsis;
    overflow: hidden;
  }
  .myMsg,.dataMsg{
    color: #888;
    display: flex;
    font-size: 15px;
    justify-content: start;
  }
  .editHistoryBtn span{
    cursor: pointer;
  }
  .imgBox{
    position: absolute;
    top: -20px;
    right: 15px;
    opacity: 0.9;
    width: 90px;
  }
  .imgBox img{
    width: 100%;
  }
  /*
   *  ============================= 项目成员列表
   **/
  .memList{
    width: 100%;
    display: flex;
    margin-top: 30px;
    background-color: #f5f8fa;
  }
  .memName{
    width: 34px;
    font-size: 14px;
    color: #fff;
    float: left;
    padding: 5px 0;
    text-align: center;
    background-color: #409EFF;
    border-radius: 0px;
    border-bottom-left-radius: 5px;
    border-top-left-radius: 5px;
  }
  .memBox{
    width: 98%;
    float: left;
    max-height: 104px;
    overflow: scroll;
    overflow-x: hidden;
    border-top: 1px solid #f0f0f0;
  }
  .memBox div{
    float: left;
    margin-left: 25px;
    color: #777;
    font-size: 14px;
    cursor: pointer;
    line-height: 38px;
  }
  .memBox div.moreBtn{
    padding: 4px 0px;
    float: right;
    margin-left: 25px;
    _color: #777;
    _font-size: 14px;
    _background-color: #3a8ee6;
    _border-radius: 4px;
    _text-align: center;
    _line-height: 20px !important;
  }
  .memBox .active{
    color: #fff;
    background-color: #409EFF;
  }
  .memName{
    width: 34px;
    font-size: 14px;
    color: #fff;
    float: left;
    padding: 5px 0;
    text-align: center;
    background-color: #409EFF;
    border-radius: 0px;
    border-bottom-left-radius: 5px;
    border-top-left-radius: 5px;
  }
  /*
   *  ============================ 一级项目计划
   */
  .planList{
    width: 100%;
    display: flex;
    margin-top: 30px;
    background-color: #f5f8fa;
  }
  .planName{
    width: 34px;
    font-size: 14px;
    color: #fff;
    float: left;
    padding: 10px;
    text-align: center;
    background-color: #409EFF;
    border-radius: 0px;
    border-bottom-left-radius: 5px;
    border-top-left-radius: 5px;
  }
  .planBox{
    width: 98%;
    float: left;
    max-height: 104px;
    overflow: scroll;
    overflow-x: hidden;
    border-top: 1px solid #f0f0f0;
  }
  .planBox div{
    padding: 4px 20px;
    float: left;
    border-radius: 4px;
    background-color: #fff;
    margin-left: 25px;
    margin-top: 15px;
    color: #777;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
  }
  .planBox .active{
    color: #fff;
    background-color: #409EFF;
  }
  /*
   *  =========================== 项目详情 树形结构
   */
  .devide{
    height: 40px;
    clear: both;
    line-height: 40px;
    padding: 0 10px;
    font-size: 16px;
    color: #999;
    margin-top: 20px;
    background-color: #f5f8fa;
  }
  .proTreeHeader{
    display: flex;
    justify-content: space-between;
  }
  .custom-tree-node {
    flex: 1;
    align-items: center;
    font-size: 14px;
    padding-right: 8px;
  }
  .dataName{
    display: inline-block;
  }
  .dataName:hover{
    color: chocolate;
  }
  .proMsg{
    width: 800px;
    float: right;
    display: flex;
    justify-content: space-between;
  }
  .treeName{
    width: 240px;
  }
  .treeTime{
    float: right;
  }
  .treeState{
    width: 100px;
  }
  /*
   *  =========================== 成员管理
   */
  /*
   *  =========================== 历史记录
   */
  .el-textarea{
    margin-top: 15px;
    margin-left: 0px;
  }
  .el-textarea__inner{
    width: 100%;
    min-height: 80px;
  }
  .hisFileUplBox{
    color: #1296db;
    display: flex;
    justify-content: space-between;
    line-height: 40px;
    font-size: 14px;
    /*font-family: '黑体';*/
    padding:0 10px;
    background-color: #f5f8fa;
  }
  .hisFileUplBox div img{
    float: left;
    margin-top: 10px;
    margin-right: 10px;
    width: 18px;
  }
  /*
   *  =========================== 一级计划 抽屉
   */
   .tableHeader{
     display: flex;
     justify-content: space-between;
   }
  .tableProTitle{
    font-size: 16px;
  }
  .fileModel{
    min-height: 110px;
    width: 260px;
    position: absolute;
    box-shadow: 1px 1px 4px #999;
    top: 0;
    right: 0;
    z-index: 999;
    background-color: #fff;
  }
  .fileItem{
    height: 30px;
    padding: 0 10px;
    line-height: 30px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #f1f1f1;
  }
  .fileClose{
    position: absolute;
    bottom: 2px;
    right: 2px;
    cursor: pointer;
    color: #fff;
    height: 20px;
    line-height: 20px;
    padding: 0 8px;
    background-color: #409EFF;
  }
  .fileDone{
    display: flex;
    justify-content: space-between;
    text-align: center;
    width: 40%;
    font-size: 12px;
    color: #409EFF
  }
</style>
