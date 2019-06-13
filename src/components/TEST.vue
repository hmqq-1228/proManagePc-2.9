<template>
  <div class="TEST">
    <el-date-picker
      v-model="obj.timeValue"
      type="datetime"
      :picker-options="dateTimeOpt"
      format="yyyy-MM-dd HH:mm:ss"
      value-format="yyyy-MM-dd HH:mm:ss"
      placeholder="选择日期时间">
    </el-date-picker>
    <button type="button" @click="ChangeOpt">ChangeOpt</button>
  </div>
</template>

<script>
export default {
  name: 'TEST',
  data () {
    return {
      msg: '',
      timeValue: '',
      obj: {
        timeValue: ''
      },
      num: 5,
      dateTimeOpt: {
        disabledDate: function (currentDateTime) {
          return false
        }
      }
    }
  },
  created () {
    // j
  },
  watch: {
    timeValue: function (val, old) {
      this.log('timeValue:', val)
    }
  },
  methods: {
    ChangeOpt: function () {
      var that = this
      that.$store.commit('setDateOption', {OptionObj: that.dateTimeOpt, startDate: '2019-04-10 00:00:00', endDate: '2019-04-25 00:00:00'})
    }
  }
}
</script>

<style scoped>
  .box{
    height: 100%;
    padding: 50px;
  }
  .box1{
    width: 500px;
    height: 500px;
    background-color: #aaa;
  }
  .box2{
    background-color: #bbb;
  }
  .box3{
    background-color: #ccc;
  }
</style>
