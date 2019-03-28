<template>
  <div id="app">
    <div>{{getActiveNavIndex?'':''}}</div>
    <el-container>
      <el-header class="elHeader" style="padding: 0;">
        <div class="header">
          <div @click="testUpload">贝豪实业项目管理中心</div>
          <!--<div class="LoginInfo"><span class="LoginWellcome">欢迎你：</span><span class="LoginUserName">张三</span></div>-->
        </div>
      </el-header>
      <el-container>
        <el-aside width="250px" style="min-height: 700px;background-color: #2f64a5">
          <el-row>
          <el-col :span="24">
            <el-menu
              :default-active="activeNavIndex"
              class="el-menu-vertical-demo"
              @select="generalSelect"
              background-color="#2f64a5"
              text-color="#fff"
              active-text-color="#ffd04b">
              <!--侧边栏 集团战略-->
              <el-submenu v-for="(name, index) in slideMenuGroup" :index="'group_' + index" v-bind:key="index">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>{{name.projectType}}</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item v-for="(nameItem, index1) in name.projectList" :index="'group_' + index + '_' + index1" v-bind:key="index1" @click="getProjectDetail(nameItem.projectUID, 1,name.projectType, nameItem.projectName)" v-bind:title="nameItem.projectName">{{nameItem.projectName}}</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <!--侧边栏 非集团战略-->
              <el-menu-item v-for="(name, index2) in slideMenu" :index="'general_' + index2" v-bind:key="name.projectType + '-' + index2" @click="toMenu(name.projectType)">
                <i class="el-icon-menu"></i>
                <span slot="title">{{name.projectType}}</span>
              </el-menu-item>
            </el-menu>
          </el-col>
          </el-row>
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
      activeNavIndex: this.$store.state.activeNavIndex,
      isCollapse: true,
      // 侧边栏 集团战略
      slideMenuGroup: [],
      // 非集团战略的侧边栏
      slideMenu: [],
      proId: '',
      nav: 1,
      count: 0,
      version: ''
    }
  },
  created: function () {
    // this.log('参数：proId:', this.$route.params.proId)
    // this.$store.state.proId = this.$route.params.proId
    this.queryMenu()
    this.getPmsVersion()
    this.getUserInfo()
  },
  watch: {
    activeNavIndex (val, old) {
      // this.log('activeNavIndex:', val)
    }
  },
  computed: {
    getActiveNavIndex: function () {
      var that = this
      that.activeNavIndex = this.$store.state.activeNavIndex
      return this.$store.state.activeNavIndex
    }
    // slideMenuData: function () {
    //   var that = this
    //   // this.log()
    //   if (that.$store.state.slideMenu.length > 0) {
    //     if (window.location.href.indexOf('Schedule') > 0) {
    //       that.setActiveNavIndex('我的日程')
    //     } else if () {
    //      // j
    //     }
    //     for (var i = 0; i < that.$store.state.slideMenu.length; i++) {
    //       if (that.$store.state.slideMenu[i].projectType === '我的日程') {
    //         that.$store.state.activeNavIndex = 'general_' + i
    //         localStorage.setItem('generalMenuActive', '我的日程')
    //       }
    //     }
    //   }
    //   return this.$store.state.slideMenu
    // }
  },
  methods: {
    getUserInfo: function () {
      var that = this
      this.ajax('/myProject/getUserInfo', {}).then(res => {
        if (res.code === 200) {
          that.$store.state.userId = res.data.ID
          that.$store.state.userName = res.data.Name
          that.$store.state.userLoginInfo = res.data
          // that.defImplementer.name = res.data.Name
          // that.defImplementer.id = res.data.ID
        }
      })
    },
    setActiveNavIndex: function (typename) {
      var that = this
      for (var i = 0; i < that.$store.state.slideMenu.length; i++) {
        if (that.$store.state.slideMenu[i].projectType === typename) {
          that.$store.state.activeNavIndex = 'general_' + i
          localStorage.setItem('generalMenuActive', typename)
        }
      }
    },
    generalSelect: function (menu) {
      // this.log('generalSelect:', menu)
    },
    getPmsVersion: function () {
      var that = this
      that.ajax('/myProject/getVersion', {}).then(res => {
        if (res.code === 200) {
          that.version = res.data
        }
      })
    },
    testUpload: function () {
      this.count++
      if (this.count === 5) {
        this.$router.push('/TestUpload')
      }
    },
    toMenu: function (menuName) {
      var that = this
      // this.log('menuName:', menuName)
      switch (menuName) {
        case '商品管理':
          // localStorage.setItem('navType', '商品管理')
          localStorage.setItem('generalMenuActive', '商品管理')
          // that.$store.state.generalMenuActive = '商品管理'
          that.$router.push('/GoodsManage')
          break
        case '我的项目':
          // localStorage.setItem('generalMenuActive', '我的项目')
          localStorage.setItem('generalMenuActive', '我的项目')
          that.$router.push('/MyPro')
          break
        case '我的日程':
          localStorage.setItem('generalMenuActive', '我的日程')
          that.$router.push('/Schedule')
          break
        case '我的动态':
          localStorage.setItem('generalMenuActive', '我的动态')
          that.$router.push('/MyDepNew')
          break
        case '我的任务':
          localStorage.setItem('generalMenuActive', '我的任务')
          that.$router.push('/MyTaskNew')
          break
        default:
          this.log('未找到')
      }
    },
    // 查询侧边栏
    queryMenu: function () {
      var that = this
      this.ajax('/myTask/getProjectList', {}).then(res => {
        // this.log('请求侧边栏:', res)
        if (res.code === 200) {
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].projectType === '集团战略') {
              that.slideMenuGroup.push(res.data[i])
            } else {
              that.slideMenu.push(res.data[i])
            }
          }
          // that.log('that.slideMenu:', that.slideMenu)
          // that.log('that.slideMenuGroup:', that.slideMenuGroup)
          that.$store.state.slideMenuGroup = that.slideMenuGroup
          that.$store.state.slideMenu = that.slideMenu
          // if (this.$route.params.proId) {
          //   this.log('url带参数')
          //   that.getProjectDetail(this.$route.params.proId)
          // } else {
          //   that.log('url不带参数')
          //   if (that.slideMenuGroup.length > 0) {
          //     that.log('集团战略menu有值')
          //     that.getProjectDetail(that.slideMenuGroup[0].projectList[0].projectUID, '1', '集团战略')
          //   } else {
          //     that.log('集团战略menu没有值')
          //     that.getProjectDetail(that.slideMenu[0].projectUID, '2', '', that.slideMenu[0].projectType)
          //   }
          // }
          if (localStorage.getItem('generalMenuActive') !== '集团战略') {
            // this.log('nimanimanima------:', localStorage.getItem('generalMenuActive'))
            // this.log('nimanimanima------:', that.$store.state.slideMenu[p].projectType)
            for (var p = 0; p < that.$store.state.slideMenu.length; p++) {
              if (that.$store.state.slideMenu[p].projectType === localStorage.getItem('generalMenuActive')) {
                // that.log(99999999)
                that.$store.state.activeNavIndex = 'general_' + p
                // that.$store
              }
            }
          }
          that.$store.commit('setRouterName', {
            name: res.data[0].projectList[0] ? res.data[0].projectList[0].projectName : '',
            id: res.data[0].projectList[0] ? res.data[0].projectList[0].projectUID : '',
            type: 1
          })
        }
      })
    },
    getProjectDetail: function (id, n, proType, proName) {
      // this.log('getProjectDetail:id:', id)
      // this.log('getProjectDetail:n:', n)
      // this.log('getProjectDetail:proType:', proType)
      // this.log('getProjectDetail:proName:', proName)
      if (proType === '集团战略') {
        localStorage.setItem('generalMenuActive', '集团战略')
        // this.log('getProjectDetail：', '走了集团战略')
        if (id) {
          this.$store.state.proId = id
          this.$store.state.navType = n
          this.$router.push('/ProDetail')
        }
      } else {
        // this.log('getProjectDetail：', '没走集团战略')
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
        } else {
          this.activeNavIndex = ''
          this.$store.state.activeNavIndex = ''
          this.$store.state.proId = id
        }
      }
    },
    toDongtai: function () {
      this.$router.push('/dongtai')
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
  .goods .el-pagination.is-background .el-pager li:not(.disabled).active{
    background-color: #34c5be;
  }
  .goods .el-radio-button__orig-radio:checked+.el-radio-button__inner{
    background-color: #34c5be;
    border-color: #34c5be;
  }
  .goods .el-input.is-active .el-input__inner, .el-input__inner:focus{
    border-color: #34c5be;
  }
</style>
