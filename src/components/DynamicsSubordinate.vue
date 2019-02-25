<template>
  <div class="DynamicsSubordinate">
    <div class="tabsSelectTagBox">
      <div class="tabsSelectTagLeft">
        <div class="tabsSelTagItem active">全部</div>
        <div class="tabsSelTagItem">@我的</div>
        <div class="tabsSelTagItem">回复我的</div>
        <div class="tabsSelTagItem">我关注的</div>
        <div class="tabsSelTagItem">我发布的</div>
        <div class="tabsSelTagItem">部门动态</div>
      </div>
      <div class="tabsSelectTagRight"></div>
    </div>
    <!--无数据的情况在这里说明-->
    <div class="noDataBox">
      <div class="noData">暂无全部动态，您所有相关工作的变化都会显示在这里。</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DynamicsSubordinate'
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
  /*无数据的情况下*/
  .noDataBox{
    margin-top: 50px;
    border: 1px dashed #ddd;
  }
  .noData{
    padding: 50px;
    font-size: 16px;
    color: #ccc;
    text-align: center;
  }
</style>
