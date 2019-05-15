<template>
  <div class="members">
    <div class="groupDetail">
      <div class="groupName">
        <span v-if="showName">{{groupInfo.name}}</span>
        <!--<span v-if="!showName"><Input v-model="groupInfo.name" :autofocus="trueFlag" placeholder="请输入名称" style="width: 150px" /></span>-->
        <!--<span class="groupEdit" @click="groupEdit()"><Icon type="md-create" color="#2d8cf0"/></span>-->
      </div>
      <div class="groupDiscript" :title="groupInfo.description">{{groupInfo.description}}</div>
      <div class="groupTime"><img src="../../../static/img/time.png" alt="" style="float: left;"> <span style="margin-left: 10px">创建时间: {{groupInfo.createDt}}</span></div>
      <div class="groupMen">
        <div><img src="../../../static/img/fuzeren.png" alt="" style="float: left;"> <span style="margin-left: 10px">负责人: {{groupInfo.userName}}</span></div>
        <div><img src="../../../static/img/faqiren.png" alt="" style="float: left;"> <span style="margin-left: 10px">创建人: {{groupInfo.creatorName}}</span></div>
      </div>
    </div>
    <div style="font-size: 16px; margin-bottom: 10px;margin-top: 20px;">添加成员</div>
    <div class="searchBox">
      <div class="searchSelectIpt">
        <el-select v-model="taskForm.value9" multiple filterable remote style="width: 100%;"
                   :reserve-keyword="false" placeholder="请输人员姓名或拼音(如'张三'或 'zs')"
                   :remote-method="remoteMethod" :loading="loading2">
          <el-option v-for="item in options4" :key="item.ID" :label="item.Name + ' (' + item.jName + ')'"
                     :value="item.Name + '-' + item.ID">
          </el-option>
        </el-select>
      </div>
      <div class="searchBtn"><Button type="primary" v-on:click="addMember()">添加</Button></div>
      <div class="searchOpenTree" @click="organizationalClick"><Button>组织架构</Button></div>
    </div>
    <div style="font-size: 16px; margin-bottom: 10px; margin-top: 20px;">成员列表</div>
    <div class="memberTable">
      <div class="memTblTitle">
        <div class="tblTitItem">角色</div>
        <div class="tblTitItem" style="width: 250px;">姓名</div>
        <!--<div class="tblTitItem">查看</div>-->
        <div class="tblTitItem">编辑</div>
        <div class="tblTitItem" v-bind:class="groupInfo.editPermission === true ? 'allDel' : 'banDel'" title="清空全部" v-on:click="delMember(0)">清空</div>
      </div>
      <div class="memTblList" v-loading="loadingMan">
        <div class="memTblListItem" v-for="mem in proGrpMemList" :key="mem.userId">
          <div class="memListItem">{{mem.roleStr}}</div>
          <div class="memListItem overList" style="width: 250px;"><a href="javascript:void(0);" :title="mem.userName" style="color:#333">{{mem.userName}}</a></div>
          <!--<div class="memListItem"><Checkbox v-bind:value="true" @on-change="checkChangeSee($event, mem.id, mem.role)"></Checkbox></div>-->
          <div class="memListItem"><Checkbox v-bind:value="mem.auth === '2'" @on-change="checkBoxChangeEdit($event, mem.id)"></Checkbox></div>
          <div class="memListItem" v-bind:class="mem.editPermission === true ? 'del' : 'banDel'" v-on:click="delMember(mem.id)">x</div>
        </div>
      </div>
    </div>
    <!--组织架构 start-->
    <div v-if="organizationalShow" style="font-size: 16px; margin-bottom: 10px; margin-top: 20px;">组织架构</div>
    <!--organizationalShow-->
    <div class="organizationalBox" v-if="organizationalShow">
      <div v-loading="organizLoading">
        <el-tree
          :data="data2"
          show-checkbox
          @node-click="append($event)"
          @check="changeState"
          node-key="id"
          :default-expanded-keys="[1,2]"
          :props="defaultProps">
        </el-tree>
      </div>
      <div class="organizationalBtn"><Button type="primary" @click="addMenber()">添加</Button></div>
    </div>
  </div>
</template>
<style>
  .members .ivu-checkbox-disabled .ivu-checkbox-inner {
    border-color: #2d8cf0;
    background-color: #2d8cf0;
  }
