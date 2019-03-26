<template>
  <div class="goods">
    <div class="goodSer" style="width: 350px;">
      <el-input
        placeholder="请输入商品名称"
        prefix-icon="el-icon-search"
        v-model="inputVal">
      </el-input>
    </div>
    <div class="serTag">
      <div class="goodType">
        <div class="goodName">商品品牌:</div>
        <div class="goodBox">
          <div class="active" @click="firstType($event, ' ', '0')">全部</div>
          <div @click="firstType($event, 'KUB', '0')">可优比</div>
          <div @click="firstType($event, 'DI', '0')">蒂爱</div>
        </div>
      </div>
      <div class="goodType" v-if="goodTags.length > 0">
        <div class="goodName">一级类目:</div>
        <div class="goodBox">
          <div v-for="(tag, index) in goodTags" v-bind:key="index" v-bind:class="tag.categoryName === '全部'? 'active': ''" @click="secondType($event, tag.categoryName, tag.categoryType, tag.code)">{{tag.categoryName}}</div>
        </div>
      </div>
      <div class="goodType" v-if="level_2.length > 0">
        <div class="goodName">二级类目:</div>
        <div class="goodBox">
          <div v-for="(tag, index) in level_2" v-bind:key="index" v-bind:class="tag.categoryName === '全部'? 'active': ''" @click="secondType($event, tag.categoryName, tag.categoryType, tag.code)">{{tag.categoryName}}</div>
        </div>
      </div>
      <div class="goodType"  v-if="level_3.length > 0">
        <div class="goodName">三级类目:</div>
        <div class="goodBox">
          <div v-for="(tag, index) in level_3" v-bind:key="index" v-bind:class="tag.categoryName === '全部'? 'active': ''" @click="secondType($event, tag.categoryName, tag.categoryType, tag.code)">{{tag.categoryName}}</div>
        </div>
      </div>
      <div class="goodType" v-if="level_4.length > 0">
        <div class="goodName">四级类目:</div>
        <div class="goodBox">
          <div v-for="(tag, index) in level_4" v-bind:key="index" v-bind:class="tag.categoryName === '全部'? 'active': ''" @click="secondType($event, tag.categoryName, tag.categoryType, tag.code)">{{tag.categoryName}}</div>
        </div>
      </div>
      <div class="goodType">
        <div class="goodName">商品状态:</div>
        <div class="goodBox">
          <div class="active" @click="selectGoodState($event, ' ')">全部</div>
          <div @click="selectGoodState($event, '1')">研发中</div>
          <div @click="selectGoodState($event, '2')">销售中</div>
          <div @click="selectGoodState($event, '0')">已下架</div>
        </div>
      </div>
    </div>
    <div class="line">
      <div class="lineName">商品排序:</div>
      <div style="margin-left: 10px">
        <el-radio-group v-model="radioVal" size="mini">
          <el-radio-button label="综合排序"></el-radio-button>
          <el-radio-button label="上架时间"></el-radio-button>
          <!--<el-radio-button label="销量"></el-radio-button>-->
          <!--<el-radio-button label="库存"></el-radio-button>-->
        </el-radio-group>
      </div>
    </div>
    <div class="goodList">
      <!--<div class="goodItem">-->
        <!--<div class="goodItemCon">-->
          <!--<div class="goodImg"><img v-bind:src="defultImg" alt=""></div>-->
          <!--<div class="goodSlider">-->
            <!--<div @mouseover="showBigImg($event)" v-bind:imgPath="imgUrl"><img v-bind:src="imgUrl" alt=""></div>-->
            <!--<div></div>-->
            <!--<div></div>-->
            <!--<div></div>-->
          <!--</div>-->
          <!--<div class="goodInfo">-->
            <!--<div>编码: <span>156654586665585</span></div>-->
            <!--<div>品名: <span>出行安全用品</span></div>-->
            <!--<div>状态: <span>研发中</span></div>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
      <div v-if="goodList.length > 0" class="goodItem" v-for="(good, index) in goodList" v-bind:key="index">
        <div class="goodItemCon">
          <div class="goodImg">
            <div class="goodImg2" v-if="good.attachment[0]"><img :src="good.activeImgUrl" alt=""></div>
            <div class="goodImg2" v-if="!good.attachment[0]"><img src="../../static/img/defult.png" alt=""></div>
          </div>
          <div class="goodSlider" style="height: 40px;">
            <div v-if="good.attachment.length > 0" v-for="(img, index2) in good.attachment" v-bind:class="good.activeImgUrl === img.previewUrl ? 'active' : ''" v-bind:key="index2" @click="previewImg(img.previewUrl, index)">
              <img v-bind:src="img.previewUrl" alt="">
            </div>
            <div class="active" v-if="good.attachment.length === 0"><img src="../../static/img/defult.png" alt=""></div>
          </div>
          <div class="goodInfo">
            <div>编码: <span>{{good.goodsCode}}</span></div>
            <div class="goodTypeName" :title="good.name">品名: <span>{{good.name}}</span></div>
            <div>分类: <span>{{good.categoryName}}</span></div>
            <div>状态: <span v-bind:class="'statuStyle' + good.status">{{good.statusStr}}</span></div>
          </div>
        </div>
      </div>
      <div v-if="goodList.length === 0" class="noDate">暂无数据</div>
    </div>
    <div class="block" style="text-align: center;margin-top: 30px;">
      <el-pagination
        @current-change="handleCurrentChange($event)"
        background
        :page-size="getGoodList.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="goodListTotal">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GoodsManage',
  data () {
    return {
      inputVal: '',
      radioVal: '综合排序',
      defultImg: '../../static/img/good.png',
      imgUrl: '../../static/img/111.png',
      goodTags: [],
      goodList: [],
      level_2: [],
      level_3: [],
      level_4: [],
      level_5: [],
      goodNextTags: [],
      goodListTotal: 0,
      getGoodList: {
        pageNum: 1,
        pageSize: 12,
        status: ' ',
        goodsName: '',
        sortType: '',
        categoryType: ' ',
        code: '0'
      }
    }
  },
  watch: {
    inputVal: function (val, oV) {
      var that = this
      that.getGoodList.goodsName = val
      that.getGoodsList('0')
    },
    radioVal: function (val, oV) {
      var that = this
      if (val === '综合排序') {
        that.getGoodList.sortType = '1'
        that.getGoodsList('0')
      } else if (val === '上架时间') {
        that.getGoodList.sortType = '2'
        that.getGoodsList('0')
      }
    }
  },
  created: function () {
    this.getGoodsListTag(' ', '0')
  },
  methods: {
    previewImg: function (url, index) {
      var that = this
      var newGoodList = []
      for (var i = 0; i < that.goodList.length; i++) {
        var urlImg = ''
        if (i === index) {
          urlImg = url
        } else {
          if (that.goodList[i].attachment.length > 0) {
            urlImg = that.goodList[i].attachment[0].previewUrl
          }
        }
        var obj = {
          activeImgUrl: urlImg,
          attachment: that.goodList[i].attachment,
          categoryName: that.goodList[i].categoryName,
          goodsCode: that.goodList[i].goodsCode,
          name: that.goodList[i].name,
          status: that.goodList[i].status,
          statusStr: that.goodList[i].statusStr
        }
        newGoodList.push(obj)
      }
      that.goodList = []
      that.goodList = newGoodList
      // var obj = e.currentTarget
      // $(obj).addClass('active').siblings().removeClass('active')
    },
    selectGoodState: function (e, str) {
      var that = this
      var obj = e.target
      $(obj).addClass('active').siblings().removeClass('active')
      that.getGoodList.status = str
      that.getGoodsList('0')
    },
    getGoodsListTag: function (type, code) {
      var that = this
      console.log('888888', code)
      if (type !== ' ') {
        that.ajax('/goods/getDownByCategory', {code: code}).then(res => {
          console.log('getGoodsListTag', res)
          if (res.code === 200) {
            that.goodTags = res.data
            this.getGoodsList(code)
          }
        })
      } else if (type === ' ') {
        that.getGoodsList(code)
      }
    },
    getGoodsList: function (code) {
      var that = this
      that.getGoodList.categoryType = that.$store.state.goodType
      that.getGoodList.code = code
      that.ajax('/goods/getGoodsList', that.getGoodList).then(res => {
        console.log('getGoodsList', res)
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
    },
    handleCurrentChange: function (e) {
      console.log(e)
      var that = this
      that.getGoodList.pageNum = e
      that.getGoodsList('0')
    },
    // showBigImg: function (e) {
    //   console.log('eeee:', e.target.attributes.src.value)
    //   this.defultImg = e.target.attributes.src.value
    // },
    firstType: function (e, type, code) {
      console.log(e)
      var that = this
      var obj = e.currentTarget
      console.log('11111111', code)
      that.$store.state.goodType = type
      this.getGoodsListTag(type, code)
      $(obj).addClass('active').siblings().removeClass('active')
      this.goodTags = []
      that.level_2 = []
      that.level_3 = []
      that.level_4 = []
    },
    secondType: function (e, name, type, code) {
      console.log(e)
      var that = this
      var obj = e.target
      console.log('code:', code)
      if (code.length / 2 === 1) {
        that.level_3 = []
        that.level_4 = []
      } else if (code.length / 2 === 2) {
        that.level_4 = []
      }
      $(obj).addClass('active').siblings().removeClass('active')
      if (name !== '全部') {
        that.ajax('/goods/getDownByCategory', {code: code}).then(res => {
          console.log('getGoodsListTag222', res)
          if (res.code === 200) {
            console.log('code55555:', res.data[1].code.length)
            if (res.data.length > 1) {
              var level = 'level_' + res.data[1].code.length / 2
              that[level] = res.data
            }
            // console.log('getGoodsListTag222999999', level)
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
    /*display: flex;*/
    /*justify-content: center;*/
    /*align-items: center;*/
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
    justify-content: space-around;
  }
  .goodSlider>div{
    height: 40px;
    width: 40px;
    border: 1px solid #cacaca;
    background-color: #f5f8fa;
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
    color: #888;
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
</style>
