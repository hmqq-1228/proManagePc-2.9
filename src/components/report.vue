<template>
   <div class="report" style="position: relative">
     <div class="pdf" id="pdfDom" style="width: 500px;position: fixed;right:-500px;top:0" v-if="detail">
       <div style="padding:10px 10px;width: 100%;height: 100%;">
         <p style="font-size: 12px;color:#000;">{{name}}</p>
         <div style="margin-top: 10px;" v-for="(item, index) in detail.lastRec" :key="item.id">
           <p style="font-size: 12px;transform: scale(0.85)"><span style="color:#000;font-weight: bold">{{index+1}}、</span>{{item.taskName}}</p>
           <p style="font-size: 12px;margin-top: 5px;transform: scale(0.8);line-height: 25px;margin-left: 0px">{{item.remark}}</p>
         </div>
         <p style="font-size: 12px;color:#000;margin-top: 30px;">{{nname}}</p>
         <div style="margin-top: 15px" v-for="(item, index) in detail.nextRec" :key="item.id">
           <p style="font-size: 12px;;transform: scale(0.85)"><span style="color:#000;font-weight: bold">{{index+1}}、</span>{{item.taskName}}</p>
           <p style="font-size: 12px;margin-left: 20px;margin-top: 5px;transform: scale(0.8);line-height: 25px;margin-left: 0px">{{item.remark}}</p>
         </div>
       </div>
     </div>
     <div class="top">
       <ul class="top-ul">
         <li v-for="item in time" :key="item.id" class="list" :class="item.id === active ? 'active' : ''" @click="choseTime(item)">{{item.name}}</li>
       </ul>
     </div>
     <div style="margin-top: 10px;">
       <span>创建日期：</span>
       <el-date-picker
         v-model="createDate"
         type="date"
         placeholder="选择日期"
         size="small"
         value-format="yyyy-MM-dd"
         style="width: 150px;margin-left: 10px"
         @change="cstart">
         </el-date-picker>
     </div>
     <div class="bottom" v-if="list.length>0">
       <div class="plans" v-for="(item, index) in list" :key="index" @click="planDetail(item)">
         <div class="plantop" style="padding:10px;">
           <span style="font-size: 14px;float: left">期数：{{item.tagNumber}}</span>
           <span style="float: right">{{getStatus(item)}}</span>
         </div>
         <div class="planbottom" style="margin-top: 25px;padding: 10px;">
           <Icon type="ios-alarm-outline" style="color:#169BD5;font-size: 18px;"/>
           <span style="margin-left: 5px;line-height: 20px;">{{item.createDt}}</span>
         </div>
         <div style="color:#169BD5;position: absolute;right:20px;bottom:10px;font-size: 14px;">详情</div>
       </div>
     </div>
     <div  style="text-align: center;line-height: 200px;" v-else>
       暂无数据
     </div>
     <div style="text-align: center" v-if="list.length > 0">
       <el-pagination
         small
         layout="prev, pager, next"
         :total="total"
         @current-change="currentPage1"
         :page-size="pageSize"
       >
       </el-pagination>
     </div>
     <!--报告详情-->
     <Drawer title="报告详情" class="drawerScroll" :closable="false" width="550" v-model="reportShow" style="font-size: 14px;" v-if="detail">
       <div class="info" style="border-bottom: 1px solid #f2f2f2;width: 100%;height: 30px;font-size: 14px;">
         <span style="color:#169BD5;font-size: 14px">期数：</span><span>{{detail.tagNumber}}</span>
         <span style="float: right;color:#169BD5;">{{getStatus(detail)}}</span>
       </div>
       <div style="border-bottom: 1px solid #f2f2f2;width: 100%;height: 40px;font-size: 14px;">
         <Icon type="ios-alarm-outline" style="color:#169BD5;font-size: 18px;line-height: 40px"/>
         <span style="margin-left: 5px;line-height: 20px;line-height: 40px">{{detail.createDt}}</span>
       </div>
       <p style="font-size: 14px;margin-top: 15px;">{{name}}工作安排<Button type="info" size="small" style="float: right" @click="getPdf('#pdfDom',getStatus(detail))">生成</Button></p>
       <div class="plan-top" style="width: 100%;height:400px;border: 1px solid #ccc;margin-top:10px;font-size: 14px;overflow: auto">
         <div class="title" style="width: 100%;height: 40px;background:#EBEBEB;border-bottom: 1px solid #ccc;">
           <div class="planItem" style="width: 35%;float: left;line-height: 40px;margin-left: 15px;">任务名称</div>
           <div class="planItem" style="width: 55%;float: left;line-height: 40px;margin-left: 15px;text-indent: 50px;">描述</div>
         </div>
         <div class="content-list" v-for="item in detail.lastRec" :key="item.id" style="width: 100%;height: 35px;border-bottom: 1px solid #ccc" v-if="detail.lastRec && detail.lastRec.length>0">
             <div class="planItem contents" style="width: 35%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height: 35px;margin-left: 15px;float: left" :title="item.taskName">{{item.taskName}}</div>
             <div class="planItem contents" style="width: 55%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height: 35px;margin-left: 15px;float: left;" :title="item.remark">{{item.remark}}</div>
         </div>
         <div v-if="detail.lastRec && detail.lastRec.length === 0" style="text-align: center;line-height: 300px">
           暂无数据
         </div>
       </div>
       <p style="font-size: 14px;margin-top: 15px;">{{nname}}工作安排</p>
       <div class="plan-top" style="width: 100%;height:400px;border: 1px solid #ccc;margin-top:10px;font-size: 14px;overflow: auto ">
         <div class="title" style="width: 100%;height: 40px;background:#EBEBEB;border-bottom: 1px solid #ccc;">
           <div class="planItem" style="width: 35%;float: left;line-height: 40px;margin-left: 15px;">任务名称</div>
           <div class="planItem" style="width: 55%;float: left;line-height: 40px;margin-left: 15px;text-indent: 50px;">描述</div>
         </div>
         <div class="content-list" v-for="item in detail.nextRec" :key="item.id" style="width: 100%;height: 35px;border-bottom: 1px solid #ccc" v-if="detail.lastRec && detail.nextRec.length > 0">
           <div class="planItem contents" style="width: 35%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height: 35px;margin-left: 15px;float: left" :title="item.taskName">{{item.taskName}}</div>
           <div class="planItem contents" style="width: 55%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height: 35px;margin-left: 15px;float: left;" :title="item.remark">{{item.remark}}</div>
         </div>
         <div v-if="detail.lastRec && detail.nextRec.length === 0" style="text-align: center;line-height: 300px">
           暂无数据
         </div>
       </div>
       <p style="font-size: 14px;margin-top: 10px">描述：{{detail.remark}}</p>
     </Drawer>
   </div>
