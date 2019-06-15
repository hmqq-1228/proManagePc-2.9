<template>
  <div id="app" @click.stop="hidePanel">
    <div>{{getNavActive?'':''}}{{GetSlipPreShow?'' : ''}}</div>
    <el-container>
      <el-header class="elHeader" style="padding: 0;">
        <div class="header">
          <div @click="tttest()">贝豪实业项目管理中心</div>
          <div class="message" @click.stop="showMsg" @mouseover="mouseOver">
            <Icon type="md-notifications-outline" style="font-size: 24px"/>
            <div class="number" v-if="msgObj.totalNum > 0">
              <p style="font-size: 12px;transform: scale(0.8)" v-if="msgObj.totalNum < 100">{{msgObj.totalNum}}</p>
              <p style="font-size: 12px;transform: scale(0.8)" v-else>99+</p>
            </div>
          </div>
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
                  :default-active="navActive"
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
    <!-- 截图上传 图片预览 -->
    <el-dialog title="截图上传" :visible.sync="slipPreShow" :show-close="false">
      <div class="clear" style="text-align: center">
        <div class="showImg" v-loading="SlipPreLoading" style="display: inline-block">
          <img v-bind:src="slipPreSrc" alt>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="clipBack(false)">取 消</el-button>
        <el-button size="small" type="primary" @click="clipBack(true)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :width="imgPreviewWidth + '%'" :visible.sync="imgPreviewShow" v-bind:class="'pre_' + getImgPreviewShow" @closed="preClose">
      <div class="addMinusBox">
        <div class="addMinusItem add" v-on:click="addMinus('add')"><i class="el-icon-zoom-in"></i></div>
        <div class="addMinusItem minus" v-on:click="addMinus('Minus')"><i class="el-icon-zoom-out"></i></div>
        <div class="addMinusItem back" v-on:click="addMinus('back')"><i class="el-icon-refresh"></i></div>
      </div>
      <div class="showImgBox clear" style="text-align: center">
        <div class="showImgs" style="display: inline-block">
          <img v-bind:src="getImgPreviewSrc" @load="imgPreLoad" alt>
        </div>
      </div>
    </el-dialog>
    <div class="msglist" v-if="msgShow" @mouseleave="mouseLeave">
      <div class="title">
        新消息({{msgObj.totalNum}})
      </div>
      <div class="allMsg" v-for="(item,index) in msgObj.msgList" :key="index">
        <span style="float:left;">{{item.createDt}}</span>
        <span style="color:#2F64A5;margin-left: 10px;margin-right: 10px;float: left">{{item.senderName}}</span>
        <p style="float: left;width: 200px;overflow: hidden;text-overflow:ellipsis;white-space:nowrap;" :title="item.remark">{{item.remark}}</p>
        <span style="color:#2F64A5;float:right;margin-right:15px;cursor: pointer" @click="jumpDetail(item)">查看详情</span>
      </div>
      <div class="viewAll" @click="jumpMsg">
        <span class="text">查看全部</span>
      </div>
    </div>
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
      navActive: '',
      /** 截图上传 */
      slipPreSrc: '',
      slipPreShow: false,
      SlipPreLoading: false,
      /** 图片预览 */
      imgPreviewShow: false,
      imgPreviewWidth: 50,
      showImgSouseWidth: '',
      // 消息列表
      msgObj: {},
      // 消息弹窗
      msgShow: false
    }
  },
  created: function () {
    this.getPmsVersion()
    this.queryMenu()
    this.getUserInfo()
    this.$Bus.$on('getMsg', msgObj => {
      this.msgObj = msgObj
    })
    this.getMsg()
  },
  watch: {
    '$route': 'getPath'
  },
  computed: {
    getNavActive: function () {
      var that = this
      that.navActive = this.$store.state.navActive
      return that.$store.state.navActive
    },
    /** 截图上传 预览 */
    GetSlipPreShow: function () {
      var that = this
      that.slipPreShow = that.$store.state.slipPreShow
      that.slipPreSrc = that.$store.state.slipPreSrc
      if (!that.$store.state.slipPreShow) {
        that.SlipPreLoading = false
      }
      return this.$store.state.slipPreShow
    },
    /** 附件上传 预览 */
    getImgPreviewShow: function () {
      var that = this
      that.imgPreviewShow = that.$store.state.imgPreviewShow
      return that.$store.state.imgPreviewShow
    },
    /** 附件上传 预览地址 */
    getImgPreviewSrc: function () {
      return this.$store.state.imgPreviewSrc
    }
  },
  methods: {
    mouseOver () {
      if (this.msgObj.totalNum > 0) {
        this.msgShow = true
      } else {
        this.msgShow = false
      }
    },
    mouseLeave () {
      this.msgShow = false
    },
    // 点击任意区域弹窗消失
    hidePanel (event) {
      let sp2 = document.querySelector('.msglist')
      if (sp2) {
        if (!sp2.contains(event.target)) {
          this.msgShow = false
        }
      }
    },
    showMsg () {
      if (this.msgObj.totalNum === 0) {
        this.$router.push('/msgCenter')
      }
    },
    getMsg () {
      this.ajax('/msg/getNewMsg', {}).then(res => {
        if (res.code === 200) {
          this.msgObj = res.data
        }
      })
    },
    // 消息跳到详情
    jumpDetail (item) {
      if (item.detailUrl !== '') {
        window.location.href = item.detailUrl
      } else {
        this.$router.push('/msgCenter')
      }
    },
    jumpMsg () {
      this.$router.push('/msgCenter')
    },
    tttest: function () {
      this.log('addMinus::::', $('.showImgs').width())
      // this.log('imgPreviewShow:', this.$store.state.imgPreviewShow)
      // this.$store.state.navActive = '3'
    },
    imgPreLoad: function () {
      /** 图片原尺寸 */
      // this.log('addMinus:11:', $('.showImg').width())
      this.showImgSouseWidth = $('.showImgs').width()
    },
    addMinus: function (type) {
      // this.log('addMinus:', $('.showImg').width())
      var that = this
      if (type === 'add') {
        this.log('addMinus:', $('.showImgs').width())
        var showImgBox = $('.showImgBox').width()
        var showImgNext = Math.ceil($('.showImgs').width() + $('.showImgs').width() * 0.1)
        this.log('showImgBox:', showImgBox)
        this.log('showImgNext:', showImgNext)
        if (showImgNext < showImgBox) {
          $('.showImgs').css('width', showImgNext + 'px')
        } else {
          $('.showImgs').css('width', '100%')
          if (this.imgPreviewWidth < 100) {
            this.imgPreviewWidth = this.imgPreviewWidth + 10
          }
        }
      } else if (type === 'Minus') {
        if (this.imgPreviewWidth > 50) {
          this.imgPreviewWidth = this.imgPreviewWidth - 10
        } else {
          var showImgNextMinus = Math.ceil($('.showImgs').width() - $('.showImgs').width() * 0.1)
          if (showImgNextMinus > 0) {
            $('.showImgs').css('width', showImgNextMinus + 'px')
          }
        }
      } else {
        that.imgPreviewWidth = 50
        $('.showImgs').css('width', that.showImgSouseWidth + 'px')
      }
    },
    /** 监听路有变化 */
    getPath () {
      // var that = this
      // console.log(this.$route.path)
    },
    /** 图片预览关闭 */
    preClose: function () {
      this.imgPreviewWidth = 50
      this.showImgSouseWidth = ''
      $('.showImgs').css('width', 'auto')
      this.$store.state.imgPreviewShow = false
    },
    clipBack: function (boo) {
      if (boo) {
        this.SlipPreLoading = true
      } else {
        this.$store.state.slipPreShow = false
        // this.slipPreShow = this.$store.state.slipPreShow
      }
      this.$store.state.clipBackVal = boo
    },
    getUserInfo: function () {
      var that = this
      this.ajax('/myProject/getUserInfo', {}).then(res => {
        if (res.code === 200) {
          that.$store.state.userId = res.data.ID
          that.$store.state.userName = res.data.Name
          that.$store.state.userLoginInfo = res.data
          that.$store.state.jName = res.data.jName
        }
      })
    },
    toNavDetail: function (navData) {
      var that = this
      that.log('navData:', navData)
      var param = ''
      if (navData.menuName === '集团战略') {
        // this.$store.state.proId = navData.menuId
        /** 如果是集团战略 */
        that.$store.state.selectProjectType = '4'
      } else {
        that.$store.state.selectProjectType = ''
      }
      this.$store.state.menuId = navData.menuId
      that.$router.push('/' + navData.path + param)
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
          } else if (navType === '项目管理') {
            switch (navData[r].menuName) {
              case '我的项目':
                navData[r].path = 'MyPro'
                break
              case '全部项目':
                navData[r].path = 'AllCompanyPro'
                break
              default:
              // h
            }
          } else if (navType === '工作报告') {
            switch (navData[r].menuName) {
              case '报告生成':
                navData[r].path = 'workPlan'
                break
              case '历史报告':
                navData[r].path = 'report'
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
        // this.log('请求侧边栏:', res)
        if (res.code === 200) {
          for (var i = 0; i < res.data.length; i++) {
            // 设置图标
            switch (res.data[i].menuName) {
              case '集团战略':
                res.data[i].icon = 'ios-ribbon-outline'
                res.data[i].path = 'MyProGroup'
                // res.data[i].dataList = that.NavItemSet(res.data[i].dataList, 'singlePath', '集团战略', 'goodsDetail')
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
              case '项目管理':
                res.data[i].icon = 'ios-paper'
                res.data[i].dataList = that.NavItemSet(res.data[i].dataList, 'mix', '项目管理', '')
                break
              case '我的任务':
                res.data[i].icon = 'md-analytics'
                res.data[i].path = 'MyTaskNew'
                break
              case '问题反馈':
                res.data[i].icon = 'md-help-circle'
                res.data[i].path = 'ProblemFeedback'
                break
              case '工作报告':
                res.data[i].icon = 'ios-list-box'
                res.data[i].dataList = that.NavItemSet(res.data[i].dataList, 'mix', '工作报告', '')
                break
              default:
                res.data[i].icon = 'md-analytics'
            }
          }
          that.navList = res.data
          that.$store.state.navList = res.data
          that.log('navList:', that.navList)
          /** 设置侧边栏激活状态 */
          this.$store.commit('useNavActive', that.$store.state.NavActiveData)
        }
      })
    }
  }
}
</script>

