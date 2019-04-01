<template>
  <div class="DynamicsPro">
    <!---->
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
              <el-dropdown-item command="">全部项目</el-dropdown-item>
              <el-dropdown-item command="0">公司项目</el-dropdown-item>
              <el-dropdown-item command="1">部门项目</el-dropdown-item>
              <el-dropdown-item command="2">小组项目</el-dropdown-item>
              <el-dropdown-item command="3">个人项目</el-dropdown-item>
              <el-dropdown-item command="4">集团战略</el-dropdown-item>
              <el-dropdown-item command="5">产品研发</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="searchTask">
          <el-input placeholder="请输入要检索的内容" v-model="searchValue" clearable></el-input>
          <!--<el-autocomplete style="width: 100%"-->
                           <!--v-model="searchName"-->
                           <!--:fetch-suggestions="querySearchAsync"-->
                           <!--placeholder="请输入搜索内容"-->
                           <!--:trigger-on-focus="false"-->
                           <!--@select="handleSelect"-->
          <!--&gt;</el-autocomplete>-->
        </div>
      </div>
    </div>
    <div class="tabsCntList" v-loading="loading">
      <!--暂无数据-->
      <div class="nodata" v-if="noDataShow">
        <div style="width:165px; margin: 0 auto; margin-top: 50px;"><img src="../../static/img/nodata.png" /></div>
        <div style="text-align: center; color: #666; margin-top: 15px; font-size: 14px;">暂无数据</div>
      </div>
      <!---->
      <div class="tabsCntItem" v-for="(taskItem, taskIndex) in taskList" :key="taskItem.uid + '-' + taskIndex">
        <div class="headPicBox">
          <div class="headPic" v-bind:class="taskItem.proType">{{taskItem.projectType}}</div>
        </div>
        <div class="tabsCntBox">
          <div class="tabsCntTitBox">
            <div class="tabsCntTit" v-on:click="toDetail(taskItem.projectUID)"><span>{{taskItem.projectName}}</span></div>
          </div>
          <div class="tabsCntTextBox">
            <div class="tabsTaskCnt">
              <div class="tabsTaskCntLeft">
                <div class="taskCntLeftNameBox">
                  <div class="taskCntLeftType">负责人</div>
                  <div class="taskCntLeftName">{{taskItem.projectManager}}</div>
                </div>
                <div class="taskCntLeftProgress">
                  <div class="ProgressType">进度</div>
                  <div class="progressBox2">
                    <div class="swiper-box">
                      <div class="swiper-container">
                        <div class="swiper-wrapper">
                          <div class="swiper-slide progressItem" v-bind:class="'progrsStyle' + progressItem.state" v-for="(progressItem, index) in taskItem.evolve" :key="progressItem.id + '_' + index">
                            <div class="yangtuo">
                              <div class="yangtuoJiao"></div>
                            </div>
                            <!--<div>Slide 1</div>-->
                            <!--<div class="tag"></div>-->
                            <!--<div class="progressItemArrowLeft"></div>-->
                            <!--<div class="progressItemArrowRight"></div>-->
                            {{progressItem.newName}}
                          </div>
                          <!--<div class="swiper-slide">-->
                            <!--<div>Slide 2</div>-->
                            <!--<div class="tag"></div>-->
                          <!--</div>-->
                          <!--<div class="swiper-slide">-->
                            <!--<div>Slide 3</div>-->
                            <!--<div class="tag"></div>-->
                          <!--</div>-->
                          <!--<div class="swiper-slide">-->
                            <!--<div>Slide 4</div>-->
                            <!--<div class="tag"></div>-->
                          <!--</div>-->
                          <!--<div class="swiper-slide">-->
                            <!--<div>Slide 5</div>-->
                            <!--<div class="tag"></div>-->
                          <!--</div>-->
                          <!--<div class="swiper-slide">-->
                            <!--<div>Slide 6</div>-->
                            <!--<div class="tag"></div>-->
                          <!--</div>-->
                        </div>
                        <!-- Add Pagination -->
                        <!--<div class="swiper-pagination"></div>-->
                      </div>
                    </div>
                  </div>
                  <!--<div class="progressBox" v-bind:style="{ overflowX: taskItem.evolve.length>6?'auto':'unset'}">-->
                    <!--<div class="scrollBox" v-bind:style="{ width: taskItem.evolve.length * 150 + 'px'}">-->
                      <!--<div class="progressItem" v-bind:class="'progrsStyle' + progressItem.state" v-for="(progressItem, index) in taskItem.evolve" :key="progressItem.id + '_' + index">-->
                        <!--<div class="progressItemArrowLeft"></div>-->
                        <!--<div class="progressItemArrowRight"></div>-->
                        <!--{{progressItem.newName}}-->
                      <!--</div>-->
                    <!--</div>-->
                  <!--</div>-->
                </div>
              </div>
              <div class="tabsTaskCntRight">
                <!--<div class="TaskManager"><span>{{taskItem.startDate + '%' +  taskItem.endDate}}</span></div>-->
                <div class="TaskManager">
                  <span>{{taskItem.startDate ? taskItem.startDate.split(' ')[0] + '至' + taskItem.endDate.split(' ')[0] : ''}}</span>
                </div>
                <div class="TaskManager" v-if="taskItem.overDay>0?true:false">{{taskItem.statusInfo}}：<span>{{taskItem.overDay}}天</span></div>
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
                <div class="timeLineItem" v-for="logs in taskItem.logs" :key="logs.keyid" v-bind:class="logs.logStyle">
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
                  <div class="timeLineItemRight" v-if="logs.oContent">{{logs.oTitle}} <span v-if="logs.oName?true:false">【{{logs.oName}}】</span>{{logs.oContent}}</div>
                  <!--<div class="timeLineItemRight" v-if="logs.oContent">{{logs.oTitle + '【' + logs.oName + '】' + logs.oContent}}</div>-->
                </div>
              </div>
            </div>
            <!--右上角 标-->
            <div class="taskStateBiao" v-bind:class="taskItem.tagStyle">{{taskItem.statusInfo}}</div>
          </div>
          <div class="dateAndLikeTags">
            <div class="tabsCntTextDate">{{taskItem.createDate}}</div>
            <div class="tabsCntLikeTags">
              <!--<div class="likeTagsItem" v-on:click="addTaskBtn()"><i class="el-icon-document"></i>添加任务</div>-->
              <!--<div class="likeTagsItem"><i class="el-icon-goods"></i>打赏</div>-->
              <!--<div class="likeTagsItem"><i class="el-icon-star-off"></i>收藏</div>-->
              <!--<div class="likeTagsItem"><i class="el-icon-edit-outline"></i>回复</div>-->
              <div class="likeTagsItem" v-on:click="responseBtn(taskItem.projectUID, taskIndex)"><i class="el-icon-edit"></i>回复</div>
            </div>
          </div>
          <!--添加评论-->
          <div class="responseArea" v-bind:style="{ height: taskItem.responseHeight + 'px'}">
            <textarea name="content" v-bind:id="'textArea' + '_' + taskItem.projectUID + '_' + taskIndex" v-model="textareaVal" placeholder="请输入回复内容"></textarea>
            <div class="resAreaOther">
              <div>
                <component v-bind:is="compArr.FileUploadComp" v-bind:clearInfo="IsClear" v-on:FileDataEmit="GetFileInfo"></component>
                <!--<input type="file" v-bind:id="'myfileProResp' + '_' + taskItem.projectUID + '_' + taskIndex" name="myfile" placeholder="请选择文件"/>-->
              </div>
              <div class="resAreaOtherBtn">
                <el-button size="mini" @click="responseCancel(taskItem.projectUID, taskIndex)">取 消</el-button>
                <el-button size="mini" type="primary" @click="responseOk(taskItem.projectUID)">提 交</el-button>
              </div>
            </div>
            <!--<form v-bind:id="'uploadFile2' + '_' + taskItem.projectUID + '_' + taskIndex" enctype="multipart/form-data">-->
              <!--<textarea name="content" v-bind:id="'textArea' + '_' + taskItem.projectUID + '_' + taskIndex" v-model="textareaVal" placeholder="请输入回复内容"></textarea>-->
              <!--<div class="resAreaOther">-->
                <!--<div><input type="file" v-bind:id="'myfileProResp' + '_' + taskItem.projectUID + '_' + taskIndex" name="myfile" placeholder="请选择文件"/></div>-->
                <!--<div class="resAreaOtherBtn">-->
                  <!--<el-button size="mini" @click="responseCancel(taskItem.projectUID, taskIndex)">取 消</el-button>-->
                  <!--<el-button size="mini" type="primary" @click="responseOk('uploadFile2' + '_' + taskItem.projectUID + '_' + taskIndex)">提 交</el-button>-->
                <!--</div>-->
              <!--</div>-->
            <!--</form>-->
          </div>
          <!---->
          <div class="tabsCntResponse">
            <div class="responseItem" v-for="commonItem in taskItem.comments" :key="commonItem.id">
              <div class="responseHeadPicBox">
                <div class="responseHeadPic">{{commonItem.customerName?commonItem.customerName.substring(0,1):'某'}}</div>
              </div>
              <div class="responseCntBox">
                <div class="responseCnt">
                  <span class="responseName">{{commonItem.customerName}}</span>说：<span class="responseText">{{commonItem.content}}</span>
                  <!--<span style="font-size: 14px;margin-left: 20px;" v-if="commonItem.downLoadurl"><a v-bind:href="commonItem.downLoadurl">附件:{{commonItem.uploads[0].showName}}</a></span>-->
                </div>
                <!--附件在这里预览-->
                <div class="picPreview" v-if="commonItem.uploads[0] && commonItem.uploads[0].isImage" @click="showBigImage(commonItem.uploads[0].previewUrl)" v-bind:style="{backgroundImage: 'url(' + commonItem.uploads[0].previewUrl + ')'}">
                </div>
                <!--附件下载-->
                <div v-if="commonItem.uploads[0] && commonItem.uploads[0].downLoadurl" style="padding-top: 8px;">
                  <span style="font-size: 14px;"><a v-bind:href="commonItem.uploads[0].downLoadurl">附件下载: {{commonItem.uploads[0].showName}}</a></span>
                </div>
                <div class="responseDateBox">
                  <div class="responseDate">{{commonItem.createDate}}</div>
                  <!--<div class="responseDate"><span>打赏</span><span>回复</span></div>-->
                </div>
              </div>
            </div>
          </div>
          <!---->
          <!--<div class="responseArea" v-bind:style="{ height: taskItem.responseHeight + 'px'}">-->
            <!--<form id="uploadFile2" enctype="multipart/form-data">-->
              <!--<textarea name="content" id="textArea" v-model="textareaVal" placeholder="请输入回复内容"></textarea>-->
              <!--<div class="resAreaOther">-->
                <!--<div><input type="file" id="myfileProResp" name="myfile" placeholder="请选择文件"/></div>-->
                <!--<div class="resAreaOtherBtn">-->
                  <!--<el-button size="mini" @click="responseCancel(taskItem.projectUID)">取 消</el-button>-->
                  <!--<el-button size="mini" type="primary" @click="responseOk(taskItem.projectUID)">提 交</el-button>-->
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
    <!--预览图片-->
    <el-dialog title="预览图片" :visible.sync="showBigImageVisible">
      <div style="width: 100%"><img style="width: 100%" v-bind:src="preImageUrl" alt=""></div>
    </el-dialog>
    <!--分页器-->
    <div class="paginationBox" style="text-align: center; padding-top: 20px;">
      <el-pagination v-bind:page-size="ProCommunityListPayload.pageSize" layout="prev, pager, next" :total="taskTotalRow" v-on:current-change="currentChange"></el-pagination>
    </div>
    <!---->
  </div>
