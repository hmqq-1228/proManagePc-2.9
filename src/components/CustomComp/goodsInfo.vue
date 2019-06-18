<template>
<div class="goodsInfo">
  <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
      <FormItem label="商品名称" prop="goodsName">
          <Input v-model="formValidate.goodsName" placeholder="请输入商品名称" :maxlength="20" size="large"/>
      </FormItem>
      <FormItem label="商品编码" prop="goodsCode">
      <Input v-model="formValidate.goodsCode" placeholder="请输入商品编码" :maxlength="20" size="large"/>
      </FormItem>
      <FormItem label="品牌类型" prop="categoryType">
          <Select v-model="formValidate.categoryType" placeholder="请选择品牌类型" size="large" @on-change="changeBrand">
            <Option :value="item.code" v-for="(item, index) in optionBrand" v-bind:key="index">{{item.categoryName}}</Option>
          </Select>
      </FormItem>
      <FormItem label="品牌类目" prop="code" :require="true">
          <Cascader :data="options" trigger="hover" @on-change="changeTree" placeholder="请选择品牌类型后选择品牌类目" :value="values" size="large"></Cascader>
          <!-- <el-cascader :options="options" :show-all-levels="false" expand-trigger="hover"></el-cascader> -->
      </FormItem>
      <FormItem label="爆品等级" prop="explosiveLevel">
          <Select v-model="formValidate.explosiveLevel" placeholder="请选择爆品等级" size="large">
            <Option :value="item.dictCode" v-for="(item, index) in optionType.explosiveList" v-bind:key="index">{{item.dictName}}</Option>
          </Select>
      </FormItem>
      <FormItem label="开发进度" prop="developProgress">
          <Select v-model="formValidate.developProgress" placeholder="请选择开发进度" size="large">
            <Option :value="item.dictCode" v-for="(item, index) in optionType.developProgressList" v-bind:key="index">{{item.dictName}}</Option>
          </Select>
      </FormItem>
      <FormItem label="新品类型" prop="newProductType">
          <Select v-model="formValidate.newProductType" placeholder="请选择新品类型" size="large">
             <Option :value="item.dictCode" v-for="(item, index) in optionType.newProductList" v-bind:key="index">{{item.dictName}}</Option>
          </Select>
      </FormItem>
      <FormItem label="是否选品" prop="selectionFlag">
          <el-switch
             v-model="selectionFlag"  @change = "change"
          >
      </el-switch>
      </FormItem>
      <FormItem label="预计上架时间" prop="expectedShelfTime">
          <DatePicker type="date" v-bind:value="formValidate.expectedShelfTime" format="yyyy-MM-dd" @on-change="startDateChange" placeholder="请输入上架时间" style="width: 100%" size="large"></DatePicker>
      </FormItem>
      <!--基本信息 项目附件-->
      <FormItem label="上传图片" prop="desc2">
          <component v-bind:is="compArr.FileUploadComp" v-on:FilePreEmit="GetFilePreData" goodsFlag="1" v-bind:FileDataList="proFileList" fileFormId="goodsInfo" v-bind:clearInfo="IsClear" v-on:FileDataEmit="GetFileInfo" :filUrl="filUrl"></component>
      </FormItem>
      <FormItem label="商品备注" prop="remark">
          <i-input v-model="formValidate.remark" type="textarea" :maxlength="200" placeholder="请输入..." :rows="5"></i-input>
      </FormItem>
      <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
          <Button @click="cancel" style="margin-left: 8px">取消</Button>
      </FormItem>
      <!-- <el-cascader :options="options" :show-all-levels="false" expand-trigger="hover"></el-cascader> -->
  </Form>
</div>
</template>

