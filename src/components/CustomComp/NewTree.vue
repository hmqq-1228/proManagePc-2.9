<template>
  <div class="NewTree">
    <div class="proName">2019战略项目</div>
  </div>
</template>

<script>
export default {
  name: 'NewTree',
  props: ['proId', 'firstPlanId', 'TreeNodeId'],
  data () {
    return {
      msg: ''
    }
  },
  created () {
    // this.getTree()
  },
  watch: {
    firstPlanId (val, old) {
      this.log('111111:', val)
      if (val) {
        this.getTree()
      }
    }
  },
  methods: {
    getTree () {
      let that = this
      that.log('firstPlanId:', that.firstPlanId)
      that.ajax('/myProject/getPlanAndTaskTree', { id: that.firstPlanId }).then(res => {
        if (res.code === 200) {
          that.log('查询新树：', res)
          that.listTree = []
          that.listTree = res.data
          // that.listTree.forEach((item, index) => {
          //   item['show'] = true
          // })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
