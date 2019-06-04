<template>
  <div class="GroupAdmin">
    <div class="GroupSearch">
      <div class="GroupSearchItem">
        <el-input v-model="searchGroup" placeholder="请输入小组名称"></el-input>
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
    <div style="padding: 20px 10px" class="clear">
      <div style="float: left; width: 50%; padding-left: 15px; box-sizing: border-box;" v-for="groupItem in GroupList" v-bind:key="groupItem.id">
        <Card :bordered="true" style="margin-bottom: 15px;" @click.native="toGroupDetail(groupItem.id)">
          <p class="groupItemTit" slot="title" :title="groupItem.name">{{groupItem.name}}</p>
          <a href="#" slot="extra" v-if="groupItem.showMenu === 1" @click.prevent="updateGroup($event, groupItem.id)" style="margin-right: 20px;">修改</a>
          <a href="#" slot="extra" v-if="groupItem.showMenu === 1" @click.prevent="deleteGroup($event, groupItem.id)">删除</a>
          <div style="display: flex; justify-content: space-between;">
            <div style="width: 50%">
              <p class="textIntro" :title="groupItem.description">{{groupItem.description}}</p>
            </div>
            <div style="width: 50%; text-align: right; color: #888">
              <span>负责人: {{groupItem.userName.split(' ')[0]}}</span>
              <span style="margin-left: 15px;">创建时间: {{groupItem.createDt.split(' ')[0]}}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
    <!--新建小组-->
    <Modal v-model="creatGroupShow" title="新建小组" @on-ok="createGroupSub" @on-cancel="createGroupCancel">
      <div class="createGroupCnt">
        <div class="createGroupCntItem"><span style="color: #f00;">* </span>小组名:</div>
        <div class="createGroupCntItem GroupCntItemVal">
          <el-input placeholder="请输入小组名称" v-model="createGroupName"></el-input>
        </div>
      </div>
      <div class="createGroupCnt">
        <div class="createGroupCntItem"><span style="color: #f00;">* </span>负责人:</div>
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
          <el-input v-model="createGroupDes" type="textarea" placeholder="请输入小组详情"></el-input>
        </div>
      </div>
    </Modal>
    <!-- 新建小组-->
    <Modal v-model="creatGroupShow2" title="新建小组2" @on-ok="createGroupSub2" @on-cancel="createGroupCancel2">
      <div class="createGroupCnt">
        <div class="createGroupCntItem"><span style="color: #f00;">* </span>小组名:</div>
        <div class="createGroupCntItem GroupCntItemVal">
          <el-input placeholder="请输入小组名称" v-model="createGroupName2"></el-input>
        </div>
      </div>
      <div class="createGroupCnt">
        <div class="createGroupCntItem"><span style="color: #f00;">* </span>负责人:</div>
        <div class="createGroupCntItem GroupCntItemVal">
          <el-autocomplete style="width: 100%"
                           v-model="CreateGroupSearchManager2"
                           :fetch-suggestions="queryNewGroupManager2"
                           placeholder="搜索小组负责人"
                           :trigger-on-focus="false"
                           @select="CreateGroupManagerSelect2($event)"
          ></el-autocomplete>
        </div>
      </div>
      <div class="createGroupCnt">
        <div class="createGroupCntItem">小组描述:</div>
        <div class="createGroupCntItem GroupCntItemVal">
          <el-input v-model="createGroupDes2" type="textarea" placeholder="请输入小组详情"></el-input>
        </div>
      </div>
    </Modal>
    <Drawer title="小组详情" width="700" :closable="false" v-model="DrawerMember">
      <component v-bind:is="compArr.GroupMembers" v-bind:groupId="groupId" v-bind:DrawerMemberShow="DrawerMember"></component>
    </Drawer>
    <div style="text-align: center">
      <el-pagination
        layout="prev, pager, next"
        :page-size="10"
        :total="totalRow"
        :current-page="pageNumber"
        @current-change="currentChange"
        :hide-on-single-page="true">
      </el-pagination>
    </div>
    <!---->
  </div>
</template>

