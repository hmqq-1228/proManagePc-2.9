<template>
  <div class="DynamicsMy">
    <div class="tabsSelectTagBox">
      <div class="tabsSelectTagLeft">
        <div class="tabsSelTagItem"
             v-bind:class="tagItem.tagState"
             v-for="tagItem in tagsArr"
             v-on:click="tagClick(tagItem.tagType)"
             :key="tagItem.tagType">{{tagItem.tagName}}</div>
      </div>
      <div class="arrow" style=""></div>
      <div class="tabsSelectTagRight">
        <div class="selectByType">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">{{selectValue}}<i class="el-icon-arrow-down el-icon--right"></i></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="">全部任务</el-dropdown-item>
              <el-dropdown-item command="today">今日任务</el-dropdown-item>
              <el-dropdown-item command="overtime">逾期任务</el-dropdown-item>
              <el-dropdown-item command="unstart">未开始任务</el-dropdown-item>
              <el-dropdown-item command="unfinish">进行中任务</el-dropdown-item>
              <el-dropdown-item command="finish">已完成任务</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="searchTask">
          <el-input placeholder="请输入要检索的内容" v-model="searchValue" clearable></el-input>
        </div>
      </div>
    </div>
    <div class="tabsCntList" v-loading="loading">
      <!---->
      <!---->
      <div class="nodata" v-if="noDataShow">
        <div style="width:165px; margin: 0 auto; margin-top: 50px;"><img src="../../static/img/nodata.png" /></div>
        <div style="text-align: center; color: #666; margin-top: 15px; font-size: 14px;">暂无数据</div>
      </div>
      <div class="tabsCntItem" v-for="(taskItem, taskIndex) in taskList" :key="taskItem.uid + '-' + taskIndex">
        <div class="headPicBox">
          <div class="headPic">{{taskItem.headerUser}}</div>
        </div>
        <div class="tabsCntBox">
          <div class="tabsCntTitBox">
            <div class="tabsCntTit">由 <span>{{taskItem.createrName}}</span> 发起的 <span>任务</span></div>
          </div>
          <div class="tabsCntTextBox">
            <div class="tabsTaskCnt">
              <div class="tabsTaskCntLeft">
                <div class="taskCntLeftNameBox">
                  <div class="taskCntLeftType">任务</div>
                  <div class="taskCntLeftName" v-on:click="toDetail(taskItem.uid)">{{taskItem.jobName}}</div>
                </div>
                <div class="taskCntLeftProgress">
                  <div class="ProgressType">进度</div>
                  <div class="progressBox">
                    <div class="progressItem progressYes">
                      <div class="progressItemArrowLeft"></div>
                      <div class="progressItemArrowRight"></div>
                      创建任务
                      <!--{{progressItem.content}}-->
                    </div>
                    <div class="progressItem" v-bind:class="parseInt(taskItem.status) > 0 ? 'progressYes': ''">
                      <div class="progressItemArrowLeft"></div>
                      <div class="progressItemArrowRight"></div>
                      确认开始
                    </div>
                    <div class="progressItem" v-bind:class="parseInt(taskItem.status) >= 1 ? 'progressYes': ''">
                      <div class="progressItemArrowLeft"></div>
                      <div class="progressItemArrowRight"></div>
                      进行中
                    </div>
                    <div class="progressItem" v-bind:class="parseInt(taskItem.status) >= 2 ? 'progressYes': ''">
                      <div class="progressItemArrowLeft"></div>
                      <div class="progressItemArrowRight"></div>
                      已完成
                    </div>
                    <!--<div class="progressItem"></div>-->
                    <!--<div class="progressItem"></div>-->
                  </div>
                </div>
              </div>
              <div class="tabsTaskCntRight">
                <div class="TaskManager">负责人：<span>{{taskItem.userName}}</span></div>
                <div class="TaskManager" v-if="taskItem.overDay>0?true:false">{{taskItem.statusStr}}：<span>{{taskItem.overDay}}天</span></div>
              </div>
            </div>
            <div class="fengeline">
              <div class="arrow1"></div>
              <div class="line"></div>
              <div class="arrow2"></div>
            </div>
            <div class="timeLine">
              <div class="timeLineTitle">全部操作</div>
              <div class="timeLineCnt">
                <div class="timeLineItem" v-for="logs in taskItem.logPage" :key="logs.keyid" v-bind:class="logs.logStyle">
                  <div class="timeLineItemLeft">
                    <div class="timeLineItemYear" v-if="logs.logtype">{{logs.logtype}}年<div class="yearTagBgArrow"></div></div>
                    <div class="timeLineItemTime" v-if="!logs.logtype">{{logs.mondate}}<span>{{logs.houMin}}</span></div>
                  </div>
                  <div class="timeLineItemMiddle" v-bind:class="logs.logStyle">
                    <div class="middleBgLine"></div>
                    <div class="middleBgLineBottom"></div>
                    <div class="middleDot"></div>
                    <div class="middleDotOut" v-if="logs.logStyle==='latest'?true:false"></div>
                  </div>
                  <div class="timeLineItemRight">{{logs.oContent}}</div>
                </div>
              </div>
            </div>
            <!--右上角 标-->
            <div class="taskStateBiao" v-bind:class="taskItem.tagStyle">{{taskItem.statusStr}}</div>
          </div>
          <div class="dateAndLikeTags">
            <div class="tabsCntTextDate">{{taskItem.createDate}}</div>
            <div class="tabsCntLikeTags">
              <div class="likeTagsItem" v-on:click="responseBtn(taskItem.uid, taskIndex)"><i class="el-icon-edit"></i>回复</div>
            </div>
          </div>
          <!---->
          <!--添加评论-->
          <div class="responseArea" v-bind:style="{ height: taskItem.responseHeight + 'px'}">
            <form v-bind:id="'uploadFile2' + '_' + taskItem.uid + '_' + taskIndex" enctype="multipart/form-data">
              <textarea name="content" v-bind:id="'textArea' + '_' + taskItem.uid + '_' + taskIndex" class="textArea" v-model="textareaVal" placeholder="请输入回复内容"></textarea>
              <div class="resAreaOther">
                <div><input type="file" v-bind:id="'myfileTaskResp' + '_' + taskItem.uid + '_' + taskIndex" name="myfile" placeholder="请选择文件"/></div>
                <div class="resAreaOtherBtn">
                  <el-button size="mini" v-on:click="responseCancel(taskItem.uid, taskIndex)">取 消</el-button>
                  <el-button size="mini" type="primary" @click="responseOk('uploadFile2' + '_' + taskItem.uid + '_' + taskIndex)">提 交</el-button>
                </div>
              </div>
            </form>
          </div>
          <!---->
          <div class="tabsCntResponse">
            <div class="responseItem" v-for="commonItem in taskItem.commentPage.list" :key="commonItem.id">
              <div class="responseHeadPicBox">
                <div class="responseHeadPic">{{commonItem.customer_name?commonItem.customer_name.substring(0,1):'某'}}</div>
              </div>
              <div class="responseCntBox">
                <div class="responseCnt">
                  <span class="responseName">{{commonItem.customer_name}}</span>说：<span class="responseText">{{commonItem.content}}</span>
                  <!--<span style="font-size: 14px;margin-left: 20px;" v-if="commonItem.downLoadurl"><a v-bind:href="commonItem.downLoadurl">附件:{{commonItem.showName}}</a></span>-->
                </div>
                <!--附件在这里预览-->
                <div class="picPreview" v-if="commonItem.isImage" @click="showBigImage(commonItem.previewUrl)" v-bind:style="{backgroundImage: 'url(' + commonItem.previewUrl + ')'}">
                </div>
                <!--附件下载-->
                <div v-if="commonItem.downLoadurl" style="padding-top: 8px;">
                  <span style="font-size: 14px;"><a v-bind:href="commonItem.downLoadurl">附件下载: {{commonItem.showName}}</a></span>
                </div>
                <div class="responseDateBox">
                  <div class="responseDate">{{commonItem.createDate}}</div>
                  <!--<div class="responseDate"><span>打赏</span><span>回复</span></div>-->
                </div>
              </div>
            </div>
          </div>
          <!--添加评论-->
          <!--<div class="responseArea" v-bind:style="{ height: taskItem.responseHeight + 'px'}">-->
            <!--<form id="uploadFile2" enctype="multipart/form-data">-->
              <!--<textarea name="content" id="textArea" v-model="textareaVal" placeholder="请输入回复内容"></textarea>-->
              <!--<div class="resAreaOther">-->
                <!--<div><input type="file" id="myfileTaskResp" name="myfile" placeholder="请选择文件"/></div>-->
                <!--<div class="resAreaOtherBtn">-->
                  <!--<el-button size="mini" @click="responseCancel(taskItem.uid, taskIndex)">取 消</el-button>-->
                  <!--<el-button size="mini" type="primary" @click="responseOk(taskItem.uid)">提 交</el-button>-->
                <!--</div>-->
              <!--</div>-->
            <!--</form>-->
          <!--</div>-->
          <!---->
        </div>
      </div>
      <!---->
      <!---->
    </div>
    <!---->
    <!--预览图片-->
    <el-dialog title="预览图片" :visible.sync="showBigImageVisible">
      <div style="width: 100%"><img style="width: 100%" v-bind:src="preImageUrl" alt=""></div>
    </el-dialog>
    <!--分页器-->
    <div class="paginationBox" style="text-align: center; padding-top: 20px;">
      <el-pagination v-bind:page-size="TaskCommunityListPayload.jobPageSize" layout="prev, pager, next" :total="taskTotalRow" v-on:current-change="currentChange"></el-pagination>
    </div>
    <!---->
  </div>
