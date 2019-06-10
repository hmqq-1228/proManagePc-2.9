<template>
   <div class="workPlan">
     <div class="pdf" id="pdfDom">
       <p style="text-align: center;font-size: 13px;color:#000;margin-bottom: 20px;margin-top: 30px;letter-spacing: 2px;">工作报告</p>
       <div style="text-align: center">
         <p style="font-size: 12px;transform: scale(0.8)">
           <span><i style="color:#169BD5">姓名：</i><span>{{getUser}}</span></span>
           <span style="margin-left: 30px;"><i style="color:#169BD5">职位：</i><span>{{getjname}}</span></span>
         </p>
       </div>
       <div style="padding:10px 10px;width: 100%;height: 100%;">
         <p style="font-size: 12px;color:#169BD5;margin-left: 10px">{{tabCurr}}</p>
         <div style="margin-top: 10px;margin-left: -10px;" v-for="(item, index) in currentData" :key="item.uid+'_'+index">
           <p style="font-size: 12px;transform: scale(0.85)"><span style="color:#000;font-weight: bold">{{index+1}}、</span>{{item.jobName}}</p>
           <p style="font-size: 12px;margin-top: 5px;transform: scale(0.75);line-height: 25px;margin-left:-10px;">{{item.description}}</p>
         </div>
         <p style="font-size: 12px;color:#169BD5;margin-top: 30px;margin-left: 10px">{{tabNext}}</p>
         <div style="margin-top: 15px;margin-left: -10px;" v-for="(item, index) in nextData" :key="item.uid+'_'+index">
           <p style="font-size: 12px;;transform: scale(0.85)"><span style="color:#000;font-weight: bold">{{index+1}}、</span>{{item.jobName}}</p>
           <p style="font-size: 12px;margin-left:-10px;margin-top: 5px;transform: scale(0.75);line-height: 25px;">{{item.description}}</p>
         </div>
       </div>
     </div>
     <div class="top">
       <ul class="top-ul">
         <li v-for="item in time" :key="item.id" class="list" :class="item.id === active ? 'active' : ''" @click="choseTime(item)">{{item.name}}</li>
       </ul>
     </div>
     <div class="timeSelect" v-if="timeShow">
       <span>本期安排：</span>
       <el-date-picker
         v-model="currStart"
         type="date"
         placeholder="选择开始日期"
         :picker-options="dateTimeOpt"
         size="small"
         value-format="yyyy-MM-dd"
         style="width: 150px;"
         @change="cstart"
       >
       </el-date-picker>
       <span>至</span>
       <el-date-picker
         v-model="currEnd"
         type="date"
         placeholder="选择结束日期"
         :picker-options="dateTimeOpt1"
         size="small"
         value-format="yyyy-MM-dd"
         @change="cend"
         style="width: 150px;">
       </el-date-picker>
       <span style="margin-left: 15px;">下期安排：</span>
       <el-date-picker
         v-model="nextStart"
         type="date"
         placeholder="选择开始日期"
         size="small"
         value-format="yyyy-MM-dd"
         :picker-options="dateTimeOpt2"
         @change="nstart"
         style="width: 150px;">
       </el-date-picker>
       <span>至</span>
       <el-date-picker
         v-model="nextEnd"
         type="date"
         placeholder="选择结束日期"
         size="small"
         :picker-options="dateTimeOpt3"
         value-format="yyyy-MM-dd"
         @change="nend"
         style="width: 150px;">
       </el-date-picker>
     </div>
     <div class="bottom">
       <div class="bottom-left">
          <div class="tabs">
            <div class="first" :class="type === 1 ? 'active' : ''" @click="getTab(1)">{{tabCurr}}工作安排</div>
            <div class="first last" :class="type === 2 ? 'active' : ''" @click="getTab(2)">{{tabNext}}工作安排</div>
          </div>
         <div class="content" style="width: 100%;min-height: 800px;border-right: 1px solid #ccc">
           <div class="statusTab">
             <ul>
               <li v-for="item in currentStatus" :key="item.id" :class="item.id === current ? 'active':''" @click="tabStatus(item)">{{item.name}}</li>
               <li style="float:right;color:#169BD5;" @click="allSelect">
                 一键转入
               </li>
             </ul>
           </div>
           <div class="planList" v-if="planList.length>0">
             <draggable v-bind="{group:{name:'Mission',put:false},animation: 200}" class="planList" v-model="planList" :sort="false" @start="start">
                 <div class="plans" v-for="(item, index) in planList" :key="index">
                    <div class="plantop">
                       <span style="font-size: 14px;float: left">{{item.jobName}}</span>
                        <div class="status" :class="{'haveFinish':item.status === '2','having':item.status === '1','nosure':item.status === '0'}">
                          <span v-if="item.status === '2'">已完成</span>
                          <span v-if="item.status === '1'">进行中</span>
                          <span v-if="item.status === '0'">未确认</span>
                        </div>
                        <el-rate v-model="item.jobLevelNum" style="float: right" :disabled="true"></el-rate>
                    </div>
                   <div class="planbottom" :title="item.description">
                     <Icon type="ios-paper-outline" style="color:#169BD5;font-size: 18px;"/>
                     <span style="margin-left: 5px;line-height: 20px;">任务描述：<span>{{item.description}}</span></span>
                   </div>
                   <!--<div style="color:#169BD5;position: absolute;right:20px;bottom:10px;font-size: 14px;">详情</div>-->
                 </div>
             </draggable>
           </div>
           <div v-else style="text-align: center;font-size: 14px;width: 100%;height: 850px;line-height: 800px;">
             暂无数据
           </div>
         </div>
         <div style="text-align: center" v-if="planList.length>0">
           <el-pagination
             small
             layout="prev, pager, next"
             :total="total"
             @current-change="currentPage1"
             :page-size="pageSize"
           >
           </el-pagination>
         </div>
       </div>
       <div class="bottom-right">
         <div class="current">
            <span style="font-size: 14px;line-height:40px;">{{tabCurr}}</span>
            <div style="float: right">
               <!--<Button type="info" size="small" style="margin-right: 10px" @click="getPdf('#pdfDom',htmlTitle)">预览</Button>-->
               <Button type="info" size="small" style="" :loading="loading" @click="getReport()">
                 <span v-if="!loading">生成</span>
                 <span v-else>生成中...</span>
               </Button>
            </div>
         </div>
         <div class="plan">
           <div class="plan-top">
             <div class="title">
               <div class="planItem" style="width: 15%;margin-left: 10px">任务名称</div>
               <div class="planItem" style="width: 70%;text-indent: 100px">描述</div>
               <div class="planItem" style="width: 10%;text-indent: 10px" @click="addPlan"><i class="el-icon-plus" style="color:#169BD5;font-size: 18px;cursor: pointer;font-weight: bold"></i></div>
             </div>
             <draggable v-bind="{group:{name:'Mission',put:true},animation: 200}" @change='addCollection' v-model="currentData" :sort="true" style="width: 100%;height: 350px">
               <div class="content-list" v-for="(item,index) in currentData" :key="index" @dblclick="editPlan(item)">
                 <div class="planItem contents" style="width: 20%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-left: 10px" :title="item.jobName">{{item.jobName}}</div>
                 <div class="planItem contents" style="width:55%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-indent: 40px" :title="item.description">{{item.description}}</div>
                 <div class="planItem contents" style="width: 10%;text-indent: 30px"><i class="el-icon-close" style="color:#169BD5;font-size: 14px;cursor: pointer;font-weight: bold" @click="delPlan(index)"></i></div>
               </div>
             </draggable>
           </div>
           <p style="font-size: 14px;margin-top: 20px">{{tabNext}}</p>
           <div class="plan-top plan-bottom">
             <div class="title">
               <div class="planItem" style="width: 15%;margin-left: 10px">任务名称</div>
               <div class="planItem" style="width: 70%;text-indent: 100px">描述</div>
               <div class="planItem" style="width: 10%;text-indent: 10px" @click="addPlanNext"><i class="el-icon-plus" style="color:#169BD5;font-size: 18px;cursor: pointer;font-weight: bold"></i></div>
             </div>
             <draggable v-bind="{group:{name:'Mission',put:true},animation: 200}" @change='addCollection1' v-model="nextData" :sort="true" style="width: 100%;height: 350px">
               <div class="content-list" v-for="(item,index) in nextData" :key="index" @dblclick="editNextPlan(item)">
                 <div class="planItem contents" style="width: 20%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-left: 10px" :title="item.jobName">{{item.jobName}}</div>
                 <div class="planItem contents" style="width: 55%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-indent: 50px" :title="item.description">{{item.description}}</div>
                 <div class="planItem contents" style="width: 10%;text-indent: 30px"><i class="el-icon-close" style="color:#169BD5;font-size: 14px;cursor: pointer;font-weight: bold" @click="delPlanNext(index)"></i></div>
               </div>
             </draggable>
           </div>
         </div>
       </div>
     </div>
     <Modal
       v-model="modal"
       title="工作安排"
       @on-ok="ok"
       @on-cancel="cancel">
       <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
         <FormItem label="工作名称" prop="jobName">
           <Input v-model="formValidate.jobName" placeholder="请输入工作名称"/>
         </FormItem>
         <FormItem label="工作描述" prop="description">
           <Input v-model="formValidate.description" type="textarea" placeholder="请输入工作描述"/>
         </FormItem>
       </Form>
       <div slot="footer">
         <Button @click="cancel">取消</Button>
         <Button type="primary" @click="ok('formValidate')">确定</Button>
       </div>
     </Modal>
     <Modal
       v-model="modal1"
       title="工作安排"
       @on-ok="ok"
       @on-cancel="cancel">
       <Form ref="formValidate1" :model="formValidate1" :rules="ruleValidate1" :label-width="80">
         <FormItem label="工作名称" prop="jobName">
           <Input v-model="formValidate1.jobName" placeholder="请输入工作名称"/>
         </FormItem>
         <FormItem label="工作描述" prop="description">
           <Input v-model="formValidate1.description" type="textarea" placeholder="请输入工作描述"/>
         </FormItem>
       </Form>
       <div slot="footer">
         <Button @click="cancelNext">取消</Button>
         <Button type="primary" @click="okNext('formValidate1')">确定</Button>
       </div>
     </Modal>
     <Modal
       v-model="modal2"
       title="备注"
       @on-ok="ok"
       @on-cancel="cancel">
       <Form :label-width="50">
         <FormItem label="备注" prop="remark">
           <Input v-model="remark" placeholder="请输入" type="textarea"/>
         </FormItem>
       </Form>
       <div slot="footer">
         <Button @click="closeRemark">取消</Button>
         <Button type="primary" @click="submit">确定</Button>
       </div>
     </Modal>
     <el-dialog
       title="提示"
       :visible.sync="dialogVisible"
       width="380px"
       >
       <i class="el-icon-warning" style="color:#E6A23C;font-size: 18px;margin-right: 5px"></i>
       <span>切换会导致右侧选择的报告记录清空！</span>
       <p>
         <el-checkbox v-model="checked" style="margin-top: 15px;font-size: 12px">不再提醒</el-checkbox>
       </p>
       <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="sure" size="small">确 定</el-button>
       </span>
     </el-dialog>
     <!--任务详情-->
     <!--<Drawer title="任务详情" class="drawerScroll" :closable="false" width="750" v-model="TaskDetailCompShow">-->
       <!--<component v-bind:is="compArr.TaskDetailComp"-->
                  <!--v-bind:taskDrawerOpen="TaskDetailCompShow"-->
                  <!--v-bind:modifyTaskRes="modifyTaskRes"-->
                  <!--v-on:FilePreEmit="GetFilePreData"-->
                  <!--v-on:toPlanDetail="toPlanDetailFuc"-->
                  <!--v-on:showEditForm="showEditFormFuc"-->
                  <!--v-on:ActionResThrow="ActionResThrowFuc"-->
                  <!--v-on:TaskDelCallback="TaskDelCallbackFuc"-->
                  <!--:nodeId="currentNodeId">-->
       <!--</component>-->
     <!--</Drawer>-->
   </div>
