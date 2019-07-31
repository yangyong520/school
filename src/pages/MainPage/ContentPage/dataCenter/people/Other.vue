<template>
  <!--头部-->
  <div class="MasterFool">
    <div class="inner-style">
      <div class="box-left">
      </div>
      <div class="box-right">
        <div class="btn-box">
          <a-input-search placeholder="姓名/工号" v-model="val" @search="searchOther" enterButton/>
        </div>
        <div class="btn-box" @click="visibleOtherSearch = !visibleOtherSearch">
          <i style="font-size: 20px;" class="iconfont iconshaixuan"></i>
        </div>
      </div>
    </div>
    <!--列表-->
    <a-spin :spinning="spinning">
      <a-table
        :columns="columns"
        :dataSource="dataTable"
        :pagination="false"
        rowKey="id">
        <template slot="buildList" slot-scope="row">
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
          <div v-else-if="row.buildFormList.length === 0">未填写</div>
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
      :maskClosable="false"
      title="筛选"
      @cancel="foolSearch"
      v-model="visibleOtherSearch"
      @ok="searchOther"
      okText="查询"
      class="modal-box">
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
      :maskClosable="false"
      title="编辑"
      @cancel="getDataTable"
      v-model="visibleOtherSet"
      @ok="setOtherOk"
      okText="确定"
      class="modal-box boxBanModal">
      <div class="visible-notes-img" style="width: 100px;height: 100px">
        <img :src="OtherObj.userPicth" alt>
      </div>
      <div class="studentDiv"  style="width: 495px">
        <div class="visibleNotesDeailDiv new-label-width">
          <label>姓名:</label>
          <a-input
            v-model="OtherObj.name"
            :disabled="true"
            class="input-box-item boxBanModalInput"
            placeholder="请输入姓名"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>工号:</label>
          <a-input
            v-model="OtherObj.userNum"
            :disabled="true"
            class="input-box-item boxBanModalInput"
            placeholder="请输入工号"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>证件类型:</label>
          <a-input
            v-model="OtherObj.idType"
            :disabled="true"
            class="input-box-item boxBanModalInput"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>证件号码:</label>
          <a-input
            v-model="OtherObj.idNum"
            :disabled="true"
            class="input-box-item boxBanModalInput"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>国籍/地区:</label>
          <a-input
            v-model="OtherObj.country"
            :disabled="true"
            class="input-box-item boxBanModalInput"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>手机号码:</label>
          <a-input
            v-model="OtherObj.phone"
            :disabled="true"
            class="input-box-item boxBanModalInput"
            placeholder="请输入手机号码"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>民族:</label>
          <a-input
            size="small"
            :disabled="true"
            v-model="OtherObj.nation"
            class="input-box-item boxBanModalInput"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>性别:</label>
          <a-input
            size="small"
            :disabled="true"
            v-model="OtherObj.sex"
            class="input-box-item boxBanModalInput"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>年龄:</label>
          <a-input
            v-model="OtherObj.age"
            :disabled="true"
            class="input-box-item boxBanModalInput"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>所属机构:</label>
          <a-input
            v-model="OtherObj.machinery"
            :disabled="true"
            class="input-box-item boxBanModalInput"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>行政职务:</label>
          <a-input
            v-model="OtherObj.duty"
            :disabled="true"
            class="input-box-item boxBanModalInput"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>所属院系:</label>
          <a-input
            v-model="OtherObj.college"
            :disabled="true"
            class="input-box-item boxBanModalInput"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>职称:</label>
          <a-input
            v-model="OtherObj.dutyTitle"
            :disabled="true"
            class="input-box-item boxBanModalInput"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>政治面貌:</label>
          <a-input
            size="small"
            :disabled="true"
            v-model="OtherObj.politicsStatus"
            class="input-box-item boxBanModalInput"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>出生日期:</label>
          <a-input
            v-model="OtherObj.birthday"
            :disabled="true"
            class="input-box-item boxBanModalInput"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>入职时间:</label>
          <a-input
            v-model="OtherObj.inTime"
            :disabled="true"
            class="input-box-item boxBanModalInput"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>聘用类型:</label>
          <a-input
            v-model="OtherObj.hireType"
            :disabled="true"
            class="input-box-item boxBanModalInput"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>人事状态:</label>
          <a-input
            v-model="OtherObj.personnelStatus"
            :disabled="true"
            class="input-box-item boxBanModalInput"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>婚姻状况:</label>
          <a-input
            v-model="OtherObj.marriageStatus"
            :disabled="true"
            class="input-box-item boxBanModalInput"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>最高学历:</label>
          <a-input
            v-model="OtherObj.education"
            :disabled="true"
            class="input-box-item boxBanModalInput"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>毕业院校:</label>
          <a-input
            v-model="OtherObj.graduatedCollege"
            :disabled="true"
            class="input-box-item boxBanModalInput"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>专业:</label>
          <a-input
            v-model="OtherObj.profession"
            :disabled="true"
            class="input-box-item boxBanModalInput"
          />
        </div>
        <div class="visibleNotesDeailDiv new-label-width">
          <label>毕业时间:</label>
          <a-input
            v-model="OtherObj.graduatedTime"
            :disabled="true"
            class="input-box-item boxBanModalInput"
          />
        </div>
      </div>
      <div class="clearfix"></div>
      <div class="xinhao">
        <label>进出楼栋:</label>
      </div>
      <div class="studentLangDiv" :key="index" v-for="(item,index) in OtherObj.buildFormList">
        <a-select
          v-model="item.areaId"
          @change="handleChangeAreaSet(index,item.areaId)"
          class="input-select">
          <a-select-option key="all">全部</a-select-option>
          <a-select-option v-for="(ite,inde) in areaArrMasterListSet" :key="ite.id">{{ite.areaName}}</a-select-option>
        </a-select>
        <a-select v-model="item.buildId" class="input-select">
          <a-select-option v-for="(it,ind) in item.otherfloorArr" :key="it.id">{{it.buildName}}</a-select-option>
        </a-select>
        <a-button type="primary" @click="addAreaSet(index, item.areaId, 'edit')">添加</a-button>
        <a-button @click="delAreaOtherSet(index, 'edit')">删除</a-button>
      </div>
      <div class="border_eeeMtB10"></div>
    </a-modal>
    <a-modal
      :maskClosable="false"
      title="身份设置"
      :width="800"
      @cancel="cancelRoleType"
      v-model="showDignity"
      @ok="ok"
      okText="确定">
      <div class="studentLangDiv">
        <label>身份设置: </label>
        <a-select v-model="formData.dignity" style="width: 150px">
          <a-select-option :value="2">辅导员</a-select-option>
          <a-select-option :value="4">宿管</a-select-option>
        </a-select>
      </div>
      <div>
        <div v-if="formData.dignity === 2">
          <div class="studentLangDiv" :key="index" v-for="(item, index) in formData.classVoList">
            <label>管理班级: </label>
            <college-select
              :value="item.collegeId"
              @changeVal="(val) => {item.collegeId = val}"
              size="default"
              class="input-select"
            />
            <profession-select
              :value="item.professionId"
              @changeVal="(val) => {item.professionId = val}"
              :collegeId="item.collegeId"
              size="default"
              class="input-select"
            />
            <grade-select
              :value="item.gradeId"
              @changeVal="(val) => {item.gradeId = val}"
              size="default"
              class="input-select"
            />
            <class-select
              :value="item.classId"
              :gradeId="item.gradeId"
              :professionId="item.professionId"
              size="default"
              @changeVal="(val) => {item.classId = val}"
              class="input-select"
            />
            <a-button type="primary" @click="addArea">添加</a-button>
            <a-button v-if="(formData.classVoList.length - 1) !== 0" @click="delArea(index)" class="del-btn">删除</a-button>
          </div>
        </div>
        <div v-if="formData.dignity === 4">
          <div class="studentLangDiv" :key="index + 'are'" v-for="(item, index) in formData.buildFormList">
            <label>管理楼栋: </label>
            <AreaSelect :value="item.areaId" @changeVal="x => item.areaId = x" size="default"/>
            <BuildSelect :areaId="item.areaId" size="default" :value="item.buildId" @changeVal="x => item.buildId = x"/>
            <a-button type="primary" @click="addAreaSet(index, item.areaId, 'role')">添加</a-button>
            <a-button v-if="(formData.buildFormList.length - 1) !== 0" @click="delAreaOtherSet(index, 'role')">删除</a-button>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import AreaSelect from '@/components/AreaSelect'
