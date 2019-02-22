<template>
  <div id="app">
    <el-container>
      <el-header class="elHeader" style="padding: 0;">
        <div class="header">
          <div>贝豪实业项目管理中心</div>
          <!--<div style="text-align: right;font-size: 15px;font-weight: normal;cursor: pointer" @click="backToIndex()">-->
            <!--返回旧版 <i class="el-icon-d-arrow-right"></i>-->
          <!--</div>-->
        </div>
      </el-header>
      <el-container>
        <el-aside width="250px" style="min-height: 700px;background-color: #2f64a5">
          <el-row>
          <el-col :span="24">
            <el-menu
              :default-active="proId"
              class="el-menu-vertical-demo"
              background-color="#2f64a5"
              text-color="#fff"
              active-text-color="#ffd04b">
              <el-submenu v-for="(name, index) in proManageName" :index="JSON.stringify(index)" v-bind:key="index">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>{{name.projectType}}</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item v-for="(nameItem, index1) in name.projectList" :index="nameItem.projectUID" v-bind:key="index1" @click="getProjectDetail(nameItem.projectUID, 1,name.projectType, nameItem.projectName)" v-bind:title="nameItem.projectName">{{nameItem.projectName}}</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <!--<el-submenu index="2">-->
                <!--<template slot="title">-->
                  <!--<i class="el-icon-menu"></i>-->
                  <!--<span slot="title">我的日程</span>-->
                <!--</template>-->
                <!--<el-menu-item index="5" @click="linkJump()">我的日程</el-menu-item>-->
              <!--</el-submenu>-->
              <!--<el-submenu index="3">-->
                <!--<template slot="title">-->
                  <!--<i class="el-icon-document"></i>-->
                  <!--<span slot="title">活动管理</span>-->
                <!--</template>-->
              <!--</el-submenu>-->
            </el-menu>
          </el-col>
          </el-row>
        </el-aside>
        <el-main style="padding: 0 20px;">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      proManageName: '',
      proId: '',
      nav: 1
    }
  },
  created: function () {
    this.getProManageMenu()
  },
  methods: {
    getProManageMenu: function () {
      var that = this
      that.ajax('/leader/getProjectList', {}).then(res => {
        if (res.code === 200) {
          var obj = {
            projectList: [
              {projectName: '我的日程', projectUID: 's012'}
            ],
            projectType: '我的日程'
          }
          res.data.push(obj)
          that.proManageName = res.data
          if (res.data[0].projectType === '集团战略') {
            that.$store.state.proId = res.data[0].projectList[0].projectUID
          }
          that.$store.commit('setRouterName', {name: res.data[0].projectList[0].projectName, id: res.data[0].projectList[0].projectUID, type: 1})
        }
      })
    },
    getProjectDetail: function (id, n, proType, proName) {
      if (proType === '集团战略') {
        if (id) {
          this.$store.state.proId = id
          this.$store.state.navType = n
          this.$router.push('/')
        }
      } else {
        if (proName === '我的日程') {
          this.$router.push('/Schedule')
        }
      }
      // console.log('nav:2:', this.nav)
    }
    // backToIndex: function () {
    //   console.log('back')
    //   // this.$router.push('https://pms.baho.cn/pmsSys/index.html#/')
    //   window.location.href = 'https://pms.baho.cn/pmsSys/index.html#/'
    // }
  }
}
</script>

<style>
*{
  padding: 0;
  margin: 0;
}
html,body{
  width: 100%;
  height: 100%;
}
#app{
  height: 100%;
}
.el-container{
  height: 100%;
}
.el-main{
  padding: 0 20px;
}
.el-breadcrumb__item{
  margin-top: 10px;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  margin: 0 auto;
}
.el-header{
  padding: 0;
}
.elHeader{
  box-shadow: 0px 0px 10px #092d58;
  position: relative;
  z-index: 10;
}
.el-menu{
  border: none !important;
}
  .header{
    color: #fff;
    height: 60px;
    font-size: 20px;
    padding: 0 20px;
    line-height: 60px;
    text-align: left;
    font-weight: bold;
    background-color: #28558c;
    display: flex;
    justify-content: space-between;
  }
.HelloWorld .el-tree-node__content{
  height: 40px;
  border-bottom: 1px dashed #ddd;
}
.HelloWorld .el-tree-node__expand-icon{
  font-size: 16px;
}
.el-submenu .el-menu-item{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.el-collapse-item__content{
  padding-bottom: 10px;
}
.ivu-timeline-item-content{
    padding: 1px 1px 0 24px !important;
}
</style>
