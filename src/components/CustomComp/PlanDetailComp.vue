<template>
  <div class="PlanDetailComp">
    <div>{{refshPlan?'':''}}</div>
    <div>{{editFlag?'':''}}</div>
    <div class="slidTop">
      <div :title="planMsg.name" style="font-weight: bold;width: 80%;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{planMsg.name}}</div>
      <div></div>
      <div style="display: flex;justify-content: space-between" v-if="planMsg.showDeleteFlag=== '0' ? false:true">
        <div @click="delCurrentPlan(planMsg.id)" title="删除计划" style="width: 50px;cursor: pointer;"><Icon type="ios-trash-outline" size="24" color="#53b5ff"/></div>
        <div @click="modifyPlan()" style="width: 50px;padding-top: 3px;font-size: 14px;color: #409EFF; cursor: pointer;"><i class="el-icon-edit" style="font-size: 18px;color: #409EFF"></i> 修改</div>
      </div>
    </div>
    <div class="taskMsg2" style="border-bottom: 1px solid #f1f1f1;background-color: #f5f8fa">
      <div class="taskLf" style="width: 100%;">
        <div class="taskName2" style="font-size: 14px;"><Icon type="md-paper" size="18" color="#1296db"/><span style="margin-left: 10px;">计划详情: </span></div>
        <div style="color: #999;margin-top: 0;" class="taskDetail" :title="planMsg.description">{{planMsg.description}}</div>
      </div>
    </div>
    <div style="display: flex;justify-content: space-between">
      <div class="cannetProject" style="width: 50%;">
        <div style="display: inline-block"><img src="../../../static/img/faqiren.png" alt=""><span>创 建 人:</span></div>
        <div style="display: inline-block;color: #888;">{{planMsg.creator}}</div>
      </div>
      <div class="cannetProject" style="width: 50%">
        <div style="display: inline-block;"><img src="../../../static/img/kaishi.png" alt=""><span>创建时间:</span></div>
        <div style="display: inline-block;color: #888;">{{planMsg.createDate}}</div>
      </div>
    </div>
    <div style="display: flex;justify-content: space-between">
      <div class="cannetProject" style="width: 50%;display: flex;justify-content: start">
        <div style="width: 32%"><img src="../../../static/img/xiangmu.png" alt=""><span>所属项目:</span></div>
        <div class="cannetProjectItem1" :title="planMsg.projectName">{{planMsg.projectName}}</div>
      </div>
      <div class="cannetProject" style="width: 50%;display: flex;justify-content: start">
        <div style="width: 32%;"><img src="../../../static/img/taskFa.png" alt=""><span>父级计划:</span></div>
        <div class="cannetProjectItem1" v-if="planMsg.parentPlanName" style="color: #409EFF;cursor: pointer;" :title="planMsg.parentPlanName" @click="toPlanDetail(planMsg.parentTaskID)">{{planMsg.parentPlanName}}</div>
        <div class="cannetProjectItem1" v-if="!planMsg.parentPlanName">无父级计划</div>
      </div>
    </div>
    <div class="cannetProject">
      <div style="display: inline-block"><img src="../../../static/img/time.png" alt=""><span>计划周期:</span></div>
      <div style="display: inline-block;color: #888;" v-if="planMsg.start && planMsg.finish">{{planMsg.start.split(' ')[0]}} 到 {{planMsg.finish.split(' ')[0]}}</div>
    </div>
    <!--新建任务开始-->
    <div class="cannetProject1" style="display:flex;justify-content: space-between">
      <div style="display: inline-block"><img src="../../../static/img/delTask.png" alt=""><span>添加子任务</span></div>
      <div @click="addChild(planMsg.id, 3)" style="font-size: 14px;color: #409EFF;cursor: pointer;font-weight: normal"><i class="el-icon-circle-plus-outline"></i> 添加子计划</div>
    </div>
    <component v-bind:is="compArr.AddNewTask"
               fileFormId="AddNewTask"
               v-on:TaskDistributeCallback="TaskDistributeCallbackFuc"
               :nodeId="currentNodeId">
    </component>
    <div class="cannetProject1">
      <div style="display: inline-block"><img src="../../../static/img/taskList.png" alt=""><span>子任务/计划<span style="color: #409EFF">({{planMsgPlanList.length}})</span></span></div>
    </div>
    <div class="taskListChild" v-loading="delLoading">
      <div class="taskItemChild" v-for="(child, index2) in planMsgPlanList" v-bind:key="index2">
        <div class="childTaskName" @click="toPlanDetailMsg(child.id, child.type)" :title="child.name"><Icon type="md-copy" size="16" color="#409EFF"/> {{child.name}} <span style="color: #888;" v-if="child.type === '2'">(任务)</span><span style="color: #888;" v-if="child.type === '1'">(计划)</span></div>
        <div class="childTaskMsg">
          <div v-if="child.status" style="width: 60px;" :class="'childTaskStyle' + child.status">{{child.statusStr}}</div>
          <div v-if="child.status && child.dayNum >= 0" style="width: 100px;">
            <span v-if="child.status !== '2'">剩余 <span style="color:#13ce66;font-size: 18px;">{{child.dayNum}}</span> 天</span>
          </div>
          <div v-if="child.status && child.dayNum < 0" style="width: 100px;">
            <span v-if="child.status !== '2'">逾期 <span style="color:#f00;font-size: 18px;">{{Math.abs(child.dayNum)}}</span> 天</span>
          </div>
          <div v-if="child.userName" style="width: 160px;">{{child.userName}}</div>
          <div v-if="!child.userName" style="width: 160px;">创建人: {{child.creator}}</div>
          <div style="width: 20px;margin-right: 0" @click="delChildTask(child.id)"><div class="taskDel"><Icon type="md-close" size="18"/></div></div>
        </div>
      </div>
      <div class="taskItemChild2" style="text-align: center;color: #aaa;" v-if="planMsgPlanList.length === 0">
        暂无子级
      </div>
    </div>
  </div>
