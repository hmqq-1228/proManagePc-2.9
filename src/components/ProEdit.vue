<template>
  <div class="ProEdit">
    <div v-show="false">{{getStoreProId}}</div>
    <!--面包屑-->
    <div style="padding: 5px;padding-top:0;border-bottom: 1px solid #eee; color: #999;">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-if="router.id" v-for="(router, index) in setRouterNameList" v-bind:key="index"><span style="display: inline-block;font-size: 12px;" @click="breadcrumbGetPlan(router.id, index)">{{router.name}}</span></el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="hello" style="margin-top: 15px;">
      <!--content 标题 简介 等-->
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
              <div class="myMsg">
                <div style="color: #28558c; font-size: 20px; margin-top: -6px"><Icon type="md-download" /></div>
                <div style="margin-left: 10px; color: #28558c;">附件:
                  <Icon v-bind:title="fileItem.showName" v-for="fileItem in proDetailMsg.fileList" :key="fileItem.previewUrl" style="font-size: 20px; " type="ios-document-outline" />
                </div>
              </div>
              <div class="editHistoryBtn" style="margin-top: 15px;">
                <Button type="primary" size="small" style="margin-right: 15px;" v-on:click="proBaseEditClick()">编辑</Button>
                <Button type="primary" size="small" v-on:click="openHisDrawer">历史记录</Button>
              </div>
            </div>
            <div class="imgBox" v-if="proDetailMsg.state === '0'"><img src="../../static/img/unstart.png" alt=""></div>
            <div class="imgBox" v-if="proDetailMsg.state === '2'"><img src="../../static/img/doing.png" alt=""></div>
            <div class="imgBox" v-if="proDetailMsg.state === '3'"><img src="../../static/img/finish.png" alt=""></div>
          </div>
        </div>
        <div class="memList">
          <div class="memName"><Icon size="30" type="ios-person-outline" /></div>
          <div class="memBox">
            <div v-if="memberList.length > 0" v-for="member in memberList" v-bind:key="member.userName">{{member.userName}}</div>
            <div class="moreBtn" v-on:click="moreMemberClick()"><Button>更多 / 编辑</Button></div>
          </div>
        </div>
        <!-- 一级计划 项目计划 start -->
        <div class="planList">
          <div class="planName">项<br />目<br />计<br />划</div>
          <div class="planBox" style="position: relative;">
            <!--v-on:click="addNode(firstPlanId)"-->
            <div v-if="planList.length > 0" v-bind:class="activeId === plan.id ? 'active' : ''" v-for="plan in planList" v-bind:key="plan.id" @click="selectProject(plan.id,$event)">{{plan.name}}</div>
            <Button style="margin-top: 16px; margin-left: 20px; position: absolute; right: 10px;" size="small" type="primary" v-on:click="FistLevelPlanDetail()">添加 / 编辑</Button>
          </div>
          <!--<div class="planBox2" v-if="planList.length === 0">暂无子计划</div>-->
        </div>
        <!-- 一级项目计划 end -->
      </div>
      <div class="devide">
        <div class="proTreeHeader">
          <div>项目详情</div>
          <div v-if="planList.length > 0"><Button size="small" type="primary" v-on:click="addNode(activeId)">+ 计划 / 任务</Button></div>
        </div>
      </div>
      <!--项目计划树 start-->
      <!--<div class="block">-->
        <!--<el-tree-->
          <!--:data="data5"-->
          <!--:props="defaultTreeProps"-->
          <!--node-key="id"-->
          <!--@node-expand="getNodeMsg($event)"-->
          <!--:expand-on-click-node="false">-->
          <!--<span class="custom-tree-node" slot-scope="{ node, data }">-->
            <!--<span class="dataName" @click="showDetailPage(data)">{{data.name}}</span>-->
            <!--<span class="proMsg">-->
              <!--<span class="treeName">-->
                <!--<span v-if="data.type === '2'">-->
                  <!--<span style="float: left"><img style="width: 16px;" src="../../static/img/my.png" alt=""></span>-->
                  <!--<span style="float: left;margin-left: 16px;">{{data.userName}}</span>-->
                <!--</span>-->
              <!--</span>-->
              <!--<span class="treeState">-->
                 <!--<span v-if="data.type === '2'">-->
                  <!--<span style="float: left"><img style="width: 16px;" src="../../static/img/noted.png" alt=""></span>-->
                  <!--<span v-if="data.status === '0'" style="float: left;margin-left: 16px;color: #ffd04b;">未确认</span>-->
                  <!--<span v-if="data.status === '1'" style="float: left;margin-left: 16px;color: #53b5ff;">进行中</span>-->
                  <!--<span v-if="data.status === '2'" style="float: left;margin-left: 16px;color: #27CF97;">已完成</span>-->
                 <!--</span>-->
              <!--</span>-->
              <!--<span class="treeTime">-->
                <!--<span style="float: left"><img style="width: 16px;" src="../../static/img/data.png" alt=""></span>-->
                <!--<span style="float: left;margin-left: 16px;">{{data.start}} - {{data.finish}}</span>-->
              <!--</span>-->
              <!--<span class="treeTime">-->
                <!--<Dropdown @on-click="moreSelectOptions($event, data.id)">-->
                  <!--<a href="javascript:void(0)">下拉菜单<Icon type="ios-arrow-down"></Icon></a>-->
                  <!--<DropdownMenu slot="list">-->
                    <!--<DropdownItem name="add">添加</DropdownItem>-->
                    <!--<DropdownItem name="del">删除</DropdownItem>-->
                    <!--<DropdownItem name="edit">编辑</DropdownItem>-->
                  <!--</DropdownMenu>-->
                <!--</Dropdown>-->
              <!--</span>-->
            <!--</span>-->
          <!--</span>-->
        <!--</el-tree>-->
      <!--</div>-->
      <!--项目计划树 end-->
      <!--项目计划树 老版本 start-->
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
              <span class="treeTime">
                <Dropdown @on-click="moreSelectOptions($event, data.id, data.type, data)">
                  <a href="javascript:void(0)">更多操作<Icon type="ios-arrow-down"></Icon></a>
                  <DropdownMenu slot="list">
                    <DropdownItem name="add">添加</DropdownItem>
                    <DropdownItem name="del">删除</DropdownItem>
                    <DropdownItem name="edit">编辑</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </span>
            </span>
          </span>
        </el-tree>
      </div>
      <!--项目计划树 老版本 end-->
      <!--新增 抽屉 成员管理 ks-->
      <Drawer title="成员管理" width="740" :closable="false" v-model="DrawerMember">
        <!--<Button v-on:click="test()">TEST</Button>-->
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
            <div class="tblTitItem">查看</div>
            <div class="tblTitItem">编辑</div>
            <div class="tblTitItem">清空</div>
          </div>
          <div class="memTblList">
            <div class="memTblListItem" v-for="mem in proGrpMemList" :key="mem.userID">
              <div class="memListItem">{{mem.peopleRoleText}}</div>
              <div class="memListItem">{{mem.userName}}</div>
              <div class="memListItem"><Checkbox v-bind:value="true" @on-change="checkChangeSee($event, mem.id, mem.role)"></Checkbox></div>
              <div class="memListItem"><Checkbox v-bind:value="mem.role === '2'" @on-change="checkBoxChangeEdit($event, mem.id, mem.role)"></Checkbox></div>
              <div class="memListItem" v-on:click="delMember(mem.id)">x</div>
            </div>
          </div>
        </div>
        <!--组织架构 start-->
        <div v-if="organizationalShow" style="font-size: 16px; margin-bottom: 10px; margin-top: 20px;">组织架构</div>
        <!--organizationalShow-->
        <div class="organizationalBox" v-if="organizationalShow">
          <div>
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
        <!--<div class="caozuo">-->
          <!--<div class="el-icon-d-arrow-right" @click="addMenber()"></div>-->
        <!--</div>-->
        <!--组织架构 end-->
      </Drawer>
      <!--新增 抽屉 成员管理 js-->
      <!--新增 抽屉 编辑基本信息 修改基本信息 start-->
      <Drawer title="基本信息" width="740" :closable="false" v-model="DrawerBaseEdit">
        <div>
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
            <FormItem label="项目名称" prop="proName">
              <Input v-model="formValidate.proName" placeholder="Enter your name" />
            </FormItem>
            <FormItem label="项目类型" prop="proType">
              <Select v-model="formValidate.proType" placeholder="Select your city">
                <Option value="集团战略">集团战略</Option>
                <Option value="公司项目">公司项目</Option>
                <Option value="部门项目">部门项目</Option>
                <Option value="小组项目">小组项目</Option>
                <Option value="个人项目">个人项目</Option>
                <Option value="产品研发">产品研发</Option>
              </Select>
            </FormItem>
            <FormItem label="负责人" prop="proManager">
              <el-autocomplete style="width: 100%"
                               v-model="formValidate.proManager"
                               :fetch-suggestions="querySearchAsync"
                               placeholder="请输入项目负责人姓名"
                               :trigger-on-focus="false"
                               @select="handleSelect"
              ></el-autocomplete>
            </FormItem>
            <FormItem label="开始时间" prop="startDate">
              <DatePicker type="datetime" v-model="formValidate.startDate" @on-change="startDateChange" placeholder="Select date and time" style="width: 100%"></DatePicker>
            </FormItem>
            <FormItem label="结束时间" prop="endDate">
              <DatePicker type="datetime" v-model="formValidate.endDate" @on-change="endDateChange" placeholder="Select date and time" style="width: 100%"></DatePicker>
            </FormItem>
            <FormItem label="项目简介" prop="desc">
              <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..." />
            </FormItem>
            <FormItem>
              <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
              <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
            </FormItem>
          </Form>
        </div>
      </Drawer>
      <!--新增 抽屉 编辑基本信息 修改基本信息 end-->
      <!--新增 抽屉 查看历史记录 start-->
      <Drawer title="历史记录" width="740" :closable="false" v-model="DrawerHistory">
        <div class="el-textarea" v-loading="loadingRe">
          <!--enctype="multipart/form-data"-->
          <form id="uploadFile">
            <textarea name="content" class="el-textarea__inner" id="textArea" type="text" v-model="commitComent"></textarea>
            <div class="cannetProject2">
              <div style="display: inline-block">
                <!--<img src="../../static/img/fujian.png" alt="">-->
                <component v-bind:is="FileUploadComp" fileFormId="history" v-bind:clearInfo="IsClear" v-on:FileInfoEmit="GetFileInfo"></component>
                <!--<a href="javascript:;" class="file" @change="getFileName">选择文件-->
                  <!--<input type="file" name="myfile">-->
                <!--</a>-->
                <!--<input type="hidden" name="projectUID" v-bind:value="proId">-->
                <!--<input type="hidden" name="rtype" v-bind:value="3">-->
                <!--<span class="showFileName"></span>-->
              </div>
              <div><i-button type="info" v-bind:disabled="butnDisabled" @click="addMarkInfo()">回复</i-button></div>
            </div>
          </form>
        </div>
        <!--操作记录-->
        <div class="discription lis" style="margin-top: 15px;">
          <!--<h3>历史记录</h3>-->
          <!--<div class="add" @click="addRemark()"><img src="../../static/img/msg.png" alt="">添加评论</div>-->
          <div class="logBox">
            <div v-bind:key="logs.index" class="TimeLine" style="position: relative;" v-for="(logs, index) in taskLogs">
              <div class="quan">{{index+1}}</div>
              <div class="timeDate">{{logs.oTime}}</div>
              <div class="timeCont">{{logs.oTitle?logs.oTitle:''}}<span class="listColor" v-if="logs.oName">{{' 【' + logs.oName + '】, '}}</span>{{logs.oContent}}
                <div class="contBoxContentWrap">
                  <div class="contBoxContent" v-if="logs.comment">评论：{{logs.comment}}</div>
                  <div class="contBoxContent" v-if="logs.uploads && logs.uploads.length > 0" v-for="(file, index2) in logs.uploads" v-bind:key="index2">
                    <span v-if="file.isImage" @click="showBigImage(file.previewUrl)" class="filepre">预览</span>
                    <a v-bind:download="file.showName" v-bind:href="file.downloadUrl">下载：{{file.showName}}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <el-row style="margin-top: 30px;" v-if="totalData > 10">
            <el-button icon="el-icon-plus" @click="getPageNum()" v-bind:disabled="notMore">加载更多</el-button>
          </el-row>
        </div>
      </Drawer>
      <!--新增 抽屉 查看历史记录 end-->
      <!--新增 抽屉 一级计划详情 start -->
      <Drawer title="一级计划 / 任务" width="740" :closable="false" v-model="FirstLevelTask">
        <div class="tableHeader">
          <div class="tableProTitle">项目名:{{proDetailMsg.projectName}}</div>
          <div class="tableProBtn" style="margin-bottom: 10px;">
            <Button type="primary" size="small" v-on:click="addNode(firstPlanId)">添加一级</Button>
          </div>
        </div>
        <el-table :data="FirstLevelPlanList" border style="width: 100%">
          <el-table-column prop="planName" label="计划/任务" width="280"></el-table-column>
          <el-table-column prop="planType" label="类型" width="70"></el-table-column>
          <el-table-column prop="planDateDur" label="时间" width="200"></el-table-column>
          <!--<el-table-column prop="planManager" label="责任人" width="120"></el-table-column>-->
          <!--<el-table-column prop="address" label="地址" width="300"></el-table-column>-->
          <!--<el-table-column prop="zip" label="邮编" width="120"></el-table-column>-->
          <el-table-column label="操作" width="140" fixed="right">
            <template slot-scope="scope">
              <el-button @click="planHandleClick(scope.row, 'edit')" type="text" size="small">编辑</el-button>
              <el-button @click="planHandleClick(scope.row, 'add')" type="text" size="small">添加</el-button>
              <el-button @click="planHandleClick(scope.row, 'del')" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--<div class="proTitle">这个是项目名</div>-->
        <!--<div class="planTable">-->
          <!--<div class="Plantable">-->

          <!--</div>-->
          <!--<div class="planTableItem">-->
            <!--<div class="planItemTitle">一级计划标题</div>-->
            <!--<div class="planItemType">计划</div>-->
            <!--<div class="planItemTime">2019-03-01 2019-03-20</div>-->
            <!--<div class="planItemManager">张三</div>-->
            <!--<div class="planItemUse">-->
              <!--<div class="planItemUseEdit"><el-button style="margin-left: 10px" size="mini" type="primary">编辑</el-button></div>-->
              <!--<div class="planItemUseDel"><el-button style="margin-left: 10px" size="mini" type="primary">删除</el-button></div>-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->
      </Drawer>
      <!--新增 抽屉 一级计划详情 end -->
      <!--新增 添加计划或者任务 start-->
      <!--bgcover开始 增加计划-->
      <Drawer class="drawerScroll" title="计划表单" :closable="false" width="40%" style="z-index: 1005" v-model="bgCoverShow">
        <!--<div class="bgCover" v-if="bgCoverShow">-->
        <div class="bgCoverCnt" v-loading="loading">
          <div class="colose" @click="onPlanTaskCancel()">&#935;</div>
          <div class="bgCoverTabs">
            <el-tabs v-model="activeNameBgCover" @tab-click="handleClickPlanTask">
              <el-tab-pane label="增加计划" name="first" v-bind:disabled="panshow">
                <!--计划form-->
                <div class="planTaskBox">
                  <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                    <el-form-item label="计划名称" prop="name" maxlength="100" width="100" style="margin-bottom: 30px;">
                      <el-input class="planNameIpt" v-model="form.name" style="width: 300px;" maxlength="20"></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间" prop="date1" style="margin-bottom: 30px;">
                      <el-col :span="20">
                        <el-date-picker type="datetime"
                        :picker-options="pickerOptionsPlan"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期"
                        v-model="form.date1" style="width: 300px;"
                        ></el-date-picker>
                      </el-col>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="date2" style="margin-bottom: 30px;">
                      <el-col :span="20">
                        <el-date-picker type="datetime"
                        :picker-options="pickerOptionsPlan"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期"
                        v-model="form.date2" style="width: 300px;"
                        ></el-date-picker>
                      </el-col>
                    </el-form-item>
                    <el-form-item label="计划描述" prop="description" maxlength="100" width="100" style="margin-bottom: 30px;">
                      <el-input class="planNameIpt" type="textarea" :rows="2" v-model="form.description" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="onPlanSubmit('form')">立即创建</el-button>
                      <el-button @click="onPlanTaskCancel()">取消</el-button>
                    </el-form-item>
                  </el-form>
                </div>
                <!---->
              </el-tab-pane>
              <el-tab-pane label="增加任务" name="second">
                <!--任务form-->
                <div class="planTaskBox" style="position: relative;padding-top: 0;">
                  <el-form ref="addTaskForm" :rules="taskRules" :model="addTaskForm" label-width="80px">
                    <el-form-item label="任务名称" prop="jobName" maxlength="100" width="100">
                      <el-input class="planNameIpt" v-model="addTaskForm.jobName" style="width: 300px;" v-bind:disabled="isDisabled" maxlength="20"></el-input>
                    </el-form-item>
                    <el-form-item label="任务级别" prop="jobLevel" maxlength="100" width="100">
                      <div class="ratestar" style="padding-top: 6px;">
                        <el-rate v-model="addTaskForm.jobLevel" v-on:change="rateChange($event)" v-bind:disabled="isDisabled"></el-rate>
                      </div>
                    </el-form-item>
                    <!--指派人员多选 多人指派-->
                    <el-form-item label="任务指派" prop="userArr" maxlength="100">
                      <el-col :span="24">
                        <el-select v-model="value9" multiple filterable remote style="width: 300px"
                        :reserve-keyword="false" placeholder="请输入关键词"
                        :remote-method="addTaskRemoteMethod" :loading="loading2">
                          <el-option v-for="item in addTaskOptions" :key="item.ID" :label="item.Name + ' (' + item.jName + ')'"
                          :value="item.Name + '(' + item.jName + ')' + '_' + item.ID">
                          </el-option>
                        </el-select>
                      </el-col>
                    </el-form-item>
                    <!--开始时间-->
                    <el-form-item label="开始时间" prop="date1">
                      <el-col :span="20">
                        <el-date-picker type="datetime"
                        :picker-options="pickerOptionsPlan"
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期"
                        v-model="addTaskForm.date1" style="width: 300px;"
                        >
                        </el-date-picker>
                      </el-col>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="date2">
                      <el-col :span="20">
                      <el-date-picker type="datetime"
                      :picker-options="pickerOptionsPlan"
                      format="yyyy-MM-dd HH:mm:ss"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期"
                      v-model="addTaskForm.date2" style="width: 300px;"
                      ></el-date-picker>
                      </el-col>
                    </el-form-item>
                    <el-form-item label="任务描述" prop="description" maxlength="100" width="100">
                      <el-input class="planNameIpt" v-bind:disabled="isDisabled" type="textarea" :rows="2" v-model="addTaskForm.description" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="添加附件" prop="description" maxlength="100" width="100">
                      <!--新建任务 引入附件组件 上传文件-->
                      <component v-bind:is="FileUploadComp" fileFormId="fileTest" v-bind:clearInfo="IsClear" v-on:FileInfoEmit="GetFileInfo"></component>
                    </el-form-item>
                    <!--<component v-bind:is="fileUploadComp" v-bind:clearInfo="isClear" v-on:FileInfoEmit="getFileInfo"></component>-->
                    <!--<el-form-item style="height: 40px;"></el-form-item>-->
                    <el-form-item>
                      <el-button type="primary" @click="onTaskSubmit('addTaskForm')">立即创建</el-button>
                      <el-button @click="onPlanTaskCancel()">取消</el-button>
                    </el-form-item>
                  </el-form>
                  <!---->
                  <!--<el-form-item label="添加附件" prop="description" maxlength="100" width="100">-->
                    <!--&lt;!&ndash;新建任务 引入附件组件 上传文件&ndash;&gt;-->
                    <!--<component v-bind:is="fileUploadComp" v-bind:clearInfo="isClear" v-on:FileInfoEmit="getFileInfo"></component>-->
                  <!--</el-form-item>-->
                  <!--<form id="mytaskForm" enctype="multipart/form-data" style="position: absolute;bottom:40px;padding-left: 12px;">-->
                    <!--<div style="font-size: 14px;color: #555;height: 30px;line-height: 30px;display: inline-block;">添加附件</div>&nbsp;&nbsp;-->
                    <!--<input type="file" id="myfile" name="myfile" placeholder="请选择文件" style="width: 200px;" />-->
                    <!--<input type="hidden" name="formId" v-bind:value="formId">-->
                    <!--<div style="padding-left: 70px;font-size: 12px;height: 16px;color: #409eff">{{upLoadName}}</div>-->
                  <!--</form>-->
                </div>
                <!---->
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <!--</div>-->
      </Drawer>
      <!--新增 添加计划或者任务 end-->
      <!--新增 抽屉 编辑计划 start-->
      <Drawer class="drawerScroll" title="编辑计划" :closable="false" width="40%" v-model="planEditShow">
        <!---->
        <div class="bgCoverTabs">
          <!--计划form-->
          <div class="planTaskBox">
            <el-form ref="modify" :model="detailform" :rules="planRules" label-width="80px">
              <el-form-item label="计划名称" prop="name" maxlength="100" width="100">
                <el-input class="planNameIpt" v-model="detailform.name" maxlength="20"></el-input>
              </el-form-item>
              <el-form-item label="开始时间" prop="date1">
                <el-col :span="11">
                  <el-date-picker type="date"
                                  format="yyyy-MM-dd"
                                  value-format="yyyy-MM-dd"
                                  placeholder="选择日期"
                                  v-model="detailform.date1"
                                  :picker-options="pickerOptionsPlanSt"
                  ></el-date-picker>
                </el-col>
              </el-form-item>
              <el-form-item label="结束时间" prop="date2">
                <el-col :span="11">
                  <el-date-picker type="date"
                                  format="yyyy-MM-dd"
                                  value-format="yyyy-MM-dd"
                                  placeholder="选择日期"
                                  v-model="detailform.date2"
                                  :picker-options="pickerOptionsPlanEt"
                  ></el-date-picker>
                </el-col>
              </el-form-item>
              <el-form-item label="计划描述" maxlength="100" width="100">
                <el-input class="planNameIpt" type="textarea" :rows="2" v-model="detailform.description"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="modifySub('modify')">保存</el-button>
                <el-button @click="planEditShow = false">关 闭</el-button>
              </el-form-item>
            </el-form>
          </div>
          <!---->
        </div>
      </Drawer>
      <!--新增 抽屉 编辑计划 end-->
      <!--新增 抽屉 任务详情 start-->
      <Drawer class="drawerScroll" :closable="false" width="750" v-model="value4">
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
          <div style="display: inline-block"><img src="../../static/img/fujian.png" alt=""><span>任务附件:</span></div>
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
        <!-- 任务分解 -->
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
                      :picker-options="pickerOptions3"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择开始时间">
                    </el-date-picker>
                  </div>
                  <!--<div style="margin-left: 10px; margin-right: 10px;">至</div>-->
                  <div class="selectDateItem">
                    <el-date-picker
                      v-model="selDateEnd2"
                      type="datetime"
                      :picker-options="pickerOptions3"
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
                  <!-- 任务分解 -->
                  <component v-bind:is="FileUploadComp" fileFormId="taskDecompose" v-bind:clearInfo="IsClear" v-on:FileDataEmit="GetFileInfo"></component>
                  <!--<form id="uploadFileDel" enctype="multipart/form-data">-->
                    <!--<input type="file" v-on:change="fileChange2" id="myfileDel" name="myfile" placeholder="请选择文件"/><br>-->
                  <!--</form>-->
                  <!--<div style="margin-top: 8px;">-->
                    <!--<span>已选 <span style="color: #409EFF;font-size: 16px;font-weight: bold;">{{fileList2.length}}</span> 个附件:</span>-->
                    <!--<span style="color: #888;" v-if="fileList2.length === 0">暂无附件</span>-->
                    <!--<span style="color: #409EFF" v-if="fileList2.length > 0" v-for="(file, index) in fileList2" v-bind:key="index"><span style="color: #333">{{index+1}}、</span>{{file.fileName}}, </span>-->
                  <!--</div>-->
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
        <!-- 任务分解 end -->
        <div class="cannetProject1">
          <div style="display: inline-block"><img src="../../static/img/taskList.png" alt=""><span>子任务<span style="color: #409EFF">({{childTaskList.length}})</span></span></div>
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
            <!--引入组件 详情 沟通-->
            <component v-bind:is="FileUploadComp" fileFormId="taskDetailConnect" v-bind:clearInfo="IsClear" v-on:FileDataEmit="GetFileInfo"></component>
            <!-- old code start -->
            <!--<div style="display: inline-block">-->
              <!--<form id="uploadFileRe" enctype="multipart/form-data" style="height: 40px;">-->
                <!--<img src="../../static/img/fujian.png" alt="">-->
                <!--<a href="javascript:;" class="file">选择文件-->
                  <!--<input type="file" name="myfile" id="myfile2" @change="getFileName">-->
                <!--</a>-->
                <!--<span class="showFileName"></span>-->
              <!--</form>-->
              <!--<div>-->
                <!--<span>已选 <span style="color: #409EFF;font-size: 16px;font-weight: bold;">{{fileListComment.length}}</span> 个附件:</span>-->
                <!--<span style="color: #888;" v-if="fileListComment.length === 0">暂无附件</span>-->
                <!--<span style="color: #409EFF" v-if="fileListComment.length > 0" v-for="(file, index) in fileListComment" v-bind:key="index"><span style="color: #333">{{index+1}}、</span>{{file.fileName}}, </span>-->
              <!--</div>-->
            <!--</div>-->
            <!-- old code end -->
            <div><i-button type="info" v-bind:disabled="butnDisabled" @click="taskDetailconnect()">回复</i-button></div>
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
      <!--修改任务 任务 修改-->
      <Drawer class="drawerScroll" title="修改任务" :closable="false" width="40%" v-model="modifyTaskVisible">
        <div class="bgCoverCnt2" v-loading="loadingEdit">
          <div class="colose" @click="modifyTaskVisible = false"><i class="el-icon-close"></i></div>
          <div class="bgCoverTabs">
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
                  <component v-bind:is="FileUploadComp" fileFormId="TaskModify" v-bind:clearInfo="IsClear" v-on:FileDataEmit="GetFileInfo"></component>
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
      </Drawer>
      <!--<div class="bgCoverModifyTask" v-if="modifyTaskVisible">-->
        <!--<div class="bgCoverCnt2" v-loading="loadingEdit">-->
          <!--<h2>修改任务</h2>-->
          <!--<div class="colose" @click="modifyTaskVisible = false"><i class="el-icon-close"></i></div>-->
          <!--<div class="bgCoverTabs">-->
            <!--&lt;!&ndash;修改任务form&ndash;&gt;-->
            <!--<div class="planTaskBox">-->
              <!--<el-form ref="modifyTask" :model="detailTaskform" :rules="modifyTaskRules" label-width="80px">-->
                <!--<el-form-item label="任务名称" prop="jobName" maxlength="100" width="100">-->
                  <!--<el-input class="planNameIpt" v-model="detailTaskform.jobName"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="任务级别" prop="jobLevel" maxlength="100" width="100">-->
                  <!--<div class="ratestar" style="padding-top: 6px;">-->
                    <!--<el-rate v-model="detailTaskform.jobLevel" v-on:change="levelChange($event)"></el-rate>-->
                  <!--</div>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="开始时间" prop="taskStartDate">-->
                  <!--<el-col :span="24">-->
                    <!--<el-date-picker style="width: 100%" type="datetime"-->
                                    <!--format="yyyy-MM-dd HH:mm:ss"-->
                                    <!--value-format="yyyy-MM-dd HH:mm:ss"-->
                                    <!--placeholder="选择日期"-->
                                    <!--v-model="detailTaskform.taskStartDate"-->
                                    <!--:picker-options="pickerOptionsTaskSt"-->
                    <!--&gt;</el-date-picker>-->
                  <!--</el-col>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="结束时间" prop="taskFinishDate">-->
                  <!--<el-col :span="24">-->
                    <!--&lt;!&ndash;value-format="yyyy-MM-dd HH:mm:ss"&ndash;&gt;-->
                    <!--&lt;!&ndash;format="yyyy-MM-dd HH:mm:ss"&ndash;&gt;-->
                    <!--<el-date-picker type="datetime" style="width: 100%"-->
                                    <!--format="yyyy-MM-dd HH:mm:ss"-->
                                    <!--value-format="yyyy-MM-dd HH:mm:ss"-->
                                    <!--placeholder="选择日期"-->
                                    <!--v-model="detailTaskform.taskFinishDate"-->
                                    <!--:picker-options="pickerOptionsTaskSt"-->
                    <!--&gt;</el-date-picker>-->
                  <!--</el-col>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="任务描述" maxlength="100" width="100">-->
                  <!--<el-input class="planNameIpt" type="textarea" style="resize:none;" :rows="2" v-model="detailTaskform.description"></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="任务附件">-->
                  <!--<form id="uploadFileEdit" enctype="multipart/form-data">-->
                    <!--<input type="file" :disabled="fileListEditDis" style="height: 25px;line-height: 20px;font-size: 12px;" v-on:change="fileChangeEdit" id="myfileEdit" name="myfile" placeholder="请选择文件"/>-->
                  <!--</form>-->
                  <!--<div style="line-height: 20px;font-size: 12px;">-->
                    <!--<span style="color: #F00;" v-if="fileListEdit.length === 5">最多选择 <span style="font-size: 16px;font-weight: bold;">{{fileListEdit.length}}</span> 个附件:</span>-->
                    <!--<span v-if="fileListEdit.length < 5">已选 <span style="color: #409EFF;font-size: 16px;font-weight: bold;">{{fileListEdit.length}}</span> 个附件:</span>-->
                    <!--<span style="color: #888;" v-if="fileListEdit.length === 0">暂无附件</span>-->
                    <!--<span style="color: #409EFF" v-if="fileListEdit.length > 0" v-for="(file, index) in fileListEdit" v-bind:key="index"><span style="color: #333">{{index+1}}、</span>{{file.showName}}  <div style="color: #999;display: inline-block;" class="el-icon-close" @click="delUploadFile(file.attachmentId)"></div>, </span>-->
                  <!--</div>-->
                <!--</el-form-item>-->
                <!--<div style="text-align: center">-->
                  <!--<el-button type="primary" @click="modifyTaskSub('modifyTask')">保存</el-button>-->
                  <!--<el-button @click="modifyTaskVisible = false">关 闭</el-button>-->
                <!--</div>-->
              <!--</el-form>-->
            <!--</div>-->
            <!--&lt;!&ndash;&ndash;&gt;-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
      <!--任务详情 end-->
      <!--<div class="block">-->
        <!--<el-tree-->
          <!--:data="data5"-->
          <!--node-key="id"-->
          <!--@node-expand="getNodeMsg($event)"-->
          <!--:expand-on-click-node="false">-->
          <!--<span class="custom-tree-node" slot-scope="{ node, data }">-->
            <!--<span class="dataName" @click="showDetailPage(data)">{{data.name}}</span>-->
            <!--<span class="proMsg">-->
              <!--<span class="treeName">-->
                <!--<span v-if="data.type === '2'">-->
                  <!--<span style="float: left"><img style="width: 16px;" src="../../static/img/my.png" alt=""></span>-->
                  <!--<span style="float: left;margin-left: 16px;">{{data.userName}}</span>-->
                <!--</span>-->
              <!--</span>-->
              <!--<span class="treeState">-->
                 <!--<span v-if="data.type === '2'">-->
                  <!--<span style="float: left"><img style="width: 16px;" src="../../static/img/noted.png" alt=""></span>-->
                  <!--<span v-if="data.status === '0'" style="float: left;margin-left: 16px;color: #ffd04b;">未确认</span>-->
                  <!--<span v-if="data.status === '1'" style="float: left;margin-left: 16px;color: #53b5ff;">进行中</span>-->
                  <!--<span v-if="data.status === '2'" style="float: left;margin-left: 16px;color: #27CF97;">已完成</span>-->
                 <!--</span>-->
              <!--</span>-->
              <!--<span class="treeTime">-->
                <!--<span style="float: left"><img style="width: 16px;" src="../../static/img/data.png" alt=""></span>-->
                <!--<span style="float: left;margin-left: 16px;">{{data.start}} - {{data.finish}}</span>-->
              <!--</span>-->
            <!--</span>-->
          <!--</span>-->
        <!--</el-tree>-->
      <!--</div>-->
    </div>
    <!--删除确认-->
    <Modal v-model="modal2" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>将删除此项及其下的所有子项.</p>
        <p>确定要删除?</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="modal_loading" @click="delNode">确认删除</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import FileUploadComp from './FileUploadComp.vue'