<script>
import FileUploadComp from '../CustomComp/FileUploadComp.vue'
export default {
  name: 'goodsInfo',
  props: ['proId', 'fileFormId', 'ProBaseInfoShow'],
  data () {
    return {
      value5: '',
      selectionFlag: false,
      // 引入组件
      values: [],
      // 上传图片路径
      filUrl: '/file/uploadGoodsFileAjax',
      FileUploadArr: [],
      compArr: {
        FileUploadComp: 'FileUploadComp'
      },
      // 附件上传 回显
      proFileList: [],
      // 附件上传 组件 是否让子组件清空文件 新组件
      IsClear: false,
      optionType: {},
      formValidate: {
        goodsName: '',
        code: '',
        explosiveLevel: 'A',
        developProgress: '1',
        newProductType: '1',
        categoryType: 'K',
        goodsCode: ''
      },
      editValidate: {
        categoryType: '',
        projectId: '',
        goodsName: '',
        code: '',
        explosiveLevel: '',
        developProgress: '',
        newProductType: '',
        expectedShelfTime: '',
        selectionFlag: '0',
        attachmentId: '',
        remark: '',
        goodsCode: ''
      },
      ruleValidate: {
        goodsName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        categoryType: [
          { required: true, message: '请输入品牌', trigger: 'change' }
        ],
        goodsCode: [
          { required: true, message: '请输入商品编码', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请选择品牌类目', trigger: 'blur' }
        ],
        explosiveLevel: [
          { required: true, message: '请选择爆品等级', trigger: 'change' }
        ],
        developProgress: [
          { required: true, message: '请选择开发进度', trigger: 'change' }
        ],
        newProductType: [
          { required: true, message: '请选择新品类型', trigger: 'change' }
        ]
      },
      options: [],
      optionBrand: [],
      brandType: 'K'
    }
  },
  components: {
    FileUploadComp
  },
  watch: {
    ProBaseInfoShow () {
      this.getDetail()
    }
  },
  created () {
    this.getOptionType()
    this.getTree()
    this.getBrand()
    // this.getDetail()
  },
  methods: {
    changeBrand (val) {
      this.brandType = val
      let that = this
      that.ajax('/goods/getGoodsClassifyTree', {brandType: this.brandType}).then(res => {
        if (res.code === 200) {
          this.options = res.data
        }
      })
    },
    change (val) {
      this.selectionFlag = val
      if (val === true) {
        this.editValidate.selectionFlag = '1'
      } else {
        this.editValidate.selectionFlag = '0'
      }
    },
    // 获取详情
    getDetail () {
      let that = this
      that.ajax('/goods/getGoodsDetail', {projectId: that.proId}).then(res => {
        if (res.code === 200) {
          if (res.data) {
            // that.formValidate.explosiveLevel
            if (res.data.explosiveLevel !== '') {
              that.formValidate = res.data
            } else {
              that.formValidate = {
                goodsName: '',
                code: '',
                explosiveLevel: 'A',
                developProgress: '1',
                newProductType: '1',
                categoryType: 'K',
                goodsCode: ''
              }
            }
          }
          that.values = []
          that.values = that.formValidate.categoryCode
          that.editValidate.code = that.values[that.values.length - 1]
          that.formValidate.code = that.values[that.values.length - 1]
          that.proFileList = []
          var fileListArr = []
          for (var i = 0; res.data.attachmentId && i < res.data.attachmentId.length; i++) {
            var obj = {
              attachmentId: res.data.attachmentId[i].id,
              fileName: res.data.attachmentId[i].showName,
              previewUrl: res.data.attachmentId[i].previewUrl
            }
            fileListArr.push(obj)
          }
          that.proFileList = that.proFileList.concat(fileListArr)
          that.FileUploadArr = that.proFileList
          console.log(that.FileUploadArr)
          // that.editValidate.attachmentId = that.SetFileIdStr()
          // console.log(that.editValidate.attachmentId)
          that.selectionFlag = res.data.selectionFlag
          if (that.selectionFlag === true) {
            that.editValidate.selectionFlag = '1'
          } else {
            that.editValidate.selectionFlag = '0'
          }
        }
      })
    },
    // 选择类目
    changeTree (val) {
      this.editValidate.code = val[val.length - 1]
    },
    // 选择上架时间
    startDateChange (date) {
      this.formValidate.expectedShelfTime = date
    },
    // 获取下拉窗的内容
    getOptionType () {
      let that = this
      that.ajax('/goods/getOptionType', {}).then(res => {
        if (res.code === 200) {
          this.optionType = res.data
        }
      })
    },
    getBrand () {
      let that = this
      that.ajax('/archives/getBrandType', {}).then(res => {
        if (res.code === 200) {
          this.optionBrand = res.data.brandType
          this.optionBrand.pop()
          this.optionBrand.shift()
        }
      })
    },
    // 获取品排类目
    getTree () {
      let that = this
      that.ajax('/goods/getGoodsClassifyTree', {brandType: 'K'}).then(res => {
        if (res.code === 200) {
          this.options = res.data
        }
      })
    },
    // 附件上传 获取附件上传组件发来的附件信息 新组件
    GetFileInfo (obj) {
      if (obj) {
        this.IsClear = false
      }
      this.FileUploadArr = obj
    },
    // 图片预览 接着往上传
    GetFilePreData: function (obj) {
      this.$emit('FilePreEmit', obj)
    },
    // 附件上传 拼接附件上传的id为字符串
    SetFileIdStr () {
      var that = this
      var FileIdStr = ''
      for (var i = 0; i < that.FileUploadArr.length; i++) {
        var splitIcon = ','
        if (i === that.FileUploadArr.length - 1) {
          splitIcon = ''
        }
        FileIdStr = FileIdStr + that.FileUploadArr[i].attachmentId + splitIcon
      }
      that.FileUploadArr = []
      return FileIdStr
    },
    // 取消弹窗
    cancel () {
      this.$emit('cancel')
    },
    // 提交
    handleSubmit (name) {
      var that = this
      that.formValidate.code = this.editValidate.code
      this.$refs[name].validate((valid) => {
        if (valid) {
          that.editValidate.categoryType = that.formValidate.categoryType
          that.editValidate.projectId = that.proId
          that.editValidate.goodsName = that.formValidate.goodsName
          // that.editValidate.code = that.formValidate.code
          that.editValidate.explosiveLevel = that.formValidate.explosiveLevel
          that.editValidate.developProgress = that.formValidate.developProgress
          that.editValidate.newProductType = that.formValidate.newProductType
          that.editValidate.remark = that.formValidate.remark
          that.editValidate.goodsCode = that.formValidate.goodsCode
          that.editValidate.expectedShelfTime = that.DateFormat(that.formValidate.expectedShelfTime)
          // that.editValidate.selectionFlag = that.formValidate.selectionFlag
          if (that.FileUploadArr.length > 0) {
            that.editValidate.attachmentId = that.SetFileIdStr()
            console.log(that.editValidate.attachmentId)
          } else {
            that.editValidate.attachmentId = ''
          }
          // if (that.editValidate.selectionFlag === true) {
          //   that.editValidate.selectionFlag = '1'
          // } else {
          //   that.editValidate.selectionFlag = '0'
          // }
          that.ajax('/goods/editGoodsInfo', that.editValidate).then(res => {
            that.$emit('ProBaseInfoCallback', res)
            // TaskDistributeCallback
            if (res.code === 200) {
              that.IsClear = true
            }
          })
        } else {
          this.$Message.error('有未填写的必填项!')
        }
      })
    },
    // 时间格式化
    DateFormat (date) {
      var finalFarmat = ''
      var newdate = new Date(date)
      var y = newdate.getFullYear()
      var mon = (newdate.getMonth() + 1) < 10 ? ('0' + (newdate.getMonth() + 1)) : (newdate.getMonth() + 1)
      var d = newdate.getDate() < 10 ? ('0' + newdate.getDate()) : newdate.getDate()
      var h = newdate.getHours() < 10 ? ('0' + newdate.getHours()) : newdate.getHours()
      var min = newdate.getMinutes() < 10 ? ('0' + newdate.getMinutes()) : newdate.getMinutes()
      var s = newdate.getSeconds() < 10 ? ('0' + newdate.getSeconds()) : newdate.getSeconds()
      finalFarmat = y + '-' + mon + '-' + d + ' ' + h + ':' + min + ':' + s
      return finalFarmat
    }
  }
}
</script>
