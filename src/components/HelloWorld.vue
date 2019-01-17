<template>
  <div class="hello">
   <h1 class="h1" v-on:click="test()">项目管理中心</h1>
    <div class="lala">123</div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  created: function () {
    // console.log($('.lala').text())
  },
  methods: {
    test: function () {
      $('.lala').hide()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
