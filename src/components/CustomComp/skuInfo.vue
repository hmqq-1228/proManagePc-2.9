<template>
   <div class="skuInfo">
     <Input prefix="ios-search" placeholder="按SKU编码搜索" style="width:  300px;margin-top: 15px" v-model="searchCode" v-on:input="search" clearable />
     <div style="margin-top: -15px">
       <div class="sku" v-for="(item,index) in skuList" :key="index" v-if="skuList.length>0">
         <div class="sku-list">
           <div class="left">
              <div class="skuCode">
                <i style="color:red;font-size: 16px">*</i>&nbsp;&nbsp;<span>SKU</span>: <span v-if="!item.isEdit">{{item.skuCode}}</span>
                <i-input placeholder="请输入" style="width: 140px" v-model="item.skuCode" v-if="item.isEdit" @on-enter="submit(item.skuCode, 'skuCode', item,index)" v-on:input="detection($event,'skuCode',index)">
                  <Icon type="ios-arrow-dropdown-circle" slot="suffix" :id="'skuCode-'+ index" style="color:#808695;font-size: 20px" @click="submit(item.skuCode, 'skuCode', item, index)"/>
                </i-input>
              </div>
              <div class="imgBox" v-show="!item.isEdit">
                <div v-for="(imgs,index) in item.attachmentList" :key="index">
                  <img :src="imgs.previewUrl" alt="" @click="showImg(imgs)" style="float: left;margin-bottom: 10px;">
                </div>
              </div>
             <div class="imgBox" v-show="item.isEdit">
               <div v-for="(imgs,index) in item.attachmentList" :key="index">
                 <img :src="imgs.previewUrl" alt="" @click="showImg(imgs)" style="float: left;margin-bottom: 10px;">
               </div>
             </div>
           </div>
           <div class="right" v-if="!item.isEdit">
              <div class="leftName">
                <i style="color:red;font-size: 16px">*</i>&nbsp;&nbsp;<span>年份</span>：{{item.yearDigital}}
              </div>
              <div class="leftName">
                <i>*</i>&nbsp;&nbsp;<span>零售价</span>：{{item.retailPrice}}
              </div>
             <div class="leftName">
               <i>*</i>&nbsp;&nbsp;<span>吊牌价</span>：{{item.tagPrice}}
             </div>
             <div class="leftName">
               <i>*</i>&nbsp;&nbsp;<span>固定成本</span>：{{item.costPrice}}
             </div>
             <div class="leftName">
               <i style="color:red;font-size: 16px">*</i>&nbsp;&nbsp;<span>第三方SKU编码</span>：{{item.thirdSkuCode}}
             </div>
             <div class="leftName">
               <i>*</i>&nbsp;&nbsp;<span style="margin-right: -1em;letter-spacing:1em">条码</span>：{{item.barCode}}
             </div>
             <div class="leftName">
               <i>*</i>&nbsp;&nbsp;<span style="margin-right: -1em;letter-spacing:1em">颜色</span>：
               <!--type="color"-->
               <span v-if="item.color">
                 <input type="color" placeholder="请输入" style="width: 70px;outline: none" v-model="item.color" disabled="true" v-if="item.color.indexOf('#') != -1">
                 <span v-else>{{item.color}}</span>
               </span>
             </div>
             <div class="leftName">
               <i>*</i>&nbsp;&nbsp;<span style="margin-right: -2em;letter-spacing:2em">规格</span>：{{item.standards}}
             </div>
           </div>
           <div class="right" v-if="item.isEdit">
             <div class="leftName">
               <i style="color:red;font-size: 16px">*</i>&nbsp;&nbsp;<span>年份</span>：
               <!--type="number" dd -->
               <i-input placeholder="请输入" style="width: 140px" type="number" v-model="item.yearDigital" @on-enter="submit(item.yearDigital, 'yearDigital', item, index)" v-on:input="detection($event,'yearDigital',index)">
                 <Icon type="ios-arrow-dropdown-circle" :id="'yearDigital-'+ index" slot="suffix" style="color:#808695;font-size: 20px" @click="submit(item.yearDigital, 'yearDigital', item, index)"/>
               </i-input>
             </div>
             <div class="leftName">
               <i>*</i>&nbsp;&nbsp;<span>零售价</span>：
               <!--type="number" dd -->
               <i-input placeholder="请输入" style="width: 140px" v-model="item.retailPrice" @on-enter="submit(item.retailPrice, 'retailPrice', item,index)" v-on:input="detection($event,'retailPrice',index)">
                 <Icon type="ios-arrow-dropdown-circle" :id="'retailPrice-'+ index" slot="suffix" style="color:#808695;font-size: 20px;" @click="submit(item.retailPrice, 'retailPrice', item, index)"/>
               </i-input>
             </div>
             <div class="leftName">
               <i>*</i>&nbsp;&nbsp;<span>吊牌价</span>：
               <!--type="number" dd -->
               <i-input placeholder="请输入" style="width: 140px" type="number" v-model="item.tagPrice" @on-enter="submit(item.tagPrice, 'tagPrice', item,index)" v-on:input="detection($event,'tagPrice',index)">
                 <Icon type="ios-arrow-dropdown-circle" :id="'tagPrice-'+ index" slot="suffix" style="color:#808695;font-size: 20px" @click="submit(item.tagPrice, 'tagPrice', item, index)"/>
               </i-input>
             </div>
             <div class="leftName">
               <i>*</i>&nbsp;&nbsp;<span>固定成本</span>：
               <!--type="number" dd -->
               <i-input placeholder="请输入" style="width: 140px" type="number" v-model="item.costPrice" @on-enter="submit(item.costPrice, 'costPrice', item,index)" v-on:input="detection($event,'costPrice',index)">
                 <Icon type="ios-arrow-dropdown-circle" :id="'costPrice-'+ index" slot="suffix" style="color:#808695;font-size: 20px" @click="submit(item.costPrice, 'costPrice', item,index)"/>
               </i-input>
             </div>
             <div class="leftName" style="width: 260px;margin-right: 25px">
               <i style="color:red;font-size: 16px">*</i>&nbsp;&nbsp;<span>第三方SKU编码</span>：
               <i-input placeholder="请输入" style="width: 120px" v-model="item.thirdSkuCode" @on-enter="submit(item.thirdSkuCode, 'thirdSkuCode', item,index)" v-on:input="detection($event,'thirdSkuCode',index)">
                 <Icon type="ios-arrow-dropdown-circle" :id="'thirdSkuCode-'+ index" slot="suffix" style="color:#808695;font-size: 20px" @click="submit(item.thirdSkuCode, 'thirdSkuCode', item,index)"/>
               </i-input>
             </div>
             <div class="leftName">
               <i>*</i>&nbsp;&nbsp;<span style="margin-right: -1em;letter-spacing:1em">条码</span>：
               <i-input placeholder="请输入" style="width: 140px" v-model="item.barCode" @on-enter="submit(item.barCode, 'barCode', item,index)" v-on:input="detection($event,'barCode',index)">
                 <Icon type="ios-arrow-dropdown-circle" :id="'barCode-'+ index" slot="suffix" style="color:#808695;font-size: 20px" @click="submit(item.barCode, 'barCode', item,index)"/>
               </i-input>
             </div>
             <div class="leftName">
               <span style="float: left"><i>*</i>&nbsp;&nbsp;<span style="margin-right: -1em;letter-spacing:1em">颜色</span>：</span>
               <!--<i-input placeholder="请输入" style="width: 140px" v-model="item.color" type="color" @on-enter="submit(item.color, 'color', item)">-->
                 <!--<Icon type="ios-arrow-dropdown-circle" slot="suffix" style="color:#5C6B77;font-size: 20px;cursor: pointer" @click="submit(item.color, 'color', item)"/>-->
               <!--</i-input>-->
               <!--<input type="color" style="width: 120px" v-model="item.color" v-if="!isChina(item.color)">-->
               <!--<input type="color" value="#ffffff" v-model="item.color" style="width: 120px;border: none" v-else>-->
               <el-color-picker v-model="item.color" style="width: 120px;float: left" @change="changeColor($event,'color',index)"></el-color-picker>
               <Icon type="ios-arrow-dropdown-circle" :id="'color-'+ index" slot="suffix" style="color:#808695;font-size: 20px;cursor: pointer;float:left;margin-left: 10px;margin-top: 5px" @click="submit(item.color, 'color', item,index)"/>
             </div>
             <div class="leftName">
               <i>*</i>&nbsp;&nbsp;<span style="margin-right: -2em;letter-spacing:2em">规格</span>：
               <i-input placeholder="请输入" style="width: 140px" v-model="item.standards" @on-enter="submit(item.standards, 'standards', item,index)" v-on:input="detection($event,'standards',index)">
                 <Icon type="ios-arrow-dropdown-circle" :id="'standards-'+ index" slot="suffix" style="color:#808695;font-size: 20px" @click="submit(item.standards, 'standards', item,index)"/>
               </i-input>
             </div>
           </div>
         </div>
         <div class="sku-detail" v-show="item.show">
           <div class="detail-left" v-if="!item.isEdit">
               <div class="sku-info"><i>*</i>&nbsp;&nbsp;<span>零售价的价格段</span>：{{item.priceSegmentMsg}}</div>
               <div class="sku-info"><span style="margin-right: -0.3em;letter-spacing:0.3em">税率（%）</span>：{{item.taxRate}}</div>
               <div class="sku-info"><span style="margin-right: -0.4em;letter-spacing:0.4em">附加功能</span>：{{item.otherFunctions}}</div>
               <div class="sku-info"><span style="margin-right: -3.1em;letter-spacing:3.1em">成分</span>：{{item.component}}</div>
               <div class="sku-info"><span style="margin-right: -2.5em;letter-spacing:2.5em">口味</span>：{{item.flavor}}</div>
               <div class="sku-info"><span style="margin-right: -4.3em;letter-spacing:4.3em">气味</span>：{{item.smell}}</div>
               <div class="sku-info"><span style="margin-right: -0.2em;letter-spacing:0.2em">高（cm）</span>：{{item.hight}}</div>
               <div class="sku-info"><span style="margin-right: -0.2em;letter-spacing:0.2em">长（cm）</span>：{{item.length}}</div>
               <div class="sku-info"><span>宽（cm）</span>：{{item.width}}</div>
               <div class="sku-info"><span style="margin-right: -4.3em;letter-spacing:4.3em">体积</span>：{{item.volume}}</div>
               <div class="sku-info"><span>毛重（kg）</span>：{{item.weight}}</div>
               <div class="sku-info"><span>抛重（kg）</span>：{{item.throwWeight}}</div>
               <div class="sku-info"><span>是否计抛</span>：{{behind(item.throwCalculation)}}</div>
               <div class="sku-info"><span>PCS（包装）</span>：{{item.pack}}</div>
               <div class="sku-info"><span style="margin-right: -0.35em;letter-spacing:0.35em">中包规格</span>：{{item.middleStandards}}</div>
               <div class="sku-info"><span>外箱尺寸（长*宽*高cm）</span>：{{item.outerBoxSize}}</div>
           </div>
           <div class="detail-left" v-if="item.isEdit">
             <div class="sku-info" style="width: 260px;margin-right: 40px;"><i>*</i>&nbsp;&nbsp;<span>零售价的价格段</span>：
               <Select v-model="item.priceSegment" style="width: 100px" filterable @on-change="changeValue($event,'priceSegment',index)">
                 <Option v-for="item in slideData" :value="item.dictCode" :key="item.dictCode">{{ item.dictName }}</Option>
               </Select>
               <Icon type="ios-arrow-dropdown-circle" :id="'priceSegment-'+ index" slot="suffix" style="color:#808695;font-size: 20px" @click="submit(item.priceSegment, 'priceSegment', item,index)"/>
             </div>
             <div class="sku-info"><span style="margin-right: -0.3em;letter-spacing:0.3em">税率（%）</span>：
               <i-input placeholder="请输入" style="width: 140px" v-model="item.taxRate" type="number" @on-enter="submit(item.taxRate, 'taxRate', item,index)" v-on:input="detection($event,'taxRate',index)">
                 <Icon type="ios-arrow-dropdown-circle" :id="'taxRate-'+ index" slot="suffix" style="color:#808695;font-size: 20px" @click="submit(item.taxRate, 'taxRate', item,index)"/>
               </i-input>
             </div>
             <div class="sku-info"><span style="margin-right: -0.4em;letter-spacing:0.4em">附加功能</span>：
               <i-input placeholder="请输入" style="width: 140px" v-model="item.otherFunctions" @on-enter="submit(item.otherFunctions, 'otherFunctions', item,index)" v-on:input="detection($event,'otherFunctions',index)">
                 <Icon type="ios-arrow-dropdown-circle" :id="'otherFunctions-'+ index" slot="suffix" style="color:#808695;font-size: 20px" @click="submit(item.otherFunctions, 'otherFunctions', item,index)"/>
               </i-input>
             </div>
             <div class="sku-info"><span  style="margin-right: -3.1em;letter-spacing:3.1em">成分</span>：
               <i-input placeholder="请输入" style="width: 140px" v-model="item.component"  @on-enter="submit(item.component, 'component', item,index)" v-on:input="detection($event,'component',index)">
                 <Icon type="ios-arrow-dropdown-circle" :id="'component-'+ index" slot="suffix" style="color:#808695;font-size: 20px" @click="submit(item.component, 'component', item,index)"/>
               </i-input>
             </div>
             <div class="sku-info"><span style="margin-right: -2.5em;letter-spacing:2.5em">口味</span>：
               <i-input placeholder="请输入" style="width: 140px" v-model="item.flavor" @on-enter="submit(item.flavor, 'flavor', item,index)" v-on:input="detection($event,'flavor',index)">
                 <Icon type="ios-arrow-dropdown-circle" :id="'flavor-'+ index" slot="suffix" style="color:#808695;font-size: 20px" @click="submit(item.flavor, 'flavor', item,index)"/>
               </i-input>
             </div>
             <div class="sku-info"><span style="margin-right: -4.3em;letter-spacing:4.3em">气味</span>：
               <i-input placeholder="请输入" style="width: 140px" v-model="item.smell"  @on-enter="submit(item.smell, 'smell', item,index)" v-on:input="detection($event,'smell',index)">
                 <Icon type="ios-arrow-dropdown-circle" :id="'smell-'+ index" slot="suffix" style="color:#808695;font-size: 20px" @click="submit(item.smell, 'smell', item,index)"/>
               </i-input>
             </div>
             <div class="sku-info"><span style="margin-right: -0.2em;letter-spacing:0.2em">高（cm）</span>：
               <!--type="number"-->
               <i-input placeholder="请输入" style="width: 140px" type="number" v-model="item.hight"  @on-enter="submit(item.hight, 'hight', item,index)" v-on:input="detection($event,'hight',index)">
                 <Icon type="ios-arrow-dropdown-circle" :id="'hight-'+ index" slot="suffix" style="color:#808695;font-size: 20px" @click="submit(item.hight, 'hight', item,index)"/>
               </i-input>
             </div>
             <div class="sku-info"><span style="margin-right: -0.2em;letter-spacing:0.2em">长（cm）</span>：
               <!--type="number"-->
               <i-input placeholder="请输入" style="width: 140px" type="number" v-model="item.length"  @on-enter="submit(item.length, 'length', item,index)" v-on:input="detection($event,'length',index)">
                 <Icon type="ios-arrow-dropdown-circle" :id="'length-'+ index" slot="suffix" style="color:#808695;font-size: 20px" @click="submit(item.length, 'length', item,index)"/>
               </i-input>
             </div>
             <div class="sku-info"><span>宽（cm）</span>：
               <!--type="number"-->
               <i-input placeholder="请输入" style="width: 140px" type="number" v-model="item.width" @on-enter="submit(item.width, 'width', item,index)" v-on:input="detection($event,'width',index)">
                 <Icon type="ios-arrow-dropdown-circle" :id="'width-'+ index" slot="suffix" style="color:#808695;font-size: 20px" @click="submit(item.width, 'width', item,index)"/>
               </i-input>
             </div>
             <div class="sku-info"><span style="margin-right: -4.3em;letter-spacing:4.3em">体积</span>：
               <i-input placeholder="请输入" style="width: 140px" v-model="item.volume" v-if="item.isEdit" @click="on-enter(item.volume, 'volume', item,index)" v-on:input="detection($event,'volume',index)">
                 <Icon type="ios-arrow-dropdown-circle" :id="'volume-'+ index"  slot="suffix" style="color:#808695;font-size: 20px" @click="submit(item.volume, 'volume', item,index)"/>
               </i-input>
             </div>
             <div class="sku-info"><span>毛重（kg）</span>：
               <i-input placeholder="请输入" style="width: 140px" v-model="item.weight" v-if="item.isEdit" type="number" @on-enter="submit(item.weight, 'weight', item,index)" v-on:input="detection($event,'weight',index)">
                 <Icon type="ios-arrow-dropdown-circle" :id="'weight-'+ index" slot="suffix" style="color:#808695;font-size: 20px" @click="submit(item.weight, 'weight', item,index)"/>
               </i-input>
             </div>
             <div class="sku-info"><span>抛重（kg）</span>：
               <i-input placeholder="请输入" style="width: 140px" v-model="item.throwWeight" v-if="item.isEdit" type="number" @on-enter="submit(item.throwWeight, 'throwWeight', item,index)" v-on:input="detection($event,'throwWeight',index)">
                 <Icon type="ios-arrow-dropdown-circle" :id="'throwWeight-'+ index" slot="suffix" style="color:#808695;font-size: 20px" @click="submit(item.throwWeight, 'throwWeight', item,index)"/>
               </i-input>
             </div>
             <div class="sku-info"><span>是否计抛</span>：
               <Select v-model="item.throwCalculation" style="width: 120px" @on-change="changeValue($event,'throwCalculation',index)">
                 <Option v-for="item in throwCalculation" :value="item.value" :key="item.value">{{ item.label }}</Option>
               </Select>
               <Icon type="ios-arrow-dropdown-circle" :id="'throwCalculation-'+ index" slot="suffix" style="color:#808695;font-size: 20px" @click="submit(item.throwCalculation, 'throwCalculation', item,index)"/>
             </div>
             <div class="sku-info" style="width:260px;margin-right: 45px;"><span>PCS（包装）</span>：
               <i-input placeholder="请输入" style="width: 140px" v-model="item.pack" @on-enter="submit(item.pack, 'pack', item,index)" v-on:input="detection($event,'pack',index)">
                 <Icon type="ios-arrow-dropdown-circle" :id="'pack-'+ index" slot="suffix" style="color:#808695;font-size: 20px" @click="submit(item.pack, 'pack', item,index)"/>
               </i-input>
             </div>
             <div class="sku-info"><span style="margin-right: -0.35em;letter-spacing:0.35em">中包规格</span>：
               <i-input placeholder="请输入" style="width: 140px" v-model="item.middleStandards" @on-enter="submit(item.middleStandards, 'middleStandards', item,index)" v-on:input="detection($event,'middleStandards',index)">
                 <Icon type="ios-arrow-dropdown-circle" :id="'middleStandards-'+ index" slot="suffix" style="color:#808695;font-size: 20px" @click="submit(item.middleStandards, 'middleStandards', item,index)"/>
               </i-input>
             </div>
             <div class="sku-info" style="width:296px;margin-right:0px "><span>外箱尺寸（长*宽*高cm）</span>：
               <i-input placeholder="请输入" style="width: 120px" v-model="item.outerBoxSize" @on-enter="submit(item.outerBoxSize, 'outerBoxSize', item,index)" v-on:input="detection($event,'outerBoxSize',index)">
                 <Icon type="ios-arrow-dropdown-circle" :id="'outerBoxSize-'+ index" slot="suffix" style="color:#808695;font-size: 20px" @click="submit(item.outerBoxSize, 'outerBoxSize', item,index)"/>
               </i-input>
             </div>
           </div>
           <div class="detail-right" v-if="item.editFlag">
             <!--<span style="position: absolute;bottom:45px;right:110px;">{{time}}</span>-->
             <el-button type="primary" size="small" style="position: absolute;bottom:40px;right:40px;" v-if="!item.isEdit" @click.stop="edit(item, index)">编辑</el-button>
             <el-button size="small" v-if="item.isEdit"  style="position: absolute;bottom:40px;right:40px;" @click.stop="finish(item, index)">结束</el-button>
             <!--<el-button type="info" plain disabled size="small" v-if="">信息按钮</el-button>-->
             <!--<p style="position: absolute;bottom:10px;right:40px;">{{tip}}</p>-->
             <div v-show="item.isEdit">
                 <upload  v-bind:FileDataList="item.proFileList"  v-bind:clearInfo="item.IsClear" v-on:FileDataEmit="GetFileInfo" :filUrl="filUrl" style="margin-left: 0px;float: left;" fileFormId="skuInfo" :buttonStr="buttonStr" :selectType="selectType"></upload>
                 <Button  style="position: absolute;right:10px;top:10px;" shape="circle" @click.stop="submitFile(item, index)">提交图片</Button>
             </div>
           </div>
         </div>
         <div class="drop">
           <!--<div class="triangle-down" v-if="!item.show" @click="slidedown(item,index)">-->
             <!--<span></span>-->
           <!--</div>-->
           <!--<div class="triangle-up" v-if="item.show" @click="slideup(item,index)">-->
             <!--<span></span>-->
           <!--</div>-->
           <div class="dropDown" @click="slidedown(item,index)" v-if="!item.show">
             <i class="el-icon-arrow-down"></i>展开
           </div>
           <div class="dropUp" @click="slideup(item,index)" v-if="item.show">
             <i class="el-icon-arrow-up"></i>收缩
           </div>
         </div>
       </div>
       <div style="width: 100%;height: 50px;float: left;text-align: center;margin-top: 15px" v-if="skuList.length>0">
         <Page :total="total" :page-size="pageSize" show-elevator style="margin: 0 auto;" size="small" @on-change="changePage"/>
       </div>
       <div class="listNone" v-if="skuList.length===0">暂无相关的SKU信息</div>
     </div>
     <!-- 图片预览 -->
     <el-dialog title="图片预览" :visible.sync="dialogShowImg">
       <div class="showImg">
         <img :src="imgUrl" alt style="width: 100%">
       </div>
     </el-dialog>
   </div>
