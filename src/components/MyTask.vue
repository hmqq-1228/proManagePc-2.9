<template>
  <div class="MyDep">
    <el-main style="padding-bottom: 0;">
      <div class="el-main-box">
        <div class="el-main-left">
          <div class="contentTop"  v-loading="loading3">
            <div class="paiTaskTitTab">
              <div class="paiTask pai active" v-on:click="testValue9()">新建任务</div>
              <!--<div class="paiTask share">发分享(@Ta)</div>-->
            </div>
            <div class="paiTaskIptBox">
              <div class="paiTaskIptLeft">
                <div class="paiTaskIptIcon"><i class="el-icon-edit-outline"></i></div>
                <div class="paiTaskIptWrap"><input v-on:focus="inputFocus()" v-model="taskNameText" v-on:blur="iptBlur()" type="text" placeholder="请输入新建任务名称" /></div>
              </div>
              <div class="paiTaskIptRight">
                <div class="paiTaskIptRightIcon" v-on:click="selectUser($event)"><i class="el-icon-edit-outline"></i></div>
                <div class="paiTaskIptRightCnt" v-on:click="selectUser($event)">
                  <!--<span v-for="user in taskForm.value9" :key="user"> {{user?user.split('-')[0]:defImplementerName}}</span>-->
                  <span v-if="taskForm.value9.length > 0" v-for="user in taskForm.value9" :key="user"> {{user.split('-')[0]}}</span>
                  <span v-if="taskForm.value9.length === 0">{{defImplementer.name}}</span>
                  <!--<span> {{defImplementer.name}}</span>-->
                </div>
                <div class="paiTaskIptRightIcon" v-on:click="selectDate($event)"><i class="el-icon-date"></i></div>
                <div class="paiTaskIptRightCnt" v-on:click="selectDate($event)">时间</div>
                <div class="paiTaskIptRightIcon" v-on:click="selectLevel($event)"><i class="el-icon-bell"></i></div>
              </div>
            </div>
            <!--任务关联 项目组成员 简介-->
            <div class="taskRelation" v-if="taskRelationShow">
              <div class="relationHeader">
                <div class="proBelong">
                  <!--所属项目 <i class="el-icon-arrow-down"></i>-->
                  <el-select v-model="projectBelong" placeholder="请选择关联项目">
                    <el-option
                      v-for="item in options"
                      :key="item.projectUID"
                      :label="item.projectName"
                      :value="item.projectUID">
                    </el-option>
                  </el-select>
                </div>
                <!--<div class="taskExecutor">-->
                  <!--参与人 <i class="el-icon-date"></i>-->
                <!--</div>-->
              </div>
              <div class="relationIntro">
                <textarea class="relationIntroArea" v-model="taskIntro" placeholder="请输入任务简介"></textarea>
              </div>
            </div>
            <!--附件选择-->
            <div class="taskFileUpload">
              <div class="fileUploadCao">
                <div class="selectLeft">
                  <form id="uploadFile" enctype="multipart/form-data">
                    <input type="file" :disabled="fileListDis" v-on:change="fileChange" id="myfile" name="myfile" placeholder="请选择文件"/><br>
                      <!--<el-button type="primary" @click="addMarkInfo()">提 交</el-button>-->
                  </form>
                  <div style="margin-top: 8px;font-size: 12px;">
                    <span style="color: #f00;" v-if="fileList.length === 5">最多选择 <span style="font-size: 16px;font-weight: bold;">{{fileList.length}}</span> 个附件:</span>
                    <span v-if="fileList.length < 5">已选 <span style="color: #409EFF;font-size: 16px;font-weight: bold;">{{fileList.length}}</span> 个附件:</span>
                    <span style="color: #888;" v-if="fileList.length === 0">暂无附件</span>
                    <span style="color: #409EFF" v-if="fileList.length > 0" v-for="(file, index) in fileList" v-bind:key="index"><span style="color: #333">{{index+1}}、</span>{{file.fileName}} <div style="color: #999;display: inline-block;" class="el-icon-close" @click="delUploadFileNew(file.attachmentId)"></div>, </span>
                  </div>
                </div>
                <div class="selectRight">
                  <div class="selectMoreInfo" v-on:click="moreClick()">
                    <i v-bind:class="moreIcon"></i><span style="margin-left: 6px;">{{moreText}}</span>
                  </div>
                  <div class="submitBtn" v-on:click="depSub()"><el-button type="primary">发布</el-button></div>
                </div>
              </div>
              <div class="fileUploadPre"></div>
            </div>
          </div>
          <!--上传的图片在此预览-->
          <div class="uploadFilePre"></div>
        </div>
      </div>
    </el-main>
    <div class="searchItem">
      <el-col :span="3">
        <el-select v-model="optionsValue" placeholder="请选择" @change="myTaskStyleChange($event)">
          <el-option
            v-for="item in optionsTask"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select v-model="optionsValue2" placeholder="请选择" @change="taskTypeState($event)">
          <el-option
            v-for="item in optionsTask2"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select v-model="optionsValue3" placeholder="请选择" @change="taskOfProject($event)">
          <el-option label="全部项目" value=""></el-option>
          <el-option
            v-for="item in projectList"
            :key="item.projectUID"
            :label="item.projectName"
            :value="item.projectName">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-input placeholder="请输入搜索内容" v-model="input3">
          <template slot="prepend">任务名称</template>
        </el-input>
      </el-col>
    </div>
    <div class="taskBox">
      <CheckboxGroup v-model="taskCheckedList">
        <div class="taskList" v-for="(myTask, index) in myTaskList" :key="index">
          <div class="taskItem">
            <div><span style="font-size: 16px;color: #409EFF;cursor: pointer;" @click="toDetail(myTask.uid)">{{myTask.jobName}}</span></div>
            <div class="taskName"><Icon type="md-ribbon" size="20"/>{{myTask.projectName}}</div>
          </div>
          <div class="taskMsg">
            <div><Icon type="md-contact" size="20"/><span style="padding-left: 8px;">{{myTask.userName}}</span></div>
            <div style="line-height: 20px;">
              <Icon type="md-alarm" size="18"/>
              <span style="padding-left: 8px;float: right;margin-top: 2px;">{{myTask.taskStartDate.split(' ')[0]}} - {{myTask.taskFinishDate.split(' ')[0]}}</span>
            </div>
            <div style="text-align: right;margin-top: 4px;font-size: 12px;" v-if="myTask.dayNum < 0 && myTask.status != '2'">已逾期 <span style="font-size: 18px;color: #f00;font-weight: bold;">{{Math.abs(myTask.dayNum)}}</span> 天</div>
            <div style="text-align: right;margin-top: 4px;font-size: 12px;" v-if="myTask.dayNum >= 0 && myTask.status != '2'">剩余 <span style="font-size: 18px;color: #27CF97;font-weight: bold;">{{myTask.dayNum}}</span> 天</div>
            <div style="text-align: right;margin-top: 4px;font-size: 12px;color: #3a8ee6;font-weight: bold;" v-if="myTask.status === '2'">任务已完成</div>
          </div>
          <div v-bind:class="'taskTag'+ myTask.status">{{myTask.statusStr}}</div>
        </div>
      </CheckboxGroup>
    </div>
    <div style="text-align: center;margin-top: 40px;margin-bottom: 40px;">
      <el-pagination
        background
        layout="prev, pager, next, total"
        @current-change="pageNumChenge($event)"
        :page-size="8"
        :current-page="myTaskViewPayload.pageNum"
        :total="totalRowNum">
      </el-pagination>
    </div>
    <!--发动态 人员选择-->
    <div class="selectUserDialog" v-bind:style="{ top: selectUserTop + 'px', left: selectUserLeft + 'px' }" v-if="selectUserDiaShow">
      <div class="selectUserIpt">
        <el-select v-model="taskForm.value9" multiple filterable remote style="width: 100%;"
                   :reserve-keyword="false" placeholder="请输人员姓名或拼音(如'张三'或 'zs')"
                   :remote-method="remoteMethod" :loading="loading2">
          <el-option v-for="item in options4" :key="item.ID" :label="item.Name + ' (' + item.jName + ')'"
                     :value="item.Name + '-' + item.ID">
          </el-option>
        </el-select>
      </div>
      <div style="color: #dd6161;font-size: 12px; transform: scale(0.9)" v-if="taskForm.value9.length===0">* 如果此项不选，则默认自己</div>
      <div class="selectUserBtn" v-on:click="selectUserClick()"><el-button>确定</el-button></div>
    </div>
    <!--发动态 时间选择 -->
    <div class="selectDateDialog" v-bind:style="{ top: selectDateTop + 'px', left: selectDateLeft + 'px' }" v-if="selectDateDiaShow">
      <div class="selectDateBox">
        <div class="selectDateItem">
          <el-date-picker
            v-model="selDateStart"
            type="datetime"
            :picker-options="pickerOptionsPlan"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择开始时间">
          </el-date-picker>
        </div>
        <!--<div style="margin-left: 10px; margin-right: 10px;">至</div>-->
        <div class="selectDateItem">
          <el-date-picker
            v-model="selDateEnd"
            :picker-options="pickerOptionsPlan"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择结束时间">
          </el-date-picker>
        </div>
      </div>
      <div class="selectUserBtn">
        <el-button v-on:click="selectDateCancel()">取消</el-button>
        <el-button v-on:click="selectDateOk()">确定</el-button>
      </div>
    </div>
    <!---->
    <!--发动态 任务级别选择-->
    <div class="depTaskLevel" v-bind:style="{ height: taskLevelHeight + 'px', top: taskLevelTop + 'px', left: taskLevelLeft + 'px'}" v-on:mouseleave="rateMouseLeave()">
      <div class="rateBox">
        <el-rate v-model="levelValue"></el-rate>
      </div>
    </div>
    <el-dialog title="图片预览" :visible.sync="dialogShowImg">
      <div class="showImg"><img v-bind:src="commentPreviewUrl" alt=""></div>
    </el-dialog>
    <el-dialog title="图片预览" :visible.sync="dialogFormVisible">
    <div class="showImg"><img v-bind:src="fileShowUrl" alt=""></div>
  </el-dialog>
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
              <div style="font-size: 12px;">
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
    <el-dialog title="任务移交" :visible.sync="taskTransferVisible" v-loading="loading11" width="26%">
      <div style="height: 30px;line-height: 30px"><span style="color: red">*</span> 任务移交人：</div>
      <el-autocomplete style="width:90%"
         v-model="projectManager"
         :fetch-suggestions="querySearchAsync"
         placeholder="请输入移交人姓名"
         :trigger-on-focus="false"
         @select="handleSelect"
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
          <div style="font-size: 12px;">
            <span style="color: #f00;" v-if="fileListTrans.length === 5">最多选择 <span style="font-size: 16px;font-weight: bold;">{{fileListTrans.length}}</span> 个附件:</span>
            <span v-if="fileListTrans.length < 5">已选 <span style="color: #409EFF;font-size: 16px;font-weight: bold;">{{fileListTrans.length}}</span> 个附件:</span>
            <span style="color: #888;" v-if="fileListTrans.length === 0">暂无附件</span>
            <span style="color: #409EFF" v-if="fileListTrans.length > 0" v-for="(file, index) in fileListTrans" v-bind:key="index"><span style="color: #333">{{index+1}}、</span>{{file.fileName}} <div style="color: #999;display: inline-block;" class="el-icon-close" @click="delUploadFileTran(file.attachmentId)"></div>, </span>
          </div>
        </div>
        <div slot="footer" class="dialog-footer" style="text-align: center;">
          <i-button @click="concelTransfer()">取消</i-button>
          <i-button type="info" v-bind:disabled="butnDisabledT" @click="taskTransfer()">确定</i-button>
        </div>
        <!--</div>-->
    </el-dialog>
    <!---->
    <Drawer class="drawerScroll" :closable="false" width="750" v-model="value4">
      <div class="slidTop">
        <div v-bind:class="'topState' + taskBasicMsg.status"><img src="../../static/img/stataNew.png" alt="">{{taskBasicMsg.statusStr}}</div>
        <div><span>紧急程度: </span><span><Rate v-model="taskBasicMsg.jobLevel" disabled/></span></div>
        <div style="display: flex;justify-content: space-between">
          <div style="width: 50px;cursor: pointer;" v-if="taskBasicMsg.showDeleteFlag" @click="delTask(taskBasicMsg.uid)"><Icon type="ios-trash-outline" size="24" color="#53b5ff"/></div>
          <div @click="modifyTask(taskBasicMsg.uid)" style="width: 50px;padding-top: 3px;font-size: 14px;color: #409EFF;cursor: pointer;" v-if="taskBasicMsg.showMenu===0?false:true"><i class="el-icon-edit" style="font-size: 18px;color: #409EFF"></i> 修改</div>
        </div>
      </div>
      <div class="taskMsg2">
        <div class="taskLf">
          <div class="taskName2">{{taskBasicMsg.jobName}}</div>
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
              <div><img src="../../static/img/kaishi.png" alt=""><span class="proLabel">实际开始:</span><span v-if="taskBasicMsg.dealWithDate">{{taskBasicMsg.dealWithDate}}</span><span style="color: #888" v-if="!taskBasicMsg.dealWithDate">暂未开始</span></div>
              <div><img src="../../static/img/jiesu.png" alt=""><span class="proLabel">实际结束:</span><span v-if="taskBasicMsg.realFinishDate">{{taskBasicMsg.realFinishDate}}</span><span style="color: #888" v-if="!taskBasicMsg.realFinishDate">暂未完成</span></div>
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
        <div style="display: inline-block;color: #409eff;cursor: pointer;" @click="toProject(taskBasicMsg.projectUID)">{{taskBasicMsg.projectName}}</div>
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
              <!--<span style="display: inline-block;color: #53b5ff;cursor: pointer;" @click="deleteFile(file.id)">删除</span>-->
              <span v-if="file.isImg" @click="showImagePre(file.previewUrl)" style="display: inline-block;color: #53b5ff;cursor: pointer;">预览</span>
              <span style="display: inline-block;color: #53b5ff;"><a v-bind:href="file.downurl"> 下载<i style="font-weight: bold !important; padding: 5px; color: chocolate;" class="el-icon-download"></i></a></span>
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
              <div class="selectLeft"  style="width: 440px">
                <form id="uploadFileDel" enctype="multipart/form-data">
                  <input type="file" :disabled="fileListDis2" v-on:change="fileChange2" id="myfileDel" name="myfile" placeholder="请选择文件"/><br>
                  <!--<el-button type="primary" @click="addMarkInfo()">提 交</el-button>-->
                </form>
                <div style="margin-top: 8px;font-size: 12px;">
                  <span style="color: #f00;" v-if="fileList2.length === 5">最多选择 <span style="font-size: 16px;font-weight: bold;">{{fileList2.length}}</span> 个附件:</span>
                  <span v-if="fileList2.length < 5">已选 <span style="color: #409EFF;font-size: 16px;font-weight: bold;">{{fileList2.length}}</span> 个附件:</span>
                  <span style="color: #888;" v-if="fileList2.length === 0">暂无附件</span>
                  <span style="color: #409EFF" v-if="fileList2.length > 0" v-for="(file, index) in fileList2" v-bind:key="index"><span style="color: #333">{{index+1}}、</span>{{file.fileName}} <div style="color: #999;display: inline-block;" class="el-icon-close" @click="delUploadFileDel(file.attachmentId)"></div>,</span>
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
          <div class="childTaskName" :title="childTask.jobName" @click="toDetail(childTask.uid)"><Icon type="md-copy" size="16" color="#409EFF"/> {{childTask.jobName}}</div>
          <div class="childTaskMsg">
            <div style="width: 60px;" v-bind:class="'childTaskStyle' + childTask.status">{{childTask.statusStr}}</div>
            <div style="width: 80px;" v-if="childTask.dayNum >= 0">剩余 <span style="color:#13ce66;font-size: 18px;">{{childTask.dayNum}}</span> 天</div>
            <div style="width: 80px;" v-if="childTask.dayNum < 0">逾期 <span style="color:#f00;font-size: 18px;">{{Math.abs(childTask.dayNum)}}</span> 天</div>
            <div style="width: 150px;">{{childTask.userName}}</div>
            <div style="width: 20px;margin-right: 0"><div class="taskDel" v-if="childTask.showDeleteFlag" @click="childTaskDelete(childTask.uid)"><Icon type="md-close" size="18"/></div></div>
          </div>
        </div>
        <div class="taskItemChild2" style="text-align: center;color: #aaa;" v-if="childTaskList.length === 0">
          暂无子任务
        </div>
      </div>
      <div class="cannetProject1">
        <div style="display: inline-block"><img src="../../static/img/goutong.png" alt=""><span>沟 通</span></div>
      </div>
      <div class="el-textarea" v-loading="loading8">
          <textarea name="content" class="el-textarea__inner" id="textArea2" type="text" v-model="commitComent"></textarea>
          <div class="cannetProject21">
            <div style="display: inline-block">
              <form id="uploadFileRe" enctype="multipart/form-data" style="height: 40px">
                <img src="../../static/img/fujian.png" alt="">
                <a href="javascript:;" class="file">选择文件
                  <input type="file" :disabled="commentDis" name="myfile" id="myfile2" @change="getFileName">
                </a>
                <span class="showFileName"></span>
              </form>
              <div style="font-size: 12px;">
                <span style="color: #f00;" v-if="fileListComment.length === 5">最多选择 <span style="font-size: 16px;font-weight: bold;">{{fileListComment.length}}</span> 个附件:</span>
                <span v-if="fileListComment.length < 5">已选 <span style="color: #409EFF;font-size: 16px;font-weight: bold;">{{fileListComment.length}}</span> 个附件:</span>
                <span style="color: #888;" v-if="fileListComment.length === 0">暂无附件</span>
                <span style="color: #409EFF" v-if="fileListComment.length > 0" v-for="(file, index) in fileListComment" v-bind:key="index"><span style="color: #333">{{index+1}}、</span>{{file.fileName}} <div style="color: #999;display: inline-block;" class="el-icon-close" @click="delUploadFileComment(file.attachmentId)"></div>, </span>
              </div>
            </div>
            <div><i-button style="margin-top: 6px;" type="info" v-bind:disabled="butnDisabled" @click="addMarkInfo2()">回复</i-button></div>
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
                                  :picker-options="pickerOptionsTaskEt"
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
  </div>
