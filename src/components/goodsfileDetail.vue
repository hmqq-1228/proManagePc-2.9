<template>
   <div class="goodsfileDetail">
      <div class="top">
         <!--SPU信息-->
         <div class="spuInfo">

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
    communication
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
      /*height:600px;*/
      /*background: #a989c7;*/
     float: left;
   }
   .goodsfileDetail .top .spuInfo {
      width: 70%;
      height: 100%;
      /*background:pink;*/
      float: left;
   }
   .goodsfileDetail .top .communication {
      width:500px;
      height: 100%;
      /*background: #eee;*/
      float: right;
   }
   .goodsfileDetail .down {
      width:100%;
   }
</style>
