<template>
    <div>
      <Modal v-model="selectChange" width="800" title="小组列表" @on-ok="groupListSelectOk" @on-cancel="groupListSelectCancel">
        <div class="tableQueryInput" style="margin-bottom: 10px;">
          <el-input v-model="searchGroup" placeholder="请输入搜索内容"></el-input>
        </div>
        <Table highlight-row ref="currentRowTable" :columns="columns3" :data="tableData" @on-current-change="tableSelect"></Table>
        <div style="margin-top: 15px;">
          <el-pagination
            layout="prev, pager, next"
            :page-size="10"
            :total="totalRow"
            @current-change="currentChange"
            :hide-on-single-page="true">
          </el-pagination>
        </div>
      </Modal>
    </div>
</template>

<script>
export default {
  name: 'SelectGroup',
  props: {
    select: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      selectChange: this.select,
      tableData: [],
      totalRow: 0,
      searchGroup: '',
      pageNumber: 1,
      pageSize: 10,
      // select: true,
      selectedGroupData: {},
      columns3: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '小组名称',
          key: 'name'
        },
        {
          title: '创建人',
          key: 'creatorName'
        },
        {
          title: '创建时间',
          key: 'createDt'
        }
      ]
    }
  },
  created () {
    this.queryGroupList()
  },
  watch: {
    searchGroup: function (val, old) {
      this.queryGroupList()
    },
    select (val) {
      this.selectChange = val
    }
  },
  methods: {
    groupListSelectOk () {
      this.$emit('groupListSelectOk', this.selectedGroupData)
    },
    groupListSelectCancel: function () {
      this.$emit('groupListSelectCancel')
    },
    tableSelect (selectData) {
      this.selectedGroupData = selectData
    },
    currentChange (e) {
      this.pageNumber = e
      this.queryGroupList()
    },
    queryGroupList () {
      var that = this
      this.ajax('/group/getGroup', {groupName: that.searchGroup, type: 1, pageNum: that.pageNumber, pageSize: that.pageSize}).then(res => {
        that.log('getGroup:111:', res)
        if (res.code === 200) {
          that.tableData = res.data.list
          // that.GroupList = res.data.list
          that.pageSize = res.data.pageSize
          that.totalRow = res.data.totalRow
        } else {
          that.$message(res.msg)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
