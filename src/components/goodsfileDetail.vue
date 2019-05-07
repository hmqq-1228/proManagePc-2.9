<template>
  <div class="goodsfileDetail">
    <!--顶部面包屑-->
    <div class="goodsFileBread">贝豪产品库>>可优比>>玩教>>手抓类</div>
    <div class="top">
      <!--SPU信息-->
      <GoodsFileSpuInfo></GoodsFileSpuInfo>
    </div>
   <!--SKU信息-->
   <div class="down"></div>
  </div>
</template>

<script>
import GoodsFileSpuInfo from './CustomComp/GoodsFileSpuInfo.vue'
export default {
  components: {
    GoodsFileSpuInfo
  },
  name: 'goods'
}
</script>

<style scoped>
   .goodsfileDetail .top {
      width: 100%;
      /*height:600px;*/
      /*background: #a989c7;*/
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
