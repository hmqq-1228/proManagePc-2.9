<template>
  <div class="GroupAdmin">
    <div class="GroupSearch">
      <div class="GroupSearchItem">
        <el-input v-model="searchGroup" placeholder="请输入内容"></el-input>
      </div>
      <div class="GroupSearchItem">
        <Button type="primary" @click="createGroupBtn">新建小组</Button>
      </div>
    </div>
    <div class="GroupSelect">
      <Tabs v-model="GroupSelectVal">
        <TabPane label="全部小组" name="1"></TabPane>
        <TabPane label="我负责的" name="2"></TabPane>
      </Tabs>
    </div>
    <div style="padding: 20px">
      <Card :bordered="true" style="margin-bottom: 15px;" v-for="groupItem in GroupList" v-bind:key="groupItem.id">
        <p class="groupItemTit" slot="title">{{groupItem.name}}</p>
        <a href="#" slot="extra" @click.prevent="deleteGroup(groupItem.id)">
          删除
        </a>
        <div style="display: flex; justify-content: space-between;">
          <div style="width: 50%"><p class="textIntro">{{groupItem.description}}</p></div>
          <div style="width: 50%; text-align: right; color: #888"><span>负责人: {{groupItem.userName}}</span><span style="margin-left: 15px;">创建时间: {{groupItem.createDt}}</span></div>
        </div>
      </Card>
    </div>
    <!--新建小组-->
    <Modal v-model="creatGroupShow" title="新建小组" @on-ok="createGroupSub" @on-cancel="createGroupCancel">
      <div class="createGroupCnt">
        <div class="createGroupCntItem">小组名称:</div>
        <div class="createGroupCntItem GroupCntItemVal">
          <el-input placeholder="请选择日期" v-model="createGroupName"></el-input>
        </div>
      </div>
      <div class="createGroupCnt">
        <div class="createGroupCntItem">负责人:</div>
        <div class="createGroupCntItem GroupCntItemVal">
          <el-autocomplete style="width: 100%"
            v-model="CreateGroupSearchManager"
            :fetch-suggestions="queryNewGroupManager"
            placeholder="搜索小组负责人"
            :trigger-on-focus="false"
            @select="CreateGroupManagerSelect($event)"
          ></el-autocomplete>
        </div>
      </div>
      <div class="createGroupCnt">
        <div class="createGroupCntItem">小组描述:</div>
        <div class="createGroupCntItem GroupCntItemVal">
          <el-input v-model="createGroupDes" type="textarea" placeholder="Enter something..."></el-input>
        </div>
      </div>
    </Modal>
    <!---->
    <div>
      <el-pagination
        layout="prev, pager, next"
        :page-size="10"
        :total="totalRow"
        @current-change="currentChange"
        :hide-on-single-page="true">
      </el-pagination>
    </div>
    <!---->
  </div>
</template>

<script>
export default {
  name: 'GroupAdmin',
  data () {
    return {
      searchGroup: '',
      GroupSelectVal: '',
      GroupList: [],
      creatGroupShow: false,
      CreateGroupMid: '',
      Mid: '',
      CreateGroupSearchManager: '',
      autoCompleteNamesPayload: {
        projectManager: '',
        groupName: ''
      },
      NewGroupManagerPayload: {
        projectManager: ''
      },
      createGroupName: '',
      createGroupDes: '',
      totalRow: 0,
      pageSize: 10,
      pageNumber: 1
    }
  },
  watch: {
    CreateGroupSearchManager: function (val, old) {
      this.log('mingzi:', val)
    },
    searchGroup: function (val, old) {
      this.queryGroupList()
    },
    GroupSelectVal: function (val, old) {
      this.log('GroupSelectVal:', val)
      this.queryGroupList()
    }
  },
  created () {
    this.queryGroupList()
  },
  methods: {
    currentChange: function (num) {
      this.log('currentChange:', num)
      this.pageNumber = num
      this.queryGroupList()
    },
    createGroupSub: function () {
      var that = this
      this.ajax('/group/addGroup', {userId: that.CreateGroupMid, userName: that.CreateGroupSearchManager, groupName: that.createGroupName, description: that.createGroupDes}).then(res => {
        that.log('addGroup:', res)
        if (res.code === 200) {
          that.queryGroupList()
          // that.GroupList = res.data.list
        } else {
          that.$message(res.msg)
        }
      })
    },
    createGroupCancel: function () {},
    createGroupBtn: function () {
      this.creatGroupShow = true
    },
    // 新建 搜索选择项目负责人
    queryNewGroupManager (queryString, cb) {
      var that = this
      if (queryString) {
        that.NewGroupManagerPayload.projectManager = queryString
        this.ajax('/myProject/autoCompleteNames', that.NewGroupManagerPayload).then(res => {
          if (res.code === 200) {
            var dddarr = []
            if (res.data.length > 0) {
              for (var i = 0; i < res.data.length; i++) {
                var obj = {}
                obj.value = res.data[i].Name + ' (' + res.data[i].jName + ')'
                obj.userId = res.data[i].ID
                dddarr.push(obj)
              }
              cb(dddarr)
            } else {
              var aaaddd = []
              that.$message('未能搜索到该人员')
              cb(aaaddd)
            }
          }
        })
      }
    },
    CreateGroupManagerSelect (item) {
      this.log('新建小组：', item)
      // this.CreateGroupMid = item.userId
      this.CreateGroupMid = item.userId
    },
    deleteGroup (groupId) {
      var that = this
      this.$Modal.confirm({
        title: '确认要删除？',
        content: '正在执行删除操作，此操作不可恢复',
        onOk: () => {
          that.ajax('/group/delGroup', {groupId: groupId}).then(res => {
            that.log('delGroup:', res)
            if (res.code === 200) {
              that.queryGroupList()
              // that.GroupList = res.data.list
            } else {
              that.$message(res.msg)
            }
          })
        },
        onCancel: () => {
          // this.$Message.info('Clicked cancel')
        }
      })
    },
    queryGroupList () {
      var that = this
      this.ajax('/group/getGroup', {groupName: that.searchGroup, type: parseInt(that.GroupSelectVal), pageNum: that.pageNumber, pageSize: that.pageSize}).then(res => {
        that.log('getGroup:', res)
        if (res.code === 200) {
          that.GroupList = res.data.list
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

<style>
  .ivu-card{
    box-shadow:0 1px 6px rgba(0,0,0,.1)
  }
  .ivu-card:hover{
    box-shadow:0 1px 6px rgba(45,140,240,.6)
  }
  .ivu-card:hover .groupItemTit{
    color: #2d8cf0;
  }
</style>
<style scoped>
.GroupSearch{
  display: flex;
  justify-content: space-between;
  padding: 15px 10px;
  background-color: #f5f8fa;
}
  .groupItemTit{
    color: #555;
  }
  .textIntro{
    color: #888;
  }
  .createGroupCnt{
    display: flex;
    margin-bottom: 15px;
  }
  .createGroupCntItem{
    width: 70px;
    font-size: 14px;
    font-weight: bold;
    padding-top: 0px;
    line-height: 35px;
  }
  .createGroupCntItem.GroupCntItemVal{
    flex-grow: 1;
  }
</style>