</template>
<style>
  .workPlan .el-dialog__body {
    padding: 10px;
    padding-left: 30px;
  }
  .workPlan .el-checkbox__inner {
    width: 12px;
    height: 12px;
  }
  .workPlan .el-checkbox__input.is-checked+.el-checkbox__label {
    color:#333
  }
</style>
<script>
import draggable from 'vuedraggable'
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
// import TaskDetailComp from './CustomComp/TaskDetailComp.vue'
export default {
  name: 'WorkPlan',
  data () {
    return {
      username: this.$store.state.userName,
      jName: this.$store.state.jName,
      htmlTitle: '周报',
      compArr: {
        TaskDetailComp: 'TaskDetailComp'
      },
      currStart: '',
      currEnd: '',
      nextStart: '',
      nextEnd: '',
      time: [
        {
          id: 1,
          name: '日报'
        },
        {
          id: 2,
          name: '周报'
        },
        {
          id: 3,
          name: '月报'
        },
        {
          id: 4,
          name: '季度报'
        },
        {
          id: 5,
          name: '年报'
        },
        {
          id: 6,
          name: '自定义'
        }
      ],
      currentStatus: [
        {
          id: -1,
          name: '全部'
        },
        {
          id: 1,
          name: '进行中'
        },
        {
          id: 2,
          name: '已完成'
        }
      ],
      active: 2,
      // 提示窗
      dialogVisible: false,
      checked: false,
      obj: {},
      type: 1,
      // 状态切换
      current: -1,
      value1: '3',
      pageNum: 1,
      pageSize: 15,
      planList: [],
      total: 0,
      modal: false,
      modal1: false,
      formValidate: {
        jobName: '',
        description: '',
        uid: ''
      },
      formValidate1: {
        jobName: '',
        description: '',
        uid: ''
      },
      ruleValidate: {
        jobName: [
          { required: true, message: '工作名称不能为空', trigger: 'blur' }
        ]
      },
      ruleValidate1: {
        jobName: [
          { required: true, message: '工作名称不能为空', trigger: 'blur' }
        ]
      },
      currentData: [],
      nextData: [],
      idx: 0,
      idx1: 0,
      editId: {},
      nextId: {},
      startDate: '',
      endDate: '',
      timeShow: false,
      dateTimeOpt: {
        disabledDate: function (currentDateTime) {
          return false
        }
      },
      dateTimeOpt1: {
        disabledDate: function (currentDateTime) {
          return false
        }
      },
      dateTimeOpt2: {
        disabledDate: function (currentDateTime) {
          return false
        }
      },
      dateTimeOpt3: {
        disabledDate: function (currentDateTime) {
          return false
        }
      },
      tabCurr: '本周',
      tabNext: '下周',
      // 任务详情
      TaskDetailCompShow: false,
      modifyTaskRes: '',
      remark: '',
      modal2: false,
      loading: false
    }
  },
  components: {
    draggable
    // TaskDetailComp
  },
  created () {
    this.getPlan()
    this.currentData = []
    this.currStart = this.getBeforeTime(30 * 24 * 60 * 60 * 1000).split(' ')[0]
    this.currEnd = this.getNowTime().split(' ')[0]
    this.nextStart = this.getNowTime().split(' ')[0]
    this.nextEnd = this.getLaterTime(30 * 24 * 60 * 60 * 1000).split(' ')[0]
    this.$store.commit('setDateOption', {OptionObj: this.dateTimeOpt, endDate: this.currEnd})
    this.$store.commit('setDateOption', {OptionObj: this.dateTimeOpt1, startDate: this.currStart, endDate: this.currEnd})
    this.$store.commit('setDateOption', {OptionObj: this.dateTimeOpt2, startDate: this.nextStart})
    this.$store.commit('setDateOption', {OptionObj: this.dateTimeOpt3, startDate: this.nextStart})
  },
  computed: {
    // console.log(this.$store.state.userName)
    getUser () {
      return this.$store.state.userName
    },
    getjname () {
      return this.$store.state.jName
    }
  },
  mounted: function () {
    /** 设置侧边栏激活状态 */
    this.$store.commit('setNavActive', {navName: '工作报告', childNavName: '报告生成'})
  },
  methods: {
    // // 任务详情组件
    // // 附件 附件预览
    // GetFilePreData (obj) {
    //   if (obj.previewUrl && this.isImage(obj.fileName)) {
    //     this.showBigImage1(obj.previewUrl)
    //   }
    // },
    // toPlanDetailFuc: function (id) {
    //   var that = this
    //   that.currentNodeId = id
    //   that.value444 = true
    //   that.TaskDetailCompShow = false
    // },
    start (evt) {
    },
    // 生成pdf
    getPdfs (dom, title) {
      let that = this
      var c = document.createElement('canvas')
      var opts = {
        scale: 2,
        canvas: c,
        logging: true,
        width: document.querySelector(dom).getBoundingClientRect().width,
        height: document.querySelector(dom).getBoundingClientRect().height
      }
      c.width = document.querySelector(dom).getBoundingClientRect().width * 2
      c.height = document.querySelector(dom).getBoundingClientRect().height * 2
      c.getContext('2d').scale(2, 2)
      html2Canvas(document.querySelector(dom), opts).then(function (canvas) {
        let contentWidth = canvas.width
        let contentHeight = canvas.height
        let pageHeight = contentWidth / 592.28 * 841.89
        let leftHeight = contentHeight
        let position = 0
        let imgWidth = 595.28
        let imgHeight = 592.28 / contentWidth * contentHeight
        let pageData = canvas.toDataURL('image/jpeg', 1.0)
        let PDF = new JsPDF('', 'pt', 'a4')
        if (leftHeight < pageHeight) {
          PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
        } else {
          while (leftHeight > 0) {
            PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
            leftHeight -= pageHeight
            position -= 841.89
            if (leftHeight > 0) {
              PDF.addPage()
            }
          }
        }
        PDF.save(title + '.pdf')
        setTimeout(() => {
          that.loading = false
        }, 3000)
      }
      )
    },
    closeRemark () {
      this.modal2 = false
      this.remark = ''
      // this.generate()
    },
    submit () {
      this.generate()
    },
    getReport () {
      this.modal2 = true
      this.remark = ''
    },
    // pdf生成
    generate () {
      let obj = {
        timeType: this.active,
        remark: this.remark,
        lastRec: this.currentData,
        nextRec: this.nextData
      }
      this.ajax('/report/addReport', JSON.stringify(obj)).then(res => {
        if (res.code === 200) {
          this.modal2 = false
          this.loading = true
          // this.$message.success(res.msg)
          this.getPdfs('#pdfDom', this.htmlTitle)
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    // 一件转入
    allSelect () {
      let status = ''
      if (this.current === -1) {
        status = ''
      } else {
        status = this.current
      }
      this.ajax('/report/getTaskList', {
        timeType: this.active,
        taskType: this.type,
        status: status,
        startDate: this.startDate,
        endDate: this.endDate
      }).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
          if (this.type === 1) {
            res.data.forEach((item, index) => {
              this.currentData.push(item)
            })
          } else {
            res.data.forEach((item, index) => {
              this.nextData.push(item)
            })
          }
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    // 当前开始时间
    cstart (val) {
      this.currStart = val
      if (this.type === 1) {
        this.startDate = val
      } else {
        this.startDate = ''
      }
      this.$store.commit('setDateOption', {OptionObj: this.dateTimeOpt1, startDate: this.currStart, endDate: this.currEnd})
      this.getPlan()
    },
    // 当前结束时间
    cend (val) {
      this.currEnd = val
      if (this.type === 1) {
        this.endDate = val
      } else {
        this.endDate = ''
      }
      this.getPlan()
      // this.$store.commit('setDateOption', {OptionObj: this.dateTimeOpt1, startDate: this.currStart, endDate: this.currEnd})
    },
    // 下期开始时间
    nstart (val) {
      this.nextStart = val
      if (this.type === 2) {
        this.startDate = val
      } else {
        this.startDate = ''
      }
      this.$store.commit('setDateOption', {OptionObj: this.dateTimeOpt3, startDate: this.nextStart})
      this.getPlan()
    },
    // 下期结束时间
    nend (val) {
      this.nextEnd = val
      if (this.type === 2) {
        this.endDate = val
      } else {
        this.endDate = ''
      }
      this.getPlan()
    },
    addCollection (evt) {
      this.getPlan()
      let arr = []
      if (evt.added) {
        this.currentData.forEach((item, index) => {
          if (item.uid === evt.added.element.uid) {
            arr.push(index)
            if (arr.length > 1) {
              this.currentData.splice(index, 1)
            }
          }
        })
      }
      console.log(evt)
    },
    addCollection1 (evt) {
      this.getPlan()
      let arr = []
      console.log(evt)
      if (evt.added) {
        this.nextData.forEach((item, index) => {
          if (item.uid === evt.added.element.uid) {
            arr.push(index)
            if (arr.length > 1) {
              this.nextData.splice(index, 1)
            }
          }
        })
      }
    },
    addPlan () {
      this.modal = true
      this.formValidate = {}
      this.editId = {}
      this.formValidate.uid = this.idx++
    },
    addPlanNext () {
      this.modal1 = true
      this.formValidate1 = {}
      this.formValidate1.uid = this.idx1++
    },
    currentPage1 (val) {
      this.pageNum = val
      this.getPlan()
    },
    // 获取计划列表
    getPlan () {
      let status = ''
      if (this.current === -1) {
        status = ''
      } else {
        status = this.current
      }
      this.ajax('/report/getTaskPage', {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        status: status,
        taskType: this.type,
        timeType: this.active,
        startDate: this.startDate,
        endDate: this.endDate
      }).then(res => {
        if (res.code === 200) {
          this.planList = res.data.list
          this.total = res.data.totalRow
        }
      })
    },
    // 选择时间日期
    choseTime (item) {
      this.obj = item
      if (!this.checked) {
        this.dialogVisible = true
      } else {
        this.dialogVisible = false
        this.active = item.id
        this.currentData = []
        this.nextData = []
        if (this.active === 6) {
          this.timeShow = true
          if (this.type === 1) {
            this.startDate = this.currStart
            this.endDate = this.currEnd
          } else {
            this.startDate = this.nextStart
            this.endDate = this.nextEnd
          }
        } else {
          this.timeShow = false
          this.startDate = ''
          this.endDate = ''
        }
        switch (item.id) {
          case 1:
            this.tabCurr = '今天'
            this.tabNext = '明天'
            this.htmlTitle = '日报'
            break
          case 2:
            this.tabCurr = '本周'
            this.tabNext = '下周'
            this.htmlTitle = '周报'
            break
          case 3:
            this.tabCurr = '本月'
            this.tabNext = '下月'
            this.htmlTitle = '月报'
            break
          case 4:
            this.tabCurr = '本季度'
            this.tabNext = '下季度'
            this.htmlTitle = '季度报'
            break
          case 5:
            this.tabCurr = '今年'
            this.tabNext = '明年'
            this.htmlTitle = '年报'
            break
          case 6:
            this.tabCurr = '本期'
            this.tabNext = '下期'
            this.htmlTitle = '期报'
            break
        }
        this.getPlan()
      }
    },
    // 状态切换
    tabStatus (item) {
      this.current = item.id
      this.getPlan()
    },
    // 提示弹窗确定关闭
    sure () {
      this.dialogVisible = false
      this.active = this.obj.id
      this.currentData = []
      this.nextData = []
      if (this.active === 6) {
        this.timeShow = true
        if (this.type === 1) {
          this.startDate = this.currStart
          this.endDate = this.currEnd
        } else {
          this.startDate = this.nextStart
          this.endDate = this.nextEnd
        }
      } else {
        this.timeShow = false
        this.startDate = ''
        this.endDate = ''
      }
      switch (this.active) {
        case 1:
          this.tabCurr = '今天'
          this.tabNext = '明天'
          this.htmlTitle = '日报'
          break
        case 2:
          this.tabCurr = '本周'
          this.tabNext = '下周'
          this.htmlTitle = '周报'
          break
        case 3:
          this.tabCurr = '本月'
          this.tabNext = '下月'
          this.htmlTitle = '月报'
          break
        case 4:
          this.tabCurr = '本季度'
          this.tabNext = '下季度'
          this.htmlTitle = '季度报'
          break
        case 5:
          this.tabCurr = '今年'
          this.tabNext = '明年'
          this.htmlTitle = '年报'
          break
        case 6:
          this.tabCurr = '本期'
          this.tabNext = '下期'
          this.htmlTitle = '期报'
          break
      }
      this.getPlan()
    },
    // 切换标签
    getTab (type) {
      this.type = type
      this.current = -1
      if (this.active === 6) {
        if (type === 1) {
          this.startDate = this.currStart
          this.endDate = this.currEnd
        } else {
          this.startDate = this.nextStart
          this.endDate = this.nextEnd
        }
      } else {
        this.startDate = ''
        this.endDate = ''
      }
      if (this.type === 2) {
        this.currentStatus = [
          {
            id: -1,
            name: '全部'
          },
          {
            id: 0,
            name: '未开始'
          },
          {
            id: 1,
            name: '进行中'
          }
        ]
      } else {
        this.currentStatus = [
          {
            id: -1,
            name: '全部'
          },
          {
            id: 1,
            name: '进行中'
          },
          {
            id: 2,
            name: '已完成'
          }
        ]
      }
      this.getPlan()
    },
    ok (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.modal = false
          if (this.currentData.length > 0) {
            if (JSON.stringify(this.editId) === '{}') {
              this.currentData.push(this.formValidate)
            } else {
              this.currentData.forEach((item, index) => {
                if (item.uid === this.formValidate.uid) {
                  item = this.formValidate
                }
              })
            }
          } else {
            this.currentData.push(this.formValidate)
          }
        } else {
          this.$Message.error('请输入完整信息')
        }
      })
    },
    cancel () {
      this.modal = false
    },
    okNext (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.modal1 = false
          if (this.nextData.length > 0) {
            if (JSON.stringify(this.nextId) === '{}') {
              this.nextData.push(this.formValidate1)
            } else {
              this.nextData.forEach((item, index) => {
                if (item.uid === this.formValidate1.uid) {
                  item = this.formValidate1
                }
              })
            }
          } else {
            this.nextData.push(this.formValidate1)
          }
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    cancelNext () {
      this.modal1 = false
    },
    delPlan (index) {
      this.currentData.splice(index, 1)
    },
    delPlanNext (index) {
      this.nextData.splice(index, 1)
    },
    // 双击修改
    editPlan (item) {
      this.formValidate = {}
      this.modal = true
      this.formValidate = item
      this.editId = item
    },
    editNextPlan (item) {
      this.formValidate1 = {}
      this.modal1 = true
      this.formValidate1 = item
      this.nextId = item
    }
  }
}
</script>

<style scoped>
  .workPlan {
    position: relative;
  }
  .workPlan .timeSelect {
    margin-top: 15px;
  }
  .workPlan .top {
    width: 100%;
    height: 70px;
    background: #f2f2f2;
    border-radius: 2px;
    padding-right: 15px;
  }
  .workPlan .top-ul {
    float: left;
    list-style: none;
    margin-top: 20px;
  }
  .workPlan .top-ul .list {
    list-style: none;
    width: 62px;
    height: 27px;
    border-radius: 5px;
    border:1px solid rgba(121, 121, 121, 1);
    line-height: 27px;
    text-align: center;
    color:#333;
    font-size: 12px;
    float: left;
    margin-left: 15px;
    background: #fff;
    cursor: pointer;
  }
  .workPlan .top-ul .active {
    background: #169BD5;
    border:0;
    color:#fff;
  }
  .workPlan .bottom {
    width: 100%;
    margin-top: 10px;
    margin-bottom: 15px;
    position: relative;
    display: flex;
  }
  .workPlan .bottom-left {
    width: 65%;
    min-height:700px;
    -webkit-box-flex:1;
    flex-grow:1;
    padding-right: 20px;
  }
  .workPlan .tabs {
    width: 100%;
    height: 35px;
    border-bottom: 1px solid #ccc;
  }
  .workPlan .tabs .first {
    width: 100px;
    height: 35px;
    border: 1px solid #ccc;
    border-bottom: 0;
    text-align: center;
    line-height: 35px;
    border-top: 3px solid #3399FF;
    float: left;
    cursor: pointer;
  }
  .workPlan .tabs .last {
    border-left:0;
    border-top: 3px solid #00CC99;
  }
  .workPlan .tabs .active {
     background: #fff;
  }
  .workPlan .content {
    width: 100%;
    min-height: 800px;
    border-right: 1px solid #ccc;
  }
  .workPlan .content .statusTab {
    width: 100%;
    padding-top: 20px;
    font-size: 14px;
    height: 50px;
  }
  .workPlan .content .statusTab ul,li {
    list-style: none;
  }
  .workPlan .content .statusTab li {
    float: left;
    margin-right: 15px;
    cursor: pointer;
  }
  .workPlan .content .statusTab .active {
    color:#169BD5;
  }
  .workPlan .content .planList {
    display: flex;
    display: -webkit-flex;
    /*justify-content: space-between;*/
    flex-direction: row;
    flex-wrap: wrap;
    margin-top: 10px;
  }
  .workPlan .content .plans {
    width:355px;
    height: 120px;
    border:1px solid #ccc;
    margin-bottom:25px;
    margin-right: 35px;
    box-shadow:1px 1px 4px #f1f1f1;
    position: relative;
    /*-webkit-box-flex:1;*/
    /*flex-grow:1;*/
  }
  .workPlan .plantop {
    width: 100%;
    padding:10px 10px 10px 10px;
  }
  .workPlan .plantop .status {
    float: left;
    width: 50px;
    height: 22px;
    /*border: 1px solid #00CC99;*/
    text-align: center;
    line-height: 22px;
    border-radius: 3px;
    /*color:#00CC99;*/
    margin-left: 15px;
  }
  .workPlan .plantop .haveFinish {
    border:1px solid #3A8EE6;
    color:#3A8EE6;
  }
  .workPlan .plantop .nosure {
    border:1px solid #FFC107;
    color:#FFC107;
  }
  .workPlan .plantop .having {
    border:1px solid #00CC99;
    color:#00CC99;
  }
  .workPlan .planbottom {
    width: 100%;
    height: 45px;
    padding:10px 10px 10px 10px;
    margin-top: 25px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp:2;
    -webkit-box-orient: vertical;
  }
  .workPlan .bottom-right {
    width: 420px;
    /*position: absolute;*/
    /*top:0;*/
    /*right:0;*/
    height: 800px;
    padding-right:15px;
    /*position: relative;*/
    /*background: pink;*/
  }
  .workPlan .pdf {
    width: 500px;
    position: fixed;
    right:-500px;
    top:150px;
    z-index:100;
    font-size: 12px;
    /*background: pink;*/
  }
  .workPlan .current {
    width: 100%;
    height: 35px;
  }
  .workPlan .plan {
    width: 100%;
    height: 700px;
  }
  .workPlan .plan-top {
    width: 100%;
    height: 400px;
    border:1px solid #ccc;
    overflow: auto;
    background: #fff;
  }
  .workPlan .plan-top .title {
    width: 100%;
    height: 40px;
    background: #EBEBEB;
    border-bottom: 1px solid #ccc;
  }
  .workPlan .plan-top .planItem {
    width: 33.33333%;
    height: 100%;
    line-height: 40px;
    /*text-align: center;*/
    float: left;
  }
  .workPlan .plan-top .contents {
    line-height: 35px;
  }
  .workPlan .plan-top .content-list {
    width: 100%;
    height: 35px;
    border-bottom: 1px solid #ccc;
    line-height: 35px;
  }
  .workPlan .plan-bottom {
    margin-top: 5px;
  }
</style>
