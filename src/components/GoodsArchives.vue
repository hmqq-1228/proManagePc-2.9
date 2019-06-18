<template>
  <div class="GoodsArchives">
    <div style="position: absolute; right: 20px; top: 25px;"><Button @click="createArchivesBtn" type="primary">新建档案</Button></div>
    <div class="goodSer" style="width: 200px;display: inline-block">
      <el-input
        placeholder="请输入商品名称"
        prefix-icon="el-icon-search"
        v-model="inputVal">
      </el-input>
    </div>
    <div class="goodSer" style="width: 200px;display: inline-block;margin-left: 20px;">
      <el-input
        placeholder="请输入商品编码"
        prefix-icon="el-icon-search"
        v-model="spuCode">
      </el-input>
    </div>
    <div class="goodSer" style="width: 200px;display: inline-block;margin-left: 20px;">
      <el-input
        placeholder="请输入负责人,如:张三"
        prefix-icon="el-icon-search"
        v-model="searchUserName">
      </el-input>
    </div>
    <div class="serTag">
      <div class="wrap">
        <div class="label">商品品牌:</div>
        <div class="content">
          <div class="cntItem brand" :class="'c_' + item.code"  @click="btnClick($event, item.code, 'brand')" v-for="item in pinpaiLevel" :key="item.code">{{item.categoryName}}</div>
        </div>
      </div>
      <div class="wrap" v-show="firstLevel.length > 0">
        <div class="label">一级类目:</div>
        <div class="content">
          <div class="cntItem firstLevel" :class="'c_' + item.code" @click="btnClick($event, item.code, item.typeName)" v-for="item in firstLevel" :key="item.code">{{item.categoryName}}</div>
        </div>
      </div>
      <div class="wrap" v-show="secondLevel.length > 0">
        <div class="label">二级类目:</div>
        <div class="content">
          <div class="cntItem secondLevel" :class="'c_' + item.code" @click="btnClick($event, item.code, item.typeName)" v-for="item in secondLevel" :key="item.code">{{item.categoryName}}</div>
        </div>
      </div>
      <div class="wrap" v-show="thirdLevel.length > 0">
        <div class="label">三级类目:</div>
        <div class="content">
          <div class="cntItem thirdLevel" :class="'c_' + item.code" @click="btnClick($event, item.code, item.typeName)" v-for="item in thirdLevel" :key="item.code">{{item.categoryName}}</div>
        </div>
      </div>
      <div class="wrap" v-show="fourLevel.length > 0">
        <div class="label">四级类目:</div>
        <div class="content">
          <div class="cntItem fourLevel" :class="'c_' + item.code" @click="btnClick($event, item.code, item.typeName)" v-for="item in fourLevel" :key="item.code">{{item.categoryName}}</div>
        </div>
      </div>
      <div class="goodType">
        <div class="goodName" style="line-height: 32px;">成 本 价:</div>
        <div>
          <Input v-model="value1" prefix="logo-yen" placeholder="输入金额" style="width: 120px" /> ---
          <Input v-model="value2" prefix="logo-yen" placeholder="输入金额" style="width: 120px" />
        </div>
        <div style="margin-left: 20px;">
          <Select v-model="OptionModel" style="width:200px">
            <Option v-for="item in OptionList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
      </div>
    </div>
    <div class="line">
      <div class="lineName">商品排序:</div>
      <div style="margin-left: 10px">
        <el-radio-group v-model="radioVal" size="mini">
          <el-radio-button label="创建时间"></el-radio-button>
          <!--<el-radio-button label="商品年份"></el-radio-button>-->
          <el-radio-button label="爆品等级"></el-radio-button>
          <!--<el-radio-button label="库存"></el-radio-button>-->
        </el-radio-group>
      </div>
    </div>
    <div class="goodList" v-loading="goodsLoading">
      <div v-if="goodList.length > 0" class="goodItem" v-for="(good, index) in goodList" v-bind:key="index">
        <div class="goodItemCon">
          <div class="goodImg" @click="toGoodsManage(good.spuId)">
            <div style="position: relative;" class="goodImg2 showIcon" v-if="good.attachment[0]">
              <img :src="good.activeImgUrl" alt="">
              <div class="showImageIcon" @click="showGoodsManage($event, good.activeImgUrl)"><Icon size="16" type="ios-expand" /></div>
            </div>
            <div class="goodImg2" v-if="!good.attachment[0]"><img src="../../static/img/defult.png" alt=""></div>
          </div>
          <div class="goodSlider" style="height: 40px;">
            <div v-if="good.attachment.length > 0" v-for="(img, index2) in good.attachment"
                 v-bind:class="good.activeImgUrl === img.previewUrl ? 'active' : ''"
                 v-bind:key="index2" @click="previewImg(img.previewUrl, index)">
              <img v-bind:src="img.previewUrl" alt="">
            </div>
            <div class="active" v-if="good.attachment.length === 0"><img src="../../static/img/defult.png" alt=""></div>
          </div>
          <div class="goodInfo" @click="toGoodsManage(good.spuId)">
            <div class="goodTypeName" :title="good.spuCode">编码: <span v-if="good.spuCode">{{good.spuCode}}</span><span v-if="!good.spuCode" style="color: #999;font-size: 12px;">无编码</span></div>
            <div class="goodTypeName" :title="good.spuName">品名: <span v-if="good.spuName">{{good.spuName}}</span><span v-if="!good.spuName" style="color: #999;font-size: 12px;">未命名</span></div>
            <div class="goodTypeName" :title="good.brandName">品牌: <span v-if="good.brandName">{{good.brandName}}</span><span v-if="!good.brandName" style="color: #999;font-size: 12px;">未分类</span></div>
            <div class="goodTypeName" :title="good.category">分类: <span v-if="good.category">{{good.category}}</span><span v-if="!good.category" style="color: #999;font-size: 12px;">未分类</span></div>
            <div class="goodTypeName" :title="good.userName">负责人: <span v-if="good.userName">{{good.userName}}</span><span v-if="!good.userName" style="color: #999;font-size: 12px;">暂无负责人</span></div>
          </div>
        </div>
      </div>
      <div v-if="goodList.length === 0" class="noDate">暂无数据</div>
    </div>
    <el-dialog title="图片预览" :visible.sync="dialogVisible" :width="imgWide + '%'">
      <div class="controlImgWidth" style="position: absolute;top: 15px;left: 45%">
        <div @click="addImgWide()">放大</div>
        <div @click="delImgWide()">缩小</div>
      </div>
      <div><img :src="goodsImgUrl" alt=""></div>
    </el-dialog>
    <div class="block" style="text-align: center;margin-top: 30px;">
      <el-pagination
        @current-change="handleCurrentChange($event)"
        background
        :current-page = 'currentPage'
        :page-size="getGoodList.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="goodListTotal">
      </el-pagination>
    </div>
    <!--新建档案-->
    <Modal v-model="creatArchivesShow" title="新建档案" @on-ok="createArchivesSub" @on-cancel="createArchivesCancel">
      <!--<div class="createGroupCnt">-->
        <!--<div style="color: #e13d13; width: 10px; line-height: 40px;">*</div>-->
        <!--<div class="createGroupCntItem">商品名称:</div>-->
        <!--<div class="createGroupCntItem GroupCntItemVal">-->
          <!--<el-input placeholder="请输入商品名称" v-model="createArchivesName"></el-input>-->
        <!--</div>-->
      <!--</div>-->
      <!--<div class="createGroupCnt">-->
        <!--<div style="color: #e13d13; width: 10px; line-height: 40px;">*</div>-->
        <!--<div class="createGroupCntItem">商品ID:</div>-->
        <!--<div class="createGroupCntItem GroupCntItemVal">-->
          <!--<el-input placeholder="请输入商品ID" v-model="createArchivesId"></el-input>-->
        <!--</div>-->
      <!--</div>-->
      <!--<div class="createGroupCnt">-->
        <!--<div style="color: #e13d13; width: 10px; line-height: 40px;">*</div>-->
        <!--<div class="createGroupCntItem">品牌:</div>-->
        <!--<div class="createGroupCntItem GroupCntItemVal">-->
          <!--<Select v-model="pinpaiCodeVal">-->
            <!--<Option v-for="brand in brandTypeArr" :key="brand.dictCode" :value="brand.dictCode">{{ brand.dictName }}</Option>-->
          <!--</Select>-->
        <!--</div>-->
      <!--</div>-->
      <!--<div class="createGroupCnt">-->
        <!--<div style="color: #e13d13; width: 10px; line-height: 40px;">*</div>-->
        <!--<div class="createGroupCntItem">负责人:</div>-->
        <!--<div class="createGroupCntItem GroupCntItemVal">-->
          <!--<el-autocomplete style="width: 100%"-->
             <!--v-model="CreateGroupSearchManager"-->
             <!--:fetch-suggestions="queryNewGroupManager"-->
             <!--placeholder="搜索小组负责人"-->
             <!--:trigger-on-focus="false"-->
             <!--@select="CreateGroupManagerSelect($event)"-->
          <!--&gt;</el-autocomplete>-->
        <!--</div>-->
      <!--</div>-->
      <!--<div class="createGroupCnt">-->
        <!--<div style="color: #e13d13; width: 10px; line-height: 40px;">*</div>-->
        <!--<div class="createGroupCntItem">产品小组:</div>-->
        <!--<div class="createGroupCntItem GroupCntItemVal">-->
          <!--<el-autocomplete style="width: 100%"-->
             <!--v-model="ArchivesGroupSearch"-->
             <!--:fetch-suggestions="queryArchivesGroup"-->
             <!--placeholder="搜索小组"-->
             <!--:trigger-on-focus="false"-->
             <!--@select="ArchivesGroupSelect($event)"-->
          <!--&gt;</el-autocomplete>-->
        <!--</div>-->
        <!--<div style="width: 90px; text-align: right; padding-top: 2px;"><Button @click="showGroupList" type="primary" >选择小组</Button></div>-->
      <!--</div>-->
      <!--<div class="createGroupCnt">-->
        <!--<div style="color: #e13d13; width: 10px; line-height: 40px;">*</div>-->
        <!--<div class="createGroupCntItem">SPU编码:</div>-->
        <!--<div class="createGroupCntItem GroupCntItemVal">-->
          <!--<el-input placeholder="请输入SPU编码" v-model="createArchivesSpuCode"></el-input>-->
        <!--</div>-->
      <!--</div>-->
      <!--<div class="createGroupCnt">-->
        <!--<div style="color: #e13d13; width: 10px; line-height: 40px;"></div>-->
        <!--<div class="createGroupCntItem">附件上传:</div>-->
        <!--<div class="createGroupCntItem GroupCntItemVal">-->
          <!--<component v-bind:is="compArr.FileUploadComp" :filUrl="filUrl" v-bind:clearInfo="IsClear" v-on:FileDataEmit="GetFileInfo"></component>-->
        <!--</div>-->
      <!--</div>-->
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="商品名称" prop="createArchivesName">
          <Input v-model="formValidate.createArchivesName" placeholder="请输入商品名称"></Input>
        </FormItem>
        <FormItem label="商品ID" prop="createArchivesId">
          <Input v-model="formValidate.createArchivesId" placeholder="请输入商品ID"></Input>
        </FormItem>
        <FormItem label="品牌名称" prop="pinpaiCodeVal">
          <!--<Input v-model="formValidate.pinpaiCodeVal" placeholder="请输入商品ID"></Input>-->
          <Select v-model="formValidate.pinpaiCodeVal">
            <Option v-for="brand in brandTypeArr" :key="brand.dictCode" :value="brand.dictCode">{{ brand.dictName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="负责人" prop="CreateGroupSearchManager">
          <!--<Input v-model="formValidate.createArchivesId" placeholder="请输入商品ID"></Input>-->
          <el-autocomplete style="width: 100%"
              v-model="formValidate.CreateGroupSearchManager"
              :fetch-suggestions="queryNewGroupManager"
              placeholder="搜索小组负责人"
              :trigger-on-focus="false"
              @select="CreateGroupManagerSelect($event)"
          ></el-autocomplete>
        </FormItem>
        <FormItem label="选择小组" prop="ArchivesGroupSearch">
          <!--<Input v-model="formValidate.createArchivesId" placeholder="请输入商品ID"></Input>-->
          <div style="display: flex">
            <div style="flex-grow: 1">
              <el-autocomplete style="width: 100%"
                               v-model="formValidate.ArchivesGroupSearch"
                               :fetch-suggestions="queryArchivesGroup"
                               placeholder="搜索小组"
                               :trigger-on-focus="false"
                               @select="ArchivesGroupSelect($event)"
              ></el-autocomplete>
            </div>
            <div style="width: 90px; text-align: right; padding-top: 2px;"><Button @click="showGroupList" type="primary" >选择小组</Button></div>
          </div>
        </FormItem>
        <FormItem label="SPU编码" prop="createArchivesSpuCode">
          <!--<Input v-model="formValidate.createArchivesId" placeholder="请输入商品ID"></Input>-->
          <el-input placeholder="请输入SPU编码" v-model="formValidate.createArchivesSpuCode"></el-input>
        </FormItem>
        <FormItem label="图片上传" prop="">
          <!--<Input v-model="formValidate.createArchivesId" placeholder="请输入商品ID"></Input>-->
          <component v-bind:is="compArr.FileUploadComp" :buttonStr="buttonStr" :selectType="selectType" :filUrl="filUrl" v-bind:clearInfo="IsClear" v-on:FileDataEmit="GetFileInfo"></component>
        </FormItem>
        <!--<component v-bind:is="compArr.FileUploadComp" :filUrl="filUrl" v-bind:clearInfo="IsClear" v-on:FileDataEmit="GetFileInfo"></component>-->
      </Form>
      <!-- 自定义页脚 -->
      <div slot="footer">
        <Button @click="createArchivesCancel">取消</Button>
        <Button type="primary" @click="createArchivesSub('formValidate')">确定</Button>
      </div>
    </Modal>
    <!--小组列表-->
    <!--小组列表 选择小组-->
    <select-group :select="creatArchivesGroupList" @groupListSelectOk="groupListSelectOk" @groupListSelectCancel="groupListSelectCancel"></select-group>
    <!---->
  </div>
</template>

<script>
import FileUploadComp from './CustomComp/FileUploadComp.vue'
import SelectGroup from './CustomComp/SelectGroup.vue'
export default {
  name: 'GoodsArchives',
  components: {
    FileUploadComp,
    SelectGroup
  },
  data () {
    return {
      // 新建档案
      selectType: '图片',
      buttonStr: '选择图片',
      valueCheck: '',
      selectedGroupData: '',
      goodsLoading: false,
      totalRow: 0,
      pageNumber: 1,
      pageSize: 10,
      tableColumns: [],
      tableData: [],
      columns3: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '小组名称',
          key: 'name'
        },
        {
          title: '创建人',
          key: 'creatorName'
        },
        {
          title: '创建时间',
          key: 'createDt'
        }
      ],
      data1: [
        {
          groupName: '玩教研发组',
          creator: '张三',
          id: 1,
          createDate: '2016-10-03'
        },
        {
          groupName: '出行档案组',
          creator: '李四',
          id: 2,
          createDate: '2016-10-01'
        },
        {
          groupName: 'KUB喂养',
          creator: '王五',
          id: 3,
          createDate: '2016-10-02'
        },
        {
          groupName: 'KUB创意设计',
          creator: '赵六',
          id: 4,
          createDate: '2016-10-04'
        }
      ],
      creatArchivesGroupList: false,
      compArr: {
        FileUploadComp: 'FileUploadComp',
        SelectGroup: 'SelectGroup'
      },
      filUrl: '/file/uploadGoodsFileAjax',
      // 附件上传
      FileUploadArr: [],
      IsClear: false,
      pinpaiCodeVal: '',
      brandTypeArr: [],
      searchGroup: '',
      createArchivesSpuCode: '',
      createArchivesId: '',
      createArchivesName: '',
      CreateArchivesMid: '',
      ArchivesGroupId: '',
      NewGroupManagerPayload: {
        projectManager: ''
      },
      CreateGroupSearchManager: '',
      ArchivesGroupSearch: '',
      creatArchivesShow: false,
      // xin end
      imgWide: 50,
      value1: this.$store.state.startCostPrice,
      value2: this.$store.state.endCostPrice,
      num: 0,
      msg: '',
      permission: [],
      OptionModel: '',
      OptionList: [],
      pinpaiLevel: [],
      firstLevel: [],
      secondLevel: [],
      thirdLevel: [],
      fourLevel: [],
      codeArr: [],
      goodsImgUrl: '',
      currentPage: 1,
      dialogVisible: false,
      inputVal: this.$store.state.goodsName,
      spuCode: this.$store.state.spuCode,
      searchUserName: this.$store.state.searchUserName,
      radioVal: this.$store.state.sortTypeName,
      goodTags: [],
      goodList: [],
      setRouterArr: [],
      routerList2: [],
      goodNextTags: [],
      goodListTotal: 0,
      getGoodList: {
        pageNum: 1,
        pageSize: 12,
        status: '',
        spuCode: this.$store.state.spuCode,
        goodsName: this.$store.state.goodsName,
        sortType: this.$store.state.sortType,
        categoryType: '',
        startCostPrice: this.$store.state.startCostPrice,
        endCostPrice: this.$store.state.endCostPrice,
        searchUserName: this.$store.state.searchUserName,
        categoryStr: '',
        permission: ''
      },
      formValidate: {
        createArchivesName: '',
        createArchivesId: '',
        pinpaiCodeVal: '',
        CreateGroupSearchManager: '',
        ArchivesGroupSearch: '',
        ArchivesGroupId: '',
        createArchivesSpuCode: '',
        desc: ''
      },
      ruleValidate: {
        createArchivesName: [
          { required: true, message: '商品名称不能为空', trigger: 'blur' }
        ],
        createArchivesId: [
          { required: true, message: '商品ID不能为空', trigger: 'blur' }
        ],
        pinpaiCodeVal: [
          { required: true, message: '品牌名称不能为空', trigger: 'change' }
        ],
        CreateGroupSearchManager: [
          { required: true, message: '负责人不能为空', trigger: 'change' }
        ],
        ArchivesGroupSearch: [
          { required: true, message: '小组不能为空', trigger: 'change' }
        ],
        createArchivesSpuCode: [
          { required: true, message: 'SPU编码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    dialogVisible: function (val, oV) {
      if (val === false) {
        this.imgWide = 50
      }
    },
    value1: function (val, oV) {
      var that = this
      if (val) {
        that.getGoodList.startCostPrice = val
        that.$store.state.startCostPrice = val
        that.getGoodsList()
      } else {
        that.getGoodList.startCostPrice = ''
        that.$store.state.startCostPrice = ''
        that.getGoodsList()
      }
    },
    OptionModel: function (val, oV) {
      var that = this
      if (val) {
        that.getGoodList.pageNum = 1
        that.$store.state.permission = val
        that.getGoodList.permission = val
        that.getGoodsList()
      }
    },
    num (val, old) {
      var that = this
      this.routerFuc(that.$store.state.codeArr, 'ini')
    },
    value2: function (val, oV) {
      var that = this
      if (val) {
        that.getGoodList.endCostPrice = val
        that.$store.state.endCostPrice = val
        that.getGoodsList()
      } else {
        that.getGoodList.endCostPrice = ''
        that.$store.state.endCostPrice = ''
        that.getGoodsList()
      }
    },
    // 监听搜索值
    inputVal: function (val, oV) {
      var that = this
      that.$store.state.goodsName = val
      that.getGoodList.goodsName = val
      that.getGoodsList()
    },
    spuCode: function (val, oV) {
      var that = this
      that.$store.state.spuCode = val
      that.getGoodList.spuCode = val
      that.getGoodsList()
    },
    searchUserName: function (val, oV) {
      var that = this
      that.$store.state.searchUserName = val
      that.getGoodList.searchUserName = val
      that.getGoodsList()
    },
    // 商品排序
    radioVal: function (val, oV) {
      var that = this
      if (val === '创建时间') {
        that.$store.state.sortTypeName = '创建时间'
        that.getGoodList.sortType = '1'
        that.$store.state.sortType = '1'
        that.getGoodsList()
      } else if (val === '商品年份') {
        that.$store.state.sortTypeName = '商品年份'
        that.getGoodList.sortType = '2'
        that.$store.state.sortType = '2'
        that.getGoodsList()
      } else if (val === '爆品等级') {
        that.$store.state.sortTypeName = '爆品等级'
        that.getGoodList.sortType = '3'
        that.$store.state.sortType = '3'
        that.getGoodsList()
      }
    }
  },
  created: function () {
    var that = this
    // 默认查询分类
    that.codeArr = that.$store.state.codeArr
    var codeStr = ''
    for (var i = 0; i < that.codeArr.length; i++) {
      var dou = i < (that.codeArr.length - 1) ? ',' : ''
      codeStr = codeStr + that.codeArr[i].code + dou
    }
    this.iniBtn()
    that.getGoodsList(codeStr)
    that.getPermission()
    that.queryOptionType()
    that.log('debugAll:', that.$store.state.debugAll)
  },
  mounted: function () {
    /** 设置侧边栏激活状态 */
    this.$store.commit('setNavActive', {navName: '商品管理', childNavName: '档案管理'})
  },
  methods: {
    groupListSelectOk: function (val) {
      this.creatArchivesGroupList = false
      this.ArchivesGroupId = val.id
      this.formValidate.ArchivesGroupId = val.id
      this.formValidate.ArchivesGroupSearch = val.name
      // this.selectedGroupData
    },
    groupListSelectCancel () {
      this.creatArchivesGroupList = false
    },
    showGroupList: function () {
      // this.creatArchivesShow = false
      this.creatArchivesGroupList = true
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
    // 获取附件上传组件发来的附件信息
    GetFileInfo (obj) {
      if (obj) {
        this.IsClear = false
      }
      this.FileUploadArr = obj
    },
    queryOptionType: function () {
      var that = this
      this.ajax('/archives/getOptionType', {}).then(res => {
        that.log('getOptionType:', res)
        if (res.code === 200) {
          that.brandTypeArr = res.data.brandType
          that.formValidate.pinpaiCodeVal = res.data.brandType[0].dictCode
          that.pinpaiCodeVal = res.data.brandType[0].dictCode
          // that.materialType = res.data.materialType
          // that.intendedFor = res.data.intendedFor
          // that.goodsRole = res.data.goodsRole
          // that.usageStage = res.data.usageStage
          // that.desStyle = res.data.style
          // that.goodsLevel = res.data.goodsLevel
          // that.season = res.data.season
          // that.changjingArr = res.data.scene
        }
        // that.log('getOptionType：1:', res)
      })
    },
    CreateGroupManagerSelect (item) {
      this.log('搜索负责人：', item)
      this.CreateArchivesMid = item.userId
    },
    // ArchivesGroupSelect
    ArchivesGroupSelect (item) {
      this.log('新建小组：', item)
      this.ArchivesGroupId = item.groupId
      this.formValidate.ArchivesGroupId = item.groupId
    },
    // 新建 搜索选择项目负责人
    queryNewGroupManager (queryString, cb) {
      var that = this
      if (queryString) {
        that.NewGroupManagerPayload.projectManager = queryString
        this.ajax('/myProject/autoCompleteNames', that.NewGroupManagerPayload).then(res => {
          if (res.code === 200) {
            var dddarr = []
            if (res.data.length > 0) {
              for (var i = 0; i < res.data.length; i++) {
                var obj = {}
                obj.value = res.data[i].Name + ' (' + res.data[i].jName + ')'
                obj.userId = res.data[i].ID
                dddarr.push(obj)
              }
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
    // queryArchivesGroupManager
    // 新建 搜索选择项目小组
    queryArchivesGroup (queryString, cb) {
      var that = this
      if (queryString) {
        // that.NewGroupManagerPayload.projectManager = queryString
        this.ajax('/group/getGroup', {groupName: queryString, type: 1, pageNum: 1, pageSize: 100}).then(res => {
          that.log('getGroup:', res)
          if (res.code === 200) {
            var dddarr = []
            if (res.data.list.length > 0) {
              for (var i = 0; i < res.data.list.length; i++) {
                var obj = {}
                obj.value = res.data.list[i].name
                obj.groupId = res.data.list[i].id
                dddarr.push(obj)
              }
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
    // 非空判断
    argumentsCheck: function () {
      // alert(arguments.length)
      var nullflag = true
      for (var i = 0; i < arguments.length; i++) {
        if (arguments[i].trim().length === 0) {
          nullflag = false
          break
        }
      }
      // this.creatArchivesShow = true
      return nullflag
    },
    createArchivesSub: function (name) {
      var that = this
      this.$refs[name].validate((valid) => {
        if (valid) {
          var createArchivesPayload = {
            spuName: that.formValidate.createArchivesName,
            spuGoodsId: that.formValidate.createArchivesId,
            brandCode: that.formValidate.pinpaiCodeVal,
            spuCode: that.formValidate.createArchivesSpuCode,
            managerId: that.CreateArchivesMid,
            groupId: that.formValidate.ArchivesGroupId,
            attachmentId: that.SetFileIdStr()
          }
          this.ajax('/archives/addSpuBasic', JSON.stringify(createArchivesPayload)).then(res => {
            that.log('addGroup:', res)
            if (res.code === 200) {
              that.IsClear = true
              that.getGoodsList()
              that.$Message.success(res.msg)
              this.$router.push('/goodsfileDetail/' + res.data)
              this.creatArchivesShow = false
              // that.$message(res.msg)
              // that.queryGroupList()
              // that.GroupList = res.data.list
            } else {
              that.$message.warning(res.msg)
            }
          })
        }
      })
      // if (!that.argumentsCheck(that.createArchivesName, that.createArchivesId, that.pinpaiCodeVal, that.createArchivesSpuCode, that.CreateArchivesMid, that.ArchivesGroupId)) {
      //   that.valueCheck('有必填项未填写')
      //   return
      // }
      that.log('看看有没有放行')
      // string.trim()
    },
    createArchivesCancel: function () {
      this.creatArchivesShow = false
    },
    createArchivesBtn: function () {
      this.creatArchivesShow = true
      this.formValidate.CreateGroupSearchManager = this.$store.state.userName + '(' + this.$store.state.jName + ')'
      this.CreateArchivesMid = this.$store.state.userId
    },
    getPermission: function () {
      var that = this
      that.ajax('/archives/getPermission', {menuId: that.$store.state.menuId}).then(res => {
        if (res.code === 200) {
          that.OptionList = res.data
          if (that.$store.state.permission) {
            that.OptionModel = that.$store.state.permission
          } else {
            that.OptionModel = res.data[0].value
          }
        }
      })
    },
    addImgWide: function () {
      if (this.imgWide < 90) {
        this.imgWide = this.imgWide + 10
      }
    },
    delImgWide: function () {
      if (this.imgWide > 30) {
        this.imgWide = this.imgWide - 10
      }
    },
    showGoodsManage: function (e, url) {
      e.stopPropagation()
      if (url) {
        this.goodsImgUrl = url
        this.dialogVisible = true
      } else {
        this.$message.warning('暂无商品图片')
      }
    },
    toGoodsManage: function (goodId) {
      if (goodId) {
        this.$store.state.spuId = goodId
        this.$router.push('/goodsfileDetail/' + goodId)
      }
    },
    // 切换 预览图片
    previewImg: function (url, index) {
      var that = this
      var newGoodList = []
      that.goodList[index].activeImgUrl = url
      for (var t = 0; t < that.goodList.length; t++) {
        newGoodList.push(that.goodList[t])
      }
      that.goodList = []
      that.goodList = newGoodList
    },
    // 查询商品列表
    getGoodsList: function (code) {
      var that = this
      that.goodsLoading = true
      if (code) {
        that.getGoodList.categoryStr = code
        that.ajax('/archives/getGoodsList', that.getGoodList).then(res => {
          if (res.code === 200) {
            that.goodList = res.data.list
            that.goodListTotal = res.data.totalRow
            that.goodsLoading = false
            for (var i = 0; i < res.data.list.length; i++) {
              if (res.data.list[i].attachment.length > 0) {
                res.data.list[i].activeImgUrl = res.data.list[i].attachment[0].previewUrl
              }
            }
          }
        })
      } else {
        that.codeArr = that.$store.state.codeArr
        var codeStr = ''
        for (var i = 0; i < that.codeArr.length; i++) {
          var dou = i < (that.codeArr.length - 1) ? ',' : ''
          codeStr = codeStr + that.codeArr[i].code + dou
        }
        that.getGoodList.categoryStr = codeStr
        that.ajax('/archives/getGoodsList', that.getGoodList).then(res => {
          if (res.code === 200) {
            that.goodList = res.data.list
            that.goodListTotal = res.data.totalRow
            that.goodsLoading = false
            for (var i = 0; i < res.data.list.length; i++) {
              if (res.data.list[i].attachment.length > 0) {
                res.data.list[i].activeImgUrl = res.data.list[i].attachment[0].previewUrl
              }
            }
          }
        })
      }
    },
    // 分页
    handleCurrentChange: function (e) {
      var that = this
      that.currentPage = e
      that.getGoodList.pageNum = e
      that.getGoodsList()
    },
    // 第二级到第四级查询
    routerFuc: function (arr, isIni) {
      var that = this
      that.actionEmit(arr[that.num].code, isIni)
    },
    actionEmit: function (codeStr, isIni) {
      var that = this
      that.ajax('/archives/getDownByCategory', {categoryStr: codeStr}).then(res => {
        that.log('getDownByCategory:', res)
        if (res.code === 200) {
          switch (res.data[0].typeName) {
            case '一级类目':
              that.firstLevel = res.data
              that.secondLevel = []
              that.thirdLevel = []
              that.fourLevel = []
              $('.firstLevel').removeClass('active')
              break
            case '二级类目':
              that.secondLevel = res.data
              that.thirdLevel = []
              that.fourLevel = []
              $('.secondLevel').removeClass('active')
              break
            case '三级类目':
              that.thirdLevel = res.data
              that.fourLevel = []
              $('.thirdLevel').removeClass('active')
              break
            case '四级类目':
              that.fourLevel = res.data
              $('.fourLevel').removeClass('active')
              break
            default:
              that.log('case null')
          }
          if (isIni === 'ini' && that.num < (that.$store.state.codeArr.length - 1)) {
            that.num = that.num + 1
          }
          if (that.num === (that.$store.state.codeArr.length - 1) && isIni === 'ini') {
            that.log(123)
            setTimeout(function () {
              var cc = that.$store.state.codeArr
              for (var r = 0; r < cc.length; r++) {
                $('.c_' + cc[r].code).addClass('active').siblings().removeClass('active')
                // $('.c_').removeClass('active')
              }
            }, 200)
          }
        }
      })
    },
    iniBtn: function () {
      var that = this
      that.ajax('/archives/getBrandType', {}).then(res => {
        if (res.code === 200) {
          this.pinpaiLevel = res.data.brandType
          if (this.$store.state.codeArr.length > 0) {
            that.routerFuc(this.$store.state.codeArr, 'ini')
            $('.c_').removeClass('active')
          } else if (this.$store.state.codeArr.length === 0) {
            setTimeout(function () {
              $('.c_').addClass('active')
            }, 200)
          }
        }
      })
    },
    btnClick: function (e, code, type) {
      var that = this
      var obj = e.currentTarget
      $(obj).addClass('active').siblings().removeClass('active')
      if (code) {
        var isthat = false
        var tindex = -1
        for (var t = 0; t < that.codeArr.length; t++) {
          if (that.codeArr[t].type === type) {
            isthat = true
            tindex = t
            break
          }
        }
        var dataobj = {
          code: code,
          type: type
        }
        if (isthat) {
          that.codeArr.splice(tindex, that.codeArr.length, dataobj)
        } else {
          that.codeArr.push(dataobj)
        }
        that.$store.state.codeArr = that.codeArr
      } else if (code === '') {
        that.codeArr = []
        that.firstLevel = []
        that.secondLevel = []
        that.thirdLevel = []
        that.fourLevel = []
        that.$store.state.codeArr = that.codeArr
      }
      var codeStr = ''
      for (var i = 0; i < that.codeArr.length; i++) {
        var dou = i < (that.codeArr.length - 1) ? ',' : ''
        codeStr = codeStr + that.codeArr[i].code + dou
      }
      that.actionEmit(codeStr)
      that.getGoodsList(codeStr)
    }
  }
}
</script>

<style scoped>
  .GoodsArchives{
    position: relative;
  }
  .goodType{
    display: flex;
    font-size: 14px;
    margin-top: 10px;
    padding: 0 10px;
  }
  .goodBox .active{
    color: #fff;
    background-color: #34c5be;
  }
  .goodName{
    width: 64px;
    color: #777;
  }
  .goodBox{
    display: flex;
  }
  .goodBox>div{
    font-size: 12px;
    padding: 0 12px;
    background-color: #f5f8fa;
    height: 22px;
    line-height: 22px;
    color: #999;
    margin-left: 10px;
    cursor: pointer;
    border-radius: 4px;
  }
  .line{
    display: flex;
    margin-top: 10px;
    height: 36px;
    line-height: 36px;
    padding: 0 10px;
    background-color: #f5f8fa;
    /*border-top: 1px solid #ccc;*/
  }
  .lineName{
    width: 64px;
    color: #666;
  }
  .goodImg{
    width: 230px;
    height: 190px;
    overflow: hidden;
  }
  .goodImg2{
    width: 228px;
    height: 190px;
    overflow: hidden;
    border-bottom: 1px solid #cacaca
    /*display: flex;*/
    /*justify-content: center;*/
    /*align-items: center;*/
  }
  .goodItemCon:hover .goodImg2{
    border-bottom: 1px solid #34c5be
  }
  div>img{
    width: 100%;
    height: 100%;
  }
  .goodList{
    display: flex;
    flex-wrap: wrap;
    padding: 0 15px;
    min-height: 600px;
    justify-content: flex-start;
  }
  .goodItem{
    width: 260px;
    margin-top: 20px;
  }
  .goodItemCon{
    width: 230px;
    margin: 0 auto;
    cursor: pointer;
    border: 1px solid #cacaca;
    box-shadow: 1px 1px 4px #f1f1f1;
  }
  .goodItemCon:hover{
    border: 1px solid #34c5be;
    box-shadow: 1px 1px 6px #ccc;
  }
  .goodSlider{
    width: 100%;
    display: flex;
    margin-top: 6px;
    justify-content: center;
  }
  .goodSlider>div{
    height: 40px;
    width: 40px;
    margin-left: 3px;
    border: 1px solid #cacaca;
    background-color: #f5f8fa;
  }
  .goodSlider>div:nth-of-type(1){
    margin-left: 0;
  }
  .goodSlider .active{
    box-shadow: 1px 1px 4px #ccc;
    border: 1px solid #34c5be;
  }
  .goodInfo{
    width: 100%;
    padding: 10px;
    line-height: 24px;
    font-size: 14px;
  }
  .goodInfo>div>span{
    color: #666;
  }
  .goodInfo .goodTypeName{
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap
  }
  .noDate{
    width: 100%;
    text-align: center;
    color: #888;
    font-size: 14px;
    margin-top: 100px;
  }
  .goodInfo>div .statuStyle0{
    color: chocolate;
  }
  .goodInfo>div .statuStyle1{
    color: #409EFF;
  }
  .goodInfo>div .statuStyle2{
    color: #13ce66;
  }
  .goodImg2.showIcon div{
    display: none;
  }
  .goodImg2.showIcon:hover div{
    display: block;
  }
  .showImageIcon{
    position: absolute;
    top: 0;
    right: 0;
    background: rgba(0,0,0,0.3);
    padding: 2px;
    color: #fff;
  }
  .controlImgWidth{
    font-size: 12px;
    color: #409EFF;
    width: 100px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
  }
  .controlImgWidth > div{
    width: 40px;
    cursor: pointer;
    text-align: center;
  }
  /*.showImageIcon.showIcon{*/
    /*display: block;*/
  /*}*/
  .wrap{
    display: flex;
    padding: 0 10px;
  }
  .label{
    padding-top: 10px;
    font-size: 14px;
    color: #777;
  }
  .content{
    display: flex;
    height: 22px;
    margin-top: 10px;
    line-height: 22px;
  }
  .content div{
    font-size: 12px;
    padding: 0 12px;
    height: 22px;
    line-height: 22px;
    color: #999;
    margin-left: 10px;
    cursor: pointer;
    border-radius: 4px;
    background-color: #f5f8fa;
  }
  .content div.active{
    color: #fff;
    background-color: #34c5be;
  }
  /* 新建档案 表单 */
  .createGroupCnt{
    display: flex;
    margin-bottom: 15px;
  }
  .createGroupCntItem{
    width: 70px;
    font-size: 14px;
    font-weight: bold;
    padding-top: 0px;
    line-height: 35px;
  }
  .createGroupCntItem.GroupCntItemVal{
    flex-grow: 1;
  }
</style>
