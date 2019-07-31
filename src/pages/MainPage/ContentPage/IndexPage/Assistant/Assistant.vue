<template>
  <div class="Assistant">
    <div class="data-thing">
      <div class="helf-box">
        <Askfor :dataArr="askArr"/>
      </div>
      <div class="helf-box">
        <TodayData title="昨日概况" :dataArr="dayArr"/>
      </div>
    </div>
    <div class="data-map">
      <div class="data-map-block">
        <div class="data-map-title">
          <div class="data-map-title-select">
            <a-select size="small" v-model="classIdMap" style="width: 200px" class="input-map-box">
              <a-select-option
                :key="index"
                v-for="(item,index) in grClassArr"
                :value="item.id"
              >{{`20${item.gradeName}级-${item.className}班`}}</a-select-option>
            </a-select>
            <a-date-picker
              :defaultValue="moment(new Date(), 'YYYY-MM-DD')"
              size="small"
              @change="onDateChange"
              format="YYYY/MM/DD"
              class="input-map-box"
            />
          </div>
          <div class="data-map-title-text">
            <span>考勤分析</span>
            <span style="cursor: pointer;" @click="showUnusualModal = !showUnusualModal">异常名单</span>
          </div>
        </div>
        <v-chart :forceFit="true" :height="height" :data="dataDis" :scale="scale">
          <v-tooltip/>
          <v-axis/>
          <v-bar position="date*parsent"/>
        </v-chart>
      </div>
      <div class="data-map-block">
        <CycleMapAsstent/>
      </div>
    </div>

    <Title title="班级概况" borderLeft="5px solid #FFB540" margin="14px 0"/>
    <div class="duo-block" style="flex-wrap: wrap">
      <div class="uers-block" v-for="(item,index) in classList" :key="index">
        <span>{{item.collegeName}}/{{item.majorName}}/{{item.gradeName}}级/{{item.className}}班</span>
        <ul class="uers-block-ul">
          <li>
            <span>{{item.manStuCount}}</span>
            <span>男生人数</span>
          </li>
          <li>
            <span>{{item.womanStuCount}}</span>
            <span>女生人数</span>
          </li>
          <li>
            <span>{{item.dormCount}}</span>
            <span>居住寝室数</span>
          </li>
        </ul>
      </div>
    </div>
    <!-- 异常名单 -->
    <a-modal
      :width="600"
      :title="`异常名单 ${queryDate}`"
      :visible="showUnusualModal"
      :footer="null"
      :maskClosable="false"
      @cancel="showUnusualModal = !showUnusualModal">
      <DataTable ref="table_page" :queryObj="queryObj" :columns="columns" reqType="unusual" :showRowSelection="false"></DataTable>
    </a-modal>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import DataSet from "@antv/data-set";
import moment from "moment";
import Askfor from "../components/Askfor";
import TodayData from "../components/TodayData";
import CycleMapAsstent from "../components/CycleMapAsstent";
import Vue from "vue";
import req from "@/req/req";
const {
  statAuditingInfoByTeacher,
  statProfileInfoByTeacher,
  statClassInfoListByTeacher,
  statAttendanceInfo,
  getGradeClassList
} = req;
const scale = [
  {
    dataKey: "sales",
    tickInterval: 5
  }
];

