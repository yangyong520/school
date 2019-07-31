<template>
  <div class="Student">
    <div class="inner-style">
      <div class="box-left">
      </div>
      <div class="box-right">
        <div class="btn-box">
          <a-input-search
            placeholder="姓名/学号"
            @search="getStudentList"
            v-model="nameSearch"
            enterButton
          />
        </div>
        <div class="btn-box" @click="visibleScreen = !visibleScreen">
          <i style="font-size: 20px;" class="iconfont iconshaixuan"></i>
        </div>
      </div>
    </div>
    <DataTable ref="table_page" :columns="columns" reqType="stu" @change="x => selectedRowKeys = x" :queryObj="queryObj"></DataTable>
    <!-- 修改弹窗 -->
    <studentModalUpData
      @okForm="upDataStudent"
      @cancel="cancelUpdate"
      :originObj="upDataObj"
      @cgModal="(visible)=>{this.visibleUpdata = visible}"
      :visibleContry="visibleUpdata"
    />
    <!-- 查询弹窗 -->
    <a-modal
      :maskClosable="false"
      title="筛选"
      @cancel="resetSearch"
      v-model="visibleScreen"
      @ok="getStudentList"
      okText="查询"
      class="modal-box">
      <div class="input-box">
        <span>学院:</span>
        <college-select
          :value="collegeIdSearch"
          @changeVal="(val)=>{this.collegeIdSearch = val}"
          size="default"
          :width="''"
          :haveAll="true"
          class="input-select"
        />
      </div>
      <div class="input-box">
        <span>专业:</span>
        <profession-select
          :value="professionIdSearch"
          @changeVal="(val)=>{this.professionIdSearch = val}"
          :collegeId="collegeIdSearch"
          size="default"
          :width="''"
          :haveAll="true"
          class="input-select"
        />
      </div>
      <div class="input-box">
        <span>年级:</span>
        <grade-select
          :value="gradeIdSearch"
          @changeVal="(val)=>{this.gradeIdSearch = val}"
          size="default"
          :width="''"
          :haveAll="true"
          class="input-select-lee"
        />
      </div>
      <div class="input-box">
        <span>班级:</span>
        <class-select
          :value="classIdSearch"
          :gradeId="gradeIdSearch"
          :professionId="professionIdSearch"
          size="default"
          :width="''"
          :haveAll="true"
          @changeVal="(val)=>{this.classIdSearch = val}"
          class="input-select-lee"
        />
      </div>
      <div class="input-box">
        <span>性别:</span>
        <a-select defaultValue="all" v-model="sexSearch" class="input-select">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option value="男">男</a-select-option>
          <a-select-option value="女">女</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <a-button block @click="resetSearch">重置</a-button>
      </div>
    </a-modal>
    <!--查询弹窗-->
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import studentModal from "./components/studentModal"; // 学生-弹窗
import studentModalUpData from "./components/studentModalUpData"; // 学生-弹窗
import UploadFile from "@/components/UploadFile";
import { IDcardTest, PhoneTest, test, NameTest, IntegerTest, WordTest } from "@/unit/formTest";
import { baseUrl } from '@/baseUrl'
import req from "@/req/req";
import { roleControlBtnMixin } from "@/mixin";
const {
  searchExportStu,
  insertStudent,
  updateStudentByPrimaryKey,
  deleteStudentByPrimaryKey,
  deleteButchStudent,
  queryStudentList
} = req;
export default {
  name: "Student",
  mixins: [roleControlBtnMixin],
  components: {
    studentModal,
    studentModalUpData,
    UploadFile,
    DataTable
  },
  data () {
    return {
      disabledBut: false,
      roleName: "学生",

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
          width: 100,
          dataIndex: "studentName"
        },
        {
          title: "学号",
          dataIndex: "userNum"
        },
        {
          title: "性别",
          dataIndex: 'sex',
        },
        {
          title: "辅导员信息",
          customRender: (text, record, index) => {
            if (record.teacherVo) {
              const teacherName = record.teacherVo.teacherName ? record.teacherVo.teacherName : ''
              const teacherPhone = record.teacherVo.teacherPhone ? record.teacherVo.teacherPhone : ''
              return teacherName + teacherPhone
            } else {
              return '未填写'
            }
          }
        },
        {
          title: "房间信息",
          customRender: (text, record, index) => {
            let areaName = record.areaName ? record.areaName + '-' : ""
            let buildName = record.buildName ? record.buildName + '-' : ""
            let roomNum = record.roomNum && record.bedNum ? record.roomNum + '室-' : ""
            let bedNum = record.bedNum ? record.bedNum + '号床' : ""

            return `${areaName}${buildName}${roomNum}${bedNum}` || '未填写'
          }
        },
        {
          title: "班级信息",
          customRender: (text, record, index) => {
            const collegeName = record.collegeName ? record.collegeName + '-' : ''
            const proName = record.proName ? record.proName + '-' : ''
            const gradeName = record.gradeName ? `20${record.gradeName}级-` : ''
            const className = record.className ? record.className + '班' : ''

            return collegeName + proName + gradeName + className || '未填写'
          }
        },
        {
          title: '手机号',
          customRender: (text, row, index) => {
            return row.phone || '未填写'
          }
        },
        {
          title: "操作",
          width: 220,
          customRender: (text, record, index) => {
            return (
              <div class="todo-box">
                {this.roleDataObj.isEdit ? (
                  <span
                    onClick={() => {
                      this.visibleUpdata = !this.visibleUpdata;
                      this.upDataObj = record;
                    }}
                  >
                    编辑
                  </span>
                ) : (
                  <span style="display: none;" />
                )}
              </div>
                  // {this.roleDataObj.isDel ? (
                  //   <span
                  //     onClick={() => {
                  //       this.delOne(record.id);
                  //     }}
                  //   >
                  //     删除
                  //   </span>
                  // ) : (
                  //   ""
                  // )}
            );
          }
        }
      ],
      selectedRowKeys: [],
      visibleScreen: false, // 筛选弹窗
      visibleSet: false, // 添加弹窗
      visibleUpdata: false, // 添加弹窗
      sex: 0, // 性别
      politicsStatus: 0,
      floorNum: null,
      collegeId: "", // 添加学院id
      professionId: "", // 添加专业id
      gradeId: "", // 添加年级id
      classNumber: "", // 班级
      classId: null, // 	所属班级id
      collegeIdSearch: "all",
      professionIdSearch: "all",
      gradeIdSearch: "all",
      classIdSearch: "all",
      sexSearch: "all",
      nameSearch: null,
      upDataObj: {}
    };
  },
  computed: {
    getFloorNum() {
      const { buildListArr } = this;
      let num = 0;
      buildListArr.forEach(ele => {
        if (ele.id === this.buildIdAdd) {
          num = ele.floor;
        }
      });
      return num;
    },
    queryObj () {
      return {
        classId: this.classIdSearch === "all" ? null : this.classIdSearch,
        proId: this.professionIdSearch === "all" ? null : this.professionIdSearch,
        gradeId: this.gradeIdSearch === "all" ? null : this.gradeIdSearch,
        collegeId: this.collegeIdSearch === "all" ? null : this.collegeIdSearch,
        sex: this.sexSearch === "all" ? null : this.sexSearch,
        val: this.nameSearch
      }
    }
  },
  methods: {
    getStudentList () {
      this.visibleScreen = false
      this.$refs.table_page.getDataTable()
    },
    resetSearch () {
      this.collegeIdSearch = "all";
      this.professionIdSearch = "all";
      this.gradeIdSearch = "all";
      this.classIdSearch = "all";
      this.sexSearch = "all";
    },
    cancelUpdate () {
      this.$refs.table_page.refresh()
    },
    upDataStudent (formThis) {
      const {
        id,
        collegeId,
        professionId,
        gradeId,
        classId,
        areaId,
        buildId,
        roomId,
        bedId,
        $message
      } = formThis;
      if (!collegeId || !professionId || !gradeId || !classId) {
        this.$message.warning('请完成班级信息！')
        return
      }
      if (!areaId || !buildId || !roomId || !bedId) {
        this.$message.warning('请完成房间信息！')
        return
      }
      let obj = {
        collegeId,
        professionId,
        gradeId,
        classId,
        areaId,
        buildId,
        roomId,
        bedId,
        id,
      }
      updateStudentByPrimaryKey(obj).then(({ data: { code, msg } }) => {
        if (code === 0) {
          $message.success(msg);
          this.visibleUpdata = false;
          this.$refs.table_page.refresh()
        } else {
          $message.warning(msg);
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
@import '~@/global';

.avatar {
  width: 40px;
  height: 40px;
  object-fit: cover;
}
</style>
