<template>
  <div class="TEST">
    <div style="width: 600px; height: 600px; background-color: #eee;"></div>
    <div v-on:click="TestBtnClick">TEST BTN</div>
    <!-- 任务详情 start -->
    <component v-show="value4" v-bind:is="compArr.TaskDetailCompTest"
               v-bind:taskDrawerOpen="value4"
               v-on:CommonThrow="CommonThrowFuc"
               :nodeId="taskId2">
    </component>
    <!--<Drawer class="drawerScroll" :closable="false" width="750%" v-model="value4">-->
      <!--<component v-bind:is="compArr.TaskDetailComp"-->
                 <!--v-bind:taskDrawerOpen="value4"-->
                 <!--v-bind:modifyTaskRes="modifyTaskRes"-->
                 <!--v-on:FilePreEmit="GetFilePreData"-->
                 <!--v-on:toPlanDetail="toPlanDetailFuc"-->
                 <!--v-on:showEditForm="showEditFormFuc"-->
                 <!--v-on:ActionResThrow="ActionResThrowFuc"-->
                 <!--v-on:TaskDelCallback="TaskDelCallbackFuc"-->
                 <!--:nodeId="taskId2">-->
      <!--</component>-->
    <!--</Drawer>-->
  </div>
</template>

<script>
import TaskDetailComp from './CustomComp/TaskDetailComp.vue'
import TaskDetailCompTest from './CustomComp/TaskDetailCompTest.vue'
export default {
  name: 'TEST',
  components: {
    TaskDetailComp,
    TaskDetailCompTest
  },
  data () {
    return {
      compArr: {
        TaskDetailComp: 'TaskDetailComp',
        TaskDetailCompTest: 'TaskDetailCompTest'
      },
      value4: false,
      taskId2: 'J8a33ea31fc514b61ad14bb15b65856c9'
    }
  },
  created () {
    // j
  },
  methods: {
    TestBtnClick: function () {
      this.value4 = true
    },
    CommonThrowFuc: function (obj) {
      if (obj.type === 'drawerKK') {
        this.value4 = obj.drawerKK
      }
    }
  }
}
</script>

<style scoped>

</style>
