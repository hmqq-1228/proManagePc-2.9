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
      <div class="goodType">
        <div class="goodName" @click="bbbb()">商品品牌:</div>
        <div class="goodBox">
          <div v-bind:class="tag.styleFlag === true ? 'active': ''" v-for="(tag, index) in level_0" @click="secondType($event, tag.categoryName, tag.code, tag.type)" v-bind:key="index">{{tag.categoryName}}</div>
          <!--<div @click="secondType($event, '可优比', 'KUB', '0')">可优比</div>-->
          <!--<div @click="secondType($event, '蒂爱', 'DI', '0')">蒂爱</div>-->
        </div>
      </div>
      <div class="goodType" v-if="level_1.length > 0">
        <div class="goodName">一级类目:</div>
        <div class="goodBox">
          <div v-for="(tag, index) in level_1" v-bind:key="index" v-bind:class="tag.styleFlag === true ? 'active': ''" @click="secondType($event, tag.categoryName, tag.code, tag.type)">{{tag.categoryName}}</div>
        </div>
      </div>
      <div class="goodType" v-if="level_2.length > 0">
        <div class="goodName">二级类目:</div>
        <div class="goodBox">
          <div v-for="(tag, index) in level_2" v-bind:key="index" v-bind:class="tag.styleFlag === true ? 'active': ''" @click="secondType($event, tag.categoryName, tag.code, tag.type)">{{tag.categoryName}}</div>
        </div>
      </div>
      <div class="goodType"  v-if="level_3.length > 0">
        <div class="goodName">三级类目:</div>
        <div class="goodBox">
          <div v-for="(tag, index) in level_3" v-bind:key="index" v-bind:class="tag.styleFlag === true ? 'active': ''" @click="secondType($event, tag.categoryName, tag.code, tag.type)">{{tag.categoryName}}</div>
        </div>
      </div>
      <div class="goodType" v-if="level_4.length > 0">
        <div class="goodName">四级类目:</div>
        <div class="goodBox">
          <div v-for="(tag, index) in level_4" v-bind:key="index" v-bind:class="tag.styleFlag === true ? 'active': ''" @click="secondType($event, tag.categoryName, tag.code, tag.type)">{{tag.categoryName}}</div>
        </div>
      </div>
      <!--<div class="goodType">-->
        <!--<div class="goodName">商品进度:</div>-->
        <!--<div class="goodBox">-->
          <!--<div class="active" @click="selectGoodState($event, ' ')">全部</div>-->
          <!--<div @click="selectGoodState($event, '1')">立项中</div>-->
          <!--<div @click="selectGoodState($event, '2')">研发中</div>-->
          <!--<div @click="selectGoodState($event, '3')">生产中</div>-->
          <!--<div @click="selectGoodState($event, '4')">已上市</div>-->
          <!--<div @click="selectGoodState($event, '5')">销售中</div>-->
          <!--<div @click="selectGoodState($event, '6')">反馈</div>-->
        <!--</div>-->
      <!--</div>-->
      <div class="goodType">
        <div class="goodName" style="line-height: 32px;">成 本 价:</div>
        <div>
          <Input v-model="value1" prefix="logo-yen" placeholder="输入金额" style="width: 120px" /> ---
          <Input v-model="value2" prefix="logo-yen" placeholder="输入金额" style="width: 120px" />
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
          <div class="goodImg" @click="toGoodsManage(good.spuGoodsId)">
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
          <div class="goodInfo" @click="toGoodsManage(good.spuGoodsId)">
            <div>编码: <span v-if="good.spuCode">{{good.spuCode}}</span><span v-if="!good.spuCode" style="color: #999;font-size: 12px;">无编码</span></div>
            <div class="goodTypeName" :title="good.spuName">品名: <span v-if="good.spuName">{{good.spuName}}</span><span v-if="!good.spuName" style="color: #999;font-size: 12px;">未命名</span></div>
            <div>分类: <span v-if="good.brandName">{{good.brandName}}</span><span v-if="!good.brandName" style="color: #999;font-size: 12px;">未分类</span></div>
            <div>品牌: <span v-if="good.category">{{good.category}}</span><span v-if="!good.category" style="color: #999;font-size: 12px;">未分类</span></div>
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
      value1: '',
      value2: '',
      num: 0,
      goodsImgUrl: '',
      currentPage: 1,
      dialogVisible: false,
      inputVal: '',
      radioVal: '创建时间',
      goodTags: [],
      goodList: [],
      setRouterArr: [],
      routerList2: [],
      level_0: [],
      level_1: [],
      level_2: [],
      level_3: [],
      level_4: [],
      level_5: [],
      goodNextTags: [],
      goodListTotal: 0,
      getGoodList: {
        pageNum: 1,
        pageSize: 12,
        status: '',
        goodsName: '',
        sortType: '1',
        categoryType: '',
        startCostPrice: '',
        endCostPrice: '',
        categoryStr: ''
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
        that.getGoodsList()
      }
    },
    value2: function (val, oV) {
      var that = this
      if (val) {
        that.getGoodList.endCostPrice = val
        that.getGoodsList()
      }
    },
    // 监听搜索值
    inputVal: function (val, oV) {
      var that = this
      that.getGoodList.goodsName = val
      that.getGoodsList()
    },
    // 商品排序
    radioVal: function (val, oV) {
      var that = this
      if (val === '创建时间') {
        that.getGoodList.sortType = '1'
        that.getGoodsList()
      } else if (val === '商品年份') {
        that.getGoodList.sortType = '2'
        that.getGoodsList()
      } else if (val === '爆品等级') {
        that.getGoodList.sortType = '3'
        that.getGoodsList()
      }
    }
  },
  created: function () {
    var that = this
    // 默认查询分类
    that.getGoodsList()
    that.getBrandType()
    // that.getRouterStore(that.num)
  },
  methods: {
    getBrandType: function () {
      var that = this
      this.ajax('/archives/getBrandType', {}).then(res => {
        that.log('选择所属项目:', res)
        if (res.code === 200) {
          that.level_0 = res.data.brandType
          for (var i = 0; i < that.level_0.length; i++) {
            if (that.level_0[i].categoryName === '全部') {
              that.level_0[i].styleFlag = true
            } else {
              that.level_0[i].styleFlag = false
              that.level_0[i].type = that.level_0[i].code
            }
          }
        }
      })
    },
    // aaaa: function (level) {
    //   var that = this
    //   that.getDefultNavType(level.categoryName, level.categoryType, level.code)
    // },
    // getRouterStore: function (num) {
    //   var that = this
    //   var routerListArr = JSON.parse(localStorage.getItem('setRouter'))
    //   if (routerListArr) {
    //     if (that.num < routerListArr.length) {
    //       that.aaaa(routerListArr[num])
    //     }
    //   }
    // },
    bbbb: function () {
      this.$router.push('/GoodsArchives2')
    },
    // getDefultNavType: function (name, type, code) {
    //   var that = this
    //   that.currentPage = 1
    //   that.getGoodList.pageNum = 1
    //   var codeLen = ''
    //   that.$store.state.goodCode = code
    //   that.$store.state.goodType = type
    //   if (code.length >= 2) {
    //     if (name === '全部') {
    //       if (code.length === 1) {
    //         codeLen = 'level_1'
    //       } else if (code.length === 2) {
    //         codeLen = 'level_2'
    //       } else if (code.length === 4) {
    //         codeLen = 'level_3'
    //       } else if (code.length === 6) {
    //         codeLen = 'level_4'
    //       }
    //     } else {
    //       codeLen = 'level_' + (code.length / 2)
    //     }
    //   } else if (code === '') {
    //     codeLen = 'level_0'
    //   } else {
    //     if (code.length === 1 && name === '全部') {
    //       codeLen = 'level_1'
    //     } else {
    //       codeLen = 'level_0'
    //     }
    //   }
    //   if (code === '') {
    //     that.level_1 = []
    //     that.level_2 = []
    //     that.level_3 = []
    //     that.level_4 = []
    //   } else if (code.length / 2 === 1) {
    //     that.level_3 = []
    //     that.level_4 = []
    //   } else if (code.length / 2 === 2) {
    //     that.level_4 = []
    //   } else if (code.length / 2 < 1) {
    //     that.level_2 = []
    //     that.level_3 = []
    //     that.level_4 = []
    //   }
    //   for (var j = 0; j < that[codeLen].length; j++) {
    //     if (that[codeLen][j].code === code) {
    //       that[codeLen][j].styleFlag = true
    //     } else {
    //       that[codeLen][j].styleFlag = false
    //     }
    //   }
    //   if (name !== '全部') {
    //     if (code === '1') {
    //       code = '0'
    //     }
    //     that.ajax('/goods/getDownByCategory', {code: code, categoryType: type}).then(res => {
    //       if (res.code === 200) {
    //         if (res.data.length > 1) {
    //           var level = 'level_' + res.data[1].code.length / 2
    //           for (var i = 0; i < res.data.length; i++) {
    //             if (res.data[i].code === code) {
    //               res.data[i].styleFlag = true
    //             } else {
    //               res.data[i].styleFlag = false
    //             }
    //           }
    //           that[level] = res.data
    //         }
    //         this.getGoodsList(type, code)
    //         // that.getRouterStore()
    //         that.num++
    //         var routerListArr = JSON.parse(localStorage.getItem('setRouter'))
    //         if (that.num < routerListArr.length) {
    //           that.getRouterStore(that.num)
    //         }
    //       }
    //     })
    //   } else if (name === '全部') {
    //     that.getGoodsList(type, code)
    //   }
    // },
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
        this.$store.state.proId = goodId
        this.$router.push('/goodsDetail')
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
    //  商品状态查询
    selectGoodState: function (e, str) {
      var that = this
      var obj = e.target
      $(obj).addClass('active').siblings().removeClass('active')
      that.getGoodList.developProgress = str
      that.getGoodsList()
    },
    // 查询商品列表
    getGoodsList: function (code) {
      var that = this
      if (code) {
        that.getGoodList.categoryStr = that.$store.state.goodCode
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
        that.getGoodList.categoryStr = that.$store.state.goodCode
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
    secondType: function (e, name, code, type) {
      var that = this
      if (type) {
        that.$store.state.goodType = type
      }
      if (code.length >= 2) {
        that.$store.state.goodCode = that.$store.state.goodType + ',' + code
      } else {
        that.$store.state.goodCode = code
      }
      that.currentPage = 1
      that.getGoodList.pageNum = 1
      var codeLen = ''
      if (code.length >= 2) {
        if (name === '全部') {
          if (code.length === 1) {
            codeLen = 'level_1'
          } else if (code.length === 2) {
            codeLen = 'level_2'
          } else if (code.length === 4) {
            codeLen = 'level_3'
          } else if (code.length === 6) {
            codeLen = 'level_4'
          }
        } else {
          codeLen = 'level_' + (code.length / 2)
        }
      } else if (code === '') {
        codeLen = 'level_0'
        that.getGoodList.categoryStr = ''
        that.$store.state.goodCode = ''
      } else {
        if (code.length === 1 && name === '全部') {
          codeLen = 'level_1'
        } else {
          codeLen = 'level_0'
        }
      }
      if (code === '') {
        that.level_1 = []
        that.level_2 = []
        that.level_3 = []
        that.level_4 = []
      } else if (code.length / 2 === 1) {
        that.level_3 = []
        that.level_4 = []
      } else if (code.length / 2 === 2) {
        that.level_4 = []
      } else if (code.length / 2 < 1) {
        that.level_2 = []
        that.level_3 = []
        that.level_4 = []
      }
      for (var j = 0; j < that[codeLen].length; j++) {
        if (that[codeLen][j].code === code) {
          that[codeLen][j].styleFlag = true
        } else {
          that[codeLen][j].styleFlag = false
        }
      }
      if (name !== '全部') {
        if (code === '1') {
          code = '0'
        }
        var FileIdStr = that.$store.state.goodCode
        // for (var i = 0; i < that.setRouterArr.length; i++) {
        //   var splitIcon = ','
        //   if (i === that.setRouterArr.length - 1) {
        //     splitIcon = ''
        //   }
        //   FileIdStr = FileIdStr + that.setRouterArr[i].code + splitIcon
        // }
        // // that.setRouterArr = []
        // console.log('setRouterArr', FileIdStr)
        // that.$store.state.goodCode = FileIdStr
        that.ajax('/archives/getDownByCategory', {categoryStr: FileIdStr}).then(res => {
          if (res.code === 200) {
            if (res.data.length > 1) {
              var level = 'level_' + res.data[1].code.length / 2
              for (var i = 0; i < res.data.length; i++) {
                if (res.data[i].code === code) {
                  res.data[i].styleFlag = true
                } else {
                  res.data[i].styleFlag = false
                }
              }
              that[level] = res.data
            }
            this.getGoodsList(code)
          }
        })
      } else if (name === '全部') {
        that.getGoodsList(code)
      }
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
    pointer-events: none;
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
</style>
