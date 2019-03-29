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
                        <img src="../../../static/img/time.png">
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
                 <treeItem v-for="(item1,index) in item.children" :menuData="item1" @showDetailPage="showDetailPage" :key="index"></treeItem>
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
  props: ['list'],
  data () {
    return {
      show: false
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
</style>