</template>
<style>
  .skuInfo .el-color-picker__trigger {
    width: 120px;
    height: 30px;
  }
</style>
<script>
import upload from '../CustomComp/FileUploadComp.vue'
export default {
  name: 'skuInfo',
  props: ['slideData'],
  data () {
    return {
      buttonStr: '选择图片',
      selectType: '图片',
      FileUploadArr: [],
      // 附件上传 回显
      proFileList: [],
      filUrl: '/file/uploadGoodsFileAjax',
      // 附件上传 组件 是否让子组件清空文件 新组件
      IsClear: false,
      // 图片地址
      imgUrl: '',
      dialogShowImg: false, // 图片预览
      // 搜索sku
      searchCode: '',
      skuList: [],
      isEdit: -1,
      throwCalculation: [{
        value: 0,
        label: '是'
      }, {
        value: 1,
        label: '否'
      }],
      skuObj: {
        IsClear: false,
        proFileList: [],
        attachmentList: [],
        skuCode: '',
        yearDigital: '',
        retailPrice: '',
        tagPrice: '',
        costPrice: '',
        thirdSkuCode: '',
        barCode: '',
        color: '',
        standards: '',
        priceSegment: '',
        taxRate: '',
        otherFunctions: '',
        component: '',
        flavor: '',
        smell: '',
        hight: '',
        length: '',
        width: '',
        volume: '',
        weight: '',
        throwWeight: '',
        throwCalculation: true,
        pack: '',
        middleStandards: '',
        outerBoxSize: ''
      },
      // 当前页数
      pageNum: 1,
      // 总条数
      total: 0,
      status: 0, // 开环状态
      tip: '',
      time: '',
      pageSize: 10,
      spuId: this.$route.params.spuId
    }
  },
  components: {
    upload
  },
  created () {
    this.getList()
    // this.getOnOffStatus()
  },
  watch: {
  },
  methods: {
    detection (val, name, index) {
      $('#' + name + '-' + index).css({color: '#2d8cf0', cursor: 'pointer'})
    },
    // 改变颜色
    changeColor (e, name, index) {
      $('#' + name + '-' + index).css({color: '#2d8cf0', cursor: 'pointer'})
    },
    changeValue (e, name, index) {
      console.log(111)
      $('#' + name + '-' + index).css({color: '#2d8cf0', cursor: 'pointer'})
    },
    // 翻页
    changePage (val) {
      this.pageNum = val
      this.getList()
    },
    // 搜索
    search () {
      this.getList()
    },
    // 是否计抛
    behind (name) {
      return name === 0 ? '否' : '是'
    },
    getOnOffStatus () {
      this.ajax('/myProject/getOnOffStatus', {projectId: this.spuId}).then(res => {
        if (res.code === 200) {
          this.status = res.data.onOffStatus
          this.tip = res.data.statusMsg
          // let time = res.data.second
          // that.setTime(time)
        }
      })
    },
    setTime (time) {
      let that = this
      let setClockNum = setInterval(function () {
        var mo = 0

        if (time > 60) {
          time = time - 60
          mo = Math.ceil(time / 60)
          that.time = '剩余' + mo + '分钟'
        } else {
          that.time = ''
          window.clearInterval(setClockNum)
          setClockNum = null
          that.getOnOffStatus()
        }
      }, 60000)
    },
    // 提交修改数据
    submit (name, parameter, item, index) {
      let obj = {
        skuId: item.id
      }
      this.$set(this.skuList, index, item)
      obj[parameter] = name
      this.ajax('/archives/editSku', JSON.stringify(obj)).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
          $('#' + parameter + '-' + index).css({color: '#808695', cursor: 'Default'})
          $('.ivu-input').blur()
          this.ajax('/archives/getSkuPage', {pageNum: this.pageNum, pageSize: this.pageSize, spuId: this.spuId, skuCode: this.searchCode}).then(res => {
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 图片预览
    showImg (imgs) {
      this.dialogShowImg = true
      this.imgUrl = imgs.previewUrl
    },
    // 获取sku列表数据
    getList () {
      this.ajax('/archives/getSkuPage', {pageNum: this.pageNum, pageSize: this.pageSize, spuId: this.spuId, skuCode: this.searchCode}).then(res => {
        this.skuList = res.data.list
        this.total = res.data.totalRow
        this.skuList.forEach((item, index) => {
          item['show'] = false
          item['isEdit'] = false
          item['proFileList'] = []
        })
      })
    },
    slidedown (item, index) {
      item.show = true
      this.$set(this.skuList, index, item)
    },
    slideup (item, index) {
      item.show = false
      this.$set(this.skuList, index, item)
    },
    edit (item, index) {
      item.isEdit = true
      item.proFileList = []
      let fileListArr = []
      for (var i = 0; item.attachmentList && i < item.attachmentList.length; i++) {
        var obj = {
          attachmentId: item.attachmentList[i].id,
          fileName: item.attachmentList[i].showName,
          previewUrl: item.attachmentList[i].previewUrl
        }
        fileListArr.push(obj)
      }
      item.proFileList = item.proFileList.concat(fileListArr)
      this.FileUploadArr = item.proFileList
      this.$set(this.skuList, index, item)
      // this.ajax('/myProject/onOffMove', {status: true, projectId: 'SPU00001'}).then(res => {
      //   this.getOnOffStatus()
      // })
    },
    finish (item, index) {
      item.isEdit = false
      item.show = false
      this.$set(this.skuList, index, item)
      this.ajax('/archives/getSkuPage', {pageNum: this.pageNum, pageSize: this.pageSize, spuId: this.spuId, skuCode: this.searchCode}).then(res => {
        res.data.list.forEach((items, idx) => {
          if (index === idx) {
            item = items
            this.$set(this.skuList, index, item)
          }
        })
      })
      // this.ajax('/myProject/onOffMove', {status: false, projectId: 'SPU00001'}).then(res => {
      //   this.getOnOffStatus()
      // })
    },
    // 附件上传 获取附件上传组件发来的附件信息 新组件
    GetFileInfo (obj) {
      if (obj) {
        this.IsClear = false
      }
      this.FileUploadArr = obj
    },
    // 附件上传 拼接附件上传的id为字符串
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
    submitFile (item, index) {
      let obj = {
        attachmentId: this.SetFileIdStr(),
        skuId: item.id
      }
      this.ajax('/archives/editSku', JSON.stringify(obj)).then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.IsClear = true
          this.ajax('/archives/getSkuPage', {pageNum: this.pageNum, pageSize: this.pageSize, spuId: this.spuId, skuCode: this.searchCode}).then(res => {
            res.data.list.forEach((items, idx) => {
              if (index === idx) {
                item.attachmentList = items.attachmentList
                // items.proFileList = []
                // let fileListArr = []
                // for (var i = 0; items.attachmentList && i < items.attachmentList.length; i++) {
                //   var obj = {
                //     attachmentId: items.attachmentList[i].id,
                //     fileName: items.attachmentList[i].showName,
                //     previewUrl: items.attachmentList[i].previewUrl
                //   }
                //   fileListArr.push(obj)
                // }
                // items.proFileList = items.proFileList.concat(fileListArr)
                // this.FileUploadArr = items.proFileList
              }
            })
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>

<style scoped>
  .skuInfo {
    float: left;
    width: 100%;
  }
  .skuInfo .sku {
    width: 100%;
  }
  .skuInfo .sku-list {
   width:100%;
   /*height: 175px;*/
   border:1px solid #ccc;
   margin-top: 30px;
   float: left;
   /*box-shadow: 1px 1px 5px #f1f1f1;*/
  }
  .skuInfo .sku-list .left {
    width: 250px;
    height: 100%;
    padding:15px;
    float: left;
    padding-bottom: 5px;
  }
  .skuInfo .sku-list .right {
    width:73%;
    height: 100%;
    float: left;
    padding: 15px;
    padding-bottom: 0;
    /*background: pink;*/
  }
  .skuInfo .sku-list .left .skuCode {
    color:#66D0FF;
    font-size: 18px;
  }
  .skuInfo .sku-list .left .imgBox {
    margin-top: 10px;
  }
  .skuInfo .sku-list .left .imgBox img{
    width: 40px;
    height: 40px;
    margin-right: 10px;
    cursor: pointer;
  }
  .skuInfo .sku-list .right .right-field {
    float: left;
    font-size: 14px;
    padding: 15px;
    margin-right: 80px;
    padding-top: 20px;
  }
  .skuInfo .sku-list .right .right-field i {
    color:red;
    font-size: 16px;
  }
  .skuInfo .sku-list .right .leftName {
     width: 250px;
     height: 40px;
     margin-right: 35px;
     float:left;
     font-size:14px;
     margin-bottom: 10px;
  }
  .skuInfo .sku-list .right .leftName i {
    color:red;
    font-size: 16px;
  }
  .skuInfo .sku-detail {
    width:100%;
    /*min-height: 200px;*/
    background:#FAFAFA;
    border:1px solid #ccc;
    /*box-shadow: 1px 1px 5px #f1f1f1;*/
    border-top:0;
    padding: 15px;
    float: left;
    position: relative;
  }
  .skuInfo .sku-detail .detail-left {
    width: 76%;
    float: left;
  }
  .skuInfo .sku-detail .detail-right {
    width: 24%;
    float: right;
  }
  .skuInfo .sku-detail .sku-info {
    float: left;
    font-size: 14px;
    width: 250px;
    height: 40px;
    margin-right: 50px;
    margin-bottom: 10px;
  }
  .skuInfo .sku-info i{
     color:red;
     font-size: 16px;
  }
  .skuInfo .drop {
    width: 100%;
    height:30px;
    float: left;
  }
  .skuInfo .drop .triangle-down {
    width: 0;
    height: 0;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-top: 15px solid #ccc;
    position: relative;
    margin: -1px auto;
  }
  .skuInfo .drop .triangle-down span {
    display: block;
    width: 0;
    height: 0;
    border-left: 13px solid transparent;
    border-right: 13px solid transparent;
    border-top: 13px solid #fff;
    position: absolute;
    left: -13px;
    top: -15px;
  }
  .skuInfo .drop .dropDown {
    width: 50px;
    height: 25px;
    border: 1px solid #ccc;
    border-top:none;
    margin: -1px auto;
    background:#fff;
    line-height: 25px;
    text-align: center;
    font-size: 12px;
    cursor: pointer;
  }
  .skuInfo .drop .dropUp {
    width: 50px;
    height: 25px;
    border: 1px solid #ccc;
    border-top:#FAFAFA;
    margin: -1px auto;
    background:#fff;
    line-height: 25px;
    text-align: center;
    font-size: 12px;
    cursor: pointer;
    position: relative;
    z-index: 5;
  }
  .skuInfo .drop .triangle-up {
    width: 0;
    height: 0;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-bottom: 15px solid #ccc;
    position: relative;
    margin: -15px auto;
  }
  .skuInfo .drop .triangle-up span {
    display: block;
    width: 0;
    height: 0;
    border-left: 13px solid transparent;
    border-right: 13px solid transparent;
    border-bottom: 13px solid #FAFAFA;
    position: absolute;
    left: -13px;
    bottom: -15px;
  }
  .skuInfo .listNone {
    width: 100%;
    height: 200px;
    text-align: center;
    line-height: 150px;
    color:#ccc;
    float: left;
  }
</style>
