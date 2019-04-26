<template>
  <div class="NewTreeBox" style="position: relative; display: block !important;">
    <div class="editKK" v-if="treeNodeLevel===0">
      <span style="margin-right: 10px;">{{onOffStatusT===1?statusMsg:''}}</span>
      <span>{{leftTimeText}}</span>
      <Button class="editKKBtn" :disabled="editBtnDis" @click="setEditKK">{{editKKBtnText}}</Button>
      <Icon size="24" style="color: #3a8ee6" type="ios-refresh" @click="queryEditKKState" />
      <!--<Icon size="24" style="color: #3a8ee6" type="ios-refresh-circle" @click="queryEditKKState2" />-->
      <!--<Icon size="24" style="color: #3a8ee6" type="ios-refresh-circle-outline" @click="clearAllInterval" />-->
    </div>
    <!--{{queryDragResetDate?'':''}}-->
    <!--<div class="jiajian" v-if="treeNodeLevel!==0" @click="jiajianClick($event)"><span class="open">-</span></div>-->
    <div class="jiajian" v-if="treeNodeLevel!==0" @click="jiajianClick($event)"><Icon class="open" type="ios-add-circle-outline" /></div>
    <div class="NewTree" v-bind:id="'parent_' + (newTreeList && newTreeList[0] && newTreeList[0].parentId?newTreeList[0].parentId: nextId)">
      <div class="node" v-for="newTreeItem in newTreeList" :key="newTreeItem.id" :id="newTreeItem.id" :draggable="onOffStatusT===2" @dragstart="dragstart($event, newTreeItem)">
        <div class="lineLeft" v-if="newTreeItem.type!=='rootPlan'"></div>
        <div class="nodeCnt">
          <div class="insertLine" :id="'line_' + newTreeItem.id">
            <div class="insertLineCnt"></div>
            <div class="arrowLeft"></div>
          </div>
          <div class="insertLineCover" :id="'line_cover' + newTreeItem.id" @drop="drop($event, 'line', newTreeItem)" @dragover="allowDrop($event, 'line', newTreeItem.id, newTreeItem.parentId)" @dragleave="dragLeave($event, 'line', newTreeItem.id)"></div>
          <div class="nodeTitleBox" v-on:click="huoquTest($event)">
            <div style="display: flex">
              <div v-if="newTreeItem.type!=='rootPlan'"><div style="border-bottom: 1px solid #ccc; width: 20px; height: 12px;"></div></div>
              <!-- 级别 -->
              <div class="nodeTitle"
                   v-bind:class="newTreeItem.type"
                   :id="'title_' + newTreeItem.id"
                   @drop="drop($event, 'title', newTreeItem)"
                   @dragover="allowDrop($event, 'title', newTreeItem.id)"
                   @dragleave="dragLeave($event, 'title', newTreeItem.id)">{{newTreeItem.name}}
              </div>
            </div>
            <!--<div class="nodeDateTime" v-if="treeNodeLevel!==0">{{newTreeItem.start}} 至 {{newTreeItem.finish}}</div>-->
            <div class="nodeDateTime" v-if="treeNodeLevel!==0">
              <el-date-picker
                v-model="newTreeItem.start"
                type="datetime"
                :clearable="false"
                :readonly="onOffStatusT!==2"
                value-format="yyyy-MM-dd HH:mm:ss"
                @focus="dragDateEditFocus($event, newTreeItem)"
                @change="startChange($event, newTreeItem, 'start')"
                :picker-options="DragDateEditOption"
                placeholder="选择日期时间">
              </el-date-picker>至
              <el-date-picker
                v-model="newTreeItem.finish"
                type="datetime"
                :clearable="false"
                :readonly="onOffStatusT!==2"
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="startChange($event, newTreeItem, 'finish')"
                placeholder="选择日期时间">
              </el-date-picker>
            </div>
          </div>
          <component v-show="newTreeItem.children.length>0"
                     v-bind:is="compArr.NewTree"
                     v-bind:nextId="newTreeItem.id"
                     v-bind:proId="proId"
                     v-bind:onOffStatusT="onOffStatusT"
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
  props: ['proId', 'newTreeList', 'nextId', 'treeNodeLevel', 'DrawerOpen', 'onOffStatusT'],
  data () {
    return {
      msg: '',
      statusMsg: '',
      leftTimeText: '',
      editBtnDis: false,
      editKKBtnText: '编辑',
      onOffStatus: 0,
      timeDialogVisible: false,
      compArr: {
        NewTree: 'NewTree'
      },
      treeLevel: 0,
      currentDraggedData: {},
      newTreeItemstart: '2019-01-01 10:10:10',
      DragDateEditOption: {
        disabledDate: function (currentDateTime) {
          return false
        }
      }
    }
  },
  created () {
    this.$store.state.treeLevel = this.$store.state.treeLevel + 1
    this.treeLevel = this.$store.state.treeLevel
    // this.log('男儿当自强：', this.TreeJsonData)
    // this.queryProDetail()
    // this.log('created:', this.treeNodeLevel)
  },
  watch: {
    onOffStatusT (val, old) {
      this.log('onOffStatusT:', val)
    },
    DrawerOpen (val, old) {
      if (val) {
        this.queryEditKKState()
      }
    },
    newTreeList (val, old) {
      // this.log('newTreeList001:', val)
      if (val) {
        // this.log('newTreeList2222222222222:')
      }
    },
    treeNodeLevel (val, old) {
      if (val) {
        // this.log('treeNodeLevel:111111111111111')
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
    clearAllInterval: function () {
      // var that = this
      for (var i = 0; i < 100; i++) {
        // that.log(i)
        window.setClockNum = null
        window.clearInterval(i)
      }
    },
    setClock: function (seconds) {
      var that = this
      // seconds = 125
      if (window.setClockNum) {
        this.log('setclock:', window.setClockNum)
      } else {
        window.leftTime = seconds
        window.setClockNum = window.setInterval(function () {
          // that.log(123)
          var mo = 0
          if (window.leftTime > 60) {
            window.leftTime = window.leftTime - 60
            mo = Math.ceil(window.leftTime / 60)
            that.leftTimeText = '剩余' + mo + '分钟'
          } else {
            that.leftTimeText = ''
            window.clearInterval(window.setClockNum)
            window.setClockNum = null
            that.queryEditKKState()
          }
        }, 60000)
        // this.log('window.setClockNum:', window.setClockNum)
      }
    },
    queryEditKKState2: function () {
      // var that = this
      // this.log('window.setClockNum:', window.setClockNum)
      // that.ajax('/myProject/getOnOffStatus', {projectId: that.proId}).then(res => {
      //   that.log('查看剩余:', res.data.second / 60)
      // })
    },
    queryEditKKState: function () {
      var that = this
      that.ajax('/myProject/getOnOffStatus', {projectId: that.proId}).then(res => {
        // that.log('88888888:', res)
        that.log('查询开关状态:', res.data.second / 60)
        if (res.code === 200) {
          that.onOffStatus = res.data.onOffStatus
          that.statusMsg = res.data.statusMsg
          // that.lefttime = 600 second
          // that.setClock(600)
          this.$emit('onOffStatusEmit', res.data.onOffStatus)
          if (res.data.onOffStatus === 0) {
            that.editBtnDis = false
            that.editKKBtnText = '编辑'
          } else if (res.data.onOffStatus === 1) {
            that.editBtnDis = true
            that.editKKBtnText = '编辑'
          } else if (res.data.onOffStatus === 2) {
            if (res.data.second > 60) {
              var mo = Math.ceil(res.data.second / 60)
              that.leftTimeText = '剩余' + mo + '分钟'
            } else if (res.data.second > 0 && res.data.second <= 60) {
              that.leftTimeText = '剩余' + res.data.second + '秒'
            } else {
              this.log('5555555555555')
              that.leftTimeText = ''
              window.clearInterval(window.setClockNum)
              window.setClockNum = null
              that.queryEditKKState()
            }
            that.setClock(res.data.second)
            that.editBtnDis = false
            that.editKKBtnText = '结束'
          }
        }
        // that.$store.state.nodeDragRefresh = true
      })
    },
    setEditKK: function () {
      var that = this
      var editstatus = false
      if (that.onOffStatus === 0) {
        // 打开
        editstatus = true
      } else if (that.onOffStatus === 2) {
        // 关闭
        that.leftTimeText = ''
        window.clearInterval(window.setClockNum)
        window.setClockNum = null
        that.clearAllInterval()
        editstatus = false
      } else {
        editstatus = false
      }
      that.ajax('/myProject/onOffMove', {status: editstatus, projectId: that.proId}).then(res => {
        // that.log('88888888:', res)
        that.log('设置开关状态:', res)
        if (res.code === 200) {
          this.queryEditKKState()
        }
        // that.$store.state.nodeDragRefresh = true
      })
    },
    huoquTest: function (e) {
      // this.log(111222333)
      var obj = e.currentTarget
      this.log($(obj).parent().parent().index())
      this.$store.state.currentNodeIndex = $(obj).parent().parent().index()
      // this.log('lalala:', $(obj).parent().parent().index())
    },
    dragDateEditFocus: function (ev, newTreeItem) {
      var that = this
      setTimeout(function () {
        that.$store.commit('setDateOption', {OptionObj: that.DragDateEditOption, startDate: newTreeItem.parentStartTime, endDate: newTreeItem.parentFinishTime})
      }, 1000)
    },
    onevent: function () {
      this.log(1111)
    },
    jiajianClick: function (e) {
      // this.log(11111111111)
      var obj = e.currentTarget
      if ($(obj).children().eq(0).hasClass('open')) {
        $(obj).children().eq(0).removeClass('open').addClass('close')
        $(obj).siblings('.NewTree').css('height', 15 + 'px')
        // $(obj).children().eq(0).text('+')
      } else {
        $(obj).children().eq(0).removeClass('close').addClass('open')
        $(obj).siblings('.NewTree').css('height', 'auto')
        // $(obj).children().eq(0).text('-')
      }
    },
    jiajianClick2: function (e) {
      // this.log(11111111111)
      var obj = e.currentTarget
      if ($(obj).hasClass('open')) {
        $(obj).removeClass('open').addClass('close')
        $(obj).parent().siblings('.NewTree').css('height', 14 + 'px')
        // $(obj).children().eq(0).text('+')
      } else {
        $(obj).removeClass('close').addClass('open')
        $(obj).parent().siblings('.NewTree').css('height', 'auto')
        // $(obj).children().eq(0).text('-')
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
      if ($('#title_' + id).parents('#parent_' + this.$store.state.dragedElementId).length > 0) {
        // 不可以将父级拖放为子级的子级
      } else {
        // this.log('11111111111')
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
        if (data !== newTreeItem.id) {
          $(obj).removeClass('active')
          $(obj).parent().parent().siblings('.NewTreeBox').css('display', 'block')
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
        // this.log('时间合法')
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
      that.ajax('/myProject/moveStructure', {id: targetId, parentId: parentId, sortCode: nodeIndex, startTime: start, endTime: finish, projectId: that.proId}).then(res => {
        // that.log('88888888:', res)
        that.$store.state.nodeDragRefresh = true
      })
    },
    dragstart: function (ev, nodeItem) {
      ev.stopPropagation()
      // this.log('targetId:', ev.target.id)
      var obj = ev.currentTarget
      ev.dataTransfer.setData('Text', ev.target.id)
      if (nodeItem) {
        ev.dataTransfer.setData('start', nodeItem.start)
        ev.dataTransfer.setData('finish', nodeItem.finish)
      }
      this.$store.state.dragedElementId = ev.target.id
      $(obj).removeClass('active')
    },
    startChange: function (timestr, newTreeItem, type) {
      var that = this
      this.$confirm('点击"确定"以继续，点击"取消"还原操作', '此次编辑会同步更新节点下所有子级时间', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (type === 'start') {
          that.updateTree(newTreeItem.id, newTreeItem.parentId, that.$store.state.currentNodeIndex + 1, timestr, newTreeItem.finish)
        } else {
          that.updateTree(newTreeItem.id, newTreeItem.parentId, that.$store.state.currentNodeIndex + 1, newTreeItem.start, timestr)
        }
      }).catch(() => {
        // 通知父组件刷新
        that.$store.state.nodeDragRefresh = true
      })
    }
  }
}
</script>

<style scoped>
  .jiajian{
    position: absolute;
    left: 44px;
    top: 1px;
    font-size: 15px;
    width: 16px;
    height: 14px;
    color: #ccc;
    z-index: 999;
    /*border: 1px solid #ccc;*/
    /*border-radius: 8px;*/
    background-color: #fff;
  }
  .jiajian:hover{
    cursor: default ;
    color: #aaa;
    /*border: 1px solid #aaa;*/
  }
  .jiajian i{
    position: absolute;
    left: 0px;
    top: 0px;
  }
  .jiajian i.open:before{
    content: "\F290";
  }
  .jiajian i.close:before{
    content: "\F100";
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
    height: 32px;
  }
  .nodeCnt{
    position: relative;
    padding-top: 20px;
    flex-grow: 1;
    margin-left: -1px;
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
    padding-top: 3px;
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
    min-width: 50px;
    color: #666;
    max-width: 240px;
    box-sizing: border-box;
    position: relative;
    cursor: default;
    border: 2px solid #3a8ee6;
    border-radius: 4px;
    padding: 2px 5px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
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
    border: 2px solid #4fc08d;
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
  .el-input--suffix .el-input__inner{
    padding-right: 0;
  }
  .editKK{
    position: fixed;
    right: 20px;
    top: 10px;
  }
</style>