</template>

<script>
import AddNewTask from './AddNewTask.vue'
import ModifyPlan from './ModifyPlan.vue'
export default {
  name: 'PlanDetailComp',
  props: ['nodeId', 'addPlanOrTaskSuc', 'PlanDetailCompRefresh', 'planDetailEdit', 'taskDrawerOpen'],
  components: {
    AddNewTask,
    ModifyPlan
  },
  data () {
    return {
      planMsg: '',
      delLoading: false,
      // 引入组件
      compArr: {
        ModifyPlan: 'ModifyPlan',
        AddNewTask: 'AddNewTask'
      },
      planMsgPlanList: [],
      currentNodeId: ''
    }
  },
  computed: {
    refshPlan: function () {
      var that = this
      that.log(that.$store.state.goPerfect)
      if (that.$store.state.refshPlan === true) {
        that.getNextPlanTask(this.nodeId)
      }
      that.$store.state.refshPlan = false
      return that.$store.state.refshPlan
    },
    editFlag: function () {
      var that = this
      if (that.$store.state.editFlag === true) {
        that.toPlanDetail(this.nodeId)
      }
      that.$store.state.editFlag = false
      return that.$store.state.editFlag
    }
  },
  watch: {
    nodeId: function (val, oV) {
      if (val) {
        // this.currentNodeId = val
        this.toPlanDetail(this.nodeId)
      }
    },
    taskDrawerOpen: function (val, old) {
      if (val) {
        this.currentNodeId = this.nodeId
        this.toPlanDetail(this.nodeId)
      }
    },
    planDetailEdit: function (val, oV) {
      if (val) {
        this.toPlanDetail(this.nodeId)
      }
    },
    addPlanOrTaskSuc: function (val, oV) {
      if (val) {
        this.getNextPlanTask(this.nodeId)
        this.toPlanDetail(this.nodeId)
      }
    },
    PlanDetailCompRefresh: function (val, old) {
      if (val) {
        this.toPlanDetail(this.nodeId)
        // 抛出信息，告知父组件已刷新，将开关关闭
        this.$emit('CompRefreshThrow', false)
      }
    }
  },
  methods: {
    modifyPlan: function () {
      var that = this
      that.$emit('showPlanEditForm', that.currentNodeId)
    },
    toPlanDetail: function (id) {
      var that = this
      that.ajax('/myProject/getPlanOrTaskDetail', {id: id}).then(res => {
        // console.log('res', res)
        if (res.code === 200) {
          that.planMsg = res.data
          that.getNextPlanTask(id)
        } else {
          that.$message.warning(res.msg)
        }
      })
    },
    // 任务分解 返回结果处理
    TaskDistributeCallbackFuc: function (res, id) {
      var that = this
      // 在计划详情添加子任务后刷新树状结构
      that.$emit('ActionResThrow', {res: res, actionName: 'decomposeTask'})
      if (res.code === 200) {
        that.getNextPlanTask(id)
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
    delCurrentPlan: function (id) {
      var that = this
      that.log('id', id)
      that.$confirm('删除本条会包括本条及其包含内容，确定删除？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.ajax('/myProject/delPlanOrTask', {id: id}).then(res => {
          that.$emit('PlanDelCallback', res, '1')
          if (res.code === 200) {
            that.log('delPlanOrTask:', res)
            that.$message.success(res.msg)
          } else {
            that.$message.warning(res.msg)
          }
        }).catch(() => {
          // that.loading = false
        })
      })
    },
    delChildTask: function (id) {
      var that = this
      that.log('id', id)
      that.$confirm('删除本条会包括本条及其包含内容，确定删除？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.delLoading = true
        that.ajax('/myProject/delPlanOrTask', {id: id}).then(res => {
          that.$emit('PlanDelCallback', res, '2')
          if (res.code === 200) {
            that.log('delPlanOrTask:', res)
            that.getNextPlanTask(that.currentNodeId)
            that.delLoading = false
          } else {
            that.$message.warning(res.msg)
            that.delLoading = false
          }
        })
      }).catch(() => {
        // that.loading = false
      })
    },
    toPlanDetailMsg: function (id, type) {
      var that = this
      if (type === '1') {
        that.toPlanDetail(id)
        that.currentNodeId = id
      } else {
        that.$emit('toChildMsg', id)
      }
    },
    getNextPlanTask: function (id) {
      var that = this
      that.ajax('/myProject/getPlanOrTaskById', {id: id}).then(res => {
        // console.log('resList', res)
        if (res.code === 200) {
          that.planMsgPlanList = res.data
        } else {
          that.$message.warning(res.msg)
        }
      })
    },
    addChild: function (id, type) {
      this.$emit('addChildMsg', {'id': id, 'type': type})
    }
  }
}
</script>

<style scoped>
  .slidTop{
    height: 40px;
    line-height: 40px;
    font-size: 15px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #f1f1f1;
  }
  .taskLf{
    padding: 10px;
    width: 80%;
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
  .cannetProjectItem1 {
    display: inline-block;
    color:#888;
    width: 60%;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
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
  .childTaskStyle0{
    color: #ffc107;
  }
  .childTaskStyle1{
    color: #13ce66;
  }
  .childTaskStyle2{
    color: #409EFF;
  }
</style>
