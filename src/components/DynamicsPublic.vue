<template>
  <div class="DynamicsPublic">
    <div class="tabsSelectTagBox">
      <div class="tabsSelectTagLeft">
        <div class="tabsSelTagItem active">全部</div>
        <div class="tabsSelTagItem">公告</div>
        <div class="tabsSelTagItem">祝福</div>
        <div class="tabsSelTagItem">分享</div>
      </div>
      <div class="tabsSelectTagRight"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DynamicsPublic'
}
</script>

<style scoped>
  .tabsSelectTagBox{
    display: flex;
  }
  .tabsSelectTagLeft{
    display: flex;
  }
  .tabsSelectTagRight{
    width: 100px;
  }
  .tabsSelTagItem{
    cursor: pointer;
    margin-right: 10px;
  }
  .tabsSelTagItem.active{
    color: #005999;
  }
</style>