</template>

<script>
export default {
  name: 'DynamicsMy',
  props: ['recall'],
  data () {
    return {
      msg: '任务动态',
      // 总条目数
      taskTotalRow: 0,
      // 控制nodata图片显示
      noDataShow: false,
      preImageUrl: '',
      showBigImageVisible: false,
      rid: '',
      loading: false,
      textareaVal: '',
      responseHeight: '',
      selectType: '',
      currentTaskItemId: '',
      selectValue: '全部任务',
      searchValue: '',
      searchName: '',
      taskList: [],
      tagsArr: [
        {
          tagName: '全部',
          tagType: 'all',
          taskSource: '1',
          tagState: 'active'
        },
        {
          tagName: '我负责的',
          tagType: 'my',
          taskSource: '2',
          tagState: ''
        },
        {
          tagName: '我发起的',
          tagType: 'launch',
          taskSource: '3',
          tagState: ''
        }
      ],
      TaskCommunityListPayload: {
        jobPageNum: 1,
        jobPageSize: 5,
        commentPageNum: '',
        commentPageSize: '5',
        limit: '5',
        // 今日 未开始 进行中......
        sType: '',
        // 1:全部 2:我负责的 3:我发起的
        taskSource: '1',
        jobName: ''
      },
      // 回复 评论 任务
      addCommentPayload: {
        content: '',
        rid: '',
        rtype: '3',
        commentId: ''
      }
    }
  },
  watch: {
    // 如果 `testData` 发生改变，这个函数就会运行
    selectType: function (newValue, oldValue) {
      var that = this
      if (newValue === '') {
        that.selectValue = '全部任务'
      } else if (newValue === 'today') {
        that.selectValue = '今日任务'
      } else if (newValue === 'unstart') {
        that.selectValue = '未开始任务'
      } else if (newValue === 'unfinish') {
        that.selectValue = '进行中任务'
      } else if (newValue === 'finish') {
        that.selectValue = '已完成任务'
      } else if (newValue === 'overtime') {
        that.selectValue = '逾期任务'
      }
    },
    searchValue: function (newValue, oldValue) {
      var that = this
      this.log('change')
      that.TaskCommunityListPayload.jobName = $.trim(newValue)
      that.getTaskList()
    },
    recall: function (newValue, oldValue) {
      var that = this
      if (newValue) {
        that.getTaskList()
      }
    },
    taskList: function (newValue, oldValue) {
      this.log('listen:', newValue)
    }
  },
  created () {
    this.getTaskList()
  },
  methods: {
    // 任务列表
    getTaskList: function () {
      var that = this
      that.loading = true
      this.ajax('/community/getTaskCommunityList', that.TaskCommunityListPayload).then(res => {
        that.log('getTaskCommunityList:', res)
        if (res.code === 200) {
          this.taskTotalRow = res.data.totalRow
          for (var i = 0; i < res.data.list.length; i++) {
            if (res.data.list[i].status === '0') {
              res.data.list[i].tagStyle = 'noStart'
            } else if (res.data.list[i].status === '1') {
              res.data.list[i].tagStyle = 'isDoing'
            } else if (res.data.list[i].status === '2') {
              res.data.list[i].tagStyle = 'finished'
            } else if (res.data.list[i].status === '4') {
              res.data.list[i].tagStyle = 'overdue'
            }
            for (var k = 0; k < res.data.list[i].commentPage.list.length; k++) {
              if (res.data.list[i].commentPage.list && res.data.list[i].commentPage.list[k].showName) {
                if (that.isImage(res.data.list[i].commentPage.list[k].showName)) {
                  res.data.list[i].commentPage.list[k].isImage = true
                } else {
                  res.data.list[i].commentPage.list[k].isImage = false
                }
                // var encodeShowName = encodeURI(res.data.list[i].commentPage.list[k].showName)
                // res.data.list[i].commentPage.list[k].showName
                res.data.list[i].commentPage.list[k].downLoadurl = that.$store.state.baseServiceUrl + '/file/downloadFile?realUrl=' + res.data.list[i].commentPage.list[k].realUrl + '&showName=' + res.data.list[i].commentPage.list[k].showName
              }
            }
            // 设置 头像背景
            if (that.TaskCommunityListPayload.taskSource === '1') {
              // 我负责的展示 创建者 的名字
              res.data.list[i].headerUser = res.data.list[i].createrName
            } else if (that.TaskCommunityListPayload.taskSource === '2') {
              // 我负责的展示 创建者 的名字
              res.data.list[i].headerUser = res.data.list[i].createrName
            } else if (that.TaskCommunityListPayload.taskSource === '3') {
              // 我发起的展示 执行者 的名字
              res.data.list[i].headerUser = res.data.list[i].userName
            }
            var tobj = {
              logtype: '',
              logStyle: '',
              oContent: '',
              keyid: '',
              oName: '',
              oTime: '',
              oTitle: ''
            }
            var thisYear = res.data.list[i].logPage[0].oTime.substring(0, 4)
            tobj.logtype = res.data.list[i].logPage[0].oTime.substring(0, 4)
            tobj.keyid = 'id_' + i + '_' + tobj.logtype + '_' + tobj.oContent
            tobj.logStyle = 'year'
            res.data.list[i].logPage.splice(0, 0, tobj)
            // this.log('添加：', res.data.list[i].logPage.list)
            for (var t = 0; t < res.data.list[i].logPage.length; t++) {
              if (res.data.list[i].logPage[t].oTime === '') {
                // j
              } else {
                if (res.data.list[i].logPage[t].oTime.substring(0, 4) === thisYear) {
                  var appleDate = res.data.list[i].logPage[t].oTime.replace(/-/g, '/')
                  var date = new Date(appleDate)
                  res.data.list[i].logPage[t].year = date.getFullYear()
                  res.data.list[i].logPage[t].mondate = (date.getMonth() + 1) + '/' + date.getDate()
                  res.data.list[i].logPage[t].houMin = date.getHours() + ':' + date.getMinutes()
                  res.data.list[i].logPage[t].keyid = 'id_' + i + '_' + t + '_' + res.data.list[i].logPage[t].oContent
                  if (t === 1) {
                    res.data.list[i].logPage[t].logStyle = 'latest'
                  } else {
                    res.data.list[i].logPage[t].logStyle = 'time'
                  }
                } else {
                  if (res.data.list[i].logPage[0].oTime.substring(0, 4)) {
                    thisYear = res.data.list[i].logPage[0].oTime.substring(0, 4)
                    tobj.logtype = res.data.list[i].logPage[0].oTime.substring(0, 4)
                    tobj.keyid = 'id_' + i + '_' + t + '_' + tobj.logtype + '_' + tobj.oContent
                    res.data.list[i].logPage.splice(t, 0, tobj)
                  } else {
                    // j
                  }
                }
              }
            }
          }
          that.taskList = res.data.list
          if (!that.taskList || that.taskList.length === 0) {
            that.noDataShow = true
          } else {
            that.noDataShow = false
          }
          that.log('taskList:', that.taskList)
        } else {
          that.$message({
            message: res.msg,
            type: 'wornimg'
          })
        }
        if (that.currentTaskItemId) {
          that.responseCancel(that.currentTaskItemId)
        } else {
          // that.log('不存在')
        }
        that.loading = false
      })
    },
    tagClick: function (type) {
      var that = this
      for (var i = 0; i < that.tagsArr.length; i++) {
        if (that.tagsArr[i].tagType === type) {
          that.tagsArr[i].tagState = 'active'
          that.TaskCommunityListPayload.taskSource = that.tagsArr[i].taskSource
        } else {
          that.tagsArr[i].tagState = ''
        }
      }
      that.getTaskList()
    },
    handleCommand (command) {
      this.TaskCommunityListPayload.sType = command
      this.selectType = command
      this.getTaskList()
    },
    querySearchAsync (queryString, cb) {
      var that = this
      if (queryString) {
        that.autoCompleteNamesPayload.projectManager = queryString
        this.ajax('/general/autoCompleteNames', that.autoCompleteNamesPayload).then(res => {
          if (res.code === 200) {
            var dddarr = []
            if (res.msg.length > 0) {
              for (var i = 0; i < res.msg.length; i++) {
                var obj = {}
                obj.value = res.msg[i].Name + ' (' + res.msg[i].jName + ')'
                obj.userId = res.msg[i].ID
                // obj.jName = res.msg[i].jName
                dddarr.push(obj)
              }
              // 调用 callback 返回建议列表的数据
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
    handleSelect (item) {
      // console.log(item.userId)
      this.Mid = item.userId
    },
    // 点击回复
    responseBtn: function (id, index) {
      var that = this
      var c = -1
      var obj = {}
      $('#textArea' + '_' + id + '_' + index).focus()
      for (var i = 0; i < that.taskList.length; i++) {
        if (that.taskList[i].uid === id) {
          c = i
          that.taskList[i].responseHeight = 150
          obj = that.taskList[i]
        } else {
          that.taskList[i].responseHeight = 0
        }
      }
      if (c >= 0) {
        that.taskList.splice(c, 1, obj)
      }
    },
    // 取消回复
    responseCancel: function (id, index2) {
      var that = this
      that.currentTaskItemId = id
      var obj = {}
      var c = -1
      for (var i = 0; i < that.taskList.length; i++) {
        if (that.taskList[i].uid === id) {
          c = i
          that.taskList[i].responseHeight = 0
          obj = that.taskList[i]
        }
      }
      that.textareaVal = ''
      if (index2 || index2 >= 0) {
        $('#myfileTaskResp' + '_' + id + '_' + index2).val('')
      }
      that.taskList.splice(c, 1, obj)
    },
    // 点击回复 提交
    responseOk: function (taskId) {
      var that = this
      that.currentTaskItemId = taskId.split('_')[1]
      var url = that.$store.state.baseServiceUrl
      var formData = new FormData($('#' + taskId)[0])
      formData.append('rid', taskId.split('_')[1])
      formData.append('rtype', '3')
      if (that.textareaVal) {
        $.ajax({
          type: 'post',
          url: url + '/general/addOrEditComment',
          data: formData,
          cache: false,
          processData: false,
          contentType: false,
          crossDomain: true,
          xhrFields: {
            withCredentials: true
          }
        }).then(function (data) {
          if (data.code === 200) {
            that.$message({
              type: 'success',
              message: data.msg
            })
            that.textareaVal = ''
            $('#myfileTaskResp' + '_' + taskId.split('_')[1] + '_' + taskId.split('_')[2]).val('')
            that.getTaskList()
          } else if (data.code === 300) {
            that.$message({
              type: 'error',
              message: data.msg
            })
            that.loading = false
          } else {
            that.$message({
              type: 'error',
              message: data.msg
            })
            that.loading = false
          }
          that.textareaVal = ''
          $('#myfileTaskResp' + '_' + taskId.split('_')[1] + '_' + taskId.split('_')[2]).val('')
        })
      } else {
        that.loading = false
        that.$message({
          type: 'error',
          message: '评论内容不能为空'
        })
      }
    },
    toDetail: function (id) {
      this.$router.push('/taskDetailPage/' + id)
    },
    currentChange: function (pageNum) {
      this.log(pageNum)
      this.TaskCommunityListPayload.jobPageNum = pageNum
      this.getTaskList()
    },
    // 评论 图片预览
    showBigImage (url, imgName) {
      if (url) {
        this.preImageUrl = url
        this.showBigImageVisible = true
      } else {
        this.$message('地址无效')
      }
    }
  }
}
</script>

<style scoped>
  .nodata div img{
    width: 100%;
  }
  .tabsSelectTagBox{
    display: flex;
    justify-content: space-between;
  }
  .tabsSelectTagLeft{
    display: flex;
  }
  .tabsSelectTagRight{
    _width: 100px;
    display: flex;
  }
  .selectByType{
    margin-right: 20px;
  }
  .tabsSelTagItem{
    cursor: pointer;
    margin-right: 10px;
  }
  .tabsSelTagItem.active{
    color: #409EFF;
  }
  .tabsCntList{
    min-height: 400px;
    padding: 10px 0;
  }
  .tabsCntItem{
    display: flex;
    padding: 15px 0;
    border-bottom: 1px solid #eee;
  }
  .headPicBox{
    width: 70px;
  }
  .tabsCntBox{
    flex-grow: 1;
  }
  .headPic{
    width: 50px;
    height: 50px;
    color: #fff;
    line-height: 50px;
    text-align: center;
    font-size: 12px;
    border-radius: 25px;
    overflow: hidden;
    background-color: #96bf65;
    _background-image: url("../../static/img/headPicDefault.png");
    background-size: cover;
  }
  .tabsCntTitBox{
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .tabsCntTit{
    font-size: 14px;
  }
  .tabsCntTit span{
    font-weight: bold;
    margin-right: 5px;
  }
  .dateAndLikeTags{
    display: flex;
    justify-content: space-between;
    padding-bottom: 6px;
    border-bottom: 1px dashed #eee;
  }
  .tabsCntTextDate{
    color: #ccc;
  }
  .tabsCntLikeTags{
    display: flex;
  }
  .tabsCntTextBox{
    position: relative;
    overflow: hidden;
    margin-bottom: 10px;
  }
  .taskStateBiao{
    color: #fff;
    font-size: 12px;
    line-height: 20px;
    text-align: center;
    position: absolute;
    top: 11px;
    right: -28px;
    width: 100px;
    background-color: #3a8ee6;
    transform: rotate(45deg);
  }
  .taskStateBiao.noStart{
    background-color: #ffb400;
  }
  .taskStateBiao.isDoing{
    background-color: #13ce66;
  }
  .taskStateBiao.finished{
    background-color: #3a8ee6;
  }
  .taskStateBiao.overdue{
    background-color: #aaa;
  }
  .tabsTaskCnt{
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    padding: 8px;
    padding-right: 0;
    background-color: #f5f8fa;
    position: relative;
  }
  .tabsTaskCntLeft{
    border-left: 3px solid #3a8ee6;
  }
  .tabsTaskCntRight{
    font-size: 12px;
    color: #bbb;
    padding-right: 56px;
  }
  .taskCntLeftNameBox{
    display: flex;
  }
  .taskCntLeftName{
    cursor: pointer;
    color: #3a8ee6;
  }
  .taskCntLeftType{
    width: 60px;
    margin-left: 10px;
    color: #2d83cf;
    font-size: 16px;
  }
  .taskCntLeftProgress{
    display: flex;
    margin-top: 10px;
  }
  .ProgressType{
    width: 60px;
    font-size: 12px;
    margin-left: 10px;
  }
  .progressBox{
    display: flex;
    line-height: 22px;
  }
  .progressItem{
    _width: 150px;
    height: 22px;
    color: #fff;
    position: relative;
    margin-left: 14px;
    padding-left: 20px;
    padding-right: 15px;
    box-sizing: border-box;
    background-color: #aaa;
  }
  .progressItem:nth-child(1){
    margin-left: 0;
    _background-color: #13ce66;
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
    border-bottom-left-radius: 14px;
    border-top-left-radius: 14px;
  }
  .progressItem:last-child{
    border-bottom-right-radius: 14px;
    border-top-right-radius: 14px;
  }
  /*.progressItemArrow{*/
    /*width: 26px;*/
    /*height: 26px;*/
    /*position: absolute;*/
    /*right: 0;*/
    /*top: 0;*/
    /*background-color: #3a8ee6;*/
    /*transform: rotateX(45deg);*/
  /*}*/
  .progressItemArrowRight{
    width: 0px;
    height: 0px;
    position: absolute;
    right: -11px;
    top: 0;
    _background-color: #3a8ee6;
    border-top: 11px solid transparent;
    border-bottom: 11px solid transparent;
    border-left: 11px solid #aaa;
  }
  .progressItemArrowLeft{
    width: 0px;
    height: 0px;
    position: absolute;
    left: -11px;
    top: 0;
    _background-color: #3a8ee6;
    border-top: 11px solid #aaa;
    border-bottom: 11px solid #aaa;
    border-left: 11px solid transparent;
  }
  .progressItem:nth-child(1) .progressItemArrowLeft{
    display: none;
  }
  .progressItem:last-child .progressItemArrowRight{
    display: none;
  }
  .progressItem.progressYes{
    background-color: #13ce66;
  }
  .progressYes .progressItemArrowLeft{
    border-top: 11px solid #13ce66;
    border-bottom: 11px solid #13ce66;
    border-left: 11px solid transparent;
  }
  .progressYes .progressItemArrowRight{
    border-top: 11px solid transparent;
    border-bottom: 11px solid transparent;
    border-left: 11px solid #13ce66;
  }
  .likeTagsItem{
    color: #999;
    cursor: pointer;
    margin-left: 15px;
  }
  .likeTagsItem i{
    margin-right: 5px;
  }
  .tabsCntResponse{
    padding-top: 15px;
  }
  .likeTagsItem:hover{
    color: #3a8ee6;
  }
  .responseItem{
    margin-top: 10px;
    display: flex;
  }
  .responseHeadPicBox{
    width: 45px;
  }
  .responseHeadPic{
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    border-radius: 15px;
    overflow: hidden;
    background-image: url("../../static/img/headPicDefault.png");
    background-size: cover;
  }
  .responseCntBox{
    flex-grow: 1;
  }
  .picPreview{
    width: 100px;
    height: 60px;
    margin-top: 10px;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    background-color: #f5f5f5;
  }
  .picPreview img{
    width: 100%;
  }
  .responseDateBox{
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }
  .responseDate{
    color: #8f9ca6;
    font-size: 12px;
  }
  .responseDate span{
    margin-left: 10px;
  }
  .fengeline{
    height: 20px;
    display: flex;
    justify-content: space-between;
    background-color: #f5f8fa;
  }
  .arrow1{
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-left: 10px solid #fff;
  }
  .arrow2{
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-right: 10px solid #fff;
  }
  .line{
    flex-grow: 1;
    height: 9px;
    border-bottom: 2px solid #e4ebf0;
  }
  /*时间线*/
  .timeLine{
    padding: 10px;
    padding-top: 0;
    box-sizing: border-box;
    background-color: #f5f8fa;
  }
  .timeLineTitle{
    color:#aaa;
    font-size: 12px;
  }
  .timeLineCnt{}
  .timeLineItem{
    font-size: 12px;
    display: flex;
  }
  .timeLineItemLeft{
    width: 60px;
    padding-top: 5px;
  }
  .timeLineItemYear{
    height: 19px;
    line-height: 19px;
    text-align: center;
    color: #38ba72;
    position: relative;
    background-color: rgba(56, 186, 114, 0.2);
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  .timeLineItemTime{
    height: 19px;
    line-height: 19px;
    text-align: center;
    color: #ccc;
  }
  .timeLineItemTime span{
    color: #aaa;
    margin-left: 5px;
  }
  .timeLineItem.latest .timeLineItemTime,.timeLineItem.latest .timeLineItemTime span{
    color: #38ba72;
  }
  .yearTagBgArrow{
    position: absolute;
    top: 0;
    right: -9px;
    border-top: 10px solid transparent;
    border-bottom: 9px solid transparent;
    border-left: 9px solid rgba(56, 186, 114, 0.2);
  }
  .timeLineItemMiddle{
    width: 20px;
    height: 30px;
    margin-left: 10px;
    position: relative;
  }
  .middleBgLine{
    width: 10px;
    height: 15px;
    position: absolute;
    left: 0;
    top: 0;
    border-right: 1px solid #bbb;
  }
  .middleBgLineBottom{
    width: 10px;
    height: 15px;
    position: absolute;
    left: 0;
    bottom: 0;
    border-right: 1px solid #bbb;
  }
  .timeLineItemRight{
    font-size: 12px;
    line-height: 30px;
    flex-grow: 1;
    padding-left: 6px;
    box-sizing: border-box;
  }
  .middleDotOut{
    opacity: 0;
  }
  .timeLineItemMiddle.year .middleDot{
    width: 5px;
    height: 5px;
    border-radius: 3px;
    border: 1px solid #38ba72;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -3px;
    margin-top: -3px;
  }
  .timeLineItemMiddle.time .middleDot{
    width: 5px;
    height: 5px;
    border-radius: 3px;
    border: 1px solid #ccc;
    background-color: #ccc;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -3px;
    margin-top: -3px;
  }
  .timeLineItemMiddle.latest .middleDot{
    width: 5px;
    height: 5px;
    border-radius: 3px;
    border: 1px solid #38ba72;
    background-color: #38ba72;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -3px;
    margin-top: -3px;
  }
  .timeLineItemMiddle.latest .middleDotOut{
    width: 15px;
    height: 15px;
    border-radius: 8px;
    background-color: #38ba72;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -7px;
    margin-top: -7px;
    opacity: 0.2;
  }
  /**/
  .responseArea{
    height: 0px;
    padding-top: 10px;
    overflow: hidden;
    transition: height 0.5s;
  }
  .responseArea textarea{
    width: 100%;
    height: 100px;
    resize: none;
    padding: 10px;
    box-sizing: border-box;
  }
  .resAreaOther{
    display: flex;
    margin-top: -3px;
    padding: 6px 5px;
    background-color: #f5f8fa;
    justify-content: space-between;
  }
</style>