</style>
<script>
export default {
  name: 'GroupMemberComp',
  props: ['DrawerMemberShow', 'groupId'],
  data () {
    return {
      loading2: false,
      loadingMan: false,
      groupInfo: '',
      trueFlag: true,
      falseFlag: false,
      showName: true,
      organizationalShow: false,
      organizLoading: false,
      deId: [],
      dataPeo: [],
      data2: [],
      options4: [],
      getPeople: [],
      proGrpMemList: [],
      getNextPeople: [],
      getNextPart: [],
      // 小组成员
      groupList: [],
      // 组织架构
      defaultProps: {
        children: 'children',
        label: 'Name'
      },
      moreUserSelectPayload: {
        projectManager: ''
      },
      addMemPayload: {
        spuId: '',
        hrocPeople: [],
        groupId: ''// 小组id
      },
      taskForm: {
        jobName: '',
        userName: '',
        jobLevel: 3,
        date1: '',
        date2: '',
        state2: '',
        value9: [],
        value8: [],
        description: '',
        taskUserId: ''
      }
    }
  },
  watch: {
    DrawerMemberShow: function (val, oV) {
      // this.log('DrawerMemberShow:val:', val)
      if (val) {
        this.getGroupDetail()
        this.getGroup()
      } else {
        this.organizationalShow = false
      }
    },
    proId: function (val, oV) {
      // this.log('DrawerMemberShow:proId:', val)
      if (val) {
        this.proId = val
      }
    }
  },
  methods: {
    // 新增 成员搜索
    remoteMethod (query) {
      var that = this
      if (query !== '') {
        this.loading2 = true
        that.moreUserSelectPayload.projectManager = query
        this.ajax('/myProject/autoCompleteNames', that.moreUserSelectPayload).then(res => {
          if (res.code === 200) {
            that.options4 = res.data
            this.loading2 = false
          }
        })
      } else {
        this.options4 = []
      }
    },
    organizationalClick () {
      this.organizationalShow = true
      this.getDepartment()
    },
    // 查询部门
    getDepartment () {
      var that = this
      this.ajax('/myProject/queryDepartment', {}).then(res => {
        // this.log('queryDepartment:', res)
        if (res.code === 200) {
          that.data2 = res.data.department
          for (var i = 0; i < res.data.member.length; i++) {
            res.data.member[i].Name = res.data.member[i].Name + ' ( ' + res.data.member[i].jName + ' )'
          }
          that.dataPeo = res.data.member
          that.data2 = this.dataPeo.concat(this.data2)
        }
      })
    },
    // 新增 增加项目组成员
    addMember () {
      var that = this
      that.loadingMan = true
      if (that.taskForm.value9.length > 0) {
        for (var i = 0; i < that.taskForm.value9.length; i++) {
          var obj = {Name: '', ID: ''}
          obj.Name = that.taskForm.value9[i].split('-')[0]
          obj.ID = that.taskForm.value9[i].split('-')[1]
          that.addMemPayload.hrocPeople.push(obj)
        }
        that.addMemPayload.groupId = that.groupId
        this.ajax('/group/addGroupMember', JSON.stringify(that.addMemPayload)).then(res => {
          if (res.code === 200) {
            that.getGroup()
            // that.queryProDetail()
            that.$emit('addMembersInfo', true)
            that.addMemPayload.hrocPeople = []
            that.taskForm.value9 = []
            that.loadingMan = false
          } else {
            that.$emit('addMembersInfo', false)
            that.$message.warning(res.msg)
            that.loadingMan = false
          }
        })
      }
    },
    // 删除成员
    delMember (memId) {
      var that = this
      that.loadingMan = true
      if (memId || memId === 0) {
        that.ajax('/group/delGroupMember', {
          groupId: that.groupId,
          memberId: memId
        }).then(res => {
          that.log('删除成员:', res)
          if (res.code === 200) {
            that.$message({
              type: 'success',
              message: res.msg
            })
            that.getGroup()
            that.$emit('delMembersInfo', true)
            // that.getProjectPeo()
            that.loadingMan = false
            // that.deId = []
          } else {
            that.$emit('delMembersInfo', false)
            that.$message(res.msg)
            that.loadingMan = false
          }
        })
      }
    },
    getGroupDetail: function () {
      var that = this
      this.ajax('/group/getGroupDetail', {groupId: that.groupId}).then(res => {
        if (res.code === 200) {
          that.log('getGroupDetail:', res)
          that.groupInfo = res.data
        }
      })
    },
    groupEdit: function () {
      var that = this
      that.log('修改中')
      that.showName = !that.showName
      if (that.showName) {
        that.log('修改完')
      }
    },
    getGroup () {
      var that = this
      this.ajax('/archives/getGroupMemberList', {groupId: that.groupId}).then(res => {
        if (res.code === 200) {
          that.proGrpMemList = res.data
        }
      })
    },
    // 权限 编辑 查看
    checkBoxChangeEdit (checked, id) {
      this.log('权限编辑查看：', checked + '-' + id + '-')
      let auth
      if (checked === true) {
        auth = 2
      } else {
        auth = 1
      }
      this.ajax('/group/editAuth', {memberId: id, auth: auth, groupId: this.groupId}).then(res => {
        // that.log('editRole:', res)
      })
    },
    checkChangeSee (checked, id, role) {
      var that = this
      this.log('权限编辑查看：', checked + '-' + id + '-' + role)
      this.ajax('/myProject/editRole', JSON.stringify({projectUID: that.proId, projectOrg: [{id: id, role: role}]})).then(res => {
        // that.log('editRole:', res)
      })
    },
    // 点击组织架构下的部门节点 查询部门和人员
    append (data) {
      var that = this
      var dID = data.ID
      this.$set(data, 'children', [])
      this.ajax('/myProject/queryDepartment', {departmentID: dID}).then(res => {
        if (res.code === 200) {
          that.getNextPart = res.data.department
          for (var i = 0; i < res.data.member.length; i++) {
            res.data.member[i].Name = res.data.member[i].Name + ' ( ' + res.data.member[i].jName + ' )'
          }
          that.getNextPeople = res.data.member
          data.children = that.getNextPeople.concat(that.getNextPart)
        }
      })
    },
    // 选中部门或者人员前面的方框
    changeState (e, state) {
      var that = this
      // this.log('changeState:', 888888)
      that.deId = state.checkedNodes
      this.ajax('/myProject/queryMember', {departmentIDs: JSON.stringify(that.deId)}).then(res => {
        // that.log('queryMember_1:', res)
        if (res.code === 200) {
          for (var i = 0; i < res.data.length; i++) {
            res.data[i].Name = res.data[i].Name.split(' ')[0]
          }
          this.getPeople = res.data
          // that.log('getMember:', this.getPeople)
          // that.token = res._jfinal_token
          if (that.deId.length > 0) {
            $('.el-icon-d-arrow-right').addClass('active')
          } else if (that.deId.length === 0) {
            $('.el-icon-d-arrow-right').removeClass('active')
          }
        }
      })
    },
    // 成员管理
    addMenber () {
      var that = this
      that.organizLoading = true
      if (that.deId.length > 0) {
        that.ajax('/group/addGroupMember', JSON.stringify({
          hrocPeople: that.getPeople,
          groupId: that.groupId
        })).then(res => {
          if (res.code === 200) {
            that.getGroup()
            that.$emit('addPeopleInfo', true)
            that.organizLoading = false
            // that.queryProDetail()
            // that.getProjectPeo()
            that.$message({
              type: 'success',
              message: res.msg
            })
          } else {
            that.$emit('addPeopleInfo', false)
            that.$message({
              type: 'warning',
              message: res.msg
            })
            that.organizLoading = false
          }
        })
      } else if (this.deId.length === 0) {
        $('.el-icon-d-arrow-right').removeClass('active')
      }
    }
  }
}
</script>

