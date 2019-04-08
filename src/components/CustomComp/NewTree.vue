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
    // j
  },
  methods: {
    getTree () {
      let that = this
      that.ajax('/myProject/getPlanAndTaskTree', { id: that.firstPlanId }).then(res => {
        if (res.code === 200) {
          that.log('查询树形结构：', res)
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
