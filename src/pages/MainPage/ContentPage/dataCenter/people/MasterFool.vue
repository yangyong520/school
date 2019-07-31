<template>
  <!--头部-->
  <div class="MasterFool">
    <div class="inner-style">
      <div class="box-left">
      </div>
      <div class="box-right">
        <div class="btn-box">
          <a-input-search placeholder="姓名/工号" v-model="val" @search="searchMasterFool" enterButton/>
        </div>
        <div class="btn-box" @click="visibleMaster = !visibleMaster">
          <i style="font-size: 20px;" class="iconfont iconshaixuan"></i>
        </div>
      </div>
    </div>
    <!--列表-->
    <a-spin :spinning="spinning">
      <a-table
        :columns="columns"
        :dataSource="MasterListData"
        :pagination="false"
        rowKey="id">
        <template slot="buildFormList" slot-scope="row">
          <div v-if="row.buildFormList && row.buildFormList.length > 1">
            <a-tooltip placement="top" >
              <template slot="title">
                <div v-for="(item, index) in row.buildFormList" :key="index">
                  {{item.areaName}}-{{item.buildName}}
                </div>
              </template>
              {{row.buildFormList[0].areaName}}-{{row.buildFormList[0].buildName}}...
            </a-tooltip>
          </div>
          <div v-else>
            <div v-for="(item, index) in row.buildFormList" :key="index">
              {{item.areaName}}-{{item.buildName}}
            </div>
          </div>
        </template>
      </a-table>
    </a-spin>
    <div class="pagination-page-box">
      <a-pagination
        class="pagination-page"
        size="small"
        :current="pageinfo.pageNum"
        :total="pageinfo.totalElements"
        showSizeChanger
        showQuickJumper
        :pageSize="pageinfo.pageSize"
        @change="changePage"
        @showSizeChange="changeSize"
      />
    </div>
    <!--查询弹窗-->
    <a-modal
      title="筛选"
      :maskClosable="false"
      v-model="visibleMaster"
      @ok="searchMasterFool"
      okText="查询"
      class="lookMasterFool">
      <div class="input-box">
        <span>区域:</span>
        <a-select class="input-select" v-model="areaId">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option v-for="(item) in areaListArr" :key="item.id">{{item.areaName}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span>性别:</span>
        <a-select v-model="sex" placeholder="请选择性别" class="input-select">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option value="男">男</a-select-option>
          <a-select-option value="女">女</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <a-button block @click="foolSearch">重置</a-button>
      </div>
    </a-modal>
    <!--修改弹窗-->
    <a-modal
      title="编辑"
      :maskClosable="false"
      @cancel="getMasterFoolList"
      v-model="visibleFoolSet"
      @ok="setMastterOk"
      okText="确定"
      class="modal-box boxBanModal">
      <div class="visible-notes-img" style="width: 100px;height: 100px">
        <img :src="FoolObj.userPicth" alt>
      </div>
      <div class="studentDiv" style="width: 495px">
        <div class="visibleNotesDeailDiv new-label-width">
          <label>姓名:</label>
          <a-input
            :disabled="true"
            v-model="FoolObj.sgName"
            class="input-box-item boxBanModalInput"
            placeholder="请输入姓名"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>工号:</label>
          <a-input
            :disabled="true"
            v-model="FoolObj.sgNumber"
            class="input-box-item boxBanModalInput"
            placeholder="请输入工号"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>证件类型:</label>
          <a-input
            :disabled="true"
            v-model="FoolObj.idType"
            class="input-box-item boxBanModalInput"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>证件号码:</label>
          <a-input
            :disabled="true"
            class="input-box-item boxBanModalInput"
            v-model="FoolObj.idNum"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>手机号码:</label>
          <a-input
            :disabled="true"
            v-model="FoolObj.sgPhone"
            class="input-box-item boxBanModalInput"
            placeholder="请输入手机号码"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>国籍/地区:</label>
          <a-input
            :disabled="true"
            class="input-box-item boxBanModalInput"
            v-model="FoolObj.country"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>民族:</label>
          <a-input
            size="small"
            :disabled="true"
            v-model="FoolObj.nation"
            class="input-box-item boxBanModalInput"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>性别:</label>
          <a-input
            size="small"
            :disabled="true"
            v-model="FoolObj.sex"
            class="input-box-item boxBanModalInput"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>年龄:</label>
          <a-input
            :disabled="true"
            class="input-box-item boxBanModalInput"
            v-model="FoolObj.age"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>所属机构:</label>
          <a-input
            :disabled="true"
            class="input-box-item boxBanModalInput"
            v-model="FoolObj.machinery"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>行政职务:</label>
          <a-input
            :disabled="true"
            class="input-box-item boxBanModalInput"
            v-model="FoolObj.duty"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>所属院系:</label>
          <a-input
            :disabled="true"
            class="input-box-item boxBanModalInput"
            v-model="FoolObj.college"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>职称:</label>
          <a-input
            :disabled="true"
            class="input-box-item boxBanModalInput"
            v-model="FoolObj.dutyTitle"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>政治面貌:</label>
          <a-input
            :disabled="true"
            class="input-box-item boxBanModalInput"
            v-model="FoolObj.politicsStatus"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>出生日期:</label>
          <a-input
            :disabled="true"
            class="input-box-item boxBanModalInput"
            v-model="FoolObj.birthday"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>入职时间:</label>
          <a-input
            :disabled="true"
            class="input-box-item boxBanModalInput"
            v-model="FoolObj.inTime"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>聘用类型:</label>
          <a-input
            :disabled="true"
            class="input-box-item boxBanModalInput"
            v-model="FoolObj.hireType"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>人事状态:</label>
          <a-input
            :disabled="true"
            class="input-box-item boxBanModalInput"
            v-model="FoolObj.personnelStatus"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>婚姻状况:</label>
          <a-input
            :disabled="true"
            class="input-box-item boxBanModalInput"
            v-model="FoolObj.marriageStatus"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>最高学历:</label>
          <a-input
            :disabled="true"
            class="input-box-item boxBanModalInput"
            v-model="FoolObj.education"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>毕业院校:</label>
          <a-input
            :disabled="true"
            class="input-box-item boxBanModalInput"
            v-model="FoolObj.graduatedCollege"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>专业:</label>
          <a-input
            :disabled="true"
            class="input-box-item boxBanModalInput"
            v-model="FoolObj.profession"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>毕业时间:</label>
          <a-input
            :disabled="true"
            class="input-box-item boxBanModalInput"
            v-model="FoolObj.graduatedTime"
          />
        </div>
      </div>
      <div class="clearfix"></div>
      <div class="xinhao">
        <label>管理楼栋:</label>
      </div>
      <div class="studentLangDiv" :key="index" v-for="(item,index) in FoolObj.buildFormList">
        <a-select
          v-model="item.areaId"
          @change="handleChangeAreaSet(index,item.areaId)"
          class="input-select">
          <a-select-option v-for="(ite) in areaArrMasterListSet" :key="ite.id">{{ite.areaName}}</a-select-option>
        </a-select>
        <a-select v-model="item.buildId" class="input-select">
          <a-select-option v-for="(it) in item.floorArr" :key="it.id">{{it.buildName}}</a-select-option>
        </a-select>
        <a-button type="primary" @click="addAreaSet">添加</a-button>
        <a-button v-if="(FoolObj.buildFormList.length - 1) !== 0" @click="delAreaSet(index)">删除</a-button>
      </div>
      <div class="border_eeeMtB10"></div>
    </a-modal>
  </div>

</template>

<script>
import req from "@/req/req";
import UploadFile from "@/components/UploadFile";
import { baseUrl } from '@/baseUrl'
import {
  test,
  PhoneTest,
  IDcardTest,
  NameTest,
  IntegerTest,
  WordTest
} from "@/unit/formTest";
import Vue from "vue";
const {
  searchExportSg,
  querySGAdminList, // 获取宿管列表
  selectAreaList, //查询区域列表
  selectMzList, //获取民族
  selectBuildList, //获取楼栋
  insertSGAdmin, //添加宿管信息
  updateSGAdminByPrimaryKey, //编辑宿管信息
  deleteSGAdminByPrimaryKey, //删除宿管信息
  deleteButchSGAdmin //批量删除宿管信息
} = req;
import { roleControlBtnMixin } from "@/mixin";
export default {
  name: "MasterFool",
  mixins: [roleControlBtnMixin],
  components: {
    UploadFile
  },
  data() {
    return {
      roleName: "宿管",
      disabledAdd: false,
      pageinfo: {
        //分页
        pageNum: 1,
        pageSize: 10,
        totalElements: 3,
        totalPages: 1
      },
      spinning: false, //判断是否有数据
      val: "", //查询姓名/工号
      sex: "all", //查询性别
      areaId: "all", //查询区域id
      areaListArr: [], //查询区域列表
      MasterListData: [], //数据列表
      visibleMaster: false, // 查询弹窗

      sgNameAdd: "", //添加姓名
      sgNumberAdd: "", //添加工号
      sgPhoneAdd: "", //添加手机号
      masterImg: "", //添加图片
      masterImgShow: null, //添加显示图片
      sexAdd: "0", //添加性别
      nationAdd: "1", //添加民族
      nationMasterArr: [], //添加获取民族列表
      nativePlaceAdd: "", //添加籍贯
      IdNumberAdd: "", //添加身份证
      areaArrMasterList: [],
      areaArrMasterListSet: [],
      visibleFoolAdd: false, // 添加弹窗
      visibleFoolSet: false, // 修改弹窗
      loading: false, // 上传头像
      imageUrl: "", // 上传头像
      userPic: "", //修改图片file
      masterArr: [
        {
          areaId: "",
          buildId: "",
          floorArr: []
        }
      ],
      FoolObj: {
        sgName: "姓名",
        sgNumber: "工号",
        sex: "性别",
        sgPhone: "手机号码",
        nation: "民族",
        nativePlace: "籍贯",
        idNum: "身份证",
        buildFormList: [
          {
            areaId: "",
            buildId: "",
            floorArr: []
          }
        ]
      },
      columns: [
        {
          title: '照片',
          customRender: (text, row, index) => {
            return (
              <img class="avatar" src={row.userPicth} />
            )
          }
        },
        {
          title: "姓名",
          dataIndex: "sgName"
        },
        {
          title: "工号",
          dataIndex: "sgNumber"
        },
        {
          title: "性别",
          dataIndex: "sex",
        },
        {
          title: "手机号码",
          dataIndex: "sgPhone"
        },
        {
          title: "管理楼栋",
          scopedSlots: { customRender: 'buildFormList' }
        },
        {
          title: "操作",
          customRender: (text, record, index) => {
            return (
              <div class="todo-box">
                {this.roleDataObj.isEdit ? (
                  <span
                    onClick={() => {
                      this.FoolObj = { ...record };
                      if (record.buildFormList.length === 0) {
                        this.FoolObj.buildFormList = [
                          {
                            areaId: "",
                            buildId: "",
                            floorArr: []
                          }
                        ]
                      }
                      this.userPic = "";
                      this.visibleFoolSet = !this.visibleFoolSet;
                      for (
                        var i = 0;
                        i < this.FoolObj.buildFormList.length;
                        i++
                      ) {
                        this.getbuildIdSet(
                          i,
                          this.FoolObj.buildFormList[i].areaId,
                          this.FoolObj.buildFormList[i].buildId
                        );
                      }
                    }}
                  >
                    编辑
                  </span>
                ) : (
                  <span style="display: none;" />
                )}
                {this.roleDataObj.isDel ? (
                  <span
                    onClick={() => {
                      this.delMasterOne(record.id);
                    }}
                  >
                    删除
                  </span>
                ) : (
                  ""
                )}
              </div>
            );
          }
        }
      ],
      selectedRowKeys: []
    };
  },
  computed: {
    showFloolErrMsg () {
      let arr = this.masterArr.map(x => {
        return x.buildId
      })
      let hash = {}
      for (let key in arr) {
        if (hash[arr[key]]) {
          return true
        }
        hash[arr[key]] = true
      }
      return false
    },
    showFloolErrMsg1 () {
      let arr = this.FoolObj.buildFormList.map(x => {
        return x.buildId
      })
      let hash = {}
      for (let key in arr) {
        if (hash[arr[key]]) {
          return true
        }
        hash[arr[key]] = true
      }
      return false
    }
  },
  created() {
    this.getMasterFoolList(); //获取宿管列表
    this.gatAreaList(); //查询区域列表
    this.getMasterNation(); //获取民族
  },
  methods: {
    //编辑
    setMastterOk () {
      const {
        id,
        buildFormList
      } = this.FoolObj;
      for (var i = 0; i < buildFormList.length; i++) {
        if (!buildFormList[i].areaId) {
          $message.warning("请选择管理楼栋！");
          return;
        }
      }
      for (var i = 0; i < buildFormList.length; i++) {
        if (!buildFormList[0].buildId) {
          $message.warning("请选择管理楼栋！");
          return;
        }
      }
      if (this.showFloolErrMsg1) {
        this.$message.warning('请勿选择相同的楼栋！')
        return
      }
      var buildManageVo = [];
      for (var i = 0; i < buildFormList.length; i++) {
        buildManageVo.push(buildFormList[i].buildId);
      }
      var dataCont = {
        id,
        buildManageVoList: buildManageVo //添加管理楼栋
      }
      updateSGAdminByPrimaryKey(dataCont).then(({ data: { code, msg } }) => {
        if (code === 0) {
          this.$message.success(msg);
          this.getMasterFoolList();
        } else {
          this.$message.error(msg);
        }
        this.visibleFoolSet = false;
      });
    },
    // 添加获取楼栋
    handleChangeArea(index, id) {
      let indexData = index;
      this.masterArr[indexData].buildId = "";
      selectBuildList({
        areaId: id
      }).then(({ data: { data = [], code, msg } }) => {
        if (code === 0) {
          this.masterArr[indexData].floorArr = data;
        }
      });
    },
    //编辑获取楼栋
    getbuildIdSet (index, id, intx) {
      let indexData = index;
      this.FoolObj.buildFormList[indexData].buildId = "";
      this.FoolObj.buildFormList[indexData].floorArr = [];
      let intData = intx;
      selectBuildList({
        areaId: id
      }).then(({ data: { data = [], code, msg } }) => {
        if (code === 0) {
          this.FoolObj.buildFormList[indexData].buildId = intData;
          this.FoolObj.buildFormList[indexData].floorArr = data;
        }
      });
    },
    // 编辑修改获取楼栋
    handleChangeAreaSet(index, id) {
      let indexData = index;
      const { FoolObj } = this;
      const obj = { ...FoolObj };
      obj.buildFormList[indexData].buildId = "";
      obj.buildFormList[indexData].floorArr = [];
      selectBuildList({
        areaId: id
      }).then(({ data: { data = [], code, msg } }) => {
        if (code === 0) {
          obj.buildFormList[indexData].floorArr = data;
          Vue.set(this, "FoolObj", obj);
        }
      });
    },
    //获取宿管列表
    getMasterFoolList() {
      this.spinning = true;
      querySGAdminList({
        pageSize: this.pageinfo.pageSize,
        pageNum: this.pageinfo.pageNum,
        val: this.val,
        sex: this.sex === "all" ? null : this.sex,
        areaId: this.areaId === "all" ? null : this.areaId
      }).then(
        ({
          data: {
            code,
            msg,
            data: { content = [], pageinfo }
          }
        }) => {
          if (code === 0) {
            this.MasterListData = content;
            this.pageinfo = pageinfo;
            if (this.MasterListData.length === 0) {
              // this.$message.warning("未找到宿管数据");
            }
          } else {
            this.$message.warning(msg);
          }
          this.spinning = false;
        },
        () => {
          this.spinning = false;
        }
      );
    },
    //切换页数
    changePage(page, pageSize) {
      this.pageinfo.pageNum = page;
      this.getMasterFoolList();
    },
    changeSize(page, pageSize) {
      this.pageinfo.pageSize = pageSize;
      this.pageinfo.pageNum = 1;
      this.getMasterFoolList();
    },
    //查询区域列表
    gatAreaList() {
      const { $message } = this;
      selectAreaList().then(({ data: { code, data, msg } }) => {
        if (code === 0) {
          this.areaListArr = data;
          this.areaArrMasterList = data;
          this.areaArrMasterListSet = data;
        } else {
          $message.error(msg);
        }
      });
    },
    //查询
    searchMasterFool() {
      this.pageinfo.pageNum = 1;
      this.visibleMaster = false;
      this.getMasterFoolList();
    },
    //添加获取民族
    getMasterNation() {
      selectMzList().then(({ data: { code, data, msg } }) => {
        if (code === 0) {
          this.nationMasterArr = data;
        }
      });
    },
    //编辑添加管理楼栋
    addAreaSet(index) {
      this.FoolObj.buildFormList.push({
        areaId: "",
        buildId: "",
        floorArr: []
      });
    },
    //编辑删除添加管理楼栋
    delAreaSet(index) {
      this.FoolObj.buildFormList.splice(index, 1);
    },
    //重置
    foolSearch() {
      this.areaId = "all";
      this.sex = "all";
    },
    //删除单个宿管
    delMasterOne(id) {
      let self = this;
      this.$confirm({
        title: "提示",
        content: "删除后，信息将回退到初始化，是否删除?",
        onOk: () => {
          deleteSGAdminByPrimaryKey({
            id
          }).then(({ data: { code, msg } }) => {
            if (code === 0) {
              self.$message.success(msg);
              self.pageinfo.pageNum = 1;
              self.getMasterFoolList();
            } else {
              self.$message.error(msg);
            }
          });
        },
        onCancel: () => {}
      });
    },
  },
};
</script>

<style scoped lang="less">
@import '~@/global';

.lookMasterFool .input-box .input-select {
  flex: 1;
  margin-left: 10px;
}
.lookMasterFool .input-box {
  width: 70%;
  margin: auto;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  margin-bottom: 10px;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
</style>
