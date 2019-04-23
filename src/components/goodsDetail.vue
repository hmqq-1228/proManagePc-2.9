<template>
  <div class="ProDetail goodsDetail" style="position: relative;margin-top: 15px;">
    <!--<div @click="ttttttt()"><button>TTTTTTT</button></div>-->
    <div>{{goPerfect?'':''}}</div>
    <div>{{getStoreProId?'':''}} {{slideMenu?'':''}} {{slideMenuGroup ? '' : ''}} {{nodeDragRefresh?'':''}}</div>
    <!-- Part01 start 项目标题 项目简介 项目一级计划 基本信息入口 历史记录入口 等-->
    <div class="fileModel" v-if="showFileModel">
      <div style="text-align: center;height: 30px;line-height: 30px;color: #999;border-bottom: 1px solid #f1f1f1">共<span style="color: chocolate;font-size: 16px;font-weight: bold;">{{proDetailMsg.fileList.length}}</span> 个附件
      </div>
      <div class="fileItem" v-for="fileItem in proDetailMsg.fileList" :key="fileItem.previewUrl">
        <div
          style="width: 60%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"
          :title="fileItem.showName"
        >{{fileItem.showName}}</div>
        <div class="fileDone">
          <div
            style="width: 50%;cursor: pointer"
            v-if="fileItem.isImg"
            @click="showImagePre(fileItem.previewUrl, fileItem.showName)"
          >预览</div>
          <div style="width: 50%;">
            <a v-bind:download="fileItem.showName" v-bind:href="fileItem.downloadUrl">下载</a>
          </div>
        </div>
      </div>
      <div class="fileItem" style="position: relative;margin-top: 20px;border-bottom: none">
        <div class="fileClose" @click="fileClose()">关闭</div>
      </div>
    </div>
    <el-dialog title="图片预览" :visible.sync="dialogFormVisible">
      <div class="showImg">
        <img v-bind:src="showFileUrl" alt>
      </div>
    </el-dialog>
    <div class="topperTitle">
      <!-- 内容与项目成员 -->
      <div v-if="contentSlide">
        <div class="topCon">
          <div class="topConLf">
            <div class="title" style="display: flex;">
              <div v-on:contextmenu="rightKey"><span>{{proDetailMsg.projectType}}:</span> {{proDetailMsg.projectName}}</div>
              <div style="position: relative; width: 100px; margin-left: 15px;">
                <div class="imgBox" style="position: absolute;" v-if="proDetailMsg.state === '0'">
                  <img src="../../static/img/unstart.png" alt>
                </div>
                <div class="imgBox" style="position: absolute;" v-if="proDetailMsg.state === '2'">
                  <img src="../../static/img/doing.png" alt>
                </div>
                <div class="imgBox" style="position: absolute;" v-if="proDetailMsg.state === '3'">
                  <img src="../../static/img/finish.png" alt>
                </div>
              </div>
            </div>
            <div class="proDetail" v-bind:title="proDetailMsg.content">{{proDetailMsg.content}}</div>
          </div>
          <div class="topConRt">
            <div>
              <div class="myMsg">
                <div>
                  <img src="../../static/img/my.png" alt>
                </div>
                <div style="margin-left: 10px;">{{proDetailMsg.projectManager}} {{startPlanDate}} 到 {{endPlanDate}}</div>
              </div>
              <!--<div class="dataMsg">-->
                <!--<div>-->
                  <!--<img src="../../static/img/data.png" alt>-->
                <!--</div>-->
                <!--<div style="margin-left: 10px;">{{startPlanDate}} 到 {{endPlanDate}}</div>-->
              <!--</div>-->
              <div class="myMsg">
                <div style="color: #28558c; font-size: 20px; margin-top: -6px">
                  <Icon type="ios-image"/>
                </div>
                <div style="margin-left: 10px; color: #28558c; display: flex;">
                  <div>附件:</div>
                  <div v-if="proDetailMsg.fileList && proDetailMsg.fileList.length > 0" style="display: flex">
                    <div class="proFileListPre"
                         :title="fileItem.showName"
                         :style="{background: 'url(' + fileItem.previewUrl + ')', backgroundSize: 'cover'}"
                         v-for="fileItem in proDetailMsg.fileList"
                         :key="fileItem.previewUrl">
                      <div v-if="fileItem.isImg" style="width: 60%" @click="showImagePre(fileItem.previewUrl, fileItem.showName)"></div>
                      <div v-if="!fileItem.isImg" style="width: 60%">
                        <a v-bind:download="fileItem.showName" v-bind:href="fileItem.downloadUrl">
                          <Icon style="margin-top: -8px; font-size: 16px;" type="ios-document-outline" />
                        </a>
                      </div>
                      <div style="width: 40%; background: rgba(64,158,255, 0.5)">
                        <a v-bind:download="fileItem.showName" v-bind:href="fileItem.downloadUrl"><Icon style="color: #fff" type="md-arrow-down" /></a>
                      </div>
                    </div>
                  </div>
                  <!--<span v-if="proDetailMsg.fileList && proDetailMsg.fileList.length > 0">-->
                    <!--<span style="cursor: pointer;color: #409EFF;font-size: 14px;" @click="showFileModelClick()">查看附件</span>-->
                  <!--</span>-->
                  <div style="color: #aaa;font-size: 14px" v-if="!proDetailMsg.fileList || proDetailMsg.fileList.length === 0">暂无附件</div>
                </div>
              </div>
              <div class="editHistoryBtn" style="margin-top: 8px; color: #2d8cf0;">
                <span v-if="archives">
                   <Icon size="18" style="margin-top: -3px;" type="ios-paper-outline"/>
                   <span
                     style="margin-right: 10px; margin-left: 5px;"
                    v-on:click="proGoodsEditClick()"
                   >查看档案</span>
                </span>
                <Icon size="20" style="margin-top: -3px;" type="ios-create-outline" />
                <span style="margin-right: 10px; margin-left: 5px;" v-on:click="proBaseEditClick()">基本信息</span>
                <Icon size="20" style="margin-top: -3px;" type="ios-time-outline"/>
                <span style="margin-left: 5px;" v-on:click="openHisDrawer">历史记录</span>
              </div>
            </div>
            <!--<div class="imgBox" v-if="proDetailMsg.state === '0'">-->
              <!--<img src="../../static/img/unstart.png" alt>-->
            <!--</div>-->
            <!--<div class="imgBox" v-if="proDetailMsg.state === '2'">-->
              <!--<img src="../../static/img/doing.png" alt>-->
            <!--</div>-->
            <!--<div class="imgBox" v-if="proDetailMsg.state === '3'">-->
              <!--<img src="../../static/img/finish.png" alt>-->
            <!--</div>-->
          </div>
        </div>
      <!-- 项目成员列表 -->
        <div class="memList">
          <div class="memName">
            <Icon size="30" type="ios-person-outline"/>
          </div>
          <div class="memBox">
            <div
              v-if="memberList.length > 0"
              v-for="(member, memIndex) in memberList"
              v-bind:key="member.userName + '-' + memIndex"
            >{{member.userName}}</div>
            <div class="moreBtn" v-on:click="moreMemberClick()">
              <Button size="small" style="width: 84px;" type="primary">更多 / 编辑</Button>
            </div>
          </div>
        </div>
      </div>
      <div v-else style="margin-bottom: 15px; display: flex; justify-content: space-between;">
        <div style="display: flex;">
          <div class="title"><span>{{proDetailMsg.projectType}}:</span> {{proDetailMsg.projectName}}</div>
          <div style="position: relative; width: 100px; margin-left: 15px;">
            <div class="imgBox" style="position: absolute;" v-if="proDetailMsg.state === '0'">
              <img src="../../static/img/unstart.png" alt>
            </div>
            <div class="imgBox" style="position: absolute;" v-if="proDetailMsg.state === '2'">
              <img src="../../static/img/doing.png" alt>
            </div>
            <div class="imgBox" style="position: absolute;" v-if="proDetailMsg.state === '3'">
              <img src="../../static/img/finish.png" alt>
            </div>
          </div>
        </div>
        <div class="myMsg" style="float:right;width:280px;">
          <div>
            <img src="../../static/img/my.png" alt>
          </div>
          <div style="margin-left: 10px;">{{proDetailMsg.projectManager}} {{startPlanDate}} 到 {{endPlanDate}}</div>
          <!--<div class="imgBox" v-if="proDetailMsg.state === '0'">-->
            <!--<img src="../../static/img/unstart.png" alt>-->
          <!--</div>-->
          <!--<div class="imgBox" v-if="proDetailMsg.state === '2'">-->
            <!--<img src="../../static/img/doing.png" alt>-->
          <!--</div>-->
          <!--<div class="imgBox" v-if="proDetailMsg.state === '3'">-->
            <!--<img src="../../static/img/finish.png" alt>-->
          <!--</div>-->
        </div>
      </div>
      <!-- 展开与收起 -->
      <div class="slideUpConent" @click="slideToContent">
         <!--<el-button type="primary" size="small" @click="slideToContent">展开/收起</el-button>-->
        <div></div>
        <div><i :class="{ 'el-icon-arrow-down':!contentSlide,'el-icon-arrow-up':contentSlide,}"></i>{{contentSlide == true ? '收起' : '展开'}}</div>
        <div></div>
      </div>
      <!-- 一级计划 项目计划 start -->
      <div class="planList">
        <div class="planName">
        <!--<div class="planName">-->
          <!-- 项
          <br>目
          <br>计
          <br>划 -->
          <i class="el-icon-setting" style="font-size:20px;margin-top:50%;"></i>
        </div>
        <div class="planBox" style="position: relative;">
          <div class="plan-list addPlan" v-on:click="addNode(firstPlanId)">
             <i class="el-icon-plus"></i>
          </div>
          <div v-for="(plan, index) in planList" v-bind:key="index" class="plan-all">
              <div class="plan-list"
                    v-if="planList.length > 0"
                    v-bind:class="activeId === plan.id ? 'active' : ''"
                    v-bind:key="plan.id"
                    @click="getPlanTree(plan)"
                  >{{plan.name}}
              </div>
              <div class="planDetailBox">
                <div class="planDetail" @click="showPlanDetail(plan.id, 'QueryFirstLevelChild', $event,)"><i class="el-icon-edit"></i></div>
              </div>
          </div>
         <!--  <Button
            style="width: 84px; margin-top: 16px; margin-left: 20px; position: absolute; right: 1px;"
            size="small"
            type="primary"
            v-on:click="FistLevelPlanDetail()"
          >添加 / 编辑</Button> -->
        </div>
      </div>
      <div style="margin-top:20px;" v-if="planList.length > 0 ">
          <el-tabs v-model="activeName">
              <el-tab-pane label="加任务" name="first">
                  <component v-bind:is="compArr.AddNewTask"
                     fileFormId="GetUploadCount1"
                     v-on:TaskDistributeCallback="TaskDistributeCallbackFuc"
                     :nodeId="parentId"
                     >
                  </component>
              </el-tab-pane>
              <el-tab-pane label="加计划" name="second" v-bind:disabled="panshow">
                  <component v-bind:is="compArr.addNewPlan"
                     fileFormId="addNewPlan"
                     v-on:TaskDistributeCallback="TaskDistributeCallbackFuc"
                     :nodeId="parentId"
                     :defaultText="defaultText"
                     :defaultDetail="defaultDetail">
                  </component>
              </el-tab-pane>
          </el-tabs>
      </div>
    </div>
    <!-- Part01 end -->
    <!-- Part02 start 项目详情 title -->
    <div class="devide">
      <div class="proTreeHeader">
        <div>详情</div>
        <div style="padding-right: 6px; display: flex">
          <div style="margin-right: 15px;">
            <el-button type="text" @click="showTree">树形结构</el-button>
          </div>
          <div v-if="listTree.length > 0">
            <el-button type="text" @click="slideTree" v-if="showName">展开</el-button>
            <el-button type="text" @click="slideTree1" v-else>收缩</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- zh 树形结构 新版本-->
    <div v-if="listTree.length>0 && planList.length > 0">
       <tree :list="listTree" @showDetailPage="showDetailPage" :show="show"></tree>
    </div>
    <div v-else class="noData">
       暂无数据
    </div>
    <!-- Part05 start 抽屉 任务详情 -->
    <Drawer
      title="任务详情"
      class="drawerScroll"
      :closable="false"
      width="750"
      v-model="TaskDetailCompShow"
    >
      <component
        v-bind:is="compArr.TaskDetailComp"
        v-bind:taskDrawerOpen="TaskDetailCompShow"
        v-bind:modifyTaskRes="modifyTaskRes"
        v-on:FilePreEmit="GetFilePreData"
        v-on:toPlanDetail="toPlanDetailFuc"
        v-on:showEditForm="showEditFormFuc"
        v-on:ActionResThrow="ActionResThrowFuc"
        v-on:TaskDelCallback="TaskDelCallbackFuc"
        :nodeId="currentNodeId"
      ></component>
    </Drawer>
    <!-- Part06 start 抽屉 计划详情 -->
    <Drawer title="计划详情" class="drawerScroll" :closable="false" width="750" v-model="value444">
      <component
        v-bind:is="compArr.PlanDetailComp"
        v-bind:taskDrawerOpen="value444"
        :nodeId="currentNodeId"
        v-on:ActionResThrow="ActionResThrowFuc"
        v-on:addChildMsg="addChildMsgFuc"
        v-on:toChildMsg="toChildMsgFuc"
        v-on:showPlanEditForm="showPlanEditFormFuc"
        v-on:PlanDelCallback="PlanDelCallbackFuc"
      ></component>
    </Drawer>
    <!-- Part03 start 抽屉 成员管理 -->
    <Drawer
      title="成员管理"
      width="740"
      :closable="false"
      v-model="DrawerMember"
      v-loading="DrawerMemberShow"
    >
      <component
        v-bind:is="compArr.MemberComp"
        v-bind:proId="proId"
        v-bind:DrawerMemberShow="DrawerMember"
        v-on:addMembersInfo="updataPageInfo"
        v-on:delMembersInfo="updataPageDelMember"
        v-on:addPeopleInfo="updataPageAddPeople"
      ></component>
    </Drawer>
    <!-- Part03 end -->
    <!--新增 商品信息 start-->
    <Drawer title="商品信息" width="740" :closable="false" v-model="goodsEdit">
      <component
        v-bind:is="compArr.goodsInfo"
        fileFormId="BaseInfoEdit"
        v-on:FilePreEmit="GetFilePreData"
        v-bind:ProBaseInfoShow="goodsEdit"
        v-on:ProBaseInfoCallback="ProGoodsInfoCallbackFuc"
        :proId="proId"
        @cancel="cancel"
      ></component>
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
      <div @click="hidePanel">
         <div class="el-textarea" v-loading="loadingRe">
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
          <div class="hisFileUplBox">
            <div style="display: inline-block">
              <!-- 引入 附件上传 组件 -->
              <component
                v-bind:is="compArr.FileUploadComp"
                fileFormId="HistoryFileUpl"
                v-on:FilePreEmit="GetFilePreData"
                v-bind:clearInfo="IsClear"
                v-on:FileDataEmit="GetFileInfo"
              ></component>
            </div>
            <div>
              <i-button type="info" v-bind:disabled="butnDisabled" @click="addMarkInfo()">回复</i-button>
            </div>
          </div>
        </form>
      </div>
      <!--操作记录 历史记录-->
         <div class="discription lis" style="margin-top: 15px;">
        <!-- 历史记录 评论 引入组件-->
        <component
          v-bind:is="compArr.CommentLogs"
          fileFormId="CommentLogs"
          v-on:FilePreEmit="GetFilePreData"
          :commentList="taskLogs"
        ></component>
        <div style="text-align: center">
          <Page
            :total="commentTotalNum"
            size="small"
            :page-size="10"
            show-total
            @on-change="commentPageChange($event)"
          ></Page>
        </div>
      </div>
      </div>
    </Drawer>
    <!--新增 添加计划或者任务 start-->
    <Drawer class="drawerScroll" title="计划表单" :closable="false" width="40%" v-model="bgCoverShow">
      <component
        v-bind:is="compArr.CreatePlanOrTask"
        v-bind:DrawerOpen="bgCoverShow"
        fileFormId="CreatePlanTask"
        v-on:CreatePlanTaskCallback="CreatePlanTaskCallbackFuc"
        :nodeId="currentNodeId"
      ></component>
    </Drawer>
    <!--新增 抽屉 编辑计划 修改计划 start-->
    <Drawer class="drawerScroll" title="编辑计划" :closable="false" width="40%" v-model="planEditShow">
      <component
        v-bind:is="compArr.ModifyPlan"
        v-bind:DrawerOpen="planEditShow"
        fileFormId="ModifyPlan"
        v-on:ModifyPlanCallback="ModifyPlanCallbackFuc"
        :nodeId="currentNodeId"
      ></component>
    </Drawer>
    <!--修改任务 编辑任务 任务 修改-->
    <Drawer
      class="drawerScroll"
      title="修改任务"
      :closable="false"
      width="40%"
      v-model="modifyTaskVisible"
    >
      <!-- 修改任务 编辑任务 引入组件 -->
      <component
        v-bind:is="compArr.ModifyTask"
        v-bind:DrawerOpen="modifyTaskVisible"
        fileFormId="ModifyTask"
        v-on:FilePreEmit="GetFilePreData"
        v-on:ModifyTaskCallback="ModifyTaskCallbackFuc"
        v-on:ShutCompEmit="ShutCompEmitFuc"
        :nodeId="currentNodeId"
      ></component>
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
      <div class="showImg">
        <img v-bind:src="commentPreviewUrl1" alt>
      </div>
    </el-dialog>
    <!-- 右键菜单测试 -->
    <div id="menu">
      <div class="menu">功能1</div>
      <div class="menu">功能2</div>
      <div class="menu">功能3</div>
      <div class="menu">功能4</div>
      <div class="menu">功能5</div>
    </div>
    <!--新增 抽屉 编辑计划 修改计划 start-->
    <Drawer class="drawerScroll" title="编辑树形结构" :closable="false" width="50%" v-model="TreeStructureShow">
      <component v-bind:is="compArr.NewTree"
                 v-bind:treeNodeLevel="treeNodeLevel"
                 v-bind:newTreeList="newTreeList">
      </component>
    </Drawer>
    <!-- 节点拖动 时间选择 -->
    <el-dialog title="提示: 编辑时间" :visible.sync="timeDialogVisible" width="30%">
      <div>
        <!--<button type="button" @click="resettt">setddd</button>-->
        <el-form ref="nodeDragTimeEdit" :model="nodeDragTimeEdit" label-width="80px">
          <el-form-item label="开始时间">
            <el-date-picker v-model="nodeDragTimeEdit.start" :picker-options="nodeDragOption" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择开始日期时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker v-model="nodeDragTimeEdit.finish" :picker-options="nodeDragOption" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择结束日期时间"></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="DragTimeEditCancel">取 消</el-button>
        <el-button type="primary" @click="DragTimeEditOk">确 定</el-button>
      </span>
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
import goodsInfo from './CustomComp/goodsInfo.vue'
import ProBaseInfo from './CustomComp/ProBaseInfo.vue'
import MemberComp from './CustomComp/MemberComp.vue'
import TaskDetailComp from './CustomComp/TaskDetailComp.vue'
import PlanDetailComp from './CustomComp/PlanDetailComp.vue'
import tree from './CustomComp/tree.vue'
import AddNewTask from './CustomComp/AddNewTask.vue'
import addNewPlan from './CustomComp/addNewPlan.vue'
import NewTree from './CustomComp/NewTree.vue'
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
    goodsInfo,
    MemberComp,
    TaskDetailComp,
    PlanDetailComp,
    tree,
    AddNewTask,
    addNewPlan,
    ProBaseInfo,
    NewTree
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
      nodeDragTimeEdit: {
        start: '',
        finish: ''
      },
      startlimit: this.$store.state.defaultParentStart,
      // 节点
      nodeDragOption: {
        disabledDate: function (currentDateTime) {
          return false
        }
      },
      // timeDialogVisible: false,
      // 节点级别
      treeNodeLevel: 0,
      TreeStructureShow: false,
      loading22: false,
      // 获取默认的人员
      options42: [],
      // @人员
      peopleValue: [],
      // 判断是否出现@人员
      selectUserDiaShow2: false,
      // 点击任务详情删除是否默认第一个
      isChangeActive: false,
      showName: false,
      // 是否有档案
      archives: true,
      // 添加任务计划的id
      parentId: '',
      // 是否显示二级之后的树结构
      show: true,
      // 引入组件
      compArr: {
        ModifyTask: 'ModifyTask',
        ModifyPlan: 'ModifyPlan',
        CommentLogs: 'CommentLogs',
        FileUploadComp: 'FileUploadComp',
        CreatePlanOrTask: 'CreatePlanOrTask',
        TaskDistribute: 'TaskDistribute',
        goodsInfo: 'goodsInfo',
        ProBaseInfo: 'ProBaseInfo',
        MemberComp: 'MemberComp',
        TaskDetailComp: 'TaskDetailComp',
        PlanDetailComp: 'PlanDetailComp',
        AddNewTask: 'AddNewTask',
        addNewPlan: 'addNewPlan',
        NewTree: 'NewTree'
      },
      // zh 树状展开收缩文字
      treeName: '收缩',
      // zh 收缩展开内容
      contentSlide: false,
      // 默认计划
      activeName: 'first',
      defaultText: '请输入计划名称',
      defaultDetail: '请输入计划简介',
      // 是否可以新增计划
      panshow: false,
      // 商品信息
      goodsEdit: false,
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
      butnDisabled: true,
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
        // projectUID: '',
        content: '',
        attachmentId: '',
        memberList: []
      },
      newTreeList: [],
      listTree: [
        {
          id: 1,
          name: '一级菜单',
          type: 'plan',
          children: [{
            id: 2,
            name: '二级菜单',
            type: 'plan',
            children: [{
              id: 3,
              name: '三级菜单',
              type: 'task'
            },
            {
              id: 4,
              name: '三级菜单',
              type: 'plan'
            },
            {
              id: 5,
              name: '三级菜单',
              type: 'task'
            }]
          },
          {
            id: 6,
            name: '二级菜单',
            type: 'task'
          },
          {
            id: 7,
            name: '二级菜单',
            type: 'task'
          }]
        },
        {
          id: 2,
          name: '一级菜单',
          type: 'task',
          children: [{
            id: 8,
            name: '二级菜单',
            type: 'task'
          },
          {
            id: 9,
            name: '二级菜单',
            type: 'task'
          },
          {
            id: 10,
            name: '二级菜单',
            type: 'task',
            children: [{
              id: 11,
              name: '三级菜单',
              type: 'task',
              children: [{
                id: 12,
                name: '四级菜单',
                type: 'task',
                children: [{
                  id: 13,
                  name: '五级菜单',
                  type: 'task'
                }]
              },
              {
                id: 13,
                name: '四级菜单',
                type: 'task'
              },
              {
                id: 14,
                name: '四级菜单',
                type: 'task'
              }]
            },
            {
              id: 15,
              name: '三级菜单',
              type: 'task'
            },
            {
              id: 16,
              name: '三级菜单',
              type: 'task'
            }]
          }]
        },
        {
          id: 3,
          name: '一级菜单',
          type: 'task',
          children: [{
            id: 1.1,
            name: '二级菜单',
            type: 'task'
          },
          {
            id: 1.2,
            name: '二级菜单',
            type: 'task'
          },
          {
            id: 1.3,
            name: '二级菜单',
            type: 'task'
          }]
        }
      ]
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
    // nodeDragRefresh: function (val, old) {
    //   this.log('watch:nodeDragRefresh:', val)
    //   if (val) {
    //     this.log('watch:nodeDragRefresh:', val)
    //     this.newTreeList = []
    //     this.$store.state.nodeDragRefresh = false
    //     this.queryNewTree()
    //   }
    // },
    proId: function (val, oVal) {
      var that = this
      // this.currentProId = val
      // this.currentType = this.type
      localStorage.setItem('proId', val)
      var findId = false
      for (
        var t = 0; that.$store.state.slideMenuGroup.length > 0 &&
        t < that.$store.state.slideMenuGroup[0].projectList.length;
        t++
      ) {
        if (
          that.$store.state.slideMenuGroup[0].projectList[t].projectUID ===
          that.proId
        ) {
          findId = true
          that.$store.state.activeNavIndex = 'group_0_' + t
        }
      }
      if (!findId) {
        for (var p = 0; p < that.$store.state.slideMenu.length; p++) {
          if (
            that.$store.state.slideMenu[p].projectType ===
            localStorage.getItem('generalMenuActive')
          ) {
            that.$store.state.activeNavIndex = 'general_' + p
          }
        }
      }
      if (val) {
        that.activeId = ''
      }
      this.queryProDetail()
    },
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
    planList: function (val, old) {
      var that = this
      this.log('goods:planList==:', val)
      if (val) {
        that.FirstLevelPlanList = []
        for (var i = 0; i < val.length; i++) {
          var obj = {
            planName: val[i].name,
            planType: val[i].type === '1' ? '计划' : '任务',
            planStartDate: val[i].start.split(' ')[0],
            planFinishDate: val[i].finish.split(' ')[0],
            planDateDur:
              val[i].start.split(' ')[0] + ' 至 ' + val[i].finish.split(' ')[0],
            planId: val[i].id,
            description: val[i].description ? val[i].description : ''
          }
          that.FirstLevelPlanList.push(obj)
        }
      }
    },
    goodsEdit: function (val, old) {
      let that = this
      if (val === false) {
        that.$store.state.goPerfect = false
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
    }
    // nodeDragRefresh: function (val, old) {
    //   this.log('watch:nodeDragRefresh:', val)
    // }
  },
  computed: {
    slideMenuGroup: function () {
      var that = this
      if (!this.$route.params.proId && !that.$store.state.proId) {
        if (
          that.$store.state.slideMenuGroup.length > 0 &&
          that.$store.state.slideMenuGroup[0].projectList.length > 0
        ) {
          if (localStorage.getItem('proId')) {
            that.$store.state.proId = localStorage.getItem('proId')
            that.proId = localStorage.getItem('proId')
          } else {
            that.$store.state.proId =
              that.$store.state.slideMenuGroup[0].projectList[0].projectUID
            that.proId =
              that.$store.state.slideMenuGroup[0].projectList[0].projectUID
            localStorage.setItem('proId', that.proId)
            that.$store.state.activeNavIndex = 'group_0_0'
          }
        }
      } else {
        // that.log(555555)
      }
      return that.$store.state.slideMenuGroup
    },
    goPerfect: function () {
      var that = this
      // console.log(that.$store.state.goPerfect)
      if (that.$store.state.goPerfect === true) {
        that.goodsEdit = true
      } else {
        that.goodsEdit = false
      }
      return that.$store.state.goPerfect
    },
    getStoreProId: function () {
      var that = this
      that.proId = this.$store.state.proId
      // this.log('that.proId:', that.proId)
      return this.$store.state.proId
    },
    slideMenu: function () {
      var that = this
      if (!this.$route.params.proId && !that.$store.state.proId) {
        if (
          that.$store.state.slideMenuGroup.length === 0 &&
          that.$store.state.slideMenu.length > 0
        ) {
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
    },
    timeDialogVisible: function () {
      var that = this
      // that.timeDialogVisibleShow = true
      that.nodeDragTimeEdit.start = this.$store.state.defaultParentStart
      that.nodeDragTimeEdit.finish = this.$store.state.defaultParentFinish
      this.resettt()
      // that.$store.commit('setDateOption', {OptionObj: that.nodeDragOption, startDate: that.nodeDragTimeEdit.start, endDate: that.nodeDragTimeEdit.finish})
      return this.$store.state.timeDialogVisible
    },
    nodeDragRefresh: function () {
      var that = this
      if (that.$store.state.nodeDragRefresh) {
        this.log('watch:nodeDragRefresh:', this.$store.state.nodeDragRefresh)
        that.newTreeList = []
        this.queryNewTree()
        this.getTree()
        this.queryProDetail()
        that.$store.state.nodeDragRefresh = false
      }
      return this.$store.state.nodeDragRefresh
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
    resettt: function () {
      var that = this
      setTimeout(function () {
        that.$store.commit('setDateOption', {OptionObj: that.nodeDragOption, startDate: that.nodeDragTimeEdit.start, endDate: that.nodeDragTimeEdit.finish})
      }, 1000)
    },
    DragTimeEditCancel: function () {
      this.$store.state.timeDialogVisible = false
      this.$store.state.dragResetDate = false
      this.queryNewTree()
    },
    DragTimeEditOk: function () {
      var that = this
      // this.log('nodeDragTimeEdit.start:', this.nodeDragTimeEdit.start)
      // this.log('nodeDragTimeEdit.finish:', this.nodeDragTimeEdit.finish)
      if (that.nodeDragTimeEdit.start) {
        this.$store.state.resetDragStart = that.nodeDragTimeEdit.start
      } else {
        this.$store.state.resetDragStart = this.$store.state.defaultParentStart
      }
      if (that.nodeDragTimeEdit.finish) {
        this.$store.state.resetDragFinish = that.nodeDragTimeEdit.finish
      } else {
        this.$store.state.resetDragFinish = this.$store.state.defaultParentFinish
      }
      // this.$store.state.dragResetDate = true
      this.$store.state.timeDialogVisible = false
      var dragData = that.$store.state.currentDraggedData
      var start = this.$store.state.resetDragStart
      var finish = this.$store.state.resetDragFinish
      // that.$store.state.currentDraggedData = {
      //   draggedNodeId: data,
      //   parentNodeId: newTreeItem.id,
      //   insertIndex: 1
      // }
      that.ajax('/myProject/moveStructure', {id: dragData.draggedNodeId, parentId: dragData.parentNodeId, sortCode: dragData.insertIndex, startTime: start, endTime: finish}).then(res => {
        that.log('moveStructure:', res)
        if (res.code === 200) {
          that.queryNewTree()
          that.getTree()
        }
      })
    },
    // updateTree: function (targetId, parentId, nodeIndex, start, finish) {
    //   var that = this
    //   that.ajax('/myProject/moveStructure', {id: targetId, parentId: parentId, sortCode: nodeIndex, startTime: start, endTime: finish}).then(res => {
    //     that.log('moveStructure:', res)
    //   })
    // },
    showTree: function () {
      this.TreeStructureShow = true
      this.queryNewTree()
    },
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
      this.log(123)
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
    remoteMethod2 (query) {

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
    // 测试右键
    rightKey: function (e) {
      this.log('e.:', e.offsetX)
      e.preventDefault()

      // 获取我们自定义的右键菜单p
      var menu = document.querySelector('#menu')

      // 根据事件对象中鼠标点击的位置，进行定位
      menu.style.left = e.offsetX + 'px'
      menu.style.top = e.offsetY + 30 + 'px'

      // 改变自定义菜单的宽，让它显示出来
      menu.style.width = '125px'
    },
    TaskDistributeCallbackFuc (res) {
      let that = this
      if (res.code === 200) {
        that.getTree()
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
    },
    // // 商品上传成功后续
    ProGoodsInfoCallbackFuc (res) {
      var that = this
      if (res.code === 200) {
        that.$Message.success('保存成功!')
        // that.queryProDetail()
        that.goodsEdit = false
      } else {
        that.$message({
          message: res.msg,
          type: 'warning'
        })
      }
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
    // 取消商品信息弹窗
    cancel () {
      this.goodsEdit = false
    },
    // zh点击项目计划获取项目详情
    getPlanTree (plan) {
      let that = this
      that.activeId = plan.id
      // 判断是否可以增加计划
      that.parentId = plan.id
      if (plan.type === '1') {
        that.panshow = false
      } else {
        that.panshow = true
      }
      that.getTree()
    },
    getTree () {
      let that = this
      that.ajax('/myProject/getPlanAndTaskTree', { id: that.activeId }).then(res => {
        this.log('getPlanAndTaskTree:', res)
        if (res.code === 200) {
          that.listTree = []
          that.treeName = '收缩'
          that.listTree = res.data
          that.listTree.forEach((item, index) => {
            item['show'] = true
          })
        }
      })
    },
    queryNewTree (proDetRes) {
      let that = this
      that.ajax('/myProject/getProjectTree', { firstPlanId: that.firstPlanId }).then(res => {
        if (res.code === 200) {
          that.log('查询新树：', res)
          that.newTreeList = []
          res.data[0].type = 'rootPlan'
          res.data[0].start = '2010-01-01 00:00:00'
          res.data[0].finish = '2100-01-01 00:00:00'
          // res.data[0].dateTimeFlag = 'native'
          // that.checkDateTime(res.data[0].children, res.data[0].start, res.data[0].finish)
          that.newTreeList = res.data
          // that.TreeJsonDataName = JSON.stringify(that.newTreeList)
        }
      })
    },
    checkDateTime: function (childrenList, parentStart, parentFinish) {
      if (childrenList.length > 0) {
        var parentStartStamp = new Date(parentStart).getTime()
        var parentFinishStamp = new Date(parentFinish).getTime()
        for (var i = 0; i < childrenList.length; i++) {
          var childStartDateStamp = new Date(childrenList[i].start).getTime()
          var childFinishDateStamp = new Date(childrenList[i].finish).getTime()
          if (childStartDateStamp < parentStartStamp || childFinishDateStamp > parentFinishStamp) {
            childrenList[i].dateTimeFlag = 'over'
          }
        }
      }
    },
    // zh展开树状结构
    slideTree () {
      let that = this
      that.showName = false
      that.show = true
      that.listTree.forEach((item, index) => {
        item['show'] = true
        that.$set(that.listTree, index, item)
      })
    },
    // zh收缩树状结构
    slideTree1 () {
      let that = this
      that.showName = true
      that.show = false
      that.listTree.forEach((item, index) => {
        item['show'] = false
        this.$set(that.listTree, index, item)
      })
    },
    // 收缩与展开内容
    slideToContent () {
      this.contentSlide = !this.contentSlide
    },
    // zh 点击详情获取任务详情
    showPlanDetail (nodeId, flag, e) {
      var that = this
      // this.log('pppppp:', nodeId)
      // this.selectProjectId(nodeId, flag, e)
      this.currentNodeId = nodeId
      this.isChangeActive = true
      console.log('idddddd', this.currentNodeId)
      if (nodeId.substring(0, 1) === 'J') {
        that.TaskDetailCompShow = true
      } else {
        that.value444 = true
      }
    },
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
    showEditFormFuc: function (id) {
      var that = this
      that.modifyTaskVisible = true
      that.currentNodeId = id
      console.log(id)
    },
    showPlanEditFormFuc: function (id) {
      var that = this
      that.planEditShow = true
      that.currentNodeId = id
    },
    proBaseEditClick () {
      this.DrawerBaseEdit = true
    },
    proGoodsEditClick () {
      this.goodsEdit = true
    },
    // 附件 附件预览
    GetFilePreData (obj) {
      if (obj.previewUrl && this.isImage(obj.fileName)) {
        this.showBigImage1(obj.previewUrl)
      }
    },
    // 附件上传 获取附件上传组件发来的附件信息 新组件
    GetFileInfo (obj) {
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
      // console.log(1111111111111111111)
      var that = this
      that.ajax('/myProject/getProjectDetail', {projectUID: that.$store.state.proId}).then(res => {
        if (res.code === 200) {
          this.log('getProjectDetail:', res)
          that.memberList = res.data.memberList
          that.proDetailMsg = res.data
          that.startPlanDate = res.data.startDate.split(' ')[0]
          that.endPlanDate = res.data.endDate.split(' ')[0]
          that.planList = res.data.planOrJobList
          // that.log('planList:', that.planList)
          that.firstPlanId = res.data.firstPlanId
          if (res.data.projectType === '产品研发') {
            that.archives = true
          } else {
            that.archives = false
          }
          for (var i = 0; i < res.data.fileList.length; i++) {
            if (that.isImage(res.data.fileList[i].showName)) {
              res.data.fileList[i].isImg = true
            } else {
              res.data.fileList[i].isImg = false
            }
            res.data.fileList[i].downloadUrl =
              that.$store.state.baseServiceUrl +
              '/file/downloadFile?realUrl=' +
              res.data.fileList[i].realUrl +
              '&showName=' +
              res.data.fileList[i].showName
          }
          if (res.data.planOrJobList.length > 0) {
            // that.log('activeId:', that.activeId)
            if (!that.activeId) {
              that.activeId = res.data.planOrJobList[0].id
              console.log(res.data.planOrJobList[0])
              if (res.data.planOrJobList[0].type === '2') {
                that.panshow = true
              }
              that.parentId = that.activeId
            }
          } else {
            that.activeId = ''
          }
          // that.selectProjectId(that.activeId, 'QueryFirstLevelChild')
          // zh获取默认数据
          that.getTree()
        }
      })
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
      // if (type === 'QueryFirstLevelChild') {
      //   that.activeId = id
      //   if (e) {
      //     var obj = e.currentTarget
      //     $(obj).addClass('active').siblings().removeClass('active')
      //   }
      // }
      // this.log(that.activeId)
      // that.getPlanTree(that.activeId)
      that.getTree()
      // that.ajax('/myProject/getPlanOrTaskById', { id: that.activeId }).then(res => {
      //   if (res.code === 200) {
      //     for (var i = 0; i < res.data.length; i++) {
      //       res.data[i].start = res.data[i].start.split(' ')[0]
      //       res.data[i].finish = res.data[i].finish.split(' ')[0]
      //       res.data[i].children = [
      //         {
      //           id: 1,
      //           name: '测试'
      //         }
      //       ]
      //     }
      //     that.data5 = res.data
      //   }
      // })
    },
    showDetailPage: function (data) {
      // this.log(data)
      var that = this
      that.currentNodeId = data.id
      that.isChangeActive = false
      if (data.type === 'task') {
        that.TaskDetailCompShow = true
      } else if (data.type === 'plan') {
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
      that.ajax('/myProject/getPlanOrTaskById', { id: e.id }).then(res => {
        if (res.code === 200) {
          for (var i = 0; i < res.data.length; i++) {
            res.data[i].start = res.data[i].start.split(' ')[0]
            res.data[i].finish = res.data[i].finish.split(' ')[0]
            res.data[i].children = [
              {
                id: 1,
                name: '测试'
              }
            ]
          }
          e.children = res.data
        }
      })
    },
    // 历史记录 点击“历史记录”打开历史记录抽屉
    openHisDrawer () {
      this.DrawerHistory = true
      this.getHistoryCont()
      this.getPeople()
    },
    // 历史记录 获取历史记录
    getHistoryCont () {
      var that = this
      that
        .ajax('/myProject/getLogAndComment', {
          projectUID: that.proId,
          pageSize: 10,
          pageNum: that.pageN
        })
        .then(res => {
          if (res.code === 200) {
            for (var i = 0; i < res.data.list.length; i++) {
              for (var j = 0; j < res.data.list[i].uploads.length; j++) {
                if (that.isImage(res.data.list[i].uploads[j].showName)) {
                  res.data.list[i].uploads[j].isImage = true
                } else {
                  res.data.list[i].uploads[j].isImage = false
                }
                var downurl =
                  that.$store.state.baseServiceUrl +
                  '/file/downloadFile?realUrl=' +
                  res.data.list[i].uploads[j].realUrl +
                  '&showName=' +
                  res.data.list[i].uploads[j].showName
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
      that.addProjectCommentPayload.contentId = that.proId
      that.addProjectCommentPayload.content = that.commitComent
      that.addProjectCommentPayload.attachmentId = that.SetFileIdStr()
      that.peopleList = that.peopleList.filter(item => that.commitComent.indexOf(item.Name + '(' + item.jName + ')') !== -1)
      that.addProjectCommentPayload.memberList = that.peopleList
      console.log(that.peopleList)
      if (that.commitComent) {
        that.ajax('/comment/addComment', JSON.stringify(that.addProjectCommentPayload)).then(res => {
          if (res.code === 200) {
            that.IsClear = true
            that.peopleList = []
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
        this.ajax(
          '/myProject/autoCompleteNames',
          that.moreUserSelectPayload
        ).then(res => {
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
    PlanDelCallbackFuc: function (res, type) {
      var that = this
      if (res.code === 200) {
        that.queryProDetail()
        // that. = that.planList[0].id
        that.getTree()
        // if (that.isChangeActive) {
        //   that.activeId = ''
        // }
        if (type === '1') {
          that.value444 = false
          if (that.isChangeActive) {
            that.activeId = ''
          }
        } else {
          that.value444 = true
        }
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
    TaskDelCallbackFuc: function (res, type) {
      var that = this
      if (res.code === 200) {
        that.queryProDetail()
        // if (that.isChangeActive) {
        //   that.activeId = ''
        // }
        if (type === '1') {
          that.TaskDetailCompShow = false
          if (that.isChangeActive) {
            that.activeId = ''
          }
        } else {
          that.TaskDetailCompShow = true
        }
        // that.activeId = that.planList[0].id
        // that.TaskDetailCompShow = false
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
      that.ajax('/myProject/getPlanOrTaskDetail', { id: nodeId }).then(res => {
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
            return (
              time.getTime() < that.disabledStarTime2 ||
              time.getTime() > that.disabledEndTime2
            )
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
          that.$store.state.refshPlan = true
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
      that
        .ajax('/myProject/delPlanOrTask', { id: that.currentNodeId })
        .then(res => {
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
          that.$store.state.editFlag = true
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
      // this.log('ModifyTaskCallbackFuc:', res)
      if (res.code === 200) {
        that.modifyTaskVisible = false
        // that.activated = ''
        // that.selectProjectId()
        that.$store.state.taskEdit = true
        that.queryProDetail()
        // this.getTree()
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
      if (obj.res.code === 200) {
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
}
</script>

<style scoped>
div img {
  width: 100%;
}
.topCon {
  display: flex;
  justify-content: space-between;
}
.topConLf {
  width: 75%;
}
.topConRt {
  width: 280px;
  position: relative;
}
.title {
  height: 30px;
  color: chocolate;
  font-size: 18px;
  /*font-family: "黑体";*/
  font-weight: bold;
}
.proDetail {
  font-size: 14px;
  color: #666;
  /*text-indent: 2em;*/
  /*padding-top: 20px;*/
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  text-overflow: ellipsis;
  overflow: hidden;
}
.myMsg,
.dataMsg {
  color: #888;
  display: flex;
  font-size: 15px;
  justify-content: start;
}
.proFileListPre{
  border: 1px solid #409eff;
  border-radius: 3px;
  width: 30px;
  height: 20px;
  margin-left: 6px;
  display: flex;
  /*background: url("");*/
  background-size: cover;
}
.proFileListPre div:nth-child(2){
  display: none;
}
.proFileListPre:hover div:nth-child(2){
  display: block;
}
.editHistoryBtn span {
  cursor: pointer;
}
.imgBox {
  position: absolute;
  top: -20px;
  right: 15px;
  opacity: 0.9;
  width: 90px;
}
.imgBox img {
  width: 100%;
}
/*
   *  ============================= 项目成员列表
   **/
.memList {
  width: 100%;
  display: flex;
  margin-top: 30px;
  background-color: #f5f8fa;
}
.slideUpConent {
  /*margin-top: 30px;*/
  _width: 60px;
  height: 30px;
  margin-top:0px;
  /*border:1px solid #999;*/
  text-align:center;
  line-height: 30px;
  cursor: pointer;
  display: flex;
  _justify-content: space-between;
}
.slideUpConent div:nth-child(2){
  width: 50px;
  border-left: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  border-right: 1px solid #f0f0f0;
}
.slideUpConent div:nth-child(1),.slideUpConent div:nth-child(3){
  flex-grow: 1;
  border-top: 1px solid #f0f0f0;
}
.memName {
  width: 34px;
  font-size: 14px;
  color: #fff;
  float: left;
  padding: 5px 0;
  text-align: center;
  background-color: #409eff;
  border-radius: 0px;
  border-bottom-left-radius: 5px;
  border-top-left-radius: 5px;
}
.memBox {
  width: 98%;
  float: left;
  max-height: 104px;
  overflow: scroll;
  overflow-x: hidden;
  border-top: 1px solid #f0f0f0;
}
.memBox div {
  float: left;
  margin-left: 25px;
  color: #777;
  font-size: 14px;
  cursor: pointer;
  line-height: 38px;
}
.memBox div.moreBtn {
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
.memBox .active {
  color: #fff;
  background-color: #409eff;
}
.memName {
  width: 34px;
  font-size: 14px;
  color: #fff;
  float: left;
  padding: 5px 0;
  text-align: center;
  background-color: #409eff;
  border-radius: 0px;
  border-bottom-left-radius: 5px;
  border-top-left-radius: 5px;
}
/*
   *  ============================ 一级项目计划
   */
.planList {
  width: 100%;
  display: flex;
  margin-top: 10px;
  background-color: #f5f8fa;
  min-height: 60px;
}
.planName {
  width: 34px;
  font-size: 14px;
  color: #fff;
  float: left;
  padding: 5px 0;
  text-align: center;
  background-color: #409eff;
  border-radius: 0px;
  border-bottom-left-radius: 5px;
  border-top-left-radius: 5px;
}
.planBox {
  width: 98%;
  float: left;
  min-height: 60px;
  overflow: scroll;
  overflow-x: hidden;
  border-top: 1px solid #f0f0f0;
}
.planBox .plan-all {
   float: left;
}
.planBox .plan-all:hover .planDetail{
   display: block;
}
.planBox .plan-list {
  padding: 4px 20px;
  float: left;
  border-radius: 4px;
  background-color: #fff;
  margin-left: 10px;
  margin-top: 15px;
  margin-bottom: 10px;
  color: #777;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
}
.planDetailBox{
  float: left;
  width: 21px;
  _background-color: #ccc;
}
/*.planBox .plan-list:hover {
   display: block;
} */
.planBox .addPlan {
   border:1px solid #333;
   color:#333;
  margin-right: 10px;
   padding: 2px 15px;
   font-weight: bolder;
}
.planBox .planDetail {
    width: 20px;
    float: right;
    cursor: pointer;
    /*background: #fff;*/
    height: 29px;
    margin-top: 15px;
    text-align: center;
    line-height: 30px;
    display: none;
    color:#409EFF;
    font-size: 19px;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
}
.planBox .planDetail i {
   -webkit-user-select:none;
   -moz-user-select:none;
   -ms-user-select:none;
   user-select:none;
}
.planBox .active {
   color: #fff;
   background-color: #409eff;
}
/*
   *  =========================== 项目详情 树形结构
   */
.devide {
  height: 40px;
  clear: both;
  line-height: 40px;
  padding: 0 10px;
  font-size: 16px;
  color: #999;
  margin-top: 20px;
  background-color: #f5f8fa;
}
/*没有数据*/
.noData {
  text-align: center;
  margin-top: 50px;
  color:#999;
}
.proTreeHeader {
  display: flex;
  justify-content: space-between;
}
.custom-tree-node {
  flex: 1;
  align-items: center;
  font-size: 14px;
  padding-right: 8px;
}
.dataName {
  display: inline-block;
}
.dataName:hover {
  color: chocolate;
}
.proMsg {
  width: 800px;
  float: right;
  display: flex;
  justify-content: space-between;
}
.treeName {
  width: 240px;
}
.treeTime {
  float: right;
}
.treeState {
  width: 100px;
}
/*
   *  =========================== 成员管理
   */
/*
   *  =========================== 历史记录
   */
.el-textarea {
  margin-top: 15px;
  margin-left: 0px;
}
.el-textarea__inner {
  width: 100%;
  min-height: 80px;
}
.hisFileUplBox {
  color: #1296db;
  display: flex;
  justify-content: space-between;
  line-height: 40px;
  font-size: 14px;
  /*font-family: '黑体';*/
  padding: 0 10px;
  background-color: #f5f8fa;
}
.hisFileUplBox div img {
  float: left;
  margin-top: 10px;
  margin-right: 10px;
  width: 18px;
}
/*
   *  =========================== 一级计划 抽屉
   */
.tableHeader {
  display: flex;
  justify-content: space-between;
}
.tableProTitle {
  font-size: 16px;
}
.fileModel {
  min-height: 110px;
  width: 260px;
  position: absolute;
  box-shadow: 1px 1px 4px #999;
  top: 0;
  right: 0;
  z-index: 999;
  background-color: #fff;
}
.fileItem {
  height: 30px;
  padding: 0 10px;
  line-height: 30px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #f1f1f1;
}
.fileClose {
  position: absolute;
  bottom: 2px;
  right: 2px;
  cursor: pointer;
  color: #fff;
  height: 20px;
  line-height: 20px;
  padding: 0 8px;
  background-color: #409eff;
}
.fileDone {
  display: flex;
  justify-content: space-between;
  text-align: center;
  width: 40%;
  font-size: 12px;
  color: #409eff;
}
  /*右键菜单测试*/
  #menu{
    width: 0; /*设置为0 隐藏自定义菜单*/
    height: 125px;
    background-color: #fff;
    overflow: hidden; /*隐藏溢出的元素*/
    box-shadow: 0 1px 1px #888,1px 0 1px #ccc;
    position: absolute; /*自定义菜单相对与body元素进行定位*/
  }
  .menu{
    width: 130px;
    height: 25px;
    line-height: 25px;
    padding: 0 10px;
  }
  .selectUserDialog2{
    width: 300px;
    padding: 20px 10px;
    background-color: #fff;
    position: absolute;
    z-index: 200;
    border-radius: 6px;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,.2);
  }
  .selectUserBtn{
    text-align: center;
    margin-top: 20px;
  }
  .selectDateItem{
    margin-top: 20px;
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
</style>
