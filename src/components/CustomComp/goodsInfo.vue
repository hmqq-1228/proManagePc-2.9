<template>
<div class="goodsInfo">
  <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
      <FormItem label="商品名称" prop="goodsName">
          <Input v-model="formValidate.goodsName" placeholder="请输入商品名称" :maxlength="20"/>
      </FormItem>
      <FormItem label="公司项目" prop="categoryType">
          <Select v-model="formValidate.categoryType" placeholder="请选择项目类型">
            <Option value="KUB">KUB</Option>
            <Option value="DI">DI</Option>
          </Select>
      </FormItem>
      <FormItem label="品牌类目" prop="code">
          <Cascader :data="options" trigger="hover" @on-change="changeTree" :value="values"></Cascader>
          <!-- <el-cascader :options="options" :show-all-levels="false" expand-trigger="hover"></el-cascader> -->
      </FormItem>
      <FormItem label="爆品等级" prop="explosiveLevel">
          <Select v-model="formValidate.explosiveLevel" placeholder="请选择爆品等级">
            <Option :value="item.dictName" v-for="(item, index) in optionType.explosiveList" v-bind:key="index">{{item.dictName}}</Option>
          </Select>
      </FormItem>
      <FormItem label="开发进度" prop="developProgress">
          <Select v-model="formValidate.developProgress" placeholder="请选择开发进度">
            <Option :value="item.dictName" v-for="(item, index) in optionType.developProgressList" v-bind:key="index">{{item.dictName}}</Option>
          </Select>
      </FormItem>
      <FormItem label="新品类型" prop="newProductType">
          <Select v-model="formValidate.newProductType" placeholder="请选择新品类型">
             <Option :value="item.dictName" v-for="(item, index) in optionType.newProductList" v-bind:key="index">{{item.dictName}}</Option>
          </Select>
      </FormItem>
      <FormItem label="是否选品" prop="selectionFlag">
          <el-switch
          v-model="editValidate.selectionFlag"
          >
      </el-switch>
      </FormItem>
      <FormItem label="预计上架时间" prop="expectedShelfTime">
          <DatePicker type="date" v-bind:value="formValidate.expectedShelfTime" format="yyyy-MM-dd HH:mm:ss" @on-change="startDateChange" placeholder="请输入上架时间" style="width: 100%"></DatePicker>
      </FormItem>
      <!--基本信息 项目附件-->
      <FormItem label="上传图片" prop="desc2">
          <component v-bind:is="compArr.FileUploadComp" v-on:FilePreEmit="GetFilePreData" v-bind:FileDataList="proFileList" fileFormId="goodsInfo" v-bind:clearInfo="IsClear" v-on:FileDataEmit="GetFileInfo"></component>
      </FormItem>
      <FormItem label="备注" prop="goodsNames">
          <i-input type="textarea" :maxlength="200" placeholder="请输入..." :rows="5"></i-input>
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
      // 引入组件
      values: [],
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
        explosiveLevel: '',
        developProgress: '',
        newProductType: '',
        categoryType: ''
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
        selectionFlag: false,
        attachment: ''
      },
      ruleValidate: {
        goodsName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请选择品牌类目', trigger: 'change' }
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
      options: []
    }
  },
  components: {
    FileUploadComp
  },
  watch: {
    ProBaseInfoShow (val, old) {
      this.getDetail()
    }
  },
  created () {
    this.getOptionType()
    this.getTree()
    // this.getDetail()
  },
  methods: {
    // 获取详情
    getDetail () {
      let that = this
      that.ajax('/goods/getGoodsDetail', {projectId: that.proId}).then(res => {
        if (res.code === 200) {
          that.formValidate = res.data
          that.values.push(that.formValidate.categoryCode)
          console.log(that.values)
          that.proFileList = []
          var fileListArr = []
          for (var i = 0; res.data.fileList && i < res.data.fileList.length; i++) {
            var obj = {
              attachmentId: res.data.fileList[i].id,
              fileName: res.data.fileList[i].showName,
              previewUrl: res.data.fileList[i].previewUrl
            }
            fileListArr.push(obj)
          }
          that.proFileList = that.proFileList.concat(fileListArr)
          that.editValidate.selectionFlag = res.data.selectionFlag
        }
      })
    },
    // 选择类目
    changeTree (val) {
      this.formValidate.code = val[val.length - 1]
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
    // 获取品排类目
    getTree () {
      let that = this
      that.ajax('/goods/getGoodsClassifyTree', {}).then(res => {
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
      this.$refs[name].validate((valid) => {
        if (valid) {
          console.log(1)
          that.editValidate.categoryType = that.formValidate.categoryType
          that.editValidate.projectId = that.proId
          that.editValidate.goodsName = that.formValidate.goodsName
          that.editValidate.code = that.formValidate.code
          that.editValidate.explosiveLevel = that.formValidate.explosiveLevel
          that.editValidate.developProgress = that.formValidate.developProgress
          that.editValidate.newProductType = that.formValidate.newProductType
          that.editValidate.expectedShelfTime = that.DateFormat(that.formValidate.expectedShelfTime)
          that.editValidate.selectionFlag = that.formValidate.selectionFlag
          that.editValidate.attachment = that.SetFileIdStr()
          if (that.editValidate.selectionFlag === true) {
            that.editValidate.selectionFlag = '1'
          } else {
            that.editValidate.selectionFlag = '0'
          }
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