<style scoped>
  .searchBox{
    display: flex;
  }
  .groupEdit{
    display: none;
    margin-left: 20px;
  }
  .groupDetail{
    font-size: 14px;
    border-bottom: 1px solid #e8eaec;
    margin-bottom: 10px;
  }
  .groupName{
    font-size: 16px;
    margin-bottom: 6px;
  }
  /*.groupName:hover .groupEdit{*/
    /*display: inline-block;*/
    /*margin-left: 20px;*/
  /*}*/
  .groupTime{
    padding: 5px 0;
    border-bottom: 1px solid #e8eaec;
  }
  .groupMen{
    padding: 5px 0;
    display: flex;
  }
  .groupMen>div{
    width: 50%;
  }
  .groupDiscript{
    padding: 2px 10px;
    color: #888;
    font-size: 12px;
    background-color: #f5f8fa;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  .searchSelectIpt{
    width: 300px;
  }
  .searchBtn,.searchOpenTree{
    margin-left: 15px;
  }
  .memberTable{
    width: 500px;
    text-align: center;
    border: 1px solid #eee;
  }
  .memTblTitle{
    display: flex;
    background-color: #f8f8f9;
    border-bottom: 1px solid #eee;
  }
  .tblTitItem{
    width: 20%;
    line-height: 32px;
  }
  .memTblList{
    width: 500px;
  }
  .memTblListItem{
    display: flex;
    border-bottom: 1px solid #eee;
  }
  .memTblListItem:nth-last-child(1){
    border-bottom: none;
  }
  .memTblListItem:hover{
    background-color: #ebf7ff;
  }
  .memListItem{
    width: 20%;
    line-height: 32px;
  }
  .overList {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .organizationalBox{
    display: flex;
  }
  .organizationalBox>div:nth-child(1){
    width: 433px;
    margin-right: 10px;
    border: 1px solid #eee;
  }
  .organizationalBox>div:nth-child(2){
    /*flex-grow: 1;*/
    width: 80px;
  }
  .del{
    color: #409EFF;
    cursor: pointer;
  }
  .banDel{
    color: #999;
    cursor: not-allowed;
    pointer-events: none;
  }
  .allDel{
    color: #409EFF;
    cursor: pointer;
  }
</style>
