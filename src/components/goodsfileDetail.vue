<template>
  <div class="goodsfileDetail">
    <div class="goodsFileBread">贝豪产品库>>可优比>>玩教>>手抓类</div>
    <div class="top">
      <div class="spuInfoLeft">
        <GoodsFileSpuInfo></GoodsFileSpuInfo>
      </div>
      <!--沟通-->
      <div class="communication">
        <communication></communication>
      </div>
    </div>
    <!--SKU信息-->
    <div class="down">
      <sku :slideData = 'SlideData.priceSegment'></sku>
    </div>
  </div>
</template>

<script>
import GoodsFileSpuInfo from './CustomComp/GoodsFileSpuInfo.vue'
import sku from './CustomComp/skuInfo'
import communication from './CustomComp/communication'
export default {
  name: 'goods',
  data () {
    return {
      SlideData: {}
    }
  },
  components: {
    sku,
    communication,
    GoodsFileSpuInfo
  },
  created () {
    this.getSlideData()
  },
  methods: {
    getSlideData () {
      this.ajax('/archives/getOptionType', {}).then(res => {
        this.SlideData = res.data
      })
    }
  }
}
</script>

<style scoped>
   .goodsfileDetail .top {
      width: 100%;
      /*height:688px;*/
      /*background: #a989c7;*/
     /*float: left;*/
     display: flex;
   }
   .goodsfileDetail .top .spuInfoLeft {
     flex-grow: 1;
      /*width: 70%;*/
      /*height: 100%;*/
      /*background:pink;*/
      /*float: left;*/
   }
   .goodsfileDetail .top .communication {
      width:500px;
      /*height: 664px;*/
      padding: 0 10px 10px 10px;
      /*overflow-y: scroll;*/
      /*overflow-y: scroll;*/
      /*box-sizing: border-box;*/
      /*background: #eee;*/
      /*float: right;*/
   }
   .goodsfileDetail .down {
      width:100%;
   }
  /*面包屑*/
  .goodsFileBread{
    margin-bottom: 15px;
    border-bottom: 1px solid #ddd;
  }
</style>
