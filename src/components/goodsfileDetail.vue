<template>
   <div class="goodsfileDetail">
      <div class="top">
         <!--SPU信息-->
         <div class="spuInfo">

         </div>
         <!--沟通-->
         <div class="communication">

         </div>
      </div>
     <!--SKU信息-->
     <div class="down"></div>
   </div>
</template>

<script>
export default {
  name: 'goods'
}
</script>

<style scoped>
   .goodsfileDetail .top {
      width: 100%;
      /*height:600px;*/
      background: #a989c7;
   }
   .goodsfileDetail .top .spuInfo {
      width: 70%;
      height: 100%;
      /*background:pink;*/
      float: left;
   }
   .goodsfileDetail .top .communication {
      width:30%;
      height: 100%;
      /*background: #eee;*/
      float: right;
   }
   .goodsfileDetail .down {
      width:100%;
   }
</style>
