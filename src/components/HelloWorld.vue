<template>
  <div class="hello">
   <div class="topperTitle">
     <div class="topCon">
       <div class="topConLf">
         <div class="title">{{proDetailMsg.projectName}}</div>
         <div class="proDetail">{{proDetailMsg.content}}</div>
       </div>
       <div class="topConRt">
         <div style="margin-left: 25%;">
           <div class="myMsg"><div><img src="../../static/img/my.png" alt=""></div><div style="margin-left: 10px;">{{proDetailMsg.projectManager}}</div></div>
           <div class="dataMsg"><div><img src="../../static/img/data.png" alt=""></div><div style="margin-left: 10px;">{{proDetailMsg.createDate}}</div></div>
         </div>
       </div>
     </div>
     <div class="planList">
       <div class="planName">项目计划</div>
       <div class="planBox">
         <div class="active" v-for="plan in planList" v-bind:key="plan.id" @click="selectProject($event)">{{plan.name}}</div>
         <div v-for="task in taskList" v-bind:key="task.uid" @click="selectProject($event)">{{task.jobName}}</div>
       </div>
     </div>
   </div>
    <div class="devide">
      <div>项目详情</div>
    </div>
    <div class="block">
      <el-tree
        :data="data5"
        node-key="id"
        default-expand-all
        @node-expand="getNodeMsg($event)"
        :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span class="proMsg">
          <span class="treeName">
            <span style="float: left"><img style="width: 16px;" src="../../static/img/my.png" alt=""></span>
            <span style="float: left;margin-left: 16px;">姜海川</span>
          </span>
          <span class="treeTime">
            <span style="float: left"><img style="width: 16px;" src="../../static/img/data.png" alt=""></span>
            <span style="float: left;margin-left: 16px;">{{data.date}}</span>
          </span>
        </span>
      </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: ['proId'],
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      proDetailMsg: '',
      taskList: [],
      planList: [],
      data5: [{
        id: 1,
        label: '一级 1',
        date: '2019-01-20',
        children: [{
          id: 4,
          label: '二级 1-1',
          date: '2019-01-20'
        }]
      }, {
        id: 2,
        label: '一级 2',
        date: '2019-01-25',
        children: [{
          id: 5,
          label: '二级 2-1',
          date: '2019-01-12'
        }, {
          id: 6,
          label: '二级 2-2',
          date: '2019-01-19'
        }]
      }, {
        id: 3,
        label: '一级 3',
        date: '2019-01-19',
        children: [{
          id: 7,
          label: '二级 3-1',
          date: '2019-01-10'
        }, {
          id: 8,
          label: '二级 3-2',
          date: '2019-01-08'
        }]
      }]
    }
  },
  created: function () {
    this.getProjectDetail()
  },
  watch: {
    proId: function (val, oVal) {
      console.log('val', val)
      this.getProjectDetail()
    }
  },
  methods: {
    selectProject: function (e) {
      var obj = e.currentTarget
      console.log(obj)
      $(obj).addClass('active').siblings().removeClass('active')
    },
    getNodeMsg: function (e) {
      console.log(e)
    },
    getProjectDetail: function () {
      var that = this
      console.log('proid', that.proId)
      that.ajax('/leader/getPlanOrTaskByProjectId', {projectUID: that.proId}).then(res => {
        if (res.code === 200) {
          console.log('getPlanOrTaskByProjectId', res)
          that.proDetailMsg = res.data.projectDetail
          that.taskList = res.data.jobList
          that.planList = res.data.planList
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.topCon{
  display: flex;
  justify-content: space-between;
}
.topConLf{
  width: 75%;
}
  .title{
    height: 30px;
    color: chocolate;
    font-size: 18px;
    font-family: '黑体';
    font-weight: bold;
  }
  .proDetail{
    font-size: 14px;
    color: #666;
    text-indent: 2em;
  }
  .topConRt{
    width: 25%;
  }
  .myMsg,.dataMsg{
    color: #888;
    display: flex;
    font-size: 15px;
    justify-content: start;
    line-height: 25px;
  }
  .planName{
    width: 20px;
    font-size: 14px;
    color: #fff;
    float: left;
    padding: 10px 2px;
    text-align: center;
    background-color: #3ca00b;
    border-radius: 6px;
  }
  .planList{
    width: 96%;
    display: flex;
    margin-top: 30px;
  }
  .planBox{
    width: 98%;
    float: left;
  }
.planBox div{
  padding: 4px 20px;
  float: left;
  border-radius: 4px;
  background-color: #ebeef5;
  margin-left: 25px;
  margin-top: 15px;
  color: #777;
  font-size: 15px;
}
  .devide{
    height: 40px;
    clear: both;
    line-height: 40px;
    padding: 0 10px;
    font-size: 16px;
    color: #999;
    margin-top: 20px;
    background-color: #f5f5f5;
  }
.custom-tree-node {
  flex: 1;
  align-items: center;
  font-size: 14px;
  padding-right: 8px;
}
.treeName{
  float: left;
}
.treeTime{
  float: right;
}
  .proMsg{
    width: 500px;
    float: right;
  }
.planBox .active{
    color: #fff;
    background-color: #409EFF;
  }
</style>
