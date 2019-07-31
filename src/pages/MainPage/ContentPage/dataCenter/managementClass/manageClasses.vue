<template>
  <div class="manageClasses">
    <div class="inner-style">
      <div class="box-left">
        <div class="btn-box">
          <a-button class="btn-item" @click="addClassVisible" v-if="roleDataObj.isAdd">新增</a-button>
        </div>
        <div class="btn-box">
          <a-button class="btn-item" @click="allDelClass" v-if="roleDataObj.isDel">批量删除</a-button>
        </div>
        <div class="btn-box">
          <a-button class="btn-item" @click="distribution" v-if="roleDataObj.isSet">批量设置</a-button>
        </div>
      </div>
      <div class="box-right">
        <div class="btn-box">
          <a-input-search
            placeholder="班级名"
            v-model="clNameList"
            @search="searchCalssClick"
            enterButton
          />
        </div>
        <div class="btn-box">
          <a-button class="btn-item" @click="exportBj" v-if="roleDataObj.isExp">导出</a-button>
        </div>
        <div class="btn-box" @click="searchVisible = !searchVisible">
          <i style="font-size: 20px;" class="iconfont iconshaixuan"></i>
        </div>
      </div>
    </div>
    <DataTable ref="table_page" :columns="columns" reqType="classes" @change="x => selectedRowKeys = x" :queryObj="queryObj"></DataTable>
    <!--筛选-->
    <a-modal
      title="筛选"
      @cancel="resetSearch"
      v-model="searchVisible"
      @ok="searchCalssClick"
      okText="查询"
      class="modal-box">
      <div class="input-box">
        <span>学院:</span>
        <a-select
          defaultValue="all"
          v-model="collegeIdList"
          @change="seachprofessionList(collegeIdList)"
          class="input-select">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option
            :value="item.id"
            v-for="item in collegeArrList"
            :key="item.id + 'college'">{{item.coName}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span>专业:</span>
        <a-select defaultValue="all" v-model="proIdList" class="input-select">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option
            :value="item.id"
            v-for="item in professionArrSearch"
            :key="item.id + 'profession'">{{item.proName}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span>年级:</span>
        <a-select defaultValue="all" v-model="gradeIdList" class="input-select">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option
            :value="item.id"
            v-for="item in gradeArrList"
            :key="item.id + 'grade'">20{{item.gradeNum}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <a-button block @click="resetSearch">重置</a-button>
      </div>
    </a-modal>
    <!--添加-->
    <a-modal title="新增" v-model="ClassAddVisible" :okButtonProps="{ props: {disabled: disabledAdd} }" @ok="addClassOk" okText="确定" class="modal-box">
      <div class="input-box">
        <span class="span-xinhao">所属学院:</span>
        <a-select
          v-model="collegeId"
          placeholder="请选择学院"
          class="input-select"
          @change="professionList(collegeId)">
          <a-select-option
            :value="item.id"
            v-for="item in collegeArrList"
            :key="item.id + 'college'">{{item.coName}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span class="span-xinhao">所属专业:</span>
        <a-select v-model="professionId" placeholder="请选择学院" class="input-select">
          <a-select-option
            :value="item.id"
            v-for="item in professionArrList"
            :key="item.id + 'profession'">{{item.proName}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span class="span-xinhao">所属年级:</span>
        <a-select v-model="gradeId" placeholder="请选择学院" class="input-select">
          <a-select-option
            :value="item.id"
            v-for="item in gradeArrList"
            :key="item.id + 'grade'">20{{item.gradeNum}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span class="span-xinhao">班&nbsp;&nbsp;级&nbsp;&nbsp;数:</span>
        <a-input-number
          v-model="classNumber"
          class="input-box-item boxBanModalInput w_270px"
          :max="99"
          :min="1"
          :step="1"/>
      </div>
      <div class="clearfix"></div>
    </a-modal>
    <!--编辑-->
    <a-modal title="编辑" v-model="visibleClassSet" @ok="setCalssOk" okText="确定" class="modal-box">
      <div class="input-box">
        <span>所属学院:&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <span>{{MajorObj.collegeName}}</span>
      </div>
      <div class="input-box">
        <span>所属专业:&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <span>{{MajorObj.professionName}}</span>
      </div>
      <div class="input-box">
        <span>所属年级:&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <span>20{{MajorObj.gradeName}}级</span>
      </div>
      <div class="input-box">
        <span class="span-xinhao">班&nbsp;&nbsp;级&nbsp;&nbsp;名:</span>
        <a-input-number
          v-model="MajorObj.className"
          class="input-box-item boxBanModalInput w_270px"
          :max="99"
          :min="1"
          :step="1"/>
        <span>&nbsp;&nbsp;班</span>
      </div>
      <div class="clearfix"></div>
    </a-modal>
  </div>
</template>

<script>
import req from "@/req/req";
import DataTable from '@/components/DataTable'

const {
  selectCollege, // 查询学院列表
  selectClasses, // 查询专业列表
  selectGrade, // 查询年级列表
  insertClass, // 添加班级
  queryExportClassInfo,
  updateClassByPrimaryKey, // 编辑班级信息
  deleteClassByPrimaryKey, // 单项删除班级信息
  deleteButchClass // 批量删除
} = req;
import { roleControlBtnMixin } from "@/mixin";
import { baseUrl } from '@/baseUrl'
export default {
  name: "manageClasses",
  mixins: [roleControlBtnMixin],
  components: {
    DataTable
  },
  data() {
    return {
      roleName: "班级管理",
      disabledAdd: false,
      ClassListData: [], // 数据列表
      collegeIdList: "all", // 查询学院id
      proIdList: "all", // 筛选专业id
      gradeIdList: "all", // 筛选年级id
      clNameList: "", // 筛选班级
      professionArrSearch: [], // 筛选专业列表
      collegeArrList: [], // 添加学院列表
      professionArrList: [], // 添加专业列表
      gradeArrList: [], // 添加年级列表
      collegeId: "", // 添加学院id
      professionId: "", // 添加专业id
      gradeId: "", // 添加年级id
      classNumber: "", // 班级
      ClassAddVisible: false, // 添加弹窗
      searchVisible: false, // 筛选弹窗
      visibleClassSet: false, // 编辑弹窗
      spinning: false, // 判断是否有数据
      MajorObj: {
        // 编辑数据
        collegeName: "所属学院",
        professionName: "所属专业",
        gradeName: "所属年级",
        className: "班级数"
      },
      columns: [
        {
          title: "班级",
          dataIndex: "professionName",
          customRender: (text, record, index) => {
            return (
              record.collegeName +
              "-" +
              record.professionName +
              "-20" +
              record.gradeName +
              "级-" +
              record.className +
              "班"
            );
          }
        },
        {
          title: "辅导员资料",
          dataIndex: "teacherUser",
          customRender: (text, record, index) => {
            return record.teacherUser == undefined
              ? "无"
              : record.teacherUser.name + "  " + record.teacherUser.phone;
          }
        },
        {
          title: "学生人数",
          dataIndex: "studentNumber"
        },
        {
          title: "操作",
          dataIndex: "password",
          customRender: (text, record, index) => {
            return (
              <div class="todo-box">
                {this.roleDataObj.isSet ? (
                  <span
                    onClick={() => {
                      this.setMangeClass(record.id);
                    }}
                  >
                    设置
                  </span>
                ) : (
                  <span style="display: none" />
                )}
                {this.roleDataObj.isDel ? (
                  <span
                    onClick={() => {
                      this.delClassOne(record.id);
                    }}
                  >
                    删除
                  </span>
                ) : (
                  ""
                )}
                {this.roleDataObj.isEdit ? (
                  <span
                    onClick={() => {
                      this.MajorObj = { ...record };
                      this.visibleClassSet = !this.visibleClassSet;
                    }}
                  >
                    编辑
                  </span>
                ) : (
                  <span style="display: none" />
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
        collegeId: this.collegeIdList === "all" ? null : this.collegeIdList,
        proId: this.proIdList === "all" ? null : this.proIdList,
        grade: this.gradeIdList === "all" ? null : this.gradeIdList,
        clName: this.clNameList
      }
    }
  },
  created() {
    this.gatCollegeClassList(); // 查询学院列表
    this.gradeList(); // 查询年级列表
  },
  methods: {
    exportBj () {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning("请选择导出数据！");
        return;
      }
      queryExportClassInfo(this.selectedRowKeys).then(
        ({ data: { data, msg, code } }) => {
          if (code === 0) {
            var elemIF = document.createElement("iframe");
            elemIF.src = baseUrl + "/export/ExportCollege?ids=" + data;
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
          } else {
            this.$message.warning(msg);
          }
        }
      );
    },
    // 获取班级列表
    getClassList() {
      this.$refs.table_page.getDataTable()
    },
    // 查询学院列表
    gatCollegeClassList() {
      const { $message } = this;
      selectCollege().then(({ data: { code, data, msg } }) => {
        if (code === 0) {
          this.collegeArrList = data;
        } else {
          $message.error(msg);
        }
      });
    },
    // 查询专业
    professionList(id) {
      this.professionId = "";
      selectClasses({
        collegeId: id
      }).then(
        ({ data: { code, msg, data } }) => {
          if (code === 0) {
            this.professionArrList = data.professionList;
          } else {
            this.$message.warning(msg);
          }
        },
        () => {
          this.$message.warning(msg);
        }
      );
    },
    // 查询年级
    gradeList() {
      this.gradeId = "";
      selectGrade({}).then(
        ({ data: { code, msg, data } }) => {
          if (code === 0) {
            this.gradeArrList = data;
          } else {
            this.$message.warning(msg);
          }
        },
        () => {
          this.$message.warning(msg);
        }
      );
    },
    // 筛选专业
    seachprofessionList(id) {
      this.proIdList = "all";
      selectClasses({
        collegeId: id
      }).then(
        ({ data: { code, msg, data } }) => {
          if (code === 0) {
            this.professionArrSearch = data.professionList;
          } else {
            this.$message.warning(msg);
          }
        },
        () => {
          this.$message.warning(msg);
        }
      );
    },
    // 添加
    addClassVisible(e) {
      this.ClassAddVisible = !this.ClassAddVisible;
      this.classNumber = "";
    },
    // 添加保存
    addClassOk (e) {
      if (!this.collegeId) {
        this.$message.warning("请选择所属学院");
      } else if (!this.professionId) {
        this.$message.warning("请选择所属专业");
      } else if (!this.gradeId) {
        this.$message.warning("请选择所属年级");
      } else if (!this.classNumber) {
        this.$message.warning("请输入班级数");
      } else {
        this.disabledAdd = true
        insertClass({
          collegeId: this.collegeId,
          proId: this.professionId,
          grade: this.gradeId,
          classNumber: this.classNumber
        }).then(({ data: { code, msg } }) => {
          if (code === 0) {
            this.$message.success(msg);
            this.$refs.table_page.refresh()
            this.collegeId = "";
            this.professionId = "";
            this.gradeId = "";
          } else {
            this.$message.error(msg);
          }
          this.disabledAdd = false
          this.ClassAddVisible = false;
        });
      }
    },
    // 点击搜索
    searchCalssClick() {
      this.searchVisible = false;
      this.getClassList();
    },
    // 重置
    resetSearch() {
      this.collegeIdList = "all";
      this.proIdList = "all";
      this.gradeIdList = "all";
    },
    // 编辑保存
    setCalssOk () {
      const {
        $message,
        MajorObj: { id, className }
      } = this;
      updateClassByPrimaryKey({
        clName: className,
        id: id
      }).then(({ data: { code, msg } }) => {
        if (code === 0) {
          $message.success(msg);
          this.$refs.table_page.refresh()
        } else {
          $message.error(msg);
        }
        this.visibleClassSet = false;
      });
    },
    // 单项删除
    delClassOne(id) {
      let self = this;
      this.$confirm({
        title: "提示",
        content: "删除后，原学院人员班级信息为空，是否删除?",
        onOk: () => {
          deleteClassByPrimaryKey({
            id
          }).then(({ data: { code, msg } }) => {
            if (code === 0) {
              self.$message.success(msg);
              this.$refs.table_page.refresh()
            } else {
              self.$message.error(msg);
            }
          })
        },
        onCancel: () => {}
      });
    },
    // 批量删除
    allDelClass() {
      let ids = "";
      let self = this;
      if (self.selectedRowKeys.length === 0) {
        self.$message.warning("请先选择目标！");
        return;
      }
      self.selectedRowKeys.forEach((ele, index) => {
        if (index === self.selectedRowKeys.length - 1) {
          ids += ele;
        } else {
          ids += ele + ",";
        }
      });
      self.$confirm({
        title: "提示",
        content: "是否确认进行批量删除？",
        onOk: () => {
          deleteButchClass({
            ids
          }).then(({ data: { code, msg } }) => {
            if (code === 0) {
              this.selectedRowKeys = []
              this.$refs.table_page.refresh()
              self.$message.success(msg);
            } else {
              self.$message.error(msg);
            }
          });
        },
        onCancel: () => {}
      });
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    // 批量设置
    distribution() {
      let self = this;
      if (self.selectedRowKeys.length === 0) {
        self.$message.warning("请先选择目标！");
        return;
      }
      var classIds = self.selectedRowKeys;
      localStorage.setItem("classIds", classIds);
      localStorage.setItem("classIdsList", JSON.stringify(classIds));
      this.$router.push({
        name: "ManageClassSeting"
      });
    },
    //单项设置
    setMangeClass(id) {
      var classIdsList = [];
      classIdsList.push(id);
      localStorage.setItem("classIds", id);
      localStorage.setItem("classIdsList", JSON.stringify(classIdsList));
      this.$router.push({
        name: "ManageClassSeting"
      });
    }
  }
};
</script>

<style scoped lang="less">
@import '~@/global';

</style>
