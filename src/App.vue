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
              default-active="2"
              class="el-menu-vertical-demo"
              background-color="#28558c"
              text-color="#fff"
              active-text-color="#ffd04b">
              <el-submenu index="1">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>战略项目</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="1-1">2019年公司战略执行过程管控</el-menu-item>
                  <el-menu-item index="1-2">2018年公司战略</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-menu-item index="2">
                <i class="el-icon-menu"></i>
                <span slot="title">商品管理</span>
              </el-menu-item>
              <el-menu-item index="3">
                <i class="el-icon-document"></i>
                <span slot="title">活动管理</span>
              </el-menu-item>
              <!--<el-menu-item index="4">-->
                <!--<i class="el-icon-setting"></i>-->
                <!--<span slot="title">导航四</span>-->
              <!--</el-menu-item>-->
            </el-menu>
          </el-col>
          </el-row>
        </el-aside>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'App'
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
    background-color: #28558c;
  }
.el-tree-node__content{
  height: 40px;
  border-bottom: 1px dashed #ddd;
}
.el-tree-node__expand-icon{
  font-size: 16px;
}
</style>
