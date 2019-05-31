<template>
  <div id="app">
    <div>{{getNavActive?'':''}}</div>
    <el-container>
      <el-header class="elHeader" style="padding: 0;">
        <div class="header">
          <div @click="tttest()">贝豪实业项目管理中心</div>
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
                  :default-active="getNavActive"
                  :collapse-transition="false"
                  :collapse="isCollapse"
                  class="el-menu-vertical-demo"
                  @select="generalSelect"
                  background-color="#2f64a5"
                  text-color="#fff"
                  active-text-color="#ffd04b">
                  <!--侧边栏-->
                  <div v-for="(navItem, index) in navList" v-bind:key="index">
                    <!--:index="'group_' + index"-->
                    <el-submenu v-if="navItem.dataList.length > 0" :index="navItem.menuId.toString()">
                      <template slot="title">
                        <Icon style="color: #ddd" size="18" :type="navItem.icon" />
                        <span>{{navItem.menuName}}</span>
                      </template>
                      <el-menu-item-group>
                        <!--:index="'group_' + index + '_' + index1"-->
                        <el-menu-item v-for="(nameItemChild, index1) in navItem.dataList" :index="nameItemChild.menuId.toString()" v-bind:key="index1" @click="toNavDetail(nameItemChild)" v-bind:title="nameItemChild.menuName">{{nameItemChild.menuName}}</el-menu-item>
                      </el-menu-item-group>
                    </el-submenu>
                    <!--:index="'general_' + index"-->
                    <el-menu-item v-if="navItem.dataList.length === 0" :index="navItem.menuId.toString()" @click="toNavDetail(navItem)">
                      <Icon size="18" :type="navItem.icon" />
                      <span slot="title">{{navItem.menuName}}</span>
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
      version: '',
      navActive: ''
    }
  },
  created: function () {
    this.getPmsVersion()
    this.queryMenu()
  },
  watch: {
  },
  computed: {
    getNavActive: function () {
      return this.$store.state.navActive
    }
  },
  methods: {
    tttest: function () {
      this.navActive = '3'
    },
    toNavDetail: function (navData) {
      var that = this
      that.log('navData:', navData)
      if (navData.navType === '集团战略') {
        this.$store.state.proId = navData.menuId
      }
      this.$store.state.menuId = navData.menuId
      that.$router.push('/' + navData.path)
    },
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
    NavItemSet: function (navData, pathType, navType, navPath) {
      if (pathType === 'singlePath') {
        for (var i = 0; i < navData.length; i++) {
          navData[i].path = navPath
          navData[i].navType = navType
        }
        return navData
      } else {
        for (var r = 0; r < navData.length; r++) {
          if (navType === '商品管理') {
            switch (navData[r].menuName) {
              case '研发管理':
                navData[r].path = 'GoodsManage'
                break
              case '档案管理':
                navData[r].path = 'GoodsArchives'
                break
              case '产品小组':
                navData[r].path = 'GroupAdmin'
                break
              default:
                // h
            }
          }
        }
        return navData
      }
    },
    // 查询侧边栏
    queryMenu: function () {
      var that = this
      // auth/getMenuList
      this.ajax('/auth/getMenuList', {}).then(res => {
        // this.ajax('/myTask/getProjectList', {}).then(res => {
        this.log('请求侧边栏:', res)
        if (res.code === 200) {
          for (var i = 0; i < res.data.length; i++) {
            // 设置图标
            switch (res.data[i].menuName) {
              case '集团战略':
                res.data[i].icon = 'ios-ribbon-outline'
                res.data[i].dataList = that.NavItemSet(res.data[i].dataList, 'singlePath', '集团战略', 'goodsDetail')
                break
              case '商品管理':
                res.data[i].icon = 'md-cart'
                res.data[i].dataList = that.NavItemSet(res.data[i].dataList, 'mix', '商品管理', '')
                break
              case '我的动态':
                res.data[i].icon = 'md-chatboxes'
                res.data[i].path = 'MyDepNew'
                break
              case '我的日程':
                res.data[i].icon = 'ios-calendar'
                res.data[i].path = 'Schedule'
                break
              case '我的项目':
                res.data[i].icon = 'ios-paper'
                res.data[i].path = 'MyPro'
                break
              case '我的任务':
                res.data[i].icon = 'md-analytics'
                res.data[i].path = 'MyTaskNew'
                break
              case '问题反馈':
                res.data[i].icon = 'md-help-circle'
                res.data[i].path = 'ProblemFeedback'
                break
              default:
                res.data[i].icon = 'md-analytics'
            }
          }
          that.navList = res.data
          that.$store.state.navList = res.data
          that.log('navList:', that.navList)
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
.unstartStyle{
  color: #ffb400;
}
.underwayStyle{
  color: #13ce66;
}
.finishStyle{
  color: #409EFF;
}
.pauseStyle{
  color: #e97474;
}
.tabbox .el-table td, .el-table th{
  padding: 10px 0;
}
</style>
