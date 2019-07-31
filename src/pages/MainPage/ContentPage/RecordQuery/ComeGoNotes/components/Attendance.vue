<template>
  <div class="Attendance">
    <div class="inner-style">
      <div class="box-left"></div>
      <div class="box-right">
        <div class="btn-box">
          <a-button class="btn-item" @click="visibleAttendanceSet" v-if="roleDataObj.isSet">批量设置</a-button>
        </div>
        <!-- <div class="btn-box">
          <a-button class="btn-item" @click="exportkq" v-if="roleDataObj.isExp">导出</a-button>
        </div> -->
        <div class="btn-box" @click="visibleAttendanceSearch = !visibleAttendanceSearch">
          <i style="font-size: 20px;" class="iconfont iconshaixuan"></i>
        </div>
      </div>
    </div>
    <DataTable ref="table_page" :columns="columns" reqType="attend" @change="x => selectedRowKeys = x" :queryObj="queryObj"></DataTable>
    <!--设置-->
    <a-modal
      title="考勤分析时间设置"
      :maskClosable="false"
      v-model="visibleAttendance"
      @ok="handleAttendanceSetOk"
      okText="确定"
      class="modal-box">
      <div class="input-box">
        <span>分析时间:</span>
        <a-time-picker
          format="HH:mm"
          @change="onChangeStartTime"
          :value="moment(startTime, 'HH:mm')"
        />—
        <a-time-picker format="HH:mm" @change="onChangeEndTime" :value="moment(endTime, 'HH:mm')"/>
      </div>
      <div class="input-box">
        <a-checkbox-group @change="getweekList" :value="weekList">
          <a-row>
            <a-col :span="8">
              <a-checkbox value="1">周一</a-checkbox>
            </a-col>
            <a-col :span="8">
              <a-checkbox value="2">周二</a-checkbox>
            </a-col>
            <a-col :span="8">
              <a-checkbox value="3">周三</a-checkbox>
            </a-col>
            <a-col :span="8">
              <a-checkbox value="4">周四</a-checkbox>
            </a-col>
            <a-col :span="8">
              <a-checkbox value="5">周五</a-checkbox>
            </a-col>
            <a-col :span="8">
              <a-checkbox value="6">周六</a-checkbox>
            </a-col>
            <a-col :span="8">
              <a-checkbox value="7">周日</a-checkbox>
            </a-col>
          </a-row>
        </a-checkbox-group>
      </div>
    </a-modal>
    <!--筛选-->
    <a-modal
      title="筛选"
      @cancel="attendanceClearSearch"
      :maskClosable="false"
      v-model="visibleAttendanceSearch"
      @ok="handleAttendanceOk"
      okText="查询"
      class="modal-box">
      <div class="input-box">
        <span>学院:</span>
        <a-select
          v-model="collegeIdList"
          @change="seachprofessionList(collegeIdList)"
          class="input-select">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option
            :value="item.id"
            v-for="item in collegeArrList"
            :key="item.id"
          >{{item.coName}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span>专业:</span>
        <a-select v-model="proIdList" class="input-select">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option
            :value="item.id"
            v-for="item in professionArrList"
            :key="item.id"
          >{{item.proName}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span>年级:</span>
        <a-select v-model="gradeIdList" class="input-select" @change="seachClass">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option
            :value="item.id"
            v-for="item in gradeArrList"
            :key="item.id"
          >20{{item.gradeNum}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <span>班级:</span>
        <a-select v-model="classid" class="input-select">
          <a-select-option value="all">全部</a-select-option>
          <a-select-option
            :value="item.id"
            v-for="item in classList"
            :key="item.id"
          >{{item.clName}}</a-select-option>
        </a-select>
      </div>
      <div class="input-box">
        <a-button block @click="attendanceClearSearch">重置</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import req from "@/req/req";
import moment from "moment";
import { roleControlBtnMixin } from "@/mixin";
import { baseUrl } from "@/baseUrl";
import DataTable from '@/components/DataTable'
const {
  queryKqExprt,
  queryClassList, // 获取考勤设置，
  selectCollege, // 查询学院列表
  selectClasses, // 查询专业/班级列表
  selectGrade, // 查询年级列表
  settingAttandence // 考勤设置
} = req;
export default {
  components: {
    DataTable
  },
  name: "Attendance",
  mixins: [roleControlBtnMixin],
  data() {
    return {
      roleName: "考勤分析",

      visibleAttendanceSearch: false, // 塞选弹窗
      visibleAttendance: false, // 塞选弹窗
      weekList: [], //筛选周期
      collegeIdList: "all", // 查询学院id
      proIdList: "all", // 筛选专业id
      gradeIdList: "all", // 筛选年级id
      collegeArrList: [], // 筛选学院列表
      professionArrList: [], // 筛选专业列表
      gradeArrList: [], // 筛选年级列表
      classid: "all", //筛选班级
      classList: [], // 筛选班级列表
      startTime: "00:00", //设置开始时间
      endTime: "00:00", //设置结束时间
      ids: [], //设置id
      columns: [
        {
          title: "班级信息",
          dataIndex: "collegeName",
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
          title: "辅导员信息",
          dataIndex: "name",
          customRender: (text, record, index) => {
            return record.teacherUser == undefined ? "无" : record.teacherUser.name + "  " + record.teacherUser.phone;
          }
        },
        {
          title: "考勤时间",
          dataIndex: "dataTime",
          customRender: (text, record, index) => {
            if (record.startTime) {
              return (
                <div>
                  <span>
                    {record.startTime}~{record.endTime}&nbsp;&nbsp;&nbsp;
                  </span>
                  {record.weekList.map(ele => {
                    return <span>{ele.week}，</span>;
                  })}
                </div>
              );
            } else {
              return <span>未设置</span>;
            }
          }
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
                      this.ids = [];
                      this.weekList = [];
                      this.oneAttendanceSet(
                        record.id,
                        record.weekList,
                        record.startTime,
                        record.endTime
                      );
                      this.setWeek = record.weekList;
                    }}
                  >
                    设置
                  </span>
                ) : (
                  <span style="display: none;" />
                )}

                <span
                  onClick={() => {
                    this.AttendanceDeail(record);
                  }}>
                  考勤详情
                </span>
              </div>
            );
          }
        }
      ],
      selectedRowKeys: []
    };
  },
  created() {
    this.gatCollegeClassList(); // 查询学院列表
    this.gradeList(); // 查询年级列表
  },
  computed: {
    queryObj () {
      return {
        collegeId: this.collegeIdList === "all" ? null : this.collegeIdList, // 学院id
        proId: this.proIdList === "all" ? null : this.proIdList, // 专业id
        grade: this.gradeIdList === "all" ? null : this.gradeIdList, // 年级id
        classId: this.classid === "all" ? null : this.classid // 班级id
      }
    }
  },
  methods: {
    moment,
    exportkq () {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择数据！')
        return
      }
      queryKqExprt(this.selectedRowKeys).then(({data: {msg, code, data}}) => {
        if (code === 0) {
          var elemIF = document.createElement("iframe")
          elemIF.src = baseUrl + '/attandence/exportAttandenceRecordList?ids=' + data
          elemIF.style.display = "none"
          document.body.appendChild(elemIF)
        } else {
          this.$message.warning(msg)
        }
      })
    },
    // 设置开始时间
    onChangeStartTime(time, timeString) {
      this.startTime = timeString;
    },
    // 设置结束时间
    onChangeEndTime(time, timeString) {
      this.endTime = timeString;
    },
    // 点击批量设置
    visibleAttendanceSet() {
      if (this.selectedRowKeys == "") {
        this.$message.warning("请先选择目标！");
        return;
      }
      this.ids = this.selectedRowKeys;
      this.visibleAttendance = true;
    },
    // 点击单项设置
    oneAttendanceSet(id, setWeek, startTime, endTime) {
      if (setWeek) {
        var weekList = this.weekList;
        for (var i = 0; i < setWeek.length; i++) {
          weekList.push(setWeek[i].id);
        }
      }
      if (startTime) {
        this.startTime = startTime;
        this.endTime = endTime;
      } else {
        this.startTime = "00:00";
        this.endTime = "00:00";
      }
      this.ids.push(id);
      this.visibleAttendance = true;
    },
    // 保存设置
    handleAttendanceSetOk() {
      const { weekList, startTime, endTime, ids, $message } = this;
      if (weekList == "") {
        $message.warning("请选择星期！");
        return;
      }
      settingAttandence({
        weekList,
        startTime,
        endTime,
        id: ids
      }).then(({ data: { code, msg } }) => {
        if (code === 0) {
          $message.success(msg);
          this.$refs.table_page.refresh()
        } else {
          $message.error(msg);
        }
        this.visibleAttendance = false;
      });
    },
    //获取考勤设置列表
    getAttendanceList() {
      this.$refs.table_page.getDataTable()
    },
    //重置
    attendanceClearSearch() {
      this.collegeIdList = "all";
      this.proIdList = "all";
      this.gradeIdList = "all";
      this.classid = "all";
      this.professionArrList = [];
      this.classList = [];
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
    // 筛选专业
    seachprofessionList(id) {
      this.proIdList = "all";
      this.professionArrList = [];
      this.gradeIdList == "all";
      selectClasses({
        collegeId: id
      }).then(({ data: { code, msg, data } }) => {
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
    gradeList () {
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
    //查询班级
    seachClass() {
      this.classId == "all";
      this.classList = [];
      selectClasses({
        collegeId: this.collegeIdList,
        professionId: this.proIdList,
        gradeId: this.gradeIdList
      }).then(({ data: { code, msg, data } }) => {
          if (code === 0) {
            this.classList = data.classesList;
          } else {
            this.$message.warning(msg);
          }
        },
        () => {
          this.$message.warning(msg);
        }
      );
    },
    //查询周期
    getweekList(checkedValues) {
      this.weekList = checkedValues;
    },
    //考勤详情
    AttendanceDeail (items) {
      localStorage.setItem("collegeName", items.collegeName);
      localStorage.setItem("professionName", items.professionName);
      localStorage.setItem("gradeName", items.gradeName);
      localStorage.setItem("className", items.className);
      localStorage.setItem("id", items.id);
      this.$router.push({name: 'AttendanceDetails', query: {id: items.id}})
    },
    //筛选
    handleAttendanceOk() {
      this.visibleAttendanceSearch = false;
      this.getAttendanceList();
    }
  }
};
</script>

<style scoped lang="less">
@import '~@/global';

</style>
