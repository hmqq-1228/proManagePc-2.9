<template>
  <div class="GoodsFileSpuInfo">
    <!-- spu信息 -->
    <div class="FileSpuInfo">
      <!-- spu基本信息 -->
      <div class="spuInfo base" v-bind:class="baseEdit">
        <!-- spu 基本信息 预览图 -->
        <div class="spuInfoItem ImgPre">
          <div class="ImgPrePrimary">
            <!--../../../static/img/papa.jpg-->
            <img :src="bigPreImg" />
          </div>
          <div class="ImgPreList">
            <div class="ImgPreListItem" v-for="(imgItem, index) in spuBaseImgList" v-bind:key="imgItem.previewUrl + '_' + index" v-on:click="smallPreClick($event, imgItem.previewUrl, imgItem.id)">
              <img :src="imgItem.previewUrl" />
            </div>
          </div>
          <div class="ImgPreEditBox" v-if="baseInfoEditStatus">
            <div class="ImgPreEditAdd">
              <Icon type="md-add" />
              <div class="spuBaseInfoUpload">
                <component v-bind:is="compArr.FileUploadComp" :filUrl="filUrl" v-bind:clearInfo="IsClear" v-on:FileDataEmit="GetFileInfo"></component>
              </div>
            </div>
            <div class="ImgPreEditAdd" v-on:click="removePreImg()"><Icon type="md-remove" /></div>
          </div>
          <!--<div class="spuBaseInfoUpload">-->
            <!--<component v-bind:is="compArr.FileUploadComp" v-bind:clearInfo="IsClear" v-on:FileDataEmit="GetFileInfo"></component>-->
          <!--</div>-->
        </div>
        <!-- spu 基本信息 商品名称 品牌名称 spu编码 -->
        <div class="spuInfoItem">
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">商品名称:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="goodsNameVal" :readonly="!baseInfoEditStatus" placeholder="请输入商品名称" style="max-width: 250px" >
                <Icon class="haha" v-show="baseInfoEditStatus" @click="editBaseSpuInfo({spuName: goodsNameVal})" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
          </div>
          <!--<div class="spuInfoCnt">-->
            <!--<div class="requiredFlag">*</div>-->
            <!--<div class="spuInfoLabel">品牌名称:</div>-->
            <!--<div class="spuInfoName">-->
              <!--<i-input class="iptTest" v-model="pinpaiNameVal" :readonly="!baseInfoEditStatus" placeholder="请输入品牌名称" style="max-width: 250px" >-->
                <!--<Icon class="haha" v-show="baseInfoEditStatus" type="md-checkmark-circle" slot="suffix" />-->
              <!--</i-input>-->
            <!--</div>-->
          <!--</div>-->
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">品牌名称:</div>
            <div class="spuInfoName select">
              <Select v-model="pinpaiNameVal" v-show="baseInfoEditStatus">
                <Option v-for="brand in brandTypeArr" :key="brand.dictCode" :value="brand.dictName">{{ brand.dictName }}</Option>
              </Select>
              <div style="position: absolute; top: 5px; right: 9px; background-color: #fff; color: #808695;">
                <Icon class="haha" v-show="baseInfoEditStatus" @click="editExtraSpuInfo({brandCode: pinpaiNameVal})" type="md-checkmark-circle" slot="suffix" />
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
            <div class="spuInfoLabel">产品小组:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="groupNameVal" :readonly="!baseInfoEditStatus" placeholder="请输入品牌名称" style="max-width: 250px" >
                <Icon class="haha" v-show="baseInfoEditStatus" @click="editBaseSpuInfo({groupName: groupNameVal})" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<div class="spuInfoName">学爬健身组</div>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">SPU编码:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="spuCodeVal" :readonly="!baseInfoEditStatus" placeholder="请输入品牌名称" style="max-width: 250px" >
                <Icon class="haha" v-show="baseInfoEditStatus" @click="editBaseSpuInfo({spuCode: spuCodeVal})" type="md-checkmark-circle" slot="suffix" />
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
              <i-input class="iptTest" v-model="goodsIdVal" :readonly="!baseInfoEditStatus" placeholder="请输入品牌名称" style="max-width: 250px" >
                <Icon class="haha" v-show="baseInfoEditStatus" @click="editBaseSpuInfo({spuGoodsId: goodsIdVal})" type="md-checkmark-circle" slot="suffix" />
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
            <div class="spuInfoLabel">负责人:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="managerNameVal" :readonly="!baseInfoEditStatus" placeholder="请输入品牌代码" style="max-width: 250px" >
                <Icon class="haha" v-show="baseInfoEditStatus" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">张三(xx事业部经理)</span>-->
          </div>
        </div>
        <div class="spuInfoItem">
          <div style="float: right" v-if="editFlag"><Button type="primary" @click="baseEditBtn">{{baseEditBtnText}}</Button></div>
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
              <Cascader v-show="classifyInfoEditStatus" :data="options" @on-change="changeTree" trigger="hover" v-model="categoryCodeList"></Cascader>
              <!--@on-change="changeTree"-->
              <!--<Select v-model="classifyNameVal" v-show="classifyInfoEditStatus">-->
                <!--<Option v-for="brand in brandTypeArr" :key="brand.dictCode" :value="brand.dictName">{{ brand.dictName }}</Option>-->
              <!--</Select>-->
              <div style="position: absolute; top: 5px; right: 9px; background-color: #fff; color: #808695;">
                <Icon class="haha" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({categoryName: categoryCodeVal})" type="md-checkmark-circle" slot="suffix" />
              </div>
              <i-input class="iptTest" v-show="!classifyInfoEditStatus" v-model="classifyNameVal" :readonly="!classifyInfoEditStatus" placeholder="请输入品牌代码" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<div class="spuInfoName">玩教-学步类-爬爬垫</div>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">物料类别</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName select">
              <Select v-model="objClassifyNameVal" v-show="classifyInfoEditStatus">
                <Option v-for="brand in materialType" :key="brand.dictCode" :value="brand.dictCode">{{ brand.dictName }}</Option>
              </Select>
              <div style="position: absolute; top: 5px; right: 9px; background-color: #fff; color: #808695;">
                <Icon class="haha" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({materialCode: objClassifyNameVal})" type="md-checkmark-circle" slot="suffix" />
              </div>
              <i-input class="iptTest" v-show="!classifyInfoEditStatus" v-model="objClassifyNameVal" :readonly="!classifyInfoEditStatus" placeholder="请输入品牌代码" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">成品</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">系列</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="xilieNameVal" :readonly="!classifyInfoEditStatus" placeholder="请输入品牌代码" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({series: xilieNameVal})" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">梦幻世界</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">适用人群</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName select">
              <Select v-model="renqunNameVal" v-show="classifyInfoEditStatus">
                <Option v-for="brand in intendedFor" :key="brand.dictCode" :value="brand.dictCode">{{ brand.dictName }}</Option>
              </Select>
              <div style="position: absolute; top: 5px; right: 9px; background-color: #fff; color: #808695;">
                <Icon class="haha" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({intendedFor: renqunNameVal})" type="md-checkmark-circle" slot="suffix" />
              </div>
              <i-input class="iptTest" v-show="!classifyInfoEditStatus" v-model="renqunNameVal" :readonly="!classifyInfoEditStatus" placeholder="请输入品牌代码" style="max-width: 250px" >
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
              <Select v-model="goodsRoleNameVal" v-show="classifyInfoEditStatus">
                <Option v-for="brand in goodsRole" :key="brand.dictCode" :value="brand.dictCode">{{ brand.dictName }}</Option>
              </Select>
              <div style="position: absolute; top: 5px; right: 9px; background-color: #fff; color: #808695;">
                <Icon class="haha" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({goodsRole: goodsRoleNameVal})" type="md-checkmark-circle" slot="suffix" />
              </div>
              <i-input class="iptTest" v-show="!classifyInfoEditStatus" v-model="goodsRoleNameVal" :readonly="!classifyInfoEditStatus" placeholder="请输入品牌代码" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">S</span>-->
          </div>
          <!--从采购复制-->
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">采购员</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="caigouNameVal" :readonly="!classifyInfoEditStatus" placeholder="请输入品牌代码" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({buyer: caigouNameVal})" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">张三三</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">产品认证</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="renzhengVal" :readonly="!classifyInfoEditStatus" placeholder="请输入品牌代码" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({certification: renzhengVal})" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">ISO</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">起订量</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="qidingVal" :readonly="!classifyInfoEditStatus" placeholder="请输入品牌代码" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({miniOrder: qidingVal})" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">1000</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">设计组</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="designGroupVal" :readonly="!classifyInfoEditStatus" placeholder="请输入品牌代码" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({designGroup: designGroupVal})" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">暴风设计</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">保质期</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="baozhiqiVal" :readonly="!classifyInfoEditStatus" placeholder="请输入品牌代码" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({qualityLimit: baozhiqiVal})" type="md-checkmark-circle" slot="suffix" />
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
              <i-input class="iptTest" v-model="wuliaoCodeVal" :readonly="!classifyInfoEditStatus" placeholder="请输入品牌代码" style="max-width: 250px" >
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
              <i-input class="iptTest" v-model="zhucaizhiVal" :readonly="!classifyInfoEditStatus" placeholder="请输入品牌代码" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" type="md-checkmark-circle" slot="suffix" @click="editExtraSpuInfo({mainMaterial: zhucaizhiVal})" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">XPE</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">设计元素</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="designEleVal" :readonly="!classifyInfoEditStatus" placeholder="请输入品牌代码" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({element: designEleVal})" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">花朵</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">使用阶段</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName select">
              <Select v-model="jieduanVal" v-show="classifyInfoEditStatus">
                <Option v-for="brand in usageStage" :key="brand.dictCode" :value="brand.dictName">{{ brand.dictName }}</Option>
              </Select>
              <div style="position: absolute; top: 5px; right: 9px; background-color: #fff; color: #808695;">
                <Icon class="haha" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({usageStage: jieduanVal})" type="md-checkmark-circle" slot="suffix" />
              </div>
              <i-input class="iptTest" v-show="!classifyInfoEditStatus" v-model="jieduanVal" :readonly="!classifyInfoEditStatus" placeholder="请输入品牌代码" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">0-6岁</span>-->
          </div>
          <!--从采购复制-->
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">采购组</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="caigouGroupVal" :readonly="!classifyInfoEditStatus" placeholder="请输入品牌代码" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({buyerGroup: caigouGroupVal})" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">李四采购组</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">是否专利</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName select">
              <Select v-model="zhuanliVal" v-show="classifyInfoEditStatus">
                <Option v-for="brand in zhuanliOption" :key="brand.dictCode" :value="brand.dictName">{{ brand.dictName }}</Option>
              </Select>
              <div style="position: absolute; top: 5px; right: 9px; background-color: #fff; color: #808695;">
                <Icon class="haha" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({patents: zhuanliVal})" type="md-checkmark-circle" slot="suffix" />
              </div>
              <i-input class="iptTest" v-show="!classifyInfoEditStatus" v-model="zhuanliVal" :readonly="!classifyInfoEditStatus" placeholder="请输入品牌代码" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">是</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">生产周期</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="zhouqiVal" :readonly="!classifyInfoEditStatus" placeholder="请输入品牌代码" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({productCycle: zhouqiVal})" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">3个月</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel moreWords">配色设计师</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="colorDesignerVal" :readonly="!classifyInfoEditStatus" placeholder="请输入品牌代码" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({colorDesigner: colorDesignerVal})" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">王五</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">是否保修</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName select">
              <Select v-model="baoxiuVal" v-show="classifyInfoEditStatus">
                <Option v-for="brand in baoxiuOption" :key="brand.dictCode" :value="brand.dictName">{{ brand.dictName }}</Option>
              </Select>
              <div style="position: absolute; top: 5px; right: 9px; background-color: #fff; color: #808695;">
                <Icon class="haha" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({rapair: baoxiuVal})" type="md-checkmark-circle" slot="suffix" />
              </div>
              <i-input class="iptTest" v-show="!classifyInfoEditStatus" v-model="baoxiuVal" :readonly="!classifyInfoEditStatus" placeholder="请输入品牌代码" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">否</span>-->
          </div>
          <!---->
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">适用场景</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName select">
              <Select v-model="changjingValArr" multiple v-show="classifyInfoEditStatus">
                <Option v-for="brand in changjingArr" :key="brand.dictCode" :value="brand.dictCode">{{ brand.dictName }}</Option>
              </Select>
              <div style="position: absolute; top: 5px; right: 9px; background-color: #fff; color: #808695;">
                <Icon class="haha" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({scene: changCodeVal})" type="md-checkmark-circle" slot="suffix" />
              </div>
              <i-input class="iptTest" v-show="!classifyInfoEditStatus" v-model="changjingVal" :readonly="!classifyInfoEditStatus" placeholder="请输入品牌代码" style="max-width: 250px" >
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
              <i-input class="iptTest" v-model="classifyCodeVal" :readonly="!classifyInfoEditStatus" placeholder="请输入品牌代码" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({categoryCode: classifyCodeVal})" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">SL</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">单位</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="danweiVal" :readonly="!classifyInfoEditStatus" placeholder="请输入品牌代码" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({unit: danweiVal})" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">件</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">造型</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="zaoxingVal" :readonly="!classifyInfoEditStatus" placeholder="请输入品牌代码" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({shape: zaoxingVal})" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">长方形</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">风格</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName select">
              <Select v-model="fenggeVal" v-show="classifyInfoEditStatus">
                <Option v-for="brand in desStyle" :key="brand.dictCode" :value="brand.dictName">{{ brand.dictName }}</Option>
              </Select>
              <div style="position: absolute; top: 5px; right: 9px; background-color: #fff; color: #808695;">
                <Icon class="haha" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({style: fenggeVal})" type="md-checkmark-circle" slot="suffix" />
              </div>
              <i-input class="iptTest" v-show="!classifyInfoEditStatus" v-model="fenggeVal" :readonly="!classifyInfoEditStatus" placeholder="请输入品牌代码" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">可爱</span>-->
          </div>
          <!--从采购复制-->
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">执行标准</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="zhixingVal" :readonly="!classifyInfoEditStatus" placeholder="请输入品牌代码" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({standard: zhixingVal})" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">SL</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel moreWords">供应商名称</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="gongyingVal" :readonly="!classifyInfoEditStatus" placeholder="请输入品牌代码" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({supplier: gongyingVal})" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">KUB可优比</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">备货周期</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="beihuozqVal" :readonly="!classifyInfoEditStatus" placeholder="请输入品牌代码" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({stockCycle: beihuozqVal})" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<div class="spuInfoName">3个月</div>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel moreWords">包装设计师</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="baozhuangVal" :readonly="!classifyInfoEditStatus" placeholder="请输入品牌代码" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({packageDesigner: baozhuangVal})" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">赵六</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">保修期</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="baoxiuqiVal" :readonly="!classifyInfoEditStatus" placeholder="请输入品牌代码" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({rapairLimit: baoxiuqiVal})" type="md-checkmark-circle" slot="suffix" />
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
            <div class="spuInfoName">
              <Select v-model="dengjiVal" v-show="classifyInfoEditStatus">
                <Option v-for="brand in goodsLevel" :key="brand.dictCode" :value="brand.dictName">{{ brand.dictName }}</Option>
              </Select>
              <div style="position: absolute; top: 5px; right: 9px; background-color: #fff; color: #808695;">
                <Icon class="haha" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({level: dengjiVal})" type="md-checkmark-circle" slot="suffix" />
              </div>
              <i-input class="iptTest" v-show="!classifyInfoEditStatus" v-model="dengjiVal" :readonly="!classifyInfoEditStatus" placeholder="请输入品牌代码" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">3</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">产品组成</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="zuchengVal" :readonly="!classifyInfoEditStatus" placeholder="请输入品牌代码" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({makeup: zuchengVal})" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">爬行垫</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">季节</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName select">
              <Select v-model="jijieVal" v-show="classifyInfoEditStatus">
                <Option v-for="brand in season" :key="brand.dictCode" :value="brand.dictName">{{ brand.dictName }}</Option>
              </Select>
              <div style="position: absolute; top: 5px; right: 9px; background-color: #fff; color: #808695;">
                <Icon class="haha" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({season: jijieVal})" type="md-checkmark-circle" slot="suffix" />
              </div>
              <i-input class="iptTest" v-show="!classifyInfoEditStatus" v-model="jijieVal" :readonly="!classifyInfoEditStatus" placeholder="请输入品牌代码" style="max-width: 250px" >
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
              <Select v-model="zengpinVal" v-show="classifyInfoEditStatus">
                <Option v-for="brand in zengArr" :key="brand.dictCode" :value="brand.dictName">{{ brand.dictName }}</Option>
              </Select>
              <div style="position: absolute; top: 5px; right: 9px; background-color: #fff; color: #808695;">
                <Icon class="haha" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({giveaway: zengpinVal})" type="md-checkmark-circle" slot="suffix" />
              </div>
              <i-input class="iptTest" v-show="!classifyInfoEditStatus" v-model="zengpinVal" :readonly="!classifyInfoEditStatus" placeholder="请输入品牌代码" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">商品</span>-->
          </div>
          <!--从采购复制-->
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">安全类型</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="anquanLxVal" :readonly="!classifyInfoEditStatus" placeholder="请输入品牌代码" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({safetyType: anquanLxVal})" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">3</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">产地</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="chandiVal" :readonly="!classifyInfoEditStatus" placeholder="请输入品牌代码" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({productArea: chandiVal})" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">安吉</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">安全库存</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="kucunVal" :readonly="!classifyInfoEditStatus" placeholder="请输入品牌代码" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({safetyStock: kucunVal})" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">1000</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel moreWords">结构设计师</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="jiegouDesignVal" :readonly="!classifyInfoEditStatus" placeholder="请输入品牌代码" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({structureDesigner: jiegouDesignVal})" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">王二</span>-->
          </div>
          <div class="spuInfoCnt">
            <div class="requiredFlag">*</div>
            <div class="spuInfoLabel">保修单位</div>
            <div style="padding-top: 5px;">:</div>
            <div class="spuInfoName">
              <i-input class="iptTest" v-model="baoxiudwVal" :readonly="!classifyInfoEditStatus" placeholder="请输入品牌代码" style="max-width: 250px" >
                <Icon class="haha" v-show="classifyInfoEditStatus" @click="editExtraSpuInfo({rapairUnit: baoxiudwVal})" type="md-checkmark-circle" slot="suffix" />
              </i-input>
            </div>
            <!--<span class="spuInfoName">KUB售后</span>-->
          </div>
          <!---->
        </div>
        <!-- spu 类目信息: 编辑按钮 -->
        <div class="spuInfoItem">
          <div style="float: right" v-if="ExtraEditFlag"><Button type="primary" @click="classifyEditBtn">{{classifyEditBtnText}}</Button></div>
        </div>
      </div>
    </div>
    <!-- spu沟通记录 -->
    <!--<div class="communication">沟通记录</div>-->
  </div>
