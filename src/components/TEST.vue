<template>
  <div class="TEST">
    <!--<div class="box box1" v-on:mouseout="box1out">-->
      <!--<div class="box box2" v-on:mouseout="box2out">-->
        <!--<div class="box box3" v-on:mouseout="box3out"></div>-->
      <!--</div>-->
    <!--</div>-->
    <!---->
    <div class="box box1" v-on:mouseleave="box1leave">
      <div class="box box2" v-on:mouseleave="box2leave">
        <div class="box box3" v-on:mouseleave="box3leave"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TEST',
  data () {
    return {
      msg: ''
    }
  },
  created () {
    // j
  },
  watch: {
  },
  methods: {
    box1over: function () {
      this.log('box1')
    },
    box2over: function () {
      this.log('box2')
    },
    box3over: function () {
      this.log('box3')
    },
    box1enter: function () {
      this.log('enter:box1')
    },
    box2enter: function () {
      this.log('enter:box2')
    },
    box3enter: function () {
      this.log('enter:box3')
    },
    box1out: function () {
      this.log('out:box1')
    },
    box2out: function () {
      this.log('out:box2')
    },
    box3out: function () {
      this.log('out:box3')
    },
    box1leave: function () {
      this.log('leave:box1')
    },
    box2leave: function () {
      this.log('leave:box2')
    },
    box3leave: function () {
      this.log('leave:box3')
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