</template>

<script>
import Swiper from 'swiper'
import FileUploadComp from './CustomComp/FileUploadComp.vue'
import 'swiper/dist/css/swiper.min.css'
export default {
  name: 'DynamicsPro',
  props: ['recall', 'refresh'],
  components: {
    FileUploadComp
  },
  data () {
    return {
      msg: '任务动态',
      compArr: {
        FileUploadComp: 'FileUploadComp'
      },
      // 附件上传
      FileUploadArr: [],
      IsClear: false,
      // 控制nodata图片显示与隐藏
      noDataShow: false,
      preImageUrl: '',
      showBigImageVisible: false,
      loading: false,
      textareaVal: '',
      selectType: '',
      taskTotalRow: 0,
      currentTaskItemId: '',
      selectValue: '全部项目',
      searchName: '',
      taskList: [],
      searchValue: '',
      tagsArr: [
        {
          tagName: '全部',
          tagType: 'all',
          type: '',
          tagState: 'active'
        },
        {
          tagName: '我负责的',
          tagType: 'my',
          type: '2',
          tagState: ''
        },
        {
          tagName: '我创建的',
          tagType: 'create',
          type: '1',
          tagState: ''
        },
        {
          tagName: '我参与的',
          tagType: 'launch',
          type: '3',
          tagState: ''
        }
      ],
      ProCommunityListPayload: {
        pageNum: 1,
        pageSize: 5,
        type: '',
        status: '',
        projectType: '',
        projectName: ''
      },
      TaskCommunityListPayload: {
        jobPageNum: '',
        jobPageSize: '',
        commentPageNum: '',
        commentPageSize: '',
        limit: '5',
        sType: '',
        taskSource: '1'
      }
    }
  },
  watch: {
    // 如果 `testData` 发生改变，这个函数就会运行
    selectType: function (newValue, oldValue) {
      var that = this
      if (newValue === '') {
        that.selectValue = '全部项目'
      } else if (newValue === '0') {
        that.selectValue = '公司项目'
      } else if (newValue === '1') {
        that.selectValue = '部门项目'
      } else if (newValue === '2') {
        that.selectValue = '小组项目'
      } else if (newValue === '3') {
        that.selectValue = '个人项目'
      } else if (newValue === '4') {
        that.selectValue = '集团战略'
      } else if (newValue === '5') {
        that.selectValue = '产品研发'
      }
    },
    searchValue: function (newValue, oldValue) {
      var that = this
      that.ProCommunityListPayload.projectName = $.trim(newValue)
      that.getProList()
    },
    recall: function (newValue, oldValue) {
      var that = this
      if (newValue) {
        that.getProList()
      }
    },
    // 父组件传递过来的信息 是否刷新
    refresh: function (val, old) {
      if (val) {
        this.getProList()
        // 抛出信息，告知父组件已刷新，将开关关闭
        this.$emit('CompThrow', false)
      }
    }
  },
  created () {
    this.getProList()
    // this.getTaskList()
  },
  mounted () {
    var mySwiper = new Swiper('.swiper-container', {
      autoplay: true,
      loop: true
    })
    this.log(mySwiper)
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
    testSwiper: function () {
      var that = this
      setTimeout(function () {
        var mySwiper = new Swiper('.swiper-container', {
          slidesPerView: 4,
          spaceBetween: 0,
          pagination: {
            el: '.swiper-pagination',
            clickable: true
          }
        })
        that.log(mySwiper)
      }, 500)
    },
    // 项目列表
    getProList: function () {
      var that = this
      that.loading = true
      this.ajax('/community/getProjectCommunityList', that.ProCommunityListPayload).then(res => {
        that.log('getProList:', res)
        if (res.code === 200) {
          that.taskTotalRow = res.data.totalRow
          for (var i = 0; i < res.data.list.length; i++) {
            if (res.data.list[i].state === '0') {
              res.data.list[i].tagStyle = 'noStart'
              res.data.list[i].statusInfo = '未开始'
            } else if (res.data.list[i].state === '2') {
              res.data.list[i].tagStyle = 'isDoing'
              res.data.list[i].statusInfo = '进行中'
            } else if (res.data.list[i].state === '3') {
              res.data.list[i].tagStyle = 'finished'
              res.data.list[i].statusInfo = '已完成'
            }
            // 头像背景颜色 不同类型不同颜色
            if (res.data.list[i].projectType.substring(0, 2) === '公司' || res.data.list[i].projectType.substring(0, 2) === '集团') {
              res.data.list[i].proType = 'company'
            } else if (res.data.list[i].projectType.substring(0, 2) === '部门') {
              res.data.list[i].proType = 'department'
            } else if (res.data.list[i].projectType.substring(0, 2) === '个人') {
              res.data.list[i].proType = 'personal'
            } else {
              // company department personal general
              res.data.list[i].proType = 'general'
            }
            // var downurl = that.$store.state.baseServiceUrl + '/file/downloadFile?realUrl=' + res.data.list[i].uploads[0].realUrl + '&showName=' + res.data.list[i].uploads[0].showName
            for (var k = 0; k < res.data.list[i].comments.length; k++) {
              if (res.data.list[i].comments[k].uploads[0] && res.data.list[i].comments[k].uploads.length > 0) {
                // that.log(i + ':' + k + ':' + res.data.list[i].comments[k].showName)
                if (that.isImage(res.data.list[i].comments[k].uploads[0].showName)) {
                  res.data.list[i].comments[k].uploads[0].isImage = true
                } else {
                  res.data.list[i].comments[k].uploads[0].isImage = false
                }
                res.data.list[i].comments[k].uploads[0].downLoadurl = that.$store.state.baseServiceUrl + '/file/downloadFile?realUrl=' + res.data.list[i].comments[k].uploads[0].realUrl + '&showName=' + res.data.list[i].comments[k].uploads[0].showName
              }
            }
            // 进度 数据整理
            for (var p = 0; p < res.data.list[i].evolve.length; p++) {
              if (res.data.list[i].evolve[p].name.length > 5) {
                if (res.data.list[i].evolve[p].type === '2') {
                  res.data.list[i].evolve[p].newName = '计划:' + res.data.list[i].evolve[p].name.substring(0, 5) + '...'
                } else if (res.data.list[i].evolve[p].type === '3') {
                  res.data.list[i].evolve[p].newName = '任务:' + res.data.list[i].evolve[p].name.substring(0, 5) + '...'
                } else {
                  res.data.list[i].evolve[p].newName = res.data.list[i].evolve[p].name.substring(0, 5) + '...'
                }
              } else {
                if (res.data.list[i].evolve[p].type === '2') {
                  res.data.list[i].evolve[p].newName = '计划:' + res.data.list[i].evolve[p].name
                } else if (res.data.list[i].evolve[p].type === '3') {
                  res.data.list[i].evolve[p].newName = '任务:' + res.data.list[i].evolve[p].name
                } else {
                  res.data.list[i].evolve[p].newName = res.data.list[i].evolve[p].name
                }
              }
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
            // alert('oTime:' + res.data.list[i].logs[0].oTime)
            var thisYear = res.data.list[i].logs[0].oTime.substring(0, 4)
            tobj.logtype = res.data.list[i].logs[0].oTime.substring(0, 4)
            tobj.keyid = 'id_' + i + '_' + tobj.logtype + '_' + tobj.oContent
            tobj.logStyle = 'year'
            res.data.list[i].logs.splice(0, 0, tobj)
            for (var t = 0; t < res.data.list[i].logs.length; t++) {
              if (res.data.list[i].logs[t].oTime === '') {
                // j
              } else {
                if (res.data.list[i].logs[t].oTime.substring(0, 4) === thisYear) {
                  var date = new Date(that.dateCompatibility(res.data.list[i].logs[t].oTime))
                  var minTime
                  if (date.getMinutes() < 10) {
                    minTime = '0' + date.getMinutes()
                  } else {
                    minTime = date.getMinutes()
                  }
                  res.data.list[i].logs[t].year = date.getFullYear()
                  res.data.list[i].logs[t].mondate = (date.getMonth() + 1) + '/' + date.getDate()
                  res.data.list[i].logs[t].houMin = date.getHours() + ':' + minTime
                  res.data.list[i].logs[t].keyid = 'id_' + i + '_' + t + '_' + res.data.list[i].logs[t].oContent
                  if (t === 1) {
                    res.data.list[i].logs[t].logStyle = 'latest'
                  } else {
                    res.data.list[i].logs[t].logStyle = 'time'
                  }
                } else {
                  if (res.data.list[i].logs[0].oTime.substring(0, 4)) {
                    thisYear = res.data.list[i].logs[0].oTime.substring(0, 4)
                    tobj.logtype = res.data.list[i].logs[0].oTime.substring(0, 4)
                    tobj.keyid = 'id_' + i + '_' + t + '_' + tobj.logtype + '_' + tobj.oContent
                    res.data.list[i].logs.splice(t, 0, tobj)
                  } else {
                    // j
                  }
                }
              }
            }
          }
          that.taskList = res.data.list
          that.testSwiper()
          // 控制nodata图片显示与隐藏
          if (!that.taskList || that.taskList.length === 0) {
            that.noDataShow = true
          } else {
            that.noDataShow = false
          }
          // that.log('proTaskList:', that.taskList)
        } else {
          that.$message({
            message: res.msg,
            type: 'worning'
          })
        }
        if (that.currentTaskItemId) {
          // that.log('存在')
          that.responseCancel(that.currentTaskItemId)
        } else {
          // that.log('不存在')
        }
        that.loading = false
      })
    },
    // 点击 记录列表下的添加任务
    addTaskBtn: function () {
      // this.log(123)
    },
    tagClick: function (type) {
      var that = this
      for (var i = 0; i < this.tagsArr.length; i++) {
        if (this.tagsArr[i].tagType === type) {
          this.tagsArr[i].tagState = 'active'
          that.ProCommunityListPayload.type = that.tagsArr[i].type
          that.getProList()
        } else {
          this.tagsArr[i].tagState = ''
        }
      }
    },
    handleCommand (command) {
      this.selectType = command
      this.ProCommunityListPayload.projectType = command
      this.getProList()
      // this.$message('click on item ' + command)
    },
    querySearchAsync (queryString, cb) {
      var that = this
      if (queryString) {
        that.autoCompleteNamesPayload.projectManager = queryString
        this.ajax('/myProject/autoCompleteNames', that.autoCompleteNamesPayload).then(res => {
          if (res.code === 200) {
            var dddarr = []
            if (res.data.length > 0) {
              for (var i = 0; i < res.data.length; i++) {
                var obj = {}
                obj.value = res.data[i].Name + ' (' + res.data[i].jName + ')'
                obj.userId = res.data[i].ID
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
    responseBtn: function (id, index) {
      var that = this
      that.currentTaskItemId = id
      var c = -1
      var obj = {}
      $('#textArea' + '_' + id + '_' + index).focus()
      // that.log('id:', id)
      for (var i = 0; i < that.taskList.length; i++) {
        if (that.taskList[i].projectUID === id) {
          c = i
          that.taskList[i].responseHeight = 180
          obj = that.taskList[i]
        } else {
          that.taskList[i].responseHeight = 0
        }
      }
      if (c >= 0) {
        that.taskList.splice(c, 1, obj)
      }
    },
    responseCancel: function (id) {
      var that = this
      that.currentTaskItemId = id
      var obj = {}
      var c = -1
      for (var i = 0; i < that.taskList.length; i++) {
        if (that.taskList[i].projectUID === id) {
          c = i
          that.taskList[i].responseHeight = 0
          obj = that.taskList[i]
        }
      }
      that.taskList.splice(c, 1, obj)
    },
    // that.ajax('/community/addCommunityTask', that.CommunityTaskPayload).then(res => {
    responseOk: function (taskId) {
      var that = this
      that.currentTaskItemId = taskId
      if ($.trim(that.textareaVal)) {
        that.ajax('/comment/addComment', {content: that.textareaVal, attachmentId: that.SetFileIdStr(), contentId: taskId}).then(res => {
          if (res.code === 200) {
            that.IsClear = true
            that.$message({
              type: 'success',
              message: res.msg
            })
            that.textareaVal = ''
            that.getProList()
          } else {
            that.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
      } else {
        that.$message({
          type: 'error',
          message: '评论内容不能为空'
        })
      }
    },
    // 创建任务
    // responseOk: function (taskId, index) {
    //   var that = this
    //   that.loading = true
    //   that.currentTaskItemId = taskId.split('_')[1]
    //   var url = that.$store.state.baseServiceUrl
    //   var formData = new FormData($('#' + taskId)[0])
    //   formData.append('rid', taskId.split('_')[1])
    //   formData.append('rtype', '1')
    //   if (that.textareaVal) {
    //     $.ajax({
    //       type: 'post',
    //       url: url + '/general/addOrEditComment',
    //       data: formData,
    //       cache: false,
    //       processData: false,
    //       contentType: false,
    //       crossDomain: true,
    //       xhrFields: {
    //         withCredentials: true
    //       }
    //     }).then(function (data) {
    //       that.loading = false
    //       if (data.code === 200) {
    //         that.$message({
    //           type: 'success',
    //           message: data.msg
    //         })
    //         that.textareaVal = ''
    //         $('#myfileProResp' + '_' + taskId.split('_')[1] + '_' + index).val('')
    //         that.getProList()
    //       } else if (data.code === 300) {
    //         that.$message({
    //           type: 'error',
    //           message: data.msg
    //         })
    //         that.loading = false
    //       } else {
    //         that.$message({
    //           type: 'error',
    //           message: data.msg
    //         })
    //         that.loading = false
    //       }
    //       that.textareaVal = ''
    //       $('#myfileProResp' + '_' + taskId.split('_')[1] + '_' + index).val('')
    //     })
    //   } else {
    //     that.loading = false
    //     that.$message({
    //       type: 'error',
    //       message: '评论内容不能为空'
    //     })
    //   }
    // },
    toDetail: function (id) {
      console.log('id', id)
      this.$router.push('/ProDetail')
      this.$store.state.proId = id
    },
    currentChange: function (pageNum) {
      this.ProCommunityListPayload.pageNum = pageNum
      this.getProList()
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
    background-color: #1687d9;
    _background-image: url("../../static/img/headPicDefault.png");
    background-size: cover;
  }
  /*company department personal general*/
  .headPic.company{
    background-color: #1687d9;
  }
  .headPic.department{
    background-color: #a1a5ee;
  }
  .headPic.personal{
    background-color: #96bf65;
  }
  .headPic.general{
    background-color: #f79c6f;
  }
  .tabsCntTitBox{
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .tabsCntTit{
    color: #3a8ee6;
    cursor: pointer;
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
    width: 196px;
    font-size: 12px;
    color: #bbb;
    text-align: right;
    padding-right: 56px;
  }
  .taskCntLeftNameBox{
    display: flex;
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
    width: 700px;
    overflow-y: hidden;
    overflow-x: auto;
    _display: flex;
  }
  .progressBox2{
    width: 700px;
  }
  .progressBox::-webkit-scrollbar-track-piece{
    background: rgba(0,0,0,0.1)
  }
  .scrollBox{
    display: flex;
  }
  .progressItem{
    width: 130px;
    height: 22px;
    color: #fff;
    cursor: pointer;
    position: relative;
    _margin-left: 14px;
    margin-left: 0px;
    padding-left: 20px;
    padding-right: 15px;
    box-sizing: border-box;
    background-color: #13ce66;
  }
  .progressItem.progrsStyle0{
    background-color: #aaa;
  }
  .progressItem.progrsStyle1{
    background-color: #3a8ee6;
  }
  .progressItem.progrsStyle2{
    background-color: #13ce66;
  }
  .progressItem:nth-child(1){
    margin-left: 0;
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
    border-left: 11px solid #13ce66;
  }
  .progressItemArrowLeft{
    width: 0px;
    height: 0px;
    position: absolute;
    left: -11px;
    top: 0;
    _background-color: #3a8ee6;
    border-top: 11px solid #13ce66;
    border-bottom: 11px solid #13ce66;
    border-left: 11px solid transparent;
  }
  .progressItem:nth-child(1) .progressItemArrowLeft{
    display: none;
  }
  .progressItem:last-child .progressItemArrowRight{
    display: none;
  }
  /** 设置进度条背景色 */
  /** 未开始 **/
  .progrsStyle0 .progressItemArrowLeft{
    border-top: 11px solid #aaa;
    border-bottom: 11px solid #aaa;
    border-left: 11px solid transparent;
  }
  .progrsStyle0 .progressItemArrowRight{
    border-top: 11px solid transparent;
    border-bottom: 11px solid transparent;
    border-left: 11px solid #aaa;
  }
  /** 进行中 **/
  .progrsStyle1 .progressItemArrowLeft{
    border-top: 11px solid #3a8ee6;
    border-bottom: 11px solid #3a8ee6;
    border-left: 11px solid transparent;
  }
  .progrsStyle1 .progressItemArrowRight{
    border-top: 11px solid transparent;
    border-bottom: 11px solid transparent;
    border-left: 11px solid #3a8ee6;
  }
  /** 已完成 **/
  .progrsStyle2 .progressItemArrowLeft{
    border-top: 11px solid #13ce66;
    border-bottom: 11px solid #13ce66;
    border-left: 11px solid transparent;
  }
  .progrsStyle2 .progressItemArrowRight{
    border-top: 11px solid transparent;
    border-bottom: 11px solid transparent;
    border-left: 11px solid #13ce66;
  }
  .likeTagsItem{
    color: #66757f;
    margin-left: 5px;
    cursor: pointer;
  }
  .likeTagsItem i{
    color: #a9b8bf;
    margin-right: 5px;
  }
  .likeTagsItem:hover,.likeTagsItem:hover i{
    color: #3a8ee6;
  }
  .tabsCntResponse{
    padding-top: 15px;
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
    color: #fff;
    text-align: center;
    line-height: 30px;
    border-radius: 15px;
    overflow: hidden;
    background-color: #96bf65;
    _background-image: url("../../static/img/headPicDefault.png");
    background-size: cover;
  }
  .responseCntBox{
    flex-grow: 1;
  }
  .responseDateBox{
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
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
    padding-top: 0;
    overflow: hidden;
    transition: height 0.5s;
  }
  .responseArea textarea{
    width: 100%;
    height: 100px;
    resize: none;
    box-sizing: border-box;
  }
  .resAreaOther{
    display: flex;
    margin-top: -3px;
    padding: 6px 5px;
    background-color: #f5f8fa;
    justify-content: space-between;
  }
  .swiper-box{
    width:600px;
    _height:50px;
    _border:1px solid #aaa;
  }
  .swiper-container {
    width: 100%;
    height: 100%;
  }
  .swiper-slide {
    text-align: center;
    font-size: 12px;
    background: #fff;
    position:relative;

    /* Center slide text vertically */
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
  }
  .tag{
    width:20px;
    height:20px;
    background-color:#09C;
    border-radius: 10px;
    position:absolute;
    right:-20px;
    top:5px;
    z-index: 10;
  }
  /**/
  .yangtuo{
    width: 18px;
    height: 22px;
    position: absolute;
    right: -15px;
    top: 0;
    z-index: 20;
    overflow: hidden;
  }
  .yangtuoJiao{
    width: 22px;
    height: 22px;
    border: 2px solid #fff;
    position: absolute;
    left: -14px;
    top: -2px;
    transform: rotate(45deg);
    background-color: inherit;
  }
  .progrsStyle0 .yangtuoJiao{
    background-color: #aaa;
  }
  .progrsStyle1 .yangtuoJiao{
    background-color: #3a8ee6;
  }
  .progrsStyle2 .yangtuoJiao{
    background-color: #13ce66;
  }
  .progressItem:last-child .yangtuo{
    display: none;
  }
</style>
