<template>
  <div class="Wellcome">
    <div>Wellcome</div>
    <div>{{listenerNavList?'':''}}</div>
    <!--<Spin size="large" fix v-if="spinShow"></Spin>-->
  </div>
</template>

<script>
export default {
  name: 'Wellcome',
  data () {
    return {
      spinShow: true
    }
  },
  computed: {
    listenerNavList: function () {
      var that = this
      if (that.$store.state.navList.length > 0) {
        switch (that.$store.state.navList[0].menuName) {
          case '集团战略':
            if (that.$store.state.proId) {
              // j
            } else {
              that.$store.state.proId = that.$store.state.navList[0].dataList[0].menuId
            }
            that.$router.push('/goodsDetail')
            break
          case '商品管理':
            that.$router.push('/' + that.$store.state.navList[0].dataList[0].path)
            break
          case '工作报告':
            that.$router.push('/' + that.$store.state.navList[0].dataList[0].path)
            break
          default:
            that.$router.push('/' + that.$store.state.navList[0].path)
        }
        // if (that.$store.state.navList[0].menuName === '集团战略') {
        //   if (that.$store.state.proId) {
        //     // j
        //   } else {
        //     that.$store.state.proId = that.$store.state.navList[0].dataList[0].menuId
        //   }
        //   that.$router.push('/goodsDetail')
        // } else if (that.$store.state.navList[0].menuName === '商品管理') {
        //   that.$router.push('/' + that.$store.state.navList[0].dataList[0].path)
        // } else {
        //   that.$router.push('/' + that.$store.state.navList[0].path)
        // }
      }
      return this.$store.state.navList
    }
  },
  watch: {
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