</template>

<script>
export default {
  name: 'MyTask',
  data () {
    return {
      showDownMsg: false,
      endTimeFirst: '',
      startTimeFirst: '',
      fileListEdit: [],
      fileListEditDis: false,
      fileListEditLen: 0,
      // 修改任务
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
      pickerOptionsPlan: {},
      // ------
      token: '',
      fileList: [],
      fileListDis: false,
      fileListLen: 0,
      fileList2: [],
      fileListDis2: false,
      fileListLen2: 0,
      fileListComment: [],
      commentDis: false,
      fileListCommentLen: 0,
      fileListFinish: [],
      fileListFinishDis: false,
      fileListFinishLen: 0,
      fileListTrans: [],
      fileListTransDis: false,
      fileListTransLen: 0,
      childTaskList: [],
      disabledStarTime: '',
      disabledEndTime: '',
      toShowDevided: false,
      // 任务移交
      taskTransferVisible: false,
      loading11: false,
      butnDisabledT: true,
      projectManager: '',
      pickerOptions0: {},
      commitComentT: '',
      transferUserId: '',
      transferUserName: '',
      // 任务完成
      taskFinishedVisible: false,
      loading9: false,
      commitComentF: '已完成',
      butnDisabledF: false,
      totalRowNum: 0,
      myTaskList: [],
      projectList: [],
      taskCheckedList: ['任务1'],
      // 抽屉
      rid2: '',
      taskId2: '',
      taskIdEdit: '',
      totalNum: 1,
      pageSize: 5,
      totalHistoryNum: 1,
      dialogShowImg: false,
      fileShowUrl: '',
      commentPreviewUrl: '',
      dialogFormVisible: false,
      value4: false,
      taskBasicMsg: '',
      commitComent: '',
      loading8: false,
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
      // 默认指派
      input3: '',
      defImplementerName: '李四',
      defImplementer: {
        name: '张三',
        id: ''
      },
      optionsTask: [{
        value: '2',
        label: '我负责的任务'
      }, {
        value: '3',
        label: '我发起的任务'
      }],
      optionsValue: '2',
      optionsTask2: [{
        value: '',
        label: '全部任务'
      }, {
        value: 'today',
        label: '今日任务'
      }, {
        value: 'overtime',
        label: '逾期任务'
      }, {
        value: 'unstart',
        label: '未开始任务'
      }, {
        value: 'unfinish',
        label: '进行中任务'
      }, {
        value: 'finish',
        label: '已完成任务'
      }],
      optionsValue2: '',
      optionsValue3: '',
      // 任务级别
      levelValue: 3,
      levelValue2: 3,
      // top
      taskLevelTop: '',
      taskLevelTop2: '',
      // left
      taskLevelLeft: '',
      taskLevelLeft2: '',
      // 任务级别 div高度
      taskLevelHeight: 0,
      taskLevelHeight2: 0,
      formData: '',
      formData2: '',
      // 附件id
      attachmentId: '',
      attachmentId2: '',
      // 所属项目
      projectBelong: '',
      // 子级页面数据是否重调以刷新
      isRecall: 0,
      isRecall2: 0,
      selDateStart: '',
      selDateStart2: '',
      selDateEnd: '',
      selDateEnd2: '',
      activeName: 'second',
      testData: 'Test Data',
      loading2: false,
      loading22: false,
      loading3: false,
      loading32: false,
      loading: false,
      loadingEdit: false,
      options4: [],
      options42: [],
      options: [],
      selectUserDiaShow: false,
      selectUserDiaShow2: false,
      taskRelationShow: false,
      taskRelationShow2: false,
      selectDateDiaShow: false,
      selectDateDiaShow2: false,
      // 悬浮窗管理 数组
      diaManageArr: ['selectUserDiaShow', 'selectDateDiaShow'],
      diaManageArr2: ['selectUserDiaShow2', 'selectDateDiaShow2'],
      // 伸缩窗管理 数组
      tranManageArr: ['taskLevelHeight'],
      tranManageArr2: ['taskLevelHeight2'],
      selectUserTop: '',
      selectUserLeft: '',
      selectDateTop: '',
      selectDateLeft: '',
      selectUserTop2: '',
      selectUserLeft2: '',
      selectDateTop2: '',
      selectDateLeft2: '',
      moreText: '更多',
      moreText2: '更多',
      moreIcon: 'el-icon-arrow-down',
      moreIcon2: 'el-icon-arrow-down',
      taskIntro: '',
      taskIntro2: '',
      taskNameText: '',
      taskNameText2: '',
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
      },
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
      moreUserSelectPayload: {
        projectManager: ''
      },
      moreUserSelectPayload2: {
        projectManager: ''
      },
      myTaskViewPayload: {
        pageNum: 1,
        pageSize: '8',
        projectUID: '',
        uid: this.$route.params.id,
        userId: this.$store.state.userId,
        startTime: '',
        endTime: '',
        projectName: '',
        planName: '',
        jobName: '',
        type: '',
        jobLevel: '',
        createrName: '',
        status: '',
        cStartTime: '',
        cEndTime: '',
        taskSource: '2',
        sType: ''
      },
      myProjectListPayload: {
        userId: this.$store.state.userId
      },
      CommunityTaskPayload: {
        projectUID: '',
        planId: '',
        taskId: '',
        jobName: '',
        description: '',
        startTime: '',
        endTime: '',
        jobLevel: '3',
        // 附件id
        attachmentId: '',
        pStr: ''
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
      }
    }
  },
  watch: {
    // 如果 `testData` 发生改变，这个函数就会运行
    testData: function (newQuestion, oldQuestion) {
    },
    fileListLen: function (val, oVal) {
      if (val >= 5) {
        this.fileListDis = true
      } else if (val < 5) {
        this.fileListDis = false
      }
    },
    fileListLen2: function (val, oVal) {
      if (val >= 5) {
        this.fileListDis2 = true
      } else if (val < 5) {
        this.fileListDis2 = false
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
    value4: function (newQuestion, oldQuestion) {
      if (newQuestion === false) {
        this.toShowDevided = false
      }
    },
    toShowDevided: function (newQuestion, oldQuestion) {
      if (newQuestion === false) {
        this.taskRelationShow2 = false
        this.clearDynamicsForm2()
      }
    },
    optionsValue3: function (newValue, oldValue) {
      // console.log('newValue:', newValue)
      this.myTaskViewPayload.projectName = newValue
      this.queryMyTaskView()
    },
    input3: function (newValue, oldValue) {
      // console.log('newValue:', newValue)
      this.myTaskViewPayload.jobName = newValue
      this.queryMyTaskView()
    },
    // currentTab: function (newQuestion, oldQuestion) {
    //   this.$store.state.DevelopmentTab = newQuestion
    // },
    selDateStart: function (newQuestion, oldQuestion) {
      this.log('newQuestion:', newQuestion)
    },
    selDateStart2: function (newQuestion, oldQuestion) {
      this.log('newQuestion:', newQuestion)
    },
    projectBelong: function (newQuestion, oldQuestion) {
      this.log('projectBelong:', newQuestion)
      this.getProjectTime(newQuestion)
    },
    formData: function (newQuestion, oldQuestion) {
      this.log('新的newQuestion:', newQuestion)
    },
    formData2: function (newQuestion, oldQuestion) {
      this.log('新的newQuestion:', newQuestion)
    },
    levelValue: function (newQuestion, oldQuestion) {
      this.CommunityTaskPayload.jobLevel = newQuestion.toString()
    },
    levelValue2: function (newQuestion, oldQuestion) {
      this.CommunityTaskPayload2.jobLevel = newQuestion.toString()
    },
    // 监听人员选择 触发悬浮窗管理
    selectUserDiaShow: function (newQuestion, oldQuestion) {
      this.dialogManage('selectUserDiaShow')
    },
    selectUserDiaShow2: function (newQuestion, oldQuestion) {
      this.dialogManage2('selectUserDiaShow2')
    },
    // 监听日期选择 触发悬浮窗管理
    selectDateDiaShow: function (newQuestion, oldQuestion) {
      this.dialogManage('selectDateDiaShow')
    },
    selectDateDiaShow2: function (newQuestion, oldQuestion) {
      this.dialogManage2('selectDateDiaShow2')
    },
    // 监听任务级别伸缩窗
    taskLevelHeight: function (newQuestion, oldQuestion) {
      this.transitionManage('taskLevelHeight')
      // if () {}
    },
    taskLevelHeight2: function (newQuestion, oldQuestion) {
      this.transitionManage2('taskLevelHeight2')
      // if () {}
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
    taskTransferVisible: function (val, oVal) {
      if (val === false) {
        this.projectManager = ''
        this.commitComentT = ''
        this.fileListTrans = []
        $('#myfileTransfer').val('')
        $('.showFileNameTran').html('')
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
    fileName: function (val, oval) {
    }
  },
  created () {
    this.getUserInfo()
    this.getProBelong()
    this.setDefaultTime()
    this.queryMyTaskView()
    this.queryMyProjectList()
  },
  computed: {
    // currentTabComponent: function () {
    //   return this.currentTab
    // }
  },
  methods: {
    // deleteFile: function (id) {
    //   var that = this
    //   that.$confirm('确认删除此附件，确定删除？', '', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     that.ajax('/file/deleteFile', {attachmentId: id}).then(res => {
    //       // this.log('选择所属项目:', res)
    //       if (res.code === 200) {
    //         that.$message.success('删除成功！')
    //         that.toDetail(that.taskId2)
    //       }
    //     })
    //   })
    // },
    toProject: function (id) {
      this.$store.state.proId = id
      this.$router.push('/ProEdit')
    },
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
    // }
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
    delUploadFileNew: function (id) {
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
            for (var i = 0; i < that.fileList.length; i++) {
              if (id === that.fileList[i].attachmentId) {
                that.fileList.splice(i, 1)
              }
            }
            that.fileListLen = that.fileList.length
            console.log('edit', that.fileList)
            $('#myfile').val('')
          }
        })
      }).catch(() => {
        return false
      })
    },
    modifyTask: function (id) {
      var that = this
      that.modifyTaskVisible = true
      that.taskIdEdit = id
      that.ajax('/myTask/queryTaskDetailSingle', {taskId: id}).then(res => {
        // this.token = res._jfinal_token
        if (res.code === 200) {
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
        }
        var st = res.data.taskStartDate.split(' ')[0] + ' 00:00:00'
        var stF = res.data.parentSTime.split(' ')[0] + ' 00:00:00'
        var binStartTime = new Date(st).getTime()
        var binStartF = new Date(stF).getTime()
        var binEndTime = new Date(res.data.taskFinishDate).getTime()
        var binEndF = new Date(res.data.parentETime).getTime()
        this.pickerOptionsTaskSt.disabledDate = function (time) {
          return time.getTime() > binStartF || time.getTime() < binStartTime
        }
        this.pickerOptionsTaskEt.disabledDate = function (time) {
          return time.getTime() > binEndF || time.getTime() < binEndTime
        }
      })
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
              that.queryMyTaskView()
            } else {
              that.loadingEdit = false
            }
          })
        }
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
            // if (that.fileListEdit.length === 5) {
            //   that.fileDisabled = true
            // } else {
            //   that.fileDisabled = false
            // }
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
          message: '内容不能为空'
        })
      }
    },
    queryMyProjectList () {
      var that = this
      this.ajax('/myProject/myProjectList', that.myProjectListPayload).then(res => {
        // this.log('选择所属项目:', res)
        if (res.code === 200) {
          that.projectList = res.data
        }
      })
    },
    testValue9: function () {
      this.log('taskFormvalue9:', this.taskForm.value9)
      this.log('defImplementer:', this.defImplementer)
    },
    // 悬浮窗管理函数
    dialogManage: function (target, allDiaHide) {
      var that = this
      // allDiaHide为false
      if (!allDiaHide) {
        if (that[target]) {
          for (var i = 0; i < that.diaManageArr.length; i++) {
            if (that.diaManageArr[i] !== target) {
              that[that.diaManageArr[i]] = false
            }
          }
        }
      } else if (allDiaHide) {
        // allDiaHide为true (即:所有悬浮窗隐藏)
        for (var t = 0; t < that.diaManageArr.length; t++) {
          that[that.diaManageArr[t]] = false
        }
      }
    },
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
    // 伸缩框管理函数
    transitionManage: function (target, allTranHide) {
      var that = this
      if (!allTranHide) {
        if (that[target]) {
          for (var i = 0; i < that.tranManageArr.length; i++) {
            if (that.tranManageArr[i] !== target) {
              that[that.tranManageArr[i]] = 0
            }
          }
        }
      } else if (allTranHide) {
        // allDiaHide为true (即:所有悬浮窗隐藏)
        for (var t = 0; t < that.tranManageArr.length; t++) {
          that[that.tranManageArr[t]] = 0
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
    // 设置任务级别
    selectLevel: function (e) {
      var obj = e.currentTarget
      this.taskLevelLeft = $(obj).offset().left - 165
      this.taskLevelTop = $(obj).offset().top + 32
      this.taskLevelHeight = 46
      // 其它悬浮窗为隐藏状态
      this.dialogManage('', true)
    },
    selectLevel2: function (e) {
      var obj = e.currentTarget
      this.taskLevelLeft2 = $(obj).offset().left - 165
      this.taskLevelTop2 = $(obj).offset().top + 32
      this.taskLevelHeight2 = 46
      // 其它悬浮窗为隐藏状态
      this.dialogManage2('', true)
    },
    // 鼠标离开 任务级别 div关闭
    rateMouseLeave: function () {
      // this.alert(1)
      this.taskLevelHeight = 0
    },
    rateMouseLeave2: function () {
      // this.alert(1)
      this.taskLevelHeight2 = 0
    },
    // 获取当前时间
    getNowFormartTime: function () {
      var dateObj = new Date()
      var year = dateObj.getFullYear()
      var month = dateObj.getMonth() + 1
      var date = dateObj.getDate()
      var h = dateObj.getHours()
      var m = dateObj.getMinutes()
      if (month < 10) {
        month = '0' + month
      }
      if (date < 10) {
        date = '0' + date
      }
      if (h < 10) {
        h = '0' + h
      }
      if (m < 10) {
        m = '0' + m
      }
      return year + '-' + month + '-' + date + ' ' + h + ':' + m + ':' + '00'
    },
    // 获取所属项目
    getProBelong: function () {
      var that = this
      that.ajax('/community/getAllProject', {}).then(res => {
        if (res.code === 200) {
          this.log('getAllProject:', res)
          this.projectBelong = res.data[0].projectUID
          this.options = res.data
          that.getProjectTime(that.projectBelong)
        }
      })
    },
    getProjectTime: function (id) {
      var that = this
      that.ajax('/myProject/getProjectDetail', {projectUID: id}).then(res => {
        if (res.code === 200) {
          console.log('projectBelong', res)
          var st = res.data.startDate.split(' ')[0] + ' 00:00:00'
          var et = res.data.endDate
          var sT = new Date(st)
          var eT = new Date(et)
          that.disabledStarTime2 = sT.getTime()
          that.disabledEndTime2 = eT.getTime()
          that.pickerOptionsPlan.disabledDate = function (time) {
            return time.getTime() < that.disabledStarTime2 || time.getTime() > that.disabledEndTime2
          }
          that.selDateStart = res.data.startDate
          that.selDateEnd = res.data.endDate
          // that.log('delPlanOrTask:', disabledStarTime)
          // that.log('delPlanOrTask22:', disabledEndTime)
        } else {
          that.$message({
            message: res.msg
          })
        }
      })
    },
    // 更多
    moreClick: function () {
      var that = this
      if (that.moreText === '更多') {
        that.moreText = '收起'
        this.moreIcon = 'el-icon-arrow-up'
        this.taskRelationShow = true
      } else {
        that.moreText = '更多'
        this.moreIcon = 'el-icon-arrow-down'
        this.taskRelationShow = false
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
    // 测试异步请求走状态
    testAjaxVuex: function () {
      // that.$store.commit('callService', that.testAjaxVuexData)
    },
    // 跳转至nTest
    routerTest: function () {
      // this.$router.push('/Test')
    },
    // 选择任务负责人
    selectUser: function (e) {
      // 时间弹窗 与 人员选择弹窗 不共存  selectUserDiaShow selectDateDiaShow
      // this.selectDateDiaShow = false
      var obj = e.currentTarget
      this.selectUserDiaShow = true
      this.selectUserLeft = $(obj).offset().left - 400
      this.selectUserTop = $(obj).offset().top - 100
      // 所有的伸缩窗 隐藏
      this.transitionManage('', true)
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
    // 设置默认时间
    setDefaultTime: function () {
      // 获取当前时间
      this.startTimeFirst = this.getNowFormartTime()
      var date = new Date(this.startTimeFirst)
      var nextDayStamp = date.getTime() + (24 * 60 * 60 * 1000)
      var nextDateObj = new Date(nextDayStamp)
      var nextDayYear = nextDateObj.getFullYear()
      var nextDayMonth = nextDateObj.getMonth() + 1
      var nextDayDate = nextDateObj.getDate()
      var nextDayHours = nextDateObj.getHours()
      var nextDayMinutes = nextDateObj.getMinutes()
      // this.log(456)
      if (nextDayMonth < 10) {
        nextDayMonth = '0' + nextDayMonth
      }
      if (nextDayDate < 10) {
        nextDayDate = '0' + nextDayDate
      }
      if (nextDayHours < 10) {
        nextDayHours = '0' + nextDayHours
      }
      if (nextDayMinutes < 10) {
        nextDayMinutes = '0' + nextDayMinutes
      }
      this.endTimeFirst = nextDayYear + '-' + nextDayMonth + '-' + nextDayDate + ' ' + nextDayHours + ':' + nextDayMinutes + ':00'
      // this.selDateStart = this.startTimeFirst
      // this.selDateEnd = this.endTimeFirst
    },
    // 选择时间
    selectDate: function (e) {
      // 所有的伸缩窗 隐藏
      this.transitionManage('', true)
      if (e) {
        var obj = e.currentTarget
        this.selectDateDiaShow = true
        this.selectDateLeft = $(obj).offset().left - 420
        this.selectDateTop = $(obj).offset().top - 102
      }
      // this.log(123)
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
    // 选择时间取消
    selectDateCancel: function () {
      this.selectDateDiaShow = false
    },
    selectDateCancel2: function () {
      this.selectDateDiaShow2 = false
    },
    // 选择时间确定
    selectDateOk: function () {
      this.selectDateDiaShow = false
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
    inputFocus: function () {
      var that = this
      // this.taskRelationShow = true
      if (that.moreText === '更多') {
        that.moreText = '收起'
        this.moreIcon = 'el-icon-arrow-up'
        this.taskRelationShow = true
      } else {
        that.moreText = '更多'
        this.moreIcon = 'el-icon-arrow-down'
        this.taskRelationShow = false
      }
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
    iptBlur: function () {
      // this.taskRelationShow = false
    },
    iptBlur2: function () {
      // this.taskRelationShow = false
    },
    handleClick (tab, event) {
      console.log(tab, event)
    },
    // 创建任务 提交
    depSub: function () {
      var that = this
      that.loading3 = true
      var fileStr = ''
      for (var j = 0; j < this.fileList.length; j++) {
        if (j === that.fileList.length - 1) {
          fileStr = fileStr + that.fileList[j].attachmentId
        } else {
          fileStr = fileStr + that.fileList[j].attachmentId + ','
        }
      }
      // 如果有任务名
      if (that.taskNameText) {
        // value9有值
        var selectUserStr = ''
        if (that.taskForm.value9.length > 0) {
          for (var i = 0; i < that.taskForm.value9.length; i++) {
            if (i === 0) {
              selectUserStr = that.taskForm.value9[0]
            } else {
              selectUserStr = selectUserStr + '_' + that.taskForm.value9[i]
            }
          }
        } else {
          // value9没有值，取默认
          selectUserStr = that.defImplementer.name + '-' + that.defImplementer.id
        }
        that.CommunityTaskPayload.attachmentId = fileStr
        that.CommunityTaskPayload.pStr = selectUserStr
        that.CommunityTaskPayload.jobName = that.taskNameText
        that.CommunityTaskPayload.startTime = that.selDateStart
        that.CommunityTaskPayload.endTime = that.selDateEnd
        that.CommunityTaskPayload.projectUID = that.projectBelong
        that.CommunityTaskPayload.description = that.taskIntro
        that.ajax('/community/addCommunityTask', that.CommunityTaskPayload).then(res => {
          if (res.code === 200) {
            that.isRecall = that.isRecall + 1
            that.$message({
              message: '任务创建成功',
              type: 'success'
            })
            that.queryMyTaskView()
            // 清空发动态的表单
            that.clearDynamicsForm()
          } else {
            that.$message({
              message: res.msg,
              type: 'warning'
            })
          }
          that.loading3 = false
        })
      } else {
        that.$message({
          message: '请填写任务名',
          type: 'warning'
        })
        that.loading3 = false
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
            that.queryMyTaskView()
            that.getTaskChildList(that.taskId2)
            // 清空发动态的表单
            that.getHistoryList()
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
    // 派任务（发动态）清空表单
    clearDynamicsForm: function () {
      this.taskNameText = ''
      this.fileList = []
      this.CommunityTaskPayload.jobName = ''
      this.selDateStart = this.startTimeFirst
      this.CommunityTaskPayload.startTime = this.startTimeFirst
      this.selDateEnd = this.endTimeFirst
      this.CommunityTaskPayload.endTime = this.endTimeFirst
      this.taskIntro = ''
      this.CommunityTaskPayload.description = ''
      this.attachmentId = ''
      this.CommunityTaskPayload.attachmentId = ''
      this.taskForm.value9 = []
      this.levelValue = 3
      $('#myfile').val('')
      this.getProBelong()
      this.moreClick()
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
    remoteMethod (query) {
      var that = this
      this.log('query:', query)
      if (query !== '') {
        this.loading2 = true
        that.moreUserSelectPayload.projectManager = query
        this.ajax('/general/autoCompleteNames', that.moreUserSelectPayload).then(res => {
          that.log('autoCompleteNames:', res)
          if (res.code === 200) {
            that.options4 = res.msg
            this.loading2 = false
          }
        })
      } else {
        this.options4 = []
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
    // 点击确定
    selectUserClick: function () {
      this.selectUserDiaShow = false
      this.log(this.taskForm.value9)
    },
    selectUserClick2: function () {
      this.selectUserDiaShow2 = false
      this.log(this.taskForm2.value9)
    },
    // 监听文件选择
    fileChange: function (file) {
      var that = this
      var obj = file.currentTarget
      var isfile = $(obj).val()
      if (isfile) {
        that.addMarkInfo()
      }
      this.log('change了', file)
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
    // 文件上传
    addMarkInfo () {
      var that = this
      var url = that.$store.state.baseServiceUrl
      var formData = new FormData($('#uploadFile')[0])
      that.formData = formData
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
            var obj = {
              attachmentId: data.data.attachmentId,
              fileName: data.data.showName
            }
            that.fileList.push(obj)
            that.fileListLen = that.fileList.length
            // that.attachmentId = data.data.attachmentId
            that.log('attachmentId:', that.fileList)
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
    // 抽屉
    getFileName: function () {
      var that = this
      var filePath = $('#myfile2').val()
      var arr = filePath.split('\\')
      var fileName = arr[arr.length - 1]
      $('.showFileName').html(fileName)
      console.log('change')
      if (filePath) {
        that.addMarkInfo4()
      }
    },
    // 沟通
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
    getTaskChildList: function (id) {
      var that = this
      this.ajax('/myTask/myChildTask', {taskId: id}).then(res => {
        if (res.code === 200) {
          that.log('myChildTask:', res)
          that.childTaskList = res.data
        }
      })
    },
    toDetail: function (id) {
      var that = this
      that.getTaskChildList(id)
      that.taskId2 = id
      that.taskComment.uid = id
      that.taskHistoryList.uid = id
      that.value4 = true
      that.toShowDevided = false
      that.getCommicateCont()
      that.getHistoryList()
      that.ajax('/myTask/queryTaskDetail', {taskId: that.taskId2}).then(res => {
        if (res.code === 200) {
          that.taskBasicMsg = res.data
          that.selDateStart2 = res.data.taskStartDate
          that.selDateEnd2 = res.data.taskFinishDate
          that.CommunityTaskPayload2.projectUID = res.data.projectUID
          that.CommunityTaskPayload2.uid = res.data.uid
          that.rid2 = res.data.uid
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
          // if (that.isImage(res.data.showName)) {
          //   res.data.isImg = true
          // } else {
          //   res.data.isImg = false
          // }
          // that.downurl = that.$store.state.baseServiceUrl + '/file/downloadFile?realUrl=' + res.data.realUrl + '&showName=' + res.data.showName
          that.resetScro()
        }
      })
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
            that.queryMyTaskView()
            that.getHistoryList()
          }
        }).catch(() => {
          // that.loading = false
        })
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
            that.getTaskChildList(that.taskId2)
            that.queryMyTaskView()
            that.getHistoryList()
          }
        }).catch(() => {
          // that.loading = false
        })
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
            that.toDetail(id)
            that.queryMyTaskView()
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
          that.queryMyTaskView()
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
          that.queryMyTaskView()
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
    querySearchAsync (queryString, cb) {
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
    handleSelect (item) {
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
            that.queryMyTaskView()
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
      this.fileShowUrl = url
    },
    showImagePreCom: function (url) {
      if (url) {
        this.commentPreviewUrl = url
        this.dialogShowImg = true
      }
    },
    resetScro: function () {
      $('.ivu-drawer-body').scrollTop(0)
    },
    addMarkInfo2 () {
      var that = this
      that.loading8 = true
      console.log('comment', that.fileListComment)
      var fileStr = ''
      for (var j = 0; j < this.fileListComment.length; j++) {
        if (j === that.fileListComment.length - 1) {
          fileStr = fileStr + that.fileListComment[j].attachmentId
        } else {
          fileStr = fileStr + that.fileListComment[j].attachmentId + ','
        }
      }
      that.ajax('/comment/addComment', {content: that.commitComent, attachmentId: fileStr, contentId: that.taskId2, parentCommentId: '11'}).then(res => {
        if (res.code === 200) {
          that.log('myTaskView:', res)
          that.getCommicateCont()
          that.fileListComment = []
          that.commitComent = ''
          $('.showFileName').html('')
          $('#myfile2').val('')
          that.loading8 = false
        }
      })
    },
    queryMyTaskView () {
      var that = this
      this.ajax('/myTask/myTaskView', that.myTaskViewPayload).then(res => {
        if (res.code === 200) {
          that.log('myTaskView:', res)
          that.myTaskList = res.data.list
          that.totalRowNum = res.data.totalRow
        }
      })
    },
    pageNumChenge (e) {
      console.log('eeeeeeee', e)
      this.myTaskViewPayload.pageNum = e
      this.queryMyTaskView()
    },
    myTaskStyleChange: function (e) {
      console.log('eeeee', e)
      var that = this
      that.myTaskViewPayload.pageNum = 1
      that.myTaskViewPayload.taskSource = e
      that.queryMyTaskView()
    },
    taskTypeState: function (e) {
      var that = this
      that.myTaskViewPayload.pageNum = 1
      that.myTaskViewPayload.sType = e
      that.queryMyTaskView()
    },
    taskOfProject: function (e) {
      var that = this
      that.myTaskViewPayload.pageNum = 1
      that.myTaskViewPayload.projectName = e
      that.queryMyTaskView()
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
    }
  }
}
</script>

<style scoped>
  /*div img{*/
    /*width: 100%;*/
    /*display: block;*/
  /*}*/
  .MyDep{
    position: relative;
  }
  .header{
    height: auto !important;
    padding: 10px;
    box-shadow: 0px -10px 30px #000;
    z-index: 10;
  }
  .headerCntBox{
    display: flex;
    justify-content: space-between;
  }
  .headerCntLeft{
    display: flex;
  }
  .logoBox{
    width: 150px;
  }
  .groupName{
    line-height: 30px;
  }
  .aside{
    width: 200px !important;
    height: 800px;
    color: #fff;
    background-color: #005999;
  }
  .el-main-box{
    display: flex;
  }
  .el-main-left{
    flex-grow: 1;
  }
  .el-main-right{
    width: 262px;
    box-sizing: border-box;
    padding: 20px;
    padding-left: 40px;
    padding-right: 10px;
  }
  .paiTaskTitTab{
    display: flex;
    background-color: #f5f8fa;
  }
  .paiTask{
    font-size: 16px;
    margin-right: 15px;
  }
  .paiTask.active{
    font-weight: bold;
  }
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
  .relationHeader{
    display: flex;
    padding: 10px;
    border-bottom: 1px solid #a9b8bf;
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
  .depTaskLevel{
    width: 200px;
    height: 0px;
    text-align: center;
    position: fixed;
    top: 0;
    left: 0;
    overflow: hidden;
    z-index: 300;
    margin-top: -1px;
    background-color: #fff;
    transition: height 0.3s;
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
    width: 190px;
    display: flex;
  }
  .selectMoreInfo{
    line-height: 30px;
  }
  .submitBtn{
    margin-left: 15px;
  }
  .submitBtn div{
    width: 50px;
    padding: 6px;
    color: #fff;
    border-radius: 4px;
    text-align: center;
    color: #adb8c0;
    background-color: #e7eef3;
  }

  /*置顶公告*/
  .gonggaoBox{
    margin-top: 25px;
    font-size: 12px;
    padding: 20px;
    color: #ccc;
    border: 1px dashed #ddd;
  }
  .userOnline{
    display: flex;
    justify-content: space-between;
    margin-top: 40px;
  }
  .OnlineText{
    font-size: 14px;
  }
  .OnlineNum{
    color: #ddd;
    font-size: 12px;
  }
  .userOnlineList{
    margin-top: 20px;
    display: flex;
    flex-wrap:wrap;
  }
  .userOnlineItem{
    width: 30px;
    height: 30px;
    margin: 2px;
    background-color: #42b983;
    border-radius: 15px;
    overflow: hidden;
    text-align: center;
    line-height: 30px;
    color: #fff;
    font-size: 12px;
  }
  /**/
  .selectUserDialog{
    width: 300px;
    padding: 0px 0px 20px 0px;
    background-color: #fff;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 200;
    border-radius: 6px;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,.2);
  }
  .selectUserDialog2{
    width: 300px;
    padding: 0px 0px 20px 0px;
    background-color: #fff;
    position: absolute;
    z-index: 200;
    border-radius: 6px;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,.2);
  }
  .selectUserIpt{
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
    background-color: #f5f8fa;
  }
  .selectUserBtn{
    text-align: center;
    margin-top: 20px;
  }
  /**/
  .selectDateDialog{
    _width: 300px;
    padding: 20px 20px 20px 20px;
    background-color: #fff;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 200;
    border-radius: 6px;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,.2);
  }
  .selectDateDialog2{
    _width: 300px;
    padding: 20px 20px 20px 20px;
    background-color: #fff;
    position: absolute;
    z-index: 200;
    border-radius: 6px;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,.2);
  }
  .selectDateBox{
    _display: flex;
  }
  .selectDateItem{
    margin-top: 20px;
  }
  .searchItem{
    margin: 0 20px;
    height: 50px;
    line-height: 50px;
    background-color: #f5f5f8;
  }
  .taskList{
    height: 100px;
    width: 100%;
    display: flex;
    padding: 20px;
    justify-content: space-between;
    border-bottom: 1px dashed #ddd;
    position: relative;
    overflow: hidden;
  }
  /*.taskList2{*/
    /*height: 80px;*/
    /*width: 100%;*/
    /*display: flex;*/
    /*padding: 10px 20px 10px 60px;*/
    /*justify-content: space-between;*/
    /*border-top: 1px dashed #ddd;*/
    /*position: relative;*/
    /*overflow: hidden;*/
  /*}*/
  .taskList:hover,.taskList2:hover{
    background-color: #f5f8fa;
  }
  .taskItem{
    height: 100%;
    width: 50%;
    border-left: 6px solid #409EFF;
    /*display: flex;*/
    padding-left: 20px;
  }
 .taskName{
   padding: 10px;
   font-size: 14px;
   color: #888;
  }
  .taskMsg{
    color: #888;
    width: 50%;
    text-align: right;
    padding-right: 40px;
    font-size: 14px;
  }
  .taskTag0{
    height: 20px;
    text-align: center;
    width: 100px;
    font-size: 12px;
    background-color: #ffc107;
    transform: rotate(45deg);
    position: absolute;
    top: 8px;
    right: -32px;
    color: #fff;
  }
  .taskTag1{
    height: 20px;
    text-align: center;
    width: 100px;
    font-size: 12px;
    background-color: #27CF97;
    transform: rotate(45deg);
    position: absolute;
    top: 8px;
    right: -32px;
    color: #fff;
  }
  .taskTag2{
    height: 20px;
    text-align: center;
    width: 100px;
    font-size: 12px;
    background-color: #3a8ee6;
    transform: rotate(45deg);
    position: absolute;
    top: 8px;
    right: -32px;
    color: #fff;
  }
  .taskTag4{
    height: 20px;
    text-align: center;
    width: 100px;
    font-size: 12px;
    background-color: #ccc;
    transform: rotate(45deg);
    position: absolute;
    top: 8px;
    right: -32px;
    color: #fff;
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
  .taskName2{
    font-size: 16px;
    font-family: '黑体';
  }
  .taskDetail{
    font-size: 14px;
    margin-top: 10px;
    text-indent: 2em;
    display: -webkit-box;
    color: #777;
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
  .taskMsg2{
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
  .cannetProject div img{
    float: left;
    margin-top: 15px;
    margin-right: 10px;
  }
  .cannetProjectFile div img{
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
  /*.showFileName{*/
    /*float: right;*/
    /*margin-left: 10px;*/
  /*}*/
  /*.showFileName2,.showFileNameTran{*/
    /*float: right;*/
    /*margin-left: 10px;*/
    /*margin-top: 10px;*/
    /*font-size: 12px;*/
  /*}*/
  .time{
    font-size: 14px;
    font-weight: bold;
  }
  .content{
    color: #777;
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
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
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