<style>
  .clear:after{ content: ""; display: block;height: 0;visibility: hidden;clear: both;}
  .addMinusBox{ position: absolute; top: 15px; left: 50%; margin-left: -50px; display: flex; justify-content: center}
  .addMinusItem{
    font-size: 20px;
  }
  .addMinusItem.minus{
    margin-left: 20px;
    margin-right: 20px;
  }
  .addMinusItem.add{
    transform: rotate(90deg)
  }
  .addMinusItem:hover{
    color: #2D9CFF;
  }
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
.showImg,.showImgs img{
  width: 100%;
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
  .header .message {
    width: 35px;
    height: 30px;
    /*background: pink;*/
    float: left;
    text-align: center;
    line-height: 30px;
    margin-top: 15px;
    position: relative;
    cursor: pointer;
  }
  .header .message:hover.msglist{
    display: block;
  }
  .header .message .number {
    min-width: 15px;
    height: 15px;
    position: absolute;
    right:-5px;
    top:0;
    background: red;
    border-radius: 100px;
    font-size: 12px;
    text-align: center;
    line-height: 17px;
  }
  .msglist {
    width: 450px;
    /*height: 300px;*/
    background: #fff;
    border: 1px solid #f2f2f2;
    border-radius: 2px;
    position: fixed;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    top:60px;
    right:50px;
    display: block;
    z-index:99;
  }
  .msglist .title {
    width:100%;
    height: 35px;
    /*background: #2DB7F5;*/
    background: #2D8CF0;
    color:#fff;
    font-size: 14px;
    text-align: center;
    line-height: 35px;
  }
  .msglist .allMsg {
    width: 100%;
    height: 40px;
    border: 1px solid #f2f2f2;
    line-height: 40px;
    padding-left: 10px;
  }
  .msglist .viewAll {
     width: 100%;
     height: 40px;
     line-height: 40px;
     color:#169BD5;
     cursor: pointer;
  }
  .msglist .viewAll .text {
     float: right;
     margin-right: -45px;
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
  .el-pagination.is-background .el-pager li:not(.disabled).active,.el-pagination.is-background .el-pager li:not(.disabled).active{
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
  padding: 8px 0;
}
</style>
