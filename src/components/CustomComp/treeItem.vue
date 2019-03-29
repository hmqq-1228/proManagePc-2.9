<template>
  <div v-if="menuData">
    <div :class="menuData.type==='task'?'menuTree':'planTree'" @click="showDetailPage(menuData)">
    <div class="children-content" :class="menuData.type==='task'?'havBorder':''" style="margin-left:30px">
          <div class="children-checked">
            <i :class="{'el-icon-caret-right':!show,'el-icon-caret-bottom':show}" @click.stop="showTree" v-if="menuData.children&&menuData.children.length>0" style="margin-left:-10px"></i>
            <span class="name" @click="showDetailPage(menuData)">{{menuData.name}}</span>
            <span class="planTime" v-if="menuData.type==='plan'">
              <img src="../../../static/img/data.png">
              <span style="margin-left:10px">{{menuData.start}} - {{menuData.finish}}</span>
            </span>
            <div class="taskDesc" v-if="menuData.type==='task'">
                 <div class="top">
                   <span style="font-size:12px;float:left;margin-right: 15px"><Icon type="ios-person" size="24" style="color:#28558C;margin-top:-5px"/>&nbsp;{{menuData.userName}}</span>
                   <span v-if="menuData.status!=='2'&&menuData.dayNum">
                     <span class="residue" v-if="menuData.dayNum > 0" :class="{'number':menuData.dayNum>1}">剩余{{menuData.dayNum}}天</span>
                     <span class="residue" v-else :class="{'number':menuData.dayNum>1}">逾期{{Math.abs(menuData.dayNum)}}天</span>
                   </span>
                   <!--<div class="createPeople" v-if="menuData.userName" :class="{'leftDay':menuData.status==='2'}">{{menuData.userName.substr(0, 1)}}</div>-->
                 </div>
               <div class="down" :class="{'leftDay':menuData.status==='2'}">
                <img src="../../../static/img/time.png">
                <span class="text">{{menuData.start}} - {{menuData.finish}}</span>
               </div>
            </div>
            <div  v-if="menuData.type==='task'">
              <div class="status" :class="{'noSure':menuData.status==='0','noFinish':menuData.status==='1','finish':menuData.status==='2','stop':menuData.status==='3','overdue':menuData.status==='4',}"><p>{{menuData.statusStr}}</p></div>
            </div>
           </div>
    </div>
    </div>
  <div v-show="show" v-if="menuData.children&&menuData.children.length>0">
    <div class="children-list" v-for="(item,index) in menuData.children" :key="index">
      <div class="children-content" style="margin-left:30px">
         <treeItem :menuData="item" @showDetailPage="showDetailPage"></treeItem>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: ['menuData'],
  name: 'treeItem',
  data () {
    return {
      show: true
    }
  },
  created () {
  },
  methods: {
    showTree () {
      if (this.menuData.children) {
        this.show = !this.show
      }
    },
    // 树状详情
    showDetailPage (item) {
      this.$emit('showDetailPage', item)
    }
  }
}
</script>

<style>
.tree-second {
  margin-left: 30px;
  /*border-left:5px solid #f2f2f2;*/
  list-style: none;
  transition: all 1s;
}
.menuTree {
    height: 65px;
    border-bottom: 1px solid #f2f2f2;
    overflow: hidden;
    cursor: pointer;
}
.menuTree:hover {
  background: #E3FBE3;
}
.planTree {
  cursor: pointer;
}
.planTree:hover {
  background: #E3FBE3;
}
.havBorder {
  border-left:3px solid #2D9CFF;
}
.children-list {
  list-style: none;
}
.children-list:last-child {
  border-bottom: none;
}
.children-content {
      margin-top: 15px;
      line-height: 35px;
      /*height: 50px;*/
}
.children-content .active {
  margin-left: 0px;
}
/*.children-content:first-child{
      margin-top: 20px;
}*/
/*.children-content:hover {
  background: #E3FBE3;
}*/
.children-checked {
  /*float:left;*/
  margin-left: 10px;
  /*margin-top: 15px;*/
  /*overflow: hidden;*/
  position: relative;
}
.children-checked .name{
  cursor: pointer;
}
.planTime {
    float:right;
    padding-right:50px;
}
.planTime img {
  width: 15px;
}
.taskDesc {
  float:right;
  padding-right:50px;
  height: 55px;
  margin-top: -12px;
}
.taskDesc .top {
      margin-left: 269px;
      display: inline-block;
}
.taskDesc .top .residue {
  color:red;
  font-size: 10px;
  float:left;
  /*margin-left: 5px;*/
  /*margin-top: -10px;*/
}
.taskDesc .top .number {
  color:#2d8cf0;
}
.taskDesc .top .createPeople {
  float:left;
  width: 30px;
  height: 30px;
  border-radius: 100px;
  background: #F5B168;
  color:#fff;
  text-align: center;
  line-height: 30px;
  font-size: 12px;
  margin-left: 10px;
  margin-top: -10px;
}
.taskDesc .taskTime {
      float:left;
      margin-top: 20px
}
.taskDesc .down {
  margin-top: -20px;
  margin-left: 154px;
  text-align: right;
  /*margin-top:5px;
  width: 200px;*/
}
.taskDesc .down img {
  /*margin-top: 8px;*/
  /*float:left;*/
  width: 18px;
}
.taskDesc .text {
  margin-left:5px;
}
.children-checked .status {
  position: absolute;
  right:-16px;
  top:-6px;
  width: 72px;
  height: 18px;
  background: #FFC20B;
  color:#fff;
  line-height: 18px;
  /*font-size: 10px;*/
  text-align: center;
  transform: rotate(45deg);
}
  .children-checked .status p {
    /*transform: scale(0.7);*/
    font-size: 10px;
  }
  .children-checked .noSure {
    background: #FFC20B;
  }
  .children-checked .noFinish {
    background: #13ce66;
  }
  .children-checked .finish {
    background: #3a8ee6;
  }
  .children-checked .stop {
    background: red;
  }
  .children-checked .overdue {
    background: #aaa;
  }
</style>
