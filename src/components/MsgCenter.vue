<template>
   <div class="msgcenter">
     <div class="top">
       <ul class="top-ul">
         <li v-for="item in time" :key="item.id" class="list" :class="item.id === active ? 'active' : ''" @click="choseTime(item)">{{item.name}}</li>
       </ul>
     </div>
     <div class="bottom">
        <div class="tabs">
          <div class="first" :class="type === 0 ? 'active': ''" @click="chooseType(0)">未读</div>
          <div class="first" :class="type === 1 ? 'active': ''" @click="chooseType(1)">已读</div>
        </div>
        <div class="statusTab">
          <ul>
            <li v-for="item in statusList" :key="item.id" :class="item.id === status?'active':''" @click="getStatus(item)">{{item.name}}</li>
            <li style="color:#67C23A" @click="tagAll" v-if="type === 0">全部标记已读</li>
            <!--<li>-->
              <!--<el-button type="text">全部标记已读</el-button>-->
            <!--</li>-->
          </ul>
        </div>
       <div class="content" v-if="list.length > 0">
         <div class="list" v-for="item in list" :key="item.id">
           <p class="desc"><span style="color:#169BD5">{{item.senderName}}</span>&nbsp;&nbsp;&nbsp;&nbsp;{{item.remark}}<span style="color:#169BD5;margin-left: 15px;cursor: pointer" @click="jumpDetail(item)">{{item.detailFlag}}</span></p>
           <p class="desc" style="padding-top: 10px"><Icon type="ios-alarm-outline" style="color:#169BD5;font-size: 18px;;margin-right: 10px;"/>{{item.createDt}}</p>
         </div>
       </div>
       <div class="content" v-else style="text-align: center;font-size: 16px;color:#ccc;line-height: 250px;">
          暂无数据
       </div>
       <div style="text-align: center;margin-top: 20px;" v-if="list.length > 0">
         <el-pagination
           small
           @change="handleCurrentChange"
           :page-size="20"
           layout="total, prev, pager, next, jumper"
           background
           :total="total">
         </el-pagination>
       </div>
     </div>
   </div>
</template>

<script>
export default {
  name: 'MsgCenter',
  data () {
    return {
      time: [
        {
          id: 0,
          name: '全部'
        },
        {
          id: 1,
          name: '项目'
        },
        {
          id: 2,
          name: '任务'
        },
        {
          id: 3,
          name: '问题反馈'
        },
        {
          id: 4,
          name: '档案'
        },
        {
          id: 5,
          name: '日程'
        }
      ],
      active: 0,
      type: 0,
      statusList: [
        {
          id: 0,
          name: '全部'
        },
        {
          id: 1,
          name: '通知'
        },
        {
          id: 2,
          name: '@我的'
        }
      ],
      status: 0,
      pageNum: 1,
      list: [1, 2, 3],
      total: 0
    }
  },
  created () {
    this.getMsgPage()
  },
  methods: {
    getMsgPage () {
      this.ajax('/msg/getMsgPage', {
        pageSize: 20,
        pageNum: this.pageNum,
        type: this.active,
        style: this.status,
        readFlag: this.type
      }).then(res => {
        if (res.code === 200) {
          this.list = res.data.list
          this.total = res.data.totalRow
        }
      })
    },
    choseTime (item) {
      this.active = item.id
      this.getMsgPage()
    },
    chooseType (type) {
      this.type = type
      this.getMsgPage()
    },
    getStatus (item) {
      this.status = item.id
      this.getMsgPage()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.getMsgPage()
    },
    // 全部标记已读
    tagAll () {
      this.ajax('/msg/dealAllUnRead', {type: this.active, style: this.status, readFlag: this.type}).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.getMsgPage()
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    // 调到详情
    jumpDetail (item) {
      if (item.detailUrl !== '') {
        window.location.href = item.detailUrl
      } else {
        this.$router.push('/msgCenter')
      }
    }
  }
}
</script>

<style scoped>
 .msgcenter {
 }
 .msgcenter {
   position: relative;
 }
 .msgcenter .timeSelect {
   margin-top: 15px;
 }
 .msgcenter .top {
   width: 100%;
   height: 70px;
   background: #f2f2f2;
   border-radius: 2px;
   padding-right: 15px;
 }
 .msgcenter .top-ul {
   float: left;
   list-style: none;
   margin-top: 20px;
 }
 .msgcenter .top-ul .list {
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
 .msgcenter .top-ul .active {
   background: #169BD5;
   border:0;
   color:#fff;
 }
 .msgcenter .bottom {
    width: 100%;
    margin-top: 10px;
    margin-bottom: 15px;
  }
 .msgcenter .tabs {
   width: 100%;
   height: 40px;
   border-bottom: 1px solid #ccc;
 }
 .msgcenter .tabs .first {
   float: left;
   font-size: 14px;
   margin-right: 20px;
   line-height: 40px;
   width: 60px;
   text-align: center;
   box-sizing: border-box;
   cursor: pointer;
   margin-top: -2px;
 }
 .msgcenter .tabs .active {
   border-bottom: 3px solid #169BD5;
   color:#169BD5;
 }
 .msgcenter .statusTab {
   margin-top: 15px;
 }
 .msgcenter .statusTab ul {
   list-style: none;
 }
 .msgcenter .statusTab ul li {
   list-style: none;
   float: left;
   margin-right: 20px;
   cursor: pointer;
 }
 .msgcenter .statusTab ul .active {
   color:#169BD5;
 }
 .msgcenter .content {
   width: 100%;
   margin-top: 40px;
   min-height: 600px;
 }
 .msgcenter .content .list {
   width: 100%;
   height: 80px;
   border-bottom:1px solid #e4ebf0;
   /*float: left;*/
 }
 .msgcenter .content .list .desc {
   font-size: 14px;
   padding-top: 15px;
   /*float: left;*/
 }
</style>
