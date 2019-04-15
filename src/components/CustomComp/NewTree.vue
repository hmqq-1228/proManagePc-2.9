<template>
  <div class="NewTreeBox" style="position: relative; display: block !important;">
    <div class="jiajian" @click="jiajianClick($event)"><span class="open">-</span></div>
    <div class="NewTree" v-bind:id="'parent_' + (newTreeList && newTreeList[0] && newTreeList[0].parentId?newTreeList[0].parentId: nextId)">
      <div class="node" v-for="newTreeItem in newTreeList" :key="newTreeItem.id" :id="newTreeItem.id" draggable="true" @dragstart="drag($event)">
        <div class="lineLeft" v-if="newTreeItem.type!=='rootPlan'"></div>
        <div class="nodeCnt">
          <div class="insertLine" :id="'line_' + newTreeItem.id">
            <div class="insertLineCnt"></div>
            <div class="arrowLeft"></div>
          </div>
          <div class="insertLineCover" :id="'line_cover' + newTreeItem.id" @drop="drop($event, 'line', newTreeItem.id)" @dragover="allowDrop($event, 'line', newTreeItem.id)" @dragleave="dragLeave($event, 'line', newTreeItem.id)"></div>
          <div class="nodeTitleBox">
            <div v-if="newTreeItem.type!=='rootPlan'">---</div>
            <div class="nodeTitle"
                 v-bind:class="newTreeItem.type"
                 :id="'title_' + newTreeItem.id"
                 @drop="drop($event, 'title', newTreeItem.id)"
                 @dragover="allowDrop($event, 'title')"
                 @dragleave="dragLeave($event, 'title', newTreeItem.id)">{{treeNodeLevel}}:{{newTreeItem.name}}
            </div>
          </div>
          <component v-show="newTreeItem.children.length>0"
                     v-bind:is="compArr.NewTree"
                     :nextId="newTreeItem.id"
                     v-bind:treeNodeLevel="treeNodeLevel + 1"
                     v-bind:newTreeList="newTreeItem.children"></component>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NewTree from '../CustomComp/NewTree.vue'
// import TreeJsonData from '../../assets/testData/TreeJsonData.js'
export default {
  name: 'NewTree',
  components: {
    NewTree
  },
  props: ['proId', 'firstPlanId', 'TreeNodeId', 'newTreeList', 'nextId', 'treeNodeLevel'],
  data () {
    return {
      msg: '',
      compArr: {
        NewTree: 'NewTree'
      },
      currentNodeId: '',
      treeLevel: 0
    }
  },
  created () {
    this.$store.state.treeLevel = this.$store.state.treeLevel + 1
    this.treeLevel = this.$store.state.treeLevel
    // this.log('男儿当自强：', this.TreeJsonData)
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
      if (val) {
        this.currentNodeId = val
      }
    },
    TreeNodeId (val, old) {
      if (val) {
        this.currentNodeId = val
      }
    }
  },
  methods: {
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
    },
    dragLeave: function (e, pos, id) {
      var obj = e.currentTarget
      if (pos === 'line') {
        this.log('leave')
        $('#line_' + id).removeClass('active')
      } else if (pos === 'title') {
        $(obj).removeClass('active')
      }
    },
    allowDrop: function (ev, pos, id) {
      var obj = ev.currentTarget
      // ev.stopPropagation()
      ev.preventDefault()
      if (pos === 'title') {
        this.log('是title')
        $(obj).addClass('active')
      } else if (pos === 'line') {
        $('#line_' + id).addClass('active')
      }
    },
    drop: function (ev, pos, id) {
      this.log('drop')
      ev.preventDefault()
      // ev.stopPropagation()
      var obj = ev.currentTarget
      var data = ev.dataTransfer.getData('Text')
      var parNode = document.getElementById(data)
      $('.nodeTitle').removeClass('active')
      $('.insertLine').removeClass('active')
      if (pos === 'title') {
        $(obj).removeClass('active')
        $(obj).parent().siblings('.NewTreeBox').css('display', 'block')
        document.getElementById('parent_' + id).appendChild(parNode)
      } else if (pos === 'line') {
        $(obj).parent().siblings('.NewTreeBox').css('display', 'block')
        $('#' + data).insertBefore($('#' + id))
      }
    },
    drag: function (ev) {
      this.log('drag')
      var obj = ev.currentTarget
      ev.dataTransfer.setData('Text', ev.target.id)
      $(obj).removeClass('active')
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
  .NewTreeBox{
    overflow: hidden;
    _background-color: #eee;
  }
  .NewTree{
    /*min-height: 3px;*/
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
    position: relative;
    padding-top: 20px;
  }
  .node .NewTree{
    margin-left: 50px;
  }
  .nodeTitleBox{
    display: flex;
    _margin-bottom: 10px;
  }
  .insertLine{
    position: absolute;
    top: 10px; left: 9px;
    /*background-color: red;*/
    width: 120px;
    height: 10px;
  }
  .insertLine div{
    display: none;
    /*opacity: 0;*/
  }
  .insertLine.active div{
    display: block;
    /*opacity: 1;*/
  }
  /*.insertLine.active{*/
    /*background-color: chocolate;*/
  /*}*/
  .insertLineCnt{
    height: 6px;
    border-bottom: 2px solid chocolate;
  }
  .insertLineCover{
    position: absolute;
    top: 10px; left: 9px;
    width: 120px;
    height: 10px;
  }
  .arrowLeft{
    position: absolute;
    left: -4px;
    top: 1px;
    width: 8px;
    height: 8px;
    background-color: #fff;
    border-top: 2px solid chocolate;
    border-right: 2px solid chocolate;
    transform: rotate(45deg);
  }
  .nodeTitle{
    color: #666;
    position: relative;
    cursor: default;
    border: 2px solid #3a8ee6;
    border-radius: 4px;
    padding: 2px 5px;
  }
  .nodeTitle.rootPlan{
    font-size: 16px;
    padding: 2px 8px;
    color: #3a8ee6;
    background: rgba(58,142,230,0.2);
  }
  .nodeTitle.plan{
    /**/
  }
  .nodeTitle.task{
    border: 2px solid #FFD04B;
    /*color: rgb(255, 208, 75) #FFD04B chocolate*/
  }
  .nodeTitle.active{
    border: 2px solid chocolate;
    /*box-shadow: 2px 2px 2px chocolate;*/
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