</template>

<script>
import FileUploadComp from '././FileUploadComp.vue'
export default {
  name: 'GoodsFileSpuInfo',
  components: {
    FileUploadComp
  },
  data () {
    return {
      filUrl: '/file/uploadGoodsFileAjax',
      FileUploadArr: [],
      IsClear: false,
      // 引入组件
      compArr: {
        FileUploadComp: 'FileUploadComp'
      },
      bigPreImg: '',
      currentPreId: '',
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
      goodsNameVal: 'KUB可优比梦幻世界XPE爬爬垫',
      // 基本信息 品牌名称
      pinpaiNameVal: 'KUB可优比',
      // 基本信息 产品小组
      groupNameVal: '学爬健身组',
      // 基本信息 spu编码
      spuCodeVal: 'KUB-0501',
      // 基本信息 商品ID
      goodsIdVal: '2019514536',
      // 基本信息 品牌代码
      pinpaiCodeVal: 'KUB',
      // 基本信息 负责人
      managerNameVal: '张三（XX事业部经理）',
      // 类目 所属类目
      categoryCodeList: [],
      classifyNameVal: '',
      // 类目 物料类别
      objClassifyNameVal: '成品',
      // 类目 系列
      xilieNameVal: '梦幻世界',
      // 类目 适用人群
      renqunNameVal: '男/女孩通用',
      // 类目 商品角色
      goodsRoleNameVal: 'S',
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
      // 类目 适用场景
      changjingVal: '玩教场景',
      // 类目 采购组
      caigouGroupVal: '李四采购组',
      // 类目 是否专利
      zhuanliVal: '是',
      // 类目 生产周期
      zhouqiVal: '是',
      // 类目 配色设计师
      colorDesignerVal: '王五',
      // 类目 3 是否保修
      baoxiuVal: '是',
      // 类目 3 类目编码
      classifyCodeVal: 'SL',
      // 类目 3 单位
      danweiVal: '是',
      // 类目 3 造型
      zaoxingVal: '长方形',
      // 类目 3 风格
      fenggeVal: '可爱',
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
      // 类目 4 是否赠品
      zengpinVal: '商品',
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
      this.log('classifyNameVal:', val)
    },
    changjingValArr (val, old) {
      this.log('适用场景：', val)
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
    }
  },
  created () {
    this.log('suiD', this.spuId)
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
    baseEditBtn: function () {
      this.baseInfoEditStatus = !this.baseInfoEditStatus
      this.baseEditBtnText = this.baseInfoEditStatus ? '结束' : '编辑'
      this.baseEdit = this.baseInfoEditStatus ? 'baseEdit' : 'readonly'
      this.customM = this.baseInfoEditStatus ? 'click' : 'custom'
    },
    classifyEditBtn: function () {
      this.classifyInfoEditStatus = !this.classifyInfoEditStatus
      this.classifyEditBtnText = this.classifyInfoEditStatus ? '结束' : '编辑'
      this.classifyEdit = this.classifyInfoEditStatus ? 'classifyEdit' : 'readonly'
    },
    removePreImg: function () {
      var that = this
      // this.bigPreImg = preUrl
      // this.currentPreId = currentPreId
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
      if (obj) {
        this.IsClear = false
      }
      this.FileUploadArr = this.FileUploadArr.concat(obj)
      // this.FileUploadArr = obj
      this.log('上传：', obj)
      this.editBaseSpuInfo({attachmentId: that.SetFileIdStr()})
    },
    smallPreClick: function (e, preUrl, currentPreId) {
      var obj = e.currentTarget
      $(obj).addClass('active').siblings().removeClass('active')
      this.bigPreImg = preUrl
      this.currentPreId = currentPreId
    },
    querySpuBaseInfo: function () {
      var that = this
      this.ajax('/archives/getSpuBasic', {spuId: that.spuId}).then(res => {
        that.log('getSpuBasic:', res)
        if (res.code === 200) {
          that.FileUploadArr = []
          for (var r = 0; r < res.data.attachmentList.length && res.data.attachmentList.length > 0; r++) {
            that.log('9999:', res.data.attachmentList[r].id)
            var imgobj = {
              attachmentId: res.data.attachmentList[r].id,
              fileName: res.data.attachmentList[r].showName,
              previewUrl: res.data.attachmentList[r].previewUrl
            }
            that.FileUploadArr.push(imgobj)
          }
          that.spuBaseImgList = res.data.attachmentList
          if (res.data.attachmentList.length > 0) {
            that.currentPreId = res.data.attachmentList[0].id
            that.bigPreImg = res.data.attachmentList[0].previewUrl
          }
          that.editFlag = res.data.editFlag
          // that.FileUploadArr = res.data.attachmentList
          // that.baseInfoEditStatus = res.data.editFlag
          // that.customM = that.baseInfoEditStatus ? 'click' : 'custom'
          that.goodsNameVal = res.data.spuName
          that.pinpaiNameVal = res.data.brandName
          that.groupNameVal = res.data.groupName
          that.spuCodeVal = res.data.spuCode
          that.goodsIdVal = res.data.spuGoodsId
          that.pinpaiCodeVal = res.data.brandCode
          that.managerNameVal = res.data.userName
        }
      })
    },
    // 选择类目
    changeTree (val) {
      this.categoryCodeVal = val[val.length - 1]
    },
    // goods/getGoodsClassifyTree
    queryClassifyTree: function () {
      var that = this
      this.ajax('/goods/getGoodsClassifyTree', {}).then(res => {
        that.log('getGoodsClassifyTree:', res)
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
        that.log('getOptionType：1:', res)
      })
    },
    queryExtraSpuInfo: function () {
      var that = this
      this.ajax('/archives/getSpuInfo', {spuId: that.spuId}).then(res => {
        that.log('getSpuInfo:', res)
        if (res.code === 200) {
          that.ExtraSpuInfoId = res.data.id
          that.ExtraEditFlag = res.data.editFlag
          // that.classifyInfoEditStatus = res.data.editFlag
          // 类目 所属类目
          that.log('请求：', res.data.categoryNameMsg)
          that.categoryCodeList = res.data.categoryCodeList
          that.classifyNameVal = res.data.categoryNameMsg
          // 类目 物料类别
          that.objClassifyNameVal = res.data.materialType
          // 类目 系列
          that.xilieNameVal = res.data.series
          // 类目 适用人群
          that.renqunNameVal = res.data.intendedForMsg
          // 类目 商品角色
          that.goodsRoleNameVal = res.data.goodsRole
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
          // 类目 适用场景
          that.changjingVal = res.data.sceneMsg
          // 类目 采购组
          that.caigouGroupVal = res.data.buyerGroup
          // 类目 是否专利
          that.zhuanliVal = res.data.patents
          // 类目 生产周期
          that.zhouqiVal = res.data.productCycle
          // 类目 配色设计师
          that.colorDesignerVal = res.data.colorDesigner
          // 类目 3 是否保修
          that.baoxiuVal = res.data.rapair
          // 类目 3 类目编码
          that.classifyCodeVal = res.data.categoryCode
          // 类目 3 单位
          that.danweiVal = res.data.unit
          // 类目 3 造型
          that.zaoxingVal = res.data.shape
          // 类目 3 风格
          that.fenggeVal = res.data.styleMsg
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
          // 类目 4 是否赠品
          that.zengpinVal = res.data.giveaway
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
    editExtraSpuInfo: function (obj) {
      var that = this
      obj.spuInfoId = that.ExtraSpuInfoId
      this.log('obj:', obj)
      this.ajax('/archives/editSpuInfo', JSON.stringify(obj)).then(res => {
        that.log('editSpuInfo:', res)
      })
    },
    editBaseSpuInfo: function (obj) {
      var that = this
      obj.spuId = that.spuId
      this.log('8888:', obj)
      this.ajax('/archives/editSpuBasic', JSON.stringify(obj)).then(res => {
        that.log('editSpuBasic:', res)
        if (res.code === 200) {
          that.querySpuBaseInfo()
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
</style>
<style scoped>
  div img{
    width: 100%;
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
    background-color: #f5f5f8;
  }
  .ImgPrePrimary{
    width: 150px;
    height: 150px;
    background-color: #eee;
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
    color: #fff;
    font-size: 14px;
    line-height: 18px;
    background: rgba(0,0,0, 0.2);
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
    padding-top: 5px;
    margin-right: 5px;
    margin-left: 5px;
    font-weight: bold;
  }
  .base .spuInfoName.select{
    width: 187px;
    position: relative;
    /*flex-grow: 1;*/
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
</style>
