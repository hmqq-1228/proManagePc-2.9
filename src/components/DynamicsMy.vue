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
                <div class="TaskManager" style="text-align: right;" v-if="taskItem.dayNum >= 0"> 剩余<span style="color: #13ce66;font-size: 18px;"> {{taskItem.dayNum}} </span>天</div>
                <div class="TaskManager" style="text-align: right;" v-if="taskItem.dayNum < 0"> 逾期<span style="color: #f00;font-size: 18px;"> {{Math.abs(taskItem.dayNum)}} </span>天</div>
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
                <div class="timeLineItem" v-for="(logs, index8) in taskItem.logPage" :key="logs.keyid + '-' + index8" v-bind:class="logs.logStyle">
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
            <div class="responseItem" v-for="(commonItem, index9) in taskItem.commentPage.list" :key="commonItem.id + '-' + index9">
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
    <Drawer class="drawerScroll" :closable="false" width="40%" v-model="value4">
      <div class="slidTop">
        <div v-bind:class="'topState' + taskBasicMsg.status"><img src="../../static/img/stataNew.png" alt="">{{taskBasicMsg.statusStr}}</div>
        <div><span>紧急程度: </span><span><Rate v-model="taskBasicMsg.jobLevel" disabled/></span></div>
      </div>
      <div class="taskMsg">
        <div class="taskLf">
          <div class="taskName">{{taskBasicMsg.jobName}}</div>
          <div class="taskDetail" v-bind:title="taskBasicMsg.description">{{taskBasicMsg.description}}</div>
        </div>
        <div class="taskRt">
          <div v-if="taskBasicMsg.status === '0'"><img src="../../static/img/unstart.png" alt=""></div>
          <div v-if="taskBasicMsg.status === '1'"><img src="../../static/img/doing.png" alt=""></div>
          <div v-if="taskBasicMsg.status === '2'"><img src="../../static/img/finish.png" alt=""></div>
        </div>
      </div>
      <div class="taskTime">
        <el-collapse>
          <el-collapse-item style="padding: 0 10px;">
            <template slot="title">
              <img src="../../static/img/time.png" alt=""><span style="margin-left: 10px;">起止时间: {{taskBasicMsg.taskStartDate}} 到 {{taskBasicMsg.taskFinishDate}}</span>
              <div style="margin-left: 10%;" v-if="taskBasicMsg.dayNum && taskBasicMsg.dayNum >= 0">剩余 <span style="color: #53b5ff;font-size: 16px;font-weight: bold">{{taskBasicMsg.dayNum}}</span> 天</div>
              <div style="margin-left: 10%;" v-if="taskBasicMsg.dayNum && taskBasicMsg.dayNum < 0"><span style="color:red;font-size: 16px;">已逾期</span></div>
              <div style="margin-left: 10%;" v-if="!taskBasicMsg.dayNum"><span style="color:#27CF97;font-size: 16px;">已完成</span></div>
            </template>
            <div class="managePro">
              <div><img src="../../static/img/fuzeren.png" alt=""><span class="proLabel">负责人:</span><span>{{taskBasicMsg.userName}}</span></div>
              <div><img src="../../static/img/faqiren.png" alt=""><span class="proLabel">创建人:</span><span>{{taskBasicMsg.createrName}}</span></div>
            </div>
            <div class="managePro" style="margin-top: 10px;">
              <div><img src="../../static/img/kaishi.png" alt=""><span class="proLabel">实际开始:</span><span v-if="taskBasicMsg.dealWithDate">{{taskBasicMsg.dealWithDate}}</span><span v-if="!taskBasicMsg.dealWithDate">暂未开始</span></div>
              <div><img src="../../static/img/jiesu.png" alt=""><span class="proLabel">实际结束:</span><span v-if="taskBasicMsg.realFinishDate">{{taskBasicMsg.realFinishDate}}</span><span v-if="!taskBasicMsg.realFinishDate">暂未完成</span></div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="cannetProject">
        <div style="display: inline-block"><img src="../../static/img/guanlian.png" alt=""><span>关联项目:</span></div>
        <span class="linkProject" v-if="taskBasicMsg.reProjectList.length > 0" v-for="(project, index) in taskBasicMsg.reProjectList" v-bind:key="index" @click="getNextPlan(project.projectUID)">{{project.projectName}}</span>
        <span v-if="!taskBasicMsg.reProjectList || taskBasicMsg.reProjectList.length === 0" >未关联项目</span>
      </div>
      <div class="cannetProject">
        <div style="display: inline-block"><img src="../../static/img/xiangmu.png" alt=""><span>所属项目:</span></div>
        <div style="display: inline-block">{{taskBasicMsg.projectName}}</div>
      </div>
      <div class="cannetProject">
        <div style="display: inline-block"><img src="../../static/img/fujian.png" alt=""><span>项目附件:</span></div>
        <div style="display: inline-block;font-size: 14px;" v-if="taskBasicMsg.showName">
          <span style="display: inline-block;">{{taskBasicMsg.showName}}</span>
          <span v-if="taskBasicMsg.isImg" @click="showImagePre" style="margin-left: 10px;display: inline-block;color: #53b5ff;cursor: pointer;">预览</span>
          <span style="margin-left: 10px;display: inline-block;"><a v-bind:href="downurl"> 下载<i style="font-weight: bold !important; padding: 5px; color: chocolate;" class="el-icon-download"></i></a></span>
        </div>
        <div style="display: inline-block;font-size: 14px;" v-if="!taskBasicMsg.showName">暂无附件</div>
      </div>
      <div class="cannetProject" v-if="false">
        <Button type="primary" style="margin-right: 30px;">Primary</Button><Button type="primary" style="margin-right: 30px;">Primary</Button><Button type="primary">Primary</Button>
      </div>
      <div class="cannetProject1">
        <div style="display: inline-block"><img src="../../static/img/goutong.png" alt=""><span>沟 通</span></div>
      </div>
      <div class="el-textarea" v-loading="loading2">
        <form id="uploadFileRe" enctype="multipart/form-data">
          <textarea name="content" class="el-textarea__inner" id="textArea2" type="text" v-model="commitComent"></textarea>
          <div class="cannetProject2">
            <div style="display: inline-block">
              <img src="../../static/img/fujian.png" alt="">
              <a href="javascript:;" class="file" @change="getFileName">选择文件
                <input type="file" name="myfile" id="myfile2">
              </a>
              <input type="hidden" name="rid" v-bind:value="rid2">
              <input type="hidden" name="rtype" v-bind:value="3">
              <span class="showFileName"></span>
            </div>
            <div><i-button type="info" v-bind:disabled="butnDisabled" @click="addMarkInfo()">回复</i-button></div>
          </div>
        </form>
      </div>
      <div class="cannetProject1-1">
        <div style="display: inline-block"><img src="../../static/img/jilu.png" alt=""><span>沟通记录</span></div>
      </div>
      <div class="timeLine">
        <Timeline v-if="commentList && commentList.length > 0">
          <Timeline-item color="green" v-for="(comment, index) in commentList" v-bind:key="index">
            <p class="time">{{comment.createDate}}</p>
            <p class="content" v-bind:title="comment.content">{{comment.customer_name}}说: {{comment.content}}</p>
            <p class="content" v-if="comment.showName">附件:
              <span style="display: inline-block"> {{comment.showName}}</span>
              <span v-if="comment.isImg" style="display: inline-block;color: #53b5ff;margin-left: 10px;cursor: pointer;" @click="showImagePreCom(comment.previewUrl)">预览</span>
              <span style="margin-left: 10px;display: inline-block;"><a v-bind:href="comment.downloadUrl"> 下载<i style="font-weight: bold !important; padding: 5px; color: chocolate;" class="el-icon-download"></i></a></span>
            </p>
          </Timeline-item>
        </Timeline>
        <div class="noComment" v-if="commentList.length === 0">还没有人发言呦~</div>
        <div style="text-align: center">
          <Page :total="totalNum" size="small" :page-size="pageSize" show-total @on-change="getCurrentPage($event)"></Page>
        </div>
      </div>
      <div class="cannetProject1-1" style="margin-top: 0">
        <div style="display: inline-block"><img src="../../static/img/history.png" alt=""><span>操作记录</span></div>
      </div>
      <div class="timeLine">
        <Timeline>
          <Timeline-item v-for="(history, index) in historyList" v-bind:key="index">
            <p class="time">{{history.oTime}}</p>
            <p class="content">{{history.oName}}{{history.oContent}}</p>
            <p class="content" v-if="history.showName"><span>附件:</span>
              <span style="display: inline-block"> {{history.showName}}</span>
              <span v-if="history.isImg" style="display: inline-block;color: #53b5ff;margin-left: 10px;cursor: pointer;" @click="showImagePreCom(history.previewUrl)">预览</span>
              <span style="margin-left: 10px;display: inline-block;"><a v-bind:href="history.downloadUrl"> 下载<i style="font-weight: bold !important; padding: 5px; color: chocolate;" class="el-icon-download"></i></a></span>
            </p>
          </Timeline-item>
        </Timeline>
        <div style="text-align: center">
          <Page :total="totalHistoryNum" size="small" :page-size="pageSize" show-total @on-change="getCurrentHistoryPage($event)"></Page>
        </div>
      </div>
    </Drawer>
    <!--预览图片-->
    <el-dialog title="图片预览" :visible.sync="dialogFormVisible">
      <div class="showImg"><img v-bind:src="taskBasicMsg.previewUrl" alt=""></div>
    </el-dialog>
    <el-dialog title="图片预览" :visible.sync="dialogShowImg">
      <div class="showImg"><img v-bind:src="commentPreviewUrl" alt=""></div>
    </el-dialog>
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
      // 抽屉
      rid2: '',
      taskId2: '',
      totalNum: 1,
      pageSize: 5,
      totalHistoryNum: 1,
      dialogShowImg: false,
      commentPreviewUrl: '',
      dialogFormVisible: false,
      value4: false,
      taskBasicMsg: '',
      commitComent: '',
      loading2: false,
      commentList: [],
      historyList: [],
      butnDisabled: true,
      taskComment: {
        uid: '',
        pageNum: 1,
        pageSize: 5
      },
      taskHistoryList: {
        uid: '',
        pageNum: 1,
        pageSize: 5
      },
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
    },
    commitComent: function (val, oVal) {
      if (val) {
        this.butnDisabled = false
      } else {
        this.butnDisabled = true
      }
    },
    fileName: function (val, oval) {
    }
  },
  created () {
    this.getTaskList()
  },
  methods: {
    resetScro: function () {
      $('.ivu-drawer-body').scrollTop(0)
    },
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
    // toDetail: function (id) {
    //   // this.$router.push('/taskDetailPage/' + id)
    //   this.value4 = true
    // },
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
    },
    // 抽屉
    getFileName: function () {
      var filePath = $('#myfile2').val()
      var arr = filePath.split('\\')
      var fileName = arr[arr.length - 1]
      $('.showFileName').html(fileName)
    },
    toDetail: function (id) {
      var that = this
      // that.resetScro()
      that.taskId2 = id
      that.taskComment.uid = id
      that.taskHistoryList.uid = id
      that.value4 = true
      that.getCommicateCont()
      that.getHistoryList()
      that.ajax('/leader/getTaskBasic', {uid: that.taskId2}).then(res => {
        if (res.code === 200) {
          that.taskBasicMsg = res.data
          that.rid2 = res.data.uid
          if (that.isImage(res.data.showName)) {
            res.data.isImg = true
          } else {
            res.data.isImg = false
          }
          that.downurl = that.$store.state.baseServiceUrl + '/file/downloadFile?realUrl=' + res.data.realUrl + '&showName=' + res.data.showName
          that.resetScro()
        }
      })
    },
    getCommicateCont: function () {
      var that = this
      that.ajax('/leader/getTaskComment', that.taskComment).then(res => {
        if (res.code === 200) {
          that.commentList = res.data.list
          that.totalNum = res.data.totalRow
          for (var i = 0; i < that.commentList.length; i++) {
            if (that.isImage(res.data.list[i].showName)) {
              res.data.list[i].isImg = true
            } else {
              res.data.list[i].isImg = false
            }
            res.data.list[i].downloadUrl = that.$store.state.baseServiceUrl + '/file/downloadFile?realUrl=' + res.data.list[i].realUrl + '&showName=' + res.data.list[i].showName
          }
        }
      })
    },
    getCurrentPage: function (e) {
      this.taskComment.pageNum = e
      this.getCommicateCont()
    },
    getHistoryList: function () {
      var that = this
      that.ajax('/leader/getTaskLog', that.taskHistoryList).then(res => {
        if (res.code === 200) {
          that.historyList = res.data.list
          that.totalHistoryNum = res.data.totalRow
          for (var i = 0; i < that.historyList.length; i++) {
            if (that.isImage(res.data.list[i].showName)) {
              res.data.list[i].isImg = true
            } else {
              res.data.list[i].isImg = false
            }
            that.historyList[i].downloadUrl = that.$store.state.baseServiceUrl + '/file/downloadFile?realUrl=' + res.data.list[i].realUrl + '&showName=' + res.data.list[i].showName
          }
        }
      })
    },
    getCurrentHistoryPage: function (e) {
      this.taskHistoryList.pageNum = e
      this.getHistoryList()
    },
    showImagePre: function () {
      this.dialogFormVisible = true
    },
    showImagePreCom: function (url) {
      if (url) {
        this.commentPreviewUrl = url
        this.dialogShowImg = true
      }
    },
    addMarkInfo () {
      var that = this
      var url = that.$store.state.baseServiceUrl
      var formData = new FormData($('#uploadFileRe')[0])
      var taxtV2 = $('#textArea2').val()
      that.loading2 = true
      if (taxtV2) {
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
            that.getCommicateCont()
            that.commitComent = ''
            $('.showFileName').html('')
            $('#myfile2').val('')
            that.loading2 = false
          } else {
            that.$message({
              type: 'error',
              message: data.msg
            })
            $('.showFileName').html('')
            that.commitComent = ''
            $('#myfile2').val('')
            that.loading2 = false
          }
        })
      } else {
        that.$message({
          type: 'error',
          message: '备注不能为空！'
        })
        that.loading2 = false
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
    line-height: 40px;
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
    /*padding-top: 10px;*/
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
  /*抽屉*/
  .slidTop{
    height: 40px;
    line-height: 40px;
    font-size: 15px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #f1f1f1;
  }
  .topState0 img,.topState1 img,.topState2 img{
    float: left;
    margin-top: 6px;
  }
  .topState0{
    color: #ffc107;
  }
  .topState1{
    color: #26a2ff;
  }
  .topState2{
    color: #27CF97;
  }
  .taskLf{
    padding: 10px;
    width: 80%;
  }
  .taskName{
    font-size: 16px;
    font-weight: bold;
    font-family: '黑体';
  }
  .taskDetail{
    font-size: 14px;
    margin-top: 10px;
    text-indent: 2em;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    text-overflow:ellipsis;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }
  .taskRt{
    width: 20%;
    position: relative;
  }
  .taskRt div{
    width: 90px;
    float: right;
    margin: 10px;
  }
  .taskRt div img{
    width: 100%;
  }
  .taskMsg{
    background-color: #f5f8fa;
    display: flex;
    justify-content: space-between;
  }
  .managePro{
    display: flex;
    justify-content: space-between;
  }
  .managePro div{
    width: 50%;
  }
  .managePro div img{
    float: left;
    margin-right: 20px;
  }
  .managePro div .proLabel{
    color: #1296db;
    display: inline-block;
    margin-right: 20px;
  }
  .cannetProject{
    height: 49px;
    line-height: 49px;
    border-bottom: 1px solid #f1f1f1;
    font-size: 15px;
    font-family: '黑体';
    padding:0 10px;
  }
  .cannetProject1{
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #f1f1f1;
    background-color: #f5f8fa;
    font-size: 16px;
    font-family: '黑体';
    font-weight: bold;
    padding:0 10px;
  }
  .cannetProject1-1{
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #f1f1f1;
    background-color: #f5f8fa;
    font-size: 16px;
    font-family: '黑体';
    font-weight: bold;
    padding:0 10px;
    margin-top: 20px;
    border-top: 1px solid #f1f1f1;
  }
  .cannetProject2{
    height: 40px;
    width: 90%;
    color: #1296db;
    display: flex;
    justify-content: space-between;
    line-height: 40px;
    font-size: 14px;
    /*font-family: '黑体';*/
    padding:0 10px;
    background-color: #f5f8fa;
  }
  .cannetProject2 div img{
    float: left;
    margin-top: 10px;
    margin-right: 10px;
    width: 18px;
  }
  .cannetProject div img{
    float: left;
    margin-top: 15px;
    margin-right: 10px;
  }
  .cannetProject1 div img{
    float: left;
    margin-top: 9px;
    margin-right: 10px;
  }
  .cannetProject1-1 div img{
    float: left;
    margin-top: 9px;
    margin-right: 10px;
  }
  .el-textarea{
    margin-top: 20px;
    margin-left: 10px;
  }
  .el-textarea__inner{
    width: 90%;
    min-height: 80px;
  }
  .file {
    position: relative;
    display: inline-block;
    background: #D0EEFF;
    border: 1px solid #99D3F5;
    border-radius: 4px;
    padding: 4px 12px;
    overflow: hidden;
    color: #1E88C7;
    text-decoration: none;
    text-indent: 0;
    line-height: 20px;
    margin-top: 6px;
  }
  .file input {
    position: absolute;
    font-size: 100px;
    right: 0;
    top: 0;
    opacity: 0;
  }
  .file:hover {
    background: #AADFFD;
    border-color: #78C3F3;
    color: #004974;
    text-decoration: none;
  }
  .showFileName{
    float: right;
    margin-left: 10px;
  }
  .time{
    font-size: 14px;
    font-weight: bold;
  }
  .content{
    padding-left: 5px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .timeLine{
    padding: 20px;
  }
  .linkProject{
    color: #fff;
    font-size: 14px;
    padding: 4px 10px;
    background-color: #409EFF;
    margin-right: 10px;
    border-radius: 4px;
    cursor: pointer;
  }
  .linkProject:hover{
    background-color: #1771ff;
  }
  .showImg img{
    width: 100%;
  }
  .noComment{
    height: 50px;
    text-align: center;
    line-height: 50px;
    color: #aaa;
  }
</style>
