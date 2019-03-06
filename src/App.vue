<template>
  <div id="app">
    <el-container>
      <el-header class="elHeader" style="padding: 0;">
        <div class="header">
          <div>贝豪实业项目管理中心</div>
        </div>
      </el-header>
      <el-container>
        <el-aside width="250px" style="min-height: 700px;background-color: #2f64a5">
          <el-row>
          <el-col :span="24">
            <el-menu
              default-active="0"
              class="el-menu-vertical-demo"
              background-color="#2f64a5"
              text-color="#fff"
              active-text-color="#ffd04b">
              <!--侧边栏 集团战略-->
              <el-submenu v-for="(name, index) in slideMenuGroup" :index="JSON.stringify(index)" v-bind:key="index">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>{{name.projectType}}</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item v-for="(nameItem, index1) in name.projectList" :index="nameItem.projectUID" v-bind:key="index1" @click="getProjectDetail(nameItem.projectUID, 1,name.projectType, nameItem.projectName)" v-bind:title="nameItem.projectName">{{nameItem.projectName}}</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <!--侧边栏 非集团战略-->
              <el-menu-item v-for="(name, index2) in slideMenu" :index="JSON.stringify(index2)" v-bind:key="name.projectType + '-' + index2" @click="toMenu(name.projectType)">
                <i class="el-icon-menu"></i>
                <span slot="title">{{name.projectType}}</span>
              </el-menu-item>
            </el-menu>
          </el-col>
          </el-row>
        </el-aside>
        <el-main style="padding: 0 20px;">
          <router-view/>
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
      isCollapse: true,
      // 侧边栏 集团战略
      slideMenuGroup: [],
      // 非集团战略的侧边栏
      slideMenu: [],
      proId: '',
      nav: 1
    }
  },
  created: function () {
    this.queryMenu()
  },
  methods: {
    toMenu: function (menuName) {
      var that = this
      this.log('menuName:', menuName)
      switch (menuName) {
        case '商品管理':
          that.$router.push('/MyPro2')
          break
        case '我的项目':
          that.$router.push('/MyPro')
          break
        case '我的日程':
          that.$router.push('/Schedule')
          break
        case '我的动态':
          that.$router.push('/MyDep')
          break
        case '我的任务':
          that.$router.push('/MyTask')
          break
        default:
          this.log('未找到')
      }
    },
    // 查询侧边栏
    queryMenu: function () {
      var that = this
      this.ajax('/myTask/getProjectList', {}).then(res => {
        this.log('请求侧边栏:', res)
        if (res.code === 200) {
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].projectType === '集团战略') {
              that.slideMenuGroup.push(res.data[i])
            } else {
              that.slideMenu.push(res.data[i])
            }
          }
          if (that.slideMenuGroup.length > 0) {
            that.getProjectDetail(that.slideMenuGroup[0].projectList[0].projectUID, '1', '集团战略')
          } else {
            // that.getProjectDetail(that.slideMenu[0].projectUID, '2', '', that.slideMenu[0].projectType)
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
        } else if (proName === '我的动态') {
          this.$router.push('/MyDep')
        } else if (proName === '我的任务') {
          this.$router.push('/MyTask')
        } else if (proName === '我的项目') {
          this.$router.push('/MyPro')
        } else if (proName === '商品管理') {
          this.$router.push('/MyPro2')
        }
      }
    }
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
.ProEdit .el-tree-node{
  height: 40px;
  padding: 10px 0;
  border-bottom: 1px dashed #f1f1f1;
}
#app{
  height: 100%;
}
.el-container{
  height: 100%;
}
.el-main{
  /*padding: 0 20px;*/
}
.el-breadcrumb__item{
  margin-top: 10px;
}
.MyDep .submitBtn .el-button--primary{
padding: 8px 20px;
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
  .searchItem .el-input__inner{
    height: 30px;
    line-height: 30px;
  }
.searchItem .el-input__icon{
  line-height: 30px;
}
</style>
