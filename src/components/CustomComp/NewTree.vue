<template>
  <div class="NewTree">
    <div class="node" v-for="newTreeItem in newTreeList" :key="newTreeItem.id">
      <div class="nodeTitleBox">
        <div class="nodeTitle" v-on:contextmenu="rightKey">{{newTreeItem.name}}</div>
      </div>
      <component v-bind:is="compArr.NewTree" v-bind:newTreeList="newTreeItem.children"></component>
    </div>
    <!-- 右键菜单测试 -->
    <div id="menu">
      <div class="menu">功能1</div>
      <div class="menu">功能2</div>
      <div class="menu">功能3</div>
      <div class="menu">功能4</div>
      <div class="menu">功能5</div>
    </div>
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
    }
  }
}
</script>

<style scoped>
.node .NewTree{
  margin-left: 30px;
}
  .nodeTitleBox{
    display: flex;
    margin-bottom: 10px;
  }
  .nodeTitle{
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
