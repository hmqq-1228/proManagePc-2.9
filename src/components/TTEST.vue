<template>
  <div class="TTEST">
    <div class="wrap">
      <div class="label">商品品牌：</div>
      <div class="content">
        <div class="cntItem brand" :class="'c_' + item.code" @click="btnClick($event, item.code, 'brand')" v-for="item in pinpaiLevel" :key="item.code">{{item.categoryName}}</div>
      </div>
    </div>
    <div class="wrap" v-show="firstLevel.length > 0">
      <div class="label">一级类目：</div>
      <div class="content">
        <div class="cntItem firstLevel" :class="'c_' + item.code" @click="btnClick($event, item.code, item.typeName)" v-for="item in firstLevel" :key="item.code">{{item.categoryName}}</div>
      </div>
    </div>
    <div class="wrap" v-show="secondLevel.length > 0">
      <div class="label">二级类目：</div>
      <div class="content">
        <div class="cntItem secondLevel" :class="'c_' + item.code" @click="btnClick($event, item.code, item.typeName)" v-for="item in secondLevel" :key="item.code">{{item.categoryName}}</div>
      </div>
    </div>
    <div class="wrap" v-show="thirdLevel.length > 0">
      <div class="label">三级类目：</div>
      <div class="content">
        <div class="cntItem thirdLevel" :class="'c_' + item.code" @click="btnClick($event, item.code, item.typeName)" v-for="item in thirdLevel" :key="item.code">{{item.categoryName}}</div>
      </div>
    </div>
    <div class="wrap" v-show="fourLevel.length > 0">
      <div class="label">四级类目：</div>
      <div class="content">
        <div class="cntItem fourLevel" :class="'c_' + item.code" @click="btnClick($event, item.code, item.typeName)" v-for="item in fourLevel" :key="item.code">{{item.categoryName}}</div>
      </div>
    </div>
    <button @click="pach('single')">单向随机</button>
    <button @click="pach('double')">双向随机</button>
  </div>
</template>

<script>
export default {
  name: 'TTEST',
  data () {
    return {
      msg: '',
      pinpaiLevel: [],
      firstLevel: [],
      secondLevel: [],
      thirdLevel: [],
      fourLevel: [],
      codeArr: [],
      num: 0,
      member: ['董广', '李朝招', '黄猛', '袁鹏', '郭宋恒', '张冉冉', '张荷', '姜海川'],
      food: ['豆浆', '香蕉', '咖啡', '烤肠', '冰淇淋', '绿豆沙', '茶叶蛋', '玉米'],
      memPach: [],
      ying: [],
      shu: []
    }
  },
  created () {
    this.iniBtn()
  },
  watch: {
    num (val, old) {
      var that = this
      this.routerFuc(that.$store.state.codeArr, 'ini')
    }
  },
  methods: {
    pach: function (type) {
      var that = this
      // this.log('length:', this.member.length)
      var obj = {}
      var num01 = this.getRandomInt(0, this.member.length - 1)
      obj.name01 = this.member[num01]
      this.shu.push(obj.name01)
      this.member.splice(num01, 1)
      // j
      var num02 = this.getRandomInt(0, this.member.length - 1)
      obj.name02 = this.member[num02]
      this.ying.push(obj.name02)
      this.member.splice(num02, 1)
      this.memPach.push(obj)
      // j
      if (this.member.length > 1) {
        this.pach(type)
      } else {
        that.log('第一波:')
        for (var t = 0; t < that.memPach.length; t++) {
          var foodRandom = that.getRandomInt(0, that.food.length - 1)
          that.memPach[t].food = that.food[foodRandom]
          that.log(that.memPach[t].name01 + '买' + that.memPach[t].food + ', 送给' + that.memPach[t].name02)
        }
        if (type === 'double') {
          // j
          that.log('第二波:')
          for (var r = 0; r < that.ying.length; r++) {
            var foodRandom2 = that.getRandomInt(0, that.food.length - 1)
            var shuRandom2 = that.getRandomInt(0, that.shu.length - 1)
            that.log(that.ying[r] + '买' + that.food[foodRandom2] + ',,送给' + that.shu[shuRandom2])
            that.shu.splice(shuRandom2, 1)
            // that.ying[r]
          }
        }
      }
    },
    getRandomInt: function (n, m) {
      return Math.floor(Math.random() * (m - n + 1) + n)
    },
    routerFuc: function (arr, isIni) {
      var that = this
      that.actionEmit(arr[that.num].code, isIni)
    },
    actionEmit: function (codeStr, isIni) {
      var that = this
      that.ajax('/archives/getDownByCategory', {categoryStr: codeStr}).then(res => {
        switch (res.data[0].typeName) {
          case '一级类目':
            that.firstLevel = res.data
            that.secondLevel = []
            that.thirdLevel = []
            that.fourLevel = []
            $('.firstLevel').removeClass('active')
            break
          case '二级类目':
            that.secondLevel = res.data
            that.thirdLevel = []
            that.fourLevel = []
            $('.secondLevel').removeClass('active')
            break
          case '三级类目':
            that.thirdLevel = res.data
            that.fourLevel = []
            $('.thirdLevel').removeClass('active')
            break
          case '四级类目':
            that.fourLevel = res.data
            $('.fourLevel').removeClass('active')
            break
          default:
            that.log('case null')
        }
        if (isIni === 'ini' && that.num < (that.$store.state.codeArr.length - 1)) {
          that.num = that.num + 1
        }
        if (that.num === (that.$store.state.codeArr.length - 1) && isIni === 'ini') {
          that.log(123)
          setTimeout(function () {
            var cc = that.$store.state.codeArr
            for (var r = 0; r < cc.length; r++) {
              $('.c_' + cc[r].code).addClass('active').siblings().removeClass('active')
            }
          }, 200)
        }
      })
    },
    iniBtn: function () {
      var that = this
      that.ajax('/archives/getBrandType', {}).then(res => {
        this.pinpaiLevel = res.data.brandType
        if (this.$store.state.codeArr.length > 0) {
          that.routerFuc(this.$store.state.codeArr, 'ini')
        }
      })
    },
    btnClick: function (e, code, type) {
      var that = this
      var obj = e.currentTarget
      $(obj).addClass('active').siblings().removeClass('active')
      if (code) {
        var isthat = false
        var tindex = -1
        for (var t = 0; t < that.codeArr.length; t++) {
          if (that.codeArr[t].type === type) {
            isthat = true
            tindex = t
            break
          }
        }
        var dataobj = {
          code: code,
          type: type
        }
        if (isthat) {
          that.codeArr.splice(tindex, that.codeArr.length, dataobj)
        } else {
          that.codeArr.push(dataobj)
        }
        that.$store.state.codeArr = that.codeArr
      }
      var codeStr = ''
      for (var i = 0; i < that.codeArr.length; i++) {
        var dou = i < (that.codeArr.length - 1) ? ',' : ''
        codeStr = codeStr + that.codeArr[i].code + dou
      }
      that.actionEmit(codeStr)
    }
  }
}
</script>

<style scoped>
.wrap{
  display: flex;
  margin-bottom: 10px;
}
.label{
  padding-top: 5px;
}
  .content{
    display: flex;
  }
  .content div{
    color: #333;
    background-color: #f5f5f8;
    margin-left: 10px;
    padding: 5px;
    border-radius: 6px;
  }
.content div.active{
  color: #fff;
  background-color: #3a8ee6;
}
</style>
