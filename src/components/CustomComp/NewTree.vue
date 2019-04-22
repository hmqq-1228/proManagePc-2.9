<template>
  <div class="NewTreeBox" style="position: relative; display: block !important;">
    <!--{{queryDragResetDate?'':''}}-->
    <div class="jiajian" @click="jiajianClick($event)"><span class="open">-</span></div>
    <div class="NewTree" v-bind:id="'parent_' + (newTreeList && newTreeList[0] && newTreeList[0].parentId?newTreeList[0].parentId: nextId)">
      <div class="node" v-for="newTreeItem in newTreeList" :key="newTreeItem.id" :id="newTreeItem.id" draggable="true" @dragstart="dragstart($event, newTreeItem)">
        <div class="lineLeft" v-if="newTreeItem.type!=='rootPlan'"></div>
        <div class="nodeCnt">
          <div class="insertLine" :id="'line_' + newTreeItem.id">
            <div class="insertLineCnt"></div>
            <div class="arrowLeft"></div>
          </div>
          <div class="insertLineCover" :id="'line_cover' + newTreeItem.id" @drop="drop($event, 'line', newTreeItem)" @dragover="allowDrop($event, 'line', newTreeItem.id, newTreeItem.parentId)" @dragleave="dragLeave($event, 'line', newTreeItem.id)"></div>
          <div class="nodeTitleBox">
            <div style="display: flex">
              <div v-if="newTreeItem.type!=='rootPlan'">---</div>
              <!-- 级别 -->
              <div class="nodeTitle"
                   v-bind:class="newTreeItem.type"
                   :id="'title_' + newTreeItem.id"
                   @drop="drop($event, 'title', newTreeItem)"
                   @dragover="allowDrop($event, 'title', newTreeItem.id)"
                   @dragleave="dragLeave($event, 'title', newTreeItem.id)">{{newTreeItem.name}}
              </div>
            </div>
            <div class="nodeDateTime">{{newTreeItem.start}} 至 {{newTreeItem.finish}}</div>
          </div>
          <component v-show="newTreeItem.children.length>0"
                     v-bind:is="compArr.NewTree"
                     :nextId="newTreeItem.id"
                     v-bind:treeNodeLevel="treeNodeLevel + 1"
                     v-bind:newTreeList="newTreeItem.children"></component>
        </div>
      </div>
    </div>
    <!---->
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
  props: ['newTreeList', 'nextId', 'treeNodeLevel'],
  data () {
    return {
      msg: '',
      timeDialogVisible: false,
      compArr: {
        NewTree: 'NewTree'
      },
      treeLevel: 0,
      currentDraggedData: {}
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
      // this.log('newTreeList001:', val)
      if (val) {
        // this.log('newTreeList:', val)
      }
    }
  },
  computed: {
    // queryDragResetDate: function () {
    //   var that = this
    //   this.log(123456789)
    //   if (this.$store.state.dragResetDate) {
    //     var start = this.$store.state.resetDragStart
    //     var finish = this.$store.state.resetDragFinish
    //     this.updateTree(that.currentDraggedData.draggedNodeId, that.currentDraggedData.parentNodeId, that.currentDraggedData.insertIndex, start, finish)
    //   }
    //   return true
    // }
  },
  methods: {
    onevent: function () {
      this.log(1111)
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
    },
    dragLeave: function (e, pos, id) {
      var obj = e.currentTarget
      if (pos === 'line') {
        // this.log('leave')
        $('#line_' + id).removeClass('active')
      } else if (pos === 'title') {
        $(obj).removeClass('active')
      }
    },
    allowDrop: function (ev, pos, id, parentId) {
      var obj = ev.currentTarget
      if (pos === 'title') {
        if ((id.substr(0, 1) === 'P') || (id.substr(0, 1) === 'J' && this.$store.state.dragedElementId.substr(0, 1) === 'J')) {
          $(obj).addClass('active')
          ev.preventDefault()
        }
      } else if (pos === 'line') {
        if ((parentId.substr(0, 1) === 'P') || (parentId.substr(0, 1) === 'J' && this.$store.state.dragedElementId.substr(0, 1) === 'J')) {
          ev.preventDefault()
          $('#line_' + id).addClass('active')
        }
      }
    },
    drop: function (ev, pos, newTreeItem) {
      var that = this
      ev.preventDefault()
      var obj = ev.currentTarget
      var data = ev.dataTransfer.getData('Text')
      var targetStart = ev.dataTransfer.getData('start')
      var targetFinish = ev.dataTransfer.getData('finish')
      this.log('data:', data)
      this.log('startDate:', targetStart)
      this.log('finishDate:', targetFinish)
      $('.nodeTitle').removeClass('active')
      $('.insertLine').removeClass('active')
      if (pos === 'title') {
        $(obj).removeClass('active')
        $(obj).parent().parent().siblings('.NewTreeBox').css('display', 'block')
        // document.getElementById('parent_' + id).appendChild(parNode)
        $('#parent_' + newTreeItem.id).prepend($('#' + data))
        if (that.checkDateTime(newTreeItem.start, newTreeItem.finish, targetStart, targetFinish)) {
          this.updateTree(data, newTreeItem.id, 1)
        } else {
          that.$store.state.currentDraggedData = {
            draggedNodeId: data,
            parentNodeId: newTreeItem.id,
            insertIndex: 1
          }
        }
      } else if (pos === 'line') {
        $(obj).parent().siblings('.NewTreeBox').css('display', 'block')
        $('#' + data).insertBefore($('#' + newTreeItem.id))
        if (that.checkDateTime(newTreeItem.start, newTreeItem.finish, targetStart, targetFinish)) {
          this.updateTree(data, newTreeItem.parentId, $(obj).parent().parent('.node').index())
        } else {
          that.$store.state.currentDraggedData = {
            draggedNodeId: data,
            parentNodeId: newTreeItem.parentId,
            insertIndex: $(obj).parent().parent('.node').index()
          }
        }
      }
    },
    checkDateTime: function (parentStart, parentFinish, targetStart, targetFinish) {
      var that = this
      var parentStartStamp = new Date(parentStart).getTime()
      var parentFinishStamp = new Date(parentFinish).getTime()
      var targetStartStamp = new Date(targetStart).getTime()
      var targetFinishStamp = new Date(targetFinish).getTime()
      if (targetStartStamp >= parentStartStamp && targetFinishStamp <= parentFinishStamp) {
        this.log('时间合法')
        return true
      } else {
        this.log('时间冲突')
        that.$confirm('点击"确定"以继续，点击"取消"还原操作', '所拖动节点与当前父级节点时间范围冲突', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.$store.state.defaultParentStart = parentStart
          that.$store.state.defaultParentFinish = parentFinish
          that.$store.state.timeDialogVisible = true
          // return true
        }).catch(() => {
          // 通知父组件刷新
          that.$store.state.nodeDragRefresh = true
        })
        return false
      }
    },
    updateTree: function (targetId, parentId, nodeIndex, start, finish) {
      var that = this
      that.ajax('/myProject/moveStructure', {id: targetId, parentId: parentId, sortCode: nodeIndex, startTime: start, endTime: finish}).then(res => {
        that.log('moveStructure:', res)
      })
    },
    dragstart: function (ev, nodeItem) {
      ev.stopPropagation()
      this.log('nodeItem:dragstart:', nodeItem)
      var obj = ev.currentTarget
      ev.dataTransfer.setData('Text', ev.target.id)
      if (nodeItem) {
        this.log(1111111)
        ev.dataTransfer.setData('start', nodeItem.start)
        ev.dataTransfer.setData('finish', nodeItem.finish)
      }
      this.$store.state.dragedElementId = ev.target.id
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
    flex-grow: 1;
  }
  .node .NewTree{
    margin-left: 50px;
  }
  .nodeTitleBox{
    display: flex;
    justify-content: space-between;
    _margin-bottom: 10px;
  }
  .nodeTitleBox:hover{
    background: rgba(58,142,230,0.1);
  }
  .nodeDateTime{
    padding-top: 5px;
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
    max-width: 240px;
    box-sizing: border-box;
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
