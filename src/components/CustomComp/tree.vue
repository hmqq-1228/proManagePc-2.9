<template>
  <div class="tree" v-if="list.length>0">
    <div class="tree-first" v-for="(item,index) in list" :key="index">
        <div :class="item.type==='task'?'menuTree':'planTree'" @click="showDetailPage(item)">
            <div class="children-content" :class="item.type==='task'?'havBorder':''">
                <div class="children-checked">
                    <i :class="{'el-icon-caret-right':!item.show,'el-icon-caret-bottom':item.show}" @click.stop="showTree(item,index)" v-if="item.children&&item.children.length>0" style="margin-left:-10px"></i>
                    <span class="name" @click="showDetailPage(item)">{{item.name}}</span>
                    <span class="planTime" v-if="item.type==='plan'">
                      <img src="../../../static/img/data.png">
                      <span style="margin-left:10px">{{item.start}} - {{item.finish}}</span>
                    </span>
                    <div class="taskDesc" v-if="item.type==='task'">
                         <div class="top">
                           <span style="font-size:12px;float:left;margin-right: 15px"><Icon type="ios-person" size="24" style="color:#28558C;margin-top:-5px"/>&nbsp;{{item.userName}}</span>
                            <span v-if="item.status!=='2'&&item.dayNum">
                               <span class="residue" v-if="item.dayNum > 0" :class="{'number':item.dayNum>1}">剩余{{item.dayNum}}天</span>
                               <span class="residue" v-else :class="{'number':item.dayNum>1}">逾期{{Math.abs(item.dayNum)}}天</span>
                            </span>
                            <!--<div class="createPeople" v-if="item.userName" :class="{'leftDay':item.status==='2'}">{{item.userName.substr(0, 1)}}</div>-->
                         </div>
                       <div class="down" :class="{'leftDay':item.status==='2'}">
                        <span><img src="../../../static/img/time.png"></span>
                        <span class="text">{{item.start}} - {{item.finish}}</span>
                       </div>
                    </div>
                    <div  v-if="item.type==='task'">
                          <div class="status" :class="{'noSure':item.status==='0','noFinish':item.status==='1','finish':item.status==='2','stop':item.status==='3','overdue':item.status==='4',}"><p>{{item.statusStr}}</p></div>
                    </div>
                </div>
            </div>
        </div>
        <div :class="'tree-all-'+index" v-show="item.show" v-if="item.children">
            <div class="tree-second">
              <ul style="margin-left:-30px;">
                 <treeItem v-for="(item1,index) in item.children" :menuData="item1" @showDetailPage="showDetailPage" :key="index" :show="show"></treeItem>
              </ul>
            </div>
        </div>
        <!--</div>-->
        <!--</div>-->
    </div>
  </div>
</template>

<script>
import treeItem from './treeItem.vue'
export default {
  props: ['list', 'show'],
  data () {
    return {
      // show: true
    }
  },
  components: {
    treeItem
  },
  created () {
    this.getShow()
  },
  methods: {
    getShow () {
      this.list.forEach((item, index) => {
        item['show'] = true
      })
    },
    showTree (item, index) {
      if (item.children) {
        item.show = !item.show
        this.$set(this.list, index, item)
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
.tree {
     background: #fff;
     padding: 5px;
     font-size: 14px;
}
.tree-first {
     border-bottom:1px dashed #ccc;
     /*padding-bottom: 10px;
     padding-top: 10px;*/
}
.tree-first i {
    color:#ccc;
    cursor: pointer;
}
.tree-first .active {
    transform:rotate(90deg);
}
.tree-second {
  margin-left: 0px;
  /*border-left:5px solid #f2f2f2;*/
  list-style: none;
  transition: all 1s;
  overflow: hidden
}
  .tree-first .menuTree:last-child {
     /*border-bottom: none;*/
  }
  .leftDay {
    margin-left: 100px !important;
  }
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