import FileUpload from './FileUpload.vue'
export default {
  name: 'ProEdit',
  components: {
    FileUpload,
    FileUploadComp
  },
  data () {
    return {
      pageN: 1,
      // 新建 修改任务
      fileListEdit: [],
      disabledEndTime2: '',
      disabledStarTime2: '',
      // 新建 修改任务
      fileListEditDis: false,
      // 新建 修改任务
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
      // 新建 修改任务
      loadingEdit: false,
      // 新建 修改任务
      detailTaskform: {
        id: '',
        jobName: '',
        jobLevel: 2,
        taskStartDate: '2018-10-10 00:00:00',
        taskFinishDate: '2018-10-10 00:00:00',
        description: ''
      },
      // 新建 修改任务
      modifyTaskVisible: false,
      // 新建 修改任务
      taskIdEdit: '',
      // 接收到的组件数组 新组件
      FileUploadArr: [],
      // 是否让子组件清空文件 新组件
      IsClear: false,
      // 引入附件上传组件 新组件
      FileUploadComp: 'FileUploadComp',
      // 附件上传 附件ID拼接成字符串
      FileUploadIdStr: '',
      // 编辑计划
      editPlanPayload: {
        planId: '1',
        name: '',
        start: '',
        finish: '',
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
      // 编辑计划
      pickerOptionsPlanSt: {},
      pickerOptionsPlanEt: {},
      pickerOptionsTaskSt: {},
      pickerOptionsTaskEt: {},
      // 编辑计划
      planRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        date1: [
          { type: 'string', required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        date2: [
          { type: 'string', required: true, message: '请选择结束日期', trigger: 'change' }
        ]
      },
      // 编辑计划
      detailform: {
        name: '',
        dataList: [],
        date1: '2018-10-10 00:00:00',
        date2: '2018-10-10 00:00:00',
        description: ''
      },
      planEditShow: false,
      tableData: [{
        planTime: '2016-05-02',
        planTitle: '这个是计划',
        planType: '计划',
        planManager: '张三'
      }, {
        planTime: '2016-05-02',
        planTitle: '这个是计划',
        planType: '计划',
        planManager: '张三'
      }, {
        planTime: '2016-05-02',
        planTitle: '这个是计划',
        planType: '计划',
        planManager: '张三'
      }, {
        planTime: '2016-05-02',
        planTitle: '这个是计划',
        planType: '计划',
        planManager: '张三'
      }],
      // 一级计划
      FirstLevelTask: false,
      // 一级计划
      moreUserSelectPayload2: {
        projectManager: ''
      },
      tranManageArr2: ['taskLevelHeight2'],
      options42: [],
      moreText2: '更多',
      moreIcon2: 'el-icon-arrow-down',
      fileList2: [],
      defImplementer: {
        name: '张三',
        id: ''
      },
      taskNameText2: '',
      taskLevelLeft2: '',
      taskLevelTop2: '',
      taskLevelHeight2: 0,
      taskIntro2: '',
      taskRelationShow2: false,
      levelValue2: 3,
      selDateEnd2: '',
      pickerOptions3: {},
      selDateStart2: '',
      selectDateDiaShow2: false,
      loading22: false,
      selectUserDiaShow2: false,
      loading32: false,
      butnDisabledT: true,
      fileListTrans: [],
      commitComentT: '',
      projectManager: '',
      loading11: false,
      loadingRe: false,
      // 任务移交
      taskTransferVisible: false,
      butnDisabledF: true,
      fileListFinish: [],
      commitComentF: '',
      loading9: false,
      // 任务完成
      taskFinishedVisible: false,
      // 任务详情 start
      fileListComment: [],
      childTaskList: [],
      toShowDevided: false,
      // 任务详情 end
      notMore: false,
      // 成员管理 初始值
      iniMem: [],
      // 成员管理
      getPeople: [],
      // 成员管理
      dataPeo: [],
      // 新增
      getNextPeople: [],
      // 成员管理
      deId: [],
      // 成员管理 组织架构
      data2: [],
      // 组织架构
      defaultProps: {
        children: 'children',
        label: 'Name'
      },
      // 组织架构
      organizationalShow: false,
      // 新增
      modal2: false,
      modal_loading: false,
      // 新增
      defaultTreeProps: {
        children: 'children',
        label: 'name'
      },
      // 新增 项目根计划ID
      firstPlanId: '',
      // 新增
      token: '',
      // 新增
      upLoadName: '',
      // 新增
      formId: '',
      // 新增
      addTaskOptions: [],
      // 新增
      defaultTime: '',
      // 新增
      isDisabled: false,
      // 新增
      pickerOptions0: {
        canSee: 'CanSee',
        canEdit: 'CanEdit'
      },
      pickerOptionsPlan: {},
      // 新增 切换
      panshow: false,
      // 新增 添加计划 切换
      activeNameBgCover: 'first',
      // 新增 添加计划或者任务 表单弹窗
      bgCoverShow: false,
      // 新增
      totalData: 0,
      // 新增
      taskLogs: [],
      // 新增
      pagenum: 1,
      // 新增
      showBigImageVisible: false,
      // 新增
      preImageUrl: '',
      // 新增 历史loading
      historyLoading: false,
      // 新增 历史记录 抽屉
      DrawerHistory: false,
      // 新增 项目组成员列表
      proGrpMemList: '',
      // 新增
      single1: true,
      // 新增
      single2: false,
      // 新增
      loading2: false,
      // 新增
      options4: [],
      // 新建
      // 新建
      showFileUrl: '',
      addPlanPayload: {
        parentPlanId: '',
        name: '',
        start: '',
        finish: '',
        description: ''
      },
      // 新建
      addTaskPayload: {
        parentId: '',
        attachmentId: '',
        jobName: '',
        taskStartDate: '',
        taskFinishDate: '',
        description: '',
        jobLevel: 1,
        users: []
      },
      // 任务分解
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
      // 增加任务 表单
      addTaskForm: {
        jobName: '',
        userArr: [],
        userName: '',
        jobLevel: 1,
        date1: '',
        date2: '',
        state2: '',
        description: '',
        taskUserId: '',
        file: ''
      },
      // 增加任务 验证
      taskRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        jobName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        file: [
          { required: false, message: '请输入名称', trigger: 'change' }
        ],
        userArr: [
          { required: true, message: '请选择任务指派人', trigger: 'change' }
        ],
        jobLevel: [
          { required: true, message: '请选择任务等级', trigger: 'change' }
        ],
        date1: [
          { type: 'string', required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        date2: [
          { type: 'string', required: true, message: '请选择结束日期', trigger: 'change' }
        ]
      },
      // 新增 增加计划 表单
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        description: '',
        resource: '',
        desc: ''
      },
      // 新增 增加计划 验证
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        jobName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        userArr: [
          { required: true, message: '请选择任务指派人', trigger: 'change' }
        ],
        jobLevel: [
          { required: true, message: '请选择任务等级', trigger: 'change' }
        ],
        date1: [
          { type: 'string', required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        date2: [
          { type: 'string', required: true, message: '请选择结束日期', trigger: 'change' }
        ]
      },
      // 新增
      value9: [],
      // 新增
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
      // 新增
      Mid: '',
      // 新增
      seracMem: '',
      // 新增 成员管理 抽屉
      DrawerMember: false,
      // 新增 编辑基本信息 抽屉
      DrawerBaseEdit: false,
      // 新加 ks
      memberList: [],
      // 新加 js
      msg: 'Welcome to Your Vue.js App',
      proId: '',
      type: '',
      rid: '',
      taskId: '',
      pageSize: 5,
      downurl: '',
      fileName: '',
      totalNum: 1,
      currentNodeId: '',
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
      // 一级计划 详情 planList数据处理
      FirstLevelPlanList: [],
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
      // 新增
      moreUserSelectPayload: {
        projectManager: ''
      },
      // 新增
      addMemPayload: {
        projectUID: '',
        hrocPeople: []
      },
      // 新增 编辑基本信息
      editBaseInfoPayload: {
        projectUID: '',
        projectName: '',
        projectType: '',
        projectManager: '',
        projectManagerID: '',
        introduction: '',
        startDate: '',
        endDate: '',
        formIds: '',
        projectClassifyId: ''
      },
      // 新增
      autoCompleteNamesPayload: {
        projectManager: ''
      },
      // 新增 添加评论
      addProjectCommentPayload: {
        projectUID: '',
        content: '',
        attachmentId: ''
      },
      // 新增
      formValidateD: {
        proName: '',
        proType: '',
        proManager: '',
        projectManagerID: '',
        proBaseStartDate: '2019-03-09 00:00:00',
        proBaseEndDate: '2019-03-10 00:00:00',
        startDate2: 'Wed Mar 13 2019 00:00:00 GMT+0800 (中国标准时间)',
        startDate3: 'Thu Mar 28 2019 00:00:00 GMT+0800 (中国标准时间)',
        desc: ''
      },
      formValidate: {
        proName: '',
        proType: '',
        proManager: '',
        projectManagerID: '',
        startDate: '',
        endDate: '',
        startDate2: 'Wed Mar 13 2019 00:00:00 GMT+0800 (中国标准时间)',
        startDate3: 'Thu Mar 28 2019 00:00:00 GMT+0800 (中国标准时间)',
        desc: ''
      },
      // 任务开始
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
      ruleValidate: {
        proName: [
          { required: true, message: '请输入项目名字', trigger: 'blur' }
        ],
        proType: [
          { required: true, message: '请选择项目类型', trigger: 'change' }
        ],
        proManager: [
          { required: true, message: '请选择项目负责人', trigger: 'change' }
        ],
        proBaseStartDate: [
          { required: true, type: 'date', message: '请选择开始日期', trigger: 'change' }
        ],
        startDateTime: [
          { required: true, type: 'string', message: '请选择开始时间', trigger: 'change' }
        ],
        proBaseEndDate: [
          { required: true, type: 'date', message: '请选择结束日期', trigger: 'change' }
        ],
        endDateTime: [
          { required: true, type: 'string', message: '请选择结束时间', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请简要填写项目描述', trigger: 'blur' },
          { type: 'string', min: 5, message: '简介不得少于5个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created: function () {
    this.proId = this.$store.state.proId
    // console.log('this.proId:', this.proId)
    this.getProjectDetail()
    // 调用新接口 获取项目详情
    this.queryProDetail()
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
    value9: function (newValue, oldValue) {
      this.addTaskForm.userArr = newValue
      // this.log('this.taskForm.state2:', this.taskForm.state2)
    },
    proId: function (val, oVal) {
      this.currentProId = val
      this.currentType = this.type
      // this.getProjectDetail()
    },
    commitComent: function (val, oVal) {
      if (val) {
        this.butnDisabled = false
      } else {
        this.butnDisabled = true
      }
    },
    fileName: function (val, oval) {
    },
    proDetailMsg: function (newVal, oldVal) {
      this.log('KKKKKKKKKK:', newVal)
      this.formValidate.proName = newVal.projectName
      this.formValidate.proManager = newVal.projectManager
      this.formValidate.projectManagerID = newVal.projectManagerID
      this.formValidate.desc = newVal.content
      this.formValidate.proType = newVal.projectType
      this.formValidate.startDate = newVal.startDate
      this.formValidate.endDate = newVal.endDate
    },
    commitComentF: function (val, oVal) {
      if (val) {
        this.butnDisabledF = false
      } else {
        this.butnDisabledF = true
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
    projectManager: function (val, oVal) {
      if (val) {
        this.butnDisabledT = false
      } else {
        this.butnDisabledT = true
      }
    },
    planList: function (val, old) {
      var that = this
      if (val) {
        that.FirstLevelPlanList = []
        for (var i = 0; i < val.length; i++) {
          var obj = {
            planName: val[i].name,
            planType: val[i].type === '1' ? '计划' : '任务',
            planStartDate: val[i].start.split(' ')[0],
            planFinishDate: val[i].finish.split(' ')[0],
            planDateDur: val[i].start.split(' ')[0] + ' 至 ' + val[i].finish.split(' ')[0],
            planId: val[i].id,
            description: val[i].description ? val[i].description : ''
          }
          that.FirstLevelPlanList.push(obj)
        }
      }
    }
  },
  methods: {
    planHandleClick (row, clickType) {
      var that = this
      that.currentNodeId = row.planId
      console.log('planHandleClick:', row)
      // planDateDur: "2018-10-10 至 2018-10-10"
      // planStartDate planFinishDate
      // planId: "P8de7eee479cd4fc9bdd43f4a323fd715"
      // planName: "计划110110110110"
      // planType: "计划"
      if (clickType === 'edit') {
        if (row.planType === '计划') {
          that.detailform.name = row.planName
          that.detailform.date1 = row.planStartDate
          that.detailform.date2 = row.planFinishDate
          that.detailform.description = row.description
          that.planEditShow = true
        } else if (row.planType === '任务') {
          // 编辑任务
          that.modifyTask(that.currentNodeId)
        }
      } else if (clickType === 'add') {
        that.addNode(row.planId, row.planType)
      } else if (clickType === 'del') {
        that.modal2 = true
      }
    },
    // 一级计划 详情
    FistLevelPlanDetail () {
      this.FirstLevelTask = true
    },
    // 一级计划 详情 结束
    // 权限 编辑 查看
    checkBoxChangeEdit (checked, id, role) {
      var that = this
      this.log('权限编辑查看：', checked + '-' + id + '-' + role)
      this.ajax('/myProject/editRole', JSON.stringify({projectUID: that.proId, projectOrg: [{id: id, role: role}]})).then(res => {
        that.log('editRole:', res)
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
      this.log('changeState:', 888888)
      that.deId = state.checkedNodes
      this.ajax('/myProject/queryMember', {departmentIDs: JSON.stringify(that.deId)}).then(res => {
        that.log('queryMember_1:', res)
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
      if (that.deId.length > 0) {
        that.loading = true
        that.ajax('/myProject/addMembers', JSON.stringify({
          projectUID: that.proId,
          hrocPeople: that.getPeople
        })).then(res => {
          that.log('addMembers_99999:', res)
          if (res.code === 200) {
            that.queryProGroupMember()
            that.queryProDetail()
            // that.getProjectPeo()
            that.loading = false
            // that.deId = []
          }
        })
      } else if (this.deId.length === 0) {
        $('.el-icon-d-arrow-right').removeClass('active')
      }
    },
    // 删除成员
    delMember (memId) {
      var that = this
      if (memId) {
        that.ajax('/myProject/delMembersById', {
          projectUID: that.proId,
          id: memId
        }).then(res => {
          that.log('删除成员:', res)
          if (res.code === 200) {
            that.$message({
              type: 'success',
              message: res.msg
            })
            that.queryProGroupMember()
            that.queryProDetail()
            // that.getProjectPeo()
            that.loading = false
            // that.deId = []
          } else {
            that.$message(res.msg)
          }
        })
      }
    },
    // 点击 组织架构
    organizationalClick () {
      this.organizationalShow = true
      this.getDepartment()
    },
    // 查询部门
    getDepartment () {
      var that = this
      this.ajax('/myProject/queryDepartment', {}).then(res => {
        this.log('queryDepartment:', res)
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
    // 节点操作 展开更多 添加
    moreSelectOptions: function (nodeName, nodeId, nodeType, nodeData) {
      var that = this
      this.log('nodeName:', nodeName)
      this.log('nodeId:', nodeId)
      this.log('nodeType:', nodeType)
      this.log('nodeData:', nodeData)
      this.currentNodeId = nodeId
      if (nodeName === 'add') {
        this.addNode(nodeId, nodeType)
      } else if (nodeName === 'del') {
        this.modal2 = true
        // this.delNode(nodeId)
      } else if (nodeName === 'edit') {
        if (nodeType === '2') {
          that.modifyTask(nodeId)
        } else if (nodeType === '1') {
          that.detailform.name = nodeData.name
          that.detailform.date1 = nodeData.start
          that.detailform.date2 = nodeData.finish
          that.detailform.description = nodeData.description
          that.planEditShow = true
        }
      }
    },
    // 新建 添加子节点
    addNode: function (nodeId, nodeType) {
      console.log('nodeId', nodeId)
      var that = this
      if (nodeType) {
        if (nodeType === '1' || nodeType === '计划') {
          that.activeNameBgCover = 'first'
        } else {
          that.activeNameBgCover = 'second'
        }
      }
      this.currentNodeId = nodeId
      this.bgCoverShow = true
      that.ajax('/myProject/getPlanOrTaskDetail', {id: nodeId}).then(res => {
        if (res.code === 200) {
          var st = res.data.start.split(' ')[0] + ' 00:00:00'
          var et = res.data.finish
          var sT = new Date(st)
          var eT = new Date(et)
          that.disabledStarTime2 = sT.getTime()
          that.disabledEndTime2 = eT.getTime()
          that.pickerOptionsPlan.disabledDate = function (time) {
            return time.getTime() < that.disabledStarTime2 || time.getTime() > that.disabledEndTime2
          }
          // that.log('delPlanOrTask:', disabledStarTime)
          // that.log('delPlanOrTask22:', disabledEndTime)
        } else {
          that.$message({
            message: res.msg
          })
        }
      })
    },
    // 新建 展开更多 删除子节点
    delNode: function () {
      var that = this
      // this.currentNodeId = nodeId
      this.modal_loading = true
      that.ajax('/myProject/delPlanOrTask', {id: that.currentNodeId}).then(res => {
        that.log('delPlanOrTask:', res)
        if (res.code === 200) {
          // that.getChildNode(that.currentNodeId)
          that.queryProDetail()
          that.getProjectDetail()
          this.modal_loading = false
          this.modal2 = false
          that.$message({
            message: '删除成功！',
            type: 'success'
          })
        } else {
          that.loading = false
          that.$message({
            message: res.msg
          })
        }
      })
    },
    // 新建
    rateChange: function (rateval) {
      this.addTaskPayload.jobLevel = rateval
    },
    // 新建 创建添加计划
    onPlanSubmit (formName) {
      var that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          that.loading = true
          that.addPlanPayload.parentPlanId = this.currentNodeId
          that.addPlanPayload.name = this.form.name
          that.addPlanPayload.start = this.form.date1
          that.addPlanPayload.finish = this.form.date2
          that.addPlanPayload.description = this.form.description
          // that.addPlanPayload._jfinal_token = this.token parentPlanId
          that.ajax('/myProject/addPlan', that.addPlanPayload).then(res => {
            that.log('addplan:', res)
            if (res.code === 200) {
              that.bgCoverShow = false
              that.token = res._jfinal_token
              that.loading = false
              that.formDataClear()
              that.getProjectDetail()
              // that.getChildNode(that.currentNodeId)
              that.queryProDetail()
              that.$message({
                message: '创建计划成功！',
                type: 'success'
              })
            } else {
              that.loading = false
              that.$message({
                message: res.msg
              })
            }
          })
        }
      })
    },
    // 获取自己计划或任务
    getChildNode: function (childNodeId) {
      var that = this
      that.ajax('/myProject/getPlanOrTaskById', {id: childNodeId}).then(res => {
        that.log('当期节点的子级返回:', res)
        if (res.code === 200) {
          var oldData5 = that.data5
          for (var i = 0; i < that.data5.length; i++) {
            if (that.data5[i].id === childNodeId) {
              var zzArr = []
              for (var t = 0; t < res.data.length; t++) {
                zzArr.push(res.data[t])
              }
              oldData5.children = zzArr
            }
            // res.data.planOrJobList[i].start = res.data.planOrJobList[i].start.split(' ')[0]
            // res.data.planOrJobList[i].finish = res.data.planOrJobList[i].finish.split(' ')[0]
            // res.data.planOrJobList[i].children = [{
            //   id: 1,
            //   name: '测试'
            // }]
          }
          that.data5 = oldData5
          that.log('that.data5:', that.data5)
          // e.children = res.data.planOrJobList
        }
      })
    },
    // 新增
    handleClickPlanTask: function (tab) {
    },
    // 新增
    formDataClear: function () {
      this.taskForm.state2 = ''
      this.taskForm.jobName = ''
      this.taskForm.date1 = ''
      this.taskForm.date2 = ''
      this.taskForm.description = ''
      this.taskForm.jobLevel = 1
      this.upLoadName = ''
      // 计划
      this.form.name = ''
      this.form.date1 = ''
      this.form.date2 = ''
      this.form.description = ''
      // 多人
      this.addTaskPayload.users = []
      this.options4 = []
      this.value9 = []
    },
    // 新增
    onPlanTaskCancel () {
      var that = this
      that.isDisabled = false
      that.bgCoverShow = false
      that.formDataClear()
    },
    // 新增 提交 添加任务
    // 创建添加任务
    onTaskSubmit: function (taskForm) {
      var that = this
      // var fileV = $('#myfile').val()
      that.$refs[taskForm].validate((valid) => {
        if (valid) {
          var user = ''
          for (var i = 0; i < that.value9.length; i++) {
            var lian = i === (that.value9.length - 1) ? '' : '_'
            user = user + that.value9[i].split('_')[0] + '-' + that.value9[i].split('_')[1] + lian
          }
          this.log('user:', user)
          that.loading = true
          this.addTaskPayload.parentId = this.currentNodeId
          this.addTaskPayload.jobName = this.addTaskForm.jobName
          this.addTaskPayload.jobLevel = this.addTaskForm.jobLevel
          this.addTaskPayload.users = user
          this.addTaskPayload.taskStartDate = this.addTaskForm.date1
          this.addTaskPayload.taskFinishDate = this.addTaskForm.date2
          this.addTaskPayload.description = this.addTaskForm.description
          this.addTaskPayload.attachmentId = that.SetFileIdStr()
          // this.addTaskPayload._jfinal_token = this.token
          // this.addTaskPayload.formId = this.formId
          this.ajax('/myProject/addTask', that.addTaskPayload).then(res => {
            if (res.code === 200) {
              // 告知附件子组件清空
              that.IsClear = true
              that.formId = res.formId
              // that.token = res._jfinal_token
              that.loading = false
              that.formId = ''
              that.bgCoverShow = false
              that.getProjectDetail()
              that.queryProDetail()
              that.$message({
                message: '创建任务成功！',
                type: 'success'
              })
            } else {
              that.$message({
                message: res.msg
              })
              that.loading = false
            }
          })
        }
      })
    },
    // 新增 增加计划任务
    addTaskRemoteMethod (query) {
      var that = this
      this.log('query:', query)
      if (query !== '') {
        this.loading2 = true
        that.moreUserSelectPayload.projectManager = query
        this.ajax('/general/autoCompleteNames', that.moreUserSelectPayload).then(res => {
          that.log('autoCompleteNames:', res)
          if (res.code === 200) {
            that.addTaskOptions = res.msg
            this.loading2 = false
          }
        })
      } else {
        this.addTaskOptions = []
      }
    },
    // 新增 点击“历史记录”打开历史记录抽屉
    openHisDrawer () {
      this.DrawerHistory = true
      this.getHistoryCont()
    },
    getPageNum () {
      this.pageN++
      this.log(this.pageN)
      // this.pagenum = e
      this.getHistoryCont()
    },
    // 新增 获取历史记录
    getHistoryCont () {
      var that = this
      // var planid = this.$route.params.pid
      that.ajax('/myProject/getLogAndComment', {projectUID: that.proId, pageSize: 10, pageNum: that.pageN}).then(res => {
        that.log('getLogAndComment:', res)
        if (res.code === 200) {
          for (var i = 0; i < res.data.list.length; i++) {
            for (var j = 0; j < res.data.list[i].uploads.length; j++) {
              if (that.isImage(res.data.list[i].uploads[j].showName)) {
                res.data.list[i].uploads[j].isImage = true
              } else {
                res.data.list[i].uploads[j].isImage = false
              }
              var downurl = that.$store.state.baseServiceUrl + '/file/downloadFile?realUrl=' + res.data.list[i].uploads[j].realUrl + '&showName=' + res.data.list[i].uploads[j].showName
              res.data.list[i].uploads[j].downloadUrl = downurl
            }
          }
          that.taskLogs = that.taskLogs.concat(res.data.list)
          that.totalData = res.data.totalRow
          if (that.taskLogs.length === that.totalData) {
            that.log('ss', that.taskLogs)
            that.notMore = true
          }
          that.log('taskLogs:', res)
        }
      })
    },
    // 新增 检查图片
    showBigImage (url, imgName) {
      if (url) {
        if (this.isImage(imgName)) {
          this.preImageUrl = url
          this.showBigImageVisible = true
        }
      } else {
        this.$message('地址无效')
      }
    },
    // 新增
    getFileName: function () {
      var filePath = $('#myfile').val()
      var arr = filePath.split('\\')
      var fileName = arr[arr.length - 1]
      $('.showFileName').html(fileName)
    },
    // 新增
    startDateChange (date) {
      this.log('startDate:', date)
    },
    // 新增
    endDateChange (date) {
      this.log('endDate:', date)
    },
    // 新建 人员选择
    handleSelect (item) {
      // console.log(item.userId)
      this.Mid = item.userId
    },
    // 新建 搜索选择项目负责人
    querySearchAsync (queryString, cb) {
      var that = this
      if (queryString) {
        that.autoCompleteNamesPayload.projectManager = queryString
        this.ajax('/general/autoCompleteNames', that.autoCompleteNamesPayload).then(res => {
          // console.log('search:', res)
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
    // 新增
    proBaseEditClick () {
      this.DrawerBaseEdit = true
    },
    // 时间格式化
    DateFormat (date) {
      var finalFarmat = ''
      var newdate = new Date(date)
      var y = newdate.getFullYear()
      var mon = (newdate.getMonth() + 1) < 10 ? ('0' + (newdate.getMonth() + 1)) : (newdate.getMonth() + 1)
      var d = newdate.getDate() < 10 ? ('0' + newdate.getDate()) : newdate.getDate()
      var h = newdate.getHours() < 10 ? ('0' + newdate.getHours()) : newdate.getHours()
      var min = newdate.getMinutes() < 10 ? ('0' + newdate.getMinutes()) : newdate.getMinutes()
      var s = newdate.getSeconds() < 10 ? ('0' + newdate.getSeconds()) : newdate.getSeconds()
      finalFarmat = y + '-' + mon + '-' + d + ' ' + h + ':' + min + ':' + s
      return finalFarmat
    },
    // 新增
    handleSubmit (name) {
      var that = this
      this.log(100000001)
      this.log('formValidate:', this.formValidate)
      this.$refs[name].validate((valid) => {
        this.log(100000002)
        if (valid) {
          this.log(100000003)
          that.log('that.proId:', that.proId)
          that.editBaseInfoPayload.projectUID = that.proId
          that.editBaseInfoPayload.projectName = that.formValidate.proName
          that.editBaseInfoPayload.projectType = that.formValidate.proType
          that.editBaseInfoPayload.projectManager = that.formValidate.proManager
          that.editBaseInfoPayload.projectManagerID = that.Mid
          that.editBaseInfoPayload.introduction = that.formValidate.desc
          this.log(100000004)
          that.editBaseInfoPayload.startDate = that.DateFormat(that.formValidate.startDate)
          that.editBaseInfoPayload.endDate = that.DateFormat(that.formValidate.endDate)
          // that.editBaseInfoPayload.startDate = that.formValidate.startDate
          // that.editBaseInfoPayload.endDate = that.formValidate.endDate
          this.log(100000005)
          that.ajax('/myProject/editBaseInfo', that.editBaseInfoPayload).then(res => {
            that.log('editBaseInfo:', res)
            if (res.code === 200) {
              that.$Message.success('Success!')
              that.queryProDetail()
              // that.queryProGroupMember()
              // that.proGrpMemList = res.data
              // that.options4 = res.data peopleRole
              // this.loading2 = false
            }
          })
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    // 新增
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    // 新增 测试
    test () {
      this.log('value9:', this.taskForm.value9)
    },
    // 新增 增加项目组成员
    addMember () {
      var that = this
      if (that.taskForm.value9.length > 0) {
        for (var i = 0; i < that.taskForm.value9.length; i++) {
          var obj = {Name: '', ID: ''}
          obj.Name = that.taskForm.value9[i].split('-')[0]
          obj.ID = that.taskForm.value9[i].split('-')[1]
          that.addMemPayload.hrocPeople.push(obj)
        }
        that.addMemPayload.projectUID = this.proId
        that.log('that.addMemPayload:', that.addMemPayload)
        this.ajax('/myProject/addMembers', JSON.stringify(that.addMemPayload)).then(res => {
          that.log('addMembers:', res)
          if (res.code === 200) {
            that.queryProGroupMember()
            that.queryProDetail()
            // that.proGrpMemList = res.data
            // that.options4 = res.data peopleRole
            // this.loading2 = false
          }
        })
      }
    },
    // 新增 查询项目组成员getMembersByProjectUID
    queryProGroupMember () {
      var that = this
      this.ajax('/myProject/getMembersByProjectUID', {projectUID: that.proId}).then(res => {
        that.log('getMembersByProjectUID:', res)
        if (res.code === 200) {
          that.proGrpMemList = res.data
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
    // 新增 成员搜索
    remoteMethod (query) {
      var that = this
      this.log('query:', query)
      if (query !== '') {
        this.loading2 = true
        that.moreUserSelectPayload.projectManager = query
        this.ajax('/myProject/autoCompleteNames', that.moreUserSelectPayload).then(res => {
          that.log('autoCompleteNames:', res)
          if (res.code === 200) {
            that.options4 = res.data
            this.loading2 = false
          }
        })
      } else {
        this.options4 = []
      }
    },
    // 新增
    moreMemberClick: function () {
      this.DrawerMember = true
      this.queryProGroupMember()
    },
    // zhanwei
    // createDate: "2019-03-02 13:26:22"
    // creator: "董广"
    // finish: "2019-03-29 00:00:00"
    // id: "Pdbc5c36fb9fb4cc5991393a0ec3e16a0"
    // jobLevel: ""
    // name: "这个一级计划01"
    // sonFlag: true
    // start: "2019-03-11 00:00:00"
    // status: ""
    // type: "1"
    // userName: null
    // 新增 获取项目详情
    queryProDetail: function () {
      var that = this
      that.ajax('/myProject/getProjectDetail', {projectUID: that.$store.state.proId}).then(res => {
        that.log('新getProjectDetail:', res)
        if (res.code === 200) {
          that.memberList = res.data.memberList
          that.proDetailMsg = res.data
          that.startPlanDate = res.data.startDate.split(' ')[0]
          that.endPlanDate = res.data.endDate.split(' ')[0]
          // that.data5 = res.data.planOrJobList
          that.firstPlanId = res.data.firstPlanId
          // for (var i = 0; i < res.data.planOrJobList.length; i++) {
          //   res.data.planOrJobList[i].start = res.data.planOrJobList[i].start.split(' ')[0]
          //   res.data.planOrJobList[i].finish = res.data.planOrJobList[i].finish.split(' ')[0]
          //   res.data.planOrJobList[i].children = [{
          //     id: 1,
          //     name: '测试'
          //   }]
          // }
          // e.children = res.data.planOrJobList
        }
      })
    },
    breadcrumbGetPlan: function (pid, index) {
      var that = this
      that.data5 = []
      that.currentProId = pid
      // that.getProjectDetail(that.$store.state.routerList[index].type)
      that.$store.commit('resetBreadcrumb', index)
    },
    resetScro: function () {
      $('.ivu-drawer-body').scrollTop(0)
    },
    // j
    // drawerClose: function () {
    //   $('.ivu-drawer-body').scrollTop(0)
    // },
    // 点击 项目详情 下的树结构节点 获取子计划或任务
    getNodeMsg: function (e) {
      // this.value4 = true
      var that = this
      this.$set(e, 'children', [])
      that.ajax('/leader/getPlanOrTaskById', {id: e.id}).then(res => {
        that.log('子级返回:', res)
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
    // 页面初始化 获取一级计划 根据项目id获取项目下的一级计划
    getProjectDetail: function (typeNum) {
      var that = this
      if (typeNum) {
        that.currentType = typeNum
      }
      that.ajax('/leader/getPlanOrTaskByProjectId', {projectUID: that.$store.state.proId}).then(res => {
        that.log('一级计划接口：', res)
        if (res.code === 200) {
          that.proDetailMsg = res.data.projectDetail
          // that.$store.commit('setRouterName', {name: res.data.projectDetail.projectName, id: res.data.projectDetail.projectUID, type: that.currentType})
          // that.setRouterNameList = that.$store.state.routerList
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
    // 根据计划或任务Id 获取子级结构
    selectProjectId: function () {
      var that = this
      that.data5 = []
      that.ajax('/myProject/getPlanOrTaskById', {id: that.activeId}).then(res => {
        that.log('nnnnnnnnn', res)
        if (res.code === 200) {
          for (var i = 0; i < res.data.length; i++) {
            res.data[i].start = res.data[i].start.split(' ')[0]
            res.data[i].finish = res.data[i].finish.split(' ')[0]
            res.data[i].children = [{
              id: 1,
              name: '测试'
            }]
          }
          that.data5 = res.data
        }
      })
    },
    // 点击一级计划 获取一级下的子计划和任务
    selectProject: function (id, e) {
      var that = this
      that.data5 = []
      this.log('点击一级计划')
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
    showDetailPage: function (data) {
      var that = this
      if (data.type === '2') {
        that.taskId = data.id
        that.taskComment.uid = data.id
        that.taskHistoryList.uid = data.id
        that.value4 = true
        that.getCommicateCont()
        that.getHistoryList()
        that.toDetail(data.id)
        // that.ajax('/leader/getTaskBasic', {uid: that.taskId}).then(res => {
        //   that.log('getTaskBasic:', res)
        //   if (res.code === 200) {
        //     that.taskBasicMsg = res.data
        //     that.rid = res.data.uid
        //     if (that.isImage(res.data.showName)) {
        //       res.data.isImg = true
        //     } else {
        //       res.data.isImg = false
        //     }
        //     that.downurl = that.$store.state.baseServiceUrl + '/file/downloadFile?realUrl=' + res.data.realUrl + '&showName=' + res.data.showName
        //     that.resetScro()
        //   }
        // })
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
    // getCommicateCont: function () {
    //   var that = this
    //   that.ajax('/myTask/getTaskComment', that.taskComment).then(res => {
    //     that.log('getTaskComment:', res)
    //     if (res.code === 200) {
    //       that.commentList = res.data.list
    //       that.totalNum = res.data.totalRow
    //       for (var i = 0; i < that.commentList.length; i++) {
    //         if (that.isImage(res.data.list[i].showName)) {
    //           res.data.list[i].isImg = true
    //         } else {
    //           res.data.list[i].isImg = false
    //         }
    //         res.data.list[i].downloadUrl = that.$store.state.baseServiceUrl + '/file/downloadFile?realUrl=' + res.data.list[i].realUrl + '&showName=' + res.data.list[i].showName
    //       }
    //     }
    //   })
    // },
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
    // getCurrentPage: function (e) {
    //   this.taskComment.pageNum = e
    //   this.getCommicateCont()
    // },
    // getHistoryList: function () {
    //   var that = this
    //   that.ajax('/leader/getTaskLog', that.taskHistoryList).then(res => {
    //     if (res.code === 200) {
    //       that.historyList = res.data.list
    //       that.totalHistoryNum = res.data.totalRow
    //       for (var i = 0; i < that.historyList.length; i++) {
    //         if (that.isImage(res.data.list[i].showName)) {
    //           res.data.list[i].isImg = true
    //         } else {
    //           res.data.list[i].isImg = false
    //         }
    //         that.historyList[i].downloadUrl = that.$store.state.baseServiceUrl + '/file/downloadFile?realUrl=' + res.data.list[i].realUrl + '&showName=' + res.data.list[i].showName
    //       }
    //     }
    //   })
    // },
    // getCurrentHistoryPage: function (e) {
    //   this.taskHistoryList.pageNum = e
    //   this.getHistoryList()
    // },
    // getFileName: function () {
    //   var filePath = $('#myfile').val()
    //   var arr = filePath.split('\\')
    //   var fileName = arr[arr.length - 1]
    //   $('.showFileName').html(fileName)
    // },
    // 新增 点击“回复”按钮
    addMarkInfo () {
      var that = this
      // that.loadingRe = true
      that.addProjectCommentPayload.projectUID = that.proId
      that.addProjectCommentPayload.content = that.commitComent
      that.addProjectCommentPayload.attachmentId = that.SetFileIdStr()
      console.log('idStr', that.SetFileIdStr())
      // if (that.commitComent) {
      //   that.ajax('/myProject/addProjectComment', that.addProjectCommentPayload).then(res => {
      //     that.log('addProjectComment:', res)
      //     if (res.code === 200) {
      //       that.IsClear = true
      //       that.$message({
      //         type: 'success',
      //         message: res.msg
      //       })
      //       that.loadingRe = false
      //       that.getHistoryCont()
      //       that.commitComent = ''
      //     } else {
      //       that.$message({
      //         type: 'success',
      //         message: res.msg
      //       })
      //       that.loadingRe = false
      //     }
      //   })
      // }
    },
    // 新增 点击“回复”按钮
    taskDetailconnect () {
      var that = this
      // that.addProjectCommentPayload.projectUID = that.proId
      // that.addProjectCommentPayload.content = that.commitComent
      // that.addProjectCommentPayload.attachmentId = that.SetFileIdStr()
      // if (that.commitComent) {
      //   that.ajax('/myProject/addProjectComment', that.addProjectCommentPayload).then(res => {
      //     that.log('addProjectComment:', res)
      //     if (res.code === 200) {
      //       that.IsClear = true
      //       that.$message({
      //         type: 'success',
      //         message: res.msg
      //       })
      //       that.getCommicateCont()
      //       that.commitComent = ''
      //     }
      //   })
      // }
      //   k
      that.ajax('/comment/addComment', {
        content: that.commitComent,
        attachmentId: that.SetFileIdStr(),
        contentId: that.taskId,
        parentCommentId: '11'
      }).then(res => {
        if (res.code === 200) {
          that.IsClear = true
          that.log('myTaskView:', res)
          that.getCommicateCont()
          // that.fileListComment = []
          that.commitComent = ''
          $('.showFileName').html('')
          $('#myfile2').val('')
          that.loading2 = false
          that.$message.success('评论成功！')
        }
      })
    },
    // 任务详情 start
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
    // 任务开始 开始任务
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
    // 任务完成 完成任务
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
    concelFinished: function () {
      var that = this
      that.taskFinishedVisible = false
      that.commitComentF = ''
      $('.showFileName2').html('')
      $('#myfileF').val('')
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
    transferTask: function () {
      var that = this
      that.taskTransferVisible = true
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
    taskToDevided: function () {
      var that = this
      that.toShowDevided = true
      // that.taskRelationShow2 = false
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
        that.CommunityTaskPayload2.attachmentId = that.SetFileIdStr()
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
            that.IsClear = true
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
    cancelDevide: function () {
      var that = this
      that.taskRelationShow2 = false
      that.toShowDevided = false
      that.clearDynamicsForm2()
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
    // commitComentF: function (val, oVal) {
    //   if (val) {
    //     this.butnDisabledF = false
    //   } else {
    //     this.butnDisabledF = true
    //   }
    // },
    toDetail: function (id) {
      var that = this
      if (id) {
        that.getTaskChildList(id)
        that.ajax('/myTask/queryTaskDetail', {taskId: id}).then(res => {
          this.log('查看返回：', res)
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
            that.pickerOptions3.disabledDate = function (time) {
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
          this.log('查看返回2：', res)
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
    // 编辑计划 保存
    // 修改点击了保存
    modifySub: function (formName) {
      // this.alert('计划点击了保存')
      var that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          that.loading = true
          that.editPlanPayload.planId = that.currentNodeId
          that.editPlanPayload.name = this.detailform.name
          that.editPlanPayload.start = this.detailform.date1
          that.editPlanPayload.finish = this.detailform.date2
          that.editPlanPayload.description = this.detailform.description
          that.ajax('/myProject/editPlan', that.editPlanPayload).then(res => {
            that.log('editPlan:', res)
            if (res.code === 200) {
              that.$message({message: '保存成功！', type: 'success'})
              // planEditShow
              that.planEditShow = false
              that.loading = false
              that.getProjectDetail()
              that.formDataClear()
              // that.queryManagePlan5()
            } else {
              that.loading = false
            }
          })
        }
      })
    },
    // 这个是table显示颜色
    rowClass ({ row, column, rowIndex, columnIndex }) {
      // console.log('rowStyle', row.projectUID)
      if (columnIndex === 0 && row.projectUID !== this.$store.state.projectUID) {
        return 'fontStyle'
      } else if (columnIndex === 2) {
        return 'btnStyle'
      } else if (columnIndex === 8) {
        if (row.status === '0') {
          return 'toStart'
        } else if (row.status === '1') {
          return 'noDone'
        } else if (row.status === '2') {
          return 'finished'
        }
      }
    },
    // 获取附件上传组件发来的附件信息
    // 获取附件上传组件发来的附件信息 新组件
    GetFileInfo (obj) {
      if (obj) {
        this.IsClear = false
      }
      this.FileUploadArr = obj
      this.log('GetFileInfo:', obj)
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
    concelTransfer: function () {
      var that = this
      that.loading11 = false
      $('#myfileTransfer').val('')
      $('.showFileNameTran').html('')
      that.projectManager = ''
      that.commitComentT = ''
      that.taskTransferVisible = false
    },
    // 编辑任务 修改任务
    modifyTask: function (id) {
      var that = this
      that.taskIdEdit = id
      that.modifyTaskVisible = true
      that.ajax('/myTask/queryTaskDetailSingle', {taskId: id}).then(res => {
        that.detailTaskform.jobName = res.data.jobName
        that.detailTaskform.jobLevel = parseInt(res.data.jobLevel)
        that.detailTaskform.taskStartDate = res.data.taskStartDate
        that.detailTaskform.taskFinishDate = res.data.taskFinishDate
        that.detailTaskform.description = res.data.description
        for (var i = 0; i < res.data.attachment.length; i++) {
          res.data.attachment[i].attachmentId = res.data.attachment[i].id
        }
        that.fileListEdit = res.data.attachment
      })
    },
    levelChange: function (rateval) {
      this.detailTaskform.jobLevel = rateval
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
          that.editTaskPayload.attachmentId = that.SetFileIdStr()
          that.ajax('/myProject/editTask', that.editTaskPayload).then(res => {
            that.log('editTask:', res)
            if (res.code === 200) {
              that.$message({
                message: '保存成功！',
                type: 'success'
              })
              that.IsClear = true
              that.modifyTaskVisible = false
              that.loadingEdit = false
              that.toDetail(that.taskIdEdit)
              that.selectProjectId()
              that.getHistoryList()
            } else {
              that.loadingEdit = false
            }
          })
        }
      })
    }
    // 任务详情 end
    // getNextPlan: function (pId) {
    //   var that = this
    //   that.value4 = false
    //   that.planList = []
    //   that.data5 = []
    //   that.currentProId = pId
    //   that.setRouterNameList = that.$store.state.routerList
    //   that.getProjectDetail(2)
    // },
    // breadcrumbGetPlan: function (pid, index) {
    //   var that = this
    //   that.data5 = []
    //   that.currentProId = pid
    //   that.getProjectDetail(that.$store.state.routerList[index].type)
    //   that.$store.commit('resetBreadcrumb', index)
    // }
  }
}
</script>

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
    width: 240px;
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
    _line-height: 25px;
  }
  .memName{
    width: 34px;
    font-size: 14px;
    color: #fff;
    float: left;
    padding: 5px 0;
    text-align: center;
    background-color: #409EFF;
    border-radius: 0px;
    border-bottom-left-radius: 5px;
    border-top-left-radius: 5px;
  }
  .memList{
    width: 100%;
    display: flex;
    margin-top: 30px;
    background-color: #f5f8fa;
  }
  .memBox{
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
    _line-height: 104px;
  }
  .memBox div{
    float: left;
    margin-left: 25px;
    color: #777;
    font-size: 14px;
    cursor: pointer;
    line-height: 38px;
  }
  .memBox div.moreBtn{
    padding: 4px 8px;
    float: left;
    margin-left: 25px;
    _color: #777;
    _font-size: 14px;
    _background-color: #3a8ee6;
    _border-radius: 4px;
    _text-align: center;
    _line-height: 20px !important;
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
    width: 800px;
    float: right;
    display: flex;
    justify-content: space-between;
  }
  .memBox .active{
    color: #fff;
    background-color: #409EFF;
  }
  .dataName{
    display: inline-block;
  }
  .dataName:hover{
    color: chocolate;
  }
  .el-textarea{
    margin-top: 15px;
    margin-left: 0px;
  }
  .el-textarea__inner{
    width: 100%;
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
  /*新增*/
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
  /*新增 操作记录*/
  .TimeLine:last-of-type .timeCont{
    border-left: none !important;
  }
  .quan{
    width: 14px;
    height: 14px;
    border: 1px solid #3a8ee6;
    border-radius: 8px;
    display: inline-block;
    line-height:14px;
    text-align: center;
    font-size: 10px;
    color: #3a8ee6;
  }
  .timeDate{
    display: inline-block;
    margin-left: 16px;
    position: absolute;
    top: 4px;
    font-weight: bold;
  }
  .timeCont{
    padding-top: 20px;
    margin-left: 8px;
    border-left: 1px solid #ddd;
    padding-left: 30px;
    font-size: 14px;
    color: #999;
    padding-bottom: 1px;
  }
  .listColor{
    _color: #3a8ee6;
    color: #666;
    font-weight: bold;;
  }
  .contBoxContentWrap{
    margin-top: 6px;
    margin-bottom: 6px;
    background-color: #f5f5f5;
  }
  .contentHide .contBoxContentWrap{
    display: none;
  }
  .contentHide .contBoxContent{
    display: none;
  }
  .contentShow .contBoxContent{
    display: block;
  }
  .contBoxContent{
    color: #999;
    font-size: 12px;
    padding-left: 8px;
    line-height: 22px;
  }
  .filepre{
    color: #3a8ee6;
    margin-right: 10px;
    cursor: pointer;
  }
  /*树形结构*/
  .proTreeHeader{
    display: flex;
    justify-content: space-between;
  }
  /*新增 添加计划或者任务 表单弹窗*/
  .bgCover{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999;
  }
  .bgCoverCnt{
    _width: 400px;
    _height: 460px;
    /*background-color: #fff;*/
    /*position: absolute;*/
    /*left: 50%;*/
    /*top: 50%;*/
    /*margin-left: -250px;*/
    /*margin-top: -250px;*/
    /*padding: 50px;*/
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
  /*成员管理 组织架构*/
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
  .caozuo{
    float: left;
    width: 100px;
    position: relative;
    margin-left: 40px;
    text-align: center;
  }
  .el-icon-d-arrow-right{
    margin: auto;
    width: 36px;
    height: 36px;
    border-radius: 18px;
    line-height: 36px;
    font-size: 20px;
  }
  .active{
    color: #fff;
    background-color:#409EFF;
  }
  /* 一级项目计划 */
  .planList{
    width: 100%;
    display: flex;
    margin-top: 30px;
    background-color: #f5f8fa;
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
  .planBox{
    width: 98%;
    float: left;
    max-height: 104px;
    overflow: scroll;
    overflow-x: hidden;
    border-top: 1px solid #f0f0f0;
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
  .planBox .active{
    color: #fff;
    background-color: #409EFF;
  }
  /**
   * =================================================================
   *                          任务详情 start
   * =================================================================
   */
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
  .taskMsg{
    background-color: #f5f8fa;
    display: flex;
    justify-content: space-between;
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
    width: 100%;
    display: flex;
    justify-content: space-between;
    line-height: 24px;
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
  .timeLine{
    padding: 20px;
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
  /**
   * =================================================================
   *                          任务详情 end
   * =================================================================
   */
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
  /***
   *
   *  ===================================================================
   *                     一级计划详情
   *  ===================================================================
   *
   **/
  .planTable{
    border: 1px solid #eee;
  }
  .planTableItem{
    display: flex;
    border-bottom: 1px solid #eee;
  }
  .planItemTitle{
    width: 150px;
  }
  .planItemType{
    width: 50px;
  }
  .planItemTime{
    width: 200px;
  }
  .planItemManager{
    width: 80px;
  }
  .planItemUse{
    width: 100px;
    display: flex;
  }
  .planItemTitle,.planItemType,.planItemTime,.planItemManager,.planItemUse{
    border-right: 1px solid #eee;
    line-height: 40px;
  }
  .tableHeader{
    display: flex;
    justify-content: space-between;
  }
  .tableProTitle{
    font-size: 16px;
  }
</style>
