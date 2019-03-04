<template>
  <div class="HelloWorld">
    <div v-show="false">{{getStoreProId}}</div>
    <!--面包屑-->
    <div style="padding: 5px;padding-top:0;border-bottom: 1px solid #eee; color: #999;">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-if="router.id" v-for="(router, index) in setRouterNameList" v-bind:key="index"><span style="display: inline-block;font-size: 12px;" @click="breadcrumbGetPlan(router.id, index)">{{router.name}}</span></el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!--<div v-on:click="testScro()" style="position: fixed; right: 200px; top: 300px; z-index: 99999; background-color: #aaa;">TEST</div>-->
    <div class="hello" style="margin-top: 15px;">
      <Drawer class="drawerScroll" :closable="false" width="40%" v-model="value4">
        <div class="slidTop">
          <div v-bind:class="'topState' + taskBasicMsg.status"><img src="../../static/img/stataNew.png" alt="">{{taskBasicMsg.statusStr}}</div>
          <div><span>紧急程度: </span><span><Rate v-model="taskBasicMsg.jobLevel" disabled/></span></div>
          <div style="display: flex;justify-content: space-between">
            <div style="width: 50px;" v-if="taskBasicMsg.showDeleteFlag" @click="delTask(taskBasicMsg.uid)"><Icon type="ios-trash-outline" size="24" color="#53b5ff"/></div>
            <div @click="modifyTask(taskBasicMsg.uid)" style="width: 50px;padding-top: 3px;font-size: 14px;color: #409EFF" v-if="taskBasicMsg.showMenu===0?false:true"><i class="el-icon-edit" style="font-size: 18px;color: #409EFF"></i> 修改</div>
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
          <span style="font-size: 14px;color: #888;" v-if="!taskBasicMsg.reProjectList || taskBasicMsg.reProjectList.length === 0" >未关联项目</span>
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
          <div style="display: inline-block"><img src="../../static/img/fujian.png" alt=""><span>项目附件:</span></div>
          <div style="display: inline-block;font-size: 14px;line-height: 26px;" v-if="taskBasicMsg.attachment">
          <span v-for="(file, index) in taskBasicMsg.attachment" v-bind:key="index" style="margin-left: 10px;">
            <span style="display: inline-block;">{{file.showName}}</span>
            <span v-if="file.isImg" @click="showImagePre(file.previewUrl)" style="display: inline-block;color: #53b5ff;cursor: pointer;">预览</span>
            <span style="display: inline-block;"><a v-bind:href="file.downurl"> 下载<i style="font-weight: bold !important; padding: 5px; color: chocolate;" class="el-icon-download"></i></a></span>
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
                <div class="paiTaskIptWrap"><input v-on:focus="inputFocus2()" v-model="taskNameText2" v-on:blur="iptBlur2()" type="text" placeholder="请输入新建任务名称" /></div>
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
                <div class="selectLeft">
                  <form id="uploadFileDel" enctype="multipart/form-data">
                    <input type="file" v-on:change="fileChange2" id="myfileDel" name="myfile" placeholder="请选择文件"/><br>
                    <!--<el-button type="primary" @click="addMarkInfo()">提 交</el-button>-->
                  </form>
                  <div style="margin-top: 8px;">
                    <span>已选 <span style="color: #409EFF;font-size: 16px;font-weight: bold;">{{fileList2.length}}</span> 个附件:</span>
                    <span style="color: #888;" v-if="fileList2.length === 0">暂无附件</span>
                    <span style="color: #409EFF" v-if="fileList2.length > 0" v-for="(file, index) in fileList2" v-bind:key="index"><span style="color: #333">{{index+1}}、</span>{{file.fileName}}, </span>
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
          <div style="display: inline-block"><img src="../../static/img/taskList.png" alt=""><span>子任务</span></div>
        </div>
        <div class="taskListChild">
          <div class="taskItemChild" v-if="childTaskList.length > 0" v-for="(childTask, index) in childTaskList" v-bind:key="index">
            <div class="childTaskName" @click="toDetail(childTask.uid)"><Icon type="md-copy" size="16" color="#409EFF"/> {{childTask.jobName}}</div>
            <div class="childTaskMsg">
              <div v-if="childTask.dayNum >= 0">剩余 <span style="color: #13ce66;font-size: 18px;">{{childTask.dayNum}}</span> 天</div>
              <div v-if="childTask.dayNum < 0">逾期 <span style="color: #f00;font-size: 18px;">{{Math.abs(childTask.dayNum)}}</span> 天</div>
              <div>{{childTask.userName}}</div>
              <div class="taskDel" @click="childTaskDelete(childTask.uid)"><Icon type="md-close" size="18"/></div>
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
                  <input type="file" name="myfile" id="myfile2" @change="getFileName">
                </a>
                <!--<input type="hidden" name="rid" v-bind:value="rid2">-->
                <!--<input type="hidden" name="rtype" v-bind:value="3">-->
                <span class="showFileName"></span>
              </form>
              <div>
                <span>已选 <span style="color: #409EFF;font-size: 16px;font-weight: bold;">{{fileListComment.length}}</span> 个附件:</span>
                <span style="color: #888;" v-if="fileListComment.length === 0">暂无附件</span>
                <span style="color: #409EFF" v-if="fileListComment.length > 0" v-for="(file, index) in fileListComment" v-bind:key="index"><span style="color: #333">{{index+1}}、</span>{{file.fileName}}, </span>
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
                <input type="file" name="myfile" id="myfileF" @change="getFileNameFinished">
              </a>
              <!--<input type="hidden" name="taskId" v-bind:value="taskId2">-->
              <!--<input type="hidden" name="rtype" v-bind:value="3">-->
              <span class="showFileName2"></span>
            </form>
            <div>
              <span>已选 <span style="color: #409EFF;font-size: 16px;font-weight: bold;">{{fileListFinish.length}}</span> 个附件:</span>
              <span style="color: #888;" v-if="fileListFinish.length === 0">暂无附件</span>
              <span style="color: #409EFF" v-if="fileListFinish.length > 0" v-for="(file, index) in fileListFinish" v-bind:key="index"><span style="color: #333">{{index+1}}、</span>{{file.fileName}}, </span>
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
                <input type="file" name="myfile" id="myfileTransfer" @change="getFileNameTran">
              </a>
              <span class="showFileNameTran"></span>
            </form>
            <!--<input type="hidden" name="taskId" v-bind:value="taskId2">-->
            <!--<input type="hidden" name="transferUserId" v-bind:value="transferUserId">-->
            <!--<input type="hidden" name="transferUserName" v-bind:value="transferUserName">-->
            <!--<input type="hidden" name="rtype" v-bind:value="3">-->
            <div>
              <span>已选 <span style="color: #409EFF;font-size: 16px;font-weight: bold;">{{fileListTrans.length}}</span> 个附件:</span>
              <span style="color: #888;" v-if="fileListTrans.length === 0">暂无附件</span>
              <span style="color: #409EFF" v-if="fileListTrans.length > 0" v-for="(file, index) in fileListTrans" v-bind:key="index"><span style="color: #333">{{index+1}}、</span>{{file.fileName}}, </span>
            </div>
          </div>
          <div slot="footer" class="dialog-footer" style="text-align: center;">
            <i-button @click="concelTransfer()">取消</i-button>
            <i-button type="info" v-bind:disabled="butnDisabledT" @click="taskTransfer()">确定</i-button>
          </div>
        </div>
        <!--</div>-->
      </el-dialog>
      <el-dialog title="图片预览" :visible.sync="dialogFormVisible">
        <div class="showImg"><img v-bind:src="showFileUrl" alt=""></div>
      </el-dialog>
      <el-dialog title="图片预览" :visible.sync="dialogShowImg">
        <div class="showImg"><img v-bind:src="commentPreviewUrl" alt=""></div>
      </el-dialog>
      <div class="topperTitle">
        <div class="topCon">
          <div class="topConLf">
            <div class="title">{{proDetailMsg.projectName}}</div>
            <div class="proDetail" v-bind:title="proDetailMsg.content">{{proDetailMsg.content}}</div>
          </div>
          <div class="topConRt">
            <div>
              <div class="myMsg"><div><img src="../../static/img/my.png" alt=""></div><div style="margin-left: 10px;">{{proDetailMsg.projectManager}}</div></div>
              <div class="dataMsg"><div><img src="../../static/img/data.png" alt=""></div><div style="margin-left: 10px;">{{startPlanDate}} 到 {{endPlanDate}}</div></div>
            </div>
            <div class="imgBox" v-if="proDetailMsg.state === '0'"><img src="../../static/img/unstart.png" alt=""></div>
            <div class="imgBox" v-if="proDetailMsg.state === '2'"><img src="../../static/img/doing.png" alt=""></div>
            <div class="imgBox" v-if="proDetailMsg.state === '3'"><img src="../../static/img/finish.png" alt=""></div>
          </div>
        </div>
        <div class="planList">
          <div class="planName">项<br />目<br />计<br />划</div>
          <div class="planBox" v-if="planList.length > 0">
            <div v-if="planList.length > 0" v-bind:class="activeId === plan.id ? 'active' : ''" v-for="plan in planList" v-bind:key="plan.id" @click="selectProject(plan.id,$event)">{{plan.name}}</div>
          </div>
          <div class="planBox2" v-if="planList.length === 0">暂无子计划</div>
        </div>
      </div>
      <div class="devide">
        <div>项目详情</div>
      </div>
      <div class="block">
        <el-tree
          :data="data5"
          node-key="id"
          @node-expand="getNodeMsg($event)"
          :expand-on-click-node="false">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span class="dataName" @click="showDetailPage(data)">{{data.name}}</span>
            <span class="proMsg">
              <span class="treeName">
                <span v-if="data.type === '2'">
                  <span style="float: left"><img style="width: 16px;" src="../../static/img/my.png" alt=""></span>
                  <span style="float: left;margin-left: 16px;">{{data.userName}}</span>
                </span>
              </span>
              <span class="treeState">
                 <span v-if="data.type === '2'">
                  <span style="float: left"><img style="width: 16px;" src="../../static/img/noted.png" alt=""></span>
                  <span v-if="data.status === '0'" style="float: left;margin-left: 16px;color: #ffd04b;">未确认</span>
                  <span v-if="data.status === '1'" style="float: left;margin-left: 16px;color: #53b5ff;">进行中</span>
                  <span v-if="data.status === '2'" style="float: left;margin-left: 16px;color: #27CF97;">已完成</span>
                 </span>
              </span>
              <span class="treeTime">
                <span style="float: left"><img style="width: 16px;" src="../../static/img/data.png" alt=""></span>
                <span style="float: left;margin-left: 16px;">{{data.start}} - {{data.finish}}</span>
              </span>
            </span>
          </span>
        </el-tree>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  // props: ['proId', 'type'],
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      proId: '',
      type: '',
      rid: '',
      taskId: '',
      pageSize: 5,
      downurl: '',
      fileName: '',
      totalNum: 1,
      showFileUrl: '',
      childTaskList: [],
      loading2: false,
      fileListComment: [],
      currentProId: '',
      currentType: 1,
      totalHistoryNum: 1,
      dialogShowImg: false,
      commentPreviewUrl: '',
      loading: false,
      value4: false,
      valueSlide: 5,
      activeId: '',
      proDetailMsg: '',
      taskList: [],
      planList: [],
      historyList: [],
      setRouterNameList: [],
      startPlanDate: '',
      endPlanDate: '',
      taskBasicMsg: '',
      commitComent: '',
      butnDisabled: true,
      dialogFormVisible: false,
      data5: [],
      commentList: [],
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
      // 任务完成
      taskFinishedVisible: false,
      loading9: false,
      commitComentF: '',
      fileListFinish: [],
      butnDisabledF: true,
      // 任务分解
      taskIntro2: '',
      moreText2: '更多',
      fileList2: [],
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
      butnDisabledT: true,
      projectManager: '',
      commitComentT: '',
      transferUserId: '',
      transferUserName: '',
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
      pickerOptionsTaskEt: {}
      // ------
    }
  },
  created: function () {
    this.getProjectDetail()
    this.getUserInfo()
    // this.setRouterNameList = this.$store.state.routerList
    // console.log('setRouterNameList', this.setRouterNameList)
  },
  computed: {
    getStoreProId: function () {
      var that = this
      that.proId = this.$store.state.proId
      return this.$store.state.proId
    }
  },
  watch: {
    proId: function (val, oVal) {
      this.currentProId = val
      this.currentType = this.type
      this.getProjectDetail()
    },
    commitComent: function (val, oVal) {
      if (val) {
        this.butnDisabled = false
      } else {
        this.butnDisabled = true
      }
    },
    commitComentF: function (val, oVal) {
      if (val) {
        this.butnDisabledF = false
      } else {
        this.butnDisabledF = true
      }
    },
    taskFinishedVisible: function (val, oVal) {
      if (val === false) {
        this.commitComentF = ''
        this.fileListFinish = []
        $('.showFileName2').html('')
        $('#myfileF').val('')
      }
    },
    projectManager: function (val, oVal) {
      if (val) {
        this.butnDisabledT = false
      } else {
        this.butnDisabledT = true
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
  methods: {
    resetScro: function () {
      $('.ivu-drawer-body').scrollTop(0)
    },
    // j
    getUserInfo: function () {
      var that = this
      this.ajax('/general/getUserInfo', {}).then(res => {
        if (res.code === 200) {
          that.log('getUserInfo', res)
          that.defImplementer.name = res.data.Name
          that.defImplementer.id = res.data.ID
        }
      })
    },
    drawerClose: function () {
      $('.ivu-drawer-body').scrollTop(0)
    },
    getNodeMsg: function (e) {
      // this.value4 = true
      var that = this
      this.$set(e, 'children', [])
      that.ajax('/leader/getPlanOrTaskById', {id: e.id}).then(res => {
        if (res.code === 200) {
          for (var i = 0; i < res.data.planOrJobList.length; i++) {
            res.data.planOrJobList[i].start = res.data.planOrJobList[i].start.split(' ')[0]
            res.data.planOrJobList[i].finish = res.data.planOrJobList[i].finish.split(' ')[0]
            res.data.planOrJobList[i].children = [{
              id: 1,
              name: '测试'
            }]
          }
          e.children = res.data.planOrJobList
        }
      })
    },
    getProjectDetail: function (typeNum) {
      var that = this
      if (typeNum) {
        that.currentType = typeNum
      }
      that.ajax('/leader/getPlanOrTaskByProjectId', {projectUID: that.$store.state.proId}).then(res => {
        if (res.code === 200) {
          that.proDetailMsg = res.data.projectDetail
          that.$store.commit('setRouterName', {name: res.data.projectDetail.projectName, id: res.data.projectDetail.projectUID, type: that.currentType})
          that.setRouterNameList = that.$store.state.routerList
          that.startPlanDate = res.data.projectDetail.startDate.split(' ')[0]
          that.endPlanDate = res.data.projectDetail.endDate.split(' ')[0]
          that.planList = res.data.planOrJobList
          if (res.data.planOrJobList.length > 0) {
            that.activeId = res.data.planOrJobList[0].id
          } else {
            that.activeId = ''
          }
          that.selectProjectId()
        }
      })
    },
    selectProjectId: function () {
      var that = this
      that.data5 = []
      that.ajax('/leader/getPlanOrTaskById', {id: that.activeId}).then(res => {
        if (res.code === 200) {
          for (var i = 0; i < res.data.planOrJobList.length; i++) {
            res.data.planOrJobList[i].start = res.data.planOrJobList[i].start.split(' ')[0]
            res.data.planOrJobList[i].finish = res.data.planOrJobList[i].finish.split(' ')[0]
            res.data.planOrJobList[i].children = [{
              id: 1,
              name: '测试'
            }]
          }
          that.data5 = res.data.planOrJobList
        }
      })
    },
    selectProject: function (id, e) {
      var that = this
      that.data5 = []
      var obj = e.currentTarget
      if (id) {
        that.activeId = id
      }
      $(obj).addClass('active').siblings().removeClass('active')
      if ($(obj).hasClass('active')) {
        that.ajax('/leader/getPlanOrTaskById', {id: that.activeId}).then(res => {
          if (res.code === 200) {
            for (var i = 0; i < res.data.planOrJobList.length; i++) {
              res.data.planOrJobList[i].start = res.data.planOrJobList[i].start.split(' ')[0]
              res.data.planOrJobList[i].finish = res.data.planOrJobList[i].finish.split(' ')[0]
              res.data.planOrJobList[i].children = [{
                id: 1,
                name: '测试'
              }]
            }
            that.data5 = res.data.planOrJobList
          }
        })
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
            that.toDetail()
            that.selectProjectId()
            that.getHistoryList()
          }
        }).catch(() => {
          // that.loading = false
        })
      })
    },
    modifyTask: function (id) {
      var that = this
      that.modifyTaskVisible = true
      that.ajax('/myTask/queryTaskDetailSingle', {taskId: id}).then(res => {
        // this.token = res._jfinal_token
        console.log('queryTaskDetailSingle', res)
        that.detailTaskform.jobName = res.data.jobName
        that.detailTaskform.jobLevel = parseInt(res.data.jobLevel)
        that.detailTaskform.taskStartDate = res.data.taskStartDate
        that.detailTaskform.taskFinishDate = res.data.taskFinishDate
        that.detailTaskform.description = res.data.description
        // var st = res.data.taskStartDate.split(' ')[0] + ' 00:00:00'
        // var binStartTime = new Date(st).getTime()
        // var binEndTime = new Date(res.data.taskFinishDate).getTime()
        // this.pickerOptionsTaskSt.disabledDate = function (time) {
        //   return time.getTime() > binEndTime || time.getTime() < binStartTime
        // }
      })
    },
    levelChange: function (rateval) {
      this.detailTaskform.jobLevel = rateval
    },
    modifyTaskSub: function (formName) {
      var that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          that.loadingEdit = true
          that.editTaskPayload.id = that.taskId
          that.editTaskPayload.jobLevel = that.detailTaskform.jobLevel
          that.editTaskPayload.jobName = that.detailTaskform.jobName
          that.editTaskPayload.taskStartDate = that.detailTaskform.taskStartDate
          that.editTaskPayload.taskFinishDate = that.detailTaskform.taskFinishDate
          that.editTaskPayload.description = that.detailTaskform.description
          that.ajax('/myProject/editTask', that.editTaskPayload).then(res => {
            that.log('editTask:', res)
            if (res.code === 200) {
              that.$message({
                message: '保存成功！',
                type: 'success'
              })
              that.modifyTaskVisible = false
              that.loadingEdit = false
              that.toDetail()
              that.selectProjectId()
              that.getHistoryList()
            } else {
              that.loadingEdit = false
            }
          })
        }
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
      that.ajax('/myTask/transferTask', {remark: that.commitComentT, attachmentId: fileStr, taskId: that.taskId, transferUserId: that.transferUserId, transferUserName: that.transferUserName}).then(res => {
        if (res.code === 200) {
          that.toDetail()
          that.selectProjectId()
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
    // ----
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
            that.toDetail()
            that.selectProjectId()
            that.getHistoryList()
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
          message: '请填写动态任务名',
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
    showDetailPage: function (data) {
      var that = this
      console.log('dataaaaa:', data)
      // that.resetScro()
      if (data.type === '2') {
        that.taskId = data.id
        that.taskComment.uid = data.id
        that.taskHistoryList.uid = data.id
        that.value4 = true
        that.getCommicateCont()
        that.getHistoryList()
        that.toDetail()
        that.getTaskChildList()
      }
    },
    getTaskChildList: function (id) {
      var that = this
      if (id) {
        that.ajax('/myTask/myChildTask', {taskId: id}).then(res => {
          if (res.code === 200) {
            that.log('myChildTask:', res)
            that.childTaskList = res.data
          }
        })
      } else {
        that.ajax('/myTask/myChildTask', {taskId: that.taskId}).then(res => {
          if (res.code === 200) {
            that.log('myChildTask:', res)
            that.childTaskList = res.data
          }
        })
      }
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
            that.getHistoryList()
          }
        }).catch(() => {
          // that.loading = false
        })
      })
    },
    toDetail: function (id) {
      var that = this
      if (id) {
        that.getTaskChildList(id)
        that.ajax('/myTask/queryTaskDetail', {taskId: id}).then(res => {
          if (res.code === 200) {
            that.taskBasicMsg = res.data
            that.rid = res.data.uid
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
      } else {
        that.getTaskChildList()
        that.ajax('/myTask/queryTaskDetail', {taskId: that.taskId}).then(res => {
          if (res.code === 200) {
            that.taskBasicMsg = res.data
            that.rid = res.data.uid
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
      }
    },
    showImagePre: function (url) {
      this.dialogFormVisible = true
      this.showFileUrl = url
    },
    showImagePreCom: function (url) {
      if (url) {
        this.commentPreviewUrl = url
        this.dialogShowImg = true
      }
    },
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
            that.toDetail()
            that.selectProjectId()
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
      that.ajax('/myTask/finishTask', {remark: that.commitComentF, attachmentId: fileStr, taskId: that.taskId}).then(res => {
        if (res.code === 200) {
          that.log('myTaskView:', res)
          that.toDetail()
          that.selectProjectId()
          that.getHistoryList()
          that.commitComentF = ''
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
      that.commitComentF = ''
      $('.showFileName2').html('')
      $('#myfileF').val('')
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
            that.toDetail()
            that.selectProjectId()
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
    getCurrentHistoryPage: function (e) {
      this.taskHistoryList.pageNum = e
      this.getHistoryList()
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
        contentId: that.taskId,
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
          that.$message.success('评论成功！')
        }
      })
    },
    getNextPlan: function (pId) {
      var that = this
      that.value4 = false
      that.planList = []
      that.data5 = []
      that.currentProId = pId
      that.setRouterNameList = that.$store.state.routerList
      that.getProjectDetail(2)
    },
    breadcrumbGetPlan: function (pid, index) {
      var that = this
      that.data5 = []
      that.currentProId = pid
      that.getProjectDetail(that.$store.state.routerList[index].type)
      that.$store.commit('resetBreadcrumb', index)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  /*display: inline-block;*/
  margin: 0 10px;
}
a {
  color: #1296db;
}
.topCon{
  display: flex;
  justify-content: space-between;
}
.topConLf{
  width: 75%;
}
  .title{
    height: 30px;
    color: chocolate;
    font-size: 18px;
    font-family: '黑体';
    font-weight: bold;
  }
  .proDetail{
    font-size: 14px;
    color: #666;
    text-indent: 2em;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    text-overflow:ellipsis;
    overflow: hidden;
  }
  .proDetail{
    overflow:hidden;
    text-overflow:ellipsis;
    display:-webkit-box;
    -webkit-line-clamp:3;
    -webkit-box-orient:vertical;
  }
  .topConRt{
    width: 15%;
    position: relative;
  }
  .imgBox{
    position: absolute;
    top: -20px;
    right: 15px;
    opacity: 0.9;
    width: 90px;
  }
  .imgBox img{
    width: 100%;
  }
  .myMsg,.dataMsg{
    color: #888;
    display: flex;
    font-size: 15px;
    justify-content: start;
    line-height: 25px;
  }
  .planName{
    width: 34px;
    font-size: 14px;
    color: #fff;
    float: left;
    padding: 10px;
    text-align: center;
    background-color: #409EFF;
    border-radius: 0px;
    border-bottom-left-radius: 5px;
    border-top-left-radius: 5px;
  }
  .planList{
    width: 100%;
    display: flex;
    margin-top: 30px;
    background-color: #f5f8fa;
  }
  .planBox{
    width: 98%;
    float: left;
    max-height: 104px;
    overflow: scroll;
    overflow-x: hidden;
    border-top: 1px solid #f0f0f0;
  }
.planBox2{
  width: 98%;
  float: left;
  color: #6f7180;
  max-height: 104px;
  text-align: center;
  line-height: 104px;
}
.planBox div{
  padding: 4px 20px;
  float: left;
  border-radius: 4px;
  background-color: #fff;
  margin-left: 25px;
  margin-top: 15px;
  color: #777;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
}
  .devide{
    height: 40px;
    clear: both;
    line-height: 40px;
    padding: 0 10px;
    font-size: 16px;
    color: #999;
    margin-top: 20px;
    background-color: #f5f8fa;
  }
.custom-tree-node {
  flex: 1;
  align-items: center;
  font-size: 14px;
  padding-right: 8px;
}
.treeName{
 width: 240px;
}
.treeTime{
  float: right;
}
.treeState{
  width: 100px;
}
  .proMsg{
    width: 700px;
    float: right;
    display: flex;
    justify-content: space-between;
  }
.planBox .active{
    color: #fff;
    background-color: #409EFF;
  }
.dataName{
  display: inline-block;
}
  .dataName:hover{
    color: chocolate;
  }
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
.cannetProject21{
  width: 90%;
  display: flex;
  justify-content: space-between;
  line-height: 40px;
  font-size: 14px;
  /*font-family: '黑体';*/
  padding:0 10px;
  background-color: #f5f8fa;
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
.cannetProjectFile{
  line-height: 49px;
  border-bottom: 1px solid #f1f1f1;
  font-size: 15px;
  font-family: '黑体';
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
.taskListChild{
  padding: 0 20px;
}
.taskItemChild{
  height: 48px;
  line-height: 48px;
  display: flex;
  justify-content: space-between;
}
.taskItemChild2{
  height: 48px;
  line-height: 48px;
}
.childTaskName{
  width: 60%;
  color: #409EFF;
  cursor: pointer;
  font-size: 14px;
}
.childTaskMsg{
  width: 40%;
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
  background-color: #f5f8fa;
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
  width: 190px;
  display: flex;
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
</style>
