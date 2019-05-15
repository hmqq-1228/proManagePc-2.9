<template>
  <div class="GoodsFileSpuInfo">
    <!-- spu信息 -->
    <div class="FileSpuInfo">
      <!-- spu基本信息 -->
      <div class="spuInfo base" v-bind:class="baseEdit">
        <!-- spu 基本信息 预览图 -->
        <div class="spuInfoItem ImgPre">
          <div class="iptHiddenBox"><input class="iptHidden" v-on:keydown="inputkeydown" /></div>
          <div class="ImgPrePrimary" @click="bigPre">
            <!--{{bigPreOffsetTop}}-->
            <!--../../../static/img/papa.jpg-->
            <img :src="bigPreImg" v-bind:style="{marginTop: bigPreOffsetTop + 'px'}" />
          </div>
          <div class="ImgPreList">
            <div class="ImgPreListItem" v-for="(imgItem, index) in spuBaseImgList" v-bind:key="imgItem.previewUrl + '_' + index" v-on:click="smallPreClick($event, imgItem.previewUrl, imgItem.id, imgItem)">
              <img :src="imgItem.previewUrl" />
            </div>
          </div>
          <div class="addRemoveBox" v-if="baseInfoEditStatus">
            <div class="ImgPreEditBox">
              <div class="ImgPreEditAdd" v-on:click="moveLeft(currentPreId)"><Icon type="md-arrow-back" /></div>
              <div class="ImgPreEditAdd" v-on:click="moveRight(currentPreId)"><Icon type="md-arrow-forward" /></div>
              <div class="ImgPreEditAdd" v-show="addIcon">
                <Icon type="md-add" />
                <div class="spuBaseInfoUpload">
                  <component v-bind:is="compArr.FileUploadComp" :filUrl="filUrl" v-bind:clearInfo="IsClear" v-on:FileDataEmit="GetFileInfo"></component>
                </div>
              </div>
              <div class="ImgPreEditAdd" v-on:click="removePreImg()"><Icon type="md-remove" /></div>
            </div>
          </div>
          <!--<div class="spuBaseInfoUpload">-->
            <!--<component v-bind:is="compArr.FileUploadComp" v-bind:clearInfo="IsClear" v-on:FileDataEmit="GetFileInfo"></component>-->
          <!--</div>-->
        </div>
        <!-- spu 基本信息 商品名称 品牌名称 spu编码 -->
        <div class="spuInfoItem">
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel" v-on:click="testFileList">商品名称:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="goodsNameVal" v-on:input="preExtraInput('goodsNameVal',{spuName: goodsNameVal},'editBase')" v-on:on-keydown="textValChange('goodsNameVal',{spuName: goodsNameVal}, 'editBase', $event)" :readonly="!baseInfoEditStatus" placeholder="请输入商品名称" style="max-width: 250px" >
                <Icon class="haha" id="goodsNameVal" v-show="baseInfoEditStatus" @click="editBaseSpuInfo({spuName: goodsNameVal}, 'goodsNameVal')" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">品牌名称:</div>
            <div class="spuInfoName select">
              <Select v-model="pinpaiCodeVal" v-show="baseInfoEditStatus" @on-change="changeValue($event,'pinpaiNameVal',{brandCode: pinpaiCodeVal},'editBase')" @keydown="testKeydown($event)">
                <Option v-for="brand in brandTypeArr" :key="brand.dictCode" :value="brand.dictCode">{{ brand.dictName }}</Option>
              </Select>
              <div style="position: absolute; top: 5px; right: 9px; background-color: #fff; color: #808695;">
                <Icon class="haha" v-show="baseInfoEditStatus" id="pinpaiNameVal" @click="editBaseSpuInfo({brandCode: pinpaiCodeVal},'pinpaiNameVal')" type="md-checkmark-circle" slot="suffix" />
              </div>
              <!--<Dropdown :trigger="customM" :visible="dropdownShow">-->
                <!--<span style="font-size: 12px; color: #515a6e">{{pinpaiNameVal}}</span>-->
                <!--<Icon type="ios-arrow-down"></Icon>-->
                <!--<DropdownMenu slot="list">-->
                  <!--<DropdownItem v-for="brand in brandTypeArr" v-bind:key="brand.dictCode">{{brand.dictName}}</DropdownItem>-->
                <!--</DropdownMenu>-->
              <!--</Dropdown>-->
              <i-input class="iptTest" v-show="!baseInfoEditStatus" v-model="pinpaiNameVal" :readonly="!baseInfoEditStatus" placeholder="请输入品牌名称" style="max-width: 250px" >
                <Icon class="haha" v-show="baseInfoEditStatus" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel" style="text-align: justify">负责人:</div>
            <div class="spuInfoName manager">
              <!--v-on:input="textValChange('managerNameVal')"-->
              <el-autocomplete style=""
                               v-model="managerNameVal"
                               :readonly="!baseInfoEditStatus"
                               :fetch-suggestions="querySearchAsync"
                               placeholder="请输入负责人姓名"
                               :trigger-on-focus="false"
                               @select="handleSelect($event,'managerNameVal','editBase')"
              ></el-autocomplete>
              <div style="position: absolute; top: 5px; right: 9px; background-color: #fff; color: #808695;">
                <Icon class="haha" id="managerNameVal" v-show="baseInfoEditStatus" @click="editBaseSpuInfo({managerId: Mid}, 'managerNameVal')" type="md-checkmark-circle" slot="suffix" />
              </div>
              <!--<i-input class="iptTest" v-model="managerNameVal" :readonly="!baseInfoEditStatus" placeholder="请输入品牌代码" style="max-width: 250px" >-->
                <!--<Icon class="haha" v-show="baseInfoEditStatus" type="md-checkmark-circle" slot="suffix" />-->
              <!--</i-input>-->
            </div>
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">SPU编码:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="spuCodeVal" v-on:input="preExtraInput('spuCodeVal',{spuCode: spuCodeVal},'editBase')" v-on:on-keydown="textValChange('spuCodeVal',{spuCode: spuCodeVal},'editBase', $event)" :readonly="!baseInfoEditStatus" placeholder="请输入SPU编码" style="max-width: 250px" >
                <Icon class="haha" id="spuCodeVal" v-show="baseInfoEditStatus" @click="editBaseSpuInfo({spuCode: spuCodeVal}, 'spuCodeVal')" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<div class="spuInfoName">KUB-0501</div>-->
          </div>
        </div>
        <!-- spu 基本信息 商品名称 品牌名称 spu编码 -->
        <div class="spuInfoItem">
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">商品ID:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="goodsIdVal" v-on:input="preExtraInput('goodsIdVal',{spuGoodsId: goodsIdVal},'editBase')" v-on:on-keydown="textValChange('goodsIdVal',{spuGoodsId: goodsIdVal},'editBase', $event)" :readonly="!baseInfoEditStatus" placeholder="请输入商品ID" style="max-width: 250px" >
                <Icon class="haha" id="goodsIdVal" v-show="baseInfoEditStatus" @click="editBaseSpuInfo({spuGoodsId: goodsIdVal}, 'goodsIdVal')" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">521546845662</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">品牌代码:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="pinpaiCodeVal" :readonly="true" placeholder="请输入品牌代码" style="max-width: 250px" >
                <Icon class="haha" v-show="baseInfoEditStatus" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<div class="spuInfoName">KUB</div>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">产品小组:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="groupNameVal" v-on:input="preExtraInput('groupNameVal',{groupName: groupNameVal},'editBase')" v-on:on-keydown="textValChange('groupNameVal',{groupName: groupNameVal},'editBase', $event)" :readonly="!baseInfoEditStatus" placeholder="请输入小组名称" style="max-width: 250px" >
                <Icon class="haha" id="groupNameVal" v-show="baseInfoEditStatus" @click="editBaseSpuInfo({groupName: groupNameVal}, 'groupNameVal')" type="md-checkmark-circle" slot="suffix" />
              </i-input>
              <div class="jiagouInfo" v-show="!groupId && baseInfoEditStatus">请先创建产品小组</div>
              <div class="jiagou" v-show="groupId && baseInfoEditStatus" @click="member">成员管理</div>
            </div>
          </div>
        </div>
        <div class="spuInfoItem" style="text-align: right">
          <div v-if="editFlag"><Button type="primary" @click="baseEditBtn">{{baseEditBtnText}}</Button></div>
          <div v-if="editFlag" style="margin-top: 15px;"><Button @click="delSpuBtn">删除</Button></div>
        </div>
      </div>
      <!-- spu类目信息 -->
      <div class="spuInfo classify" v-bind:class="classifyEdit">
        <!-- spu 类目信息: 类目 物料类别 系列 使用人群 商品角色 -->
        <div class="spuInfoItem">
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel" style="text-align: justify">类目</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName select">
              <Cascader v-show="classifyInfoEditStatus" :data="options" @on-change="changeTree($event,'categoryCodeList',{categoryName: categoryCodeVal},'editExtra')" trigger="hover" v-model="categoryCodeList"></Cascader>
              <div style="position: absolute; top: 5px; right: 9px; background-color: #fff; color: #808695;">
                <Icon class="haha" v-show="classifyInfoEditStatus" id="categoryCodeList" @click="editExtraSpuInfo({categoryName: categoryCodeVal},'categoryCodeList')" type="md-checkmark-circle" slot="suffix" />
              </div>
              <i-input class="iptTest" v-show="!classifyInfoEditStatus" v-model="classifyNameVal" :readonly="!classifyInfoEditStatus" placeholder="请选择类目" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">物料类别</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName select">
              <Select v-model="objClassifyCodeVal" v-show="classifyInfoEditStatus" @on-change="changeValue($event,'objClassifyCodeVal',{materialCode: objClassifyCodeVal},'editExtra')">
                <Option v-for="brand in materialType" :key="brand.dictCode" :value="brand.dictCode">{{ brand.dictName }}</Option>
              </Select>
              <div style="position: absolute; top: 5px; right: 9px; background-color: #fff; color: #808695;">
                <Icon class="haha" v-show="classifyInfoEditStatus" id="objClassifyCodeVal" @click="editExtraSpuInfo({materialCode: objClassifyCodeVal},'objClassifyCodeVal')" type="md-checkmark-circle" slot="suffix" />
              </div>
              <i-input class="iptTest" v-show="!classifyInfoEditStatus" v-model="objClassifyNameVal" :readonly="!classifyInfoEditStatus" placeholder="请选择物料类别" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">成品</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag"></div>
            <div class="spuInfoLabel">系列</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="xilieNameVal" v-on:input="preExtraInput('xilieNameVal',{series: xilieNameVal},'editExtra')" v-on:on-keydown="textValChange('xilieNameVal',{series: xilieNameVal}, 'editExtra', $event)" :readonly="!classifyInfoEditStatus" placeholder="请输入系列" style="max-width: 250px" >
                <Icon class="haha" id="xilieNameVal" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({series: xilieNameVal}, 'xilieNameVal')" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">梦幻世界</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">适用人群</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName select">
              <Select v-model="renqunCodeVal" v-show="classifyInfoEditStatus" @on-change="changeValue($event,'renqunCodeVal',{intendedFor: renqunCodeVal},'editExtra')">
                <Option v-for="brand in intendedFor" :key="brand.dictCode" :value="brand.dictCode">{{ brand.dictName }}</Option>
              </Select>
              <div style="position: absolute; top: 5px; right: 9px; background-color: #fff; color: #808695;">
                <Icon class="haha" v-show="classifyInfoEditStatus" id="renqunCodeVal" @click="editExtraSpuInfo({intendedFor: renqunCodeVal},'renqunCodeVal')" type="md-checkmark-circle" slot="suffix" />
              </div>
              <i-input class="iptTest" v-show="!classifyInfoEditStatus" v-model="renqunNameVal" :readonly="!classifyInfoEditStatus" placeholder="请选择适用人群" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">男/女孩通用</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">商品角色</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName select">
              <Select v-model="goodsRoleNameVal" v-show="classifyInfoEditStatus" @on-change="changeValue($event,'goodsRoleNameVal',{goodsRole: goodsRoleNameVal},'editExtra')">
                <Option v-for="brand in goodsRole" :key="brand.dictCode" :value="brand.dictCode">{{ brand.dictName }}</Option>
              </Select>
              <div style="position: absolute; top: 5px; right: 9px; background-color: #fff; color: #808695;">
                <Icon class="haha" v-show="classifyInfoEditStatus" id="goodsRoleNameVal" @click="editExtraSpuInfo({goodsRole: goodsRoleNameVal},'goodsRoleNameVal')" type="md-checkmark-circle" slot="suffix" />
              </div>
              <i-input class="iptTest" v-show="!classifyInfoEditStatus" v-model="goodsRoleNameVal" :readonly="!classifyInfoEditStatus" placeholder="请选择商品角色" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">S</span>-->
          </div>
          <!--从采购复制-->
          <div class="spuInfoCnt">
            <div class="requiredFlag"></div>
            <div class="spuInfoLabel">采购员</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="caigouNameVal" v-on:input="preExtraInput('caigouNameVal',{buyer: caigouNameVal},'editExtra')" v-on:on-keydown="textValChange('caigouNameVal',{buyer: caigouNameVal},'editExtra', $event)" :readonly="!classifyInfoEditStatus" placeholder="请输入采购员姓名" style="max-width: 250px" >
                <Icon class="haha" id="caigouNameVal" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({buyer: caigouNameVal}, 'caigouNameVal')" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">张三三</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag"></div>
            <div class="spuInfoLabel">产品认证</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="renzhengVal" v-on:input="preExtraInput('renzhengVal',{certification: renzhengVal},'editExtra')" v-on:on-keydown="textValChange('renzhengVal',{certification: renzhengVal},'editExtra', $event)" :readonly="!classifyInfoEditStatus" placeholder="请输入认证信息" style="max-width: 250px" >
                <Icon class="haha" id="renzhengVal" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({certification: renzhengVal}, 'renzhengVal')" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">ISO</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag"></div>
            <div class="spuInfoLabel">起订量</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="qidingVal" v-on:input="preExtraInput('qidingVal',{miniOrder: qidingVal},'editExtra')" v-on:on-keydown="textValChange('qidingVal',{miniOrder: qidingVal},'editExtra', $event)" :readonly="!classifyInfoEditStatus" placeholder="请输入起订量" style="max-width: 250px" >
                <Icon class="haha" id="qidingVal" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({miniOrder: qidingVal}, 'qidingVal')" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">1000</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag"></div>
            <div class="spuInfoLabel">设计组</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="designGroupVal" v-on:input="preExtraInput('designGroupVal',{designGroup: designGroupVal},'editExtra')" v-on:on-keydown="textValChange('designGroupVal',{designGroup: designGroupVal}, 'editExtra', $event)" :readonly="!classifyInfoEditStatus" placeholder="请输入设计组名称" style="max-width: 250px" >
                <Icon class="haha" id="designGroupVal" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({designGroup: designGroupVal}, 'designGroupVal')" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">暴风设计</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag"></div>
            <div class="spuInfoLabel">保质期</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="baozhiqiVal" v-on:input="preExtraInput('baozhiqiVal',{qualityLimit: baozhiqiVal},'editExtra')" v-on:on-keydown="textValChange('baozhiqiVal',{qualityLimit: baozhiqiVal},'editExtra', $event)" :readonly="!classifyInfoEditStatus" placeholder="请输入保质期" style="max-width: 250px" >
                <Icon class="haha" id="baozhiqiVal" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({qualityLimit: baozhiqiVal}, 'baozhiqiVal')" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">长期</span>-->
          </div>
          <!---->
        </div>
        <!-- spu 类目信息: 物料代码 主材质 设计元素 使用阶段 适用场景 -->
        <div class="spuInfoItem">
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">物料代码</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="wuliaoCodeVal" :readonly="true" placeholder="请输入物料代码" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">ABCDE</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">主材质</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="zhucaizhiVal" v-on:input="preExtraInput('zhucaizhiVal',{mainMaterial: zhucaizhiVal},'editExtra')" v-on:on-keydown="textValChange('zhucaizhiVal',{mainMaterial: zhucaizhiVal},'editExtra', $event)" :readonly="!classifyInfoEditStatus" placeholder="请输入主材质名称" style="max-width: 250px" >
                <Icon class="haha" id="zhucaizhiVal" v-show="classifyInfoEditStatus" type="md-checkmark-circle" slot="suffix" @click="editExtraSpuInfo({mainMaterial: zhucaizhiVal}, 'zhucaizhiVal')" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">XPE</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag"></div>
            <div class="spuInfoLabel">设计元素</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="designEleVal" v-on:input="preExtraInput('designEleVal',{element: designEleVal},'editExtra')" v-on:on-keydown="textValChange('designEleVal',{element: designEleVal},'editExtra', $event)" :readonly="!classifyInfoEditStatus" placeholder="请输入设计元素" style="max-width: 250px" >
                <Icon class="haha" id="designEleVal" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({element: designEleVal}, 'designEleVal')" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">花朵</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">使用阶段</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName select">
              <Select v-model="jieduanCodeVal" v-show="classifyInfoEditStatus" @on-change="changeValue($event,'jieduanCodeVal',{usageStage: jieduanCodeVal},'editExtra')">
                <Option v-for="brand in usageStage" :key="brand.dictCode" :value="brand.dictCode">{{ brand.dictName }}</Option>
              </Select>
              <div style="position: absolute; top: 5px; right: 9px; background-color: #fff; color: #808695;">
                <Icon class="haha" id="jieduanCodeVal" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({usageStage: jieduanCodeVal}, 'jieduanCodeVal')" type="md-checkmark-circle" slot="suffix" />
              </div>
              <i-input class="iptTest" v-show="!classifyInfoEditStatus" v-model="jieduanVal" :readonly="!classifyInfoEditStatus" placeholder="请选择使用阶段" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">0-6岁</span>-->
          </div>
          <!--从采购复制-->
          <div class="spuInfoCnt">
            <div class="requiredFlag"></div>
            <div class="spuInfoLabel">采购组</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="caigouGroupVal" v-on:input="preExtraInput('caigouGroupVal',{buyerGroup: caigouGroupVal},'editExtra')" v-on:on-keydown="textValChange('caigouGroupVal',{buyerGroup: caigouGroupVal}, 'editExtra', $event)" :readonly="!classifyInfoEditStatus" placeholder="请输入采购组名称" style="max-width: 250px" >
                <Icon class="haha" id="caigouGroupVal" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({buyerGroup: caigouGroupVal}, 'caigouGroupVal')" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">李四采购组</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag"></div>
            <div class="spuInfoLabel">是否专利</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName select">
              <Select v-model="zhuanliVal" v-show="classifyInfoEditStatus" @on-change="changeValue($event,'zhuanliVal',{patents: zhuanliVal},'editExtra')">
                <Option v-for="brand in zhuanliOption" :key="brand.dictCode" :value="brand.dictCode">{{ brand.dictName }}</Option>
              </Select>
              <div style="position: absolute; top: 5px; right: 9px; background-color: #fff; color: #808695;">
                <Icon class="haha" v-show="classifyInfoEditStatus" id="zhuanliVal" @click="editExtraSpuInfo({patents: zhuanliVal},'zhuanliVal')" type="md-checkmark-circle" slot="suffix" />
              </div>
              <i-input class="iptTest" v-show="!classifyInfoEditStatus" v-model="patentName" :readonly="!classifyInfoEditStatus" placeholder="请选择是否专利" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">是</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag"></div>
            <div class="spuInfoLabel">生产周期</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="zhouqiVal" v-on:input="preExtraInput('zhouqiVal',{productCycle: zhouqiVal},'editExtra')" v-on:on-keydown="textValChange('zhouqiVal',{productCycle: zhouqiVal},'editExtra', $event)" :readonly="!classifyInfoEditStatus" placeholder="请输入生产周期" style="max-width: 250px" >
                <Icon class="haha" id="zhouqiVal" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({productCycle: zhouqiVal}, 'zhouqiVal')" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">3个月</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag"></div>
            <div class="spuInfoLabel moreWords">配色设计师</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="colorDesignerVal" v-on:input="preExtraInput('colorDesignerVal',{colorDesigner: colorDesignerVal},'editExtra')" v-on:on-keydown="textValChange('colorDesignerVal',{colorDesigner: colorDesignerVal},'editExtra', $event)" :readonly="!classifyInfoEditStatus" placeholder="请输入配色设计师" style="max-width: 250px" >
                <Icon class="haha" id="colorDesignerVal" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({colorDesigner: colorDesignerVal}, 'colorDesignerVal')" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">王五</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag"></div>
            <div class="spuInfoLabel">是否保修</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName select">
              <Select v-model="baoxiuVal" v-show="classifyInfoEditStatus" @on-change="changeValue($event,'baoxiuVal',{rapair: baoxiuVal},'editExtra')">
                <Option v-for="brand in baoxiuOption" :key="brand.dictCode" :value="brand.dictCode">{{ brand.dictName }}</Option>
              </Select>
              <div style="position: absolute; top: 5px; right: 9px; background-color: #fff; color: #808695;">
                <Icon class="haha" v-show="classifyInfoEditStatus" id="baoxiuVal" @click="editExtraSpuInfo({rapair: baoxiuVal},'baoxiuVal')" type="md-checkmark-circle" slot="suffix" />
              </div>
              <i-input class="iptTest" v-show="!classifyInfoEditStatus" v-model="rapairName" :readonly="!classifyInfoEditStatus" placeholder="请选择是否保修" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">否</span>-->
          </div>
          <!---->
          <div class="spuInfoCnt">
            <div class="requiredFlag"></div>
            <div class="spuInfoLabel">适用场景</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName select">
              <Select v-model="changjingValArr" multiple v-show="classifyInfoEditStatus" @on-change="changeValue($event,'changjingValArr')">
                <Option v-for="brand in changjingArr" :key="brand.dictCode" :value="brand.dictCode">{{ brand.dictName }}</Option>
              </Select>
              <div style="position: absolute; top: 5px; right: 9px; background-color: #fff; color: #808695;">
                <Icon class="haha" v-show="classifyInfoEditStatus" id="changjingValArr" @click="editExtraSpuInfo({scene: changCodeVal},'changjingValArr')" type="md-checkmark-circle" slot="suffix" />
              </div>
              <i-input class="iptTest" v-show="!classifyInfoEditStatus" v-model="changjingVal" :readonly="!classifyInfoEditStatus" placeholder="请选择适用场景" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">玩教场景</span>-->
          </div>
          <!---->
        </div>
        <!-- spu 类目信息: 类目编码 品牌代码 单位 造型 风格 -->
        <div class="spuInfoItem">
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">类目编码</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="classifyCodeVal" v-on:input="preExtraInput('classifyCodeVal',{categoryCode: classifyCodeVal},'editExtra')" v-on:on-keydown="textValChange('classifyCodeVal',{categoryCode: classifyCodeVal}, 'editExtra', $event)" :readonly="!classifyInfoEditStatus" placeholder="请输入类目编码" style="max-width: 250px" >
                <Icon class="haha" id="classifyCodeVal" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({categoryCode: classifyCodeVal},'classifyCodeVal')" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">SL</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">单位</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="danweiVal" v-on:input="preExtraInput('danweiVal',{unit: danweiVal},'editExtra')" v-on:on-keydown="textValChange('danweiVal',{unit: danweiVal}, 'editExtra', $event)" :readonly="!classifyInfoEditStatus" placeholder="请输入计量单位" style="max-width: 250px" >
                <Icon class="haha" id="danweiVal" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({unit: danweiVal}, 'danweiVal')" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">件</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag"></div>
            <div class="spuInfoLabel">造型</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="zaoxingVal" v-on:input="preExtraInput('zaoxingVal',{shape: zaoxingVal},'editExtra')" v-on:on-keydown="textValChange('zaoxingVal',{shape: zaoxingVal},'editExtra', $event)" :readonly="!classifyInfoEditStatus" placeholder="请输入所属造型" style="max-width: 250px" >
                <Icon class="haha" id="zaoxingVal" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({shape: zaoxingVal}, 'zaoxingVal')" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">长方形</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">风格</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName select">
              <Select v-model="fenggeCodeVal" v-show="classifyInfoEditStatus" @on-change="changeValue($event,'fenggeCodeVal',{style: fenggeCodeVal},'editExtra')">
                <Option v-for="brand in desStyle" :key="brand.dictCode" :value="brand.dictCode">{{ brand.dictName }}</Option>
              </Select>
              <div style="position: absolute; top: 5px; right: 9px; background-color: #fff; color: #808695;">
                <Icon class="haha" v-show="classifyInfoEditStatus" id="fenggeCodeVal" @click="editExtraSpuInfo({style: fenggeCodeVal},'fenggeCodeVal')" type="md-checkmark-circle" slot="suffix" />
              </div>
              <i-input class="iptTest" v-show="!classifyInfoEditStatus" v-model="fenggeVal" :readonly="!classifyInfoEditStatus" placeholder="请输入所属风格" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">可爱</span>-->
          </div>
          <!--从采购复制-->
          <div class="spuInfoCnt">
            <div class="requiredFlag"></div>
            <div class="spuInfoLabel">执行标准</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="zhixingVal" v-on:input="preExtraInput('zhixingVal',{standard: zhixingVal},'editExtra')" v-on:on-keydown="textValChange('zhixingVal',{standard: zhixingVal},'editExtra', $event)" :readonly="!classifyInfoEditStatus" placeholder="请输入执行标准" style="max-width: 250px" >
                <Icon class="haha" id="zhixingVal" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({standard: zhixingVal}, 'zhixingVal')" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">SL</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag"></div>
            <div class="spuInfoLabel moreWords">供应商名称</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="gongyingVal" v-on:input="preExtraInput('gongyingVal',{supplier: gongyingVal},'editExtra')" v-on:on-keydown="textValChange('gongyingVal',{supplier: gongyingVal},'editExtra', $event)" :readonly="!classifyInfoEditStatus" placeholder="请输入供应商名称" style="max-width: 250px" >
                <Icon class="haha" id="gongyingVal" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({supplier: gongyingVal}, 'gongyingVal')" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">KUB可优比</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag"></div>
            <div class="spuInfoLabel">备货周期</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="beihuozqVal" v-on:input="preExtraInput('beihuozqVal',{stockCycle: beihuozqVal},'editExtra')" v-on:on-keydown="textValChange('beihuozqVal',{stockCycle: beihuozqVal},'editExtra', $event)" :readonly="!classifyInfoEditStatus" placeholder="请输入备货周期" style="max-width: 250px" >
                <Icon class="haha" id="beihuozqVal" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({stockCycle: beihuozqVal}, 'beihuozqVal')" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<div class="spuInfoName">3个月</div>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag"></div>
            <div class="spuInfoLabel moreWords">包装设计师</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="baozhuangVal" v-on:input="preExtraInput('baozhuangVal',{packageDesigner: baozhuangVal},'editExtra')" v-on:on-keydown="textValChange('baozhuangVal',{packageDesigner: baozhuangVal},'editExtra', $event)" :readonly="!classifyInfoEditStatus" placeholder="请输入包装设计师" style="max-width: 250px" >
                <Icon class="haha" id="baozhuangVal" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({packageDesigner: baozhuangVal}, 'baozhuangVal')" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">赵六</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag"></div>
            <div class="spuInfoLabel">保修期</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="baoxiuqiVal" v-on:input="preExtraInput('baoxiuqiVal',{rapairLimit: baoxiuqiVal},'editExtra')" v-on:on-keydown="textValChange('baoxiuqiVal',{rapairLimit: baoxiuqiVal},'editExtra', $event)" :readonly="!classifyInfoEditStatus" placeholder="请输入保修期" style="max-width: 250px" >
                <Icon class="haha" id="baoxiuqiVal" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({rapairLimit: baoxiuqiVal}, 'baoxiuqiVal')" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">12个月</span>-->
          </div>
          <!---->
        </div>
        <!-- spu 类目信息:商品等级 产品组成 季节 是否赠品 -->
        <div class="spuInfoItem">
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">商品等级</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName select">
              <Select v-model="dengjiVal" v-show="classifyInfoEditStatus" @on-change="changeValue($event,'dengjiVal',{level: dengjiVal},'editExtra')">
                <Option v-for="brand in goodsLevel" :key="brand.dictCode" :value="brand.dictCode">{{ brand.dictName }}</Option>
              </Select>
              <div style="position: absolute; top: 5px; right: 9px; background-color: #fff; color: #808695;">
                <Icon class="haha" id="dengjiVal" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({level: dengjiVal}, 'dengjiVal')" type="md-checkmark-circle" slot="suffix" />
              </div>
              <i-input class="iptTest" v-show="!classifyInfoEditStatus" v-model="dengjiVal" :readonly="!classifyInfoEditStatus" placeholder="请选择商品等级" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">3</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag"></div>
            <div class="spuInfoLabel">产品组成</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="zuchengVal" v-on:input="preExtraInput('zuchengVal',{makeup: zuchengVal},'editExtra')" v-on:on-keydown="textValChange('zuchengVal',{makeup: zuchengVal},'editExtra', $event)" :readonly="!classifyInfoEditStatus" placeholder="请输入产品组成" style="max-width: 250px" >
                <Icon class="haha" id="zuchengVal" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({makeup: zuchengVal}, 'zuchengVal')" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">爬行垫</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">季节</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName select">
              <Select v-model="jijieCodeVal" v-show="classifyInfoEditStatus" @on-change="changeValue($event,'jijieCodeVal',{season: jijieCodeVal},'editExtra')">
                <Option v-for="brand in season" :key="brand.dictCode" :value="brand.dictCode">{{ brand.dictName }}</Option>
              </Select>
              <div style="position: absolute; top: 5px; right: 9px; background-color: #fff; color: #808695;">
                <Icon class="haha" v-show="classifyInfoEditStatus" id="jijieCodeVal" @click="editExtraSpuInfo({season: jijieCodeVal},'jijieCodeVal')" type="md-checkmark-circle" slot="suffix" />
              </div>
              <i-input class="iptTest" v-show="!classifyInfoEditStatus" v-model="jijieVal" :readonly="!classifyInfoEditStatus" placeholder="请选择季节" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">四季</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">是否赠品</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName select">
              <Select v-model="zengpinVal" v-show="classifyInfoEditStatus" @on-change="changeValue($event,'zengpinVal',{giveaway: zengpinVal},'editExtra')">
                <Option v-for="brand in zengArr" :key="brand.dictCode" :value="brand.dictCode">{{ brand.dictName }}</Option>
              </Select>
              <div style="position: absolute; top: 5px; right: 9px; background-color: #fff; color: #808695;">
                <Icon class="haha" v-show="classifyInfoEditStatus" id="zengpinVal" @click="editExtraSpuInfo({giveaway: zengpinVal},'zengpinVal')" type="md-checkmark-circle" slot="suffix" />
              </div>
              <i-input class="iptTest" v-show="!classifyInfoEditStatus" v-model="giveawayName" :readonly="!classifyInfoEditStatus" placeholder="请选择是否赠品" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">商品</span>-->
          </div>
          <!--从采购复制-->
          <div class="spuInfoCnt">
            <div class="requiredFlag"></div>
            <div class="spuInfoLabel">安全类型</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="anquanLxVal" v-on:input="preExtraInput('anquanLxVal',{safetyType: anquanLxVal},'editExtra')" v-on:on-keydown="textValChange('anquanLxVal',{safetyType: anquanLxVal}, 'editExtra', $event)" :readonly="!classifyInfoEditStatus" placeholder="请输入安全类型" style="max-width: 250px" >
                <Icon class="haha" id="anquanLxVal" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({safetyType: anquanLxVal}, 'anquanLxVal')" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">3</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag"></div>
            <div class="spuInfoLabel">产地</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="chandiVal" v-on:input="preExtraInput('chandiVal',{productArea: chandiVal},'editExtra')" v-on:on-keydown="textValChange('chandiVal',{productArea: chandiVal},'editExtra', $event)" :readonly="!classifyInfoEditStatus" placeholder="请输入产地" style="max-width: 250px" >
                <Icon class="haha" id="chandiVal" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({productArea: chandiVal}, 'chandiVal')" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">安吉</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag"></div>
            <div class="spuInfoLabel">安全库存</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="kucunVal" v-on:input="preExtraInput('kucunVal',{safetyStock: kucunVal},'editExtra')" v-on:on-keydown="textValChange('kucunVal',{safetyStock: kucunVal},'editExtra', $event)" :readonly="!classifyInfoEditStatus" placeholder="请输入安全库存" style="max-width: 250px" >
                <Icon class="haha" id="kucunVal" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({safetyStock: kucunVal}, 'kucunVal')" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">1000</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag"></div>
            <div class="spuInfoLabel moreWords">结构设计师</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="jiegouDesignVal" v-on:input="preExtraInput('jiegouDesignVal',{structureDesigner: jiegouDesignVal},'editExtra')" v-on:on-keydown="textValChange('jiegouDesignVal',{structureDesigner: jiegouDesignVal}, 'editExtra', $event)" :readonly="!classifyInfoEditStatus" placeholder="请输入设计师名称" style="max-width: 250px" >
                <Icon class="haha" id="jiegouDesignVal" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({structureDesigner: jiegouDesignVal}, 'jiegouDesignVal')" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">王二</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag"></div>
            <div class="spuInfoLabel">保修单位</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="baoxiudwVal" v-on:input="preExtraInput('baoxiudwVal',{rapairUnit: baoxiudwVal},'editExtra')" v-on:on-keydown="textValChange('baoxiudwVal',{rapairUnit: baoxiudwVal},'editExtra', $event)" :readonly="!classifyInfoEditStatus" placeholder="请输入保修单位" style="max-width: 250px" >
                <Icon class="haha" id="baoxiudwVal" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({rapairUnit: baoxiudwVal}, 'baoxiudwVal')" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">KUB售后</span>-->
          </div>
          <!---->
        </div>
        <!-- spu 类目信息: 编辑按钮 -->
        <div class="spuInfoItem">
          <div style="float: right" v-if="ExtraEditFlag"><Button type="primary" @click="classifyEditBtn">{{classifyEditBtnText}}</Button></div>
          <!--<div style=""><Button @click="testPreSub">测试</Button></div>-->
        </div>
      </div>
    </div>
    <!-- spu沟通记录 -->
    <Drawer
      title="成员管理"
      width="740"
      :closable="false"
      v-model="DrawerMember"
      v-loading="DrawerMemberShow"
    >
      <component
        v-bind:is="compArr.member"
        v-bind:proId="proId"
        v-bind:groupIds="groupId"
        v-bind:DrawerMemberShow="DrawerMember"
        @refshGroup="refshGroup"
      ></component>
    </Drawer>
    <!---->
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="dialogShowImg">
      <!--spuBaseImgList-->
      <el-carousel indicator-position="outside" :autoplay="false" :initial-index="imgPreIniIndex" width="700px" height="700px">
        <el-carousel-item v-for="(item, index) in spuBaseImgList" :key="item + '_' + index">
          <div class="showImg">
            <img :src="item.previewUrl" alt style="width: 100%">
          </div>
        </el-carousel-item>
      </el-carousel>
      <!--<div class="showImg">-->
        <!--<img :src="bigPreImg" alt style="width: 100%">-->
      <!--</div>-->
    </el-dialog>
    <!--<div class="communication">沟通记录</div>-->
  </div>
