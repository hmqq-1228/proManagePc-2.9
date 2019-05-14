<template>
  <div class="GoodsArchives">
    <div class="goodSer" style="width: 350px;">
      <el-input
        placeholder="请输入商品名称"
        prefix-icon="el-icon-search"
        v-model="inputVal">
      </el-input>
    </div>
    <div class="serTag">
      <div class="wrap">
        <div class="label">商品品牌:</div>
        <div class="content">
          <div class="cntItem brand" :class="'c_' + item.code"  @click="btnClick($event, item.code, 'brand')" v-for="item in pinpaiLevel" :key="item.code">{{item.categoryName}}</div>
        </div>
      </div>
      <div class="wrap" v-show="firstLevel.length > 0">
        <div class="label">一级类目:</div>
        <div class="content">
          <div class="cntItem firstLevel" :class="'c_' + item.code" @click="btnClick($event, item.code, item.typeName)" v-for="item in firstLevel" :key="item.code">{{item.categoryName}}</div>
        </div>
      </div>
      <div class="wrap" v-show="secondLevel.length > 0">
        <div class="label">二级类目:</div>
        <div class="content">
          <div class="cntItem secondLevel" :class="'c_' + item.code" @click="btnClick($event, item.code, item.typeName)" v-for="item in secondLevel" :key="item.code">{{item.categoryName}}</div>
        </div>
      </div>
      <div class="wrap" v-show="thirdLevel.length > 0">
        <div class="label">三级类目:</div>
        <div class="content">
          <div class="cntItem thirdLevel" :class="'c_' + item.code" @click="btnClick($event, item.code, item.typeName)" v-for="item in thirdLevel" :key="item.code">{{item.categoryName}}</div>
        </div>
      </div>
      <div class="wrap" v-show="fourLevel.length > 0">
        <div class="label">四级类目:</div>
        <div class="content">
          <div class="cntItem fourLevel" :class="'c_' + item.code" @click="btnClick($event, item.code, item.typeName)" v-for="item in fourLevel" :key="item.code">{{item.categoryName}}</div>
        </div>
      </div>
      <div class="goodType">
        <div class="goodName" style="line-height: 32px;">成 本 价:</div>
        <div>
          <Input v-model="value1" prefix="logo-yen" placeholder="输入金额" style="width: 120px" /> ---
          <Input v-model="value2" prefix="logo-yen" placeholder="输入金额" style="width: 120px" />
        </div>
        <div style="margin-left: 20px;">
          <Select v-model="OptionModel" style="width:200px">
            <Option v-for="item in OptionList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
      </div>
    </div>
    <div class="line">
      <div class="lineName">商品排序:</div>
      <div style="margin-left: 10px">
        <el-radio-group v-model="radioVal" size="mini">
          <el-radio-button label="创建时间"></el-radio-button>
          <el-radio-button label="商品年份"></el-radio-button>
          <el-radio-button label="爆品等级"></el-radio-button>
          <!--<el-radio-button label="库存"></el-radio-button>-->
        </el-radio-group>
      </div>
    </div>
    <div class="goodList">
      <div v-if="goodList.length > 0" class="goodItem" v-for="(good, index) in goodList" v-bind:key="index">
        <div class="goodItemCon">
          <div class="goodImg" @click="toGoodsManage(good.spuId)">
            <div style="position: relative;" class="goodImg2 showIcon" v-if="good.attachment[0]">
              <img :src="good.activeImgUrl" alt="">
              <div class="showImageIcon" @click="showGoodsManage($event, good.activeImgUrl)"><Icon size="16" type="ios-expand" /></div>
            </div>
            <div class="goodImg2" v-if="!good.attachment[0]"><img src="../../static/img/defult.png" alt=""></div>
          </div>
          <div class="goodSlider" style="height: 40px;">
            <div v-if="good.attachment.length > 0" v-for="(img, index2) in good.attachment"
                 v-bind:class="good.activeImgUrl === img.previewUrl ? 'active' : ''"
                 v-bind:key="index2" @click="previewImg(img.previewUrl, index)">
              <img v-bind:src="img.previewUrl" alt="">
            </div>
            <div class="active" v-if="good.attachment.length === 0"><img src="../../static/img/defult.png" alt=""></div>
          </div>
          <div class="goodInfo" @click="toGoodsManage(good.spuId)">
            <div>编码: <span v-if="good.spuCode">{{good.spuCode}}</span><span v-if="!good.spuCode" style="color: #999;font-size: 12px;">无编码</span></div>
            <div class="goodTypeName" :title="good.spuName">品名: <span v-if="good.spuName">{{good.spuName}}</span><span v-if="!good.spuName" style="color: #999;font-size: 12px;">未命名</span></div>
            <div>品牌: <span v-if="good.brandName">{{good.brandName}}</span><span v-if="!good.brandName" style="color: #999;font-size: 12px;">未分类</span></div>
            <div>分类: <span v-if="good.category">{{good.category}}</span><span v-if="!good.category" style="color: #999;font-size: 12px;">未分类</span></div>
            <div>负责人: <span>{{good.userName}}</span></div>
          </div>
        </div>
      </div>
      <div v-if="goodList.length === 0" class="noDate">暂无数据</div>
    </div>
    <el-dialog title="图片预览" :visible.sync="dialogVisible" :width="imgWide + '%'">
      <div class="controlImgWidth" style="position: absolute;top: 15px;left: 45%">
        <div @click="addImgWide()">放大</div>
        <div @click="delImgWide()">缩小</div>
      </div>
      <div><img :src="goodsImgUrl" alt=""></div>
    </el-dialog>
    <div class="block" style="text-align: center;margin-top: 30px;">
      <el-pagination
        @current-change="handleCurrentChange($event)"
        background
        :current-page = 'currentPage'
        :page-size="getGoodList.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="goodListTotal">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GoodsArchives',
  data () {
    return {
      imgWide: 50,
      value1: this.$store.state.startCostPrice,
      value2: this.$store.state.endCostPrice,
      num: 0,
      msg: '',
      permission: [],
      OptionModel: '',
      OptionList: [],
      pinpaiLevel: [],
      firstLevel: [],
      secondLevel: [],
      thirdLevel: [],
      fourLevel: [],
      codeArr: [],
      goodsImgUrl: '',
      currentPage: 1,
      dialogVisible: false,
      inputVal: this.$store.state.goodsName,
      radioVal: this.$store.state.sortTypeName,
      goodTags: [],
      goodList: [],
      setRouterArr: [],
      routerList2: [],
      goodNextTags: [],
      goodListTotal: 0,
      getGoodList: {
        pageNum: 1,
        pageSize: 12,
        status: '',
        goodsName: this.$store.state.goodsName,
        sortType: this.$store.state.sortType,
        categoryType: '',
        startCostPrice: this.$store.state.startCostPrice,
        endCostPrice: this.$store.state.endCostPrice,
        categoryStr: '',
        permission: ''
      }
    }
  },
  watch: {
    dialogVisible: function (val, oV) {
      if (val === false) {
        this.imgWide = 50
      }
    },
    value1: function (val, oV) {
      var that = this
      if (val) {
        that.getGoodList.startCostPrice = val
        that.$store.state.startCostPrice = val
        that.getGoodsList()
      }
    },
    OptionModel: function (val, oV) {
      var that = this
      if (val) {
        that.getGoodList.pageNum = 1
        that.$store.state.permission = val
        that.getGoodList.permission = val
        that.getGoodsList()
      }
    },
    num (val, old) {
      var that = this
      this.routerFuc(that.$store.state.codeArr, 'ini')
    },
    value2: function (val, oV) {
      var that = this
      if (val) {
        that.getGoodList.endCostPrice = val
        that.$store.state.endCostPrice = val
        that.getGoodsList()
      }
    },
    // 监听搜索值
    inputVal: function (val, oV) {
      var that = this
      that.$store.state.goodsName = val
      that.getGoodList.goodsName = val
      that.getGoodsList()
    },
    // 商品排序
    radioVal: function (val, oV) {
      var that = this
      if (val === '创建时间') {
        that.$store.state.sortTypeName = '创建时间'
        that.getGoodList.sortType = '1'
        that.$store.state.sortType = '1'
        that.getGoodsList()
      } else if (val === '商品年份') {
        that.$store.state.sortTypeName = '商品年份'
        that.getGoodList.sortType = '2'
        that.$store.state.sortType = '2'
        that.getGoodsList()
      } else if (val === '爆品等级') {
        that.$store.state.sortTypeName = '爆品等级'
        that.getGoodList.sortType = '3'
        that.$store.state.sortType = '3'
        that.getGoodsList()
      }
    }
  },
  created: function () {
    var that = this
    // 默认查询分类
    that.codeArr = that.$store.state.codeArr
    var codeStr = ''
    for (var i = 0; i < that.codeArr.length; i++) {
      var dou = i < (that.codeArr.length - 1) ? ',' : ''
      codeStr = codeStr + that.codeArr[i].code + dou
    }
    console.log('codeStr', codeStr)
    this.iniBtn()
    that.getGoodsList(codeStr)
    that.getPermission()
  },
  methods: {
    getPermission: function () {
      var that = this
      console.log('that.$store.state.permission', that.$store.state.permission)
      that.ajax('/archives/getPermission', {}).then(res => {
        if (res.code === 200) {
          that.OptionList = res.data
          if (that.$store.state.permission) {
            that.OptionModel = that.$store.state.permission
          } else {
            that.OptionModel = res.data[0].value
          }
        }
      })
    },
    addImgWide: function () {
      if (this.imgWide < 90) {
        this.imgWide = this.imgWide + 10
      }
    },
    delImgWide: function () {
      if (this.imgWide > 30) {
        this.imgWide = this.imgWide - 10
      }
    },
    showGoodsManage: function (e, url) {
      e.stopPropagation()
      if (url) {
        this.goodsImgUrl = url
        this.dialogVisible = true
      } else {
        this.$message.warning('暂无商品图片')
      }
    },
    toGoodsManage: function (goodId) {
      if (goodId) {
        this.$store.state.spuId = goodId
        this.$router.push('/goodsfileDetail/' + goodId)
      }
    },
    // 切换 预览图片
    previewImg: function (url, index) {
      var that = this
      var newGoodList = []
      that.goodList[index].activeImgUrl = url
      for (var t = 0; t < that.goodList.length; t++) {
        newGoodList.push(that.goodList[t])
      }
      that.goodList = []
      that.goodList = newGoodList
    },
    // 查询商品列表
    getGoodsList: function (code) {
      var that = this
      if (code) {
        that.getGoodList.categoryStr = code
        that.ajax('/archives/getGoodsList', that.getGoodList).then(res => {
          if (res.code === 200) {
            that.goodList = res.data.list
            that.goodListTotal = res.data.totalRow
            for (var i = 0; i < res.data.list.length; i++) {
              if (res.data.list[i].attachment.length > 0) {
                res.data.list[i].activeImgUrl = res.data.list[i].attachment[0].previewUrl
              }
            }
          }
        })
      } else {
        that.codeArr = that.$store.state.codeArr
        var codeStr = ''
        for (var i = 0; i < that.codeArr.length; i++) {
          var dou = i < (that.codeArr.length - 1) ? ',' : ''
          codeStr = codeStr + that.codeArr[i].code + dou
        }
        that.getGoodList.categoryStr = codeStr
        that.ajax('/archives/getGoodsList', that.getGoodList).then(res => {
          if (res.code === 200) {
            that.goodList = res.data.list
            that.goodListTotal = res.data.totalRow
            for (var i = 0; i < res.data.list.length; i++) {
              if (res.data.list[i].attachment.length > 0) {
                res.data.list[i].activeImgUrl = res.data.list[i].attachment[0].previewUrl
              }
            }
          }
        })
      }
    },
    // 分页
    handleCurrentChange: function (e) {
      var that = this
      that.currentPage = e
      that.getGoodList.pageNum = e
      that.getGoodsList()
    },
    // 第二级到第四级查询
    routerFuc: function (arr, isIni) {
      var that = this
      that.actionEmit(arr[that.num].code, isIni)
    },
    actionEmit: function (codeStr, isIni) {
      var that = this
      that.ajax('/archives/getDownByCategory', {categoryStr: codeStr}).then(res => {
        if (res.code === 200) {
          switch (res.data[0].typeName) {
            case '一级类目':
              that.firstLevel = res.data
              that.secondLevel = []
              that.thirdLevel = []
              that.fourLevel = []
              $('.firstLevel').removeClass('active')
              break
            case '二级类目':
              that.secondLevel = res.data
              that.thirdLevel = []
              that.fourLevel = []
              $('.secondLevel').removeClass('active')
              break
            case '三级类目':
              that.thirdLevel = res.data
              that.fourLevel = []
              $('.thirdLevel').removeClass('active')
              break
            case '四级类目':
              that.fourLevel = res.data
              $('.fourLevel').removeClass('active')
              break
            default:
              that.log('case null')
          }
          if (isIni === 'ini' && that.num < (that.$store.state.codeArr.length - 1)) {
            that.num = that.num + 1
          }
          if (that.num === (that.$store.state.codeArr.length - 1) && isIni === 'ini') {
            that.log(123)
            setTimeout(function () {
              var cc = that.$store.state.codeArr
              for (var r = 0; r < cc.length; r++) {
                $('.c_' + cc[r].code).addClass('active').siblings().removeClass('active')
                // $('.c_').removeClass('active')
              }
            }, 200)
          }
        }
      })
    },
    iniBtn: function () {
      var that = this
      that.ajax('/archives/getBrandType', {}).then(res => {
        if (res.code === 200) {
          this.pinpaiLevel = res.data.brandType
          if (this.$store.state.codeArr.length > 0) {
            that.routerFuc(this.$store.state.codeArr, 'ini')
            $('.c_').removeClass('active')
          } else if (this.$store.state.codeArr.length === 0) {
            setTimeout(function () {
              $('.c_').addClass('active')
            }, 200)
          }
        }
      })
    },
    btnClick: function (e, code, type) {
      var that = this
      var obj = e.currentTarget
      $(obj).addClass('active').siblings().removeClass('active')
      if (code) {
        var isthat = false
        var tindex = -1
        for (var t = 0; t < that.codeArr.length; t++) {
          if (that.codeArr[t].type === type) {
            isthat = true
            tindex = t
            break
          }
        }
        var dataobj = {
          code: code,
          type: type
        }
        if (isthat) {
          that.codeArr.splice(tindex, that.codeArr.length, dataobj)
        } else {
          that.codeArr.push(dataobj)
        }
        that.$store.state.codeArr = that.codeArr
      } else if (code === '') {
        that.codeArr = []
        that.firstLevel = []
        that.secondLevel = []
        that.thirdLevel = []
        that.fourLevel = []
        that.$store.state.codeArr = that.codeArr
      }
      var codeStr = ''
      for (var i = 0; i < that.codeArr.length; i++) {
        var dou = i < (that.codeArr.length - 1) ? ',' : ''
        codeStr = codeStr + that.codeArr[i].code + dou
      }
      that.actionEmit(codeStr)
      that.getGoodsList(codeStr)
    }
  }
}
</script>

