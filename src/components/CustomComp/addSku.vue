<template>
  <div class="goodsInfo">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="110">
      <FormItem label="SKU编码" prop="skuCode">
        <Input v-model="formValidate.skuCode" placeholder="请输入SKU编码" :maxlength="20" size="large"/>
      </FormItem>
      <FormItem label="年份" prop="yearDigital">
        <!--<Input v-model="formValidate.yearDigital" placeholder="请输入年份" :maxlength="20" size="large" type="number"/>-->
        <DatePicker type="year" placeholder="请选择年份" @on-change="changeYear" style="width: 100%" v-model="formValidate.yearDigital"></DatePicker>
      </FormItem>
      <FormItem label="零售价" prop="retailPrice">
        <Input v-model="formValidate.retailPrice" placeholder="请输入零售价" :maxlength="20" size="large" number/>
      </FormItem>
      <FormItem label="吊牌价" prop="tagPrice">
        <Input v-model="formValidate.tagPrice" placeholder="请输入吊牌价" :maxlength="20" size="large" number/>
      </FormItem>
      <FormItem label="固定成本" prop="costPrice">
        <Input v-model="formValidate.costPrice" placeholder="请输入成本价" :maxlength="20" size="large" number/>
      </FormItem>
      <FormItem label="条码" prop="barCode">
        <Input v-model="formValidate.barCode" placeholder="请输入条码" :maxlength="20" size="large"/>
      </FormItem>
      <FormItem label="规格" prop="standards">
        <Input v-model="formValidate.standards" placeholder="请输入规格" :maxlength="20" size="large"/>
      </FormItem>
      <FormItem label="第三方SKU编码" prop="thirdSkuCode">
        <Input v-model="formValidate.thirdSkuCode" placeholder="请输入第三方SKU编码" :maxlength="20" size="large"/>
      </FormItem>
      <FormItem label="颜色" prop="color">
        <el-color-picker v-model="formValidate.color" style="width: 120px"></el-color-picker>
      </FormItem>
      <!--基本信息 项目附件-->
      <FormItem label="上传图片" prop="desc2">
        <component v-bind:is="compArr.FileUploadComp" v-on:FilePreEmit="GetFilePreData" v-bind:FileDataList="proFileList" fileFormId="goodsInfo" v-bind:clearInfo="IsClear" v-on:FileDataEmit="GetFileInfo" :filUrl="filUrl" :buttonStr="buttonStr" :selectType="selectType" :limtImg="limtImg"></component>
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
    const retailPrice = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入零售价'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入正确格式'))
        } else {
          callback()
        }
      }, 0)
    }
    const tagPrice = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入吊牌价'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入正确格式'))
        } else {
          callback()
        }
      }, 0)
    }
    const costPrice = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入成本价'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入正确格式'))
        } else {
          callback()
        }
      }, 0)
    }
    return {
      buttonStr: '选择图片',
      selectType: '图片',
      limtImg: true,
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
        // color: '',
        skuCode: '',
        retailPrice: '',
        costPrice: '',
        tagPrice: '',
        yearDigital: '',
        barCode: '',
        thirdSkuCode: '',
        standards: ''
      },
      editValidate: {
        color: '',
        skuCode: '',
        retailPrice: '',
        costPrice: '',
        tagPrice: '',
        yearDigital: '',
        barCode: '',
        thirdSkuCode: '',
        attachmentId: '',
        spuId: this.$route.params.spuId,
        standards: ''
      },
      ruleValidate: {
        skuCode: [
          { required: true, message: '请输入SKU编码', trigger: 'blur' }
        ],
        color: [
          { required: true, message: '请选择颜色', trigger: 'blur' }
        ],
        yearDigital: [
          { required: true, type: 'string', message: '请选择年份', trigger: 'change' }
        ],
        retailPrice: [
          // { required: true, message: '请输入零售价', trigger: 'blur' },
          // { type: 'number', message: '请输入正确格式', trigger: 'blur' }
          { required: true, validator: retailPrice, trigger: 'blur' }
        ],
        tagPrice: [
          // { required: true, message: '请输入吊牌价', trigger: 'blur' }
          { required: true, validator: tagPrice, trigger: 'blur' }
        ],
        costPrice: [
          // { required: true, message: '请输入成本价', trigger: 'blur' }
          { required: true, validator: costPrice, trigger: 'blur' }
        ],
        standards: [
          { required: true, message: '请输入规格', trigger: 'blur' }
        ],
        barCode: [
          { required: true, message: '请输入条码', trigger: 'blur' }
        ],
        thirdSkuCode: [
          { required: true, message: '请输入第三方SKU编码', trigger: 'blur' }
        ]
      },
      options: []
    }
  },
  components: {
    FileUploadComp
  },
  watch: {
  },
  created () {
  },
  methods: {
    changeYear (e) {
      this.formValidate.yearDigital = e
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
      this.$refs[name].validate((valid) => {
        if (valid) {
          that.editValidate.skuCode = that.formValidate.skuCode
          that.editValidate.color = that.formValidate.color
          that.editValidate.standards = that.formValidate.standards
          that.editValidate.retailPrice = that.formValidate.retailPrice
          that.editValidate.costPrice = that.formValidate.costPrice
          that.editValidate.tagPrice = that.formValidate.tagPrice
          that.editValidate.yearDigital = that.formValidate.yearDigital
          that.editValidate.barCode = that.formValidate.barCode
          that.editValidate.thirdSkuCode = that.formValidate.thirdSkuCode
          if (that.FileUploadArr.length > 0) {
            that.editValidate.attachmentId = that.SetFileIdStr()
          } else {
            that.editValidate.attachmentId = ''
          }
          that.ajax('/archives/addSku', JSON.stringify(that.editValidate)).then(res => {
            that.$emit('saveSuccess', res, that.formValidate)
            if (res.code === 200) {
              that.IsClear = true
              that.$Message.success('保存成功')
              that.formValidate = {
                skuCode: '',
                retailPrice: '',
                costPrice: '',
                tagPrice: '',
                yearDigital: '',
                barCode: '',
                thirdSkuCode: '',
                standards: ''
              }
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
