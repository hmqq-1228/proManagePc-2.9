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
        <div style="display: flex;justify-content: space-between">
          <div style="width: 50px;cursor: pointer;" v-if="taskBasicMsg.showDeleteFlag" @click="delTask(taskBasicMsg.uid)"><Icon type="ios-trash-outline" size="24" color="#53b5ff"/></div>
          <div @click="modifyTask(taskBasicMsg.uid)" style="width: 50px;padding-top: 3px;font-size: 14px;color: #409EFF;cursor: pointer;" v-if="taskBasicMsg.showMenu===0?false:true"><i class="el-icon-edit" style="font-size: 18px;color: #409EFF"></i> 修改</div>
        </div>
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
              <div style="margin-left: 10%;" v-if="!taskBasicMsg.dayNum"><span v-bind:class="'topState' + taskBasicMsg.status">{{taskBasicMsg.statusStr}}</span></div>
            </template>
            <div class="managePro">
              <div><img src="../../static/img/fuzeren.png" alt=""><span class="proLabel">负责人:</span><span>{{taskBasicMsg.userName}}</span></div>
              <div><img src="../../static/img/faqiren.png" alt=""><span class="proLabel">创建人:</span><span>{{taskBasicMsg.createrName}}</span></div>
            </div>
            <div class="managePro" style="margin-top: 10px;">
              <div><img src="../../static/img/kaishi.png" alt=""><span class="proLabel">实际开始:</span><span v-if="taskBasicMsg.dealWithDate">{{taskBasicMsg.dealWithDate}}</span><span style="color: #888;" v-if="!taskBasicMsg.dealWithDate">暂未开始</span></div>
              <div><img src="../../static/img/jiesu.png" alt=""><span class="proLabel">实际结束:</span><span v-if="taskBasicMsg.realFinishDate">{{taskBasicMsg.realFinishDate}}</span><span style="color: #888;" v-if="!taskBasicMsg.realFinishDate">暂未完成</span></div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="cannetProject">
        <div style="display: inline-block"><img src="../../static/img/guanlian.png" alt=""><span>关联项目:</span></div>
        <span class="linkProject" v-if="taskBasicMsg.reProjectList.length > 0" v-for="(project, index) in taskBasicMsg.reProjectList" v-bind:key="index" @click="getNextPlan(project.projectUID)">{{project.projectName}}</span>
        <span style="color: #888;font-size: 14px;" v-if="!taskBasicMsg.reProjectList || taskBasicMsg.reProjectList.length === 0" >未关联项目</span>
      </div>
      <div class="cannetProject">
        <div style="display: inline-block"><img src="../../static/img/xiangmu.png" alt=""><span>所属项目:</span></div>
        <div style="display: inline-block">{{taskBasicMsg.projectName}}</div>
      </div>
      <div class="cannetProject">
        <div style="display: inline-block"><img src="../../static/img/taskFa.png" alt=""><span>父级任务:</span></div>
        <div style="display: inline-block;color: #409EFF;cursor: pointer;" v-if="taskBasicMsg.parentTaskName" @click="toDetail(taskBasicMsg.parentTaskID)">{{taskBasicMsg.parentTaskName}}</div>
        <div style="display: inline-block;color: #888;" v-if="!taskBasicMsg.parentTaskName">无父级任务</div>
      </div>
      <div class="cannetProjectFile">
        <div style="display: inline-block"><img src="../../static/img/fujian.png" alt=""><span>任务附件:</span></div>
        <div style="display: inline-block;font-size: 14px;line-height: 26px;" v-if="taskBasicMsg.attachment">
          <span v-for="(file, index) in taskBasicMsg.attachment" v-bind:key="index" style="margin-left: 10px;">
            <span style="display: inline-block;">{{file.showName}}</span>
            <div style="display: inline-block;font-size: 12px;">
              <!--<span @click="deleteFile(file.id)" style="display: inline-block;color: #53b5ff;cursor: pointer;">删除</span>-->
              <span v-if="file.isImg" @click="showImagePre(file.previewUrl)" style="display: inline-block;color: #53b5ff;cursor: pointer;">预览</span>
              <span style="display: inline-block;"><a v-bind:href="file.downurl"> 下载<i style="font-weight: bold !important; padding: 5px; color: chocolate;" class="el-icon-download"></i></a></span>
            </div>
          </span>
        </div>
        <div style="display: inline-block;font-size: 14px;color: #888;" v-if="!taskBasicMsg.attachment || taskBasicMsg.attachment.length === 0">暂无附件</div>
      </div>
      <div class="cannetProject" v-if="taskBasicMsg.showMenu===0?false:true">
        <Button v-if="taskBasicMsg.status === '0'" type="warning" style="margin-right: 20px;" @click="startTask(taskBasicMsg.uid)">任务开始</Button>
        <Button v-if="taskBasicMsg.status === '1'" type="success" style="margin-right: 20px;" @click="finishedTask()">任务完成</Button>
        <Button type="info" style="margin-right: 20px;" @click="transferTask()">任务移交</Button>
        <Button type="info" @click="taskToDevided()">任务分解</Button>
      </div>
      <div class="cannetProject" v-if="taskBasicMsg.isRestart">
        <Button v-if="taskBasicMsg.status === '2'" type="primary" style="margin-right: 20px;" @click="isReStartTask(taskBasicMsg.uid)">任务重启</Button>
      </div>
      <div class="cannetProject1" v-if="toShowDevided">
        <div style="display: inline-block"><img src="../../static/img/delTask.png" alt=""><span>任务分解</span></div>
      </div>
      <div style="position: relative;width: 90%;margin-left: 10px;" v-if="toShowDevided">
        <div v-loading="loading32">
          <div class="paiTaskIptBox" style="position: relative;">
            <div class="selectUserDialog2" style="right: 0;top: 0;" v-if="selectUserDiaShow2">
              <div class="selectUserIpt">
                <el-select v-model="taskForm2.value9" multiple filterable remote style="width: 100%;"
                           :reserve-keyword="false" placeholder="请输人员姓名或拼音(如'张三'或 'zs')"
                           :remote-method="remoteMethod2" :loading="loading22">
                  <el-option v-for="item in options42" :key="item.ID" :label="item.Name + ' (' + item.jName + ')'"
                             :value="item.Name + '-' + item.ID">
                  </el-option>
                </el-select>
              </div>
              <div style="color: #dd6161;font-size: 12px; transform: scale(0.9)" v-if="taskForm2.value9.length===0">* 如果此项不选，则默认自己</div>
              <div class="selectUserBtn" v-on:click="selectUserClick2()"><el-button>确定</el-button></div>
            </div>
            <div class="selectDateDialog2"  style="right: 0;top: 0;" v-if="selectDateDiaShow2">
              <div class="selectDateBox">
                <div class="selectDateItem">
                  <el-date-picker
                    v-model="selDateStart2"
                    type="datetime"
                    :picker-options="pickerOptions0"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择开始时间">
                  </el-date-picker>
                </div>
                <!--<div style="margin-left: 10px; margin-right: 10px;">至</div>-->
                <div class="selectDateItem">
                  <el-date-picker
                    v-model="selDateEnd2"
                    type="datetime"
                    :picker-options="pickerOptions0"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择结束时间">
                  </el-date-picker>
                </div>
              </div>
              <div class="selectUserBtn">
                <el-button v-on:click="selectDateCancel2()">取消</el-button>
                <el-button v-on:click="selectDateOk2()">确定</el-button>
              </div>
            </div>
            <div class="depTaskLevel2" v-bind:style="{ height: taskLevelHeight2 + 'px', top: taskLevelTop2 + 'px', left: taskLevelLeft2 + 'px'}" v-on:mouseleave="rateMouseLeave2()">
              <div class="rateBox">
                <el-rate v-model="levelValue2"></el-rate>
              </div>
            </div>
            <div class="paiTaskIptLeft">
              <div class="paiTaskIptIcon"><i class="el-icon-edit-outline"></i></div>
              <div class="paiTaskIptWrap"><input v-on:focus="inputFocus2()" v-model="taskNameText2" v-on:blur="iptBlur2()" type="text" placeholder="请输入任务名称" /></div>
            </div>
            <div class="paiTaskIptRight">
              <div class="paiTaskIptRightIcon" v-on:click="selectUser2($event)"><i class="el-icon-edit-outline"></i></div>
              <div class="paiTaskIptRightCnt" v-on:click="selectUser2($event)">
                <!--<span v-for="user in taskForm.value9" :key="user"> {{user?user.split('-')[0]:defImplementerName}}</span>-->
                <span v-if="taskForm2.value9.length > 0" v-for="user in taskForm2.value9" :key="user"> {{user.split('-')[0]}}</span>
                <span v-if="taskForm2.value9.length === 0">{{defImplementer.name}}</span>
                <!--<span> {{defImplementer.name}}</span>-->
              </div>
              <div class="paiTaskIptRightIcon" v-on:click="selectDate2($event)"><i class="el-icon-date"></i></div>
              <div class="paiTaskIptRightCnt" v-on:click="selectDate2($event)">时间</div>
              <div class="paiTaskIptRightIcon" v-on:click="selectLevel2($event)"><i class="el-icon-bell"></i></div>
            </div>
          </div>
          <div class="taskRelation" v-if="taskRelationShow2">
            <div class="relationIntro">
              <textarea class="relationIntroArea" v-model="taskIntro2" placeholder="请输入任务简介"></textarea>
            </div>
          </div>
          <div class="taskFileUpload">
            <div class="fileUploadCao">
              <div class="selectLeft" style="width: 440px;">
                <form id="uploadFileDel" enctype="multipart/form-data">
                  <input type="file" :disabled="fileListDis2" v-on:change="fileChange2" id="myfileDel" name="myfile" placeholder="请选择文件"/><br>
                  <!--<el-button type="primary" @click="addMarkInfo()">提 交</el-button>-->
                </form>
                <div style="margin-top: 8px;font-size: 12px">
                  <span style="color: #f00" v-if="fileList2.length === 5">最多选择 <span style="font-size: 16px;font-weight: bold;">{{fileList2.length}}</span> 个附件:</span>
                  <span v-if="fileList2.length < 5">已选 <span style="color: #409EFF;font-size: 16px;font-weight: bold;">{{fileList2.length}}</span> 个附件:</span>
                  <span style="color: #888;" v-if="fileList2.length === 0">暂无附件</span>
                  <span style="color: #409EFF" v-if="fileList2.length > 0" v-for="(file, index) in fileList2" v-bind:key="index"><span style="color: #333">{{index+1}}、</span>{{file.fileName}} <div style="color: #999;display: inline-block;" class="el-icon-close" @click="delUploadFileDel(file.attachmentId)"></div>, </span>
                </div>
              </div>
              <div class="selectRight2">
                <div class="selectMoreInfo" v-on:click="moreClick2()">
                  <i v-bind:class="moreIcon2"></i><span style="margin-left: 6px;">{{moreText2}}</span>
                </div>
                <div class="submitBtn" v-on:click="depSub2()"><i-button type="info">分解</i-button></div>
                <div class="submitBtn" v-on:click="cancelDevide()"><i-button >取消</i-button></div>
              </div>
            </div>
            <div class="fileUploadPre"></div>
          </div>
        </div>
      </div>
      <div class="cannetProject1">
        <div style="display: inline-block"><img src="../../static/img/taskList.png" alt=""><span>子任务<span style="color: #409EFF">({{childTaskList.length}})</span></span></div>
      </div>
      <div class="taskListChild">
        <div class="taskItemChild" v-if="childTaskList.length > 0" v-for="(childTask, index) in childTaskList" v-bind:key="index">
          <div class="childTaskName" style="cursor: pointer;" @click="toDetail(childTask.uid)"><Icon type="md-copy" size="16" color="#409EFF"/> {{childTask.jobName}}</div>
          <div class="childTaskMsg">
            <div v-bind:class="'childTaskStyle' + childTask.status">{{childTask.statusStr}}</div>
            <div v-if="childTask.dayNum >= 0">剩余 <span style="color: #13ce66;font-size: 18px;">{{childTask.dayNum}}</span> 天</div>
            <div v-if="childTask.dayNum < 0">逾期 <span style="color: #f00;font-size: 18px;">{{Math.abs(childTask.dayNum)}}</span> 天</div>
            <div>{{childTask.userName}}</div>
            <div style="width: 20px;margin-right: 0;"><div class="taskDel" v-if="childTask.showDeleteFlag" @click="childTaskDelete(childTask.uid)"><Icon type="md-close" size="18"/></div></div>
          </div>
        </div>
        <div class="taskItemChild2" style="text-align: center;color: #aaa;" v-if="childTaskList.length === 0">
          暂无子任务
        </div>
      </div>
      <div class="cannetProject1">
        <div style="display: inline-block"><img src="../../static/img/goutong.png" alt=""><span>沟 通</span></div>
      </div>
      <div class="el-textarea" v-loading="loading2">
          <textarea name="content" class="el-textarea__inner" id="textArea2" type="text" v-model="commitComent"></textarea>
          <div class="cannetProject21">
            <div style="display: inline-block">
              <form id="uploadFileRe" enctype="multipart/form-data" style="height: 40px;">
                <img src="../../static/img/fujian.png" alt="">
                <a href="javascript:;" class="file">选择文件
                  <input type="file" :disabled="commentDis" name="myfile" id="myfile2" @change="getFileName">
                </a>
                <!--<input type="hidden" name="rid" v-bind:value="rid2">-->
                <!--<input type="hidden" name="rtype" v-bind:value="3">-->
                <span class="showFileName"></span>
              </form>
              <div style="font-size: 12px">
                <span style="color: #f00;" v-if="fileListComment.length === 5">最多选择 <span style="font-size: 16px;font-weight: bold;">{{fileListComment.length}}</span> 个附件:</span>
                <span v-if="fileListComment.length < 5">已选 <span style="color: #409EFF;font-size: 16px;font-weight: bold;">{{fileListComment.length}}</span> 个附件:</span>
                <span style="color: #888;" v-if="fileListComment.length === 0">暂无附件</span>
                <span style="color: #409EFF" v-if="fileListComment.length > 0" v-for="(file, index) in fileListComment" v-bind:key="index"><span style="color: #333">{{index+1}}、</span>{{file.fileName}} <div style="color: #999;display: inline-block;" class="el-icon-close" @click="delUploadFileComment(file.attachmentId)"></div>, </span>
              </div>
            </div>
            <div><i-button type="info" v-bind:disabled="butnDisabled" @click="addMarkInfo()">回复</i-button></div>
          </div>
      </div>
      <div class="cannetProject1-1">
        <div style="display: inline-block"><img src="../../static/img/jilu.png" alt=""><span>沟通记录</span></div>
      </div>
      <div class="timeLine">
        <Timeline v-if="commentList && commentList.length > 0">
          <Timeline-item color="green" v-for="(comment, index) in commentList" v-bind:key="index">
            <p class="time">{{comment.createDate}}</p>
            <p class="content" v-bind:title="comment.content">{{comment.customer_name}}说: {{comment.content}}</p>
            <span v-for="(com, index2) in comment.attachment" v-bind:key="index2">
              <p class="content" v-if="com.showName">附件:
                <span style="display: inline-block"> {{com.showName}}</span>
                <span v-if="com.isImg" style="display: inline-block;color: #53b5ff;margin-left: 10px;cursor: pointer;" @click="showImagePreCom(com.previewUrl)">预览</span>
                <span style="margin-left: 10px;display: inline-block;"><a v-bind:href="com.downloadUrl"> 下载<i style="font-weight: bold !important; padding: 5px; color: chocolate;" class="el-icon-download"></i></a></span>
              </p>
            </span>
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
            <span v-for="(his, index2) in history.attachment" v-bind:key="index2">
              <p class="content" v-if="his.showName"><span>附件:</span>
                <span style="display: inline-block"> {{his.showName}}</span>
                <span v-if="his.isImg" style="display: inline-block;color: #53b5ff;margin-left: 10px;cursor: pointer;" @click="showImagePreCom(his.previewUrl)">预览</span>
                <span style="margin-left: 10px;display: inline-block;"><a v-bind:href="his.downloadUrl"> 下载<i style="font-weight: bold !important; padding: 5px; color: chocolate;" class="el-icon-download"></i></a></span>
              </p>
            </span>
          </Timeline-item>
        </Timeline>
        <div style="text-align: center">
          <Page :total="totalHistoryNum" size="small" :page-size="pageSize" show-total @on-change="getCurrentHistoryPage($event)"></Page>
        </div>
      </div>
    </Drawer>
    <div class="bgCoverModifyTask" v-if="modifyTaskVisible">
      <div class="bgCoverCnt2" v-loading="loadingEdit">
        <h2>修改任务</h2>
        <div class="colose" @click="modifyTaskVisible = false"><i class="el-icon-close"></i></div>
        <div class="bgCoverTabs">
          <!--修改任务form-->
          <div class="planTaskBox">
            <el-form ref="modifyTask" :model="detailTaskform" :rules="modifyTaskRules" label-width="80px">
              <el-form-item label="任务名称" prop="jobName" maxlength="100" width="100">
                <el-input class="planNameIpt" v-model="detailTaskform.jobName"></el-input>
              </el-form-item>
              <el-form-item label="任务级别" prop="jobLevel" maxlength="100" width="100">
                <div class="ratestar" style="padding-top: 6px;">
                  <el-rate v-model="detailTaskform.jobLevel" v-on:change="levelChange($event)"></el-rate>
                </div>
              </el-form-item>
              <el-form-item label="开始时间" prop="taskStartDate">
                <el-col :span="24">
                  <el-date-picker style="width: 100%" type="datetime"
                                  format="yyyy-MM-dd HH:mm:ss"
                                  value-format="yyyy-MM-dd HH:mm:ss"
                                  placeholder="选择日期"
                                  v-model="detailTaskform.taskStartDate"
                                  :picker-options="pickerOptionsTaskSt"
                  ></el-date-picker>
                </el-col>
              </el-form-item>
              <el-form-item label="结束时间" prop="taskFinishDate">
                <el-col :span="24">
                  <!--value-format="yyyy-MM-dd HH:mm:ss"-->
                  <!--format="yyyy-MM-dd HH:mm:ss"-->
                  <el-date-picker type="datetime" style="width: 100%"
                                  format="yyyy-MM-dd HH:mm:ss"
                                  value-format="yyyy-MM-dd HH:mm:ss"
                                  placeholder="选择日期"
                                  v-model="detailTaskform.taskFinishDate"
                                  :picker-options="pickerOptionsTaskSt"
                  ></el-date-picker>
                </el-col>
              </el-form-item>
              <el-form-item label="任务描述" maxlength="100" width="100">
                <el-input class="planNameIpt" type="textarea" style="resize:none;" :rows="2" v-model="detailTaskform.description"></el-input>
              </el-form-item>
              <el-form-item label="任务附件">
                <form id="uploadFileEdit" enctype="multipart/form-data">
                  <input type="file" :disabled="fileListEditDis" style="height: 25px;line-height: 20px;font-size: 12px;" v-on:change="fileChangeEdit" id="myfileEdit" name="myfile" placeholder="请选择文件"/>
                </form>
                <div style="line-height: 20px;font-size: 12px;">
                  <span style="color: #f00;" v-if="fileListEdit.length === 5">最多选择 <span style="font-size: 16px;font-weight: bold;">{{fileListEdit.length}}</span> 个附件:</span>
                  <span v-if="fileListEdit.length < 5">已选 <span style="color: #409EFF;font-size: 16px;font-weight: bold;">{{fileListEdit.length}}</span> 个附件:</span>
                  <span style="color: #888;" v-if="fileListEdit.length === 0">暂无附件</span>
                  <span style="color: #409EFF" v-if="fileListEdit.length > 0" v-for="(file, index) in fileListEdit" v-bind:key="index"><span style="color: #333">{{index+1}}、</span>{{file.showName}}  <div style="color: #999;display: inline-block;" class="el-icon-close" @click="delUploadFile(file.attachmentId)"></div>, </span>
                </div>
              </el-form-item>
              <div style="text-align: center">
                <el-button type="primary" @click="modifyTaskSub('modifyTask')">保存</el-button>
                <el-button @click="modifyTaskVisible = false">关 闭</el-button>
              </div>
            </el-form>
          </div>
          <!---->
        </div>
      </div>
    </div>
    <!--/ 任务完成/-->
    <el-dialog title="任务完成" :visible.sync="taskFinishedVisible" width="25%">
      <div class="el-textarea" v-loading="loading9" style="margin-top: 0">
        <textarea name="remark" class="el-textarea__inner" id="textAreaF" type="text" v-model="commitComentF"></textarea>
        <!--<div class="cannetProject2">-->
        <div style="display: inline-block">
          <form id="uploadFileRe2" enctype="multipart/form-data">
            <img src="../../static/img/fujian.png" alt="">
            <a href="javascript:;" class="file">选择文件
              <input type="file" :disabled="fileListFinishDis" name="myfile" id="myfileF" @change="getFileNameFinished">
            </a>
            <!--<input type="hidden" name="taskId" v-bind:value="taskId2">-->
            <!--<input type="hidden" name="rtype" v-bind:value="3">-->
            <span class="showFileName2"></span>
          </form>
          <div style="font-size: 12px">
            <span style="color: #f00;" v-if="fileListFinish.length === 5">最多选择 <span style="font-size: 16px;font-weight: bold;">{{fileListFinish.length}}</span> 个附件:</span>
            <span v-if="fileListFinish.length < 5">已选 <span style="color: #409EFF;font-size: 16px;font-weight: bold;">{{fileListFinish.length}}</span> 个附件:</span>
            <span style="color: #888;" v-if="fileListFinish.length === 0">暂无附件</span>
            <span style="color: #409EFF" v-if="fileListFinish.length > 0" v-for="(file, index) in fileListFinish" v-bind:key="index"><span style="color: #333">{{index+1}}、</span>{{file.fileName}} <div style="color: #999;display: inline-block;" class="el-icon-close" @click="delUploadFileFinish(file.attachmentId)"></div>, </span>
          </div>
        </div>
        <div slot="footer" class="dialog-footer" style="text-align: center;">
          <i-button @click="concelFinished()">取消</i-button>
          <i-button type="info" v-bind:disabled="butnDisabledF" @click="confirmFinished()">确定</i-button>
        </div>
        <!--</div>-->
      </div>
    </el-dialog>
    <!--任务移交-->
    <el-dialog title="任务移交" :visible.sync="taskTransferVisible" width="26%">
      <div v-loading="loading11">
        <div style="height: 30px;line-height: 30px"><span style="color: red">*</span> 任务移交人：</div>
        <el-autocomplete style="width:90%"
                         v-model="projectManager"
                         :fetch-suggestions="querySearchAsync2"
                         placeholder="请输入移交人姓名"
                         :trigger-on-focus="false"
                         @select="handleSelect2"
        ></el-autocomplete>
        <div style="height: 30px;line-height: 30px"><span style="color: red">*</span> 任务移交备注：</div>
        <textarea name="remark" class="el-textarea__inner" id="Transfer" type="text" v-model="commitComentT"></textarea>
        <!--<div class="cannetProject2">-->
        <div style="display: inline-block">
          <form id="taskTransfer" enctype="multipart/form-data">
            <img src="../../static/img/fujian.png" alt="">
            <a href="javascript:;" class="file">选择文件
              <input type="file" :disabled="fileListTransDis" name="myfile" id="myfileTransfer" @change="getFileNameTran">
            </a>
            <span class="showFileNameTran"></span>
          </form>
          <!--<input type="hidden" name="taskId" v-bind:value="taskId2">-->
          <!--<input type="hidden" name="transferUserId" v-bind:value="transferUserId">-->
          <!--<input type="hidden" name="transferUserName" v-bind:value="transferUserName">-->
          <!--<input type="hidden" name="rtype" v-bind:value="3">-->
          <div style="font-size: 12px">
            <span style="color: #f00" v-if="fileListTrans.length === 5">最多选择 <span style="font-size: 16px;font-weight: bold;">{{fileListTrans.length}}</span> 个附件:</span>
            <span v-if="fileListTrans.length < 5">已选 <span style="color: #409EFF;font-size: 16px;font-weight: bold;">{{fileListTrans.length}}</span> 个附件:</span>
            <span style="color: #888;" v-if="fileListTrans.length === 0">暂无附件</span>
            <span style="color: #409EFF" v-if="fileListTrans.length > 0" v-for="(file, index) in fileListTrans" v-bind:key="index"><span style="color: #333">{{index+1}}、</span>{{file.fileName}} <div style="color: #999;display: inline-block;" class="el-icon-close" @click="delUploadFileTran(file.attachmentId)"></div>, </span>
          </div>
        </div>
        <div slot="footer" class="dialog-footer" style="text-align: center;">
          <i-button @click="concelTransfer()">取消</i-button>
          <i-button type="info" v-bind:disabled="butnDisabledT" @click="taskTransfer()">确定</i-button>
        </div>
      </div>
      <!--</div>-->
    </el-dialog>
    <!--预览图片-->
    <el-dialog title="图片预览" :visible.sync="dialogFormVisible">
      <div class="showImg"><img v-bind:src="showTaskFileUrl" alt=""></div>
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
      showTaskFileUrl: '',
      fileListComment: [],
      commentDis: false,
      fileListCommentLen: 0,
      fileListEdit: [],
      fileListEditDis: false,
      fileListEditLen: 0,
      taskFinishedVisible: false,
      loading9: false,
      commitComentF: '已完成',
      fileListFinish: [],
      fileListFinishDis: false,
      fileListFinishLen: 0,
      butnDisabledF: false,
      // 修改任务
      loadingEdit: false,
      modifyTaskVisible: false,
      detailTaskform: {
        id: '',
        jobName: '',
        jobLevel: 2,
        taskStartDate: '2018-10-10 00:00:00',
        taskFinishDate: '2018-10-10 00:00:00',
        description: ''
      },
      editTaskPayload: {
        id: '1',
        jobName: '',
        jobLevel: 1,
        taskStartDate: '',
        taskFinishDate: '',
        description: '',
        attachmentId: '',
        _jfinal_token: ''
      },
      modifyTaskRules: {
        jobName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        jobLevel: [
          { required: true, message: '请选择任务等级', trigger: 'change' }
        ],
        taskStartDate: [
          { type: 'string', required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        taskFinishDate: [
          { type: 'string', required: true, message: '请选择结束日期', trigger: 'change' }
        ]
      },
      pickerOptionsTaskSt: {},
      pickerOptionsTaskEt: {},
      // ------
      // 任务分解
      taskIntro2: '',
      moreText2: '更多',
      fileList2: [],
      fileListDis2: false,
      fileListLen2: 0,
      toShowDevided: false,
      loading32: false,
      loading22: false,
      options42: [],
      selDateStart2: '',
      selDateEnd2: '',
      levelValue2: 3,
      taskNameText2: '',
      defImplementer: {
        name: '张三',
        id: ''
      },
      pickerOptions0: {},
      taskLevelTop2: '',
      taskLevelLeft2: '',
      taskLevelHeight2: 0,
      taskRelationShow2: false,
      selectUserDiaShow2: false,
      selectDateDiaShow2: false,
      moreIcon2: 'el-icon-arrow-down',
      tranManageArr2: ['taskLevelHeight2'],
      diaManageArr2: ['selectUserDiaShow2', 'selectDateDiaShow2'],
      taskForm2: {
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
      },
      moreUserSelectPayload2: {
        projectManager: ''
      },
      CommunityTaskPayload2: {
        projectUID: '1',
        uid: '1',
        pStr: '',
        attachmentId: '',
        description: '',
        jobName: '',
        jobLevel: 3,
        startTime: '',
        endTime: '',
        userId: '',
        _jfinal_token: '',
        userName: ''
      },
      // 任务移交
      taskTransferVisible: false,
      loading11: false,
      fileListTrans: [],
      fileListTransDis: false,
      fileListTransLen: 0,
      butnDisabledT: true,
      projectManager: '',
      commitComentT: '',
      transferUserId: '',
      transferUserName: '',
      // 抽屉
      rid2: '',
      taskId2: '',
      taskIdEdit: '',
      totalNum: 1,
      pageSize: 5,
      childTaskList: [],
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
    fileListLen2: function (val, oVal) {
      if (val >= 5) {
        this.fileListDis2 = true
      } else if (val < 5) {
        this.fileListDis2 = false
      }
    },
    fileListCommentLen: function (val, oVal) {
      if (val >= 5) {
        this.commentDis = true
      } else if (val < 5) {
        this.commentDis = false
      }
    },
    fileListEditLen: function (val, oVal) {
      if (val >= 5) {
        this.fileListEditDis = true
      } else if (val < 5) {
        this.fileListEditDis = false
      }
    },
    fileListFinishLen: function (val, oVal) {
      if (val >= 5) {
        this.fileListFinishDis = true
      } else if (val < 5) {
        this.fileListFinishDis = false
      }
    },
    fileListTransLen: function (val, oVal) {
      if (val >= 5) {
        this.fileListTransDis = true
      } else if (val < 5) {
        this.fileListTransDis = false
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
    commitComentF: function (val, oVal) {
      if (val === '') {
        this.butnDisabledF = true
      } else {
        this.butnDisabledF = false
      }
    },
    projectManager: function (val, oVal) {
      if (val) {
        this.butnDisabledT = false
      } else {
        this.butnDisabledT = true
      }
    },
    taskFinishedVisible: function (val, oVal) {
      if (val === false) {
        this.commitComentF = '已完成'
        this.fileListFinish = []
        $('.showFileName2').html('')
        $('#myfileF').val('')
      }
    },
    taskTransferVisible: function (val, oVal) {
      if (val === false) {
        this.projectManager = ''
        this.commitComentT = ''
        this.fileListTrans = []
        $('#myfileTransfer').val('')
        $('.showFileNameTran').html('')
      }
    },
    // 任务分解
    levelValue2: function (newQuestion, oldQuestion) {
      this.CommunityTaskPayload2.jobLevel = newQuestion.toString()
    },
    value4: function (newQuestion, oldQuestion) {
      if (newQuestion === false) {
        this.toShowDevided = false
      }
    },
    selectUserDiaShow2: function (newQuestion, oldQuestion) {
      this.dialogManage2('selectUserDiaShow2')
    },
    selectDateDiaShow2: function (newQuestion, oldQuestion) {
      this.dialogManage2('selectDateDiaShow2')
    },
    taskLevelHeight2: function (newQuestion, oldQuestion) {
      this.transitionManage2('taskLevelHeight2')
    },
    fileName: function (val, oval) {
    }
  },
  created () {
    this.getTaskList()
    this.getUserInfo()
  },
  methods: {
    resetScro: function () {
      $('.ivu-drawer-body').scrollTop(0)
    },
    getUserInfo: function () {
      var that = this
      this.ajax('/myProject/getUserInfo', {}).then(res => {
        if (res.code === 200) {
          that.log('getUserInfo', res)
          that.defImplementer.name = res.data.Name
          that.defImplementer.id = res.data.ID
        }
      })
    },
    // deleteFile: function (id) {
    //   var that = this
    //   that.$confirm('确认删除此附件，确定删除？', '', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     that.ajax('/file/deleteRealFile', {attachmentId: id}).then(res => {
    //       // this.log('选择所属项目:', res)
    //       if (res.code === 200) {
    //         that.$message.success('删除成功！')
    //         that.toDetail(that.taskId2)
    //       }
    //     })
    //   })
    // },
    delUploadFile: function (id) {
      console.log('id', id)
      var that = this
      // that.$confirm('确认删除此附件，确定删除？', '', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   that.ajax('/file/deleteFile', {attachmentId: id}).then(res => {
      //     // this.log('选择所属项目:', res)
      //     if (res.code === 200) {
      //       that.$message.success('删除成功！')
      //       that.toDetail()
      for (var i = 0; i < that.fileListEdit.length; i++) {
        if (id === that.fileListEdit[i].attachmentId) {
          that.fileListEdit.splice(i, 1)
        }
      }
      that.fileListEditLen = that.fileListEdit.length
      console.log('edit', that.fileListEdit)
      $('#myfileEdit').val('')
      //     }
      //   })
      // }).catch(() => {
      //   return false
      // })
    },
    delUploadFileComment: function (id) {
      console.log('id', id)
      var that = this
      that.$confirm('确认删除此附件，确定删除？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.ajax('/file/deleteFile', {attachmentId: id}).then(res => {
          // this.log('选择所属项目:', res)
          if (res.code === 200) {
            that.$message.success('删除成功！')
            that.getCommicateCont()
            for (var i = 0; i < that.fileListComment.length; i++) {
              if (id === that.fileListComment[i].attachmentId) {
                that.fileListComment.splice(i, 1)
              }
            }
            that.fileListCommentLen = that.fileListComment.length
            console.log('edit', that.fileListComment)
            $('#myfile2').val('')
          }
        })
      }).catch(() => {
        return false
      })
    },
    delUploadFileFinish: function (id) {
      console.log('id', id)
      var that = this
      that.$confirm('确认删除此附件，确定删除？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.ajax('/file/deleteFile', {attachmentId: id}).then(res => {
          // this.log('选择所属项目:', res)
          if (res.code === 200) {
            that.$message.success('删除成功！')
            for (var i = 0; i < that.fileListFinish.length; i++) {
              if (id === that.fileListFinish[i].attachmentId) {
                that.fileListFinish.splice(i, 1)
              }
            }
            that.fileListFinishLen = that.fileListFinish.length
            console.log('edit', that.fileListFinish)
            $('#myfileF').val('')
          }
        })
      }).catch(() => {
        return false
      })
    },
    delUploadFileTran: function (id) {
      console.log('id', id)
      var that = this
      that.$confirm('确认删除此附件，确定删除？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.ajax('/file/deleteFile', {attachmentId: id}).then(res => {
          // this.log('选择所属项目:', res)
          if (res.code === 200) {
            that.$message.success('删除成功！')
            for (var i = 0; i < that.fileListTrans.length; i++) {
              if (id === that.fileListTrans[i].attachmentId) {
                that.fileListTrans.splice(i, 1)
              }
            }
            that.fileListTransLen = that.fileListTrans.length
            console.log('edit', that.fileListTrans)
            $('#myfileTransfer').val('')
          }
        })
      }).catch(() => {
        return false
      })
    },
    delUploadFileDel: function (id) {
      console.log('id', id)
      var that = this
      that.$confirm('确认删除此附件，确定删除？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.ajax('/file/deleteFile', {attachmentId: id}).then(res => {
          // this.log('选择所属项目:', res)
          if (res.code === 200) {
            that.$message.success('删除成功！')
            for (var i = 0; i < that.fileList2.length; i++) {
              if (id === that.fileList2[i].attachmentId) {
                that.fileList2.splice(i, 1)
              }
            }
            that.fileListLen2 = that.fileList2.length
            console.log('edit', that.fileList2)
            $('#myfileDel').val('')
          }
        })
      }).catch(() => {
        return false
      })
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
                  var minTime
                  var houTime
                  if (date.getMinutes() < 10) {
                    minTime = '0' + date.getMinutes()
                  } else {
                    minTime = date.getMinutes()
                  }
                  if (date.getHours() < 10) {
                    houTime = '0' + date.getHours()
                  } else {
                    houTime = date.getHours()
                  }
                  res.data.list[i].logPage[t].year = date.getFullYear()
                  res.data.list[i].logPage[t].mondate = (date.getMonth() + 1) + '/' + date.getDate()
                  res.data.list[i].logPage[t].houMin = houTime + ':' + minTime
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
    // querySearchAsync (queryString, cb) {
    //   var that = this
    //   if (queryString) {
    //     that.autoCompleteNamesPayload.projectManager = queryString
    //     this.ajax('/general/autoCompleteNames', that.autoCompleteNamesPayload).then(res => {
    //       if (res.code === 200) {
    //         var dddarr = []
    //         if (res.msg.length > 0) {
    //           for (var i = 0; i < res.msg.length; i++) {
    //             var obj = {}
    //             obj.value = res.msg[i].Name + ' (' + res.msg[i].jName + ')'
    //             obj.userId = res.msg[i].ID
    //             // obj.jName = res.msg[i].jName
    //             dddarr.push(obj)
    //           }
    //           // 调用 callback 返回建议列表的数据
    //           cb(dddarr)
    //         } else {
    //           var aaaddd = []
    //           that.$message('未能搜索到该人员')
    //           cb(aaaddd)
    //         }
    //       }
    //     })
    //   }
    // },
    // handleSelect (item) {
    //   // console.log(item.userId)
    //   this.Mid = item.userId
    // },
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
    delTask: function (id) {
      var that = this
      console.log('id', id)
      that.$confirm('删除本条会包括本条及其包含内容，确定删除？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.ajax('/myTask/delTaskById', {taskId: id}).then(res => {
          if (res.code === 200) {
            that.log('delPlanOrTask:', res)
            that.value4 = false
            that.toDetail(id)
            that.getTaskList()
            that.getHistoryList()
          }
        }).catch(() => {
          // that.loading = false
        })
      })
    },
    modifyTask: function (id) {
      var that = this
      that.taskIdEdit = id
      that.modifyTaskVisible = true
      that.ajax('/myTask/queryTaskDetailSingle', {taskId: id}).then(res => {
        // this.token = res._jfinal_token
        console.log('queryTaskDetailSingle', res)
        that.detailTaskform.jobName = res.data.jobName
        that.detailTaskform.jobLevel = parseInt(res.data.jobLevel)
        that.detailTaskform.taskStartDate = res.data.taskStartDate
        that.detailTaskform.taskFinishDate = res.data.taskFinishDate
        that.detailTaskform.description = res.data.description
        for (var i = 0; i < res.data.attachment.length; i++) {
          res.data.attachment[i].attachmentId = res.data.attachment[i].id
        }
        that.fileListEdit = res.data.attachment
        // var st = res.data.taskStartDate.split(' ')[0] + ' 00:00:00'
        // var binStartTime = new Date(st).getTime()
        // var binEndTime = new Date(res.data.taskFinishDate).getTime()
        // this.pickerOptionsTaskSt.disabledDate = function (time) {
        //   return time.getTime() > binEndTime || time.getTime() < binStartTime
        // }
      })
    },
    fileChangeEdit: function (file) {
      var that = this
      var obj = file.currentTarget
      var isfile = $(obj).val()
      if (isfile) {
        that.addMarkInfoEdit()
      }
      this.log('change了', file)
    },
    addMarkInfoEdit () {
      var that = this
      var url = that.$store.state.baseServiceUrl
      var formData = new FormData($('#uploadFileEdit')[0])
      that.formData2 = formData
      if (formData) {
        $.ajax({
          type: 'post',
          url: url + '/file/uploadFileAjax',
          data: formData,
          cache: false,
          processData: false,
          contentType: false,
          crossDomain: true,
          xhrFields: {
            withCredentials: true
          }
        }).then(function (data) {
          that.log('upload:', data)
          if (data.code === 200) {
            // that.attachmentId2 = data.data.attachmentId
            var obj = {
              attachmentId: data.data.attachmentId,
              showName: data.data.showName
            }
            that.fileListEdit.push(obj)
            that.fileListEditLen = that.fileListEdit.length
            that.$message({
              type: 'success',
              message: '文件' + data.msg
            })
          } else if (data.code === 300) {
            that.$message({
              type: 'error',
              message: data.msg
            })
          } else {
            that.$message({
              type: 'error',
              message: data.msg
            })
          }
        })
      } else {
        // that.loading = false
        that.$message({
          type: 'error',
          message: '评论内容不能为空'
        })
      }
    },
    levelChange: function (rateval) {
      this.detailTaskform.jobLevel = rateval
    },
    modifyTaskSub: function (formName) {
      var that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var fileStr = ''
          for (var j = 0; j < this.fileListEdit.length; j++) {
            if (j === that.fileListEdit.length - 1) {
              fileStr = fileStr + that.fileListEdit[j].attachmentId
            } else {
              fileStr = fileStr + that.fileListEdit[j].attachmentId + ','
            }
          }
          that.loadingEdit = true
          that.editTaskPayload.id = that.taskIdEdit
          that.editTaskPayload.jobLevel = that.detailTaskform.jobLevel
          that.editTaskPayload.jobName = that.detailTaskform.jobName
          that.editTaskPayload.taskStartDate = that.detailTaskform.taskStartDate
          that.editTaskPayload.taskFinishDate = that.detailTaskform.taskFinishDate
          that.editTaskPayload.description = that.detailTaskform.description
          that.editTaskPayload.attachmentId = fileStr
          that.ajax('/myProject/editTask', that.editTaskPayload).then(res => {
            that.log('editTask:', res)
            if (res.code === 200) {
              that.$message({
                message: '保存成功！',
                type: 'success'
              })
              that.modifyTaskVisible = false
              that.loadingEdit = false
              that.toDetail(that.taskIdEdit)
              that.getHistoryList()
              that.getTaskList()
            } else {
              that.loadingEdit = false
            }
          })
        }
      })
    },
    getFileName: function () {
      var that = this
      var filePath = $('#myfile2').val()
      var arr = filePath.split('\\')
      var fileName = arr[arr.length - 1]
      $('.showFileName').html(fileName)
      if (filePath) {
        that.addMarkInfo4()
      }
    },
    addMarkInfo4 () {
      var that = this
      var url = that.$store.state.baseServiceUrl
      var formData = new FormData($('#uploadFileRe')[0])
      if (formData) {
        $.ajax({
          type: 'post',
          url: url + '/file/uploadFileAjax',
          data: formData,
          cache: false,
          processData: false,
          contentType: false,
          crossDomain: true,
          xhrFields: {
            withCredentials: true
          }
        }).then(function (data) {
          that.log('upload:', data)
          if (data.code === 200) {
            // that.attachmentId2 = data.data.attachmentId
            var obj = {
              attachmentId: data.data.attachmentId,
              fileName: data.data.showName
            }
            that.fileListComment.push(obj)
            that.fileListCommentLen = that.fileListComment.length
            that.log('attachmentId:', data.data.attachmentId2)
            that.$message({
              type: 'success',
              message: '文件' + data.msg
            })
          } else if (data.code === 300) {
            that.$message({
              type: 'error',
              message: data.msg
            })
          } else {
            that.$message({
              type: 'error',
              message: data.msg
            })
          }
        })
      } else {
        // that.loading = false
        that.$message({
          type: 'error',
          message: '评论内容不能为空'
        })
      }
    },
    // 任务开始
    startTask: function (id) {
      var that = this
      console.log('id', id)
      that.$confirm('确定后将开始此任务，确定开始？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.ajax('/general/dealTask', {taskId: id}).then(res => {
          if (res.code === 200) {
            that.log('dealTask:', res)
            that.toDetail(id)
            that.getTaskList()
            that.getHistoryList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消开始'
        })
      })
    },
    // 重启
    isReStartTask: function (id) {
      var that = this
      that.$confirm('是否确定重启此任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.ajax('/general/restartTask', {taskId: id}).then(res => {
          if (res.code === 200) {
            this.log('restartTask', res)
            that.toDetail(id)
            that.getTaskList()
            that.getHistoryList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // ------
    transferTask: function () {
      var that = this
      that.taskTransferVisible = true
    },
    getFileNameTran: function () {
      var that = this
      var filePath = $('#myfileTransfer').val()
      var arr = filePath.split('\\')
      var fileName = arr[arr.length - 1]
      $('.showFileNameTran').html(fileName)
      if (filePath) {
        that.addMarkInfo6()
      }
    },
    addMarkInfo6 () {
      var that = this
      var url = that.$store.state.baseServiceUrl
      var formData = new FormData($('#taskTransfer')[0])
      if (formData) {
        $.ajax({
          type: 'post',
          url: url + '/file/uploadFileAjax',
          data: formData,
          cache: false,
          processData: false,
          contentType: false,
          crossDomain: true,
          xhrFields: {
            withCredentials: true
          }
        }).then(function (data) {
          that.log('upload:', data)
          if (data.code === 200) {
            // that.attachmentId2 = data.data.attachmentId
            var obj = {
              attachmentId: data.data.attachmentId,
              fileName: data.data.showName
            }
            that.fileListTrans.push(obj)
            that.fileListTransLen = that.fileListTrans.length
            // that.log('attachmentId:', data.data.attachmentId2)
            that.$message({
              type: 'success',
              message: '文件' + data.msg
            })
          } else if (data.code === 300) {
            that.$message({
              type: 'error',
              message: data.msg
            })
          } else {
            that.$message({
              type: 'error',
              message: data.msg
            })
          }
        })
      } else {
        // that.loading = false
        that.$message({
          type: 'error',
          message: '评论内容不能为空'
        })
      }
    },
    taskTransfer () {
      var that = this
      var fileStr = ''
      that.loading11 = true
      for (var j = 0; j < this.fileListTrans.length; j++) {
        if (j === that.fileListTrans.length - 1) {
          fileStr = fileStr + that.fileListTrans[j].attachmentId
        } else {
          fileStr = fileStr + that.fileListTrans[j].attachmentId + ','
        }
      }
      that.ajax('/myTask/transferTask', {remark: that.commitComentT, attachmentId: fileStr, taskId: that.taskId2, transferUserId: that.transferUserId, transferUserName: that.transferUserName}).then(res => {
        if (res.code === 200) {
          that.toDetail(that.taskId2)
          that.getTaskList()
          that.getHistoryList()
          that.value4 = false
          that.loading11 = false
          that.taskTransferVisible = false
          $('#myfileTransfer').val('')
          $('.showFileNameTran').html('')
          that.projectManager = ''
          that.commitComentT = ''
          that.fileListTrans = []
        } else {
          that.$message({
            type: 'error',
            message: res.msg
          })
          that.loading11 = false
        }
      })
    },
    querySearchAsync2 (queryString, cb) {
      var that = this
      if (queryString) {
        that.projectManager = queryString
        this.ajax('/general/autoCompleteNames', {projectManager: that.projectManager}).then(res => {
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
    handleSelect2 (item) {
      this.transferUserId = item.userId
      this.transferUserName = item.value
    },
    concelTransfer: function () {
      var that = this
      that.loading11 = false
      $('#myfileTransfer').val('')
      $('.showFileNameTran').html('')
      that.projectManager = ''
      that.commitComentT = ''
      that.taskTransferVisible = false
    },
    toDetail: function (id) {
      var that = this
      // that.resetScro()
      that.getTaskChildList(id)
      that.taskId2 = id
      that.taskComment.uid = id
      that.taskHistoryList.uid = id
      that.value4 = true
      that.getCommicateCont()
      that.getHistoryList()
      that.cancelDevide()
      that.ajax('/myTask/queryTaskDetail', {taskId: that.taskId2}).then(res => {
        if (res.code === 200) {
          that.taskBasicMsg = res.data
          that.rid2 = res.data.uid
          that.selDateStart2 = res.data.taskStartDate
          that.selDateEnd2 = res.data.taskFinishDate
          that.CommunityTaskPayload2.projectUID = res.data.projectUID
          that.CommunityTaskPayload2.uid = res.data.uid
          var st = res.data.taskStartDate.split(' ')[0] + ' 00:00:00'
          var et = res.data.taskFinishDate
          var sT = new Date(st)
          var eT = new Date(et)
          that.disabledStarTime = sT.getTime()
          that.disabledEndTime = eT.getTime()
          that.pickerOptions0.disabledDate = function (time) {
            return time.getTime() < that.disabledStarTime || time.getTime() > that.disabledEndTime
          }
          for (var n = 0; n < res.data.attachment.length; n++) {
            res.data.attachment[n].downurl = that.$store.state.baseServiceUrl + '/file/downloadFile?realUrl=' + res.data.attachment[n].realUrl + '&showName=' + res.data.attachment[n].showName
            if (that.isImage(res.data.attachment[n].showName)) {
              res.data.attachment[n].isImg = true
            } else {
              res.data.attachment[n].isImg = false
            }
          }
          that.resetScro()
        }
      })
    },
    getTaskChildList: function (id) {
      var that = this
      this.ajax('/myTask/myChildTask', {taskId: id}).then(res => {
        if (res.code === 200) {
          that.log('myChildTask:', res)
          that.childTaskList = res.data
        }
      })
    },
    childTaskDelete: function (id) {
      var that = this
      console.log('id', id)
      that.$confirm('删除本条会包括本条及其包含内容，确定删除？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.ajax('/myTask/delTaskById', {taskId: id}).then(res => {
          if (res.code === 200) {
            that.log('delPlanOrTask:', res)
            that.getTaskChildList(id)
            that.getTaskList()
          }
        }).catch(() => {
          // that.loading = false
        })
      })
    },
    // 任务完成
    finishedTask: function () {
      var that = this
      that.taskFinishedVisible = true
    },
    getFileNameFinished: function () {
      var that = this
      var filePath = $('#myfileF').val()
      var arr = filePath.split('\\')
      var fileName = arr[arr.length - 1]
      $('.showFileName2').html(fileName)
      if (filePath) {
        that.addMarkInfo5()
      }
    },
    addMarkInfo5 () {
      var that = this
      var url = that.$store.state.baseServiceUrl
      var formData = new FormData($('#uploadFileRe2')[0])
      if (formData) {
        $.ajax({
          type: 'post',
          url: url + '/file/uploadFileAjax',
          data: formData,
          cache: false,
          processData: false,
          contentType: false,
          crossDomain: true,
          xhrFields: {
            withCredentials: true
          }
        }).then(function (data) {
          that.log('upload:', data)
          if (data.code === 200) {
            // that.attachmentId2 = data.data.attachmentId
            var obj = {
              attachmentId: data.data.attachmentId,
              fileName: data.data.showName
            }
            that.fileListFinish.push(obj)
            that.fileListFinishLen = that.fileListFinish.length
            // that.log('attachmentId:', data.data.attachmentId2)
            that.$message({
              type: 'success',
              message: '文件' + data.msg
            })
          } else if (data.code === 300) {
            that.$message({
              type: 'error',
              message: data.msg
            })
          } else {
            that.$message({
              type: 'error',
              message: data.msg
            })
          }
        })
      } else {
        // that.loading = false
        that.$message({
          type: 'error',
          message: '评论内容不能为空'
        })
      }
    },
    confirmFinished () {
      var that = this
      var fileStr = ''
      that.loading9 = true
      for (var j = 0; j < this.fileListFinish.length; j++) {
        if (j === that.fileListFinish.length - 1) {
          fileStr = fileStr + that.fileListFinish[j].attachmentId
        } else {
          fileStr = fileStr + that.fileListFinish[j].attachmentId + ','
        }
      }
      that.ajax('/myTask/finishTask', {remark: that.commitComentF, attachmentId: fileStr, taskId: that.taskId2}).then(res => {
        if (res.code === 200) {
          that.log('myTaskView:', res)
          that.toDetail(that.taskId2)
          that.getTaskList()
          that.getHistoryList()
          that.commitComentF = '已完成'
          that.fileListFinish = []
          $('.showFileName2').html('')
          $('#myfileF').val('')
          that.taskFinishedVisible = false
          that.loading9 = false
        }
      })
    },
    concelFinished: function () {
      var that = this
      that.taskFinishedVisible = false
      that.commitComentF = '已完成'
      $('.showFileName2').html('')
      $('#myfileF').val('')
    },
    // ----分解--
    // 悬浮窗管理函数
    dialogManage2: function (target, allDiaHide) {
      var that = this
      // allDiaHide为false
      if (!allDiaHide) {
        if (that[target]) {
          for (var i = 0; i < that.diaManageArr2.length; i++) {
            if (that.diaManageArr2[i] !== target) {
              that[that.diaManageArr2[i]] = false
            }
          }
        }
      } else if (allDiaHide) {
        // allDiaHide为true (即:所有悬浮窗隐藏)
        for (var t = 0; t < that.diaManageArr2.length; t++) {
          that[that.diaManageArr2[t]] = false
        }
      }
    },
    transitionManage2: function (target, allTranHide) {
      var that = this
      if (!allTranHide) {
        if (that[target]) {
          for (var i = 0; i < that.tranManageArr2.length; i++) {
            if (that.tranManageArr2[i] !== target) {
              that[that.tranManageArr2[i]] = 0
            }
          }
        }
      } else if (allTranHide) {
        // allDiaHide为true (即:所有悬浮窗隐藏)
        for (var t = 0; t < that.tranManageArr2.length; t++) {
          that[that.tranManageArr2[t]] = 0
        }
      }
    },
    remoteMethod2 (query) {
      var that = this
      this.log('query:', query)
      if (query !== '') {
        this.loading22 = true
        that.moreUserSelectPayload2.projectManager = query
        this.ajax('/general/autoCompleteNames', that.moreUserSelectPayload2).then(res => {
          that.log('autoCompleteNames:', res)
          if (res.code === 200) {
            that.options42 = res.msg
            this.loading22 = false
          }
        })
      } else {
        this.options42 = []
      }
    },
    selectUserClick2: function () {
      this.selectUserDiaShow2 = false
      this.log(this.taskForm2.value9)
    },
    selectDateCancel2: function () {
      this.selectDateDiaShow2 = false
    },
    selectDateOk2: function () {
      var that = this
      var st = new Date(that.selDateStart2).getTime()
      var et = new Date(that.selDateEnd2).getTime()
      if (st > et) {
        that.$message.warning('开始时间不能大于结束时间')
      } else {
        this.selectDateDiaShow2 = false
      }
    },
    rateMouseLeave2: function () {
      // this.alert(1)
      this.taskLevelHeight2 = 0
    },
    inputFocus2: function () {
      var that = this
      // this.taskRelationShow2 = true
      if (that.moreText2 === '更多') {
        that.moreText2 = '收起'
        this.moreIcon2 = 'el-icon-arrow-up'
        this.taskRelationShow2 = true
      } else {
        that.moreText2 = '更多'
        this.moreIcon2 = 'el-icon-arrow-down'
        this.taskRelationShow2 = false
      }
    },
    iptBlur2: function () {
      // this.taskRelationShow = false
    },
    selectUser2: function (e) {
      // 时间弹窗 与 人员选择弹窗 不共存  selectUserDiaShow selectDateDiaShow
      // this.selectDateDiaShow = false
      var obj = e.currentTarget
      this.selectUserDiaShow2 = true
      this.selectUserLeft2 = $(obj).offset().left
      this.selectUserTop2 = $(obj).offset().top
      // 所有的伸缩窗 隐藏
      this.transitionManage2('', true)
    },
    selectDate2: function (e) {
      // 所有的伸缩窗 隐藏
      this.transitionManage2('', true)
      if (e) {
        var obj = e.currentTarget
        this.selectDateDiaShow2 = true
        this.selectDateLeft2 = $(obj).offset().left - 420
        this.selectDateTop2 = $(obj).offset().top - 102
      }
      // this.log(123)
    },
    selectLevel2: function (e) {
      var obj = e.currentTarget
      this.taskLevelLeft2 = $(obj).offset().left - 165
      this.taskLevelTop2 = $(obj).offset().top + 32
      this.taskLevelHeight2 = 46
      // 其它悬浮窗为隐藏状态
      this.dialogManage2('', true)
    },
    fileChange2: function (file) {
      var that = this
      var obj = file.currentTarget
      var isfile = $(obj).val()
      if (isfile) {
        that.addMarkInfo3()
      }
      this.log('change了', file)
    },
    addMarkInfo3 () {
      var that = this
      var url = that.$store.state.baseServiceUrl
      var formData = new FormData($('#uploadFileDel')[0])
      that.formData2 = formData
      if (formData) {
        $.ajax({
          type: 'post',
          url: url + '/file/uploadFileAjax',
          data: formData,
          cache: false,
          processData: false,
          contentType: false,
          crossDomain: true,
          xhrFields: {
            withCredentials: true
          }
        }).then(function (data) {
          that.log('upload:', data)
          if (data.code === 200) {
            // that.attachmentId2 = data.data.attachmentId
            var obj = {
              attachmentId: data.data.attachmentId,
              fileName: data.data.showName
            }
            that.fileList2.push(obj)
            that.fileListLen2 = that.fileList2.length
            that.log('attachmentId:', data.data.attachmentId2)
            that.$message({
              type: 'success',
              message: '文件' + data.msg
            })
          } else if (data.code === 300) {
            that.$message({
              type: 'error',
              message: data.msg
            })
          } else {
            that.$message({
              type: 'error',
              message: data.msg
            })
          }
        })
      } else {
        // that.loading = false
        that.$message({
          type: 'error',
          message: '评论内容不能为空'
        })
      }
    },
    moreClick2: function () {
      var that = this
      if (that.moreText2 === '更多') {
        that.moreText2 = '收起'
        this.moreIcon2 = 'el-icon-arrow-up'
        this.taskRelationShow2 = true
      } else {
        that.moreText2 = '更多'
        this.moreIcon2 = 'el-icon-arrow-down'
        this.taskRelationShow2 = false
      }
    },
    depSub2: function () {
      var that = this
      that.loading32 = true
      var fileStr = ''
      for (var j = 0; j < this.fileList2.length; j++) {
        if (j === that.fileList2.length - 1) {
          fileStr = fileStr + that.fileList2[j].attachmentId
        } else {
          fileStr = fileStr + that.fileList2[j].attachmentId + ','
        }
      }
      // 如果有任务名
      if (that.taskNameText2) {
        // value9有值
        var selectUserStr = ''
        if (that.taskForm2.value9.length > 0) {
          for (var i = 0; i < that.taskForm2.value9.length; i++) {
            if (i === 0) {
              selectUserStr = that.taskForm2.value9[0]
            } else {
              selectUserStr = selectUserStr + '_' + that.taskForm2.value9[i]
            }
          }
        } else {
          // value9没有值，取默认
          selectUserStr = that.defImplementer.name + '-' + that.defImplementer.id
        }
        that.CommunityTaskPayload2.attachmentId = fileStr
        that.CommunityTaskPayload2.pStr = selectUserStr
        that.CommunityTaskPayload2.jobName = that.taskNameText2
        that.CommunityTaskPayload2.startTime = that.selDateStart2
        that.CommunityTaskPayload2.endTime = that.selDateEnd2
        that.CommunityTaskPayload2.description = that.taskIntro2
        that.CommunityTaskPayload2._jfinal_token = that.token
        that.ajax('/myTask/decomposeTask', that.CommunityTaskPayload2).then(res => {
          if (res.code === 200) {
            that.isRecall2 = that.isRecall2 + 1
            that.token = res._jfinal_token
            that.$message({
              message: '任务创建成功',
              type: 'success'
            })
            that.getTaskList()
            that.getHistoryList()
            that.getTaskChildList(that.taskId2)
            // 清空发动态的表单
            that.clearDynamicsForm2()
          } else {
            that.$message({
              message: res.msg,
              type: 'warning'
            })
          }
          that.loading32 = false
        })
      } else {
        that.$message({
          message: '请填写任务名',
          type: 'warning'
        })
        that.loading32 = false
      }
    },
    clearDynamicsForm2: function () {
      this.taskNameText2 = ''
      this.fileList2 = []
      this.CommunityTaskPayload2.jobName = ''
      this.CommunityTaskPayload2.taskStartDate = ''
      this.CommunityTaskPayload2.taskFinishDate = ''
      this.taskIntro2 = ''
      this.CommunityTaskPayload2.description = ''
      this.attachmentId2 = ''
      this.CommunityTaskPayload2.formId = ''
      this.taskForm2.value9 = []
      this.levelValue2 = 3
      $('#myfileDel').val('')
      this.moreClick2()
    },
    taskToDevided: function () {
      var that = this
      that.toShowDevided = true
      // that.taskRelationShow2 = false
    },
    cancelDevide: function () {
      var that = this
      that.taskRelationShow2 = false
      that.toShowDevided = false
      that.clearDynamicsForm2()
    },
    // ----------
    getCommicateCont: function () {
      var that = this
      that.ajax('/myTask/getTaskComment', that.taskComment).then(res => {
        if (res.code === 200) {
          that.commentList = res.data.list
          that.totalNum = res.data.totalRow
          if (that.commentList.length > 0) {
            for (var i = 0; i < that.commentList.length; i++) {
              for (var j = 0; j < that.commentList[i].attachment.length; j++) {
                if (that.isImage(res.data.list[i].attachment[j].showName)) {
                  res.data.list[i].attachment[j].isImg = true
                } else {
                  res.data.list[i].attachment[j].isImg = false
                }
                res.data.list[i].attachment[j].downloadUrl = that.$store.state.baseServiceUrl + '/file/downloadFile?realUrl=' + res.data.list[i].attachment[j].realUrl + '&showName=' + res.data.list[i].attachment[j].showName
              }
            }
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
      that.ajax('/myTask/getTaskLog', that.taskHistoryList).then(res => {
        if (res.code === 200) {
          that.historyList = res.data.list
          that.totalHistoryNum = res.data.totalRow
          if (that.historyList.length > 0) {
            for (var i = 0; i < that.historyList.length; i++) {
              for (var j = 0; j < that.historyList[i].attachment.length; j++) {
                if (that.isImage(res.data.list[i].attachment[j].showName)) {
                  res.data.list[i].attachment[j].isImg = true
                } else {
                  res.data.list[i].attachment[j].isImg = false
                }
                res.data.list[i].attachment[j].downloadUrl = that.$store.state.baseServiceUrl + '/file/downloadFile?realUrl=' + res.data.list[i].attachment[j].realUrl + '&showName=' + res.data.list[i].attachment[j].showName
              }
            }
          }
        }
      })
    },
    getCurrentHistoryPage: function (e) {
      this.taskHistoryList.pageNum = e
      this.getHistoryList()
    },
    showImagePre: function (url) {
      this.dialogFormVisible = true
      this.showTaskFileUrl = url
    },
    showImagePreCom: function (url) {
      if (url) {
        this.commentPreviewUrl = url
        this.dialogShowImg = true
      }
    },
    addMarkInfo () {
      var that = this
      that.loading2 = true
      console.log('comment', that.fileListComment)
      var fileStr = ''
      for (var j = 0; j < this.fileListComment.length; j++) {
        if (j === that.fileListComment.length - 1) {
          fileStr = fileStr + that.fileListComment[j].attachmentId
        } else {
          fileStr = fileStr + that.fileListComment[j].attachmentId + ','
        }
      }
      that.ajax('/comment/addComment', {
        content: that.commitComent,
        attachmentId: fileStr,
        contentId: that.taskId2,
        parentCommentId: '11'
      }).then(res => {
        if (res.code === 200) {
          that.log('myTaskView:', res)
          that.getCommicateCont()
          that.fileListComment = []
          that.commitComent = ''
          $('.showFileName').html('')
          $('#myfile2').val('')
          that.loading2 = false
        }
      })
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
  .cannetProjectFile{
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
  .cannetProject21{
    width: 90%;
    display: flex;
    justify-content: space-between;
    line-height: 24px;
    font-size: 14px;
    /*font-family: '黑体';*/
    padding:0 10px;
  }
  .cannetProject2 div img{
    float: left;
    margin-top: 10px;
    margin-right: 10px;
    width: 18px;
  }
  .cannetProject div img,.cannetProjectFile div img{
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
    color: #777;
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
  .taskListChild{
    padding: 0 20px;
  }
  .taskItemChild{
    height: 48px;
    line-height: 48px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px dashed #f1f1f1;
  }
  .taskItemChild2{
    height: 48px;
    line-height: 48px;
  }
  .childTaskName{
    width: 40%;
    color: #409EFF;
    cursor: pointer;
    font-size: 14px;
  }
  .childTaskMsg{
    width: 60%;
    text-align: right;
  }
  .childTaskMsg>div{
    display: inline-block;
    margin-right: 20px;
  }
  .taskDel:hover {
    color: #409EFF;
    cursor: pointer;
  }
  .bgCoverModifyTask{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 2000;
  }
  .bgCoverModifyTask .el-textarea{
    margin-top: 0;
    margin-left: 0;
  }
  .bgCoverCnt2{
    width: 460px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -300px;
    margin-top: -250px;
    padding: 20px 50px 50px 30px;
  }
  .bgCoverCnt2 h2{
    font-size: 16px;
    color: #666;
    font-family: '黑体';
  }
  .colose {
    float: right;
    margin: -40px -33px;
    font-size: 20px;
    color: #409EFF;
    height: 20px;
    width: 20px;
    text-align: center;
    cursor: pointer;
  }
  .planTaskBox{
    padding-top: 30px;
  }
  .planNameIpt{
    width: 100%;
  }
  /*任务分解*/
  .paiTaskIptBox{
    display: flex;
    margin-top: 10px;
    justify-content: space-between;
    padding: 10px 5px;
    border: 1px solid #dcdfe6;
    padding-left: 8px;
  }
  .paiTaskIptLeft{
    width: 250px;
    display: flex;
    flex-grow: 1;
  }
  .paiTaskIptIcon{
    width: 20px;
    font-size: 18px;
    margin-right: 6px;
  }
  .paiTaskIptWrap{
    width: 100%;
    line-height: 27px;
  }
  .paiTaskIptWrap input{
    width: 100%;
    outline: none;
    border: none;
  }
  .paiTaskIptRight{
    _width: 165px;
    display: flex;
  }
  .paiTaskIptRightIcon{
    border-left: 1px dashed #ccc;
    margin-right: 5px;
    font-size: 18px;
    padding-left: 5px;
    color: #1687d9;
  }
  .paiTaskIptRightCnt{
    cursor: pointer;
    margin-right: 10px;
    line-height: 25px;
  }
  .taskRelation{
    border: 1px solid #a9b8bf;
    border-top: none;
  }
  .relationIntroArea{
    width: 100%;
    height: 100px;
    border: none;
    padding: 10px;
    box-sizing: border-box;
    resize: none;
    display: block;
  }
  .taskFileUpload{
    position: relative;
  }
  .depTaskLevel2{
    width: 200px;
    height: 0px;
    text-align: center;
    position: fixed;
    overflow: hidden;
    z-index: 300;
    margin-top: -1px;
    background-color: #fff;
    transition: height 0.3s;
  }
  .rateBox{
    padding: 12px;
    border: 1px solid #a9b8bf;
  }
  .fileUploadCao{
    display: flex;
    justify-content: space-between;
    padding: 10px;
  }
  .selectLeft{
    _line-height: 30px;
  }
  .selectRight{
    width: 163px;
    display: flex;
  }
  .selectRight2{
    width: 210px;
    display: flex;
    justify-content: flex-end;
  }
  .selectMoreInfo{
    line-height: 30px;
  }
  .submitBtn{
    margin-left: 15px;
  }
  .submitBtn div {
    width: 50px;
    padding: 6px;
    color: #fff;
    border-radius: 4px;
    text-align: center;
    color: #adb8c0;
    background-color: #e7eef3;
  }
  .selectDateDialog2{
    _width: 300px;
    padding: 0px 20px 20px 20px;
    background-color: #fff;
    position: absolute;
    z-index: 200;
    border-radius: 6px;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,.2);
  }
  .selectUserDialog2{
    width: 300px;
    padding: 20px 10px;
    background-color: #fff;
    position: absolute;
    z-index: 200;
    border-radius: 6px;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,.2);
  }
  .selectUserBtn{
    text-align: center;
    margin-top: 20px;
  }
  .selectDateItem{
    margin-top: 20px;
  }
  /*// 子任务*/
  .childTaskStyle0{
    color: #ffc107;
  }
  .childTaskStyle1{
    color: #13ce66;
  }
  .childTaskStyle2{
    color: #409EFF;
  }
</style>
