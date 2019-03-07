<template>
  <div class="TestUpload">
    <div class="uploadBox">
      <div class="uploadItem">
        <!-- fileFormId 此属性需自定义值，不可在上下文中重复 -->
        <component v-bind:is="FileUploadComp" fileFormId="proHistory" v-bind:clearInfo="IsClear" v-on:FileDataEmit="GetFileInfo"></component>
      </div>
      <div class="uploadItem"><Button type="primary" >回复</Button></div>
    </div>
  </div>
</template>

<script>
import FileUploadComp from './FileUploadComp.vue'
export default {
  name: 'TestUpload',
  components: {
    FileUploadComp
  },
  data () {
    return {
      // 附件上传 是否让子组件清空文件
      IsClear: false,
      // 附件上传 附件ID拼接成字符串
      FileUploadIdStr: '',
      // 接收到的组件数组
      FileUploadArr: [],
      // 引入附件上传组件
      FileUploadComp: 'FileUploadComp'
    }
  },
  methods: {
    // 获取附件上传组件发来的附件信息
    GetFileInfo (obj) {
      if (obj) {
        this.IsClear = false
      }
      this.FileUploadArr = obj
    },
    // 拼接附件上传的id为字符串
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
    // 附件上传示例 新建项目 立即创建项目 (空白模板) 提交基本信息
    submitForm (formName) {
      var that = this
      // var fileV = $('#myfile').val()
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (that.Mid) {
            that.createProFormLoading = true
            that.ajax('/myProject/addBaseInfo',
              {
                projectName: that.ruleForm.projectName,
                projectType: that.ruleForm.projectType,
                startDate: that.ruleForm.value2[0],
                endDate: that.ruleForm.value2[1],
                projectManager: that.ruleForm.projectManager,
                projectManagerID: that.Mid,
                introduction: that.ruleForm.introduction,
                // 1、 此处拼接多文件id为字符串
                attachmentId: that.SetFileIdStr(),
                // 如果类型是产品研发，下面的分类id
                projectClassifyId: that.ruleForm.projectClassifyId
              }).then(res => {
              if (res.code === 200) {
                // 2、 表单提交成功后告知file组件清空file
                that.IsClear = true
              } else {
                this.$message({
                  type: 'error',
                  message: res.msg
                })
                that.createProFormLoading = false
              }
            })
          } else {
            that.loading = false
            that.$message.error('请重新选择项目负责人')
          }
        } else {
          that.loading = false
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
  .uploadBox{
    width: 700px;
    height: 200px;
    margin-top: 20px;
    border: 1px solid #ddd;
    background-color: #eee;
    display: flex;
    justify-content: space-between;
  }
</style>