</template>
<style>
</style>
<script>
export default {
  name: 'report',
  data () {
    return {
      time: [
        {
          id: 0,
          name: '全部'
        },
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
      active: 0,
      createDate: '',
      planList: [1, 2, 3, 4],
      total: 0,
      pageSize: 20,
      pageNum: 1,
      list: [],
      reportShow: false,
      name: '',
      nname: '',
      reportId: 0,
      detail: {},
      htmlTitle: '日报'
    }
  },
  created () {
    this.getPlan()
  },
  watch: {
    reportShow (val) {
      if (val === false) {
        this.detail = {}
      }
    }
  },
  methods: {
    planDetail (item) {
      this.reportShow = true
      this.reportId = item.id
      this.ajax('/report/getReportDetail', {reportId: this.reportId}).then(res => {
        if (res.code === 200) {
          this.detail = res.data
          this.getName(this.detail)
        }
      })
    },
    getStatus (item) {
      switch (item.type) {
        case 1:
          return '日报'
        case 2:
          return '周报'
        case 3:
          return '月报'
        case 4:
          return '季度报'
        case 5:
          return '年报'
        case 6:
          return '自定义'
      }
    },
    getName (item) {
      switch (item.type) {
        case 1:
          this.name = '今天'
          this.nname = '明天'
          break
        case 2:
          this.name = '本周'
          this.nname = '下周'
          break
        case 3:
          this.name = '本月'
          this.nname = '下月'
          break
        case 4:
          this.name = '本季度'
          this.nname = '下季度'
          break
        case 5:
          this.name = '今年'
          this.nname = '明年'
          break
        case 6:
          this.name = '本期'
          this.nname = '下期'
          break
      }
    },
    currentPage1 (val) {
      this.pageNum = val
      this.getPlan()
    },
    choseTime (item) {
      this.active = item.id
      this.getPlan()
    },
    cstart (val) {
      this.createDate = val
      this.getPlan()
    },
    getPlan () {
      this.ajax('/report/getReportPage', {
        timeType: this.active,
        createDate: this.createDate,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        if (res.code === 200) {
          this.list = res.data.list
          this.total = res.data.totalRow
        }
      })
    }
  }
}
</script>

<style scoped>
  .report .drawerScroll .plan-top {
    width: 100%;
    height: 400px;
    border:1px solid #ccc;
    overflow: auto;
    background: #fff;
  }
  .report .plan-top .title {
    width: 100%;
    height: 40px;
    background: #EBEBEB;
    border-bottom: 1px solid #ccc;
  }
  .report .plan-top .planItem {
    width: 33.33333%;
    height: 100%;
    line-height: 40px;
    text-align: center;
    float: left;
  }
  .report .plan-top .contents {
    line-height: 35px;
  }
  .report .plan-top .content-list {
    width: 100%;
    height: 35px;
    border-bottom: 1px solid #ccc;
    line-height: 35px;
  }
  .report .top {
    width: 100%;
    height: 70px;
    background: #f2f2f2;
    border-radius: 2px;
    padding-right: 15px;
  }
  .report .top-ul {
    float: left;
    list-style: none;
    margin-top: 20px;
  }
  .report .top-ul .list {
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
  .report .top-ul .active {
    background: #169BD5;
    border:0;
    color:#fff;
  }
  .report .bottom {
    width: 100%;
    /*min-height: 700px;*/
    display: flex;
    display: -webkit-flex;
    /*justify-content: space-between;*/
    flex-direction: row;
    flex-wrap: wrap;
    margin-top: 15px;
  }
  .report .plans {
    width:355px;
    height: 90px;
    border:1px solid #ccc;
    margin-bottom:25px;
    margin-right: 50px;
    box-shadow:1px 1px 4px #f1f1f1;
    position: relative;
    cursor: pointer;
  }
  .report .info span{
    font-size: 14px;
    color:#169BD5;
  }

</style>
