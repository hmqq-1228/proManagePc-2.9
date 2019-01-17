<template>
  <div id="app">
    <el-container>
      <el-header>
        <div class="header">贝豪实业项目管理中心</div>
      </el-header>
      <el-container>
        <el-aside width="250px" style="min-height: 700px;background-color: #28558c">
          <el-row>
          <el-col :span="24">
            <el-menu
              default-active="S1243eb5eaedd4b7780ba29101ed407c6"
              class="el-menu-vertical-demo"
              background-color="#28558c"
              text-color="#fff"
              active-text-color="#ffd04b">
              <el-submenu v-for="(name, index) in proManageName" :index="JSON.stringify(index)" v-bind:key="index">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>{{name.projectType}}</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item v-for="(nameItem, index1) in name.projectList" :index="nameItem.projectUID" v-bind:key="index1" @click="getProjectDetail(nameItem.projectUID)">{{nameItem.projectName}}</el-menu-item>
                  <!--<el-menu-item index="1-2">2018年公司战略</el-menu-item>-->
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="2">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span slot="title">商品管理</span>
                </template>
              </el-submenu>
              <el-submenu index="3">
                <template slot="title">
                  <i class="el-icon-document"></i>
                  <span slot="title">活动管理</span>
                </template>
              </el-submenu>
            </el-menu>
          </el-col>
          </el-row>
        </el-aside>
        <el-main>
          <router-view :proId="proId"/>
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
      proId: 'S1243eb5eaedd4b7780ba29101ed407c6'
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
          console.log(res)
          that.proManageName = res.data
        }
      })
    },
    getProjectDetail: function (id) {
      if (id) {
        this.proId = id
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
.el-menu{
  border-right: none;
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
  }
.el-tree-node__content{
  height: 40px;
  border-bottom: 1px dashed #ddd;
}
.el-tree-node__expand-icon{
  font-size: 16px;
}
.el-submenu .el-menu-item{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