import BuildSelect from '@/components/BuildSelect'
import DataTable from '@/components/DataTable'
import UploadFile from "@/components/UploadFile"
import req from "@/req/req";
import { test, PhoneTest, IDcardTest, NameTest, IntegerTest, WordTest } from "@/unit/formTest";
import Vue from "vue";
import { roleControlBtnMixin } from "@/mixin";
import { baseUrl } from '@/baseUrl'
const {
  searchExoportOther,
  setDignity,
  queryOtherPeopleList, // 获取其他列表
  selectAreaList, //查询区域列表
  selectMzList, //获取民族
  selectBuildList, //获取楼栋
  insertOtherPeople, //添加其他信息
  updateOtherPeopleByPrimaryKey, //编辑其他信息
  deleteOtherPeopleByPrimaryKey, //删除其他信息
  deleteButchOtherPeople //批量删除其他信息
} = req;
export default {
  name: "MasterFool",
  mixins: [roleControlBtnMixin],
  components: {
    UploadFile, DataTable, AreaSelect, BuildSelect
  },
  data() {
    return {
      formData: {
        dignity: 2,
        classVoList: [
          {
            collegeId: '',
            professionId: '',
            gradeId: '',
            classId: ''
          },
        ],
        buildFormList: [
          {
            areaId: "",
            buildId: "",
          }
        ]
      },
      pageinfo: {
        pageNum: 1,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0
      },
      dataTable: [],
      spinning: true,
      selectedRowKeys: [],
      perId: '',
      showDignity: false,
      roleName: "其他",
      disabledAdd: false,
      val: "", //查询姓名/工号
      sex: "all", //查询性别
      areaId: "all", //查询区域id
      areaListArr: [], //查询区域列表
      OtherListData: [], //数据列表
      visibleOtherSearch: false, // 查询弹窗
      peopleName: "", //添加姓名
      peopleNum: "", //添加工号
      phoneAddOther: "", //添加手机号
      OtherImg: "", //添加图片file
      OtherImgShow: null, //添加显示图片
      sexAddOther: "0", //添加性别
      nationAddOther: "1", //添加民族
      nationOtherArr: [], //添加获取民族列表
      nativePlaceAddOther: "", //添加籍贯
      idNumAddOther: "", //添加身份证
      dept: "", //添加部门
      politicsStatus: 0, //添加政治面貌
      areaArrMasterList: [],
      areaArrMasterListSet: [],
      visibleOtherAdd: false, // 添加弹窗
      visibleOtherSet: false, // 修改弹窗
      loading: false, // 上传头像
      imageUrl: "", // 上传头像
      userPic: "", //修改图片file

      otherArr: [
        {
          areaId: "",
          buildId: "",
          otherfloorArr: []
        }
      ],
      OtherObj: {
        name: "姓名",
        userPicth: "照片",
        userNum: "工号",
        sex: "性别",
        phone: "手机号码",
        nation: "民族",
        nativePlace: "籍贯",
        idNum: "身份证",
        dept: "部门",
        politicsStatus: 0,
        buildFormList: [
          {
            areaId: "",
            buildId: "",
            otherfloorArr: []
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
          dataIndex: "name"
        },
        {
          title: "工号",
          dataIndex: "userNum"
        },
        {
          title: "性别",
          dataIndex: "sex",
        },
        {
          title: "手机号码",
          customRender: (text, row, index) => {
            return row.phone || '未填写'
          }
        },
        {
          title: "通行楼栋",
          scopedSlots: { customRender: 'buildList' }
        },
        {
          title: "操作",
          width: 400,
          customRender: (text, record, index) => {
            return (
              <div class="todo-box">
                {this.roleDataObj.isEdit ? (
                  <span
                    onClick={() => {
                      this.OtherObj = { ...record };
                      this.userPic = ""
                      this.visibleOtherSet = !this.visibleOtherSet;
                      if (this.OtherObj.buildFormList) {
                        if (this.OtherObj.buildFormList.length > 0) {
                          if (this.OtherObj.buildFormList[0].buildId == "all") {
                            this.OtherObj.buildFormList = [
                              {
                                areaId: "all",
                                buildId: "all",
                                otherfloorArr: [{ id: "all", buildName: "全部" }]
                              }
                            ];
                          } else {
                            for (var i = 0; i < this.OtherObj.buildFormList.length; i++) {
                              this.getbuildIdSet(
                                i,
                                this.OtherObj.buildFormList[i].areaId,
                                this.OtherObj.buildFormList[i].buildId
                              );
                            }
                          }
                        } else {
                          this.OtherObj.buildFormList = [
                            {
                              areaId: "",
                              buildId: "",
                              otherfloorArr: []
                            }
                          ]
                        }
                      } else {
                        this.OtherObj.buildFormList = [{}];
                      }
                    }}
                  >
                    通行设置
                  </span>
                ) : (
                  <span style="display: none" />
                )}
                <span onClick={() => this.setDignity(record.id)}>身份设置</span>
                {this.roleDataObj.isDel ? (
                  ''
                  // <span
                  //   onClick={() => {
                  //     this.delMasterOne(record.id);
                  //   }}
                  // >
                  //   删除
                  // </span>
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
    queryObj () {
      return {
        val: this.val,
        sex: this.sex === "all" ? null : this.sex
      }
    }
  },
  created() {
    this.gatAreaOtherList(); //查询区域列表
    this.getOtherNation(); //获取民族
    this.getDataTable()
  },
  methods: {
    changePage (page, pageSize) {
      this.pageinfo.pageNum = page
      this.getDataTable()
    },
    changeSize (page, pageSize) {
      this.pageinfo.pageSize = pageSize
      this.pageinfo.pageNum = 1
      this.getDataTable()
    },
    getDataTable () {
      queryOtherPeopleList({
        val: this.val,
        sex: this.sex === "all" ? null : this.sex,
        pageSize: this.pageinfo.pageSize,
        pageNum: this.pageinfo.pageNum
      }).then(({data: {data, msg, code}}) => {
        if (code === 0) {
          this.dataTable = data.content
          if (data && data.pageinfo) {
            this.pageinfo = data.pageinfo
          }
          this.spinning = false
        } else {
          this.$message.warning(msg)
        }
      })
    },
    setDignity (id) {
      this.showDignity = !this.showDignity
      this.perId = id
    },
    ok () {
      let classIds = this.formData.classVoList.map(x => {
        return x.classId
      })
      let buildIds = this.formData.buildFormList.map(x => {
        return x.buildId
      })
      let obj = {}
      if (this.formData.dignity === 2) {
        obj = {
          type: this.formData.dignity,
          id: this.perId,
          classIds: classIds,
        }
      } else {
        obj = {
          type: this.formData.dignity,
          id: this.perId,
          buildIds: buildIds
        }
      }
      setDignity(obj).then(({data: {data, code, msg}}) => {
        if (code === 0) {
          this.showDignity = false
          this.$message.success(msg)
          this.getDataTable()
          this.formData = {
            dignity: 2,
            classVoList: [
              {
                collegeId: '',
                professionId: '',
                gradeId: '',
                classId: ''
              },
            ],
            buildFormList: [
              {
                areaId: "",
                buildId: "",
              }
            ]
          }
        } else {
          this.$message.warning(msg)
        }
      })
    },
    //编辑
    setOtherOk() {
      const {
        id,
        buildFormList
      } = this.OtherObj;
      for (let index = 0; index < buildFormList.length; index++) {
        if (!buildFormList[index].areaId && !buildFormList[index].buildId) {
          this.$message.warning('请选择进出楼栋')
          return
        }
      }
      var buildManageVo = [];
      if (buildFormList[0].areaId && buildFormList[0].buildId) {
        for (var i = 0; i < buildFormList.length; i++) {
          buildManageVo.push(buildFormList[i].buildId);
        }
      }
      var dataCont = {
        id,
        buildList: buildManageVo //添加管理楼栋
      }
      updateOtherPeopleByPrimaryKey(dataCont).then(({ data: { code, msg } }) => {
          if (code === 0) {
            this.$message.success(msg);
            this.visibleOtherSet = !this.visibleOtherSet
          } else {
            this.$message.error(msg);
          }
          this.visibleOtherSet = false;
        }
      );
    },
    // 添加获取楼栋
    handleChangeArea(index, id) {
      let indexData = index;
      this.otherArr[indexData].buildId = "";
      if (id == "all") {
        this.otherArr[indexData].otherfloorArr = [
          { id: "all", buildName: "全部" }
        ];
      } else {
        selectBuildList({
          areaId: id
        }).then(({ data: { data = [], code, msg } }) => {
          if (code === 0) {
            this.otherArr[indexData].otherfloorArr = data;
          }
        });
      }
    },
    //编辑获取楼栋
    getbuildIdSet(index, id, intx) {
      let indexData = index;
      this.OtherObj.buildFormList[indexData].buildId = "";
      this.OtherObj.buildFormList[indexData].otherfloorArr = [];
      let intData = intx;
      selectBuildList({
        areaId: id
      }).then(({ data: { data = [], code, msg } }) => {
        if (code === 0) {
          this.OtherObj.buildFormList[indexData].buildId = intData;
          this.OtherObj.buildFormList[indexData].otherfloorArr = data;
        }
      });
    },
    cancelRoleType () {
      this.showDignity = false
      this.formData = {
        dignity: 2,
        classVoList: [
          {
            collegeId: '',
            professionId: '',
            gradeId: '',
            classId: ''
          },
        ],
        buildFormList: [
          {
            areaId: "",
            buildId: "",
          }
        ]
      }
    },
    // 编辑修改获取楼栋
    handleChangeAreaSet (index, id) {
      let indexData = index;
      const { OtherObj } = this;
      const obj = { ...OtherObj };
      obj.buildFormList[indexData].buildId = "";
      obj.buildFormList[indexData].otherfloorArr = [];
      if (id == "all") {
        this.OtherObj.buildFormList = [
          {
            areaId: "all",
            buildId: "",
            otherfloorArr: [{ id: "all", buildName: "全部" }]
          }
        ];
      } else {
        selectBuildList({
          areaId: id
        }).then(({ data: { data = [], code, msg } }) => {
          if (code === 0) {
            obj.buildFormList[indexData].otherfloorArr = data;
            Vue.set(this, "OtherObj", obj);
          }
        });
      }
    },
    //查询区域列表
    gatAreaOtherList() {
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
    searchOther() {
      this.visibleOtherSearch = false;
      this.getDataTable();
    },
    // 添加获取图片
    uploadCom(file, name) {
      this[name] = file;
      const reader = new FileReader();
      reader.onload = event => {
        this[name + "Show"] = event.target.result;
      };
      reader.readAsDataURL(file);
    },
    //编辑上传图片
    uploadComImgOther(file, name) {
      // 获取图片
      this[name] = file;
      const reader = new FileReader();
      reader.onload = event => {
        this.OtherObj.userPicth = event.target.result;
      };
      reader.readAsDataURL(file);
    },
    //添加获取民族
    getOtherNation() {
      selectMzList().then(({ data: { code, data, msg } }) => {
        if (code === 0) {
          this.nationOtherArr = data;
        }
      });
    },
    //删除添加管理楼栋
    delAreaOther(index) {
      if (index == 0) {
        this.otherArr = [
          {
            areaId: "",
            buildId: "",
            otherfloorArr: []
          }
        ];
      } else {
        this.otherArr.splice(index, 1);
      }
    },
    //添加管理楼栋
    addAreaOther(index, id) {
      if (id == "all") {
        this.$message.error("您已经选择全部，无需添加更多楼栋！");
      } else {
        this.otherArr.push({
          areaId: "",
          buildId: "",
          otherfloorArr: []
        });
      }
    },
    //编辑添加管理楼栋
    addAreaSet (index, id, type) {
      if (id === "all") {
        this.$message.error("您已经选择全部，无需添加更多楼栋！");
      } else {
        if (type === 'edit') {
          this.OtherObj.buildFormList.push({
            areaId: "",
            buildId: "",
            otherfloorArr: []
          });
        } else {
          this.formData.buildFormList.push({
            areaId: "",
            buildId: "",
          })
        }
      }
    },
    //编辑删除添加管理楼栋
    delAreaOtherSet (index, type) {
      if (index == 0) {
        if (type === 'edit') {
          this.OtherObj.buildFormList = [
            {
              areaId: "",
              buildId: "",
              otherfloorArr: []
            }
          ];
        } else {
          this.formData.buildFormList = [
            {
              areaId: "",
              buildId: "",
            }
          ]
        }
      } else {
        if (type === 'edit') {
          this.OtherObj.buildFormList.splice(index, 1);
        } else {
          this.formData.buildFormList.splice(index, 1);
        }
      }
    },
    //重置
    foolSearch() {
      this.sex = "all";
    },
    //删除单个宿管
    delMasterOne(id) {
      let self = this;
      this.$confirm({
        title: "提示",
        content: "删除后，删除后信息不可恢复，是否删除?",
        onOk: () => {
          deleteOtherPeopleByPrimaryKey({
            id
          }).then(({ data: { code, msg } }) => {
            if (code === 0) {
              self.$message.success(msg);
              this.getDataTable()
            } else {
              self.$message.error(msg);
            }
          });
        },
        onCancel: () => {}
      });
    },
    addArea (index) {
      this.formData.classVoList.push({
        collegeId: '',
        professionId: '',
        gradeId: '',
        classId: ''
      })
    },
    delArea (index) {
      this.formData.classVoList.splice(index, 1)
    },
  }
};
</script>

<style scoped lang="less">
@import '~@/global';

.lookMasterFool .input-box .input-select {
  flex: 1;
  margin-left: 10px;
}
</style>
