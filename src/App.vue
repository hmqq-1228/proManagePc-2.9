<template>
  <div id="app">
    <el-container>
      <el-header class="elHeader" style="padding: 0;">
        <div class="header">
          <div>贝豪实业项目管理中心</div>
        </div>
      </el-header>
      <el-container>
        <el-aside class="asideBox" v-bind:style="{width: asideWidth, height: '100%', backgroundColor: '#2f64a5'}">
          <div class="collapseBtnBox" v-on:click="collapseBtnClick">
            <div style="position: absolute; top: 45%;">
              <i v-if="!isCollapse" class="el-icon-d-arrow-left" />
              <i v-if="isCollapse" class="el-icon-d-arrow-right" />
            </div>
          </div>
          <div class="hhhhhh" style="height: 100%; overflow: hidden;">
            <el-row :style="{paddingRright: '10px', height: '100%', width: Width, overflowY: scrollY}">
              <el-col>
                <el-menu
                  :collapse-transition="false"
                  :collapse="isCollapse"
                  class="el-menu-vertical-demo"
                  @select="generalSelect"
                  background-color="#2f64a5"
                  text-color="#fff"
                  active-text-color="#ffd04b">
                  <!--侧边栏 集团战略-->
                  <div v-for="(name, index) in navList" :index="'group_' + index" v-bind:key="index">
                    <el-submenu v-if="name.dataList.length > 0">
                      <template slot="title">
                        <Icon style="color: #ddd" size="18" type="ios-ribbon-outline" />
                        <span>{{name.menuName}}</span>
                      </template>
                      <el-menu-item-group>
                        <el-menu-item v-for="(nameItem, index1) in name.dataList" :index="'group_' + index + '_' + index1" v-bind:key="index1" v-bind:title="nameItem.menuName">{{nameItem.menuName}}</el-menu-item>
                      </el-menu-item-group>
                    </el-submenu>
                    <el-menu-item v-if="name.dataList.length === 0">
                      <Icon size="18" :type="name.icon" />
                      <span slot="title">{{name.menuName}}</span>
                    </el-menu-item>
                  </div>
                </el-menu>
              </el-col>
            </el-row>
          </div>
        </el-aside>
        <el-main style="padding: 0 20px;">
          <router-view style="min-height: 800px; padding-top: 20px;"/>
          <div class="copyright">贝豪项目管理系统（PMS ©2019 Version-{{version}}）版权所有 翻版必究</div>
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
      isCollapse: false,
      asideWidth: '250px',
      Width: '270px',
      scrollY: 'auto',
      navList: [],
      version: ''
    }
  },
  created: function () {
    this.getPmsVersion()
    this.queryMenu()
  },
  watch: {
  },
  computed: {
  },
  methods: {
    getPmsVersion: function () {
      var that = this
      that.ajax('/myProject/getVersion', {}).then(res => {
        if (res.code === 200) {
          that.version = res.data
        }
      })
    },
    collapseBtnClick: function () {
      this.isCollapse = !this.isCollapse
      if (!this.isCollapse) {
        this.asideWidth = '250px'
        this.Width = '270px'
        this.scrollY = 'auto'
      } else {
        this.asideWidth = 'auto'
        this.Width = 'auto'
        this.scrollY = 'visible'
      }
    },
    generalSelect: function (menu) {
    },
    // 查询侧边栏
    queryMenu: function () {
      var that = this
      // auth/getMenuList
      this.ajax('/auth/getMenuList', {}).then(res => {
        // this.ajax('/myTask/getProjectList', {}).then(res => {
        this.log('请求侧边栏:', res)
        if (res.code === 200) {
          that.slideMenuGroup = []
          that.slideMenuGroup2 = []
          that.slideMenu = []
          for (var i = 0; i < res.data.length; i++) {
            // 设置图标
            switch (res.data[i].menuName) {
              // case '集团战略':
              //   res.data[i].icon = 'ios-ribbon-outline'
              //   break
              case '商品管理':
                res.data[i].icon = 'md-cart'
                break
              case '商品档案':
                res.data[i].icon = 'ios-create'
                break
              case '我的动态':
                res.data[i].icon = 'md-chatboxes'
                break
              case '我的日程':
                res.data[i].icon = 'ios-calendar'
                break
              case '我的项目':
                res.data[i].icon = 'ios-paper'
                break
              case '我的任务':
                res.data[i].icon = 'md-analytics'
                break
              case '问题反馈':
                res.data[i].icon = 'md-help-circle'
                break
              default:
                res.data[i].icon = 'md-analytics'
            }
            if (res.data[i].menuName === '集团战略') {
              res.data[i].icon = ''
            }
          }
          that.navList = res.data
        }
      })
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
#app{
  height: 100%;
}
.el-aside {
  overflow: visible !important;
}
.goodsDetail .el-tabs__content {
  overflow: visible !important;
}
.copyright{
  padding: 15px;
  padding-top: 20px;
  text-align: center;
  font-size: 12px;
  color: #aaa;
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
  .LoginInfo .LoginWellcome{
    font-size: 14px;
    font-weight: normal;
  }
  .LoginInfo .LoginUserName{
    font-weight: normal;
    font-size: 16px;
  }
  .asideBox{
    transition: width 2s;
    position: relative;
  }
  .asideBox:hover .collapseBtnBox{
    display: block;
  }
  .collapseBtnBox{
    color: #fff;
    font-size: 16px;
    width: 20px;
    height: 100%;
    background: rgba(255,255,255,0.2);
    position: absolute;
    right: 0;
    top: 0;
    padding-top: 50%;
    z-index: 999;
    display: none;
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
  .searchItem .el-input__inner, .proBelong .el-input__inner{
    height: 30px;
    line-height: 30px;
  }
.proBelong .el-select .el-input .el-select__caret{
  height: 30px;
  line-height: 30px;
}
.searchItem .el-input__icon{
  line-height: 30px;
}
.goodSer .el-input__inner{
  height: 34px;
  line-height: 34px;
}
.goodSer .el-input__icon{
  line-height: 34px;
}
.line .el-radio-button--mini .el-radio-button__inner{
  padding: 5px 10px;
}
  .goods .el-pagination.is-background .el-pager li:not(.disabled).active,.GoodsArchives .el-pagination.is-background .el-pager li:not(.disabled).active{
    background-color: #34c5be;
  }
  .goods .el-radio-button__orig-radio:checked+.el-radio-button__inner,.GoodsArchives .el-radio-button__orig-radio:checked+.el-radio-button__inner{
    background-color: #34c5be;
    border-color: #34c5be;
  }
  .goods .el-input.is-active .el-input__inner, .el-input__inner:focus,.GoodsArchives .el-input.is-active .el-input__inner, .el-input__inner:focus{
    border-color: #34c5be;
  }
  /*.goods .el-radio-button__inner:hover,.GoodsArchives .el-radio-button__inner:hover{*/
    /*color: #34c5be;*/
  /*}*/
  .contentTop .el-button{
    padding: 7px 14px;
  }
.el-menu-item-group__title{
  padding: 0;
}
  .el-menu-item i{
    color: #ddd;
  }
/*.el-container{*/
  /*display: -webkit-box;*/
/*}*/
  .Schedule .el-input--prefix .el-input__inner{
    padding-right: 0;
  }
  .goods .el-dialog__body{
    padding-top: 0;
  }
  .NewTreeBox .el-input--suffix .el-input__inner{
    padding-right: 0;
  }
  .NewTreeBox .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: 175px;
  }
  .NewTreeBox .el-input__inner{
    height: auto;
    line-height: normal;
    border: none;
    background-color: transparent;
  }
  .NewTreeBox .el-input__icon{
    line-height: normal;
  }
  .GoodsArchives .ivu-input-prefix i, .ivu-input-suffix i{
    font-size: 14px;
  }
</style>