<script>
import GroupMembers from './CustomComp/GroupMembers.vue'
export default {
  name: 'GroupAdmin',
  components: {
    GroupMembers
  },
  data () {
    return {
      DrawerMember: false,
      // 引入组件
      compArr: {
        GroupMembers: 'GroupMembers'
      },
      Gid: '',
      groupId: '',
      searchGroup: '',
      GroupSelectVal: '',
      GroupList: [],
      creatGroupShow: false,
      creatGroupShow2: false,
      CreateGroupMid: '',
      CreateGroupMid2: '',
      Mid: '',
      CreateGroupSearchManager: '',
      CreateGroupSearchManager2: '',
      autoCompleteNamesPayload: {
        projectManager: '',
        groupName: ''
      },
      NewGroupManagerPayload: {
        projectManager: ''
      },
      NewGroupManagerPayload2: {
        projectManager: ''
      },
      createGroupName: '',
      createGroupName2: '',
      createGroupDes: '',
      createGroupDes2: '',
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
      this.pageNumber = 1
      this.queryGroupList()
    }
  },
  created () {
    this.queryGroupList()
    this.queryPermission()
  },
  mounted: function () {
    /** 设置侧边栏激活状态 */
    this.$store.commit('setNavActive', {navName: '商品管理', childNavName: '产品小组'})
  },
  methods: {
    currentChange: function (num) {
      this.log('currentChange:', num)
      this.pageNumber = num
      this.queryGroupList()
    },
    toGroupDetail: function (Gid) {
      var that = this
      that.log('gid:', Gid)
      that.groupId = Gid
      if (that.groupId) {
        that.DrawerMember = true
      }
    },
    createGroupSub: function () {
      var that = this
      // that.DrawerMember = true
      if (that.CreateGroupMid && that.createGroupName) {
        this.ajax('/group/addGroup', {userId: that.CreateGroupMid, userName: that.CreateGroupSearchManager, groupName: that.createGroupName, description: that.createGroupDes}).then(res => {
          that.log('addGroup:', res)
          if (res.code === 200) {
            that.queryGroupList()
            // that.GroupList = res.data.list
          } else {
            that.$message(res.msg)
          }
        })
      } else {
        that.$message.warning('请完善小组必填信息！')
      }
    },
    createGroupSub2: function () {
      var that = this
      // that.DrawerMember = true
      if (that.CreateGroupMid2 && that.createGroupName2) {
        this.ajax('/group/editGroup', {groupId: that.Gid, userId: that.CreateGroupMid2, userName: that.CreateGroupSearchManager2, groupName: that.createGroupName2, description: that.createGroupDes2}).then(res => {
          that.log('addGroup:', res)
          if (res.code === 200) {
            that.queryGroupList()
            // that.GroupList = res.data.list
          } else {
            that.$message(res.msg)
          }
        })
      } else {
        that.$message.warning('请完善小组必填信息！')
      }
    },
    createGroupCancel: function () {},
    createGroupCancel2: function () {},
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
    queryNewGroupManager2 (queryString, cb) {
      var that = this
      if (queryString) {
        that.NewGroupManagerPayload2.projectManager = queryString
        this.ajax('/myProject/autoCompleteNames', that.NewGroupManagerPayload2).then(res => {
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
    CreateGroupManagerSelect2 (item) {
      this.log('新建小组：', item)
      // this.CreateGroupMid = item.userId
      this.CreateGroupMid2 = item.userId
    },
    deleteGroup (e, groupId) {
      var that = this
      e.stopPropagation()
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
    updateGroup: function (e, Gid) {
      var that = this
      that.Gid = Gid
      e.stopPropagation()
      that.log(Gid)
      this.creatGroupShow2 = true
      that.ajax('/group/getGroupDetail', {groupId: Gid}).then(res => {
        that.log('GroupMsg:', res)
        if (res.code === 200) {
          that.createGroupName2 = res.data.name
          that.CreateGroupSearchManager2 = res.data.userName
          that.CreateGroupMid2 = res.data.userId
          that.createGroupDes2 = res.data.description
          console.log('that.CreateGroupMid2', res.data.userId)
        } else {
          that.$message(res.msg)
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
    },
    // archives/getPermission
    queryPermission () {
      var that = this
      this.ajax('/archives/getPermission', {menuId: ''}).then(res => {
        that.log('getPermission:', res)
        if (res.code === 200) {
        } else {
          // that.$message(res.msg)
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
  .clear:after{ content: ""; display: block;height: 0;visibility: hidden;clear: both;}
.GroupSearch{
  display: flex;
  justify-content: space-between;
  padding: 15px 10px;
  background-color: #f5f8fa;
}
  .groupItemTit{
    color: #555;
    width:200px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  .textIntro{
    color: #888;
    width:200px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
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
