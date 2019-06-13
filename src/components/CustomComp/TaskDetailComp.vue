<template>
  <div class="TaskDetailComp" @click="hidePanel">
      <!--<button @click="testData">TEST</button>-->
      <div>{{taskEdit?'':''}}</div>
      <div class="slidTop">
        <div v-bind:class="'topState' + taskBasicMsg.status"><img src="../../../static/img/stataNew.png" style="float: left;margin-top: 6px;" alt="">{{taskBasicMsg.statusStr}}</div>
        <div><span>紧急程度: </span><span><Rate v-model="taskBasicMsg.jobLevel" disabled/></span></div>
        <div>
          <div style="display: flex;justify-content: space-between" v-if="taskBasicMsg.status !== '3'">
            <div style="width: 50px;" v-if="taskBasicMsg.showDeleteFlag === 0 ? false:true" @click="delTask(taskBasicMsg.uid)"><Icon type="ios-trash-outline" size="24" color="#53b5ff"/></div>
            <div @click="modifyTask()" style="width: 50px;padding-top: 3px;font-size: 14px;color: #409EFF; cursor: pointer;" v-if="taskBasicMsg.showDeleteFlag === 0 ? false:true"><i class="el-icon-edit" style="font-size: 18px;color: #409EFF"></i> 修改</div>
          </div>
        </div>
      </div>
      <div class="taskMsg">
        <div class="taskLf">
          <div class="taskName">{{taskBasicMsg.jobName}}</div>
          <div class="taskDetail">
            <div class="taskDetailCnt" v-bind:title="taskBasicMsg.description">
              {{taskBasicMsg.description}}
            </div>
            <div class="taskDetailCntMore" v-on:click="taskIntroMore" v-if="taskBasicMsg.description && taskBasicMsg.description.length > 112">
              <Icon v-if="!taskIntroMoreOpen" size="16" type="ios-arrow-down" />
              <Icon v-if="taskIntroMoreOpen" size="16" type="ios-arrow-up" />
            </div>
          </div>
        </div>
        <div class="taskRt">
          <div v-if="taskBasicMsg.status === '0'"><img src="../../../static/img/unstart.png" alt=""></div>
          <div v-if="taskBasicMsg.status === '1'"><img src="../../../static/img/doing.png" alt=""></div>
          <div v-if="taskBasicMsg.status === '2'"><img src="../../../static/img/finish.png" alt=""></div>
          <div v-if="taskBasicMsg.status === '3'"><img src="../../../static/img/stope.png" alt=""></div>
        </div>
      </div>
      <div class="taskTime">
        <el-collapse v-model="activeNames">
          <el-collapse-item style="padding: 0 10px;" name="1">
            <template slot="title">
              <img src="../../../static/img/time.png" alt=""><span style="margin-left: 10px;">起止时间: {{taskBasicMsg.taskStartDate}} 到 {{taskBasicMsg.taskFinishDate}}</span>
              <div style="margin-left: 10%;" v-if="taskBasicMsg.dayNum && taskBasicMsg.dayNum >= 0">剩余 <span style="color: #53b5ff;font-size: 16px;font-weight: bold">{{taskBasicMsg.dayNum}}</span> 天</div>
              <div style="margin-left: 10%;" v-if="taskBasicMsg.dayNum && taskBasicMsg.dayNum < 0"><span style="color:red;font-size: 16px;">已逾期</span></div>
              <div style="margin-left: 10%;" v-if="!taskBasicMsg.dayNum"><span v-bind:class="'topState' + taskBasicMsg.status">{{taskBasicMsg.statusStr}}</span></div>
            </template>
            <div class="managePro">
              <div><img src="../../../static/img/fuzeren.png" alt=""><span class="proLabel">负责人:</span><span style="color: #888;" v-if="!taskBasicMsg.userName">无负责人</span><span v-if="taskBasicMsg.userName">{{taskBasicMsg.userName}}</span></div>
              <div><img src="../../../static/img/faqiren.png" alt=""><span class="proLabel">创建人:</span><span>{{taskBasicMsg.createrName}}</span></div>
            </div>
            <div class="managePro" style="margin-top: 10px;">
              <div><img src="../../../static/img/kaishi.png" alt=""><span class="proLabel">实际开始:</span><span v-if="taskBasicMsg.dealWithDate">{{taskBasicMsg.dealWithDate}}</span><span style="color: #888;" v-if="!taskBasicMsg.dealWithDate">暂未开始</span></div>
              <div><img src="../../../static/img/jiesu.png" alt=""><span class="proLabel">实际结束:</span><span v-if="taskBasicMsg.realFinishDate">{{taskBasicMsg.realFinishDate}}</span><span style="color: #888;" v-if="!taskBasicMsg.realFinishDate">暂未完成</span></div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="cannetProjectFile">
        <div style="display: inline-block"><img src="../../../static/img/guanlian.png" alt=""><span>关联项目:</span></div>
        <span class="linkProject" v-if="taskBasicMsg.reProjectList.length > 0" v-for="(project, index) in taskBasicMsg.reProjectList" v-bind:key="index" @click="getNextPlan(project.projectUID)">{{project.projectName}}, </span>
        <span style="font-size: 14px;color: #888;" v-if="!taskBasicMsg.reProjectList || taskBasicMsg.reProjectList.length === 0" >未关联项目</span>
        <span class="bainProject" v-if="taskBasicMsg.showMenu > 0" @click="connectProject(taskBasicMsg.uid)">关联项目</span>
      </div>
      <div class="cannetProject">
        <div style="display: inline-block"><img src="../../../static/img/xiangmu.png" alt=""><span>所属项目:</span></div>
        <div style="display: inline-block;color: #409EFF;cursor: pointer;" @click="toProjectDetail(taskBasicMsg.projectUID)">{{taskBasicMsg.projectName}}</div>
      </div>
      <div class="cannetProject">
        <div style="display: inline-block"><img src="../../../static/img/taskFa2.png" alt=""><span>父级任务:</span></div>
        <div style="display: inline-block;color: #409EFF;cursor: pointer;" v-if="taskBasicMsg.parentTaskName" @click="toDetail(taskBasicMsg.parentTaskID)">{{taskBasicMsg.parentTaskName}}</div>
        <div style="display: inline-block;color: #888;" v-if="!taskBasicMsg.parentTaskName">无父级任务</div>
      </div>
      <div class="cannetProject">
        <div style="display: inline-block"><img src="../../../static/img/taskFa.png" alt=""><span>父级计划:</span></div>
        <div style="display: inline-block;color: #409EFF;cursor: pointer;" v-if="taskBasicMsg.planName" @click="toPlanDetail(taskBasicMsg.planUID)">{{taskBasicMsg.planName}}</div>
        <div style="display: inline-block;color: #888;" v-if="!taskBasicMsg.planName">无父级计划</div>
      </div>
      <div class="cannetProjectFile">
        <div style="display: inline-block"><img src="../../../static/img/fujian.png" alt=""><span>任务附件:</span></div>
        <div style="display: inline-block;font-size: 14px;line-height: 26px;" v-if="taskBasicMsg.attachment">
          <span v-for="(file, index) in taskBasicMsg.attachment" v-bind:key="index" style="margin-left: 10px;">
            <span style="display: inline-block;font-size: 12px;">{{file.showName}}</span>
            <span v-if="file.isImg" @click="showImagePre(file.previewUrl, file.showName)" style="display: inline-block;color: #53b5ff;cursor: pointer;">预览</span>
            <span style="display: inline-block;"><a v-bind:href="file.downurl"> 下载<i style="font-weight: bold !important; padding: 5px; color: chocolate;" class="el-icon-download"></i></a></span>
          </span>
        </div>
        <div style="display: inline-block;font-size: 14px;color: #888;" v-if="!taskBasicMsg.attachment || taskBasicMsg.attachment.length === 0">暂无附件</div>
      </div>
      <div v-if="taskBasicMsg.status !== '3' ">
        <div class="cannetProject" v-if="taskBasicMsg.showMenu !== 0 && taskBasicMsg.showMenu !== 3 && taskBasicMsg.showMenu !== 4">
          <!--&& taskBasicMsg.showMenu === '1'-->
          <Button v-if="taskBasicMsg.status === '0' && taskBasicMsg.showMenu === 1" type="warning" style="margin-right: 20px;" @click="startTask(taskBasicMsg.uid)">任务开始</Button>
          <Button v-if="taskBasicMsg.status === '1'" type="success" style="margin-right: 20px;" @click="finishedTask()">任务完成</Button>
          <Button type="info" v-if="taskBasicMsg.timeoutButton === 1" style="margin-right: 20px;" @click="stopeTask(taskBasicMsg.uid)">任务暂停</Button>
          <Button type="info" style="margin-right: 20px;" @click="transferTask()">任务移交</Button>
          <Button type="info" @click="taskToDevided(taskBasicMsg.uid)">任务分解</Button>
        </div>
        <div class="cannetProject" v-if="taskBasicMsg.showMenu === 3">
          <Button v-if="taskBasicMsg.status === '2'" type="primary" style="margin-right: 20px;" @click="isReStartTask(taskBasicMsg.uid)">任务重启</Button>
        </div>
      </div>
      <div class="cannetProject" v-if="taskBasicMsg.showMenu === 4">
        <Button type="info" v-if="taskBasicMsg.timeoutButton === 2"  style="margin-right: 20px;" @click="startTaskstoped(taskBasicMsg.uid)">任务开启</Button>
      </div>
      <!-- 任务分解 引入组件-->
    <!--v-bind:TaskDistributeShow="toShowDevided"-->
    <!--v-bind:TaskDistributeShow="rilegou" tetstt -->
      <div v-show="toShowDevided2">
        <component v-bind:is="compArr.TaskDistribute"
                   v-bind:TaskDistributeShow="toShowDevided2"
                   fileFormId="TaskDistribute"
                   v-on:DistributeFormVisible="DistributeFormVisibleFuc"
                   v-on:TaskDistributeCallback="TaskDistributeCallbackFuc"
                   :nodeId="currentNodeId">
        </component>
      </div>
      <!-- 任务分解 end -->
      <div class="cannetProject1">
        <div style="display: inline-block"><img src="../../../static/img/taskList.png" alt=""><span>子任务<span style="color: #409EFF">({{childTaskList.length}})</span></span></div>
      </div>
      <div class="taskListChild">
        <div class="taskItemChild" v-if="childTaskList.length > 0" v-for="(childTask, index) in childTaskList" v-bind:key="index">
          <div class="childTaskName" @click="toDetail(childTask.uid)"><Icon type="md-copy" size="16" color="#409EFF"/> {{childTask.jobName}}</div>
          <div class="childTaskMsg">
            <div style="width: 60px;" v-bind:class="'childTaskStyle' + childTask.status">{{childTask.statusStr}}</div>
            <div style="width: 100px;" v-if="childTask.dayNum >= 0">剩余 <span style="color: #13ce66;font-size: 18px;">{{childTask.dayNum}}</span> 天</div>
            <div style="width: 100px;" v-if="childTask.dayNum < 0">逾期 <span style="color: #f00;font-size: 18px;">{{Math.abs(childTask.dayNum)}}</span> 天</div>
            <div style="width: 160px;">{{childTask.userName}}</div>
            <div style="margin-right: 0" class="taskDel" @click="childTaskDelete(childTask.uid)"><Icon type="md-close" size="18"/></div>
          </div>
        </div>
        <div class="taskItemChild2" style="text-align: center;color: #aaa;" v-if="childTaskList.length === 0">
          暂无子任务
        </div>
      </div>
      <!-- 关联流程 -->
      <div class="connectProcess">
        <div style="display: inline-block" class="connectProcessHeader">
          <img src="../../../static/img/liuc.png" alt="">
          <span>关联流程<span style="color: #409EFF">({{tableData.length}})</span></span>
          <Icon @click="tableDataReFresh($event)" class="reFreshIcon" type="md-refresh" style="color: #409EFF; font-size: 20px;" />
        </div>
        <div class="connectProcessHeader" v-on:click="connectProcessClick" style="cursor: pointer; color: rgb(64, 158, 255)">申请审批</div>
      </div>
      <div class="createProcess" v-show="createProcessShow" v-on:click="createProcessCancel">
        <div style="padding: 20px; position: relative;" v-on:click.stop="testMaopao">
          <h3 style="margin-bottom: 10px;">流程选择</h3>
          <div style="position: absolute; right: 15px; top: 15px;" v-on:click="closeProcess"><Icon type="md-close" size="16" /></div>
          <el-table :cell-class-name="slectRowClass" :data="FlowData" border style="width: 100%" @row-click="rowClick">
            <el-table-column prop="flowIndex" label="编号" width="80"></el-table-column>
            <el-table-column prop="name" label="流程名称"></el-table-column>
            <el-table-column prop="type" label="类别" width="80"></el-table-column>
          </el-table>
        </div>
      </div>
      <el-table :cell-class-name="rowClass" :data="tableData" border style="width: 100%;" @row-click="processItemRowClick">
        <el-table-column prop="SYS_PROCESSNAME" label="流程标题" width="260"></el-table-column>
        <el-table-column prop="creatorName" label="发起人" width="80"></el-table-column>
        <el-table-column prop="STATUSNAME" label="状态" width="80"></el-table-column>
        <el-table-column prop="SYS_STARTTIME" label="发起日期" width="180"></el-table-column>
        <el-table-column prop="Name" label="当前审批人" width="100"></el-table-column>
        <!--<el-table-column prop="address" label="地址"></el-table-column>-->
      </el-table>
      <!--<div class="taskItemChild2" style="text-align: center;color: #aaa;" v-if="tableData.length === 0">-->
        <!--暂无关联流程-->
      <!--</div>-->
      <div class="cannetProject1" style="margin-top: 20px;">
        <div style="display: inline-block"><img src="../../../static/img/goutong.png" alt=""><span>沟 通</span></div>
      </div>
      <div class="el-textarea" v-loading="loading2">
        <div class="peopleList" style="right: 0;top: -230px;" v-if="selectUserDiaShow2">
          <Input prefix="ios-search-outline" placeholder="请输人员姓名或拼音(如'张三'或 'zs')" style="width: 270px"  autofocus v-model="searchPeople" ref="re"/>
          <ul>
            <li v-for="(item, index) in options42" :key="index" @click="checkPeople(item)">{{item.Name + ' (' + item.jName + ')'}}</li>
          </ul>
        </div>
        <textarea name="content" class="el-textarea__inner" id="textArea2" type="text" v-model="commitComent" v-on:input="inputFunt"
                  @keyup.shift.50="inputConent"
                  @click="getTxt1CursorPosition" @keyup.delete ="deleteText"></textarea>
        <div class="cannetProject21">
          <!--引入组件 详情 沟通-->
          <component v-bind:is="compArr.FileUploadComp" fileFormId="taskDetailConnect" v-bind:clearInfo="IsClear" v-on:FileDataEmit="GetFileInfo"></component>
          <div><i-button type="info" style="margin-top: 6px;" v-bind:disabled="butnDisabled" @click="taskDetailconnect()">回复</i-button></div>
        </div>
      </div>
      <div class="cannetProject1-1">
        <div style="display: inline-block"><img src="../../../static/img/jilu.png" alt=""><span>沟通记录</span></div>
      </div>
      <div class="timeLine">
        <Timeline v-if="commentList && commentList.length > 0">
          <Timeline-item color="green" v-for="(comment, index) in commentList" v-bind:key="index">
            <p class="time">{{comment.createDate}}</p>
            <p class="content" v-bind:title="comment.content">{{comment.customer_name}}说: {{comment.content}}</p>
            <span v-for="(com, index2) in comment.attachment" v-bind:key="index2">
              <p class="content" v-if="com.showName">附件:
                <span style="display: inline-block"> {{com.showName}}</span>
                <span v-if="com.isImg" style="display: inline-block;color: #53b5ff;margin-left: 10px;cursor: pointer;" @click="showImagePre(com.previewUrl, com.showName)">预览</span>
                <span style="margin-left: 10px;display: inline-block;"><a v-bind:href="com.downloadUrl"> 下载<i style="font-weight: bold !important; padding: 5px; color: chocolate;" class="el-icon-download"></i></a></span>
              </p>
            </span>
          </Timeline-item>
        </Timeline>
        <div class="noComment" v-if="commentList.length === 0">还没有人发言呦~</div>
        <div style="text-align: center">
          <!--<Page :total="totalNum" size="small" :page-size="pageSize" show-total @on-change="getCurrentPage($event)"></Page>-->
          <el-pagination
            small
            @current-change="getCurrentPage($event)"
            background
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="totalNum">
          </el-pagination>
        </div>
      </div>
      <div class="cannetProject1-1" style="margin-top: 0">
        <div style="display: inline-block"><img src="../../../static/img/history.png" alt=""><span>操作记录</span></div>
      </div>
      <div class="timeLine">
        <Timeline>
          <Timeline-item v-for="(history, index) in historyList" v-bind:key="index">
            <p class="time">{{history.oTime}}</p>
            <p class="content">{{history.oName}}{{history.oContent}}</p>
            <p class="content" v-if="history.comment" style="color: #e8be68;">备注: {{history.comment}}</p>
            <span v-for="(his, index2) in history.attachment" v-bind:key="index2">
              <p class="content" v-if="his.showName"><span>附件:</span>
                <span style="display: inline-block"> {{his.showName}}</span>
                <span v-if="his.isImg" style="display: inline-block;color: #53b5ff;margin-left: 10px;cursor: pointer;" @click="showImagePre(his.previewUrl, his.showName)">预览</span>
                <span style="margin-left: 10px;display: inline-block;"><a v-bind:href="his.downloadUrl"> 下载<i style="font-weight: bold !important; padding: 5px; color: chocolate;" class="el-icon-download"></i></a></span>
              </p>
            </span>
          </Timeline-item>
        </Timeline>
        <div style="text-align: center">
          <!--<Page :total="totalHistoryNum" size="small" :page-size="pageSize" show-total @on-change="getCurrentHistoryPage($event)"></Page>-->
          <el-pagination
            small
            @current-change="getCurrentHistoryPage($event)"
            background
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="totalHistoryNum">
          </el-pagination>
        </div>
      </div>
    <!--任务移交-->
    <!--<el-dialog title="任务移交" :visible.sync="taskTransferVisible" width="26%" style="z-index: 82222 !important;">-->
    <div class="taskTransferBgcover" title="任务移交" v-if="taskTransferVisible" v-on:mousewheel.stop="noMousewheel($event)">
      <div class="taskTransferCnt" v-loading="taskTransferLoading">
        <div style="height: 30px;line-height: 30px"><span style="color: red">*</span> 任务移交人：</div>
        <el-autocomplete style="width:90%"
                         v-model="projectManager"
                         :fetch-suggestions="querySearchAsync2"
                         placeholder="请输入移交人姓名"
                         :trigger-on-focus="false"
                         @select="handleSelect2"
        ></el-autocomplete>
        <div style="height: 30px;line-height: 30px"><span style="color: red">*</span> 任务移交备注：</div>
        <textarea name="remark" class="el-textarea__inner" id="Transfer" type="text" v-model="commitComentT"></textarea>
        <component v-bind:is="compArr.FileUploadComp" fileFormId="taskTransfer" v-bind:clearInfo="IsClear" v-on:FileDataEmit="GetFileInfo"></component>
        <div slot="footer" class="dialog-footer" style="text-align: center;">
          <i-button @click="concelTransfer()">取消</i-button>
          <i-button type="info" v-bind:disabled="butnDisabledT" @click="taskTransfer()">确定</i-button>
        </div>
      </div>
    </div>
    <!--/ 任务完成 /-->
    <div class="taskFinishedBgcover" title="任务完成" v-if="taskFinishedVisible">
      <div class="el-textarea taskFinishedCnt" v-loading="loading9">
        <textarea name="remark" class="el-textarea__inner" id="textAreaF" type="text" v-model="commitComentF"></textarea>
        <!--<div class="cannetProject2">-->
        <component v-bind:is="compArr.FileUploadComp" fileFormId="taskFinished" v-bind:clearInfo="IsClear" v-on:FileDataEmit="GetFileInfo"></component>
        <div slot="footer" class="dialog-footer" style="text-align: center;">
          <i-button @click="concelFinished()">取消</i-button>
          <i-button type="info" v-bind:disabled="butnDisabledF" @click="confirmFinished()">确定</i-button>
        </div>
      </div>
    </div>
    <div class="stopeModel" v-if="projectStopeVisible2">
      <div class="stopeTitle">任务开启</div>
      <div class="modelCon">确定开启任务且修改时间吗?</div>
      <div>
        <el-button size="small" @click="startTaskOnly()">开启不修改时间</el-button>
        <el-button type="primary" size="small" @click="startEditTask()">开启修改时间</el-button>
      </div>
    </div>
    <!--<Drawer class="drawerScroll" title="修改任务" :closable="false" width="40%" v-model="modifyTaskVisible">-->
      <!--&lt;!&ndash; 修改任务 编辑任务 引入组件 &ndash;&gt;-->
      <!--<component v-bind:is="compArr.ModifyTask" v-bind:DrawerOpen="modifyTaskVisible" fileFormId="ModifyTask" v-on:FilePreEmit="GetFilePreData" v-on:ModifyTaskCallback="ModifyTaskCallbackFuc" :nodeId="currentNodeId"></component>-->
    <!--</Drawer>-->
  </div>
