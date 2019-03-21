<template>
  <!-- 编辑计划 修改计划 表单组件 -->
  <div class="ModifyPlan">
    <el-form ref="modify" :model="detailform" :rules="planRules" label-width="80px">
      <el-form-item label="计划名称" prop="name" maxlength="100" width="100">
        <el-input class="planNameIpt" v-model="detailform.name" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="开始时间" prop="date1">
        <el-col :span="11">
          <el-date-picker type="date"
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd"
                          placeholder="选择日期"
                          v-model="detailform.date1"
                          :picker-options="pickerOptionsPlanSt"
          ></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="结束时间" prop="date2">
        <el-col :span="11">
          <el-date-picker type="date"
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd"
                          placeholder="选择日期"
                          v-model="detailform.date2"
                          :picker-options="pickerOptionsPlanEt"
          ></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="计划描述" maxlength="100" width="100">
        <el-input class="planNameIpt" type="textarea" :rows="2" v-model="detailform.description"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="modifySub('modify')">保存</el-button>
        <el-button @click="ModifyPlanCancel('modify')">关 闭</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'ModifyPlan',
  props: ['nodeId', 'DrawerOpen'],
  data () {
    return {
      // 编辑计划
      detailform: {
        name: '',
        dataList: [],
        date1: '',
        date2: '',
        description: ''
      },
      // 编辑计划
      planRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
        // date1: [
        //   { type: 'string', required: true, message: '请选择开始日期', trigger: 'change' }
        // ],
        // date2: [
        //   { type: 'string', required: true, message: '请选择结束日期', trigger: 'change' }
        // ]
      },
      pickerOptionsPlanSt: {},
      pickerOptionsPlanEt: {},
      editPlanPayload: {
        planId: '1',
        name: '',
        start: '',
        finish: '',
        description: ''
      }
    }
  },
  watch: {
    DrawerOpen (val, old) {
      if (val) {
        this.getPlanTaskDetail()
      }
    }
  },
  methods: {
    // 取消
    ModifyPlanCancel: function (form) {
      this.$emit('ModifyPlanCallback', 'shut')
    },
    // 编辑计划 保存
    // 修改点击了保存
    modifySub: function (formName) {
      // this.alert('计划点击了保存')
      var that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          that.loading = true
          that.editPlanPayload.planId = that.nodeId
          that.editPlanPayload.name = this.detailform.name
          that.editPlanPayload.start = this.detailform.date1
          that.editPlanPayload.finish = this.detailform.date2
          var st = new Date(this.detailform.date1).getTime()
          var et = new Date(this.detailform.date2).getTime()
          that.editPlanPayload.description = this.detailform.description
          if (st < et) {
            that.ajax('/myProject/editPlan', that.editPlanPayload).then(res => {
              that.log('editPlan:', res)
              that.$emit('ModifyPlanCallback', res)
              if (res.code === 200) {
                that.$message.success(res.msg)
                that.formClear()
              } else {
                that.loading = false
                that.$message.error(res.msg)
              }
            })
          } else {
            that.$message.warning('开始时间不能大于结束时间')
          }
        }
      })
    },
    formClear () {
      this.$refs['modify'].resetFields()
    },
    getPlanTaskDetail () {
      var that = this
      that.ajax('/myProject/getPlanOrTaskDetail', {id: that.nodeId}).then(res => {
        console.log('计划详情:', res)
        if (res.code === 200) {
          that.detailform.name = res.data.name
          that.detailform.date1 = res.data.start
          that.detailform.date2 = res.data.finish
          that.detailform.description = res.data.description
        } else {
          // j
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
