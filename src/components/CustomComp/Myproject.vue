<template>
  <div>
    <div class="projectListTop">
      <div>
        <el-input style="width: 350px;" v-model="inputProject" placeholder="请输入项目名称"></el-input>
        <el-select v-model="valueSelect" placeholder="请选择">
          <el-option
            v-for="item in optionsProject"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="tabbox">
      <Table highlight-row ref="currentRowTable" :columns="columns3" :data="tableData" @on-current-change="tableSelect" @on-row-dblclick="dbClick"></Table>
      <div style="text-align: center;margin-top: 20px;">
        <el-pagination
          background
          small
          :current-page="currentPage"
          @current-change="getProjectPageNum($event)"
          layout="total, prev, pager, next"
          :total="tableDataRow">
        </el-pagination>
      </div>
      <div style="margin-bottom: 25px;">
        <el-button type="primary" style="float: right" @click="ok">确定</el-button>
        <el-button style="float: right;margin-right: 15px;" @click="cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'linkProject',
  props: {
    url: {
      type: String,
      default: '/myProject/myProjectView'
    }
  },
  data () {
    return {
      columns3: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '项目名称',
          key: 'projectName'
        },
        {
          title: '负责人',
          key: 'projectManager'
        },
        {
          title: '开始日期',
          key: 'startDate'
        },
        {
          title: '结束日期',
          key: 'endDate'
        }
      ],
      tableData: [],
      compArr: {
        FileUploadComp: 'FileUploadComp'
      },
      inputProject: '',
      valueSelect: '',
      currentPage: 1,
      tableDataRow: 0,
      optionsProject: [{
        label: '全部项目',
        value: ''
      },
      {
        label: '公司项目',
        value: '0'
      },
      {
        label: '部门项目',
        value: '1'
      },
      {
        label: '小组项目',
        value: '2'
      },
      {
        label: '个人项目',
        value: '3'
      },
      {
        label: '集团战略',
        value: '4'
      },
      {
        label: '产品研发',
        value: '5'
      }
      ],
      projectType: '',
      pageSize: 10,
      projectName: '',
      pageNum: 1,
      selectData: {}
    }
  },
  created () {
    this.getProjectList()
  },
  watch: {
    inputProject: function (val, oV) {
      var that = this
      that.projectName = val
      that.pageNum = 1
      that.currentPage = 1
      that.getProjectList()
    },
    valueSelect: function (val, oV) {
      var that = this
      // console.log('6666', val)
      that.projectType = val
      that.pageNum = 1
      that.currentPage = 1
      that.getProjectList()
    }
  },
  methods: {
    getProjectPageNum: function (e) {
      this.pageNum = e
      this.currentPage = e
      this.getProjectList()
    },
    getProjectList: function () {
      var that = this
      that.ajax(this.url, {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        projectType: this.projectType,
        projectName: this.projectName
      }).then(res => {
        if (res.code === 200) {
          that.tableData = res.data.list
          that.tableDataRow = res.data.totalRow
        } else {
          that.$message.warning(res.msg)
        }
      })
    },
    tableSelect (selectData) {
      // this.selectedGroupData = selectData
      this.selectData = selectData
    },
    // 新建 是否选择模板 ok
    ok () {
      this.$emit('ok', this.selectData)
    },
    dbClick (tableData) {
      this.$emit('dbClick', tableData)
    },
    // 新建 是否选择模板 no
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped>
  .projectListTop{
    display: flex;
    justify-content: space-between;
  }
  .tabbox{
    border-top: 1px solid #f5f8fa;
    margin-top: 20px;
  }
  .modelItem{
    display: inline-block;
    width: 100%;
  }
  .modelName{
    font-size: 18px;
    _font-family: 黑体;
    width: 72%;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .modelPeo{
    height: 24px;
    line-height: 24px;
    margin-top: 10px;
  }
  .el-col-self:nth-child(2n + 1){
    margin-right: 10px;
  }
</style>
