<template>
  <div>
    <div style="font-size: 16px; margin-bottom: 10px;">添加项目成员</div>
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
        <div class="tblTitItem">姓名</div>
        <!--<div class="tblTitItem">查看</div>-->
        <div class="tblTitItem">编辑</div>
        <div class="tblTitItem" title="清空全部" style="color: #409EFF;cursor: pointer;" v-on:click="delMember(0)">清空</div>
      </div>
      <div class="memTblList" v-loading="loadingMan">
        <div class="memTblListItem" v-for="mem in proGrpMemList" :key="mem.userId">
          <div class="memListItem">{{mem.roleStr}}</div>
          <div class="memListItem">{{mem.userName}}</div>
          <!--<div class="memListItem"><Checkbox v-bind:value="true" @on-change="checkChangeSee($event, mem.id, mem.role)"></Checkbox></div>-->
          <div class="memListItem"><Checkbox v-bind:value="mem.auth === '2'" @on-change="checkBoxChangeEdit($event, mem.id)"></Checkbox></div>
          <div class="memListItem" style="cursor: pointer;"  v-on:click="delMember(mem.id)">x</div>
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

<script>
export default {
  name: 'MemberComp',
  props: ['proId', 'DrawerMemberShow', 'groupId'],
  data () {
    return {
      loading2: false,
      loadingMan: false,
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
        this.queryProGroupMember()
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
        that.addMemPayload.spuId = that.proId
        that.addMemPayload.groupId = that.groupId
        this.ajax('/archives/addMember', JSON.stringify(that.addMemPayload)).then(res => {
          if (res.code === 200) {
            that.queryProGroupMember()
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
        that.ajax('/archives/delMember', {
          spuId: that.proId,
          memberId: memId
        }).then(res => {
          that.log('删除成员:', res)
          if (res.code === 200) {
            that.$message({
              type: 'success',
              message: res.msg
            })
            that.queryProGroupMember()
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
    // 新增 查询项目组成员getMembersByProjectUID
    queryProGroupMember () {
      var that = this
      this.ajax('/archives/getMemberList', {groupId: that.groupId}).then(res => {
        if (res.code === 200) {
          that.proGrpMemList = res.data
          that.log('getMembersByProjectUID:', that.proGrpMemList)
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].peopleRole === '1') {
              res.data[i].peopleRoleText = '创建人'
            } else if (res.data[i].peopleRole === '2') {
              res.data[i].peopleRoleText = '负责人'
            } else if (res.data[i].peopleRole === '3') {
              res.data[i].peopleRoleText = '执行人'
            } else {
              res.data[i].peopleRoleText = '组成员'
            }
          }
          // that.options4 = res.data peopleRole
          // this.loading2 = false
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
      this.ajax('/archives/editAuth', {memberId: id, auth: auth, spuId: this.proId}).then(res => {
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
        that.ajax('/archives/addMember', JSON.stringify({
          spuId: that.proId,
          hrocPeople: that.getPeople,
          groupId: that.groupId
        })).then(res => {
          if (res.code === 200) {
            that.queryProGroupMember()
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
</style>