</template>

<script>
import FileUploadComp from '././FileUploadComp.vue'
import member from './members.vue'
// $(document).ready(function () {
//   $('input').keydown(function (event) {
//     console.log(event.which)
//   })
// })
export default {
  name: 'GoodsFileSpuInfo',
  components: {
    member,
    FileUploadComp
  },
  data () {
    return {
      preBaseArr: [],
      preExtraArr: [],
      imgPreIniIndex: 0,
      selectData: {},
      imgUrl: '',
      dialogShowImg: false,
      DrawerMember: false,
      proId: this.$route.params.spuId,
      DrawerMemberShow: false,
      Mid: '',
      autoCompleteNamesPayload: {
        projectManager: ''
      },
      addIcon: true,
      filUrl: '/file/uploadGoodsFileAjax',
      FileUploadArr: [],
      IsClear: false,
      // 引入组件
      compArr: {
        member: 'member',
        FileUploadComp: 'FileUploadComp'
      },
      bigPreImg: 'https://ityp.baho.cn:8094/images/defult.png',
      currentPreId: '',
      bigPreOffsetTop: 0,
      bigPreOffsetLeft: 0,
      spuBaseImgList: [],
      classifyEdit: 'readonly',
      classifyInfoEditStatus: false,
      classifyEditBtnText: '编辑',
      baseEdit: 'readonly',
      editFlag: false,
      ExtraEditFlag: false,
      baseInfoEditStatus: false,
      baseEditBtnText: '编辑',
      // 基本信息 商品名称
      goodsNameVal: '',
      // 基本信息 品牌名称
      pinpaiNameVal: 'KUB可优比',
      pinpaiCodeVal: '',
      // 基本信息 产品小组
      groupNameVal: '学爬健身组',
      // 基本信息 小组ID
      groupId: '',
      // 基本信息 spu编码
      spuCodeVal: 'KUB-0501',
      // 基本信息 商品ID
      goodsIdVal: '2019514536',
      // 基本信息 品牌代码
      // pinpaiCodeVal: 'KUB',
      // 基本信息 负责人
      managerNameVal: '张三（XX事业部经理）',
      // 类目 所属类目
      categoryCodeList: [],
      classifyNameVal: '',
      // 类目 物料类别
      objClassifyNameVal: '成品',
      objClassifyCodeVal: '',
      // 类目 系列
      xilieNameVal: '梦幻世界',
      // 类目 适用人群
      renqunNameVal: '男/女孩通用',
      renqunCodeVal: '',
      // 类目 商品角色
      goodsRoleNameVal: '',
      // 类目 采购员
      caigouNameVal: '张三三',
      // 类目 产品认证
      renzhengVal: 'ISO',
      // 类目 起订量
      qidingVal: 1000,
      // 类目 设计组
      designGroupVal: '暴风设计',
      // 类目 保质期
      baozhiqiVal: '长期',
      // 类目 物料代码
      wuliaoCodeVal: 'ABCDE',
      // 类目 主材质
      zhucaizhiVal: 'XPE',
      // 类目 设计元素
      designEleVal: '花朵',
      // 类目 使用阶段
      jieduanVal: '0-6岁',
      jieduanCodeVal: '',
      // 类目 适用场景
      changjingVal: '玩教场景',
      // 类目 采购组
      caigouGroupVal: '李四采购组',
      // 类目 是否专利
      zhuanliVal: '是',
      patentName: '',
      // 类目 生产周期
      zhouqiVal: '是',
      // 类目 配色设计师
      colorDesignerVal: '王五',
      // 类目 3 是否保修
      baoxiuVal: '是',
      rapairName: '否',
      // 类目 3 类目编码
      classifyCodeVal: 'SL',
      // 类目 3 单位
      danweiVal: '是',
      // 类目 3 造型
      zaoxingVal: '长方形',
      // 类目 3 风格
      fenggeVal: '可爱',
      fenggeCodeVal: '',
      // 类目 3 执行标准
      zhixingVal: '可爱',
      // 类目 3 供应商名称
      gongyingVal: 'KUB可优比',
      // 类目 3 备货周期
      beihuozqVal: '三个月',
      // 类目 3 包装设计师
      baozhuangVal: '赵六',
      // 类目 3 保修期
      baoxiuqiVal: '12个月',
      // 类目 4 商品等级
      dengjiVal: 3,
      // 类目 4 产品组成
      zuchengVal: '爬行垫',
      // 类目 4 季节
      jijieVal: '四季',
      jijieCodeVal: '',
      // 类目 4 是否赠品
      zengpinVal: '商品',
      giveawayName: '',
      // 类目 4 安全类型
      anquanLxVal: '3',
      // 类目 4 产地
      chandiVal: '安吉',
      // 类目 4 安全库存
      kucunVal: '10000',
      // 类目 4 结构设计师
      jiegouDesignVal: '12个月',
      // 类目 4 保修单位
      baoxiudwVal: 'KUB售后',
      // 临时数据
      spuId: this.$route.params.spuId,
      ExtraSpuInfoId: '',
      dropdownShow: false,
      customM: 'custom',
      brandTypeArr: [],
      materialType: [],
      intendedFor: [],
      goodsRole: [],
      usageStage: [],
      zhuanliOption: [
        {
          dictCode: 0,
          dictName: '否'
        },
        {
          dictCode: 1,
          dictName: '是'
        }
      ],
      baoxiuOption: [
        {
          dictCode: 0,
          dictName: '否'
        },
        {
          dictCode: 1,
          dictName: '是'
        }
      ],
      zengArr: [
        {
          dictCode: 0,
          dictName: '否'
        },
        {
          dictCode: 1,
          dictName: '是'
        }
      ],
      changjingValArr: [],
      changjingArr: [],
      changCodeVal: '',
      desStyle: [],
      goodsLevel: [],
      season: [],
      options: [],
      values: [],
      categoryCodeVal: ''
    }
  },
  watch: {
    managerNameVal (val, old) {
      // this.log('kkkkk:', val)
    },
    baseInfoEditStatus (newval, oldval) {
      this.baseEditBtnText = newval ? '结束' : '编辑'
      this.baseEdit = newval ? 'baseEdit' : 'readonly'
      if (newval) {
        // j
      }
    },
    classifyInfoEditStatus (newval, oldval) {
      // this.classifyInfoEditStatus = !this.classifyInfoEditStatus
      this.classifyEditBtnText = newval ? '结束' : '编辑'
      this.classifyEdit = newval ? 'classifyEdit' : 'readonly'
    },
    classifyNameVal (val, old) {
      // this.log('classifyNameVal:', val)
    },
    changjingValArr (val, old) {
      // this.log('适用场景：', val)
      var str = ''
      if (val.length > 0) {
        for (var i = 0; i < val.length; i++) {
          var dou = ','
          if (i === (val.length - 1)) {
            dou = ''
          }
          str = str + val[i] + dou
        }
        this.changCodeVal = str
      }
    },
    spuBaseImgList (val, old) {
      if (val.length === 0) {
        this.bigPreImg = 'https://ityp.baho.cn:8094/images/defult.png'
        this.currentPreId = ''
      }
    },
    FileUploadArr (val, old) {
      if (val.length >= 5) {
        this.addIcon = false
      } else {
        this.addIcon = true
      }
    }
  },
  created () {
    // this.log('suiD', this.spuId)
    // spu基础信息
    this.querySpuBaseInfo()
    // spu附属信息
    this.queryExtraSpuInfo()
    // 查询下来选择
    this.queryOptionType()
    // 查询类目 树结构
    this.queryClassifyTree()
  },
  methods: {
    // 刷新
    refshGroup (res) {
      if (res.code === 200) {
        this.querySpuBaseInfo()
      }
    },
    delSpuBtn: function () {
      var that = this
      this.$Modal.confirm({
        title: '确认要删除？',
        content: '正在执行删除SPU操作，此操作不可恢复',
        onOk: () => {
          this.ajax('/archives/delSpu', {spuId: that.spuId}).then(res => {
            if (res.code === 200) {
              that.$Message.success('删除spu成功')
              that.$router.push('/GoodsArchives')
            }
          })
        },
        onCancel: () => {
          // this.$Message.info('Clicked cancel')
        }
      })
    },
    moveLeft: function (currentId) {
      // j  spuBaseImgList FileUploadArr
      var that = this
      var imgPosIndex = -1
      for (var i = 0; i < that.spuBaseImgList.length; i++) {
        if (that.spuBaseImgList[i].id === currentId) {
          imgPosIndex = i
          break
        }
      }
      if (imgPosIndex > 0) {
        // var targetImgData = that.spuBaseImgList[imgPosIndex]
        that.spuBaseImgList.splice(imgPosIndex - 1, 0, that.spuBaseImgList[imgPosIndex])
        that.spuBaseImgList.splice(imgPosIndex + 1, 1)
        that.FileUploadArr.splice(imgPosIndex - 1, 0, that.FileUploadArr[imgPosIndex])
        that.FileUploadArr.splice(imgPosIndex + 1, 1)
        that.editBaseSpuInfo({attachmentId: that.SetFileIdStr()})
      }
    },
    moveRight: function (currentId) {
      var that = this
      var imgPosIndex = -1
      for (var i = 0; i < that.spuBaseImgList.length; i++) {
        if (that.spuBaseImgList[i].id === currentId) {
          imgPosIndex = i
          break
        }
      }
      if (imgPosIndex < (that.spuBaseImgList.length - 1)) {
        // var targetImgData = that.spuBaseImgList[imgPosIndex]
        that.spuBaseImgList.splice(imgPosIndex, 0, that.spuBaseImgList[imgPosIndex + 1])
        that.spuBaseImgList.splice(imgPosIndex + 2, 1)
        that.FileUploadArr.splice(imgPosIndex, 0, that.FileUploadArr[imgPosIndex + 1])
        that.FileUploadArr.splice(imgPosIndex + 2, 1)
        that.editBaseSpuInfo({attachmentId: that.SetFileIdStr()})
      }
    },
    inputkeydown: function (e) {
      if (e.which === 13) {
        // j this.selectData  @click="editBaseSpuInfo({brandCode: pinpaiCodeVal},'pinpaiNameVal')"
        if (this.selectData.type === 'editBase') {
          this.editBaseSpuInfo(this.selectData.obj, this.selectData.flag)
        } else if (this.selectData.type === 'editExtra') {
          // @click="editExtraSpuInfo({materialCode: objClassifyCodeVal},'objClassifyCodeVal')"
          this.editExtraSpuInfo(this.selectData.obj, this.selectData.flag)
        }
      }
    },
    testKeydown: function (e) {
      this.log('pppp:', e)
      // j
    },
    bigPre: function () {
      var that = this
      // this.currentPreId spuBaseImgList
      var imgIndex = -1
      for (var i = 0; i < that.spuBaseImgList.length; i++) {
        if (that.currentPreId === that.spuBaseImgList[i].id) {
          imgIndex = i
          break
        }
      }
      this.imgPreIniIndex = imgIndex > -1 ? imgIndex : 0
      this.dialogShowImg = true
    },
    testFileList: function () {
      // FileUploadArr
      this.log('spuBaseImgList:', this.spuBaseImgList)
      this.log('FileUploadArr:', this.FileUploadArr)
      this.log('currentPreId:', this.currentPreId)
      this.log('bigPreImg:', this.bigPreImg)
    },
    testPreSub: function () {
      this.log('preBaseArr:', this.preBaseArr)
      this.log('preExtraArr:', this.preExtraArr)
    },
    preExtraInput: function (name, obj, type) {
      var that = this
      that.preSubFuc(name, obj, type)
    },
    // 预存
    preSubFuc: function (name, obj, type) {
      var that = this
      // editExtra preExtraArr preBaseArr
      // this.preExtraArr = []
      var preType = type === 'editExtra' ? 'preExtraArr' : 'preBaseArr'
      var preobj = {
        targetName: name,
        targetData: obj,
        targetType: type
      }
      console.log(that[preType])
      var posindex = -1
      for (var r = 0; r < that[preType].length; r++) {
        if (that[preType][r].targetName === name) {
          posindex = r
        }
      }
      if (posindex >= 0) {
        that[preType].splice(posindex, 1, preobj)
      } else {
        that[preType].push(preobj)
      }
    },
    textValChange: function (flag, obj, editType, e) {
      // var obj = e.currentTarget
      var that = this
      if (e.keyCode === 13) {
        // k
        if (editType === 'editBase') {
          var pinBaseObj = {}
          var moreBaseFlag = that.preBaseArr.length >= 1 ? 'more' : 'single'
          for (var k = 0; k < that.preBaseArr.length; k++) {
            $.extend(pinBaseObj, that.preBaseArr[k].targetData)
          }
          that.editBaseSpuInfo(pinBaseObj, flag, moreBaseFlag)
          // that.editBaseSpuInfo(obj, flag)
        } else if (editType === 'editExtra') {
          var pinObj = {}
          var moreFlag = that.preExtraArr.length >= 1 ? 'more' : 'single'
          for (var n = 0; n < that.preExtraArr.length; n++) {
            $.extend(pinObj, that.preExtraArr[n].targetData)
          }
          that.editExtraSpuInfo(pinObj, flag, moreFlag)
        }
      } else {
        $('#' + flag).css('color', '#2d8cf0')
      }
    },
    // 改变下拉框
    // changeValue($event,'goodsRoleNameVal',{goodsRole: goodsRoleNameVal},'editExtra')
    changeValue (e, name, obj, type) {
      var that = this
      that.preSubFuc(name, obj, type)
      this.preSubArr = []
      var preobj = {
        targetName: name,
        targetData: obj,
        targetType: type
      }
      var posindex = -1
      for (var r = 0; r < that.preSubArr.length; r++) {
        if (that.preSubArr[r].targetName === name) {
          posindex = r
        }
      }
      if (posindex >= 0) {
        that.preSubArr.splice(posindex, 1, preobj)
      } else {
        that.preSubArr.push(preobj)
      }
      $('.iptHidden').focus()
      this.selectData = {
        obj: obj,
        type: type,
        flag: name
      }
      // $event,'pinpaiNameVal',{brandCode: pinpaiCodeVal},'editBase'
      $('#' + name).css('color', '#2d8cf0')
    },
    member () {
      this.DrawerMember = true
    },
    // 新建 人员选择
    handleSelect (item, flag, type) {
      this.Mid = item.userId
      this.changeValue('e', flag, {managerId: item.userId}, type)
    },
    // 新建 搜索选择项目负责人
    querySearchAsync (queryString, cb) {
      var that = this
      if (queryString) {
        that.autoCompleteNamesPayload.projectManager = queryString
        this.ajax('/myProject/autoCompleteNames', that.autoCompleteNamesPayload).then(res => {
          // that.log('autoCompleteNames:', res)
          if (res.code === 200) {
            var dddarr = []
            if (res.data.length > 0) {
              for (var i = 0; i < res.data.length; i++) {
                var obj = {}
                obj.value = res.data[i].Name + ' (' + res.data[i].jName + ')'
                obj.userId = res.data[i].ID
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
    baseEditBtn: function () {
      // preBaseArr: [],
      // preExtraArr: [],
      var that = this
      if (this.preBaseArr.length > 0) {
        this.$Modal.confirm({
          title: '有修改项未保存',
          content: '基本信息有修改项未保存，是否保存？',
          onOk: () => {
            var pinBaseObj = {}
            var moreBaseFlag = that.preBaseArr.length >= 1 ? 'more' : 'single'
            for (var k = 0; k < that.preBaseArr.length; k++) {
              $.extend(pinBaseObj, that.preBaseArr[k].targetData)
            }
            that.editBaseSpuInfo(pinBaseObj, 'goodsNameVal', moreBaseFlag, 'refresh')
          },
          onCancel: () => {
            that.preBaseArr = []
            that.querySpuBaseInfo()
            // that.editBaseSpuInfo(pinBaseObj, 'goodsNameVal', moreBaseFlag, 'refresh')
            // this.$Message.info('Clicked cancel')
          }
        })
      }
      this.baseInfoEditStatus = !this.baseInfoEditStatus
      this.baseEditBtnText = this.baseInfoEditStatus ? '结束' : '编辑'
      this.baseEdit = this.baseInfoEditStatus ? 'baseEdit' : 'readonly'
      this.customM = this.baseInfoEditStatus ? 'click' : 'custom'
    },
    classifyEditBtn: function () {
      var that = this
      if (this.preExtraArr.length > 0) {
        this.$Modal.confirm({
          title: '有修改项未保存',
          content: 'SPU信息有修改的项未保存，是否保存？',
          onOk: () => {
            var pinBaseObj = {}
            var moreBaseFlag = that.preExtraArr.length >= 1 ? 'more' : 'single'
            for (var k = 0; k < that.preExtraArr.length; k++) {
              $.extend(pinBaseObj, that.preExtraArr[k].targetData)
            }
            that.editExtraSpuInfo(pinBaseObj, 'goodsNameVal', moreBaseFlag, 'refresh')
          },
          onCancel: () => {
            that.preBaseArr = []
            that.querySpuBaseInfo()
            // that.editBaseSpuInfo(pinBaseObj, 'goodsNameVal', moreBaseFlag, 'refresh')
            // this.$Message.info('Clicked cancel')
          }
        })
      }
      this.classifyInfoEditStatus = !this.classifyInfoEditStatus
      this.classifyEditBtnText = this.classifyInfoEditStatus ? '结束' : '编辑'
      this.classifyEdit = this.classifyInfoEditStatus ? 'classifyEdit' : 'readonly'
    },
    removePreImg: function () {
      var that = this
      // this.bigPreImg = preUrl
      // this.currentPreId = currentPreId
      this.$Modal.confirm({
        title: '确认要删除？',
        content: '正在执行删除操作，此操作不可恢复',
        onOk: () => {
          var targetPreIndex = -1
          for (var t = 0; t < that.FileUploadArr.length; t++) {
            if (this.currentPreId === that.FileUploadArr[t].attachmentId) {
              targetPreIndex = t
            }
          }
          if (targetPreIndex >= 0) {
            that.FileUploadArr.splice(targetPreIndex, 1)
            that.editBaseSpuInfo({attachmentId: that.SetFileIdStr()})
          }
          // this.$Message.info('Clicked ok')
        },
        onCancel: () => {
          // this.$Message.info('Clicked cancel')
        }
      })
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
    // 获取附件上传组件发来的附件信息 新组件
    GetFileInfo (obj) {
      var that = this
      that.log('获取到返回:', obj)
      if (obj) {
        this.IsClear = true
      }
      this.FileUploadArr = this.FileUploadArr.concat(obj)
      // this.FileUploadArr = obj
      // this.log('上传：', obj)
      this.editBaseSpuInfo({attachmentId: that.SetFileIdStr()})
    },
    smallPreClick: function (e, preUrl, currentPreId, allData) {
      var obj = e.currentTarget
      $(obj).addClass('active').siblings().removeClass('active')
      this.bigPreImg = preUrl
      this.currentPreId = currentPreId
      this.bigPreOffsetTop = allData.marginTop
      this.bigPreOffsetLeft = allData.marginLeft
    },
    // 计算偏移量
    getImgOffset: function (url, designW) {
      var img = new Image()
      img.src = url
      var resultTop = 0
      var resultLeft = 0
      if (img.width > img.height) {
        resultTop = parseInt((designW - (img.height / (img.width / designW))) / 2)
      } else if (img.width < img.height) {
        resultLeft = parseInt((designW - (img.width / (img.height / designW))) / 2)
      }
      return {top: resultTop, left: resultLeft}
      // that.log('高度:', img.height)
    },
    querySpuBaseInfo: function () {
      var that = this
      this.ajax('/archives/getSpuBasic', {spuId: that.spuId}).then(res => {
        that.log('getSpuBasic:', res)
        if (res.code === 200) {
          that.FileUploadArr = []
          this.IsClear = false
          for (var r = 0; r < res.data.attachmentList.length && res.data.attachmentList.length > 0; r++) {
            var offsetObj = that.getImgOffset(res.data.attachmentList[r].previewUrl, 150)
            res.data.attachmentList[r].marginTop = offsetObj.top
            res.data.attachmentList[r].marginLeft = offsetObj.left
            var imgobj = {
              attachmentId: res.data.attachmentList[r].id,
              fileName: res.data.attachmentList[r].showName,
              previewUrl: res.data.attachmentList[r].previewUrl
            }
            that.FileUploadArr.push(imgobj)
          }
          if (res.data.attachmentList.length > 0) {
            that.currentPreId = res.data.attachmentList[0].id
            that.bigPreImg = res.data.attachmentList[0].previewUrl
            that.bigPreOffsetTop = res.data.attachmentList[0].marginTop
            that.bigPreOffsetLeft = res.data.attachmentList[0].marginLeft
          }
          that.spuBaseImgList = res.data.attachmentList
          that.editFlag = res.data.editFlag
          that.goodsNameVal = res.data.spuName
          that.pinpaiCodeVal = res.data.brandCode
          that.pinpaiNameVal = res.data.brandName
          that.groupNameVal = res.data.groupName
          that.groupId = res.data.groupId
          that.spuCodeVal = res.data.spuCode
          that.goodsIdVal = res.data.spuGoodsId
          that.pinpaiCodeVal = res.data.brandCode
          that.managerNameVal = res.data.userName
          // that.log('getSpuBasic2:', res)
        }
      })
    },
    // 选择类目
    changeTree (val, name) {
      this.categoryCodeVal = val[val.length - 1]
      $('#' + name).css('color', '#2d8cf0')
    },
    // goods/getGoodsClassifyTree
    queryClassifyTree: function () {
      // var that = this
      this.ajax('/goods/getGoodsClassifyTree', {}).then(res => {
        // that.log('getGoodsClassifyTree:', res)
        if (res.code === 200) {
          this.options = res.data
        }
      })
    },
    queryOptionType: function () {
      var that = this
      this.ajax('/archives/getOptionType', {}).then(res => {
        if (res.code === 200) {
          that.brandTypeArr = res.data.brandType
          that.materialType = res.data.materialType
          that.intendedFor = res.data.intendedFor
          that.goodsRole = res.data.goodsRole
          that.usageStage = res.data.usageStage
          that.desStyle = res.data.style
          that.goodsLevel = res.data.goodsLevel
          that.season = res.data.season
          that.changjingArr = res.data.scene
        }
        // that.log('getOptionType：1:', res)
      })
    },
    queryExtraSpuInfo: function () {
      var that = this
      this.ajax('/archives/getSpuInfo', {spuId: that.spuId}).then(res => {
        // that.log('getSpuInfo:', res)
        if (res.code === 200) {
          that.ExtraSpuInfoId = res.data.id
          that.ExtraEditFlag = res.data.editFlag
          // that.classifyInfoEditStatus = res.data.editFlag
          // 类目 所属类目
          // that.log('请求：', res.data.categoryNameMsg)
          that.categoryCodeList = res.data.categoryCodeList
          that.classifyNameVal = res.data.categoryNameMsg
          // 类目 物料类别
          that.objClassifyNameVal = res.data.materialType
          that.objClassifyCodeVal = res.data.materialCode
          // 类目 系列
          that.xilieNameVal = res.data.series
          // 类目 适用人群
          that.renqunNameVal = res.data.intendedForMsg
          that.renqunCodeVal = res.data.intendedFor
          // 类目 商品角色
          that.goodsRoleNameVal = res.data.goodsRole
          // that.goodsRoleNameVal = res.data.goodsRoleMsg
          // 类目 采购员
          that.caigouNameVal = res.data.buyer
          // 类目 产品认证
          that.renzhengVal = res.data.certification
          // 类目 起订量
          that.qidingVal = res.data.miniOrder
          // 类目 设计组
          that.designGroupVal = res.data.designGroup
          // 类目 保质期
          that.baozhiqiVal = res.data.qualityLimit
          // 类目 物料代码
          that.wuliaoCodeVal = res.data.materialCode
          // 类目 主材质
          that.zhucaizhiVal = res.data.mainMaterial
          // 类目 设计元素
          that.designEleVal = res.data.element
          // 类目 使用阶段
          that.jieduanVal = res.data.usageStageMsg
          that.jieduanCodeVal = res.data.usageStage
          // 类目 适用场景
          that.changjingVal = res.data.sceneMsg
          // 类目 采购组
          that.caigouGroupVal = res.data.buyerGroup
          // 类目 是否专利
          that.zhuanliVal = res.data.patents
          that.patentName = res.data.patents === 0 ? '否' : '是'
          // 类目 生产周期
          that.zhouqiVal = res.data.productCycle
          // 类目 配色设计师
          that.colorDesignerVal = res.data.colorDesigner
          // 类目 3 是否保修
          that.baoxiuVal = res.data.rapair
          that.rapairName = res.data.rapair === 0 ? '否' : '是'
          // 类目 3 类目编码
          that.classifyCodeVal = res.data.categoryCode
          // 类目 3 单位
          that.danweiVal = res.data.unit
          // 类目 3 造型
          that.zaoxingVal = res.data.shape
          // 类目 3 风格
          that.fenggeVal = res.data.styleMsg
          that.fenggeCodeVal = res.data.style
          // 类目 3 执行标准
          that.zhixingVal = res.data.standard
          // 类目 3 供应商名称
          that.gongyingVal = res.data.supplier
          // 类目 3 备货周期
          that.beihuozqVal = res.data.stockCycle
          // 类目 3 包装设计师
          that.baozhuangVal = res.data.packageDesigner
          // 类目 3 保修期
          that.baoxiuqiVal = res.data.rapairLimit
          // 类目 4 商品等级
          that.dengjiVal = res.data.level
          // 类目 4 产品组成
          that.zuchengVal = res.data.makeup
          // 类目 4 季节
          that.jijieVal = res.data.seasonMsg
          that.jijieCodeVal = res.data.season
          // 类目 4 是否赠品
          that.zengpinVal = res.data.giveaway
          that.giveawayName = res.data.giveaway === 0 ? '否' : '是'
          // 类目 4 安全类型
          that.anquanLxVal = res.data.safetyType
          // 类目 4 产地
          that.chandiVal = res.data.productArea
          // 类目 4 安全库存
          that.kucunVal = res.data.safetyStock
          // 类目 4 结构设计师
          that.jiegouDesignVal = res.data.structureDesigner
          // 类目 4 保修单位
          that.baoxiudwVal = res.data.rapairUnit
        }
      })
    },
    editExtraSpuInfo: function (obj, flag, moreFlag, refresh) {
      var that = this
      obj.spuInfoId = that.ExtraSpuInfoId
      // this.log('obj:', obj)
      this.ajax('/archives/editSpuInfo', JSON.stringify(obj)).then(res => {
        // that.log('editSpuInfo:', res)
        if (res.code === 200) {
          that.$Message.success('保存成功')
          if (moreFlag === 'more') {
            for (var u = 0; u < that.preExtraArr.length; u++) {
              $('#' + that.preExtraArr[u].targetName).css('color', '#808695')
            }
            that.preExtraArr = []
          } else {
            $('#' + flag).css('color', '#808695')
          }
          $('input').blur()
          that.selectData.obj = {}
          that.selectData.type = ''
          that.selectData.flag = ''
          $('.iptHidden').blur()
          if (refresh) {
            that.queryExtraSpuInfo()
          }
          // that.queryExtraSpuInfo()
        } else {
          that.$Message.success(res.msg)
        }
      })
    },
    editBaseSpuInfo: function (obj, flag, moreFlag, refresh) {
      var that = this
      obj.spuId = that.spuId
      this.ajax('/archives/editSpuBasic', JSON.stringify(obj)).then(res => {
        // that.log('editSpuBasic:', res)
        if (res.code === 200) {
          that.$Message.success('操作成功')
          if (moreFlag === 'more') {
            for (var u = 0; u < that.preBaseArr.length; u++) {
              $('#' + that.preBaseArr[u].targetName).css('color', '#808695')
            }
            that.preBaseArr = []
          } else {
            $('#' + flag).css('color', '#808695')
          }
          // $('#' + flag).css('color', '#808695')
          $('input').blur()
          that.selectData.obj = {}
          that.selectData.type = ''
          that.selectData.flag = ''
          $('.iptHidden').blur()
          if (refresh) {
            that.querySpuBaseInfo()
          }
        } else {
          that.$Message.success(res.msg)
        }
      })
    }
  }
}
</script>
<style>
  .GoodsFileSpuInfo .readonly .iptTest input{
    border: 1px solid transparent;
    background-color: transparent;
  }
  .GoodsFileSpuInfo .readonly .iptTest input:focus{
    box-shadow: none;
  }
  .GoodsFileSpuInfo .baseEdit .iptTest input,.GoodsFileSpuInfo .classifyEdit .iptTest input{
    border: 1px solid #dcdee2;
    background-color: #fff;
  }
  .GoodsFileSpuInfo .el-input__inner{
    line-height: 30px;
    height: auto;
    padding-left: 8px;
    padding-right: 0;
  }
  .GoodsFileSpuInfo .readonly .el-input__inner{
    line-height: 30px;
    height: auto;
    padding-left: 8px;
    padding-right: 0;
    background-color: transparent;
    border: none;
  }
  .GoodsFileSpuInfo .baseEdit .el-input__inner{
    /**/
  }
  .GoodsFileSpuInfo .base .el-autocomplete{
    width: 100%;
  }
</style>
<style scoped>
  div img{
    width: 100%;
    display: block;
  }
  .jiagou{
    position: absolute; right: -65px; top: 5px; color: #3a8ee6; font-size: 14px;
  }
  .jiagouInfo{
    position: absolute; left: 8px; top: 35px; color: #ffb400; font-size: 12px;
  }
  /*.haha{*/
    /*display: none;*/
  /*}*/
  .GoodsFileSpuInfo{
    display: flex;
  }
  .FileSpuInfo{
    flex-grow: 1;
  }
  .spuInfo{
    display: flex;
    padding: 10px;
    border: 1px solid #ddd;
    background-color: #f5f8fa;
  }
  .ImgPrePrimary{
    width: 150px;
    height: 150px;
    overflow: hidden;
    position: relative;
    background-color: #fff;
  }
  .ImgPreList{
    display: flex;
    margin-top: 5px;
    justify-content: center;
  }
  .ImgPreListItem{
    border: 1px solid #ccc;
    width: 20px;
    height: 20px;
    overflow: hidden;
    margin-right: 5px;
  }
  .ImgPreListItem.active{
    border: 1px solid #333;
  }
  .ImgPreListItem:last-child{
    margin-right: 0;
  }
  .spuInfoItem.ImgPre{
    margin-right: 20px;
    padding-top: 0;
    position: relative;
  }
  .baseEdit .ImgPre:hover .addRemoveBox{
    height: 26px;
  }
  .addRemoveBox{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 0px;
    overflow: hidden;
    transition:height 0.2s;
    background: rgba(45,140,240,0.5);
  }
  .ImgPreEditBox{
    position: absolute;
    top: 5px;
    right: 5px;
    display: flex;
    justify-content: right;
  }
  .ImgPreEditBox>div{
    width: 18px;
    height: 18px;
    color: #2d8cf0;
    font-size: 14px;
    line-height: 18px;
    background: rgba(255,255,255, 0.6);
    padding: 0px;
    margin-left: 5px;
    border-radius: 8px;
  }
  .ImgPreEditBox>div>i{
    margin-left: 2px;
  }
  .ImgPreEditAdd{
    position: relative;
    overflow: hidden;
  }
  .spuBaseInfoUpload{
    width: 100%;
    height: 50px;
    opacity: 0;
    position: absolute;
    top: -10px;
    left: -10px;
    background: rgba(0,0,0,0.2);
  }
  .spuInfoItem{
    padding-top: 10px;
    font-size: 14px;
  }
  .spuInfoItem:last-child{
    margin-right: 0;
  }
  .base .spuInfoItem{
    font-size: 16px;
    margin-right: 40px;
  }
  .base .spuInfoItem:last-child{
    flex-grow: 1;
    margin-right: 0;
  }
  .spuInfoLabel{
    font-weight: normal;
  }
  .base .spuInfoLabel{
    width: 75px;
    padding-top: 5px;
    margin-right: 5px;
    margin-left: 5px;
    font-weight: bold;
    text-align:justify;
    text-align-last:justify;
  }
  .base .spuInfoName{
    position: relative;
  }
  .base .spuInfoName.select{
    width: 187px;
    position: relative;
    /*flex-grow: 1;*/
  }
  .base .spuInfoName.manager{
    width: 187px;
    position: relative;
  }
  .classify .spuInfoLabel{
    width: 63px;
    padding-top: 6px;
    margin-right: 0px;
    margin-left: 5px;
    text-align:justify;
    text-align-last:justify;
  }
  .classify .spuInfoLabel.moreWords{
    width: 82px;
  }
  .classify .spuInfoName{
    width: 150px;
    margin-left: 5px;
    /*flex-grow: 1;*/
  }
  .classify .spuInfoName.select{
    width: 150px;
    position: relative;
    /*flex-grow: 1;*/
  }
  .spuInfoCnt{
    margin-bottom: 10px;
    display: flex;
  }
  .classify .spuInfoCnt{
    width: 228px;
  }
  .requiredFlag{
    color: red;
    width: 6px;
    padding-top: 8px;
  }
  .spuInfoLabel,.requiredFlag{
    /*overflow: hidden;*/
    /*display: inline-block;*/
  }
  .spuInfoSubIcon{
    width: 16px;
    margin-left: 5px;
    padding-top: 3px;
  }
  .classify .spuInfoName.select{
    /*display: inline-block;*/
    /*overflow:hidden;*/
    /*text-overflow:ellipsis;*/
    /*white-space:nowrap;*/
  }
  /*.Ellipsis{*/
    /*display: inline-block;*/
    /*overflow:hidden;*/
    /*text-overflow:ellipsis;*/
    /*white-space:nowrap;*/
  /*}*/
  .spuInfo{
    margin-bottom: 10px;
  }
  /*类目*/
  .spuInfo.classify{
    padding: 10px;
    justify-content: space-between;
    border: 1px solid #ddd;
  }
  .communication{
    width: 30%;
    margin-left: 10px;
    border: 1px solid #ddd;
  }
  .iptHiddenBox{
    position: absolute;
    width: 20px;
    top: 0;
    left: 0;
  }
  .iptHiddenBox input{
    width: 100%;
    opacity: 0;
  }
</style>
