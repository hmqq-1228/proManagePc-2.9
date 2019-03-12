<template>
  <div class="Wellcome">
    <div>Wellcome</div>
    <div>{{querySlideMenuData}} {{querySlideMenuGroupData}}</div>
  </div>
</template>

<script>
export default {
  name: 'Wellcome',
  data () {
    return {
      slideMenuData: [],
      slideMenuGroupData: []
    }
  },
  computed: {
    querySlideMenuData: function () {
      var that = this
      that.slideMenuData = this.$store.state.slideMenu
      return this.slideMenuData
    },
    querySlideMenuGroupData: function () {
      var that = this
      that.slideMenuGroupData = this.$store.state.slideMenuGroup
      return this.$store.state.slideMenuGroup
    }
  },
  watch: {
    slideMenuData (val, old) {
      var that = this
      that.log('123val:', val)
      if (val) {
        if (that.slideMenuGroupData.length > 0) {
          that.getProjectDetail(that.slideMenuGroupData[0].projectList[0].projectUID, '1', '集团战略')
        } else {
          that.getProjectDetail(val[0].projectUID, '2', '', val[0].projectType)
        }
      }
    }
  },
  methods: {
    getProjectDetail: function (id, n, proType, proName) {
      // this.log('getProjectDetail:id:', id)
      // this.log('getProjectDetail:n:', n)
      // this.log('getProjectDetail:proType:', proType)
      // this.log('getProjectDetail:proName:', proName)
      if (proType === '集团战略') {
        // this.log('getProjectDetail：', '走了集团战略')
        if (id) {
          this.$store.state.proId = id
          this.$store.state.navType = n
          this.$router.push('/ProEdit')
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
    }
  }
}
</script>

<style scoped>

</style>
