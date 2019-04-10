<template>
  <div class="NewTreeBox" style="position: relative;">
    <div class="NewTree">
      <div class="node" v-for="newTreeItem in newTreeList" :key="newTreeItem.id">
        <div class="lineLeft" v-if="newTreeItem.type!=='rootPlan'"></div>
        <div class="nodeCnt">
          <div class="nodeTitleBox">
            <div v-if="newTreeItem.type!=='rootPlan'">---</div>
            <div class="nodeTitle">{{newTreeItem.name}}</div>
          </div>
          <component v-if="newTreeItem.children.length>0" v-bind:is="compArr.NewTree" v-bind:newTreeList="newTreeItem.children"></component>
        </div>
      </div>
    </div>
    <div class="jiajian" @click="jiajianClick($event)"><span class="open">-</span></div>
  </div>
</template>

<script>
import NewTree from '../CustomComp/NewTree.vue'
export default {
  name: 'NewTree',
  components: {
    NewTree
  },
  props: ['proId', 'firstPlanId', 'TreeNodeId', 'newTreeList'],
  data () {
    return {
      msg: '',
      compArr: {
        NewTree: 'NewTree'
      },
      currentNodeId: ''
    }
  },
  created () {
    // this.queryProDetail()
  },
  watch: {
    newTreeList (val, old) {
      this.log('newTreeList001:', val)
      if (val) {
        this.log('newTreeList:', val)
      }
    },
    firstPlanId (val, old) {
      // this.log('111111:', val)
      if (val) {
        this.currentNodeId = val
        // this.queryProDetail()
      }
    },
    TreeNodeId (val, old) {
      if (val) {
        this.currentNodeId = val
        // this.queryProDetail()
      }
    }
  },
  methods: {
    // 测试右键
    rightKey: function (e) {
      this.log('e:', e)
      this.log('e.X:', e.pageX)
      this.log('e.Y:', e.pageY)
      e.preventDefault()

      // 获取我们自定义的右键菜单
      var menu = document.querySelector('#menu')

      // 根据事件对象中鼠标点击的位置，进行定位
      menu.style.left = e.pageX - 220 + 'px'
      menu.style.top = e.pageY - 80 + 'px'

      // 改变自定义菜单的宽，让它显示出来
      menu.style.width = '125px'
    },
    jiajianClick: function (e) {
      var obj = e.currentTarget
      if ($(obj).children().eq(0).hasClass('open')) {
        $(obj).children().eq(0).removeClass('open').addClass('close')
        $(obj).siblings('.NewTree').css('height', 16 + 'px')
        $(obj).children().eq(0).text('+')
      } else {
        $(obj).children().eq(0).removeClass('close').addClass('open')
        $(obj).siblings('.NewTree').css('height', 'auto')
        $(obj).children().eq(0).text('-')
      }
    }
  }
}
</script>

<style scoped>
  .jiajian{
    position: absolute;
    left: 44px;
    top: 3px;
    width: 13px;
    height: 13px;
    color: #ccc;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #fff;
  }
  .jiajian:hover{
    cursor: default ;
    color: #aaa;
    border: 1px solid #aaa;
  }
  .jiajian span{
    position: absolute;
    left: 2px;
    top: -3px;
  }
  .NewTreeCompWrap>.NewTreeBox>.jiajian{
    display: none;
  }
  .NewTree{
    transition: height 2s;
    overflow: hidden;
  }
  .node{
    display: flex;
  }
  .lineLeft{
    width: 2px;
    border-left: 1px solid #ccc;
  }
  .node:last-child>.lineLeft{
    height: 30px;
  }
  .nodeCnt{
    padding-top: 20px;
  }
  .node .NewTree{
    margin-left: 50px;
  }
  .nodeTitleBox{
    display: flex;
    _margin-bottom: 10px;
  }
  .nodeTitle{
    cursor: default;
    border: 2px solid #3a8ee6;
    border-radius: 4px;
    padding: 2px 5px;
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
</style>