</template>

<script>
import FileUploadComp from '../CustomComp/FileUploadComp.vue'
import ModifyTask from './ModifyTask.vue'
import TaskDistribute from './TaskDistribute.vue'
export default {
  name: 'TaskDetailComp',
  props: ['nodeId', 'taskDrawerOpen', 'modifyTaskRes'],
  components: {
    ModifyTask,
    FileUploadComp,
    TaskDistribute
  },
  data () {
    return {
      // 是否有权限查看所属项目
      projectAuth: '1',
      taskIntroMoreOpen: false,
      peopleList: [],
      // 组织架构人员
      options42: [],
      // 搜索人员
      searchPeople: '',
      // @组织架构是否出现
      selectUserDiaShow2: false,
      rid: '',
      stopeId: '',
      taskIdEdit: '',
      IsClear: false,
      loading2: false,
      showDrawer: false,
      butnDisabled: true,
      butnDisabledF: false,
      projectListShow: false,
      projectStopeVisible2: false,
      selDateEnd2: '',
      selDateStart2: '',
      taskBasicMsg: '',
      activeNames: '1',
      currentNodeId: '',
      commitComent: '',
      pageSize: 5,
      totalNum: 0,
      showFileUrl: '',
      toShowDevided: false,
      toShowDevided2: false,
      rilegou: false,
      testtest: 1,
      modifyTaskVisible: false,
      taskId: [],
      commentList: [],
      historyList: [],
      FileUploadArr: [],
      childTaskList: [],
      totalHistoryNum: 0,
      disabledStarTime: '',
      disabledEndTime: '',
      taskComment: {
        uid: '',
        pageNum: 1,
        pageSize: 5
      },
      taskHistoryList: {
        uid: '',
        pageNum: 1,
        pageSize: 5
      },
      // 引入组件
      compArr: {
        ModifyTask: 'ModifyTask',
        FileUploadComp: 'FileUploadComp',
        TaskDistribute: 'TaskDistribute'
      },
      // 任务移交
      taskTransferVisible: false,
      taskTransferLoading: false,
      projectManager: '',
      transferUserId: '',
      transferUserName: '',
      commitComentT: '',
      butnDisabledT: true,
      // 任务完成
      taskFinishedVisible: false,
      commitComentF: '已完成',
      loading9: false,
      createProcessShow: false,
      FlowData: [
      ],
      tableData: []
    }
  },
  computed: {
    taskEdit: function () {
      var that = this
      if (that.$store.state.taskEdit === true) {
        that.toDetail(this.nodeId)
      }
      that.$store.state.taskEdit = false
      return that.$store.state.taskEdit
    }
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.focus()
      }
    }
  },
  watch: {
    taskIntroMoreOpen: function (val, oV) {
      if (val) {
        $('.taskDetailCnt').css('display', 'block')
      } else {
        $('.taskDetailCnt').css('display', '-webkit-box')
      }
    },
    modifyTaskRes: function (val, oV) {
      if (val) {
        this.$emit('CompThrow', false)
        this.toDetail(this.nodeId)
      }
    },
    taskDrawerOpen: function (val, oV) {
      var that = this
      if (val) {
        that.showDrawer = true
        that.toDetail(that.nodeId)
        that.TaskConnectProcessList()
        that.getPeople()
        // that.taskIntroMoreOpen = true
      } else {
        that.concelTransfer()
        that.showDrawer = false
        that.toShowDevided2 = false
        that.taskFinishedVisible = false
        that.projectStopeVisible2 = false
        that.taskIntroMoreOpen = false
      }
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
        setTimeout(() => {
          this.$refs['re'].focus()
        }, 200)
      } else {
        this.selectUserDiaShow2 = false
      }
    },
    commitComentF: function (val, oVal) {
      if (val === '') {
        this.butnDisabledF = true
      } else {
        this.butnDisabledF = false
      }
    },
    projectManager: function (val, oVal) {
      if (val) {
        this.butnDisabledT = false
      } else {
        this.butnDisabledT = true
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
  },
  // created: function () {
  //   $('.TaskDetailComp').click(function () {
  //     $('.stopeModel').hide()
  //     return false
  //   })
  //   $('.stopeModel').click(function () {
  //     return false
  //   })
  // },
  methods: {
    taskIntroMore: function () {
      this.log($('.taskDetailCnt').html())
      this.taskIntroMoreOpen = !this.taskIntroMoreOpen
      // if (this.taskIntroMoreOpen) {
      //   $('.taskDetailCnt').css('display', 'block')
      // } else {
      //   $('.taskDetailCnt').css('display', '-webkit-box')
      // }
    },
    getNextPlan: function (pid) {
      this.$store.state.proId = pid
      this.$router.push('/goodsDetail')
    },
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
    getTxt1CursorPosition (e) {
      this.getPosition(e.target)
    },
    // 点击任意区域弹窗消失
    hidePanel (event) {
      let sp2 = document.querySelector('.peopleList')
      let sp3 = document.querySelector('.stopeModel')
      if (sp2) {
        if (!sp2.contains(event.target)) {
          this.selectUserDiaShow2 = false
        }
      }
      if (sp3) {
        if (!sp3.contains(event.target)) {
          this.projectStopeVisible2 = false
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
          this.commitComent = contentB + delAfter
        }
      })
    },
    // 检测历史记录输入功能
    inputFunt (e) {
      this.getTxt1CursorPosition(e)
    },
    inputConent () {
      this.selectUserDiaShow2 = true
      // let arr = this.commitComent.split('@')
      this.searchPeople = ''
      if (this.selectUserDiaShow2) {
        setTimeout(() => {
          this.$refs['re'].focus()
        }, 200)
      }
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
      that.commitComent = before + item.Name + '(' + item.jName + ')' + '\xa0\xa0' + after
      that.log(that.peopleList)
    },
    // 获取默认的人员
    getPeople () {
      let that = this
      that.ajax('/myProject/autoCompleteNames', {projectManager: that.searchPeople, projectId: that.$store.state.proId}).then(res => {
        if (res.code === 200) {
          that.options42 = res.data
          // this.loading22 = false
        }
      })
    },
    toProjectDetail: function (id) {
      var that = this
      if (id) {
        if (that.projectAuth === '1') {
          this.$store.state.proId = id
          this.$router.push('/goodsDetail')
        } else {
          this.$Message.warning('权限不足，无法查看所属项目')
        }
      }
    },
    // 关联项目
    connectProject: function (id) {
      var that = this
      console.log('666666666', id)
      that.$emit('taskShow', id)
    },
    // 创建流程 流程选项列表
    rowClick: function (obj) {
      this.createProcessShow = false
      window.open(obj.flowUrl, '_blank')
      // window.location.href = obj.flowUrl
    },
    processItemRowClick: function (obj) {
      // detailUrl
      window.open(obj.detailUrl, '_blank')
      // this.log('processItemRowClick:', obj)
    },
    // 表格 单元格 样式设置
    rowClass: function ({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 0) {
        return 'fontStyle'
      }
    },
    slectRowClass: function ({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 1) {
        return 'fontStyle'
      }
    },
    // 创建流程 关闭流程选项列表
    closeProcess: function () {
      this.createProcessShow = false
    },
    // 流程列表区域 阻止冒泡
    testMaopao: function () {
      this.log('阻止冒泡')
    },
    // 点击半透明区域
    createProcessCancel: function () {
      this.createProcessShow = false
    },
    // 点击申请流程
    connectProcessClick: function () {
      var that = this
      this.createProcessShow = true
      that.ajax('/myTask/getFlowList', {taskId: that.nodeId}).then(res => {
        that.log('流程入口选项：', res)
        if (res.code === 200) {
          for (var i = 0; i < res.data.length; i++) {
            res.data[i].flowIndex = i + 1
          }
          that.FlowData = res.data
          that.log('that.FlowData:', that.FlowData)
        }
      })
    },
    // 查询关联流程
    TaskConnectProcessList: function () {
      var that = this
      that.ajax('/myTask/getTaskFlowList', {taskId: that.nodeId}).then(res => {
        that.log('任务所关联的流程：', res)
        that.tableData = res.data
      })
    },
    tableDataReFresh: function (e) {
      this.TaskConnectProcessList()
      // var obj = e.currentTarget
      // if ($(obj).hasClass('ratate')) {
      //   $(obj).removeClass('ratate')
      //   // $(obj).addClass('ratate')
      // } else {
      //   $(obj).addClass('ratate')
      // }
    },
    testData: function () {
      // var that = this
      this.log('testtest:', this.testtest)
      this.log('rilegou:', this.rilegou)
    },
    toPlanDetail: function (id) {
      this.$emit('toPlanDetail', id)
    },
    resetScro: function () {
      $('.ivu-drawer-body').scrollTop(0)
    },
    toDetail: function (id) {
      var that = this
      if (id) {
        that.taskId = id
        that.ajax('/myTask/queryTaskDetail', {taskId: id}).then(res => {
          that.$emit('getChildrenId', id)
          this.log('queryTaskDetail：：', res)
          if (res.code === 200) {
            that.taskBasicMsg = res.data
            that.rid = res.data.uid
            that.currentNodeId = id
            that.projectAuth = res.data.projectAuth
            // var st = res.data.taskStartDate.split(' ')[0] + ' 00:00:00'
            // var et = res.data.taskFinishDate
            // var sT = new Date(st)
            // var eT = new Date(et)
            // that.disabledStarTime = sT.getTime()
            // that.disabledEndTime = eT.getTime()
            // that.pickerOptions3.disabledDate = function (time) {
            //   return time.getTime() < that.disabledStarTime || time.getTime() > that.disabledEndTime
            // }
            for (var n = 0; n < res.data.attachment.length; n++) {
              res.data.attachment[n].downurl = that.$store.state.baseServiceUrl + '/file/downloadFile?realUrl=' + res.data.attachment[n].realUrl + '&showName=' + res.data.attachment[n].showName
              if (that.isImage(res.data.attachment[n].showName)) {
                res.data.attachment[n].isImg = true
              } else {
                res.data.attachment[n].isImg = false
              }
            }
            that.resetScro()
            that.taskComment.uid = id
            that.taskHistoryList.uid = id
            that.getTaskChildList(id)
            that.getHistoryList()
            that.getCommicateCont()
          } else if (res.code === 505) {
            that.$Message.warning(res.msg)
          }
        })
      } else {
        that.getTaskChildList(that.taskId)
        that.ajax('/myTask/queryTaskDetail', {taskId: that.taskId}).then(res => {
          this.log('查看返回2：', res)
          if (res.code === 200) {
            that.taskBasicMsg = res.data
            that.rid = res.data.uid
            // var st = res.data.taskStartDate.split(' ')[0] + ' 00:00:00'
            // var et = res.data.taskFinishDate
            // var sT = new Date(st)
            // var eT = new Date(et)
            // that.disabledStarTime = sT.getTime()
            // that.disabledEndTime = eT.getTime()
            // that.pickerOptions0.disabledDate = function (time) {
            //   return time.getTime() < that.disabledStarTime || time.getTime() > that.disabledEndTime
            // }
            for (var n = 0; n < res.data.attachment.length; n++) {
              res.data.attachment[n].downurl = that.$store.state.baseServiceUrl + '/file/downloadFile?realUrl=' + res.data.attachment[n].realUrl + '&showName=' + res.data.attachment[n].showName
              if (that.isImage(res.data.attachment[n].showName)) {
                res.data.attachment[n].isImg = true
              } else {
                res.data.attachment[n].isImg = false
              }
            }
            that.resetScro()
            that.taskComment.uid = that.taskId
            that.taskHistoryList.uid = that.taskId
            that.getHistoryList()
            that.getCommicateCont()
          }
        })
      }
    },
    delTask: function (id) {
      var that = this
      // console.log('id', id)
      that.$confirm('删除本条会包括本条及其包含内容，确定删除？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      }).then(() => {
        that.ajax('/myTask/delTaskById', {taskId: id}).then(res => {
          that.$emit('TaskDelCallback', res, '1')
          if (res.code === 200) {
            // that.log('delPlanOrTask:', res)
            that.getTaskChildList(id)
            // that.selectProjectId()
            that.getHistoryList()
          }
        })
      }).catch(() => {
        // that.loading = false
      })
    },
    getTaskChildList: function (id) {
      var that = this
      if (id) {
        that.ajax('/myTask/myChildTask', {taskId: id}).then(res => {
          if (res.code === 200) {
            that.childTaskList = res.data
            // that.log('that.childTaskList:', that.childTaskList)
          }
        })
      } else {
        that.ajax('/myTask/myChildTask', {taskId: that.taskId}).then(res => {
          if (res.code === 200) {
            // that.log('myChildTask:', res)
            that.childTaskList = res.data
          }
        })
      }
    },
    getHistoryList: function () {
      var that = this
      that.ajax('/myTask/getTaskLog', that.taskHistoryList).then(res => {
        if (res.code === 200) {
          that.historyList = res.data.list
          that.totalHistoryNum = res.data.totalRow
          if (that.historyList.length > 0) {
            for (var i = 0; i < that.historyList.length; i++) {
              for (var j = 0; j < that.historyList[i].attachment.length; j++) {
                if (that.isImage(res.data.list[i].attachment[j].showName)) {
                  res.data.list[i].attachment[j].isImg = true
                } else {
                  res.data.list[i].attachment[j].isImg = false
                }
                res.data.list[i].attachment[j].downloadUrl = that.$store.state.baseServiceUrl + '/file/downloadFile?realUrl=' + res.data.list[i].attachment[j].realUrl + '&showName=' + res.data.list[i].attachment[j].showName
              }
            }
          }
        }
      })
    },
    getCommicateCont: function () {
      var that = this
      that.ajax('/myTask/getTaskComment', that.taskComment).then(res => {
        if (res.code === 200) {
          that.commentList = res.data.list
          that.totalNum = res.data.totalRow
          if (that.commentList.length > 0) {
            for (var i = 0; i < that.commentList.length; i++) {
              for (var j = 0; j < that.commentList[i].attachment.length; j++) {
                if (that.isImage(res.data.list[i].attachment[j].showName)) {
                  res.data.list[i].attachment[j].isImg = true
                } else {
                  res.data.list[i].attachment[j].isImg = false
                }
                res.data.list[i].attachment[j].downloadUrl = that.$store.state.baseServiceUrl + '/file/downloadFile?realUrl=' + res.data.list[i].attachment[j].realUrl + '&showName=' + res.data.list[i].attachment[j].showName
              }
            }
          }
        } else {
          that.$message.warning(res.msg)
        }
      })
    },
    modifyTask: function () {
      var that = this
      that.$emit('showEditForm', that.currentNodeId)
    },
    // // 编辑任务 修改任务 ModifyTaskCallbackFuc
    // ModifyTaskCallbackFuc: function (res) {
    //   var that = this
    //   if (res.code === 200) {
    //     that.modifyTaskVisible = false
    //     that.queryProDetail()
    //     that.toDetail(that.currentNodeId)
    //     that.$message({
    //       message: '修改成功！',
    //       type: 'success'
    //     })
    //   } else {
    //     that.$message({
    //       message: res.msg,
    //       type: 'warning'
    //     })
    //   }
    // },
    // 任务分解 返回结果处理
    TaskDistributeCallbackFuc: function (res, id) {
      var that = this
      that.$emit('ActionResThrow', {res: res, actionName: 'decomposeTask'})
      if (res.code === 200) {
        that.toShowDevided = false
        // that.queryProDetail()
        // that.selectProjectId()
        // that.getHistoryList()
        that.getTaskChildList(id)
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
    getCurrentPage: function (e) {
      this.taskComment.pageNum = e
      this.getCommicateCont()
    },
    commentPageChange: function (e) {
      this.pageN = e
      this.getHistoryCont()
    },
    getCurrentHistoryPage: function (e) {
      this.taskHistoryList.pageNum = e
      this.getHistoryList()
    },
    // 任务开始 开始任务
    startTask: function (id) {
      var that = this
      // console.log('id', id)
      that.$confirm('确定后将开始此任务，确定开始？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.ajax('/myTask/startTask', {taskId: id}).then(res => {
          that.$emit('ActionResThrow', {res: res, actionName: 'startTask'})
          if (res.code === 200) {
            that.log('dealTask:', res)
            that.toDetail(id)
            // that.selectProjectId()
            that.getHistoryList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消开始'
        })
      })
    },
    // 暂停任务
    stopeTask: function (id) {
      var that = this
      // console.log('id', id)
      that.$confirm('确定后将暂停此任务，确定暂停？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.ajax('/myTask/timeoutTask', {taskId: id}).then(res => {
          that.$emit('ActionResThrow', {res: res, actionName: 'startTask'})
          if (res.code === 200) {
            that.log('dealTask:', res)
            that.toDetail(id)
            // that.selectProjectId()
            that.getHistoryList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消开始'
        })
      })
    },
    // 暂停开启
    startTaskstoped: function (id) {
      var that = this
      that.stopeId = id
      that.projectStopeVisible2 = true
    },
    startTaskOnly: function () {
      var that = this
      that.ajax('/myTask/timeonTask', {taskId: that.stopeId}).then(res => {
        that.$emit('ActionResThrow', {res: res, actionName: 'startTask'})
        if (res.code === 200) {
          that.log('dealTask:', res)
          that.toDetail(that.stopeId)
          // that.selectProjectId()
          that.getHistoryList()
          that.projectStopeVisible2 = false
        } else {
          that.$message.warning(res.msg)
        }
      })
    },
    startEditTask: function () {
      var that = this
      that.projectStopeVisible2 = false
      that.startTaskOnly(that.nodeId)
      that.$emit('showEditForm', that.nodeId)
    },
    taskToDevided: function (id) {
      var that = this
      that.toShowDevided2 = true
      that.testtest = 2
      that.currentNodeId = id
      // that.taskRelationShow2 = false
    },
    // 重启
    isReStartTask: function (id) {
      var that = this
      this.log('restartTaskID', id)
      that.$confirm('是否确定重启此任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.ajax('/myTask/restartTask', {taskId: id}).then(res => {
          that.$emit('ActionResThrow', {res: res, actionName: 'restartTask'})
          if (res.code === 200) {
            this.log('restartTask', res)
            that.toDetail(id)
            // that.selectProjectId()
            that.getHistoryList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 删除子任务
    childTaskDelete: function (id) {
      var that = this
      // console.log('id', id)
      that.$confirm('删除本条会包括本条及其包含内容，确定删除？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.ajax('/myTask/delTaskById', {taskId: id}).then(res => {
          that.$emit('TaskDelCallback', res, '2')
          if (res.code === 200) {
            // that.log('delPlanOrTask:', res)
            that.getTaskChildList(that.taskId)
            // that.selectProjectId()
            that.getHistoryList()
          }
        })
      }).catch(() => {
        // that.loading = false
      })
    },
    // 新增 点击“回复”按钮
    taskDetailconnect () {
      var that = this
      that.peopleList = that.peopleList.filter(item => that.commitComent.indexOf(item.Name + '(' + item.jName + ')') !== -1)
      let obj = {
        content: that.commitComent,
        attachmentId: that.SetFileIdStr(),
        contentId: that.taskId,
        parentCommentId: '11',
        memberList: that.peopleList
      }
      that.ajax('/comment/addComment', JSON.stringify(obj)).then(res => {
        if (res.code === 200) {
          that.IsClear = true
          // that.log('myTaskView:', res)
          that.getCommicateCont()
          that.peopleList = []
          // that.fileListComment = []
          that.commitComent = ''
          $('.showFileName').html('')
          $('#myfile2').val('')
          that.loading2 = false
          that.$message.success('评论成功！')
        } else {
          that.$message({
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    // 获取附件上传组件发来的附件信息 新组件
    GetFileInfo (obj) {
      this.log('GetFileInfo:', obj)
      if (obj) {
        this.IsClear = false
      }
      this.FileUploadArr = obj
      this.log('GetFileInfo:', obj)
    },
    // 预览
    GetFilePreData (obj) {
      this.log('obj::', obj)
      if (obj.previewUrl && this.isImage(obj.fileName)) {
        this.showBigImage1(obj.previewUrl)
      }
    },
    showImagePre: function (previewUrl, showName) {
      // this.log('showName:', showName)
      this.imgPreview(previewUrl, showName)
      // this.$emit('FilePreEmit', {previewUrl: previewUrl, fileName: showName})
    },
    // 任务分解
    DistributeFormVisibleFuc: function (res) {
      if (res === false) {
        this.toShowDevided2 = false
      }
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
    // 任务移交
    transferTask: function () {
      var that = this
      that.taskTransferVisible = true
    },
    querySearchAsync2 (queryString, cb) {
      var that = this
      if (queryString) {
        that.projectManager = queryString
        this.ajax('/myProject/autoCompleteNames', {projectManager: that.projectManager}).then(res => {
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
    handleSelect2 (item) {
      this.transferUserId = item.userId
      this.transferUserName = item.value
    },
    concelTransfer: function () {
      var that = this
      that.taskTransferLoading = false
      that.projectManager = ''
      that.commitComentT = ''
      that.taskTransferVisible = false
    },
    concelFinished: function () {
      this.commitComentF = '已完成'
      this.taskFinishedVisible = false
    },
    // 任务移交 点击确定
    taskTransfer () {
      var that = this
      that.taskTransferLoading = true
      that.ajax('/myTask/transferTask', {remark: that.commitComentT, attachmentId: that.SetFileIdStr(), taskId: that.taskId, transferUserId: that.transferUserId, transferUserName: that.transferUserName}).then(res => {
        that.$emit('ActionResThrow', {res: res, actionName: 'transferTask'})
        that.log('transferTask:', res)
        if (res.code === 200) {
          that.toDetail()
          that.getHistoryList()
          that.isClear = true
          that.taskTransferVisible = false
          that.projectManager = ''
          that.commitComentT = ''
          that.$message({
            type: 'success',
            message: res.msg
          })
        } else {
          that.taskTransferLoading = false
          that.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
    },
    // 任务完成 完成任务
    finishedTask: function () {
      var that = this
      that.taskFinishedVisible = true
    },
    // 阻止滚动
    noMousewheel: function (e) {
      e.preventDefault()
      this.log(55555)
    },
    // 任务完成 点击确定
    confirmFinished () {
      var that = this
      that.loading9 = true
      that.ajax('/myTask/finishTask', {remark: that.commitComentF, attachmentId: that.SetFileIdStr(), taskId: that.taskId}).then(res => {
        that.$emit('ActionResThrow', {res: res, actionName: 'finishTask'})
        that.taskFinishedVisible = false
        if (res.code === 200) {
          // that.log('myTaskView:', res)
          that.toDetail()
          // that.selectProjectId()
          that.getHistoryList()
          that.isClear = true
          that.commitComentF = '已完成'
          that.fileListFinish = []
          that.loading9 = false
          that.$message({
            type: 'success',
            message: res.msg
          })
        } else {
          that.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
    }
  }
}
</script>
<style>
  .TaskDetailComp .fontStyle div{
    color: #3a8ee6 !important;
    cursor: pointer;
  }
</style>
<style scoped>
  .TaskDetailComp{
    position: relative;
  }
  .slidTop{
    height: 40px;
    line-height: 40px;
    font-size: 15px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #f1f1f1;
  }
  .topState0 img,.topState1 img,.topState2 img{
    float: left;
    margin-top: 6px;
  }
  .topState0{
    color: #ffc107;
  }
  .topState1{
    color: #26a2ff;
  }
  .topState2{
    color: #27CF97;
  }
  .topState3{
    color: #e97474;
  }
  .taskMsg{
    background-color: #f5f8fa;
    display: flex;
    justify-content: space-between;
  }
  .taskLf{
    padding: 10px;
    padding-bottom: unset;
    width: 80%;
  }
  .taskName{
    font-size: 16px;
    font-weight: bold;
    font-family: '黑体';
  }
  .taskDetail{
  }
  .taskDetailCnt{
    font-size: 14px;
    margin-top: 10px;
    text-indent: 2em;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    text-overflow:ellipsis;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }
  .taskDetailCntMore{
    color: #515a6e;
    text-align: center;
  }
  .taskDetailCntMore:hover{
    color: #2D9CFF;
    /*background: rgba(0,0,0,0.1);*/
  }
  .taskRt{
    width: 20%;
    position: relative;
  }
  .taskRt div{
    width: 90px;
    float: right;
    margin: 10px;
  }
  .taskRt div img{
    width: 100%;
  }
  .managePro{
    display: flex;
    justify-content: space-between;
  }
  .managePro div{
    width: 50%;
  }
  .managePro div img{
    float: left;
    margin-right: 20px;
  }
  .managePro div .proLabel{
    color: #1296db;
    display: inline-block;
    margin-right: 20px;
  }
  .cannetProject{
    height: 49px;
    line-height: 49px;
    border-bottom: 1px solid #f1f1f1;
    font-size: 15px;
    font-family: '黑体';
    padding:0 10px;
  }
  .cannetProject1{
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #f1f1f1;
    background-color: #f5f8fa;
    font-size: 16px;
    font-family: '黑体';
    font-weight: bold;
    padding:0 10px;
  }
  /*流程*/
  .connectProcess{
    display: flex;
    justify-content: space-between;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #f1f1f1;
    background-color: #f5f8fa;
    padding:0 10px;
  }
  .connectProcess div img{
    float: left;
    margin-top: 9px;
    margin-right: 10px;
  }
  .connectProcessHeader:nth-child(1){
    font-family: '微软雅黑';
    font-weight: bold;
    font-size: 16px;
  }
  .connectProcessHeader:nth-child(2){
    font-family: '微软雅黑';
    font-weight: bold;
    font-size: 14px;
  }
  .createProcess{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 9999
  }
  .createProcess>div{
    width: 600px;
    _height: 200px;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -300px;
    margin-top: -300px;
  }
  .cannetProject21{
    width: 100%;
    display: flex;
    justify-content: space-between;
    line-height: 24px;
    font-size: 14px;
    /*font-family: '黑体';*/
    padding:0 10px;
  }
  .cannetProject1-1{
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #f1f1f1;
    background-color: #f5f8fa;
    font-size: 16px;
    font-family: '黑体';
    font-weight: bold;
    padding:0 10px;
    margin-top: 20px;
    border-top: 1px solid #f1f1f1;
  }
  .cannetProject2{
    color: #1296db;
    display: flex;
    justify-content: space-between;
    line-height: 40px;
    font-size: 14px;
    /*font-family: '黑体';*/
    padding:0 10px;
    background-color: #f5f8fa;
  }
  .cannetProjectFile{
    line-height: 49px;
    border-bottom: 1px solid #f1f1f1;
    font-size: 15px;
    font-family: '黑体';
    padding:0 10px;
  }
  .cannetProject2 div img{
    float: left;
    margin-top: 10px;
    margin-right: 10px;
    width: 18px;
  }
  .cannetProject div img,.cannetProjectFile div img{
    float: left;
    margin-top: 15px;
    margin-right: 10px;
  }
  .cannetProject1 div img{
    float: left;
    margin-top: 9px;
    margin-right: 10px;
  }
  .cannetProject1-1 div img{
    float: left;
    margin-top: 9px;
    margin-right: 10px;
  }
  .taskListChild{
    padding: 0 20px;
  }
  .taskItemChild{
    height: 48px;
    line-height: 48px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px dashed #f1f1f1;
  }
  .taskItemChild2{
    height: 48px;
    line-height: 48px;
  }
  .childTaskName{
    width: 30%;
    color: #409EFF;
    cursor: pointer;
    font-size: 14px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .childTaskMsg{
    width: 70%;
    text-align: right;
  }
  .childTaskMsg>div{
    display: inline-block;
    margin-right: 20px;
  }
  .taskDel:hover {
    color: #409EFF;
    cursor: pointer;
  }
  .timeLine{
    padding: 20px;
  }
  .time{
    font-size: 14px;
    font-weight: bold;
  }
  .content{
    padding-left: 5px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .paiTaskIptWrap input{
    width: 100%;
    outline: none;
    border: none;
  }
  .submitBtn div {
    width: 50px;
    padding: 6px;
    color: #fff;
    border-radius: 4px;
    text-align: center;
    color: #adb8c0;
    background-color: #e7eef3;
  }
  .el-textarea{
    margin-top: 15px;
    margin-left: 0px;
    position: relative;
  }
  .el-textarea__inner{
    width: 100%;
    min-height: 80px;
  }
  .noComment{
    height: 50px;
    text-align: center;
    line-height: 50px;
    color: #aaa;
  }
  /*
   *  ========================= 任务移交 任务完成
   */
  .taskTransferBgcover,.taskFinishedBgcover{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: rgba(0,0,0,0.4);
    z-index: 3000;
  }
  .taskTransferCnt,.taskFinishedCnt{
    width: 60%;
    margin-left: 20%;
    margin-top: 200px;
    padding: 30px;
    background-color: #fff;
  }
  /* 流程 */
  .el-table__row{
    cursor: pointer;
  }
  .reFreshIcon.ratate{
    animation:processMove 0.5s;
  }
  .childTaskStyle0{
    color: #ffc107;
  }
  .childTaskStyle1{
    color: #13ce66;
  }
  .childTaskStyle2{
    color: #409EFF;
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
  @keyframes processMove
  {
    from {transform: rotate(0deg)}
    to {transform: rotate(360deg)}
  }
  .stopeModel{
    height: 150px;
    width: 300px;
    position: absolute;
    text-align: center;
    top: 20%;
    left: 25%;
    padding: 10px;
    border-radius: 10px;
    background-color: #bbb;
    z-index: 999999;
  }
  .stopeTitle{
    color: #fff;
    font-size: 16px;
  }
  .modelCon{
    height: 60px;
    color: #fff;
    font-size: 14px;
    line-height: 60px;
  }
  .bainProject{
    padding: 2px 6px;
    background-color: #509EFF;
    display: inline-block;
    font-size: 14px;
    color: #fff;
    cursor: pointer;
    line-height: 20px;
    border-radius: 4px;
  }
  .linkProject{
    color: #409EFF;
    cursor: pointer;
    font-size: 14px;
  }
</style>