<style scoped>
  .goodType{
    display: flex;
    font-size: 14px;
    margin-top: 10px;
    padding: 0 10px;
  }
  .goodBox .active{
    color: #fff;
    background-color: #34c5be;
  }
  .goodName{
    width: 64px;
    color: #777;
  }
  .goodBox{
    display: flex;
  }
  .goodBox>div{
    font-size: 12px;
    padding: 0 12px;
    background-color: #f5f8fa;
    height: 22px;
    line-height: 22px;
    color: #999;
    margin-left: 10px;
    cursor: pointer;
    border-radius: 4px;
  }
  .line{
    display: flex;
    margin-top: 10px;
    height: 36px;
    line-height: 36px;
    padding: 0 10px;
    background-color: #f5f8fa;
    /*border-top: 1px solid #ccc;*/
  }
  .lineName{
    width: 64px;
    color: #666;
  }
  .goodImg{
    width: 230px;
    height: 190px;
    overflow: hidden;
  }
  .goodImg2{
    width: 228px;
    height: 190px;
    overflow: hidden;
    border-bottom: 1px solid #cacaca
    /*display: flex;*/
    /*justify-content: center;*/
    /*align-items: center;*/
  }
  .goodItemCon:hover .goodImg2{
    border-bottom: 1px solid #34c5be
  }
  div>img{
    width: 100%;
    height: 100%;
  }
  .goodList{
    display: flex;
    flex-wrap: wrap;
    padding: 0 15px;
    min-height: 600px;
    justify-content: flex-start;
  }
  .goodItem{
    width: 260px;
    margin-top: 20px;
  }
  .goodItemCon{
    width: 230px;
    margin: 0 auto;
    cursor: pointer;
    border: 1px solid #cacaca;
    box-shadow: 1px 1px 4px #f1f1f1;
  }
  .goodItemCon:hover{
    border: 1px solid #34c5be;
    box-shadow: 1px 1px 6px #ccc;
  }
  .goodSlider{
    width: 100%;
    display: flex;
    margin-top: 6px;
    justify-content: center;
  }
  .goodSlider>div{
    height: 40px;
    width: 40px;
    margin-left: 3px;
    border: 1px solid #cacaca;
    background-color: #f5f8fa;
  }
  .goodSlider>div:nth-of-type(1){
    margin-left: 0;
  }
  .goodSlider .active{
    box-shadow: 1px 1px 4px #ccc;
    border: 1px solid #34c5be;
  }
  .goodInfo{
    width: 100%;
    padding: 10px;
    line-height: 24px;
    font-size: 14px;
  }
  .goodInfo>div>span{
    color: #666;
  }
  .goodInfo .goodTypeName{
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap
  }
  .noDate{
    width: 100%;
    text-align: center;
    color: #888;
    font-size: 14px;
    margin-top: 100px;
  }
  .goodInfo>div .statuStyle0{
    color: chocolate;
  }
  .goodInfo>div .statuStyle1{
    color: #409EFF;
  }
  .goodInfo>div .statuStyle2{
    color: #13ce66;
  }
  .goodImg2.showIcon div{
    display: none;
  }
  .goodImg2.showIcon:hover div{
    display: block;
  }
  .showImageIcon{
    position: absolute;
    top: 0;
    right: 0;
    background: rgba(0,0,0,0.3);
    padding: 2px;
    color: #fff;
  }
  .controlImgWidth{
    font-size: 12px;
    color: #409EFF;
    width: 100px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
  }
  .controlImgWidth > div{
    width: 40px;
    cursor: pointer;
    text-align: center;
  }
  /*.showImageIcon.showIcon{*/
    /*display: block;*/
  /*}*/
  .wrap{
    display: flex;
    padding: 0 10px;
  }
  .label{
    padding-top: 10px;
    font-size: 14px;
    color: #777;
  }
  .content{
    display: flex;
    height: 22px;
    margin-top: 10px;
    line-height: 22px;
  }
  .content div{
    font-size: 12px;
    padding: 0 12px;
    height: 22px;
    line-height: 22px;
    color: #999;
    margin-left: 10px;
    cursor: pointer;
    border-radius: 4px;
    background-color: #f5f8fa;
  }
  .content div.active{
    color: #fff;
    background-color: #34c5be;
  }
</style>