const dataCycle = [
  {
    gender: "当前人数",
    path:
      "M381.759 0h292l-.64 295.328-100.127-100.096-94.368 94.368C499.808 326.848 512 369.824 512 415.712c0 141.376-114.56 256-256 256-141.376 0-256-114.624-256-256s114.624-256 256-256c48.8 0 94.272 13.92 133.0 37.632l93.376-94.592L381.76 0zM128.032 415.744c0 70.688 57.312 128 128 128s128-57.312 128-128-57.312-128-128-128-128 57.312-128 128z",
    value: 80
  }
];
const scaleCycle = [
  {
    dataKey: "value",
    min: 0,
    max: 100
  }
];
export default {
  name: "Assistant",
  components: {
    Askfor,
    TodayData,
    CycleMapAsstent,
    DataTable
  },
  data() {
    return {
      columns: [
        {
          title: "班级信息",
          customRender: (text, row, index) => {
            const colName = row.colName ? row.colName + '-' : ''
            const proName = row.proName ? row.proName + '-' : ''
            const gradeNum = row.gradeNum ? `20${row.gradeNum}级` : ''
            const className = row.className ? row.className + '班' : ''
            return (colName + proName + gradeNum + className) || '无'
          }
        },
        {
          title: "姓名",
          dataIndex: "studentName"
        },
        {
          title: "学号",
          dataIndex: "studentCode"
        },
        {
          title: "外出时长（h）",
          dataIndex: "outTime"
        },
        {
          title: '状态',
          customRender: (text, row, index) => {
            const num = `低于平均值${(row.avgNum || 0) * 100}%`
            return num
          }
        }
      ],
      spinning: false,
      showUnusualModal: false,
      msg: "Welcome to Your Vue.js App",
      dataDis: [
        { date: "低于平均值25%", parsent: 0 },
        { date: "低于平均值50%", parsent: 0 },
        { date: "低于平均值75%", parsent: 0 }
      ],
      scale,
      height: 400,

      classIdMap: null,
      dateFormat: "YYYY/MM/DD",
      monthFormat: "YYYY/MM",
      askArr: [
        {
          title: `调寝申请`,
          val: 0,
          icon: `icondengdai`,
          iconColor: "#2693FA"
        },
        {
          title: `请假申请`,
          val: 0,
          icon: "iconqingjia1",
          iconColor: "#FFB540"
        }
      ],
      classList: [],
      grClassArr: [],
      dayArr: [
        {
          itemName: "未归人数",
          count: 0,
          icon: "iconriqi",
          iconColor: "#2693FA"
        },
        {
          itemName: "晚归人数",
          count: 0,
          icon: "iconiconzhengli-",
          iconColor: "#FFB540"
        },
        {
          itemName: "违规人数",
          count: 0,
          icon: "iconwinfo-icon-weiguijilu",
          iconColor: "rgb(147,88,210)"
        },
        {
          itemName: "无记录人数",
          count: 0,
          icon: "icon5",
          iconColor: "rgb(90,215,207)"
        }
      ],
      queryDate: moment().format('YYYY-MM-DD')
    };
  },
  computed: {
    queryObj () {
      return {
        queryDate: this.queryDate,
        classId: this.classIdMap
      }
    }
  },
  methods: {
    handleChange(data) {
    },
    onDateChange(date) {
      this.queryDate = moment(date).format("YYYY-MM-DD");
    },
    yesteDay() {
      // 昨日概况
      statProfileInfoByTeacher().then(
        ({
          data: {
            msg,
            data: { noReturnSum, noRecordSum, lateReturnSum, breakRulSum },
            code
          }
        }) => {
          const { dayArr } = this;
          if (code === 0) {
            dayArr[0].count = noReturnSum;
            dayArr[1].count = lateReturnSum;
            dayArr[2].count = breakRulSum;
            dayArr[3].count = noRecordSum;
            this.dayArr = dayArr;
          }
        }
      );
    },
    classStatus() {
      statClassInfoListByTeacher().then(({ data: { msg, code, data } }) => {
        this.classList = data;
      });
    },
    auditingInfo() {
      // 待处理申请
      statAuditingInfoByTeacher().then(
        ({
          data: {
            msg,
            code,
            data: { begOffSum, changeBedSum }
          }
        }) => {
          if (code === 0) {
            this.askArr[0].val = changeBedSum;
            this.askArr[1].val = begOffSum;
          }
        }
      );
    },
    getStatAttendanceInfo() {
      const { classIdMap, queryDate } = this;
      statAttendanceInfo({ queryDate, classId: classIdMap }).then(
        ({ data: { msg, code, data } }) => {
          if (code === 0) {
            let arr = [...this.dataDis]
            arr[2].parsent = data.avgLowerFiveCount;
            arr[1].parsent = data.avgLowerSevenFiveCount;
            arr[0].parsent = data.avgLowerTwoFiveCount;
            this.dataDis = arr
          }
        }
      );
    },
    getClassList() {
      getGradeClassList().then(({ data: { data, msg, code } }) => {
        if (code === 0) {
          this.grClassArr = data;
          if (this.grClassArr.length > 0) {
            this.classIdMap = this.grClassArr[0].id
          }
        }
      });
    },
    moment
  },
  watch: {
    classIdMap() {
      this.getStatAttendanceInfo();
    },
    queryDate() {
      this.getStatAttendanceInfo();
    }
  },
  created() {
    const {
      yesteDay,
      classStatus,
      auditingInfo,
      getStatAttendanceInfo,
      getClassList
    } = this;
    yesteDay();
    classStatus();
    auditingInfo();
    if (this.classIdMap) {
      getStatAttendanceInfo()
    }
    getClassList();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '~@/global';

.data-thing {
  display: flex;
  justify-content: space-around;
  .helf-box {
    width: 49%;
  }
}

.data-map {
  display: flex;
  margin-top: 20px;
  justify-content: space-around;
  height: 500px;
  .data-map-block {
    background-color: #ffffff;
    padding: 15px 20px;
    width: 49%;
    .border-set;
    .data-map-title {
      display: flex;
      align-items: center;
      .data-map-title-select {
        flex: 3;
        display: flex;
        .input-map-box {
          margin-right: 10px;
        }
      }
      .data-map-title-text {
        flex: 4;
        display: flex;
        justify-content: space-between;
        span {
          &:nth-of-type(2) {
            font-size: 14px;
          }
        }
      }
    }
  }
}

.set-border {
  border-radius: 12px;
}
.box-shadowSet {
  box-shadow: 0px 0px 20px rgb(228, 228, 228);
}
.duo-block {
  flex-grow: 1;
  display: flex;
  .set-border;
  .uers-block {
    .box-shadowSet;
    .tb-flex-between;
    width: 24%;
    background-color: #fff;
    color: @styleColor;
    font-size: 12px;
    box-sizing: border-box;
    padding: 13px 10px;
    margin-right: 10px;
    margin-bottom: 10px;
    & > span {
      font-weight: bold;
    }
    .set-border;
    .uers-block-ul {
      display: flex;
      text-align: center;
      justify-content: space-around;
      color: #424242;
      li {
        display: flex;
        flex-direction: column;
        span {
          padding: 15px 0;
          &:nth-of-type(1) {
            font-size: 16px;
          }
        }
      }
    }
  }
  .student-block {
    .box-shadowSet;
    .tb-flex-between;
    .set-border;
    margin-left: 24px;
    flex: 1;
    background-color: #fff;
    color: #424242;
    font-size: 12px;
    box-sizing: border-box;
    padding: 13px 10px;
    & > span {
      font-weight: bold;
      color: @styleColor;
    }
    .student-block-ul {
      display: flex;
      text-align: center;
      flex-direction: column;
      li {
        display: flex;
        width: 80%;
        justify-content: space-between;
        padding: 0 0 25px 0;
        &:nth-of-type(1) {
          span {
            &:nth-of-type(1) {
              &::before {
                background-color: @styleColor;
              }
            }
          }
        }
        &:nth-of-type(2) {
          span {
            &:nth-of-type(1) {
              &::before {
                background-color: @closeColor;
              }
            }
          }
        }
        &:nth-of-type(3) {
          span {
            &:nth-of-type(1) {
              &::before {
                background-color: #00dfab;
              }
            }
          }
        }
        span {
          &:nth-of-type(1) {
            display: flex;
            align-items: center;
            &::before {
              content: " ";
              display: inline-block;
              width: 8px;
              height: 8px;
              border-radius: 50%;
              margin-right: 5px;
            }
          }
        }
      }
    }
  }
}
</style>
